import React, { useState, useMemo } from 'react';
import { Project, Task, UserRole } from '../../types';
import { 
  CheckSquare, Calendar, DollarSign, CloudRain, Sparkles, 
  ArrowRight, FileText, TrendingUp, Cloud, AlertCircle, 
  ChevronRight, Building2, HardHat, ShieldCheck, Users,
  Clock, AlertTriangle, Phone, CheckCircle2, ChevronDown,
  Layers, Hammer, FileSpreadsheet, Eye, Plus, Wrench
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
  currentRole = 'admin',
}) => {
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [approvedInvoices, setApprovedInvoices] = useState<string[]>([]);
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
  // 3. FINANCE / BUDGET MANAGER DASHBOARD (Michael Chang)
  // ─────────────────────────────────────────────────────────────
  if (currentRole === 'finance') {
    return (
      <div className="w-full flex-1 flex flex-col gap-4 px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
        
        {/* Context Bar */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider">
              Draws, Invoices & Job Cost Accounting
            </span>
          </div>
          <span className="text-xs font-semibold text-[#64748B]">{todayDateFormatted}</span>
        </div>

        {/* 3 Finance KPIs */}
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
                $16.8M
              </span>
              <span className="text-[10px] text-[#64748B] font-medium block truncate">
                Spend Invoiced
              </span>
            </div>
            <span className="text-[10px] text-[#10A976] font-semibold bg-[#E9F9F3] px-1.5 py-0.5 rounded-full w-fit max-w-full truncate">
              48% of Budget
            </span>
          </div>

          <div 
            onClick={onOpenBudgetsHub}
            className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] group"
          >
            <div className="w-6 h-6 rounded-md bg-[#FFF7E6] text-[#D97706] flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-base font-bold text-[#0F172A] block leading-tight mt-1 truncate">
                $245,000
              </span>
              <span className="text-[10px] text-[#64748B] font-medium block truncate">
                Invoices Due
              </span>
            </div>
            <span className="text-[10px] text-[#D97706] font-semibold bg-[#FFF7E6] px-1.5 py-0.5 rounded-full w-fit max-w-full truncate">
              3 Pending Review
            </span>
          </div>

          <div 
            onClick={onOpenBudgetsHub}
            className="bg-white rounded-xl border border-[#E2E8F0] p-2.5 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[96px] group"
          >
            <div className="w-6 h-6 rounded-md bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-base font-bold text-[#EF4444] block leading-tight mt-1 truncate">
                +$14.2K
              </span>
              <span className="text-[10px] text-[#64748B] font-medium block truncate">
                CSI Variance
              </span>
            </div>
            <span className="text-[10px] text-[#EF4444] font-semibold bg-[#FEF2F2] px-1.5 py-0.5 rounded-full w-fit max-w-full truncate">
              Div 03 Concrete
            </span>
          </div>
        </div>

        {/* Invoices Pending Approval */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">Trade Invoices Needing Approval</h2>
            <button onClick={onOpenBudgetsHub} className="text-xs font-semibold text-[#1677FF] hover:underline">
              Ledger Hub
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden divide-y divide-[#F1F5F9]">
            {[
              { id: 'inv-1', vendor: 'Apex Concrete Masters', amount: '$84,200', desc: 'Pay App #04 · STEM Walls pour', date: 'Due Sep 8' },
              { id: 'inv-2', vendor: '84 Lumber Building Materials', amount: '$36,500', desc: 'Package delivery #2 · Framing lumber', date: 'Due Sep 10' },
              { id: 'inv-3', vendor: 'Sunbelt Equipment Rentals', amount: '$12,400', desc: '50-Ton Mobile Crane rental', date: 'Due Sep 12' },
            ].map((inv) => {
              const isApproved = approvedInvoices.includes(inv.id);
              return (
                <div key={inv.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#0F172A] truncate">{inv.vendor}</h4>
                      <span className="text-xs font-black text-[#0F172A]">{inv.amount}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">{inv.desc} · <span className="text-[#D97706] font-medium">{inv.date}</span></p>
                  </div>

                  <button
                    onClick={() => {
                      if (!isApproved) {
                        setApprovedInvoices(prev => [...prev, inv.id]);
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
              );
            })}
          </div>
        </div>

        {/* Cash Flow & Draws Status Card */}
        <div 
          onClick={onOpenBudgetsHub}
          className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#1677FF]/40 transition-all cursor-pointer flex items-center justify-between gap-3"
        >
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">AIA G702 / G703 Draw Schedule</span>
            <h3 className="text-sm font-bold text-[#0F172A] mt-0.5">Draw #4 Invoiced: $410,000</h3>
            <p className="text-xs text-[#64748B] mt-1">Lender inspection approved. $1.2M retainage held in escrow.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#94A3B8]" />
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
