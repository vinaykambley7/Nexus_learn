import React, { createContext, useContext, useState } from 'react';
import { authService, UserProfile, DEFAULT_ADMIN_USER } from '@/services/supabase/auth';
import { getSupabaseStatus } from '@/services/supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  role: 'admin';
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  switchRole: (role: 'admin') => void;
  supabaseStatus: ReturnType<typeof getSupabaseStatus>;
  allUsers: UserProfile[];
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentSession());
  const supabaseStatus = getSupabaseStatus();

  const refreshUsers = () => {
    // Only NexusAdmin exists
    const current = authService.getCurrentSession();
    if (current) setUser(current);
  };

  const login = async (email: string, pass: string) => {
    const profile = await authService.signIn(email, pass);
    setUser(profile);
  };

  const register = async (email: string, pass: string, name: string) => {
    const profile = await authService.signUp(email, pass, name);
    setUser(profile);
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
  };

  const switchRole = (_newRole: 'admin') => {
    // Single admin mode: always admin
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || DEFAULT_ADMIN_USER,
        role: 'admin',
        isAdmin: true,
        login,
        register,
        logout,
        updateProfile,
        switchRole,
        supabaseStatus,
        allUsers: [user || DEFAULT_ADMIN_USER],
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
