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

interface BlockerItem {
  id: string;
  type: 'rfi' | 'submittal' | 'inspection' | 'pco';
  code: string;
  category: string;
  project: string;
  projectId: string;
  title: string;
  description: string;
  urgency: 'critical' | 'high' | 'medium';
  dueText: string;
  assignedTo: string;
  status: 'pending' | 'resolved' | 'approved';
  details?: {
    question?: string;
    impact?: string;
    engineerNotes?: string;
    submittalSpecs?: string;
    leadTime?: string;
    costImpact?: string;
    timeImpact?: string;
    checklistItems?: { id: string; label: string; checked: boolean }[];
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
  const [selectedBlocker, setSelectedBlocker] = useState<BlockerItem | null>(null);
  const [blockerFilter, setBlockerFilter] = useState<'all' | 'rfi' | 'inspection' | 'submittal'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Daily log verification state
  const [dailyLogSigned, setDailyLogSigned] = useState(false);
  const [dailyLogRemarks, setDailyLogRemarks] = useState(
    'Superintendent log reviewed and approved. Framing crew is on schedule for city inspection tomorrow. Ensure permit card is posted by 8:00 AM.'
  );

  // Blockers data
  const [blockers, setBlockers] = useState<BlockerItem[]>([
    {
      id: 'blk-1',
      type: 'rfi',
      code: 'RFI-042',
      category: 'Structural Engineering',
      project: 'Snell Isle Residence',
      projectId: 'proj-1',
      title: 'Rebar Dowel Spacing at Shear Wall Grid 4B',
      description: 'Discrepancy between S-202 foundation notes and architectural framing clearance. Concrete pour scheduled Friday 6:00 AM.',
      urgency: 'critical',
      dueText: 'Due Today 3 PM',
      assignedTo: 'Thornton Tomasetti (Structural EOR)',
      status: 'pending',
      details: {
        question: 'Structural sheet S-202 specifies #5 rebar @ 6" o.c. while architectural wall clearance only accommodates #4 @ 8" o.c. Requesting immediate engineer variance or bar schedule modification before inspection.',
        impact: 'Critical Path: Slab & shear wall concrete pour cannot proceed until stamped approval is issued.',
        engineerNotes: 'Draft response received: Engineer approves 2x #4 paired bars @ 10" o.c. with seismic hooks.'
      }
    },
    {
      id: 'blk-2',
      type: 'inspection',
      code: 'INSP-201',
      category: 'City Building Inspection',
      project: 'Snell Isle Residence',
      projectId: 'proj-1',
      title: 'City Structural Framing & Shear Inspection',
      description: 'City of Tampa inspector Frank Rodriguez arriving tomorrow at 10:00 AM. Hurricane tie-down schedule pending final sign-off.',
      urgency: 'critical',
      dueText: 'Tomorrow 10 AM',
      assignedTo: 'Frank Rodriguez (Senior City Inspector)',
      status: 'pending',
      details: {
        checklistItems: [
          { id: 'c1', label: 'Simpson Strong-Tie hurricane brackets & tie-downs verified', checked: true },
          { id: 'c2', label: 'Shear wall edge nailing (6" o.c.) & field nailing (12" o.c.) checked', checked: true },
          { id: 'c3', label: 'Signed architectural & structural permit drawings in job lockbox', checked: true },
          { id: 'c4', label: 'Florida Building Code permit inspection card posted on site', checked: true },
        ]
      }
    },
    {
      id: 'blk-3',
      type: 'submittal',
      code: 'SUB-108',
      category: 'Glazing & Envelope',
      project: 'Snell Isle Residence',
      projectId: 'proj-1',
      title: 'Impact Glass Curtain Wall & Mullion Shop Drawings',
      description: 'Submittal returned from Architect with "Approved as Noted". Need PM release to Coastal Glazing for 6-week factory run.',
      urgency: 'high',
      dueText: 'Needs Release',
      assignedTo: 'Coastal Architectural Glazing',
      status: 'pending',
      details: {
        submittalSpecs: 'Series 8000 Low-E Argon-filled impact insulated glass units (DP +75/-80 psf rating for coastal wind zone).',
        leadTime: '6 Weeks factory fabrication from timestamp of PM release.',
        impact: 'If released today, delivery aligns with exterior envelope target date (Oct 18).'
      }
    },
    {
      id: 'blk-4',
      type: 'pco',
      code: 'PCO-014',
      category: 'Owner Change Order',
      project: 'Snell Isle Residence',
      projectId: 'proj-1',
      title: 'Client Upgrade: Master Bath Book-Matched Quartzite Slab',
      description: 'Arthur & Evelyn Vance requested upgraded book-matched slab and concealed trench drain system. Net add: $18,400 (+3 schedule days).',
      urgency: 'medium',
      dueText: 'Pending Owner',
      assignedTo: 'Arthur Vance / Alex Chen (Principal)',
      status: 'pending',
      details: {
        costImpact: '+$18,400 Net Direct Cost (Includes 15% GC Overhead & Profit)',
        timeImpact: '+3 Calendar Days for slab fabrication and water-jet mitering.',
        question: 'Material deposit required before slab hold expires with Marble Warehouse Tampa.'
      }
    }
  ]);

  // Inspection checklist state
  const [inspectionChecks, setInspectionChecks] = useState<Record<string, boolean>>({
    c1: true,
    c2: true,
    c3: true,
    c4: true
  });

  const pendingBlockersCount = useMemo(() => {
    return blockers.filter(b => b.status === 'pending').length;
  }, [blockers]);

  const filteredBlockers = useMemo(() => {
    return blockers.filter(b => {
      if (blockerFilter === 'all') return true;
      return b.type === blockerFilter;
    });
  }, [blockers, blockerFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolveBlocker = (id: string, actionName: string) => {
    setBlockers(prev => prev.map(b => b.id === id ? { ...b, status: 'resolved' } : b));
    setSelectedBlocker(null);
    showToast(`✓ ${actionName} recorded successfully!`);
  };

  const handleCertifyInspection = () => {
    setBlockers(prev => prev.map(b => b.id === 'blk-2' ? { ...b, status: 'approved' } : b));
    setSelectedBlocker(null);
    showToast('✓ Site certified 100% ready for City Inspector Rodriguez!');
  };

  const handleApproveSubmittal = (id: string) => {
    setBlockers(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));
    setSelectedBlocker(null);
    showToast('✓ Submittal SUB-108 approved & issued to Coastal Glazing!');
  };

  const handleSignDailyLog = () => {
    setDailyLogSigned(true);
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
                City Framing Walkthrough
              </h2>
              <p className="text-xs text-[#64748B] font-medium mt-0.5 truncate leading-snug">
                Snell Isle Residence · Inspector arriving 10:00 AM
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

      {/* ── 2. EXACT 3 PM OPERATIONAL KPIS ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {/* KPI 1: Urgent Blockers */}
        <div 
          onClick={() => setBlockerFilter('all')}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
              Open Blockers
            </span>
            <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
              {pendingBlockersCount} Urgent
            </span>
          </div>
        </div>

        {/* KPI 2: Next Inspection */}
        <div 
          onClick={() => {
            const insp = blockers.find(b => b.type === 'inspection');
            if (insp) setSelectedBlocker(insp);
          }}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
              Next Inspection
            </span>
            <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
              Tomorrow
            </span>
          </div>
        </div>

        {/* KPI 3: Lookahead Health */}
        <div 
          onClick={() => {
            if (onOpenCalendar) onOpenCalendar('2026-09-06');
            else onOpenTasks();
          }}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer min-h-[84px] group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="mt-2">
            <span className="text-[11px] text-[#64748B] font-medium block leading-tight truncate">
              Lookahead
            </span>
            <span className="text-base sm:text-lg font-bold text-[#0F172A] block leading-tight mt-0.5 truncate">
              94%
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. FIELD DELIVERY & CRITICAL PATH HEALTH CARD ── */}
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

      {/* ── 4. CRITICAL ACTION QUEUE (PM's Primary Unblocking Engine) ── */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <h2 className="text-base font-bold text-[#0F172A] tracking-tight whitespace-nowrap">Blocker Queue</h2>
            <span className="text-[10px] font-bold bg-[#EAF3FF] text-[#1677FF] px-2 py-0.5 rounded-full whitespace-nowrap">
              {pendingBlockersCount} Pending
            </span>
          </div>

          {/* Clean Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
            {(['all', 'rfi', 'inspection', 'submittal'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setBlockerFilter(filter)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  blockerFilter === filter 
                    ? 'bg-[#1677FF] text-white' 
                    : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {filter === 'all' ? 'All' : filter === 'rfi' ? 'RFI' : filter === 'inspection' ? 'Inspect' : 'Submittal'}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Single Card with Divider Rows */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden divide-y divide-[#F1F5F9]">
          {filteredBlockers.map((blk) => {
            const isResolved = blk.status === 'resolved' || blk.status === 'approved';

            return (
              <div
                key={blk.id}
                onClick={() => setSelectedBlocker(blk)}
                className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
              >
                {/* Left: Code badge + title & project */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shrink-0 ${
                    blk.type === 'rfi' ? 'bg-[#F3E8FF] text-[#7E22CE]' :
                    blk.type === 'inspection' ? 'bg-[#EAF3FF] text-[#1677FF]' :
                    blk.type === 'submittal' ? 'bg-[#FFF7E6] text-[#D97706]' : 'bg-[#E9F9F3] text-[#10A976]'
                  }`}>
                    {blk.code}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-xs sm:text-sm font-bold truncate leading-tight group-hover:text-[#1677FF] transition-colors ${
                      isResolved ? 'text-[#64748B] line-through' : 'text-[#0F172A]'
                    }`}>
                      {blk.title}
                    </h4>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5 leading-tight">
                      {blk.project} · <span className="font-medium text-[#475569]">{blk.category}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Status chip + Chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                    isResolved
                      ? 'bg-[#E9F9F3] text-[#10A976]'
                      : blk.urgency === 'critical'
                      ? 'bg-[#FFF0F0] text-[#E5484D]'
                      : 'bg-[#FFF7E6] text-[#D97706]'
                  }`}>
                    {isResolved ? 'Resolved ✓' : blk.dueText}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. SUPERINTENDENT DAILY LOG REVIEW (Quick PM Sign-Off Strip) ── */}
      <div 
        onClick={() => setIsDailyLogModalOpen(true)}
        className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 sm:p-4 shadow-card hover:border-[#1677FF]/40 transition-all cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            dailyLogSigned ? 'bg-[#E9F9F3] text-[#10A976]' : 'bg-[#EAF3FF] text-[#1677FF]'
          }`}>
            {dailyLogSigned ? <Check className="w-4 h-4" /> : <HardHat className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] shrink-0">
                Daily Log #42
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                dailyLogSigned ? 'bg-[#E9F9F3] text-[#10A976]' : 'bg-[#FFF7E6] text-[#D97706]'
              }`}>
                {dailyLogSigned ? 'Certified ✓' : 'Pending Stamp'}
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] truncate mt-0.5">
              Snell Isle · By John Smith · 94 on site
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDailyLogModalOpen(true);
          }}
          className={`h-7 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 ${
            dailyLogSigned 
              ? 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
              : 'bg-[#1677FF] hover:bg-[#0F5FD7] text-white shadow-xs'
          }`}
        >
          {dailyLogSigned ? 'View' : 'Review & Sign'}
        </button>
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

      {/* ── MODAL 1: BLOCKER DETAIL & RESOLUTION ── */}
      {selectedBlocker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-[420px] w-full p-5 shadow-2xl border border-[#E2E8F0] flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-slide-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  selectedBlocker.type === 'rfi' ? 'bg-[#F3E8FF] text-[#7E22CE]' :
                  selectedBlocker.type === 'inspection' ? 'bg-[#EAF3FF] text-[#1677FF]' :
                  selectedBlocker.type === 'submittal' ? 'bg-[#FFF7E6] text-[#D97706]' : 'bg-[#E9F9F3] text-[#10A976]'
                }`}>
                  {selectedBlocker.code} · {selectedBlocker.category}
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-1 leading-snug">
                  {selectedBlocker.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBlocker(null)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Context */}
            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#64748B] block font-semibold">Project</span>
                <span className="font-bold text-[#0F172A]">{selectedBlocker.project}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#64748B] block font-semibold">Deadline</span>
                <span className="font-bold text-[#E5484D]">{selectedBlocker.dueText}</span>
              </div>
            </div>

            {/* Type-Specific Resolution Body */}
            {selectedBlocker.type === 'rfi' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                    Question to Engineer of Record
                  </span>
                  <p className="text-[#334155] leading-relaxed">
                    {selectedBlocker.details?.question}
                  </p>
                </div>

                <div className="bg-[#EAF3FF] p-3 rounded-xl border border-[#DCE8F8]">
                  <span className="text-[10px] font-bold text-[#1677FF] uppercase tracking-wider block mb-1">
                    Draft Structural Response
                  </span>
                  <p className="text-[#1E40AF] leading-relaxed">
                    {selectedBlocker.details?.engineerNotes}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => handleResolveBlocker(selectedBlocker.id, 'RFI Approved & Released to Field')}
                    className="h-11 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Release to Field Super</span>
                  </button>

                  <button
                    onClick={() => {
                      alert('Calling Thornton Tomasetti Structural EOR (+1 555 789-0123)...');
                    }}
                    className="h-10 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#1677FF]" />
                    <span>Call Structural Engineer</span>
                  </button>
                </div>
              </div>
            )}

            {selectedBlocker.type === 'inspection' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                      Pre-Inspection Checklist
                    </span>
                    <span className="text-[10px] font-bold text-[#1677FF]">
                      {Object.values(inspectionChecks).filter(Boolean).length}/4 Verified
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {selectedBlocker.details?.checklistItems?.map((item) => (
                      <label 
                        key={item.id}
                        className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={inspectionChecks[item.id] ?? item.checked}
                          onChange={(e) => {
                            setInspectionChecks(prev => ({
                              ...prev,
                              [item.id]: e.target.checked
                            }));
                          }}
                          className="w-4 h-4 rounded text-[#1677FF] border-[#CBD5E1] focus:ring-[#1677FF] mt-0.5"
                        />
                        <span className={`text-xs ${
                          inspectionChecks[item.id] ? 'text-[#0F172A] font-medium' : 'text-[#64748B]'
                        }`}>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCertifyInspection}
                  className="h-11 rounded-xl bg-[#10A976] hover:bg-[#0E9466] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Certify Site 100% Ready for Inspection</span>
                </button>
              </div>
            )}

            {selectedBlocker.type === 'submittal' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                    Architect Architectural Approval
                  </span>
                  <p className="text-[#334155] leading-relaxed">
                    {selectedBlocker.details?.submittalSpecs}
                  </p>
                  <div className="mt-2 text-[11px] text-[#1677FF] font-semibold">
                    ✓ Factory Lead Time: {selectedBlocker.details?.leadTime}
                  </div>
                </div>

                <button
                  onClick={() => handleApproveSubmittal(selectedBlocker.id)}
                  className="h-11 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Forward to Glazing Subcontractor</span>
                </button>
              </div>
            )}

            {selectedBlocker.type === 'pco' && (
              <div className="flex flex-col gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                    Change Order Scope & Pricing
                  </span>
                  <p className="text-[#334155] leading-relaxed mb-2">
                    {selectedBlocker.details?.question}
                  </p>
                  <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <div className="flex justify-between font-bold text-[#0F172A]">
                      <span>Cost Impact:</span>
                      <span className="text-[#10A976]">{selectedBlocker.details?.costImpact}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[#64748B]">
                      <span>Schedule Impact:</span>
                      <span className="text-[#D97706]">{selectedBlocker.details?.timeImpact}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleResolveBlocker(selectedBlocker.id, 'Change Order PCO-014 Forwarded to Owner')}
                  className="h-11 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Forward to Alex Chen (Owner) for Draw Authorization</span>
                </button>
              </div>
            )}
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
