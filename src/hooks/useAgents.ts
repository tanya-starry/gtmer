import { useState, useEffect, useCallback } from "react";
import { composeSystemPrompt } from "../data/skills";

export type ModelType = "kimi-moonshot-v1" | "gpt-4o" | "claude-3-5-sonnet" | "llama-3-70b";

export interface Agent {
  id: string;
  name: string;
  model: ModelType;
  systemPrompt: string;
  skills: string[]; // skill IDs
  avatar: string;
  color: string;
  createdAt: string;
}

const STORAGE_KEY = "gtm_agents";

const DEFAULT_AVATARS = ["🤖", "📊", "📝", "🎨", "🌐", "📧", "📢", "💻", "🔍", "🚀", "⚡", "🎯"];
const DEFAULT_COLORS = ["#1E40AF", "#059669", "#D97706", "#7C3AED", "#0891B2", "#BE185D", "#EA580C", "#4F46E5", "#DC2626", "#65A30D"];

function loadAgents(): Agent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveAgents(agents: Agent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function pickAvatar(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DEFAULT_AVATARS[Math.abs(hash) % DEFAULT_AVATARS.length];
}

function pickColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return DEFAULT_COLORS[Math.abs(hash) % DEFAULT_COLORS.length];
}

export { composeSystemPrompt };

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>(loadAgents);

  useEffect(() => { saveAgents(agents); }, [agents]);

  const createAgent = useCallback((name: string, model: ModelType, systemPrompt: string, skillIds: string[]) => {
    const agent: Agent = {
      id: genId(),
      name: name.trim() || "未命名Agent",
      model,
      systemPrompt: systemPrompt.trim(),
      skills: skillIds,
      avatar: pickAvatar(name),
      color: pickColor(name),
      createdAt: new Date().toISOString(),
    };
    setAgents((prev) => [agent, ...prev]);
    return agent.id;
  }, []);

  const deleteAgent = useCallback((id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { agents, createAgent, deleteAgent };
}
