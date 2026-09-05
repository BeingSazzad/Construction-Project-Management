import React from 'react';
import {
  BarChart3, DollarSign, TrendingUp, Calendar, FileText,
  ClipboardList, Users, Activity, AlertCircle, ArrowUpRight, Clock
} from 'lucide-react';

interface ReportCard {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  status: 'active' | 'soon';
  color: string;
}

const COMPANY_REPORTS: ReportCard[] = [
  { id: 'active-summary', icon: BarChart3, title: 'Active Project Summary', desc: 'Overview of all active projects with status, budget, and schedule health.', status: 'active', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'budget-vs-actual', icon: DollarSign, title: 'Budget vs Actual', desc: 'Compare budgeted costs against actual spending across all projects.', status: 'active', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'profitability', icon: TrendingUp, title: 'Project Profitability', desc: 'Profit margins and financial performance by project.', status: 'active', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'schedule-perf', icon: Calendar, title: 'Schedule Performance', desc: 'On-time completion rates and schedule variance across projects.', status: 'active', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'change-order', icon: ClipboardList, title: 'Change Order Report', desc: 'All change orders with status, value impact, and approval tracking.', status: 'active', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'cash-flow', icon: Activity, title: 'Cash Flow Forecast', desc: 'Projected cash needs, client payments, and vendor obligations.', status: 'soon', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'trade-perf', icon: Users, title: 'Trade Performance', desc: 'Subcontractor reliability, response rates, and quality metrics.', status: 'soon', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'team-workload', icon: Users, title: 'Team Workload', desc: 'Task assignments and capacity across team members.', status: 'soon', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'construction-vol', icon: BarChart3, title: 'Construction Volume', desc: 'Total construction volume managed through Lattice.', status: 'active', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
];

const PROJECT_REPORTS: ReportCard[] = [
  { id: 'proj-status', icon: BarChart3, title: 'Project Status', desc: 'Current status, stage, and key milestones for a single project.', status: 'active', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'proj-budget', icon: DollarSign, title: 'Budget vs Actual', desc: 'Detailed budget breakdown with committed and actual costs.', status: 'active', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'forecast-cost', icon: TrendingUp, title: 'Forecast Final Cost', desc: 'Projected final cost based on committed and forecast-to-complete.', status: 'active', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 'schedule-var', icon: Calendar, title: 'Schedule Variance', desc: 'Baseline versus current schedule with critical path analysis.', status: 'active', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'change-log', icon: ClipboardList, title: 'Change Order Log', desc: 'Complete change order history with financial impact.', status: 'active', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'daily-log', icon: FileText, title: 'Daily Log Report', desc: 'Compiled daily logs with weather, trades, and work completed.', status: 'active', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { id: 'proj-trade-perf', icon: Users, title: 'Trade Performance', desc: 'Per-trade performance, scope completion, and documentation.', status: 'active', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'closeout', icon: AlertCircle, title: 'Closeout Report', desc: 'Project closeout checklist with outstanding items and warranties.', status: 'active', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
];

interface ReportsHubViewProps {
  onNavigateToAnalytics?: () => void;
  onShowToast?: (msg: string) => void;
}

export const ReportsHubView: React.FC<ReportsHubViewProps> = ({ onNavigateToAnalytics, onShowToast }) => {
  const handleGenerate = (card: ReportCard, section: 'company' | 'project') => {
    if (section === 'company') {
      onNavigateToAnalytics?.();
    } else {
      onShowToast?.(`Report exported: ${card.title} PDF has been downloaded.`);
    }
  };

  const renderCard = (card: ReportCard, section: 'company' | 'project') => {
    const Icon = card.icon;
    const isSoon = card.status === 'soon';
    return (
      <div key={card.id} className="relative p-4 rounded-2xl bg-[#060B17] border border-[#142036] flex flex-col gap-3 hover:border-[#1E3058] transition-all">
        {isSoon && (
          <span className="absolute top-3 right-3 text-[10px] font-black tracking-widest text-slate-500 border border-[#1A2744] bg-[#0A1328] px-1.5 py-0.5 rounded-full uppercase">Soon</span>
        )}
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${card.color}`}>
          <Icon className="w-4 h-4" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">{card.title}</p>
          <p className="text-xs text-slate-400 font-medium mt-1 leading-snug">{card.desc}</p>
        </div>
        {isSoon ? (
          <div className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-[#0A1328] border border-[#1A2744] text-xs font-bold text-slate-500">
            <Clock className="w-3.5 h-3.5" /> Coming Soon
          </div>
        ) : (
          <button
            onClick={() => handleGenerate(card, section)}
            className="flex items-center justify-center gap-1.5 h-8 px-3 rounded-xl bg-[#0A1328] border border-[#1A2744] text-xs font-bold text-slate-300 hover:border-blue-500/40 hover:text-blue-400 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" /> Generate Report
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-5 px-4 pt-4 pb-28 font-sans max-w-[430px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pt-1">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-4 h-4 text-blue-400" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-base font-black text-white tracking-tight">Reports</h1>
          <p className="text-xs text-slate-400 font-medium">Company and project reports to help you make decisions</p>
        </div>
      </div>

      {/* Company Reports */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-4 rounded-full bg-blue-500" />
          <p className="text-sm font-black text-white tracking-tight">Company Reports</p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {COMPANY_REPORTS.map(card => renderCard(card, 'company'))}
        </div>
      </div>

      {/* Project Reports */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-4 rounded-full bg-blue-500" />
          <p className="text-sm font-black text-white tracking-tight">Project Reports</p>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {PROJECT_REPORTS.map(card => renderCard(card, 'project'))}
        </div>
      </div>

      {/* Footer Banner */}
      <button
        onClick={onNavigateToAnalytics}
        className="flex items-center justify-between p-4 rounded-2xl bg-[#060B17] border border-[#142036] hover:border-blue-500/30 transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-left">
            <p className="text-[12px] font-bold text-white">Total Construction Volume Managed</p>
            <p className="text-[10px] text-slate-400 font-medium">Calculated from actual project contract values across all completed and active projects.</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:text-blue-300 whitespace-nowrap pl-2">
          View Analytics <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
