import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  Cpu,
  Compass,
  Briefcase,
  Terminal,
  Award,
  BookOpen,
  LineChart,
  Bookmark,
  Settings,
  Shield,
  Flame,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrackId } from '@/types';

export type NavItem =
  | 'dashboard'
  | 'track-full-stack'
  | 'track-ai-tools'
  | 'track-ai-engineering'
  | 'ai-playground'
  | 'projects'
  | 'coding-playground'
  | 'quizzes'
  | 'resources'
  | 'progress'
  | 'bookmarks'
  | 'settings'
  | 'admin';

interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem, trackId?: TrackId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  streakDays: number;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  streakDays,
  isAdmin,
  onToggleAdmin,
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'track-full-stack', label: 'Full-Stack Development', icon: Layers, trackId: 'full-stack' as TrackId, color: 'text-sky-400' },
    { id: 'track-ai-tools', label: 'AI Tools Mastery', icon: Sparkles, trackId: 'ai-tools' as TrackId, color: 'text-amber-400' },
    { id: 'track-ai-engineering', label: 'AI Engineering', icon: Cpu, trackId: 'ai-engineering' as TrackId, color: 'text-purple-400' },
    { id: 'ai-playground', label: 'AI Tools Playground', icon: Compass },
    { id: 'projects', label: 'Projects & Practical Labs', icon: Briefcase },
    { id: 'coding-playground', label: 'Coding Playground', icon: Terminal },
    { id: 'quizzes', label: 'Assessments & Quizzes', icon: Award },
    { id: 'resources', label: 'Learning Resources', icon: BookOpen },
    { id: 'progress', label: 'My Progress', icon: LineChart },
    { id: 'bookmarks', label: 'Bookmarks & Notes', icon: Bookmark },
    { id: 'settings', label: 'Profile & Settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 bottom-0 z-40 bg-dark-surface/95 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300 select-none shadow-2xl',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)]">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-white tracking-wider flex items-center gap-1.5">
                NEXUS<span className="text-sky-400 font-bold">LEARN</span>
              </span>
              <span className="text-[10px] text-text-secondary tracking-widest block font-mono">NEXT-GEN PLATFORM</span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mx-auto w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.4)]">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="text-text-secondary hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Role Switcher Pill */}
      <div className="px-4 py-3 border-b border-white/5">
        <button
          onClick={onToggleAdmin}
          className={cn(
            'w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all',
            isAdmin
              ? 'bg-purple-950/40 text-purple-300 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
              : 'bg-dark-card/60 text-text-secondary border-white/10 hover:text-white hover:border-white/20'
          )}
        >
          <Shield className="w-4 h-4 text-purple-400" />
          {!collapsed && (
            <span>Mode: <strong className={isAdmin ? 'text-purple-300' : 'text-sky-400'}>{isAdmin ? 'Admin Console' : 'Student Portal'}</strong></span>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {!collapsed && (
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-3 mb-2 font-mono">
            {isAdmin ? 'Management Console' : 'Core Learning Paths'}
          </div>
        )}

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavItem, item.trackId)}
              title={collapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative',
                isActive
                  ? 'bg-gradient-to-r from-sky-500/20 via-sky-500/10 to-transparent text-white border-l-4 border-sky-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]'
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0',
                  item.color || (isActive ? 'text-sky-400' : 'text-text-secondary')
                )}
              />
              {!collapsed && (
                <span className="truncate text-left">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38BDF8]" />
              )}
            </button>
          );
        })}

        {/* Admin Navigation Item */}
        <div className="pt-2 border-t border-white/10 mt-2">
          <button
            onClick={() => onSelectTab('admin')}
            title={collapsed ? 'Admin Dashboard' : undefined}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative',
              currentTab === 'admin'
                ? 'bg-purple-500/20 text-purple-300 border-l-4 border-purple-400'
                : 'text-text-secondary hover:text-purple-300 hover:bg-purple-500/10'
            )}
          >
            <Shield className="w-4 h-4 text-purple-400 flex-shrink-0" />
            {!collapsed && <span className="truncate text-left font-semibold">Admin Portal (NexusAdmin)</span>}
          </button>

          <button
            onClick={() => onSelectTab('admin')}
            title={collapsed ? 'Create & Manage Students' : undefined}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative mt-1',
              'text-purple-300 hover:text-white hover:bg-purple-500/20 bg-purple-500/10 border border-purple-500/20'
            )}
          >
            <UserPlus className="w-4 h-4 text-purple-400 flex-shrink-0" />
            {!collapsed && <span className="truncate text-left font-semibold">➕ Create Students</span>}
          </button>
        </div>
      </div>

      {/* Footer / Streak info */}
      <div className="p-4 border-t border-white/10 bg-dark-bg/40">
        {!collapsed ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-card/60 border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.3)]">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-400 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>{streakDays} Day Streak!</span>
              </div>
              <div className="text-[10px] text-text-muted">Keep momentum going</div>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 mx-auto rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-400" />
          </div>
        )}
      </div>
    </aside>
  );
};
