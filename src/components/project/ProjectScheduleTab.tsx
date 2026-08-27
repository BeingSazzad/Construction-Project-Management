import React, { useState } from 'react';
import { Project, GanttItem } from '../../types';
import { 
  CalendarDays, Layers, ChevronLeft, ChevronRight, 
  CheckCircle2, Clock, Plus, BarChart2
} from 'lucide-react';

interface ProjectScheduleTabProps {
  project: Project;
  ganttItems: GanttItem[];
  onCreateTask?: () => void;
}

export const ProjectScheduleTab: React.FC<ProjectScheduleTabProps> = ({
  project,
  ganttItems,
  onCreateTask
}) => {
  const [viewMode, setViewMode] = useState<'gantt' | 'timeline'>('gantt');

  const days = [18, 19, 20, 21, 22, 23, 24, 25];

  const getGanttBarStyle = (item: GanttItem, idx: number) => {
    const presets = [
      { left: '0%', width: '38%', color: 'bg-blue-500' },
      { left: '15%', width: '42%', color: 'bg-blue-500' },
      { left: '30%', width: '50%', color: 'bg-blue-600' },
      { left: '45%', width: '48%', color: 'bg-[#2563EB]' },
      { left: '60%', width: '38%', color: 'bg-blue-400' },
      { left: '75%', width: '25%', color: 'bg-blue-300' },
    ];
    return presets[idx % presets.length];
  };

  return (
    <div className="w-full flex flex-col gap-3.5 pt-2 pb-24 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Header & View Switcher Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-[#142036] pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Master Schedule</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Critical Path & Milestones</p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1 bg-[#070D1A] p-1 rounded-xl border border-[#142036]">
          <button
            onClick={() => setViewMode('gantt')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'gantt'
                ? 'bg-[#2563EB] text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gantt
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-[#2563EB] text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* 2. GANTT VIEW */}
      {viewMode === 'gantt' && (
        <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-3 overflow-hidden">
          {/* Gantt Header with Dates */}
          <div className="p-2.5 bg-[#050811] rounded-xl border border-[#142036] flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 w-32 flex-shrink-0">
              Work Phase
            </span>

            {/* Days Header */}
            <div className="flex-1 grid grid-cols-8 gap-1 text-center">
              {days.map((d) => (
                <div key={d} className={`text-xs font-bold ${d === 20 ? 'text-blue-400 bg-blue-500/20 py-0.5 rounded' : 'text-slate-400'}`}>
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Rows */}
          <div className="flex flex-col gap-2">
            {ganttItems.map((item, idx) => {
              const style = getGanttBarStyle(item, idx);
              return (
                <div key={item.id} className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex items-center justify-between gap-2 hover:border-blue-500/30 transition-colors">
                  <div className="w-32 flex-shrink-0 pr-2 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate font-medium mt-0.5">{item.assignee}</p>
                  </div>

                  <div className="flex-1 h-7 bg-[#070D1A] rounded-lg border border-[#142036] relative overflow-hidden flex items-center">
                    <div 
                      className={`h-4.5 rounded-md ${style.color} absolute transition-all flex items-center justify-end px-1.5 shadow-sm opacity-90`}
                      style={{ left: style.left, width: style.width }}
                    >
                      <span className="text-[9px] font-bold text-white tracking-tighter">
                        {item.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="flex flex-col gap-3">
          {ganttItems.map((item) => (
            <div key={item.id} className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0E1A33] border border-[#1E325A] flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.name}</h4>
                  <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                    {item.progress}% Done
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-1">Lead: {item.assignee}</p>
                <div className="w-full h-1.5 bg-[#050811] rounded-full overflow-hidden border border-[#142036] mt-2">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
