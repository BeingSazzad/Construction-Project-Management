import React, { useState } from 'react';
import { Project, Task } from '../../types';
import { 
  CheckSquare, Calendar, DollarSign, CloudRain, Sparkles, 
  ArrowRight, FileText, TrendingUp, Cloud, AlertCircle, 
  ChevronRight 
} from 'lucide-react';
import { ProjectCard } from '../common/ProjectCard';
import { WeatherImpactModal } from '../modals/WeatherImpactModal';

interface HomeScreenProps {
  projects: Project[];
  tasks: Task[];
  onSelectProject: (project: Project) => void;
  onOpenProjects: () => void;
  onOpenLatti: (query?: string) => void;
  onOpenTask: (task: Task) => void;
  onOpenTasks: () => void;
  onOpenCalendar?: () => void;
  onOpenBudget?: (project: Project) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  projects,
  tasks,
  onSelectProject,
  onOpenProjects,
  onOpenLatti,
  onOpenTask,
  onOpenTasks,
  onOpenCalendar,
  onOpenBudget,
}) => {
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const snellProject = projects.find(p => p.id === 'proj-1') || projects[0];
  const commercialProject = projects.find(p => p.id === 'proj-2') || projects[1] || projects[0];

  // Current formatted date
  const todayDateFormatted = 'Fri, Sep 5, 2026';

  // Specific schedule items matching the reference specification
  const scheduleItems = [
    {
      id: 'sch-1',
      time: '10:00 AM',
      title: 'Framing Inspection',
      subtitle: 'Snell Isle Residence • Building A',
      status: 'In Progress',
      statusColor: 'bg-[#EAF3FF] text-[#1677FF]',
      dotColor: 'bg-[#1677FF]',
      task: tasks.find(t => t.title.toLowerCase().includes('framing')) || tasks[0]
    },
    {
      id: 'sch-2',
      time: '1:30 PM',
      title: 'MEP Rough-In',
      subtitle: 'Snell Isle Residence • Building A',
      status: 'In Progress',
      statusColor: 'bg-[#EAF3FF] text-[#1677FF]',
      dotColor: 'bg-[#1677FF]',
      task: tasks.find(t => t.title.toLowerCase().includes('mep')) || tasks[1] || tasks[0]
    },
    {
      id: 'sch-3',
      time: '4:00 PM',
      title: 'Site Walk',
      subtitle: 'Harbor View Villas',
      status: 'Upcoming',
      statusColor: 'bg-[#F1F5F9] text-[#64748B]',
      dotColor: 'bg-[#94A3B8]',
      task: tasks.find(t => t.title.toLowerCase().includes('walk')) || tasks[2] || tasks[0]
    }
  ];

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      
      {/* ── 1. GREETING & DATE ── */}
      <div className="flex items-start justify-between gap-2 pt-1">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0F172A] tracking-tight leading-tight">
            Good morning, Avery
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5 font-normal">
            Let's keep your projects moving forward.
          </p>
        </div>
        <span className="text-xs font-medium text-[#64748B] text-right shrink-0 mt-0.5">
          {todayDateFormatted}
        </span>
      </div>

      {/* ── 2. TOP 4-KPI SUITE (Standardized Lattice System) ── */}
      <div className="grid grid-cols-4 gap-2">
        {/* Card 1: Tasks Due */}
        <div 
          onClick={onOpenTasks}
          className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] overflow-hidden group"
        >
          <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1">
              5
            </span>
            <span className="text-[10px] text-[#64748B] font-medium block truncate">
              Tasks due
            </span>
          </div>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF0F0] text-[#E5484D] w-fit max-w-full truncate">
            1 overdue
          </span>
        </div>

        {/* Card 2: Inspections */}
        <div 
          onClick={onOpenCalendar || onOpenTasks}
          className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] overflow-hidden group"
        >
          <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1">
              2
            </span>
            <span className="text-[10px] text-[#64748B] font-medium block truncate">
              Inspections
            </span>
          </div>
          <span className="text-[10px] text-[#64748B] font-medium block truncate">
            This week
          </span>
        </div>

        {/* Card 3: Total Budget */}
        <div 
          onClick={() => onOpenBudget ? onOpenBudget(snellProject) : onSelectProject(snellProject)}
          className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] overflow-hidden group"
        >
          <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#0F172A] block leading-tight mt-1 truncate">
              $4.65M
            </span>
            <span className="text-[10px] text-[#64748B] font-medium block truncate">
              Total budget
            </span>
          </div>
          <span className="text-[10px] text-[#64748B] font-medium block truncate">
            2 projects
          </span>
        </div>

        {/* Card 4: Weather & Jobsite Atmospheric Advisory */}
        <div 
          onClick={() => setIsWeatherModalOpen(true)}
          className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] overflow-hidden group"
        >
          <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <CloudRain className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1 truncate">
              82°F
            </span>
            <span className="text-[10px] text-[#64748B] font-medium block truncate">
              Site weather
            </span>
          </div>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFF7E6] text-[#D97706] w-fit max-w-full truncate">
            Rain Thu
          </span>
        </div>
      </div>

      {/* ── 3. LATTI BRIEFING (AI HERO CARD) ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex flex-col gap-3 relative overflow-hidden">
        {/* Header line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#1677FF]" />
            <span className="text-xs font-bold text-[#1677FF]">
              Latti Briefing
            </span>
            <span className="px-1.5 py-0.2 text-[10px] font-extrabold bg-[#EAF3FF] text-[#1677FF] rounded-md tracking-wider">
              BETA
            </span>
          </div>

          <button 
            onClick={() => onOpenLatti()}
            className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Headline & Summary with Floating Action Arrow */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm md:text-base font-bold text-[#0F172A] leading-snug">
              2 projects need attention today.
            </h2>
            <p className="text-xs text-[#475569] leading-relaxed mt-1">
              Snell Isle has an inspection tomorrow, and one framing invoice is over budget. Heavy rain is expected Thursday and may affect the scheduled concrete pour.
            </p>
          </div>

          <button
            onClick={() => onOpenLatti()}
            className="w-8 h-8 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center hover:bg-[#1677FF] hover:text-white transition-all shrink-0 cursor-pointer shadow-xs active:scale-95 mt-1"
            title="Open Latti Assistant"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Quick Action Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
          <button
            onClick={() => onOpenLatti("Summarize today's activity across projects")}
            className="h-7 px-2.5 rounded-full bg-[#F5F9FF] border border-[#EAF3FF] text-xs font-semibold text-[#1677FF] flex items-center gap-1.5 hover:bg-[#EAF3FF] transition-all cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-[#1677FF]" />
            <span>Summarize today's activity</span>
          </button>

          <button
            onClick={() => onOpenLatti("Show budget risks, variances, and pending invoices")}
            className="h-7 px-2.5 rounded-full bg-[#F5F9FF] border border-[#EAF3FF] text-xs font-semibold text-[#1677FF] flex items-center gap-1.5 hover:bg-[#EAF3FF] transition-all cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#1677FF]" />
            <span>Show budget risks</span>
          </button>

          <button
            onClick={() => onOpenLatti("Check weather radar and Thursday concrete pour impact")}
            className="h-7 px-2.5 rounded-full bg-[#F5F9FF] border border-[#EAF3FF] text-xs font-semibold text-[#1677FF] flex items-center gap-1.5 hover:bg-[#EAF3FF] transition-all cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
          >
            <Cloud className="w-3.5 h-3.5 text-[#1677FF]" />
            <span>Check weather impact</span>
          </button>
        </div>
      </div>

      {/* ── 4. NEEDS ATTENTION (RISK FEED) ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
            Needs Attention
          </h2>
          <button 
            onClick={() => onOpenLatti()}
            className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#F1F5F9] shadow-card overflow-hidden">
          {/* Item 1: Framing invoice over budget */}
          <div 
            onClick={() => onOpenBudget ? onOpenBudget(snellProject) : onSelectProject(snellProject)}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F1F5F9]/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FFF0F0] text-[#E5484D] flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs md:text-sm font-semibold text-[#0F172A] truncate">
                  Framing invoice over budget
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5 truncate">
                  Snell Isle Residence • $8,400 over category
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-semibold text-[#E5484D]">
                Today
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            </div>
          </div>

          {/* Item 2: Heavy rain expected Thursday */}
          <div 
            onClick={() => onOpenLatti("Heavy rain expected Thursday delay impact on concrete pour")}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F1F5F9]/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FFF7E6] text-[#F59E0B] flex items-center justify-center shrink-0">
                <CloudRain className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs md:text-sm font-semibold text-[#0F172A] truncate">
                  Heavy rain expected Thursday
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5 truncate">
                  May affect scheduled concrete pour • Snell Isle Residence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-semibold text-[#F59E0B]">
                Thu, Sep 7
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            </div>
          </div>

          {/* Item 3: Inspection tomorrow */}
          <div 
            onClick={() => onOpenTask(scheduleItems[0].task)}
            className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F1F5F9]/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#FFF7E6] text-[#F59E0B] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs md:text-sm font-semibold text-[#0F172A] truncate">
                  Inspection tomorrow
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5 truncate">
                  Snell Isle Residence • 10:00 AM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-semibold text-[#1677FF]">
                Tomorrow
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. TODAY'S SCHEDULE (TIMELINE FEED) ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
            Today's Schedule
          </h2>
          <button 
            onClick={onOpenCalendar || onOpenTasks}
            className="text-xs font-semibold text-[#1677FF] hover:underline cursor-pointer"
          >
            View calendar
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card p-3.5 flex flex-col gap-3">
          {scheduleItems.map((item, idx) => (
            <div 
              key={item.id}
              onClick={() => onOpenTask(item.task)}
              className="flex items-center justify-between gap-3 hover:bg-[#F1F5F9]/50 p-1 rounded-xl transition-colors cursor-pointer relative"
            >
              {/* Left Time & Timeline Connector */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-xs font-bold text-[#0F172A] w-16">
                  {item.time}
                </span>
                <div className="relative flex flex-col items-center">
                  <span className={`w-2 h-2 rounded-full ${item.dotColor} shrink-0 z-10`} />
                  {idx !== scheduleItems.length - 1 && (
                    <span className="absolute top-2 w-px h-8 bg-[#E2E8F0]" />
                  )}
                </div>
              </div>

              {/* Middle Title & Subtitle */}
              <div className="flex-1 min-w-0 pl-1">
                <h3 className="text-xs md:text-sm font-semibold text-[#0F172A] truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5 truncate">
                  {item.subtitle}
                </p>
              </div>

              {/* Trailing Status & Chevron */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.statusColor}`}>
                  • {item.status}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. MY PROJECTS (MULTI-PROJECT PREVIEW) ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
            My Projects
          </h2>
          <button 
            onClick={onOpenProjects}
            className="text-xs font-semibold text-[#1677FF] hover:underline cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          <ProjectCard
            project={snellProject}
            onClick={() => onSelectProject(snellProject)}
          />
          <ProjectCard
            project={commercialProject}
            onClick={() => onSelectProject(commercialProject)}
          />
        </div>
      </div>

      {/* Weather Impact Modal */}
      <WeatherImpactModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        project={snellProject}
        onOpenSchedule={() => {
          setIsWeatherModalOpen(false);
          if (onOpenCalendar) onOpenCalendar();
        }}
        onOpenDailyLog={() => {
          setIsWeatherModalOpen(false);
          if (onOpenTasks) onOpenTasks();
        }}
      />

    </div>
  );
};
