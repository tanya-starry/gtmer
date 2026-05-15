import { motion } from "framer-motion";
import { FileText, Bot, TrendingUp } from "lucide-react";

const metrics = [
  {
    icon: FileText,
    value: "1,248",
    label: "文档生成",
    suffix: "",
  },
  {
    icon: Bot,
    value: "86",
    label: "Agent运行",
    suffix: "",
  },
  {
    icon: TrendingUp,
    value: "12.5",
    label: "转化率",
    suffix: "%",
  },
];

export function DataOverview() {
  return (
    <section className="bg-[#FAFAFA] py-12 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Section header */}
        <h2 className="text-2xl font-bold text-[#0F172A] mb-6">数据概览</h2>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * index }}
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(30,64,175,0.25)" }}
              className="relative overflow-hidden rounded-2xl p-6 lg:p-8 cursor-pointer transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
              }}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                  <metric.icon className="w-5 h-5 text-white" />
                </div>

                {/* Value */}
                <div className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  {metric.value}
                  <span className="text-2xl">{metric.suffix}</span>
                </div>

                {/* Label */}
                <p className="mt-2 text-sm text-white/70">{metric.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
