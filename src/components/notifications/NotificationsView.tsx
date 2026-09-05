import React, { useState } from 'react';
import { NotificationItem } from '../../types';
import { ChevronLeft } from 'lucide-react';

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
    <div className="w-full min-h-screen bg-white flex flex-col font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#111827] animate-fade-in pb-28">
      
      {/* ─── 1. TOP HEADER (Back Left, Centered Title, Mark Read Right) ─── */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-[#F2F4F7] bg-white sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-9 h-9 -ml-2 rounded-full flex items-center justify-center text-[#111827] hover:bg-[#F3F4F6] active:scale-95 transition-all cursor-pointer"
          title="Back"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 text-[#111827]" />
        </button>

        <h1 className="text-base font-bold text-[#111827] tracking-tight">
          Notifications
        </h1>

        <button
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className={`text-sm font-semibold transition-all cursor-pointer ${
            unreadCount > 0
              ? 'text-[#1677FF] hover:underline active:scale-95'
              : 'text-[#9CA3AF] opacity-50 cursor-default'
          }`}
        >
          Mark Read
        </button>
      </div>

      {/* ─── 2. TABS: ALL / UNREAD (Matching Kid Transport Reference) ─── */}
      <div className="flex items-center gap-6 px-5 border-b border-[#F2F4F7] bg-white">
        <button
          onClick={() => setFilter('all')}
          className={`relative pb-3 pt-3.5 flex items-center gap-1.5 text-[14px] transition-colors cursor-pointer ${
            filter === 'all'
              ? 'font-bold text-[#111827]'
              : 'font-medium text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          <span>All</span>
          <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[12px] font-semibold">
            {notifications.length}
          </span>
          {filter === 'all' && (
            <span className="absolute -bottom-[1px] left-0 right-0 h-[2.5px] bg-[#111827] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`relative pb-3 pt-3.5 flex items-center gap-1.5 text-[14px] transition-colors cursor-pointer ${
            filter === 'unread'
              ? 'font-bold text-[#111827]'
              : 'font-medium text-[#6B7280] hover:text-[#111827]'
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#EF4444] text-[12px] font-bold">
              {unreadCount}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#9CA3AF] text-[12px] font-semibold">
              0
            </span>
          )}
          {filter === 'unread' && (
            <span className="absolute -bottom-[1px] left-0 right-0 h-[2.5px] bg-[#111827] rounded-full" />
          )}
        </button>
      </div>

      {/* ─── 3. NOTIFICATIONS LIST (Clean Flat 1px Hairline Dividers, Standard Spacing) ─── */}
      <div className="flex flex-col bg-white">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-xs text-[#6B7280] font-medium">
            No {filter === 'unread' ? 'unread ' : ''}notifications.
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => onSelectNotification(n)}
              className="px-5 py-4 border-b border-[#F2F4F7] last:border-b-0 cursor-pointer hover:bg-[#F9FAFB] active:bg-[#F3F4F6] transition-colors flex items-start"
            >
              {/* Dot indicator: Concentric blue ring for unread, empty placeholder for read */}
              <div className="w-4 h-4 mr-3 mt-0.5 shrink-0 flex items-center justify-center">
                {!n.read ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1677FF] ring-4 ring-[#1677FF]/15" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-transparent" />
                )}
              </div>

              {/* Title, Timestamp & Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className={`text-[14.5px] leading-snug truncate ${
                    !n.read ? 'font-bold text-[#111827]' : 'font-semibold text-[#374151]'
                  }`}>
                    {n.title}
                  </h3>
                  <span className="text-[12px] text-[#9CA3AF] font-normal shrink-0 whitespace-nowrap">
                    {n.timeAgo}
                  </span>
                </div>

                <p className={`text-sm leading-relaxed mt-1 font-normal line-clamp-2 ${
                  !n.read ? 'text-[#4B5563]' : 'text-[#6B7280]'
                }`}>
                  {n.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

