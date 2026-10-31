import React, { useState } from 'react';
import { User, Shield, Key, Bell, Clock, Database, CheckCircle2, AlertTriangle, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ProfileSettingsViewProps {
  onNavigateToAdmin?: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({ onNavigateToAdmin }) => {
  const { user, updateProfile, switchRole, supabaseStatus } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || 'Alex Mercer');
  const [dailyGoal, setDailyGoal] = useState<number>(user?.dailyGoalMinutes || 45);
  const [emailNotify, setEmailNotify] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName,
      dailyGoalMinutes: dailyGoal,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-3xl p-8 glass-panel border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <Badge variant="blue" size="md">Account & Preferences</Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Profile & Platform Settings
            </h1>
            <p className="text-sm text-text-secondary">
              Manage personal credentials, study goal targets, notification preferences, and Supabase integration diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={user?.role === 'admin' ? 'purple' : 'blue'}>
              {user?.role === 'admin' ? 'Role: Administrator' : 'Role: Student Scholar'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="p-6 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white font-heading border-b border-white/10 pb-3">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Email Address (Primary Identity)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'alex.mercer@nexuslearn.io'}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-text-muted text-xs cursor-not-allowed"
                />
              </div>
            </div>

            {/* Daily Goal Target */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-2">
                Daily Study Momentum Target (Minutes)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyGoal(mins)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      dailyGoal === mins
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-white/5 border-white/10 text-text-muted hover:text-white'
                    }`}
                  >
                    {mins} mins / day
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">Curriculum & Project Notifications</div>
                <div className="text-[11px] text-text-muted">
                  Receive email notifications when instructors review capstone project submissions.
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailNotify}
                onChange={(e) => setEmailNotify(e.target.checked)}
                className="w-4 h-4 accent-sky-500 cursor-pointer"
              />
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile preferences updated successfully!</span>
              </div>
            )}

            <Button type="submit" variant="primary" size="md" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          </form>

          {/* Quick Role Switcher for Pair-Programming & Evaluation */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3 shadow-xl">
            <h3 className="text-base font-bold text-white font-heading">
              Role & Permissions Switcher
            </h3>
            <p className="text-xs text-text-secondary">
              Toggle between Student and Administrator views to evaluate instructor permissions, student management, and grading workflows.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant={user?.role === 'student' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => switchRole('student')}
              >
                Student View
              </Button>
              <Button
                variant={user?.role === 'admin' ? 'purple' : 'outline'}
                size="sm"
                onClick={() => {
                  switchRole('admin');
                  onNavigateToAdmin?.();
                }}
              >
                Administrator Console
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Database & Supabase Diagnostics (1 col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white font-heading">
                Supabase Integration
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Connector Status:</span>
                <Badge variant={supabaseStatus.configured ? 'emerald' : 'orange'}>
                  {supabaseStatus.configured ? 'LIVE SUPABASE' : 'LOCAL RESILIENT'}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Vector Search:</span>
                <span className="text-sky-400 font-mono">pgvector (1536 dim)</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Row Level Security:</span>
                <span className="text-emerald-400 font-mono">Enforced (RLS)</span>
              </div>
            </div>

            {!supabaseStatus.configured ? (
              <div className="space-y-2 text-xs">
                <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Missing Cloud Credentials</span>
                </div>
                <p className="text-text-muted text-[11px] leading-relaxed">
                  The platform is currently running in local resilient mode with IndexedDB/localStorage persistence. To connect to your remote Supabase PostgreSQL project, add these keys to <code className="text-sky-300">.env</code>:
                </p>
                <div className="bg-black/60 p-3 rounded-xl border border-white/10 font-mono text-[10px] text-sky-300 space-y-1">
                  <div>VITE_SUPABASE_URL=https://xyz.supabase.co</div>
                  <div>VITE_SUPABASE_ANON_KEY=eyJhbGci...</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                ✓ Successfully authenticated with live Supabase instance.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
