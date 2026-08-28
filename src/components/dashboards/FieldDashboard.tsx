import React from 'react';
import { Task, SitePhoto } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Sun, Users, ShieldCheck, Camera, FileText, 
  ChevronRight, AlertCircle, MapPin, CheckSquare, Plus,
  Video, Truck, Package, BatteryCharging, Radio
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
      {/* 1. Quick Photo Action */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
          Field Operations
        </span>

        <button
          onClick={onTriggerPhotoUpload}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex-shrink-0 active:scale-95"
        >
          <Camera className="w-4 h-4" />
          <span>Quick Photo</span>
        </button>
      </div>

      {/* 2. Live Site Camera Stream (From Reference Inspiration - Screen 1) */}
      <div className="p-3.5 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white">Site Live Stream</span>
          </div>
          <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>CAM 1 · LIVE</span>
          </span>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#090E1A] border border-[#162033] group">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"
            alt="Live Site Stream"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 p-3 flex flex-col justify-between">
            <div className="text-xs font-bold text-white drop-shadow">Riverside West Wing Pour</div>
            <div className="flex items-center justify-between text-xs text-slate-200">
              <span>24 Workers Active</span>
              <span className="text-emerald-400 font-bold">100% Inspection Passed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. On-Site Available Stock Bar (From Reference Inspiration - Screen 1) */}
      <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
            Available Site Stock
          </span>
          <span className="text-xs text-slate-400 font-medium">Updated 10m ago</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-[#090E1A] border border-[#141F33]">
            <div className="text-xs text-slate-400 font-medium">Cement Bags</div>
            <div className="text-sm font-bold text-white mt-0.5">1,789</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#090E1A] border border-[#141F33]">
            <div className="text-xs text-slate-400 font-medium">Steel Rebar</div>
            <div className="text-sm font-bold text-blue-400 mt-0.5">3,800 kg</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#090E1A] border border-[#141F33]">
            <div className="text-xs text-slate-400 font-medium">Aggregates</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">15 Tonnes</div>
          </div>
        </div>
      </div>

      {/* 4. Fleet & Machinery Telematics (From Reference Inspiration - Screen 2 & 4) */}
      <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">Equipment Telematics</span>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Active #876549
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#090E1A] border border-[#141F33] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">CAT 320 Excavator</span>
              <span className="text-xs text-slate-400 block mt-0.5">Riverside East Block Location</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>100% Charge</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">2h 18m remaining</div>
          </div>
        </div>
      </div>

      {/* 5. Field Weather & Site Conditions */}
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
      </div>

      {/* 6. Active Field Tasks */}
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
    </div>
  );
};
