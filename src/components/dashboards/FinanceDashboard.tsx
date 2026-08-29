import React, { useState } from 'react';
import { Project, TradeCategory, FinancingDraw, LienWaiver } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MOCK_FINANCING_DRAWS, MOCK_LIEN_WAIVERS } from '../../data/mockData';
import { 
  Sparkles, ChevronRight, DollarSign, 
  Landmark, FileCheck, CheckCircle2, Plus,
  Clock, AlertTriangle, TrendingUp, TrendingDown, Layers, FileText, Download, ShieldCheck
} from 'lucide-react';

interface FinanceDashboardProps {
  projects: Project[];
  categories: TradeCategory[];
  onSelectProject: (project: Project) => void;
  onOpenBudgetDetails: () => void;
  onOpenReports: () => void;
  onOpenLatti: () => void;
  onOpenOpportunities?: () => void;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  projects,
  onSelectProject,
  onOpenBudgetDetails,
  onOpenReports,
  onOpenLatti,
  onOpenOpportunities
}) => {
  const [financeTab, setFinanceTab] = useState<'draws' | 'lien' | 'rates' | 'overview' | 'pipeline'>('draws');
  const [draws, setDraws] = useState<FinancingDraw[]>(MOCK_FINANCING_DRAWS);
  const [lienWaivers, setLienWaivers] = useState<LienWaiver[]>(MOCK_LIEN_WAIVERS);
  const [selectedDraw, setSelectedDraw] = useState<FinancingDraw | null>(null);

  const materialRates = [
    { name: 'Portland Cement (Type I/II)', rate: '$455.00 / Bag', change: '+30%', isUp: true, trade: 'Div 03 Concrete' },
    { name: 'Red Clay Bricks (Standard)', rate: '$46.00 / 100 Pack', change: '+15%', isUp: true, trade: 'Div 04 Masonry' },
    { name: 'Structural Steel (W-Beams)', rate: '$368.00 / Tonne', change: '-8%', isUp: false, trade: 'Div 05 Metals' },
    { name: 'Aggregates (15mm Mix)', rate: '$262.80 / Tonne', change: '+30%', isUp: true, trade: 'Div 03 Concrete' },
    { name: 'Filter Sand & Gravel', rate: '$52.00 / Tonne', change: '-12%', isUp: false, trade: 'Div 31 Earthwork' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 px-4 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ── Top Header & Tab Pills ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Draws &amp; Compliance Hub</h2>
          <p className="text-[11px] text-slate-400 font-medium">Lender Draws, AIA G702 &amp; Lien Security</p>
        </div>
      </div>

      {/* Finance Sub-Navigation Pills */}
      <div className="flex items-center gap-1 bg-[#060B18] p-1 rounded-2xl border border-[#142036] overflow-x-auto scrollbar-none">
        {[
          { id: 'draws', label: `Lender Draws (${draws.length})` },
          { id: 'lien', label: `Lien Waivers (${lienWaivers.length})` },
          { id: 'rates', label: 'Material Rates' },
          { id: 'overview', label: 'Portfolio Ledger' },
          { id: 'pipeline', label: 'Deals ($3.8M)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFinanceTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              financeTab === tab.id
                ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: DRAWS (AIA G702 / G703 DRAW MANAGEMENT) ── */}
      {financeTab === 'draws' && (
        <div className="flex flex-col gap-3">
          {/* Summary Card */}
          <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Construction Loan Draws</h3>
              </div>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                AIA G702 Standard
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-[#050A14] border border-[#131D31]">
                <p className="text-[10px] text-slate-400 font-semibold">Total Draws</p>
                <p className="text-base font-extrabold text-white mt-0.5">{draws.length}</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#050A14] border border-[#131D31]">
                <p className="text-[10px] text-slate-400 font-semibold">In Review</p>
                <p className="text-base font-extrabold text-amber-400 mt-0.5">
                  {draws.filter(d => d.status.includes('Review') || d.status.includes('Scheduled')).length}
                </p>
              </div>
              <div className="p-2.5 rounded-2xl bg-[#050A14] border border-[#131D31]">
                <p className="text-[10px] text-slate-400 font-semibold">Funded to Date</p>
                <p className="text-base font-extrabold text-emerald-400 mt-0.5">
                  ${(draws.filter(d => d.status === 'Approved & Funded').reduce((acc, d) => acc + d.fundedAmount, 0) / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </div>

          {/* Draws List */}
          <div className="flex flex-col gap-2.5">
            {draws.map((d) => {
              const retainage10 = Math.round(d.requestedAmount * 0.1);
              const netPayable = d.requestedAmount - retainage10;

              return (
                <div 
                  key={d.id} 
                  className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] hover:border-blue-500/40 transition-all shadow-sm flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">{d.milestoneTitle}</span>
                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          Draw #{d.drawNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {d.lenderName} · Requested: {d.requestDate}
                      </p>
                    </div>
                    <StatusBadge status={d.status} size="xs" />
                  </div>

                  {/* Financial Details Row */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-[#050A14] border border-[#131D31] text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[9px] font-semibold uppercase">Gross Billing</span>
                      <span className="font-extrabold text-white">${d.requestedAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] font-semibold uppercase">Retainage (10%)</span>
                      <span className="font-bold text-amber-400">-${retainage10.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] font-semibold uppercase">Net Draw Request</span>
                      <span className="font-black text-emerald-400">${netPayable.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Inspector / Verification Status */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Bank Inspector: {d.inspectorName || 'David Vance (Verified)'}</span>
                    </span>
                    <button 
                      onClick={() => alert(`Generating AIA G702 Digital Package for Draw #${d.drawNumber}...`)}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>AIA G702</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: LIEN WAIVERS (SUB COMPLIANCE & LEGAL SECURITY) ── */}
      {financeTab === 'lien' && (
        <div className="flex flex-col gap-3">
          {/* Summary Card */}
          <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Subcontractor Lien Waiver Shield</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                100% Risk Shield
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Unconditional &amp; Conditional lien releases must be executed prior to disbursing project funds to prevent mechanic's liens.
            </p>
          </div>

          {/* Lien Waivers List */}
          <div className="flex flex-col gap-2.5">
            {lienWaivers.map((l) => (
              <div 
                key={l.id} 
                className="p-3.5 rounded-3xl bg-[#080E1C] border border-[#14223E] hover:border-emerald-500/40 transition-all shadow-sm flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-white">{l.subcontractorName}</span>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{l.trade} · Ref: {l.invoiceRef}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {l.type}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#131D31]">
                  <span className="text-slate-400 font-medium">Invoice Amount: <strong className="text-white">${l.amount.toLocaleString()}</strong></span>
                  <StatusBadge status={l.status} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: MATERIAL RATES (ESCALATION RADAR) ── */}
      {financeTab === 'rates' && (
        <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">Material Market Index</h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Live Spot Market</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {materialRates.map((m, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-white block truncate">{m.name}</span>
                  <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{m.trade}</span>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-black text-white">{m.rate}</span>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 border ${
                    m.isUp 
                      ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' 
                      : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  }`}>
                    {m.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{m.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: PORTFOLIO LEDGER ── */}
      {financeTab === 'overview' && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-[#14223E]">
              <div className="text-[11px] font-semibold text-slate-400">Total Portfolio Budget</div>
              <div className="text-lg font-black text-white mt-1">$46.80M</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-[#14223E]">
              <div className="text-[11px] font-semibold text-slate-400">Actual Spent to Date</div>
              <div className="text-lg font-black text-blue-400 mt-1">$18.69M</div>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">Project Financial Status</h3>
              <button onClick={onOpenReports} className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer">
                View Reports
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {projects.map((p) => {
                const totalM = (p.budget.total / 1000000).toFixed(2);
                const actualM = (p.budget.actual / 1000000).toFixed(2);
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] hover:border-blue-500/40 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm group"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        Spent ${actualM}M of ${totalM}M
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: PRE-CONSTRUCTION PIPELINE & PRO-FORMA ── */}
      {financeTab === 'pipeline' && (
        <div className="p-4 rounded-3xl bg-[#080E1C] border border-[#14223E] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Pre-Construction Pipeline</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Est. incoming contract cashflow</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              $3.77M Gross
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31]">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Weighted Value</div>
              <div className="text-base font-black text-white mt-1">$1.48M</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31]">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Avg Win Prob</div>
              <div className="text-base font-black text-emerald-400 mt-1">42%</div>
            </div>
          </div>

          {onOpenOpportunities && (
            <button
              onClick={onOpenOpportunities}
              className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-1"
            >
              <span>Manage Pre-Con Opportunities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

    </div>
  );
};
