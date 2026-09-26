import React, { useState, useMemo } from 'react';
import { Project, Task, DailyLogItem, PunchItem, ChangeOrder, Subcontractor } from '../../types';
import { 
  CheckSquare, Calendar, Sparkles, ArrowRight, FileText, 
  TrendingUp, HardHat, ShieldCheck, Clock, AlertTriangle, Phone, 
  CheckCircle2, ChevronRight, Building2, Flame, Info, Sun, X, 
  ArrowUpRight, Check, UserCheck
} from 'lucide-react';
import { ProjectCard } from '../common/ProjectCard';
import { WeatherImpactModal } from '../modals/WeatherImpactModal';

interface ProjectManagerDashboardProps {
  projects: Project[];
  tasks: Task[];
  dailyLogs?: DailyLogItem[];
  punchItems?: PunchItem[];
  changeOrders?: ChangeOrder[];
  subcontractors?: Subcontractor[];
  onSelectProject: (project: Project) => void;
  onOpenProjects: () => void;
  onOpenLatti: (query?: string) => void;
  onOpenTask: (task: Task) => void;
  onOpenTasks: (projectId?: string) => void;
  onOpenCalendar?: (date?: string) => void;
  onOpenDailyLogs?: () => void;
  onOpenPunchList?: () => void;
  onCreateTask?: () => void;
  onCreatePunch?: () => void;
  onCreateChangeOrder?: () => void;
}

interface PriorityItem {
  id: string;
  type: 'punch' | 'task' | 'log';
  code: string;
  category: string;
  project: string;
  projectId: string;
  title: string;
  description: string;
  urgency: 'critical' | 'high' | 'medium';
  dueText: string;
  assignedTo: string;
  status: 'pending' | 'resolved';
  details?: {
    actionRequired?: string;
    fieldNotes?: string;
    impact?: string;
  };
}

export const ProjectManagerDashboard: React.FC<ProjectManagerDashboardProps> = ({
  projects,
  tasks,
  dailyLogs = [],
  punchItems = [],
  changeOrders = [],
  subcontractors = [],
  onSelectProject,
  onOpenProjects,
  onOpenLatti,
  onOpenTask,
  onOpenTasks,
  onOpenCalendar,
  onOpenDailyLogs,
  onOpenPunchList,
}) => {
  const snellProject = projects.find(p => p.id === 'proj-1') || projects[0];
  const todayDateFormatted = 'Fri, Sep 5, 2026';

  // Modals state
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isHeadcountModalOpen, setIsHeadcountModalOpen] = useState(false);
  const [isDailyLogModalOpen, setIsDailyLogModalOpen] = useState(false);
  const [isPriorityListModalOpen, setIsPriorityListModalOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<PriorityItem | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'punch' | 'task' | 'log'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Daily log verification state
  const [dailyLogSigned, setDailyLogSigned] = useState(false);
  const [dailyLogRemarks, setDailyLogRemarks] = useState(
    'Superintendent log reviewed and approved. Framing crew is on schedule. Level 2 punch items verified.'
  );

  // Priority Items (Internal coordination between Sarah PM and John Field Supt)
  const [priorityItems, setPriorityItems] = useState<PriorityItem[]>([
    {
      id: 'pri-1',
      type: 'punch',
      code: 'PUNCH-04',
      category: 'Framing Quality',
      project: 'Snell Isle Residence',
      projectId: 'proj-1',
      title: 'Level 2 Shear Wall Nailing Check',
      description: 'Field Superintendent John Smith completed OSB perimeter nailing. Ready for PM site walk verification.',
      urgency: 'critical',
      dueText: 'Due Today',
      assignedTo: 'John Smith (Field Superintendent)',
      status: 'pending',
      details: {
        actionRequired: 'Verify 8d common nail spacing (6" o.c. edge) with John Smith.',
        fieldNotes: 'Framing crew completed 4 panels on West elevation; awaiting PM sign-off.',
        impact: 'Required before scheduling interior insulation.'
      }
    },
    {
      id: 'pri-2',
      type: 'task',
      code: 'TASK-108',
      category: 'Site Logistics',
      project: 'Snell Isle Residence',
      projectId: 'proj-1',
      title: 'Lumber Package Staging & Crane Access',
      description: 'Coordinate clear driveway access with 84 Lumber and John Smith for crane offload.',
      urgency: 'high',
      dueText: 'Today 2 PM',
      assignedTo: 'John Smith (Field Superintendent)',
      status: 'pending',
      details: {
        actionRequired: 'Confirm forklift staging zone is clear of trade vehicles.',
        fieldNotes: 'Telehandler on standby. 84 Lumber delivery confirmed.',
        impact: 'Maintains workflow for 14 framing carpenters.'
      }
    },
    {
      id: 'pri-3',
      type: 'log',
      code: 'LOG-042',
      category: 'Daily Operations',
      project: 'Snell Isle Residence',
      projectId: 'proj-1',
      title: 'Snell Isle Daily Log Sign-off',
      description: 'John Smith submitted daily log: 24 personnel on site, dry conditions, framing progress complete.',
      urgency: 'medium',
      dueText: 'Ready to Sign',
      assignedTo: 'Sarah Johnson (Lead PM)',
      status: 'pending',
      details: {
        actionRequired: 'Review superintendent notes and sign daily stamp.',
        fieldNotes: 'Zero safety incidents. All sub crews logged.',
        impact: 'Maintains official records for Owner Avery Scott.'
      }
    }
  ]);

  const pendingPriorityCount = useMemo(() => {
    return priorityItems.filter(b => b.status === 'pending').length;
  }, [priorityItems]);

  const filteredPriorityItems = useMemo(() => {
    return priorityItems.filter(b => {
      if (priorityFilter === 'all') return true;
      return b.type === priorityFilter;
    });
  }, [priorityItems, priorityFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolvePriority = (id: string, actionName: string) => {
    setPriorityItems(prev => prev.map(b => b.id === id ? { ...b, status: 'resolved' } : b));
    setSelectedPriority(null);
    showToast(`✓ ${actionName} recorded successfully!`);
  };

  const handleSignDailyLog = () => {
    setDailyLogSigned(true);
    setPriorityItems(prev => prev.map(b => b.id === 'pri-3' ? { ...b, status: 'resolved' } : b));
    setIsDailyLogModalOpen(false);
    showToast('✓ Daily Log for Snell Isle signed & stamped by Sarah Johnson (Lead PM)!');
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-slate-700 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-[#10A976]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. HERO CARD: TODAY'S OPERATIONAL FOCUS & SITE PULSE ── */}
      <div 
        onClick={() => onSelectProject(snellProject)}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#DCE8F8] bg-gradient-to-r from-[#EAF3FF] via-[#F4F8FF] to-white p-4 sm:p-5 shadow-xs hover:border-[#1677FF]/40 transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left: Today's Focus & Live Headcount */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-full">
                PM Focus
              </span>
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHeadcountModalOpen(true);
                }}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#10A976] hover:underline cursor-pointer"
                title="Click to view trade headcount breakdown"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10A976] animate-pulse" />
                94 on site
              </span>
            </div>

            <div className="mt-1.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors tracking-tight truncate leading-snug">
                Framing & Wall Sheathing
              </h2>
              <p className="text-xs text-[#64748B] font-medium mt-0.5 truncate leading-snug">
                Snell Isle Residence · John Smith on Site · 24 Crew
              </p>
            </div>
          </div>

          {/* Right: Date & Weather Pill */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-xs font-semibold text-[#0F172A]">
              {todayDateFormatted}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsWeatherModalOpen(true);
              }}
              className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 hover:bg-white border border-[#DCE8F8] text-xs font-medium transition-all cursor-pointer shadow-xs active:scale-95 group/w"
              title="View weather radar & crane impact"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              <span className="font-bold text-[#0F172A]">82°F</span>
              <span className="text-[#64748B] text-[11px]">Sunny</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. EXACT 3 PM OPERATIONAL KPIS (Clean & Aligned with Owner Standard) ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {/* KPI 1: Assigned Projects */}
        <div 
          onClick={onOpenProjects}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
              Active Projects
            </span>
            <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
              {projects.length}
            </span>
          </div>
        </div>

        {/* KPI 2: Tasks On Track */}
        <div 
          onClick={() => onOpenTasks()}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
              Tasks On Track
            </span>
            <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
              24 / 26
            </span>
          </div>
        </div>

        {/* KPI 3: Priority Items */}
        <div 
          onClick={() => setIsPriorityListModalOpen(true)}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#FFF0F0] text-[#E5484D] flex items-center justify-center shrink-0">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
              Urgent Tasks
            </span>
            <span className="text-base sm:text-lg font-bold text-[#E5484D] block leading-tight mt-0.5 truncate">
              {pendingPriorityCount} Urgent
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. FIELD DELIVERY & CRITICAL PATH HEALTH CARD (Matching Owner Capital Card) ── */}
      <div 
        onClick={() => onOpenCalendar ? onOpenCalendar('2026-09-06') : onOpenTasks()}
        className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#1677FF]/40 transition-all cursor-pointer flex flex-col gap-2 group"
      >
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              CRITICAL PATH & LOOKAHEAD HEALTH
            </span>
            <Info className="w-3 h-3 text-[#94A3B8]" />
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E9F9F3] text-[#10A976]">
            94% On Schedule
          </span>
        </div>

        {/* Value + Circular Arrow Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight leading-tight">
              24 of 26 Tasks On Schedule
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#64748B] font-medium tracking-tight mt-0.5 leading-snug truncate">
              16 Done (62%) · 8 Active (28%) · 2 Pending Clearances (10%)
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center group-hover:bg-[#1677FF] group-hover:text-white transition-all shrink-0">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Segmented Continuous Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden flex gap-0.5 mt-0.5">
          <div className="h-full bg-[#1677FF] rounded-l-full" style={{ width: '62%' }} />
          <div className="h-full bg-[#60A5FA]" style={{ width: '28%' }} />
          <div className="h-full bg-[#BAE6FD] rounded-r-full" style={{ width: '10%' }} />
        </div>

        {/* Bar Legend - Clean justify-between inline alignment */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1677FF] shrink-0" />
            <span className="text-[11px] text-[#64748B] font-medium">Done</span>
            <span className="text-[11px] font-bold text-[#0F172A]">62%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#60A5FA] shrink-0" />
            <span className="text-[11px] text-[#64748B] font-medium">Active</span>
            <span className="text-[11px] font-bold text-[#0F172A]">28%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#BAE6FD] shrink-0" />
            <span className="text-[11px] text-[#64748B] font-medium">Pending</span>
            <span className="text-[11px] font-bold text-[#0F172A]">10%</span>
          </div>
        </div>
      </div>

      {/* ── 4. LATTI PM EXECUTIVE BRIEFING (Matching Owner Executive Briefing) ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#1677FF]" />
            <span className="text-sm font-bold text-[#1677FF]">Latti PM Briefing</span>
          </div>
          <button 
            onClick={() => onOpenLatti()} 
            className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ask Copilot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0]/70 rounded-2xl p-3.5">
          <p className="text-xs text-[#334155] leading-relaxed font-normal">
            3 assigned projects on track. Sarah, you have {pendingPriorityCount} urgent tasks requiring coordination with Field Superintendent John Smith. Snell Isle daily log is ready for your sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          <button 
            onClick={() => setIsPriorityListModalOpen(true)}
            className="h-8 px-3.5 rounded-full bg-[#FFF0F0] hover:bg-[#FFE2E2] border border-[#FECDD3] text-xs font-semibold text-[#E5484D] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Urgent Tasks ({pendingPriorityCount})</span>
          </button>
          <button 
            onClick={() => setIsDailyLogModalOpen(true)}
            className="h-8 px-3.5 rounded-full bg-[#F1F6FE] hover:bg-[#E5EFFF] border border-[#DCE8F8] text-xs font-semibold text-[#1677FF] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>{dailyLogSigned ? 'Daily Log (Certified ✓)' : 'Review Daily Log'}</span>
          </button>
        </div>
      </div>

      {/* ── 6. ACTIVE PROJECTS MULTI-PROJECT ROLLUP (Matching Owner Screen 100%) ── */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-base font-bold text-[#0F172A] tracking-tight">Active Projects</h2>
          <button 
            onClick={onOpenProjects} 
            className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>See all ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onClick={() => onSelectProject(p)}
            />
          ))}
        </div>
      </div>

      {/* ── WEATHER MODAL ── */}
      {isWeatherModalOpen && (
        <WeatherImpactModal
          isOpen={isWeatherModalOpen}
          onClose={() => setIsWeatherModalOpen(false)}
          project={snellProject}
          onOpenSchedule={() => {
            setIsWeatherModalOpen(false);
            if (onOpenCalendar) onOpenCalendar('2026-09-06');
          }}
          onOpenDailyLog={() => {
            setIsWeatherModalOpen(false);
            if (onOpenDailyLogs) onOpenDailyLogs();
          }}
        />
      )}

      {/* ── MODAL: FULL PRIORITY QUEUE ── */}
      {isPriorityListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-[440px] w-full p-5 shadow-2xl border border-[#E2E8F0] flex flex-col gap-4 max-h-[90vh] overflow-hidden animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF0F0] text-[#E5484D] flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] leading-tight">Urgent Tasks & Site Issues</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">{pendingPriorityCount} Urgent items needing attention</p>
                </div>
              </div>
              <button
                onClick={() => setIsPriorityListModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {(['all', 'punch', 'task', 'log'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPriorityFilter(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    priorityFilter === filter 
                      ? 'bg-[#1677FF] text-white shadow-xs' 
                      : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {filter === 'all' ? 'All Items' : filter === 'punch' ? 'Punch List' : filter === 'task' ? 'Tasks' : 'Daily Logs'}
                </button>
              ))}
            </div>

            {/* Priority List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9] rounded-2xl border border-[#E2E8F0]">
              {filteredPriorityItems.map((item) => {
                const isResolved = item.status === 'resolved';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedPriority(item);
                    }}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shrink-0 ${
                        item.type === 'punch' ? 'bg-[#FFF7E6] text-[#D97706]' :
                        item.type === 'task' ? 'bg-[#EAF3FF] text-[#1677FF]' : 'bg-[#E9F9F3] text-[#10A976]'
                      }`}>
                        {item.code}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs sm:text-sm font-bold truncate leading-tight group-hover:text-[#1677FF] transition-colors ${
                          isResolved ? 'text-[#64748B] line-through' : 'text-[#0F172A]'
                        }`}>
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[#64748B] truncate mt-0.5 leading-tight">
                          {item.project} · <span className="font-medium text-[#475569]">{item.assignedTo}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                        isResolved
                          ? 'bg-[#E9F9F3] text-[#10A976]'
                          : item.urgency === 'critical'
                          ? 'bg-[#FFF0F0] text-[#E5484D]'
                          : 'bg-[#FFF7E6] text-[#D97706]'
                      }`}>
                        {isResolved ? 'Resolved ✓' : item.dueText}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs text-[#64748B]">Click any item to review & coordinate</span>
              <button
                onClick={() => setIsPriorityListModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 1: PRIORITY ITEM DETAIL & ACTION ── */}
      {selectedPriority && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-[420px] w-full p-5 shadow-2xl border border-[#E2E8F0] flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-slide-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  selectedPriority.type === 'punch' ? 'bg-[#FFF7E6] text-[#D97706]' :
                  selectedPriority.type === 'task' ? 'bg-[#EAF3FF] text-[#1677FF]' : 'bg-[#E9F9F3] text-[#10A976]'
                }`}>
                  {selectedPriority.code} · {selectedPriority.category}
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-1 leading-snug">
                  {selectedPriority.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPriority(null)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Context */}
            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#64748B] block font-semibold">Assigned To</span>
                <span className="font-bold text-[#0F172A]">{selectedPriority.assignedTo}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#64748B] block font-semibold">Timeline</span>
                <span className="font-bold text-[#E5484D]">{selectedPriority.dueText}</span>
              </div>
            </div>

            {/* Description & Field Notes */}
            <div className="flex flex-col gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#E2E8F0]">
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                  Scope & Action Required
                </span>
                <p className="text-[#334155] leading-relaxed">
                  {selectedPriority.details?.actionRequired || selectedPriority.description}
                </p>
              </div>

              {selectedPriority.details?.fieldNotes && (
                <div className="bg-[#EAF3FF] p-3 rounded-xl border border-[#DCE8F8]">
                  <span className="text-[10px] font-bold text-[#1677FF] uppercase tracking-wider block mb-1">
                    Superintendent Field Notes
                  </span>
                  <p className="text-[#1E40AF] leading-relaxed">
                    {selectedPriority.details?.fieldNotes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                {selectedPriority.type === 'punch' && (
                  <button
                    onClick={() => handleResolvePriority(selectedPriority.id, 'Punch Item Verified with John Smith')}
                    className="h-11 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Punch Item with John Smith</span>
                  </button>
                )}

                {selectedPriority.type === 'task' && (
                  <button
                    onClick={() => handleResolvePriority(selectedPriority.id, 'Site Logistics Confirmed with John Smith')}
                    className="h-11 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Logistics with John Smith</span>
                  </button>
                )}

                {selectedPriority.type === 'log' && (
                  <button
                    onClick={() => {
                      setSelectedPriority(null);
                      setIsPriorityListModalOpen(false);
                      setIsDailyLogModalOpen(true);
                    }}
                    className="h-11 rounded-xl bg-[#10A976] hover:bg-[#0E9466] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                  >
                    <HardHat className="w-4 h-4" />
                    <span>Open Daily Log Sign-off</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    alert('Calling John Smith (Field Superintendent) at +1 (555) 567-8901...');
                  }}
                  className="h-10 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1677FF]" />
                  <span>Call Field Superintendent John Smith</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: ACTIVE FIELD HEADCOUNT ── */}
      {isHeadcountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-[420px] w-full p-5 shadow-2xl border border-[#E2E8F0] flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Active Field Headcount
                </h3>
                <p className="text-xs text-[#64748B]">94 Personnel On-Site Across 3 Projects</p>
              </div>
              <button
                onClick={() => setIsHeadcountModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white text-xs">
              {[
                { trade: 'Titan Framing Systems', role: 'Structural Framing & Joists', count: 28, site: 'Snell Isle' },
                { trade: 'Apex Concrete Masters', role: 'Rebar & Foundation Prep', count: 14, site: 'Bayshore Tower' },
                { trade: 'Volt Electric Masters', role: 'Electrical Conduit Rough-In', count: 16, site: 'Snell Isle' },
                { trade: 'Gulfstream Plumbing', role: 'Under-Slab Rough-In', count: 12, site: 'Snell Isle' },
                { trade: 'Coastal Glazing Co.', role: 'Curtain Wall Layout', count: 8, site: 'Hyde Park' },
                { trade: 'General Site Labor', role: 'Cleanliness & Material Handling', count: 16, site: 'All Sites' },
              ].map((sub, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-2 hover:bg-[#F8FAFC]">
                  <div>
                    <h4 className="font-bold text-[#0F172A]">{sub.trade}</h4>
                    <p className="text-[11px] text-[#64748B]">{sub.role} · {sub.site}</p>
                  </div>
                  <span className="text-xs font-bold text-[#1677FF] bg-[#EAF3FF] px-2.5 py-1 rounded-full">
                    {sub.count} Men
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsHeadcountModalOpen(false)}
              className="h-11 rounded-xl bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-black transition-colors"
            >
              Close Roster
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 3: SUPERINTENDENT DAILY LOG REVIEW & SIGN-OFF ── */}
      {isDailyLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-[420px] w-full p-5 shadow-2xl border border-[#E2E8F0] flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-slide-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#10A976] bg-[#E9F9F3] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Superintendent Log Review
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-1">
                  Snell Isle Residence · Sep 5
                </h3>
                <p className="text-xs text-[#64748B]">Authored by John Smith (Superintendent)</p>
              </div>
              <button
                onClick={() => setIsDailyLogModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Weather:</span>
                  <span className="font-bold text-[#0F172A]">82°F · Sunny · Dry Site</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Headcount:</span>
                  <span className="font-bold text-[#0F172A]">24 Personnel on site</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Equipment:</span>
                  <span className="font-bold text-[#0F172A]">Genie GTH-844 Telehandler</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Safety:</span>
                  <span className="font-bold text-[#10A976]">Zero safety incidents or near misses ✓</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                  Superintendent Work Notes
                </span>
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] text-[#334155] leading-relaxed">
                  "Completed Level 2 ceiling joist installation and exterior shear wall nailing. Pre-walked city framing inspection punch list with carpenter foreman. Lumber delivery received from 84 Lumber."
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                  PM Verification Remarks
                </label>
                <textarea
                  value={dailyLogRemarks}
                  onChange={(e) => setDailyLogRemarks(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[#CBD5E1] p-2.5 text-xs text-[#0F172A] focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleSignDailyLog}
                className="h-11 rounded-xl bg-[#10A976] hover:bg-[#0E9466] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sign & Stamp Daily Log (Sarah Johnson, Lead PM)</span>
              </button>

              <button
                onClick={() => {
                  alert('Calling John Smith (Superintendent) at +1 (555) 567-8901...');
                }}
                className="h-10 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-[#F8FAFC]"
              >
                <Phone className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>Call Superintendent John Smith</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
