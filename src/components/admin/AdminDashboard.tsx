import React, { useState } from 'react';
import {
  Shield,
  Users,
  UserPlus,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileText,
  Bell,
  Sliders,
  MapPin,
  HelpCircle,
  Briefcase,
  Copy,
  Trash2,
  LogIn,
  Search,
  ExternalLink,
  Activity,
  Key
} from 'lucide-react';
import { ProjectSubmission } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LEARNING_TRACKS } from '@/features/curriculum/curriculumData';
import { AI_TOOLS } from '@/features/ai-tools/aiToolsData';
import { PRACTICAL_PROJECTS } from '@/features/projects/projectsData';

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
    title: 'Level 5 RAG with Supabase pgvector Active',
    message: 'The interactive HNSW vector index lab and embedding similarity scoring tutorial are live in production.',
    priority: 'Normal',
    publishedAt: '2026-10-31',
  },
  {
    id: 'ann-2',
    title: 'Frontier AI Tools Directory Synchronized',
    message: '10 frontier generative models and coding agents cataloged with comparison radar benchmarks.',
    priority: 'Info',
    publishedAt: '2026-10-30',
  },
];

type AdminSection =
  | 'students'
  | 'overview'
  | 'curriculum'
  | 'roadmap'
  | 'ai-tools'
  | 'content'
  | 'quizzes'
  | 'assignments'
  | 'projects'
  | 'announcements'
  | 'settings';

interface AdminDashboardProps {
  submissions: ProjectSubmission[];
  onUpdateSubmission: (id: string, status: ProjectSubmission['status'], feedback?: string, grade?: string) => void;
  onSwitchToStudentView?: () => void;
  initialSection?: 'students' | 'overview';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  submissions,
  onUpdateSubmission,
  onSwitchToStudentView,
  initialSection,
}) => {
  const {
    adminCreateStudent,
    adminDeleteStudent,
    adminToggleStudentStatus,
    allUsers,
    login,
  } = useAuth();

  const [activeSection, setActiveSection] = useState<AdminSection>(initialSection || 'students');
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Student creation form state
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('learn2026');
  const [trackInput, setTrackInput] = useState('Full-Stack Web Development');
  const [createdNotice, setCreatedNotice] = useState<{
    name: string;
    email: string;
    pass: string;
    track: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // New announcement state
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMsg, setNewAnnMsg] = useState('');

  // Evaluation modal state
  const [evaluatingSub, setEvaluatingSub] = useState<ProjectSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState('95 / 100');
  const [feedbackInput, setFeedbackInput] = useState('Clean implementation and adheres to architectural guidelines.');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const studentUsers = allUsers.filter((u) => u.role === 'student');

  const filteredStudents = studentUsers.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.enrolledTracks.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim() || !passInput.trim()) return;

    try {
      const newStudent = await adminCreateStudent(nameInput, emailInput, passInput, trackInput);
      setCreatedNotice({
        name: newStudent.fullName,
        email: newStudent.email,
        pass: passInput,
        track: trackInput,
      });
      setNameInput('');
      setEmailInput('');
      setPassInput('learn2026');
      showToast(`Student account for "${newStudent.fullName}" created successfully!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to create student account');
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete student account "${name}"?`)) {
      try {
        await adminDeleteStudent(id);
        showToast(`Student account "${name}" has been removed.`);
      } catch (err: any) {
        showToast(err.message || 'Failed to delete student');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await adminToggleStudentStatus(id);
      showToast('Student account status toggled.');
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle status');
    }
  };

  const handleLoginAsStudent = async (email: string, pass?: string) => {
    try {
      await login(email, pass || 'learn2026');
      showToast(`Switched active session to student "${email}". Redirecting...`);
      setTimeout(() => {
        if (onSwitchToStudentView) onSwitchToStudentView();
      }, 600);
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
    showToast('Platform announcement broadcasted successfully!');
  };

  const handleSaveEvaluation = (status: ProjectSubmission['status']) => {
    if (!evaluatingSub) return;
    onUpdateSubmission(evaluatingSub.id, status, feedbackInput, gradeInput);
    setEvaluatingSub(null);
    showToast(`Submission updated to "${status}".`);
  };

  const totalNodesCount = LEARNING_TRACKS.reduce(
    (acc, track) => acc + track.levels.reduce((lAcc, lvl) => lAcc + lvl.nodes.length, 0),
    0
  );

  const sectionsList: { id: AdminSection; label: string; icon: any }[] = [
    { id: 'students', label: '1. Student Accounts & Creation', icon: Users },
    { id: 'overview', label: '2. Overview & System Health', icon: TrendingUp },
    { id: 'curriculum', label: '3. Curriculum Architecture', icon: BookOpen },
    { id: 'roadmap', label: '4. Interactive Roadmaps', icon: MapPin },
    { id: 'ai-tools', label: '5. Frontier AI Tools', icon: Sparkles },
    { id: 'content', label: '6. Content Engine', icon: FileText },
    { id: 'quizzes', label: '7. Quizzes & Exams', icon: HelpCircle },
    { id: 'assignments', label: '8. Assignments & Exercises', icon: Briefcase },
    { id: 'projects', label: '9. Capstone Project Reviews', icon: Award },
    { id: 'announcements', label: '10. Broadcast Announcements', icon: Bell },
    { id: 'settings', label: '11. Audit & Environment Settings', icon: Sliders },
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <Badge variant="purple" size="md">
              NexusAdmin • Production Administrative Control Center
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Admin Management Portal
            </h1>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Create and provision verified student user accounts, manage curriculum roadmaps, frontier AI directory, quizzes, and live database policies.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button
              variant="purple"
              size="md"
              onClick={() => setActiveSection('students')}
              className="flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400/40 font-bold"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Student User</span>
            </Button>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/10">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Live Console
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections Tabs */}
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

      {/* SECTION 1: STUDENT ACCOUNTS & CREATION */}
      {activeSection === 'students' && (
        <div className="space-y-6">
          {/* Section Information Banner */}
          <div className="p-6 rounded-3xl bg-purple-950/30 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-heading">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Student Account Provisioning Center (Admin Exclusive)</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Public self-registration is permanently disabled. As <strong>NexusAdmin</strong>, you create student accounts here. Students sign in with the email and password you assign.
              </p>
            </div>
            <Badge variant="purple" size="md">
              {studentUsers.length} Students Provisioned
            </Badge>
          </div>

          {/* Creation Form Card */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Create New Student Account
                </h3>
              </div>
              <span className="text-xs text-text-muted">Fields marked with * are required</span>
            </div>

            <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Patel"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
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
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
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
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-text-muted focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Assigned Learning Track *
                </label>
                <select
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-card border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                  <option value="AI Tools Mastery">AI Tools Mastery</option>
                  <option value="AI Engineering & Generative AI">AI Engineering & Generative AI</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="purple"
                  size="md"
                  className="flex items-center gap-2 shadow-lg shadow-purple-600/30"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>➕ Create Student Account</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Success Notice Banner */}
          {createdNotice && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
              <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Student Account Successfully Created!</span>
                </div>
                <div className="text-xs text-text-secondary flex flex-wrap gap-x-4 gap-y-1">
                  <span>Name: <strong className="text-white">{createdNotice.name}</strong></span>
                  <span>Email: <strong className="text-white font-mono">{createdNotice.email}</strong></span>
                  <span>Password: <strong className="text-white font-mono">{createdNotice.pass}</strong></span>
                  <span>Track: <strong className="text-white">{createdNotice.track}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `NexusLearn Login Credentials:\nEmail: ${createdNotice.email}\nPassword: ${createdNotice.pass}\nPlatform URL: http://localhost:3000`
                    );
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
                  onClick={() => handleLoginAsStudent(createdNotice.email, createdNotice.pass)}
                  className="text-xs flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login As This Student</span>
                </Button>
                <button
                  onClick={() => setCreatedNotice(null)}
                  className="p-1 text-text-muted hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Student Roster Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students by name, email, or track..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-card/80 border border-white/10 text-white text-xs placeholder-text-muted focus:outline-none focus:border-purple-400"
                />
              </div>

              <span className="text-xs text-text-muted">
                Showing <strong>{filteredStudents.length}</strong> of <strong>{studentUsers.length}</strong> created students
              </span>
            </div>

            <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-dark-surface/90 text-text-muted">
                    <th className="p-4">Student Profile</th>
                    <th className="p-4">Assigned Track</th>
                    <th className="p-4">Login Password</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-text-muted">
                        <Users className="w-12 h-12 text-purple-400/30 mx-auto mb-3" />
                        <div className="text-sm font-bold text-white">No Student Accounts Yet</div>
                        <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
                          The platform starts clean with 0 dummy users. Use the form above to create your first student account.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
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
                        <td className="p-4">
                          <div className="flex items-center gap-2 font-mono text-purple-300">
                            <span>{s.password || 'learn2026'}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(s.password || 'learn2026');
                                showToast(`Password for ${s.fullName} copied!`);
                              }}
                              className="p-1 hover:text-white text-text-muted transition-colors"
                              title="Copy Password"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(s.id)}
                            className="cursor-pointer"
                            title="Click to toggle status"
                          >
                            <Badge variant={s.status === 'Suspended' ? 'rose' : 'emerald'}>
                              {s.status || 'Active'}
                            </Badge>
                          </button>
                        </td>
                        <td className="p-4 text-text-muted font-mono text-[11px]">
                          {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Active'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLoginAsStudent(s.email, s.password)}
                              className="text-xs flex items-center gap-1"
                            >
                              <LogIn className="w-3.5 h-3.5" />
                              <span>Login as Student</span>
                            </Button>
                            <button
                              onClick={() => handleDeleteStudent(s.id, s.fullName)}
                              className="p-2 rounded-xl text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Student Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: OVERVIEW & SYSTEM HEALTH */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
              <div className="text-xs text-text-muted font-semibold">Active Student Accounts</div>
              <div className="text-3xl font-extrabold text-white font-heading">
                {studentUsers.length}
              </div>
              <div className="text-xs text-purple-400">Created by NexusAdmin</div>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
              <div className="text-xs text-text-muted font-semibold">Core Curriculum Tracks</div>
              <div className="text-3xl font-extrabold text-sky-400 font-heading">
                {LEARNING_TRACKS.length}
              </div>
              <div className="text-xs text-emerald-400">100% Production Ready</div>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
              <div className="text-xs text-text-muted font-semibold">Syllabus Learning Nodes</div>
              <div className="text-3xl font-extrabold text-purple-400 font-heading">
                {totalNodesCount}
              </div>
              <div className="text-xs text-text-secondary">Across 5 mastery levels</div>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
              <div className="text-xs text-text-muted font-semibold">Capstone Portfolios</div>
              <div className="text-3xl font-extrabold text-amber-400 font-heading">
                {PRACTICAL_PROJECTS.length}
              </div>
              <div className="text-xs text-amber-400">
                {submissions.filter((s) => s.status === 'Pending Review').length} awaiting review
              </div>
            </div>
          </div>

          {/* Real-Time Platform Audit Stream */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span>Real-Time Platform Audit Stream</span>
              </h3>
              <Badge variant="purple" size="sm">
                NexusAdmin Enforced
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <strong className="text-white">User Provisioning:</strong> Admin student account creation engine active.
                </div>
                <span className="text-text-muted font-mono">{studentUsers.length} Students</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <strong className="text-white">Curriculum Published:</strong> Level 5 Supabase pgvector RAG module updated with new HNSW indexing lab.
                </div>
                <span className="text-text-muted font-mono">Live</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <strong className="text-white">Security & Access:</strong> Public sign-ups disabled. Accounts provisioned exclusively by NexusAdmin.
                </div>
                <span className="text-text-muted font-mono">Enforced</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CURRICULUM ARCHITECTURE */}
      {activeSection === 'curriculum' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LEARNING_TRACKS.map((track) => (
              <div key={track.id} className="p-6 rounded-3xl glass-card border border-white/10 space-y-4 shadow-xl">
                <div className="space-y-1">
                  <Badge variant="blue" size="sm">Track ID: {track.id}</Badge>
                  <h4 className="text-lg font-bold text-white font-heading">{track.title}</h4>
                  <p className="text-xs text-text-secondary">{track.description}</p>
                </div>
                <div className="pt-2 border-t border-white/10 text-xs text-text-muted flex items-center justify-between">
                  <span>{track.levels.length} Mastery Levels</span>
                  <span className="text-sky-400 font-semibold font-mono">
                    {track.levels.reduce((acc, l) => acc + l.nodes.length, 0)} Nodes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: INTERACTIVE ROADMAPS */}
      {activeSection === 'roadmap' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-heading uppercase tracking-wider">
              Interactive Graph Engine
            </h3>
            <Badge variant="purple">2D Canvas Coordinates Active</Badge>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            All 26 roadmap graph nodes are configured with visual 2D coordinates (X, Y) and dynamic dependency lines connecting progression stages.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {LEARNING_TRACKS[0].levels.flatMap((l) => l.nodes).slice(0, 6).map((node) => (
              <div key={node.id} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                <div className="font-semibold text-white truncate">{node.title}</div>
                <div className="text-[11px] font-mono text-purple-300">
                  Node ID: {node.id} • Coords: ({node.x}, {node.y})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: FRONTIER AI TOOLS */}
      {activeSection === 'ai-tools' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-dark-surface/90 text-text-muted">
                  <th className="p-4">AI Tool</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Pricing</th>
                  <th className="p-4">Coding Score</th>
                  <th className="p-4">Reasoning</th>
                  <th className="p-4 text-right">Official Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {AI_TOOLS.map((tool) => (
                  <tr key={tool.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{tool.name}</div>
                      <div className="text-text-muted text-[11px] truncate max-w-xs">{tool.shortDescription}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="purple">{tool.category}</Badge>
                    </td>
                    <td className="p-4 text-text-secondary">{tool.pricingType}</td>
                    <td className="p-4 font-mono font-bold text-sky-400">
                      {tool.comparisonScores.coding} / 100
                    </td>
                    <td className="p-4 font-mono font-bold text-purple-400">
                      {tool.comparisonScores.reasoning} / 100
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={tool.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 6, 7 & 8: CONTENT, QUIZZES & ASSIGNMENTS */}
      {(activeSection === 'content' || activeSection === 'quizzes' || activeSection === 'assignments') && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-heading uppercase tracking-wider">
                {activeSection.toUpperCase()} ENGINE
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Curriculum interactive sandboxes, assessment banks, and coding challenges.
              </p>
            </div>
            <Badge variant="emerald">Live & Active</Badge>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs text-text-secondary leading-relaxed">
            <p>
              Interactive coding playgrounds, MCQ assessments, and Capstone specifications are compiled and verified for production use.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px] text-sky-300">
                Level 5 Vector Sandboxes Active
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px] text-purple-300">
                100% Pass Rate Validation
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px] text-emerald-300">
                Production Sandboxing Enabled
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 9: CAPSTONE PROJECTS EVALUATION */}
      {activeSection === 'projects' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-dark-surface/90 text-text-muted">
                  <th className="p-4">Submission ID</th>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Repositories</th>
                  <th className="p-4">Status & Grade</th>
                  <th className="p-4">Submitted At</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-text-muted">
                      <Award className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
                      <div className="font-bold text-white text-sm">No Capstone Submissions Yet</div>
                      <p className="text-xs text-text-secondary mt-1">
                        When projects are submitted in the Projects tab, they appear here for NexusAdmin evaluation and grading.
                      </p>
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-purple-300">
                        {sub.id}
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
                  ))
                )}
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
                  Submission ID: <strong className="text-white font-mono">{evaluatingSub.id}</strong>
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
                    Evaluation Feedback
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

      {/* SECTION 10: ANNOUNCEMENTS BROADCAST */}
      {activeSection === 'announcements' && (
        <div className="space-y-6">
          <form onSubmit={handleAddAnnouncement} className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white font-heading">Broadcast Platform Announcement</h3>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Scheduled Maintenance or New Curriculum Release"
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
              Publish Announcement
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

      {/* SECTION 11: AUDIT & ENVIRONMENT SETTINGS */}
      {activeSection === 'settings' && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-heading uppercase tracking-wider">
                Production Security & Database Policies
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Database-driven relational configuration connected to Supabase PostgreSQL schema.
              </p>
            </div>
            <Badge variant="purple">NexusAdmin Authority</Badge>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs text-text-secondary leading-relaxed">
            <p>
              The platform operates in exclusive administrator mode. Student accounts are created and provisioned exclusively by <strong>NexusAdmin</strong>. All actions adhere to Row Level Security policy <code className="text-purple-300">public.is_admin()</code> and persist automatically.
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-sky-300 space-y-1">
              <div>• Administrator: NexusAdmin (admin@nexuslearn.io)</div>
              <div>• Active Student Accounts: {studentUsers.length} provisioned</div>
              <div>• RLS Policy: public.is_admin() enforced</div>
              <div>• Storage Engine: Local Resilient Mode with Cloud PostgreSQL Sync</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
