import React, { useState, useRef, useEffect } from 'react';
import { Project, TradeCategory, CostCodeGroup } from '../../types';
import {
  ChevronLeft, ChevronRight, Plus,
  FileText, CreditCard, Wallet, Boxes, Building2, Wrench,
  Paintbrush, MoreHorizontal, Download, Upload, X, Check, Landmark, Pencil
} from 'lucide-react';

interface ProjectBudgetTabProps {
  project: Project;
  categories: TradeCategory[];
  onAddCostItem?: () => void;
  onImportBudget?: () => void;
  onBack?: () => void;
}

export const ProjectBudgetTab: React.FC<ProjectBudgetTabProps> = ({
  project,
  categories: initialCategories,
  onImportBudget,
  onBack
}) => {
  const [categories, setCategories] = useState<TradeCategory[]>(initialCategories);
  const [isAddCodeModalOpen, setIsAddCodeModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [showBreakdownDetails, setShowBreakdownDetails] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // New Code Form State
  const [tradeName, setTradeName] = useState('02 – Foundation & Structure');
  const [costCodeName, setCostCodeName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [committedAmount, setCommittedAmount] = useState('');

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

  const handleAddCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!costCodeName.trim() || !budgetAmount) return;

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

    setCategories(prev => prev.map(cat => {
      if (cat.name.includes(tradeName.split('–')[1]?.trim() || 'Foundation')) {
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

    setCostCodeName('');
    setBudgetAmount('');
    setCommittedAmount('');
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

  const getTradeStyle = (cat: TradeCategory, index: number) => {
    if (cat.name.includes('Site') || index === 0) {
      return {
        icon: <Boxes className="w-5 h-5 text-[#1677FF]" />,
        iconBg: 'bg-[#EAF3FF]',
        barColor: 'bg-[#1677FF]',
        pillBg: 'bg-[#EAF3FF]',
        pillText: 'text-[#1677FF]'
      };
    }
    if (cat.name.includes('Foundation') || cat.name.includes('Structure') || index === 1) {
      return {
        icon: <Building2 className="w-5 h-5 text-[#16A34A]" />,
        iconBg: 'bg-[#DCFCE7]',
        barColor: 'bg-[#16A34A]',
        pillBg: 'bg-[#DCFCE7]',
        pillText: 'text-[#16A34A]'
      };
    }
    if (cat.name.includes('MEP') || cat.name.includes('Mechanical') || index === 2) {
      return {
        icon: <Wrench className="w-5 h-5 text-[#9333EA]" />,
        iconBg: 'bg-[#F3E8FF]',
        barColor: 'bg-[#9333EA]',
        pillBg: 'bg-[#F3E8FF]',
        pillText: 'text-[#9333EA]'
      };
    }
    if (cat.name.includes('Finish') || index === 3) {
      return {
        icon: <Paintbrush className="w-5 h-5 text-[#EA580C]" />,
        iconBg: 'bg-[#FFEDD5]',
        barColor: 'bg-[#EA580C]',
        pillBg: 'bg-[#FFEDD5]',
        pillText: 'text-[#EA580C]'
      };
    }
    return {
      icon: <MoreHorizontal className="w-5 h-5 text-[#64748B]" />,
      iconBg: 'bg-[#F1F5F9]',
      barColor: 'bg-[#64748B]',
      pillBg: 'bg-[#F1F5F9]',
      pillText: 'text-[#64748B]'
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

  return (
    <div className="w-full flex-1 flex flex-col gap-3.5 px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">

      {/* ─── 1. COMPACT ACTION TOOLBAR (Zero Duplicate Header) ─── */}
      <div className="flex items-center justify-between pt-0.5 pb-0.5">
        <div>
          <h2 className="text-base font-bold text-[#0F172A] tracking-tight">
            Budget Ledger
          </h2>
          <p className="text-xs text-[#64748B] font-medium">
            CSI MasterFormat • 16 Divisions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onImportBudget && (
            <button
              onClick={onImportBudget}
              className="h-8 px-2.5 text-xs font-medium text-[#475569] bg-white border border-[#E2E8F0] rounded-xl hover:bg-[#F1F5F9] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
              title="Import Budget Ledger"
            >
              <Upload className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Import</span>
            </button>
          )}

          <button
            onClick={() => setIsAddCodeModalOpen(true)}
            className="h-8 px-3 text-xs font-semibold text-white bg-[#1677FF] hover:bg-[#0F5FD7] rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Add Cost Code"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Code</span>
          </button>
        </div>
      </div>

      {/* ─── 2. EXECUTIVE HERO BUDGET CARD (Compact & Clean - No Duplication) ─── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#64748B]">Total Planned Budget</span>
            <div className="text-2xl font-bold text-[#0F172A] tracking-tight mt-0.5">
              ${(totalBudget / 1000000).toFixed(2)}M
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EAF3FF] text-[#1677FF] inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF]" />
              {progressPercent}% Spent
            </span>
            <span className="text-xs text-[#64748B] mt-1 font-medium">
              ${(totalActual / 1000000).toFixed(2)}M of ${(totalBudget / 1000000).toFixed(2)}M
            </span>
          </div>
        </div>

        {/* Single Clean Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden mt-1">
          <div
            className="h-full bg-[#1677FF] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* ─── 3. 3-COLUMN KPI CARDS ROW (Total Budget • Total Spent • Remaining) ─── */}
      <div className="grid grid-cols-3 gap-2">
        {/* 1st: Total Budget */}
        <div className="p-2.5 bg-white rounded-xl border border-[#E2E8F0] shadow-card flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <Landmark className="w-3 h-3" />
            </div>
            <span className="text-xs font-semibold text-[#0F172A] truncate">Total Budget</span>
          </div>
          <span className="text-sm font-bold text-[#0F172A] mt-1">
            ${(totalBudget / 1000000).toFixed(2)}M
          </span>
          <span className="text-[10px] text-[#64748B] font-medium truncate">Planned budget</span>
        </div>

        {/* 2nd: Total Spent */}
        <div className="p-2.5 bg-white rounded-xl border border-[#E2E8F0] shadow-card flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <CreditCard className="w-3 h-3" />
            </div>
            <span className="text-xs font-semibold text-[#1677FF] truncate">Actual Spend</span>
          </div>
          <span className="text-sm font-bold text-[#1677FF] mt-1">
            ${(totalActual / 1000000).toFixed(2)}M
          </span>
          <span className="text-[10px] text-[#64748B] font-medium truncate">{progressPercent}% of budget</span>
        </div>

        {/* 3rd: Remaining */}
        <div className="p-2.5 bg-white rounded-xl border border-[#E2E8F0] shadow-card flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#E9F9F3] text-[#10A976] flex items-center justify-center shrink-0">
              <Wallet className="w-3 h-3" />
            </div>
            <span className="text-xs font-semibold text-[#10A976] truncate">Remaining</span>
          </div>
          <span className="text-sm font-bold text-[#10A976] mt-1">
            ${(totalRemaining / 1000000).toFixed(2)}M
          </span>
          <span className="text-[10px] text-[#64748B] font-medium truncate">Left to spend</span>
        </div>
      </div>

      {/* ─── Change Orders Status Strip (Fulfilling Core Launch Scope #5) ─── */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] px-3.5 py-2.5 shadow-card flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FEF2F2] text-[#E5484D] flex items-center justify-center font-bold text-[10px] shrink-0">
            CO
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-[#0F172A] block leading-tight">Approved Change Orders</span>
            <span className="text-[#64748B] text-[10px] block mt-0.5 leading-tight">7 revisions • contingency healthy</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="font-bold text-[#E5484D] block leading-tight">+$28,500</span>
          <span className="text-[10px] text-[#94A3B8] block mt-0.5 leading-tight">+0.6% budget</span>
        </div>
      </div>

      {/* ─── 4. COST BREAKDOWN CARD (Sleek & Proportional) ─── */}
      <div className="p-3.5 bg-white rounded-2xl border border-[#E2E8F0] shadow-card flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#0F172A]">Cost Breakdown</h3>
          <button
            onClick={() => setShowBreakdownDetails(!showBreakdownDetails)}
            className="text-xs font-medium text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{showBreakdownDetails ? 'Hide' : 'Details'}</span>
            <ChevronRight className={`w-3 h-3 transition-transform ${showBreakdownDetails ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Multi-Segment Stacked Progress Bar */}
        <div className="h-2 rounded-full overflow-hidden flex bg-[#F1F5F9] w-full">
          <div style={{ width: `${matPercent}%` }} className="bg-[#1677FF] h-full transition-all" title={`Materials: ${matPercent}%`} />
          <div style={{ width: `${labPercent}%` }} className="bg-[#60A5FA] h-full transition-all" title={`Labor: ${labPercent}%`} />
          <div style={{ width: `${eqPercent}%` }} className="bg-[#A78BFA] h-full transition-all" title={`Equipment: ${eqPercent}%`} />
          <div style={{ width: `${subPercent}%` }} className="bg-[#CBD5E1] h-full transition-all" title={`Subcontracts: ${subPercent}%`} />
        </div>

        {/* Breakdown Items Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
              <span className="text-[#475569]">Materials</span>
            </div>
            <span className="font-semibold text-[#0F172A]">{matPercent}% (${(matCost / 1000000).toFixed(2)}M)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
              <span className="text-[#475569]">Labor</span>
            </div>
            <span className="font-semibold text-[#0F172A]">{labPercent}% (${(labCost / 1000000).toFixed(2)}M)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
              <span className="text-[#475569]">Equipment</span>
            </div>
            <span className="font-semibold text-[#0F172A]">{eqPercent}% (${(eqCost / 1000000).toFixed(2)}M)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
              <span className="text-[#475569]">Subcontracts</span>
            </div>
            <span className="font-semibold text-[#0F172A]">{subPercent}% (${(subCost / 1000000).toFixed(2)}M)</span>
          </div>
        </div>
      </div>

      {/* ─── 5. COST ITEMS (TRADES LIST) ─── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-sm font-bold text-[#171A1F]">Cost Items</h3>
          <button
            onClick={() => setIsAddCodeModalOpen(true)}
            className="bg-[#EAF3FF] hover:bg-[#D4E8FF] text-[#1677FF] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {categories.map((cat, idx) => {
            const isExpanded = expandedCategories[cat.id];
            const percent = cat.estimatedCost > 0 ? Math.round((cat.actualCost / cat.estimatedCost) * 100) : 0;
            const { icon, iconBg, barColor, pillBg, pillText } = getTradeStyle(cat, idx);

            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-[#E2E8F0] shadow-card overflow-hidden transition-all hover:border-[#CBD5E1]"
              >
                {/* Category Card Header */}
                <div
                  onClick={() => toggleCategory(cat.id)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-[#F1F5F9]/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-[#0F172A] truncate">{cat.name}</h4>
                      <p className="text-xs font-medium text-[#64748B] mt-0.5">
                        ${formatCost(cat.actualCost)} / ${formatCost(cat.estimatedCost)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Mini horizontal progress bar */}
                    <div className="w-12 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden hidden sm:block">
                      <div
                        className={`h-full rounded-full ${barColor}`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>

                    {/* Percentage Pill */}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${pillBg} ${pillText}`}>
                      {percent}%
                    </span>

                    {/* Chevron Arrow */}
                    <ChevronRight className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Detailed Cost Codes Drawer (Senior UX & Tabular Alignment) */}
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

                        {/* Cost Line Items - Tabular 2-Tier Layout */}
                        <div className="flex flex-col divide-y divide-[#F8FAFC]">
                          {cc.items.map((item) => {
                            const style = getItemTypeStyle(item.type);
                            return (
                              <div 
                                key={item.id} 
                                className="flex items-center justify-between py-1.5 text-xs hover:bg-[#F8FAFC] -mx-1 px-1 rounded-md transition-colors"
                              >
                                {/* Left: Item Name & Metadata */}
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

                                {/* Right: Tabular Amount */}
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

      {/* ─── ADD COST CODE MODAL ─── */}
      {isAddCodeModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col gap-3 text-[#171A1F]">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
              <h3 className="text-sm font-bold text-[#171A1F]">Add Cost Code Item</h3>
              <button
                onClick={() => setIsAddCodeModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F2F2F7] text-[#525866] hover:text-[#171A1F] flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCodeSubmit} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-xs text-[#525866] block mb-1 font-semibold">CSI Trade Division</label>
                <select
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  className="w-full h-10 bg-white border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] cursor-pointer"
                >
                  <option value="01 – Site Preparation">01 – Site Preparation</option>
                  <option value="02 – Foundation & Structure">02 – Foundation & Structure</option>
                  <option value="03 – MEP (Mechanical, Electrical, Plumbing)">03 – MEP (Mechanical, Electrical, Plumbing)</option>
                  <option value="04 – Finishes">04 – Finishes</option>
                  <option value="05 – Other Costs">05 – Other Costs</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#525866] block mb-1 font-semibold">Cost Code Line Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Slab Rebar Reinforcement"
                  value={costCodeName}
                  onChange={(e) => setCostCodeName(e.target.value)}
                  className="w-full h-10 bg-white border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#525866] block mb-1 font-semibold">Budget ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="45000"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="w-full h-10 bg-white border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#525866] block mb-1 font-semibold">Committed ($)</label>
                  <input
                    type="number"
                    placeholder="38000"
                    value={committedAmount}
                    onChange={(e) => setCommittedAmount(e.target.value)}
                    className="w-full h-10 bg-white border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
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
                  Save Item
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
                  className="w-full h-10 bg-white border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
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
                    className="w-full h-10 bg-white border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
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
                    className="w-full h-10 bg-white border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF]"
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

    </div>
  );
};

