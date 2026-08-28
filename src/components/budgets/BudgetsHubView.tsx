import React, { useState } from 'react';
import { 
  Plus, Download, ChevronRight, Layers, 
  DollarSign, Check, X, FileSpreadsheet, Target, Ruler, Search, Trash2, Wallet, PieChart, Archive
} from 'lucide-react';
import { BudgetDetailView } from './BudgetDetailView';
import { CreateProjectBudgetModal } from '../modals/CreateProjectBudgetModal';
import { DealAnalyzerModal } from '../modals/DealAnalyzerModal';
import { ImportBudgetModal } from '../modals/ImportBudgetModal';
import { CreateTemplateModal } from '../modals/CreateTemplateModal';
import { MOCK_PROJECTS } from '../../data/mockData';

export interface BudgetCardItem {
  id: string;
  name: string;
  subtitle: string;
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
    subtitle: 'Project linked · Riverside Commercial Site',
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
    subtitle: 'Project linked · Metro Core Tower',
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
    subtitle: 'Project linked · Phase 1 Campus',
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
    name: 'Test Budget 123',
    subtitle: 'Standalone budget · Sample 2',
    type: 'Standalone budget',
    totalBudget: 3500000,
    estimated: 3500000,
    committed: 1200000,
    actual: 850000,
    progress: 25,
    itemsCount: 71,
    status: 'DRAFT'
  },
  {
    id: 'b-5',
    name: 'Template Verification Budget',
    subtitle: 'Standalone budget · CSI 16-Division',
    type: 'Standalone budget',
    totalBudget: 5800000,
    estimated: 5800000,
    committed: 4100000,
    actual: 3200000,
    progress: 55,
    itemsCount: 71,
    status: 'DRAFT'
  }
];

const TEMPLATE_BUDGET_CARDS: BudgetCardItem[] = [
  {
    id: 'tmpl-1',
    name: 'Commercial Highrise Master (71 Divisions)',
    subtitle: 'Template · Full CSI MasterFormat',
    type: 'Standalone budget',
    totalBudget: 15000000,
    estimated: 15000000,
    committed: 0,
    actual: 0,
    progress: 0,
    itemsCount: 71,
    status: 'DRAFT'
  },
  {
    id: 'tmpl-2',
    name: 'Custom Residential Build (50 Divisions)',
    subtitle: 'Template · Luxury Single Family',
    type: 'Standalone budget',
    totalBudget: 4200000,
    estimated: 4200000,
    committed: 0,
    actual: 0,
    progress: 0,
    itemsCount: 50,
    status: 'DRAFT'
  },
  {
    id: 'tmpl-3',
    name: 'Multi-Family Interior Renovation (28 Divisions)',
    subtitle: 'Template · Tenant Fit-Out Ledger',
    type: 'Standalone budget',
    totalBudget: 2100000,
    estimated: 2100000,
    committed: 0,
    actual: 0,
    progress: 0,
    itemsCount: 28,
    status: 'DRAFT'
  }
];

// SVG Donut Graphic Component using App Brand Colors
const BudgetDonutChart = ({ paidPct, committedPct, remainingPct }: { paidPct: number; committedPct: number; remainingPct: number }) => {
  const size = 96;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const paidDash = (paidPct / 100) * circumference;
  const committedDash = (committedPct / 100) * circumference;
  const remainingDash = (remainingPct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center flex-shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#050811" strokeWidth={strokeWidth} />
        {/* Paid: Sapphire Blue */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#2563EB" strokeWidth={strokeWidth} strokeDasharray={`${paidDash} ${circumference - paidDash}`} strokeDashoffset={0} strokeLinecap="round" />
        {/* Committed: Sky Blue */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#38BDF8" strokeWidth={strokeWidth} strokeDasharray={`${committedDash} ${circumference - committedDash}`} strokeDashoffset={-paidDash} strokeLinecap="round" />
        {/* Remaining: Emerald Green */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#10B981" strokeWidth={strokeWidth} strokeDasharray={`${remainingDash} ${circumference - remainingDash}`} strokeDashoffset={-(paidDash + committedDash)} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Paid</span>
        <span className="text-xs font-black text-white">{paidPct.toFixed(0)}%</span>
      </div>
    </div>
  );
};

interface BudgetsHubViewProps {
  onOpenImportBudget?: () => void;
  onSelectBudgetName?: (name: string | null) => void;
}

export const BudgetsHubView: React.FC<BudgetsHubViewProps> = ({ onOpenImportBudget, onSelectBudgetName }) => {
  const [activeTab, setActiveTab] = useState<'project' | 'deal' | 'templates' | 'archived'>('project');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDealAnalyzerOpen, setIsDealAnalyzerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  
  const [budgets, setBudgets] = useState<BudgetCardItem[]>(INITIAL_BUDGET_CARDS);
  const [templatesList, setTemplatesList] = useState<BudgetCardItem[]>(TEMPLATE_BUDGET_CARDS);

  const handleDeleteBudget = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'templates') {
        setTemplatesList(prev => prev.filter(b => b.id !== id));
      } else {
        setBudgets(prev => prev.filter(b => b.id !== id));
      }
    }
  };

  const getFilteredBudgets = () => {
    let list = budgets;
    if (activeTab === 'templates') {
      list = templatesList;
    } else if (activeTab === 'archived') {
      list = [];
    }

    if (!searchQuery.trim()) return list;

    return list.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredBudgets = getFilteredBudgets();

  // 1. If user drilled down into a specific budget sheet details page
  if (selectedBudgetId) {
    return (
      <BudgetDetailView 
        budgetId={selectedBudgetId} 
        onBack={() => {
          setSelectedBudgetId(null);
          if (onSelectBudgetName) onSelectBudgetName(null);
        }} 
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
            subtitle: budgetData.attachType === 'project' ? 'Project linked' : 'Standalone budget',
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
    <div className="w-full flex flex-col gap-4 px-5 py-5 pb-32 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. PAGE HEADER (Using App Brand Sapphire Palette) ─── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight truncate">
              Budgets
            </h1>
            <p className="text-xs text-slate-400 font-medium truncate">
              Financial Master Ledger & Deal Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* ─── 2. COMPACT 3-COLUMN ERGONOMIC ACTION LAUNCHPAD (App Color Tokens) ─── */}
      <div className="grid grid-cols-3 gap-2">
        {/* Action 1: Create Project Budget */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="p-3 rounded-2xl bg-[#091122]/90 border border-[#172540] hover:border-blue-500/50 transition-all cursor-pointer shadow-sm group active:scale-95 flex flex-col items-center text-center gap-1.5"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
            New Budget
          </span>
        </button>

        {/* Action 2: Analyze a Deal */}
        <button
          onClick={() => setIsDealAnalyzerOpen(true)}
          className="p-3 rounded-2xl bg-[#091122]/90 border border-[#172540] hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm group active:scale-95 flex flex-col items-center text-center gap-1.5"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PieChart className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight">
            Deal Analyzer
          </span>
        </button>

        {/* Action 3: Import from BuildScope AI */}
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="p-3 rounded-2xl bg-[#091122]/90 border border-[#172540] hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm group active:scale-95 flex flex-col items-center text-center gap-1.5"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Ruler className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight">
            Import AI
          </span>
        </button>
      </div>

      {/* ─── 3. EXECUTIVE PORTFOLIO FINANCIAL HEALTH CARD (Dark Sapphire Palette) ─── */}
      <div className="p-4 rounded-3xl bg-[#091122]/90 border border-[#172540] shadow-md flex items-center justify-between gap-3">
        <BudgetDonutChart paidPct={81.7} committedPct={10.7} remainingPct={7.6} />

        <div className="flex flex-col justify-center gap-1.5 flex-1 min-w-0">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Master Portfolio</span>
            <h2 className="text-xl font-black text-white tracking-tight leading-none mt-0.5">$26.07M</h2>
          </div>

          <div className="flex flex-col gap-1 pt-1.5 border-t border-[#142036]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0" />
                <span className="text-slate-400 truncate">Paid:</span>
              </div>
              <span className="font-bold text-white ml-2">$21.32M</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] flex-shrink-0" />
                <span className="text-slate-400 truncate">Committed:</span>
              </div>
              <span className="font-bold text-sky-400 ml-2">$2.78M</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0" />
                <span className="text-slate-400 truncate">Remaining:</span>
              </div>
              <span className="font-bold text-emerald-400 ml-2">$1.97M</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. SUB-NAVIGATION FILTER TABS (Matching Screenshot Solid Blue Active Pill Style) ─── */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 text-xs">
        <button
          onClick={() => setActiveTab('project')}
          className={`px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer flex-shrink-0 flex items-center gap-2 font-bold ${
            activeTab === 'project'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500'
              : 'bg-[#091122]/90 text-slate-300 hover:text-white border border-[#172540] hover:border-slate-600'
          }`}
        >
          <Wallet className={`w-4 h-4 ${activeTab === 'project' ? 'text-white' : 'text-slate-400'}`} />
          <span>Project Budgets</span>
        </button>

        <button
          onClick={() => setIsDealAnalyzerOpen(true)}
          className={`px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer flex-shrink-0 flex items-center gap-2 font-bold ${
            activeTab === 'deal'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500'
              : 'bg-[#091122]/90 text-slate-300 hover:text-white border border-[#172540] hover:border-slate-600'
          }`}
        >
          <PieChart className={`w-4 h-4 ${activeTab === 'deal' ? 'text-white' : 'text-slate-400'}`} />
          <span>Deal Analyzer</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer flex-shrink-0 flex items-center gap-2 font-bold ${
            activeTab === 'templates'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500'
              : 'bg-[#091122]/90 text-slate-300 hover:text-white border border-[#172540] hover:border-slate-600'
          }`}
        >
          <Layers className={`w-4 h-4 ${activeTab === 'templates' ? 'text-white' : 'text-slate-400'}`} />
          <span>Templates</span>
        </button>

        <button
          onClick={() => setActiveTab('archived')}
          className={`px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer flex-shrink-0 flex items-center gap-2 font-bold ${
            activeTab === 'archived'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500'
              : 'bg-[#091122]/90 text-slate-300 hover:text-white border border-[#172540] hover:border-slate-600'
          }`}
        >
          <Archive className={`w-4 h-4 ${activeTab === 'archived' ? 'text-white' : 'text-slate-400'}`} />
          <span>Archived</span>
        </button>
      </div>

      {/* ─── 5. SEARCH BAR ─── */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, project, address..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#050811] border border-[#142036] text-white text-xs font-medium placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-slate-500 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* ─── 6. BUDGET CARDS LIST & TEMPLATE LAUNCHER ─── */}
      <div className="flex flex-col gap-3">
        {/* If Templates Tab is Active: Show + New Budget Template Launch Card */}
        {activeTab === 'templates' && (
          <button
            onClick={() => setIsCreateTemplateOpen(true)}
            className="p-4 rounded-2xl bg-[#091122]/90 border border-dashed border-[#1E325A] hover:border-blue-500/80 transition-all cursor-pointer shadow-sm flex items-center justify-between gap-3 group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="text-left min-w-0">
                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                  Create Budget Template
                </h3>
                <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                  Build custom CSI MasterFormat template layout
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
              + New Template
            </span>
          </button>
        )}

        {filteredBudgets.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#070D1A] border border-[#142036] text-center flex flex-col items-center justify-center gap-2">
            <Wallet className="w-8 h-8 text-slate-600 mb-1" />
            <p className="text-sm font-bold text-slate-300">No {activeTab === 'templates' ? 'templates' : 'budgets'} found</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or create a new template.</p>
          </div>
        ) : (
          filteredBudgets.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                setSelectedBudgetId(b.id);
                if (onSelectBudgetName) onSelectBudgetName(b.name);
              }}
              className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer flex flex-col gap-3 shadow-sm active:scale-[0.99] group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-[#0D182E] border border-[#182846] text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Wallet className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                      {b.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 truncate font-medium">
                      {b.subtitle}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 uppercase tracking-wider ${
                  b.status === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : b.status === 'APPROVED'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
                }`}>
                  {b.status}
                </span>
              </div>

              {/* 4-Metric Grid */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#142036]/60 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Budget</span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    ${b.totalBudget > 0 ? (b.totalBudget / 1000000).toFixed(2) + 'M' : '0'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Estimated</span>
                  <span className="text-xs font-bold text-blue-400 block mt-0.5">
                    ${b.estimated > 0 ? (b.estimated > 1000000 ? (b.estimated / 1000000).toFixed(2) + 'M' : b.estimated.toLocaleString()) : '0'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Committed</span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    ${b.committed > 0 ? (b.committed / 1000000).toFixed(2) + 'M' : '0'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Actual</span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    ${b.actual > 0 ? (b.actual / 1000000).toFixed(2) + 'M' : '0'}
                  </span>
                </div>
              </div>

              {/* Card Footer Meta */}
              <div className="flex items-center justify-between pt-2 border-t border-[#142036]/40 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <span className="text-slate-300 font-semibold">$ {b.itemsCount} items</span>
                </span>
                
                <button
                  onClick={(e) => handleDeleteBudget(b.id, e)}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete budget"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Auxiliary Modals */}
      {isDealAnalyzerOpen && (
        <DealAnalyzerModal
          isOpen={isDealAnalyzerOpen}
          onClose={() => setIsDealAnalyzerOpen(false)}
        />
      )}

      {isImportModalOpen && (
        <ImportBudgetModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          projects={MOCK_PROJECTS}
          onImportSuccess={(projId, name, amount) => {
            alert(`Budget imported: ${name} ($${(amount / 1000000).toFixed(2)}M)`);
          }}
        />
      )}

      {/* Create Budget Template Modal (Matching Screenshot 2) */}
      {isCreateTemplateOpen && (
        <CreateTemplateModal
          isOpen={isCreateTemplateOpen}
          onClose={() => setIsCreateTemplateOpen(false)}
          onCreateTemplate={(tmplData) => {
            const newTmpl: BudgetCardItem = {
              id: `tmpl-${Date.now()}`,
              name: tmplData.name,
              subtitle: `Template · ${tmplData.projectType}`,
              type: 'Standalone budget',
              totalBudget: 4500000,
              estimated: 4500000,
              committed: 0,
              actual: 0,
              progress: 0,
              itemsCount: 50,
              status: 'DRAFT'
            };
            setTemplatesList(prev => [newTmpl, ...prev]);
            setSelectedBudgetId(newTmpl.id);
            setToastMessage('Template created');
            setTimeout(() => setToastMessage(null), 3000);
          }}
        />
      )}

      {/* Toast Notification (Matching Screenshot 3 bottom-right pill) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0E1A33] border border-blue-500/40 px-4 py-2.5 rounded-2xl text-xs font-bold text-white shadow-2xl flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
