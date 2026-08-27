import React, { useState } from 'react';
import {
  ArrowLeft, Edit3, DollarSign, MapPin, User, Mail, 
  Calendar, Briefcase, TrendingUp, Sparkles, CheckCircle2, 
  Trash2, Phone, Share2, ArrowUpRight, Clock, ShieldCheck, Flag,
  ChevronDown
} from 'lucide-react';
import { Opportunity } from './OpportunitiesView';
import { EditDealModal } from './EditDealModal';
import { OPPORTUNITY_STAGES } from './CreateDealView';

interface OpportunityDetailViewProps {
  deal: Opportunity;
  onBack: () => void;
  onUpdate: (updatedDeal: Opportunity) => void;
  onDelete: (dealId: string) => void;
  onConvertToProject?: (deal: Opportunity) => void;
}

export const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({
  deal,
  onBack,
  onUpdate,
  onDelete,
  onConvertToProject
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [convertedToast, setConvertedToast] = useState(false);

  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case 'Won':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
      case 'Estimating':
      case 'Proposal Sent':
      case 'Negotiation':
        return 'bg-blue-500/15 border-blue-500/30 text-blue-400';
      case 'Contacted':
      case 'Discovery':
        return 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400';
      case 'Plans Received':
        return 'bg-purple-500/15 border-purple-500/30 text-purple-400';
      case 'Lost':
        return 'bg-rose-500/15 border-rose-500/30 text-rose-400';
      default:
        return 'bg-slate-700/30 border-slate-600/30 text-slate-300';
    }
  };

  const handleStageChange = (newStage: any) => {
    onUpdate({
      ...deal,
      stage: newStage,
      probability: newStage === 'Won' ? 100 : newStage === 'Lost' ? 0 : deal.probability
    });
  };

  const handleConvert = () => {
    setConvertedToast(true);
    if (onConvertToProject) {
      onConvertToProject(deal);
    }
    setTimeout(() => {
      onUpdate({
        ...deal,
        stage: 'Won',
        probability: 100
      });
      setConvertedToast(false);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-[#070A12] font-sans pb-36 max-w-[430px] mx-auto text-slate-100 animate-fade-in flex flex-col">

      {/* ─── STICKY HEADER ─── */}
      <div className="sticky top-0 z-20 bg-[#070A12]/95 backdrop-blur-md border-b border-[#142036] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-[#0A111F] border border-[#142036] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight truncate max-w-[200px]">{deal.title}</h1>
            <p className="text-[10px] text-slate-400">Opportunity Overview</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A111F] hover:bg-[#121D33] text-slate-200 hover:text-white border border-[#142036] text-xs font-bold transition-all cursor-pointer active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-400" />
          <span>Edit</span>
        </button>
      </div>

      {/* Converted Toast */}
      {convertedToast && (
        <div className="mx-5 mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Converted to Won Project successfully!</span>
        </div>
      )}

      {/* ─── SCROLLABLE CONTENT BODY ─── */}
      <div className="px-5 pt-4 flex flex-col gap-4">

        {/* 1. HERO VALUE & STAGE CARD */}
        <div className="p-4 rounded-3xl bg-[#0A111F] border border-[#142036] shadow-sm flex flex-col gap-3.5 relative overflow-hidden">
          
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20 inline-block mb-1.5">
                {deal.type || 'Custom Home'}
              </span>
              <h2 className="text-base font-black text-white leading-snug">
                {deal.title}
              </h2>
            </div>

            {/* Interactive Status / Stage Dropdown Picker */}
            <div className="relative flex-shrink-0">
              <select
                value={deal.stage}
                onChange={(e) => handleStageChange(e.target.value)}
                className={`pl-3 pr-7 py-1.5 rounded-xl text-xs font-bold border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all ${getStageBadgeColor(deal.stage)}`}
              >
                {OPPORTUNITY_STAGES.map(s => (
                  <option key={s} value={s} className="bg-[#0A111F] text-white">
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036]/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Est. Construction Value
              </span>
              <span className="text-xl font-black text-white mt-0.5 block tracking-tight">
                ${deal.value.toLocaleString()}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Win Probability
              </span>
              <span className="text-sm font-black text-emerald-400 mt-0.5 block">
                {deal.probability}%
              </span>
            </div>
          </div>

          {/* Probability Progress Track */}
          <div>
            <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all"
                style={{ width: `${Math.min(Math.max(deal.probability, 5), 100)}%` }}
              />
            </div>
          </div>

        </div>

        {/* 2. CLIENT & SITE DETAILS */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" /> Client & Contact Info
            </span>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Client Name</span>
              <span className="text-white font-bold">{deal.client || 'Private Client'}</span>
            </div>

            {deal.clientEmail && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Email</span>
                <span className="text-blue-400 font-medium">{deal.clientEmail}</span>
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <span className="text-slate-400 text-[11px] flex-shrink-0">Site Address</span>
              <span className="text-white font-medium text-right break-words">{deal.address}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Lead Source</span>
              <span className="text-slate-200 font-semibold">{deal.leadSource || 'Direct Outreach'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Assigned Manager</span>
              <span className="text-slate-200 font-semibold">{deal.assignedTo || 'Alex Chen'}</span>
            </div>
          </div>
        </div>

        {/* 3. SCHEDULE & DATES */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> Milestone Timeline
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#070D1A] border border-[#142036]/60 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Expected Start</span>
              <span className="text-white font-bold">
                {deal.startDate ? new Date(deal.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not Scheduled'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#070D1A] border border-[#142036]/60 flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Follow-up Date</span>
              <span className="text-blue-400 font-bold">
                {deal.followUpDate ? new Date(deal.followUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. SCOPE DESCRIPTION & NOTES */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Scope & Specifications
            </span>
          </div>

          {deal.description ? (
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Project Description
              </span>
              <p className="text-xs text-slate-200 leading-relaxed bg-[#070D1A] p-3 rounded-xl border border-[#142036]/60">
                {deal.description}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No description provided.</p>
          )}

          {deal.notes && (
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Internal Estimating Notes
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#070D1A] p-3 rounded-xl border border-[#142036]/60 font-mono">
                {deal.notes}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* ─── FIXED BOTTOM ACTIONS ─── */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-[#070A12]/95 backdrop-blur-md border-t border-[#142036] p-4 flex items-center gap-2.5 z-30">
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="h-12 px-4 rounded-2xl bg-[#0A111F] hover:bg-[#101A2E] text-slate-300 border border-[#142036] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-400" />
          <span>Edit</span>
        </button>

        {deal.stage !== 'Won' ? (
          <button
            type="button"
            onClick={handleConvert}
            className="flex-1 h-12 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Convert to Won Project</span>
          </button>
        ) : (
          <div className="flex-1 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Active Won Project</span>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <EditDealModal
          deal={deal}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={(updated) => {
            onUpdate(updated);
            setIsEditOpen(false);
          }}
          onDelete={(id) => {
            onDelete(id);
            onBack();
          }}
        />
      )}

    </div>
  );
};
