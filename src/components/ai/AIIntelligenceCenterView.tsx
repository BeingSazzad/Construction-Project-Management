import React, { useState } from 'react';
import { 
  Sparkles, Layers, CheckCircle2, ShieldCheck, RefreshCw, 
  BarChart3, Database, FileCheck, History, AlertCircle, Plus,
  Search, SlidersHorizontal, ChevronRight, HelpCircle, X,
  ArrowUpRight, Clock, Award, Lock, BookOpen, Activity, Cpu, Zap, Lightbulb, TrendingUp, TrendingDown
} from 'lucide-react';
import { Project } from '../../types';

interface AIIntelligenceCenterViewProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
  onOpenLatti?: () => void;
  onOpenBudgets?: () => void;
}

export const AIIntelligenceCenterView: React.FC<AIIntelligenceCenterViewProps> = ({
  projects,
  onOpenBudgets
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'review' | 'library' | 'approvals' | 'contingency' | 'market' | 'audit' | 'metrics' | 'governance'>('overview');
  const [reviewSubTab, setReviewSubTab] = useState<'market' | 'calculations'>('market');
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState<boolean>(false);
  const [isRefreshingMarket, setIsRefreshingMarket] = useState<boolean>(false);

  // Correction Form State
  const [correctionTopic, setCorrectionTopic] = useState('');
  const [correctionCategory, setCorrectionCategory] = useState('Labor Productivity');
  const [correctionNotes, setCorrectionNotes] = useState('');

  const handleRunMarketRefresh = () => {
    setIsRefreshingMarket(true);
    setTimeout(() => {
      setIsRefreshingMarket(false);
      alert('Market Refresh Completed! Cost Baseline v1 updated to August 2026.');
    }, 1500);
  };

  const handleCreateCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCorrectionModalOpen(false);
    alert(`New correction request "${correctionTopic}" submitted for admin review!`);
    setCorrectionTopic('');
    setCorrectionNotes('');
  };

  // 9 Tabs Configuration
  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'review', label: 'Review' },
    { id: 'library', label: 'Library' },
    { id: 'approvals', label: 'Approvals' },
    { id: 'contingency', label: 'Contingency' },
    { id: 'market', label: 'Market' },
    { id: 'audit', label: 'Audit' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'governance', label: 'Governance' },
  ] as const;

  const APPROVED_LEARNING_ITEMS = [
    { id: 'l-1', title: 'Hang Drywall', category: 'Labor Productivity', status: 'Approved for Company', date: 'Aug 24, 2026' },
    { id: 'l-2', title: 'Roofing Square Conversion', category: 'Coverage & Conversions', status: 'Approved for Company', date: 'Aug 20, 2026' },
    { id: 'l-3', title: 'Paint Coverage per Gallon', category: 'Coverage & Conversions', status: 'Approved for Company', date: 'Aug 15, 2026' },
    { id: 'l-4', title: 'Tile Box Coverage', category: 'Coverage & Conversions', status: 'Approved for Company', date: 'Aug 10, 2026' },
  ];

  const LIBRARY_RECORDS = [
    { id: 'rec-1', name: 'Standard Drywall Labor Rate', category: 'Labor Productivity', trade: 'Division 09 - Finishes', rate: '$3.80 / SF', confidence: '98.5%' },
    { id: 'rec-2', name: 'Ready-Mix Concrete Assembly', category: 'Assemblies', trade: 'Division 03 - Concrete', rate: '$145.00 / Cu Yd', confidence: '99.1%' },
    { id: 'rec-3', name: 'Exterior Sheathing Waste Factor', category: 'Waste Factors', trade: 'Division 06 - Carpentry', rate: '8.5% Allowance', confidence: '95.2%' },
    { id: 'rec-4', name: 'Electrical Rough-in Riser', category: 'Labor Productivity', trade: 'Division 16 - Electrical', rate: '$62.00 / Hr', confidence: '96.0%' },
    { id: 'rec-5', name: 'Tile Coverage per Box', category: 'Coverage & Conversions', trade: 'Division 09 - Finishes', rate: '14.5 SF / Box', confidence: '99.4%' },
  ];

  const AUDIT_LOGS = [
    { id: 'a-1', action: 'Cost Baseline Refresh', user: 'System (Monthly Cycle)', time: 'Aug 28, 2026 09:00 AM', detail: 'Market pricing synced with Austin Regional Index' },
    { id: 'a-2', action: 'Approved Correction', user: 'Alex Chen (Owner)', time: 'Aug 24, 2026 02:15 PM', detail: 'Approved Hang Drywall labor rate adjustment' },
    { id: 'a-3', action: 'Governance Policy Update', user: 'Michael Chang (Finance)', time: 'Aug 20, 2026 11:30 AM', detail: 'Enforced 2-Factor approval for >$10k variance' },
  ];

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
      
      {/* ─── 1. PAGE TITLE & SUBTITLE ─── */}
      <div className="flex flex-col gap-1 border-b border-[#EAEDF1] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF] shadow-xs">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-[#171A1F] tracking-tight">Latti Intelligence Center</h1>
            <p className="text-xs text-[#68707C] font-medium">Lattice AI-Powered Construction Cost Baseline & Knowledge Engine</p>
          </div>
        </div>
      </div>

      {/* ─── 2. 9 TABS SCROLLABLE BAR ─── */}
      <div className="w-full overflow-x-auto scrollbar-none py-1">
        <div className="flex items-center gap-1.5 min-w-max">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-[#1677FF] text-white shadow-xs'
                    : 'bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] border border-[#DDE1E7]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── TAB 1: OVERVIEW ─── */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          
          {/* Hero Banner */}
          <div className="p-4.5 rounded-3xl bg-[#EAF3FF] border border-[#1677FF]/20 shadow-xs flex flex-col gap-2.5 relative overflow-hidden">
            <div className="relative z-10 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1677FF]">System Baseline</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#1677FF] border border-[#1677FF]/30">Monthly Cycle</span>
              </div>
              <h2 className="text-sm font-black text-[#171A1F]">Latti Cost Baseline — August 2026</h2>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1677FF]/15 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-[#DDE1E7] shadow-xs">
                  <span className="text-[#68707C] text-[10px] font-bold block uppercase">Last Refresh</span>
                  <span className="font-extrabold text-[#171A1F] mt-0.5 block">7/16/2026</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#DDE1E7] shadow-xs">
                  <span className="text-[#68707C] text-[10px] font-bold block uppercase">Next Refresh</span>
                  <span className="font-extrabold text-[#1677FF] mt-0.5 block">9/1/2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Library Composition */}
          <div className="p-4 rounded-3xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[#171A1F] uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#1677FF]" />
              <span>Cost Library Composition</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1]">
                <span className="text-[10px] text-[#68707C] font-bold block uppercase">Distinct Trades</span>
                <span className="text-xs font-black text-[#171A1F] block mt-0.5">9 Trades</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1]">
                <span className="text-[10px] text-[#68707C] font-bold block uppercase">Assemblies</span>
                <span className="text-xs font-black text-[#1677FF] block mt-0.5">9 Assemblies</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1]">
                <span className="text-[10px] text-[#68707C] font-bold block uppercase">Labor Records</span>
                <span className="text-xs font-black text-[#1677FF] block mt-0.5">10 Records</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1]">
                <span className="text-[10px] text-[#68707C] font-bold block uppercase">Approved Records</span>
                <span className="text-xs font-black text-[#389E0D] block mt-0.5">59 Approved</span>
              </div>
            </div>
          </div>

          {/* Estimating Accuracy */}
          <div className="p-4 rounded-3xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[#171A1F] uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-[#1677FF]" />
              <span>Estimating Accuracy</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1]">
                <span className="text-[10px] text-[#68707C] font-bold block uppercase">Overall Accuracy</span>
                <span className="text-xs font-bold text-[#68707C] mt-0.5 block">— (No actuals yet)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1]">
                <span className="text-[10px] text-[#68707C] font-bold block uppercase">Labor Accuracy</span>
                <span className="text-xs font-bold text-[#68707C] mt-0.5 block">— (No actuals yet)</span>
              </div>
            </div>
          </div>

          {/* Recent Approved Learning */}
          <div className="p-4 rounded-3xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[#171A1F] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#389E0D]" />
              <span>Recent Approved Learning</span>
            </h3>

            <div className="flex flex-col gap-2">
              {APPROVED_LEARNING_ITEMS.map(item => (
                <div key={item.id} className="p-3 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1] flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-extrabold text-[#171A1F]">{item.title}</h4>
                    <span className="text-[10px] text-[#68707C] font-medium">{item.category}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6F7ED] text-[#389E0D] border border-[#B7EB8F]">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Administrator Actions */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#389E0D]" />
              <span className="font-bold text-[#68707C]">All caught up — no admin actions required</span>
            </div>
          </div>

        </div>
      )}

      {/* ─── TAB 2: REVIEW ─── */}
      {activeTab === 'review' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          <div className="flex items-center gap-1 p-1 bg-[#F2F2F7] rounded-2xl border border-[#DDE1E7]">
            <button
              onClick={() => setReviewSubTab('market')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                reviewSubTab === 'market' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-[#68707C] hover:text-[#171A1F]'
              }`}
            >
              Market Refresh
            </button>
            <button
              onClick={() => setReviewSubTab('calculations')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                reviewSubTab === 'calculations' ? 'bg-[#1677FF] text-white shadow-xs' : 'text-[#68707C] hover:text-[#171A1F]'
              }`}
            >
              Calculations
            </button>
          </div>

          {reviewSubTab === 'market' ? (
            <div className="p-8 rounded-3xl bg-white border border-[#DDE1E7] shadow-xs text-center flex flex-col items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F7ED] border border-[#B7EB8F] flex items-center justify-center text-[#389E0D]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#171A1F]">No Market Refresh Items Pending</h3>
              <p className="text-xs text-[#68707C] max-w-xs leading-relaxed">
                No market-refreshed costs are waiting for review. Run a refresh in the Market tab to queue re-priced items here.
              </p>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-[#DDE1E7] shadow-xs text-center flex flex-col items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#171A1F]">No Calculation Flags Pending</h3>
              <p className="text-xs text-[#68707C] max-w-xs leading-relaxed">
                No budget line calculations are waiting for review. Flagged calculations appear here with formula, inputs, and results.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: LIBRARY ─── */}
      {activeTab === 'library' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#68707C] uppercase tracking-wider">Baseline Records</h3>
            <span className="text-[10px] text-[#1677FF] font-extrabold">{LIBRARY_RECORDS.length} Active Records</span>
          </div>

          <div className="flex flex-col gap-2">
            {LIBRARY_RECORDS.map(rec => (
              <div key={rec.id} className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[#171A1F]">{rec.name}</h4>
                  <span className="text-xs font-black text-[#1677FF]">{rec.rate}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#68707C]">
                  <span>{rec.trade}</span>
                  <span className="font-bold text-[#389E0D]">Conf: {rec.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: APPROVALS ─── */}
      {activeTab === 'approvals' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#68707C] uppercase tracking-wider">User Corrections</h3>
            <button
              onClick={() => setIsCorrectionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Correction</span>
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#DDE1E7] shadow-xs text-center flex flex-col items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF]">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#171A1F]">No Corrections Pending Review</h3>
            <p className="text-xs text-[#68707C] max-w-xs leading-relaxed">
              All submitted user baseline corrections have been approved or merged into the baseline model.
            </p>
          </div>
        </div>
      )}

      {/* ─── TAB 5: CONTINGENCY ─── */}
      {activeTab === 'contingency' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          <div className="p-4 rounded-3xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-3">
            <h3 className="text-xs font-bold text-[#171A1F] uppercase tracking-wider">Recommended Contingency Rules</h3>
            <div className="flex flex-col gap-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1] flex justify-between items-center">
                <span className="text-[#68707C] font-medium">Custom Single-Family Base:</span>
                <span className="font-bold text-[#1677FF]">7.5% – 10.0%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1] flex justify-between items-center">
                <span className="text-[#68707C] font-medium">Complex Hillside / Foundations:</span>
                <span className="font-bold text-[#D46B08]">12.0% – 15.0%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 6: MARKET ─── */}
      {activeTab === 'market' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          <div className="p-4 rounded-3xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#171A1F]">Market Refresh Engine</h3>
                <span className="text-xs text-[#68707C] block mt-0.5">Cost Baseline v1 · August 2026</span>
              </div>
              <button
                onClick={handleRunMarketRefresh}
                disabled={isRefreshingMarket}
                className="px-3.5 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingMarket ? 'animate-spin' : ''}`} />
                <span>{isRefreshingMarket ? 'Refreshing...' : 'Run Refresh'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 7: AUDIT ─── */}
      {activeTab === 'audit' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          <h3 className="text-xs font-bold text-[#68707C] uppercase tracking-wider">System Audit Trail</h3>
          <div className="flex flex-col gap-2">
            {AUDIT_LOGS.map(log => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#171A1F]">{log.action}</span>
                  <span className="text-[10px] text-[#9DA5B1]">{log.time}</span>
                </div>
                <span className="text-xs text-[#1677FF] font-bold">{log.user}</span>
                <p className="text-xs text-[#68707C] mt-0.5 leading-relaxed">{log.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 8: METRICS ─── */}
      {activeTab === 'metrics' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          <h3 className="text-xs font-bold text-[#68707C] uppercase tracking-wider">Module Breakdown Metrics</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs">
              <span className="text-[10px] text-[#68707C] uppercase font-bold block">Labor Productivity</span>
              <span className="text-sm font-black text-[#1677FF] block mt-1">10 Records</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs">
              <span className="text-[10px] text-[#68707C] uppercase font-bold block">Coverage & Conversions</span>
              <span className="text-sm font-black text-[#1677FF] block mt-1">12 Records</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 9: GOVERNANCE ─── */}
      {activeTab === 'governance' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          <h3 className="text-xs font-bold text-[#68707C] uppercase tracking-wider">Active Governance Rules</h3>
          <div className="p-4 rounded-3xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-[#171A1F]">Role-Based Approval Workflow</span>
            </div>
            <p className="text-xs text-[#68707C] leading-relaxed">
              All baseline adjustments and user corrections require Owner or Finance Director sign-off before being merged into Cost Baseline v1.
            </p>
          </div>
        </div>
      )}

      {/* ─── MODAL: NEW CORRECTION ─── */}
      {isCorrectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-sm bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#171A1F]">
            <div className="flex items-center justify-between border-b border-[#EAEDF1] pb-3">
              <h3 className="text-xs font-extrabold text-[#171A1F] uppercase tracking-wider">Submit User Correction</h3>
              <button 
                onClick={() => setIsCorrectionModalOpen(false)} 
                className="w-7 h-7 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleCreateCorrection} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-[10px] text-[#68707C] font-bold block mb-1">Topic / Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drywall Finishing Labor Rate"
                  value={correctionTopic}
                  onChange={(e) => setCorrectionTopic(e.target.value)}
                  className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3 text-[#171A1F] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#68707C] font-bold block mb-1">Category</label>
                <select
                  value={correctionCategory}
                  onChange={(e) => setCorrectionCategory(e.target.value)}
                  className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3 text-[#171A1F] font-semibold outline-none cursor-pointer"
                >
                  <option value="Labor Productivity">Labor Productivity</option>
                  <option value="Assemblies">Assemblies</option>
                  <option value="Waste Factors">Waste Factors</option>
                  <option value="Coverage & Conversions">Coverage & Conversions</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#68707C] font-bold block mb-1">Correction Notes & Empirical Evidence</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why this baseline figure needs adjustment..."
                  value={correctionNotes}
                  onChange={(e) => setCorrectionNotes(e.target.value)}
                  className="w-full bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl p-3 text-[#171A1F] outline-none resize-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAEDF1]">
                <button
                  type="button"
                  onClick={() => setIsCorrectionModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  Submit Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
