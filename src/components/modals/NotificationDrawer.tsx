import React, { useState } from 'react';
import { NotificationItem } from '../../types';
import { 
  X, Bell, CheckSquare, DollarSign, Camera, 
  Sparkles, AlertCircle 
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
      case 'task': return <CheckSquare className="w-3.5 h-3.5 text-[#1677FF]" />;
      case 'budget': return <DollarSign className="w-3.5 h-3.5 text-emerald-600" />;
      case 'ai': return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
      case 'punch': return <AlertCircle className="w-3.5 h-3.5 text-amber-600" />;
      case 'photo': return <Camera className="w-3.5 h-3.5 text-[#1677FF]" />;
      default: return <Bell className="w-3.5 h-3.5 text-[#68707C]" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = notifications.filter(n => filter === 'all' || !n.read);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[400px] bg-white border border-[#DDE1E7] rounded-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden text-[#171A1F]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3 border-b border-[#EAEDF1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EAF3FF] flex items-center justify-center text-[#1677FF]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171A1F] tracking-tight">Notifications</h3>
              <p className="text-xs text-[#68707C] font-medium">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-xs font-bold text-[#1677FF] hover:text-[#0958D9] transition-colors cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Segmented Control */}
        <div className="p-3 pb-2">
          <div className="flex items-center p-0.5 bg-[#F2F2F7] rounded-xl border border-[#DDE1E7]">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-[#171A1F] shadow-xs font-bold'
                  : 'text-[#68707C] hover:text-[#171A1F]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'unread'
                  ? 'bg-white text-[#171A1F] shadow-xs font-bold'
                  : 'text-[#68707C] hover:text-[#171A1F]'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notification List Items */}
        <div className="flex flex-col overflow-y-auto divide-y divide-[#EAEDF1] flex-1 px-3 pb-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#68707C] text-xs font-medium">
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
                  !notif.read ? 'bg-[#EAF3FF]/40 hover:bg-[#EAF3FF]' : 'hover:bg-[#F7F8FA]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#F2F2F7] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#DDE1E7]">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs truncate ${!notif.read ? 'text-[#171A1F] font-bold' : 'text-[#68707C] font-semibold'}`}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#1677FF] flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-[#68707C] leading-snug mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>

                  <span className="text-[10px] text-[#9DA5B1] mt-1 block font-medium">
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
