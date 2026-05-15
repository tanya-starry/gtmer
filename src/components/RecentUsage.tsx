import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, FileText, Clock, Zap } from "lucide-react";

const recentItems = [
  {
    id: 1,
    tags: ["SOP"],
    title: "产品发布流程SOP",
    desc: "适用于新产品上市的标准操作流程，涵盖定价、渠道、推广全流程",
    date: "2026-04-15",
    uses: 24,
  },
  {
    id: 2,
    tags: ["PPT"],
    title: "Q2市场策略报告",
    desc: "基于Q1数据复盘，制定Q2增长策略与资源分配方案",
    date: "2026-04-12",
    uses: 8,
  },
  {
    id: 3,
    tags: ["图文"],
    title: "社媒内容素材包",
    desc: "4月社交媒体营销内容素材，含图文模板与发布排期",
    date: "2026-04-10",
    uses: 32,
  },
  {
    id: 4,
    tags: ["数据分析"],
    title: "竞品调研报告",
    desc: "主要竞品功能、定价、渠道策略对比分析",
    date: "2026-04-08",
    uses: 15,
  },
];

const tagColors: Record<string, string> = {
  SOP: "bg-[#EFF6FF] text-[#1E40AF]",
  PPT: "bg-[#ECFDF5] text-[#059669]",
  图文: "bg-[#FFFBEB] text-[#D97706]",
  数据分析: "bg-[#F3E8FF] text-[#7C3AED]",
};

export function RecentUsage() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#FAFAFA] py-12 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0F172A]">最近使用</h2>
          <button
            onClick={() => navigate("/knowledge")}
            className="flex items-center gap-1 text-sm text-[#64748B] hover:text-[#1E40AF] transition-colors duration-200 group"
          >
            查看全部
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * index }}
              whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
              onClick={() => navigate("/knowledge")}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 cursor-pointer transition-all duration-300 hover:border-[#CBD5E1] group"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map((tag) => (
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

              {/* Title & icon */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-lg font-semibold text-[#0F172A] group-hover:text-[#1E40AF] transition-colors duration-200">
                  {item.title}
                </h3>
                <FileText className="w-5 h-5 text-[#CBD5E1] flex-shrink-0 mt-1" />
              </div>

              {/* Description */}
              <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2 mb-4">
                {item.desc}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>已使用 {item.uses} 次</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
