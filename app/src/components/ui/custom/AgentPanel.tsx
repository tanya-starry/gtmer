import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Plus,
  X,
  Bot,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentJob, AgentJobType } from '@/types';
import { mockData } from '@/lib/supabase';
import { 
  skillRegistry, 
  initializeSkillSystem
} from '@/lib/skills';
import { 
  SkillSelector, 
  SkillConfigPanel,
  SkillExecutionPreview 
} from '@/components/ui/skills';

interface AgentPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Agent creation steps
const STEPS = [
  { id: 'skills', name: '选择 Skills', description: '选择Agent需要具备的能力' },
  { id: 'model', name: '模型配置', description: '配置AI模型参数' },
  { id: 'knowledge', name: '知识库', description: '关联知识库资源' },
  { id: 'preview', name: '预览测试', description: '测试Agent效果' }
];

export function AgentPanel({ open, onOpenChange }: AgentPanelProps) {
  // Initialize skills on mount
  useEffect(() => {
    initializeSkillSystem();
  }, []);

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  
  // Skills state
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillConfigs, setSkillConfigs] = useState<Record<string, Record<string, any>>>({});
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  
  // Model config state
  const [modelConfig, setModelConfig] = useState({
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 4000,
    topP: 1
  });
  
  // Knowledge base state
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<string[]>([]);
  
  // Jobs state
  const [jobs, setJobs] = useState<AgentJob[]>(mockData.agentJobs);
  const [activeTab, setActiveTab] = useState('create');
  const [isCreating, setIsCreating] = useState(false);

  // Get all available skills
  const availableSkills = skillRegistry.getAll();

  // Handle skill selection
  const handleSelectSkill = (skillId: string) => {
    if (selectedSkills.length < 5 && !selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId]);
      setActiveSkillId(skillId);
      // Initialize config for this skill
      if (!skillConfigs[skillId]) {
        setSkillConfigs({
          ...skillConfigs,
          [skillId]: {}
        });
      }
    }
  };

  // Handle skill deselection
  const handleDeselectSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    if (activeSkillId === skillId) {
      setActiveSkillId(selectedSkills.filter(id => id !== skillId)[0] || null);
    }
  };

  // Handle skill config change
  const handleSkillConfigChange = (skillId: string, config: Record<string, any>) => {
    setSkillConfigs({
      ...skillConfigs,
      [skillId]: config
    });
  };

  // Handle create agent
  const handleCreateAgent = async () => {
    if (selectedSkills.length === 0 || !agentName.trim()) return;

    setIsCreating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newJob: AgentJob = {
      id: String(Date.now()),
      type: 'sop' as AgentJobType,
      status: 'pending',
      title: agentName.trim(),
      description: agentDescription.trim(),
      input_data: {
        skills: selectedSkills,
        modelConfig,
        knowledgeBases: selectedKnowledgeBases,
        skillConfigs
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      progress: 0,
    };

    setJobs([newJob, ...jobs]);
    setIsCreating(false);
    
    // Reset form
    setAgentName('');
    setAgentDescription('');
    setSelectedSkills([]);
    setSkillConfigs({});
    setActiveSkillId(null);
    setCurrentStep(0);
    
    setActiveTab('tasks');
  };

  // Get status display
  const getStatusIcon = (status: AgentJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: AgentJob['status']) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'processing':
        return '进行中';
      case 'failed':
        return '失败';
      default:
        return '待处理';
    }
  };

  // Check if can proceed to next step
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Skills
        return selectedSkills.length > 0;
      case 1: // Model
        return true;
      case 2: // Knowledge
        return true;
      case 3: // Preview
        return agentName.trim().length > 0;
      default:
        return false;
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Skills
        return (
          <div className="h-full flex gap-4 bg-white">
            {/* Skill Selector */}
            <div className="w-1/2 border rounded-lg overflow-hidden bg-white">
              <SkillSelector
                skills={availableSkills}
                selectedSkills={selectedSkills}
                onSelect={handleSelectSkill}
                onDeselect={handleDeselectSkill}
                maxSelection={5}
              />
            </div>
            
            {/* Skill Config */}
            <div className="w-1/2 border rounded-lg overflow-hidden bg-white">
              {activeSkillId ? (
                <div className="h-full flex flex-col bg-white">
                  <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                    <span className="font-medium text-sm">配置 Skill</span>
                    <button
                      onClick={() => setActiveSkillId(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 bg-white">
                    <SkillConfigPanel
                      skill={skillRegistry.get(activeSkillId)!}
                      config={skillConfigs[activeSkillId] || {}}
                      onChange={(config) => handleSkillConfigChange(activeSkillId, config)}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 bg-white">
                  <div className="text-center">
                    <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>选择一个 Skill 进行配置</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      
      case 1: // Model
        return (
          <div className="space-y-6 bg-white p-4">
            {/* Model Selection */}
            <div className="space-y-3">
              <Label>选择模型</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'gpt-4', name: 'GPT-4', desc: '最强性能，适合复杂任务', provider: 'OpenAI' },
                  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', desc: '快速经济，适合简单任务', provider: 'OpenAI' },
                  { id: 'claude-3-opus', name: 'Claude 3 Opus', desc: '代码能力强', provider: 'Anthropic' },
                  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', desc: '平衡性能与成本', provider: 'Anthropic' }
                ].map(model => (
                  <button
                    key={model.id}
                    onClick={() => setModelConfig({ ...modelConfig, model: model.id })}
                    className={cn(
                      'p-4 rounded-lg border-2 text-left transition-all',
                      modelConfig.model === model.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{model.name}</span>
                      <Badge variant="outline" className="text-xs">{model.provider}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{model.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Parameters */}
            <div className="space-y-4">
              <Label>模型参数</Label>
              
              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Temperature</span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">
                    {modelConfig.temperature}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={modelConfig.temperature}
                  onChange={(e) => setModelConfig({ ...modelConfig, temperature: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>精确 (0)</span>
                  <span>平衡 (1)</span>
                  <span>创意 (2)</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Max Tokens</span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">
                    {modelConfig.maxTokens}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="8000"
                  step="500"
                  value={modelConfig.maxTokens}
                  onChange={(e) => setModelConfig({ ...modelConfig, maxTokens: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        );
      
      case 2: // Knowledge
        return (
          <div className="space-y-4 bg-white p-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">知识库关联</p>
                  <p className="text-sm text-blue-700 mt-1">
                    选择Agent可以访问的知识库资源，这将增强Agent的专业能力
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { id: 'product-docs', name: '产品文档库', desc: '包含产品功能、使用指南', count: 156 },
                { id: 'sales-playbook', name: '销售手册', desc: '销售流程、话术模板', count: 42 },
                { id: 'customer-faq', name: '客户FAQ', desc: '常见问题及解答', count: 89 },
                { id: 'competitor-analysis', name: '竞品分析', desc: '竞争对手资料', count: 23 },
                { id: 'case-studies', name: '成功案例', desc: '客户成功案例', count: 67 }
              ].map(kb => (
                <label
                  key={kb.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all',
                    selectedKnowledgeBases.includes(kb.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedKnowledgeBases.includes(kb.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedKnowledgeBases([...selectedKnowledgeBases, kb.id]);
                      } else {
                        setSelectedKnowledgeBases(selectedKnowledgeBases.filter(id => id !== kb.id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{kb.name}</span>
                      <Badge variant="outline" className="text-xs">{kb.count} 篇</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{kb.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      
      case 3: // Preview
        return (
          <div className="space-y-4 bg-white p-4">
            {/* Agent Info */}
            <div className="space-y-3">
              <div>
                <Label>Agent 名称</Label>
                <Input
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="给你的Agent起个名字"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>描述（可选）</Label>
                <Textarea
                  value={agentDescription}
                  onChange={(e) => setAgentDescription(e.target.value)}
                  placeholder="描述这个Agent的用途..."
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            {/* Summary */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">配置摘要</h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500">Skills</span>
                  <p className="font-medium">{selectedSkills.length} 个</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500">模型</span>
                  <p className="font-medium">{modelConfig.model}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500">知识库</span>
                  <p className="font-medium">{selectedKnowledgeBases.length} 个</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500">Temperature</span>
                  <p className="font-medium">{modelConfig.temperature}</p>
                </div>
              </div>

              {/* Selected Skills */}
              <div>
                <span className="text-gray-500 text-sm">已选 Skills</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedSkills.map(skillId => {
                    const skill = skillRegistry.get(skillId);
                    return skill ? (
                      <Badge key={skillId} variant="secondary" className="gap-1">
                        {skill.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Test Section */}
            {selectedSkills.length > 0 && (
              <>
                <Separator />
                <SkillExecutionPreview
                  skill={skillRegistry.get(selectedSkills[0])!}
                  config={skillConfigs[selectedSkills[0]] || {}}
                />
              </>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!bg-white !max-w-[95vw] !w-[95vw] max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            创建 AI Agent
          </DialogTitle>
          <DialogDescription>
            配置你的专属Agent，选择Skills、模型和知识库
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-6 mt-2">
            <TabsTrigger value="create">创建 Agent</TabsTrigger>
            <TabsTrigger value="tasks">
              任务列表
              {jobs.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {jobs.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="flex-1 flex flex-col mt-0 bg-white">
            {/* Step Indicator */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => setCurrentStep(index)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
                        currentStep === index
                          ? 'bg-blue-50 text-blue-700'
                          : currentStep > index
                          ? 'text-green-600'
                          : 'text-gray-400'
                      )}
                    >
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                        currentStep === index
                          ? 'bg-blue-500 text-white'
                          : currentStep > index
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      )}>
                        {currentStep > index ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className="text-sm font-medium">{step.name}</span>
                    </button>
                    {index < STEPS.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-hidden bg-white">
              <div className="h-full p-6 overflow-auto bg-white">
                {renderStepContent()}
              </div>
            </div>

            {/* Step Actions */}
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                上一步
              </Button>
              
              <div className="flex items-center gap-2">
                {currentStep < STEPS.length - 1 ? (
                  <Button
                    onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
                    disabled={!canProceed()}
                  >
                    下一步
                  </Button>
                ) : (
                  <Button
                    onClick={handleCreateAgent}
                    disabled={!canProceed() || isCreating}
                    className="gap-2"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        创建中...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        创建 Agent
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="px-6 pb-6 mt-4 overflow-y-auto max-h-[60vh] bg-white">
            <div className="space-y-3">
              {jobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>暂无任务</p>
                  <p className="text-sm">创建您的第一个AI Agent任务</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">{job.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <span
                          className={cn(
                            'text-sm',
                            job.status === 'completed' && 'text-green-600',
                            job.status === 'processing' && 'text-blue-600',
                            job.status === 'failed' && 'text-red-600',
                            job.status === 'pending' && 'text-gray-500'
                          )}
                        >
                          {getStatusText(job.status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1">
                        <Progress value={job.progress} className="h-2" />
                      </div>
                      <span className="text-sm text-gray-500 w-10 text-right">
                        {job.progress}%
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      创建时间: {new Date(job.created_at).toLocaleString('zh-CN')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
