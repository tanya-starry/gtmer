// Document Types
export interface Document {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'sop' | 'case';
  category: string;
  tags: string[];
  author: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
}

export interface DocumentCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  type: 'article' | 'sop' | 'case';
}

// Agent Job Types
export type AgentJobType = 'sop' | 'ppt' | 'batch_content';
export type AgentJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AgentJob {
  id: string;
  type: AgentJobType;
  status: AgentJobStatus;
  title: string;
  description: string;
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  error_message?: string;
  progress: number;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  children?: NavItem[];
  href?: string;
}

// Agent Types
export interface AgentOption {
  id: AgentJobType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// UI Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
