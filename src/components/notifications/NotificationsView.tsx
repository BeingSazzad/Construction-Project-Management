import React, { useState } from 'react';
import { NotificationItem } from '../../types';
import { 
  ChevronLeft, CheckCheck, Sparkles, AlertTriangle, 
  CheckCircle2, DollarSign, Camera, CheckSquare, ArrowRight
} from 'lucide-react';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onBack: () => void;
  onMarkAllRead: () => void;
  onSelectNotification: (notif: NotificationItem) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onBack,
  onMarkAllRead,
  onSelectNotification
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = notifications.filter(n => filter === 'all' || !n.read);

  // Semantic category tag generator (no loud icons, just clean micro-chips)
  const getCategoryBadge = (type: string) => {
    switch (type) {
      case 'ai':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/25">
            AI Risk Alert
          </span>
        );
      case 'budget':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/25">
            Budget
          </span>
        );
      case 'punch':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/25">
            Punch QC
          </span>
        );
      case 'photo':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-300 border border-slate-600/30">
            Site Photo
          </span>
        );
      case 'task':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
            Inspection
          </span>
        );
    }
  };

  const getProjectName = (projectId?: string) => {
    if (projectId === 'proj-2') return 'Downtown Commercial Tower';
    return 'Riverside Office Complex';
  };

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. TOP HEADER ─── */}
      <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#0E1726] border border-[#1A263B] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            title="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">Notifications</h1>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* ─── 2. CLEAN FILTER PILLS ─── */}
      <div className="flex items-center gap-2 py-0.5">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
            filter === 'all'
              ? 'bg-[#2563EB] border-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
              : 'bg-[#0A111F] border-[#142036] text-slate-400 hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
            filter === 'unread'
              ? 'bg-[#2563EB] border-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
              : 'bg-[#0A111F] border-[#142036] text-slate-400 hover:text-white'
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              filter === 'unread' ? 'bg-white text-blue-600' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* ─── 3. NOTIFICATION CARDS LIST ─── */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-xs text-slate-500 font-medium">
            No notifications in this filter.
          </div>
        ) : (
          filtered.map((n) => {
            const isUnread = !n.read;
            return (
              <div
                key={n.id}
                onClick={() => onSelectNotification(n)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 text-left active:scale-[0.99] ${
                  isUnread
                    ? 'bg-[#0A1224] border-blue-500/30 hover:border-blue-500/60 shadow-sm'
                    : 'bg-[#070D1A] border-[#142036] hover:border-[#1E3050] opacity-90'
                }`}
              >
                {/* Top Metadata Strip: Category chip + Timestamp + Unread Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(n.type)}
                    {isUnread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.9)]" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{n.timeAgo}</span>
                </div>

                {/* Main Content (Full un-truncated title & message) */}
                <div>
                  <h3 className={`text-xs font-bold leading-snug ${isUnread ? 'text-white' : 'text-slate-200'}`}>
                    {n.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {/* Footer Subtext: Project Association */}
                <div className="flex items-center justify-between pt-1.5 border-t border-[#142036]/60 text-[10px] text-slate-500 font-medium">
                  <span className="truncate">{getProjectName(n.projectId)}</span>
                  <span className="text-blue-400 font-semibold flex items-center gap-1 hover:underline">
                    View
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
