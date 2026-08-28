import React, { useState, useMemo } from 'react';
import { 
  Plus, DollarSign, MapPin, TrendingUp, CheckCircle2, 
  ChevronDown, ChevronUp, User, Search, Briefcase, Trophy, 
  ArrowUpDown, Filter, ChevronRight, X, Layers, Edit3, Check
} from 'lucide-react';
import { CreateDealView, OPPORTUNITY_STAGES, PROJECT_TYPES } from './CreateDealView';
import { EditDealModal } from './EditDealModal';
import { OpportunityDetailView } from './OpportunityDetailView';

export interface Opportunity {
  id: string;
  title: string;
  client: string;
  clientEmail?: string;
  address: string;
  value: number;
  stage: typeof OPPORTUNITY_STAGES[number];
  type: typeof PROJECT_TYPES[number] | string;
  probability: number;
  leadSource?: string;
  assignedTo?: string;
  startDate?: string;
  followUpDate?: string;
  description?: string;
  notes: string;
}

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Greenwood Estate New Build',
    client: 'Anderson Family Trust',
    clientEmail: 'contact@andersontrust.org',
    address: '5 Willow Lane, Greenwood Village, CO',
    value: 2400000,
    stage: 'Estimating',
    type: 'New Construction',
    probability: 25,
    leadSource: 'Architect Partner',
    assignedTo: 'Jennifer Lee',
    startDate: '2027-03-01',
    followUpDate: '2026-08-24',
    description: 'Custom modern luxury residence.',
    notes: 'Luxury estate, 6,500 SF, 5 bed/6 bath, pool, detached garage.'
  },
  {
    id: 'opp-2',
    title: 'Maple Ridge Custom Home',
    client: 'Sarah Johnson',
    clientEmail: 'sarah.j@ridgecapital.com',
    address: '142 Oakwood Drive, Boulder, CO',
    value: 850000,
    stage: 'Estimating',
    type: 'Custom Home',
    probability: 65,
    leadSource: 'Website',
    assignedTo: 'Alex Chen',
    startDate: '2026-10-01',
    followUpDate: '2026-09-02',
    description: 'Modern farmhouse custom build on 2 acre lot.',
    notes: 'Budget pre-approved with First National Bank.'
  },
  {
    id: 'opp-3',
    title: 'Downtown Kitchen Remodel',
    client: 'Tom & Lisa Chen',
    clientEmail: 'tchen@denvertech.co',
    address: '1840 Blake St, Denver, CO',
    value: 125000,
    stage: 'Proposal Sent',
    type: 'Remodel',
    probability: 60,
    leadSource: 'Repeat Client',
    assignedTo: 'Markus Weber',
    startDate: '2026-11-01',
    followUpDate: '2026-08-28',
    description: 'High-rise luxury kitchen overhaul with Sub-Zero appliances.',
    notes: 'HOA restrictions on construction work hours.'
  },
  {
    id: 'opp-4',
    title: 'Aspen Ridge Modern Cabin',
    client: 'Vance Capital Partners',
    clientEmail: 'mvance@vancecap.com',
    address: '42 Red Mountain Rd, Aspen, CO',
    value: 340000,
    stage: 'Proposal Sent',
    type: 'Design-Build',
    probability: 80,
    leadSource: 'Architect Partner',
    assignedTo: 'Jennifer Lee',
    startDate: '2026-12-01',
    followUpDate: '2026-08-29',
    description: 'Ski lodge modern extension with heated driveway.',
    notes: 'Contract draft sent for legal review.'
  },
  {
    id: 'opp-5',
    title: 'Cherry Creek Master Bath Remodel',
    client: 'Marcus Davis',
    clientEmail: 'mdavis@coloradohealth.org',
    address: '250 Columbine St, Denver, CO',
    value: 95000,
    stage: 'Contract Signed',
    type: 'Remodel',
    probability: 100,
    leadSource: 'Referral',
    assignedTo: 'Alex Chen',
    startDate: '2026-09-01',
    followUpDate: '2026-08-25',
    description: 'Won project, mobilization next week.',
    notes: 'Deposit paid, permits submitted.'
  }
];

export const OpportunitiesView: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Opportunity | null>(null);
  const [editingDeal, setEditingDeal] = useState<Opportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'value-desc' | 'value-asc' | 'prob-desc' | 'name-asc'>('value-desc');
  const [isStageMenuOpen, setIsStageMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const totalPipeline = opportunities
    .filter(o => o.stage !== 'Contract Signed')
    .reduce((sum, o) => sum + o.value, 0);

  const wonValue = opportunities
    .filter(o => o.stage === 'Contract Signed')
    .reduce((sum, o) => sum + o.value, 0);

  const activeCount = opportunities.filter(o => o.stage !== 'Contract Signed').length;
  const wonCount = opportunities.filter(o => o.stage === 'Contract Signed').length;
  const conversionRate = opportunities.length > 0 ? Math.round((wonCount / opportunities.length) * 100) : 17;

  // Filter & Sort Logic
  const filteredOpportunities = useMemo(() => {
    let list = opportunities.filter(item => {
      // 1. Search Query
      const matchesSearch = searchQuery.trim() === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. Stage Filter
      if (selectedStageFilter !== 'All' && item.stage !== selectedStageFilter) {
        return false;
      }

      return true;
    });

    // 3. Sorting
    return list.sort((a, b) => {
      if (sortBy === 'value-desc') return b.value - a.value;
      if (sortBy === 'value-asc') return a.value - b.value;
      if (sortBy === 'prob-desc') return b.probability - a.probability;
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [opportunities, searchQuery, selectedStageFilter, sortBy]);

  const handleCreate = (data: any) => {
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      ...data
    };
    setOpportunities(prev => [newOpp, ...prev]);
    setShowCreate(false);
  };

  const handleSaveEditedDeal = (updated: Opportunity) => {
    setOpportunities(prev => prev.map(o => o.id === updated.id ? updated : o));
    if (selectedDeal?.id === updated.id) {
      setSelectedDeal(updated);
    }
    setEditingDeal(null);
  };

  const handleDeleteDeal = (dealId: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== dealId));
    if (selectedDeal?.id === dealId) {
      setSelectedDeal(null);
    }
    setEditingDeal(null);
  };

  const handleUpdateStage = (id: string, newStage: typeof OPPORTUNITY_STAGES[number]) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, stage: newStage } : o));
  };

  // Selected stage total value
  const activeTabTotalValue = useMemo(() => {
    return filteredOpportunities.reduce((sum, o) => sum + o.value, 0);
  }, [filteredOpportunities]);

  // Full-screen create opportunity view
  if (showCreate) {
    return <CreateDealView onBack={() => setShowCreate(false)} onCreate={handleCreate} />;
  }

  // Full-screen opportunity detail inspection view
  if (selectedDeal) {
    return (
      <OpportunityDetailView
        deal={selectedDeal}
        onBack={() => setSelectedDeal(null)}
        onUpdate={handleSaveEditedDeal}
        onDelete={handleDeleteDeal}
      />
    );
  }

  // Stage color badge styling
  const getStageBadgeClasses = (stage: string) => {
    switch (stage) {
      case 'Won':
      case 'Contract Signed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Estimating':
      case 'Proposal Sent':
      case 'Negotiation':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Contacted':
      case 'Discovery':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Plans Received':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Lost':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. TOP HEADER & PRIMARY ACTION ─── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-sm">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Opportunities
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
            Pre-construction pipeline & revenue forecasting
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Opportunity</span>
        </button>
      </div>

      {/* ─── 2. TWO HERO KPI METRIC CARDS ─── */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Card 1: Pipeline Value */}
        <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div className="w-12 h-6 opacity-80">
              <svg viewBox="0 0 60 30" className="w-full h-full stroke-blue-400 fill-none" strokeWidth="2.5">
                <path d="M0 24 Q 15 26, 25 15 T 45 10 T 60 2" />
                <circle cx="60" cy="2" r="2.5" className="fill-blue-400" />
              </svg>
            </div>
          </div>

          <div className="mt-2.5">
            <span className="text-[12px] font-medium text-slate-400 block leading-tight">
              Pipeline Value
            </span>
            <div className="text-lg font-black text-white mt-0.5 tracking-tight">
              ${(totalPipeline / 1000000).toFixed(2)}M
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              {activeCount} active opportunities
            </div>
          </div>
        </div>

        {/* Card 2: Won Value */}
        <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div className="w-12 h-6 opacity-80">
              <svg viewBox="0 0 60 30" className="w-full h-full stroke-emerald-400 fill-none" strokeWidth="2.5">
                <path d="M0 26 Q 15 28, 30 18 T 45 12 T 60 4" />
                <circle cx="60" cy="4" r="2.5" className="fill-emerald-400" />
              </svg>
            </div>
          </div>

          <div className="mt-2.5">
            <span className="text-[12px] font-medium text-slate-400 block leading-tight">
              Won Value
            </span>
            <div className="text-lg font-black text-white mt-0.5 tracking-tight">
              ${wonValue.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              <strong className="text-emerald-400 font-bold">{conversionRate}%</strong> win rate
            </div>
          </div>
        </div>

      </div>

      {/* ─── 3. SEARCH BAR ─── */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search opportunities by title, client, or address..."
          className="w-full h-9 bg-[#0A111F] border border-[#142036] rounded-xl pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#2563EB] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="w-4.5 h-4.5 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ─── 4. CLEAN HEADER & CONTROLS ROW ─── */}
      <div className="flex items-center justify-between pt-1 px-0.5">
        <h3 className="text-xs font-bold text-white tracking-tight">Opportunity Pipeline</h3>

        <div className="flex items-center gap-1.5">
          {/* Custom Stage Filter Dropdown (Figma & DOM Capturable) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsStageMenuOpen(!isStageMenuOpen);
                setIsSortMenuOpen(false);
              }}
              className={`h-8 px-2.5 rounded-xl border text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isStageMenuOpen || selectedStageFilter !== 'All'
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                  : 'bg-[#070D1A] border-[#142036] hover:border-slate-600 text-slate-300'
              }`}
            >
              <span>{selectedStageFilter === 'All' ? 'All Stages' : selectedStageFilter}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isStageMenuOpen ? 'rotate-180 text-blue-400' : ''}`} />
            </button>

            {isStageMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsStageMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-[#0A111F] border border-[#1E2D4A] p-1.5 shadow-2xl shadow-black/80 backdrop-blur-xl z-50 flex flex-col gap-0.5 animate-fade-in">
                  <div className="px-2 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    Filter by Stage
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStageFilter('All');
                      setIsStageMenuOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer text-left ${
                      selectedStageFilter === 'All'
                        ? 'bg-blue-600/20 text-blue-400 font-bold'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>All Stages</span>
                    <span className="text-[10px] text-slate-500 font-normal">({opportunities.length})</span>
                  </button>

                  <div className="h-px bg-[#142036] my-1" />

                  {OPPORTUNITY_STAGES.map(s => {
                    const count = opportunities.filter(o => o.stage === s).length;
                    const isSelected = selectedStageFilter === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSelectedStageFilter(s);
                          setIsStageMenuOpen(false);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-blue-600/20 text-blue-400 font-bold'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{s}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            count > 0 ? 'bg-blue-500/10 text-blue-400 font-bold' : 'text-slate-600'
                          }`}>
                            {count}
                          </span>
                          {isSelected && <Check className="w-3 h-3 text-blue-400 stroke-[2.5]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Custom Sort Dropdown (Figma & DOM Capturable) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSortMenuOpen(!isSortMenuOpen);
                setIsStageMenuOpen(false);
              }}
              className={`h-8 px-2.5 rounded-xl border text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSortMenuOpen
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                  : 'bg-[#070D1A] border-[#142036] hover:border-slate-600 text-slate-300'
              }`}
            >
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <span>
                {sortBy === 'value-desc' && 'Highest Value'}
                {sortBy === 'value-asc' && 'Lowest Value'}
                {sortBy === 'prob-desc' && 'Win Rate'}
                {sortBy === 'name-asc' && 'A-Z Name'}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isSortMenuOpen ? 'rotate-180 text-blue-400' : ''}`} />
            </button>

            {isSortMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsSortMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl bg-[#0A111F] border border-[#1E2D4A] p-1.5 shadow-2xl shadow-black/80 backdrop-blur-xl z-50 flex flex-col gap-0.5 animate-fade-in">
                  <div className="px-2 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    Sort Deals
                  </div>

                  {[
                    { id: 'value-desc', label: 'Highest Value' },
                    { id: 'value-asc', label: 'Lowest Value' },
                    { id: 'prob-desc', label: 'Win Rate' },
                    { id: 'name-asc', label: 'A-Z Name' }
                  ].map(opt => {
                    const isSelected = sortBy === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.id as any);
                          setIsSortMenuOpen(false);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer text-left ${
                          isSelected
                            ? 'bg-blue-600/20 text-blue-400 font-bold'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-blue-400 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── 5. OPPORTUNITY CARDS FEED ─── */}
      {filteredOpportunities.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col items-center justify-center text-center gap-3 text-slate-400 my-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">No opportunities found</h4>
            <p className="text-[12px] text-slate-400 mt-1 max-w-[220px]">
              {selectedStageFilter !== 'All' 
                ? `There are currently no opportunities in "${selectedStageFilter}".`
                : 'No opportunities match your search criteria.'}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-1 px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            + Create Opportunity
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredOpportunities.map((deal) => (
            <div
              key={deal.id}
              onClick={() => setSelectedDeal(deal)}
              className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer flex flex-col gap-2.5 shadow-sm active:scale-[0.99] group"
            >
              {/* Header Row: Title & Stage Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                    {deal.title}
                  </h3>
                  <p className="text-[12px] text-slate-400 font-medium truncate mt-0.5">
                    {deal.client} <span className="text-slate-600">·</span> <span className="text-slate-400">{deal.type || 'Custom Home'}</span>
                  </p>
                </div>

                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border flex-shrink-0 ${getStageBadgeClasses(deal.stage)}`}>
                  {deal.stage}
                </span>
              </div>

              {/* Bottom Row: Value & Probability */}
              <div className="flex items-center justify-between pt-2 border-t border-[#142036]/60 text-xs">
                <span className="text-sm font-black text-white">
                  ${deal.value.toLocaleString()}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400">
                    {deal.probability}% win
                  </span>
                  <div className="w-12 h-1 bg-[#050811] rounded-full overflow-hidden border border-[#142036]">
                    <div
                      className={`h-full rounded-full ${
                        deal.probability >= 70 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${deal.probability}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Edit Opportunity Modal */}
      {editingDeal && (
        <EditDealModal
          deal={editingDeal}
          isOpen={!!editingDeal}
          onClose={() => setEditingDeal(null)}
          onSave={handleSaveEditedDeal}
          onDelete={handleDeleteDeal}
        />
      )}

    </div>
  );
};
