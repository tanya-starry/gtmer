// Skill System - Main Export

export * from './types';
export * from './registry';
export * from './executor';
export * from './built-ins';

// Initialize function
import { registerBuiltInSkills } from './built-ins';

export function initializeSkillSystem(): void {
  registerBuiltInSkills();
}

// Helper function to get skill categories with icons
export function getSkillCategories() {
  return [
    { id: 'content', name: '内容生成', icon: 'FileText', color: 'blue' },
    { id: 'analysis', name: '数据分析', icon: 'BarChart3', color: 'green' },
    { id: 'research', name: '研究调研', icon: 'Search', color: 'purple' },
    { id: 'communication', name: '沟通协作', icon: 'MessageSquare', color: 'orange' },
    { id: 'automation', name: '自动化', icon: 'Zap', color: 'yellow' },
    { id: 'integration', name: '集成连接', icon: 'Plug', color: 'gray' }
  ];
}

// Helper function to get skill status badge
export function getSkillStatusBadge(status: string) {
  const badges: Record<string, { label: string; color: string }> = {
    active: { label: '已发布', color: 'green' },
    beta: { label: '测试中', color: 'yellow' },
    deprecated: { label: '已弃用', color: 'gray' },
    draft: { label: '草稿', color: 'blue' }
  };
  return badges[status] || { label: status, color: 'gray' };
}
