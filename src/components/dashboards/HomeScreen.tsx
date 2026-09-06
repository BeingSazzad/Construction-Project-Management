import React, { useState, useMemo } from 'react';
import { Project, Task, UserRole } from '../../types';
import { 
  CheckSquare, Calendar, DollarSign, CloudRain, Sparkles, 
  ArrowRight, FileText, TrendingUp, Cloud, AlertCircle, 
  ChevronRight, Building2, HardHat, ShieldCheck, Users,
  Clock, AlertTriangle, Phone, CheckCircle2, ChevronDown,
  Layers, Hammer, FileSpreadsheet, Eye, Plus, Wrench,
  Landmark, Receipt, FileCheck, ArrowUpRight
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
  onOpenCalendar?: (date?: string) => void;
  onOpenBudget?: (project: Project) => void;
  onOpenBudgetsHub?: () => void;
  onOpenDailyLogs?: () => void;
  onOpenApprovePayApp?: () => void;
  onOpenLienWaiver?: () => void;
  currentRole?: UserRole;
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
  onOpenBudgetsHub,
  onOpenDailyLogs,
  onOpenApprovePayApp,
  onOpenLienWaiver,
  currentRole = 'admin',
}) => {
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [approvedInvoices, setApprovedInvoices] = useState<string[]>([]);
  const [financeProjectFilter, setFinanceProjectFilter] = useState<'all' | 'variance' | 'draws'>('all');
  const [financeToast, setFinanceToast] = useState<string | null>(null);
  const snellProject = projects.find(p => p.id === 'proj-1') || projects[0];

  const todayDateFormatted = 'Fri, Sep 5, 2026';

  // Live aggregates
  const totalBudget = useMemo(() => {
    return projects.reduce((sum, p) => sum + (p.budget?.total || 0), 0);
  }, [projects]);

  const totalSpend = useMemo(() => {
    return projects.reduce((sum, p) => sum + (p.budget?.actual || p.budget?.paid || 0), 0);
  }, [projects]);

  const remainingBudget = useMemo(() => {
    return Math.max(0, totalBudget - totalSpend);
  }, [totalBudget, totalSpend]);

  const activeTasks = useMemo(() => {
    return tasks.filter(t => t.status !== 'Completed');
  }, [tasks]);

  const overdueTasksCount = useMemo(() => {
    const today = new Date('2026-09-06');
    return activeTasks.filter(t => t.dueDate && new Date(t.dueDate) < today).length;
  }, [activeTasks]);

  const formattedBudget = totalBudget >= 1000000 
    ? `$${(totalBudget / 1000000).toFixed(2)}M` 
    : `$${(totalBudget / 1000).toFixed(0)}K`;

  const formattedSpend = totalSpend >= 1000000 
    ? `$${(totalSpend / 1000000).toFixed(2)}M` 
    : `$${Math.round(totalSpend / 1000)}k`;

  // ─────────────────────────────────────────────────────────────
  // 1. OWNER / EXECUTIVE ROLE DASHBOARD (Avery Scott)
  // ─────────────────────────────────────────────────────────────
  if (currentRole === 'admin') {
    return (
      <div className="w-full flex-1 flex flex-col gap-4 px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
        
        {/* Context Bar */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">
              Portfolio & Capital Control
            </span>
          </div>
          <span className="text-xs font-semibold text-[#64748B]">{todayDateFormatted}</span>
        </div>

        {/* 3 Executive KPIs */}
        <div className="grid grid-cols-3 gap-2.5">
          <div 
            onClick={onOpenBudgetsHub}
            className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] group"
          >
            <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1 truncate">
                {formattedBudget}
              </span>
              <span className="text-[10px] text-[#64748B] font-medium block truncate">
                Total Budget
              </span>
            </div>
            <span className="text-[10px] text-[#10A976] font-semibold bg-[#E9F9F3] px-1.5 py-0.5 rounded-full w-fit max-w-full truncate">
              {projects.length} sites
            </span>
          </div>

          <div 
            onClick={onOpenBudgetsHub}
            className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] group"
          >
            <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1 truncate">
                {formattedSpend}
              </span>
              <span className="text-[10px] text-[#64748B] font-medium block truncate">
                Spend to Date
              </span>
            </div>
            <span className="text-[10px] text-[#1677FF] font-semibold bg-[#EAF3FF] px-1.5 py-0.5 rounded-full w-fit max-w-full truncate">
              {Math.round((totalSpend / (totalBudget || 1)) * 100)}% utilized
            </span>
          </div>

          <div 
            onClick={onOpenProjects}
            className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] group"
          >
            <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1 truncate">
                {projects.length} Sites
              </span>
              <span className="text-[10px] text-[#64748B] font-medium block truncate">
                Active Projects
              </span>
            </div>
            <span className="text-[10px] text-[#10A976] font-semibold bg-[#E9F9F3] px-1.5 py-0.5 rounded-full w-fit max-w-full truncate">
              100% on schedule
            </span>
          </div>
        </div>

        {/* Executive Capital Health Card */}
        <div 
          onClick={onOpenBudgetsHub}
          className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#1677FF]/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Executive Capital Balance</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Protected</span>
            </div>
            <h3 className="text-xl font-black text-[#0F172A] mt-1 leading-none">$34,850,000</h3>
            <p className="text-xs text-[#64748B] mt-1.5 leading-snug">
              $16.8M Paid (48%) · $12.1M Committed · $5.95M Contingency reserve
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>

        {/* Latti AI Executive Briefing */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1677FF]" />
              <span className="text-xs font-bold text-[#1677FF]">Latti Executive Briefing</span>
            </div>
            <button onClick={() => onOpenLatti()} className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5">
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Snell Isle concrete costs are running 8% (+$14,200) over budget due to revised pier depths. Thursday rainfall threatens exterior concrete cure. All other job sites are tracking within contingency thresholds.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button 
              onClick={() => onOpenBudgetsHub ? onOpenBudgetsHub() : null}
              className="h-7 px-3 rounded-full bg-[#F5F9FF] border border-[#EAF3FF] text-xs font-semibold text-[#1677FF] flex items-center gap-1.5 hover:bg-[#EAF3FF] transition-all cursor-pointer"
            >
              <DollarSign className="w-3 h-3" />
              <span>Inspect Budget Risks</span>
            </button>
            <button 
              onClick={() => onOpenLatti("Show owner risk analysis")}
              className="h-7 px-3 rounded-full bg-[#F5F9FF] border border-[#EAF3FF] text-xs font-semibold text-[#1677FF] flex items-center gap-1.5 hover:bg-[#EAF3FF] transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>

        {/* Active Projects Multi-Site Rollup */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">Active Job Sites</h2>
            <button onClick={onOpenProjects} className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5">
              <span>See all ({projects.length})</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={() => onSelectProject(p)}
              />
            ))}
          </div>
        </div>

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. PROJECT MANAGER DASHBOARD (Sarah Johnson)
  // ─────────────────────────────────────────────────────────────
  if (currentRole === 'pm') {
    return (
      <div className="w-full flex-1 flex flex-col gap-4 px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
        
        {/* Context Bar */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">
              Project Delivery & Milestones
            </span>
          </div>
          <span className="text-xs font-semibold text-[#64748B]">{todayDateFormatted}</span>
        </div>

        {/* 3 PM Operational KPIs */}
        <div className="grid grid-cols-3 gap-2.5">
          <div 
            onClick={onOpenTasks}
            className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] group"
          >
            <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1 truncate">
                {activeTasks.length} Tasks
              </span>
              <span className="text-[10px] text-[#64748B] font-medium block truncate">
                Due This Week
              </span>
            </div>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full w-fit max-w-full truncate ${
              overdueTasksCount > 0 ? 'bg-[#FFF0F0] text-[#E5484D]' : 'bg-[#E9F9F3] text-[#10A976]'
            }`}>
              {overdueTasksCount > 0 ? `${overdueTasksCount} overdue` : 'On track'}
            </span>
          </div>

          <div 
            onClick={() => onOpenCalendar ? onOpenCalendar('2026-09-06') : onOpenTasks()}
            className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] group"
          >
            <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1 truncate">
                3 Milestones
              </span>
              <span className="text-[10px] text-[#64748B] font-medium block truncate">
                Critical Path
              </span>
            </div>
            <span className="text-[10px] text-[#1677FF] font-semibold bg-[#EAF3FF] px-1.5 py-0.5 rounded-full w-fit max-w-full truncate">
              Next: Tomorrow
            </span>
          </div>

          <div 
            onClick={onOpenProjects}
            className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] group"
          >
            <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1 truncate">
                4 Submittals
              </span>
              <span className="text-[10px] text-[#64748B] font-medium block truncate">
                Open Reviews
              </span>
            </div>
            <span className="text-[10px] text-[#F59E0B] font-semibold bg-[#FFF7E6] px-1.5 py-0.5 rounded-full w-fit max-w-full truncate">
              2 Awaiting PM
            </span>
          </div>
        </div>

        {/* Milestone Focus Alert */}
        <div 
          onClick={() => onOpenCalendar ? onOpenCalendar('2026-09-06') : onOpenTasks()}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#1677FF] to-[#0958D9] text-white shadow-card cursor-pointer hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Tomorrow · 10:00 AM
            </span>
            <span className="text-xs font-semibold text-white/90">Snell Isle Residence</span>
          </div>
          <h3 className="text-base font-bold mt-2 leading-tight">
            City Structural Framing & Shear Inspection
          </h3>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Inspector Frank Rodriguez confirmed. Checklist is 92% complete. Hurricane strap schedule pending final verification.
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2.5 text-xs font-semibold">
            <span>View Inspection Checklist</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Today's Schedule & Action Items */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">Today's Field Agenda</h2>
            <button onClick={() => onOpenCalendar ? onOpenCalendar() : onOpenTasks()} className="text-xs font-semibold text-[#1677FF] hover:underline">
              Full Schedule
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden divide-y divide-[#F1F5F9]">
            {[
              { time: '10:00 AM', title: 'Pre-Pour Rebar Walkthrough', loc: 'Snell Isle · Grid A-D', badge: 'Completed', color: 'text-emerald-600 bg-emerald-50' },
              { time: '01:30 PM', title: 'MEP Coordination Sub-Tier Meeting', loc: 'Virtual / Field Office', badge: 'In Progress', color: 'text-blue-600 bg-blue-50' },
              { time: '04:00 PM', title: 'Submittal Sign-off: Impact Glazing', loc: 'Downtown Tower', badge: 'Pending', color: 'text-amber-600 bg-amber-50' },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-[#64748B] w-16 shrink-0">{item.time}</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#0F172A] truncate">{item.title}</h4>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">{item.loc}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.color}`}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">Active Projects</h2>
            <button onClick={onOpenProjects} className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5">
              <span>See all ({projects.length})</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={() => onSelectProject(p)}
              />
            ))}
          </div>
        </div>

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────
  // 3. FINANCE / CONTROLLER DASHBOARD & PROJECT USER FLOW (Michael Chang)
  // ─────────────────────────────────────────────────────────────
  if (currentRole === 'finance') {
    // Filter projects according to financial status
    const filteredFinanceProjects = projects.filter(p => {
      if (financeProjectFilter === 'variance') {
        return p.id === 'proj-1' || p.id === 'proj-2';
      }
      if (financeProjectFilter === 'draws') {
        return p.id === 'proj-1' || p.id === 'proj-3';
      }
      return true;
    });

    const triggerFinanceToast = (msg: string) => {
      setFinanceToast(msg);
      setTimeout(() => setFinanceToast(null), 3000);
    };

    return (
      <div className="w-full flex-1 flex flex-col gap-4 px-4 sm:px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
        
        {/* Floating Finance Action Toast */}
        {financeToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{financeToast}</span>
          </div>
        )}

        {/* ── Header Context Bar ── */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-50 shrink-0" />
            <div>
              <span className="text-[11px] text-[#0F172A] font-bold uppercase tracking-wider block leading-tight">
                Capital Control & Job Costing
              </span>
              <span className="text-[10px] text-[#64748B] font-medium">AIA G702 Cycle · Sep 2026</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#64748B]">{todayDateFormatted}</span>
        </div>

        {/* ── 1. PORTFOLIO CAPITAL ALLOCATION HERO MATRIX ── */}
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white rounded-3xl p-5 shadow-xl border border-slate-800 relative overflow-hidden">
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300">Portfolio Capital Committed</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              4 Active Contracts
            </span>
          </div>

          <div className="mt-3 relative z-10">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                $34,850,000
              </span>
              <span className="text-xs font-bold text-emerald-400">
                $16.82M Invoiced (48.3%)
              </span>
            </div>

            {/* Tri-Tone Capital Progress Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex gap-0.5 mt-2.5 p-0.5 border border-slate-700">
              <div className="h-full bg-emerald-500 rounded-l-full transition-all duration-500" style={{ width: '40.7%' }} title="Paid & Disbursed: $14.2M" />
              <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: '7.6%' }} title="Pending Review: $2.62M" />
              <div className="h-full bg-slate-700 rounded-r-full transition-all duration-500" style={{ width: '51.7%' }} title="Unbilled Balance: $18.03M" />
            </div>

            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Disbursed $14.2M
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> In Review $2.62M
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" /> Unbilled $18.0M
              </span>
            </div>
          </div>

          {/* 3 Capital Vitals Strip */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-700/80 relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium">Retainage Escrow</span>
              <span className="text-sm font-bold text-white mt-0.5 tracking-tight">$1,240,000</span>
              <span className="text-[9px] text-emerald-400 font-semibold">10% Standard Held</span>
            </div>
            <div className="flex flex-col border-x border-slate-700/80 px-2">
              <span className="text-[10px] text-slate-400 font-medium">30-Day Outflow</span>
              <span className="text-sm font-bold text-amber-300 mt-0.5 tracking-tight">$890,000</span>
              <span className="text-[9px] text-slate-400 font-semibold">Draw #4 Anticipated</span>
            </div>
            <div className="flex flex-col pl-1">
              <span className="text-[10px] text-slate-400 font-medium">Contingency Pool</span>
              <span className="text-sm font-bold text-white mt-0.5 tracking-tight">$1,450,000</span>
              <span className="text-[9px] text-emerald-400 font-semibold">92% Unbroken</span>
            </div>
          </div>
        </div>

        {/* ── 2. QUICK ACTIONS TRIO ── */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onOpenApprovePayApp}
            className="p-3 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1677FF] hover:bg-[#F8FAFC] flex flex-col items-center justify-center text-center gap-1.5 shadow-xs transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0F172A] leading-tight">Pay Application</span>
            <span className="text-[9px] font-semibold text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-full">3 Pending</span>
          </button>

          <button
            onClick={onOpenLienWaiver}
            className="p-3 rounded-2xl bg-white border border-[#E2E8F0] hover:border-emerald-500 hover:bg-[#F8FAFC] flex flex-col items-center justify-center text-center gap-1.5 shadow-xs transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0F172A] leading-tight">Lien Waiver Audit</span>
            <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Record New</span>
          </button>

          <button
            onClick={onOpenBudgetsHub}
            className="p-3 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1677FF] hover:bg-[#F8FAFC] flex flex-col items-center justify-center text-center gap-1.5 shadow-xs transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0F172A] leading-tight">CSI MasterFormat</span>
            <span className="text-[9px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">50 Divisions</span>
          </button>
        </div>

        {/* ── 3. PROJECT FINANCIAL USER FLOW (Active Projects with Financial Health) ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">Project Financial Portfolios</h2>
              <p className="text-[11px] text-[#64748B]">Tap any project to inspect budget & cost code ledgers</p>
            </div>
            <button 
              onClick={onOpenProjects}
              className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5"
            >
              <span>See all ({projects.length})</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
            <button
              onClick={() => setFinanceProjectFilter('all')}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                financeProjectFilter === 'all'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setFinanceProjectFilter('variance')}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                financeProjectFilter === 'variance'
                  ? 'bg-white text-[#EF4444] shadow-xs'
                  : 'text-[#64748B] hover:text-[#EF4444]'
              }`}
            >
              Cost Alerts (2)
            </button>
            <button
              onClick={() => setFinanceProjectFilter('draws')}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                financeProjectFilter === 'draws'
                  ? 'bg-white text-[#1677FF] shadow-xs'
                  : 'text-[#64748B] hover:text-[#1677FF]'
              }`}
            >
              Active Draws (2)
            </button>
          </div>

          {/* Dedicated Project Financial Cards List */}
          <div className="flex flex-col gap-3">
            {filteredFinanceProjects.map((proj) => {
              const totalB = proj.budget?.total || 10500000;
              const spentB = proj.budget?.actual || proj.budget?.paid || Math.round(totalB * 0.49);
              const pct = Math.min(100, Math.round((spentB / totalB) * 100));

              // Specific financial profile per project
              let varianceLabel = 'On Plan (±0.0%)';
              let varianceBadgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
              let drawInfo = 'Draw #2: Approved ($380K)';
              let lienStatus = '100% Lien Waivers On File ✓';

              if (proj.id === 'proj-1') {
                varianceLabel = '+$14.2K Over (Div 03 Concrete)';
                varianceBadgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                drawInfo = 'Draw #4: $410K Pending Inspection';
                lienStatus = '12/12 Waivers Cleared ✓';
              } else if (proj.id === 'proj-2') {
                varianceLabel = '-$8.5K Under (Div 06 Framing)';
                varianceBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                drawInfo = 'Draw #3: $520K Funded';
                lienStatus = '8/8 Waivers Cleared ✓';
              } else if (proj.id === 'proj-3') {
                varianceLabel = 'On Target (0.2% Contingency)';
                varianceBadgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                drawInfo = 'Draw #1: $290K Funded';
                lienStatus = '1 Pending Sub Waiver';
              }

              return (
                <div 
                  key={proj.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#1677FF]/50 shadow-card p-4 transition-all duration-200 flex flex-col gap-3 group"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 
                          onClick={() => onOpenBudget ? onOpenBudget(proj) : onSelectProject(proj)}
                          className="text-sm font-bold text-[#0F172A] hover:text-[#1677FF] cursor-pointer truncate transition-colors"
                        >
                          {proj.name}
                        </h3>
                        <span className="text-[10px] font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md shrink-0">
                          {proj.code || 'JOB-101'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate mt-0.5">{proj.location} · {proj.clientName || 'Private Client'}</p>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${varianceBadgeClass}`}>
                      {varianceLabel}
                    </span>
                  </div>

                  {/* Financial Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#64748B]">Invoiced to Date:</span>
                      <span className="text-[#0F172A] font-bold">
                        ${(spentB / 1000000).toFixed(2)}M <span className="text-[#64748B] font-normal">/ ${(totalB / 1000000).toFixed(2)}M</span> ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          proj.id === 'proj-1' ? 'bg-rose-500' : 'bg-[#1677FF]'
                        }`}
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                  </div>

                  {/* Vitals Strip */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F1F5F9] text-[11px]">
                    <div className="flex items-center gap-1.5 text-[#0F172A] truncate">
                      <Receipt className="w-3.5 h-3.5 text-[#1677FF] shrink-0" />
                      <span className="font-semibold truncate">{drawInfo}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#0F172A] truncate justify-end">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-emerald-700 truncate">{lienStatus}</span>
                    </div>
                  </div>

                  {/* Direct Finance User Flow Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onOpenBudget ? onOpenBudget(proj) : onSelectProject(proj)}
                      className="h-9 px-3 rounded-xl bg-[#EAF3FF] hover:bg-[#dbeafe] text-[#1677FF] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Inspect Budget</span>
                    </button>

                    <button
                      onClick={onOpenApprovePayApp}
                      className="h-9 px-3 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#1677FF] hover:text-[#1677FF] text-[#0F172A] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Review Pay App</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 4. TRADE INVOICE APPROVAL QUEUE (Accounts Payable) ── */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">Trade Invoices Needing Approval</h2>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                3 Pending
              </span>
            </div>
            <button onClick={onOpenBudgetsHub} className="text-xs font-semibold text-[#1677FF] hover:underline">
              Ledger Hub
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden divide-y divide-[#F1F5F9]">
            {[
              { id: 'inv-1', vendor: 'Apex Concrete Masters', amount: '$84,200', desc: 'Pay App #04 · STEM Walls & Footings', date: 'Due Sep 8', lien: 'Conditional Lien Attached' },
              { id: 'inv-2', vendor: '84 Lumber Building Materials', amount: '$36,500', desc: 'Package delivery #2 · Framing lumber', date: 'Due Sep 10', lien: 'Lien Waiver Verified ✓' },
              { id: 'inv-3', vendor: 'Sunbelt Equipment Rentals', amount: '$12,400', desc: '50-Ton Mobile Crane rental', date: 'Due Sep 12', lien: 'Awaiting Sub Waiver' },
            ].map((inv) => {
              const isApproved = approvedInvoices.includes(inv.id);
              return (
                <div key={inv.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#0F172A] truncate">{inv.vendor}</h4>
                      <span className="text-xs font-black text-[#0F172A]">{inv.amount}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {inv.desc} · <span className="text-[#D97706] font-medium">{inv.date}</span>
                    </p>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {inv.lien}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={onOpenApprovePayApp}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        if (!isApproved) {
                          setApprovedInvoices(prev => [...prev, inv.id]);
                          triggerFinanceToast(`Invoice from ${inv.vendor} approved for payment!`);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 ${
                        isApproved 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default' 
                          : 'bg-[#1677FF] hover:bg-[#0958D9] text-white shadow-xs'
                      }`}
                    >
                      {isApproved ? 'Approved ✓' : 'Approve'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 5. FLAGSHIP AIA G702 / G703 DRAW PROGRESSION (Snell Isle) ── */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#0F172A]">AIA G702 Draw Schedule (Snell Isle)</h3>
                <p className="text-[10px] text-[#64748B]">Commercial Bank Loan Draw Progression</p>
              </div>
            </div>
            <button
              onClick={() => triggerFinanceToast('G702 Application PDF exported to downloads!')}
              className="text-xs font-bold text-[#1677FF] hover:underline flex items-center gap-1"
            >
              <span>Export G702 PDF</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1 pt-2 border-t border-[#F1F5F9]">
            {[
              { num: 'Draw 1', amt: '$480K', status: 'Funded', color: 'bg-emerald-500' },
              { num: 'Draw 2', amt: '$620K', status: 'Funded', color: 'bg-emerald-500' },
              { num: 'Draw 3', amt: '$750K', status: 'Funded', color: 'bg-emerald-500' },
              { num: 'Draw 4', amt: '$410K', status: 'In Review', color: 'bg-amber-400 ring-2 ring-amber-200 animate-pulse' },
              { num: 'Draw 5', amt: '$890K', status: 'Pending', color: 'bg-slate-200' },
            ].map((draw, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-1.5 rounded-xl bg-[#F8FAFC]">
                <div className={`w-3 h-3 rounded-full mb-1 ${draw.color}`} />
                <span className="text-[10px] font-bold text-[#0F172A]">{draw.num}</span>
                <span className="text-[9px] font-extrabold text-[#1677FF] mt-0.5">{draw.amt}</span>
                <span className="text-[8px] text-[#64748B] font-medium mt-0.5">{draw.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. CSI MASTERFORMAT DIVISION WATCHLIST ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">CSI Division Variance Tracking</h2>
            <button onClick={onOpenBudgetsHub} className="text-xs font-semibold text-[#1677FF] hover:underline">
              All Divisions
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { code: 'Div 03', name: 'Concrete', est: '$480K', variance: '+$14.2K', isOver: true, note: 'Pier amendment' },
              { code: 'Div 06', name: 'Wood & Plastics', est: '$650K', variance: '-$8.5K', isOver: false, note: 'Lumber savings' },
              { code: 'Div 05', name: 'Metals & Steel', est: '$120K', variance: '-$2.0K', isOver: false, note: 'Rebar lock' },
              { code: 'Div 26', name: 'Electrical', est: '$380K', variance: '$0.0K', isOver: null, note: 'On budget' },
            ].map((d, i) => (
              <div key={i} className="p-3 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#64748B]">{d.code}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                    d.isOver === true ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    d.isOver === false ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}>
                    {d.variance}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#0F172A] mt-1 truncate">{d.name}</h4>
                <p className="text-[10px] text-[#64748B] mt-0.5 truncate">Est: {d.est} · {d.note}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 4. FIELD SUPERINTENDENT DASHBOARD (John Smith)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      
      {/* Context Bar */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">
            Jobsite Command & Safety
          </span>
        </div>
        <span className="text-xs font-semibold text-[#64748B]">{todayDateFormatted}</span>
      </div>

      {/* 3 Field KPIs */}
      <div className="grid grid-cols-3 gap-2.5">
        <div 
          onClick={onOpenDailyLogs}
          className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] group"
        >
          <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1 truncate">
              24 Workers
            </span>
            <span className="text-[10px] text-[#64748B] font-medium block truncate">
              On Site Today
            </span>
          </div>
          <span className="text-[10px] text-[#10A976] font-semibold bg-[#E9F9F3] px-1.5 py-0.5 rounded-full w-fit max-w-full truncate">
            2 Trade Crews
          </span>
        </div>

        <div 
          onClick={onOpenDailyLogs}
          className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] group"
        >
          <div className="w-6 h-6 rounded-md bg-[#FFF7E6] text-[#D97706] flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1 truncate">
              Daily Log
            </span>
            <span className="text-[10px] text-[#64748B] font-medium block truncate">
              Due 4:30 PM
            </span>
          </div>
          <span className="text-[10px] text-[#D97706] font-semibold bg-[#FFF7E6] px-1.5 py-0.5 rounded-full w-fit max-w-full truncate">
            In Progress
          </span>
        </div>

        <div 
          onClick={onOpenTasks}
          className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] group"
        >
          <div className="w-6 h-6 rounded-md bg-[#E9F9F3] text-[#10A976] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1 truncate">
              0 Incidents
            </span>
            <span className="text-[10px] text-[#64748B] font-medium block truncate">
              Safety Record
            </span>
          </div>
          <span className="text-[10px] text-[#10A976] font-semibold bg-[#E9F9F3] px-1.5 py-0.5 rounded-full w-fit max-w-full truncate">
            142 Days Clean
          </span>
        </div>
      </div>

      {/* Hero Field Daily Log Card */}
      <div 
        onClick={onOpenDailyLogs}
        className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#1677FF]/50 transition-all cursor-pointer flex flex-col gap-2.5 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1677FF]" />
            <span className="text-xs font-bold text-[#0F172A]">Snell Isle Today's Field Log (Sep 5)</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Drafting</span>
        </div>
        <p className="text-xs text-[#475569] leading-relaxed">
          Logged 24 workers, 2 material deliveries (84 Lumber package), and 4 site progress photos. Ready for end-of-day superintendent sign-off.
        </p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenDailyLogs) onOpenDailyLogs();
          }}
          className="w-full py-2 px-3 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all mt-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Open & Complete Today's Daily Log</span>
        </button>
      </div>

      {/* Site Weather Radar & Thursday Storm Alert */}
      <div 
        onClick={() => setIsWeatherModalOpen(true)}
        className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] shadow-card flex items-start gap-3 cursor-pointer hover:bg-[#FEF3C7] transition-all"
      >
        <div className="w-8 h-8 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 mt-0.5">
          <CloudRain className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#92400E]">Thursday Pour Weather Threat</h3>
            <span className="text-[10px] font-bold text-[#92400E]">85% Rain</span>
          </div>
          <p className="text-xs text-[#B45309] mt-0.5 leading-relaxed">
            Radar projects 0.85 in/hr rain in Tampa between 1:00 PM and 6:00 PM. Concrete cure will fail without tarp coverage. Recommend rescheduling pour to Friday morning.
          </p>
        </div>
      </div>

      {/* Active Subcontractors on Site */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">Active Trade Crews On Site</h2>
          <span className="text-xs text-[#64748B]">24 Total Crew</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden divide-y divide-[#F1F5F9]">
          {[
            { trade: 'Structural Framing', sub: 'Apex Concrete Masters', crew: 14, lead: 'Marcus Rivera', phone: '+1 (555) 304-2849' },
            { trade: 'Electrical & MEP', sub: 'Prime Electrical & Mechanical', crew: 10, lead: 'Dave K.', phone: '+1 (555) 491-9201' },
          ].map((c, idx) => (
            <div key={idx} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#0F172A] truncate">{c.trade}</h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700">{c.crew} crew</span>
                </div>
                <p className="text-[11px] text-[#64748B] truncate mt-0.5">{c.sub} · Lead: {c.lead}</p>
              </div>

              <a 
                href={`tel:${c.phone}`}
                className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center hover:bg-[#1677FF] hover:text-white transition-all shrink-0 shadow-xs"
                title={`Call ${c.lead}`}
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

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

    </div>
  );
};
