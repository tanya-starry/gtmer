import { useState, useEffect } from 'react';
import {
  BookOpen,
  Bot,
  ChevronRight,
  ChevronDown,
  Briefcase,
  ListOrdered,
  Settings,
  HelpCircle,
  Plus,
  Search,
  FolderOpen,
  Database,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Document } from '@/types';
import { mockData } from '@/lib/supabase';
import { CreateDocDialog } from './CreateDocDialog';

interface SidebarProps {
  selectedDocId: string | null;
  onSelectDoc: (doc: Document) => void;
  onCreateClick: () => void;
}

export function Sidebar({ selectedDocId, onSelectDoc, onCreateClick }: SidebarProps) {
  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'gtm-knowledge': true,
    'my-knowledge': true,
    'external-knowledge': false,
    'agent-center': false
  });

  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDocOpen, setCreateDocOpen] = useState(false);

  useEffect(() => {
    setDocuments(mockData.documents);
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const filteredDocs = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const cases = filteredDocs.filter((d) => d.type === 'case');
  const sops = filteredDocs.filter((d) => d.type === 'sop');

  return (
    <aside className="w-64 h-screen bg-[#1a202c] text-gray-300 flex flex-col fixed left-0 top-0 z-40 dark-sidebar">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-white text-sm">GTM智能中台</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索知识库..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-gray-800/50 border border-gray-700 rounded-md text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {/* 1. GTM知识库 */}
        <div className="mb-1">
          <button
            onClick={() => toggleSection('gtm-knowledge')}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
              expandedSections['gtm-knowledge']
                ? 'bg-blue-600/20 text-blue-400'
                : 'hover:bg-white/5 text-gray-300'
            )}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>GTM知识库</span>
            </div>
            {expandedSections['gtm-knowledge'] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {/* GTM知识库二级目录 */}
          {expandedSections['gtm-knowledge'] && (
            <div className="ml-4 mt-1 space-y-1">
              {/* 2. 我的知识库 */}
              <div>
                <button
                  onClick={() => toggleSection('my-knowledge')}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>我的知识库</span>
                  </div>
                  {expandedSections['my-knowledge'] ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* 我的知识库三级目录 */}
                {expandedSections['my-knowledge'] && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {/* 案例中心 */}
                    <button
                      onClick={() => toggleSection('case-center')}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>案例中心</span>
                      </div>
                      {expandedSections['case-center'] ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </button>

                    {/* 案例列表 */}
                    {expandedSections['case-center'] && (
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {cases.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => onSelectDoc(doc)}
                            className={cn(
                              'w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-left transition-all sidebar-item',
                              selectedDocId === doc.id
                                ? 'bg-blue-600/20 text-blue-400'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            )}
                          >
                            <Briefcase className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{doc.title}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* SOP */}
                    <button
                      onClick={() => toggleSection('sop-center')}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <ListOrdered className="w-3.5 h-3.5" />
                        <span>SOP</span>
                      </div>
                      {expandedSections['sop-center'] ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </button>

                    {/* SOP列表 */}
                    {expandedSections['sop-center'] && (
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {sops.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => onSelectDoc(doc)}
                            className={cn(
                              'w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-left transition-all sidebar-item',
                              selectedDocId === doc.id
                                ? 'bg-blue-600/20 text-blue-400'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            )}
                          >
                            <ListOrdered className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{doc.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. 外脑知识库 */}
              <button
                onClick={() => toggleSection('external-knowledge')}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-all',
                  expandedSections['external-knowledge']
                    ? 'text-blue-400 bg-blue-600/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                )}
              >
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  <span>外脑知识库</span>
                </div>
                {expandedSections['external-knowledge'] ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>

              {/* 外脑知识库内容 */}
              {expandedSections['external-knowledge'] && (
                <div className="ml-4 mt-0.5 space-y-0.5">
                  <div className="px-3 py-2 rounded-md text-xs text-gray-500">
                    <p>外脑知识库内容将在这里显示</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Agent中心 */}
        <div className="mb-1">
          <button
            onClick={() => toggleSection('agent-center')}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
              expandedSections['agent-center']
                ? 'bg-blue-600/20 text-blue-400'
                : 'hover:bg-white/5 text-gray-300'
            )}
          >
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" />
              <span>Agent中心</span>
            </div>
            {expandedSections['agent-center'] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {/* Agent中心内容 */}
          {expandedSections['agent-center'] && (
            <div className="ml-4 mt-1 space-y-3">
              <div className="px-2 py-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">AI Agent中心</span>
                </div>
                <p className="text-xs text-gray-400">
                  使用AI Agent自动化您的GTM任务，提升团队效率。
                </p>
              </div>

              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最近任务
                </div>
                {mockData.agentJobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="px-3 py-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 truncate">{job.title}</span>
                      <span
                        className={cn(
                          'text-xs px-1.5 py-0.5 rounded-full',
                          job.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : job.status === 'processing'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        )}
                      >
                        {job.status === 'completed'
                          ? '完成'
                          : job.status === 'processing'
                          ? '进行中'
                          : '待处理'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{job.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-700/50 space-y-2">
        {/* 创建文档 - 科技紫背景 */}
        <button
          onClick={() => setCreateDocOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-sm font-medium transition-all duration-200 btn-shine"
        >
          <Plus className="w-4 h-4" />
          <span>创建文档</span>
        </button>
        
        {/* 创建Agent */}
        <button
          onClick={onCreateClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-all duration-200 btn-shine"
        >
          <Bot className="w-4 h-4" />
          <span>创建Agent</span>
        </button>
        
        <div className="flex items-center justify-between px-2">
          <button className="p-2 hover:bg-white/5 rounded-md transition-colors">
            <Settings className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-md transition-colors">
            <HelpCircle className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Create Doc Dialog */}
      <CreateDocDialog open={createDocOpen} onOpenChange={setCreateDocOpen} />
    </aside>
  );
}
