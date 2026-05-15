import { motion } from "framer-motion";
import { FileText, Presentation, Images, Sparkles, ArrowRight } from "lucide-react";

const quickActions = [
  {
    icon: FileText,
    title: "写 SOP",
    desc: "标准操作流程",
    color: "#1E40AF",
    bgColor: "#EFF6FF",
  },
  {
    icon: Presentation,
    title: "生成PPT",
    desc: "市场策略报告",
    color: "#059669",
    bgColor: "#ECFDF5",
  },
  {
    icon: Images,
    title: "批量图文",
    desc: "社媒内容素材",
    color: "#D97706",
    bgColor: "#FFFBEB",
  },
];

function TechVisual() {
  return (
    <div className="relative w-full h-[400px] lg:h-[480px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-4 left-4 right-4 lg:left-8 lg:right-0 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-5 z-10"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#0F172A]">SOP写手Agent</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-xs text-[#64748B]">运行中</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="h-2.5 bg-[#EFF6FF] rounded-full w-full" />
          <div className="h-2.5 bg-[#F1F5F9] rounded-full w-[85%]" />
          <div className="h-2.5 bg-[#F1F5F9] rounded-full w-[70%]" />
          <div className="h-2.5 bg-[#EFF6FF] rounded-full w-[90%]" />
          <div className="h-2.5 bg-[#F1F5F9] rounded-full w-[60%]" />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 bg-[#EFF6FF] text-[#1E40AF] rounded-full font-medium">SOP</span>
          <span className="text-xs px-2.5 py-1 bg-[#ECFDF5] text-[#059669] rounded-full font-medium">PPT</span>
          <span className="text-xs px-2.5 py-1 bg-[#FFFBEB] text-[#D97706] rounded-full font-medium">图文</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute bottom-8 left-0 w-[200px] bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-4 z-20"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#059669] to-[#34D399] flex items-center justify-center text-white text-xs font-bold">
            ✓
          </div>
          <span className="text-xs font-medium text-[#0F172A]">任务完成</span>
        </div>
        <div className="space-y-1.5">
          <div className="h-2 bg-[#ECFDF5] rounded-full w-full" />
          <div className="h-2 bg-[#F1F5F9] rounded-full w-[75%]" />
        </div>
        <p className="mt-2 text-[10px] text-[#94A3B8]">刚刚生成 • 产品发布SOP</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute top-0 right-0 w-40 h-40 rounded-full border-2 border-[#DBEAFE] opacity-40 z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-12 right-8 w-24 h-24 rounded-full border-2 border-dashed border-[#DBEAFE] opacity-30 z-0"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute top-20 right-12 w-3 h-3 rounded-full bg-[#3B82F6] opacity-40 z-0"
      />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#1E40AF 1px, transparent 1px), linear-gradient(90deg, #1E40AF 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#EFF6FF] rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#1E40AF]" />
              <span className="text-sm font-medium text-[#1E40AF]">AI 驱动的 GTM 工作台</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#3B82F6]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0, 0, 0.2, 1], delay: 0.1 }}
              className="text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-[1.1] tracking-tight"
            >
              GTM{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]">
                智能中台
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0, 0, 0.2, 1], delay: 0.2 }}
              className="mt-6 text-lg text-[#64748B] leading-relaxed max-w-[480px]"
            >
              用 AI 驱动你的市场进入策略，知识库管理、智能 Agent、数据分析一站式解决
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0, 0, 0.2, 1], delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button className="flex items-center gap-2 px-6 h-12 bg-[#1E40AF] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30">
                <Sparkles className="w-4 h-4" />
                开始创建
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("agent-workshop");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-6 h-12 text-sm font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F1F5F9] hover:border-[#CBD5E1] transition-all duration-200"
              >
                了解更多
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0, 0, 0.2, 1], delay: 0.4 }}
              className="mt-10"
            >
              <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-3">
                快速开始
              </p>
              <div className="flex flex-wrap gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.08 }}
                    whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center gap-3 px-4 py-3 bg-[#FAFAFA] rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all duration-200"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: action.bgColor }}
                    >
                      <action.icon className="w-4 h-4" style={{ color: action.color }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#0F172A]">{action.title}</p>
                      <p className="text-[11px] text-[#94A3B8]">{action.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <TechVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
