import { supabase, isSupabaseConfigured } from './client';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'student' | 'admin';
  streakDays: number;
  totalHoursLearned: number;
  dailyGoalMinutes: number;
  enrolledTracks: string[];
  status?: 'Active' | 'Suspended';
  password?: string;
}

const LOCAL_USERS_KEY = 'nexus_auth_users_v2';
const CURRENT_SESSION_KEY = 'nexus_auth_session_v2';

const DEFAULT_ADMIN_USER: UserProfile = {
  id: 'usr-admin-01',
  email: 'admin@nexuslearn.io',
  fullName: 'Platform Administrator',
  password: 'admin123',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
  role: 'admin',
  streakDays: 45,
  totalHoursLearned: 180,
  dailyGoalMinutes: 60,
  enrolledTracks: ['full-stack', 'ai-tools', 'ai-engineering'],
  status: 'Active',
};

const DEFAULT_DEMO_USERS: UserProfile[] = [
  DEFAULT_ADMIN_USER,
];

export const authService = {
  getStoredUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(LOCAL_USERS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to read users from localStorage', e);
    }
    // Initialize default users if not present
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
    return DEFAULT_DEMO_USERS;
  },

  getCurrentSession(): UserProfile | null {
    try {
      const session = localStorage.getItem(CURRENT_SESSION_KEY);
      if (session) return JSON.parse(session);
    } catch (e) {
      console.warn('Failed to read session', e);
    }
    // Default to Administrator session
    return DEFAULT_ADMIN_USER;
  },

  async signIn(email: string, _password: string): Promise<UserProfile> {
    const trimmedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: _password,
      });
      if (error) throw error;
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const userProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email || trimmedEmail,
          fullName: profile?.full_name || 'Learner',
          avatarUrl: profile?.avatar_url,
          role: profile?.role || 'student',
          streakDays: profile?.streak_days || 1,
          totalHoursLearned: profile?.total_hours_learned || 0,
          dailyGoalMinutes: 45,
          enrolledTracks: ['full-stack', 'ai-tools', 'ai-engineering'],
          status: 'Active',
        };
        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(userProfile));
        return userProfile;
      }
    }

    // Local resilient auth verification (Admin Only)
    const users = this.getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (existing) {
      if (existing.role !== 'admin') {
        throw new Error('Access denied. Only platform administrators are permitted to log in.');
      }
      if (existing.status === 'Suspended') {
        throw new Error('This administrator account has been suspended.');
      }
      if (existing.password && _password && existing.password !== _password) {
        throw new Error('Incorrect password. Please verify your administrator credentials.');
      }
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(existing));
      return existing;
    }

    throw new Error('Access denied. Only authorized administrator accounts can sign in.');
  },

  async signUp(_email: string, _password: string, _fullName: string, _role: 'student' | 'admin' = 'admin'): Promise<UserProfile> {
    throw new Error('Public registration is disabled. Only the platform administrator can access this system.');
  },

  async adminCreateStudent(fullName: string, email: string, password: string, assignedTrack: string): Promise<UserProfile> {
    const trimmedEmail = email.trim().toLowerCase();
    const users = this.getStoredUsers();

    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);
    if (existingIndex !== -1) {
      throw new Error(`A student account with email "${trimmedEmail}" already exists.`);
    }

    const newStudent: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      email: trimmedEmail,
      fullName,
      password,
      role: 'student',
      streakDays: 0,
      totalHoursLearned: 0,
      dailyGoalMinutes: 45,
      enrolledTracks: [assignedTrack.toLowerCase().includes('ai-tools') ? 'ai-tools' : assignedTrack.toLowerCase().includes('engineering') ? 'ai-engineering' : 'full-stack'],
      status: 'Active',
    };

    users.push(newStudent);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signUp({
          email: trimmedEmail,
          password: password,
          options: {
            data: { full_name: fullName, role: 'student', enrolled_track: assignedTrack },
          },
        });
      } catch (err) {
        console.warn('Supabase cloud user creation note:', err);
      }
    }

    return newStudent;
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(CURRENT_SESSION_KEY);
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = this.getCurrentSession();
    if (!current) throw new Error('Not authenticated');

    const updated = { ...current, ...updates };

    if (isSupabaseConfigured() && supabase) {
      await supabase
        .from('profiles')
        .update({
          full_name: updated.fullName,
          avatar_url: updated.avatarUrl,
        })
        .eq('id', current.id);
    }

    const users = this.getStoredUsers();
    const index = users.findIndex((u) => u.id === current.id);
    if (index !== -1) {
      users[index] = updated;
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    }

    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(updated));
    return updated;
  }
};
