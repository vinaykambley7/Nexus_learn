import React from 'react';
import { X, Check, ExternalLink, Star } from 'lucide-react';
import { AITool } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface ToolComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: AITool[];
}

export const ToolComparisonModal: React.FC<ToolComparisonModalProps> = ({
  isOpen,
  onClose,
  tools,
}) => {
  if (!isOpen || tools.length === 0) return null;

  const comparisonCriteria = [
    { key: 'coding', label: 'Code Generation & Refactoring' },
    { key: 'reasoning', label: 'Logical & Complex Reasoning' },
    { key: 'research', label: 'Deep Web Search & Citations' },
    { key: 'documentAnalysis', label: 'Long Document Analysis' },
    { key: 'multimodal', label: 'Vision & Multimodal Input' },
    { key: 'integrations', label: 'API & Workflow Integrations' },
    { key: 'writing', label: 'Nuanced Creative Writing' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[90vh] glass-panel rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 bg-dark-surface/90 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">
              AI Tools Side-by-Side Comparison Matrix
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Comparing {tools.map((t) => t.name).join(' vs ')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-dark-bg/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-xs font-bold text-text-muted uppercase tracking-wider w-1/4">
                    Evaluation Metric
                  </th>
                  {tools.map((tool) => (
                    <th key={tool.id} className="p-4 w-1/3 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={tool.logo}
                          alt={tool.name}
                          className="w-8 h-8 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <div className="text-base font-bold text-white font-heading">{tool.name}</div>
                          <div className="text-[11px] text-text-muted">{tool.category}</div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {/* Pricing row */}
                <tr>
                  <td className="p-4 font-semibold text-text-secondary text-xs">Pricing & Plans</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      <Badge variant="blue">{tool.pricingType}</Badge>
                      <div className="text-xs text-text-muted mt-1.5">{tool.pricingDetails}</div>
                    </td>
                  ))}
                </tr>

                {/* Quantitative Benchmark Scores */}
                {comparisonCriteria.map((criterion) => (
                  <tr key={criterion.key} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-text-primary text-xs">
                      {criterion.label}
                    </td>
                    {tools.map((tool) => {
                      const score = tool.comparisonScores[criterion.key];
                      return (
                        <td key={tool.id} className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white min-w-[28px]">{score}</span>
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  score >= 90
                                    ? 'bg-emerald-400'
                                    : score >= 80
                                    ? 'bg-sky-400'
                                    : 'bg-amber-400'
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Best Use Cases */}
                <tr>
                  <td className="p-4 font-semibold text-text-secondary text-xs">Ideal Use Cases</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      <ul className="space-y-1 text-xs text-text-secondary">
                        {tool.bestUseCases.map((useCase, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-sky-400 font-bold">•</span>
                            <span>{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Key Strengths */}
                <tr>
                  <td className="p-4 font-semibold text-text-secondary text-xs">Main Advantages</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      <ul className="space-y-1 text-xs text-emerald-300/90">
                        {tool.advantages.map((adv, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span>✓</span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Privacy & Governance */}
                <tr>
                  <td className="p-4 font-semibold text-text-secondary text-xs">Privacy & Data Training</td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4 text-xs text-text-muted">
                      {tool.privacyNotes}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
