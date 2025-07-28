import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface UseAuthModalReturn {
  isAuthModalOpen: boolean;
  authModalActionMessage: string;
  openAuthModal: (actionMessage?: string) => boolean;
  closeAuthModal: () => void;
  authSuccess: () => void;
  authActionCallback: (() => void) | null;
  setAuthActionCallback: (callback: () => void | null) => void;
}

export function useAuthModal(): UseAuthModalReturn {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalActionMessage, setAuthModalActionMessage] =
    useState("fortsett");
  const [authActionCallback, setAuthActionCallback] = useState<
    (() => void) | null
  >(null);

  const openAuthModal = (actionMessage = "fortsett") => {
    if (!isAuthenticated) {
      setAuthModalActionMessage(actionMessage);
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthActionCallback(null);
  };

  const authSuccess = () => {
    if (authActionCallback) {
      authActionCallback();
    }
    closeAuthModal();
  };

  return {
    isAuthModalOpen,
    authModalActionMessage,
    openAuthModal,
    closeAuthModal,
    authSuccess,
    authActionCallback,
    setAuthActionCallback,
  };
}
