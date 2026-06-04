import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Play, Sparkles, X, Plus, Trash2, Bot, Wand2 } from "lucide-react";
import { useAgents } from "../hooks/useAgents";
import { SKILL_TEMPLATES, getSkillLabels, composeSystemPrompt } from "../data/skills";
import type { Agent, ModelType } from "../hooks/useAgents";
import { AgentChatModal } from "./AgentChatModal";

const MODEL_OPTIONS: { value: ModelType; label: string; desc: string; disabled?: boolean }[] = [
  { value: "kimi-moonshot-v1", label: "Kimi Moonshot", desc: "月之暗面 · 推荐" },
  { value: "gpt-4o", label: "GPT-4o", desc: "OpenAI", disabled: true },
  { value: "claude-3-5-sonnet", label: "Claude 3.5", desc: "Anthropic", disabled: true },
  { value: "llama-3-70b", label: "Llama 3 70B", desc: "Meta", disabled: true },
];

interface AgentWorkshopSectionProps {
  isAdmin: boolean;
}

export function AgentWorkshopSection({ isAdmin }: AgentWorkshopSectionProps) {
  const { agents, createAgent, deleteAgent } = useAgents();

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newModel, setNewModel] = useState<ModelType>("kimi-moonshot-v1");
  const [newPrompt, setNewPrompt] = useState("");
  const [newWelcomeMessage, setNewWelcomeMessage] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSkillIds, setNewSkillIds] = useState<string[]>([]);

  // Chat modal
  const [chatAgent, setChatAgent] = useState<Agent | null>(null);

  // Config panel
  const [configAgent, setConfigAgent] = useState<Agent | null>(null);

  const toggleSkill = (skillId: string) => {
    setNewSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    createAgent(newName, newModel, newPrompt, newSkillIds, newWelcomeMessage, newDescription);
    setNewName("");
    setNewModel("kimi-moonshot-v1");
    setNewPrompt("");
    setNewWelcomeMessage("");
    setNewDescription("");
    setNewSkillIds([]);
    setShowCreate(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个 Agent 吗？此操作不可撤销。")) {
      deleteAgent(id);
      if (configAgent?.id === id) setConfigAgent(null);
    }
  };

  // Preview composed prompt
  const composedPreview = composeSystemPrompt(newPrompt, newSkillIds);

  return (
    <section id="agent-workshop" className="bg-white py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Header */}
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
              共 {agents.length} 个 Agent · 每个 Agent 可叠加多个 Skill
            </motion.p>
          </div>
          {/* Create button - admin only */}
          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-5 h-11 bg-[#1E40AF] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-500/20 self-start"
            >
              <Sparkles className="w-4 h-4" />
              创建Agent
            </motion.button>
          )}
        </div>

        {/* Agents grid */}
        {agents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-[#FAFAFA] rounded-2xl border border-dashed border-[#E2E8F0]"
          >
            <Bot className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-[#64748B] mb-1">还没有 Agent</p>
            {isAdmin && (
              <p className="text-sm text-[#94A3B8]">点击右上角创建你的第一个 AI 助手</p>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {agents.map((agent, index) => {
                const skillLabels = getSkillLabels(agent.skills);
                return (
                  <motion.div
                    key={agent.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
                    whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-5 transition-all duration-300 hover:border-[#CBD5E1] relative overflow-hidden group"
                  >
                    <div
                      className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
                      style={{ backgroundColor: agent.color }}
                    />

                    <div className="flex items-center gap-3 mb-3 pl-2">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${agent.color}10` }}
                      >
                        {agent.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#0F172A] truncate">
                          {agent.name}
                        </h3>
                        <span className="text-xs text-[#94A3B8]">{agent.model}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#64748B] leading-relaxed mb-3 pl-2 line-clamp-2">
                      {agent.description || agent.systemPrompt || "暂无自定义提示词"}
                    </p>

                    {/* Skills */}
                    {skillLabels.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-4 pl-2 flex-wrap">
                        <Wand2 className="w-3 h-3 text-[#3B82F6] flex-shrink-0" />
                        {skillLabels.slice(0, 3).map((label) => (
                          <span
                            key={label}
                            className="px-2 py-0.5 bg-[#EFF6FF] text-[#1E40AF] text-[10px] font-medium rounded-full"
                          >
                            {label}
                          </span>
                        ))}
                        {skillLabels.length > 3 && (
                          <span className="text-[10px] text-[#94A3B8]">
                            +{skillLabels.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pl-2">
                      <button
                        onClick={() => setConfigAgent(agent)}
                        className="flex-1 flex items-center justify-center gap-1.5 h-9 text-xs font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F1F5F9] hover:border-[#CBD5E1] transition-all duration-200"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        配置
                      </button>
                      <button
                        onClick={() => setChatAgent(agent)}
                        className="flex-1 flex items-center justify-center gap-1.5 h-9 text-xs font-medium text-white bg-[#1E40AF] rounded-xl hover:bg-[#2563EB] transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Play className="w-3.5 h-3.5" />
                        运行
                      </button>
                    </div>

                    {/* Delete button - admin only */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(agent.id)}
                        className="absolute top-3 right-3 p-1.5 text-[#CBD5E1] hover:text-[#EF4444] hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ========== Create Agent Modal ========== */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            key="create-agent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
                <h2 className="text-xl font-bold text-[#0F172A]">创建Agent</h2>
                <button
                  onClick={() => setShowCreate(false)}
                  className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Agent 名称 <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="例如：SOP写手Agent"
                    className="w-full h-12 px-4 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    一句话描述
                  </label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="例如：帮你快速撰写标准操作流程文档"
                    className="w-full h-12 px-4 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all duration-200"
                  />
                  <p className="text-xs text-[#94A3B8] mt-1">
                    显示在 Agent 卡片上的简短描述。留空则显示系统提示词的前两句。
                  </p>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">选择模型</label>
                  <div className="grid grid-cols-1 gap-2">
                    {MODEL_OPTIONS.map((m) => (
                      <label
                        key={m.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                          newModel === m.value
                            ? "border-[#3B82F6] bg-[#EFF6FF]"
                            : "border-[#E2E8F0] bg-[#FAFAFA] hover:border-[#CBD5E1]"
                        } ${m.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <input
                          type="radio"
                          name="model"
                          value={m.value}
                          checked={newModel === m.value}
                          onChange={() => !m.disabled && setNewModel(m.value)}
                          disabled={m.disabled}
                          className="w-4 h-4 text-[#1E40AF] accent-[#1E40AF]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#0F172A]">{m.label}</span>
                            {m.disabled && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-[#F1F5F9] text-[#94A3B8] rounded-full">
                                暂不可用
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#94A3B8]">{m.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* System Prompt */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    系统提示词（System Prompt）
                  </label>
                  <textarea
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    rows={3}
                    placeholder="定义这个 Agent 的基础角色和能力，例如：你是一位资深的市场营销专家..."
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all duration-200 resize-none leading-relaxed"
                  />
                  <p className="text-xs text-[#94A3B8] mt-1">
                    系统提示词定义 Agent 的基础人格，Skill 模板会在其基础上叠加专业能力
                  </p>
                </div>

                {/* ========== Skill Templates ========== */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    选择 Skill 模板（可多选）
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SKILL_TEMPLATES.map((skill) => {
                      const isSelected = newSkillIds.includes(skill.id);
                      return (
                        <button
                          key={skill.id}
                          onClick={() => toggleSkill(skill.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                            isSelected
                              ? "border-[#3B82F6] bg-[#EFF6FF] shadow-sm"
                              : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#FAFAFA]"
                          }`}
                        >
                          <span className="text-xl flex-shrink-0 mt-0.5">{skill.icon}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-[#0F172A]">
                                {skill.label}
                              </span>
                              {isSelected && (
                                <Sparkles className="w-3 h-3 text-[#3B82F6]" />
                              )}
                            </div>
                            <p className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-1">
                              {skill.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preview composed prompt */}
                {newSkillIds.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
                      拼接后的 System Prompt 预览
                    </label>
                    <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed max-h-[120px] overflow-y-auto whitespace-pre-wrap font-mono">
                      {composedPreview}
                    </div>
                  </div>
                )}

                {/* Welcome Message */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    欢迎语
                  </label>
                  <textarea
                    value={newWelcomeMessage}
                    onChange={(e) => setNewWelcomeMessage(e.target.value)}
                    rows={2}
                    placeholder="你好！我是你的 SOP 写手助手，请告诉我你需要撰写的流程～"
                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all duration-200 resize-none leading-relaxed"
                  />
                  <p className="text-xs text-[#94A3B8] mt-1">
                    用户打开对话窗口时看到的欢迎消息。留空则显示默认欢迎语。
                  </p>
                </div>

                {/* Submit */}
                <div className="pt-2 space-y-3">
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-[#1E40AF] hover:bg-[#2563EB] disabled:bg-[#CBD5E1] disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    创建Agent
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
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

      {/* ========== Config Panel ========== */}
      <AnimatePresence>
        {configAgent && (
          <motion.div
            key="config-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setConfigAgent(null)}
          >
            <motion.div
              initial={{ x: 380, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 380, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-[420px] bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${configAgent.color}10` }}
                  >
                    {configAgent.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#0F172A]">{configAgent.name}</h3>
                    <span className="text-xs text-[#94A3B8]">{configAgent.model}</span>
                  </div>
                </div>
                <button
                  onClick={() => setConfigAgent(null)}
                  className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* System Prompt */}
                <div>
                  <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                    系统提示词
                  </label>
                  <div className="mt-2 p-3 bg-[#FAFAFA] rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                    {configAgent.systemPrompt || "（无自定义提示词）"}
                  </div>
                </div>

                {/* Composed Prompt */}
                <div>
                  <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                    完整 System Prompt（含 Skill）
                  </label>
                  <div className="mt-2 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto font-mono">
                    {composeSystemPrompt(configAgent.systemPrompt, configAgent.skills)}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                    已启用 Skill（{configAgent.skills.length}个）
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {configAgent.skills.length === 0 && (
                      <span className="text-sm text-[#94A3B8]">未设置 Skill</span>
                    )}
                    {configAgent.skills.map((id) => {
                      const skill = SKILL_TEMPLATES.find((s) => s.id === id);
                      return skill ? (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#EFF6FF] text-[#1E40AF] text-xs font-medium rounded-full"
                        >
                          <span>{skill.icon}</span>
                          {skill.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Conversation Flow */}
                {configAgent.conversationFlow.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                      对话流程（{configAgent.conversationFlow.length}步）
                    </label>
                    <div className="mt-2 space-y-2">
                      {configAgent.conversationFlow.map((step, i) => (
                        <div key={step.id} className="flex gap-3 p-3 bg-[#FAFAFA] rounded-xl border border-[#E2E8F0]">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-[#0F172A]">{step.title}</div>
                            <div className="text-xs text-[#64748B] mt-0.5">{step.goal}</div>
                            {step.options && step.options.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {step.options.map((opt) => (
                                  <span key={opt} className="px-2 py-0.5 bg-white text-[#64748B] text-[10px] rounded-full border border-[#E2E8F0]">
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => {
                      setConfigAgent(null);
                      setChatAgent(configAgent);
                    }}
                    className="w-full h-11 flex items-center justify-center gap-2 bg-[#1E40AF] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Play className="w-4 h-4" />
                    运行Agent
                  </button>
                  <button
                    onClick={() => setConfigAgent(null)}
                    className="w-full h-11 flex items-center justify-center gap-2 text-sm font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F1F5F9] hover:border-[#CBD5E1] transition-all duration-200"
                  >
                    关闭
                  </button>
                  {/* Delete button - admin only */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(configAgent.id)}
                      className="w-full h-11 flex items-center justify-center gap-2 text-sm font-medium text-[#EF4444] border border-[#FECACA] rounded-xl hover:bg-red-50 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除Agent
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== Chat Modal ========== */}
      <AgentChatModal
        isOpen={!!chatAgent}
        agent={chatAgent}
        onClose={() => setChatAgent(null)}
      />
    </section>
  );
}
