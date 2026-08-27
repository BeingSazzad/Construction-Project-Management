import React, { useState } from 'react';
import { Project, TradeCategory, CostCodeGroup } from '../../types';
import { 
  ChevronDown, ChevronRight, Search, Plus, 
  Layers, Hammer, Boxes, Flame, Zap, BarChart2, Download
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

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'cat-03': true,
    'cat-05': false,
    'cat-15': false,
    'cat-16': false,
  });

  const [searchQuery, setSearchQuery] = useState('');

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
        return {
          ...cat,
          estimatedCost: cat.estimatedCost + Number(budgetAmount),
          actualCost: cat.actualCost + (Number(committedAmount) || 0),
          costCodes: [...cat.costCodes, newCode]
        };
      }
      return cat;
    }));

    setCostCodeName('');
    setBudgetAmount('');
    setCommittedAmount('');
    setIsAddCodeModalOpen(false);
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

  // Monthly Budget vs Actual Data
  const monthlyData = [
    { month: 'Jan', budget: 450, actual: 420 },
    { month: 'Feb', budget: 620, actual: 590 },
    { month: 'Mar', budget: 850, actual: 810 },
    { month: 'Apr', budget: 920, actual: 950 },
    { month: 'May', budget: 980, actual: 880 },
    { month: 'Jun', budget: 830, actual: 0 }
  ];

  const maxVal = 1000;

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
      <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Budget Overview</span>
          <div className="flex items-center gap-2">
            {onImportBudget && (
              <button
                onClick={onImportBudget}
                className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-purple-500/20 cursor-pointer transition-all"
              >
                <Download className="w-3 h-3" />
                <span>Import CSV</span>
              </button>
            )}
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              +$230K Favorable
            </span>
          </div>
        </div>

        {/* 2 Main Metrics + Circular Percentage Donut */}
        <div className="flex items-center justify-between bg-[#080D17] p-3 rounded-xl border border-[#141E2F] mb-3">
          <div className="space-y-2">
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Budget</span>
              <div className="text-lg font-bold text-white">${(project.budget.total / 1000000).toFixed(2)}M</div>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Cost (Actual)</span>
              <div className="text-lg font-bold text-blue-400">${(project.budget.actual / 1000000).toFixed(2)}M</div>
            </div>
          </div>

          {/* 70% Progress Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#172238]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400"
                strokeDasharray="70, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white">70%</span>
          </div>
        </div>

        {/* Financial Line Breakdown */}
        <div className="space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Committed (Subcontracts):</span>
            <span className="font-semibold text-white">${(project.budget.committed / 1000000).toFixed(2)}M</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Paid Invoices:</span>
            <span className="font-semibold text-slate-200">${(project.budget.paid / 1000000).toFixed(2)}M</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Remaining Balance:</span>
            <span className="font-semibold text-emerald-400">${(project.budget.remaining / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </div>

      {/* Budget vs Actual Monthly Bar Chart */}
      <div className="card-dark p-4 bg-[#0D131F] border-[#1A2436]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Budget vs Actual</h3>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-blue-500"></span>
              <span className="text-slate-400">Budget</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-cyan-400"></span>
              <span className="text-slate-400">Actual</span>
            </div>
          </div>
        </div>

        {/* Monthly Bar Visualizer */}
        <div className="h-32 flex items-end justify-between gap-2 pt-4 pb-1 border-b border-[#182338]">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1 h-full">
                {/* Budget bar */}
                <div 
                  className="w-2.5 bg-blue-600/80 rounded-t-sm transition-all"
                  style={{ height: `${(d.budget / maxVal) * 100}%` }}
                  title={`Budget: $${d.budget}K`}
                />
                {/* Actual bar */}
                <div 
                  className={`w-2.5 rounded-t-sm transition-all ${d.actual > 0 ? 'bg-cyan-400' : 'bg-slate-700/30'}`}
                  style={{ height: `${(d.actual / maxVal) * 100}%` }}
                  title={`Actual: $${d.actual}K`}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 font-medium">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CSI Cost Codes Accordion */}
      <div>
        <div className="flex items-center justify-between mb-2">
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
                className="card-dark overflow-hidden border-[#1A2436] bg-[#0D131F]"
              >
                {/* Category Header */}
                <div
                  onClick={() => toggleCategory(cat.id)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-[#111A2C] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#111827] border border-[#1E293B]">
                      {getIcon(cat.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        ${(cat.actualCost / 1000).toFixed(0)}K of ${(cat.estimatedCost / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-400">
                      {Math.round((cat.actualCost / cat.estimatedCost) * 100)}%
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Cost Codes */}
                {isExpanded && (
                  <div className="p-2.5 bg-[#080D17] border-t border-[#162033] space-y-2">
                    {cat.costCodes.map((cc) => (
                      <div key={cc.code} className="bg-[#0D131F] rounded-lg p-2.5 border border-[#182338] text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                              {cc.code}
                            </span>
                            <span className="font-bold text-white">{cc.name}</span>
                          </div>
                          <span className={`text-xs font-bold ${cc.variance <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {cc.variance <= 0 ? `-$${Math.abs(cc.variance).toLocaleString()}` : `+$${cc.variance.toLocaleString()}`}
                          </span>
                        </div>

                        {/* Cost Line Items */}
                        <div className="space-y-1.5 mt-2">
                          {cc.items.map((item) => (
                            <div key={item.id} className="p-2 bg-[#090E18] rounded border border-[#141E2F] flex items-center justify-between text-xs">
                              <div>
                                <span className="font-medium text-slate-200">{item.name}</span>
                                <span className="text-xs uppercase text-slate-500 ml-1.5 font-bold">({item.type})</span>
                              </div>
                              <span className="font-bold text-slate-300">${item.actualCost.toLocaleString()}</span>
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

    </div>
  );
};
