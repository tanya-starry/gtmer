-- GTM智能中台数据库Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Documents table: 存储知识库文档
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    type VARCHAR(20) NOT NULL CHECK (type IN ('article', 'sop', 'case')),
    category VARCHAR(100) NOT NULL DEFAULT '未分类',
    tags TEXT[] DEFAULT '{}',
    author VARCHAR(100) NOT NULL DEFAULT '系统',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    views INTEGER DEFAULT 0
);

-- Agent jobs table: 存储AI Agent任务状态
CREATE TABLE IF NOT EXISTS agent_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('sop', 'ppt', 'batch_content')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_by UUID
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON documents(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_agent_jobs_type ON agent_jobs(type);
CREATE INDEX IF NOT EXISTS idx_agent_jobs_status ON agent_jobs(status);
CREATE INDEX IF NOT EXISTS idx_agent_jobs_created_at ON agent_jobs(created_at DESC);

-- Full text search index for documents
CREATE INDEX IF NOT EXISTS idx_documents_search ON documents 
    USING gin(to_tsvector('chinese', title || ' ' || COALESCE(content, '')));

-- Function to increment document views
CREATE OR REPLACE FUNCTION increment_document_views(doc_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE documents 
    SET views = views + 1 
    WHERE id = doc_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_jobs_updated_at
    BEFORE UPDATE ON agent_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_jobs ENABLE ROW LEVEL SECURITY;

-- Policies for documents (allow all for demo)
CREATE POLICY "Allow all operations on documents" ON documents
    FOR ALL USING (true) WITH CHECK (true);

-- Policies for agent_jobs (allow all for demo)
CREATE POLICY "Allow all operations on agent_jobs" ON agent_jobs
    FOR ALL USING (true) WITH CHECK (true);

-- Sample data insertion
INSERT INTO documents (title, content, type, category, tags, author, status, views) VALUES
(
    'GTM策略制定完整指南',
    E'# GTM策略制定完整指南\n\n## 概述\n\n市场进入(Go-to-Market, GTM)策略是产品成功推向市场的关键...\n\n## 核心要素\n\n### 1. 目标市场定位\n- 明确目标客户画像\n- 分析市场规模和增长潜力\n- 确定市场细分策略\n\n### 2. 价值主张\n- 产品核心优势\n- 差异化竞争点\n- 客户价值体现\n\n### 3. 渠道策略\n- 直销渠道\n- 合作伙伴渠道\n- 数字营销渠道',
    'article',
    '策略指南',
    ARRAY['GTM', '策略', '市场进入'],
    '产品团队',
    'published',
    1250
),
(
    '销售线索跟进SOP',
    E'# 销售线索跟进SOP\n\n## 目的\n\n规范销售线索跟进流程，提高转化率...\n\n## 流程步骤\n\n### 第一阶段：线索分配（T+0）\n- [ ] 线索质量评分\n- [ ] 分配给对应销售\n- [ ] 发送确认邮件\n\n### 第二阶段：首次接触（T+1）\n- [ ] 电话初次沟通\n- [ ] 了解客户需求\n- [ ] 记录沟通要点',
    'sop',
    '销售流程',
    ARRAY['SOP', '销售', '线索管理'],
    '销售运营',
    'published',
    890
),
(
    '某SaaS企业GTM转型案例',
    E'# 某SaaS企业GTM转型案例\n\n## 背景\n\n客户是一家中型SaaS企业，面临增长瓶颈...\n\n## 挑战\n\n1. 线索质量下降，转化率持续走低\n2. 销售与营销团队协同不畅\n3. 缺乏数据驱动的决策机制\n\n## 解决方案\n\n### 1. 重构目标客户画像\n通过深度调研，重新定义了ICP（理想客户画像）...\n\n### 2. 优化营销漏斗\n- 顶部：内容营销 + SEO\n- 中部：自动化 nurture\n- 底部：销售赋能',
    'case',
    '成功案例',
    ARRAY['案例', 'SaaS', '转型'],
    '客户成功',
    'published',
    2100
);

INSERT INTO agent_jobs (type, status, title, description, input_data, output_data, progress) VALUES
(
    'sop',
    'completed',
    '生成：客户 onboarding SOP',
    '为新客户onboarding流程生成标准操作程序',
    '{"topic": "客户onboarding", "department": "客户成功"}'::jsonb,
    '{"document_id": "sop-001"}'::jsonb,
    100
),
(
    'ppt',
    'processing',
    '生成：Q1业绩汇报PPT',
    '基于Q1数据生成业绩汇报演示文稿',
    '{"quarter": "Q1", "data_source": "sales_db"}'::jsonb,
    '{}'::jsonb,
    65
),
(
    'batch_content',
    'pending',
    '生成：产品功能介绍图文',
    '为新产品功能生成10组社交媒体图文',
    '{"product": "新功能A", "count": 10, "platforms": ["微信", "微博"]}'::jsonb,
    '{}'::jsonb,
    0
);
