import React from 'react';
import { Task, SitePhoto } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Sun, Users, ShieldCheck, Camera, FileText, 
  ChevronRight, AlertCircle, MapPin, CheckSquare, Plus
} from 'lucide-react';

interface FieldDashboardProps {
  tasks: Task[];
  photos: SitePhoto[];
  onOpenTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: any) => void;
  onTriggerPhotoUpload: () => void;
  onViewDrawings: () => void;
  onOpenDailyLogs?: () => void;
}

export const FieldDashboard: React.FC<FieldDashboardProps> = ({
  tasks,
  onOpenTask,
  onUpdateTaskStatus,
  onTriggerPhotoUpload,
  onViewDrawings,
  onOpenDailyLogs
}) => {
  const fieldTasks = [
    {
      id: 'tsk-1',
      title: 'Concrete Pour - L12 Deck',
      project: 'Riverside Office Complex',
      status: 'In Progress',
      progress: 60,
    },
    {
      id: 'tsk-2',
      title: 'Rebar Inspection Sign-off',
      project: 'Downtown Commercial Tower',
      status: 'Not Started',
      progress: 0,
    },
    {
      id: 'tsk-3',
      title: 'Level 8 Conduit Installation',
      project: 'Riverside Office Complex',
      status: 'In Progress',
      progress: 40,
    }
  ];

  const scheduleTimeline = [
    {
      time: '8:00 AM',
      title: 'Concrete Pour - L12 Deck',
      project: 'Riverside Office Complex',
    },
    {
      time: '11:30 AM',
      title: 'City Inspector Cylinder Test Pull',
      project: 'Riverside Office Complex',
    },
    {
      time: '1:00 PM',
      title: 'Rebar Installation Verification',
      project: 'Downtown Commercial Tower',
    },
    {
      time: '4:00 PM',
      title: 'Daily Site Log & Photo Closeout',
      project: 'Riverside Office Complex',
    }
  ];

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* 1. Greeting */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>Good morning, John!</span>
            <span className="text-base">👷</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Lead Field Superintendent • Riverside Complex
          </p>
        </div>

        <button
          onClick={onTriggerPhotoUpload}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex-shrink-0"
        >
          <Camera className="w-4 h-4" />
          <span>Quick Photo</span>
        </button>
      </div>

      {/* 2. Field Weather & Site Conditions */}
      <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">74°F Sunny</span>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                Good to Pour
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Wind 6 mph WSW • Dry Ground</p>
          </div>
        </div>

        <button
          onClick={onOpenDailyLogs}
          className="text-xs font-bold text-[#3875F6] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Logs</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. On-Site Workforce */}
      <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">24 Workers On-Site</span>
            <span className="text-xs text-slate-400 block mt-0.5">4 Active Subcontractor Trades</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Safe</span>
        </div>
      </div>

      {/* 4. Active Field Tasks */}
      <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">Today's Site Tasks</h2>
          <button onClick={onViewDrawings} className="text-xs font-semibold text-[#3875F6] hover:underline flex items-center gap-1 cursor-pointer">
            <FileText className="w-3.5 h-3.5" />
            <span>Drawings</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {fieldTasks.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-2xl bg-[#090E1A] border border-[#141F33] hover:border-blue-500/40 transition-all flex items-center justify-between gap-3 shadow-sm cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#3875F6] transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                    {t.project}
                  </p>
                </div>
              </div>

              <StatusBadge status={t.status} size="xs" />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Today's Timeline */}
      <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
        <h2 className="text-sm font-bold text-white tracking-tight">Today's Inspection Timeline</h2>
        <div className="flex flex-col gap-2.5">
          {scheduleTimeline.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-[#090E1A] border border-[#141F33]">
              <span className="text-xs font-bold text-blue-400 w-16 flex-shrink-0">{item.time}</span>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-white block truncate">{item.title}</span>
                <span className="text-xs text-slate-400 block truncate mt-0.5">{item.project}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
