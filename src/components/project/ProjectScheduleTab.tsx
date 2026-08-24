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
  const [viewMode, setViewMode] = useState<'gantt' | 'timeline' | 'calendar'>('gantt');

  const days = [18, 19, 20, 21, 22, 23, 24, 25];

  // Helper for Gantt bar offset & width in mock demo
  const getGanttBarStyle = (item: GanttItem) => {
    switch (item.id) {
      case 'g-1':
        return { left: '0%', width: '35%', color: 'bg-emerald-500' };
      case 'g-2':
        return { left: '15%', width: '45%', color: 'bg-emerald-500' };
      case 'g-3':
        return { left: '30%', width: '55%', color: 'bg-cyan-500' };
      case 'g-4':
        return { left: '45%', width: '50%', color: 'bg-blue-500' };
      case 'g-5':
        return { left: '60%', width: '40%', color: 'bg-amber-500' };
      case 'g-6':
        return { left: '75%', width: '25%', color: 'bg-purple-500' };
      default:
        return { left: '85%', width: '15%', color: 'bg-slate-500' };
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* View Switcher Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-[#101726] rounded-xl border border-[#1C2A44]">
          <button
            onClick={() => setViewMode('gantt')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'gantt' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            Gantt
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'timeline' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'calendar' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            Calendar
          </button>
        </div>

        <div className="text-xs font-bold text-slate-300 flex items-center gap-1">
          <span>May 2025</span>
        </div>
      </div>

      {viewMode === 'gantt' && (
        <div className="card-dark overflow-hidden border-[#1F2E47] bg-[#0E1524]">
          {/* Gantt Header with Dates */}
          <div className="p-3 bg-[#131E33] border-b border-[#1C2A44] flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 w-36 flex-shrink-0">
              Work Phase
            </span>

            {/* Days Header */}
            <div className="flex-1 grid grid-cols-8 gap-1 text-center">
              {days.map((d) => (
                <div key={d} className={`text-[10px] font-bold ${d === 20 ? 'text-cyan-400 bg-cyan-500/20 py-0.5 rounded' : 'text-slate-400'}`}>
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Rows */}
          <div className="divide-y divide-[#17243B]">
            {ganttItems.map((item) => {
              const style = getGanttBarStyle(item);
              return (
                <div key={item.id} className="p-3 flex items-center justify-between hover:bg-[#121B2C] transition-colors">
                  <div className="w-36 flex-shrink-0 pr-2">
                    <h4 className="text-[11px] font-bold text-white truncate">{item.name}</h4>
                    <p className="text-[9px] text-slate-400 truncate">{item.assignee}</p>
                  </div>

                  {/* Visual Bar Area */}
                  <div className="flex-1 relative h-7 bg-[#090E18] rounded-lg border border-[#162033] p-1 flex items-center">
                    {/* Today line marker */}
                    <div className="absolute top-0 bottom-0 left-[28%] w-[1.5px] bg-cyan-400/60 z-10"></div>

                    {/* Gantt duration bar */}
                    <div
                      className={`absolute h-4.5 rounded-md ${style.color} shadow-sm flex items-center justify-end px-1.5 transition-all duration-300`}
                      style={{ left: style.left, width: style.width }}
                    >
                      <span className="text-[9px] font-black text-black leading-none">{item.progress}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'timeline' && (
        <div className="space-y-3">
          {ganttItems.map((item, idx) => (
            <div key={item.id} className="card-dark p-3.5 flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  item.status === 'completed' ? 'bg-emerald-500 text-white' : item.status === 'in-progress' ? 'bg-cyan-400 text-black animate-pulse' : 'bg-[#1C2A44] text-slate-400'
                }`}>
                  {idx + 1}
                </div>
                {idx < ganttItems.length - 1 && <div className="w-0.5 h-10 bg-[#1C2A44] my-1"></div>}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  <span className="text-[10px] text-cyan-400 font-bold">{item.progress}%</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-1">{item.category} • {item.assignee}</p>
                <div className="text-[10px] text-slate-500">
                  {item.startDate} to {item.endDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="card-dark p-4 text-center">
          <div className="text-sm font-bold text-white mb-2">May 2025 Construction Calendar</div>
          <div className="grid grid-cols-7 gap-1 text-[11px] text-slate-400 mb-2 font-bold">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs">
            {Array.from({ length: 31 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-10 rounded-lg border border-[#1A2840] flex flex-col items-center justify-center ${
                  i + 1 === 20 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' : 'bg-[#0B101D] text-slate-300'
                }`}
              >
                <span>{i + 1}</span>
                {i + 1 === 20 && <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5"></span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
