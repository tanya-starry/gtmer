import { Bot, Github, Twitter, Mail } from "lucide-react";
import { useAdminTrigger } from "../hooks/useAdminMode";

interface FooterProps {
  isAdmin: boolean;
  onTriggerPassword: () => void;
}

export function Footer({ isAdmin, onTriggerPassword }: FooterProps) {
  const handleTrigger = useAdminTrigger(isAdmin, onTriggerPassword);

  return (
    <footer className="bg-white border-t border-[#E2E8F0] py-8">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">GTMer</span>
            <span className="text-sm text-[#94A3B8]">|</span>
            <span className="text-sm text-[#94A3B8]">GTM 智能中台</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-[#94A3B8] hover:text-[#1E40AF] transition-colors duration-200"
              onClick={(e) => e.preventDefault()}
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-[#94A3B8] hover:text-[#1E40AF] transition-colors duration-200"
              onClick={(e) => e.preventDefault()}
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-[#94A3B8] hover:text-[#1E40AF] transition-colors duration-200"
              onClick={(e) => e.preventDefault()}
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright - hidden trigger */}
          <button
            onClick={handleTrigger}
            className="text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-default select-none"
          >
            © 2026 GTMer. All rights reserved.
          </button>
        </div>
      </div>
    </footer>
  );
}
