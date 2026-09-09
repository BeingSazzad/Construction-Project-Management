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
  onOpenCreateDraw?: () => void;
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
  onOpenCreateDraw,
  onCreateTask,
  onCreatePunch,
  onCreateChangeOrder,
  currentRole = 'admin',
}) => {
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isRiskAuditModalOpen, setIsRiskAuditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<{ id: string; vendor: string; amount: string; desc: string; date: string; csiCode: string; retainage: string; lienWaiverStatus: string } | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<{ id: string; trade: string; count: string; task: string; status: string; foreman: string; phone: string; zone: string; safetyTailgate: boolean } | null>(null);
  const [approvedInvoices, setApprovedInvoices] = useState<string[]>([]);
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
                  City Framing Walkthrough
                </h2>
                <p className="text-xs text-[#64748B] font-medium mt-0.5 truncate leading-snug">
                  Snell Isle Residence · Inspector arriving 10:00 AM
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

        {/* Executive Capital Health Card */}
        <div 
          onClick={() => setIsRiskAuditModalOpen(true)}
          className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#1677FF]/40 transition-all cursor-pointer flex flex-col gap-2 group"
        >
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                EXECUTIVE CAPITAL BALANCE
              </span>
              <Info className="w-3 h-3 text-[#94A3B8]" />
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E9F9F3] text-[#10A976]">
              Protected
            </span>
          </div>

          {/* Value + Circular Arrow Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight leading-tight">
                $34,850,000
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#64748B] font-medium tracking-tight mt-0.5 leading-snug truncate">
                $16.8M Paid (48%) · $12.1M Committed · $5.95M Contingency
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center group-hover:bg-[#1677FF] group-hover:text-white transition-all shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Segmented Continuous Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden flex gap-0.5 mt-0.5">
            <div className="h-full bg-[#1677FF] rounded-l-full" style={{ width: '48%' }} />
            <div className="h-full bg-[#60A5FA]" style={{ width: '35%' }} />
            <div className="h-full bg-[#BAE6FD] rounded-r-full" style={{ width: '17%' }} />
          </div>

          {/* Bar Legend */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1677FF] shrink-0" />
              <span className="text-[11px] text-[#64748B] font-medium">Paid</span>
              <span className="text-[11px] font-bold text-[#0F172A]">48%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#60A5FA] shrink-0" />
              <span className="text-[11px] text-[#64748B] font-medium">Committed</span>
              <span className="text-[11px] font-bold text-[#0F172A]">35%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#BAE6FD] shrink-0" />
              <span className="text-[11px] text-[#64748B] font-medium">Contingency</span>
              <span className="text-[11px] font-bold text-[#0F172A]">17%</span>
            </div>
          </div>
        </div>

        {/* Latti AI Executive Briefing */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1677FF]" />
              <span className="text-sm font-bold text-[#1677FF]">Latti Executive Briefing</span>
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
                    Cast-in-Place concrete pier depths were revised from 18ft to 24ft due to waterfront sandy subsoil testing by Madrid CPWG geotechnical engineers. 6 additional helical micropiles were installed to reach load-bearing limestone.
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
    const pendingInvoicesCount = Math.max(0, 3 - approvedInvoices.length);

    return (
      <div className="w-full flex-1 flex flex-col gap-4 px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
        
        {/* Toast Notification */}
        {financeToast && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-slate-700 animate-slide-in">
            <CheckCircle2 className="w-4 h-4 text-[#10A976]" />
            <span>{financeToast}</span>
          </div>
        )}

        {/* ── 1. HERO CARD: AIA G702 CYCLE FOCUS ── */}
        <div 
          onClick={onOpenBudgetsHub}
          className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#DCE8F8] bg-gradient-to-r from-[#EAF3FF] via-[#F4F8FF] to-white p-4 sm:p-5 shadow-xs hover:border-[#1677FF]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between gap-3">
            {/* Left: Focus & Live Status */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                  Finance Focus
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#10A976] whitespace-nowrap shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10A976] animate-pulse" />
                  Draw #04 In Review
                </span>
              </div>

              <div className="mt-1.5">
                <h2 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors tracking-tight truncate leading-snug">
                  AIA G702 Pay App Cycle
                </h2>
                <p className="text-xs text-[#64748B] font-medium mt-0.5 truncate leading-snug">
                  Snell Isle Residence · Lender inspector review Friday
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

        {/* ── 2. EXACT 3 FINANCE KPIS ── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          <div 
            onClick={onOpenBudgetsHub}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <Receipt className="w-3.5 h-3.5" />
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
                Total Invoiced
              </span>
              <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
                $16.82M
              </span>
            </div>
          </div>

          <div 
            onClick={onOpenBudgetsHub}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
                Pending AP
              </span>
              <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
                $133.1K
              </span>
            </div>
          </div>

          <div 
            onClick={() => onOpenCreateDraw ? onOpenCreateDraw() : (onOpenBudgetsHub ? onOpenBudgetsHub() : null)}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <Landmark className="w-3.5 h-3.5" />
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
                Bank Draws
              </span>
              <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
                Draw #04
              </span>
            </div>
          </div>
        </div>

        {/* ── 3. PORTFOLIO CAPITAL COMMITTED CARD ── */}
        <div 
          onClick={onOpenBudgetsHub}
          className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#1677FF]/40 transition-all cursor-pointer flex flex-col gap-2 group"
        >
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                PORTFOLIO CAPITAL COMMITTED
              </span>
              <Info className="w-3 h-3 text-[#94A3B8]" />
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E9F9F3] text-[#10A976]">
              100% Balanced
            </span>
          </div>

          {/* Value + Circular Arrow Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight leading-tight">
                $34,850,000
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#64748B] font-medium tracking-tight mt-0.5 leading-snug truncate">
                $16.8M Paid (48%) · $12.1M Committed (35%) · $5.95M Contingency (17%)
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center group-hover:bg-[#1677FF] group-hover:text-white transition-all shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Segmented Continuous Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden flex gap-0.5 mt-0.5">
            <div className="h-full bg-[#1677FF] rounded-l-full" style={{ width: '48%' }} />
            <div className="h-full bg-[#60A5FA]" style={{ width: '35%' }} />
            <div className="h-full bg-[#BAE6FD] rounded-r-full" style={{ width: '17%' }} />
          </div>

          {/* Bar Legend - Clean justify-between inline alignment */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1677FF] shrink-0" />
              <span className="text-[11px] text-[#64748B] font-medium">Paid</span>
              <span className="text-[11px] font-bold text-[#0F172A]">48%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#60A5FA] shrink-0" />
              <span className="text-[11px] text-[#64748B] font-medium">Committed</span>
              <span className="text-[11px] font-bold text-[#0F172A]">35%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#BAE6FD] shrink-0" />
              <span className="text-[11px] text-[#64748B] font-medium">Contingency</span>
              <span className="text-[11px] font-bold text-[#0F172A]">17%</span>
            </div>
          </div>
        </div>

        {/* ── 4. QUICK FINANCIAL ACTIONS (Lender Draws, Lien Waivers & Disbursals) ── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          <button 
            onClick={onOpenCreateDraw}
            className="h-9 px-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1677FF]/40 text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <Landmark className="w-3.5 h-3.5 text-[#1677FF]" />
            <span className="truncate">Lender Draw</span>
          </button>
          <button 
            onClick={onOpenLienWaiver}
            className="h-9 px-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1677FF]/40 text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#1677FF]" />
            <span className="truncate">Lien Waivers</span>
          </button>
          <button 
            onClick={onOpenApprovePayApp}
            className="h-9 px-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1677FF]/40 text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#1677FF]" />
            <span className="truncate">Pay Apps</span>
          </button>
        </div>

        {/* ── 5. TRADE INVOICE APPROVAL QUEUE (Compact Divider List, ZERO Card Bloat) ── */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-[#0F172A] tracking-tight">Trade Invoices Needing Approval</h2>
              <span className="text-[10px] font-bold bg-[#EAF3FF] text-[#1677FF] px-2 py-0.5 rounded-full">
                {pendingInvoicesCount} Pending
              </span>
            </div>
            <button onClick={onOpenBudgetsHub} className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-1 cursor-pointer">
              <span>Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden divide-y divide-[#F1F5F9]">
            {[
              { id: 'inv-1', vendor: 'Apex Concrete Masters', amount: '$84,200', desc: 'Pay App #04 · STEM Walls & Footings', date: 'Due Sep 8', csiCode: '03 30 00 Cast-in-Place Concrete', retainage: '$8,420 (10%)', lienWaiverStatus: 'Progress Conditional on File' },
              { id: 'inv-2', vendor: '84 Lumber Building Materials', amount: '$36,500', desc: 'Package delivery #2 · Framing lumber', date: 'Due Sep 10', csiCode: '06 11 00 Wood Framing & Trusses', retainage: '$3,650 (10%)', lienWaiverStatus: 'Materialman Release Stamped' },
              { id: 'inv-3', vendor: 'Sunbelt Equipment Rentals', amount: '$12,400', desc: '50-Ton Mobile Crane rental', date: 'Due Sep 12', csiCode: '01 54 00 Construction Equipment', retainage: '$0 (Net 30)', lienWaiverStatus: 'Rental Release Attached' },
            ].map((inv) => {
              const isApproved = approvedInvoices.includes(inv.id);
              return (
                <div 
                  key={inv.id} 
                  onClick={() => setSelectedInvoice(inv)}
                  className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors truncate">{inv.vendor}</h4>
                      <span className="text-xs font-bold text-[#0F172A] shrink-0">{inv.amount}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {inv.desc} · <span className="text-[#D97706] font-medium">{inv.date}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isApproved) {
                          setApprovedInvoices(prev => [...prev, inv.id]);
                          setFinanceToast(`✓ Invoice from ${inv.vendor} approved for payment!`);
                          setTimeout(() => setFinanceToast(null), 3000);
                        }
                      }}
                      className={`h-7 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                        isApproved 
                          ? 'bg-[#E9F9F3] text-[#10A976] cursor-default' 
                          : 'bg-[#1677FF] hover:bg-[#0F5FD7] text-white shadow-xs'
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

        {/* Weather Impact Modal */}
        {isWeatherModalOpen && (
          <WeatherImpactModal
            isOpen={isWeatherModalOpen}
            onClose={() => setIsWeatherModalOpen(false)}
            project={snellProject}
          />
        )}

        {/* Invoice Detail & ACH Approval Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#F1F5F9] flex items-center justify-between bg-gradient-to-r from-[#F8FAFC] to-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] leading-tight">Trade Invoice Audit</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">{selectedInvoice.vendor}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedInvoice(null)}
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
                    <span className="text-[10px] text-[#64748B] font-semibold block uppercase">Gross Billing</span>
                    <span className="text-xs font-bold text-[#0F172A] mt-0.5 block">{selectedInvoice.amount}</span>
                  </div>
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0] text-center">
                    <span className="text-[10px] text-[#64748B] font-semibold block uppercase">Retainage</span>
                    <span className="text-xs font-bold text-[#0F172A] mt-0.5 block">{selectedInvoice.retainage}</span>
                  </div>
                  <div className="bg-[#E9F9F3] p-2.5 rounded-xl border border-[#D1FADF] text-center">
                    <span className="text-[10px] text-[#10A976] font-semibold block uppercase">Due Date</span>
                    <span className="text-xs font-bold text-[#10A976] mt-0.5 block">{selectedInvoice.date}</span>
                  </div>
                </div>

                {/* Scope & CSI */}
                <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-[#E2E8F0] space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                    Scope of Work & CSI Division
                  </span>
                  <p className="text-xs font-semibold text-[#0F172A]">{selectedInvoice.desc}</p>
                  <p className="text-xs text-[#64748B]">{selectedInvoice.csiCode}</p>
                </div>

                {/* Compliance & Lien Waiver */}
                <div className="bg-[#EAF3FF]/40 rounded-2xl p-3.5 border border-[#DCE8F8] space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1677FF]" />
                    <span className="text-xs font-bold text-[#1677FF]">Lien Waiver Status</span>
                  </div>
                  <p className="text-xs text-[#334155] leading-relaxed">
                    {selectedInvoice.lienWaiverStatus}. Subcontractor certificate of insurance is valid through Dec 2026.
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#E2E8F0]/60 transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const invId = selectedInvoice.id;
                    const vendor = selectedInvoice.vendor;
                    if (!approvedInvoices.includes(invId)) {
                      setApprovedInvoices(prev => [...prev, invId]);
                    }
                    setFinanceToast(`✓ ACH Payment released for ${vendor}!`);
                    setSelectedInvoice(null);
                    setTimeout(() => setFinanceToast(null), 3000);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                    approvedInvoices.includes(selectedInvoice.id)
                      ? 'bg-[#E9F9F3] text-[#10A976]'
                      : 'text-white bg-[#1677FF] hover:bg-[#0F5FD7]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{approvedInvoices.includes(selectedInvoice.id) ? 'Approved' : 'Authorize ACH Release'}</span>
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
                Field Focus
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#10A976] whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10A976] animate-pulse" />
                24 on site · 2 Crews
              </span>
            </div>

            <div className="mt-1.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors tracking-tight truncate leading-snug">
                Framing Walkthrough Prep
              </h2>
              <p className="text-xs text-[#64748B] font-medium mt-0.5 truncate leading-snug">
                Snell Isle Residence · Inspector Frank Rodriguez at 10 AM
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

      {/* ── 2. EXACT 3 FIELD KPIS ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        <div 
          onClick={onOpenDailyLogs}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <HardHat className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
              Headcount
            </span>
            <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
              24 Crew
            </span>
          </div>
        </div>

        <div 
          onClick={onOpenDailyLogs}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
              Daily Field Log
            </span>
            <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
              Drafting
            </span>
          </div>
        </div>

        <div 
          onClick={() => onOpenTasks()}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
              Safety Record
            </span>
            <span className="text-sm sm:text-base font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
              0 Incidents
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. CITY INSPECTION READINESS (Field Superintendent's Core Morning Focus) ── */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-[#0F172A] tracking-tight">City Inspection Checklist</h2>
            <span className="text-[10px] font-bold bg-[#EAF3FF] text-[#1677FF] px-2 py-0.5 rounded-full">
              {checkedFieldPunch.length}/4 Verified
            </span>
          </div>
          <button onClick={onOpenDailyLogs} className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-1 cursor-pointer">
            <span>Daily Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0F172A]">
              Framing & Hurricane Tie-Down Walkthrough
            </span>
            <span className="text-[10px] font-bold text-[#10A976] bg-[#E9F9F3] px-2 py-0.5 rounded-full">
              {Math.round((checkedFieldPunch.length / 4) * 100)}% Ready
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
            <div 
              className="h-full bg-[#10A976] rounded-full transition-all duration-300" 
              style={{ width: `${Math.max(10, Math.round((checkedFieldPunch.length / 4) * 100))}%` }} 
            />
          </div>
          <p className="text-[10px] text-[#64748B]">
            City of Tampa Inspector Frank Rodriguez arrives tomorrow 10:00 AM
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden divide-y divide-[#F1F5F9]">
          {[
            { id: 'c-1', title: 'Simpson Strong-Tie Straps & Hold-Downs', area: 'Wall Grid 4B & Rafters', code: 'FBC-2024', priority: 'Critical' },
            { id: 'c-2', title: 'Shear Wall Edge (6" o.c.) & Field Nailing (12" o.c.)', area: 'Level 2 Structural Shear', code: 'Eng S-202', priority: 'High' },
            { id: 'c-3', title: 'Signed Stamped Permit Drawings in Job Box', area: 'Jobsite Lockbox #1', code: 'Admin', priority: 'High' },
            { id: 'c-4', title: 'Florida Building Code Permit Inspection Card Posted', area: 'Front Entrance Board', code: 'Compliance', priority: 'Critical' },
          ].map((item) => {
            const isChecked = checkedFieldPunch.includes(item.id);
            return (
              <div 
                key={item.id} 
                onClick={() => {
                  if (isChecked) {
                    setCheckedFieldPunch(prev => prev.filter(id => id !== item.id));
                  } else {
                    setCheckedFieldPunch(prev => [...prev, item.id]);
                    setFieldToast(`✓ ${item.title} verified for City Inspection!`);
                    setTimeout(() => setFieldToast(null), 3000);
                  }
                }}
                className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                    isChecked 
                      ? 'bg-[#10A976] border-[#10A976] text-white' 
                      : 'border-[#CBD5E1] bg-white group-hover:border-[#1677FF]'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className={`text-xs sm:text-sm font-bold truncate leading-tight transition-colors ${
                      isChecked ? 'text-[#64748B] line-through' : 'text-[#0F172A]'
                    }`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5 leading-tight">
                      {item.area} · <span className="font-medium text-[#475569]">{item.code}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isChecked 
                      ? 'bg-[#E9F9F3] text-[#10A976]' 
                      : item.priority === 'Critical'
                      ? 'bg-[#FFF0F0] text-[#E5484D]'
                      : 'bg-[#FFF7E6] text-[#D97706]'
                  }`}>
                    {isChecked ? 'Verified ✓' : item.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 6. ACTIVE TRADE CREWS ON SITE (Compact Divider List, ZERO Card Bloat) ── */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-[#0F172A] tracking-tight">Active Trade Crews on Site</h2>
            <span className="text-[10px] font-bold bg-[#EAF3FF] text-[#1677FF] px-2 py-0.5 rounded-full">
              24 Men
            </span>
          </div>
          <button onClick={onOpenDailyLogs} className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-1 cursor-pointer">
            <span>Daily Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden divide-y divide-[#F1F5F9]">
          {[
            { id: 'crw-1', trade: 'Titan Framing Systems', count: '14 Carpenters', task: 'Level 2 Structural Joists & Shear Panels', status: 'On Schedule', foreman: 'Mike Callahan (Lead)', phone: '+1 (555) 456-7890', zone: 'Level 2 Grid A-D', safetyTailgate: true },
            { id: 'crw-2', trade: 'Gulfstream Plumbing Co.', count: '6 Plumbers', task: 'Under-slab rough-in & pressure testing', status: 'On Schedule', foreman: 'Dave Vance (Master Plumber)', phone: '+1 (555) 234-5678', zone: 'Ground Slab Trench 3', safetyTailgate: true },
            { id: 'crw-3', trade: 'General Site Labor', count: '4 Workers', task: 'Clean-up, trash haul & material staging', status: 'Active', foreman: 'Carlos Mendoza (Lead)', phone: '+1 (555) 876-5432', zone: 'Jobsite Perimeter & Staging', safetyTailgate: true },
          ].map((crew) => (
            <div 
              key={crew.id} 
              onClick={() => setSelectedCrew(crew)}
              className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors truncate">{crew.trade}</h4>
                  <span className="text-xs font-medium text-[#64748B] shrink-0">· {crew.count}</span>
                </div>
                <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                  {crew.task}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E9F9F3] text-[#10A976]">
                  {crew.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. DAILY FIELD LOG STATION (Field Superintendent Trailer Log) ── */}
      <div 
        onClick={onOpenDailyLogs}
        className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 sm:p-4 shadow-card hover:border-[#1677FF]/40 transition-all cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                Daily Field Log #42
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9F9F3] text-[#10A976] shrink-0">
                24 Men Logged
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] truncate mt-0.5">
              Snell Isle Residence · Ready for Lead PM Sarah Johnson sign-off
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenDailyLogs) onOpenDailyLogs();
          }}
          className="h-7 px-3 rounded-lg text-xs font-bold bg-[#1677FF] hover:bg-[#0F5FD7] text-white shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
        >
          Open Log
        </button>
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

    </div>
  );
};
