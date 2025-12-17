import React, { useState } from 'react';
import { GoogleSignInButton } from './GoogleSignInButton';

interface AuthFormProps {
  onSuccess: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [error, setError] = useState('');

  const handleGoogleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="auth-form">
      <div className="auth-form-header">
        <h2 className="auth-form-title">Welcome to PostKAR</h2>
        <p className="auth-form-subtitle">Sign in with your Google account to continue</p>
      </div>

      <GoogleSignInButton
        onSuccess={onSuccess}
        onError={handleGoogleError}
      />

      {error && (
        <div className="auth-form-error" style={{ marginTop: '16px' }}>
          {error}
        </div>
      )}

      <div className="auth-form-divider" style={{ margin: '24px 0', textAlign: 'center', color: '#666' }}>
        <span style={{ padding: '0 12px', background: '#fff' }}>OR</span>
      </div>

      <div className="auth-form-info">
        <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', lineHeight: '1.5' }}>
          By continuing, you agree to PostKAR's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

// Add CSS styles
const styles = `
  .auth-form-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .auth-form-title {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .auth-form-subtitle {
    font-size: 14px;
    color: #666;
  }

  .auth-form-divider {
    position: relative;
    display: flex;
    align-items: center;
  }

  .auth-form-divider::before,
  .auth-form-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e0e0e0;
  }

  .auth-form-divider span {
    padding: 0 12px;
    background: #fff;
    font-size: 12px;
    color: #999;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default AuthForm;
