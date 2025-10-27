import React from 'react';
import { X } from 'lucide-react';
import { AuthForm } from './AuthForm';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose
}) => {

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            Welcome to POST-kAR
          </h2>
          <button
            onClick={onClose}
            className="auth-modal-close"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="auth-modal-content">
          <AuthForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
