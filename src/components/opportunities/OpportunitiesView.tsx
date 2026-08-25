import React, { useState } from 'react';
import { 
  Plus, Search, ChevronDown, ChevronRight, DollarSign, 
  Building2, MapPin, Sparkles, TrendingUp, Filter, CheckCircle2, 
  Clock, X 
} from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  client: string;
  address: string;
  value: number;
  stage: 'New Lead' | 'Contacted' | 'Discovery' | 'Plans Received' | 'Estimating' | 'Proposal Sent' | 'Under Contract' | 'Won';
  probability: number;
}

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Greenwood Estate New Build',
    client: 'Anderson Family Trust',
    address: '5 Willow Lane, Greenwood Village, CO',
    value: 2400000,
    stage: 'Estimating',
    probability: 25
  },
  {
    id: 'opp-2',
    title: 'Maple Ridge Custom Home',
    client: 'Sarah Johnson',
    address: '142 Oakwood Drive, Boulder, CO',
    value: 850000,
    stage: 'Estimating',
    probability: 40
  },
  {
    id: 'opp-3',
    title: 'Downtown Kitchen Remodel',
    client: 'Tom & Lisa Chen',
    address: '88 Pine Street, Denver, CO',
    value: 125000,
    stage: 'Proposal Sent',
    probability: 60
  },
  {
    id: 'opp-4',
    title: 'Aspen Ridge Modern Cabin',
    client: 'Vance Capital Partners',
    address: '120 Mountain Pass, Aspen, CO',
    value: 340000,
    stage: 'Estimating',
    probability: 50
  },
  {
    id: 'opp-5',
    title: 'Cherry Creek Master Bath Remodel',
    client: 'Marcus Davis',
    address: '744 Adams St, Denver, CO',
    value: 95000,
    stage: 'Won',
    probability: 100
  }
];

export const OpportunitiesView: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    'New Lead': false,
    'Contacted': false,
    'Discovery': false,
    'Plans Received': false,
    'Estimating': true,
    'Proposal Sent': true,
    'Under Contract': false,
    'Won': true
  });

  const [isNewOppModalOpen, setIsNewOppModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newStage, setNewStage] = useState<Opportunity['stage']>('Estimating');

  const STAGES: { name: Opportunity['stage']; color: string }[] = [
    { name: 'New Lead', color: 'bg-slate-500' },
    { name: 'Contacted', color: 'bg-blue-400' },
    { name: 'Discovery', color: 'bg-blue-400' },
    { name: 'Plans Received', color: 'bg-teal-400' },
    { name: 'Estimating', color: 'bg-teal-400' },
    { name: 'Proposal Sent', color: 'bg-blue-500' },
    { name: 'Under Contract', color: 'bg-purple-400' },
    { name: 'Won', color: 'bg-emerald-400' }
  ];

  const totalPipeline = opportunities
    .filter(o => o.stage !== 'Won')
    .reduce((sum, o) => sum + o.value, 0);

  const wonValue = opportunities
    .filter(o => o.stage === 'Won')
    .reduce((sum, o) => sum + o.value, 0);

  const activeCount = opportunities.filter(o => o.stage !== 'Won').length;

  const toggleStage = (stageName: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageName]: !prev[stageName]
    }));
  };

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
    setExpandedStages(prev => ({ ...prev, [newStage]: true }));
    setIsNewOppModalOpen(false);
    setNewTitle('');
    setNewClient('');
    setNewAddress('');
    setNewValue('');
  };

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Deal Pipeline</h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Track leads from first contact to won project
          </p>
        </div>

        <button
          onClick={() => setIsNewOppModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Deal</span>
        </button>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-[#0B101D] p-3 rounded-2xl border border-[#141C2E] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Pipeline Value</span>
          <div className="text-sm font-bold text-white mt-1">
            ${totalPipeline.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#0B101D] p-3 rounded-2xl border border-[#141C2E] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Won Value</span>
          <div className="text-sm font-bold text-emerald-400 mt-1">
            ${wonValue.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#0B101D] p-3 rounded-2xl border border-[#141C2E] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Deals</span>
          <div className="text-sm font-bold text-white mt-1">
            {activeCount}
          </div>
        </div>

        <div className="bg-[#0B101D] p-3 rounded-2xl border border-[#141C2E] shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Win Rate</span>
          <div className="text-sm font-bold text-blue-400 mt-1">
            20%
          </div>
        </div>
      </div>

      {/* Pipeline Stages Accordion List */}
      <div className="flex flex-col gap-2">
        {STAGES.map((stage) => {
          const stageOpps = opportunities.filter(o => o.stage === stage.name);
          const stageTotal = stageOpps.reduce((sum, o) => sum + o.value, 0);
          const isExpanded = expandedStages[stage.name];

          return (
            <div 
              key={stage.name}
              className="bg-[#0B101D] border border-[#141C2E] rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Stage Header Row */}
              <button
                onClick={() => toggleStage(stage.name)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-[#0E1526] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <span className="text-xs font-semibold text-slate-200">{stage.name}</span>
                  <span className="text-[10px] font-medium text-slate-500">
                    ${stageTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {stageOpps.length}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Stage Content */}
              {isExpanded && (
                <div className="px-2.5 pb-2.5 pt-0.5 border-t border-[#121A2B] flex flex-col gap-2 bg-[#080D18]">
                  {stageOpps.length === 0 ? (
                    <div className="py-3 text-center text-slate-500 text-xs italic">
                      No opportunities
                    </div>
                  ) : (
                    stageOpps.map((opp) => (
                      <div 
                        key={opp.id}
                        className="bg-[#0B101D] border border-[#162035] rounded-xl p-3 flex flex-col gap-1.5 hover:border-blue-500/40 transition-colors shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xs font-bold text-white truncate">{opp.title}</h3>
                            <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                              👤 {opp.client}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5 truncate">
                              <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                              <span className="truncate">{opp.address}</span>
                            </div>
                          </div>

                          <span className="text-[9px] font-semibold bg-[#121B2D] text-slate-300 px-2 py-0.5 rounded border border-[#1A263D]">
                            {opp.stage}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-[#121A2B] text-xs">
                          <span className="font-bold text-white">
                            ${opp.value.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {opp.probability}% prob
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Opportunity Modal */}
      {isNewOppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleCreateOpportunity} className="w-full max-w-sm bg-[#0C121E] border border-[#1A263B] rounded-3xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#162033] pb-2.5">
              <h3 className="text-sm font-bold text-white">Create New Deal</h3>
              <button type="button" onClick={() => setIsNewOppModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Deal / Project Name *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Greenwood Estate New Build"
                required
                className="w-full bg-[#080D18] border border-[#1A263D] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Client Name</label>
                <input
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  placeholder="Anderson Trust"
                  className="w-full bg-[#080D18] border border-[#1A263D] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Estimated Value ($)</label>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="2400000"
                  className="w-full bg-[#080D18] border border-[#1A263D] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Property Location</label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="5 Willow Lane, Denver, CO"
                className="w-full bg-[#080D18] border border-[#1A263D] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Pipeline Stage</label>
              <select
                value={newStage}
                onChange={(e) => setNewStage(e.target.value as any)}
                className="w-full bg-[#080D18] border border-[#1A263D] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-400 cursor-pointer"
              >
                {STAGES.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#162033]">
              <button
                type="button"
                onClick={() => setIsNewOppModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-[#121B2D] text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold shadow-sm"
              >
                Save Deal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
