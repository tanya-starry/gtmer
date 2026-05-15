import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FileText, Clock, Zap, Search, X, Sparkles, FileUp } from "lucide-react";

const categories = ["全部", "SOP", "PPT", "图文", "数据分析"];

const documents = [
  { id: 1, tags: ["SOP"], title: "产品发布流程SOP", desc: "适用于新产品上市的标准操作流程，涵盖定价、渠道、推广全流程执行指南", date: "2026-04-15", uses: 24 },
  { id: 2, tags: ["PPT"], title: "Q2市场策略报告", desc: "基于Q1数据复盘，制定Q2增长策略与资源分配方案", date: "2026-04-12", uses: 8 },
  { id: 3, tags: ["图文"], title: "社媒内容素材包", desc: "4月社交媒体营销内容素材，含图文模板与发布排期", date: "2026-04-10", uses: 32 },
  { id: 4, tags: ["数据分析"], title: "竞品调研报告", desc: "主要竞品功能、定价、渠道策略对比分析", date: "2026-04-08", uses: 15 },
  { id: 5, tags: ["SOP"], title: "客户 Onboarding 流程", desc: "新客户引导标准流程，从签约到首次成功使用", date: "2026-04-05", uses: 45 },
  { id: 6, tags: ["PPT"], title: "销售培训手册", desc: "销售团队培训核心内容，含产品卖点、话术、异议处理", date: "2026-04-01", uses: 12 },
];

const tagColors: Record<string, string> = {
  SOP: "bg-[#EFF6FF] text-[#1E40AF]",
  PPT: "bg-[#ECFDF5] text-[#059669]",
  图文: "bg-[#FFFBEB] text-[#D97706]",
  数据分析: "bg-[#F3E8FF] text-[#7C3AED]",
};

export function KnowledgeSection() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDoc, setShowCreateDoc] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    const matchCategory = activeCategory === "全部" || doc.tags.includes(activeCategory);
    const matchSearch =
      searchQuery === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

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
              管理你的GTM文档、SOP和市场资料
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateDoc(true)}
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
            placeholder="搜索文档..."
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
          {filteredDocs.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.06 * index }}
              whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 transition-all duration-300 hover:border-[#CBD5E1] cursor-pointer group"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      tagColors[tag] || "bg-[#F1F5F9] text-[#64748B]"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-base font-semibold text-[#0F172A] group-hover:text-[#1E40AF] transition-colors duration-200 line-clamp-1">
                  {doc.title}
                </h3>
                <FileText className="w-4 h-4 text-[#CBD5E1] flex-shrink-0 mt-0.5" />
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2 mb-4">
                {doc.desc}
              </p>
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{doc.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>已使用 {doc.uses} 次</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText className="w-12 h-12 text-[#E2E8F0] mx-auto mb-3" />
            <p className="text-[#94A3B8] mb-2">没有找到匹配的文档</p>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("全部"); }}
                className="text-sm text-[#1E40AF] hover:underline"
              >
                清除搜索条件
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Create Document Modal - AnimatePresence must always be rendered */}
      <AnimatePresence>
        {showCreateDoc && (
          <motion.div
            key="create-doc-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCreateDoc(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
                <h2 className="text-xl font-bold text-[#0F172A]">新建文档</h2>
                <button
                  onClick={() => setShowCreateDoc(false)}
                  className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Doc Type */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">文档类型</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "SOP", icon: FileText, color: "#1E40AF", bg: "#EFF6FF" },
                      { label: "PPT", icon: FileUp, color: "#059669", bg: "#ECFDF5" },
                      { label: "图文", icon: Sparkles, color: "#D97706", bg: "#FFFBEB" },
                      { label: "数据分析", icon: Zap, color: "#7C3AED", bg: "#F3E8FF" },
                    ].map((type) => (
                      <button
                        key={type.label}
                        className="flex flex-col items-center gap-2 p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl hover:border-[#3B82F6] hover:bg-[#EFF6FF] transition-all duration-200"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: type.bg }}
                        >
                          <type.icon className="w-5 h-5" style={{ color: type.color }} />
                        </div>
                        <span className="text-xs font-medium text-[#0F172A]">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Doc Title */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">文档标题</label>
                  <input
                    type="text"
                    placeholder="例如：Q3市场推广SOP"
                    className="w-full h-12 px-4 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">文档描述</label>
                  <textarea
                    rows={3}
                    placeholder="简要描述文档内容..."
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all duration-200 resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">标签（可选）</label>
                  <div className="flex flex-wrap gap-2">
                    {["SOP", "PPT", "图文", "数据分析", "市场", "销售"].map((tag) => (
                      <label
                        key={tag}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAFAFA] border border-[#E2E8F0] rounded-full cursor-pointer hover:border-[#CBD5E1] transition-all duration-200"
                      >
                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#1E40AF]" />
                        <span className="text-xs text-[#0F172A]">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2 space-y-3">
                  <button
                    onClick={() => setShowCreateDoc(false)}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-[#1E40AF] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    创建文档
                  </button>
                  <button
                    onClick={() => setShowCreateDoc(false)}
                    className="w-full h-12 flex items-center justify-center gap-2 text-sm font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F1F5F9] hover:border-[#CBD5E1] transition-all duration-200"
                  >
                    取消
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
