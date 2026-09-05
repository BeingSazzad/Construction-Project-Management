import React, { useState } from 'react';
import { 
  Plus, Layers, FileSpreadsheet, Search, Trash2, Wallet, Archive, Download
} from 'lucide-react';
import { BudgetDetailView } from './BudgetDetailView';
import { CreateProjectBudgetModal } from '../modals/CreateProjectBudgetModal';
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
    name: 'Snell Isle Residence',
    subtitle: 'Project linked · 1428 Snell Isle Blvd',
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
    name: 'Bayshore Custom Villa',
    subtitle: 'Standalone budget · Waterfront Lot 12',
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
    name: 'Residential Master Standard',
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

// SVG Donut Graphic Component using Apple Light Tokens
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
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EAEDF1" strokeWidth={strokeWidth} />
        {/* Paid: Primary Blue */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1677FF" strokeWidth={strokeWidth} strokeDasharray={`${paidDash} ${circumference - paidDash}`} strokeDashoffset={0} strokeLinecap="round" />
        {/* Committed: Cyan/Sky Blue */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#13C2C2" strokeWidth={strokeWidth} strokeDasharray={`${committedDash} ${circumference - committedDash}`} strokeDashoffset={-paidDash} strokeLinecap="round" />
        {/* Remaining: Emerald Green */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#52C41A" strokeWidth={strokeWidth} strokeDasharray={`${remainingDash} ${circumference - remainingDash}`} strokeDashoffset={-(paidDash + committedDash)} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] text-[#68707C] font-bold uppercase tracking-wider">Paid</span>
        <span className="text-xs font-black text-[#171A1F]">{paidPct.toFixed(0)}%</span>
      </div>
    </div>
  );
};

interface BudgetsHubViewProps {
  onOpenImportBudget?: () => void;
  onSelectBudgetName?: (name: string | null) => void;
}

export const BudgetsHubView: React.FC<BudgetsHubViewProps> = ({ onSelectBudgetName }) => {
  const [activeTab, setActiveTab] = useState<'project' | 'templates' | 'archived'>('project');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
    <div className="w-full flex flex-col gap-4 px-5 py-5 pb-32 font-sans max-w-[430px] md:max-w-3xl mx-auto text-[#171A1F] animate-fade-in">
      
      {/* ─── 1. PAGE HEADER ─── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#171A1F] tracking-tight leading-tight truncate">
              Budgets & Financials
            </h1>
            <p className="text-xs text-[#68707C] font-medium truncate">
              Committed costs, actual spend, and variance ledger
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-9 px-3.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Budget</span>
        </button>
      </div>

      {/* ─── 2. EXECUTIVE PORTFOLIO FINANCIAL HEALTH CARD ─── */}
      <div className="p-5 rounded-3xl bg-white border border-[#DDE1E7] shadow-xs flex items-center justify-between gap-4">
        <BudgetDonutChart paidPct={81.7} committedPct={10.7} remainingPct={7.6} />

        <div className="flex flex-col justify-center gap-2 flex-1 min-w-0">
          <div>
            <span className="text-[10px] text-[#68707C] font-bold uppercase tracking-wider block">Master Portfolio Budget</span>
            <h2 className="text-xl font-black text-[#171A1F] tracking-tight leading-none mt-0.5">$26.07M</h2>
          </div>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-[#EAEDF1]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1677FF] flex-shrink-0" />
                <span className="text-[#68707C] truncate">Paid:</span>
              </div>
              <span className="font-bold text-[#171A1F] ml-2">$21.32M</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#13C2C2] flex-shrink-0" />
                <span className="text-[#68707C] truncate">Committed:</span>
              </div>
              <span className="font-bold text-[#13C2C2] ml-2">$2.78M</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#52C41A] flex-shrink-0" />
                <span className="text-[#68707C] truncate">Remaining:</span>
              </div>
              <span className="font-bold text-[#389E0D] ml-2">$1.97M</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. SUB-NAVIGATION FILTER TABS ─── */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 text-xs">
        <button
          onClick={() => setActiveTab('project')}
          className={`px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer flex-shrink-0 flex items-center gap-2 font-bold ${
            activeTab === 'project'
              ? 'bg-[#1677FF] text-white shadow-xs'
              : 'bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] border border-[#DDE1E7]'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Project Budgets</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer flex-shrink-0 flex items-center gap-2 font-bold ${
            activeTab === 'templates'
              ? 'bg-[#1677FF] text-white shadow-xs'
              : 'bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] border border-[#DDE1E7]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>CSI Master Templates</span>
        </button>

        <button
          onClick={() => setActiveTab('archived')}
          className={`px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer flex-shrink-0 flex items-center gap-2 font-bold ${
            activeTab === 'archived'
              ? 'bg-[#1677FF] text-white shadow-xs'
              : 'bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] border border-[#DDE1E7]'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Archived</span>
        </button>
      </div>

      {/* ─── 4. SEARCH BAR ─── */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-[#9DA5B1] absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, project, address..."
          className="w-full h-10 pl-10 pr-8 rounded-xl bg-white border border-[#DDE1E7] text-[#171A1F] text-xs font-medium placeholder-[#9DA5B1] focus:outline-none focus:border-[#1677FF] transition-colors shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-[#9DA5B1] hover:text-[#171A1F] text-xs cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* ─── 5. BUDGET CARDS LIST & TEMPLATE LAUNCHER ─── */}
      <div className="flex flex-col gap-3">
        {/* If Templates Tab is Active: Show + New Budget Template Launch Card */}
        {activeTab === 'templates' && (
          <button
            onClick={() => setIsCreateTemplateOpen(true)}
            className="p-4 rounded-2xl bg-white border-2 border-dashed border-[#DDE1E7] hover:border-[#1677FF] transition-all cursor-pointer shadow-xs flex items-center justify-between gap-3 group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="text-left min-w-0">
                <h3 className="text-sm font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors truncate">
                  Create Budget Template
                </h3>
                <p className="text-xs text-[#68707C] font-medium truncate mt-0.5">
                  Build custom CSI MasterFormat template layout
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#1677FF] bg-[#EAF3FF] px-3 py-1.5 rounded-xl border border-[#1677FF]/20 group-hover:bg-[#1677FF] group-hover:text-white transition-all flex-shrink-0">
              + New Template
            </span>
          </button>
        )}

        {filteredBudgets.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-[#DDE1E7] text-center flex flex-col items-center justify-center gap-2 shadow-xs">
            <Wallet className="w-8 h-8 text-[#9DA5B1] mb-1" />
            <p className="text-sm font-bold text-[#171A1F]">No {activeTab === 'templates' ? 'templates' : 'budgets'} found</p>
            <p className="text-xs text-[#68707C]">Try adjusting your search query or create a new budget.</p>
          </div>
        ) : (
          filteredBudgets.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                setSelectedBudgetId(b.id);
                if (onSelectBudgetName) onSelectBudgetName(b.name);
              }}
              className="p-4.5 rounded-3xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/50 transition-all cursor-pointer flex flex-col gap-3 shadow-xs active:scale-[0.99] group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    <Wallet className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors truncate">
                      {b.name}
                    </h3>
                    <p className="text-xs text-[#68707C] mt-0.5 truncate font-medium">
                      {b.subtitle}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 uppercase tracking-wider ${
                  b.status === 'ACTIVE'
                    ? 'bg-[#E6F7ED] text-[#389E0D] border-[#B7EB8F]'
                    : b.status === 'APPROVED'
                    ? 'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF]/30'
                    : 'bg-[#F2F2F7] text-[#68707C] border-[#DDE1E7]'
                }`}>
                  {b.status}
                </span>
              </div>

              {/* Clean Metric Strip (No 4 Mini Gray Boxes) */}
              <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-[#EAEDF1] text-left">
                <div>
                  <span className="text-[10px] text-[#68707C] font-semibold uppercase tracking-wider block">Budget</span>
                  <span className="text-xs font-bold text-[#171A1F] block mt-0.5">
                    ${b.totalBudget > 0 ? (b.totalBudget / 1000000).toFixed(2) + 'M' : '0'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#68707C] font-semibold uppercase tracking-wider block">Actual Spend</span>
                  <span className="text-xs font-bold text-[#1677FF] block mt-0.5">
                    ${b.actual > 0 ? (b.actual / 1000000).toFixed(2) + 'M' : '0'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#68707C] font-semibold uppercase tracking-wider block">Remaining</span>
                  <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                    ${((b.totalBudget - b.actual) / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>

              {/* Card Footer Meta */}
              <div className="flex items-center justify-between pt-2 border-t border-[#EAEDF1] text-xs text-[#68707C] font-medium">
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-[#171A1F]">{b.itemsCount} cost line items</span>
                </span>
                
                <button
                  onClick={(e) => handleDeleteBudget(b.id, e)}
                  className="p-1.5 rounded-lg text-[#9DA5B1] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete budget"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Budget Template Modal */}
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171A1F] border border-[#DDE1E7] px-4 py-2.5 rounded-2xl text-xs font-bold text-white shadow-2xl flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#52C41A]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
