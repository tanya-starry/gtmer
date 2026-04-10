import type { 
  SkillExecutionContext, 
  SkillExecutionResult, 
  PromptSkillConfig,
  CodeSkillConfig,
  WorkflowSkillConfig,
  APISkillConfig,
  Skill
} from './types';
import { skillRegistry } from './registry';

// Skill Executor
export class SkillExecutor {
  private modelProvider: ModelProvider;

  constructor(modelProvider: ModelProvider) {
    this.modelProvider = modelProvider;
  }

  // Execute a skill
  async execute(context: SkillExecutionContext): Promise<SkillExecutionResult> {
    const startTime = Date.now();
    const { skillId, input } = context;

    try {
      // Get skill from registry
      const skill = skillRegistry.get(skillId);
      if (!skill) {
        return this.createErrorResult(skillId, startTime, 'SKILL_NOT_FOUND', `Skill not found: ${skillId}`);
      }

      // Validate input
      const validation = skillRegistry.validateInput(skillId, input);
      if (!validation.valid) {
        return this.createErrorResult(skillId, startTime, 'INVALID_INPUT', validation.errors!.join(', '));
      }

      // Execute based on implementation type
      const { implementation } = skill;
      let result: any;

      switch (implementation.type) {
        case 'prompt':
          result = await this.executePromptSkill(skill, implementation as PromptSkillConfig, context);
          break;
        case 'code':
          result = await this.executeCodeSkill(skill, implementation as CodeSkillConfig, context);
          break;
        case 'workflow':
          result = await this.executeWorkflowSkill(skill, implementation as WorkflowSkillConfig, context);
          break;
        case 'api':
          result = await this.executeAPISkill(skill, implementation as APISkillConfig, context);
          break;
        default:
          return this.createErrorResult(skillId, startTime, 'UNKNOWN_IMPLEMENTATION', `Unknown implementation type: ${(implementation as any).type}`);
      }

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        output: result,
        metadata: {
          skillId,
          executionTime,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      return this.createErrorResult(
        skillId, 
        startTime, 
        'EXECUTION_ERROR', 
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  // Execute Prompt Template Skill
  private async executePromptSkill(
    _skill: Skill, 
    config: PromptSkillConfig, 
    context: SkillExecutionContext
  ): Promise<any> {
    // Render template with input variables
    const userPrompt = skillRegistry.renderPromptTemplate(config.template, context.input);
    
    // Build messages
    const messages: Message[] = [];
    
    // Add system prompt if exists
    if (config.systemPrompt) {
      messages.push({
        role: 'system',
        content: config.systemPrompt
      });
    }

    // Add few-shot examples if exists
    if (config.examples && config.examples.length > 0) {
      for (const example of config.examples) {
        messages.push({
          role: 'user',
          content: skillRegistry.renderPromptTemplate(
            JSON.stringify(example.input), 
            example.input
          )
        });
        messages.push({
          role: 'assistant',
          content: example.output
        });
      }
    }

    // Add user message
    messages.push({
      role: 'user',
      content: userPrompt
    });

    // Call model
    const modelConfig = context.modelConfig || {
      provider: 'openai',
      model: 'gpt-4',
      parameters: { temperature: 0.7, maxTokens: 4000 }
    };

    const response = await this.modelProvider.chat(messages, modelConfig);

    // Parse output based on format
    if (config.outputFormat === 'json') {
      try {
        return JSON.parse(response.content);
      } catch {
        // If JSON parsing fails, return as text
        return { text: response.content, parseError: true };
      }
    }

    return response.content;
  }

  // Execute Code Skill
  private async executeCodeSkill(
    _skill: Skill,
    _config: CodeSkillConfig,
    context: SkillExecutionContext
  ): Promise<any> {
    const skillEntry = skillRegistry.get(context.skillId);
    
    if (!skillEntry?.instance) {
      throw new Error(`Code skill not compiled: ${context.skillId}`);
    }

    // Execute the compiled function
    const result = await skillEntry.instance(context.input, {
      userId: context.userId,
      sessionId: context.sessionId,
      memory: context.memory
    });

    return result;
  }

  // Execute Workflow Skill
  private async executeWorkflowSkill(
    _skill: Skill,
    config: WorkflowSkillConfig,
    context: SkillExecutionContext
  ): Promise<any> {
    const { nodes, edges } = config;
    
    // Build adjacency list
    const graph = this.buildWorkflowGraph(nodes, edges);
    
    // Find start node
    const startNode = nodes.find(n => n.type === 'start');
    if (!startNode) {
      throw new Error('Workflow must have a start node');
    }

    // Execute workflow
    const results: Record<string, any> = {};
    let currentNodeId = startNode.id;
    const visited = new Set<string>();

    while (currentNodeId && !visited.has(currentNodeId)) {
      visited.add(currentNodeId);
      const node = nodes.find(n => n.id === currentNodeId);
      
      if (!node) break;

      // Execute node
      if (node.type === 'skill' && node.skillId) {
        const subContext: SkillExecutionContext = {
          ...context,
          skillId: node.skillId,
          input: { ...context.input, ...results }
        };
        
        const result = await this.execute(subContext);
        if (result.success) {
          results[currentNodeId] = result.output;
        } else {
          throw new Error(`Workflow node failed: ${result.error?.message}`);
        }
      }

      // Find next node
      const nextEdges = graph.get(currentNodeId) || [];
      if (nextEdges.length > 0) {
        // For simplicity, take the first edge (could add condition evaluation here)
        currentNodeId = nextEdges[0].to;
      } else {
        currentNodeId = '';
      }
    }

    return results;
  }

  // Execute API Skill
  private async executeAPISkill(
    _skill: Skill,
    config: APISkillConfig,
    context: SkillExecutionContext
  ): Promise<any> {
    const { endpoint, method, headers = {}, auth, requestMapping, responseMapping } = config;

    // Build request body
    let body: any = {};
    if (requestMapping) {
      for (const [apiKey, inputKey] of Object.entries(requestMapping)) {
        body[apiKey] = context.input[inputKey];
      }
    } else {
      body = context.input;
    }

    // Build headers with auth
    const requestHeaders: Record<string, string> = { ...headers };
    if (auth) {
      switch (auth.type) {
        case 'bearer':
          requestHeaders['Authorization'] = `Bearer ${auth.config?.token}`;
          break;
        case 'apikey':
          requestHeaders[auth.config?.headerName || 'X-API-Key'] = auth.config?.key || '';
          break;
        case 'basic':
          const credentials = btoa(`${auth.config?.username}:${auth.config?.password}`);
          requestHeaders['Authorization'] = `Basic ${credentials}`;
          break;
      }
    }

    // Make request
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...requestHeaders
      },
      body: method !== 'GET' ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Map response if needed
    if (responseMapping) {
      const mapped: Record<string, any> = {};
      for (const [outputKey, responseKey] of Object.entries(responseMapping)) {
        mapped[outputKey] = this.getNestedValue(data, responseKey);
      }
      return mapped;
    }

    return data;
  }

  // Build workflow graph
  private buildWorkflowGraph(_nodes: any[], edges: any[]): Map<string, any[]> {
    const graph = new Map<string, any[]>();
    
    for (const edge of edges) {
      if (!graph.has(edge.from)) {
        graph.set(edge.from, []);
      }
      graph.get(edge.from)!.push(edge);
    }

    return graph;
  }

  // Get nested object value
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

  // Create error result
  private createErrorResult(
    skillId: string, 
    startTime: number, 
    code: string, 
    message: string
  ): SkillExecutionResult {
    return {
      success: false,
      error: { code, message },
      metadata: {
        skillId,
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Model Provider Interface
export interface ModelProvider {
  chat(messages: Message[], config: any): Promise<ModelResponse>;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ModelResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

// Mock Model Provider for development
export class MockModelProvider implements ModelProvider {
  async chat(messages: Message[], _config: any): Promise<ModelResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lastMessage = messages[messages.length - 1];
    
    return {
      content: `【模拟响应】我已收到您的请求："${lastMessage.content.slice(0, 50)}..."\n\n这是一个模拟的AI响应，用于开发和测试。在实际环境中，这里会返回真实的AI生成内容。`,
      usage: {
        inputTokens: lastMessage.content.length,
        outputTokens: 100
      }
    };
  }
}

// Export singleton executor with mock provider
export const skillExecutor = new SkillExecutor(new MockModelProvider());
