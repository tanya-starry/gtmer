import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Square, Trash2, User, Wand2, Route } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Agent } from "../hooks/useAgents";
import { useChat } from "../hooks/useChat";
import { SKILL_TEMPLATES } from "../data/skills";

interface AgentChatModalProps {
  isOpen: boolean;
  agent: Agent | null;
  onClose: () => void;
}

export function AgentChatModal({ isOpen, agent, onClose }: AgentChatModalProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isStreaming, currentStep, sendMessage, addMessage, stopStreaming, clearHistory } = useChat(
    agent?.id || "_no_agent"
  );

  const hasFlow = agent ? agent.conversationFlow.length > 0 : false;
  const flowSteps = agent?.conversationFlow || [];
  const isFlowDone = hasFlow && currentStep >= flowSteps.length;

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Focus input
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  // Auto-send welcome message on first open
  useEffect(() => {
    if (isOpen && agent && messages.length === 0) {
      const welcome = agent.welcomeMessage?.trim() || `你好！我是 ${agent.name}，有什么可以帮你的？`;
      addMessage({ role: "assistant", content: welcome });
    }
  }, [isOpen, agent, messages.length, addMessage]);

  const handleSend = (text?: string) => {
    const content = text || input.trim();
    if (!content || !agent || isStreaming) return;
    if (!text) setInput("");
    // Pass flow steps for state machine
    sendMessage(content, agent.systemPrompt, agent.skills, agent.conversationFlow);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get current step options (for the NEXT question)
  const currentStepOptions = hasFlow && currentStep < flowSteps.length
    ? flowSteps[currentStep].options
    : null;

  // Get active skill labels
  const activeSkills = agent
    ? agent.skills.map((id) => SKILL_TEMPLATES.find((s) => s.id === id)).filter(Boolean)
    : [];

  if (!agent) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="agent-chat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-[90vh] sm:max-w-[800px] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] flex-shrink-0 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: `${agent.color}15` }}
                >
                  {agent.avatar}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-[#0F172A] truncate">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-[#94A3B8]">{agent.model}</span>
                    {activeSkills.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Wand2 className="w-3 h-3 text-[#3B82F6]" />
                        {activeSkills.slice(0, 3).map((s) => (
                          <span
                            key={s!.id}
                            className="text-[10px] px-1.5 py-0.5 bg-[#EFF6FF] text-[#1E40AF] rounded-full"
                          >
                            {s!.label}
                          </span>
                        ))}
                        {activeSkills.length > 3 && (
                          <span className="text-[10px] text-[#94A3B8]">
                            +{activeSkills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    {hasFlow && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#64748B]">
                        <Route className="w-3 h-3" />
                        {isFlowDone
                          ? "已完成"
                          : `第 ${Math.min(currentStep + 1, flowSteps.length)}/${flowSteps.length} 步`}
                      </span>
                    )}
                    {isStreaming && (
                      <span className="inline-flex items-center gap-1 text-xs text-[#10B981]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        生成中...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={clearHistory}
                  className="p-2 text-[#94A3B8] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
                  title="清空对话"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Flow Progress Bar */}
            {hasFlow && (
              <div className="px-5 py-2 bg-[#FAFAFA] border-b border-[#E2E8F0] flex-shrink-0">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {flowSteps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-1.5 flex-shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          i < currentStep
                            ? "bg-[#059669] text-white"
                            : i === currentStep
                              ? "bg-[#1E40AF] text-white ring-2 ring-[#1E40AF]/20"
                              : "bg-[#E2E8F0] text-[#94A3B8]"
                        }`}
                      >
                        {i < currentStep ? "✓" : i + 1}
                      </div>
                      <span
                        className={`text-[11px] whitespace-nowrap ${
                          i <= currentStep ? "text-[#0F172A] font-medium" : "text-[#94A3B8]"
                        }`}
                      >
                        {step.title}
                      </span>
                      {i < flowSteps.length - 1 && (
                        <div
                          className={`w-4 h-[2px] ${
                            i < currentStep ? "bg-[#059669]" : "bg-[#E2E8F0]"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 bg-[#FAFAFA]">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
                    style={{ backgroundColor: `${agent.color}10` }}
                  >
                    {agent.avatar}
                  </div>
                  <h4 className="text-lg font-semibold text-[#0F172A] mb-2">
                    {agent.name}
                  </h4>
                  {activeSkills.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {activeSkills.map((s) => (
                        <span
                          key={s!.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EFF6FF] text-[#1E40AF] text-xs rounded-full"
                        >
                          <span>{s!.icon}</span>
                          {s!.label}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-[#94A3B8]">
                    点击下方输入框发送消息
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {msg.role === "user" ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                        style={{ backgroundColor: `${agent.color}15` }}
                      >
                        {agent.avatar}
                      </div>
                    )}
                  </div>

                  <div
                    className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#1E40AF] text-white rounded-br-md"
                        : "bg-white border border-[#E2E8F0] text-[#0F172A] rounded-bl-md shadow-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none assistant-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content || "..."}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {isStreaming && messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
                <div className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
                    style={{ backgroundColor: `${agent.color}15` }}
                  >
                    {agent.avatar}
                  </div>
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#CBD5E1] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-[#CBD5E1] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-[#CBD5E1] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-4 sm:px-6 py-4 border-t border-[#E2E8F0] bg-white flex-shrink-0 space-y-3">
              {/* Quick Options */}
              {currentStepOptions && currentStepOptions.length > 0 && !isStreaming && (
                <div className="flex flex-wrap gap-2">
                  {currentStepOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSend(opt)}
                      className="px-4 py-2 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] text-sm font-medium rounded-xl border border-[#BFDBFE] hover:border-[#3B82F6] transition-all duration-200"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Text Input */}
              <div className="flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    hasFlow && !isFlowDone
                      ? `第 ${currentStep + 1} 步 · ${flowSteps[currentStep]?.title}...`
                      : "输入消息... (Enter发送, Shift+Enter换行)"
                  }
                  rows={1}
                  className="flex-1 min-h-[44px] max-h-[120px] px-4 py-2.5 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all duration-200 resize-none leading-5"
                />
                {isStreaming ? (
                  <button
                    onClick={stopStreaming}
                    className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] rounded-xl transition-all duration-200"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-[#1E40AF] hover:bg-[#2563EB] disabled:bg-[#CBD5E1] disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-[#94A3B8] text-center">
                {hasFlow
                  ? `对话流程 · 共 ${flowSteps.length} 步${isFlowDone ? " · 已完成" : ""}`
                  : "内容由 AI 生成，仅供参考"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
