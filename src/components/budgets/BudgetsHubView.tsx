import React, { useState } from 'react';
import { 
  Plus, Clock, Sparkles, Search, Layers, TrendingUp, 
  Trash2, ChevronRight, FileSpreadsheet, DollarSign, Calculator 
} from 'lucide-react';
import { BudgetDetailView } from './BudgetDetailView';
import { CreateBudgetModal } from '../modals/CreateBudgetModal';

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
    name: '123 maple',
    type: 'Standalone budget',
    totalBudget: 0,
    estimated: 0,
    committed: 0,
    actual: 0,
    progress: 0,
    itemsCount: 71,
    status: 'DRAFT'
  },
  {
    id: 'b-2',
    name: 'Sample',
    type: 'Standalone budget',
    totalBudget: 780000,
    estimated: 750070,
    committed: 780000,
    actual: 750000,
    progress: 96,
    itemsCount: 71,
    dealScore: '5/5',
    profitText: '↗ $662,413 · 26%',
    status: 'ACTIVE'
  },
  {
    id: 'b-3',
    name: 'Maple Sample',
    type: 'Standalone budget',
    totalBudget: 1000000,
    estimated: 800070,
    committed: 0,
    actual: 0,
    progress: 80,
    itemsCount: 71,
    dealScore: '5/5',
    profitText: '↗ $572,913 · 23%',
    status: 'ACTIVE'
  },
  {
    id: 'b-4',
    name: 'Sample 2 — PlanGrid',
    type: 'Standalone budget',
    totalBudget: 305457,
    estimated: 305457,
    committed: 0,
    actual: 0,
    progress: 100,
    itemsCount: 27,
    status: 'APPROVED'
  },
  {
    id: 'b-5',
    name: 'Snell Isle Waterfront',
    type: 'Standalone budget',
    totalBudget: 0,
    estimated: 690000,
    committed: 0,
    actual: 0,
    progress: 0,
    itemsCount: 71,
    dealScore: '5/5',
    profitText: '↗ $980,000 · 36%',
    status: 'ACTIVE'
  },
  {
    id: 'b-6',
    name: 'Port Charlotte Builds',
    type: 'Standalone budget',
    totalBudget: 0,
    estimated: 234000,
    committed: 0,
    actual: 0,
    progress: 0,
    itemsCount: 71,
    dealScore: '5/5',
    profitText: '↗ $109,400 · 25%',
    status: 'ACTIVE'
  }
];

export const BudgetsHubView: React.FC = () => {
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'budgets' | 'deal' | 'templates' | 'archived'>('budgets');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [budgets, setBudgets] = useState<BudgetCardItem[]>(INITIAL_BUDGET_CARDS);

  if (selectedBudgetId) {
    return (
      <BudgetDetailView
        budgetId={selectedBudgetId}
        onBack={() => setSelectedBudgetId(null)}
      />
    );
  }

  const filteredBudgets = budgets.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveBudget = (data: any) => {
    const newBudget: BudgetCardItem = {
      id: `b-${Date.now()}`,
      name: data.budgetName,
      type: 'Standalone budget',
      totalBudget: 0,
      estimated: 0,
      committed: 0,
      actual: 0,
      progress: 0,
      itemsCount: 71,
      status: 'DRAFT'
    };
    setBudgets(prev => [newBudget, ...prev]);
    setSelectedBudgetId(newBudget.id);
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-24 font-sans text-slate-100">
      {/* Header (Matching Screenshot 5) */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 ring-4 ring-teal-400/20" />
          <h1 className="text-lg font-black text-white tracking-tight">Budgets</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Create project budgets, analyze deals and monitor financial performance across your company.
        </p>
      </div>

      {/* 3 Top Action Cards (Matching Screenshot 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Create Project Budget */}
        <div
          onClick={() => setIsCreateModalOpen(true)}
          className="p-4 rounded-2xl bg-[#0D1422] border border-[#1A263B] hover:border-teal-500/50 transition-all cursor-pointer shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Plus className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-xs font-black text-white group-hover:text-teal-400 transition-colors">
                Create Project Budget
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Detailed construction budget connected to a project, opportunity or standalone.
            </p>
          </div>
        </div>

        {/* Card 2: Analyze a Deal */}
        <div
          onClick={() => setSelectedBudgetId('b-2')}
          className="p-4 rounded-2xl bg-[#0D1422] border border-[#1A263B] hover:border-teal-500/50 transition-all cursor-pointer shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Clock className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-xs font-black text-white group-hover:text-teal-400 transition-colors">
                Analyze a Deal
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Full Latti Deal Analyzer with financing, profitability, scenarios and Deal Score.
            </p>
          </div>
        </div>

        {/* Card 3: Import from BuildScope AI */}
        <div
          onClick={() => setSelectedBudgetId('b-4')}
          className="p-4 rounded-2xl bg-[#0D1422] border border-[#1A263B] hover:border-teal-500/50 transition-all cursor-pointer shadow-md group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-xs font-black text-white group-hover:text-teal-400 transition-colors">
                Import from BuildScope AI
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Create a draft budget using approved quantities, scopes and cost information.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Pills (Matching Screenshot 5) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'budgets', label: 'Project Budgets' },
          { id: 'deal', label: 'Deal Analyzer' },
          { id: 'templates', label: 'Templates' },
          { id: 'archived', label: 'Archived' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-500/15 text-[#00D2B4] border border-teal-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-[#0A0E17]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, project, address..."
          className="w-full bg-[#080D18] border border-[#162033] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-teal-400 placeholder-slate-500"
        />
      </div>

      {/* Grid of Budget Cards (Matching Screenshot 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredBudgets.map((b) => (
          <div
            key={b.id}
            onClick={() => setSelectedBudgetId(b.id)}
            className="p-4 rounded-2xl bg-[#0C121F] border border-[#182438] hover:border-teal-500/40 transition-all cursor-pointer shadow-sm flex flex-col justify-between gap-3 group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-teal-400 transition-colors">
                    {b.name}
                  </h4>
                  <span className="text-[10px] text-slate-500">{b.type}</span>
                </div>
                <span className="text-[9px] font-black uppercase text-slate-400 bg-[#141F33] px-2 py-0.5 rounded border border-[#1E2E4A]">
                  {b.status}
                </span>
              </div>

              {/* 4 Financial Columns */}
              <div className="grid grid-cols-4 gap-1 pt-3 text-[10px]">
                <div>
                  <span className="text-slate-500 block">Total Budget</span>
                  <div className="font-extrabold text-white mt-0.5">${b.totalBudget.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-slate-500 block">Estimated</span>
                  <div className="font-extrabold text-white mt-0.5">${b.estimated.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-slate-500 block">Committed</span>
                  <div className="font-extrabold text-white mt-0.5">${b.committed.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-slate-500 block">Actual</span>
                  <div className="font-extrabold text-white mt-0.5">${b.actual.toLocaleString()}</div>
                </div>
              </div>

              {/* Progress bar if applicable */}
              {b.progress > 0 && (
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>Estimated vs Budget</span>
                    <span className="font-bold text-white">{b.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#141F33] rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${b.progress}%` }} />
                  </div>
                </div>
              )}

              {/* Deal Score highlight */}
              {b.dealScore && (
                <div className="flex items-center justify-between text-[10px] pt-2 mt-1 border-t border-[#141E2F]">
                  <span className="text-slate-400">Deal Score <strong className="text-teal-400">{b.dealScore}</strong></span>
                  <span className="text-emerald-400 font-bold">{b.profitText}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#141E2F] text-[10px] text-slate-500">
              <span>${b.itemsCount} items</span>
              <Trash2 className="w-3.5 h-3.5 text-slate-600 hover:text-rose-400" />
            </div>
          </div>
        ))}
      </div>

      {/* CREATE BUDGET MODAL */}
      <CreateBudgetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveBudget}
      />
    </div>
  );
};
