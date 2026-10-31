import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, supabaseStatus } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [roleSelection, setRoleSelection] = useState<'student' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        await register(email, password, fullName, roleSelection);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole: 'student' | 'admin') => {
    setIsLoading(true);
    try {
      if (demoRole === 'student') {
        await login('alex.mercer@nexuslearn.io', 'nexus123');
      } else {
        await login('admin@nexuslearn.io', 'admin123');
      }
      onClose();
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-white/20 shadow-2xl p-6 z-10 space-y-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white font-heading">
              {isRegisterMode ? 'Create Student Account' : 'Sign In to NexusLearn'}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              {supabaseStatus.configured
                ? 'Connected to Live Supabase Auth'
                : 'Resilient Local Authentication Engine'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-text-secondary hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@nexuslearn.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRoleSelection('student')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    roleSelection === 'student'
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : 'bg-white/5 border-white/10 text-text-muted'
                  }`}
                >
                  Student Learner
                </button>
                <button
                  type="button"
                  onClick={() => setRoleSelection('admin')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    roleSelection === 'admin'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-white/5 border-white/10 text-text-muted'
                  }`}
                >
                  Instructor / Admin
                </button>
              </div>
            </div>
          )}

          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="w-full mt-2">
            {isRegisterMode ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        {/* Quick Admin Access */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <Button
            variant="purple"
            size="sm"
            onClick={() => handleQuickDemoLogin('admin')}
            className="w-full text-xs flex items-center justify-center gap-2"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Sign In as Administrator</span>
          </Button>
        </div>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-text-secondary">
          {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-sky-400 hover:underline font-semibold"
          >
            {isRegisterMode ? 'Sign In' : 'Register Here'}
          </button>
        </div>
      </div>
    </div>
  );
};
