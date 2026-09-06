import React, { useState } from 'react';
import {
  X, DollarSign, Percent,
  Trash2
} from 'lucide-react';
import { Opportunity } from './OpportunitiesView';
import { PROJECT_TYPES, OPPORTUNITY_STAGES, LEAD_SOURCES } from './CreateDealView';
import { CustomSelect } from '../common/CustomSelect';

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
    <label className="text-xs font-bold text-[#4B5565] mb-1.5 block">
      {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
  );

  const inputClass =
    'w-full h-10 bg-white border border-[#DDE1E7] rounded-xl px-3.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] transition-all font-medium';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
      <div 
        className="w-full max-w-[390px] mx-auto max-h-[90vh] bg-white border border-[#DDE1E7] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up text-[#171A1F]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EAEDF1] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-sm font-bold text-[#171A1F] tracking-tight">Edit Opportunity</h2>
            <p className="text-xs text-[#68707C] mt-0.5 font-medium">Update details & valuation</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="edit-deal-form" onSubmit={handleSubmit} className="p-4 overflow-y-auto flex flex-col gap-3.5 flex-1 scrollbar-none">
          
          {/* 1. Opportunity & Client Info */}
          <div className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] flex flex-col gap-3 shadow-xs">
            <div>
              <InputLabel label="Opportunity Title" required />
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Greenwood Estate New Build"
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <InputLabel label="Client Name" />
                <input
                  type="text"
                  value={client}
                  onChange={e => setClient(e.target.value)}
                  placeholder="e.g. Anderson Family"
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
          <div className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] flex flex-col gap-3 shadow-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <InputLabel label="Project Type" />
                <CustomSelect
                  value={projectType}
                  onChange={v => setProjectType(v as any)}
                  options={PROJECT_TYPES}
                  size="md"
                />
              </div>

              <div>
                <InputLabel label="Stage" />
                <CustomSelect
                  value={stage}
                  onChange={v => setStage(v as any)}
                  options={OPPORTUNITY_STAGES}
                  size="md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <InputLabel label="Est. Construction Value" />
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#68707C]" />
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
                  <Percent className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#68707C]" />
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

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <InputLabel label="Lead Source" />
                <CustomSelect
                  value={leadSource}
                  onChange={setLeadSource}
                  options={['— None —', ...LEAD_SOURCES]}
                  placeholder="Select source..."
                  size="md"
                />
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
          <div className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] flex flex-col gap-3 shadow-xs">
            <div className="grid grid-cols-2 gap-2.5">
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
                className="w-full bg-white border border-[#DDE1E7] rounded-xl px-3.5 py-2.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] resize-none transition-all font-medium"
              />
            </div>

            <div>
              <InputLabel label="Notes" />
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Private notes, square footage, pool, garage specs..."
                rows={2}
                className="w-full bg-white border border-[#DDE1E7] rounded-xl px-3.5 py-2.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] resize-none transition-all font-medium"
              />
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#EAEDF1] flex items-center justify-between gap-3">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete(deal.id);
                onClose();
              }}
              className="h-10 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#4B5565] hover:text-[#171A1F] text-xs font-bold cursor-pointer transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              form="edit-deal-form"
              type="submit"
              className="h-10 px-5 rounded-xl bg-[#1677FF] hover:bg-[#125ecc] text-white text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
