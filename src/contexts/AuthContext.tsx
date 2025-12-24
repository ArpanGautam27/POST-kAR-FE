import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface User {
  id: string;
  mobileNumber?: string;
  email?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (token: string, user?: User | null) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'postkar-auth-token';
const USER_KEY = 'postkar-user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser);

          // Check if token is expired (basic check - in real app, decode JWT)
          const tokenData = parseJWT(storedToken);
          if (tokenData && tokenData.exp * 1000 > Date.now()) {
            setAuthState({
              user,
              token: storedToken,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          } else {
            // Token expired, clear storage
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }));
    };

    initializeAuth();
  }, []);

  const login = useCallback((token: string, user?: User | null) => {
    console.log('[AuthContext] login() called', {
      hasToken: !!token,
      hasUser: !!user
    });

    // Store token (required)
    localStorage.setItem(TOKEN_KEY, token);

    // Store user only if provided
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    // ✅ SYNCHRONOUS state update - NO async, NO delays
    setAuthState({
      user: user || null,
      token,
      isAuthenticated: true,
      isLoading: false,
    });

    console.log('[AuthContext] Auth state updated', {
      isAuthenticated: true,
      token: token.substring(0, 20) + '...'
    });
  }, []); // ✅ Empty deps = stable function reference

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []); // ✅ Empty deps = stable function reference

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setAuthState(prev => {
      if (prev.user) {
        const newUser = { ...prev.user, ...updatedUser };
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
        return {
          ...prev,
          user: newUser,
        };
      }
      return prev;
    });
  }, []); // ✅ Empty deps = stable function reference

  const setLoading = useCallback((loading: boolean) => {
    setAuthState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []); // ✅ No dependencies - function is stable

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        updateUser,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to parse JWT (basic implementation)
function parseJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}
