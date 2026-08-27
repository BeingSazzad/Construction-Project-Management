import React, { useState } from 'react';
import {
  X, DollarSign, Percent, ChevronDown, Calendar, 
  Trash2, CheckCircle2, Building2, Briefcase, User, MapPin
} from 'lucide-react';
import { Opportunity } from './OpportunitiesView';
import { PROJECT_TYPES, OPPORTUNITY_STAGES, LEAD_SOURCES } from './CreateDealView';

interface EditDealModalProps {
  deal: Opportunity;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDeal: Opportunity) => void;
  onDelete?: (dealId: string) => void;
}

export const EditDealModal: React.FC<EditDealModalProps> = ({
  deal,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState(deal.title || '');
  const [client, setClient] = useState(deal.client || '');
  const [clientEmail, setClientEmail] = useState(deal.clientEmail || '');
  const [address, setAddress] = useState(deal.address || '');
  const [projectType, setProjectType] = useState<any>(deal.type || 'Custom Home');
  const [stage, setStage] = useState<any>(deal.stage || 'New Lead');
  const [value, setValue] = useState(String(deal.value || 0));
  const [probability, setProbability] = useState(String(deal.probability ?? 10));
  const [leadSource, setLeadSource] = useState(deal.leadSource || '');
  const [assignedTo, setAssignedTo] = useState(deal.assignedTo || 'Alex Chen');
  const [startDate, setStartDate] = useState(deal.startDate || '');
  const [followUpDate, setFollowUpDate] = useState(deal.followUpDate || '');
  const [description, setDescription] = useState(deal.description || '');
  const [notes, setNotes] = useState(deal.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...deal,
      title: title.trim(),
      client: client.trim() || 'Private Client',
      clientEmail: clientEmail.trim(),
      address: address.trim() || 'Site Address',
      value: Number(value) || 0,
      stage,
      type: projectType,
      probability: Number(probability) || 10,
      leadSource,
      assignedTo,
      startDate,
      followUpDate,
      description,
      notes: notes.trim(),
    });
    onClose();
  };

  const InputLabel = ({ label, required }: { label: string; required?: boolean }) => (
    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
      {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
  );

  const inputClass =
    'w-full h-11 bg-[#090E1A] border border-[#142036] rounded-xl px-3.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#2563EB] focus:bg-[#0A1220] transition-all font-medium';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-[430px] max-h-[90vh] bg-[#070A12] border border-[#142036] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#142036] flex items-center justify-between bg-[#0A111F]">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">Edit Opportunity</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Update opportunity details & valuation</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#070D1A] border border-[#142036] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="edit-deal-form" onSubmit={handleSubmit} className="p-5 overflow-y-auto flex flex-col gap-4 flex-1 scrollbar-none">
          
          {/* 1. Project & Client Info */}
          <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-3.5 shadow-sm">
            <div>
              <InputLabel label="Project / Opportunity Name" required />
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Greenwood Estate New Build"
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputLabel label="Client Name" />
                <input
                  type="text"
                  value={client}
                  onChange={e => setClient(e.target.value)}
                  placeholder="e.g. Anderson Family Trust"
                  className={inputClass}
                />
              </div>
              <div>
                <InputLabel label="Client Email" />
                <input
                  type="email"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  placeholder="client@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <InputLabel label="Property Address" />
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="5 Willow Lane, Greenwood Village, CO"
                className={inputClass}
              />
            </div>
          </div>

          {/* 2. Pipeline & Financial Details */}
          <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-3.5 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              {/* Project Type */}
              <div>
                <InputLabel label="Project Type" />
                <div className="relative">
                  <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value as any)}
                    className={`${inputClass} appearance-none pr-8 cursor-pointer font-semibold`}
                  >
                    {PROJECT_TYPES.map(type => (
                      <option key={type} value={type} className="bg-[#0A111F] text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Stage */}
              <div>
                <InputLabel label="Stage" />
                <div className="relative">
                  <select
                    value={stage}
                    onChange={e => setStage(e.target.value as any)}
                    className={`${inputClass} appearance-none pr-8 cursor-pointer font-semibold text-blue-400`}
                  >
                    {OPPORTUNITY_STAGES.map(s => (
                      <option key={s} value={s} className="bg-[#0A111F] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Value & Probability */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputLabel label="Est. Construction Value" />
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="number"
                    min={0}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="0"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div>
                <InputLabel label="Probability (%)" />
                <div className="relative">
                  <Percent className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={probability}
                    onChange={e => setProbability(e.target.value)}
                    placeholder="10"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
            </div>

            {/* Lead Source & Assigned To */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputLabel label="Lead Source" />
                <div className="relative">
                  <select
                    value={leadSource}
                    onChange={e => setLeadSource(e.target.value)}
                    className={`${inputClass} appearance-none pr-8 cursor-pointer`}
                  >
                    <option value="" className="bg-[#0A111F] text-slate-500">— Select Source —</option>
                    {LEAD_SOURCES.map(src => (
                      <option key={src} value={src} className="bg-[#0A111F] text-white">
                        {src}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <InputLabel label="Assigned To" />
                <input
                  type="text"
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  placeholder="Team member"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 3. Schedule & Notes */}
          <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-3.5 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <InputLabel label="Expected Start Date" />
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <InputLabel label="Follow-up Date" />
                <input
                  type="date"
                  value={followUpDate}
                  onChange={e => setFollowUpDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <InputLabel label="Project Description" />
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Scope outline, architectural specs, client wishlist..."
                rows={2}
                className="w-full bg-[#090E1A] border border-[#142036] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#2563EB] resize-none transition-all font-medium"
              />
            </div>

            <div>
              <InputLabel label="Notes" />
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Private notes, square footage, pool, garage specs..."
                rows={2}
                className="w-full bg-[#090E1A] border border-[#142036] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#2563EB] resize-none transition-all font-medium"
              />
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0A111F] border-t border-[#142036] flex items-center justify-between gap-3">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete(deal.id);
                onClose();
              }}
              className="h-11 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-xl bg-[#070D1A] text-slate-300 hover:text-white border border-[#142036] text-xs font-bold cursor-pointer transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              form="edit-deal-form"
              type="submit"
              className="h-11 px-6 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-md shadow-cyan-600/30 cursor-pointer transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
