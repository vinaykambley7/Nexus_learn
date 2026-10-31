import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Sparkles, Briefcase, ChevronRight } from 'lucide-react';
import { LEARNING_TRACKS } from '@/features/curriculum/curriculumData';
import { AI_TOOLS } from '@/features/ai-tools/aiToolsData';
import { PRACTICAL_PROJECTS } from '@/features/projects/projectsData';
import { RoadmapNode, AITool, ProjectLab, TrackId } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (node: RoadmapNode, trackId: TrackId) => void;
  onSelectTool: (tool: AITool) => void;
  onSelectProject: (project: ProjectLab) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectNode,
  onSelectTool,
  onSelectProject,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Find matching nodes
  const matchingNodes: { node: RoadmapNode; trackId: TrackId; trackTitle: string }[] = [];
  if (normalizedQuery) {
    LEARNING_TRACKS.forEach((track) => {
      track.levels.forEach((level) => {
        level.nodes.forEach((node) => {
          if (
            node.title.toLowerCase().includes(normalizedQuery) ||
            node.description.toLowerCase().includes(normalizedQuery) ||
            node.category.toLowerCase().includes(normalizedQuery)
          ) {
            matchingNodes.push({ node, trackId: track.id, trackTitle: track.title });
          }
        });
      });
    });
  }

  // Find matching AI tools
  const matchingTools = normalizedQuery
    ? AI_TOOLS.filter(
        (tool) =>
          tool.name.toLowerCase().includes(normalizedQuery) ||
          tool.shortDescription.toLowerCase().includes(normalizedQuery) ||
          tool.category.toLowerCase().includes(normalizedQuery)
      )
    : [];

  // Find matching Projects
  const matchingProjects = normalizedQuery
    ? PRACTICAL_PROJECTS.filter(
        (proj) =>
          proj.title.toLowerCase().includes(normalizedQuery) ||
          proj.technologies.some((t) => t.toLowerCase().includes(normalizedQuery))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel border border-white/20 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-dark-surface/90">
          <Search className="w-5 h-5 text-sky-400 mr-3" />
          <input
            type="text"
            placeholder="Search tracks, modules, AI tools, or practical projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-white placeholder-text-muted focus:outline-none text-base"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-secondary hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!normalizedQuery && (
            <div className="py-8 text-center text-text-muted text-sm">
              Type to search across curriculum modules, lessons, AI tools, and capstone labs.
            </div>
          )}

          {normalizedQuery && (
            <>
              {/* Learning Modules Results */}
              {matchingNodes.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                    <span>Curriculum Modules ({matchingNodes.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingNodes.slice(0, 5).map(({ node, trackId, trackTitle }) => (
                      <button
                        key={node.id}
                        onClick={() => {
                          onSelectNode(node, trackId);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-colors group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-sky-300">
                            {node.title}
                          </div>
                          <div className="text-xs text-text-muted">
                            {trackTitle} • {node.difficulty} • {node.estimatedMinutes} mins
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-sky-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Tools Results */}
              {matchingTools.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI Tools Directory ({matchingTools.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingTools.slice(0, 4).map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          onSelectTool(tool);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={tool.logo}
                            alt={tool.name}
                            className="w-7 h-7 rounded-lg object-cover"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white group-hover:text-amber-300">
                              {tool.name}
                            </div>
                            <div className="text-xs text-text-muted">{tool.category} • {tool.pricingType}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-amber-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Results */}
              {matchingProjects.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                    <span>Practical Labs ({matchingProjects.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingProjects.slice(0, 3).map((proj) => (
                      <button
                        key={proj.id}
                        onClick={() => {
                          onSelectProject(proj);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-colors group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-purple-300">
                            {proj.title}
                          </div>
                          <div className="text-xs text-text-muted">
                            {proj.difficulty} • {proj.estimatedHours} hrs • {proj.technologies.slice(0, 3).join(', ')}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-purple-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingNodes.length === 0 && matchingTools.length === 0 && matchingProjects.length === 0 && (
                <div className="py-8 text-center text-text-muted text-sm">
                  No matches found for &quot;{query}&quot;. Try searching for &quot;React&quot;, &quot;Claude&quot;, or &quot;RAG&quot;.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
