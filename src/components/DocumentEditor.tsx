import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Save, Bold, Heading, List, ListOrdered, Quote, Code,
  Trash2, Pencil, CheckCircle, Type, Clock,
} from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { Document } from "../hooks/useDocuments";

interface DocumentEditorProps {
  isOpen: boolean;
  document: Document | null;  // null = create, has id = read/edit
  mode: "create" | "read" | "edit";
  onSave: (title: string, content: string) => void;
  onClose: () => void;
  onDelete?: () => void;
  onSwitchMode?: (mode: "read" | "edit") => void;
}

const toolbarButtons = [
  { icon: Bold, label: "加粗", prefix: "**", suffix: "**" },
  { icon: Heading, label: "标题", prefix: "## ", suffix: "" },
  { icon: List, label: "列表", prefix: "- ", suffix: "" },
  { icon: ListOrdered, label: "编号", prefix: "1. ", suffix: "" },
  { icon: Quote, label: "引用", prefix: "> ", suffix: "" },
  { icon: Code, label: "代码", prefix: "```\n", suffix: "\n```" },
];

export function DocumentEditor({
  isOpen,
  document,
  mode,
  onSave,
  onClose,
  onDelete,
  onSwitchMode,
}: DocumentEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handlePublish = () => {
    if (!title.trim()) return;
    onSave(title, content);
  };

  const charCount = content.replace(/\s/g, "").length;
  const isEditMode = mode === "create" || mode === "edit";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="doc-editor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className={`bg-white rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-[92vh] flex flex-col overflow-hidden ${mode === "read" ? "sm:max-w-[80vw]" : "sm:max-w-[800px]"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ========== Header ========== */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E2E8F0] flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {/* Create mode: input field */}
                {mode === "create" && (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="文档标题"
                    className="flex-1 text-lg font-semibold text-[#0F172A] placeholder:text-[#94A3B8] bg-transparent outline-none"
                  />
                )}
                {/* Read/Edit mode: display title */}
                {mode !== "create" && (
                  <h2 className="text-lg font-semibold text-[#0F172A] truncate">
                    {document?.title}
                  </h2>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Read mode: Edit button */}
                {mode === "read" && onSwitchMode && (
                  <button
                    onClick={() => onSwitchMode("edit")}
                    className="flex items-center gap-1.5 px-3 h-9 text-xs font-medium text-[#1E40AF] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    编辑
                  </button>
                )}
                {/* Edit mode: delete button */}
                {mode === "edit" && onDelete && (
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

            {/* ========== Toolbar (edit modes only) ========== */}
            {isEditMode && (
              <div className="flex items-center gap-1 px-5 sm:px-6 py-2 border-b border-[#E2E8F0] bg-[#FAFAFA] flex-shrink-0">
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
                <span className="ml-auto text-xs text-[#94A3B8]">{charCount} 字</span>
              </div>
            )}

            {/* ========== Content ========== */}
            <div className="flex-1 overflow-y-auto">
              {/* --- Create / Edit mode: textarea --- */}
              {isEditMode && (
                <div className="h-full flex flex-col">
                  {/* Show title input in edit mode for existing doc */}
                  {mode === "edit" && (
                    <div className="px-5 sm:px-6 pt-4 pb-2">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="文档标题"
                        className="w-full text-xl font-bold text-[#0F172A] placeholder:text-[#94A3B8] bg-transparent outline-none"
                      />
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="开始编写文档内容... 支持 Markdown 格式"
                    className="flex-1 w-full px-5 sm:px-6 py-4 text-sm text-[#0F172A] placeholder:text-[#CBD5E1] bg-white resize-none outline-none leading-relaxed"
                  />
                </div>
              )}

              {/* --- Read mode: rendered markdown --- */}
              {mode === "read" && document && (
                <div className="px-5 sm:px-6 py-6">
                  {/* Meta info */}
                  <div className="flex items-center gap-4 mb-6 text-xs text-[#94A3B8]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>创建于 {formatDate(document.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Type className="w-3.5 h-3.5" />
                      <span>{charCount} 字</span>
                    </div>
                    <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#059669] rounded-full text-[10px] font-medium">
                      已发布
                    </span>
                  </div>

                  {/* Markdown content */}
                  {content.trim() ? (
                    <div
                      className="prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(marked(content) as string),
                      }}
                    />
                  ) : (
                    <p className="text-[#94A3B8] italic">文档暂无内容</p>
                  )}
                </div>
              )}
            </div>

            {/* ========== Footer ========== */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-[#E2E8F0] flex-shrink-0">
              {/* Create mode */}
              {mode === "create" && (
                <>
                  <span className="text-xs text-[#94A3B8]">支持 Markdown 格式</span>
                  <button
                    onClick={handlePublish}
                    disabled={!title.trim()}
                    className="flex items-center gap-2 px-5 h-10 bg-[#1E40AF] hover:bg-[#2563EB] disabled:bg-[#CBD5E1] disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    发布文档
                  </button>
                </>
              )}

              {/* Edit mode */}
              {mode === "edit" && (
                <>
                  <button
                    onClick={() => onSwitchMode?.("read")}
                    className="text-sm text-[#64748B] hover:text-[#0F172A] px-3 py-2 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={!title.trim()}
                    className="flex items-center gap-2 px-5 h-10 bg-[#1E40AF] hover:bg-[#2563EB] disabled:bg-[#CBD5E1] disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    发布
                  </button>
                </>
              )}

              {/* Read mode */}
              {mode === "read" && (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-[#94A3B8]">
                    Markdown 渲染 · 只读模式
                  </span>
                  {onSwitchMode && (
                    <button
                      onClick={() => onSwitchMode("edit")}
                      className="flex items-center gap-1.5 px-4 h-9 text-xs font-medium text-[#1E40AF] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-lg transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      编辑文档
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
