import React, { useState } from 'react';
import {
  ArrowLeft, DollarSign,
  CheckCircle2, Percent, Plus,
  Building2, Briefcase, Calendar
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface CreateDealViewProps {
  onBack: () => void;
  onCreate: (deal: {
    title: string;
    client: string;
    clientEmail?: string;
    address: string;
    value: number;
    stage: string;
    type: string;
    probability: number;
    leadSource?: string;
    assignedTo?: string;
    startDate?: string;
    followUpDate?: string;
    description?: string;
    notes: string;
  }) => void;
}

export const PROJECT_TYPES = [
  'Custom Home',
  'Remodel',
  'New Construction',
  'Design-Build',
  'General Contracting',
  'Residential Development'
] as const;

export const OPPORTUNITY_STAGES = [
  'New Lead',
  'Contacted',
  'Discovery',
  'Plans Received',
  'Estimating',
  'Proposal Sent',
  'Negotiation',
  'Won',
  'Lost',
  'On Hold'
] as const;

export const LEAD_SOURCES = [
  'Referral',
  'Website',
  'Repeat Client',
  'Architect Partner',
  'Subcontractor',
  'Social Media',
  'Cold Outreach',
  'Other'
];

export const CreateDealView: React.FC<CreateDealViewProps> = ({ onBack, onCreate }) => {
  // Form State
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [address, setAddress] = useState('');
  const [projectType, setProjectType] = useState<typeof PROJECT_TYPES[number]>('Custom Home');
  const [stage, setStage] = useState<typeof OPPORTUNITY_STAGES[number]>('New Lead');
  const [value, setValue] = useState('0');
  const [probability, setProbability] = useState('10');
  const [leadSource, setLeadSource] = useState('');
  const [assignedTo, setAssignedTo] = useState('Alex Chen');
  const [startDate, setStartDate] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const isValid = title.trim().length > 0;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isValid) return;

    setIsSuccess(true);
    setTimeout(() => {
      onCreate({
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
    }, 600);
  };

  const InputLabel = ({ label, required }: { label: string; required?: boolean }) => (
    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
      {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
  );

  const inputClass =
    'w-full h-11 bg-[#090E1A] border border-[#142036] rounded-xl px-3.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#2563EB] focus:bg-[#0A1220] transition-all font-medium';

  return (
    <div className="w-full min-h-screen bg-[#070A12] font-sans pb-32 max-w-[430px] mx-auto text-slate-100 animate-fade-in flex flex-col">

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
            <h1 className="text-sm font-bold text-white tracking-tight">New Opportunity</h1>
            <p className="text-[10px] text-slate-500">Create pre-construction lead</p>
          </div>
        </div>
      </div>

      {/* Success banner */}
      {isSuccess && (
        <div className="mx-5 mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Opportunity created successfully!</span>
        </div>
      )}

      {/* ─── FORM CONTENT ─── */}
      <form onSubmit={handleSubmit} className="px-5 pt-4 flex-1 flex flex-col gap-4">
        
        {/* SECTION 1: OPPORTUNITY & CLIENT INFO */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-3.5 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-[#142036]">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white">Opportunity & Client Info</span>
          </div>

          <div>
            <InputLabel label="Project / Opportunity Name" required />
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Maple Ridge Custom Home"
              className={inputClass}
              autoFocus
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
                placeholder="e.g. Sarah Johnson"
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
              placeholder="123 Builder Way, Boulder, CO"
              className={inputClass}
            />
          </div>
        </div>

        {/* SECTION 2: PIPELINE & VALUATION */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-3.5 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-[#142036]">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white">Pipeline Classification & Financials</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Project Type */}
            <div>
              <InputLabel label="Project Type" />
              <CustomSelect
                value={projectType}
                onChange={v => setProjectType(v as any)}
                options={PROJECT_TYPES}
                size="md"
              />
            </div>

            {/* Stage */}
            <div>
              <InputLabel label="Initial Stage" />
              <CustomSelect
                value={stage}
                onChange={v => setStage(v as any)}
                options={OPPORTUNITY_STAGES}
                size="md"
              />
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

        {/* SECTION 3: SCHEDULE & NOTES */}
        <div className="p-4 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-3.5 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-[#142036]">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white">Timeline & Scope Details</span>
          </div>

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
            <InputLabel label="Internal Notes" />
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Private notes for estimating team..."
              rows={2}
              className="w-full bg-[#090E1A] border border-[#142036] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#2563EB] resize-none transition-all font-medium"
            />
          </div>
        </div>

        {/* ─── PRIMARY SUBMIT ACTION ─── */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isValid || isSuccess}
            className={`w-full h-12 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
              isValid && !isSuccess
                ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-600/30 active:scale-[0.99]'
                : 'bg-[#0D1422] text-slate-500 border border-[#142036] cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isSuccess ? 'Opportunity Created!' : 'Create Opportunity'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
