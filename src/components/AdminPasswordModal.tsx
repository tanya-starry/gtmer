import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Shield } from "lucide-react";

interface AdminPasswordModalProps {
  isOpen: boolean;
  error: string;
  onVerify: (password: string) => void;
  onClose: () => void;
}

export function AdminPasswordModal({
  isOpen,
  error,
  onVerify,
  onClose,
}: AdminPasswordModalProps) {
  const [password, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onVerify(password);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[380px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1E40AF]/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#1E40AF]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#0F172A]">
                    管理员验证
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-[#64748B]">
                请输入管理员密码以进入编辑模式
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码..."
                  className="w-full h-11 pl-10 pr-4 bg-[#FAFAFA] border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all duration-200"
                />
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-[#EF4444]"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-10 text-sm font-medium text-[#64748B] border border-[#E2E8F0] rounded-xl hover:bg-[#F1F5F9] hover:border-[#CBD5E1] transition-all duration-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!password.trim()}
                  className="flex-1 h-10 bg-[#1E40AF] hover:bg-[#2563EB] disabled:bg-[#CBD5E1] disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm"
                >
                  确认
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
