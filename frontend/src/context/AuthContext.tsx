import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api/client';
import { User } from '@/types';

interface LoginData {
  email: string;
  password: string;
  username?: string;
  [key: string]: unknown;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error al parsear usuario guardado", e);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    const payload = {
      ...data, 
      username: data.email 
    };
    
    const res = await apiClient.post('/auth/login', payload);
    const responseData = res.data || res;

    const newToken = responseData.access_token || responseData.token;
    const userData = responseData.user;

    if (!newToken) throw new Error('No se recibió token');

    setToken(newToken);
    localStorage.setItem('auth_token', newToken);

    if (userData) {
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } else {
      try {
        const base64Url = newToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decoded = JSON.parse(jsonPayload);
        
        const tempUser: User = { 
            id: decoded.sub || decoded.id, 
            name: decoded.name || 'Usuario',
            email: decoded.email || decoded.username, 
            created_at: new Date().toISOString(),
            role: decoded.role || 'USER'
        };
        
        setUser(tempUser);
        localStorage.setItem('auth_user', JSON.stringify(tempUser));
      } catch (e) {
        console.warn("No se pudo decodificar el token automáticamente.");
      }
    }
  };

  const register = async (data: RegisterData) => {
    const res = await apiClient.post('/auth/register', data);
    const responseData = res.data || res;
    
    const newToken = responseData.access_token || responseData.token;
    const userData = responseData.user;

    if (newToken) {
      setToken(newToken);
      localStorage.setItem('auth_token', newToken);
      if (userData) {
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      }
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
 
    const updatedUser = { ...user, ...data } as User;
    
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};