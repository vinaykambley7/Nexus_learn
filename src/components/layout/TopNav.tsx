import React, { useState } from 'react';
import {
  Search,
  Bell,
  Flame,
  User,
  Wifi,
  WifiOff,
  X,
  Database,
  LogIn,
  LogOut,
  LineChart,
  Bookmark,
  Settings,
  Shield,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { NavItem } from './Sidebar';

interface TopNavProps {
  collapsed: boolean;
  streakDays: number;
  isAdmin: boolean;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onNavigateTab?: (tab: NavItem) => void;
  title: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  collapsed,
  streakDays,
  isAdmin,
  onOpenSearch,
  onOpenProfile,
  onOpenAuth,
  onNavigateTab,
  title,
}) => {
  const { user, logout, switchRole, supabaseStatus } = useAuth();
  const [isOnline] = useState<boolean>(navigator.onLine);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-20 bg-dark-bg/85 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 transition-all duration-300 ${
        collapsed ? 'left-20' : 'left-72'
      }`}
    >
      {/* Page Title & Status */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-white tracking-wide font-heading truncate max-w-md">
          {title}
        </h1>
        {isOnline ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <Wifi className="w-3.5 h-3.5" />
            <span>Synced & Live</span>
          </span>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode (Cached)</span>
          </span>
        )}

        {/* Supabase Status Pill */}
        <span
          className={`hidden md:inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full border font-mono ${
            supabaseStatus.configured
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
          }`}
          title={
            supabaseStatus.configured
              ? 'Connected to Live Supabase PostgreSQL'
              : 'Running in Local Resilient Mode'
          }
        >
          <Database className="w-3 h-3" />
          <span>{supabaseStatus.configured ? 'Supabase Live' : 'Local DB'}</span>
        </span>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-3">
        {/* Search trigger button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-4 py-2 rounded-xl bg-dark-surface/80 hover:bg-dark-hover border border-white/10 hover:border-white/20 text-text-secondary text-sm transition-all shadow-sm w-44 md:w-60"
        >
          <Search className="w-4 h-4 text-sky-400" />
          <span className="truncate">Search ecosystem...</span>
          <kbd className="hidden md:inline-block ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">
            Ctrl+K
          </kbd>
        </button>

        {/* Streak Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/15 to-amber-500/15 border border-orange-500/30 text-amber-300 text-sm font-semibold shadow-[0_0_15px_rgba(249,115,22,0.15)]">
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
          <span>{streakDays} Days</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-dark-surface hover:bg-dark-hover border border-white/10 hover:border-white/20 text-text-secondary hover:text-white transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38BDF8]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl shadow-2xl p-4 border border-white/15 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-sm font-semibold text-white font-heading">Notifications</span>
                <button onClick={() => setShowNotifications(false)}>
                  <X className="w-4 h-4 text-text-muted hover:text-white" />
                </button>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="font-semibold text-white">New Curriculum Module</div>
                  <div className="text-text-muted mt-0.5">Level 5 pgvector RAG pipeline is now active.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="font-semibold text-emerald-400">Capstone Reviewed</div>
                  <div className="text-text-muted mt-0.5">NexusAdmin: Platform initialized and ready for students.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Interactive Dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 pl-2 border-l border-white/10 cursor-pointer group hover:opacity-90 transition-opacity"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-9 h-9 rounded-xl object-cover border border-white/10 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1">
                  <span>{user.fullName}</span>
                  <ChevronDown className="w-3 h-3 text-text-muted" />
                </div>
                <div className="text-[10px] text-purple-400 font-medium">
                  {user.role === 'admin' ? 'NexusAdmin' : 'Student Learner'}
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-64 glass-panel rounded-2xl shadow-2xl p-2 border border-white/15 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="px-3 py-2 border-b border-white/10">
                  <div className="text-xs font-bold text-white">{user.fullName}</div>
                  <div className="text-[11px] text-text-muted font-mono truncate">{user.email}</div>
                  <Badge variant="purple" className="mt-1">
                    {user.role === 'admin' ? 'NexusAdmin' : 'Student Learner'}
                  </Badge>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onNavigateTab) onNavigateTab('admin');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 text-left transition-colors"
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Admin Management Portal</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onNavigateTab) onNavigateTab('progress');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-secondary hover:text-white hover:bg-white/10 text-left transition-colors"
                >
                  <LineChart className="w-4 h-4 text-sky-400" />
                  <span>Cohort Progress Matrix</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onNavigateTab) onNavigateTab('bookmarks');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-secondary hover:text-white hover:bg-white/10 text-left transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Bookmarks & Study Notes</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onNavigateTab) onNavigateTab('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-text-secondary hover:text-white hover:bg-white/10 text-left transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Platform & Security Settings</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    onOpenAuth();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left transition-colors border-t border-white/5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
