'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export type UserRole = 'faculty' | 'student' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'admin';
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const supabase = createClient();

  // Load session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const activeUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: userMeta.name || session.user.email?.split('@')[0] || 'User',
            role: (userMeta.role as UserRole) || 'student',
            department: userMeta.department || 'Computer Science',
          };
          setUser(activeUser);
          localStorage.setItem('campus_user', JSON.stringify(activeUser));
        } else {
          const savedUser = localStorage.getItem('campus_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userMeta = session.user.user_metadata || {};
        const activeUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: userMeta.name || session.user.email?.split('@')[0] || 'User',
          role: (userMeta.role as UserRole) || 'student',
          department: userMeta.department || 'Computer Science',
        };
        setUser(activeUser);
        localStorage.setItem('campus_user', JSON.stringify(activeUser));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('campus_user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || 'Invalid credentials');
      }

      if (data?.user) {
        const userMeta = data.user.user_metadata || {};
        const loggedUser: User = {
          id: data.user.id,
          email: data.user.email || email,
          name: userMeta.name || email.split('@')[0] || 'User',
          role: (userMeta.role as UserRole) || 'student',
          department: userMeta.department || 'Computer Science',
        };

        // Sync to database
        await fetch('/api/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loggedUser),
        }).catch((err) => console.warn('Async profile sync note:', err));

        setUser(loggedUser);
        localStorage.setItem('campus_user', JSON.stringify(loggedUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
            department: data.department || 'Computer Science',
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Registration failed');
      }

      const newUser: User = {
        id: authData.user?.id || `usr_${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department || 'Computer Science',
      };

      // Sync user profile to database
      await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }).catch((e) => console.warn('Async profile sync note:', e));

      setUser(newUser);
      localStorage.setItem('campus_user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Signout notice:', e);
    } finally {
      setUser(null);
      localStorage.removeItem('campus_user');
      setIsLoading(false);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
