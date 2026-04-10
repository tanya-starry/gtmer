import { useState, useEffect } from 'react';
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  Share2,
  Download,
  Eye,
  Clock,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Breadcrumb } from './Breadcrumb';
import type { Document } from '@/types';

interface ContentAreaProps {
  document: Document | null;
  onEdit?: (doc: Document) => void;
  onDelete?: (doc: Document) => void;
  onShare?: (doc: Document) => void;
  className?: string;
}

export function ContentArea({
  document,
  onEdit,
  onDelete,
  onShare,
  className,
}: ContentAreaProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = window.document.documentElement.scrollHeight || 0;
      const windowHeight = window.innerHeight;
      const progress = Math.min(100, Math.round((scrollTop / (docHeight - windowHeight)) * 100));
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!document) {
    return (
      <div
        className={cn(
          'flex-1 flex items-center justify-center bg-gray-50/50',
          className
        )}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">选择一个文档</h3>
          <p className="text-sm text-gray-500">从左侧导航选择要查看的文档</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'GTM知识库' },
    { label: document.type === 'article' ? '文章' : document.type === 'sop' ? 'SOP' : '案例' },
    { label: document.category },
    { label: document.title },
  ];

  return (
    <div
      className={cn(
        'flex-1 flex flex-col bg-white transition-all duration-300',
        isFullscreen && 'fixed inset-0 z-50',
        className
      )}
    >
      {/* Reading Progress Bar */}
      <div className="h-0.5 bg-gray-100">
        <div
          className="h-full bg-blue-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100">
        {/* Breadcrumb */}
        <div className="mb-3">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Title Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {document.title}
            </h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{document.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>更新于 {new Date(document.updated_at).toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{document.views} 次阅读</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFullscreen ? '退出全屏' : '全屏阅读'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(document)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare?.(document)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(document)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400" />
          {document.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-normal bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <article className="max-w-4xl mx-auto px-6 py-8">
          <MarkdownRenderer content={document.content} />
        </article>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto px-6 py-8 border-t border-gray-100 mt-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              最后更新: {new Date(document.updated_at).toLocaleString('zh-CN')}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                上一篇
              </Button>
              <Button variant="outline" size="sm">
                下一篇
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
