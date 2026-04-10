# AI Agent 配置系统设计方案

## 1. 系统架构概览

```
┌─────────────────────────────────────────────────────────────────┐
│                     Agent Configuration Layer                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Skills    │  │   Models    │  │  Knowledge  │  │  Output │ │
│  │   (技能)     │  │   (模型)    │  │   (知识库)   │  │ (输出)  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Triggers   │  │   Memory    │  │  Tools/API  │              │
│  │  (触发器)   │  │   (记忆)    │  │  (工具接口)  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Skill（技能）系统设计

### 2.1 Skill 定义

Skill 是 Agent 的能力单元，每个 Skill 封装特定的功能：

```typescript
interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  version: string;
  
  // 输入输出定义
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  
  // 实现方式
  implementation: {
    type: 'prompt' | 'code' | 'workflow' | 'api';
    config: SkillImplementationConfig;
  };
  
  // 依赖的其他skills
  dependencies?: string[];
  
  // 元数据
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    usageCount: number;
    rating: number;
  };
}

type SkillCategory = 
  | 'content'      // 内容生成
  | 'analysis'     // 数据分析
  | 'research'     // 研究调研
  | 'communication' // 沟通协作
  | 'automation'   // 自动化
  | 'integration'; // 集成连接
```

### 2.2 内置 Skill 清单

| Skill ID | 名称 | 描述 | 输入 | 输出 |
|---------|------|------|------|------|
| `sop_writer` | SOP撰写 | 生成标准操作程序文档 | 主题、流程描述、格式要求 | Markdown文档 |
| `ppt_generator` | PPT生成 | 创建演示文稿 | 数据源、模板、页数 | PPT文件/JSON |
| `content_batch` | 批量图文 | 批量生成社交媒体内容 | 主题、数量、平台 | 图文数组 |
| `data_analyzer` | 数据分析 | 分析业务数据 | 数据集、分析维度 | 分析报告 |
| `email_writer` | 邮件撰写 | 生成商务邮件 | 场景、收件人、要点 | 邮件正文 |
| `meeting_summary` | 会议总结 | 总结会议纪要 | 录音/文字记录 | 摘要、待办 |
| `competitor_research` | 竞品调研 | 分析竞争对手 | 竞品名称、维度 | 调研报告 |
| `customer_profile` | 客户画像 | 生成客户画像 | 客户数据 | 画像文档 |
| `proposal_writer` | 方案撰写 | 生成商业提案 | 需求、预算、周期 | 提案文档 |
| `qa_generator` | QA生成 | 生成问答对 | 文档、问题数量 | QA列表 |

### 2.3 Skill 实现方式

#### 方式1: Prompt Template（提示词模板）

```typescript
interface PromptSkillConfig {
  type: 'prompt';
  template: string;
  variables: string[];
  examples: FewShotExample[];
  constraints: string[];
}

// 示例：SOP撰写 Skill
const sopWriterSkill: PromptSkillConfig = {
  type: 'prompt',
  template: `
你是一位专业的SOP文档撰写专家。请根据以下信息生成标准操作程序文档：

## 任务信息
主题：{{topic}}
适用部门：{{department}}
详细描述：{{description}}

## 输出要求
1. 使用标准SOP格式
2. 包含目的、适用范围、职责、流程步骤
3. 使用Markdown格式
4. 流程步骤需要编号和检查点

## 输出格式

# {{topic}} SOP

## 1. 目的
...

## 2. 适用范围
...

## 3. 职责
...

## 4. 流程步骤
...

## 5. 相关文档
...

## 6. 版本记录
...
`,
  variables: ['topic', 'department', 'description'],
  examples: [
    {
      input: { topic: '客户onboarding', department: '客户成功' },
      output: '...示例输出...'
    }
  ],
  constraints: [
    '步骤必须可执行',
    '使用清晰的编号',
    '包含必要的检查点'
  ]
};
```

#### 方式2: Code Function（代码函数）

```typescript
interface CodeSkillConfig {
  type: 'code';
  language: 'javascript' | 'python';
  entryPoint: string;
  code: string;
  dependencies: string[];
}

// 示例：数据分析 Skill
const dataAnalyzerSkill: CodeSkillConfig = {
  type: 'code',
  language: 'javascript',
  entryPoint: 'analyze',
  code: `
async function analyze(input) {
  const { data, dimensions } = input;
  
  // 数据清洗
  const cleanedData = cleanData(data);
  
  // 统计分析
  const stats = calculateStats(cleanedData, dimensions);
  
  // 趋势分析
  const trends = analyzeTrends(cleanedData);
  
  // 生成洞察
  const insights = generateInsights(stats, trends);
  
  return {
    summary: generateSummary(stats),
    charts: generateChartData(stats),
    insights,
    recommendations: generateRecommendations(insights)
  };
}
  `,
  dependencies: ['lodash', 'simple-statistics']
};
```

#### 方式3: Workflow（工作流）

```typescript
interface WorkflowSkillConfig {
  type: 'workflow';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

interface WorkflowNode {
  id: string;
  type: 'start' | 'skill' | 'condition' | 'parallel' | 'end';
  skillId?: string;
  config?: Record<string, any>;
}

// 示例：内容营销工作流
const contentMarketingWorkflow: WorkflowSkillConfig = {
  type: 'workflow',
  nodes: [
    { id: 'start', type: 'start' },
    { id: 'research', type: 'skill', skillId: 'topic_research' },
    { id: 'write', type: 'skill', skillId: 'article_writer' },
    { id: 'review', type: 'skill', skillId: 'content_review' },
    { 
      id: 'check', 
      type: 'condition',
      config: { condition: 'score > 80' }
    },
    { id: 'generate_social', type: 'skill', skillId: 'social_media_adapter' },
    { id: 'end', type: 'end' }
  ],
  edges: [
    { from: 'start', to: 'research' },
    { from: 'research', to: 'write' },
    { from: 'write', to: 'review' },
    { from: 'review', to: 'check' },
    { from: 'check', to: 'generate_social', label: 'pass' },
    { from: 'check', to: 'write', label: 'fail' },
    { from: 'generate_social', to: 'end' }
  ]
};
```

### 2.4 Skill 组合与继承

```typescript
interface SkillComposition {
  // 组合多个skills形成新skill
  compose(skills: string[]): Skill;
  
  // Skill继承
  extend(baseSkill: string, overrides: Partial<Skill>): Skill;
}

// 示例：组合Skill
const marketingKit = composeSkills([
  'content_writer',
  'seo_optimizer',
  'social_media_adapter',
  'email_formatter'
]);
```

## 3. 模型配置系统设计

### 3.1 模型定义

```typescript
interface ModelConfig {
  id: string;
  provider: ModelProvider;
  model: string;
  version?: string;
  
  // 模型参数
  parameters: ModelParameters;
  
  // 能力声明
  capabilities: ModelCapability[];
  
  // 成本配置
  pricing: {
    inputPrice: number;  // per 1K tokens
    outputPrice: number; // per 1K tokens
    currency: string;
  };
  
  // 限制
  limits: {
    maxTokens: number;
    maxInputTokens: number;
    rpm: number; // requests per minute
    tpm: number; // tokens per minute
  };
}

type ModelProvider = 
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'azure'
  | 'local'
  | 'custom';

interface ModelParameters {
  temperature: number;      // 0-2, 默认0.7
  topP: number;            // 0-1, 默认1
  topK?: number;           // 可选
  maxTokens: number;       // 最大输出长度
  presencePenalty: number; // -2 to 2
  frequencyPenalty: number; // -2 to 2
  stopSequences?: string[]; // 停止序列
  seed?: number;           // 随机种子
}

type ModelCapability = 
  | 'chat'
  | 'completion'
  | 'function_calling'
  | 'json_mode'
  | 'vision'
  | 'code'
  | 'long_context'
  | 'multilingual'
  | 'reasoning';
```

### 3.2 预设模型配置

| 配置名称 | 适用场景 | 模型 | 参数 |
|---------|---------|------|------|
| `creative` | 创意写作、头脑风暴 | GPT-4 | temp: 0.9, topP: 0.95 |
| `balanced` | 通用任务 | GPT-4 | temp: 0.7, topP: 1 |
| `precise` | 精确输出、代码 | GPT-4 | temp: 0.2, topP: 0.9 |
| `fast` | 快速响应 | GPT-3.5 | temp: 0.5 |
| `economic` | 低成本批量 | GPT-3.5 | temp: 0.7 |
| `coding` | 代码生成 | Claude-3-Opus | temp: 0.2 |
| `analysis` | 数据分析 | GPT-4-Turbo | temp: 0.3 |
| `multilingual` | 多语言任务 | GPT-4 | temp: 0.7 |

### 3.3 模型选择策略

```typescript
interface ModelSelectionStrategy {
  // 基于任务特征自动选择模型
  selectModel(task: TaskContext): ModelConfig;
  
  // 路由策略
  routing: {
    type: 'single' | 'fallback' | 'ensemble' | 'smart';
    config: RoutingConfig;
  };
}

interface TaskContext {
  skillId: string;
  inputLength: number;
  expectedOutputLength: number;
  complexity: 'low' | 'medium' | 'high';
  latency: 'low' | 'medium' | 'high';
  cost: 'low' | 'medium' | 'high';
  requires: ModelCapability[];
}

// 智能路由示例
const smartRouting: ModelSelectionStrategy = {
  selectModel: (task) => {
    // 简单任务 -> 快速模型
    if (task.complexity === 'low' && task.latency === 'low') {
      return models['gpt-3.5-turbo-fast'];
    }
    
    // 代码任务 -> 代码专用模型
    if (task.requires.includes('code')) {
      return models['claude-3-opus-coding'];
    }
    
    // 长文本 -> 长上下文模型
    if (task.inputLength > 8000) {
      return models['gpt-4-turbo-128k'];
    }
    
    // 默认
    return models['gpt-4-balanced'];
  },
  routing: {
    type: 'smart',
    config: {
      fallbackOnError: true,
      retryWithLargerModel: true,
      costOptimization: true
    }
  }
};
```

### 3.4 模型配置界面

```typescript
interface ModelConfigUI {
  // 快速选择
  presets: ModelPreset[];
  
  // 高级配置
  advanced: {
    temperature: SliderControl;
    maxTokens: NumberInput;
    topP: SliderControl;
    presencePenalty: SliderControl;
    frequencyPenalty: SliderControl;
  };
  
  // 实时预览
  preview: {
    estimatedCost: number;
    estimatedLatency: number;
    tokenCount: number;
  };
}
```

## 4. 知识库关联配置

```typescript
interface KnowledgeConfig {
  // 关联的知识库
  knowledgeBases: {
    id: string;
    name: string;
    relevance: number; // 0-1, 关联度权重
  }[];
  
  // 检索配置
  retrieval: {
    strategy: 'semantic' | 'keyword' | 'hybrid';
    topK: number;
    threshold: number;
    rerank: boolean;
  };
  
  // 上下文处理
  contextProcessing: {
    maxChunks: number;
    chunkSize: number;
    overlap: number;
    injectPosition: 'system' | 'user';
  };
}

// 示例配置
const knowledgeConfig: KnowledgeConfig = {
  knowledgeBases: [
    { id: 'product-docs', name: '产品文档', relevance: 0.9 },
    { id: 'sales-playbook', name: '销售手册', relevance: 0.8 },
    { id: 'customer-faq', name: '客户FAQ', relevance: 0.7 }
  ],
  retrieval: {
    strategy: 'hybrid',
    topK: 5,
    threshold: 0.7,
    rerank: true
  },
  contextProcessing: {
    maxChunks: 10,
    chunkSize: 500,
    overlap: 50,
    injectPosition: 'system'
  }
};
```

## 5. 输出格式配置

```typescript
interface OutputConfig {
  // 输出格式
  format: 'markdown' | 'json' | 'html' | 'plain' | 'structured';
  
  // 结构化输出schema（当format为structured或json时）
  schema?: JSONSchema;
  
  // 模板
  template?: string;
  
  // 后处理
  postProcessing: {
    trimWhitespace: boolean;
    removeMarkdown: boolean;
    extractCode: boolean;
    summarize: boolean;
  };
  
  // 验证
  validation: {
    required: string[];
    constraints: ValidationConstraint[];
  };
}

// SOP输出配置示例
const sopOutputConfig: OutputConfig = {
  format: 'structured',
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      purpose: { type: 'string' },
      scope: { type: 'string' },
      responsibilities: { type: 'array', items: { type: 'string' } },
      procedures: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            step: { type: 'number' },
            action: { type: 'string' },
            responsible: { type: 'string' },
            checklist: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      relatedDocs: { type: 'array', items: { type: 'string' } },
      version: { type: 'string' }
    },
    required: ['title', 'purpose', 'procedures']
  },
  postProcessing: {
    trimWhitespace: true,
    removeMarkdown: false,
    extractCode: false,
    summarize: false
  },
  validation: {
    required: ['title', 'purpose', 'procedures'],
    constraints: [
      { field: 'procedures', min: 3, message: '至少需要3个步骤' }
    ]
  }
};
```

## 6. 记忆与上下文配置

```typescript
interface MemoryConfig {
  // 短期记忆（对话上下文）
  shortTerm: {
    enabled: boolean;
    maxMessages: number;
    maxTokens: number;
    summarization: {
      enabled: boolean;
      triggerTokens: number;
      strategy: 'simple' | 'hierarchical';
    };
  };
  
  // 长期记忆（跨会话）
  longTerm: {
    enabled: boolean;
    storage: 'vector_db' | 'graph_db' | 'hybrid';
    entities: string[]; // 需要记忆的实体类型
    events: string[];   // 需要记忆的事件类型
  };
  
  // 工作记忆（当前任务）
  working: {
    enabled: boolean;
    variables: string[];
    persistence: 'session' | 'task' | 'permanent';
  };
}

// 示例：销售Agent记忆配置
const salesMemoryConfig: MemoryConfig = {
  shortTerm: {
    enabled: true,
    maxMessages: 20,
    maxTokens: 4000,
    summarization: {
      enabled: true,
      triggerTokens: 3000,
      strategy: 'hierarchical'
    }
  },
  longTerm: {
    enabled: true,
    storage: 'hybrid',
    entities: ['customer', 'product', 'deal', 'competitor'],
    events: ['meeting', 'proposal', 'negotiation', 'close']
  },
  working: {
    enabled: true,
    variables: ['current_stage', 'deal_value', 'decision_makers'],
    persistence: 'task'
  }
};
```

## 7. 工具与API配置

```typescript
interface ToolConfig {
  // 可用工具列表
  tools: {
    id: string;
    name: string;
    description: string;
    parameters: JSONSchema;
    handler: string; // 工具处理函数引用
  }[];
  
  // 工具调用策略
  toolCalling: {
    mode: 'auto' | 'manual' | 'hybrid';
    confirmationRequired: string[]; // 需要确认的工具
    maxIterations: number;
    timeout: number;
  };
  
  // 外部API
  externalAPIs: {
    name: string;
    endpoint: string;
    auth: APIAuthConfig;
    rateLimit: RateLimitConfig;
  }[];
}

// 示例工具配置
const gtmTools: ToolConfig = {
  tools: [
    {
      id: 'search_knowledge',
      name: '搜索知识库',
      description: '在知识库中搜索相关信息',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          category: { type: 'string' },
          limit: { type: 'number', default: 5 }
        },
        required: ['query']
      },
      handler: 'knowledgeBase.search'
    },
    {
      id: 'send_email',
      name: '发送邮件',
      description: '发送邮件给客户',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'string' },
          subject: { type: 'string' },
          body: { type: 'string' },
          attachments: { type: 'array', items: { type: 'string' } }
        },
        required: ['to', 'subject', 'body']
      },
      handler: 'email.send'
    },
    {
      id: 'create_task',
      name: '创建任务',
      description: '在项目管理工具中创建任务',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          assignee: { type: 'string' },
          dueDate: { type: 'string' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] }
        },
        required: ['title']
      },
      handler: 'task.create'
    },
    {
      id: 'query_crm',
      name: '查询CRM',
      description: '查询客户信息',
      parameters: {
        type: 'object',
        properties: {
          customerId: { type: 'string' },
          fields: { type: 'array', items: { type: 'string' } }
        },
        required: ['customerId']
      },
      handler: 'crm.query'
    }
  ],
  toolCalling: {
    mode: 'hybrid',
    confirmationRequired: ['send_email', 'create_task'],
    maxIterations: 5,
    timeout: 30000
  },
  externalAPIs: [
    {
      name: 'salesforce',
      endpoint: 'https://api.salesforce.com',
      auth: { type: 'oauth2' },
      rateLimit: { requests: 100, window: 60 }
    }
  ]
};
```

## 8. 触发器配置

```typescript
interface TriggerConfig {
  triggers: {
    id: string;
    type: TriggerType;
    config: TriggerSpecificConfig;
    actions: string[]; // 触发的Skill IDs
    enabled: boolean;
    cooldown: number; // 冷却时间（秒）
  }[];
}

type TriggerType = 
  | 'schedule'      // 定时触发
  | 'event'         // 事件触发
  | 'webhook'       // Webhook触发
  | 'email'         // 邮件触发
  | 'manual'        // 手动触发
  | 'condition';    // 条件触发

// 定时触发配置
interface ScheduleTrigger {
  type: 'schedule';
  cron: string; // cron表达式
  timezone: string;
}

// 事件触发配置
interface EventTrigger {
  type: 'event';
  event: string; // 事件名称
  filter?: Record<string, any>; // 事件过滤条件
}

// 条件触发配置
interface ConditionTrigger {
  type: 'condition';
  condition: string; // 条件表达式
  checkInterval: number; // 检查间隔（秒）
}

// 示例：自动报告Agent触发器
const reportTriggerConfig: TriggerConfig = {
  triggers: [
    {
      id: 'weekly_report',
      type: 'schedule',
      config: {
        type: 'schedule',
        cron: '0 9 * * MON', // 每周一上午9点
        timezone: 'Asia/Shanghai'
      },
      actions: ['weekly_report_generator'],
      enabled: true,
      cooldown: 86400
    },
    {
      id: 'deal_won',
      type: 'event',
      config: {
        type: 'event',
        event: 'deal.won',
        filter: { value: { $gt: 100000 } }
      },
      actions: ['celebration_email', 'slack_notification'],
      enabled: true,
      cooldown: 0
    },
    {
      id: 'low_pipeline',
      type: 'condition',
      config: {
        type: 'condition',
        condition: 'pipeline.value < 1000000',
        checkInterval: 3600
      },
      actions: ['pipeline_alert'],
      enabled: true,
      cooldown: 86400
    }
  ]
};
```

## 9. 完整Agent配置示例

```typescript
interface AgentConfiguration {
  // 基础信息
  id: string;
  name: string;
  description: string;
  avatar?: string;
  
  // 核心配置
  skills: string[]; // Skill IDs
  model: ModelConfig;
  knowledge?: KnowledgeConfig;
  output?: OutputConfig;
  memory?: MemoryConfig;
  tools?: ToolConfig;
  triggers?: TriggerConfig;
  
  // 行为配置
  behavior: {
    greeting?: string;
    tone: 'professional' | 'friendly' | 'casual' | 'formal';
    language: string;
    maxResponseLength: number;
    allowClarification: boolean;
    showThinking: boolean;
  };
  
  // 安全与限制
  safety: {
    contentFilter: boolean;
    maxCostPerRequest: number;
    allowedDomains: string[];
    blockedKeywords: string[];
  };
  
  // 元数据
  metadata: {
    version: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    usageCount: number;
  };
}

// SOP撰写Agent完整配置
const sopWriterAgent: AgentConfiguration = {
  id: 'sop-writer-v1',
  name: 'SOP撰写助手',
  description: '专业的标准操作程序文档撰写Agent',
  avatar: '/avatars/sop-writer.png',
  
  skills: ['sop_writer', 'process_analyzer', 'format_validator'],
  
  model: {
    provider: 'openai',
    model: 'gpt-4',
    parameters: {
      temperature: 0.5,
      topP: 0.9,
      maxTokens: 4000,
      presencePenalty: 0,
      frequencyPenalty: 0
    },
    capabilities: ['chat', 'json_mode', 'long_context'],
    pricing: { inputPrice: 0.03, outputPrice: 0.06, currency: 'USD' },
    limits: { maxTokens: 8192, maxInputTokens: 8000, rpm: 500, tpm: 10000 }
  },
  
  knowledge: {
    knowledgeBases: [
      { id: 'sop-templates', name: 'SOP模板库', relevance: 0.95 },
      { id: 'company-policies', name: '公司政策', relevance: 0.8 }
    ],
    retrieval: {
      strategy: 'hybrid',
      topK: 3,
      threshold: 0.75,
      rerank: true
    },
    contextProcessing: {
      maxChunks: 5,
      chunkSize: 800,
      overlap: 100,
      injectPosition: 'system'
    }
  },
  
  output: {
    format: 'structured',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        version: { type: 'string' },
        purpose: { type: 'string' },
        scope: { type: 'string' },
        responsibilities: { type: 'array', items: { type: 'string' } },
        procedures: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              step: { type: 'number' },
              title: { type: 'string' },
              description: { type: 'string' },
              responsible: { type: 'string' },
              checklist: { type: 'array', items: { type: 'string' } },
              estimatedTime: { type: 'string' }
            }
          }
        },
        relatedDocuments: { type: 'array', items: { type: 'string' } },
        revisionHistory: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              version: { type: 'string' },
              date: { type: 'string' },
              author: { type: 'string' },
              changes: { type: 'string' }
            }
          }
        }
      },
      required: ['title', 'purpose', 'procedures']
    },
    postProcessing: {
      trimWhitespace: true,
      removeMarkdown: false,
      extractCode: false,
      summarize: false
    },
    validation: {
      required: ['title', 'purpose', 'procedures'],
      constraints: [
        { field: 'procedures', min: 3, message: '至少需要3个步骤' }
      ]
    }
  },
  
  memory: {
    shortTerm: {
      enabled: true,
      maxMessages: 10,
      maxTokens: 3000,
      summarization: {
        enabled: true,
        triggerTokens: 2500,
        strategy: 'simple'
      }
    },
    longTerm: {
      enabled: true,
      storage: 'vector_db',
      entities: ['department', 'process', 'role'],
      events: ['sop_created', 'sop_updated']
    },
    working: {
      enabled: true,
      variables: ['current_section', 'department', 'process_type'],
      persistence: 'task'
    }
  },
  
  tools: {
    tools: [
      {
        id: 'search_templates',
        name: '搜索模板',
        description: '搜索SOP模板',
        parameters: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            department: { type: 'string' }
          }
        },
        handler: 'knowledge.searchTemplates'
      },
      {
        id: 'validate_sop',
        name: '验证SOP',
        description: '验证SOP格式和内容',
        parameters: {
          type: 'object',
          properties: {
            content: { type: 'string' }
          },
          required: ['content']
        },
        handler: 'validator.validateSOP'
      }
    ],
    toolCalling: {
      mode: 'auto',
      confirmationRequired: [],
      maxIterations: 3,
      timeout: 10000
    },
    externalAPIs: []
  },
  
  behavior: {
    greeting: '你好！我是SOP撰写助手。请告诉我你需要撰写什么类型的SOP，我会帮你生成专业的标准操作程序文档。',
    tone: 'professional',
    language: 'zh-CN',
    maxResponseLength: 4000,
    allowClarification: true,
    showThinking: false
  },
  
  safety: {
    contentFilter: true,
    maxCostPerRequest: 0.5,
    allowedDomains: [],
    blockedKeywords: []
  },
  
  metadata: {
    version: '1.0.0',
    author: 'GTM Team',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
    usageCount: 0
  }
};
```

## 10. 配置存储与管理

```typescript
// 配置版本控制
interface ConfigVersion {
  version: string;
  config: AgentConfiguration;
  changelog: string;
  createdBy: string;
  createdAt: string;
}

// 配置模板
interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  baseConfig: AgentConfiguration;
  customizableFields: string[];
}

// 配置继承
interface ConfigInheritance {
  extends: string; // 父配置ID
  overrides: DeepPartial<AgentConfiguration>;
}

// 示例：模板系统
const agentTemplates: AgentTemplate[] = [
  {
    id: 'content-writer',
    name: '内容撰写专家',
    description: '适用于各类内容创作场景',
    category: 'content',
    baseConfig: contentWriterAgent,
    customizableFields: ['model.parameters.temperature', 'behavior.tone', 'skills']
  },
  {
    id: 'data-analyst',
    name: '数据分析专家',
    description: '适用于数据分析和报告生成',
    category: 'analysis',
    baseConfig: dataAnalystAgent,
    customizableFields: ['model', 'tools', 'output.schema']
  },
  {
    id: 'sales-assistant',
    name: '销售助手',
    description: '适用于销售跟进和客户沟通',
    category: 'sales',
    baseConfig: salesAssistantAgent,
    customizableFields: ['knowledge', 'memory', 'triggers']
  }
];
```

## 11. 技术实现建议

### 11.1 数据库存储结构

```sql
-- Agent配置表
CREATE TABLE agent_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    config JSONB NOT NULL,
    version VARCHAR(50) NOT NULL,
    parent_id UUID REFERENCES agent_configs(id),
    is_template BOOLEAN DEFAULT false,
    category VARCHAR(100),
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Skill定义表
CREATE TABLE skills (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    version VARCHAR(50),
    input_schema JSONB,
    output_schema JSONB,
    implementation JSONB NOT NULL,
    dependencies TEXT[],
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 模型配置表
CREATE TABLE model_configs (
    id VARCHAR(100) PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    parameters JSONB NOT NULL,
    capabilities TEXT[],
    pricing JSONB,
    limits JSONB,
    is_active BOOLEAN DEFAULT true
);

-- Agent执行日志
CREATE TABLE agent_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agent_configs(id),
    skill_id VARCHAR(100) REFERENCES skills(id),
    input JSONB,
    output JSONB,
    model_used VARCHAR(100),
    tokens_used JSONB,
    cost DECIMAL(10,4),
    duration_ms INTEGER,
    status VARCHAR(20),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 11.2 运行时架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Agent Runtime                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Config    │───▶│  Initialize │───▶│   Skills    │     │
│  │   Loader    │    │   Runtime   │    │   Loader    │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                               │              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────▼─────┐       │
│  │   Output    │◀───│   Execute   │◀───│  Context  │       │
│  │  Formatter  │    │   Skill     │    │  Builder  │       │
│  └─────────────┘    └─────────────┘    └───────────┘       │
│                               │                              │
│  ┌─────────────┐    ┌─────────▼─────────┐                   │
│  │   Memory    │◀───│   Model Router    │                   │
│  │   Store     │    │  (OpenAI/Claude)  │                   │
│  └─────────────┘    └───────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### 11.3 配置热更新机制

```typescript
interface ConfigHotReload {
  // 监听配置变化
  watch(configId: string): Observable<ConfigChange>;
  
  // 平滑迁移
  migrate(oldConfig: AgentConfiguration, newConfig: AgentConfiguration): Promise<void>;
  
  // A/B测试支持
  abTest(configs: AgentConfiguration[]): ABTestResult;
}
```

## 12. UI配置界面设计

### 12.1 配置向导流程

```
Step 1: 选择模板
    ↓
Step 2: 配置基础信息（名称、描述）
    ↓
Step 3: 选择Skills
    ↓
Step 4: 配置模型参数
    ↓
Step 5: 关联知识库
    ↓
Step 6: 配置输出格式
    ↓
Step 7: 测试与验证
    ↓
Step 8: 发布
```

### 12.2 可视化配置编辑器

- **Skills画布**：拖拽式Skill组合
- **模型参数滑块**：Temperature、TopP等实时调节
- **知识库关联器**：可视化关联度设置
- **输出预览器**：实时预览输出格式
- **测试控制台**：即时测试Agent效果
