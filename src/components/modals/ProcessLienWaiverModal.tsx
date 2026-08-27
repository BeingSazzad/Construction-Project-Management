import React, { useState } from 'react';
import { Subcontractor, LienWaiver } from '../../types';
import { FileCheck, X, CheckCircle2, ShieldAlert, DollarSign } from 'lucide-react';

interface ProcessLienWaiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  subcontractors: Subcontractor[];
  onRecordWaiver: (waiver: Partial<LienWaiver>) => void;
}

export const ProcessLienWaiverModal: React.FC<ProcessLienWaiverModalProps> = ({
  isOpen,
  onClose,
  subcontractors,
  onRecordWaiver
}) => {
  const [selectedSub, setSelectedSub] = useState(subcontractors[0]?.companyName || 'Apex Concrete Masters');
  const [trade, setTrade] = useState(subcontractors[0]?.trade || 'Division 03 Concrete');
  const [amount, setAmount] = useState('185000');
  const [type, setType] = useState<LienWaiver['type']>('Progress Unconditional');
  const [invoiceRef, setInvoiceRef] = useState('INV-2025-089');
  const [status, setStatus] = useState<LienWaiver['status']>('Signed & Active');

  if (!isOpen) return null;

  const handleSubChange = (companyName: string) => {
    setSelectedSub(companyName);
    const subObj = subcontractors.find(s => s.companyName === companyName);
    if (subObj) {
      setTrade(subObj.trade);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordWaiver({
      projectId: 'proj-1',
      subcontractorName: selectedSub,
      trade,
      amount: parseFloat(amount) || 120000,
      type,
      status,
      invoiceRef,
      dateSubmitted: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-[430px] bg-[#070D1A] border border-[#142036] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#142036] bg-[#0A1020]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Record Lien Waiver</h3>
              <p className="text-[10px] text-slate-400">Verify sub-trade mechanic lien release</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#0E1A33] border border-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
          
          {/* 1. Subcontractor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Subcontractor Firm *</label>
            <select
              value={selectedSub}
              onChange={(e) => handleSubChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {subcontractors.map((s) => (
                <option key={s.id} value={s.companyName}>
                  {s.companyName} ({s.trade})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Trade Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">CSI Trade Discipline</label>
            <input
              type="text"
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* 3. Invoice Reference & Payment Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Invoice Ref # *</label>
              <input
                type="text"
                value={invoiceRef}
                onChange={(e) => setInvoiceRef(e.target.value)}
                placeholder="INV-1092"
                required
                className="w-full h-11 px-3.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Payment Amount ($) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="185000"
                required
                className="w-full h-11 px-3.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-bold focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* 4. Waiver Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Lien Waiver Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="Progress Unconditional">Progress Unconditional (Payment Received)</option>
              <option value="Progress Conditional">Progress Conditional (Check Issued)</option>
              <option value="Final Unconditional">Final Unconditional (Closeout Release)</option>
              <option value="Final Conditional">Final Conditional (Final Check Pending)</option>
            </select>
          </div>

          {/* 5. Verification Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Verification Status</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Signed & Active')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  status === 'Signed & Active'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                    : 'bg-[#0D1424] border-[#1A263E] text-slate-400'
                }`}
              >
                ✓ Signed & Active
              </button>
              <button
                type="button"
                onClick={() => setStatus('Action Required')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  status === 'Action Required'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                    : 'bg-[#0D1424] border-[#1A263E] text-slate-400'
                }`}
              >
                ⚠ Action Required
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-900/40 active:scale-[0.98] mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify & Log Lien Waiver</span>
          </button>
        </form>

      </div>
    </div>
  );
};
