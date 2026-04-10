import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  EyeOff,
  Save,
  X,
  ChevronLeft,
  FolderOpen,
  Database,
  FileText,
  ListOrdered as ListOrderedIcon,
  Briefcase,
  Tag,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { MarkdownRenderer } from './MarkdownRenderer';

type KnowledgeBaseType = 'my-knowledge' | 'external-knowledge';
type DocType = 'article' | 'sop' | 'case';

interface DocEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  knowledgeBase: KnowledgeBaseType;
  docType: DocType;
  onBack: () => void;
}

export function DocEditorDialog({
  open,
  onOpenChange,
  knowledgeBase,
  docType,
  onBack
}: DocEditorDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Document type info
  const docTypeInfo = {
    article: { name: '文章', icon: FileText, color: 'blue' },
    sop: { name: 'SOP', icon: ListOrderedIcon, color: 'green' },
    case: { name: '案例', icon: Briefcase, color: 'amber' }
  };

  const kbInfo = {
    'my-knowledge': { name: '我的知识库', icon: FolderOpen },
    'external-knowledge': { name: '外脑知识库', icon: Database }
  };

  const TypeIcon = docTypeInfo[docType].icon;
  const KbIcon = kbInfo[knowledgeBase].icon;

  // Insert markdown syntax
  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    let newText = '';
    let cursorOffset = 0;

    switch (syntax) {
      case 'bold':
        newText = `**${selectedText || placeholder || '粗体文本'}**`;
        cursorOffset = selectedText ? 0 : -2;
        break;
      case 'italic':
        newText = `*${selectedText || placeholder || '斜体文本'}*`;
        cursorOffset = selectedText ? 0 : -1;
        break;
      case 'h1':
        newText = `\n# ${selectedText || placeholder || '标题'}\n`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case 'h2':
        newText = `\n## ${selectedText || placeholder || '二级标题'}\n`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case 'h3':
        newText = `\n### ${selectedText || placeholder || '三级标题'}\n`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case 'list':
        newText = `\n- ${selectedText || placeholder || '列表项'}\n- 列表项\n- 列表项\n`;
        break;
      case 'ordered-list':
        newText = `\n1. ${selectedText || placeholder || '列表项'}\n2. 列表项\n3. 列表项\n`;
        break;
      case 'link':
        newText = `[${selectedText || '链接文本'}](https://example.com)`;
        cursorOffset = selectedText ? -1 : -20;
        break;
      case 'image':
        newText = `![${selectedText || '图片描述'}](https://example.com/image.png)`;
        cursorOffset = selectedText ? -1 : -25;
        break;
      case 'code':
        newText = `\n\`\`\`\n${selectedText || placeholder || '代码块'}\n\`\`\`\n`;
        break;
      case 'quote':
        newText = `\n> ${selectedText || placeholder || '引用文本'}\n`;
        break;
      default:
        newText = syntax;
    }

    const newContent = beforeText + newText + afterText;
    setContent(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length + cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Add tag
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Save document
  const handleSave = async (publish: boolean = false) => {
    if (!title.trim()) {
      toast.error('请输入文档标题');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success(publish ? '文档已发布' : '草稿已保存', {
      description: `"${title}" 已保存到${kbInfo[knowledgeBase].name}`
    });

    setIsSaving(false);
    onOpenChange(false);
  };

  // Toolbar buttons
  type ToolbarButton = 
    | { icon: React.ElementType; action: () => void; title: string; separator?: false }
    | { separator: true; icon?: never; action?: never; title?: never };
  
  const toolbarButtons: ToolbarButton[] = [
    { icon: Heading1, action: () => insertMarkdown('h1'), title: '一级标题' },
    { icon: Heading2, action: () => insertMarkdown('h2'), title: '二级标题' },
    { icon: Heading3, action: () => insertMarkdown('h3'), title: '三级标题' },
    { separator: true },
    { icon: Bold, action: () => insertMarkdown('bold'), title: '粗体' },
    { icon: Italic, action: () => insertMarkdown('italic'), title: '斜体' },
    { separator: true },
    { icon: List, action: () => insertMarkdown('list'), title: '无序列表' },
    { icon: ListOrdered, action: () => insertMarkdown('ordered-list'), title: '有序列表' },
    { separator: true },
    { icon: Link, action: () => insertMarkdown('link'), title: '链接' },
    { icon: Image, action: () => insertMarkdown('image'), title: '图片' },
    { separator: true },
    { icon: Code, action: () => insertMarkdown('code'), title: '代码块' },
    { icon: Quote, action: () => insertMarkdown('quote'), title: '引用' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!bg-white !max-w-[90vw] !w-[90vw] !h-[90vh] !max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-1 text-gray-500"
              >
                <ChevronLeft className="w-4 h-4" />
                返回
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <span className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  docTypeInfo[docType].color === 'blue' && 'bg-blue-100 text-blue-600',
                  docTypeInfo[docType].color === 'green' && 'bg-green-100 text-green-600',
                  docTypeInfo[docType].color === 'amber' && 'bg-amber-100 text-amber-600'
                )}>
                  <TypeIcon className="w-4 h-4" />
                </span>
                <div>
                  <DialogTitle className="text-base font-medium">创建{docTypeInfo[docType].name}</DialogTitle>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <KbIcon className="w-3 h-3" />
                    <span>{kbInfo[knowledgeBase].name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-1"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    隐藏预览
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    预览
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave(false)}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-1" />
                保存草稿
              </Button>
              <Button
                size="sm"
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-500"
              >
                {isSaving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                ) : null}
                发布
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <div className={cn(
            'flex flex-col border-r transition-all duration-300',
            showPreview ? 'w-1/2' : 'w-full'
          )}>
            {/* Title Input */}
            <div className="px-6 py-4 border-b">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入文档标题..."
                className="text-xl font-semibold border-0 bg-transparent px-0 focus-visible:ring-0 placeholder:text-gray-400"
              />
            </div>

            {/* Toolbar */}
            <div className="px-4 py-2 border-b bg-gray-50 flex items-center gap-1 flex-wrap">
              {toolbarButtons.map((btn, index) => (
                btn.separator ? (
                  <Separator key={`sep-${index}`} orientation="vertical" className="h-5 mx-1" />
                ) : (
                  <button
                    key={index}
                    onClick={btn.action}
                    title={btn.title}
                    className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                  >
                    <btn.icon className="w-4 h-4 text-gray-600" />
                  </button>
                )
              ))}
            </div>

            {/* Content Editor */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始编写文档内容...（支持 Markdown 格式）"
                className="w-full h-full p-6 resize-none outline-none font-mono text-sm leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Footer Info */}
            <div className="px-4 py-2 border-t bg-gray-50 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>{content.length} 字符</span>
                <span>{content.split(/\s+/).filter(Boolean).length} 词</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span>自动保存中</span>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-1/2 flex flex-col bg-gray-50">
              <div className="px-4 py-2 border-b bg-white flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">预览</span>
                <Badge variant="outline" className="text-xs">实时</Badge>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-6 bg-white min-h-full">
                  {title && (
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
                  )}
                  {content ? (
                    <MarkdownRenderer content={content} />
                  ) : (
                    <p className="text-gray-400 italic">预览区域 - 开始输入内容查看效果</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Tags Panel */}
        <div className="px-6 py-3 border-t bg-gray-50 flex items-center gap-3">
          <Tag className="w-4 h-4 text-gray-400" />
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {tags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="gap-1 pr-1 bg-white"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-gray-200 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            <div className="flex items-center gap-1">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="添加标签..."
                className="h-7 w-32 text-xs"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                className="h-7 px-2"
              >
                添加
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
