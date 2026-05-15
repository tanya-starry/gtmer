import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, Clock, Zap, Search } from "lucide-react";

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

  const filteredDocs = documents.filter((doc) => {
    const matchCategory = activeCategory === "全部" || doc.tags.includes(activeCategory);
    const matchSearch = searchQuery === "" || doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <section id="knowledge-base" className="bg-[#FAFAFA] py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
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
            className="flex items-center gap-2 px-5 h-11 bg-[#1E40AF] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-500/20 self-start"
          >
            <Plus className="w-4 h-4" />
            新建文档
          </motion.button>
        </div>

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
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat ? "bg-[#1E40AF] text-white shadow-sm" : "bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]"}`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

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
                  <span key={tag} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${tagColors[tag] || "bg-[#F1F5F9] text-[#64748B]"}`}>
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
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-[#E2E8F0] mx-auto mb-3" />
            <p className="text-[#94A3B8]">没有找到匹配的文档</p>
          </div>
        )}
      </div>
    </section>
  );
}
