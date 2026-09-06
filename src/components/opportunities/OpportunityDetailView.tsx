import React, { useState } from 'react';
import {
  ArrowLeft, Edit3,
  Calendar, Sparkles, CheckCircle2, 
  Trash2, User,
  MoreVertical
} from 'lucide-react';
import { Opportunity } from './OpportunitiesView';
import { EditDealModal } from './EditDealModal';
import { OPPORTUNITY_STAGES } from './CreateDealView';
import { CustomSelect } from '../common/CustomSelect';

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
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [convertedToast, setConvertedToast] = useState(false);

  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case 'Won':
      case 'Contract Signed':
        return 'bg-emerald-50 border border-emerald-200 text-emerald-700';
      case 'Estimating':
      case 'Proposal Sent':
      case 'Negotiation':
        return 'bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF]';
      case 'Contacted':
      case 'Discovery':
        return 'bg-sky-50 border border-sky-200 text-sky-700';
      case 'Plans Received':
        return 'bg-purple-50 border border-purple-200 text-purple-700';
      case 'Lost':
        return 'bg-rose-50 border border-rose-200 text-rose-700';
      default:
        return 'bg-[#F2F2F7] border border-[#DDE1E7] text-[#4B5565]';
    }
  };

  const handleStageChange = (newStage: any) => {
    onUpdate({
      ...deal,
      stage: newStage,
      probability: newStage === 'Contract Signed' ? 100 : deal.probability
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
        stage: 'Contract Signed',
        probability: 100
      });
      setConvertedToast(false);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-[#F2F2F7] font-sans pb-36 max-w-[430px] mx-auto text-[#171A1F] animate-fade-in flex flex-col">

      {/* ─── STICKY HEADER ─── */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EAEDF1] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#171A1F] tracking-tight truncate max-w-[200px]">{deal.title}</h1>
            <p className="text-xs text-[#68707C] font-medium">Opportunity Details</p>
          </div>
        </div>

        {/* Action Menu (Edit & Delete Options) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="flex items-center gap-1 h-9 px-2.5 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#171A1F] border border-[#DDE1E7] text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <span className="text-xs font-semibold text-[#4B5565]">Options</span>
            <MoreVertical className="w-4 h-4 text-[#68707C]" />
          </button>

          {/* Custom Floating DOM Menu */}
          {isActionsOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#DDE1E7] rounded-2xl p-1.5 shadow-xl z-50 animate-fade-in flex flex-col gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsActionsOpen(false);
                  setIsEditOpen(true);
                }}
                className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-[#171A1F] hover:bg-[#F2F2F7] flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-[#1677FF]" />
                <span>Edit Opportunity</span>
              </button>

              <div className="h-px bg-[#EAEDF1] my-0.5" />

              <button
                type="button"
                onClick={() => {
                  setIsActionsOpen(false);
                  setIsDeleteConfirmOpen(true);
                }}
                className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete Opportunity</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Converted Toast */}
      {convertedToast && (
        <div className="mx-5 mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Converted to Signed Project!</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#DDE1E7] rounded-3xl p-5 w-full max-w-[360px] shadow-2xl flex flex-col gap-4 text-[#171A1F]">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-[#171A1F]">Delete Opportunity?</h3>
              <p className="text-xs text-[#68707C] mt-1">
                Are you sure you want to delete <span className="text-[#171A1F] font-bold">"{deal.title}"</span>?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="h-10 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#4B5565] font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  onDelete(deal.id);
                  onBack();
                }}
                className="h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SCROLLABLE CONTENT BODY ─── */}
      <div className="px-5 pt-4 flex flex-col gap-4">

        {/* 1. HERO VALUE & STAGE CARD */}
        <div className="p-4 rounded-3xl bg-white border border-[#DDE1E7] shadow-xs flex flex-col gap-3.5 relative overflow-hidden">
          
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/20 inline-block mb-1.5">
                {deal.type || 'Custom Home'}
              </span>
              <h2 className="text-base font-black text-[#171A1F] leading-snug">
                {deal.title}
              </h2>
            </div>

            {/* Custom Status / Stage Picker */}
            <div className="w-36 flex-shrink-0">
              <CustomSelect
                value={deal.stage}
                onChange={handleStageChange}
                options={OPPORTUNITY_STAGES}
                size="sm"
                triggerClassName={getStageBadgeColor(deal.stage)}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#68707C] uppercase tracking-wider block">
                Est. Construction Value
              </span>
              <span className="text-xl font-black text-[#171A1F] mt-0.5 block tracking-tight">
                ${deal.value.toLocaleString()}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-[#68707C] uppercase tracking-wider block">
                Win Probability
              </span>
              <span className="text-sm font-black text-emerald-600 mt-0.5 block">
                {deal.probability}%
              </span>
            </div>
          </div>

          {/* Probability Progress Track */}
          <div>
            <div className="h-1.5 w-full bg-[#F2F2F7] rounded-full overflow-hidden border border-[#EAEDF1]">
              <div 
                className="h-full bg-gradient-to-r from-[#1677FF] to-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(Math.max(deal.probability, 5), 100)}%` }}
              />
            </div>
          </div>

        </div>

        {/* 2. CLIENT & SITE DETAILS */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE1E7] flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
            <span className="text-xs font-bold text-[#171A1F] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#1677FF]" /> Client & Contact Info
            </span>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#68707C] text-xs">Client Name</span>
              <span className="text-[#171A1F] font-bold">{deal.client || 'Private Client'}</span>
            </div>

            {deal.clientEmail && (
              <div className="flex items-center justify-between">
                <span className="text-[#68707C] text-xs">Email</span>
                <span className="text-[#1677FF] font-medium">{deal.clientEmail}</span>
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <span className="text-[#68707C] text-xs flex-shrink-0">Site Address</span>
              <span className="text-[#171A1F] font-medium text-right break-words">{deal.address}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#68707C] text-xs">Lead Source</span>
              <span className="text-[#4B5565] font-semibold">{deal.leadSource || 'Direct Outreach'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#68707C] text-xs">Assigned Manager</span>
              <span className="text-[#4B5565] font-semibold">{deal.assignedTo || 'Alex Chen'}</span>
            </div>
          </div>
        </div>

        {/* 3. SCHEDULE & DATES */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE1E7] flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
            <span className="text-xs font-bold text-[#171A1F] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1677FF]" /> Timeline
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1] flex flex-col gap-1">
              <span className="text-[10px] text-[#68707C] font-bold uppercase tracking-wider">Expected Start</span>
              <span className="text-[#171A1F] font-bold">
                {deal.startDate ? new Date(deal.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not Scheduled'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1] flex flex-col gap-1">
              <span className="text-[10px] text-[#68707C] font-bold uppercase tracking-wider">Follow-up Date</span>
              <span className="text-[#1677FF] font-bold">
                {deal.followUpDate ? new Date(deal.followUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. SCOPE DESCRIPTION & NOTES */}
        <div className="p-4 rounded-2xl bg-white border border-[#DDE1E7] flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
            <span className="text-xs font-bold text-[#171A1F] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1677FF]" /> Scope & Notes
            </span>
          </div>

          {deal.description ? (
            <div>
              <span className="text-[10px] text-[#68707C] uppercase tracking-wider font-bold block mb-1">
                Description
              </span>
              <p className="text-xs text-[#171A1F] leading-relaxed bg-[#F7F8FA] p-3 rounded-xl border border-[#EAEDF1]">
                {deal.description}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#68707C] italic">No description provided.</p>
          )}

          {deal.notes && (
            <div>
              <span className="text-[10px] text-[#68707C] uppercase tracking-wider font-bold block mb-1">
                Internal Notes
              </span>
              <p className="text-xs text-[#4B5565] leading-relaxed bg-[#F7F8FA] p-3 rounded-xl border border-[#EAEDF1] font-mono">
                {deal.notes}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* ─── FIXED BOTTOM ACTIONS ─── */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/95 backdrop-blur-md border-t border-[#EAEDF1] p-4 flex items-center gap-2.5 z-30">
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="h-11 px-4 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#171A1F] border border-[#DDE1E7] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#1677FF]" />
          <span>Edit</span>
        </button>

        {deal.stage !== 'Contract Signed' ? (
          <button
            type="button"
            onClick={handleConvert}
            className="flex-1 h-11 rounded-xl bg-[#1677FF] hover:bg-[#125ecc] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Convert to Project</span>
          </button>
        ) : (
          <div className="flex-1 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Active Signed Project</span>
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
