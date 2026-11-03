import React, { createContext, useContext, useState } from 'react';
import { authService, UserProfile, DEFAULT_ADMIN_USER } from '@/services/supabase/auth';
import { getSupabaseStatus } from '@/services/supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  role: 'student' | 'admin';
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  adminCreateStudent: (name: string, email: string, pass: string, track: string) => Promise<UserProfile>;
  adminDeleteStudent: (id: string) => Promise<void>;
  adminToggleStudentStatus: (id: string) => Promise<void>;
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
    const updatedUsers = authService.getStoredUsers();
    setAllUsers(updatedUsers);
    const session = authService.getCurrentSession();
    if (session) setUser(session);
  };

  const login = async (email: string, pass: string) => {
    const profile = await authService.signIn(email, pass);
    setUser(profile);
    refreshUsers();
  };

  const register = async (email: string, pass: string, name: string) => {
    const profile = await authService.signUp(email, pass, name);
    setUser(profile);
    refreshUsers();
  };

  const adminCreateStudent = async (
    name: string,
    email: string,
    pass: string,
    track: string
  ): Promise<UserProfile> => {
    const newStudent = await authService.adminCreateStudent(name, email, pass, track);
    refreshUsers();
    return newStudent;
  };

  const adminDeleteStudent = async (id: string): Promise<void> => {
    await authService.adminDeleteStudent(id);
    refreshUsers();
  };

  const adminToggleStudentStatus = async (id: string): Promise<void> => {
    await authService.adminToggleStudentStatus(id);
    refreshUsers();
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
        user: user || DEFAULT_ADMIN_USER,
        role: user?.role || 'admin',
        isAdmin: user?.role === 'admin',
        login,
        register,
        adminCreateStudent,
        adminDeleteStudent,
        adminToggleStudentStatus,
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
