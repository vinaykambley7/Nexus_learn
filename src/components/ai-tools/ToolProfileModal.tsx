import React from 'react';
import { X, ExternalLink, Bookmark, Check, AlertTriangle, ShieldCheck, Play, Sparkles } from 'lucide-react';
import { AITool } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ToolProfileModalProps {
  tool: AITool | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (toolId: string) => void;
}

export const ToolProfileModal: React.FC<ToolProfileModalProps> = ({
  tool,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  if (!isOpen || !tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 bg-dark-surface/90 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={tool.logo}
              alt={tool.name}
              className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-heading">{tool.name}</h2>
                <Badge variant="blue">{tool.category}</Badge>
                <Badge variant="outline">{tool.difficulty}</Badge>
              </div>
              <p className="text-xs text-text-muted mt-0.5">{tool.pricingType} • {tool.pricingDetails}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={isSaved ? 'orange' : 'outline'}
              size="sm"
              onClick={() => onToggleSave(tool.id)}
              className="flex items-center gap-1.5"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save Tool'}</span>
            </Button>
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-colors"
              title="Visit Official Website"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-dark-bg/60">
          {/* Description */}
          <div className="p-5 rounded-2xl bg-dark-card/60 border border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-heading">
              Overview & Capabilities
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {tool.detailedDescription}
            </p>
          </div>

          {/* Key Features & Use Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-dark-card/60 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider font-heading">
                Key Features
              </h4>
              <ul className="space-y-2 text-xs text-text-primary">
                {tool.keyFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sky-400 font-bold">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-dark-card/60 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-heading">
                Best Practical Use Cases
              </h4>
              <ul className="space-y-2 text-xs text-text-primary">
                {tool.bestUseCases.map((useCase, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Starter Prompts */}
          {tool.starterPrompts.length > 0 && (
            <div className="p-5 rounded-2xl bg-dark-card/60 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider font-heading">
                <Sparkles className="w-4 h-4" />
                <span>Production Prompt Templates</span>
              </div>
              <div className="space-y-3">
                {tool.starterPrompts.map((p, i) => (
                  <div key={i} className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span>{p.title}</span>
                      <Badge variant="purple" size="sm">{p.category}</Badge>
                    </div>
                    <p className="text-xs text-purple-200/80 font-mono whitespace-pre-wrap">{p.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advantages vs Limitations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-dark-card/60 border border-emerald-500/20 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-heading">
                <Check className="w-4 h-4" />
                <span>Advantages</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-200/90">
                {tool.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>✓</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-dark-card/60 border border-rose-500/20 space-y-2">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 font-heading">
                <AlertTriangle className="w-4 h-4" />
                <span>Limitations</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-200/90">
                {tool.limitations.map((lim, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span>⚠</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Privacy & Security Notes */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-text-muted">
            <ShieldCheck className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-medium">Privacy, Compliance & Training Data Policy:</strong>
              {tool.privacyNotes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
