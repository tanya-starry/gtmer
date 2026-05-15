import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Menu, X, Bot } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
