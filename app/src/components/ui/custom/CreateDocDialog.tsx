import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  FolderOpen,
  Database,
  FileText,
  ListOrdered,
  Briefcase,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocEditorDialog } from './DocEditorDialog';

type KnowledgeBaseType = 'my-knowledge' | 'external-knowledge';
type DocType = 'article' | 'sop' | 'case';

interface CreateDocDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDocDialog({ open, onOpenChange }: CreateDocDialogProps) {
  const [selectedKB, setSelectedKB] = useState<KnowledgeBaseType | null>(null);
  const [selectedType, setSelectedType] = useState<DocType | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Knowledge base options
  const kbOptions = [
    {
      id: 'my-knowledge' as KnowledgeBaseType,
      name: '我的知识库',
      description: '存储个人或团队的内部知识资料',
      icon: FolderOpen,
      color: 'blue'
    },
    {
      id: 'external-knowledge' as KnowledgeBaseType,
      name: '外脑知识库',
      description: '汇集外部专家、行业智库的知识资源',
      icon: Database,
      color: 'purple'
    }
  ];

  // Document type options
  const docTypeOptions = [
    {
      id: 'article' as DocType,
      name: '文章',
      description: '通用文档、指南、说明等',
      icon: FileText
    },
    {
      id: 'sop' as DocType,
      name: 'SOP',
      description: '标准操作程序文档',
      icon: ListOrdered
    },
    {
      id: 'case' as DocType,
      name: '案例',
      description: '成功案例、最佳实践',
      icon: Briefcase
    }
  ];

  const handleTypeSelect = (type: DocType) => {
    setSelectedType(type);
    setShowEditor(true);
  };

  const handleClose = () => {
    setSelectedKB(null);
    setSelectedType(null);
    setShowEditor(false);
    onOpenChange(false);
  };

  const handleBackToSelector = () => {
    setShowEditor(false);
    setSelectedType(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!bg-white max-w-2xl w-[90vw] max-h-[85vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-white">
          <DialogTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </span>
            创建文档
          </DialogTitle>
          <DialogDescription>
            选择知识库位置，创建新的文档
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 bg-white overflow-y-auto max-h-[60vh]">
          {/* Step 1: Select Knowledge Base */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              选择知识库位置
              <span className="text-red-500 ml-0.5">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {kbOptions.map((kb) => {
                const Icon = kb.icon;
                const isSelected = selectedKB === kb.id;
                return (
                  <button
                    key={kb.id}
                    onClick={() => setSelectedKB(kb.id)}
                    className={cn(
                      'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                      isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
                        isSelected
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-medium text-gray-900">{kb.name}</div>
                    <p className="text-sm text-gray-500 mt-1">{kb.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Document Type */}
          {selectedKB && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-sm font-medium">
                选择文档类型
                <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {docTypeOptions.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className={cn(
                        'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                        'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center mb-2 group-hover:bg-purple-500 group-hover:text-white">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="font-medium text-sm text-gray-900">{type.name}</div>
                      <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <div className="text-sm text-gray-500">
            {!selectedKB ? '请选择知识库位置' : '请选择文档类型'}
          </div>
        </div>
      </DialogContent>

      {/* Doc Editor Dialog */}
      {selectedKB && selectedType && (
        <DocEditorDialog
          open={showEditor}
          onOpenChange={(open) => {
            if (!open) {
              handleClose();
            }
          }}
          knowledgeBase={selectedKB}
          docType={selectedType}
          onBack={handleBackToSelector}
        />
      )}
    </Dialog>
  );
}
