import { createClient } from '@supabase/supabase-js';
import type { Document, AgentJob, AgentJobStatus } from '@/types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Document API
export const documentApi = {
  // Get all documents with optional filtering
  async getDocuments(options?: {
    type?: 'article' | 'sop' | 'case';
    category?: string;
    status?: 'draft' | 'published' | 'archived';
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Document[]; count: number }> {
    let query = supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false });

    if (options?.type) {
      query = query.eq('type', options.type);
    }
    if (options?.category) {
      query = query.eq('category', options.category);
    }
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,content.ilike.%${options.search}%`);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }

    return { data: data || [], count: count || 0 };
  },

  // Get a single document by ID
  async getDocument(id: string): Promise<Document | null> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching document:', error);
      return null;
    }

    return data;
  },

  // Create a new document
  async createDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document | null> {
    const { data, error } = await supabase
      .from('documents')
      .insert([document])
      .select()
      .single();

    if (error) {
      console.error('Error creating document:', error);
      return null;
    }

    return data;
  },

  // Update a document
  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | null> {
    const { data, error } = await supabase
      .from('documents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating document:', error);
      return null;
    }

    return data;
  },

  // Delete a document
  async deleteDocument(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting document:', error);
      return false;
    }

    return true;
  },

  // Increment view count
  async incrementViews(id: string): Promise<void> {
    await supabase.rpc('increment_document_views', { doc_id: id });
  },

  // Get document categories
  async getCategories(): Promise<{ type: string; category: string; count: number }[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('type, category')
      .eq('status', 'published');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    // Group by type and category
    const grouped = data?.reduce((acc, item) => {
      const key = `${item.type}-${item.category}`;
      if (!acc[key]) {
        acc[key] = { type: item.type, category: item.category, count: 0 };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, { type: string; category: string; count: number }>);

    return Object.values(grouped || {});
  },
};

// Agent Job API
export const agentJobApi = {
  // Get all jobs with optional filtering
  async getJobs(options?: {
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    type?: 'sop' | 'ppt' | 'batch_content';
    limit?: number;
  }): Promise<AgentJob[]> {
    let query = supabase
      .from('agent_jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }
    if (options?.type) {
      query = query.eq('type', options.type);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching agent jobs:', error);
      return [];
    }

    return data || [];
  },

  // Get a single job by ID
  async getJob(id: string): Promise<AgentJob | null> {
    const { data, error } = await supabase
      .from('agent_jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching agent job:', error);
      return null;
    }

    return data;
  },

  // Create a new job
  async createJob(job: Omit<AgentJob, 'id' | 'created_at' | 'updated_at' | 'progress'>): Promise<AgentJob | null> {
    const { data, error } = await supabase
      .from('agent_jobs')
      .insert([{ ...job, progress: 0 }])
      .select()
      .single();

    if (error) {
      console.error('Error creating agent job:', error);
      return null;
    }

    return data;
  },

  // Update job status
  async updateJobStatus(
    id: string,
    status: AgentJobStatus,
    updates?: Partial<AgentJob>
  ): Promise<AgentJob | null> {
    const updateData: Partial<AgentJob> = { status, ...updates };
    
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
      updateData.progress = 100;
    }

    const { data, error } = await supabase
      .from('agent_jobs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating agent job:', error);
      return null;
    }

    return data;
  },

  // Update job progress
  async updateJobProgress(id: string, progress: number): Promise<void> {
    await supabase
      .from('agent_jobs')
      .update({ progress: Math.min(100, Math.max(0, progress)) })
      .eq('id', id);
  },

  // Delete a job
  async deleteJob(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('agent_jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting agent job:', error);
      return false;
    }

    return true;
  },

  // Subscribe to job updates
  subscribeToJob(id: string, callback: (job: AgentJob) => void) {
    return supabase
      .channel(`agent_job_${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_jobs',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          callback(payload.new as AgentJob);
        }
      )
      .subscribe();
  },
};

// Mock data for development (when Supabase is not configured)
export const mockData = {
  documents: [
    {
      id: '1',
      title: 'GTM策略制定完整指南',
      content: `# GTM策略制定完整指南\n\n## 概述\n\n市场进入(Go-to-Market, GTM)策略是产品成功推向市场的关键...\n\n## 核心要素\n\n### 1. 目标市场定位\n- 明确目标客户画像\n- 分析市场规模和增长潜力\n- 确定市场细分策略\n\n### 2. 价值主张\n- 产品核心优势\n- 差异化竞争点\n- 客户价值体现\n\n### 3. 渠道策略\n- 直销渠道\n- 合作伙伴渠道\n- 数字营销渠道\n\n## 实施步骤\n\n1. **市场调研** - 深入了解目标客户需求\n2. **竞品分析** - 分析竞争对手优劣势\n3. **策略制定** - 确定GTM核心策略\n4. **执行计划** - 制定详细的执行时间表\n5. **效果评估** - 持续监控和优化\n\n## 最佳实践\n\n> \"成功的GTM策略需要产品、营销、销售团队的紧密协作。\"\n\n### 代码示例\n\n\`\`\`javascript\nconst gtmStrategy = {\n  targetMarket: 'Enterprise SaaS',\n  valueProposition: 'Increase efficiency by 10x',\n  channels: ['direct', 'partner', 'digital'],\n  timeline: 'Q1-Q4 2024'\n};\n\`\`\`\n\n## 总结\n\n制定有效的GTM策略需要系统性的思考和执行...`,
      type: 'article' as const,
      category: '策略指南',
      tags: ['GTM', '策略', '市场进入'],
      author: '产品团队',
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-03-20T10:30:00Z',
      status: 'published' as const,
      views: 1250,
    },
    {
      id: '2',
      title: '销售线索跟进SOP',
      content: `# 销售线索跟进SOP\n\n## 目的\n\n规范销售线索跟进流程，提高转化率...\n\n## 流程步骤\n\n### 第一阶段：线索分配（T+0）\n- [ ] 线索质量评分\n- [ ] 分配给对应销售\n- [ ] 发送确认邮件\n\n### 第二阶段：首次接触（T+1）\n- [ ] 电话初次沟通\n- [ ] 了解客户需求\n- [ ] 记录沟通要点\n\n### 第三阶段：方案呈现（T+3）\n- [ ] 准备定制化方案\n- [ ] 安排产品演示\n- [ ] 收集客户反馈\n\n## 关键指标\n\n| 指标 | 目标值 | 考核周期 |\n|------|--------|----------|\n| 首次响应时间 | < 2小时 | 每日 |\n| 线索转化率 | > 15% | 每月 |\n| 平均成交周期 | < 30天 | 每季度 |`,
      type: 'sop' as const,
      category: '销售流程',
      tags: ['SOP', '销售', '线索管理'],
      author: '销售运营',
      created_at: '2024-02-01T09:00:00Z',
      updated_at: '2024-03-15T14:20:00Z',
      status: 'published' as const,
      views: 890,
    },
    {
      id: '3',
      title: '某SaaS企业GTM转型案例',
      content: `# 某SaaS企业GTM转型案例\n\n## 背景\n\n客户是一家中型SaaS企业，面临增长瓶颈...\n\n## 挑战\n\n1. 线索质量下降，转化率持续走低\n2. 销售与营销团队协同不畅\n3. 缺乏数据驱动的决策机制\n\n## 解决方案\n\n### 1. 重构目标客户画像\n通过深度调研，重新定义了ICP（理想客户画像）...\n\n### 2. 优化营销漏斗\n- 顶部：内容营销 + SEO\n- 中部：自动化 nurture\n- 底部：销售赋能\n\n### 3. 建立统一数据平台\n整合各渠道数据，实现全链路追踪...\n\n## 成果\n\n| 指标 | 转型前 | 转型后 | 提升 |\n|------|--------|--------|------|\n| MQL数量 | 500/月 | 1200/月 | +140% |\n| 转化率 | 8% | 18% | +125% |\n| 销售周期 | 45天 | 28天 | -38% |\n| CAC | ¥8,000 | ¥5,200 | -35% |\n\n## 经验总结\n\n> 数据驱动的GTM策略是持续增长的关键。`,
      type: 'case' as const,
      category: '成功案例',
      tags: ['案例', 'SaaS', '转型'],
      author: '客户成功',
      created_at: '2024-02-20T11:00:00Z',
      updated_at: '2024-03-10T16:45:00Z',
      status: 'published' as const,
      views: 2100,
    },
  ] as Document[],

  agentJobs: [
    {
      id: '1',
      type: 'sop' as const,
      status: 'completed' as const,
      title: '生成：客户 onboarding SOP',
      description: '为新客户onboarding流程生成标准操作程序',
      input_data: { topic: '客户onboarding', department: '客户成功' },
      output_data: { document_id: 'sop-001' },
      created_at: '2024-03-20T09:00:00Z',
      updated_at: '2024-03-20T09:05:30Z',
      completed_at: '2024-03-20T09:05:30Z',
      progress: 100,
    },
    {
      id: '2',
      type: 'ppt' as const,
      status: 'processing' as const,
      title: '生成：Q1业绩汇报PPT',
      description: '基于Q1数据生成业绩汇报演示文稿',
      input_data: { quarter: 'Q1', data_source: 'sales_db' },
      created_at: '2024-03-20T10:00:00Z',
      updated_at: '2024-03-20T10:02:15Z',
      progress: 65,
    },
    {
      id: '3',
      type: 'batch_content' as const,
      status: 'pending' as const,
      title: '生成：产品功能介绍图文',
      description: '为新产品功能生成10组社交媒体图文',
      input_data: { product: '新功能A', count: 10, platforms: ['微信', '微博'] },
      created_at: '2024-03-20T11:00:00Z',
      updated_at: '2024-03-20T11:00:00Z',
      progress: 0,
    },
  ] as AgentJob[],
};
