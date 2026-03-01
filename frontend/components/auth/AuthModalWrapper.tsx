"use client";

import { useAuth } from "@/components/providers/AuthContext";
import { AuthModal } from "./AuthModal";

export function AuthModalWrapper() {
  const { isAuthModalOpen, closeAuthModal, authModalMode } = useAuth();
  
  return (
    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={closeAuthModal} 
      initialMode={authModalMode} 
    />
  );
}
