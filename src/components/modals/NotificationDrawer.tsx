import React, { useState } from 'react';
import { NotificationItem } from '../../types';
import { 
  X, Bell, CheckSquare, DollarSign, Camera, 
  Sparkles, AlertCircle, CheckCheck 
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onSelectNotification: (notif: NotificationItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllRead,
  onSelectNotification
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'task': return <CheckSquare className="w-3.5 h-3.5 text-blue-400" />;
      case 'budget': return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ai': return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case 'punch': return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'photo': return <Camera className="w-3.5 h-3.5 text-blue-400" />;
      default: return <Bell className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = notifications.filter(n => filter === 'all' || !n.read);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[400px] bg-[#0C121E] border border-[#1A263B] rounded-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3 border-b border-[#162033]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#141F33] flex items-center justify-center text-slate-300">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Notifications</h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#141F33] hover:bg-[#1C2C47] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Segmented Control */}
        <div className="p-3 pb-2">
          <div className="flex items-center p-0.5 bg-[#080D18] rounded-xl border border-[#162033]">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#141F33] text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'unread'
                  ? 'bg-[#141F33] text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notification List Items (Clean row list, no garish cyan borders) */}
        <div className="flex flex-col overflow-y-auto divide-y divide-[#141E30] flex-1 px-3 pb-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-medium">
              No notifications in this view
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onSelectNotification(notif);
                  onClose();
                }}
                className={`py-3 px-2 rounded-xl transition-colors cursor-pointer flex items-start gap-3 ${
                  !notif.read ? 'bg-[#0E1729]/60 hover:bg-[#121E36]' : 'hover:bg-[#0E1524]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#141F33] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#1C2C47]">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-semibold truncate ${!notif.read ? 'text-white font-bold' : 'text-slate-300'}`}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>

                  <span className="text-[10px] text-slate-500 mt-1 block font-medium">
                    {notif.timeAgo}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
