import { useState, useEffect, useCallback, useRef } from "react";

const ADMIN_KEY = "gtmer_admin";
const ADMIN_PASSWORD = "gtm2025admin";

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Check sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_KEY);
      if (stored === "true") {
        setIsAdmin(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const verifyPassword = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(ADMIN_KEY, "true");
      } catch {
        // ignore
      }
      setIsAdmin(true);
      setPasswordError("");
      setShowPasswordModal(false);
      return true;
    } else {
      setPasswordError("密码错误");
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(ADMIN_KEY);
    } catch {
      // ignore
    }
    setIsAdmin(false);
    setPasswordError("");
    window.location.reload();
  }, []);

  const openPasswordModal = useCallback(() => {
    setPasswordError("");
    setShowPasswordModal(true);
  }, []);

  const closePasswordModal = useCallback(() => {
    setShowPasswordModal(false);
    setPasswordError("");
  }, []);

  return {
    isAdmin,
    showPasswordModal,
    passwordError,
    verifyPassword,
    logout,
    openPasswordModal,
    closePasswordModal,
  };
}

// Hook for the hidden trigger (triple-click on footer copyright)
export function useAdminTrigger(
  isAdmin: boolean,
  onTrigger: () => void
) {
  const clickCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(() => {
    if (isAdmin) return; // Already admin, no need to trigger

    clickCountRef.current += 1;

    // Reset count after 2 seconds of inactivity
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      onTrigger();
    }
  }, [isAdmin, onTrigger]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return handleClick;
}
