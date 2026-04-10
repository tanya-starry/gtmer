// Skill System Types

export type SkillCategory = 
  | 'content'      // 内容生成
  | 'analysis'     // 数据分析
  | 'research'     // 研究调研
  | 'communication' // 沟通协作
  | 'automation'   // 自动化
  | 'integration'; // 集成连接

export type SkillImplementationType = 'prompt' | 'code' | 'workflow' | 'api';

export type SkillStatus = 'active' | 'beta' | 'deprecated' | 'draft';

// JSON Schema for input/output validation
export interface JSONSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean';
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema;
  required?: string[];
  enum?: (string | number)[];
  description?: string;
  default?: any;
}

// Few-shot example for prompt skills
export interface FewShotExample {
  input: Record<string, any>;
  output: string;
  description?: string;
}

// Prompt Template Skill Configuration
export interface PromptSkillConfig {
  type: 'prompt';
  template: string;
  systemPrompt?: string;
  variables: string[];
  examples?: FewShotExample[];
  constraints?: string[];
  outputFormat?: 'markdown' | 'json' | 'text';
}

// Code Function Skill Configuration
export interface CodeSkillConfig {
  type: 'code';
  language: 'javascript' | 'python' | 'typescript';
  entryPoint: string;
  code: string;
  dependencies?: string[];
}

// Workflow Node
export interface WorkflowNode {
  id: string;
  type: 'start' | 'skill' | 'condition' | 'parallel' | 'end';
  skillId?: string;
  config?: Record<string, any>;
  condition?: string;
}

// Workflow Edge
export interface WorkflowEdge {
  from: string;
  to: string;
  label?: string;
  condition?: string;
}

// Workflow Skill Configuration
export interface WorkflowSkillConfig {
  type: 'workflow';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// API Skill Configuration
export interface APISkillConfig {
  type: 'api';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  auth?: {
    type: 'none' | 'bearer' | 'basic' | 'apikey';
    config?: Record<string, string>;
  };
  requestMapping?: Record<string, string>;
  responseMapping?: Record<string, string>;
}

// Union type for all skill configs
export type SkillImplementationConfig = 
  | PromptSkillConfig 
  | CodeSkillConfig 
  | WorkflowSkillConfig 
  | APISkillConfig;

// Skill Definition
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  version: string;
  status: SkillStatus;
  
  // Input/Output schemas
  inputSchema: JSONSchema;
  outputSchema?: JSONSchema;
  
  // Implementation
  implementation: SkillImplementationConfig;
  
  // Dependencies on other skills
  dependencies?: string[];
  
  // Model requirements
  modelRequirements?: {
    minCapabilities?: string[];
    preferredModel?: string;
    minContextLength?: number;
  };
  
  // Metadata
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    usageCount: number;
    rating: number;
    tags: string[];
    icon?: string;
  };
}

// Skill Execution Context
export interface SkillExecutionContext {
  skillId: string;
  input: Record<string, any>;
  modelConfig?: {
    provider: string;
    model: string;
    parameters: Record<string, any>;
  };
  knowledgeBases?: string[];
  memory?: {
    shortTerm?: any[];
    longTerm?: Record<string, any>;
  };
  tools?: string[];
  userId?: string;
  sessionId?: string;
}

// Skill Execution Result
export interface SkillExecutionResult {
  success: boolean;
  output?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    skillId: string;
    executionTime: number;
    tokensUsed?: {
      input: number;
      output: number;
    };
    cost?: number;
    modelUsed?: string;
    timestamp: string;
  };
}

// Skill Registry Entry
export interface SkillRegistryEntry extends Skill {
  instance?: any; // For code skills, the compiled function
}

// Skill Filter Options
export interface SkillFilterOptions {
  category?: SkillCategory;
  status?: SkillStatus;
  search?: string;
  tags?: string[];
}

// Skill Template for creating new skills
export interface SkillTemplate {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  baseSkill: Partial<Skill>;
  customizableFields: string[];
}
