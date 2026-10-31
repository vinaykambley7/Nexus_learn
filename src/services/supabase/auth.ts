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

const LOCAL_USERS_KEY = 'nexus_auth_users_v3';
const CURRENT_SESSION_KEY = 'nexus_auth_session_v3';

export const DEFAULT_ADMIN_USER: UserProfile = {
  id: 'usr-admin-01',
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
    try {
      const data = localStorage.getItem(LOCAL_USERS_KEY);
      if (data) {
        let parsed: UserProfile[] = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove any legacy mock users (Alex Mercer or @example.com dummy records)
          parsed = parsed.filter(
            (u) =>
              u.email.toLowerCase() !== 'alex.mercer@nexuslearn.io' &&
              !u.email.toLowerCase().includes('@example.com') &&
              u.fullName !== 'Alex Mercer'
          );

          // Ensure admin user profile has fullName 'NexusAdmin'
          parsed = parsed.map((u) => {
            if (u.role === 'admin' || u.email.toLowerCase() === 'admin@nexuslearn.io') {
              return { ...u, fullName: 'NexusAdmin' };
            }
            return u;
          });

          // Ensure default admin user is present
          if (!parsed.some((u) => u.role === 'admin' || u.email.toLowerCase() === 'admin@nexuslearn.io')) {
            parsed.unshift(DEFAULT_ADMIN_USER);
          }

          localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(parsed));
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read users from localStorage', e);
    }

    // Default clean state: NexusAdmin only (0 dummy users)
    const initialUsers = [DEFAULT_ADMIN_USER];
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  },

  getCurrentSession(): UserProfile | null {
    try {
      const session = localStorage.getItem(CURRENT_SESSION_KEY);
      if (session) {
        const parsed: UserProfile = JSON.parse(session);
        // Purge any stale session of Alex Mercer
        if (
          parsed.email.toLowerCase() === 'alex.mercer@nexuslearn.io' ||
          parsed.fullName === 'Alex Mercer'
        ) {
          localStorage.removeItem(CURRENT_SESSION_KEY);
          return DEFAULT_ADMIN_USER;
        }
        if (parsed.role === 'admin' || parsed.email.toLowerCase() === 'admin@nexuslearn.io') {
          return { ...parsed, fullName: 'NexusAdmin' };
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to read session', e);
    }
    // Default to NexusAdmin session
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
          fullName: profile?.full_name || (trimmedEmail === 'admin@nexuslearn.io' ? 'NexusAdmin' : 'Learner'),
          avatarUrl: profile?.avatar_url,
          role: profile?.role || (trimmedEmail === 'admin@nexuslearn.io' ? 'admin' : 'student'),
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

    // Local resilient auth verification (NexusAdmin & Admin-provisioned users)
    const users = this.getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (existing) {
      if (existing.status === 'Suspended') {
        throw new Error('This account has been suspended by the administrator.');
      }
      if (existing.password && _password && existing.password !== _password) {
        throw new Error('Incorrect password. Please verify your credentials.');
      }
      const sessionUser =
        existing.role === 'admin' || existing.email.toLowerCase() === 'admin@nexuslearn.io'
          ? { ...existing, fullName: 'NexusAdmin' }
          : existing;
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    }

    throw new Error('User account not found. Accounts are created and provisioned exclusively by NexusAdmin.');
  },

  async signUp(_email: string, _password: string, _fullName: string, _role: 'student' | 'admin' = 'admin'): Promise<UserProfile> {
    throw new Error('Public registration is disabled. Only NexusAdmin can create and provision user accounts.');
  },

  async adminCreateStudent(fullName: string, email: string, password: string, assignedTrack: string): Promise<UserProfile> {
    const trimmedEmail = email.trim().toLowerCase();
    const users = this.getStoredUsers();

    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);
    if (existingIndex !== -1) {
      throw new Error(`A user account with email "${trimmedEmail}" already exists.`);
    }

    const newStudent: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      email: trimmedEmail,
      fullName: fullName.trim(),
      password,
      role: 'student',
      streakDays: 0,
      totalHoursLearned: 0,
      dailyGoalMinutes: 45,
      enrolledTracks: [
        assignedTrack.toLowerCase().includes('ai-tools')
          ? 'ai-tools'
          : assignedTrack.toLowerCase().includes('engineering')
          ? 'ai-engineering'
          : 'full-stack',
      ],
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
            data: { full_name: fullName.trim(), role: 'student', enrolled_track: assignedTrack },
          },
        });
      } catch (err) {
        console.warn('Supabase cloud user creation note:', err);
      }
    }

    return newStudent;
  },

  async adminDeleteUser(id: string): Promise<void> {
    const users = this.getStoredUsers().filter((u) => u.id !== id);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  },

  async adminToggleStatus(id: string): Promise<UserProfile[]> {
    const users = this.getStoredUsers().map((u) => {
      if (u.id === id) {
        return {
          ...u,
          status: (u.status === 'Suspended' ? 'Active' : 'Suspended') as 'Active' | 'Suspended',
        };
      }
      return u;
    });
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    return users;
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

    const updated = {
      ...current,
      ...updates,
      fullName: current.role === 'admin' ? 'NexusAdmin' : (updates.fullName || current.fullName),
    };

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
  },
};
