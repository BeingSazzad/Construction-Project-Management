import React from 'react';
import { Task, SitePhoto } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Sun, Users, ShieldCheck, Camera, FileText, 
  ChevronRight, AlertCircle, MapPin, CheckSquare, Plus,
  Video, Truck, Package, Radio, Sparkles, Clock, HardHat
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
  photos,
  onOpenTask,
  onUpdateTaskStatus,
  onTriggerPhotoUpload,
  onViewDrawings
}) => {
  const fieldTasks = [
    {
      id: 'tsk-1',
      title: 'Concrete Pour - L12 Deck',
      project: 'Riverside Office Complex',
      status: 'In Progress',
      progress: 60,
      zone: 'Grid B-4',
    },
    {
      id: 'tsk-2',
      title: 'Rebar Inspection Sign-off',
      project: 'Downtown Commercial Tower',
      status: 'Not Started',
      progress: 0,
      zone: 'Level 14 Core',
    },
    {
      id: 'tsk-3',
      title: 'Level 8 Conduit Installation',
      project: 'Riverside Office Complex',
      status: 'In Progress',
      progress: 40,
      zone: 'North Riser',
    }
  ];

  const scheduleTimeline = [
    { time: '08:00 AM', title: 'Concrete Pour - L12 Deck', project: 'Riverside Office Complex', type: 'Active' },
    { time: '11:30 AM', title: 'City Inspector Cylinder Test Pull', project: 'Riverside Office Complex', type: 'Inspection' },
    { time: '01:00 PM', title: 'Rebar Installation Verification', project: 'Downtown Commercial Tower', type: 'Upcoming' },
    { time: '04:00 PM', title: 'Daily Site Log & Photo Closeout', project: 'Riverside Office Complex', type: 'Log' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 px-4 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ── 1. Top Executive Field Command Card ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-xl shadow-blue-950/20 flex flex-col gap-3.5 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-none">
              Field Superintendent Command
            </h2>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Riverside Complex & Active Job Sites</p>
          </div>
          <button
            onClick={onTriggerPhotoUpload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer active:scale-95 flex-shrink-0"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photo</span>
          </button>
        </div>

        {/* 4 Field KPI Tiles */}
        <div className="grid grid-cols-4 gap-2">
          {/* Tile 1: Active Workers */}
          <div className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] flex flex-col items-center justify-center text-center shadow-inner">
            <div className="w-9 h-9 rounded-xl bg-[#0D223A] border border-[#173A60] text-[#38BDF8] flex items-center justify-center mb-2 flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white leading-none tracking-tight">
              24
            </span>
            <span className="text-[11px] font-medium text-slate-400 mt-1.5 leading-tight truncate w-full">
              Workers
            </span>
          </div>

          {/* Tile 2: Field Tasks */}
          <div className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] flex flex-col items-center justify-center text-center shadow-inner">
            <div className="w-9 h-9 rounded-xl bg-[#231438] border border-[#3D2062] text-[#A855F7] flex items-center justify-center mb-2 flex-shrink-0">
              <HardHat className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white leading-none tracking-tight">
              6
            </span>
            <span className="text-[11px] font-medium text-slate-400 mt-1.5 leading-tight truncate w-full">
              Field Tasks
            </span>
          </div>

          {/* Tile 3: Safety Passed */}
          <div className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] flex flex-col items-center justify-center text-center shadow-inner">
            <div className="w-9 h-9 rounded-xl bg-[#0D281E] border border-[#154633] text-[#10B981] flex items-center justify-center mb-2 flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-emerald-400 leading-none tracking-tight">
              100%
            </span>
            <span className="text-[11px] font-medium text-slate-400 mt-1.5 leading-tight truncate w-full">
              Safety
            </span>
          </div>

          {/* Tile 4: Weather & Site Condition */}
          <div className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] flex flex-col items-center justify-center text-center shadow-inner">
            <div className="w-9 h-9 rounded-xl bg-[#2A1D0E] border border-[#483015] text-[#F59E0B] flex items-center justify-center mb-2 flex-shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-amber-400 leading-none tracking-tight">
              74°F
            </span>
            <span className="text-[11px] font-medium text-slate-400 mt-1.5 leading-tight truncate w-full">
              Clear · Dry
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Live Site Camera Stream ── */}
      <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white">Live Site Camera Stream</span>
          </div>
          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>CAM 1 · LIVE</span>
          </span>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#050A14] border border-[#131D31] group shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"
            alt="Live Site Stream"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-3 flex flex-col justify-between">
            <div className="text-xs font-bold text-white drop-shadow">Riverside West Wing Pour</div>
            <div className="flex items-center justify-between text-[11px] text-slate-200">
              <span>24 Workers Active</span>
              <span className="text-emerald-400 font-bold">100% Inspection Passed</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Quick Field Actions ── */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-bold text-white px-0.5 tracking-tight">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Upload Photo', icon: Camera, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', action: onTriggerPhotoUpload },
            { label: 'Daily Log', icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', action: onViewDrawings },
            { label: 'Blueprints', icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', action: onViewDrawings },
            { label: 'Deliveries', icon: Truck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', action: onViewDrawings },
          ].map(({ label, icon: Icon, color, bg, action }) => (
            <button
              key={label}
              onClick={action}
              className="p-2.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 hover:bg-[#0C152B] group"
            >
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${color} ${bg} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-semibold text-slate-300 group-hover:text-white transition-colors text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. Active Field Tasks ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-sm font-bold text-white tracking-tight">Active Field Tasks</h2>
          <span className="text-xs font-semibold text-blue-400">3 In Progress</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {fieldTasks.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all shadow-sm flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white truncate">{t.title}</h4>
                  <StatusBadge status={t.status} size="xs" />
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-1">
                  {t.project} · <strong className="text-blue-400 font-semibold">{t.zone}</strong>
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-[#141F33] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2563EB]"
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 flex-shrink-0">{t.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Site Schedule Timeline ── */}
      <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white tracking-tight">Today's Site Timeline</h3>
          <span className="text-xs font-bold text-emerald-400">August 28</span>
        </div>

        <div className="flex flex-col gap-2">
          {scheduleTimeline.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.project}</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-400 flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
