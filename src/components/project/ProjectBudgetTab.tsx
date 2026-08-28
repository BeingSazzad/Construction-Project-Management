import React, { useState } from 'react';
import { Project, TradeCategory, CostCodeGroup } from '../../types';
import { 
  ChevronDown, ChevronRight, Plus, 
  Layers, Hammer, Boxes, Flame, Zap, Download, X
} from 'lucide-react';

interface ProjectBudgetTabProps {
  project: Project;
  categories: TradeCategory[];
  onAddCostItem?: () => void;
  onImportBudget?: () => void;
}

export const ProjectBudgetTab: React.FC<ProjectBudgetTabProps> = ({
  project,
  categories: initialCategories,
  onImportBudget
}) => {
  const [categories, setCategories] = useState<TradeCategory[]>(initialCategories);
  const [isAddCodeModalOpen, setIsAddCodeModalOpen] = useState(false);

  // New Code Form State
  const [tradeName, setTradeName] = useState('03 - Concrete & Formwork');
  const [costCodeName, setCostCodeName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [committedAmount, setCommittedAmount] = useState('');

  // Edit Code Form State
  const [editingCode, setEditingCode] = useState<CostCodeGroup | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingBudget, setEditingBudget] = useState('');
  const [editingCommitted, setEditingCommitted] = useState('');

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'cat-03': true,
    'cat-05': false,
    'cat-15': false,
    'cat-16': false,
  });

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
      if (cat.name.includes(tradeName.split('-')[1]?.trim() || 'Concrete')) {
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
      if (hasCode) {
        const updatedCodes = cat.costCodes.map(cc => {
          if (cc.code === editingCode.code) {
            return {
              ...cc,
              name: editingName.trim(),
              estimatedCost: newEst,
              actualCost: newAct,
              committedCost: newAct,
              variance: newAct - newEst,
              items: cc.items.map(item => ({
                ...item,
                name: editingName.trim(),
                estimatedCost: newEst,
                committedCost: newAct,
                actualCost: newAct,
                remaining: Math.max(0, newEst - newAct)
              }))
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
      }
      return cat;
    }));

    setEditingCode(null);
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hammer': return <Hammer className="w-4 h-4 text-blue-400" />;
      case 'Boxes': return <Boxes className="w-4 h-4 text-blue-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-purple-400" />;
      default: return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  // Dynamic ledger totals recalculation
  const totalBudget = categories.reduce((sum, cat) => sum + cat.estimatedCost, 0);
  const totalActual = categories.reduce((sum, cat) => sum + cat.actualCost, 0);
  const totalCommitted = categories.reduce((sum, cat) => sum + cat.committedCost, 0);
  const totalPaid = categories.reduce((sum, cat) => sum + (cat.actualCost * 0.88), 0); // 88% paid simulation
  const totalRemaining = totalBudget - totalActual;
  const progressPercent = totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0;

  if (project.budget.total === 0) {
    return (
      <div className="w-full flex flex-col gap-4 px-5 py-6 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in text-center items-center justify-center min-h-[50vh]">
        <div className="w-14 h-14 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
          <Download className="w-7 h-7" />
        </div>
        <h3 className="text-sm font-bold text-white">No Budget Ledger Active</h3>
        <p className="text-xs text-slate-400 max-w-[280px] leading-relaxed mt-1 mb-4">
          This project does not have a Master CSI budget ledger imported. Import an Excel or CSV template to track trade divisions, allowances, and vendor contracts.
        </p>
        {onImportBudget && (
          <button
            onClick={onImportBudget}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            Import Budget Ledger
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Budget Overview Card */}
      <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Budget Overview</span>
          <div className="flex items-center gap-2">
            {onImportBudget && (
              <button
                onClick={onImportBudget}
                className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2 py-1 rounded-xl flex items-center gap-1 hover:bg-blue-500/20 cursor-pointer transition-all"
              >
                <Download className="w-3 h-3" />
                <span>Import CSV</span>
              </button>
            )}
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              +${Math.max(0, Math.round((totalBudget - totalActual) / 1000))}K Favorable
            </span>
          </div>
        </div>

        {/* 2 Main Metrics + Circular Percentage Donut */}
        <div className="flex items-center justify-between bg-[#070D1A] p-3 rounded-xl border border-[#142036] mb-3">
          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Budget</span>
              <div className="text-lg font-black text-white mt-0.5">${(totalBudget / 1000000).toFixed(2)}M</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Cost (Actual)</span>
              <div className="text-lg font-black text-blue-400 mt-0.5">${(totalActual / 1000000).toFixed(2)}M</div>
            </div>
          </div>

          {/* Progress Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#142036]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white">{progressPercent}%</span>
          </div>
        </div>

        {/* Financial Line Breakdown */}
        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Committed (Subcontracts):</span>
            <span className="font-bold text-white">${(totalCommitted / 1000000).toFixed(2)}M</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Paid Invoices:</span>
            <span className="font-bold text-slate-200">${(totalPaid / 1000000).toFixed(2)}M</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Remaining Balance:</span>
            <span className="font-bold text-emerald-400">${(totalRemaining / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </div>

      {/* CSI Cost Codes Accordion */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">CSI MasterFormat Trades</h3>
          <button
            onClick={() => setIsAddCodeModalOpen(true)}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Code</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {categories.map((cat) => {
            const isExpanded = expandedCategories[cat.id];
            return (
              <div 
                key={cat.id}
                className="rounded-2xl border border-[#142036] bg-[#0A111F] overflow-hidden"
              >
                {/* Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#111A2C] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="text-blue-400">
                      {getIcon(cat.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        ${(cat.actualCost / 1000).toFixed(0)}K of ${(cat.estimatedCost / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {cat.estimatedCost > 0 ? Math.round((cat.actualCost / cat.estimatedCost) * 100) : 0}%
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Cost Codes - Flat Design, No Nested Box Cards */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-0 border-t border-[#142036] bg-[#070D1A]/50 divide-y divide-[#142036]/50">
                    {cat.costCodes.map((cc) => (
                      <div key={cc.code} className="py-3 first:pt-2.5 last:pb-0 flex flex-col gap-2 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20 flex-shrink-0">
                              {cc.code}
                            </span>
                            <span className="font-bold text-white text-[11px] truncate">{cc.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-[10px] font-bold ${cc.variance <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {cc.variance <= 0 ? `-$${Math.abs(cc.variance).toLocaleString()}` : `+$${cc.variance.toLocaleString()}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCode(cc);
                                setEditingName(cc.name);
                                setEditingBudget(String(cc.estimatedCost));
                                setEditingCommitted(String(cc.actualCost));
                              }}
                              className="text-[10px] font-bold text-blue-400 hover:text-blue-300 cursor-pointer active:scale-95 transition-all"
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        {/* Cost Line Items - Flat Indented Row items */}
                        <div className="flex flex-col gap-1.5 pl-3">
                          {cc.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-[11px] text-slate-400 py-0.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0" />
                                <span className="font-medium text-slate-300 truncate">{item.name}</span>
                                <span className="text-[8px] uppercase text-slate-500 font-bold flex-shrink-0">({item.type})</span>
                              </div>
                              <span className="font-semibold text-slate-300 flex-shrink-0">${item.actualCost.toLocaleString()}</span>
                            </div>
                          ))}
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-[#070D1A] border border-[#1E2E4A] rounded-2xl p-5 shadow-2xl flex flex-col gap-3 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <h3 className="text-xs font-bold text-white">Add CSI Cost Code</h3>
              <button
                onClick={() => setIsAddCodeModalOpen(false)}
                className="w-6 h-6 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCodeSubmit} className="flex flex-col gap-2.5 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">CSI Trade Division</label>
                <select
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="03 - Concrete & Formwork">03 - Concrete & Formwork</option>
                  <option value="05 - Metals & Structural Steel">05 - Metals & Structural Steel</option>
                  <option value="15 - Mechanical & HVAC">15 - Mechanical & HVAC</option>
                  <option value="16 - Electrical & Power">16 - Electrical & Power</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Cost Code Line Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Slab Rebar Reinforcement"
                  value={costCodeName}
                  onChange={(e) => setCostCodeName(e.target.value)}
                  className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Budget Amount ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="45000"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Committed ($)</label>
                  <input
                    type="number"
                    placeholder="38000"
                    value={committedAmount}
                    onChange={(e) => setCommittedAmount(e.target.value)}
                    className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#142036] mt-1">
                <button
                  type="button"
                  onClick={() => setIsAddCodeModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#0E1A33] text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT COST CODE MODAL ─── */}
      {editingCode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-[#070D1A] border border-[#1E2E4A] rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div>
                <h3 className="text-xs font-bold text-white">Edit CSI Cost Code ({editingCode.code})</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Modify budget and actual costs</p>
              </div>
              <button
                onClick={() => setEditingCode(null)}
                className="w-6 h-6 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditCodeSubmit} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-350 block mb-1">Cost Code Line Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Slab Rebar Reinforcement"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-350 block mb-1">Budget Amount ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="45000"
                    value={editingBudget}
                    onChange={(e) => setEditingBudget(e.target.value)}
                    className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-350 block mb-1">Committed / Actual ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="38000"
                    value={editingCommitted}
                    onChange={(e) => setEditingCommitted(e.target.value)}
                    className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#142036] mt-1">
                <button
                  type="button"
                  onClick={() => setEditingCode(null)}
                  className="px-3 py-1.5 rounded-lg bg-[#0E1A33] text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer"
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
