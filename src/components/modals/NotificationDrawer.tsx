import React, { useState } from 'react';
import { NotificationItem } from '../../types';
import { 
  X, Bell, CheckSquare, DollarSign, Camera, 
  Sparkles, AlertCircle, Check, CheckCheck 
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
      case 'task': return <CheckSquare className="w-4 h-4 text-cyan-400" />;
      case 'budget': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'ai': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'punch': return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'photo': return <Camera className="w-4 h-4 text-blue-400" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const filtered = notifications.filter(n => filter === 'all' || !n.read);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-dark w-full max-w-[390px] bg-[#0E1524] border-cyan-500/40 p-5 rounded-3xl max-h-[90vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2A44] mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Notifications</h3>
              <p className="text-[10px] text-slate-400">{notifications.filter(n => !n.read).length} unread alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#162033] text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#101726] rounded-xl border border-[#1C2A44] mb-3">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'unread' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            Unread
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                onSelectNotification(notif);
                onClose();
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                !notif.read 
                  ? 'bg-[#142036] border-cyan-500/30 hover:border-cyan-400/60' 
                  : 'bg-[#111827] border-[#1F2E47] hover:border-[#2F4468]'
              }`}
            >
              <div className="p-2 rounded-xl bg-[#162238] border border-[#23334F] flex-shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className={`text-xs font-bold truncate ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                    {notif.title}
                  </h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 leading-snug mb-1">
                  {notif.message}
                </p>

                <span className="text-[9px] text-slate-500 font-medium">{notif.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
