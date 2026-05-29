import { useState, useCallback, useRef } from "react";
import { composeSystemPrompt } from "../data/skills";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const CHAT_STORAGE_PREFIX = "gtm_chat_";
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

function getApiKey(): string | null {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) return null;
  // Trim whitespace/newlines that may have been accidentally included
  return key.trim();
}

export function useChat(agentId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadHistory(agentId));
  const [isStreaming, setIsStreaming] = useState(false);
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
    localStorage.removeItem(CHAT_STORAGE_PREFIX + agentId);
  }, [agentId]);

  const sendMessage = useCallback(
    async (userContent: string, basePrompt: string, skillIds: string[]) => {
      const apiKey = getApiKey();
      if (!apiKey) {
        addMessage({
          role: "assistant",
          content:
            "⚠️ 未检测到 API Key。\n\n可能原因：\n1. Vercel 环境变量未配置或 Key 名错误（应为 VITE_OPENAI_API_KEY）\n2. 配置后未重新部署（必须 Redeploy without build cache）\n3. 环境变量勾选了错误的 Environment（应为 Production）\n\n请检查 Vercel → Project Settings → Environment Variables，确认后重新部署。",
        });
        return;
      }

      const fullSystemPrompt = composeSystemPrompt(basePrompt, skillIds);

      const userMsg: ChatMessage = { role: "user", content: userContent };
      addMessage(userMsg);
      setIsStreaming(true);

      const allMessages: { role: string; content: string }[] = [];
      if (fullSystemPrompt) {
        allMessages.push({ role: "system", content: fullSystemPrompt });
      }
      const history = loadHistory(agentId);
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
            const maskedKey = apiKey.length > 14 
              ? `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}` 
              : "(key too short)";
            throw new Error(
              `API 401: ${msg}\n\n实际使用的 Key: ${maskedKey}\n\n如果显示的 Key 不正确，说明 Vercel 环境变量未正确注入。\n请检查 Vercel → Settings → Environment Variables → VITE_OPENAI_API_KEY\n并确保 Redeploy 时勾选了 "without build cache"。`
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
    [agentId, addMessage]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    isStreaming,
    sendMessage,
    stopStreaming,
    clearHistory,
  };
}
