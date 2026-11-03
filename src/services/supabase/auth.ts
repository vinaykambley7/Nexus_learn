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
  createdAt?: string;
}

const USERS_STORAGE_KEY = 'nexus_users_v5';
const CURRENT_SESSION_KEY = 'nexus_session_v5';

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
  createdAt: '2026-10-01T00:00:00.000Z',
};

export const authService = {
  getStoredUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (data) {
        let parsed: UserProfile[] = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove any legacy mock users (e.g. Alex Mercer)
          parsed = parsed.filter(
            (u) =>
              u.email.toLowerCase() !== 'alex.mercer@nexuslearn.io' &&
              u.fullName !== 'Alex Mercer'
          );

          // Ensure default admin user is always NexusAdmin
          const hasAdmin = parsed.some(
            (u) => u.role === 'admin' || u.email.toLowerCase() === 'admin@nexuslearn.io'
          );
          if (!hasAdmin) {
            parsed.unshift(DEFAULT_ADMIN_USER);
          } else {
            parsed = parsed.map((u) => {
              if (u.role === 'admin' || u.email.toLowerCase() === 'admin@nexuslearn.io') {
                return { ...u, fullName: 'NexusAdmin', email: 'admin@nexuslearn.io', role: 'admin' };
              }
              return u;
            });
          }

          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read users from localStorage', e);
    }

    // Default: only NexusAdmin (0 dummy students)
    const initial = [DEFAULT_ADMIN_USER];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  },

  getCurrentSession(): UserProfile | null {
    try {
      const session = localStorage.getItem(CURRENT_SESSION_KEY);
      if (session) {
        const parsed: UserProfile = JSON.parse(session);
        if (parsed.email.toLowerCase() === 'admin@nexuslearn.io') {
          return { ...DEFAULT_ADMIN_USER, ...parsed, fullName: 'NexusAdmin' };
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to read session', e);
    }
    // Default active session is NexusAdmin
    return DEFAULT_ADMIN_USER;
  },

  async signIn(email: string, _password: string): Promise<UserProfile> {
    const trimmedEmail = email.trim().toLowerCase();

    // Verify against registered users (NexusAdmin or admin-created students)
    const users = this.getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!existing) {
      throw new Error(
        'Account not found. Student accounts must be created and provisioned by NexusAdmin.'
      );
    }

    if (existing.status === 'Suspended') {
      throw new Error('This account has been suspended by the administrator.');
    }

    const expectedPassword = existing.password || (existing.role === 'admin' ? 'admin123' : 'learn2026');
    if (_password && _password !== expectedPassword) {
      throw new Error('Incorrect password. Please verify your credentials.');
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: _password,
        });
      } catch (err) {
        console.warn('Supabase cloud sync note (continuing in local resilient mode):', err);
      }
    }

    const sessionUser =
      existing.role === 'admin'
        ? { ...existing, fullName: 'NexusAdmin', email: 'admin@nexuslearn.io' }
        : existing;

    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  async adminCreateStudent(
    fullName: string,
    email: string,
    password: string,
    assignedTrack: string
  ): Promise<UserProfile> {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();
    const users = this.getStoredUsers();

    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);
    if (existingIndex !== -1) {
      throw new Error(`An account with email "${trimmedEmail}" already exists.`);
    }

    const newStudent: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      email: trimmedEmail,
      fullName: trimmedName,
      password: password.trim() || 'learn2026',
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
      createdAt: new Date().toISOString(),
    };

    users.push(newStudent);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signUp({
          email: trimmedEmail,
          password: newStudent.password!,
          options: {
            data: { full_name: trimmedName, role: 'student', enrolled_track: assignedTrack },
          },
        });
      } catch (err) {
        console.warn('Supabase cloud student creation note:', err);
      }
    }

    return newStudent;
  },

  async adminDeleteStudent(id: string): Promise<void> {
    const users = this.getStoredUsers().filter((u) => u.id !== id);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  async adminUpdateStudent(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const users = this.getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Student account not found');

    users[index] = {
      ...users[index],
      ...updates,
      role: 'student',
    };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return users[index];
  },

  async adminToggleStudentStatus(id: string): Promise<UserProfile[]> {
    const users = this.getStoredUsers().map((u) => {
      if (u.id === id) {
        return {
          ...u,
          status: (u.status === 'Suspended' ? 'Active' : 'Suspended') as 'Active' | 'Suspended',
        };
      }
      return u;
    });
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return users;
  },

  async signUp(_email: string, _password: string, _fullName: string): Promise<UserProfile> {
    throw new Error(
      'Public self-registration is disabled. Student accounts are created and provisioned exclusively by NexusAdmin.'
    );
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

    const updated: UserProfile = {
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
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(updated));
    return updated;
  },
};
