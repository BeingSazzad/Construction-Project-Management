import React, { useState, useMemo } from 'react';
import { 
  Plus, DollarSign, MapPin, TrendingUp, CheckCircle2, 
  ChevronDown, ChevronUp, User, Search, Briefcase, Trophy, 
  ArrowUpDown, Filter, ChevronRight, X, Layers, Edit3
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
  notes?: string;
}

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Main Suite Remodel',
    client: 'Claire & Randy',
    address: '733 32nd Ave, St Petersburg FL, 33704',
    value: 55000,
    stage: 'Estimating',
    type: 'Remodel',
    probability: 10,
    leadSource: 'Referral',
    assignedTo: 'Alex Chen',
    startDate: '2026-09-15',
    followUpDate: '2026-08-30',
    description: 'Complete master bathroom & suite expansion with custom vanity.',
    notes: 'Client requested European marble and heated tile flooring.'
  },
  {
    id: 'opp-2',
    title: 'Greenwood Estate New Build',
    client: 'Anderson Family Trust',
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
    id: 'opp-3',
    title: 'Maple Ridge Custom Home',
    client: 'Sarah Johnson',
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
    id: 'opp-4',
    title: 'Downtown Kitchen Remodel',
    client: 'Tom & Lisa Chen',
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
    id: 'opp-5',
    title: 'Aspen Ridge Modern Cabin',
    client: 'Vance Capital Partners',
    address: '42 Red Mountain Rd, Aspen, CO',
    value: 340000,
    stage: 'Negotiation',
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
    id: 'opp-6',
    title: 'Cherry Creek Master Bath Remodel',
    client: 'Marcus Davis',
    address: '250 Columbine St, Denver, CO',
    value: 95000,
    stage: 'Won',
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

  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    'Estimating': true,
    'Proposal Sent': false,
    'Negotiation': false,
    'Won': false,
    'New Lead': false,
    'Contacted': false,
    'Discovery': false,
    'Plans Received': false,
    'Lost': false,
    'On Hold': false
  });

  const toggleStage = (stageName: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageName]: !prev[stageName]
    }));
  };

  const totalPipeline = opportunities
    .filter(o => o.stage !== 'Won' && o.stage !== 'Lost')
    .reduce((sum, o) => sum + o.value, 0);

  const wonValue = opportunities
    .filter(o => o.stage === 'Won')
    .reduce((sum, o) => sum + o.value, 0);

  const activeCount = opportunities.filter(o => o.stage !== 'Won' && o.stage !== 'Lost').length;
  const wonCount = opportunities.filter(o => o.stage === 'Won').length;
  const conversionRate = opportunities.length > 0 ? Math.round((wonCount / opportunities.length) * 100) : 17;

  // Filter Logic
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(item => {
      const matchesSearch = searchQuery.trim() === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStage = selectedStageFilter === 'All' || item.stage === selectedStageFilter;

      return matchesSearch && matchesStage;
    });
  }, [opportunities, searchQuery, selectedStageFilter]);

  const handleCreate = (data: any) => {
    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      ...data
    };
    setOpportunities(prev => [newOpp, ...prev]);
    setExpandedStages(prev => ({ ...prev, [data.stage]: true }));
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
    setExpandedStages(prev => ({ ...prev, [newStage]: true }));
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
      />
    );
  }

  // Get color dot for each stage
  const getStageDotColor = (stage: string) => {
    switch (stage) {
      case 'Won':
        return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
      case 'Estimating':
      case 'Proposal Sent':
      case 'Negotiation':
        return 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]';
      case 'Contacted':
      case 'Discovery':
        return 'bg-cyan-400';
      case 'Plans Received':
        return 'bg-purple-400';
      case 'Lost':
        return 'bg-rose-400';
      default:
        return 'bg-slate-400';
    }
  };

  // Pipeline Overview Filter Pills definition (including All)
  const FILTER_PILLS = [
    { label: 'All', key: 'All' },
    { label: 'New Lead', key: 'New Lead' },
    { label: 'Contacted', key: 'Contacted' },
    { label: 'Discovery', key: 'Discovery' },
    { label: 'Plans Rec.', key: 'Plans Received' },
    { label: 'Estimating', key: 'Estimating' },
    { label: 'Proposal', key: 'Proposal Sent' },
    { label: 'Negotiation', key: 'Negotiation' },
    { label: 'Won', key: 'Won' },
  ];

  return (
    <div className="w-full flex flex-col gap-3.5 px-4 sm:px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
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
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
            Track leads from first contact to won project
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

      {/* ─── 2. TWO HERO KPI METRIC CARDS (Design System Consistent) ─── */}
      <div className="grid grid-cols-2 gap-2.5">
        
        {/* Card 1: Pipeline Value */}
        <div className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Top Row: Icon + Mini Sparkline */}
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

          {/* Bottom Area: Label + Big Value + Context */}
          <div className="mt-2.5">
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">
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
          {/* Top Row: Icon + Mini Sparkline */}
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

          {/* Bottom Area: Label + Big Value + Context */}
          <div className="mt-2.5">
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">
              Won Value
            </span>
            <div className="text-lg font-black text-white mt-0.5 tracking-tight">
              ${wonValue.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              <strong className="text-emerald-400 font-bold">{conversionRate}%</strong> conversion rate
            </div>
          </div>
        </div>

      </div>

      {/* ─── 3. SEARCH & STAGE FILTER CONTROL BAR ─── */}
      <div className="flex items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities..."
            className="w-full h-9 bg-[#0A111F] border border-[#142036] rounded-xl pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#2563EB] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Stage Filter Dropdown */}
        <div className="relative flex-shrink-0">
          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="h-9 bg-[#0A111F] border border-[#142036] text-slate-300 text-xs font-semibold rounded-xl pl-3 pr-7 appearance-none cursor-pointer focus:border-[#2563EB] outline-none"
          >
            <option value="All">All Stages</option>
            {OPPORTUNITY_STAGES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* ─── 5. UNIFIED GROUP ACCORDION CARD ─── */}
      <div className="rounded-2xl bg-[#0A111F] border border-[#142036] shadow-sm overflow-hidden divide-y divide-[#142036]">
        {OPPORTUNITY_STAGES.map((stageName) => {
          const stageDeals = filteredOpportunities.filter(o => o.stage === stageName);
          const stageTotalValue = stageDeals.reduce((sum, o) => sum + o.value, 0);
          const isExpanded = !!expandedStages[stageName];

          // If filtering by specific stage and this isn't it, hide it
          if (selectedStageFilter !== 'All' && selectedStageFilter !== stageName) {
            return null;
          }

          return (
            <div key={stageName} className="transition-colors">
              
              {/* Accordion Row Header */}
              <button
                type="button"
                onClick={() => toggleStage(stageName)}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#0E172B] transition-colors cursor-pointer text-left select-none"
              >
                {/* Left: Dot + Title + Count Badge */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getStageDotColor(stageName)}`} />
                  <span className="text-xs font-bold text-white truncate">{stageName}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    stageDeals.length > 0
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25'
                      : 'bg-slate-800/80 text-slate-500 border border-slate-700/50'
                  }`}>
                    {stageDeals.length}
                  </span>
                </div>

                {/* Right: Total Value + Chevron */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className={`text-xs font-bold ${stageDeals.length > 0 ? 'text-white' : 'text-slate-500'}`}>
                    ${stageTotalValue.toLocaleString()}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </button>

              {/* Expanded Stage Deal Items */}
              {isExpanded && stageDeals.length > 0 && (
                <div className="px-3 pb-3 pt-1 flex flex-col gap-2 bg-[#070D1A]/60 border-t border-[#142036]">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3.5 rounded-xl bg-[#0A111F] border border-[#142036] hover:border-[#1E2F52] flex flex-col gap-2.5 shadow-sm transition-all"
                    >
                      {/* Header: Title + Type Chip + Interactive Stage Dropdown */}
                      <div className="flex items-start justify-between gap-2">
                        <div 
                          className="min-w-0 flex-1 cursor-pointer group"
                          onClick={() => setSelectedDeal(deal)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                              {deal.type || 'Custom Home'}
                            </span>
                          </div>
                          <h3 className="text-xs font-bold text-white leading-tight group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                            <span>{deal.title}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                            <User className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            <span className="truncate">{deal.client}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-600 flex-shrink-0" />
                            <span className="truncate">{deal.address}</span>
                          </div>
                        </div>

                        {/* Interactive Stage Picker */}
                        <div className="relative flex-shrink-0">
                          <select
                            value={deal.stage}
                            onChange={(e) => handleUpdateStage(deal.id, e.target.value as any)}
                            className="text-[10px] font-bold bg-[#070D1A] border border-[#142036] text-blue-400 rounded-lg px-2.5 py-1 pr-5 appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
                          >
                            {OPPORTUNITY_STAGES.map(s => (
                              <option key={s} value={s} className="bg-[#0A111F] text-white">
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-2.5 h-2.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Footer: Value + Win Probability */}
                      <div 
                        className="flex items-center justify-between pt-2 border-t border-[#142036]/60 text-xs cursor-pointer"
                        onClick={() => setSelectedDeal(deal)}
                      >
                        <span className="font-black text-white text-xs sm:text-sm">
                          ${deal.value.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold text-slate-400">
                            {deal.probability}% prob
                          </span>
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
