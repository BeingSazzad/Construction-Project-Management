import React, { useState } from 'react';
import {
  ArrowLeft, TrendingUp, DollarSign, MapPin,
  User, Flag, CheckCircle2, ChevronDown
} from 'lucide-react';

interface CreateDealViewProps {
  onBack: () => void;
  onCreate: (deal: {
    title: string;
    client: string;
    address: string;
    value: number;
    stage: string;
    type: string;
    notes: string;
  }) => void;
}

const STAGES = ['Estimating', 'Proposal Sent', 'Under Contract', 'Won'] as const;
const DEAL_TYPES = ['Custom Home', 'Commercial Build', 'Remodel / Renovation', 'Addition', 'Multi-Family', 'Other'];

export const CreateDealView: React.FC<CreateDealViewProps> = ({ onBack, onCreate }) => {
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [address, setAddress] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState<typeof STAGES[number]>('Estimating');
  const [dealType, setDealType] = useState(DEAL_TYPES[0]);
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const isValid = title.trim().length > 0 && client.trim().length > 0 && Number(value) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSuccess(true);
    setTimeout(() => {
      onCreate({
        title: title.trim(),
        client: client.trim(),
        address: address.trim(),
        value: Number(value),
        stage,
        type: dealType,
        notes: notes.trim(),
      });
    }, 900);
  };

  const InputLabel = ({ label, required }: { label: string; required?: boolean }) => (
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
      {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
    </label>
  );

  const inputClass =
    'w-full h-11 bg-[#090E1A] border border-[#1A263B] rounded-2xl px-3.5 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500/70 focus:bg-[#0A1220] transition-all';

  return (
    <div className="w-full min-h-screen bg-[#070A12] font-sans pb-32 max-w-[430px] mx-auto animate-fade-in">

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#070A12]/95 backdrop-blur-md border-b border-[#142036] px-5 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-[#0D1422] border border-[#1A263B] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-white">New Deal</h1>
          <p className="text-[10px] text-slate-500">Add to your pipeline</p>
        </div>
        {isValid && !isSuccess && (
          <button
            form="deal-form"
            type="submit"
            className="px-4 h-8 rounded-xl bg-[#2563EB] text-white text-xs font-bold cursor-pointer active:scale-95 transition-all"
          >
            Create
          </button>
        )}
      </div>

      {/* Success banner */}
      {isSuccess && (
        <div className="mx-5 mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Deal added to pipeline!</span>
        </div>
      )}

      <form id="deal-form" onSubmit={handleSubmit} className="px-5 pt-5 flex flex-col gap-4">

        {/* Section: Deal Info */}
        <div className="rounded-2xl bg-[#0A111F] border border-[#142036] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#142036]">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Deal Info</span>
          </div>
          <div className="p-4 flex flex-col gap-3.5">
            <div>
              <InputLabel label="Project Title" required />
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Oakridge Luxury Custom Build"
                className={inputClass}
                required
              />
            </div>
            <div>
              <InputLabel label="Deal Type" />
              <div className="relative">
                <select
                  value={dealType}
                  onChange={e => setDealType(e.target.value)}
                  className={`${inputClass} appearance-none pr-8`}
                >
                  {DEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <InputLabel label="Stage" />
              <div className="flex gap-2 flex-wrap">
                {STAGES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStage(s)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border ${
                      stage === s
                        ? 'bg-[#2563EB] border-blue-500 text-white'
                        : 'bg-[#090E1A] border-[#1A263B] text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Client */}
        <div className="rounded-2xl bg-[#0A111F] border border-[#142036] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#142036]">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Client</span>
          </div>
          <div className="p-4 flex flex-col gap-3.5">
            <div>
              <InputLabel label="Client Name" required />
              <input
                type="text"
                value={client}
                onChange={e => setClient(e.target.value)}
                placeholder="e.g. Anderson Family Trust"
                className={inputClass}
                required
              />
            </div>
            <div>
              <InputLabel label="Project Address" />
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. 142 Maple Dr, Austin TX"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Financials */}
        <div className="rounded-2xl bg-[#0A111F] border border-[#142036] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#142036]">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Financials</span>
          </div>
          <div className="p-4">
            <InputLabel label="Estimated Value ($)" required />
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold">$</span>
              <input
                type="number"
                min={0}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="1,500,000"
                className={`${inputClass} pl-7`}
                required
              />
            </div>
          </div>
        </div>

        {/* Section: Notes */}
        <div className="rounded-2xl bg-[#0A111F] border border-[#142036] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#142036]">
            <Flag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Notes</span>
          </div>
          <div className="p-4">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Key details, referral source, scope notes..."
              rows={3}
              className="w-full bg-[#090E1A] border border-[#1A263B] rounded-2xl px-3.5 py-3 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500/70 resize-none transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSuccess}
          className={`w-full h-12 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
            isValid && !isSuccess
              ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-900/30 active:scale-95'
              : 'bg-[#0D1422] text-slate-500 border border-[#1A263B] cursor-not-allowed'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          {isSuccess ? 'Deal Created!' : 'Add to Pipeline'}
        </button>

      </form>
    </div>
  );
};
