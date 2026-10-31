import React, { useState } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  ExternalLink,
  Scale,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { AI_TOOLS, AI_TOOL_CATEGORIES } from '@/features/ai-tools/aiToolsData';
import { AITool, AIToolCategory } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ToolProfileModal } from './ToolProfileModal';
import { ToolComparisonModal } from './ToolComparisonModal';

interface AIToolsPlaygroundProps {
  savedToolIds: string[];
  onToggleSaveTool: (toolId: string) => void;
  selectedToolForModal?: AITool | null;
  onClearSelectedTool?: () => void;
}

export const AIToolsPlayground: React.FC<AIToolsPlaygroundProps> = ({
  savedToolIds,
  onToggleSaveTool,
  selectedToolForModal,
  onClearSelectedTool,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [activeProfileTool, setActiveProfileTool] = useState<AITool | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // Sync external selection from dashboard/search
  React.useEffect(() => {
    if (selectedToolForModal) {
      setActiveProfileTool(selectedToolForModal);
    }
  }, [selectedToolForModal]);

  // Filter tools
  const filteredTools = AI_TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'All' || tool.difficulty === selectedDifficulty;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.bestUseCases.some((u) => u.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const [compareWarning, setCompareWarning] = useState<string | null>(null);

  const toggleComparisonTool = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedForComparison.includes(toolId)) {
      setSelectedForComparison(selectedForComparison.filter((id) => id !== toolId));
    } else {
      if (selectedForComparison.length >= 3) {
        setCompareWarning('You can compare a maximum of 3 AI tools simultaneously.');
        setTimeout(() => setCompareWarning(null), 3500);
        return;
      }
      setSelectedForComparison([...selectedForComparison, toolId]);
    }
  };

  const toolsToCompare = AI_TOOLS.filter((t) => selectedForComparison.includes(t.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Compare Warning Toast */}
      {compareWarning && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-amber-400/30 animate-in slide-in-from-bottom-2">
          <Info className="w-4 h-4 text-amber-200" />
          <span>{compareWarning}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl p-8 glass-panel border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <Badge variant="orange" size="md">
            Educational Directory & Evaluation Matrix
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            AI Tools Playground
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Discover, evaluate, and compare modern generative AI tools for software development, research, creative media, and workflow automation. Understand the exact trade-offs before integrating them into production.
          </p>
        </div>
      </div>

      {/* Floating Compare Action Bar if tools are selected */}
      {selectedForComparison.length > 0 && (
        <div className="sticky top-24 z-20 p-4 rounded-2xl glass-panel border border-amber-500/30 shadow-[0_10px_30px_rgba(245,158,11,0.2)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-white">
              {selectedForComparison.length} {selectedForComparison.length === 1 ? 'Tool' : 'Tools'} selected for comparison:
            </span>
            <div className="flex items-center gap-2">
              {toolsToCompare.map((t) => (
                <span
                  key={t.id}
                  className="text-xs bg-white/10 px-2.5 py-1 rounded-lg text-white font-medium"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedForComparison([])}
            >
              Clear
            </Button>
            <Button
              variant="orange"
              size="sm"
              onClick={() => setIsCompareOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Scale className="w-4 h-4" />
              <span>Compare Side-by-Side</span>
            </Button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tools, capabilities, prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card/80 border border-white/10 text-white placeholder-text-muted text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Difficulty pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-dark-card/60 text-text-muted hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-dark-card/60 text-text-secondary hover:text-white border border-white/5'
            }`}
          >
            All Categories
          </button>
          {AI_TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-dark-card/60 text-text-secondary hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const isSaved = savedToolIds.includes(tool.id);
          const isComparing = selectedForComparison.includes(tool.id);

          return (
            <div
              key={tool.id}
              onClick={() => setActiveProfileTool(tool)}
              className="rounded-3xl p-6 glass-card glass-card-hover border border-white/10 flex flex-col justify-between group cursor-pointer relative shadow-lg"
            >
              <div className="space-y-4">
                {/* Card Top Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white font-heading group-hover:text-amber-300 transition-colors">
                        {tool.name}
                      </h3>
                      <div className="text-xs text-text-muted">{tool.category}</div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveTool(tool.id);
                    }}
                    className={`p-2 rounded-xl border transition-colors ${
                      isSaved
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-white/5 border-white/10 text-text-muted hover:text-white'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save Tool'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                  {tool.shortDescription}
                </p>

                {/* Key features preview */}
                <div className="space-y-1 pt-1">
                  {tool.keyFeatures.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-text-muted truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <Badge variant="blue" size="sm">
                  {tool.pricingType}
                </Badge>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleComparisonTool(tool.id, e)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isComparing
                        ? 'bg-amber-500 text-white border-amber-400'
                        : 'bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border-white/10'
                    }`}
                  >
                    {isComparing ? '✓ Comparing' : '+ Compare'}
                  </button>

                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
                    title="Open official site"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="p-12 text-center text-text-muted glass-panel rounded-3xl border border-white/10">
          No AI tools found matching &quot;{searchQuery}&quot; in category &quot;{selectedCategory}&quot;.
        </div>
      )}

      {/* Tool Profile Modal */}
      <ToolProfileModal
        tool={activeProfileTool}
        isOpen={Boolean(activeProfileTool)}
        onClose={() => {
          setActiveProfileTool(null);
          if (onClearSelectedTool) onClearSelectedTool();
        }}
        isSaved={activeProfileTool ? savedToolIds.includes(activeProfileTool.id) : false}
        onToggleSave={onToggleSaveTool}
      />

      {/* Comparison Modal */}
      <ToolComparisonModal
        tools={toolsToCompare}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
    </div>
  );
};
