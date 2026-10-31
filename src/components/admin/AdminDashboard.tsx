import React, { useState } from 'react';
import {
  Shield,
  Users,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  FileText,
  Search,
  Bell,
  Sliders,
  Compass,
  MapPin,
  HelpCircle,
  Briefcase,
  Key,
  Copy,
  LogIn
} from 'lucide-react';
import { ProjectSubmission } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  enrolledTrack: string;
  completedModules: number;
  status: 'Active' | 'Suspended';
  joinedDate: string;
}

interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  priority: 'Normal' | 'Urgent' | 'Info';
  publishedAt: string;
}

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'New Level 5 RAG with Supabase pgvector Released!',
    message: 'The interactive HNSW vector index lab and embedding similarity scoring tutorial are now live across all tracks.',
    priority: 'Normal',
    publishedAt: '2026-10-28',
  },
  {
    id: 'ann-2',
    title: 'Weekly Capstone Grading Schedule',
    message: 'Instructors review project submissions every Tuesday and Friday. Check your feedback in the Projects tab.',
    priority: 'Info',
    publishedAt: '2026-10-25',
  }
];

type AdminSection =
  | 'overview'
  | 'students'
  | 'curriculum'
  | 'roadmap'
  | 'ai-tools'
  | 'content'
  | 'quizzes'
  | 'assignments'
  | 'projects'
  | 'analytics'
  | 'announcements'
  | 'settings';

interface AdminDashboardProps {
  submissions: ProjectSubmission[];
  onUpdateSubmission: (id: string, status: ProjectSubmission['status'], feedback?: string, grade?: string) => void;
  onSwitchToStudentView?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  submissions,
  onUpdateSubmission,
  onSwitchToStudentView,
}) => {
  const { adminCreateStudent, adminDeleteUser, allUsers, login } = useAuth();

  const [activeSection, setActiveSection] = useState<AdminSection>('students');
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [studentSearch, setStudentSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // New student modal state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('learn2026');
  const [newStudentTrack, setNewStudentTrack] = useState('Full-Stack Web Development');
  const [createdStudentNotice, setCreatedStudentNotice] = useState<{ email: string; pass: string; name: string } | null>(null);

  // New announcement state
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMsg, setNewAnnMsg] = useState('');

  // Evaluation modal state
  const [evaluatingSub, setEvaluatingSub] = useState<ProjectSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState('95 / 100');
  const [feedbackInput, setFeedbackInput] = useState('Clean implementation and adheres to architectural guidelines.');

  // Student accounts list derived from all registered users in AuthContext
  const studentUsers = allUsers.filter((u) => u.role === 'student');

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail || !newStudentPassword) return;

    try {
      await adminCreateStudent(newStudentName, newStudentEmail, newStudentPassword, newStudentTrack);
      setCreatedStudentNotice({
        name: newStudentName,
        email: newStudentEmail,
        pass: newStudentPassword,
      });
      setIsAddStudentOpen(false);
      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentPassword('learn2026');
      showToast(`Student account for ${newStudentName} created successfully!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to create student account');
    }
  };

  const handleLoginAsStudent = async (email: string, pass?: string) => {
    try {
      await login(email, pass || 'nexus123');
      showToast(`Switched active session to student "${email}". Redirecting to student portal...`);
      setTimeout(() => {
        if (onSwitchToStudentView) {
          onSwitchToStudentView();
        }
      }, 700);
    } catch (err: any) {
      showToast(`Login failed: ${err.message}`);
    }
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnMsg) return;
    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: newAnnTitle,
      message: newAnnMsg,
      priority: 'Normal',
      publishedAt: new Date().toISOString().split('T')[0],
    };
    setAnnouncements([newAnn, ...announcements]);
    setNewAnnTitle('');
    setNewAnnMsg('');
  };

  const handleSaveEvaluation = (status: ProjectSubmission['status']) => {
    if (!evaluatingSub) return;
    onUpdateSubmission(evaluatingSub.id, status, feedbackInput, gradeInput);
    setEvaluatingSub(null);
  };

  const filteredStudents = studentUsers.filter(
    (s) =>
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.enrolledTracks.some((t) => t.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  const sectionsList: { id: AdminSection; label: string; icon: any }[] = [
    { id: 'overview', label: '1. Overview', icon: TrendingUp },
    { id: 'students', label: '2. Student Logins', icon: Users },
    { id: 'curriculum', label: '3. Curriculum', icon: BookOpen },
    { id: 'roadmap', label: '4. Roadmaps', icon: MapPin },
    { id: 'ai-tools', label: '5. AI Tools', icon: Sparkles },
    { id: 'content', label: '6. Content', icon: FileText },
    { id: 'quizzes', label: '7. Quizzes', icon: HelpCircle },
    { id: 'assignments', label: '8. Assignments', icon: Briefcase },
    { id: 'projects', label: '9. Capstones', icon: Award },
    { id: 'analytics', label: '10. Analytics', icon: TrendingUp },
    { id: 'announcements', label: '11. Broadcasts', icon: Bell },
    { id: 'settings', label: '12. Audit & Settings', icon: Sliders },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-600/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-purple-400/30 animate-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="rounded-3xl p-8 glass-panel border border-purple-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <Badge variant="purple" size="md">
            Administrative Control Center (12 Sections)
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Admin Management Portal
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Create verified student login credentials, evaluate submitted portfolio capstones, publish curriculum content, broadcast announcements, and monitor real-time platform analytics.
          </p>
        </div>
      </div>

      {/* Notice Banner for Newly Created Student Credentials */}
      {createdStudentNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-lg flex items-center justify-between gap-4 animate-in fade-in">
          <div className="space-y-1">
            <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Student Account Successfully Provisioned!</span>
            </div>
            <div className="text-xs text-text-secondary">
              Login Email: <strong className="text-white font-mono">{createdStudentNotice.email}</strong> • Initial Password: <strong className="text-white font-mono">{createdStudentNotice.pass}</strong>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`Email: ${createdStudentNotice.email}\nPassword: ${createdStudentNotice.pass}`);
                showToast('Credentials copied to clipboard!');
              }}
              className="text-xs flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleLoginAsStudent(createdStudentNotice.email, createdStudentNotice.pass)}
              className="text-xs flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Test Login As This Student</span>
            </Button>
            <button
              onClick={() => setCreatedStudentNotice(null)}
              className="p-1 text-text-muted hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 12 Admin Sections Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 custom-scrollbar">
        {sectionsList.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-dark-card/60 text-text-secondary hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1 & 10: OVERVIEW & ANALYTICS */}
      {(activeSection === 'overview' || activeSection === 'analytics') && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
              <div className="text-xs text-text-muted font-semibold">Total Registered Learners</div>
              <div className="text-3xl font-extrabold text-white font-heading">{studentUsers.length}</div>
              <div className="text-xs text-emerald-400">+18% this month</div>
            </div>
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
              <div className="text-xs text-text-muted font-semibold">Active Daily Coders</div>
              <div className="text-3xl font-extrabold text-sky-400 font-heading">485</div>
              <div className="text-xs text-text-secondary">Average 2.4 hrs / learner</div>
            </div>
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
              <div className="text-xs text-text-muted font-semibold">Completed Capstones</div>
              <div className="text-3xl font-extrabold text-purple-400 font-heading">328</div>
              <div className="text-xs text-emerald-400">96.4% passing rate</div>
            </div>
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
              <div className="text-xs text-text-muted font-semibold">Pending Evaluations</div>
              <div className="text-3xl font-extrabold text-amber-400 font-heading">
                {submissions.filter((s) => s.status === 'Pending Review').length}
              </div>
              <div className="text-xs text-amber-400">Requires instructor grading</div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white font-heading">Real-Time Platform Audit Stream</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <strong className="text-white">Curriculum Published:</strong> Level 5 Supabase pgvector RAG module updated with new HNSW indexing lab.
                </div>
                <span className="text-text-muted font-mono">10 mins ago</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <strong className="text-white">User Engine Ready:</strong> NexusAdmin authenticated. Ready to provision student user accounts.
                </div>
                <span className="text-text-muted font-mono">1 hour ago</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <strong className="text-white">AI Tool Added:</strong> Cursor IDE Composer specifications updated.
                </div>
                <span className="text-text-muted font-mono">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: STUDENT MANAGEMENT & CREDENTIAL PROVISIONING */}
      {activeSection === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students by name, email..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-card/80 border border-white/10 text-white text-xs placeholder-text-muted focus:outline-none"
              />
            </div>

            <Button
              variant="purple"
              size="sm"
              onClick={() => setIsAddStudentOpen(true)}
              className="flex items-center gap-1.5 text-xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Student Account & Login</span>
            </Button>
          </div>

          <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-dark-surface/90 text-text-muted">
                  <th className="p-4">Student Profile</th>
                  <th className="p-4">Assigned Learning Path</th>
                  <th className="p-4">Login Password</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Streak & Hours</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{s.fullName}</span>
                      </div>
                      <div className="text-text-muted text-[11px] font-mono">{s.email}</div>
                    </td>
                    <td className="p-4 text-text-secondary capitalize">
                      {s.enrolledTracks.join(', ')}
                    </td>
                    <td className="p-4 font-mono text-purple-300">
                      {s.password || 'nexus123'}
                    </td>
                    <td className="p-4">
                      <Badge variant={s.status === 'Suspended' ? 'rose' : 'emerald'}>
                        {s.status || 'Active'}
                      </Badge>
                    </td>
                    <td className="p-4 text-text-muted">
                      {s.streakDays}d streak • {s.totalHoursLearned}h
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoginAsStudent(s.email, s.password)}
                        className="text-xs"
                      >
                        Login as User
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Student Modal */}
          {isAddStudentOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAddStudentOpen(false)} />
              <div className="relative w-full max-w-md glass-panel rounded-3xl border border-white/20 shadow-2xl p-6 z-10 space-y-4 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-lg font-bold text-white font-heading">
                    Provision Student Login Account
                  </h3>
                  <button onClick={() => setIsAddStudentOpen(false)} className="text-text-muted hover:text-white">
                    ×
                  </button>
                </div>

                <form onSubmit={handleAddStudent} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Patel"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Login Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="maya.patel@nexuslearn.io"
                      value={newStudentEmail}
                      onChange={(e) => setNewStudentEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Initial Password</label>
                    <input
                      type="text"
                      required
                      placeholder="learn2026"
                      value={newStudentPassword}
                      onChange={(e) => setNewStudentPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">Assigned Track</label>
                    <select
                      value={newStudentTrack}
                      onChange={(e) => setNewStudentTrack(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-dark-card border border-white/10 text-white text-xs focus:outline-none"
                    >
                      <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                      <option value="AI Tools Mastery">AI Tools Mastery</option>
                      <option value="AI Engineering & Generative AI">AI Engineering & Generative AI</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => setIsAddStudentOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="purple" size="sm" type="submit">
                      Create Login Credentials
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 8 & 9: ASSIGNMENTS & CAPSTONES EVALUATION */}
      {(activeSection === 'assignments' || activeSection === 'projects') && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-dark-surface/90 text-text-muted">
                  <th className="p-4">Student</th>
                  <th className="p-4">Capstone Project</th>
                  <th className="p-4">Repositories</th>
                  <th className="p-4">Status & Grade</th>
                  <th className="p-4">Submitted At</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{sub.studentName}</div>
                      <div className="text-text-muted text-[11px]">{sub.studentEmail}</div>
                    </td>
                    <td className="p-4 text-text-secondary font-medium">{sub.projectTitle}</td>
                    <td className="p-4 space-y-1">
                      <div>
                        <a
                          href={sub.githubRepoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-400 hover:underline flex items-center gap-1"
                        >
                          <span>GitHub Repo</span>
                        </a>
                      </div>
                      {sub.liveUrl && (
                        <div>
                          <a
                            href={sub.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:underline"
                          >
                            Live Demo
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          sub.status === 'Approved'
                            ? 'emerald'
                            : sub.status === 'Changes Requested'
                            ? 'rose'
                            : 'orange'
                        }
                      >
                        {sub.status}
                      </Badge>
                      {sub.grade && (
                        <div className="text-[11px] font-mono text-emerald-400 mt-1">
                          Grade: {sub.grade}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-text-muted">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setEvaluatingSub(sub);
                          setGradeInput(sub.grade || '95 / 100');
                          setFeedbackInput(sub.adminFeedback || 'Clean code architecture and passing tests.');
                        }}
                        className="text-xs"
                      >
                        Grade / Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Evaluation Dialog */}
          {evaluatingSub && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEvaluatingSub(null)} />
              <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-white/20 shadow-2xl p-6 z-10 space-y-4 animate-in zoom-in-95">
                <h3 className="text-lg font-bold text-white font-heading">
                  Evaluate: {evaluatingSub.projectTitle}
                </h3>
                <div className="text-xs text-text-secondary">
                  Student: <strong className="text-white">{evaluatingSub.studentName}</strong> ({evaluatingSub.studentEmail})
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Grade Awarded (e.g. 95 / 100)
                  </label>
                  <input
                    type="text"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Instructor Evaluation Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveEvaluation('Changes Requested')}
                    className="text-rose-400 hover:text-rose-300"
                  >
                    Request Changes
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSaveEvaluation('Approved')}
                  >
                    Approve & Award Grade
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 11: ANNOUNCEMENTS BROADCAST */}
      {activeSection === 'announcements' && (
        <div className="space-y-6">
          <form onSubmit={handleAddAnnouncement} className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white font-heading">Broadcast Platform Announcement</h3>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Hackathon or Scheduled Maintenance"
                value={newAnnTitle}
                onChange={(e) => setNewAnnTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Message Content</label>
              <textarea
                rows={3}
                required
                placeholder="Detailed announcement content..."
                value={newAnnMsg}
                onChange={(e) => setNewAnnMsg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none"
              />
            </div>
            <Button type="submit" variant="purple" size="sm">
              Publish Announcement to All Cohorts
            </Button>
          </form>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-white font-heading">Active Announcements</h3>
            {announcements.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl bg-dark-card/60 border border-white/10 space-y-1 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{a.title}</h4>
                  <span className="text-[11px] font-mono text-text-muted">{a.publishedAt}</span>
                </div>
                <p className="text-xs text-text-secondary">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTIONS 3, 4, 5, 6, 7 & 12: CURRICULUM, ROADMAPS & PLATFORM SETTINGS */}
      {(activeSection === 'curriculum' ||
        activeSection === 'roadmap' ||
        activeSection === 'ai-tools' ||
        activeSection === 'content' ||
        activeSection === 'quizzes' ||
        activeSection === 'settings') && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-heading uppercase tracking-wider">
                {activeSection.toUpperCase()} ENGINE
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Database-driven relational configuration connected to Supabase PostgreSQL schema.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs text-text-secondary leading-relaxed">
            <p>
              This section coordinates directly with tables in PostgreSQL: <code className="text-purple-300">learning_tracks</code>, <code className="text-purple-300">roadmap_nodes</code>, <code className="text-purple-300">ai_tools</code>, and <code className="text-purple-300">quiz_questions</code>.
            </p>
            <p>
              Changes made by authorized administrators adhere to Row Level Security policy <code className="text-purple-300">public.is_admin()</code> and propagate in real-time to active student roadmaps.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
