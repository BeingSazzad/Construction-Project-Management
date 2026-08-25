import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronDown, ChevronRight, Download, Save, 
  DollarSign, TrendingUp, ShieldCheck, AlertTriangle, Layers, 
  FileText, Users, BarChart3, Clock, Sparkles, Plus, Check 
} from 'lucide-react';

interface BudgetDetailViewProps {
  budgetId?: string;
  onBack: () => void;
}

export const BudgetDetailView: React.FC<BudgetDetailViewProps> = ({
  budgetId = 'b-1',
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'forecast' | 'learning' | 'team' | 'activity' | 'reports'>('breakdown');
  const [status, setStatus] = useState<'in review' | 'draft' | 'approved'>('in review');

  // Accordion state for Cost Breakdown (Matching Screenshot 5)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'engineering': true,
    'precon': true,
    'foundation': true,
    'framing': false,
  });

  // Line items state for interactive edits
  const [sections, setSections] = useState([
    {
      id: 'engineering',
      name: '1. Engineering',
      category: 'Engineering',
      items: [
        { id: 'eng-1', name: 'Geotechnical soil report & foundation design', qty: 1, unit: 'EA', unitCost: 3500, total: 3500 },
        { id: 'eng-2', name: 'Structural engineering drawings & framing calculations', qty: 1, unit: 'EA', unitCost: 4800, total: 4800 },
        { id: 'eng-3', name: 'Truss engineering & shop drawings', qty: 1, unit: 'EA', unitCost: 1800, total: 1800 },
        { id: 'eng-4', name: 'Wind / seismic load calculations', qty: 1, unit: 'EA', unitCost: 1200, total: 1200 },
        { id: 'eng-5', name: 'Civil site engineering (grading & drainage plan)', qty: 1, unit: 'EA', unitCost: 2600, total: 2600 }
      ]
    },
    {
      id: 'precon',
      name: '2. Pre-Construction & Permits',
      category: 'Pre-Construction',
      items: [
        { id: 'pre-1', name: 'Land survey & soil bearing test', qty: 1, unit: 'EA', unitCost: 1850, total: 1850 },
        { id: 'pre-2', name: 'Submit HOA / architectural review package', qty: 1, unit: 'EA', unitCost: 650, total: 650 },
        { id: 'pre-3', name: 'Pull building permit', qty: 1, unit: 'EA', unitCost: 4200, total: 4200 },
        { id: 'pre-4', name: 'Pull environmental permit (DEP / stormwater SWPPP)', qty: 1, unit: 'EA', unitCost: 1100, total: 1100 },
        { id: 'pre-5', name: 'Set up temporary power & water', qty: 1, unit: 'EA', unitCost: 2400, total: 2400 },
        { id: 'pre-6', name: 'Install silt fencing & erosion control', qty: 1, unit: 'EA', unitCost: 1650, total: 1650 }
      ]
    },
    {
      id: 'foundation',
      name: '3. Site Work & Foundation',
      category: 'Foundation',
      items: [
        { id: 'fdn-1', name: 'Clear & grade lot', qty: 1, unit: 'EA', unitCost: 6500, total: 6500 },
        { id: 'fdn-2', name: 'Excavation & trenching for footings', qty: 1, unit: 'EA', unitCost: 4800, total: 4800 },
        { id: 'fdn-3', name: 'Formwork & rebar reinforcement placement', qty: 1, unit: 'EA', unitCost: 9200, total: 9200 },
        { id: 'fdn-4', name: 'Pour 3500 PSI structural concrete slab', qty: 1, unit: 'EA', unitCost: 28400, total: 28400 },
        { id: 'fdn-5', name: 'Foundation waterproofing & French drain', qty: 1, unit: 'EA', unitCost: 3800, total: 3800 }
      ]
    }
  ]);

  const toggleSection = (secId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  const handleCostChange = (sectionId: string, itemId: string, newCost: number) => {
    setSections(prev => prev.map(sec => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.map(it => {
          if (it.id !== itemId) return it;
          return {
            ...it,
            unitCost: newCost,
            total: it.qty * newCost
          };
        })
      };
    }));
  };

  // Calculate totals
  const totalCost = sections.reduce((secSum, sec) => {
    return secSum + sec.items.reduce((itemSum, item) => itemSum + item.total, 0);
  }, 0);

  const totalItemsCount = sections.reduce((sum, sec) => sum + sec.items.length, 0);

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-24 font-sans text-slate-100">
      {/* Top Header Bar (Matching Screenshot 4) */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Budgets</span>
        </button>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="bg-[#0D1422] border border-[#1E293B] rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 outline-none focus:border-teal-400 cursor-pointer"
          >
            <option value="in review">In Review ▾</option>
            <option value="draft">Draft ▾</option>
            <option value="approved">Approved ▾</option>
          </select>

          <button
            onClick={() => alert("Exporting Budget to PDF/CSV...")}
            className="px-3 py-1.5 rounded-xl bg-[#0D1422] hover:bg-[#141F33] border border-[#1E293B] text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={() => alert("Budget saved successfully!")}
            className="px-3.5 py-1.5 rounded-xl bg-[#00D2B4] hover:bg-[#00baa0] text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Budget Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-white tracking-tight">Lawn</h1>
          <span className="text-sm font-bold text-slate-400">· 000</span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          {totalItemsCount} line items · {status}
        </p>
      </div>

      {/* 12 Metric KPI Cards in 3 Rows x 4 Columns (Matching Screenshot 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Row 1 */}
        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <DollarSign className="w-3 h-3 text-slate-500" />
            <span>TOTAL ESTIMATED</span>
          </div>
          <div className="text-base sm:text-lg font-black text-white mt-1">
            ${totalCost.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">REVISED BUDGET</span>
          <div className="text-base sm:text-lg font-black text-white mt-1">
            ${totalCost > 0 ? (totalCost * 1.05).toLocaleString() : '$0'}
          </div>
        </div>

        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">COST / SF</span>
          <div className="text-base sm:text-lg font-black text-teal-400 mt-1">
            $185.40
          </div>
        </div>

        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">SALE / SF</span>
          <div className="text-base sm:text-lg font-black text-teal-400 mt-1">
            $245.00
          </div>
        </div>

        {/* Row 2 */}
        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">ACTUAL</span>
          <div className="text-base sm:text-lg font-black text-white mt-1">
            $18,400
          </div>
        </div>

        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">FORECAST FINAL</span>
          <div className="text-base sm:text-lg font-black text-white mt-1">
            ${totalCost.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">REMAINING</span>
          <div className="text-base sm:text-lg font-black text-[#00D2B4] mt-1">
            ${Math.max(0, totalCost - 18400).toLocaleString()}
          </div>
        </div>

        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">REVENUE</span>
          <div className="text-base sm:text-lg font-black text-white mt-1">
            ${(totalCost * 1.28).toLocaleString()}
          </div>
        </div>

        {/* Row 3 */}
        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">PROFIT</span>
          <div className="text-base sm:text-lg font-black text-emerald-400 mt-1">
            +${(totalCost * 0.28).toLocaleString()}
          </div>
        </div>

        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">MARGIN</span>
          <div className="text-base sm:text-lg font-black text-[#00D2B4] mt-1">
            28.0%
          </div>
        </div>

        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">CONTINGENCY LEFT</span>
          <div className="text-base sm:text-lg font-black text-white mt-1">
            $12,500
          </div>
        </div>

        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">VARIANCE</span>
          <div className="text-base sm:text-lg font-black text-emerald-400 mt-1">
            +$4,200
          </div>
        </div>
      </div>

      {/* DEAL SCORE Banner (Matching Screenshot 4) */}
      <div className="p-3 rounded-2xl bg-[#0C121F] border border-[#182438] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
            Deal Score
          </span>
        </div>
        <span className="text-base font-black text-rose-400">
          88/100 · High Profit Potential
        </span>
      </div>

      {/* Sub-Navigation Tabs (Matching Screenshot 4) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#162033]">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'breakdown', label: 'Cost Breakdown' },
          { id: 'forecast', label: 'Financial Forecast' },
          { id: 'learning', label: 'Learning' },
          { id: 'team', label: 'Team' },
          { id: 'activity', label: 'Activity' },
          { id: 'reports', label: 'Reports' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-teal-500/15 text-[#00D2B4] border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* COST BREAKDOWN TAB (Matching Screenshot 5) */}
      {activeTab === 'breakdown' && (
        <div className="flex flex-col gap-3">
          {sections.map((sec) => {
            const isExpanded = expandedSections[sec.id];
            const sectionTotal = sec.items.reduce((sum, it) => sum + it.total, 0);

            return (
              <div 
                key={sec.id}
                className="bg-[#0A0E17] border border-[#162033] rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Section Accordion Header */}
                <button
                  onClick={() => toggleSection(sec.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#0E1524] transition-colors cursor-pointer text-left border-l-4 border-l-blue-500"
                >
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-4 h-4 text-blue-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                    <span className="text-xs font-black text-white">{sec.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {sec.items.length} items
                    </span>
                    <span className="text-xs font-bold text-blue-400">
                      ${sectionTotal.toLocaleString()}
                    </span>
                  </div>
                </button>

                {/* Line Items Table Rows (Matching Screenshot 5) */}
                {isExpanded && (
                  <div className="p-3 border-t border-[#141E2F] flex flex-col gap-2 bg-[#080D18]">
                    {sec.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-[#0D1422] border border-[#1A263B] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-slate-700 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-white block truncate">{item.name}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{sec.category}</span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-12 bg-[#080D18] border border-[#1E293B] rounded-lg px-2 py-1 text-center text-xs text-slate-200 font-semibold">
                            {item.qty}
                          </div>

                          <div className="w-14 bg-[#080D18] border border-[#1E293B] rounded-lg px-2 py-1 text-center text-[11px] text-slate-400 font-bold">
                            {item.unit}
                          </div>

                          <div className="flex items-center bg-[#080D18] border border-[#1E293B] rounded-lg px-2 py-1 w-24">
                            <span className="text-[11px] text-slate-500 mr-1">$</span>
                            <input
                              type="number"
                              value={item.unitCost}
                              onChange={(e) => handleCostChange(sec.id, item.id, Number(e.target.value))}
                              placeholder="0"
                              className="w-full bg-transparent text-xs text-slate-200 outline-none font-semibold"
                            />
                          </div>

                          <div className="w-20 text-right text-xs font-extrabold text-white">
                            ${item.total.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* OVERVIEW TAB (Matching Details section from Screenshot 4) */}
      {activeTab === 'overview' && (
        <div className="p-4 rounded-2xl bg-[#0D1422] border border-[#1A263B] shadow-sm flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
            Budget Overview Details
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Budget Name</span>
              <div className="font-bold text-white mt-0.5">Lawn</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Budget #</span>
              <div className="font-bold text-white mt-0.5">000</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Status</span>
              <div className="font-bold text-teal-400 mt-0.5">{status}</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Project Type</span>
              <div className="font-bold text-white mt-0.5">Remodel</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Prepared By</span>
              <div className="font-bold text-white mt-0.5">Alex Chen (Avery & Marsh)</div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Created Date</span>
              <div className="font-bold text-slate-300 mt-0.5">08/22/2026</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
