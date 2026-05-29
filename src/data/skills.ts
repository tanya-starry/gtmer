export interface SkillTemplate {
  id: string;
  label: string;
  icon: string;
  desc: string;
  promptFragment: string;
}

export const SKILL_TEMPLATES: SkillTemplate[] = [
  {
    id: "sop_writer",
    label: "SOP撰写",
    icon: "📋",
    desc: "生成标准操作流程文档",
    promptFragment:
      "你擅长撰写标准操作流程（SOP）文档。当用户描述一个业务流程时，你应输出结构清晰的 SOP，包含目的、适用范围、操作步骤（编号列表）、注意事项。格式规范，语言简洁专业。",
  },
  {
    id: "data_analyst",
    label: "数据分析",
    icon: "📊",
    desc: "分析市场数据与竞品趋势",
    promptFragment:
      "你是一名数据分析专家。当用户提供数据或描述分析需求时，你应给出结构化的分析报告，包含数据洞察、趋势判断、关键结论，并以 Markdown 表格或要点列表呈现。",
  },
  {
    id: "content_creator",
    label: "内容创作",
    icon: "✍️",
    desc: "社媒文案、图文脚本创作",
    promptFragment:
      "你是一名擅长社交媒体内容创作的专家。你能为小红书、微信、LinkedIn 等平台创作吸引人的文案，善用emoji、话题标签，语言生动有感染力。每次输出时注明适用平台。",
  },
  {
    id: "ppt_outline",
    label: "PPT大纲",
    icon: "🎨",
    desc: "生成演示文稿结构与备注",
    promptFragment:
      "你擅长将用户的想法转化为清晰的 PPT 大纲。输出格式为：每页 Slide 的标题、3-5 个核心要点、演讲备注建议。使用 Markdown 格式，层次清晰。",
  },
  {
    id: "seo_optimizer",
    label: "SEO优化",
    icon: "🌐",
    desc: "关键词分析与内容优化",
    promptFragment:
      "你是一名 SEO 专家。当用户提供文章或关键词时，你应分析搜索意图、建议标题优化、提供关键词布局策略，并给出内容结构改进建议。输出包含：核心关键词、长尾词推荐、优化后的标题选项。",
  },
  {
    id: "email_marketer",
    label: "邮件营销",
    icon: "📧",
    desc: "撰写营销邮件与序列",
    promptFragment:
      "你是一名邮件营销专家。你能撰写高打开率的营销邮件，包含吸引人的主题行、个性化开场、清晰的价值主张、强力的 CTA。每次输出时提供 2-3 个主题行备选。",
  },
  {
    id: "ad_copywriter",
    label: "广告文案",
    icon: "📢",
    desc: "广告创意与投放文案",
    promptFragment:
      "你是一名广告文案专家，熟悉 AIDA 模型（注意-兴趣-欲望-行动）。你能为 Meta、Google、微信等平台创作高转化广告文案，输出时提供标题、正文、CTA 的完整组合，并说明适用场景。",
  },
  {
    id: "gtm_strategist",
    label: "GTM策略",
    icon: "🚀",
    desc: "产品上市与市场进入策略",
    promptFragment:
      "你是一名 GTM（Go-To-Market）战略顾问。当用户描述产品或市场时，你能提供目标客户分析、定位策略、渠道选择、定价建议和启动路线图。输出结构清晰，以顾问报告风格呈现。",
  },
];

export function getSkillById(id: string): SkillTemplate | undefined {
  return SKILL_TEMPLATES.find((s) => s.id === id);
}

export function getSkillLabels(skillIds: string[]): string[] {
  return skillIds
    .map((id) => getSkillById(id)?.label)
    .filter(Boolean) as string[];
}

/**
 * Compose the full system prompt by combining:
 * 1. User-defined base system prompt
 * 2. Selected skill prompt fragments
 */
export function composeSystemPrompt(
  basePrompt: string,
  skillIds: string[]
): string {
  const parts: string[] = [];

  if (basePrompt.trim()) {
    parts.push(basePrompt.trim());
  }

  const fragments = skillIds
    .map((id) => getSkillById(id)?.promptFragment)
    .filter(Boolean) as string[];

  if (fragments.length > 0) {
    parts.push("你具备以下专业能力：");
    fragments.forEach((frag) => {
      parts.push(frag);
    });
  }

  return parts.join("\n\n");
}
