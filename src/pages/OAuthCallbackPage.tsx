import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userDataStr = searchParams.get('user');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(errorParam);
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (token && userDataStr) {
          const user = JSON.parse(decodeURIComponent(userDataStr));
          login(token, user);
          navigate('/');
        } else {
          setError('Missing authentication data');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        console.error('[OAuthCallback] Error:', err);
        setError('Authentication failed');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      {error ? (
        <>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <h2 style={{ color: '#e74c3c', marginBottom: '10px' }}>Authentication Failed</h2>
          <p style={{ color: '#666' }}>{error}</p>
          <p style={{ color: '#999', fontSize: '14px', marginTop: '20px' }}>
            Redirecting to home page...
          </p>
        </>
      ) : (
        <>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e0e0e0',
            borderTop: '3px solid #4285f4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }} />
          <h2 style={{ color: '#333', marginBottom: '10px' }}>Completing Sign In...</h2>
          <p style={{ color: '#666' }}>Please wait while we authenticate you.</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
