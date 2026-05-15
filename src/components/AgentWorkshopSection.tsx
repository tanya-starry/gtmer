import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Play, Pause, Sparkles, X, ChevronRight } from "lucide-react";

interface Agent {
  id: number;
  name: string;
  status: "运行中" | "闲置";
  specialty: string;
  model: string;
  skills: number;
  avatar: string;
  color: string;
}

const initialAgents: Agent[] = [
  { id: 1, name: "SOP写手Agent", status: "运行中", specialty: "撰写标准操作流程、使用手册、培训文档", model: "GPT-4o", skills: 3, avatar: "🤖", color: "#1E40AF" },
  { id: 2, name: "数据分析Agent", status: "闲置", specialty: "市场数据分析、竞品报告、趋势洞察", model: "Claude-3.5", skills: 2, avatar: "📊", color: "#059669" },
  { id: 3, name: "内容助手Agent", status: "运行中", specialty: "社媒内容创作、文案撰写、图文排版", model: "GPT-4o", skills: 4, avatar: "📝", color: "#D97706" },
  { id: 4, name: "PPT设计师Agent", status: "闲置", specialty: "生成演示文稿、数据可视化、演讲备注", model: "Claude-3.5", skills: 2, avatar: "🎨", color: "#7C3AED" },
  { id: 5, name: "SEO优化Agent", status: "闲置", specialty: "关键词分析、内容优化、搜索排名提升", model: "GPT-4o", skills: 3, avatar: "🌐", color: "#0891B2" },
  { id: 6, name: "邮件营销Agent", status: "闲置", specialty: "邮件模板设计、营销文案、发送策略", model: "Claude-3.5", skills: 2, avatar: "📧", color: "#BE185D" },
  { id: 7, name: "广告投放Agent", status: "运行中", specialty: "广告创意、投放策略、ROI优化", model: "GPT-4o", skills: 3, avatar: "📢", color: "#EA580C" },
  { id: 8, name: "代码助手Agent", status: "闲置", specialty: "技术文档、API对接、代码示例生成", model: "Claude-3.5", skills: 2, avatar: "💻", color: "#4F46E5" },
];

const skillList = [
  { name: "sop_writer", label: "SOP撰写", desc: "生成标准操作流程文档" },
  { name: "ppt_generator", label: "PPT生成", desc: "自动创建演示文稿" },
  { name: "batch_content", label: "批量图文", desc: "批量生成社交媒体内容" },
  { name: "data_analyst", label: "数据分析", desc: "分析市场数据与趋势" },
  { name: "seo_optimizer", label: "SEO优化", desc: "优化内容与关键词" },
  { name: "email_writer", label: "邮件营销", desc: "撰写营销邮件文案" },
];

export function AgentWorkshopSection() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showCreatePanel, setShowCreatePanel] = useState(false);

  // Listen for open-create-agent event from Navbar/Hero
  useEffect(() => {
    const handler = () => setShowCreatePanel(true);
    window.addEventListener("open-create-agent", handler);
    return () => window.removeEventListener("open-create-agent", handler);
  }, []);

  const toggleAgentStatus = (agentId: number) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, status: a.status === "运行中" ? "闲置" : "运行中" }
          : a
      )
    );
    // Also update selectedAgent if it's the one being toggled
    setSelectedAgent((prev) =>
      prev && prev.id === agentId
        ? { ...prev, status: prev.status === "运行中" ? "闲置" : "运行中" }
        : prev
    );
  };

  const selectedAgentData = selectedAgent
    ? agents.find((a) => a.id === selectedAgent.id) || selectedAgent
    : null;

  return (
    <section id="agent-workshop" className="bg-white py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-10">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl lg:text-4xl font-bold text-[#1E40AF]"
            >
              Agent工坊
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-2 text-[#64748B]"
            >
              配置你的AI助手，自动化GTM工作流程
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreatePanel(true)}
            className="flex items-center gap-2 px-5 h-11 bg-[#1E40AF] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-500/20 self-start"
          >
            <Sparkles className="w-4 h-4" />
            创建Agent
          </motion.button>
        </div>

        {/* Agents grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 * index }}
              whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 transition-all duration-300 hover:border-[#CBD5E1] group cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedAgent(agent)}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-4 bottom-4 w-1 rounded-full transition-colors duration-300"
                style={{ backgroundColor: agent.status === "运行中" ? agent.color : "#E2E8F0" }}
              />

              {/* Avatar & Name */}
              <div className="flex items-center gap-3 mb-3 pl-2">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${agent.color}10` }}
                >
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[#0F172A] truncate group-hover:text-[#1E40AF] transition-colors duration-200">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: agent.status === "运行中" ? "#10B981" : "#94A3B8" }}
                    />
                    <span className="text-xs text-[#64748B]">{agent.status}</span>
                  </div>
                </div>
              </div>

              {/* Specialty */}
              <p className="text-xs text-[#64748B] leading-relaxed mb-4 pl-2 line-clamp-2">
                {agent.specialty}
              </p>

              {/* Meta info */}
              <div className="flex items-center justify-between pl-2 mb-4">
                <span className="text-xs text-[#94A3B8]">模型：{agent.model}</span>
                <span className="text-xs text-[#94A3B8]">技能：{agent.skills}个</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pl-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAgent(agent);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 h-9 text-xs font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F1F5F9] hover:border-[#CBD5E1] transition-all duration-200"
                >
                  <Settings className="w-3.5 h-3.5" />
                  配置
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAgentStatus(agent.id);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 h-9 text-xs font-medium rounded-xl transition-all duration-200 shadow-sm ${
                    agent.status === "运行中"
                      ? "text-[#64748B] bg-[#F1F5F9] hover:bg-[#E2E8F0]"
                      : "text-white bg-[#1E40AF] hover:bg-[#2563EB] hover:shadow-md hover:shadow-blue-500/20"
                  }`}
                >
                  {agent.status === "运行中" ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      暂停
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      运行
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Agent Config Panel */}
      <AnimatePresence>
        {selectedAgentData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ x: 380, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 380, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-[420px] bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel header */}
              <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${selectedAgentData.color}10` }}
                  >
                    {selectedAgentData.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#0F172A]">
                      {selectedAgentData.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: selectedAgentData.status === "运行中" ? "#10B981" : "#94A3B8" }}
                      />
                      <span className="text-xs text-[#64748B]">{selectedAgentData.status}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Panel content */}
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">擅长领域</label>
                  <p className="mt-1.5 text-sm text-[#0F172A]">{selectedAgentData.specialty}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">使用模型</label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-[#EFF6FF] text-[#1E40AF] text-sm font-medium rounded-lg">
                      {selectedAgentData.model}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                    技能配置（{selectedAgentData.skills}个）
                  </label>
                  <div className="mt-2 space-y-2">
                    {skillList.slice(0, selectedAgentData.skills).map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-xl border border-[#E2E8F0]"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">{skill.label}</p>
                          <p className="text-xs text-[#94A3B8]">{skill.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => toggleAgentStatus(selectedAgentData.id)}
                    className={`w-full h-11 flex items-center justify-center gap-2 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm ${
                      selectedAgentData.status === "运行中"
                        ? "text-[#64748B] bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#E2E8F0]"
                        : "text-white bg-[#1E40AF] hover:bg-[#2563EB] hover:shadow-md"
                    }`}
                  >
                    {selectedAgentData.status === "运行中" ? (
                      <><Pause className="w-4 h-4" />暂停Agent</>
                    ) : (
                      <><Play className="w-4 h-4" />运行Agent</>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="w-full h-11 flex items-center justify-center gap-2 text-sm font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F1F5F9] hover:border-[#CBD5E1] transition-all duration-200"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Agent Modal */}
      <AnimatePresence>
        {showCreatePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCreatePanel(false)}
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
                <h2 className="text-xl font-bold text-[#0F172A]">创建Agent</h2>
                <button
                  onClick={() => setShowCreatePanel(false)}
                  className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Agent名称</label>
                  <input
                    type="text"
                    placeholder="例如：内容创作助手"
                    className="w-full h-12 px-4 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">选择模型</label>
                  <div className="grid grid-cols-2 gap-3">
                    {["GPT-4o", "Claude-3.5", "GPT-4", "Claude-3"].map((model) => (
                      <button
                        key={model}
                        className="flex items-center gap-2 p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] hover:border-[#3B82F6] hover:bg-[#EFF6FF] transition-all duration-200"
                      >
                        <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                        {model}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">选择技能</label>
                  <div className="space-y-2">
                    {skillList.map((skill) => (
                      <label
                        key={skill.name}
                        className="flex items-center gap-3 p-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl cursor-pointer hover:border-[#CBD5E1] transition-all duration-200"
                      >
                        <input type="checkbox" className="w-4 h-4 rounded border-[#CBD5E1] text-[#1E40AF] focus:ring-[#3B82F6]" />
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">{skill.label}</p>
                          <p className="text-xs text-[#94A3B8]">{skill.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">擅长领域描述</label>
                  <textarea
                    rows={3}
                    placeholder="描述这个Agent的核心能力和使用场景..."
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all duration-200 resize-none"
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    onClick={() => setShowCreatePanel(false)}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-[#1E40AF] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    创建Agent
                  </button>
                  <button
                    onClick={() => setShowCreatePanel(false)}
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
