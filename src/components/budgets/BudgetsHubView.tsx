import React, { useState } from 'react';
import { 
  Plus, Target, Ruler, Upload, Download, ChevronRight, Layers, 
  DollarSign, Check, X, FileSpreadsheet, Search, Trash2,
  Building2, Sparkles, Calculator, Archive, RotateCcw, TrendingUp
} from 'lucide-react';
import { BudgetDetailView } from './BudgetDetailView';
import { CreateProjectBudgetModal } from '../modals/CreateProjectBudgetModal';
import { DealAnalyzerModal } from '../modals/DealAnalyzerModal';
import { ImportBudgetModal } from '../modals/ImportBudgetModal';
import { TabSelector } from '../common/TabSelector';
import { FilterPills } from '../common/FilterPills';
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
  },
  {
    id: 'b-4',
    name: 'Sample Construction Deal',
    type: 'Standalone budget',
    totalBudget: 0,
    estimated: 3500,
    committed: 0,
    actual: 0,
    progress: 0,
    itemsCount: 71,
    status: 'DRAFT'
  }
];

const BUDGET_TEMPLATES = [
  {
    id: 'tmpl-1',
    title: 'Commercial Highrise Master Template',
    divisionsCount: 71,
    description: 'Complete 16-Division MasterFormat with heavy civil, core structural steel, curtain wall, elevators, and MEP.',
    recommendedFor: 'Commercial, Highrise & Multi-Story'
  },
  {
    id: 'tmpl-2',
    title: 'Custom Residential Build Template',
    divisionsCount: 50,
    description: 'Residential cost codes covering site grading, post-tension slab foundation, framing, roofing, and luxury finishes.',
    recommendedFor: 'Custom Home & Spec Builds'
  },
  {
    id: 'tmpl-3',
    title: 'Multi-Family Interior Renovation',
    divisionsCount: 28,
    description: 'Optimized fast-turnaround template for tenant fit-outs, drywall, painting, cabinetry, plumbing fixtures, and lighting.',
    recommendedFor: 'Renovation & Tenant Improvements'
  }
];

interface BudgetsHubViewProps {
  onOpenImportBudget?: () => void;
}

export const BudgetsHubView: React.FC<BudgetsHubViewProps> = ({ onOpenImportBudget }) => {
  const [activeTab, setActiveTab] = useState<'budgets' | 'deal_analyzer' | 'templates' | 'archived'>('budgets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDealAnalyzerOpen, setIsDealAnalyzerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [budgets, setBudgets] = useState<BudgetCardItem[]>(INITIAL_BUDGET_CARDS);
  const [archivedBudgets, setArchivedBudgets] = useState<BudgetCardItem[]>([]);

  // Filter budgets by search
  const filteredBudgets = budgets.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteBudget = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const budgetToArchive = budgets.find(b => b.id === id);
    if (!budgetToArchive) return;

    if (window.confirm(`Move "${budgetToArchive.name}" to Archived budgets?`)) {
      setBudgets(prev => prev.filter(b => b.id !== id));
      setArchivedBudgets(prev => [budgetToArchive, ...prev]);
    }
  };

  const handleRestoreBudget = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const budgetToRestore = archivedBudgets.find(b => b.id === id);
    if (!budgetToRestore) return;

    setArchivedBudgets(prev => prev.filter(b => b.id !== id));
    setBudgets(prev => [budgetToRestore, ...prev]);
  };

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
      
      {/* ─── 1. TOP HEADER & SUBTITLE ─── */}
      <div className="flex flex-col gap-0.5">
        <h1 className="text-lg font-bold text-white tracking-tight">Budgets & Financials</h1>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          Create project budgets, analyze deals and monitor financial performance across your company.
        </p>
      </div>

      {/* ─── 2. TOP 3 ACTION LAUNCHPAD CARDS (Reference Platform Trio) ─── */}
      <div className="grid grid-cols-3 gap-2">
        {/* Action 1: Create Project Budget */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="p-3 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/50 flex flex-col justify-between text-left cursor-pointer transition-all active:scale-[0.98] group shadow-sm"
        >
          <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
              Create Budget
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
              Detailed CSI budget linked or standalone.
            </p>
          </div>
        </button>

        {/* Action 2: Analyze a Deal */}
        <button
          onClick={() => setIsDealAnalyzerOpen(true)}
          className="p-3 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-cyan-500/50 flex flex-col justify-between text-left cursor-pointer transition-all active:scale-[0.98] group shadow-sm"
        >
          <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
              Analyze a Deal
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
              Latti Deal Score, ARV & profitability.
            </p>
          </div>
        </button>

        {/* Action 3: Import from BuildScope AI */}
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="p-3 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-teal-500/50 flex flex-col justify-between text-left cursor-pointer transition-all active:scale-[0.98] group shadow-sm"
        >
          <div className="w-7 h-7 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors leading-tight">
              Import AI
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
              Import scopes from BuildScope AI.
            </p>
          </div>
        </button>
      </div>

      {/* ─── 3. SUB-NAVIGATION 4 TABS (Matching Reference Specs) ─── */}
      <TabSelector
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as any)}
        options={[
          { id: 'budgets', label: 'Project Budgets', count: budgets.length },
          { id: 'deal_analyzer', label: 'Deal Analyzer' },
          { id: 'templates', label: 'Templates' },
          { id: 'archived', label: 'Archived', count: archivedBudgets.length }
        ]}
      />

      {/* ─── 4. SEARCH BAR (For Budgets, Templates, and Archive) ─── */}
      {activeTab !== 'deal_analyzer' && (
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, project, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#070D1A] border border-[#142036] rounded-xl pl-9.5 pr-3 text-white text-xs outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
          />
        </div>
      )}

      {/* ─── 5. TAB VIEW CONTENT ─── */}

      {/* TAB 1: PROJECT BUDGETS LIST */}
      {activeTab === 'budgets' && (
        <div className="flex flex-col gap-2.5">
          {filteredBudgets.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#070D1A] border border-[#142036] flex flex-col items-center">
              <FileSpreadsheet className="w-8 h-8 text-slate-500 mb-2" />
              <p className="text-xs font-bold text-white">No budgets found</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Try searching with a different keyword or create a new budget.</p>
            </div>
          ) : (
            filteredBudgets.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBudgetId(b.id)}
                className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer flex flex-col gap-2.5 shadow-sm active:scale-[0.99] group"
              >
                {/* Card Header: Icon + Title + Type + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                        {b.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5 truncate">
                        {b.type}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    b.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : b.status === 'APPROVED'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    {b.status}
                  </span>
                </div>

                {/* 4 Standard Metrics Grid (Matching Reference Screenshot) */}
                <div className="grid grid-cols-4 gap-1.5 py-2 px-2.5 rounded-xl bg-[#050811] border border-[#142036]/80 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Budget</span>
                    <span className="text-[12px] font-bold text-white mt-0.5 block truncate">
                      ${b.totalBudget > 0 ? (b.totalBudget / 1000).toLocaleString() + 'K' : '$0'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Estimated</span>
                    <span className="text-[12px] font-bold text-blue-400 mt-0.5 block truncate">
                      ${(b.estimated / 1000).toLocaleString()}K
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Committed</span>
                    <span className="text-[12px] font-bold text-slate-300 mt-0.5 block truncate">
                      ${b.committed > 0 ? (b.committed / 1000).toLocaleString() + 'K' : '$0'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Actual</span>
                    <span className="text-[12px] font-bold text-emerald-400 mt-0.5 block truncate">
                      ${b.actual > 0 ? (b.actual / 1000).toLocaleString() + 'K' : '$0'}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Items Count + Delete Action */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-slate-400" />
                    <span>{b.itemsCount} items</span>
                  </span>

                  <button
                    onClick={(e) => handleDeleteBudget(b.id, e)}
                    className="w-6 h-6 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center cursor-pointer transition-colors"
                    title="Archive Budget"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: EMBEDDED LATTI DEAL ANALYZER */}
      {activeTab === 'deal_analyzer' && (
        <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#142036] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Latti Deal Analyzer™</h3>
                <p className="text-[10px] text-slate-400">Underwrite property deals, margins & construction loans</p>
              </div>
            </div>

            <button
              onClick={() => setIsDealAnalyzerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
            >
              Full Screen
            </button>
          </div>

          <div className="p-3 bg-[#050811] rounded-xl border border-[#142036] text-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sample Property:</span>
              <strong className="text-white">742 Evergreen Terrace, Austin TX</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Latti Deal Score:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                85 / 100 · Strong Buy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Projected Net Profit:</span>
              <strong className="text-emerald-400">+$255,000 (17.6% Margin)</strong>
            </div>
          </div>

          <button
            onClick={() => setIsDealAnalyzerOpen(true)}
            className="w-full py-2 rounded-xl bg-[#0E1A33] hover:bg-[#142036] text-blue-400 hover:text-white text-xs font-bold border border-blue-500/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Interactive Scenario Calculator</span>
          </button>
        </div>
      )}

      {/* TAB 3: CSI BUDGET TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="flex flex-col gap-2.5">
          {BUDGET_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all flex flex-col gap-2.5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white">{tmpl.title}</h3>
                  <span className="text-[10px] text-blue-400 font-semibold block mt-0.5">
                    {tmpl.recommendedFor}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-300 bg-[#050811] px-2 py-0.5 rounded border border-[#142036] flex-shrink-0">
                  {tmpl.divisionsCount} Divisions
                </span>
              </div>

              <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
                {tmpl.description}
              </p>

              <div className="pt-2 border-t border-[#142036] flex justify-end">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Use Template</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: ARCHIVED BUDGETS */}
      {activeTab === 'archived' && (
        <div className="flex flex-col gap-2.5">
          {archivedBudgets.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#070D1A] border border-[#142036] flex flex-col items-center">
              <Archive className="w-8 h-8 text-slate-500 mb-2" />
              <p className="text-xs font-bold text-white">No archived budgets</p>
              <p className="text-[10px] text-slate-400 mt-0.5">When you archive a budget, it will appear safely stored here.</p>
            </div>
          ) : (
            archivedBudgets.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-300 truncate">{b.name}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{b.type} · ${((b.totalBudget || b.estimated) / 1000000).toFixed(2)}M</p>
                </div>

                <button
                  onClick={(e) => handleRestoreBudget(b.id, e)}
                  className="px-3 py-1.5 rounded-xl bg-[#0E1A33] hover:bg-[#142036] text-blue-400 hover:text-white text-xs font-bold border border-[#1E2E4A] flex items-center gap-1 cursor-pointer transition-all active:scale-95 flex-shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── 6. MODALS ─── */}
      {isDealAnalyzerOpen && (
        <DealAnalyzerModal
          isFullScreenPage={true}
          onClose={() => setIsDealAnalyzerOpen(false)}
        />
      )}

      {isImportModalOpen && (
        <ImportBudgetModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          projects={MOCK_PROJECTS}
          onImportSuccess={(projectId, budgetName, totalAmount) => {
            const newBudget: BudgetCardItem = {
              id: `b-${Date.now()}`,
              name: budgetName || 'BuildScope AI Imported Budget',
              type: 'Project linked',
              totalBudget: totalAmount || 4200000,
              estimated: totalAmount || 4200000,
              committed: 0,
              actual: 0,
              progress: 0,
              itemsCount: 71,
              status: 'DRAFT'
            };
            setBudgets(prev => [newBudget, ...prev]);
            setIsImportModalOpen(false);
          }}
        />
      )}

    </div>
  );
};
