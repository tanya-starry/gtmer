import { useState } from 'react';
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
  BrainCircuit,
  MoreHorizontal,
  Edit3,
  Trash2,
  FolderPlus,
  Check,
  X,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockData } from '@/lib/supabase';
import { CreateDocDialog } from './CreateDocDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Directory types
interface Directory {
  id: string;
  name: string;
  icon?: string;
  children?: Directory[];
  isSystem?: boolean; // System directories cannot be deleted
}

interface SidebarProps {
  onCreateClick: () => void;
}

// Default directory structure
const defaultDirectories: Directory[] = [
  {
    id: 'my-knowledge',
    name: '我的知识库',
    icon: 'FolderOpen',
    isSystem: true,
    children: [
      {
        id: 'case-center',
        name: '案例中心',
        icon: 'Briefcase',
        children: []
      },
      {
        id: 'sop-center',
        name: 'SOP',
        icon: 'ListOrdered',
        children: []
      }
    ]
  },
  {
    id: 'external-knowledge',
    name: '外脑知识库',
    icon: 'Database',
    isSystem: true,
    children: []
  }
];

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  FolderOpen,
  Briefcase,
  ListOrdered,
  Database,
  FileText,
  BookOpen
};

export function EditableSidebar({ onCreateClick }: SidebarProps) {
  // Directories state
  const [directories, setDirectories] = useState<Directory[]>(defaultDirectories);
  
  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'gtm-knowledge': true,
    'my-knowledge': true,
    'external-knowledge': false,
    'agent-center': false
  });

  // Editing state
  const [editingDir, setEditingDir] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [addingToParent, setAddingToParent] = useState<string | null>(null);
  const [newDirName, setNewDirName] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [createDocOpen, setCreateDocOpen] = useState(false);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Find directory by ID
  const findDirectory = (dirs: Directory[], id: string): Directory | null => {
    for (const dir of dirs) {
      if (dir.id === id) return dir;
      if (dir.children) {
        const found = findDirectory(dir.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Find parent directory
  const findParentDirectory = (dirs: Directory[], childId: string): Directory | null => {
    for (const dir of dirs) {
      if (dir.children?.some(child => child.id === childId)) return dir;
      if (dir.children) {
        const found = findParentDirectory(dir.children, childId);
        if (found) return found;
      }
    }
    return null;
  };

  // Add new directory
  const handleAddDirectory = (parentId: string) => {
    if (!newDirName.trim()) return;

    const newDir: Directory = {
      id: `dir-${Date.now()}`,
      name: newDirName.trim(),
      icon: 'FileText',
      children: []
    };

    const addToParent = (dirs: Directory[]): Directory[] => {
      return dirs.map(dir => {
        if (dir.id === parentId) {
          return {
            ...dir,
            children: [...(dir.children || []), newDir]
          };
        }
        if (dir.children) {
          return {
            ...dir,
            children: addToParent(dir.children)
          };
        }
        return dir;
      });
    };

    setDirectories(addToParent(directories));
    setNewDirName('');
    setAddingToParent(null);
    setExpandedSections(prev => ({ ...prev, [parentId]: true }));
    toast.success(`目录 "${newDirName}" 创建成功`);
  };

  // Delete directory
  const handleDeleteDirectory = (dirId: string) => {
    const dir = findDirectory(directories, dirId);
    if (dir?.isSystem) {
      toast.error('系统目录不能删除');
      return;
    }

    const deleteFromParent = (dirs: Directory[]): Directory[] => {
      return dirs.filter(dir => dir.id !== dirId).map(dir => ({
        ...dir,
        children: dir.children ? deleteFromParent(dir.children) : undefined
      }));
    };

    setDirectories(deleteFromParent(directories));
    toast.success('目录已删除');
  };

  // Start editing directory name
  const startEditing = (dirId: string, currentName: string) => {
    setEditingDir(dirId);
    setEditingName(currentName);
  };

  // Save directory name
  const saveDirectoryName = (dirId: string) => {
    if (!editingName.trim()) {
      setEditingDir(null);
      return;
    }

    const updateName = (dirs: Directory[]): Directory[] => {
      return dirs.map(dir => {
        if (dir.id === dirId) {
          return { ...dir, name: editingName.trim() };
        }
        if (dir.children) {
          return { ...dir, children: updateName(dir.children) };
        }
        return dir;
      });
    };

    setDirectories(updateName(directories));
    setEditingDir(null);
    toast.success('目录名称已更新');
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingDir(null);
    setEditingName('');
  };

  // Render directory tree
  const renderDirectory = (dir: Directory, level: number = 0) => {
    const Icon = iconMap[dir.icon || 'FolderOpen'] || FolderOpen;
    const isExpanded = expandedSections[dir.id];
    const hasChildren = dir.children && dir.children.length > 0;
    const isEditing = editingDir === dir.id;
    const isAdding = addingToParent === dir.id;
    const paddingLeft = level * 12 + 12;

    return (
      <div key={dir.id}>
        {/* Directory Item */}
        <div
          className="group flex items-center justify-between py-1.5 pr-2 rounded-md hover:bg-white/5 transition-colors"
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {/* Expand/Collapse button */}
            {hasChildren || dir.children ? (
              <button
                onClick={() => toggleSection(dir.id)}
                className="p-0.5 rounded hover:bg-white/10 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                )}
              </button>
            ) : (
              <span className="w-5" />
            )}

            {/* Icon */}
            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />

            {/* Name (editing or display) */}
            {isEditing ? (
              <div className="flex items-center gap-1 flex-1">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveDirectoryName(dir.id);
                    if (e.key === 'Escape') cancelEditing();
                  }}
                  autoFocus
                  className="h-6 text-xs py-0 px-2"
                />
                <button
                  onClick={() => saveDirectoryName(dir.id)}
                  className="p-0.5 rounded hover:bg-green-500/20 text-green-400"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={cancelEditing}
                  className="p-0.5 rounded hover:bg-red-500/20 text-red-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => toggleSection(dir.id)}
                className="text-sm text-gray-300 hover:text-white truncate flex-1 text-left"
              >
                {dir.name}
              </button>
            )}
          </div>

          {/* Actions dropdown */}
          {!isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all"
                >
                  <MoreHorizontal className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem
                  onClick={() => {
                    setAddingToParent(dir.id);
                    setNewDirName('');
                  }}
                  className="text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4 mr-2 text-gray-500" />
                  新建子目录
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => startEditing(dir.id, dir.name)}
                  className="text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 mr-2 text-gray-500" />
                  重命名
                </DropdownMenuItem>
                {!dir.isSystem && (
                  <>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem
                      onClick={() => handleDeleteDirectory(dir.id)}
                      className="text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Add new directory input */}
        {isAdding && (
          <div
            className="flex items-center gap-1.5 py-1.5 pr-2"
            style={{ paddingLeft: `${paddingLeft + 20}px` }}
          >
            <FolderPlus className="w-4 h-4 text-gray-400" />
            <Input
              value={newDirName}
              onChange={(e) => setNewDirName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddDirectory(dir.id);
                if (e.key === 'Escape') setAddingToParent(null);
              }}
              placeholder="新目录名称"
              autoFocus
              className="h-6 text-xs py-0 px-2 flex-1"
            />
            <button
              onClick={() => handleAddDirectory(dir.id)}
              disabled={!newDirName.trim()}
              className="p-0.5 rounded hover:bg-green-500/20 text-green-400 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setAddingToParent(null)}
              className="p-0.5 rounded hover:bg-red-500/20 text-red-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Children */}
        {isExpanded && dir.children && (
          <div>
            {dir.children.map(child => renderDirectory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

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
        {/* GTM知识库 */}
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

          {/* Editable Directory Tree */}
          {expandedSections['gtm-knowledge'] && (
            <div className="mt-1">
              {directories.map(dir => renderDirectory(dir))}
            </div>
          )}
        </div>

        {/* Agent中心 */}
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
