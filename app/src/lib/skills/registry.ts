import type { 
  Skill, 
  SkillRegistryEntry, 
  SkillFilterOptions,
  CodeSkillConfig 
} from './types';

// Skill Registry - Singleton pattern
class SkillRegistry {
  private skills: Map<string, SkillRegistryEntry> = new Map();
  private static instance: SkillRegistry;

  static getInstance(): SkillRegistry {
    if (!SkillRegistry.instance) {
      SkillRegistry.instance = new SkillRegistry();
    }
    return SkillRegistry.instance;
  }

  // Register a new skill
  register(skill: Skill): void {
    const entry: SkillRegistryEntry = {
      ...skill,
    };

    // For code skills, compile the function
    if (skill.implementation.type === 'code') {
      entry.instance = this.compileCodeSkill(skill.implementation as CodeSkillConfig);
    }

    this.skills.set(skill.id, entry);
    console.log(`[SkillRegistry] Registered skill: ${skill.id}`);
  }

  // Unregister a skill
  unregister(skillId: string): boolean {
    return this.skills.delete(skillId);
  }

  // Get a skill by ID
  get(skillId: string): SkillRegistryEntry | undefined {
    return this.skills.get(skillId);
  }

  // Get all skills
  getAll(): SkillRegistryEntry[] {
    return Array.from(this.skills.values());
  }

  // Filter skills
  filter(options: SkillFilterOptions): SkillRegistryEntry[] {
    let results = this.getAll();

    if (options.category) {
      results = results.filter(s => s.category === options.category);
    }

    if (options.status) {
      results = results.filter(s => s.status === options.status);
    }

    if (options.tags && options.tags.length > 0) {
      results = results.filter(s => 
        options.tags!.some(tag => s.metadata.tags.includes(tag))
      );
    }

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      results = results.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower) ||
        s.metadata.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    return results;
  }

  // Get skills by category
  getByCategory(category: string): SkillRegistryEntry[] {
    return this.getAll().filter(s => s.category === category);
  }

  // Check if skill exists
  has(skillId: string): boolean {
    return this.skills.has(skillId);
  }

  // Get skill categories with counts
  getCategories(): { id: string; name: string; count: number }[] {
    const categories = new Map<string, number>();
    
    const categoryNames: Record<string, string> = {
      content: '内容生成',
      analysis: '数据分析',
      research: '研究调研',
      communication: '沟通协作',
      automation: '自动化',
      integration: '集成连接'
    };

    this.getAll().forEach(skill => {
      const count = categories.get(skill.category) || 0;
      categories.set(skill.category, count + 1);
    });

    return Array.from(categories.entries()).map(([id, count]) => ({
      id,
      name: categoryNames[id] || id,
      count
    }));
  }

  // Compile code skill
  private compileCodeSkill(config: CodeSkillConfig): Function | null {
    try {
      if (config.language === 'javascript' || config.language === 'typescript') {
        // Create a safe function from code string
        const fn = new Function('input', 'context', `
          "use strict";
          ${config.code}
          return ${config.entryPoint}(input, context);
        `);
        return fn;
      }
      // For Python, we'd need a Python runtime (like Pyodide)
      console.warn('[SkillRegistry] Python skills not yet supported in browser');
      return null;
    } catch (error) {
      console.error('[SkillRegistry] Failed to compile code skill:', error);
      return null;
    }
  }

  // Validate skill input against schema
  validateInput(skillId: string, input: Record<string, any>): { valid: boolean; errors?: string[] } {
    const skill = this.get(skillId);
    if (!skill) {
      return { valid: false, errors: [`Skill not found: ${skillId}`] };
    }

    const schema = skill.inputSchema;
    const errors: string[] = [];

    // Check required fields
    if (schema.required) {
      for (const field of schema.required) {
        if (input[field] === undefined || input[field] === null || input[field] === '') {
          errors.push(`Missing required field: ${field}`);
        }
      }
    }

    // Check property types
    if (schema.properties) {
      for (const [key, value] of Object.entries(input)) {
        const propSchema = schema.properties[key];
        if (propSchema) {
          const typeMatch = this.validateType(value, propSchema.type);
          if (!typeMatch) {
            errors.push(`Invalid type for ${key}: expected ${propSchema.type}`);
          }
        }
      }
    }

    return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
  }

  private validateType(value: any, expectedType: string): boolean {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    return actualType === expectedType;
  }

  // Render prompt template with variables
  renderPromptTemplate(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = variables[key];
      return value !== undefined ? String(value) : match;
    });
  }

  // Clear all skills
  clear(): void {
    this.skills.clear();
  }
}

// Export singleton instance
export const skillRegistry = SkillRegistry.getInstance();

// Export class for testing
export { SkillRegistry };
