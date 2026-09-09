import React, { useState } from 'react';
import { Project, TradeCategory, ChangeOrder } from '../../types';
import {
  ArrowLeft, ChevronRight, Plus,
  FileText, Search, Filter, MoreHorizontal,
  X, Check, Building2, Layers, Wrench, Zap, Boxes
} from 'lucide-react';

interface ProjectBudgetTabProps {
  project: Project;
  categories: TradeCategory[];
  changeOrders?: ChangeOrder[];
  onCreateChangeOrder?: () => void;
  onApproveChangeOrder?: (id: string) => void;
  onAddCostItem?: () => void;
  onImportBudget?: () => void;
  onBack?: () => void;
}

export const ProjectBudgetTab: React.FC<ProjectBudgetTabProps> = ({
  project,
  categories: initialCategories,
  changeOrders: initialChangeOrders = [],
  onCreateChangeOrder,
  onApproveChangeOrder,
  onAddCostItem,
  onImportBudget,
  onBack
}) => {
  // Navigation: 'overview' | 'trade-details'
  const [currentView, setCurrentView] = useState<'overview' | 'trade-details'>('overview');
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

  // Active Tab: 'categories' | 'change-orders' (Default to change-orders to match reference)
  const [activeTab, setActiveTab] = useState<'categories' | 'change-orders'>('change-orders');

  // Categories & Change Orders State
  const [categories, setCategories] = useState<TradeCategory[]>(initialCategories);
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>(() =>
    initialChangeOrders.filter(co => co.projectId === project.id)
  );

  React.useEffect(() => {
    setChangeOrders(initialChangeOrders.filter(co => co.projectId === project.id));
  }, [initialChangeOrders, project.id]);

  // Modals & Filters
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isAddCOModalOpen, setIsAddCOModalOpen] = useState(false);
  const [selectedCO, setSelectedCO] = useState<ChangeOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<string>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Form States: Expense
  const [expenseTrade, setExpenseTrade] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseVendor, setExpenseVendor] = useState('');

  // Form States: Change Order
  const [coTitle, setCoTitle] = useState('');
  const [coAmount, setCoAmount] = useState('');
  const [coTrade, setCoTrade] = useState('Finishes');

  // Selected trade for drill-down view
  const selectedTrade = categories.find(c => c.id === selectedTradeId) || categories[0];

  // Financial Metrics — derived from real project.budget data
  const totalBudget = project.budget?.total || 0;
  const totalSpent = project.budget?.actual || 0;
  const totalCommitted = project.budget?.committed || 0;
  const totalAvailable = project.budget?.remaining || Math.max(0, totalBudget - totalSpent);
  const spentPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const committedPercent = totalBudget > 0 ? Math.round((totalCommitted / totalBudget) * 100) : 0;
  const availablePercent = Math.max(0, 100 - spentPercent - committedPercent);

  const getCOIconStyle = (status: string) => {
    if (status === 'Approved') {
      return {
        bg: 'bg-[#EAF3FF]',
        iconColor: 'text-[#1677FF]',
        badgeBg: 'bg-[#E9F9F3]',
        badgeText: 'text-[#10A976]',
        dotColor: 'bg-[#10A976]'
      };
    }
    if (status === 'Pending') {
      return {
        bg: 'bg-[#FFF7E6]',
        iconColor: 'text-[#F59E0B]',
        badgeBg: 'bg-[#FFF7E6]',
        badgeText: 'text-[#F59E0B]',
        dotColor: 'bg-[#F59E0B]'
      };
    }
    return {
      bg: 'bg-[#FFF0F0]',
      iconColor: 'text-[#E5484D]',
      badgeBg: 'bg-[#FFF0F0]',
      badgeText: 'text-[#E5484D]',
      dotColor: 'bg-[#E5484D]'
    };
  };

  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('concrete') || lower.includes('foundation')) return <Building2 className="w-5 h-5 text-[#1677FF]" />;
    if (lower.includes('steel') || lower.includes('structure') || lower.includes('frame')) return <Wrench className="w-5 h-5 text-[#1677FF]" />;
    if (lower.includes('mep') || lower.includes('electric') || lower.includes('plumb') || lower.includes('hvac')) return <Zap className="w-5 h-5 text-[#1677FF]" />;
    if (lower.includes('finish') || lower.includes('millwork')) return <Boxes className="w-5 h-5 text-[#1677FF]" />;
    return <Layers className="w-5 h-5 text-[#1677FF]" />;
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(expenseAmount);
    if (!expenseTrade || isNaN(amt) || amt <= 0) return;

    setCategories(prev => prev.map(cat => {
      if (cat.name === expenseTrade || cat.id === expenseTrade) {
        return { ...cat, actualCost: cat.actualCost + amt };
      }
      return cat;
    }));

    setIsAddExpenseModalOpen(false);
    setExpenseAmount('');
    setExpenseVendor('');
  };

  const handleAddCO = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(coAmount);
    if (!coTitle.trim() || isNaN(amt) || amt <= 0) return;

    const newCO: ChangeOrder = {
      id: `CO-00${changeOrders.length + 1}`,
      projectId: project.id,
      title: coTitle.trim(),
      description: `Change order for ${coTrade}`,
      amount: amt,
      timeImpact: 0,
      category: coTrade,
      requestedBy: 'Project Manager',
      status: 'Pending',
      createdDate: 'Jul 15, 2026'
    };

    setChangeOrders(prev => [newCO, ...prev]);
    setIsAddCOModalOpen(false);
    setCoTitle('');
    setCoAmount('');
  };

  const handleApproveCO = (id: string) => {
    setChangeOrders(prev => prev.map(co => co.id === id ? { ...co, status: 'Approved' } : co));
    if (onApproveChangeOrder) onApproveChangeOrder(id);
  };

  // Filtered change orders
  const filteredCOs = changeOrders.filter(co => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!co.title.toLowerCase().includes(q) && !co.category.toLowerCase().includes(q) && !co.id.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedFilterStatus !== 'all') {
      if (co.status.toLowerCase() !== selectedFilterStatus.toLowerCase()) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-3 sm:px-4 py-3 pb-32 font-sans max-w-[430px] md:max-w-md mx-auto text-[#0F172A] animate-fade-in select-none">

      {/* ══════════════════════════════════════════════════════════════════════════
          TRADE DETAILS DRILLDOWN
      ══════════════════════════════════════════════════════════════════════════ */}
      {currentView === 'trade-details' && selectedTrade ? (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Top Header */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setCurrentView('overview')}
              className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#0F172A]" />
            </button>

            {onAddCostItem && (
            <button
              onClick={() => {
                setExpenseTrade(selectedTrade.name);
                setIsAddExpenseModalOpen(true);
              }}
              className="h-9 px-4 rounded-xl bg-[#1677FF] hover:bg-[#125ec7] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log Expense</span>
            </button>
            )}
          </div>

          {/* Trade Summary Card */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] flex items-center justify-center text-[#1677FF] shrink-0">
                {getCategoryIcon(selectedTrade.name)}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">Category</span>
                <h2 className="text-base font-bold text-[#0F172A] truncate">{selectedTrade.name}</h2>
              </div>
            </div>

            <div className="grid grid-cols-3 pt-3 border-t border-[#F1F5F9]">
              <div>
                <span className="text-[11px] text-[#64748B] block">Budget</span>
                <span className="text-sm font-bold text-[#0F172A] mt-0.5 block">${Math.round(selectedTrade.estimatedCost / 1000)}K</span>
              </div>
              <div>
                <span className="text-[11px] text-[#64748B] block">Spent</span>
                <span className="text-sm font-bold text-[#1677FF] mt-0.5 block">${Math.round(selectedTrade.actualCost / 1000)}K</span>
              </div>
              <div>
                <span className="text-[11px] text-[#64748B] block">Available</span>
                <span className="text-sm font-bold text-[#10A976] mt-0.5 block">
                  ${Math.round(Math.max(0, selectedTrade.estimatedCost - selectedTrade.actualCost) / 1000)}K
                </span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-[#EAF3FF] overflow-hidden">
              <div
                className="h-full bg-[#1677FF] rounded-full transition-all"
                style={{
                  width: `${selectedTrade.estimatedCost > 0 ? Math.min(100, Math.round((selectedTrade.actualCost / selectedTrade.estimatedCost) * 100)) : 0}%`
                }}
              />
            </div>
          </div>

          {/* Line items list */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Line Items</h3>
            <div className="flex flex-col divide-y divide-[#F1F5F9]">
              {selectedTrade.costCodes.map((cc) => (
                <div key={cc.code} className="py-2.5 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-[#0F172A] block truncate">{cc.name}</span>
                    <span className="text-[11px] text-[#64748B]">{cc.code}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-[#0F172A] block">${Math.round(cc.actualCost / 1000)}K</span>
                    <span className="text-[11px] text-[#64748B]">of ${Math.round(cc.estimatedCost / 1000)}K</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════════
            MAIN BUDGET OVERVIEW (MATCHING EXACT FIGMA REFERENCE SCREEN)
        ══════════════════════════════════════════════════════════════════════════ */
        <>
          {/* 1. Top Header Row with Circle Back Arrow & 3-Dot More Button */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] transition-all cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 text-[#0F172A]" />
            </button>

            <div className="text-center">
              <h1 className="text-base font-bold text-[#0F172A] tracking-tight leading-tight">
                Budget Ledger
              </h1>
              <p className="text-xs text-[#64748B] font-normal leading-tight mt-0.5">
                {project?.name || 'Snell Isle Residence'}
              </p>
            </div>

            <button
              onClick={() => setIsAddExpenseModalOpen(true)}
              className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] transition-all cursor-pointer"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
            </button>
          </div>

          {/* 2. Total Planned Budget Executive Hero Card with Subtle Gradient */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC]/70 to-white p-4 sm:p-4.5 shadow-xs flex flex-col gap-3">
            {/* Top Row: Title, Amount & 69% Spent Pill */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#64748B] block">
                  Total Planned Budget
                </span>
                <div className="text-[24px] sm:text-[26px] font-bold text-[#0F172A] tracking-tight leading-tight mt-0.5">
                  $5.60M
                </div>
              </div>

              <div
                onClick={() => setActiveTab('categories')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-2xs hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                {/* Custom circular gauge icon */}
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#CBD5E1] border-t-[#1677FF] border-r-[#1677FF] rotate-45 shrink-0" />
                <span className="text-xs font-bold text-[#0F172A]">69% Spent</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              </div>
            </div>

            {/* Main Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#E2E8F0] overflow-hidden flex">
              <div
                className="h-full bg-[#1677FF] rounded-full transition-all duration-500"
                style={{ width: `${spentPercent}%` }}
                title={`Spent: ${spentPercent}%`}
              />
            </div>

            {/* 3-Column Financial Stats with Hairline Dividers (1-line label + percentage) */}
            <div className="grid grid-cols-3 divide-x divide-[#E2E8F0] pt-0.5">
              {/* Stat 1: Spent */}
              <div className="pr-2 sm:pr-3">
                <div className="text-sm sm:text-base font-bold text-[#0F172A] leading-tight">
                  $3.88M
                </div>
                <div className="flex items-center gap-1.5 mt-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] shrink-0" />
                  <span className="text-xs text-[#64748B] font-medium">Spent</span>
                  <span className="text-xs text-[#94A3B8] font-normal">69%</span>
                </div>
              </div>

              {/* Stat 2: Committed */}
              <div className="px-2 sm:px-3">
                <div className="text-sm sm:text-base font-bold text-[#0F172A] leading-tight">
                  $320K
                </div>
                <div className="flex items-center gap-1.5 mt-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] shrink-0" />
                  <span className="text-xs text-[#64748B] font-medium">Committed</span>
                  <span className="text-xs text-[#94A3B8] font-normal">6%</span>
                </div>
              </div>

              {/* Stat 3: Available */}
              <div className="pl-2 sm:pl-3">
                <div className="text-sm sm:text-base font-bold text-[#0F172A] leading-tight">
                  $1.72M
                </div>
                <div className="flex items-center gap-1.5 mt-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10A976] shrink-0" />
                  <span className="text-xs text-[#64748B] font-medium">Available</span>
                  <span className="text-xs text-[#94A3B8] font-normal">31%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Tab Switcher Row & Right Dynamic Contextual Action Button (Aligned with Global Design System) */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {/* Tabs Container */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none active:scale-[0.98] ${activeTab === 'categories'
                    ? 'bg-white text-[#1677FF] font-bold shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A] font-semibold'
                  }`}
              >
                Categories ({categories.length})
              </button>

              <button
                onClick={() => setActiveTab('change-orders')}
                className={`px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none active:scale-[0.98] ${activeTab === 'change-orders'
                    ? 'bg-white text-[#1677FF] font-bold shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A] font-semibold'
                  }`}
              >
                Change Orders ({changeOrders.length})
              </button>
            </div>

            {/* Right Contextual Action Button: "+ Log Expense" for Categories, "+ Add CO" for Change Orders */}
            {activeTab === 'change-orders' ? (
              onCreateChangeOrder && (
              <button
                onClick={() => {
                  onCreateChangeOrder();
                }}
                className="h-9 px-3.5 rounded-xl bg-[#EAF3FF] hover:bg-[#D9EAFD] text-[#1677FF] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add CO</span>
              </button>
              )
            ) : (
              onAddCostItem && (
              <button
                onClick={() => setIsAddExpenseModalOpen(true)}
                className="h-9 px-3.5 rounded-xl bg-[#EAF3FF] hover:bg-[#D9EAFD] text-[#1677FF] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Log Expense</span>
              </button>
              )
            )}
          </div>

          {/* 4. Search and Filter Bar Row */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={activeTab === 'change-orders' ? "Search change orders..." : "Search categories..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-8 text-xs bg-white border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#1677FF] text-[#0F172A] placeholder-[#94A3B8] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="h-10 px-3.5 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl text-xs font-semibold text-[#64748B] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Filter className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Filter</span>
                <ChevronRight className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-150 ${isFilterDropdownOpen ? 'rotate-90' : ''}`} />
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute right-0 top-11 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl py-1.5 w-36 z-20 text-xs animate-fade-in divide-y divide-[#F1F5F9]">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Filter Status
                  </div>
                  <div className="py-1">
                    {['all', 'approved', 'pending', 'rejected'].map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setSelectedFilterStatus(st);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left capitalize hover:bg-[#F8FAFC] flex items-center justify-between transition-colors cursor-pointer ${selectedFilterStatus === st ? 'font-bold text-[#1677FF] bg-[#EAF3FF]' : 'text-[#475569]'
                          }`}
                      >
                        <span>{st}</span>
                        {selectedFilterStatus === st && <Check className="w-3.5 h-3.5 text-[#1677FF]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              TAB 2: CHANGE ORDERS LIST (MATCHING EXACT FIGMA CARDS)
          ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'change-orders' && (
            <div className="flex flex-col gap-3">
              {filteredCOs.map((co) => {
                const style = getCOIconStyle(co.status);

                return (
                  <div
                    key={co.id}
                    onClick={() => setSelectedCO(co)}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex items-center justify-between gap-3 hover:border-[#CBD5E1] transition-all cursor-pointer group"
                  >
                    {/* Left: Icon + Title & Category Subtitle */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-2xl ${style.bg} flex items-center justify-center shrink-0`}>
                        <FileText className={`w-5 h-5 ${style.iconColor}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] leading-snug line-clamp-2">
                          {co.title}
                        </h4>
                        <p className="text-xs text-[#94A3B8] font-medium mt-1">
                          {co.category} &nbsp;|&nbsp; {co.id}
                        </p>
                      </div>
                    </div>

                    {/* Right: Badge + Amount + Date + Chevron */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${style.badgeBg} ${style.badgeText}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor}`} />
                          <span>{co.status}</span>
                        </span>
                        <span className="text-sm font-bold text-[#0F172A] tabular-nums mt-0.5">
                          +${Math.round(co.amount / 1000)}K
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-normal">
                          {co.createdDate}
                        </span>
                      </div>

                      <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0F172A] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              TAB 1: CATEGORIES LIST
          ══════════════════════════════════════════════════════════════════════ */}
          {activeTab === 'categories' && (
            <div className="flex flex-col gap-3">
              {categories.map((cat) => {
                const percent = cat.estimatedCost > 0 ? Math.min(100, Math.round((cat.actualCost / cat.estimatedCost) * 100)) : 0;

                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedTradeId(cat.id);
                      setCurrentView('trade-details');
                    }}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs hover:border-[#1677FF]/40 transition-all cursor-pointer flex flex-col gap-2.5 group"
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] flex items-center justify-center shrink-0">
                          {getCategoryIcon(cat.name)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                            {cat.name}
                          </h4>
                          <span className="text-xs text-[#64748B] block mt-0.5 font-medium">
                            ${Math.round(cat.actualCost / 1000)}K of ${Math.round(cat.estimatedCost / 1000)}K
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569]">
                          {percent}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1677FF] transition-colors" />
                      </div>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-[#EAF3FF] overflow-hidden">
                      <div
                        className="h-full bg-[#1677FF] rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ─── ADD EXPENSE MODAL ─── */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[360px] bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-xl flex flex-col gap-3 text-[#0F172A]">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <h3 className="text-sm font-bold text-[#0F172A]">Log Expense</h3>
              <button
                onClick={() => setIsAddExpenseModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="flex flex-col gap-2.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#64748B] block mb-1">Category *</label>
                <select
                  required
                  value={expenseTrade}
                  onChange={(e) => setExpenseTrade(e.target.value)}
                  className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs outline-none focus:border-[#1677FF]"
                >
                  <option value="">Select Category...</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#64748B] block mb-1">Amount ($) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs outline-none focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#64748B] block mb-1">Vendor / Payee</label>
                <input
                  type="text"
                  placeholder="e.g. Vulcan Materials"
                  value={expenseVendor}
                  onChange={(e) => setExpenseVendor(e.target.value)}
                  className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs outline-none focus:border-[#1677FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#F1F5F9] text-[#0F172A] text-xs font-bold cursor-pointer hover:bg-[#E2E8F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#125ec7] text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── ADD CHANGE ORDER MODAL ─── */}
      {isAddCOModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[360px] bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-xl flex flex-col gap-3 text-[#0F172A]">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <h3 className="text-sm font-bold text-[#0F172A]">Add Change Order</h3>
              <button
                onClick={() => setIsAddCOModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center cursor-pointer text-xs hover:bg-[#E2E8F0]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCO} className="flex flex-col gap-2.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#64748B] block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Additional Balcony Railing"
                  value={coTitle}
                  onChange={(e) => setCoTitle(e.target.value)}
                  className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs outline-none focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#64748B] block mb-1">Amount ($) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 12000"
                  value={coAmount}
                  onChange={(e) => setCoAmount(e.target.value)}
                  className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs outline-none focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#64748B] block mb-1">Category</label>
                <select
                  value={coTrade}
                  onChange={(e) => setCoTrade(e.target.value)}
                  className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs outline-none focus:border-[#1677FF]"
                >
                  <option value="Finishes">Finishes</option>
                  <option value="Structural">Structural</option>
                  <option value="Exterior">Exterior</option>
                  <option value="Concrete">Concrete</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setIsAddCOModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#F1F5F9] text-[#0F172A] text-xs font-bold cursor-pointer hover:bg-[#E2E8F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#125ec7] text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
                >
                  Create CO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CHANGE ORDER DETAILS & APPROVAL MODAL ─── */}
      {selectedCO && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-[#0F172A]">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-md">
                  {selectedCO.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${selectedCO.status === 'Approved' ? 'bg-[#ECFDF5] text-[#059669]' :
                    selectedCO.status === 'Pending' ? 'bg-[#FFFBEB] text-[#D97706]' :
                      'bg-[#FEF2F2] text-[#DC2626]'
                  }`}>
                  {selectedCO.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedCO(null)}
                className="w-7 h-7 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold text-[#0F172A] leading-snug">
                {selectedCO.title}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {selectedCO.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Cost Impact</span>
                <strong className="text-sm font-bold text-[#0F172A] mt-0.5 block">+${selectedCO.amount.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Trade Category</span>
                <strong className="text-sm font-bold text-[#0F172A] mt-0.5 block">{selectedCO.category}</strong>
              </div>
              <div className="mt-1">
                <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Requested By</span>
                <span className="text-xs font-medium text-[#0F172A] mt-0.5 block">{selectedCO.requestedBy}</span>
              </div>
              <div className="mt-1">
                <span className="text-[10px] text-[#64748B] uppercase font-semibold block">Date</span>
                <span className="text-xs font-medium text-[#0F172A] mt-0.5 block">{selectedCO.createdDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setSelectedCO(null)}
                className="px-3.5 py-2 rounded-xl bg-[#F1F5F9] text-[#0F172A] text-xs font-bold cursor-pointer hover:bg-[#E2E8F0]"
              >
                Close
              </button>
              {selectedCO.status === 'Pending' && onApproveChangeOrder && (
                <button
                  type="button"
                  onClick={() => {
                    handleApproveCO(selectedCO.id);
                    setSelectedCO(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Approve &amp; Apply to Budget</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
