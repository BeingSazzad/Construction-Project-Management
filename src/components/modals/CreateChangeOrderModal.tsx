import React, { useState } from 'react';
import { X, Check, FilePlus2 } from 'lucide-react';
import { ChangeOrder } from '../../types';

interface CreateChangeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onCreate: (newCO: Partial<ChangeOrder>) => void;
}

export const CreateChangeOrderModal: React.FC<CreateChangeOrderModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0');
  const [timeImpact, setTimeImpact] = useState('0');
  const [category, setCategory] = useState('');
  const [requestedBy, setRequestedBy] = useState('');

  if (!isOpen) return null;

  const isValid = title.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onCreate({
      projectId,
      title: title.trim(),
      description: description.trim(),
      amount: Number(amount) || 0,
      timeImpact: Number(timeImpact) || 0,
      category: category.trim() || 'General',
      requestedBy: requestedBy.trim() || 'Client',
      status: 'Pending',
      createdDate: new Date().toISOString().split('T')[0]
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setAmount('0');
    setTimeImpact('0');
    setCategory('');
    setRequestedBy('');
    onClose();
  };

  const inputClass =
    'w-full h-10 bg-[#050811] border border-[#142036] focus:border-[#2563EB] rounded-xl px-3.5 text-xs text-white placeholder-slate-500 outline-none transition-colors font-medium';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] bg-[#070D1A] border border-[#1E2E4A] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#142036]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <FilePlus2 className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">New Change Order</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Record client scope or site directive</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#0E1A33] border border-[#142036] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          
          {/* Title */}
          <div>
            <label className="text-[12px] font-semibold text-slate-300 mb-1.5 block">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Upgrade to hardwood floors"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[12px] font-semibold text-slate-300 mb-1.5 block">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope of change..."
              className="w-full bg-[#050811] border border-[#142036] rounded-xl p-3 text-white text-xs outline-none focus:border-blue-500 resize-none font-medium placeholder-slate-500"
            />
          </div>

          {/* Amount & Time Impact */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1.5 block">
                Amount ($)
              </label>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1.5 block">
                Time Impact (days)
              </label>
              <input
                type="number"
                min={0}
                value={timeImpact}
                onChange={(e) => setTimeImpact(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Category & Requested By */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1.5 block">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Finishes"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1.5 block">
                Requested By
              </label>
              <input
                type="text"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                placeholder="Name"
                className={inputClass}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 border-t border-[#142036] flex items-center justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#0E1A33] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                isValid
                  ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-blue-600/30 active:scale-95'
                  : 'bg-[#0E1524] text-slate-500 cursor-not-allowed border border-[#142036]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Submit Change Order</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
