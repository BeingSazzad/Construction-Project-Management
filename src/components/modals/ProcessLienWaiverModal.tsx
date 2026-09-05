import React, { useState } from 'react';
import { Subcontractor, LienWaiver } from '../../types';
import { FileCheck, X, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
      <div className="relative w-full max-w-[430px] bg-white border border-[#DDE1E7] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-[#171A1F]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAEDF1] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171A1F]">Record Lien Waiver</h3>
              <p className="text-xs text-[#68707C]">Verify sub-trade mechanic lien release</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
          
          {/* 1. Subcontractor */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#171A1F]">Subcontractor Firm *</label>
            <select
              value={selectedSub}
              onChange={(e) => handleSubChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] text-[#171A1F] text-xs font-semibold focus:outline-none focus:border-[#1677FF] transition-colors cursor-pointer"
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
            <label className="text-xs font-bold text-[#171A1F]">CSI Trade Discipline</label>
            <input
              type="text"
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] text-[#171A1F] text-xs font-medium focus:outline-none focus:border-[#1677FF] transition-colors"
            />
          </div>

          {/* 3. Invoice Reference & Payment Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#171A1F]">Invoice Ref # *</label>
              <input
                type="text"
                value={invoiceRef}
                onChange={(e) => setInvoiceRef(e.target.value)}
                placeholder="INV-1092"
                required
                className="w-full h-11 px-3.5 rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] text-[#171A1F] text-xs font-medium focus:outline-none focus:border-[#1677FF] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#171A1F]">Payment Amount ($) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="185000"
                required
                className="w-full h-11 px-3.5 rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] text-[#171A1F] text-xs font-bold focus:outline-none focus:border-[#1677FF] transition-colors"
              />
            </div>
          </div>

          {/* 4. Waiver Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#171A1F]">Lien Waiver Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] text-[#171A1F] text-xs font-semibold focus:outline-none focus:border-[#1677FF] transition-colors cursor-pointer"
            >
              <option value="Progress Unconditional">Progress Unconditional (Payment Received)</option>
              <option value="Progress Conditional">Progress Conditional (Check Issued)</option>
              <option value="Final Unconditional">Final Unconditional (Closeout Release)</option>
              <option value="Final Conditional">Final Conditional (Final Check Pending)</option>
            </select>
          </div>

          {/* 5. Verification Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#171A1F]">Verification Status</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Signed & Active')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  status === 'Signed & Active'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                    : 'bg-[#F7F8FA] border-[#DDE1E7] text-[#68707C]'
                }`}
              >
                ✓ Signed & Active
              </button>
              <button
                type="button"
                onClick={() => setStatus('Action Required')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  status === 'Action Required'
                    ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs'
                    : 'bg-[#F7F8FA] border-[#DDE1E7] text-[#68707C]'
                }`}
              >
                ⚠ Action Required
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-11 rounded-2xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98] mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify & Log Lien Waiver</span>
          </button>
        </form>

      </div>
    </div>
  );
};
