import React, { useState } from 'react';
import { 
  Plus, DollarSign, MapPin, TrendingUp, CheckCircle2, ChevronRight
} from 'lucide-react';
import { CreateDealView } from './CreateDealView';

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

const STAGE_COLORS: Record<string, string> = {
  'Estimating':      'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Proposal Sent':   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Under Contract':  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Won':             'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

type FilterType = 'All' | 'Estimating' | 'Proposal Sent' | 'Won';

export const OpportunitiesView: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');
  const [showCreate, setShowCreate] = useState(false);

  const totalPipeline = opportunities
    .filter(o => o.stage !== 'Won')
    .reduce((sum, o) => sum + o.value, 0);

  const wonValue = opportunities
    .filter(o => o.stage === 'Won')
    .reduce((sum, o) => sum + o.value, 0);

  const activeCount = opportunities.filter(o => o.stage !== 'Won').length;
  const winRate = Math.round((opportunities.filter(o => o.stage === 'Won').length / opportunities.length) * 100);

  const filteredDeals = opportunities.filter(o => {
    if (selectedFilter === 'All') return true;
    return o.stage === selectedFilter;
  });

  const handleCreate = (data: { title: string; client: string; address: string; value: number; stage: string; type: string; notes: string }) => {
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: data.title,
      client: data.client || 'Private Client',
      address: data.address || 'Denver, CO',
      value: data.value,
      stage: (data.stage as Opportunity['stage']) || 'Estimating',
      probability: data.stage === 'Won' ? 100 : data.stage === 'Proposal Sent' ? 60 : 30,
    };
    setOpportunities(prev => [newOpp, ...prev]);
    setShowCreate(false);
  };

  // Full-page create view
  if (showCreate) {
    return <CreateDealView onBack={() => setShowCreate(false)} onCreate={handleCreate} />;
  }

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
          onClick={() => setShowCreate(true)}
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
          <span className="text-xs sm:text-sm font-bold text-white mt-0.5">{activeCount}</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Win %</span>
          <span className="text-xs sm:text-sm font-bold text-blue-400 mt-0.5">{winRate}%</span>
        </div>
      </div>

      {/* 3. Stage Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {(['All', 'Estimating', 'Proposal Sent', 'Won'] as FilterType[]).map((f) => {
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

      {/* 4. Deal Cards */}
      <div className="flex flex-col gap-2.5">
        {filteredDeals.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 text-slate-500">
            <TrendingUp className="w-8 h-8 opacity-30" />
            <p className="text-sm font-semibold">No deals in this stage</p>
            <p className="text-xs">Tap "New Deal" to add one</p>
          </div>
        ) : filteredDeals.map((deal) => (
          <div
            key={deal.id}
            className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-[#1E2C48] transition-all cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STAGE_COLORS[deal.stage]}`}>
                    {deal.stage}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white leading-snug mb-0.5 truncate">{deal.title}</h3>
                <p className="text-[11px] text-slate-400 font-medium">{deal.client}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                  <span className="text-[11px] text-slate-500 truncate">{deal.address}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-extrabold text-white">${(deal.value / 1000000) >= 1 ? `${(deal.value / 1000000).toFixed(2)}M` : `${(deal.value / 1000).toFixed(0)}K`}</p>
                <div className="flex items-center gap-1 justify-end mt-1.5">
                  {deal.stage === 'Won' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <TrendingUp className="w-3 h-3 text-blue-400" />
                  )}
                  <span className="text-[10px] font-semibold text-slate-400">{deal.probability}%</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors ml-auto mt-1" />
              </div>
            </div>

            {/* Probability bar */}
            <div className="mt-3 h-1 bg-[#0D1524] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  deal.stage === 'Won' ? 'bg-emerald-400' :
                  deal.probability >= 50 ? 'bg-blue-400' : 'bg-amber-400'
                }`}
                style={{ width: `${deal.probability}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
