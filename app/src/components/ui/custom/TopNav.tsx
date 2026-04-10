import { useState } from 'react';
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TopNavProps {
  onCreateClick: () => void;
  className?: string;
}

export function TopNav({ onCreateClick, className }: TopNavProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, title: 'AI Agent任务完成', message: '客户onboarding SOP已生成', time: '5分钟前', unread: true },
    { id: 2, title: '文档更新', message: 'GTM策略指南已更新', time: '1小时前', unread: true },
    { id: 3, title: '团队协作', message: '张明确认了SOP文档', time: '2小时前', unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      className={cn(
        'h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30',
        className
      )}
    >
      {/* Left: Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="全局搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Create Button */}
        <Button
          onClick={onCreateClick}
          className="bg-blue-600 hover:bg-blue-500 text-white gap-2 btn-shine"
          size="sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>创建</span>
          <span className="text-xs bg-blue-500/50 px-1.5 py-0.5 rounded">AI</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 border-b">
              <div className="flex items-center justify-between">
                <span className="font-medium">通知</span>
                <Button variant="ghost" size="sm" className="h-auto py-1 text-xs">
                  全部标记为已读
                </Button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="px-3 py-3 cursor-pointer"
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                        notification.unread ? 'bg-blue-500' : 'bg-transparent'
                      )}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{notification.title}</div>
                      <div className="text-sm text-gray-500">{notification.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Button variant="ghost" size="icon">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                  管
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline">管理员</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2 border-b">
              <div className="font-medium">管理员</div>
              <div className="text-sm text-gray-500">admin@gtmplatform.com</div>
            </div>
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              个人资料
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              设置
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
