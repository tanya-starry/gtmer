import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Check,
  AlertCircle,
  FileText,
  Code,
  Workflow,
  Globe,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { Skill, JSONSchema } from '@/lib/skills';

interface SkillConfigPanelProps {
  skill: Skill;
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
  className?: string;
}

export function SkillConfigPanel({ skill, config, onChange, className }: SkillConfigPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    input: true,
    advanced: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get implementation type icon
  const getImplementationIcon = () => {
    switch (skill.implementation.type) {
      case 'prompt': return <FileText className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      case 'workflow': return <Workflow className="w-4 h-4" />;
      case 'api': return <Globe className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Get implementation type label
  const getImplementationLabel = () => {
    switch (skill.implementation.type) {
      case 'prompt': return '提示词模板';
      case 'code': return '代码函数';
      case 'workflow': return '工作流';
      case 'api': return 'API调用';
      default: return '未知';
    }
  };

  // Render input field based on schema
  const renderInputField = (key: string, schema: JSONSchema, value: any, onChange: (val: any) => void) => {
    const required = skill.inputSchema.required?.includes(key);
    
    switch (schema.type) {
      case 'string':
        if (schema.enum) {
          return (
            <div className="space-y-1.5">
              <Label className="text-sm">
                {key}
                {required && <span className="text-red-500 ml-0.5">*</span>}
              </Label>
              <select
                value={value || schema.default || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                {schema.enum.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {schema.description && (
                <p className="text-xs text-gray-500">{schema.description}</p>
              )}
            </div>
          );
        }
        return (
          <div className="space-y-1.5">
            <Label className="text-sm">
              {key}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            <Input
              value={value || schema.default || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={schema.description}
            />
          </div>
        );
      
      case 'number':
        return (
          <div className="space-y-1.5">
            <Label className="text-sm">
              {key}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            <Input
              type="number"
              value={value || schema.default || ''}
              onChange={(e) => onChange(Number(e.target.value))}
              placeholder={schema.description}
            />
          </div>
        );
      
      case 'array':
        if (schema.items?.type === 'string') {
          return (
            <div className="space-y-1.5">
              <Label className="text-sm">
                {key}
                {required && <span className="text-red-500 ml-0.5">*</span>}
              </Label>
              <Textarea
                value={Array.isArray(value) ? value.join('\n') : ''}
                onChange={(e) => onChange(e.target.value.split('\n').filter(Boolean))}
                placeholder={`${schema.description || ''} (每行一个)`}
                rows={3}
              />
            </div>
          );
        }
        return null;
      
      case 'boolean':
        return (
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">{key}</Label>
              {schema.description && (
                <p className="text-xs text-gray-500">{schema.description}</p>
              )}
            </div>
            <Switch
              checked={value || schema.default || false}
              onCheckedChange={onChange}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Skill Header */}
      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center">
            {getImplementationIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{skill.name}</h3>
              <Badge variant="outline" className="text-xs">
                {getImplementationLabel()}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {skill.metadata.tags.map(tag => (
                <span key={tag} className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info Section */}
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('basic')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-sm">基本信息</span>
          </div>
          {expandedSections.basic ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.basic && (
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">版本</span>
                <p className="font-medium">{skill.version}</p>
              </div>
              <div>
                <span className="text-gray-500">状态</span>
                <p className="font-medium">
                  <span className={cn(
                    'inline-flex items-center gap-1',
                    skill.status === 'active' && 'text-green-600',
                    skill.status === 'beta' && 'text-yellow-600',
                    skill.status === 'draft' && 'text-blue-600'
                  )}>
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      skill.status === 'active' && 'bg-green-500',
                      skill.status === 'beta' && 'bg-yellow-500',
                      skill.status === 'draft' && 'bg-blue-500'
                    )} />
                    {skill.status === 'active' ? '已发布' : 
                     skill.status === 'beta' ? '测试中' : '草稿'}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-gray-500">作者</span>
                <p className="font-medium">{skill.metadata.author}</p>
              </div>
              <div>
                <span className="text-gray-500">评分</span>
                <p className="font-medium flex items-center gap-1">
                  {skill.metadata.rating > 0 ? (
                    <>
                      <span className="text-amber-500">★</span>
                      {skill.metadata.rating}
                    </>
                  ) : (
                    '-'
                  )}
                </p>
              </div>
            </div>
            
            {skill.dependencies && skill.dependencies.length > 0 && (
              <div>
                <span className="text-gray-500 text-sm">依赖 Skills</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skill.dependencies.map(dep => (
                    <Badge key={dep} variant="outline" className="text-xs">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Configuration Section */}
      {skill.inputSchema.properties && Object.keys(skill.inputSchema.properties).length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('input')}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-sm">输入配置</span>
            </div>
            {expandedSections.input ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.input && (
            <div className="p-4 space-y-4">
              {Object.entries(skill.inputSchema.properties).map(([key, schema]) => (
                <div key={key}>
                  {renderInputField(
                    key,
                    schema,
                    config[key],
                    (val) => onChange({ ...config, [key]: val })
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Advanced Configuration */}
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('advanced')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-sm">高级配置</span>
          </div>
          {expandedSections.advanced ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {expandedSections.advanced && (
          <div className="p-4 space-y-4">
            {/* Model Override */}
            <div className="space-y-2">
              <Label className="text-sm">模型覆盖（可选）</Label>
              <select
                value={config.model || ''}
                onChange={(e) => onChange({ ...config, model: e.target.value || undefined })}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">使用默认模型</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              </select>
              <p className="text-xs text-gray-500">
                覆盖默认模型配置，用于此 Skill 的执行
              </p>
            </div>

            {/* Timeout */}
            <div className="space-y-2">
              <Label className="text-sm">超时时间（秒）</Label>
              <Input
                type="number"
                value={config.timeout || 30}
                onChange={(e) => onChange({ ...config, timeout: Number(e.target.value) })}
                min={5}
                max={300}
              />
            </div>

            {/* Retry */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">自动重试</Label>
                <p className="text-xs text-gray-500">失败时自动重试</p>
              </div>
              <Switch
                checked={config.retry !== false}
                onCheckedChange={(checked) => onChange({ ...config, retry: checked })}
              />
            </div>

            {config.retry !== false && (
              <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                <Label className="text-sm">重试次数</Label>
                <Input
                  type="number"
                  value={config.retryCount || 3}
                  onChange={(e) => onChange({ ...config, retryCount: Number(e.target.value) })}
                  min={1}
                  max={5}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Validation Status */}
      {skill.inputSchema.required && skill.inputSchema.required.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          {skill.inputSchema.required.every(key => 
            config[key] !== undefined && config[key] !== '' && config[key] !== null
          ) ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-600">配置完整</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-amber-600">
                还需填写: {skill.inputSchema.required
                  .filter(key => !config[key] && config[key] !== 0)
                  .join(', ')}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
