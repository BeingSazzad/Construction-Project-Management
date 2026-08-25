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
    { name: 'Proposal Sent', color: 'bg-teal-400' },
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
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-24 font-sans text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-400 ring-4 ring-teal-400/20" />
            <h1 className="text-lg font-black text-white tracking-tight">Opportunities</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Track leads from first contact to won project
          </p>
        </div>

        <button
          onClick={() => setIsNewOppModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00D2B4] hover:bg-[#00baa0] text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Opportunity</span>
        </button>
      </div>

      {/* 4 Top KPI Cards (Matching Screenshot 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Pipeline Value</span>
          <div className="text-base sm:text-lg font-black text-white mt-1">
            ${totalPipeline.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Won Value</span>
          <div className="text-base sm:text-lg font-black text-[#00D2B4] mt-1">
            ${wonValue.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Active Opportunities</span>
          <div className="text-base sm:text-lg font-black text-white mt-1">
            {activeCount}
          </div>
        </div>

        <div className="bg-[#0C121F] p-3 rounded-2xl border border-[#182438] shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Conversion Rate</span>
          <div className="text-base sm:text-lg font-black text-white mt-1">
            20%
          </div>
        </div>
      </div>

      {/* Pipeline Stages Accordion List (Matching Screenshot 3) */}
      <div className="flex flex-col gap-2">
        {STAGES.map((stage) => {
          const stageOpps = opportunities.filter(o => o.stage === stage.name);
          const stageTotal = stageOpps.reduce((sum, o) => sum + o.value, 0);
          const isExpanded = expandedStages[stage.name];

          return (
            <div 
              key={stage.name}
              className="bg-[#0A0E17] border border-[#162033] rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              {/* Stage Header Row */}
              <button
                onClick={() => toggleStage(stage.name)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#0F1726] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <span className="text-xs font-bold text-slate-200">{stage.name}</span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    ${stageTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {stageOpps.length}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Stage Content */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-[#141E2F] flex flex-col gap-2">
                  {stageOpps.length === 0 ? (
                    <div className="py-4 text-center text-slate-600 text-xs italic">
                      No opportunities
                    </div>
                  ) : (
                    stageOpps.map((opp) => (
                      <div 
                        key={opp.id}
                        className="bg-[#0E1524] border border-[#1A2840] rounded-xl p-3.5 flex flex-col gap-2 hover:border-teal-500/40 transition-colors shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xs font-bold text-white">{opp.title}</h3>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                              <span>👤 {opp.client}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                              <span className="truncate">{opp.address}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-[#080D18] border border-[#1A2840] px-2 py-1 rounded-lg">
                            <span className="text-[10px] text-slate-300 font-semibold">{opp.stage}</span>
                            <ChevronDown className="w-3 h-3 text-slate-500" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#141E2F] text-xs">
                          <span className="font-extrabold text-white">
                            ${opp.value.toLocaleString()}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
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
          <form onSubmit={handleCreateOpportunity} className="card-dark w-full max-w-md bg-[#0C121E] border border-teal-500/40 rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b border-[#182438] pb-2.5">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-extrabold text-white">Create New Opportunity</h3>
              </div>
              <button type="button" onClick={() => setIsNewOppModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Project / Deal Title *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Greenwood Estate New Build"
                required
                className="w-full bg-[#080D18] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-teal-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Client Name</label>
                <input
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  placeholder="e.g. Anderson Trust"
                  className="w-full bg-[#080D18] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Estimated Value ($)</label>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="2400000"
                  className="w-full bg-[#080D18] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Property Location / Address</label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="e.g. 5 Willow Lane, Greenwood Village, CO"
                className="w-full bg-[#080D18] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Pipeline Stage</label>
              <select
                value={newStage}
                onChange={(e) => setNewStage(e.target.value as any)}
                className="w-full bg-[#080D18] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-teal-400"
              >
                {STAGES.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#182438]">
              <button
                type="button"
                onClick={() => setIsNewOppModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-[#141E2F] text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#00D2B4] hover:bg-[#00baa0] text-slate-950 text-xs font-black shadow"
              >
                Save Opportunity
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
