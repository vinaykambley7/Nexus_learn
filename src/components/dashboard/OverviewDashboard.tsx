import React from 'react';
import {
  Layers,
  Sparkles,
  Cpu,
  ArrowRight,
  Clock,
  CheckCircle2,
  BookOpen,
  Compass,
  Trophy,
  Flame,
  Award,
  Play
} from 'lucide-react';
import { LEARNING_TRACKS } from '@/features/curriculum/curriculumData';
import { AI_TOOLS } from '@/features/ai-tools/aiToolsData';
import { StudentProgress, TrackId, RoadmapNode, AITool } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface OverviewDashboardProps {
  progress: StudentProgress;
  onSelectTrack: (trackId: TrackId) => void;
  onOpenRoadmap: (trackId: TrackId) => void;
  onOpenPlayground: () => void;
  onSelectNode: (node: RoadmapNode, trackId: TrackId) => void;
  onSelectTool: (tool: AITool) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  progress,
  onSelectTrack,
  onOpenRoadmap,
  onOpenPlayground,
  onSelectNode,
  onSelectTool,
}) => {
  // Calculate track progress
  const getTrackStats = (trackId: TrackId) => {
    const track = LEARNING_TRACKS.find((t) => t.id === trackId);
    if (!track) return { total: 0, completed: 0, percent: 0 };
    const allNodeIds = track.levels.flatMap((lvl) => lvl.nodes.map((n) => n.id));
    const completedCount = allNodeIds.filter((id) => progress.completedNodeIds.includes(id)).length;
    const percent = Math.round((completedCount / (allNodeIds.length || 1)) * 100);
    return { total: allNodeIds.length, completed: completedCount, percent };
  };

  const savedTools = AI_TOOLS.filter((t) => progress.savedToolIds.includes(t.id));

  // Activity days mockup for the 7-day streak chart
  const weeklyActivity = [
    { day: 'Mon', hours: 2.5, completed: true },
    { day: 'Tue', hours: 3.2, completed: true },
    { day: 'Wed', hours: 1.8, completed: true },
    { day: 'Thu', hours: 4.0, completed: true },
    { day: 'Fri', hours: 2.1, completed: true },
    { day: 'Sat', hours: 3.5, completed: true },
    { day: 'Sun', hours: 2.8, completed: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Section */}
      <div className="relative rounded-3xl p-8 glass-panel border border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack & Generative AI Mastery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              Welcome back, <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Alex</span>
            </h1>
            <p className="text-sm sm:text-base text-text-secondary">
              You are on a <strong className="text-amber-400">{progress.learningStreakDays}-day study streak</strong>. Continue your path across Full-Stack, AI Tools, and AI Engineering below.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="p-4 rounded-2xl bg-dark-card/60 border border-white/10 min-w-[130px]">
              <div className="flex items-center gap-2 text-text-muted text-xs font-medium">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <span>Streak</span>
              </div>
              <div className="text-2xl font-bold text-white mt-1 font-heading">{progress.learningStreakDays} <span className="text-xs font-normal text-text-muted">days</span></div>
            </div>

            <div className="p-4 rounded-2xl bg-dark-card/60 border border-white/10 min-w-[130px]">
              <div className="flex items-center gap-2 text-text-muted text-xs font-medium">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>Hours Spent</span>
              </div>
              <div className="text-2xl font-bold text-white mt-1 font-heading">{progress.totalHoursLearned} <span className="text-xs font-normal text-text-muted">hrs</span></div>
            </div>

            <div className="p-4 rounded-2xl bg-dark-card/60 border border-white/10 min-w-[130px]">
              <div className="flex items-center gap-2 text-text-muted text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Completed</span>
              </div>
              <div className="text-2xl font-bold text-white mt-1 font-heading">{progress.completedNodeIds.length} <span className="text-xs font-normal text-text-muted">modules</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* THREE PRIMARY TRACK CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">Primary Learning Tracks</h2>
            <p className="text-xs text-text-secondary mt-0.5">Explore structured non-linear curriculum roadmaps</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Track 1: Full-Stack Development */}
          {(() => {
            const stats = getTrackStats('full-stack');
            return (
              <div className="group rounded-3xl p-6 glass-card glass-card-hover border border-white/10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                      <Layers className="w-6 h-6" />
                    </div>
                    <Badge variant="blue">Level 1 - 6</Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white font-heading group-hover:text-sky-300 transition-colors">
                      Full-Stack Development
                    </h3>
                    <p className="text-xs text-text-secondary mt-2 line-clamp-3">
                      Master modern frontend, React 19, TypeScript, scalable Node.js & Spring Boot backends, PostgreSQL, Kafka, and enterprise system design.
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text-secondary">Track Progress</span>
                      <span className="text-sky-400">{stats.percent}% ({stats.completed}/{stats.total} Modules)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${stats.percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/10">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onSelectTrack('full-stack')}
                    className="w-full text-xs"
                  >
                    Continue
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenRoadmap('full-stack')}
                    className="w-full text-xs"
                  >
                    View Roadmap
                  </Button>
                </div>
              </div>
            );
          })()}

          {/* Track 2: AI Tools Mastery */}
          {(() => {
            const stats = getTrackStats('ai-tools');
            return (
              <div className="group rounded-3xl p-6 glass-card glass-card-hover border border-white/10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <Badge variant="orange">6 Major Modules</Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white font-heading group-hover:text-amber-300 transition-colors">
                      AI Tools Mastery
                    </h3>
                    <p className="text-xs text-text-secondary mt-2 line-clamp-3">
                      Master modern AI assistants (ChatGPT, Claude 3.7, Gemini 2.0), Perplexity, Cursor IDE, Lovable, Make.com automations, and ElevenLabs.
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text-secondary">Track Progress</span>
                      <span className="text-amber-400">{stats.percent}% ({stats.completed}/{stats.total} Modules)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"
                        style={{ width: `${stats.percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/10">
                  <Button
                    variant="orange"
                    size="sm"
                    onClick={() => onSelectTrack('ai-tools')}
                    className="w-full text-xs"
                  >
                    Continue
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenRoadmap('ai-tools')}
                    className="w-full text-xs"
                  >
                    View Roadmap
                  </Button>
                </div>
              </div>
            );
          })()}

          {/* Track 3: AI Engineering */}
          {(() => {
            const stats = getTrackStats('ai-engineering');
            return (
              <div className="group rounded-3xl p-6 glass-card glass-card-hover border border-white/10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <Badge variant="purple">Level 1 - 7</Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white font-heading group-hover:text-purple-300 transition-colors">
                      AI Engineering
                    </h3>
                    <p className="text-xs text-text-secondary mt-2 line-clamp-3">
                      Build production AI systems: Python & Math foundations, PyTorch, Transformers, Supabase pgvector RAG, FastAPI model serving, and CrewAI agents.
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text-secondary">Track Progress</span>
                      <span className="text-purple-400">{stats.percent}% ({stats.completed}/{stats.total} Modules)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${stats.percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/10">
                  <Button
                    variant="purple"
                    size="sm"
                    onClick={() => onSelectTrack('ai-engineering')}
                    className="w-full text-xs"
                  >
                    Continue
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenRoadmap('ai-engineering')}
                    className="w-full text-xs"
                  >
                    View Roadmap
                  </Button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* MIDDLE SECTION: WEEKLY ACTIVITY CHART & CURRENT IN-PROGRESS LESSONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Study Activity Chart */}
        <div className="lg:col-span-2 rounded-3xl p-6 glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-heading">Weekly Study Momentum</h3>
              <p className="text-xs text-text-muted mt-0.5">Daily time spent coding and reviewing lessons</p>
            </div>
            <span className="text-xs text-sky-400 font-semibold bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
              Avg 2.8 hrs / day
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
            {weeklyActivity.map((item, idx) => {
              const maxHours = 5;
              const heightPercent = Math.round((item.hours / maxHours) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="text-[10px] text-text-muted group-hover:text-white transition-colors">
                    {item.hours}h
                  </div>
                  <div className="w-full h-28 bg-white/5 rounded-xl overflow-hidden flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-sky-600 via-sky-400 to-indigo-400 rounded-t-xl group-hover:brightness-125 transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="text-xs font-semibold text-text-secondary group-hover:text-sky-300">
                    {item.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Continue Learning Widget */}
        <div className="rounded-3xl p-6 glass-panel border border-white/10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-heading">Up Next</h3>
              <Badge variant="blue">Recommended</Badge>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Full-Stack • Level 1
              </div>
              <div className="text-sm font-bold text-white">JavaScript Deep Dive & Async Runtime</div>
              <p className="text-xs text-text-secondary line-clamp-2">
                Event Loop, Microtasks, V8 Call Stack, and custom async task queue implementation.
              </p>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Clock className="w-3.5 h-3.5" />
                <span>60 mins remaining</span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full mt-4 flex items-center justify-center gap-2"
            onClick={() => {
              const fsTrack = LEARNING_TRACKS.find((t) => t.id === 'full-stack');
              const jsNode = fsTrack?.levels[0].nodes.find((n) => n.id === 'mod-js');
              if (jsNode) onSelectNode(jsNode, 'full-stack');
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume Lesson</span>
          </Button>
        </div>
      </div>

      {/* SAVED AI TOOLS SHOWCASE */}
      <div className="rounded-3xl p-6 glass-panel border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-heading">Saved AI Tools & Playgrounds</h3>
            <p className="text-xs text-text-muted mt-0.5">Quick access to your bookmarked AI assistants and generators</p>
          </div>
          <button
            onClick={onOpenPlayground}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
          >
            <span>Explore All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {savedTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="p-4 rounded-2xl bg-dark-card/60 hover:bg-dark-hover border border-white/10 hover:border-white/20 transition-all cursor-pointer group flex items-start gap-3.5 shadow-sm"
            >
              <img
                src={tool.logo}
                alt={tool.name}
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-white/10"
              />
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                  {tool.name}
                </div>
                <div className="text-[11px] text-text-muted truncate">{tool.category}</div>
                <div className="mt-1">
                  <Badge variant="outline" size="sm">{tool.pricingType}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
