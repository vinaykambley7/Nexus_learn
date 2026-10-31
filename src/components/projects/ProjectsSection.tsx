import React, { useState } from 'react';
import {
  Briefcase,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  AlertCircle,
  FileCheck,
  X
} from 'lucide-react';
import { PRACTICAL_PROJECTS } from '@/features/projects/projectsData';
import { ProjectLab, ProjectSubmission, TrackId } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

interface ProjectsSectionProps {
  submissions: ProjectSubmission[];
  onSubmitProject: (submission: Omit<ProjectSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  selectedProjectFromSearch?: ProjectLab | null;
  onClearSelectedProject?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  submissions,
  onSubmitProject,
  selectedProjectFromSearch,
  onClearSelectedProject,
}) => {
  const { user } = useAuth();
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('all');
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectLab | null>(null);

  // Form states for submission
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  React.useEffect(() => {
    if (selectedProjectFromSearch) {
      setActiveProjectModal(selectedProjectFromSearch);
    }
  }, [selectedProjectFromSearch]);

  const filteredProjects = PRACTICAL_PROJECTS.filter((p) => {
    if (selectedTrackFilter === 'all') return true;
    return p.trackId === selectedTrackFilter;
  });

  const getSubmissionForProject = (projectId: string) => {
    return submissions.find((s) => s.projectId === projectId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectModal || !githubUrl) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitProject({
        projectId: activeProjectModal.id,
        projectTitle: activeProjectModal.title,
        studentName: user?.fullName || 'NexusAdmin',
        studentEmail: user?.email || 'admin@nexuslearn.io',
        githubRepoUrl: githubUrl,
        liveUrl: liveUrl || undefined,
        notes,
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveProjectModal(null);
        setGithubUrl('');
        setLiveUrl('');
        setNotes('');
        if (onClearSelectedProject) onClearSelectedProject();
      }, 1200);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-3xl p-8 glass-panel border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <Badge variant="purple" size="md">
            Production Portfolio Builders
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Projects & Practical Labs
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Apply your knowledge by constructing verified, industry-grade applications. Submit your GitHub repositories for automated and instructor evaluation to build your verified engineering portfolio.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedTrackFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedTrackFilter === 'all'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'bg-dark-card/60 text-text-secondary hover:text-white border border-white/5'
          }`}
        >
          All Capstones ({PRACTICAL_PROJECTS.length})
        </button>
        <button
          onClick={() => setSelectedTrackFilter('full-stack')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedTrackFilter === 'full-stack'
              ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]'
              : 'bg-dark-card/60 text-text-secondary hover:text-white border border-white/5'
          }`}
        >
          Full-Stack Web Labs
        </button>
        <button
          onClick={() => setSelectedTrackFilter('ai-engineering')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            selectedTrackFilter === 'ai-engineering'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'bg-dark-card/60 text-text-secondary hover:text-white border border-white/5'
          }`}
        >
          AI Engineering & GenAI Labs
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const submission = getSubmissionForProject(project.id);

          return (
            <div
              key={project.id}
              onClick={() => setActiveProjectModal(project)}
              className="rounded-3xl p-6 glass-card glass-card-hover border border-white/10 flex flex-col justify-between group cursor-pointer relative shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={
                          project.difficulty === 'Industry Level'
                            ? 'purple'
                            : project.difficulty === 'Advanced'
                            ? 'orange'
                            : 'blue'
                        }
                      >
                        {project.difficulty}
                      </Badge>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {project.estimatedHours} hrs
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white font-heading group-hover:text-purple-300 transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  {/* Submission Status Badge */}
                  {submission && (
                    <Badge
                      variant={
                        submission.status === 'Approved'
                          ? 'emerald'
                          : submission.status === 'Changes Requested'
                          ? 'rose'
                          : 'orange'
                      }
                      size="sm"
                    >
                      {submission.status}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                  {project.subtitle}
                </p>

                {/* Tech stack pill tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action footer */}
              <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  {project.stepByStepMilestones.length} Milestones
                </span>
                <span className="text-xs text-purple-400 group-hover:text-purple-300 font-semibold flex items-center gap-1">
                  <span>{submission ? 'View Submission & Grade' : 'Open Lab Brief & Submit'}</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Submission / Detail Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setActiveProjectModal(null)} />
          <div className="relative w-full max-w-4xl max-h-[92vh] glass-panel rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/10 bg-dark-surface/90 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white font-heading">{activeProjectModal.title}</h2>
                  <Badge variant="purple">{activeProjectModal.difficulty}</Badge>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Estimated {activeProjectModal.estimatedHours} hours • {activeProjectModal.technologies.join(', ')}
                </p>
              </div>
              <button
                onClick={() => setActiveProjectModal(null)}
                className="p-1.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content & Submission Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-dark-bg/60">
              {/* Detailed Specification */}
              <div className="p-5 rounded-2xl bg-dark-card/60 border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                  Project Brief & Architectural Requirements
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {activeProjectModal.description}
                </p>
              </div>

              {/* Milestones */}
              <div className="p-5 rounded-2xl bg-dark-card/60 border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                  Step-by-Step Implementation Milestones
                </h3>
                <div className="space-y-3">
                  {activeProjectModal.stepByStepMilestones.map((m, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <div className="text-xs font-bold text-sky-400">{m.milestone}</div>
                      <div className="text-xs text-text-secondary">{m.description}</div>
                      <div className="text-[11px] text-text-muted font-mono pt-1">
                        <strong>Deliverable:</strong> {m.deliverable}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Existing Submission Status if submitted */}
              {(() => {
                const existing = getSubmissionForProject(activeProjectModal.id);
                if (existing) {
                  return (
                    <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <h4 className="text-sm font-bold text-white font-heading">
                            Submission Received ({existing.status})
                          </h4>
                        </div>
                        {existing.grade && (
                          <div className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                            Grade: {existing.grade}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-text-secondary space-y-1">
                        <div>
                          <strong>GitHub Repo:</strong>{' '}
                          <a href={existing.githubRepoUrl} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                            {existing.githubRepoUrl}
                          </a>
                        </div>
                        {existing.liveUrl && (
                          <div>
                            <strong>Live Demo:</strong>{' '}
                            <a href={existing.liveUrl} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
                              {existing.liveUrl}
                            </a>
                          </div>
                        )}
                      </div>
                      {existing.adminFeedback && (
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-emerald-300">
                          <strong>Instructor Feedback:</strong> {existing.adminFeedback}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

              {/* Submission Form */}
              <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-dark-card/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                  Submit Project for Verification
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    GitHub Repository URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/your-username/project-repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-text-muted focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Live Deployment URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://my-app.vercel.app"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-text-muted focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Implementation Notes & Architecture Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe key architecture choices or challenges overcome..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-text-muted focus:outline-none focus:border-purple-400"
                  />
                </div>

                {submitSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Project successfully submitted for evaluation!</span>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    variant="purple"
                    size="md"
                    isLoading={isSubmitting}
                    className="w-full"
                  >
                    Submit Project for Review
                  </Button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
