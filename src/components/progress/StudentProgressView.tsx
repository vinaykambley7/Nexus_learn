import React from 'react';
import {
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  Award,
  Layers,
  Sparkles,
  Cpu,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { LEARNING_TRACKS } from '@/features/curriculum/curriculumData';
import { StudentProgress, ProjectSubmission, TrackId } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface StudentProgressViewProps {
  progress: StudentProgress;
  submissions: ProjectSubmission[];
  onResetProgress: () => void;
  onOpenRoadmap: (trackId: TrackId) => void;
}

export const StudentProgressView: React.FC<StudentProgressViewProps> = ({
  progress,
  submissions,
  onResetProgress,
  onOpenRoadmap,
}) => {
  // Aggregate stats
  let totalPlatformModules = 0;
  LEARNING_TRACKS.forEach((t) => {
    t.levels.forEach((lvl) => {
      totalPlatformModules += lvl.nodes.length;
    });
  });

  const overallPercent = Math.round(
    (progress.completedNodeIds.length / (totalPlatformModules || 1)) * 100
  );

  const quizAttempts = Object.values(progress.quizScores);
  const passedQuizzes = quizAttempts.filter((q) => q.passed).length;
  const avgQuizScore =
    quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((acc, q) => acc + q.score, 0) / quizAttempts.length)
      : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl p-8 glass-panel border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <Badge variant="blue" size="md">Academic Portfolio & Verification</Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Personal Learning Progress
            </h1>
            <p className="text-sm text-text-secondary">
              Track your module completions, quiz scores, project evaluations, and learning streaks across all three tracks.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onResetProgress}
            className="flex items-center gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Progress</span>
          </Button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold">
            <span>Overall Completion</span>
            <Trophy className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">{overallPercent}%</div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-text-muted">
            {progress.completedNodeIds.length} of {totalPlatformModules} Modules completed
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold">
            <span>Learning Streak</span>
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-heading">
            {progress.learningStreakDays} <span className="text-sm font-normal text-text-muted">days</span>
          </div>
          <div className="text-[11px] text-text-muted">Consistent daily study momentum</div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold">
            <span>Quiz Performance</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading">
            {avgQuizScore}% <span className="text-sm font-normal text-text-muted">avg</span>
          </div>
          <div className="text-[11px] text-text-muted">
            {passedQuizzes} of {quizAttempts.length} quizzes passed
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold">
            <span>Lab Submissions</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-400 font-heading">
            {submissions.length} <span className="text-sm font-normal text-text-muted">projects</span>
          </div>
          <div className="text-[11px] text-text-muted">
            {submissions.filter((s) => s.status === 'Approved').length} verified & graded
          </div>
        </div>
      </div>

      {/* Track-by-Track Detailed Breakdown */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white font-heading">Track Mastery Breakdown</h2>

        <div className="space-y-4">
          {LEARNING_TRACKS.map((track) => {
            const allTrackNodes = track.levels.flatMap((lvl) => lvl.nodes);
            const completedInTrack = allTrackNodes.filter((n) =>
              progress.completedNodeIds.includes(n.id)
            ).length;
            const percent = Math.round((completedInTrack / (allTrackNodes.length || 1)) * 100);

            return (
              <div
                key={track.id}
                className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                      style={{
                        backgroundColor: track.accentColor + '20',
                        border: `1px solid ${track.accentColor}40`,
                      }}
                    >
                      {track.id === 'full-stack' && <Layers className="w-5 h-5 text-sky-400" />}
                      {track.id === 'ai-tools' && <Sparkles className="w-5 h-5 text-amber-400" />}
                      {track.id === 'ai-engineering' && <Cpu className="w-5 h-5 text-purple-400" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-heading">{track.title}</h3>
                      <div className="text-xs text-text-muted">
                        {completedInTrack} of {allTrackNodes.length} Modules Completed ({percent}%)
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenRoadmap(track.id)}
                    className="text-xs"
                  >
                    Open Track Roadmap
                  </Button>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: track.accentColor,
                    }}
                  />
                </div>

                {/* Node Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {allTrackNodes.map((node) => {
                    const isDone = progress.completedNodeIds.includes(node.id);
                    return (
                      <span
                        key={node.id}
                        className={`text-xs px-3 py-1 rounded-xl border flex items-center gap-1.5 transition-all ${
                          isDone
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 font-semibold'
                            : 'bg-white/5 border-white/5 text-text-muted'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        )}
                        <span>{node.title}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
