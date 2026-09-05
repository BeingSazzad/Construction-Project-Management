import React from 'react';
import { Project, Task } from '../../types';
import { 
  ChevronRight, Calendar, Wrench, Sparkles, CloudRain, AlertTriangle
} from 'lucide-react';

interface HomeScreenProps {
  projects: Project[];
  tasks: Task[];
  onSelectProject: (project: Project) => void;
  onOpenProjects: () => void;
  onOpenLatti: () => void;
  onOpenTask: (task: Task) => void;
  onOpenTasks: () => void;
}

// Architectural elevation wireframe illustration component matching Figma Screen 1
const ArchitecturalBlueprintArt = () => (
  <svg 
    viewBox="0 0 160 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="w-36 h-28 opacity-75 stroke-[#1677FF]"
  >
    {/* Foundation & Grid */}
    <line x1="10" y1="105" x2="150" y2="105" strokeWidth="1.5" strokeDasharray="3 2" />
    <line x1="20" y1="105" x2="20" y2="40" strokeWidth="1" opacity="0.6" />
    <line x1="140" y1="105" x2="140" y2="40" strokeWidth="1" opacity="0.6" />
    
    {/* Main House Outline */}
    <rect x="25" y="45" width="110" height="60" strokeWidth="1.2" opacity="0.85" />
    <rect x="35" y="25" width="70" height="20" strokeWidth="1.2" opacity="0.85" />
    
    {/* Roof & Cantilevers */}
    <line x1="15" y1="25" x2="115" y2="25" strokeWidth="1.5" />
    <line x1="20" y1="45" x2="145" y2="45" strokeWidth="1.5" />
    
    {/* Glass Windows & Sliders */}
    <rect x="35" y="55" width="30" height="35" strokeWidth="0.8" opacity="0.7" />
    <line x1="50" y1="55" x2="50" y2="90" strokeWidth="0.8" opacity="0.7" />
    <rect x="80" y="55" width="45" height="40" strokeWidth="0.8" opacity="0.7" />
    <line x1="95" y1="55" x2="95" y2="95" strokeWidth="0.8" opacity="0.7" />
    <line x1="110" y1="55" x2="110" y2="95" strokeWidth="0.8" opacity="0.7" />
    
    {/* Landscape sketch palm */}
    <path d="M12 105C12 90 8 75 14 65" strokeWidth="1" opacity="0.5" />
    <path d="M14 65C10 60 5 62 2 66" strokeWidth="0.8" opacity="0.5" />
    <path d="M14 65C18 58 24 60 26 65" strokeWidth="0.8" opacity="0.5" />
    <path d="M14 65C12 55 16 50 14 45" strokeWidth="0.8" opacity="0.5" />
  </svg>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({
  projects,
  tasks,
  onSelectProject,
  onOpenProjects,
  onOpenLatti,
  onOpenTask,
  onOpenTasks,
}) => {
  const snellProject = projects.find(p => p.id === 'proj-1') || projects[0];

  const todayTasks = tasks.filter(t => t.projectId === snellProject.id).slice(0, 2);

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#171A1F] bg-[#F2F2F7] animate-fade-in">
      
      {/* ── 1. Greeting Headline ── */}
      <div className="pt-1">
        <h1 className="text-2xl font-bold tracking-tight text-[#171A1F]">
          Good morning, Avery
        </h1>
      </div>

      {/* ── 2. Primary Hero Project Card (Snell Isle Residence) ── */}
      <div 
        onClick={() => onSelectProject(snellProject)}
        className="w-full p-5 rounded-3xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/50 shadow-sm transition-all cursor-pointer active:scale-[0.99] relative overflow-hidden group"
      >
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1 pr-2">
            {/* Tag */}
            <span className="text-[10px] font-bold tracking-wider text-[#1677FF] uppercase">
              PROJECT
            </span>

            {/* Title & Chevron */}
            <div className="flex items-center gap-1.5 mt-0.5 group-hover:text-[#1677FF] transition-colors">
              <h2 className="text-lg font-bold text-[#171A1F] tracking-tight truncate">
                {snellProject.name}
              </h2>
              <ChevronRight className="w-4 h-4 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>

            {/* Phase */}
            <p className="text-xs text-[#68707C] font-medium mt-0.5">
              Construction
            </p>

            {/* Progress Percentage */}
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#1677FF] tracking-tight">
                  {snellProject.progress}%
                </span>
                <span className="text-xs font-semibold text-[#68707C]">
                  On Schedule
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-36 h-2 bg-[#EAEDF1] rounded-full overflow-hidden mt-1.5">
                <div 
                  className="h-full bg-[#1677FF] rounded-full transition-all duration-500"
                  style={{ width: `${snellProject.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Architectural Drawing Illustration */}
          <div className="absolute right-0 bottom-0 pointer-events-none translate-x-2 translate-y-1">
            <ArchitecturalBlueprintArt />
          </div>
        </div>
      </div>

      {/* ── 3. Twin Macro Metric Cards (2x Grid) ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Budget Metric */}
        <div 
          onClick={() => onSelectProject(snellProject)}
          className="p-4 rounded-2xl bg-white border border-[#DDE1E7] shadow-sm hover:border-[#1677FF]/40 transition-all cursor-pointer"
        >
          <div className="text-xl font-bold text-[#171A1F] tracking-tight">
            ${(snellProject.budget.total / 1000000).toFixed(2)}M
          </div>
          <div className="text-xs font-medium text-[#68707C] mt-0.5">
            Budget
          </div>
        </div>

        {/* Schedule Metric */}
        <div 
          onClick={() => onSelectProject(snellProject)}
          className="p-4 rounded-2xl bg-white border border-[#DDE1E7] shadow-sm hover:border-[#1677FF]/40 transition-all cursor-pointer"
        >
          <div className="text-xl font-bold text-[#1677FF] tracking-tight">
            92%
          </div>
          <div className="text-xs font-medium text-[#68707C] mt-0.5">
            On Schedule
          </div>
        </div>
      </div>

      {/* ── 4. Latti AI Attention Insight Card ── */}
      <div 
        onClick={onOpenLatti}
        className="p-4 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/50 shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-[#1677FF]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#1677FF]">
              Latti AI
            </div>
            <div className="text-xs font-semibold text-[#171A1F] truncate mt-0.5">
              Three cost items need your attention
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </div>

      {/* ── 4.5 Weather Radar Impact Card (Jobsite Intelligence) ── */}
      {snellProject.weather?.forecastRisk && (
        <div 
          onClick={onOpenLatti}
          className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-3 transition-all cursor-pointer active:scale-[0.99]"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center flex-shrink-0 mt-0.5">
            <CloudRain className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold text-[#B45309]">
                Weather Warning · Tampa, FL
              </span>
              <span className="text-[10px] font-semibold text-[#D97706]">
                82°F · Thursday
              </span>
            </div>
            <p className="text-xs text-[#92400E] font-medium leading-tight mt-0.5">
              {snellProject.weather.forecastRisk}
            </p>
          </div>
        </div>
      )}

      {/* ── 5. "Today" Schedule Section ── */}
      <div className="flex flex-col gap-2.5 mt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#171A1F] tracking-tight">
            Today
          </h3>
          <button 
            onClick={onOpenTasks}
            className="text-xs font-semibold text-[#1677FF] hover:underline cursor-pointer"
          >
            View all &gt;
          </button>
        </div>

        {/* Task Item 1: Framing Inspection */}
        {todayTasks.length > 0 ? (
          todayTasks.map((t, idx) => {
            const Icon = idx === 0 ? Calendar : Wrench;
            return (
              <div
                key={t.id}
                onClick={() => onOpenTask(t)}
                className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 text-[#1677FF]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors truncate">
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-[#68707C] font-medium mt-0.5 truncate">
                      {t.location || t.dueDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[11px] font-semibold text-[#10B981] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    On Time
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-xs text-[#68707C] bg-white rounded-2xl border border-[#DDE1E7]">
            No scheduled items for today.
          </div>
        )}
      </div>

    </div>
  );
};
