import React, { useState } from 'react';
import { Task, SitePhoto } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  CheckCircle2, Camera, MapPin, FileText, PlayCircle, Check, 
  MoreHorizontal, Sparkles, Clock, Calendar, ChevronRight, AlertCircle, HardHat, FileUp, CheckSquare 
} from 'lucide-react';

interface FieldDashboardProps {
  tasks: Task[];
  photos: SitePhoto[];
  onOpenTask: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: any) => void;
  onTriggerPhotoUpload: () => void;
  onViewDrawings: () => void;
}

export const FieldDashboard: React.FC<FieldDashboardProps> = ({
  tasks,
  onOpenTask,
  onUpdateTaskStatus,
  onTriggerPhotoUpload,
  onViewDrawings
}) => {
  // Field Today's Tasks matching Screen 7
  const fieldTasks = [
    {
      id: 'tsk-1',
      title: 'Concrete Pour - L12',
      project: 'Riverside Office Complex',
      status: 'In Progress',
      progress: 60,
    },
    {
      id: 'tsk-2',
      title: 'Rebar Installation',
      project: 'Downtown Tower',
      status: 'Not Started',
      progress: 0,
    },
    {
      id: 'tsk-3',
      title: 'Site Safety Inspection',
      project: 'Greenfield Dev.',
      status: 'Not Started',
      progress: 0,
    }
  ];

  // Schedule Timeline matching Screen 8
  const scheduleTimeline = [
    {
      time: '8:00 AM',
      title: 'Concrete Pour - L12',
      project: 'Riverside Office Complex',
      color: 'bg-blue-500'
    },
    {
      time: '1:00 PM',
      title: 'Rebar Installation',
      project: 'Downtown Tower',
      color: 'bg-emerald-400'
    },
    {
      time: '4:00 PM',
      title: 'Site Safety Inspection',
      project: 'Greenfield Dev.',
      color: 'bg-emerald-400'
    }
  ];

  // Recent Updates matching Screen 9
  const recentUpdates = [
    { type: 'plan', title: 'Plan updated (Rev 03)', time: '2h ago', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { type: 'task', title: 'New task assigned (L12 Pour)', time: '4h ago', icon: HardHat, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { type: 'punch', title: 'Punch item added (#104)', time: '6h ago', icon: AlertCircle, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
    { type: 'photo', title: 'Photo uploaded (Rebar check)', time: '8h ago', icon: Camera, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-24 font-sans text-slate-200">
      {/* 1. GREETING HEADER (Matching Screen 7) */}
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
          <span>Good morning, John!</span>
          <span className="text-xl">👋</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Let's get the work done.
        </p>
      </div>

      {/* 2. 4-COLUMN STAT GRID (Matching Screen 7) */}
      <div className="card-dark p-3.5 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm">
        <div className="grid grid-cols-4 divide-x divide-[#182438] text-center">
          <div className="px-1">
            <div className="text-[10px] text-slate-400 font-medium">Tasks</div>
            <div className="text-lg font-black text-white my-0.5">3</div>
            <div className="text-[10px] text-slate-500 font-medium">Today</div>
          </div>
          <div className="px-1">
            <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">In Progress</div>
            <div className="text-lg font-black text-blue-400 my-0.5">1</div>
            <div className="text-[10px] text-slate-500 font-medium">Task</div>
          </div>
          <div className="px-1">
            <div className="text-[10px] text-slate-400 font-medium">Done</div>
            <div className="text-lg font-black text-emerald-400 my-0.5">8</div>
            <div className="text-[10px] text-slate-500 font-medium">Tasks</div>
          </div>
          <div className="px-1">
            <div className="text-[10px] text-slate-400 font-medium">Projects</div>
            <div className="text-lg font-black text-white my-0.5">2</div>
            <div className="text-[10px] text-slate-500 font-medium">Total</div>
          </div>
        </div>
      </div>

      {/* 3. TODAY'S TASKS (Matching Screen 7) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-extrabold text-white tracking-tight">
            Today's Tasks
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

      {/* 4. MY SCHEDULE TIMELINE (Matching Screen 8) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-tight">My Schedule</h2>
            <span className="text-[10px] text-slate-400 font-medium">May 21, 2025</span>
          </div>
          <button 
            onClick={onViewDrawings}
            className="text-xs font-bold text-blue-400 hover:text-blue-300"
          >
            View full schedule
          </button>
        </div>

        <div className="card-dark p-4 bg-[#0C121F] border-[#182438] rounded-2xl space-y-4 relative">
          {/* Vertical timeline line */}
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

      {/* 5. RECENT UPDATES STREAM (Matching Screen 9) */}
      <div>
        <h2 className="text-sm font-extrabold text-white tracking-tight mb-2">
          Recent Updates
        </h2>

        <div className="space-y-2">
          {recentUpdates.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="card-dark p-3 rounded-2xl bg-[#0C121F] border-[#182438] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className={`w-7 h-7 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-white truncate">{item.title}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium flex-shrink-0">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. LATTI AI ASSISTANT CARD (Matching Screen 8) */}
      <div className="card-dark p-4 bg-[#0A101D] border border-blue-500/40 rounded-2xl shadow-[0_0_20px_rgba(0,102,255,0.12)] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-extrabold text-blue-400">Latti AI Assistant</span>
        </div>

        <p className="text-xs text-slate-200 font-medium">
          You have <strong>1 high priority task</strong> today: Pre-pour inspection on Level 12.
        </p>

        <button
          onClick={onTriggerPhotoUpload}
          className="w-full h-9 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
        >
          Ask Latti / Snap Photo
        </button>
      </div>
    </div>
  );
};
