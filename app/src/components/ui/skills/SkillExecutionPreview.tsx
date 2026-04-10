import { useState } from 'react';
import {
  Play,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Terminal,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Skill, SkillExecutionResult } from '@/lib/skills';
import { skillExecutor } from '@/lib/skills';

interface SkillExecutionPreviewProps {
  skill: Skill;
  config: Record<string, any>;
  className?: string;
}

export function SkillExecutionPreview({ skill, config, className }: SkillExecutionPreviewProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<SkillExecutionResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    setResult(null);

    try {
      const executionResult = await skillExecutor.execute({
        skillId: skill.id,
        input: config,
        modelConfig: config.model ? {
          provider: 'openai',
          model: config.model,
          parameters: { temperature: 0.7 }
        } : undefined
      });

      setResult(executionResult);
    } catch (error) {
      setResult({
        success: false,
        error: {
          code: 'EXECUTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        metadata: {
          skillId: skill.id,
          executionTime: 0,
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = () => {
    if (result?.output) {
      navigator.clipboard.writeText(
        typeof result.output === 'string' 
          ? result.output 
          : JSON.stringify(result.output, null, 2)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatOutput = (output: any): string => {
    if (typeof output === 'string') return output;
    return JSON.stringify(output, null, 2);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Execute Button */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">执行预览</h4>
          <p className="text-sm text-gray-500">测试 Skill 执行效果</p>
        </div>
        <Button
          onClick={handleExecute}
          disabled={isExecuting}
          className="gap-2"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              执行中...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              执行测试
            </>
          )}
        </Button>
      </div>

      {/* Execution Result */}
      {result && (
        <div className={cn(
          'border rounded-lg overflow-hidden',
          result.success ? 'border-green-200' : 'border-red-200'
        )}>
          {/* Result Header */}
          <div className={cn(
            'px-4 py-3 flex items-center justify-between',
            result.success ? 'bg-green-50' : 'bg-red-50'
          )}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={cn(
                'font-medium',
                result.success ? 'text-green-800' : 'text-red-800'
              )}>
                {result.success ? '执行成功' : '执行失败'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{result.metadata.executionTime}ms</span>
              </div>
              {result.success && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      复制
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Result Content */}
          <div className="p-4">
            {result.success ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    输出结果
                  </Badge>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    {showDetails ? '收起详情' : '查看详情'}
                    {showDetails ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <ScrollArea className="h-64 border rounded-md bg-gray-50">
                  <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                    {formatOutput(result.output)}
                  </pre>
                </ScrollArea>

                {showDetails && (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-xs font-medium text-gray-500">执行详情</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">Skill ID</span>
                        <p className="font-mono">{result.metadata.skillId}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">执行时间</span>
                        <p className="font-mono">{result.metadata.executionTime}ms</p>
                      </div>
                      {result.metadata.tokensUsed && (
                        <>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">输入 Tokens</span>
                            <p className="font-mono">{result.metadata.tokensUsed.input}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">输出 Tokens</span>
                            <p className="font-mono">{result.metadata.tokensUsed.output}</p>
                          </div>
                        </>
                      )}
                      {result.metadata.modelUsed && (
                        <div className="bg-gray-50 p-2 rounded col-span-2">
                          <span className="text-gray-500">使用模型</span>
                          <p className="font-mono">{result.metadata.modelUsed}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-600">
                  <Terminal className="w-5 h-5" />
                  <span className="font-medium">错误信息</span>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm font-mono text-red-800">
                    [{result.error?.code}] {result.error?.message}
                  </p>
                  {result.error?.details && (
                    <pre className="mt-2 text-xs text-red-700 overflow-auto">
                      {JSON.stringify(result.error.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      {!result && !isExecuting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Terminal className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 text-sm">测试提示</p>
              <ul className="mt-1 text-sm text-blue-700 space-y-1">
                <li>• 确保所有必填字段已填写</li>
                <li>• 测试执行使用模拟响应，实际环境将调用真实AI</li>
                <li>• 可以调整高级配置来优化执行效果</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
