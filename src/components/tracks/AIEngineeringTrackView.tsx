import React from 'react';
import { Cpu, CheckCircle2, Clock, Play, ArrowRight } from 'lucide-react';
import { LEARNING_TRACKS } from '@/features/curriculum/curriculumData';
import { InteractiveRoadmap } from '@/components/roadmap/InteractiveRoadmap';
import { RoadmapNode, TrackId } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface AIEngineeringTrackViewProps {
  completedNodeIds: string[];
  onSelectNode: (node: RoadmapNode) => void;
  onSelectTrack?: (trackId: TrackId) => void;
}

export const AIEngineeringTrackView: React.FC<AIEngineeringTrackViewProps> = ({
  completedNodeIds,
  onSelectNode,
  onSelectTrack,
}) => {
  const track = LEARNING_TRACKS.find((t) => t.id === 'ai-engineering')!;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl p-8 glass-panel border border-purple-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <Badge variant="purple" size="md">Track 3: Generative AI & Deep Learning Systems</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            AI Engineering & Production Systems
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            From Python vector mathematics, PyTorch neural networks, and Transformer self-attention to production Supabase pgvector RAG, FastAPI model serving, autonomous CrewAI agents, and MLOps.
          </p>
        </div>
      </div>

      {/* Embedded Roadmap */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-heading">AI Engineering Nonlinear Roadmap</h2>
            <p className="text-xs text-text-muted">Interactive zoom/pan canvas. Click nodes to open learning modules.</p>
          </div>
        </div>
        <InteractiveRoadmap
          track={track}
          onSelectTrack={onSelectTrack || (() => {})}
          onSelectNode={onSelectNode}
          completedNodeIds={completedNodeIds}
        />
      </div>

      {/* 7 Levels Syllabus */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white font-heading">The 7 Levels of AI Engineering</h2>

        <div className="space-y-6">
          {track.levels.map((level) => (
            <div key={level.id} className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                    Level {level.order}
                  </span>
                  <Badge variant="outline" size="sm">{level.difficulty}</Badge>
                </div>
                <h3 className="text-lg font-bold text-white font-heading mt-0.5">{level.title}</h3>
                <p className="text-xs text-text-secondary mt-1">{level.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {level.nodes.map((node) => {
                  const isDone = completedNodeIds.includes(node.id);

                  return (
                    <div
                      key={node.id}
                      onClick={() => onSelectNode(node)}
                      className="p-5 rounded-2xl bg-dark-card/60 hover:bg-dark-hover border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer group flex flex-col justify-between shadow-md"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <Badge variant="purple" size="sm">{node.category}</Badge>
                          {isDone ? (
                            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Done
                            </span>
                          ) : (
                            <span className="text-text-muted text-xs flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {node.estimatedMinutes}m
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors font-heading">
                          {node.title}
                        </h4>
                        <p className="text-xs text-text-secondary line-clamp-2">
                          {node.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-purple-400 group-hover:text-purple-300 font-semibold">
                        <span>Open Architecture Lab</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
