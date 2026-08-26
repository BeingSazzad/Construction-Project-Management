import React, { useState } from 'react';
import { 
  Plus, DollarSign, Building2, MapPin, Sparkles, 
  TrendingUp, CheckCircle2, Clock, X, ChevronRight, Filter
} from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  client: string;
  address: string;
  value: number;
  stage: 'Estimating' | 'Proposal Sent' | 'Under Contract' | 'Won';
  probability: number;
}

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Greenwood Estate New Build',
    client: 'Anderson Family Trust',
    address: 'Greenwood Village, CO',
    value: 2400000,
    stage: 'Estimating',
    probability: 25
  },
  {
    id: 'opp-2',
    title: 'Maple Ridge Custom Home',
    client: 'Sarah Johnson',
    address: 'Boulder, CO',
    value: 850000,
    stage: 'Estimating',
    probability: 40
  },
  {
    id: 'opp-3',
    title: 'Downtown Kitchen Remodel',
    client: 'Tom & Lisa Chen',
    address: 'Denver, CO',
    value: 125000,
    stage: 'Proposal Sent',
    probability: 60
  },
  {
    id: 'opp-4',
    title: 'Aspen Ridge Modern Cabin',
    client: 'Vance Capital Partners',
    address: 'Aspen, CO',
    value: 340000,
    stage: 'Estimating',
    probability: 50
  },
  {
    id: 'opp-5',
    title: 'Cherry Creek Master Bath Remodel',
    client: 'Marcus Davis',
    address: 'Denver, CO',
    value: 95000,
    stage: 'Won',
    probability: 100
  }
];

export const OpportunitiesView: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Estimating' | 'Proposal Sent' | 'Won'>('All');
  
  const [isNewOppModalOpen, setIsNewOppModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newStage, setNewStage] = useState<Opportunity['stage']>('Estimating');

  const totalPipeline = opportunities
    .filter(o => o.stage !== 'Won')
    .reduce((sum, o) => sum + o.value, 0);

  const wonValue = opportunities
    .filter(o => o.stage === 'Won')
    .reduce((sum, o) => sum + o.value, 0);

  const activeCount = opportunities.filter(o => o.stage !== 'Won').length;

  const filteredDeals = opportunities.filter(o => {
    if (selectedFilter === 'All') return true;
    return o.stage === selectedFilter;
  });

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: newTitle,
      client: newClient || 'Private Client',
      address: newAddress || 'Denver, CO',
      value: Number(newValue) || 500000,
      stage: newStage,
      probability: newStage === 'Won' ? 100 : newStage === 'Proposal Sent' ? 60 : 30
    };

    setOpportunities(prev => [newOpp, ...prev]);
    setIsNewOppModalOpen(false);
    setNewTitle('');
    setNewClient('');
    setNewAddress('');
    setNewValue('');
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Header & Primary Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Deal Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Active leads & contract negotiations
          </p>
        </div>

        <button
          onClick={() => setIsNewOppModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Deal</span>
        </button>
      </div>

      {/* 2. Top 4 KPI Metrics */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Pipeline</span>
          <span className="text-xs sm:text-sm font-bold text-white mt-0.5">${(totalPipeline / 1000000).toFixed(2)}M</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Won</span>
          <span className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">${(wonValue / 1000).toFixed(0)}K</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active</span>
          <span className="text-xs sm:text-sm font-bold text-white mt-0.5">{activeCount} Deals</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Win Rate</span>
          <span className="text-xs sm:text-sm font-bold text-blue-400 mt-0.5">20%</span>
        </div>
      </div>

      {/* 3. Modern Frameless Stage Filter Pills (No heavy container box) */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {(['All', 'Estimating', 'Proposal Sent', 'Won'] as const).map((f) => {
          const isActive = selectedFilter === f;
          return (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#2563EB] text-white font-bold shadow-md shadow-blue-500/25'
                  : 'bg-[#0B111E] text-slate-400 hover:text-white hover:bg-[#121B2E] border border-[#142036]'
              }`}
            >
              {f === 'Proposal Sent' ? 'Proposal' : f}
            </button>
          );
        })}
      </div>

      {/* 4. Clutter-Free Single-Layer Deal Cards (Zero Nested Accordion Box Inception) */}
      <div className="flex flex-col gap-2.5">
        {filteredDeals.map((deal) => {
          const dealValM = (deal.value / 1000000).toFixed(2);
          const dealValK = (deal.value / 1000).toFixed(0);
          const isWon = deal.stage === 'Won';

          return (
            <div
              key={deal.id}
              className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] hover:border-blue-500/40 transition-all cursor-pointer flex flex-col gap-2 shadow-sm group active:scale-[0.99]"
            >
              {/* Row 1: Title + Value */}
              <div className="flex items-center justify-between gap-2 min-w-0">
                <h3 className="text-sm font-bold text-white truncate group-hover:text-[#3875F6] transition-colors leading-tight min-w-0">
                  {deal.title}
                </h3>
                <span className={`text-sm font-extrabold flex-shrink-0 ${isWon ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {deal.value >= 1000000 ? `$${dealValM}M` : `$${dealValK}K`}
                </span>
              </div>

              {/* Row 2: Client & Location */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="truncate">{deal.client} • {deal.address}</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  isWon 
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}>
                  {deal.stage} ({deal.probability}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Create Deal Modal */}
      {isNewOppModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateOpportunity}
            className="w-full max-w-sm bg-[#0D1424] border border-[#1A263E] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-fade-in"
          >
            <div className="flex items-center justify-between border-b border-[#162033] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-400" />
                Add New Deal
              </h3>
              <button
                type="button"
                onClick={() => setIsNewOppModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Project Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Oakridge Luxury Custom Build"
                  required
                  className="w-full h-11 bg-[#090E1A] border border-[#141F33] rounded-2xl px-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Client Name</label>
                <input
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  placeholder="e.g. Anderson Family Trust"
                  className="w-full h-11 bg-[#090E1A] border border-[#141F33] rounded-2xl px-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Estimated Value ($)</label>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="e.g. 1500000"
                  className="w-full h-11 bg-[#090E1A] border border-[#141F33] rounded-2xl px-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Stage</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value as Opportunity['stage'])}
                  className="w-full h-11 bg-[#090E1A] border border-[#141F33] rounded-2xl px-3.5 text-xs text-white outline-none focus:border-blue-500"
                >
                  <option value="Estimating">Estimating</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Under Contract">Under Contract</option>
                  <option value="Won">Won</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#162033]">
              <button
                type="button"
                onClick={() => setIsNewOppModalOpen(false)}
                className="h-11 px-4 rounded-2xl border border-[#1E2C48] text-slate-300 text-xs font-semibold hover:bg-[#141F33]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-11 px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md active:scale-95"
              >
                Create Deal
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
