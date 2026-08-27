import React, { useState } from 'react';
import { 
  Plus, Download, ChevronRight, Layers, 
  DollarSign, Check, X, FileSpreadsheet
} from 'lucide-react';
import { BudgetDetailView } from './BudgetDetailView';
import { CreateProjectBudgetModal } from '../modals/CreateProjectBudgetModal';
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
  const [selectedCostCode, setSelectedCostCode] = useState<{
    code: string;
    title: string;
    vendor: string;
    budget: string;
    committed: string;
    actual: string;
    pct: number;
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

  // 2. If user opens Create Budget as a full-screen dedicated page
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

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. TOP HEADER & PRIMARY ACTION ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Budgets & Cost Codes</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Master CSI Financial Ledger</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-9 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Budget</span>
        </button>
      </div>

      {/* ─── 2. PORTFOLIO FINANCIAL SUMMARY CARD ─── */}
      <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Budget
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
              $25.55M
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              3 Active Projects
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Spent to Date
            </span>
            <span className="text-lg font-bold text-blue-400 mt-0.5 block">
              $16.83M
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              $3.00M remaining
            </span>
          </div>
        </div>

        {/* Cashflow Segmented Track */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-[#142036]">
          <div className="w-full h-2 bg-[#050811] rounded-full overflow-hidden flex border border-[#142036]">
            <div className="bg-[#2563EB] h-full" style={{ width: '65.8%' }} title="Paid: $16.83M" />
            <div className="bg-[#60A5FA] h-full" style={{ width: '22.4%' }} title="Committed: $5.72M" />
            <div className="bg-[#1E2E48] h-full" style={{ width: '11.8%' }} title="Remaining: $3.00M" />
          </div>

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

      {/* ─── 3. SEGMENTED TABS: COST BREAKDOWN vs PROJECT SHEETS ─── */}
      <div className="flex items-center gap-2 p-1 bg-[#070D1A] rounded-xl border border-[#142036]">
        <button
          onClick={() => setViewMode('analytics')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
            viewMode === 'analytics'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-400 hover:text-white font-semibold'
          }`}
        >
          CSI Cost Breakdown
        </button>
        <button
          onClick={() => setViewMode('sheets')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-[#2563EB] border-blue-500 text-white font-bold shadow-sm'
                  : 'bg-[#070D1A] text-slate-400 hover:text-white border-[#142036]'
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
          <div className="flex items-center justify-between px-0.5 pt-1">
            <span className="text-xs font-bold text-white uppercase tracking-wider">CSI Divisions</span>
            <span className="text-xs font-semibold text-slate-400">Total $6.24M</span>
          </div>

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
                className="p-3.5 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer flex flex-col gap-2 shadow-sm active:scale-[0.99] group"
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

                <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden border border-[#142036]">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full" style={{ width: `${div.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-0.5 pt-1">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Project Budget Sheets</span>
            <span className="text-xs font-semibold text-slate-400">{budgets.length} Projects</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {budgets.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBudgetId(b.id)}
                className="p-3.5 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer flex flex-col gap-2.5 shadow-sm active:scale-[0.99] group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                      {b.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      {b.itemsCount} Cost Code Items
                    </p>
                  </div>

                  <span className="text-xs font-bold text-white flex-shrink-0">
                    ${(b.totalBudget / 1000000).toFixed(2)}M
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#142036] text-[11px]">
                  <span className="text-slate-400">
                    Spent: <strong className="text-blue-400">${(b.actual / 1000000).toFixed(2)}M</strong>
                  </span>
                  <span className="text-slate-400">
                    Remaining: <strong className="text-emerald-400">${((b.totalBudget - b.actual) / 1000000).toFixed(2)}M</strong>
                  </span>
                </div>

                <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden border border-[#142036]">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full" style={{ width: `${b.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 6. COST CODE ITEM DETAIL MODAL ─── */}
      {selectedCostCode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-[#070D1A] border border-[#1E2E4A] rounded-2xl p-5 shadow-2xl flex flex-col gap-3 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {selectedCostCode.code}
                </span>
                <h3 className="text-xs font-bold text-white truncate">{selectedCostCode.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCostCode(null)}
                className="w-6 h-6 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#050811] border border-[#142036]">
                <span className="text-[10px] text-slate-400 font-medium block">Total Budget</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{selectedCostCode.budget}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050811] border border-[#142036]">
                <span className="text-[10px] text-slate-400 font-medium block">Committed Subcontracts</span>
                <span className="text-sm font-bold text-slate-200 mt-0.5 block">{selectedCostCode.committed}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050811] border border-[#142036]">
                <span className="text-[10px] text-slate-400 font-medium block">Paid to Date</span>
                <span className="text-sm font-bold text-blue-400 mt-0.5 block">{selectedCostCode.actual}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050811] border border-[#142036]">
                <span className="text-[10px] text-slate-400 font-medium block">Subcontractor</span>
                <span className="text-xs font-bold text-white mt-0.5 block truncate">{selectedCostCode.vendor}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#142036] flex justify-end">
              <button
                onClick={() => setSelectedCostCode(null)}
                className="px-4 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-bold cursor-pointer"
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
