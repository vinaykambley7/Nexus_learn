import React, { useState } from 'react';
import { X, Lock, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@nexuslearn.io');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify administrator credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await login('admin@nexuslearn.io', 'admin123');
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
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-purple-500/30 shadow-2xl p-6 z-10 space-y-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Administrator Sign In
              </h3>
              <p className="text-xs text-text-muted">
                Executive Console & Curriculum Management
              </p>
            </div>
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
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@nexuslearn.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Administrator Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="purple"
            size="md"
            isLoading={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>Sign In to Admin Portal</span>
          </Button>
        </form>

        {/* Quick Admin Auto-Fill */}
        <div className="pt-2 border-t border-white/10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickAdminLogin}
            className="w-full text-xs text-purple-300 hover:text-white border-purple-500/30 hover:border-purple-500/60"
          >
            Instant Admin Fill (admin@nexuslearn.io / admin123)
          </Button>
        </div>
      </div>
    </div>
  );
};
