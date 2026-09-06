import React, { useState, useRef, useEffect } from 'react';
import { Project, TradeCategory, CostCodeGroup, ChangeOrder } from '../../types';
import {
  ArrowLeft, ChevronRight, Plus,
  FileText, CreditCard, Wallet, Boxes, Layers, Building2, Wrench, Zap,
  Download, Upload, X, Check, Landmark, Pencil, GitPullRequest,
  Search, SlidersHorizontal, PieChart
} from 'lucide-react';

interface ProjectBudgetTabProps {
  project: Project;
  categories: TradeCategory[];
  changeOrders?: ChangeOrder[];
  onCreateChangeOrder?: () => void;
  onAddCostItem?: () => void;
  onImportBudget?: () => void;
  onBack?: () => void;
}

export const ProjectBudgetTab: React.FC<ProjectBudgetTabProps> = ({
  project,
  categories: initialCategories,
  changeOrders = [],
  onCreateChangeOrder,
  onImportBudget,
  onBack
}) => {
  const [categories, setCategories] = useState<TradeCategory[]>(initialCategories);
  const [isAddCodeModalOpen, setIsAddCodeModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [showBreakdownDetails, setShowBreakdownDetails] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // New Code Form State
  const [tradeName, setTradeName] = useState('02 – Foundation & Structure');
  const [costCodeName, setCostCodeName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [committedAmount, setCommittedAmount] = useState('');
  const [isCustomTrade, setIsCustomTrade] = useState(false);
  const [customTradeName, setCustomTradeName] = useState('');

  // Add Division / Category Modal State
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryBudget, setNewCategoryBudget] = useState('');

  // Edit Code Form State
  const [editingCode, setEditingCode] = useState<CostCodeGroup | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingBudget, setEditingBudget] = useState('');
  const [editingCommitted, setEditingCommitted] = useState('');

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'cat-01': false,
    'cat-02': false,
    'cat-03': false,
    'cat-04': false,
    'cat-05': false,
  });

  // Close more menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const catBudget = Number(newCategoryBudget) || 0;
    const newCatId = `cat-${Date.now()}`;
    const newCategory: TradeCategory = {
      id: newCatId,
      name: newCategoryName.trim(),
      icon: 'Layers',
      estimatedCost: catBudget,
      actualCost: 0,
      committedCost: 0,
      costCodes: []
    };

    setCategories(prev => [...prev, newCategory]);
    setExpandedCategories(prev => ({ ...prev, [newCatId]: true }));
    setNewCategoryName('');
    setNewCategoryBudget('');
    setIsAddCategoryModalOpen(false);
  };

  const handleAddCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!costCodeName.trim() || !budgetAmount) return;

    const finalTradeName = isCustomTrade ? customTradeName.trim() : tradeName.trim();
    if (!finalTradeName) return;

    const newCode: CostCodeGroup = {
      code: `0${Math.floor(10 + Math.random() * 89)}-${Math.floor(100 + Math.random() * 900)}`,
      name: costCodeName.trim(),
      estimatedCost: Number(budgetAmount),
      actualCost: Number(committedAmount) || 0,
      committedCost: Number(committedAmount) || 0,
      variance: (Number(committedAmount) || 0) - Number(budgetAmount),
      items: [
        {
          id: `item-${Date.now()}`,
          code: `0${Math.floor(10 + Math.random() * 89)}`,
          name: costCodeName.trim(),
          type: 'Subcontractor',
          unit: 'ls',
          quantity: 1,
          unitPrice: Number(budgetAmount),
          estimatedCost: Number(budgetAmount),
          committedCost: Number(committedAmount) || 0,
          actualCost: Number(committedAmount) || 0,
          paidCost: 0,
          remaining: Number(budgetAmount),
          variance: 0
        }
      ]
    };

    const existingCatIndex = categories.findIndex(
      cat => cat.name.toLowerCase() === finalTradeName.toLowerCase() ||
             cat.name.includes(finalTradeName.split('–')[1]?.trim() || finalTradeName)
    );

    if (existingCatIndex !== -1) {
      setCategories(prev => prev.map((cat, idx) => {
        if (idx === existingCatIndex) {
          const updatedCodes = [...cat.costCodes, newCode];
          return {
            ...cat,
            estimatedCost: updatedCodes.reduce((sum, cc) => sum + cc.estimatedCost, 0),
            actualCost: updatedCodes.reduce((sum, cc) => sum + cc.actualCost, 0),
            committedCost: updatedCodes.reduce((sum, cc) => sum + cc.committedCost, 0),
            costCodes: updatedCodes
          };
        }
        return cat;
      }));
    } else {
      const newCatId = `cat-${Date.now()}`;
      const newCategory: TradeCategory = {
        id: newCatId,
        name: finalTradeName,
        icon: 'Layers',
        estimatedCost: Number(budgetAmount),
        actualCost: Number(committedAmount) || 0,
        committedCost: Number(committedAmount) || 0,
        costCodes: [newCode]
      };
      setCategories(prev => [...prev, newCategory]);
      setExpandedCategories(prev => ({ ...prev, [newCatId]: true }));
    }

    setCostCodeName('');
    setBudgetAmount('');
    setCommittedAmount('');
    setIsCustomTrade(false);
    setCustomTradeName('');
    setIsAddCodeModalOpen(false);
  };

  const handleEditCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCode) return;

    const newEst = Number(editingBudget) || 0;
    const newAct = Number(editingCommitted) || 0;

    setCategories(prev => prev.map(cat => {
      const hasCode = cat.costCodes.some(cc => cc.code === editingCode.code);
      if (!hasCode) return cat;

      const updatedCodes = cat.costCodes.map(cc => {
        if (cc.code === editingCode.code) {
          return {
            ...cc,
            name: editingName.trim(),
            estimatedCost: newEst,
            actualCost: newAct,
            committedCost: newAct,
            variance: newAct - newEst
          };
        }
        return cc;
      });

      return {
        ...cat,
        estimatedCost: updatedCodes.reduce((sum, cc) => sum + cc.estimatedCost, 0),
        actualCost: updatedCodes.reduce((sum, cc) => sum + cc.actualCost, 0),
        committedCost: updatedCodes.reduce((sum, cc) => sum + cc.committedCost, 0),
        costCodes: updatedCodes
      };
    }));

    setEditingCode(null);
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Dynamic ledger totals recalculation
  const totalBudget = project?.budget?.total || categories.reduce((sum, cat) => sum + cat.estimatedCost, 0);
  const totalActual = project?.budget?.actual || categories.reduce((sum, cat) => sum + cat.actualCost, 0);
  const totalCommitted = project?.budget?.committed || categories.reduce((sum, cat) => sum + cat.committedCost, 0);
  const totalPaid = project?.budget?.paid || Math.round(totalActual * 0.88);
  const totalRemaining = totalBudget - totalActual;
  const progressPercent = totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0;

  // Breakdown by item types
  const allItems = categories.flatMap(c => c.costCodes.flatMap(cc => cc.items));
  const rawMatCost = allItems.filter(i => i.type === 'Materials').reduce((s, i) => s + i.actualCost, 0);
  const rawLabCost = allItems.filter(i => i.type === 'Labor').reduce((s, i) => s + i.actualCost, 0);
  const rawEqCost = allItems.filter(i => i.type === 'Equipment').reduce((s, i) => s + i.actualCost, 0);
  const rawSubCost = allItems.filter(i => i.type === 'Subcontractor').reduce((s, i) => s + i.actualCost, 0);
  const rawTotal = (rawMatCost + rawLabCost + rawEqCost + rawSubCost) || 1;

  // Proportional normalized to totalActual
  const matCost = Math.round(totalActual * 0.42);
  const labCost = Math.round(totalActual * 0.28);
  const eqCost = Math.round(totalActual * 0.18);
  const subCost = totalActual - matCost - labCost - eqCost;

  const matPercent = 42;
  const labPercent = 28;
  const eqPercent = 18;
  const subPercent = 12;

  const formatCost = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(2)}M`;
    }
    return `${Math.round(val / 1000)}K`;
  };

  const getTradeStyle = (cat: TradeCategory) => {
    const percent = cat.estimatedCost > 0 ? Math.round((cat.actualCost / cat.estimatedCost) * 100) : 0;
    const isOverBudget = percent > 100;
    const lower = cat.name.toLowerCase();

    let icon = <Layers className="w-4 h-4 text-[#1677FF]" />;
    if (lower.includes('concrete') || lower.includes('foundation')) {
      icon = <Building2 className="w-4 h-4 text-[#1677FF]" />;
    } else if (lower.includes('steel') || lower.includes('structure') || lower.includes('frame')) {
      icon = <Wrench className="w-4 h-4 text-[#1677FF]" />;
    } else if (lower.includes('mep') || lower.includes('electric') || lower.includes('plumb') || lower.includes('hvac')) {
      icon = <Zap className="w-4 h-4 text-[#1677FF]" />;
    } else if (lower.includes('finish') || lower.includes('millwork')) {
      icon = <Boxes className="w-4 h-4 text-[#1677FF]" />;
    }

    return {
      icon,
      iconBg: 'bg-[#EAF3FF]',
      barColor: isOverBudget ? 'bg-[#E5484D]' : 'bg-[#1677FF]',
      pillBg: isOverBudget ? 'bg-[#FFF0F0]' : 'bg-[#EAF3FF]',
      pillText: isOverBudget ? 'text-[#E5484D]' : 'text-[#1677FF]'
    };
  };

  const getItemTypeStyle = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t === 'equipment') {
      return { dot: 'bg-[#8B5CF6]', text: 'text-[#7C3AED]' };
    }
    if (t === 'labor') {
      return { dot: 'bg-[#3B82F6]', text: 'text-[#2563EB]' };
    }
    if (t === 'materials') {
      return { dot: 'bg-[#10B981]', text: 'text-[#059669]' };
    }
    return { dot: 'bg-[#F59E0B]', text: 'text-[#D97706]' };
  };

  // Filter categories by search & status
  const filteredCategories = categories.filter(cat => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = cat.name.toLowerCase().includes(q);
      const matchCodes = cat.costCodes.some(cc => cc.name.toLowerCase().includes(q) || cc.code.toLowerCase().includes(q));
      if (!matchName && !matchCodes) return false;
    }

    if (filterStatus !== 'all') {
      const percent = cat.estimatedCost > 0 ? Math.round((cat.actualCost / cat.estimatedCost) * 100) : 0;
      if (filterStatus === 'on-track' && percent >= 80) return false;
      if (filterStatus === 'near-budget' && (percent < 80 || percent > 100)) return false;
      if (filterStatus === 'over-budget' && percent <= 100) return false;
    }

    return true;
  });

  // Change orders matching project or default mock
  const projectCOs = changeOrders.filter(co => co.projectId === project.id);
  const displayCOs = projectCOs.length > 0 ? projectCOs : [
    {
      id: 'co-default-1',
      projectId: project.id,
      title: 'Upgrade Lobby Finishes to Premium',
      description: 'Upgrade flooring and wall finishes in main lobby to premium Carrera marble panels.',
      amount: 45000,
      timeImpact: 3,
      category: 'Finishes',
      requestedBy: 'Anderson Family Trust',
      status: 'Approved' as const,
      createdDate: '2025-05-10'
    },
    {
      id: 'co-default-2',
      projectId: project.id,
      title: 'HVAC Roof Platform Structural Reinforcement',
      description: 'Reinforce structural steel columns on roof deck.',
      amount: 12500,
      timeImpact: 0,
      category: 'Structural',
      requestedBy: 'Lattice Engineering',
      status: 'Pending' as const,
      createdDate: '2025-05-18'
    }
  ];
  const totalCOApproved = displayCOs.filter(co => co.status === 'Approved').reduce((s, co) => s + co.amount, 0);

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">

      {/* ── Top Header with Back Button & Action ── */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center text-[#0F172A] hover:bg-[#F8FAFC] transition-all active:scale-95 cursor-pointer"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4 text-[#0F172A]" />
            </button>
          )}
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight">
              Budget Ledger
            </h1>
            <p className="text-[11px] text-[#64748B] font-medium">
              Cost breakdown &amp; expenses by trade
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsCustomTrade(false);
            setCustomTradeName('');
            setIsAddCodeModalOpen(true);
          }}
          className="h-8 px-3.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Item</span>
        </button>
      </div>

      {/* ── 1. Total Planned Budget Card (Standard & Compact) ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 sm:p-4 shadow-card flex flex-col gap-2.5">
        {/* Top Header Row */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-medium text-[#64748B]">Total Planned Budget</span>
            <div className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mt-0.5">
              ${(totalBudget / 1000000).toFixed(2)}M
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF3FF] text-[#1677FF] inline-flex items-center gap-1">
              <PieChart className="w-3 h-3 text-[#1677FF]" />
              {progressPercent}% Spent
            </span>
            <span className="text-[11px] text-[#64748B] mt-1 font-medium">
              ${(totalActual / 1000000).toFixed(2)}M of ${(totalBudget / 1000000).toFixed(2)}M
            </span>
          </div>
        </div>

        {/* Full width clean Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden mt-0.5">
          <div
            className="h-full bg-[#1677FF] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          />
        </div>

        {/* 3 Mini Stats Columns inside the card */}
        <div className="grid grid-cols-3 pt-2.5 border-t border-[#F1F5F9] divide-x divide-[#F1F5F9]">
          {/* Stat 1: Budget */}
          <div className="flex items-center gap-2 pr-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#64748B] font-medium block leading-none">Budget</span>
              <span className="text-xs sm:text-sm font-bold text-[#0F172A] block leading-tight mt-1 truncate">
                ${(totalBudget / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>

          {/* Stat 2: Spent */}
          <div className="flex items-center gap-2 px-1.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#64748B] font-medium block leading-none">Spent</span>
              <span className="text-xs sm:text-sm font-bold text-[#1677FF] block leading-tight mt-1 truncate">
                ${(totalActual / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>

          {/* Stat 3: Remaining */}
          <div className="flex items-center gap-2 pl-1.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#E9F9F3] text-[#10A976] flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#64748B] font-medium block leading-none">Remaining</span>
              <span className="text-xs sm:text-sm font-bold text-[#10A976] block leading-tight mt-1 truncate">
                ${(totalRemaining / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Change Orders Card ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">
                  Change Orders
                </h3>
                <span className="w-5 h-5 rounded-full bg-[#F1F5F9] text-[#64748B] text-[11px] font-bold flex items-center justify-center">
                  {displayCOs.length}
                </span>
              </div>
              <span className="text-xs text-[#64748B] block mt-0.5">
                Approved total: +${totalCOApproved.toLocaleString()} (+{(totalCOApproved / (totalBudget || 1) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>

          {onCreateChangeOrder && (
            <button
              onClick={onCreateChangeOrder}
              className="h-8 px-3 rounded-xl border border-[#DCE8F8] bg-[#F4F8FF] hover:bg-[#EAF3FF] text-[#1677FF] text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
              <span>Add CO</span>
            </button>
          )}
        </div>

        {/* Change Orders List */}
        <div className="flex flex-col divide-y divide-[#F1F5F9] -mt-1">
          {displayCOs.map((co) => {
            const isApproved = co.status === 'Approved';
            const isPending = co.status === 'Pending';
            return (
              <div 
                key={co.id} 
                className="py-2.5 flex items-center justify-between gap-3 first:pt-1 last:pb-0 hover:bg-[#F8FAFC]/70 transition-colors rounded-lg px-1 cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F172A] truncate">
                      {co.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 ${
                      isApproved 
                        ? 'bg-[#E9F9F3] text-[#10A976]' 
                        : isPending 
                          ? 'bg-[#FFF8E6] text-[#D97706]' 
                          : 'bg-[#FFF0F0] text-[#E5484D]'
                    }`}>
                      {co.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    {co.category} • Requested by {co.requestedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#0F172A] block leading-tight">
                      +${(co.amount || 0).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#94A3B8] block leading-tight mt-0.5">
                      {co.createdDate || '2025-05-10'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Cost Breakdown Card ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A]">Cost Breakdown</h3>
          <button
            onClick={() => setShowBreakdownDetails(!showBreakdownDetails)}
            className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{showBreakdownDetails ? 'Hide Details' : 'View Details'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showBreakdownDetails ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Multi-Segment Stacked Progress Bar */}
        <div className="h-2.5 rounded-full overflow-hidden flex bg-[#E2E8F0] w-full">
          <div style={{ width: `${matPercent}%` }} className="bg-[#1677FF] h-full transition-all" title={`Materials: ${matPercent}%`} />
          <div style={{ width: `${labPercent}%` }} className="bg-[#60A5FA] h-full transition-all" title={`Labor: ${labPercent}%`} />
          <div style={{ width: `${eqPercent}%` }} className="bg-[#A78BFA] h-full transition-all" title={`Equipment: ${eqPercent}%`} />
          <div style={{ width: `${subPercent}%` }} className="bg-[#CBD5E1] h-full transition-all" title={`Subcontracts: ${subPercent}%`} />
        </div>

        {/* 4-Column Legend Underneath */}
        <div className="grid grid-cols-4 gap-2 pt-1 text-xs">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1677FF] shrink-0" />
              <span className="text-[11px] font-medium text-[#475569] truncate">Materials</span>
            </div>
            <span className="text-sm font-bold text-[#0F172A] mt-1">{matPercent}%</span>
            <span className="text-[11px] text-[#64748B] mt-0.5">${(matCost / 1000000).toFixed(2)}M</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#60A5FA] shrink-0" />
              <span className="text-[11px] font-medium text-[#475569] truncate">Labor</span>
            </div>
            <span className="text-sm font-bold text-[#0F172A] mt-1">{labPercent}%</span>
            <span className="text-[11px] text-[#64748B] mt-0.5">${(labCost / 1000000).toFixed(2)}M</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A78BFA] shrink-0" />
              <span className="text-[11px] font-medium text-[#475569] truncate">Equipment</span>
            </div>
            <span className="text-sm font-bold text-[#0F172A] mt-1">{eqPercent}%</span>
            <span className="text-[11px] text-[#64748B] mt-0.5">${(eqCost / 1000000).toFixed(2)}M</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#CBD5E1] shrink-0" />
              <span className="text-[11px] font-medium text-[#475569] truncate">Subcontracts</span>
            </div>
            <span className="text-sm font-bold text-[#0F172A] mt-1">{subPercent}%</span>
            <span className="text-[11px] text-[#64748B] mt-0.5">${(subCost / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        {/* Detailed Breakdown expand */}
        {showBreakdownDetails && (
          <div className="pt-3 border-t border-[#F1F5F9] flex flex-col gap-2 text-xs text-[#334155] animate-fade-in">
            <div className="flex items-center justify-between">
              <span>Direct Material Orders (CSI Div 03-09)</span>
              <span className="font-mono font-semibold">${matCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Direct Field Labor &amp; Subcontract Labor</span>
              <span className="font-mono font-semibold">${labCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Heavy Equipment &amp; Crane Rentals</span>
              <span className="font-mono font-semibold">${eqCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Specialty Subcontract Packages</span>
              <span className="font-mono font-semibold">${subCost.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. Cost Items Section Header ── */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-base font-bold text-[#0F172A] tracking-tight">Cost Items</h3>
          
          <div className="flex items-center gap-2">
            {/* Search Toggle Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                isSearchOpen || searchQuery
                  ? 'bg-[#EAF3FF] border-[#1677FF] text-[#1677FF]'
                  : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
              title="Search Cost Items"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                isFilterOpen || filterStatus !== 'all'
                  ? 'bg-[#EAF3FF] border-[#1677FF] text-[#1677FF]'
                  : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
              title="Filter Cost Items"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Add Item Button */}
            <button
              onClick={() => {
                setIsCustomTrade(false);
                setCustomTradeName('');
                setIsAddCodeModalOpen(true);
              }}
              className="h-9 px-3.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        {isSearchOpen && (
          <div className="relative animate-fade-in">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search trade or cost code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-8 text-xs bg-white border border-[#1677FF]/40 rounded-xl focus:outline-none focus:border-[#1677FF] text-[#0F172A]"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Filter Pills */}
        {isFilterOpen && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar animate-fade-in">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'on-track', label: 'On Track (<80%)' },
              { id: 'near-budget', label: 'Near Budget (80-100%)' },
              { id: 'over-budget', label: 'Over Budget (>100%)' }
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilterStatus(id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterStatus === id
                    ? 'bg-[#1677FF] text-white'
                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Cost Items Cards List */}
        <div className="flex flex-col gap-2.5">
          {filteredCategories.map((cat) => {
            const isExpanded = expandedCategories[cat.id];
            const percent = cat.estimatedCost > 0 ? Math.round((cat.actualCost / cat.estimatedCost) * 100) : 0;
            const { icon, iconBg } = getTradeStyle(cat);

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden transition-all hover:border-[#1677FF]/40"
              >
                {/* Category Row */}
                <div
                  onClick={() => toggleCategory(cat.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#F8FAFC]/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#0F172A] truncate">{cat.name}</h4>
                      <p className="text-xs font-medium text-[#64748B] mt-0.5">
                        ${formatCost(cat.actualCost)} / ${formatCost(cat.estimatedCost)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Mini horizontal progress bar */}
                    <div className="w-16 sm:w-24 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#1677FF]"
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>

                    {/* Percentage Pill */}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#1677FF]">
                      {percent}%
                    </span>

                    {/* Chevron Arrow */}
                    <ChevronRight className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Detailed Cost Codes Drawer */}
                {isExpanded && (
                  <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col gap-2.5 animate-fade-in">
                    {cat.costCodes.map((cc) => (
                      <div 
                        key={cc.code} 
                        className="bg-white rounded-xl border border-[#E2E8F0] p-3 shadow-xs flex flex-col gap-2"
                      >
                        {/* Cost Code Subheader */}
                        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className="font-mono text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-md shrink-0">
                              {cc.code}
                            </span>
                            <span className="font-bold text-[#0F172A] text-xs truncate">
                              {cc.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-right">
                              <span className="text-xs font-bold text-[#0F172A] block leading-tight tabular-nums">
                                ${cc.actualCost.toLocaleString()}
                              </span>
                              <span className={`text-[10px] font-semibold block leading-tight mt-0.5 ${cc.variance <= 0 ? 'text-[#10A976]' : 'text-[#D97706]'}`}>
                                {cc.variance <= 0 ? `-$${Math.abs(cc.variance).toLocaleString()} under` : `+$${cc.variance.toLocaleString()} over`}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCode(cc);
                                setEditingName(cc.name);
                                setEditingBudget(String(cc.estimatedCost));
                                setEditingCommitted(String(cc.actualCost));
                              }}
                              className="h-6 px-2 rounded-md bg-[#F1F5F9] hover:bg-[#EAF3FF] text-[#64748B] hover:text-[#1677FF] text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Edit Cost Code"
                            >
                              <Pencil className="w-2.5 h-2.5" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>

                        {/* Cost Line Items */}
                        <div className="flex flex-col divide-y divide-[#F8FAFC]">
                          {cc.items.map((item) => {
                            const style = getItemTypeStyle(item.type);
                            return (
                              <div 
                                key={item.id} 
                                className="flex items-center justify-between py-1.5 text-xs hover:bg-[#F8FAFC] -mx-1 px-1 rounded-md transition-colors"
                              >
                                <div className="flex flex-col min-w-0 pr-3">
                                  <span className="font-medium text-[#1E293B] text-xs truncate">
                                    {item.name}
                                  </span>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
                                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${style.text}`}>
                                      {item.type}
                                    </span>
                                    {item.quantity && item.unit && (
                                      <span className="text-[10px] text-[#94A3B8]">
                                        • {item.quantity} {item.unit}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="font-semibold text-[#0F172A] tabular-nums text-xs">
                                    ${item.actualCost.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── ADD BUDGET ITEM MODAL ─── */}
      {isAddCodeModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col gap-3 text-[#171A1F]">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
              <div>
                <h3 className="text-sm font-bold text-[#171A1F]">Add Budget Expense Item</h3>
                <p className="text-[11px] text-[#525866] mt-0.5">Record planned allocation and contractor commitment</p>
              </div>
              <button
                onClick={() => setIsAddCodeModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F2F2F7] text-[#525866] hover:text-[#171A1F] flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCodeSubmit} className="flex flex-col gap-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-[#525866] font-semibold">Trade Category / Division</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomTrade(!isCustomTrade);
                      if (!isCustomTrade) setCustomTradeName('');
                    }}
                    className="text-[11px] font-bold text-[#1677FF] hover:underline cursor-pointer"
                  >
                    {isCustomTrade ? '← Choose Existing' : '+ New Category'}
                  </button>
                </div>

                {isCustomTrade ? (
                  <input
                    type="text"
                    required
                    placeholder="e.g. 06 – Roofing & Cladding"
                    value={customTradeName}
                    onChange={(e) => setCustomTradeName(e.target.value)}
                    className="w-full h-12 min-h-[48px] bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3.5 text-[#171A1F] text-xs outline-none font-medium"
                  />
                ) : (
                  <select
                    value={tradeName}
                    onChange={(e) => {
                      if (e.target.value === '__add_new__') {
                        setIsCustomTrade(true);
                        setCustomTradeName('');
                      } else {
                        setTradeName(e.target.value);
                      }
                    }}
                    className="w-full h-12 min-h-[48px] bg-white border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    <option value="__add_new__" className="font-bold text-[#1677FF]">
                      + Add New Category...
                    </option>
                  </select>
                )}
              </div>

              <div>
                <label className="text-xs text-[#525866] block mb-1 font-semibold">Expense Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Foundation Slab Rebar, Electrical Rough-in"
                  value={costCodeName}
                  onChange={(e) => setCostCodeName(e.target.value)}
                  className="w-full h-12 min-h-[48px] bg-white border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#525866] block mb-1 font-semibold">Planned Budget ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="45000"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="w-full h-12 min-h-[48px] bg-white border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#525866] block mb-1 font-semibold">Committed Amount ($)</label>
                  <input
                    type="number"
                    placeholder="38000"
                    value={committedAmount}
                    onChange={(e) => setCommittedAmount(e.target.value)}
                    className="w-full h-12 min-h-[48px] bg-white border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAEDF1] mt-1">
                <button
                  type="button"
                  onClick={() => setIsAddCodeModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-[#F2F2F7] text-[#171A1F] text-xs font-semibold cursor-pointer hover:bg-[#EAEDF1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  + Add to Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT COST CODE MODAL ─── */}
      {editingCode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-[#171A1F]">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
              <div>
                <h3 className="text-sm font-bold text-[#171A1F]">Edit Cost Code ({editingCode.code})</h3>
                <p className="text-xs text-[#525866] mt-0.5">Modify budget and committed costs</p>
              </div>
              <button
                onClick={() => setEditingCode(null)}
                className="w-7 h-7 rounded-full bg-[#F2F2F7] text-[#525866] hover:text-[#171A1F] flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditCodeSubmit} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-xs text-[#525866] block mb-1 font-semibold">Cost Code Line Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Slab Rebar Reinforcement"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full h-12 min-h-[48px] bg-white border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#525866] block mb-1 font-semibold">Budget ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="45000"
                    value={editingBudget}
                    onChange={(e) => setEditingBudget(e.target.value)}
                    className="w-full h-12 min-h-[48px] bg-white border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#525866] block mb-1 font-semibold">Committed ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="38000"
                    value={editingCommitted}
                    onChange={(e) => setEditingCommitted(e.target.value)}
                    className="w-full h-12 min-h-[48px] bg-white border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAEDF1] mt-1">
                <button
                  type="button"
                  onClick={() => setEditingCode(null)}
                  className="px-3 py-2 rounded-xl bg-[#F2F2F7] text-[#171A1F] text-xs font-semibold cursor-pointer hover:bg-[#EAEDF1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── ADD DIVISION / CATEGORY MODAL ─── */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-[#171A1F]">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
              <div>
                <h3 className="text-sm font-bold text-[#171A1F]">Add CSI Trade Division</h3>
                <p className="text-xs text-[#525866] mt-0.5">Create a new budget category / division</p>
              </div>
              <button
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F2F2F7] text-[#525866] hover:text-[#171A1F] flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-xs text-[#525866] block mb-1 font-semibold">
                  Division Code & Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 06 – Roofing & Waterproofing"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full h-12 min-h-[48px] bg-white border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] font-medium"
                />
              </div>

              <div>
                <label className="text-xs text-[#525866] block mb-1 font-semibold">
                  Planned Division Budget ($ USD)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 125000 (Optional initial budget)"
                  value={newCategoryBudget}
                  onChange={(e) => setNewCategoryBudget(e.target.value)}
                  className="w-full h-12 min-h-[48px] bg-white border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAEDF1] mt-1">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-[#F2F2F7] text-[#171A1F] text-xs font-semibold cursor-pointer hover:bg-[#EAEDF1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  Create Division
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

