import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Settings, Play, Bot, BarChart3, PenTool, Palette } from "lucide-react";

const agents = [
  {
    id: 1,
    name: "SOP写手Agent",
    icon: Bot,
    status: "运行中",
    statusColor: "#10B981",
    specialty: "撰写标准操作流程、使用手册、培训文档",
    model: "GPT-4o",
    skills: 3,
    avatar: "🤖",
  },
  {
    id: 2,
    name: "数据分析Agent",
    icon: BarChart3,
    status: "闲置",
    statusColor: "#94A3B8",
    specialty: "市场数据分析、竞品报告、趋势洞察",
    model: "Claude-3.5",
    skills: 2,
    avatar: "📊",
  },
  {
    id: 3,
    name: "内容助手Agent",
    icon: PenTool,
    status: "运行中",
    statusColor: "#10B981",
    specialty: "社媒内容创作、文案撰写、图文排版",
    model: "GPT-4o",
    skills: 4,
    avatar: "📝",
  },
  {
    id: 4,
    name: "PPT设计师Agent",
    icon: Palette,
    status: "闲置",
    statusColor: "#94A3B8",
    specialty: "生成演示文稿、数据可视化、演讲备注",
    model: "Claude-3.5",
    skills: 2,
    avatar: "🎨",
  },
];

export function MyAgents() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0F172A]">我的Agent</h2>
          <button
            onClick={() => navigate("/agents")}
            className="flex items-center gap-1 text-sm text-[#64748B] hover:text-[#1E40AF] transition-colors duration-200 group"
          >
            管理
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Agents grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * index }}
              whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 transition-all duration-300 hover:border-[#CBD5E1] group relative overflow-hidden"
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
                style={{ backgroundColor: agent.status === "运行中" ? "#3B82F6" : "#E2E8F0" }}
              />

              {/* Avatar & Name */}
              <div className="flex items-center gap-3 mb-3 pl-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center justify-center text-xl">
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#0F172A] truncate">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: agent.statusColor }}
                    />
                    <span className="text-xs text-[#64748B]">{agent.status}</span>
                  </div>
                </div>
              </div>

              {/* Specialty */}
              <p className="text-xs text-[#64748B] leading-relaxed mb-4 pl-2 line-clamp-2">
                擅长：{agent.specialty}
              </p>

              {/* Meta info */}
              <div className="flex items-center gap-3 pl-2 mb-4 text-xs text-[#94A3B8]">
                <span>模型：{agent.model}</span>
                <span>技能：{agent.skills}个</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pl-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/agents");
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 h-9 text-xs font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F1F5F9] hover:border-[#CBD5E1] transition-all duration-200"
                >
                  <Settings className="w-3.5 h-3.5" />
                  配置
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/agents");
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 h-9 text-xs font-medium text-white bg-[#1E40AF] rounded-xl hover:bg-[#2563EB] transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-500/20"
                >
                  <Play className="w-3.5 h-3.5" />
                  运行
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
