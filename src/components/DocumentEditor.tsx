import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Bold, Heading, List, ListOrdered, Quote, Code, Trash2 } from "lucide-react";
import type { Document } from "../hooks/useDocuments";

interface DocumentEditorProps {
  isOpen: boolean;
  document: Document | null;
  onSave: (title: string, content: string) => void;
  onClose: () => void;
  onDelete?: () => void;
}

const toolbarButtons = [
  { icon: Bold, label: "加粗", prefix: "**", suffix: "**" },
  { icon: Heading, label: "标题", prefix: "## ", suffix: "" },
  { icon: List, label: "列表", prefix: "- ", suffix: "" },
  { icon: ListOrdered, label: "编号", prefix: "1. ", suffix: "" },
  { icon: Quote, label: "引用", prefix: "> ", suffix: "" },
  { icon: Code, label: "代码", prefix: "```\n", suffix: "\n```" },
];

export function DocumentEditor({ isOpen, document, onSave, onClose, onDelete }: DocumentEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isEditing = !!document;

  useEffect(() => {
    if (isOpen) {
      setTitle(document?.title || "");
      setContent(document?.content || "");
    }
  }, [isOpen, document]);

  const insertMarkdown = (prefix: string, suffix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end);
    const before = content.slice(0, start);
    const after = content.slice(end);
    const newContent = before + prefix + selected + suffix + after;
    setContent(newContent);
    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + prefix.length + selected.length;
      ta.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title, content);
  };

  const charCount = content.replace(/\s/g, "").length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="doc-editor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[720px] max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] flex-shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="文档标题"
                  className="flex-1 text-lg font-semibold text-[#0F172A] placeholder:text-[#94A3B8] bg-transparent outline-none"
                />
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-[#94A3B8] mr-2">{charCount} 字</span>
                {isEditing && onDelete && (
                  <button
                    onClick={onDelete}
                    className="p-2 text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
                    title="删除文档"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 px-6 py-2 border-b border-[#E2E8F0] bg-[#FAFAFA] flex-shrink-0">
              {toolbarButtons.map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => insertMarkdown(btn.prefix, btn.suffix)}
                  title={btn.label}
                  className="p-2 text-[#64748B] hover:text-[#1E40AF] hover:bg-white rounded-lg transition-all duration-150"
                >
                  <btn.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始编写文档内容... 支持 Markdown 格式"
                className="w-full h-full p-6 text-sm text-[#0F172A] placeholder:text-[#CBD5E1] bg-white resize-none outline-none leading-relaxed"
                style={{ minHeight: "320px" }}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0] flex-shrink-0">
              <span className="text-xs text-[#94A3B8]">
                {isEditing ? "编辑模式" : "创建新文档"} · 支持 Markdown
              </span>
              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="flex items-center gap-2 px-5 h-10 bg-[#1E40AF] hover:bg-[#2563EB] disabled:bg-[#CBD5E1] disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
