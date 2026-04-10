import { useState, useEffect, useCallback } from 'react';
import { EditableSidebar } from '@/components/ui/custom/EditableSidebar';
import { TopNav } from '@/components/ui/custom/TopNav';
import { ContentArea } from '@/components/ui/custom/ContentArea';
import { AgentPanel } from '@/components/ui/custom/AgentPanel';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import type { Document } from '@/types';
import { mockData } from '@/lib/supabase';

function App() {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [agentPanelOpen, setAgentPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial document
  useEffect(() => {
    const loadInitialDoc = async () => {
      setIsLoading(true);
      try {
        // Try to get first document from mock data
        const firstDoc = mockData.documents[0];
        if (firstDoc) {
          setSelectedDoc(firstDoc);
        }
      } catch (error) {
        console.error('Error loading document:', error);
        toast.error('加载文档失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialDoc();
  }, []);

  const handleEditDoc = useCallback((doc: Document) => {
    toast.info('编辑功能开发中', {
      description: `即将编辑: ${doc.title}`,
    });
  }, []);

  const handleDeleteDoc = useCallback((doc: Document) => {
    toast.warning('删除功能开发中', {
      description: `即将删除: ${doc.title}`,
      action: {
        label: '确认',
        onClick: () => {
          toast.success('文档已删除');
        },
      },
    });
  }, []);

  const handleShareDoc = useCallback((doc: Document) => {
    // Copy link to clipboard
    const link = `${window.location.origin}/doc/${doc.id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('链接已复制到剪贴板');
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toast.info('搜索功能', {
          description: '使用左侧搜索框进行文档搜索',
        });
      }
      // Cmd/Ctrl + N for new
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setAgentPanelOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <EditableSidebar
        onCreateClick={() => setAgentPanelOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Navigation */}
        <TopNav onCreateClick={() => setAgentPanelOpen(true)} />

        {/* Content Area */}
        <ContentArea
          document={selectedDoc}
          onEdit={handleEditDoc}
          onDelete={handleDeleteDoc}
          onShare={handleShareDoc}
        />
      </div>

      {/* Agent Panel Dialog */}
      <AgentPanel open={agentPanelOpen} onOpenChange={setAgentPanelOpen} />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          },
        }}
      />
    </div>
  );
}

export default App;
