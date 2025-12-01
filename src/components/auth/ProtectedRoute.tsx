import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import LoadingSpinner from '../common/LoadingSpinner';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <LoadingSpinner size="small" message="Checking your session..." />
      </div>
    );
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, show fallback or auth prompt
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default: Show auth modal prompt
  return (
    <>
      <div className="protected-route-prompt">
        <div className="prompt-content">
          <h2>Authentication Required</h2>
          <p>Please log in to access this page.</p>
          <button 
            onClick={() => setShowAuthModal(true)}
            className="prompt-login-button"
          >
            Login / Sign Up
          </button>
        </div>
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default ProtectedRoute;
