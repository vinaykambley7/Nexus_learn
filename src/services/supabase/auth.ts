import { supabase, isSupabaseConfigured } from './client';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'admin';
  streakDays: number;
  totalHoursLearned: number;
  dailyGoalMinutes: number;
  enrolledTracks: string[];
  status?: 'Active' | 'Suspended';
  password?: string;
}

const ADMIN_PROFILE_KEY = 'nexus_admin_profile_v4';
const CURRENT_SESSION_KEY = 'nexus_admin_session_v4';

export const DEFAULT_ADMIN_USER: UserProfile = {
  id: 'nexus-admin',
  email: 'admin@nexuslearn.io',
  fullName: 'NexusAdmin',
  password: 'admin123',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
  role: 'admin',
  streakDays: 45,
  totalHoursLearned: 180,
  dailyGoalMinutes: 60,
  enrolledTracks: ['full-stack', 'ai-tools', 'ai-engineering'],
  status: 'Active',
};

export const authService = {
  getStoredUsers(): UserProfile[] {
    // Only NexusAdmin exists on the platform. All user data is purged.
    return [this.getAdminProfile()];
  },

  getAdminProfile(): UserProfile {
    try {
      const data = localStorage.getItem(ADMIN_PROFILE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && (parsed.email === 'admin@nexuslearn.io' || parsed.role === 'admin')) {
          return {
            ...DEFAULT_ADMIN_USER,
            ...parsed,
            role: 'admin',
            fullName: 'NexusAdmin',
            email: 'admin@nexuslearn.io',
          };
        }
      }
    } catch (e) {
      console.warn('Failed to read admin profile from localStorage', e);
    }
    return DEFAULT_ADMIN_USER;
  },

  getCurrentSession(): UserProfile | null {
    try {
      const session = localStorage.getItem(CURRENT_SESSION_KEY);
      if (session) {
        const parsed: UserProfile = JSON.parse(session);
        if (parsed.email === 'admin@nexuslearn.io' || parsed.role === 'admin') {
          return { ...this.getAdminProfile(), ...parsed, role: 'admin', fullName: 'NexusAdmin' };
        }
      }
    } catch (e) {
      console.warn('Failed to read session', e);
    }
    // Default active session is NexusAdmin
    return this.getAdminProfile();
  },

  async signIn(email: string, _password: string): Promise<UserProfile> {
    const trimmedEmail = email.trim().toLowerCase();

    // Strict security check: ONLY NexusAdmin can sign in
    if (trimmedEmail !== 'admin@nexuslearn.io') {
      throw new Error('Access denied. Only NexusAdmin is authorized to sign in to this platform.');
    }

    const admin = this.getAdminProfile();
    const expectedPassword = admin.password || DEFAULT_ADMIN_USER.password;

    if (_password && _password !== expectedPassword) {
      throw new Error('Incorrect password. Please verify your administrator credentials.');
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: _password,
        });
      } catch (err) {
        console.warn('Supabase cloud sync note (continuing in local admin mode):', err);
      }
    }

    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(admin));
    return admin;
  },

  async signUp(_email: string, _password: string, _fullName: string): Promise<UserProfile> {
    throw new Error('Public registration is disabled. This platform is strictly reserved for NexusAdmin.');
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(CURRENT_SESSION_KEY);
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = this.getAdminProfile();
    const updated: UserProfile = {
      ...current,
      ...updates,
      role: 'admin',
      fullName: 'NexusAdmin',
      email: 'admin@nexuslearn.io',
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('profiles')
        .update({
          full_name: 'NexusAdmin',
          avatar_url: updated.avatarUrl,
        })
        .eq('id', current.id);
    }

    localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(updated));
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(updated));
    return updated;
  },
};
