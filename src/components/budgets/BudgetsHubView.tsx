import React, { useState } from 'react';
import { 
  AlertTriangle, ArrowRight, Download, Plus, 
  ChevronRight, FileText, Layers, Building2, 
  Zap, FolderKanban, DollarSign, CheckCircle2, Clock, X,
  TrendingUp, Sparkles, SlidersHorizontal, ArrowLeft
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

export const BudgetsHubView: React.FC = () => {
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
          <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
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

          <div className="p-4 bg-[#050811] rounded-2xl border border-[#142036] flex flex-col gap-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active Commercial Credit Facility</span>
            <h3 className="text-base font-bold text-white">First National Commercial Bank</h3>
            <p className="text-xs text-slate-400">Total Approved Facility: $18,500,000 • Disbursed: $10,800,000</p>
            
            <div className="mt-2 p-3 bg-[#0E1A33] rounded-xl border border-[#1E325A] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Next Draw Request (#4)</span>
                <span className="text-sm font-extrabold text-white">$420,000 Pending Sign-Off</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold">
                Under Bank Review
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#050811] rounded-xl border border-[#142036]">
              <span className="text-slate-300 font-medium">Lien Waivers (Subcontractors)</span>
              <span className="text-emerald-400 font-bold">14 of 14 Signed</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#050811] rounded-xl border border-[#142036]">
              <span className="text-slate-300 font-medium">Third-Party Inspector Sign-Off</span>
              <span className="text-emerald-400 font-bold">Completed (May 22)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#050811] rounded-xl border border-[#142036]">
              <span className="text-slate-300 font-medium">Title Insurance Endorsement</span>
              <span className="text-emerald-400 font-bold">Verified & Active</span>
            </div>
          </div>

          <button
            onClick={() => {
              alert('Draw package #4 ($420,000) shared directly with First National Bank escrow officer.');
              setIsFinancingOpen(false);
            }}
            className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all mt-2 cursor-pointer"
          >
            Share Complete Draw Package with Lender
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Executive Top Metrics Row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Budgets</span>
          <span className="text-lg font-black text-white mt-0.5 block">$25,550,000</span>
          <span className="text-[10px] text-blue-400 font-medium">3 Project Ledgers</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Actual Paid</span>
          <span className="text-lg font-black text-emerald-400 mt-0.5 block">$16,830,000</span>
          <span className="text-[10px] text-slate-400 font-medium">65.8% Disbursed</span>
        </div>
      </div>

      {/* 2. Top Action Cards */}
      <div className="grid grid-cols-1 gap-2.5">
        {/* Action 1: Create Project Budget */}
        <div 
          onClick={() => setIsCreateModalOpen(true)}
          className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/50 transition-all cursor-pointer shadow-sm flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                Create Project Budget
              </h3>
              <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                Detailed 4-step budget connected to project or standalone
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
        </div>

        {/* Action 2: Analyze a Deal */}
        <div 
          onClick={() => setIsDealAnalyzerOpen(true)}
          className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/50 transition-all cursor-pointer shadow-sm flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                Analyze a Deal
              </h3>
              <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                Latti Deal Analyzer with financing, scenarios & Deal Score
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
        </div>

        {/* Action 3: Lender Financing & Draws */}
        <div 
          onClick={() => setIsFinancingOpen(true)}
          className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/50 transition-all cursor-pointer shadow-sm flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                Lender Financing Connections
              </h3>
              <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                Draw packages, bank escrow inspection sign-offs & lien waivers
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
        </div>
      </div>

      {/* 3. Segmented Control */}
      <div className="flex items-center gap-2 py-0.5 bg-[#070D1A] p-1 rounded-2xl border border-[#142036]">
        <button
          onClick={() => setViewMode('analytics')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            viewMode === 'analytics'
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white font-semibold'
          }`}
        >
          Financial Analytics
        </button>
        <button
          onClick={() => setViewMode('sheets')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            viewMode === 'sheets'
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white font-semibold'
          }`}
        >
          Budget Sheets ({budgets.length})
        </button>
      </div>

      {/* 4. Project Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {projectsList.map((p) => {
          const isActive = selectedProjectFilter === p;
          return (
            <button
              key={p}
              onClick={() => setSelectedProjectFilter(p)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'bg-[#070D1A] text-slate-400 hover:text-white hover:bg-[#121B2E] border border-[#142036]'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* 5. Tab View Content */}
      {viewMode === 'analytics' ? (
        <div className="flex flex-col gap-3">
          {/* CSI Divisions Drill-Down Card */}
          <div className="p-4 bg-[#070D1A] border border-[#142036] rounded-2xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <span className="text-xs font-bold text-white">CSI MasterFormat Cost Divisions</span>
              <span className="text-[10px] text-blue-400 font-bold">Tap to Inspect</span>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { code: '01-000', title: 'General Conditions & PM', vendor: 'Avery Marsh Mgmt', budget: '$450,000', committed: '$450,000', actual: '$380,000', pct: 84 },
                { code: '03-000', title: 'Concrete & Foundations', vendor: 'Apex Concrete LLC', budget: '$1,250,000', committed: '$1,250,000', actual: '$1,180,000', pct: 94 },
                { code: '05-000', title: 'Metals & Structural Steel', vendor: 'Titan Steel Works', budget: '$2,100,000', committed: '$1,950,000', actual: '$1,400,000', pct: 67 },
                { code: '15-000', title: 'Mechanical & HVAC', vendor: 'CoolAir Systems Inc', budget: '$850,000', committed: '$150,000', actual: '$90,000', pct: 11 }
              ].map((item) => (
                <div
                  key={item.code}
                  onClick={() => setSelectedCostCode(item)}
                  className="p-3 bg-[#050811] hover:bg-[#0E1A33] border border-[#142036] hover:border-blue-500/40 rounded-xl flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-blue-400">{item.code}</span>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-medium">
                      <span>{item.vendor}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{item.actual} paid</span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2 flex-shrink-0">
                    <div>
                      <span className="text-xs font-extrabold text-white block">{item.budget}</span>
                      <span className="text-[10px] text-slate-400">{item.pct}%</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Budget Sheets Cards */
        <div className="flex flex-col gap-2.5">
          {budgets.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelectedBudgetId(b.id)}
              className="p-4 bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 rounded-2xl shadow-sm flex flex-col gap-3 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                    {b.type}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors mt-1.5">
                    {b.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white block">${(b.totalBudget / 1000000).toFixed(2)}M</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">{b.status}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Progress: {b.progress}%</span>
                  <span>${(b.actual / 1000000).toFixed(2)}M spent</span>
                </div>
                <div className="w-full h-1.5 bg-[#050811] rounded-full overflow-hidden border border-[#142036]">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
                    style={{ width: `${b.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CSI COST CODE ITEM MODAL */}
      {selectedCostCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-[390px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#142036]">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400">{selectedCostCode.code}</span>
                <h3 className="text-sm font-bold text-white">{selectedCostCode.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCostCode(null)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#121B2D]">
                <span className="text-slate-400">Awarded Trade Partner:</span>
                <strong className="text-white">{selectedCostCode.vendor}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#121B2D]">
                <span className="text-slate-400">Total Allocated Budget:</span>
                <strong className="text-white">{selectedCostCode.budget}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#121B2D]">
                <span className="text-slate-400">Committed Contracts:</span>
                <strong className="text-white">{selectedCostCode.committed}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#121B2D]">
                <span className="text-slate-400">Paid Invoices to Date:</span>
                <strong className="text-emerald-400 font-bold">{selectedCostCode.actual}</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCostCode(null);
                setSelectedBudgetId('b-1');
              }}
              className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all mt-1"
            >
              <span>View Itemized Invoices</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
