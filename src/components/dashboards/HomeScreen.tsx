import React, { useState, useMemo } from 'react';
import { Project, Task, UserRole, DailyLogItem, PunchItem, ChangeOrder, Subcontractor } from '../../types';
import { 
  CheckSquare, Calendar, DollarSign, CloudRain, Sparkles, 
  ArrowRight, FileText, TrendingUp, Cloud, AlertCircle, 
  ChevronRight, Building2, HardHat, ShieldCheck, Users,
  Clock, AlertTriangle, Phone, CheckCircle2, ChevronDown,
  Layers, Hammer, FileSpreadsheet, Eye, Plus, Wrench,
  Landmark, Receipt, FileCheck, ArrowUpRight, Check, Info, Sun, X
} from 'lucide-react';
import { ProjectCard } from '../common/ProjectCard';
import { WeatherImpactModal } from '../modals/WeatherImpactModal';
import { ProjectManagerDashboard } from './ProjectManagerDashboard';

interface HomeScreenProps {
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
  onOpenBudget?: (project: Project) => void;
  onOpenBudgetsHub?: () => void;
  onOpenDailyLogs?: () => void;
  onOpenPunchList?: () => void;
  onOpenApprovePayApp?: () => void;
  onOpenLienWaiver?: () => void;
  onCreateTask?: () => void;
  onCreatePunch?: () => void;
  onCreateChangeOrder?: () => void;
  currentRole?: UserRole;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
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
  onOpenBudget,
  onOpenBudgetsHub,
  onOpenDailyLogs,
  onOpenPunchList,
  onOpenApprovePayApp,
  onOpenLienWaiver,
  onCreateTask,
  onCreatePunch,
  onCreateChangeOrder,
  currentRole = 'admin',
}) => {
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isRiskAuditModalOpen, setIsRiskAuditModalOpen] = useState(false);
  const [isInspectionListModalOpen, setIsInspectionListModalOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<{ id: string; trade: string; count: string; task: string; status: string; foreman: string; phone: string; zone: string; safetyTailgate: boolean } | null>(null);
  const [financeProjectFilter, setFinanceProjectFilter] = useState<'all' | 'variance' | 'draws'>('all');
  const [financeToast, setFinanceToast] = useState<string | null>(null);
  const [checkedFieldPunch, setCheckedFieldPunch] = useState<string[]>(['c-1', 'c-2', 'c-3']);
  const [fieldToast, setFieldToast] = useState<string | null>(null);
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
        
        {/* Today's Operational Focus & Site Pulse */}
        <div 
          onClick={() => onSelectProject(snellProject)}
          className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#DCE8F8] bg-gradient-to-r from-[#EAF3FF] via-[#F4F8FF] to-white p-4 sm:p-5 shadow-xs hover:border-[#1677FF]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between gap-3">
            {/* Left: Today's Focus & Live Headcount */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-full">
                  Today's Focus
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#10A976]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10A976] animate-pulse" />
                  94 on site
                </span>
              </div>

              <div className="mt-1.5">
                <h2 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors tracking-tight truncate leading-snug">
                  Second Floor Framing & Joists
                </h2>
                <p className="text-xs text-[#64748B] font-medium mt-0.5 truncate leading-snug">
                  Snell Isle Residence · 24 Trade Crew on Site
                </p>
              </div>
            </div>

            {/* Right: Date & Weather */}
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
                title="View weather radar & delay impact"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span className="font-bold text-[#0F172A]">82°F</span>
                <span className="text-[#64748B] text-[11px]">Sunny</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Executive KPIs */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          <div 
            onClick={onOpenBudgetsHub}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
                Total Budget
              </span>
              <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
                {formattedBudget}
              </span>
            </div>
          </div>

          <div 
            onClick={onOpenBudgetsHub}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
                Spend to Date
              </span>
              <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
                {formattedSpend}
              </span>
            </div>
          </div>

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
        </div>

        {/* Latti AI Executive Briefing */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1677FF]" />
              <span className="text-sm font-bold text-[#1677FF]">Latti Briefing</span>
            </div>
            <button 
              onClick={() => onOpenLatti()} 
              className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0]/70 rounded-2xl p-3.5">
            <p className="text-xs text-[#334155] leading-relaxed font-normal">
              Snell Isle concrete costs are running 8% (+$14,200) over budget due to revised pier depths. Thursday rainfall threatens exterior concrete cure. All other projects are tracking within contingency thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <button 
              onClick={() => setIsRiskAuditModalOpen(true)}
              className="h-8 px-3.5 rounded-full bg-[#F1F6FE] hover:bg-[#E5EFFF] border border-[#DCE8F8] text-xs font-semibold text-[#1677FF] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Inspect Budget Risks</span>
            </button>
            <button 
              onClick={() => onOpenLatti("Show owner risk analysis")}
              className="h-8 px-3.5 rounded-full bg-[#F1F6FE] hover:bg-[#E5EFFF] border border-[#DCE8F8] text-xs font-semibold text-[#1677FF] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>

        {/* Active Projects Multi-Project Rollup */}
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

        {/* Weather Impact Modal */}
        {isWeatherModalOpen && (
          <WeatherImpactModal
            isOpen={isWeatherModalOpen}
            onClose={() => setIsWeatherModalOpen(false)}
            project={snellProject}
          />
        )}

        {/* Executive Risk Audit Modal */}
        {isRiskAuditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#F1F5F9] flex items-center justify-between bg-gradient-to-r from-[#F8FAFC] to-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF7E6] text-[#D97706] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] leading-tight">Executive Risk Audit</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">Snell Isle Residence · Phase 2 Variance</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsRiskAuditModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0] text-center">
                    <span className="text-[10px] text-[#64748B] font-semibold block uppercase">CSI Code</span>
                    <span className="text-xs font-bold text-[#0F172A] mt-0.5 block">03 30 00</span>
                  </div>
                  <div className="bg-[#FFF0F0] p-2.5 rounded-xl border border-[#FEE2E2] text-center">
                    <span className="text-[10px] text-[#E5484D] font-semibold block uppercase">Variance</span>
                    <span className="text-xs font-bold text-[#E5484D] mt-0.5 block">+$14,200 (+8%)</span>
                  </div>
                  <div className="bg-[#E9F9F3] p-2.5 rounded-xl border border-[#D1FADF] text-center">
                    <span className="text-[10px] text-[#10A976] font-semibold block uppercase">Contingency</span>
                    <span className="text-xs font-bold text-[#10A976] mt-0.5 block">$185k Reserve</span>
                  </div>
                </div>

                {/* Audit Narrative */}
                <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-[#E2E8F0] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1677FF] block">
                    Root Cause Analysis
                  </span>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    Cast-in-Place concrete pier depths were revised from 18ft to 24ft due to waterfront sandy subsoil conditions. 6 additional helical micropiles were installed to reach load-bearing limestone.
                  </p>
                </div>

                {/* Mitigation & Protection */}
                <div className="bg-[#EAF3FF]/40 rounded-2xl p-3.5 border border-[#DCE8F8] space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1677FF]" />
                    <span className="text-xs font-bold text-[#1677FF]">Contingency Absorption</span>
                  </div>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    This $14,200 variance is 100% absorbed by Snell Isle Phase 1 contingency savings ($185,000 available). Owner capital balance remains fully protected with zero schedule slippage.
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsRiskAuditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#E2E8F0]/60 transition-all cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setIsRiskAuditModalOpen(false);
                    if (onOpenBudgetsHub) onOpenBudgetsHub();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1677FF] hover:bg-[#0F5FD7] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Inspect Budget Ledger</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. PROJECT MANAGER DASHBOARD (Sarah Johnson - 10 Yrs Experience)
  // ─────────────────────────────────────────────────────────────
  if (currentRole === 'pm') {
    return (
      <ProjectManagerDashboard
        projects={projects}
        tasks={tasks}
        dailyLogs={dailyLogs}
        punchItems={punchItems}
        changeOrders={changeOrders}
        subcontractors={subcontractors}
        onSelectProject={onSelectProject}
        onOpenProjects={onOpenProjects}
        onOpenLatti={onOpenLatti}
        onOpenTask={onOpenTask}
        onOpenTasks={onOpenTasks}
        onOpenCalendar={onOpenCalendar}
        onOpenDailyLogs={onOpenDailyLogs}
        onOpenPunchList={onOpenPunchList}
        onCreateTask={onCreateTask}
        onCreatePunch={onCreatePunch}
        onCreateChangeOrder={onCreateChangeOrder}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. FINANCE DIRECTOR DASHBOARD (Michael Chang)
  // ─────────────────────────────────────────────────────────────
  if (currentRole === 'finance') {
    return (
      <div className="w-full flex-1 flex flex-col gap-4 px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
        
        {/* Toast Notification */}
        {financeToast && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-slate-700 animate-slide-in">
            <CheckCircle2 className="w-4 h-4 text-[#10A976]" />
            <span>{financeToast}</span>
          </div>
        )}

        {/* ── 1. HERO CARD: ACTIVE PROJECT BUDGET FOCUS ── */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#DCE8F8] bg-gradient-to-r from-[#EAF3FF] via-[#F4F8FF] to-white p-4 sm:p-5 shadow-xs hover:border-[#1677FF]/40 transition-all group">
          <div className="flex items-start justify-between gap-3">
            <button
              type="button"
              onClick={() => onOpenBudget ? onOpenBudget(snellProject) : onOpenProjects()}
              className="min-w-0 flex-1 text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                  Today's Focus
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1677FF] whitespace-nowrap shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-pulse" />
                  Portfolio Active
                </span>
              </div>

              <div className="mt-1.5">
                <h2 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors tracking-tight truncate leading-snug">
                  Snell Isle Residence
                </h2>
                <p className="text-xs text-[#64748B] font-medium mt-0.5 truncate leading-snug">
                  Budget: ${(snellProject.budget.total / 1000000).toFixed(2)}M · Spend: ${(snellProject.budget.actual / 1000000).toFixed(2)}M ({snellProject.progress}% Progress)
                </p>
              </div>
            </button>

            <div className="flex flex-col items-end shrink-0">
              <span className="text-xs font-semibold text-[#0F172A]">
                {todayDateFormatted}
              </span>
              <button
                type="button"
                onClick={() => setIsWeatherModalOpen(true)}
                className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 hover:bg-white border border-[#DCE8F8] text-xs font-medium transition-all cursor-pointer shadow-xs active:scale-95"
                title="View site conditions"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span className="font-bold text-[#0F172A]">82°F</span>
                <span className="text-[#64748B] text-[11px]">Sunny</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. EXACT 3 FINANCE KPIS (Live Connected Portfolio Metrics) ── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onOpenBudgetsHub}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
                Total Budget
              </span>
              <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
                {formattedBudget}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenBudgetsHub}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
                Spend to Date
              </span>
              <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
                {formattedSpend}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenProjects}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group text-left"
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
          </button>
        </div>

        {/* ── 3. LATTI FINANCE BRIEFING (Pure AI Assistant Insights) ── */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1677FF]" />
              <span className="text-sm font-bold text-[#1677FF]">Latti Briefing</span>
            </div>
            <button 
              onClick={() => onOpenLatti('Audit financial budget risks across active projects')} 
              className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ask Copilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0]/70 rounded-2xl p-3.5">
            <p className="text-xs text-[#334155] leading-relaxed font-normal">
              Snell Isle concrete costs are running 8% (+$14,200) over budget due to revised pier depths. All other active projects are tracking within contingency thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <button 
              onClick={() => setIsRiskAuditModalOpen(true)}
              className="h-8 px-3.5 rounded-full bg-[#F1F6FE] hover:bg-[#E5EFFF] border border-[#DCE8F8] text-xs font-semibold text-[#1677FF] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Inspect Budget Risks</span>
            </button>
            <button 
              onClick={onOpenBudgetsHub}
              className="h-8 px-3.5 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#64748B] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <DollarSign className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Budgets Hub</span>
            </button>
          </div>
        </div>

        {/* ── 4. ACTIVE PROJECTS MULTI-PROJECT ROLLUP ── */}
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

        {/* Weather Impact Modal */}
        {isWeatherModalOpen && (
          <WeatherImpactModal
            isOpen={isWeatherModalOpen}
            onClose={() => setIsWeatherModalOpen(false)}
            project={snellProject}
          />
        )}

        {/* Executive Risk Audit Modal */}
        {isRiskAuditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#F1F5F9] flex items-center justify-between bg-gradient-to-r from-[#F8FAFC] to-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF7E6] text-[#D97706] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] leading-tight">Financial Risk Audit</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">Snell Isle Residence · Phase 2 Variance</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsRiskAuditModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0] text-center">
                    <span className="text-[10px] text-[#64748B] font-semibold block uppercase">CSI Code</span>
                    <span className="text-xs font-bold text-[#0F172A] mt-0.5 block">03 30 00</span>
                  </div>
                  <div className="bg-[#FFF0F0] p-2.5 rounded-xl border border-[#FEE2E2] text-center">
                    <span className="text-[10px] text-[#E5484D] font-semibold block uppercase">Variance</span>
                    <span className="text-xs font-bold text-[#E5484D] mt-0.5 block">+$14,200 (+8%)</span>
                  </div>
                  <div className="bg-[#E9F9F3] p-2.5 rounded-xl border border-[#D1FADF] text-center">
                    <span className="text-[10px] text-[#10A976] font-semibold block uppercase">Contingency</span>
                    <span className="text-xs font-bold text-[#10A976] mt-0.5 block">$185k Reserve</span>
                  </div>
                </div>

                {/* Audit Narrative */}
                <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-[#E2E8F0] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1677FF] block">
                    Root Cause Analysis
                  </span>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    Cast-in-Place concrete pier depths were revised from 18ft to 24ft due to waterfront sandy subsoil conditions. 6 additional helical micropiles were installed to reach load-bearing limestone.
                  </p>
                </div>

                {/* Mitigation & Protection */}
                <div className="bg-[#EAF3FF]/40 rounded-2xl p-3.5 border border-[#DCE8F8] space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1677FF]" />
                    <span className="text-xs font-bold text-[#1677FF]">Contingency Absorption</span>
                  </div>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    This $14,200 variance is 100% absorbed by Snell Isle Phase 1 contingency savings ($185,000 available). Owner capital balance remains fully protected with zero schedule slippage.
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsRiskAuditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#E2E8F0]/60 transition-all cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setIsRiskAuditModalOpen(false);
                    if (onOpenBudgetsHub) onOpenBudgetsHub();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1677FF] hover:bg-[#0F5FD7] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Inspect Budget Ledger</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 4. FIELD SUPERINTENDENT DASHBOARD (John Smith)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      
      {/* Toast Notification */}
      {fieldToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-slate-700 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-[#10A976]" />
          <span>{fieldToast}</span>
        </div>
      )}
      
      {/* ── 1. HERO CARD: TODAY'S OPERATIONAL FOCUS ── */}
      <div 
        onClick={() => onSelectProject(snellProject)}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#DCE8F8] bg-gradient-to-r from-[#EAF3FF] via-[#F4F8FF] to-white p-4 sm:p-5 shadow-xs hover:border-[#1677FF]/40 transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left: Focus & Live Status */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                Today's Focus
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#10A976] whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10A976] animate-pulse" />
                24 on site · 2 Crews
              </span>
            </div>

            <div className="mt-1.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors tracking-tight truncate leading-snug">
                Framing & Wall Sheathing
              </h2>
              <p className="text-xs text-[#64748B] font-medium mt-0.5 truncate leading-snug">
                Snell Isle Residence · Level 2 Joists & Shear Panels
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
              title="View site conditions"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              <span className="font-bold text-[#0F172A]">82°F</span>
              <span className="text-[#64748B] text-[11px]">Sunny</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. EXACT 3 FIELD KPIS (Clean & Aligned with Owner Standard) ── */}
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

        {/* KPI 2: On Site Headcount */}
        <div 
          onClick={onOpenDailyLogs}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <HardHat className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
              On Site Headcount
            </span>
            <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
              24 Crew
            </span>
          </div>
        </div>

        {/* KPI 3: Site Punch List */}
        <div 
          onClick={() => setIsInspectionListModalOpen(true)}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#E9F9F3] text-[#10A976] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
              Site Punch List
            </span>
            <span className="text-base sm:text-lg font-bold text-[#10A976] block leading-tight mt-0.5 truncate">
              {checkedFieldPunch.length} / 4 Ready
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. SITE QUALITY & PUNCH LIST PROGRESS CARD (Matching Owner Standard) ── */}
      <div 
        onClick={() => setIsInspectionListModalOpen(true)}
        className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#1677FF]/40 transition-all cursor-pointer flex flex-col gap-2 group"
      >
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              JOBSITE PUNCH LIST & QUALITY
            </span>
            <Info className="w-3 h-3 text-[#94A3B8]" />
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E9F9F3] text-[#10A976]">
            {Math.round((checkedFieldPunch.length / 4) * 100)}% Verified
          </span>
        </div>

        {/* Value + Circular Arrow Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight leading-tight">
              Framing & Safety Punch Walk
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#64748B] font-medium tracking-tight mt-0.5 leading-snug truncate">
              4 Jobsite Punch Items · Snell Isle Residence
            </p>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center group-hover:bg-[#1677FF] group-hover:text-white transition-all shrink-0">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Segmented Continuous Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden flex gap-0.5 mt-0.5">
          <div 
            className="h-full bg-[#10A976] rounded-l-full transition-all duration-300" 
            style={{ width: `${Math.round((checkedFieldPunch.length / 4) * 100)}%` }} 
          />
          <div 
            className="h-full bg-[#CBD5E1] rounded-r-full" 
            style={{ width: `${100 - Math.round((checkedFieldPunch.length / 4) * 100)}%` }} 
          />
        </div>

        {/* Bar Legend */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10A976] shrink-0" />
            <span className="text-[11px] text-[#64748B] font-medium">Verified Items</span>
            <span className="text-[11px] font-bold text-[#0F172A]">{checkedFieldPunch.length} of 4</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#CBD5E1] shrink-0" />
            <span className="text-[11px] text-[#64748B] font-medium">Pending Verification</span>
            <span className="text-[11px] font-bold text-[#0F172A]">{4 - checkedFieldPunch.length} Items</span>
          </div>
        </div>
      </div>

      {/* ── 4. LATTI FIELD BRIEFING (Clean, Matching Owner Standard) ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#1677FF]" />
            <span className="text-sm font-bold text-[#1677FF]">Latti Briefing</span>
          </div>
          <button 
            onClick={() => onOpenLatti('Audit site safety and jobsite requirements')} 
            className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ask Copilot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0]/70 rounded-2xl p-3.5">
          <p className="text-xs text-[#334155] leading-relaxed font-normal">
            24 crew members logged on site across 2 active trades. {checkedFieldPunch.length} of 4 punch list items completed today. Daily field log ready for PM Sarah Johnson's review.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          <button 
            onClick={() => setIsInspectionListModalOpen(true)}
            className="h-8 px-3.5 rounded-full bg-[#E9F9F3] hover:bg-[#D1FADF] border border-[#A6F4C5] text-xs font-semibold text-[#10A976] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Punch Checklist ({checkedFieldPunch.length}/4)</span>
          </button>
          <button 
            onClick={onOpenDailyLogs}
            className="h-8 px-3.5 rounded-full bg-[#F1F6FE] hover:bg-[#E5EFFF] border border-[#DCE8F8] text-xs font-semibold text-[#1677FF] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Complete Daily Log</span>
          </button>
        </div>
      </div>

      {/* ── 6. ACTIVE PROJECTS MULTI-PROJECT ROLLUP ── */}
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

      {isWeatherModalOpen && (
        <WeatherImpactModal
          isOpen={isWeatherModalOpen}
          onClose={() => setIsWeatherModalOpen(false)}
          project={snellProject}
          onOpenDailyLog={() => {
            setIsWeatherModalOpen(false);
            if (onOpenDailyLogs) onOpenDailyLogs();
          }}
        />
      )}

      {/* Trade Crew Deployment & Safety Modal */}
      {selectedCrew && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#F1F5F9] flex items-center justify-between bg-gradient-to-r from-[#F8FAFC] to-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] leading-tight">Trade Crew Deployment</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">{selectedCrew.trade}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCrew(null)}
                className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0] text-center">
                  <span className="text-[10px] text-[#64748B] font-semibold block uppercase">Headcount</span>
                  <span className="text-xs font-bold text-[#0F172A] mt-0.5 block">{selectedCrew.count}</span>
                </div>
                <div className="bg-[#E9F9F3] p-2.5 rounded-xl border border-[#D1FADF] text-center">
                  <span className="text-[10px] text-[#10A976] font-semibold block uppercase">Site Status</span>
                  <span className="text-xs font-bold text-[#10A976] mt-0.5 block">{selectedCrew.status}</span>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0] text-center">
                  <span className="text-[10px] text-[#64748B] font-semibold block uppercase">Zone</span>
                  <span className="text-xs font-bold text-[#0F172A] mt-0.5 block truncate">{selectedCrew.zone}</span>
                </div>
              </div>

              {/* Active Scope of Work */}
              <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-[#E2E8F0] space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                  Assigned Scope of Work
                </span>
                <p className="text-xs font-semibold text-[#0F172A]">{selectedCrew.task}</p>
              </div>

              {/* Foreman Contact & Safety */}
              <div className="bg-[#EAF3FF]/40 rounded-2xl p-3.5 border border-[#DCE8F8] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1677FF]" />
                    <span className="text-xs font-bold text-[#1677FF]">Foreman & Safety Briefing</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#10A976] bg-[#E9F9F3] px-2 py-0.5 rounded-full">
                    Tailgate Verified ✓
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block">{selectedCrew.foreman}</span>
                    <span className="text-xs text-[#64748B] block">{selectedCrew.phone}</span>
                  </div>
                  <a
                    href={`tel:${selectedCrew.phone}`}
                    className="h-8 px-3 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedCrew(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#E2E8F0]/60 transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedCrew(null);
                  if (onOpenDailyLogs) onOpenDailyLogs();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1677FF] hover:bg-[#0F5FD7] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Daily Log</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspection Checklist Modal */}
      {isInspectionListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-[440px] w-full p-5 shadow-2xl border border-[#E2E8F0] flex flex-col gap-4 max-h-[90vh] overflow-hidden animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E9F9F3] text-[#10A976] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] leading-tight">Jobsite Punch & Safety Checklist</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {checkedFieldPunch.length} of 4 Items Verified · John Smith (Field Supt)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInspectionListModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Segment */}
            <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0] flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#0F172A]">Quality & Field Readiness</span>
                <span className="font-bold text-[#10A976]">
                  {Math.round((checkedFieldPunch.length / 4) * 100)}% Verified
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden flex gap-0.5">
                <div
                  className="h-full bg-[#10A976] rounded-l-full transition-all duration-300"
                  style={{ width: `${Math.round((checkedFieldPunch.length / 4) * 100)}%` }}
                />
                <div
                  className="h-full bg-[#CBD5E1] rounded-r-full"
                  style={{ width: `${100 - Math.round((checkedFieldPunch.length / 4) * 100)}%` }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9] rounded-2xl border border-[#E2E8F0]">
              {[
                {
                  id: 'c-1',
                  title: 'Simpson Strong-Tie Straps (Grid Line C-4 to C-9)',
                  desc: 'Inspect hurricane tie-downs and embed plates before drywall',
                  trade: 'Rough Carpentry',
                  location: 'Second Floor Framing'
                },
                {
                  id: 'c-2',
                  title: 'Shear Wall Edge Nailing (6" o.c. perimeter)',
                  desc: 'Verify 8d common nail spacing on external OSB shear panels',
                  trade: 'Framing Crew',
                  location: 'West Elevation Sheathing'
                },
                {
                  id: 'c-3',
                  title: 'Site Safety Perimeter & Guardrails',
                  desc: 'Check stairwell opening covers and 42" OSHA perimeter guardrails',
                  trade: 'Site Safety',
                  location: 'Floor 2 Stair Opening'
                },
                {
                  id: 'c-4',
                  title: 'Lumber Staging & Weather Covers',
                  desc: 'Ensure Floor 2 roof trusses and framing lumber are elevated and tarped',
                  trade: 'Material Logistics',
                  location: 'Ground Laydown Yard'
                }
              ].map((item) => {
                const isChecked = checkedFieldPunch.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isChecked) {
                        setCheckedFieldPunch(prev => prev.filter(x => x !== item.id));
                        setFieldToast(`Marked ${item.title.split('(')[0].trim()} as pending`);
                      } else {
                        setCheckedFieldPunch(prev => [...prev, item.id]);
                        setFieldToast(`✓ Verified: ${item.title.split('(')[0].trim()}`);
                      }
                      setTimeout(() => setFieldToast(null), 3000);
                    }}
                    className="p-3.5 flex items-start gap-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isChecked
                          ? 'bg-[#10A976] text-white'
                          : 'border-2 border-[#CBD5E1] group-hover:border-[#1677FF]'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`text-xs font-bold leading-snug transition-colors ${
                            isChecked ? 'line-through text-[#64748B]' : 'text-[#0F172A]'
                          }`}
                        >
                          {item.title}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isChecked
                              ? 'bg-[#E9F9F3] text-[#10A976]'
                              : 'bg-[#FFFBEB] text-[#D97706]'
                          }`}
                        >
                          {isChecked ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#94A3B8]">
                        <span className="font-semibold text-[#64748B]">{item.trade}</span>
                        <span>·</span>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-1 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsInspectionListModalOpen(false);
                  if (onOpenPunchList) onOpenPunchList();
                }}
                className="text-xs font-semibold text-[#1677FF] hover:underline cursor-pointer"
              >
                Go to Full Punch List →
              </button>
              <button
                onClick={() => setIsInspectionListModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
