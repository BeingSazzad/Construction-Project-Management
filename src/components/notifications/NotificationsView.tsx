import React, { useState } from 'react';
import { NotificationItem } from '../../types';
import { 
  ArrowLeft, CheckCheck, ChevronRight 
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

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Clean Single Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#162033]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-[#0D1424] hover:bg-[#141F33] border border-[#1A263E] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Back"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <h1 className="text-base font-bold text-white tracking-tight">
            Notifications
          </h1>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-bold text-[#3875F6] hover:underline flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark read</span>
          </button>
        )}
      </div>

      {/* Box-Free Seamless Filter Underline Tabs */}
      <div className="flex items-center gap-6 border-b border-[#141F33] px-1 pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`text-xs font-bold transition-all cursor-pointer pb-2 relative ${
            filter === 'all'
              ? 'text-white'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <span>All ({notifications.length})</span>
          {filter === 'all' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`text-xs font-bold transition-all cursor-pointer pb-2 relative ${
            filter === 'unread'
              ? 'text-white'
              : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <span>Unread ({unreadCount})</span>
          {filter === 'unread' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
          )}
        </button>
      </div>

      {/* Completely Borderless Minimal Notification Flow */}
      <div className="flex flex-col">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-xs text-slate-400 font-medium">
            No notifications in this filter.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => onSelectNotification(n)}
              className="py-3.5 border-b border-[#141F33] hover:bg-[#0D1424]/60 transition-colors cursor-pointer flex items-start justify-between gap-3 text-left group px-1 active:opacity-80"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#3875F6] transition-colors leading-tight flex items-center gap-2">
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />
                    )}
                    <span className="truncate">{n.title}</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium flex-shrink-0">{n.timeAgo}</span>
                </div>

                <p className="text-xs text-slate-300 mt-1 leading-relaxed font-normal">
                  {n.message}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 flex-shrink-0 mt-0.5" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
