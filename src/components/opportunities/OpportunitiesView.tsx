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
    client: 'David Miller',
    clientEmail: 'dmiller@coloradolaw.net',
    address: '320 Adams St, Denver, CO',
    value: 75000,
    stage: 'Contacted',
    type: 'Remodel',
    probability: 40,
    leadSource: 'Referral',
    assignedTo: 'Alex Chen',
    startDate: '2026-09-15',
    followUpDate: '2026-08-23',
    description: 'Spa retreat with freestanding stone soaking tub.',
    notes: 'Client travel schedule delays site survey.'
  },
  {
    id: 'opp-6',
    title: 'Highland Park Ground-Up Duplex',
    client: 'Summit Urban Living LLC',
    clientEmail: 'invest@summiturban.com',
    address: '3210 Tejon St, Denver, CO',
    value: 1650000,
    stage: 'Contract Signed',
    type: 'Residential Development',
    probability: 100,
    leadSource: 'Subcontractor',
    assignedTo: 'Alex Chen',
    startDate: '2026-09-01',
    followUpDate: '2026-08-20',
    description: 'Contemporary two-unit townhome with rooftop decks.',
    notes: 'Deposit wired. Ready to transition into active project!'
  }
];

export interface OpportunitiesViewProps {
  opportunities?: Opportunity[];
  onUpdateOpportunities?: (opps: Opportunity[]) => void;
  onConvertToProject?: (deal: Opportunity) => void;
  onBack?: () => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities: propOpportunities,
  onUpdateOpportunities,
  onConvertToProject,
  onBack,
}) => {
  const [internalOpportunities, setInternalOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const opportunities = propOpportunities || internalOpportunities;

  const setOpportunities = (updater: Opportunity[] | ((prev: Opportunity[]) => Opportunity[])) => {
    if (typeof updater === 'function') {
      const next = updater(opportunities);
      if (onUpdateOpportunities) onUpdateOpportunities(next);
      else setInternalOpportunities(next);
    } else {
      if (onUpdateOpportunities) onUpdateOpportunities(updater);
      else setInternalOpportunities(updater);
    }
  };

  const [showCreate, setShowCreate] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Opportunity | null>(null);
  const [editingDeal, setEditingDeal] = useState<Opportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'value-desc' | 'value-asc' | 'prob-desc' | 'name-asc'>('value-desc');
  const [isStageMenuOpen, setIsStageMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  // Top Metrics
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
        onConvertToProject={onConvertToProject}
      />
    );
  }

  // Stage color badge styling (Apple Light Theme)
  const getStageBadgeClasses = (stage: string) => {
    switch (stage) {
      case 'Won':
      case 'Contract Signed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Estimating':
      case 'Proposal Sent':
      case 'Negotiation':
        return 'bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/20';
      case 'Contacted':
      case 'Discovery':
        return 'bg-sky-50 text-sky-700 border border-sky-200';
      case 'Plans Received':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Lost':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-[#F2F2F7] text-[#4B5565] border border-[#DDE1E7]';
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
      
      {/* ─── 1. TOP HEADER & PRIMARY ACTION ─── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF] shadow-xs">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h1 className="text-base font-bold text-[#171A1F] tracking-tight">
              Opportunities
            </h1>
          </div>
          <p className="text-xs text-[#68707C] mt-0.5 font-medium">
            Pre-construction pipeline & revenue
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="btn-action btn-primary"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New</span>
        </button>
      </div>

      {/* ─── 2. TWO HERO KPI METRIC CARDS ─── */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Card 1: Pipeline Value */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF]">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div className="w-12 h-6 opacity-90">
              <svg viewBox="0 0 60 30" className="w-full h-full stroke-[#1677FF] fill-none" strokeWidth="2.5">
                <path d="M0 24 Q 15 26, 25 15 T 45 10 T 60 2" />
                <circle cx="60" cy="2" r="2.5" className="fill-[#1677FF]" />
              </svg>
            </div>
          </div>

          <div className="mt-2.5">
            <span className="text-xs font-semibold text-[#68707C] block leading-tight">
              Pipeline Value
            </span>
            <div className="text-lg font-black text-[#171A1F] mt-0.5 tracking-tight">
              ${(totalPipeline / 1000000).toFixed(2)}M
            </div>
            <div className="text-[11px] text-[#68707C] font-medium mt-0.5">
              {activeCount} active deals
            </div>
          </div>
        </div>

        {/* Card 2: Won Value */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div className="w-12 h-6 opacity-90">
              <svg viewBox="0 0 60 30" className="w-full h-full stroke-emerald-500 fill-none" strokeWidth="2.5">
                <path d="M0 26 Q 15 28, 30 18 T 45 12 T 60 4" />
                <circle cx="60" cy="4" r="2.5" className="fill-emerald-500" />
              </svg>
            </div>
          </div>

          <div className="mt-2.5">
            <span className="text-xs font-semibold text-[#68707C] block leading-tight">
              Won Value
            </span>
            <div className="text-lg font-black text-[#171A1F] mt-0.5 tracking-tight">
              ${wonValue.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#68707C] font-medium mt-0.5">
              <strong className="text-emerald-600 font-bold">{conversionRate}%</strong> win rate
            </div>
          </div>
        </div>

      </div>

      {/* ─── 3. SEARCH BAR ─── */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#9DA5B1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, client, or address..."
          className="w-full h-9 bg-white border border-[#DDE1E7] rounded-xl pl-8 pr-8 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] transition-colors font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="w-4.5 h-4.5 rounded-full bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ─── 4. CLEAN HEADER & CONTROLS ROW ─── */}
      <div className="flex items-center justify-between pt-1 px-0.5">
        <h3 className="text-xs font-bold text-[#171A1F] tracking-tight">Pipeline</h3>

        <div className="flex items-center gap-1.5">
          {/* Custom Stage Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsStageMenuOpen(!isStageMenuOpen);
                setIsSortMenuOpen(false);
              }}
              className={`h-8 px-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isStageMenuOpen || selectedStageFilter !== 'All'
                  ? 'bg-[#EAF3FF] border-[#1677FF]/30 text-[#1677FF]'
                  : 'bg-white border-[#DDE1E7] hover:border-[#9DA5B1] text-[#4B5565]'
              }`}
            >
              <span>{selectedStageFilter === 'All' ? 'All Stages' : selectedStageFilter}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isStageMenuOpen ? 'rotate-180 text-[#1677FF]' : 'text-[#68707C]'}`} />
            </button>

            {isStageMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsStageMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-white border border-[#DDE1E7] p-1.5 shadow-xl z-50 flex flex-col gap-0.5 animate-fade-in text-[#171A1F]">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#68707C] uppercase tracking-wider">
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
                        ? 'bg-[#EAF3FF] text-[#1677FF] font-bold'
                        : 'text-[#4B5565] hover:bg-[#F2F2F7] hover:text-[#171A1F]'
                    }`}
                  >
                    <span>All Stages</span>
                    <span className="text-[10px] text-[#68707C] font-normal">({opportunities.length})</span>
                  </button>

                  <div className="h-px bg-[#EAEDF1] my-1" />

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
                            ? 'bg-[#EAF3FF] text-[#1677FF] font-bold'
                            : 'text-[#4B5565] hover:bg-[#F2F2F7] hover:text-[#171A1F]'
                        }`}
                      >
                        <span className="truncate">{s}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            count > 0 ? 'bg-[#EAF3FF] text-[#1677FF] font-bold' : 'text-[#9DA5B1]'
                          }`}>
                            {count}
                          </span>
                          {isSelected && <Check className="w-3 h-3 text-[#1677FF] stroke-[2.5]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Custom Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSortMenuOpen(!isSortMenuOpen);
                setIsStageMenuOpen(false);
              }}
              className={`h-8 px-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSortMenuOpen
                  ? 'bg-[#EAF3FF] border-[#1677FF]/30 text-[#1677FF]'
                  : 'bg-white border-[#DDE1E7] hover:border-[#9DA5B1] text-[#4B5565]'
              }`}
            >
              <ArrowUpDown className="w-3 h-3 text-[#68707C]" />
              <span>
                {sortBy === 'value-desc' && 'Highest Value'}
                {sortBy === 'value-asc' && 'Lowest Value'}
                {sortBy === 'prob-desc' && 'Win Rate'}
                {sortBy === 'name-asc' && 'A-Z Name'}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isSortMenuOpen ? 'rotate-180 text-[#1677FF]' : 'text-[#68707C]'}`} />
            </button>

            {isSortMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsSortMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl bg-white border border-[#DDE1E7] p-1.5 shadow-xl z-50 flex flex-col gap-0.5 animate-fade-in text-[#171A1F]">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#68707C] uppercase tracking-wider">
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
                            ? 'bg-[#EAF3FF] text-[#1677FF] font-bold'
                            : 'text-[#4B5565] hover:bg-[#F2F2F7] hover:text-[#171A1F]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#1677FF] stroke-[2.5]" />}
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
        <div className="p-8 rounded-2xl bg-white border border-[#DDE1E7] flex flex-col items-center justify-center text-center gap-3 text-[#68707C] my-2 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#171A1F]">No opportunities found</h4>
            <p className="text-xs text-[#68707C] mt-1 max-w-[220px]">
              {selectedStageFilter !== 'All' 
                ? `There are currently no opportunities in "${selectedStageFilter}".`
                : 'No opportunities match your search criteria.'}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-1 btn-action btn-primary"
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
              className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 hover:shadow-sm transition-all cursor-pointer flex flex-col gap-2.5 shadow-xs active:scale-[0.99] group"
            >
              {/* Header Row: Title & Stage Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors truncate">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-[#68707C] font-medium truncate mt-0.5">
                    {deal.client} <span className="text-[#DDE1E7]">·</span> <span className="text-[#68707C]">{deal.type || 'Custom Home'}</span>
                  </p>
                </div>

                <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold flex-shrink-0 ${getStageBadgeClasses(deal.stage)}`}>
                  {deal.stage}
                </span>
              </div>

              {/* Bottom Row: Value & Probability */}
              <div className="flex items-center justify-between pt-2 border-t border-[#EAEDF1] text-xs">
                <span className="text-sm font-black text-[#171A1F]">
                  ${deal.value.toLocaleString()}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#68707C]">
                    {deal.probability}% win
                  </span>
                  <div className="w-12 h-1 bg-[#F2F2F7] rounded-full overflow-hidden border border-[#E2E8F0]">
                    <div
                      className={`h-full rounded-full ${
                        deal.probability >= 70 ? 'bg-emerald-500' : 'bg-[#1677FF]'
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
