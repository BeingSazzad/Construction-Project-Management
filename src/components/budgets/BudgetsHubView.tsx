import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, ChevronLeft, ChevronRight, ArrowRight, 
  FileSpreadsheet, Layers, Sparkles, Check
} from 'lucide-react';
import { BudgetDetailView } from './BudgetDetailView';
import { CreateProjectBudgetModal } from '../modals/CreateProjectBudgetModal';
import { MOCK_PROJECTS } from '../../data/mockData';
import { Project } from '../../types';

export interface BudgetCardItem {
  id: string;
  projectId?: string;
  name: string;
  subtitle: string;
  type: 'Project linked' | 'Standalone budget';
  totalBudget: number;
  committed: number;
  actual: number;
  remaining: number;
  progress: number;
  itemsCount: number;
  status: 'ACTIVE' | 'DRAFT' | 'APPROVED';
}

const TEMPLATE_BUDGET_CARDS: BudgetCardItem[] = [
  {
    id: 'tmpl-1',
    name: 'Commercial Highrise Master (71 Divisions)',
    subtitle: 'Full CSI MasterFormat Standard',
    type: 'Standalone budget',
    totalBudget: 15000000,
    committed: 0,
    actual: 0,
    remaining: 15000000,
    progress: 0,
    itemsCount: 71,
    status: 'DRAFT'
  },
  {
    id: 'tmpl-2',
    name: 'Custom Residential Build (50 Divisions)',
    subtitle: 'Luxury Coastal Single Family',
    type: 'Standalone budget',
    totalBudget: 4200000,
    committed: 0,
    actual: 0,
    remaining: 4200000,
    progress: 0,
    itemsCount: 50,
    status: 'DRAFT'
  },
  {
    id: 'tmpl-3',
    name: 'Multi-Family Interior Renovation (28 Divisions)',
    subtitle: 'Tenant Fit-Out Ledger & Finishes',
    type: 'Standalone budget',
    totalBudget: 2100000,
    committed: 0,
    actual: 0,
    remaining: 2100000,
    progress: 0,
    itemsCount: 28,
    status: 'DRAFT'
  }
];

// SVG Donut Graphic Component with calibrated Apple/Lattice Design System tokens
const BudgetDonutChart = ({ paidPct, committedPct, remainingPct }: { paidPct: number; committedPct: number; remainingPct: number }) => {
  const size = 92;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const paidDash = (paidPct / 100) * circumference;
  const committedDash = (committedPct / 100) * circumference;
  const remainingDash = (remainingPct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth} />
        {/* Paid: Sapphire Blue #1677FF */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1677FF" strokeWidth={strokeWidth} strokeDasharray={`${paidDash} ${circumference - paidDash}`} strokeDashoffset={0} strokeLinecap="round" />
        {/* Committed: Sky Blue #0EA5E9 */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#0EA5E9" strokeWidth={strokeWidth} strokeDasharray={`${committedDash} ${circumference - committedDash}`} strokeDashoffset={-paidDash} strokeLinecap="round" />
        {/* Remaining: Emerald #10A976 */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#10A976" strokeWidth={strokeWidth} strokeDasharray={`${remainingDash} ${circumference - remainingDash}`} strokeDashoffset={-(paidDash + committedDash)} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-wider">Paid</span>
        <span className="text-xs font-black text-[#0F172A]">{paidPct.toFixed(0)}%</span>
      </div>
    </div>
  );
};

interface BudgetsHubViewProps {
  projects?: Project[];
  onOpenImportBudget?: () => void;
  onSelectBudgetName?: (name: string | null) => void;
  onBack?: () => void;
}

export const BudgetsHubView: React.FC<BudgetsHubViewProps> = ({ 
  projects = MOCK_PROJECTS,
  onSelectBudgetName, 
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'project' | 'templates' | 'archived'>('project');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 1. DYNAMIC SYNCHRONIZATION WITH REAL PROJECT DATA (Zero mismatch!)
  const projectBudgetCards: BudgetCardItem[] = useMemo(() => {
    return projects.map((p, idx) => {
      const total = p.budget?.total || 4650000;
      const actual = p.budget?.actual || p.budget?.paid || 3250000;
      const committed = p.budget?.committed || Math.round(total * 0.85);
      const remaining = Math.max(0, total - actual);
      const progress = Math.min(100, Math.round((actual / (total || 1)) * 100));

      const itemsCountMap: Record<string, number> = {
        'proj-1': 128,
        'proj-2': 215,
        'proj-3': 160,
        'proj-4': 94,
        'proj-5': 71,
      };

      return {
        id: `b-${p.id}`,
        projectId: p.id,
        name: p.name,
        subtitle: `${p.location || 'Job Site'} · ${p.clientName || 'Commercial'}`,
        type: 'Project linked',
        totalBudget: total,
        committed,
        actual,
        remaining,
        progress,
        itemsCount: itemsCountMap[p.id] || 96,
        status: p.status === 'Completed' ? 'APPROVED' : 'ACTIVE'
      };
    });
  }, [projects]);

  // Dynamic Portfolio Totals (Exactly identical to HomeScreen!)
  const portfolioTotal = useMemo(() => {
    return projectBudgetCards.reduce((sum, b) => sum + b.totalBudget, 0);
  }, [projectBudgetCards]);

  const portfolioPaid = useMemo(() => {
    return projectBudgetCards.reduce((sum, b) => sum + b.actual, 0);
  }, [projectBudgetCards]);

  const portfolioCommitted = useMemo(() => {
    return projectBudgetCards.reduce((sum, b) => sum + b.committed, 0);
  }, [projectBudgetCards]);

  const portfolioRemaining = useMemo(() => {
    return Math.max(0, portfolioTotal - portfolioPaid);
  }, [portfolioTotal, portfolioPaid]);

  const paidPct = useMemo(() => {
    return Math.min(100, Math.round((portfolioPaid / (portfolioTotal || 1)) * 100));
  }, [portfolioPaid, portfolioTotal]);

  const committedPct = useMemo(() => {
    return Math.min(100 - paidPct, Math.max(0, Math.round(((portfolioCommitted - portfolioPaid) / (portfolioTotal || 1)) * 100)));
  }, [portfolioCommitted, portfolioPaid, portfolioTotal, paidPct]);

  const remainingPct = useMemo(() => {
    return Math.max(0, 100 - paidPct - committedPct);
  }, [paidPct, committedPct]);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    return `$${Math.round(val / 1000)}K`;
  };

  const filteredBudgets = useMemo(() => {
    let list = activeTab === 'project' ? projectBudgetCards :
               activeTab === 'templates' ? TEMPLATE_BUDGET_CARDS : [];

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(b => 
      b.name.toLowerCase().includes(q) || 
      b.subtitle.toLowerCase().includes(q)
    );
  }, [activeTab, projectBudgetCards, searchQuery]);

  // Drilldown to specific budget spreadsheet
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

  // Create budget page
  if (isCreateModalOpen) {
    return (
      <CreateProjectBudgetModal
        isFullScreenPage={true}
        onClose={() => setIsCreateModalOpen(false)}
        projects={projects}
        onCreateBudget={(budgetData) => {
          setIsCreateModalOpen(false);
        }}
      />
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-4 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      
      {/* ─── 1. CLEAN SENIOR DESIGNER HEADER (ZERO TRUNCATION) ─── */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0 shadow-xs"
              title="Back"
            >
              <ChevronLeft className="w-4 h-4 text-[#0F172A]" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-base font-bold text-[#0F172A] tracking-tight truncate leading-tight">
              Portfolio Budgets
            </h1>
            <p className="text-[11px] text-[#64748B] font-medium truncate mt-0.5">
              Capital allocations & CSI job cost ledger
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-action btn-primary"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Budget</span>
        </button>
      </div>

      {/* ─── 2. EXECUTIVE CAPITAL CARD (Dynamic Synchronized Data) ─── */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card flex items-center justify-between gap-4">
        <BudgetDonutChart 
          paidPct={paidPct} 
          committedPct={committedPct} 
          remainingPct={remainingPct} 
        />

        <div className="flex flex-col justify-center flex-1 min-w-0">
          <div>
            <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider block">
              Master Portfolio Capital
            </span>
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight leading-none mt-1">
              {formatCurrency(portfolioTotal)}
            </h2>
          </div>

          <div className="flex flex-col gap-1.5 pt-2.5 mt-2 border-t border-[#F1F5F9]">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#64748B] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#1677FF]" /> Paid:
              </span>
              <span className="font-bold text-[#0F172A]">{formatCurrency(portfolioPaid)} ({paidPct}%)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#64748B] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#0EA5E9]" /> Committed:
              </span>
              <span className="font-bold text-[#0EA5E9]">{formatCurrency(portfolioCommitted)}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#64748B] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#10A976]" /> Contingency:
              </span>
              <span className="font-bold text-[#10A976]">{formatCurrency(portfolioRemaining)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. SEGMENTED TABS (Fits 430px perfectly with ZERO clipping) ─── */}
      <div className="bg-[#F1F5F9] p-1 rounded-xl grid grid-cols-3 gap-1">
        <button
          onClick={() => setActiveTab('project')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center truncate ${
            activeTab === 'project'
              ? 'bg-white text-[#0F172A] shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Projects ({projectBudgetCards.length})
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center truncate ${
            activeTab === 'templates'
              ? 'bg-white text-[#0F172A] shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Templates ({TEMPLATE_BUDGET_CARDS.length})
        </button>

        <button
          onClick={() => setActiveTab('archived')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center truncate ${
            activeTab === 'archived'
              ? 'bg-white text-[#0F172A] shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Archived (0)
        </button>
      </div>

      {/* ─── 4. SEARCH BAR (Single hairline input) ─── */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by project name or address..."
          className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-3 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1677FF] transition-colors shadow-xs"
        />
      </div>

      {/* ─── 5. PROJECT BUDGET CARDS LIST ─── */}
      <div className="flex flex-col gap-3">
        {filteredBudgets.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedBudgetId(item.id);
              if (onSelectBudgetName) onSelectBudgetName(item.name);
            }}
            className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#1677FF]/50 transition-all cursor-pointer group active:scale-[0.99] flex flex-col gap-3"
          >
            {/* Header: Title + Status */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] truncate group-hover:text-[#1677FF] transition-colors">
                  {item.name}
                </h3>
                <p className="text-[11px] text-[#64748B] truncate mt-0.5 font-medium">
                  {item.subtitle}
                </p>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                item.status === 'ACTIVE' ? 'bg-[#E9F9F3] text-[#10A976]' :
                item.status === 'APPROVED' ? 'bg-[#EAF3FF] text-[#1677FF]' :
                'bg-[#F1F5F9] text-[#64748B]'
              }`}>
                {item.status}
              </span>
            </div>

            {/* 3-Column Financial Metrics Bar */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 grid grid-cols-3 gap-2">
              <div>
                <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Budget
                </span>
                <span className="text-xs font-bold text-[#0F172A] block mt-0.5">
                  {formatCurrency(item.totalBudget)}
                </span>
              </div>

              <div>
                <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Spent
                </span>
                <span className="text-xs font-bold text-[#1677FF] block mt-0.5">
                  {formatCurrency(item.actual)}
                </span>
              </div>

              <div>
                <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Remaining
                </span>
                <span className="text-xs font-bold text-[#10A976] block mt-0.5">
                  {formatCurrency(item.remaining)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#1677FF] h-full rounded-full transition-all duration-300"
                style={{ width: `${item.progress}%` }}
              />
            </div>

            {/* Bottom Meta & Action */}
            <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9] text-[11px]">
              <span className="text-[#64748B] font-medium">
                {item.itemsCount} cost line items
              </span>
              <div className="flex items-center gap-1 font-bold text-[#1677FF] group-hover:translate-x-0.5 transition-transform">
                <span>View Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}

        {filteredBudgets.length === 0 && (
          <div className="p-8 text-center bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
            <p className="text-xs text-[#64748B] font-medium">No budgets found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

    </div>
  );
};
