import React, { useState } from 'react';
import { BookOpen, FileText, Download, ExternalLink, Search, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ResourceItem {
  id: string;
  title: string;
  category: 'Full-Stack' | 'AI Tools' | 'AI Engineering' | 'System Design';
  type: 'Cheat Sheet' | 'Architecture Diagram' | 'Reference Manual' | 'PDF Guide';
  description: string;
  downloadUrl?: string;
  size: string;
}

const RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'React 19 Actions & useActionState Architecture Guide',
    category: 'Full-Stack',
    type: 'Reference Manual',
    description: 'Complete breakdown of Server Components, action transitions, useOptimistic, and React Compiler internals.',
    size: '1.4 MB',
  },
  {
    id: 'res-2',
    title: 'V8 JavaScript Event Loop & Microtask Execution Chart',
    category: 'Full-Stack',
    type: 'Architecture Diagram',
    description: 'Visual flow diagram tracing call stack, promise microtasks, and setTimeout macrotasks.',
    size: '850 KB',
  },
  {
    id: 'res-3',
    title: 'Production LLM Prompting & RTCC Framework Blueprint',
    category: 'AI Tools',
    type: 'Cheat Sheet',
    description: 'Copy-paste enterprise prompt templates for code reviews, architecture RFCs, and legal contract analysis.',
    size: '620 KB',
  },
  {
    id: 'res-4',
    title: 'Supabase pgvector HNSW Indexing & RAG Optimization PDF',
    category: 'AI Engineering',
    type: 'PDF Guide',
    description: 'In-depth guide on vector chunking, cosine distance metrics, and hybrid BM25 + dense search in PostgreSQL.',
    size: '2.8 MB',
  },
  {
    id: 'res-5',
    title: 'CrewAI Autonomous Multi-Agent Orchestration Patterns',
    category: 'AI Engineering',
    type: 'Reference Manual',
    description: 'Configuration examples for hierarchical task execution, memory retention, and tool calling error recovery.',
    size: '1.1 MB',
  },
  {
    id: 'res-6',
    title: 'High-Scale Distributed Systems Design Checklist',
    category: 'System Design',
    type: 'Cheat Sheet',
    description: 'Checklist covering CAP theorem trade-offs, Redis cache-aside patterns, database sharding, and rate limiters.',
    size: '940 KB',
  }
];

export const ResourcesSection: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filtered = RESOURCES.filter((r) => {
    const matchCat = selectedCat === 'All' || r.category === selectedCat;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (item: ResourceItem) => {
    const markdownContent = `# ${item.title}
**Category**: ${item.category} | **Type**: ${item.type} | **Platform**: NexusLearn Next-Gen Academy

## Overview
${item.description}

## Core Architectural Blueprint & Checkpoints
1. **Design Pattern**: Decoupled, event-driven reactive components with explicit data validation schemas.
2. **Security Model**: Strict RBAC, parameterized database queries, vector similarity indexing with Cosine/HNSW.
3. **Performance Optimization**: Stale-while-revalidate client caching, Redis cache-aside, vector quantization.
4. **Tooling & DX**: TypeScript 5+, React 19, Supabase pgvector, FastAPI, Vite.

---
*Downloaded from NexusLearn Engineering Documentation Portal*
`;
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Downloaded "${item.title}"`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {downloadSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400/30 animate-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>{downloadSuccess} (.md)</span>
        </div>
      )}
      {/* Header */}
      <div className="rounded-3xl p-8 glass-panel border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <Badge variant="blue" size="md">Official Engineering Reference Library</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Learning Resources & Documentation
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Curated architectural guides, production cheat sheets, system design diagrams, and official documentation references to accelerate your development journey.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search manuals, cheat sheets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card/80 border border-white/10 text-white text-xs placeholder-text-muted focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Full-Stack', 'AI Tools', 'AI Engineering', 'System Design'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'bg-dark-card/60 text-text-secondary hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl p-6 glass-card glass-card-hover border border-white/10 flex flex-col justify-between shadow-lg space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="blue" size="sm">{item.category}</Badge>
                <span className="text-[11px] font-mono text-text-muted">{item.size}</span>
              </div>
              <h3 className="text-base font-bold text-white font-heading">{item.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-sky-400">{item.type}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(item)}
                className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-white hover:border-sky-500/50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .MD</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
