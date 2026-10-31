import React, { useState, useEffect } from 'react';
import { Sidebar, NavItem } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { SearchModal } from '@/components/layout/SearchModal';
import { AuthModal } from '@/components/auth/AuthModal';

import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { FullStackTrackView } from '@/components/tracks/FullStackTrackView';
import { AIToolsTrackView } from '@/components/tracks/AIToolsTrackView';
import { AIEngineeringTrackView } from '@/components/tracks/AIEngineeringTrackView';
import { AIToolsPlayground } from '@/components/ai-tools/AIToolsPlayground';
import { ProjectsSection } from '@/components/projects/ProjectsSection';
import { CodingPlayground } from '@/components/playground/CodingPlayground';
import { QuizzesSection } from '@/components/assessments/QuizzesSection';
import { ResourcesSection } from '@/components/resources/ResourcesSection';
import { StudentProgressView } from '@/components/progress/StudentProgressView';
import { BookmarksNotesView } from '@/components/notes/BookmarksNotesView';
import { ProfileSettingsView } from '@/components/profile/ProfileSettingsView';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LearningModuleModal } from '@/components/learning/LearningModuleModal';

import { LEARNING_TRACKS } from '@/features/curriculum/curriculumData';
import { progressService } from '@/services/storage/progressService';
import { useAuth } from '@/context/AuthContext';
import { StudentProgress, ProjectSubmission, TrackId, RoadmapNode, AITool, ProjectLab } from '@/types';

export function App() {
  const { user, isAdmin, switchRole } = useAuth();

  const [currentTab, setCurrentTab] = useState<NavItem>('admin');
  const [activeTrackId, setActiveTrackId] = useState<TrackId>('full-stack');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Persistence State
  const [progress, setProgress] = useState<StudentProgress>(() => progressService.getProgress());
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>(() => progressService.getSubmissions());

  // Search, Auth and Detail Modal States
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [selectedNodeForModal, setSelectedNodeForModal] = useState<RoadmapNode | null>(null);
  const [selectedToolForPlayground, setSelectedToolForPlayground] = useState<AITool | null>(null);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<ProjectLab | null>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTab = (tab: NavItem, trackId?: TrackId) => {
    setCurrentTab(tab);
    if (trackId) {
      setActiveTrackId(trackId);
    }
  };

  const handleOpenRoadmap = (trackId: TrackId) => {
    setActiveTrackId(trackId);
    if (trackId === 'full-stack') setCurrentTab('track-full-stack');
    else if (trackId === 'ai-tools') setCurrentTab('track-ai-tools');
    else if (trackId === 'ai-engineering') setCurrentTab('track-ai-engineering');
  };

  const handleToggleCompleteNode = (nodeId: string) => {
    const updated = progressService.markNodeCompleted(nodeId);
    setProgress({ ...updated });
  };

  const handleToggleSaveTool = (toolId: string) => {
    const updated = progressService.toggleBookmarkTool(toolId);
    setProgress({ ...updated });
  };

  const handleRecordQuizScore = (quizId: string, score: number, passed: boolean) => {
    const updated = progressService.recordQuizScore(quizId, score, passed);
    setProgress({ ...updated });
  };

  const handleSubmitProject = (sub: Omit<ProjectSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSub = progressService.addSubmission(sub);
    setSubmissions([newSub, ...submissions.filter((s) => s.id !== newSub.id)]);
  };

  const handleUpdateSubmission = (id: string, status: ProjectSubmission['status'], feedback?: string, grade?: string) => {
    const updated = progressService.updateSubmissionStatus(id, status, feedback, grade);
    setSubmissions([...updated]);
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset your local demo progress?')) {
      localStorage.clear();
      setProgress(progressService.getProgress());
      setSubmissions(progressService.getSubmissions());
    }
  };

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'track-full-stack':
        return 'Full-Stack Development Track';
      case 'track-ai-tools':
        return 'AI Tools Mastery Track';
      case 'track-ai-engineering':
        return 'AI Engineering Track';
      case 'ai-playground':
        return 'AI Tools Playground & Comparison';
      case 'projects':
        return 'Projects & Practical Labs';
      case 'coding-playground':
        return 'Interactive Coding Playground';
      case 'quizzes':
        return 'Assessments & Quizzes';
      case 'resources':
        return 'Learning Resources & Manuals';
      case 'progress':
        return 'My Progress & Portfolio';
      case 'bookmarks':
        return 'Bookmarks & Personal Notes';
      case 'settings':
        return 'Profile & Account Settings';
      case 'admin':
        return 'Administrative Management Portal';
      default:
        return 'NexusLearn Platform';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary selection:bg-accent-orange selection:text-white flex">
      {/* Collapsible Futuristic Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        streakDays={progress.learningStreakDays}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          const nextRole = isAdmin ? 'student' : 'admin';
          switchRole(nextRole);
          if (nextRole === 'admin') {
            setCurrentTab('admin');
          } else {
            setCurrentTab('dashboard');
          }
        }}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-72'
        }`}
      >
        {/* Top Navbar */}
        <TopNav
          collapsed={sidebarCollapsed}
          streakDays={progress.learningStreakDays}
          isAdmin={isAdmin}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenProfile={() => setCurrentTab('settings')}
          onOpenAuth={() => setIsAuthOpen(true)}
          onNavigateTab={(tab) => setCurrentTab(tab)}
          title={getPageTitle()}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 mt-20 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <OverviewDashboard
              progress={progress}
              onSelectTrack={(tId) => handleOpenRoadmap(tId)}
              onOpenRoadmap={(tId) => handleOpenRoadmap(tId)}
              onOpenPlayground={() => setCurrentTab('ai-playground')}
              onSelectNode={(node, tId) => {
                setActiveTrackId(tId);
                setSelectedNodeForModal(node);
              }}
              onSelectTool={(tool) => {
                setSelectedToolForPlayground(tool);
                setCurrentTab('ai-playground');
              }}
            />
          )}

          {currentTab === 'track-full-stack' && (
            <FullStackTrackView
              completedNodeIds={progress.completedNodeIds}
              onSelectNode={(node) => setSelectedNodeForModal(node)}
              onOpenPlayground={() => setCurrentTab('ai-playground')}
              onSelectTrack={(tId) => handleOpenRoadmap(tId)}
            />
          )}

          {currentTab === 'track-ai-tools' && (
            <AIToolsTrackView
              completedNodeIds={progress.completedNodeIds}
              onSelectNode={(node) => setSelectedNodeForModal(node)}
              onOpenPlayground={() => setCurrentTab('ai-playground')}
              onSelectTrack={(tId) => handleOpenRoadmap(tId)}
            />
          )}

          {currentTab === 'track-ai-engineering' && (
            <AIEngineeringTrackView
              completedNodeIds={progress.completedNodeIds}
              onSelectNode={(node) => setSelectedNodeForModal(node)}
              onSelectTrack={(tId) => handleOpenRoadmap(tId)}
            />
          )}

          {currentTab === 'ai-playground' && (
            <AIToolsPlayground
              savedToolIds={progress.savedToolIds}
              onToggleSaveTool={handleToggleSaveTool}
              selectedToolForModal={selectedToolForPlayground}
              onClearSelectedTool={() => setSelectedToolForPlayground(null)}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsSection
              submissions={submissions}
              onSubmitProject={handleSubmitProject}
              selectedProjectFromSearch={selectedProjectForModal}
              onClearSelectedProject={() => setSelectedProjectForModal(null)}
            />
          )}

          {currentTab === 'coding-playground' && <CodingPlayground />}

          {currentTab === 'quizzes' && (
            <QuizzesSection
              quizScores={progress.quizScores}
              onRecordQuizScore={handleRecordQuizScore}
            />
          )}

          {currentTab === 'resources' && <ResourcesSection />}

          {currentTab === 'progress' && (
            <StudentProgressView
              progress={progress}
              submissions={submissions}
              onResetProgress={handleResetProgress}
              onOpenRoadmap={(tId) => handleOpenRoadmap(tId)}
            />
          )}

          {currentTab === 'bookmarks' && (
            <BookmarksNotesView
              savedToolIds={progress.savedToolIds}
              onToggleSaveTool={handleToggleSaveTool}
              onSelectTool={(tool) => {
                setSelectedToolForPlayground(tool);
                setCurrentTab('ai-playground');
              }}
              onSelectNode={(node) => setSelectedNodeForModal(node)}
            />
          )}

          {currentTab === 'settings' && (
            <ProfileSettingsView onNavigateToAdmin={() => setCurrentTab('admin')} />
          )}

          {currentTab === 'admin' && (
            <AdminDashboard
              submissions={submissions}
              onUpdateSubmission={handleUpdateSubmission}
              onSwitchToStudentView={() => setCurrentTab('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectNode={(node, trackId) => {
          setActiveTrackId(trackId);
          setSelectedNodeForModal(node);
        }}
        onSelectTool={(tool) => {
          setSelectedToolForPlayground(tool);
          setCurrentTab('ai-playground');
        }}
        onSelectProject={(project) => {
          setSelectedProjectForModal(project);
          setCurrentTab('projects');
        }}
      />

      {/* Auth Modal for Sign In & Registration */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Glassmorphic Learning Module Panel / Drawer */}
      <LearningModuleModal
        node={selectedNodeForModal}
        isOpen={Boolean(selectedNodeForModal)}
        onClose={() => setSelectedNodeForModal(null)}
        isCompleted={
          selectedNodeForModal ? progress.completedNodeIds.includes(selectedNodeForModal.id) : false
        }
        onToggleComplete={handleToggleCompleteNode}
        onRecordQuizScore={handleRecordQuizScore}
        onNavigateToProjects={() => setCurrentTab('projects')}
      />
    </div>
  );
}

export default App;
