import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, Copy, LogIn, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onLoginAsStudent?: (email: string, pass: string) => void;
}

export const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLoginAsStudent,
}) => {
  const { adminCreateStudent } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('learn2026');
  const [track, setTrack] = useState('Full-Stack Web Development');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdStudent, setCreatedStudent] = useState<{
    fullName: string;
    email: string;
    password: string;
    track: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const student = await adminCreateStudent(fullName, email, password, track);
      setCreatedStudent({
        fullName: student.fullName,
        email: student.email,
        password: password.trim(),
        track,
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create student account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForAnother = () => {
    setCreatedStudent(null);
    setFullName('');
    setEmail('');
    setPassword('learn2026');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-purple-500/30 shadow-2xl p-6 z-10 space-y-6 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Create Student Account
              </h3>
              <p className="text-xs text-text-muted">
                Admin Exclusive • Provision verified student credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-secondary hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Success View */}
        {createdStudent ? (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Student Account Created Successfully!</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                The student account has been saved to the active platform roster. You can copy the credentials below or test login directly.
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs space-y-1 text-white">
                <div><strong>Name:</strong> {createdStudent.fullName}</div>
                <div><strong>Email:</strong> {createdStudent.email}</div>
                <div><strong>Password:</strong> {createdStudent.password}</div>
                <div><strong>Assigned Track:</strong> {createdStudent.track}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `NexusLearn Student Credentials:\nEmail: ${createdStudent.email}\nPassword: ${createdStudent.password}\nAssigned Track: ${createdStudent.track}\nPlatform URL: http://localhost:3000`
                  );
                  alert('Credentials copied to clipboard!');
                }}
                className="flex items-center gap-1.5 text-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Credentials</span>
              </Button>

              {onLoginAsStudent && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onLoginAsStudent(createdStudent.email, createdStudent.password);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login As This Student</span>
                </Button>
              )}

              <Button
                variant="purple"
                size="sm"
                onClick={handleResetForAnother}
                className="flex items-center gap-1.5 text-xs ml-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Another Student</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Patel"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-text-muted focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Login Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. maya@nexuslearn.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-text-muted focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Login Password *
              </label>
              <input
                type="text"
                required
                placeholder="learn2026"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-text-muted focus:outline-none focus:border-purple-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Assigned Learning Track *
              </label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
              >
                <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                <option value="AI Tools Mastery">AI Tools Mastery</option>
                <option value="AI Engineering & Generative AI">AI Engineering & Generative AI</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
              <Button variant="outline" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="purple"
                size="md"
                isLoading={isLoading}
                className="flex items-center gap-2 shadow-lg shadow-purple-600/30"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Student Account</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
