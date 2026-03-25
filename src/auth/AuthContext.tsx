import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

interface User {
  id: number;
  name: string;
  email: string;
  iDiscGolfId: number;
  pdgaNumber: number | null;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
  setTokenFromCallback: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('oauth_token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('oauth_token'));

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.getMe();
      setUser({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        iDiscGolfId: res.data.iDiscGolfId,
        pdgaNumber: res.data.pdgaNumber,
      });
    } catch {
      localStorage.removeItem('oauth_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  useEffect(() => {
    const handleLogout = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = () => {
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauth_state', state);
    const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
    const authorizeUrl = import.meta.env.VITE_OAUTH_AUTHORIZE_URL;
    const redirectUri = `${window.location.origin}/oauth/callback`;
    window.location.href = `${authorizeUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  };

  const logout = () => {
    localStorage.removeItem('oauth_token');
    setToken(null);
    setUser(null);
  };

  const setTokenFromCallback = async (accessToken: string) => {
    localStorage.setItem('oauth_token', accessToken);
    setToken(accessToken);
    setLoading(true);
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!user, loading, login, logout, setTokenFromCallback }}>
      {children}
    </AuthContext.Provider>
  );
};
