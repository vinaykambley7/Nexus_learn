import React, { useState } from 'react';
import { Bookmark, FileText, Trash2, Plus, Sparkles, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { AI_TOOLS } from '@/features/ai-tools/aiToolsData';
import { LEARNING_TRACKS } from '@/features/curriculum/curriculumData';
import { AITool, RoadmapNode } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface NoteItem {
  id: string;
  title: string;
  moduleId?: string;
  content: string;
  updatedAt: string;
}

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'React 19 Action Transition Notes',
    moduleId: 'mod-react19',
    content: `### React 19 Action Key Rules:
- useActionState accepts an action function and initial state.
- Always combine with useOptimistic for immediate client UI updates before server confirmation.
- Form action attribute natively executes async actions without manual preventDefault.`,
    updatedAt: '2026-10-29T14:10:00Z',
  },
  {
    id: 'note-2',
    title: 'PostgreSQL HNSW vs IVFFlat Indexing',
    moduleId: 'mod-rag-pgvector',
    content: `### Vector Index Trade-offs:
- **HNSW**: Higher build time and memory usage, but superior recall and sub-5ms query latency. Recommended for production.
- **IVFFlat**: Faster build and lower memory, but lower recall on dynamic updates. Requires training lists.`,
    updatedAt: '2026-10-28T09:25:00Z',
  }
];

interface BookmarksNotesViewProps {
  savedToolIds: string[];
  onToggleSaveTool: (toolId: string) => void;
  onSelectTool: (tool: AITool) => void;
  onSelectNode: (node: RoadmapNode) => void;
}

export const BookmarksNotesView: React.FC<BookmarksNotesViewProps> = ({
  savedToolIds,
  onToggleSaveTool,
  onSelectTool,
  onSelectNode,
}) => {
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const data = localStorage.getItem('nexus_student_notes_v1');
      if (data) return JSON.parse(data);
    } catch (e) {}
    return INITIAL_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleSaveNote = (title: string, content: string) => {
    const updated = notes.map((n) =>
      n.id === activeNote.id
        ? { ...n, title, content, updatedAt: new Date().toISOString() }
        : n
    );
    setNotes(updated);
    try {
      localStorage.setItem('nexus_student_notes_v1', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleCreateNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now().toString(36)}`,
      title: 'New Study Note',
      content: 'Write your Markdown notes here...',
      updatedAt: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setActiveNoteId(newNote.id);
    setIsEditing(true);
    try {
      localStorage.setItem('nexus_student_notes_v1', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    if (activeNoteId === id && updated.length > 0) {
      setActiveNoteId(updated[0].id);
    }
    try {
      localStorage.setItem('nexus_student_notes_v1', JSON.stringify(updated));
    } catch (e) {}
  };

  const savedToolsList = AI_TOOLS.filter((t) => savedToolIds.includes(t.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-3xl p-8 glass-panel border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <Badge variant="blue" size="md">Personal Knowledge Base</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Bookmarks & Study Notes
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Organize personal technical notes, capture architectural insights during lessons, and manage your bookmarked AI tools library.
          </p>
        </div>
      </div>

      {/* Grid: Left Notes List + Right Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes sidebar */}
        <div className="rounded-3xl glass-panel border border-white/10 p-5 space-y-4 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-sm font-bold text-white font-heading">Study Notes ({notes.length})</span>
            <Button variant="primary" size="sm" onClick={handleCreateNote} className="flex items-center gap-1 text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>New Note</span>
            </Button>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                  activeNoteId === note.id
                    ? 'bg-sky-500/20 border-sky-400 text-white shadow-sm'
                    : 'bg-dark-card/60 border-white/10 text-text-secondary hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white truncate">{note.title}</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="text-text-muted hover:text-rose-400 p-0.5"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[11px] text-text-muted mt-1 font-mono">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note Editor Area (2 cols) */}
        {activeNote ? (
          <div className="lg:col-span-2 rounded-3xl glass-panel border border-white/10 p-6 space-y-4 shadow-xl flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleSaveNote(e.target.value, activeNote.content)}
                className="bg-transparent text-xl font-bold text-white font-heading focus:outline-none w-full"
                placeholder="Note Title"
              />
              <span className="text-[11px] font-mono text-text-muted whitespace-nowrap">
                Last edited: {new Date(activeNote.updatedAt).toLocaleTimeString()}
              </span>
            </div>

            <textarea
              value={activeNote.content}
              onChange={(e) => handleSaveNote(activeNote.title, e.target.value)}
              className="flex-1 w-full bg-black/40 p-4 rounded-2xl border border-white/10 text-xs text-sky-200 font-mono resize-none focus:outline-none leading-relaxed"
              placeholder="Write your study notes and code observations..."
            />
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-3xl glass-panel border border-white/10 p-8 text-center text-text-muted flex items-center justify-center">
            Click &quot;New Note&quot; to begin writing notes.
          </div>
        )}
      </div>

      {/* Bookmarked AI Tools */}
      <div className="rounded-3xl glass-panel border border-white/10 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h3 className="text-base font-bold text-white font-heading">
              Bookmarked AI Tools ({savedToolsList.length})
            </h3>
          </div>
        </div>

        {savedToolsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {savedToolsList.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool)}
                className="p-4 rounded-2xl bg-dark-card/60 hover:bg-dark-hover border border-white/10 flex items-center justify-between cursor-pointer group shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <img src={tool.logo} alt={tool.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {tool.name}
                    </h4>
                    <div className="text-[11px] text-text-muted">{tool.category}</div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSaveTool(tool.id);
                  }}
                  className="text-amber-400 hover:text-white p-1"
                  title="Remove bookmark"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-text-muted py-4 text-center">
            No tools bookmarked yet. Visit the AI Tools Playground to save frequently used tools.
          </div>
        )}
      </div>
    </div>
  );
};
