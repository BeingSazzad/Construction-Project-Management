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

  // Semantic category tag generator
  const getCategoryBadge = (type: string) => {
    switch (type) {
      case 'ai':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            AI Risk Alert
          </span>
        );
      case 'budget':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            Budget
          </span>
        );
      case 'punch':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
            Punch QC
          </span>
        );
      case 'photo':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Site Photo
          </span>
        );
      case 'task':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
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
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
      
      {/* ─── 1. TOP HEADER ─── */}
      <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-colors"
            title="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#171A1F] tracking-tight">Notifications</h1>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-bold text-[#1677FF] hover:text-[#0958D9] flex items-center gap-1 cursor-pointer transition-colors"
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
              ? 'bg-[#1677FF] border-[#1677FF] text-white font-bold shadow-xs'
              : 'bg-white border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F]'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
            filter === 'unread'
              ? 'bg-[#1677FF] border-[#1677FF] text-white font-bold shadow-xs'
              : 'bg-white border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F]'
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              filter === 'unread' ? 'bg-white text-[#1677FF]' : 'bg-[#EAF3FF] text-[#1677FF]'
            }`}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* ─── 3. NOTIFICATION CARDS LIST ─── */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-xs text-[#68707C] font-medium">
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
                    ? 'bg-white border-[#1677FF]/40 hover:border-[#1677FF] shadow-xs'
                    : 'bg-white border-[#DDE1E7] hover:border-[#9DA5B1]'
                }`}
              >
                {/* Top Metadata Strip */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(n.type)}
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
                    )}
                  </div>
                  <span className="text-[10px] text-[#68707C] font-semibold">{n.timeAgo}</span>
                </div>

                {/* Main Content */}
                <div>
                  <h3 className={`text-xs font-bold leading-snug text-[#171A1F]`}>
                    {n.title}
                  </h3>
                  <p className="text-[12px] text-[#68707C] mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {/* Footer Subtext */}
                <div className="flex items-center justify-between pt-1.5 border-t border-[#EAEDF1] text-[10px] text-[#68707C] font-medium">
                  <span className="truncate">{getProjectName(n.projectId)}</span>
                  <span className="text-[#1677FF] font-semibold flex items-center gap-1 hover:underline">
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
