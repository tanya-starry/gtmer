import type { Skill } from './types';
import { skillRegistry } from './registry';

// Built-in Skills for GTM Platform

// 1. SOP Writer Skill
const sopWriterSkill: Skill = {
  id: 'sop_writer',
  name: 'SOP撰写',
  description: '生成标准操作程序文档，包含目的、范围、职责、流程步骤等完整结构',
  category: 'content',
  version: '1.0.0',
  status: 'active',
  
  inputSchema: {
    type: 'object',
    properties: {
      topic: { 
        type: 'string', 
        description: 'SOP主题',
        default: ''
      },
      department: { 
        type: 'string', 
        description: '适用部门',
        default: ''
      },
      description: { 
        type: 'string', 
        description: '流程详细描述',
        default: ''
      },
      steps_count: { 
        type: 'number', 
        description: '期望的步骤数量',
        default: 5
      }
    },
    required: ['topic', 'department']
  },
  
  outputSchema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      version: { type: 'string' },
      purpose: { type: 'string' },
      scope: { type: 'string' },
      responsibilities: { 
        type: 'array', 
        items: { type: 'string' } 
      },
      procedures: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            step: { type: 'number' },
            title: { type: 'string' },
            description: { type: 'string' },
            responsible: { type: 'string' },
            checklist: { 
              type: 'array', 
              items: { type: 'string' } 
            }
          }
        }
      },
      related_documents: { 
        type: 'array', 
        items: { type: 'string' } 
      }
    }
  },
  
  implementation: {
    type: 'prompt',
    systemPrompt: `你是一位专业的SOP（标准操作程序）文档撰写专家。你的任务是帮助用户生成结构清晰、内容专业的SOP文档。

SOP文档应包含以下标准结构：
1. 目的 - 说明为什么要做这项操作
2. 适用范围 - 说明适用于哪些部门/人员
3. 职责 - 明确各角色的责任
4. 流程步骤 - 详细的操作步骤，包含检查点
5. 相关文档 - 关联的其他文档
6. 版本记录 - 版本变更历史

撰写原则：
- 步骤清晰、可执行
- 使用编号列表
- 每个步骤包含检查点
- 明确责任人和时间要求`,
    template: `请为以下主题撰写一份SOP文档：

## 基本信息
主题：{{topic}}
适用部门：{{department}}
{{#if description}}
详细描述：{{description}}
{{/if}}
{{#if steps_count}}
期望步骤数：约{{steps_count}}个步骤
{{/if}}

请按照标准SOP格式生成完整的文档，使用Markdown格式。`,
    variables: ['topic', 'department', 'description', 'steps_count'],
    outputFormat: 'markdown',
    constraints: [
      '步骤必须可执行',
      '使用清晰的编号',
      '包含必要的检查点'
    ]
  },
  
  metadata: {
    author: 'GTM Team',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
    usageCount: 0,
    rating: 4.8,
    tags: ['sop', '文档', '流程', '标准操作'],
    icon: 'FileText'
  }
};

// 2. PPT Generator Skill
const pptGeneratorSkill: Skill = {
  id: 'ppt_generator',
  name: 'PPT生成',
  description: '基于数据和主题生成演示文稿内容，包含大纲、每页要点、演讲备注',
  category: 'content',
  version: '1.0.0',
  status: 'active',
  
  inputSchema: {
    type: 'object',
    properties: {
      title: { 
        type: 'string', 
        description: 'PPT标题' 
      },
      audience: { 
        type: 'string', 
        description: '目标受众' 
      },
      data: { 
        type: 'string', 
        description: '数据或内容描述' 
      },
      slide_count: { 
        type: 'number', 
        description: '期望页数',
        default: 10
      },
      style: { 
        type: 'string', 
        description: '风格',
        enum: ['professional', 'creative', 'minimal'],
        default: 'professional'
      }
    },
    required: ['title', 'audience']
  },
  
  implementation: {
    type: 'prompt',
    systemPrompt: `你是一位专业的商业演示文稿设计专家。你的任务是帮助用户生成高质量的PPT内容大纲。

每页PPT应包含：
- 页面标题
- 核心要点（3-5个bullet points）
- 建议的视觉元素（图表、图片等）
- 演讲者备注

设计原则：
- 每页聚焦一个核心观点
- 使用金字塔原理组织内容
- 数据可视化建议
- 保持简洁，避免文字堆砌`,
    template: `请为以下主题生成PPT内容大纲：

## 基本信息
标题：{{title}}
目标受众：{{audience}}
{{#if data}}
数据/内容：{{data}}
{{/if}}
期望页数：{{slide_count}}页
风格：{{style}}

请生成完整的PPT大纲，包含：
1. 封面页
2. 目录/议程
3. 内容页（每页包含标题、要点、视觉建议、演讲备注）
4. 总结页
5. Q&A/感谢页

使用Markdown格式输出。`,
    variables: ['title', 'audience', 'data', 'slide_count', 'style'],
    outputFormat: 'markdown'
  },
  
  metadata: {
    author: 'GTM Team',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
    usageCount: 0,
    rating: 4.6,
    tags: ['ppt', '演示', '汇报', '幻灯片'],
    icon: 'Presentation'
  }
};

// 3. Batch Content Generator Skill
const batchContentSkill: Skill = {
  id: 'batch_content',
  name: '批量图文',
  description: '批量生成社交媒体内容，包括标题、正文、标签、配图建议',
  category: 'content',
  version: '1.0.0',
  status: 'active',
  
  inputSchema: {
    type: 'object',
    properties: {
      topic: { 
        type: 'string', 
        description: '内容主题' 
      },
      platform: { 
        type: 'string', 
        description: '目标平台',
        enum: ['微信', '微博', 'LinkedIn', 'Twitter', '小红书', '抖音'],
        default: '微信'
      },
      count: { 
        type: 'number', 
        description: '生成数量',
        default: 5
      },
      tone: { 
        type: 'string', 
        description: '语气风格',
        enum: ['professional', 'casual', 'humorous', 'inspirational'],
        default: 'professional'
      }
    },
    required: ['topic']
  },
  
  implementation: {
    type: 'prompt',
    systemPrompt: `你是一位社交媒体内容创作专家。你的任务是帮助用户批量生成高质量的社交媒体内容。

每条内容应包含：
- 吸引人的标题
- 正文内容（符合平台特点）
- 相关标签
- 配图建议
- 最佳发布时间建议

平台特点：
- 微信：深度内容，1000-2000字
- 微博：短平快，140-500字
- LinkedIn：专业商务，500-1000字
- Twitter：简洁有力，280字符内
- 小红书：种草风格，300-800字
- 抖音：短视频脚本，配合画面描述`,
    template: `请为以下主题生成{{count}}条{{platform}}内容：

主题：{{topic}}
平台：{{platform}}
语气风格：{{tone}}

请为每条内容提供：
1. 标题
2. 正文
3. 标签（3-5个）
4. 配图建议
5. 发布时间建议

使用Markdown格式，每条内容之间用分隔线区分。`,
    variables: ['topic', 'platform', 'count', 'tone'],
    outputFormat: 'markdown'
  },
  
  metadata: {
    author: 'GTM Team',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
    usageCount: 0,
    rating: 4.5,
    tags: ['社交媒体', '内容', '批量', '营销'],
    icon: 'Image'
  }
};

// 4. Data Analyzer Skill
const dataAnalyzerSkill: Skill = {
  id: 'data_analyzer',
  name: '数据分析',
  description: '分析业务数据，生成洞察报告，包括趋势、异常、建议',
  category: 'analysis',
  version: '1.0.0',
  status: 'active',
  
  inputSchema: {
    type: 'object',
    properties: {
      data: { 
        type: 'string', 
        description: '数据内容（CSV/JSON格式或描述）' 
      },
      analysis_type: { 
        type: 'string', 
        description: '分析类型',
        enum: ['trend', 'comparison', 'correlation', 'anomaly', 'summary'],
        default: 'summary'
      },
      metrics: { 
        type: 'array', 
        items: { type: 'string' },
        description: '关注指标'
      }
    },
    required: ['data']
  },
  
  implementation: {
    type: 'prompt',
    systemPrompt: `你是一位数据分析师。你的任务是分析业务数据并生成专业的分析报告。

报告应包含：
1. 数据概览 - 基本情况统计
2. 关键发现 - 重要洞察
3. 趋势分析 - 变化趋势
4. 异常识别 - 异常点
5. 建议行动 - 可执行的建议

分析原则：
- 基于数据说话
- 使用具体数字
- 提供可执行的建议
- 可视化建议`,
    template: `请分析以下数据：

## 数据内容
{{data}}

## 分析要求
分析类型：{{analysis_type}}
{{#if metrics}}
关注指标：{{metrics}}
{{/if}}

请生成完整的分析报告，包含数据概览、关键发现、趋势分析、异常识别和行动建议。`,
    variables: ['data', 'analysis_type', 'metrics'],
    outputFormat: 'markdown'
  },
  
  metadata: {
    author: 'GTM Team',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
    usageCount: 0,
    rating: 4.7,
    tags: ['数据分析', '报告', '洞察', '业务'],
    icon: 'BarChart3'
  }
};

// 5. Email Writer Skill
const emailWriterSkill: Skill = {
  id: 'email_writer',
  name: '邮件撰写',
  description: '生成专业商务邮件，支持多种场景（跟进、提案、会议邀请等）',
  category: 'communication',
  version: '1.0.0',
  status: 'active',
  
  inputSchema: {
    type: 'object',
    properties: {
      scenario: { 
        type: 'string', 
        description: '邮件场景',
        enum: ['followup', 'proposal', 'meeting', 'introduction', 'thankyou', 'apology'],
        default: 'followup'
      },
      recipient: { 
        type: 'string', 
        description: '收件人信息' 
      },
      key_points: { 
        type: 'array', 
        items: { type: 'string' },
        description: '关键要点'
      },
      tone: { 
        type: 'string', 
        description: '语气',
        enum: ['formal', 'friendly', 'urgent'],
        default: 'friendly'
      }
    },
    required: ['scenario', 'recipient']
  },
  
  implementation: {
    type: 'prompt',
    systemPrompt: `你是一位商务沟通专家。你的任务是帮助用户撰写专业、得体的商务邮件。

邮件结构：
1. 主题行 - 简洁明了
2. 称呼 - 恰当得体
3. 开场 - 简短问候
4. 正文 - 清晰表达
5. 行动号召 - 明确的下一步
6. 结尾 - 礼貌得体

撰写原则：
- 主题行要吸引人
- 正文简洁明了
- 语气符合场景
- 包含明确的行动号召`,
    template: `请撰写一封{{scenario}}邮件：

收件人：{{recipient}}
语气：{{tone}}
{{#if key_points}}
关键要点：
{{#each key_points}}
- {{this}}
{{/each}}
{{/if}}

请生成完整的邮件，包含主题行和正文。`,
    variables: ['scenario', 'recipient', 'key_points', 'tone'],
    outputFormat: 'markdown'
  },
  
  metadata: {
    author: 'GTM Team',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
    usageCount: 0,
    rating: 4.6,
    tags: ['邮件', '沟通', '商务', '写作'],
    icon: 'Mail'
  }
};

// 6. Meeting Summary Skill
const meetingSummarySkill: Skill = {
  id: 'meeting_summary',
  name: '会议总结',
  description: '从会议记录中提取关键信息，生成摘要、决策、行动项',
  category: 'automation',
  version: '1.0.0',
  status: 'active',
  
  inputSchema: {
    type: 'object',
    properties: {
      transcript: { 
        type: 'string', 
        description: '会议记录/转录文本' 
      },
      meeting_type: { 
        type: 'string', 
        description: '会议类型',
        enum: ['standup', 'review', 'planning', 'brainstorm', 'client'],
        default: 'review'
      }
    },
    required: ['transcript']
  },
  
  implementation: {
    type: 'prompt',
    systemPrompt: `你是一位会议记录整理专家。你的任务是从会议记录中提取关键信息并生成结构化的会议纪要。

会议纪要应包含：
1. 会议基本信息（时间、参与者、主题）
2. 会议摘要（3-5句话）
3. 关键讨论点
4. 决策事项
5. 行动项（责任人+截止日期）
6. 下次会议安排

整理原则：
- 提取关键信息
- 结构化呈现
- 行动项明确可执行`,
    template: `请总结以下会议记录：

会议类型：{{meeting_type}}

## 会议记录
{{transcript}}

请生成结构化的会议纪要。`,
    variables: ['transcript', 'meeting_type'],
    outputFormat: 'markdown'
  },
  
  metadata: {
    author: 'GTM Team',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
    usageCount: 0,
    rating: 4.8,
    tags: ['会议', '总结', '纪要', '行动项'],
    icon: 'Users'
  }
};

// 7. Competitor Research Skill
const competitorResearchSkill: Skill = {
  id: 'competitor_research',
  name: '竞品调研',
  description: '分析竞争对手，生成调研报告，包括产品、定价、优劣势等',
  category: 'research',
  version: '1.0.0',
  status: 'active',
  
  inputSchema: {
    type: 'object',
    properties: {
      competitor: { 
        type: 'string', 
        description: '竞争对手名称' 
      },
      aspects: { 
        type: 'array', 
        items: { 
          type: 'string',
          enum: ['product', 'pricing', 'marketing', 'strengths', 'weaknesses', 'strategy']
        },
        description: '调研维度',
        default: ['product', 'pricing', 'strengths', 'weaknesses']
      }
    },
    required: ['competitor']
  },
  
  implementation: {
    type: 'prompt',
    systemPrompt: `你是一位市场研究专家。你的任务是帮助用户进行竞品分析并生成专业的调研报告。

报告应包含：
1. 竞品概况 - 基本信息
2. 产品分析 - 功能、特点
3. 定价策略 - 价格体系
4. 营销策略 - 推广方式
5. SWOT分析 - 优劣势
6. 我们的应对策略

分析原则：
- 客观公正
- 数据支撑
-  actionable insights`,
    template: `请对以下竞争对手进行调研分析：

竞争对手：{{competitor}}
调研维度：{{aspects}}

请生成完整的竞品调研报告。`,
    variables: ['competitor', 'aspects'],
    outputFormat: 'markdown'
  },
  
  metadata: {
    author: 'GTM Team',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
    usageCount: 0,
    rating: 4.5,
    tags: ['竞品', '调研', '分析', '市场'],
    icon: 'Search'
  }
};

// 8. Customer Profile Skill
const customerProfileSkill: Skill = {
  id: 'customer_profile',
  name: '客户画像',
  description: '基于客户数据生成详细的客户画像文档',
  category: 'analysis',
  version: '1.0.0',
  status: 'active',
  
  inputSchema: {
    type: 'object',
    properties: {
      customer_data: { 
        type: 'string', 
        description: '客户数据（可以是描述或结构化数据）' 
      },
      profile_type: { 
        type: 'string', 
        description: '画像类型',
        enum: ['icp', 'persona', 'segment'],
        default: 'persona'
      }
    },
    required: ['customer_data']
  },
  
  implementation: {
    type: 'prompt',
    systemPrompt: `你是一位客户研究专家。你的任务是基于客户数据生成详细的客户画像。

客户画像应包含：
1. 基本信息 -  demographics
2. 公司信息 - 行业、规模
3. 角色职责 - 职位、KPI
4. 痛点挑战 - 面临的问题
5. 目标动机 - 想要达成什么
6. 购买行为 - 决策过程
7. 内容偏好 - 喜欢的内容类型
8. 渠道偏好 - 活跃渠道

撰写原则：
- 具体可感知
- 避免泛泛而谈
- 有数据支撑`,
    template: `请基于以下数据生成客户画像：

画像类型：{{profile_type}}

## 客户数据
{{customer_data}}

请生成详细的客户画像文档。`,
    variables: ['customer_data', 'profile_type'],
    outputFormat: 'markdown'
  },
  
  metadata: {
    author: 'GTM Team',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
    usageCount: 0,
    rating: 4.7,
    tags: ['客户', '画像', 'ICP', 'Persona'],
    icon: 'UserCircle'
  }
};

// Register all built-in skills
export function registerBuiltInSkills(): void {
  const skills = [
    sopWriterSkill,
    pptGeneratorSkill,
    batchContentSkill,
    dataAnalyzerSkill,
    emailWriterSkill,
    meetingSummarySkill,
    competitorResearchSkill,
    customerProfileSkill
  ];

  for (const skill of skills) {
    skillRegistry.register(skill);
  }

  console.log(`[BuiltInSkills] Registered ${skills.length} built-in skills`);
}

// Export individual skills for testing
export {
  sopWriterSkill,
  pptGeneratorSkill,
  batchContentSkill,
  dataAnalyzerSkill,
  emailWriterSkill,
  meetingSummarySkill,
  competitorResearchSkill,
  customerProfileSkill
};
