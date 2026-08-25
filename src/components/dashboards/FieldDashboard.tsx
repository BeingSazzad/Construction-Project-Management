import React, { useState } from 'react';
import { Task, SitePhoto } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  CheckCircle2, Camera, MapPin, FileText, PlayCircle, Check, 
  MoreHorizontal, Sparkles, Clock, Calendar, ChevronRight, AlertCircle, 
  HardHat, FileUp, CheckSquare, Sun, Users, Wind, ShieldCheck, Plus 
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
  // Field Today's Tasks
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
      title: 'Site Safety Walkthrough & PPE Audit',
      project: 'Riverside Office Complex',
      status: 'In Progress',
      progress: 80,
    }
  ];

  // Schedule Timeline
  const scheduleTimeline = [
    {
      time: '8:00 AM',
      title: 'Concrete Pour - L12 Deck',
      project: 'Riverside Office Complex',
      color: 'bg-blue-500'
    },
    {
      time: '11:30 AM',
      title: 'City Inspector Cylinder Test Pull',
      project: 'Riverside Office Complex',
      color: 'bg-amber-400'
    },
    {
      time: '1:00 PM',
      title: 'Rebar Installation Verification',
      project: 'Downtown Commercial Tower',
      color: 'bg-emerald-400'
    },
    {
      time: '4:00 PM',
      title: 'Daily Site Log & Photo Closeout',
      project: 'Riverside Office Complex',
      color: 'bg-cyan-400'
    }
  ];

  // Recent Updates
  const recentUpdates = [
    { type: 'plan', title: 'Plan updated (Level 8 Rev 04)', time: '1h ago', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { type: 'task', title: 'New punch item assigned (#104)', time: '3h ago', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { type: 'photo', title: 'Photo uploaded (Rebar clearance)', time: '4h ago', icon: Camera, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-24 font-sans text-slate-200">
      {/* 1. GREETING HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
            <span>Good morning, John!</span>
            <span className="text-xl">👷</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Lead Field Superintendent • Riverside Complex
          </p>
        </div>

        <button
          onClick={onTriggerPhotoUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex-shrink-0"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Quick Photo</span>
        </button>
      </div>

      {/* 2. LIVE FIELD WEATHER & SITE CONDITIONS */}
      <div className="card-dark p-3.5 bg-[#0D1422] border-[#182438] rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">74°F Sunny</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">
                Dry Ground
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Wind: 6 mph WSW • 0% Rain Risk</div>
          </div>
        </div>

        <div className="text-right border-l border-[#182438] pl-3 flex-shrink-0">
          <div className="text-xs font-black text-blue-400 flex items-center justify-end gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>24 On Site</span>
          </div>
          <div className="text-[10px] text-slate-400">4 Active Trades</div>
        </div>
      </div>

      {/* 3. 4-COLUMN STAT GRID */}
      <div className="card-dark p-3.5 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm">
        <div className="grid grid-cols-4 divide-x divide-[#182438] text-center">
          <div className="px-1">
            <div className="text-[10px] text-slate-400 font-medium">Tasks</div>
            <div className="text-lg font-black text-white my-0.5">3</div>
            <div className="text-[10px] text-slate-500 font-medium">Today</div>
          </div>
          <div className="px-1">
            <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">In Progress</div>
            <div className="text-lg font-black text-blue-400 my-0.5">2</div>
            <div className="text-[10px] text-slate-500 font-medium">Active</div>
          </div>
          <div className="px-1">
            <div className="text-[10px] text-slate-400 font-medium">Resolved</div>
            <div className="text-lg font-black text-emerald-400 my-0.5">8</div>
            <div className="text-[10px] text-slate-500 font-medium">Punch</div>
          </div>
          <div className="px-1">
            <div className="text-[10px] text-slate-400 font-medium">Safety</div>
            <div className="text-lg font-black text-emerald-400 my-0.5">100%</div>
            <div className="text-[10px] text-slate-500 font-medium">Pass</div>
          </div>
        </div>
      </div>

      {/* 4. QUICK FIELD ACTIONS BAR */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onViewDrawings}
          className="p-3 rounded-xl bg-[#0D1422] border border-blue-500/30 hover:border-blue-500/60 transition-all text-left flex items-center gap-2.5 cursor-pointer shadow-sm group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">PlanGrid Markup</div>
            <div className="text-[10px] text-slate-400">View blueprints & pins</div>
          </div>
        </button>

        <button
          onClick={onOpenDailyLogs || onViewDrawings}
          className="p-3 rounded-xl bg-[#0D1422] border border-emerald-500/30 hover:border-emerald-500/60 transition-all text-left flex items-center gap-2.5 cursor-pointer shadow-sm group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Daily Site Logs</div>
            <div className="text-[10px] text-slate-400">Log progress & crews</div>
          </div>
        </button>
      </div>

      {/* 5. TODAY'S TASKS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-extrabold text-white tracking-tight">
            Today's Priority Field Tasks
          </h2>
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </div>

        <div className="flex flex-col gap-2.5">
          {fieldTasks.map((t) => (
            <div
              key={t.id}
              className="card-dark p-3.5 rounded-2xl bg-[#0C121F] border-[#182438] hover:border-blue-500/50 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-[#151F33] text-blue-400 border border-[#223352] flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{t.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{t.project}</p>
                  <span className={`text-[10px] font-bold mt-1 inline-block ${
                    t.status === 'In Progress' ? 'text-blue-400' : 'text-slate-500'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="w-10 h-10 rounded-full border-2 border-[#182438] flex items-center justify-center relative flex-shrink-0">
                <span className="text-[11px] font-bold text-cyan-400">{t.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. MY SCHEDULE TIMELINE */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-tight">Site Schedule & Inspections</h2>
            <span className="text-[10px] text-slate-400 font-medium">May 21, 2025</span>
          </div>
          <button 
            onClick={onViewDrawings}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            View timeline
          </button>
        </div>

        <div className="card-dark p-4 bg-[#0C121F] border-[#182438] rounded-2xl space-y-4 relative">
          <div className="absolute top-6 bottom-6 left-6 w-0.5 bg-[#182438]" />

          {scheduleTimeline.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 relative z-10">
              <span className={`w-3 h-3 rounded-full mt-1 border-2 border-[#0C121F] ${item.color} flex-shrink-0`} />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold text-slate-400">{item.time}</div>
                <h4 className="text-xs font-bold text-white mt-0.5">{item.title}</h4>
                <p className="text-[11px] text-slate-400">{item.project}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. LATTI AI ASSISTANT CARD */}
      <div className="card-dark p-4 bg-[#0A101D] border border-blue-500/40 rounded-2xl shadow-[0_0_20px_rgba(0,102,255,0.12)] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-extrabold text-blue-400">Latti Field Copilot</span>
        </div>

        <p className="text-xs text-slate-200 font-medium">
          City inspector Dave arriving at <strong>11:30 AM</strong> for Level 12 deck pour. Have cylinder molds prepped at Gate 2.
        </p>

        <button
          onClick={onTriggerPhotoUpload}
          className="w-full h-9 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
        >
          Ask Latti / Upload Verification Photo
        </button>
      </div>
    </div>
  );
};
