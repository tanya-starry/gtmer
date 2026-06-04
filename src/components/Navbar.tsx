import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Menu, X, Bot, ShieldCheck, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface NavbarProps {
  isAdmin: boolean;
  onLogout: () => void;
}

export function Navbar({ isAdmin, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug: API Key status
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const apiKeyStatus = apiKey
    ? `已配置 (${apiKey.slice(0, 12)}...${apiKey.slice(-4)})`
    : "未配置";
  const apiKeyOk = !!apiKey;

  const scrollToAgentWorkshop = (openCreate: boolean = false) => {
    const el = document.getElementById("agent-workshop");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      if (openCreate) {
        // 延迟触发创建面板，等滚动完成
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-create-agent"));
        }, 400);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-white/90 backdrop-blur-xl border-b border-[#E2E8F0]">
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-[#0F172A] group-hover:text-[#1E40AF] transition-colors duration-200">
            GTMer
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Admin badge */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden sm:flex items-center gap-2"
            >
              <span className="flex items-center gap-1.5 px-3 h-8 bg-[#ECFDF5] text-[#059669] text-xs font-medium rounded-full border border-[#D1FAE5]">
                <ShieldCheck className="w-3.5 h-3.5" />
                管理模式
              </span>
              <span
                className={`hidden lg:inline-flex items-center px-2.5 h-7 text-[10px] font-medium rounded-full ${apiKeyOk ? "bg-[#EFF6FF] text-[#1E40AF]" : "bg-[#FEF2F2] text-[#EF4444]"}`}
                title="VITE_OPENAI_API_KEY 环境变量状态"
              >
                API Key: {apiKeyStatus}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 rounded-full border border-[#E2E8F0] hover:border-[#FECACA] transition-all duration-200"
                title="退出管理模式"
              >
                <LogOut className="w-3.5 h-3.5" />
                退出
              </button>
            </motion.div>
          )}

          <button
            onClick={() => scrollToAgentWorkshop(true)}
            className="hidden sm:flex items-center gap-2 px-5 h-10 bg-[#1E40AF] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            创建
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 transition-shadow duration-200">
            T
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-[72px] left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] shadow-lg"
          >
            <div className="px-4 py-3 space-y-1">
              {/* Admin mobile controls */}
              {isAdmin && (
                <div className="flex items-center gap-2 px-4 py-2 mb-2 border-b border-[#E2E8F0] pb-3">
                  <span className="flex items-center gap-1.5 px-3 h-7 bg-[#ECFDF5] text-[#059669] text-xs font-medium rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    管理模式
                  </span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center gap-1 px-3 h-7 text-xs text-[#64748B] hover:text-[#EF4444]"
                  >
                    <LogOut className="w-3 h-3" />
                    退出
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToAgentWorkshop(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              >
                <Plus className="w-4 h-4" />
                创建Agent
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
