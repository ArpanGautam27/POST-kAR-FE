import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');
      const userDataStr = searchParams.get('user');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError(errorParam);
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      if (!token) {
        setError('Missing access token');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      // Store refresh token
      if (refreshToken) {
        localStorage.setItem('postkar-refresh-token', refreshToken);
      }

      // Parse user ONLY if present
      let user = null;
      if (userDataStr) {
        try {
          user = JSON.parse(userDataStr); // 🔥 NO decodeURIComponent
        } catch (e) {
          console.warn('User parsing failed, continuing without user');
        }
      }

      // Login using token (source of truth)
      login(token, user);

      // Prevent navigation deadlock
      setTimeout(() => navigate('/'), 0);

    } catch (err) {
      console.error('[OAuthCallback] Fatal error:', err);
      setError('Authentication failed');
      setTimeout(() => navigate('/'), 3000);
    }
  }, [searchParams, navigate, login]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      {error ? (
        <>
          <h2 style={{ color: '#e74c3c' }}>Authentication Failed</h2>
          <p>{error}</p>
        </>
      ) : (
        <>
          <h2>Completing Sign In…</h2>
          <p>Please wait while we authenticate you.</p>
        </>
      )}
    </div>
  );
}
