import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Search, Clock, Type } from "lucide-react";
import { useDocuments } from "../hooks/useDocuments";
import { DocumentEditor } from "./DocumentEditor";

const categories = ["全部", "SOP", "PPT", "图文", "数据分析", "其他"];

function getCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("sop")) return "SOP";
  if (t.includes("ppt") || t.includes("报告") || t.includes("手册")) return "PPT";
  if (t.includes("图文") || t.includes("素材") || t.includes("社媒")) return "图文";
  if (t.includes("数据") || t.includes("分析") || t.includes("调研")) return "数据分析";
  return "其他";
}

const tagColors: Record<string, string> = {
  SOP: "bg-[#EFF6FF] text-[#1E40AF]",
  PPT: "bg-[#ECFDF5] text-[#059669]",
  图文: "bg-[#FFFBEB] text-[#D97706]",
  数据分析: "bg-[#F3E8FF] text-[#7C3AED]",
  其他: "bg-[#F1F5F9] text-[#64748B]",
};

export function KnowledgeSection() {
  const { documents, createDocument, updateDocument, deleteDocument, countChars, formatDate } = useDocuments();
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");

  // Editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);

  const editingDocument = useMemo(
    () => documents.find((d) => d.id === editingDoc) || null,
    [documents, editingDoc]
  );

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const cat = getCategory(doc.title);
      const matchCat = activeCategory === "全部" || cat === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        q === "" ||
        doc.title.toLowerCase().includes(q) ||
        doc.content.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [documents, activeCategory, searchQuery]);

  const handleCreate = () => {
    setEditingDoc(null);
    setEditorOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingDoc(id);
    setEditorOpen(true);
  };

  const handleSave = (title: string, content: string) => {
    if (editingDoc) {
      updateDocument(editingDoc, title, content);
    } else {
      createDocument(title, content);
    }
    setEditorOpen(false);
    setEditingDoc(null);
  };

  const handleDelete = () => {
    if (editingDoc && confirm("确定要删除这个文档吗？此操作不可撤销。")) {
      deleteDocument(editingDoc);
      setEditorOpen(false);
      setEditingDoc(null);
    }
  };

  return (
    <section id="knowledge-base" className="bg-[#FAFAFA] py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl lg:text-4xl font-bold text-[#1E40AF]"
            >
              我的知识库
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-2 text-[#64748B]"
            >
              共 {documents.length} 个文档
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 h-11 bg-[#1E40AF] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-500/20 self-start"
          >
            <Plus className="w-4 h-4" />
            新建文档
          </motion.button>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="搜索文档标题或内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all duration-200"
          />
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#1E40AF] text-white shadow-sm"
                  : "bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Documents grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDocs.map((doc, index) => {
              const cat = getCategory(doc.title);
              const chars = countChars(doc.content);
              return (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                  whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                  onClick={() => handleEdit(doc.id)}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-6 transition-all duration-300 hover:border-[#CBD5E1] cursor-pointer group"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        tagColors[cat] || tagColors["其他"]
                      }`}
                    >
                      {cat}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold text-[#0F172A] group-hover:text-[#1E40AF] transition-colors duration-200 line-clamp-1">
                      {doc.title}
                    </h3>
                    <FileText className="w-4 h-4 text-[#CBD5E1] flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(doc.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Type className="w-3 h-3" />
                      <span>{chars} 字</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredDocs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText className="w-12 h-12 text-[#E2E8F0] mx-auto mb-3" />
            <p className="text-[#94A3B8] mb-2">
              {documents.length === 0 ? "还没有文档，点击右上角创建" : "没有找到匹配的文档"}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("全部");
                }}
                className="text-sm text-[#1E40AF] hover:underline"
              >
                清除搜索条件
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Document Editor Modal */}
      <DocumentEditor
        isOpen={editorOpen}
        document={editingDocument}
        onSave={handleSave}
        onClose={() => {
          setEditorOpen(false);
          setEditingDoc(null);
        }}
        onDelete={editingDoc ? handleDelete : undefined}
      />
    </section>
  );
}
