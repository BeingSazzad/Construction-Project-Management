import React, { useState } from 'react';
import { 
  AlertTriangle, ArrowRight, Download, Plus, 
  ChevronRight, FileText, Layers, Building2, 
  Zap, FolderKanban, DollarSign, CheckCircle2, Clock, X,
  TrendingUp, Sparkles, SlidersHorizontal, ArrowLeft, PieChart,
  ShieldCheck
} from 'lucide-react';
import { BudgetDetailView } from './BudgetDetailView';
import { CreateProjectBudgetModal } from '../modals/CreateProjectBudgetModal';
import { DealAnalyzerModal } from '../modals/DealAnalyzerModal';
import { MOCK_PROJECTS } from '../../data/mockData';

export interface BudgetCardItem {
  id: string;
  name: string;
  type: 'Standalone budget' | 'Project linked';
  totalBudget: number;
  estimated: number;
  committed: number;
  actual: number;
  progress: number;
  itemsCount: number;
  dealScore?: string;
  profitText?: string;
  status: 'DRAFT' | 'ACTIVE' | 'APPROVED';
}

const INITIAL_BUDGET_CARDS: BudgetCardItem[] = [
  {
    id: 'b-1',
    name: 'Riverside Office Complex',
    type: 'Project linked',
    totalBudget: 4650000,
    estimated: 4650000,
    committed: 3800000,
    actual: 3250000,
    progress: 70,
    itemsCount: 128,
    status: 'ACTIVE'
  },
  {
    id: 'b-2',
    name: 'Downtown Commercial Highrise',
    type: 'Project linked',
    totalBudget: 12500000,
    estimated: 12500000,
    committed: 11000000,
    actual: 9800000,
    progress: 78,
    itemsCount: 215,
    dealScore: '88/100',
    profitText: '↗ $1,250,000 · 18%',
    status: 'ACTIVE'
  },
  {
    id: 'b-3',
    name: 'Greenfield Technology Hub',
    type: 'Project linked',
    totalBudget: 8400000,
    estimated: 8400000,
    committed: 5200000,
    actual: 3780000,
    progress: 45,
    itemsCount: 94,
    status: 'ACTIVE'
  }
];

interface BudgetsHubViewProps {
  onOpenImportBudget?: () => void;
}

export const BudgetsHubView: React.FC<BudgetsHubViewProps> = ({ onOpenImportBudget }) => {
  const [viewMode, setViewMode] = useState<'analytics' | 'sheets'>('analytics');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('All');
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDealAnalyzerOpen, setIsDealAnalyzerOpen] = useState(false);
  const [isFinancingOpen, setIsFinancingOpen] = useState(false);
  const [selectedCostCode, setSelectedCostCode] = useState<{
    code: string;
    title: string;
    vendor: string;
    budget: string;
    committed: string;
    actual: string;
  } | null>(null);
  const [budgets, setBudgets] = useState<BudgetCardItem[]>(INITIAL_BUDGET_CARDS);

  const projectsList = ['All', 'Riverside Office', 'Downtown Highrise', 'Greenfield Hub'];

  // 1. If user drilled down into a specific budget sheet details page
  if (selectedBudgetId) {
    return (
      <BudgetDetailView 
        budgetId={selectedBudgetId} 
        onBack={() => setSelectedBudgetId(null)} 
      />
    );
  }

  // 2. If user opens 4-Step Create Budget as a full-screen dedicated page
  if (isCreateModalOpen) {
    return (
      <CreateProjectBudgetModal
        isFullScreenPage={true}
        onClose={() => setIsCreateModalOpen(false)}
        projects={MOCK_PROJECTS}
        onCreateBudget={(budgetData) => {
          const newBudget: BudgetCardItem = {
            id: `b-${Date.now()}`,
            name: budgetData.budgetName || 'New Commercial Budget',
            type: budgetData.attachType === 'project' ? 'Project linked' : 'Standalone budget',
            totalBudget: 5000000,
            estimated: 5000000,
            committed: 0,
            actual: 0,
            progress: 0,
            itemsCount: 71,
            status: 'DRAFT'
          };
          setBudgets(prev => [newBudget, ...prev]);
          setIsCreateModalOpen(false);
        }}
      />
    );
  }

  // 3. If user opens Latti Deal Analyzer as a full-screen dedicated page
  if (isDealAnalyzerOpen) {
    return (
      <DealAnalyzerModal
        isFullScreenPage={true}
        onClose={() => setIsDealAnalyzerOpen(false)}
      />
    );
  }

  // 4. If user opens Lender Financing Connections as a full-screen dedicated page
  if (isFinancingOpen) {
    return (
      <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
          <button
            onClick={() => setIsFinancingOpen(false)}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Budgets</span>
          </button>
          <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
            Escrow & Draws
          </span>
        </div>

        <div className="bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-slate-100">
          <div className="pb-3 border-b border-[#142036]">
            <h2 className="text-base font-bold text-white tracking-tight">
              Lender Financing Connections
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Draw packages, bank escrow inspection sign-offs & lien waivers
            </p>
          </div>

          {/* Active Lender Integration Status */}
          <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                  CB
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Chase Construction Lending</h4>
                  <p className="text-[10px] text-slate-400">Credit Facility #8829-CON</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Connected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#142036] text-center">
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-semibold block">Total Facility</span>
                <span className="text-xs font-bold text-white mt-0.5 block">$18,500,000</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-semibold block">Drawn to Date</span>
                <span className="text-xs font-bold text-blue-400 mt-0.5 block">$12,450,000 (67%)</span>
              </div>
            </div>
          </div>

          {/* Recent Draw Requests */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-300">Draw Request Packages</span>
            {[
              { id: 'DR-04', title: 'Draw #4 - Superstructure & Concrete', date: 'May 12, 2025', amount: '$1,850,000', status: 'Approved & Disbursed' },
              { id: 'DR-05', title: 'Draw #5 - MEP Rough-Ins & Framing', date: 'June 01, 2025', amount: '$2,100,000', status: 'Under Bank Inspection' }
            ].map(draw => (
              <div key={draw.id} className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{draw.title}</span>
                  <span className="text-xs font-black text-white">{draw.amount}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{draw.date}</span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${
                    draw.status.includes('Approved')
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}>
                    {draw.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              alert('Draw package compiled and transmitted to lender portal!');
              setIsFinancingOpen(false);
            }}
            className="w-full h-11 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md mt-2 cursor-pointer"
          >
            Share Complete Draw Package with Lender
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. PORTFOLIO FINANCIAL HEALTH (Fintech Hero Card with Visual Distribution Graph) ─── */}
      <div className="p-4 rounded-3xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-3.5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Portfolio Treasury
            </span>
            <h1 className="text-xl font-black text-white tracking-tight mt-0.5">
              $25,550,000
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              3 Active Project Ledgers
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Disbursed
            </span>
            <span className="text-base font-black text-blue-400 mt-0.5 block">
              $16,830,000
            </span>
            <span className="text-[10px] text-blue-300/80 font-bold">
              65.8% Executed
            </span>
          </div>
        </div>

        {/* ── VISUAL CASHFLOW DISTRIBUTION GRAPH (Stacked Segmented Bar) ── */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-[#142036]">
          <div className="w-full h-2.5 bg-[#050811] rounded-full overflow-hidden flex border border-[#142036]">
            {/* 1. Paid / Disbursed (65.8%) */}
            <div 
              className="bg-[#2563EB] h-full transition-all duration-500" 
              style={{ width: '65.8%' }} 
              title="Disbursed: $16.83M (65.8%)"
            />
            {/* 2. Committed / Subcontracts (22.4%) */}
            <div 
              className="bg-[#60A5FA] h-full transition-all duration-500" 
              style={{ width: '22.4%' }} 
              title="Committed: $5.72M (22.4%)"
            />
            {/* 3. Uncommitted / Contingency (11.8%) */}
            <div 
              className="bg-[#1E2E48] h-full transition-all duration-500" 
              style={{ width: '11.8%' }} 
              title="Remaining: $3.00M (11.8%)"
            />
          </div>

          {/* Clean Legend */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span>Paid: <strong className="text-white">$16.8M</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
              <span>Committed: <strong className="text-white">$5.7M</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1E2E48]" />
              <span>Remaining: <strong className="text-white">$3.0M</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. QUICK ACTION HUB (Consistent Deep Slate Blue Style) ─── */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-blue-500/40 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group active:scale-95 shadow-sm text-center"
        >
          <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-white leading-tight">Create Budget</span>
          <span className="text-[8px] text-slate-500">Wizard</span>
        </button>

        <button
          onClick={() => {
            if (onOpenImportBudget) onOpenImportBudget();
            else setIsCreateModalOpen(true);
          }}
          className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-purple-500/40 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group active:scale-95 shadow-sm text-center"
        >
          <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Download className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold text-white leading-tight">Import Budget</span>
          <span className="text-[8px] text-slate-500">CSV / XLSX</span>
        </button>

        <button
          onClick={() => setIsDealAnalyzerOpen(true)}
          className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-blue-500/40 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group active:scale-95 shadow-sm text-center"
        >
          <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <span className="text-[10px] font-bold text-white leading-tight">AI Underwriting</span>
          <span className="text-[8px] text-slate-500">Latti Feasibility</span>
        </button>

        <button
          onClick={() => setIsFinancingOpen(true)}
          className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-blue-500/40 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group active:scale-95 shadow-sm text-center"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-[10px] font-bold text-white leading-tight">Lender Draws</span>
          <span className="text-[8px] text-slate-500">Bank Escrow</span>
        </button>
      </div>

      {/* ─── 3. SEGMENTED CONTROL ─── */}
      <div className="flex items-center gap-2 p-1 bg-[#0A111F] rounded-2xl border border-[#142036]">
        <button
          onClick={() => setViewMode('analytics')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            viewMode === 'analytics'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white font-semibold'
          }`}
        >
          Cost Breakdown
        </button>
        <button
          onClick={() => setViewMode('sheets')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            viewMode === 'sheets'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white font-semibold'
          }`}
        >
          Project Sheets ({budgets.length})
        </button>
      </div>

      {/* ─── 4. PROJECT FILTER PILLS ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {projectsList.map((p) => {
          const isActive = selectedProjectFilter === p;
          return (
            <button
              key={p}
              onClick={() => setSelectedProjectFilter(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-[#2563EB] border-blue-500 text-white font-bold shadow-sm'
                  : 'bg-[#0A111F] text-slate-400 hover:text-white border-[#142036]'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* ─── 5. TAB VIEW CONTENT ─── */}
      {viewMode === 'analytics' ? (
        <div className="flex flex-col gap-2.5">
          {/* Clean Section Header */}
          <div className="flex items-center justify-between px-0.5 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Cost Divisions</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                6 Divisions
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400">Total $6.24M</span>
          </div>

          {/* Division Items List (Clean, single-layer cards) */}
          <div className="flex flex-col gap-2">
            {[
              { code: '01-000', title: 'General Conditions & PM', vendor: 'Avery Marsh Mgmt', budget: '$450,000', committed: '$450,000', actual: '$380,000', pct: 84 },
              { code: '03-000', title: 'Concrete & Foundations', vendor: 'Apex Concrete LLC', budget: '$1,250,000', committed: '$1,250,000', actual: '$1,180,000', pct: 94 },
              { code: '05-000', title: 'Metals & Structural Steel', vendor: 'Titan Steel Works', budget: '$2,100,000', committed: '$1,950,000', actual: '$1,400,000', pct: 67 },
              { code: '09-000', title: 'Finishes & Drywall', vendor: 'Precision Interiors', budget: '$850,000', committed: '$820,000', actual: '$410,000', pct: 48 },
              { code: '22-000', title: 'Plumbing & Drainage', vendor: 'Cascade Plumbing', budget: '$620,000', committed: '$590,000', actual: '$310,000', pct: 50 },
              { code: '26-000', title: 'Electrical & Power Systems', vendor: 'Volt Electric Inc', budget: '$980,000', committed: '$950,000', actual: '$640,000', pct: 65 },
            ].map((div) => (
              <div
                key={div.code}
                onClick={() => setSelectedCostCode(div)}
                className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer flex flex-col gap-2.5 shadow-sm active:scale-[0.99] group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 flex-shrink-0">
                        {div.code}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {div.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                      {div.vendor} · <span className="text-slate-300 font-semibold">{div.actual} paid</span>
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-white block">{div.budget}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{div.pct}%</span>
                  </div>
                </div>

                {/* Clean Integrated Progress Bar */}
                <div className="w-full h-1.5 bg-[#070D1A] rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all"
                    style={{ width: `${div.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Budget Sheets List */
        <div className="flex flex-col gap-2.5">
          {budgets.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedBudgetId(b.id)}
              className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-[#1E325A] transition-all cursor-pointer flex flex-col gap-2.5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-white">{b.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{b.type} • {b.itemsCount} line items</p>
                </div>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  {b.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#142036] text-[11px]">
                <div>
                  <span className="text-slate-500 font-medium block">Total Budget</span>
                  <span className="text-xs font-black text-white block mt-0.5">${(b.totalBudget / 1000000).toFixed(2)}M</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-medium block">Spent</span>
                  <span className="text-xs font-bold text-blue-400 block mt-0.5">${(b.actual / 1000000).toFixed(2)}M ({b.progress}%)</span>
                </div>
              </div>

              <div className="w-full h-1 bg-[#050811] rounded-full overflow-hidden border border-[#142036]">
                <div
                  className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full"
                  style={{ width: `${b.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cost Code Inspector Drawer */}
      {selectedCostCode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div>
                <span className="text-[10px] font-bold text-blue-400">{selectedCostCode.code}</span>
                <h3 className="text-xs font-bold text-white">{selectedCostCode.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCostCode(null)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="p-3 bg-[#050811] rounded-xl border border-[#142036] flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Prime Subcontractor</span>
                  <span className="text-white font-bold">{selectedCostCode.vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Budget</span>
                  <span className="text-white font-bold">{selectedCostCode.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Executed Payments</span>
                  <span className="text-blue-400 font-bold">{selectedCostCode.actual}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCostCode(null)}
              className="w-full h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
