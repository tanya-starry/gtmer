import { useState, useCallback, useRef } from "react";
import { composeSystemPrompt } from "../data/skills";
import type { FlowStep } from "./useAgents";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const CHAT_STORAGE_PREFIX = "gtm_chat_";
const CHAT_STEP_PREFIX = "gtm_step_";
const KIMI_BASE_URL = "https://api.moonshot.cn/v1";

function loadHistory(agentId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_PREFIX + agentId);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveHistory(agentId: string, messages: ChatMessage[]) {
  localStorage.setItem(CHAT_STORAGE_PREFIX + agentId, JSON.stringify(messages));
}

function loadStep(agentId: string): number {
  try {
    const raw = localStorage.getItem(CHAT_STEP_PREFIX + agentId);
    if (raw) return parseInt(raw, 10);
  } catch { /* ignore */ }
  return 0;
}

function saveStep(agentId: string, step: number) {
  localStorage.setItem(CHAT_STEP_PREFIX + agentId, String(step));
}

function getApiKey(): string | null {
  const key = import.meta.env.VITE_MOONSHOT_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) return null;
  return key.trim();
}

/**
 * Build dynamic system prompt based on conversation state.
 * When flow steps exist, injects current step instruction.
 * LLM controls the wording, code controls the flow.
 */
function buildSystemPrompt(
  basePrompt: string,
  skillIds: string[],
  flowSteps: FlowStep[],
  currentStep: number,
  userReplies: string[]
): string {
  const parts: string[] = [];

  // Base prompt + skill composition
  const base = composeSystemPrompt(basePrompt, skillIds);
  if (base) parts.push(base);

  // Flow-based dynamic instruction
  if (flowSteps.length > 0 && currentStep < flowSteps.length) {
    const step = flowSteps[currentStep];

    parts.push("===== 对话流程控制 =====");
    parts.push(`当前步骤：${step.title}（第 ${currentStep + 1}/${flowSteps.length} 步）`);
    parts.push(`这一步的目标：${step.goal}`);
    parts.push("");
    parts.push("【重要规则】");
    parts.push("1. 你是决策顾问，说话风格自然、有温度，像一位经验丰富的导师在聊天");
    parts.push("2. 这一轮的对话目标如上，请用你自己的话灵活表达，不要照抄指令");
    parts.push("3. 只问当前这一步的问题，等用户回答后自然推进");
    parts.push("4. 如果用户回答模糊，可以温和地追问澄清");
    parts.push("5. 不要一次性输出所有步骤的内容");
    if (step.options && step.options.length > 0) {
      parts.push("");
      parts.push(`【你可以引导用户从以下选项中选择，也可以用更自然的方式提问】`);
      step.options.forEach((opt, i) => parts.push(`  ${String.fromCharCode(65 + i)}. ${opt}`));
    }
    parts.push("");
    parts.push(`【你的任务】用你自己的风格，完成"${step.title}"这一步的对话目标。`);

    // Inject previous answers for context
    if (userReplies.length > 0) {
      parts.push("");
      parts.push("【用户前面的回答】");
      userReplies.forEach((reply, i) => {
        if (flowSteps[i]) {
          parts.push(`${flowSteps[i].title}：${reply}`);
        }
      });
    }
  } else if (flowSteps.length > 0 && currentStep >= flowSteps.length) {
    // All steps done, generate conclusion
    parts.push("===== 最终分析 =====");
    parts.push("所有步骤已完成。请基于用户的全部回答，输出综合分析结论。");
    parts.push("分析应包括：位置判断 + 结构诊断 + 具体行动建议");
    parts.push("语气要有洞察力和温度，像一位真正懂用户的顾问。");
    if (userReplies.length > 0) {
      parts.push("");
      parts.push("【用户的全部回答】");
      userReplies.forEach((reply, i) => {
        if (flowSteps[i]) {
          parts.push(`${flowSteps[i].title}：${reply}`);
        }
      });
    }
  }

  return parts.join("\n");
}

export function useChat(agentId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadHistory(agentId));
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStep, setCurrentStep] = useState(() => loadStep(agentId));
  const abortRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => {
      const next = [...prev, msg];
      saveHistory(agentId, next);
      return next;
    });
  }, [agentId]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setCurrentStep(0);
    localStorage.removeItem(CHAT_STORAGE_PREFIX + agentId);
    localStorage.removeItem(CHAT_STEP_PREFIX + agentId);
  }, [agentId]);

  // Extract user replies from message history for flow context
  const getUserReplies = useCallback((history: ChatMessage[], flowSteps: FlowStep[]): string[] => {
    if (flowSteps.length === 0) return [];
    const replies: string[] = [];
    // Skip welcome message (first assistant message if exists)
    let startIdx = 0;
    if (history.length > 0 && history[0].role === "assistant") startIdx = 1;

    for (let i = startIdx; i < history.length; i++) {
      if (history[i].role === "user") {
        replies.push(history[i].content);
      }
    }
    return replies;
  }, []);

  const sendMessage = useCallback(
    async (
      userContent: string,
      basePrompt: string,
      skillIds: string[],
      flowSteps: FlowStep[] = []
    ) => {
      const apiKey = getApiKey();
      if (!apiKey) {
        addMessage({
          role: "assistant",
          content:
            "⚠️ 未检测到 API Key。\n\n可能原因：\n1. Vercel 环境变量未配置或 Key 名错误\n2. 配置后未重新部署（必须取消 Build Cache 后 Redeploy）\n3. 环境变量勾选了错误的 Environment（应为 Production）\n\n请检查 Vercel → Project Settings → Environment Variables。",
        });
        return;
      }

      // Build context-aware system prompt
      const history = loadHistory(agentId);
      const userReplies = getUserReplies(history, flowSteps);
      const dynamicPrompt = buildSystemPrompt(basePrompt, skillIds, flowSteps, currentStep, userReplies);

      const userMsg: ChatMessage = { role: "user", content: userContent };
      addMessage(userMsg);
      setIsStreaming(true);

      const allMessages: { role: string; content: string }[] = [];
      if (dynamicPrompt) {
        allMessages.push({ role: "system", content: dynamicPrompt });
      }
      history.forEach((m) => allMessages.push(m));
      allMessages.push(userMsg);

      const assistantMsg: ChatMessage = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMsg]);

      const abortCtrl = new AbortController();
      abortRef.current = abortCtrl;

      try {
        const response = await fetch(`${KIMI_BASE_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "moonshot-v1-128k",
            messages: allMessages,
            stream: true,
            temperature: 0.7,
          }),
          signal: abortCtrl.signal,
        });

        if (!response.ok) {
          const errText = await response.text();
          const parsed = JSON.parse(errText);
          const msg = parsed.error?.message || errText.slice(0, 200);
          if (response.status === 401) {
            throw new Error(
              `API 401: ${msg}\n\nKey 长度: ${apiKey.length}\nKey 前缀: ${apiKey.slice(0, 15)}\nKey 后缀: ...${apiKey.slice(-6)}\n\n可能原因:\n1. Key 已被撤销\n2. Key 格式错误\n3. 环境变量未配置\n\n建议: 前往 https://platform.moonshot.cn/console/api-keys 重新生成 Key`
            );
          }
          throw new Error(`API ${response.status}: ${msg}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  fullContent += delta;
                  setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = { role: "assistant", content: fullContent };
                    saveHistory(agentId, next);
                    return next;
                  });
                }
              } catch { /* ignore parse errors */ }
            }
          }
        }

        // After successful response, advance step if flow is active
        if (flowSteps.length > 0 && currentStep < flowSteps.length) {
          const newStep = currentStep + 1;
          setCurrentStep(newStep);
          saveStep(agentId, newStep);
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "未知错误";
        const displayMsg = errorMsg.includes("abort")
          ? "已取消"
          : `请求失败: ${errorMsg}`;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: displayMsg };
          saveHistory(agentId, next);
          return next;
        });
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [agentId, addMessage, currentStep, getUserReplies]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    isStreaming,
    currentStep,
    sendMessage,
    addMessage,
    stopStreaming,
    clearHistory,
  };
}
