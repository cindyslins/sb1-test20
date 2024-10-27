import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import * as api from '../lib/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.login(username, password);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (err) {
      setError('Invalid credentials');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.register(username, password);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (err) {
      setError('Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);