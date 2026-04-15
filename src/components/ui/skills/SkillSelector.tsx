import { useState, useMemo } from 'react';
import {
  Search,
  FileText,
  BarChart3,
  Search as SearchIcon,
  MessageSquare,
  Zap,
  Plug,
  Check,
  Star,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Skill, SkillCategory } from '@/lib/skills';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  FileText,
  BarChart3,
  SearchIcon,
  MessageSquare,
  Zap,
  Plug,
  Presentation: FileText,
  Image: FileText,
  Mail: MessageSquare,
  Users: MessageSquare,
  UserCircle: SearchIcon
};

interface SkillSelectorProps {
  skills: Skill[];
  selectedSkills: string[];
  onSelect: (skillId: string) => void;
  onDeselect: (skillId: string) => void;
  maxSelection?: number;
  className?: string;
}

export function SkillSelector({
  skills,
  selectedSkills,
  onSelect,
  onDeselect,
  maxSelection = 5,
  className
}: SkillSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch = !searchQuery || 
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [skills, searchQuery, selectedCategory]);

  // Group by category
  const groupedSkills = useMemo(() => {
    const groups: Record<string, Skill[]> = {};
    
    for (const skill of filteredSkills) {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }
      groups[skill.category].push(skill);
    }
    
    return groups;
  }, [filteredSkills]);

  // Category display names
  const categoryNames: Record<string, string> = {
    content: '内容生成',
    analysis: '数据分析',
    research: '研究调研',
    communication: '沟通协作',
    automation: '自动化',
    integration: '集成连接'
  };

  // Category colors
  const categoryColors: Record<string, string> = {
    content: 'bg-blue-100 text-blue-700',
    analysis: 'bg-green-100 text-green-700',
    research: 'bg-purple-100 text-purple-700',
    communication: 'bg-orange-100 text-orange-700',
    automation: 'bg-yellow-100 text-yellow-700',
    integration: 'bg-gray-100 text-gray-700'
  };

  const isMaxReached = selectedSkills.length >= maxSelection;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">选择 Skills</h3>
            <p className="text-sm text-gray-500">
              已选择 {selectedSkills.length}/{maxSelection} 个技能
            </p>
          </div>
          {selectedSkills.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectedSkills.forEach(onDeselect)}
            >
              清空
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索 Skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
              selectedCategory === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            全部
          </button>
          {Object.entries(categoryNames).map(([id, name]) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id as SkillCategory)}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                selectedCategory === id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="px-4 py-3 bg-blue-50/50 border-b">
          <p className="text-xs text-gray-500 mb-2">已选择</p>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map(skillId => {
              const skill = skills.find(s => s.id === skillId);
              if (!skill) return null;
              return (
                <Badge
                  key={skillId}
                  variant="secondary"
                  className="gap-1 pr-1 bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  {skill.name}
                  <button
                    onClick={() => onDeselect(skillId)}
                    className="ml-1 hover:bg-blue-200 rounded-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Skills List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {Object.entries(groupedSkills).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>未找到匹配的 Skills</p>
            </div>
          ) : (
            Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  {categoryNames[category] || category}
                  <span className="ml-1 text-gray-400">({categorySkills.length})</span>
                </h4>
                <div className="space-y-2">
                  {categorySkills.map(skill => {
                    const isSelected = selectedSkills.includes(skill.id);
                    const Icon = iconMap[skill.metadata.icon || 'FileText'] || FileText;
                    const canSelect = !isMaxReached || isSelected;

                    return (
                      <TooltipProvider key={skill.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                if (isSelected) {
                                  onDeselect(skill.id);
                                } else if (canSelect) {
                                  onSelect(skill.id);
                                }
                              }}
                              disabled={!canSelect && !isSelected}
                              className={cn(
                                'w-full flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all',
                                isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : canSelect
                                  ? 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'
                                  : 'border-transparent bg-gray-50 opacity-50 cursor-not-allowed'
                              )}
                            >
                              {/* Icon */}
                              <div className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                                categoryColors[skill.category] || 'bg-gray-100'
                              )}>
                                <Icon className="w-5 h-5" />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">{skill.name}</span>
                                  {isSelected && (
                                    <Check className="w-4 h-4 text-blue-500" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
                                  {skill.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  {skill.metadata.rating > 0 && (
                                    <div className="flex items-center gap-0.5 text-xs text-amber-600">
                                      <Star className="w-3 h-3 fill-current" />
                                      <span>{skill.metadata.rating}</span>
                                    </div>
                                  )}
                                  <div className="flex flex-wrap gap-1">
                                    {skill.metadata.tags.slice(0, 2).map(tag => (
                                      <span
                                        key={tag}
                                        className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Arrow */}
                              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-medium">{skill.name}</p>
                              <p className="text-sm text-gray-500">{skill.description}</p>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {skill.metadata.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
