import React, { useState } from 'react';

interface GoogleSignInButtonProps {
  onError?: (error: string) => void;
  disabled?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onError,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    if (!isLoading && !disabled) {
      setIsLoading(true);
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://dev.post-kar.com';
        const baseURL = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;
        const initiateUrl = `${baseURL}/oauth/google/initiate`;
        
        console.log('[GoogleSignInButton] 🚀 Redirecting to:', initiateUrl);
        
        // Simply redirect - OAuth must use full page navigation
        window.location.href = initiateUrl;
        
      } catch (error) {
        console.error('[GoogleSignInButton] ❌ Exception:', error);
        const message = error instanceof Error ? error.message : 'Failed to sign in with Google';
        onError?.(message);
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={disabled || isLoading}
      className="google-signin-button"
      style={{
        width: '100%',
        padding: '12px 16px',
        backgroundColor: '#ffffff',
        border: '1px solid #dadce0',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: 500,
        color: '#3c4043',
        cursor: isLoading || disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: isLoading || disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isLoading && !disabled) {
          e.currentTarget.style.backgroundColor = '#f8f9fa';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#ffffff';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {isLoading ? (
        <>
          <div
            style={{
              width: '18px',
              height: '18px',
              border: '2px solid #e0e0e0',
              borderTop: '2px solid #4285f4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span>Redirecting...</span>
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <path
                d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </g>
          </svg>
          <span>Continue with Google</span>
        </>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};