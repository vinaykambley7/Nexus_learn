import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserProfile } from '@/services/supabase/auth';
import { getSupabaseStatus } from '@/services/supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  role: 'student' | 'admin';
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, role?: 'student' | 'admin') => Promise<void>;
  adminCreateStudent: (name: string, email: string, pass: string, track: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  switchRole: (role: 'student' | 'admin') => void;
  supabaseStatus: ReturnType<typeof getSupabaseStatus>;
  allUsers: UserProfile[];
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentSession());
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => authService.getStoredUsers());
  const supabaseStatus = getSupabaseStatus();

  const refreshUsers = () => {
    setAllUsers(authService.getStoredUsers());
  };

  const login = async (email: string, pass: string) => {
    const profile = await authService.signIn(email, pass);
    setUser(profile);
    refreshUsers();
  };

  const register = async (email: string, pass: string, name: string, role: 'student' | 'admin' = 'student') => {
    const profile = await authService.signUp(email, pass, name, role);
    setUser(profile);
    refreshUsers();
  };

  const adminCreateStudent = async (name: string, email: string, pass: string, track: string): Promise<UserProfile> => {
    const newStudent = await authService.adminCreateStudent(name, email, pass, track);
    refreshUsers();
    return newStudent;
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    refreshUsers();
  };

  const switchRole = (newRole: 'student' | 'admin') => {
    if (!user) return;
    const updated: UserProfile = { ...user, role: newRole };
    authService.updateProfile({ role: newRole });
    setUser(updated);
    refreshUsers();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isAdmin: user?.role === 'admin',
        login,
        register,
        adminCreateStudent,
        logout,
        updateProfile,
        switchRole,
        supabaseStatus,
        allUsers,
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
