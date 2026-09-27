import React, { useState, useRef } from 'react';
import { Subcontractor, LienWaiver } from '../../types';
import { 
  FileCheck, X, CheckCircle2, UploadCloud, 
  FileText, Trash2, Paperclip, ShieldCheck 
} from 'lucide-react';

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
  const [proofFile, setProofFile] = useState<{ name: string; size: string } | null>({
    name: 'Apex_Concrete_Signed_Lien_Release.pdf',
    size: '1.4 MB'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setProofFile({
        name: file.name,
        size: `${sizeMB === '0.0' ? '< 0.1' : sizeMB} MB`
      });
      setStatus('Signed & Active');
    }
  };

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
      <div className="relative w-full max-w-[390px] mx-auto bg-white border border-[#DDE1E7] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-[#171A1F]">
        
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

          {/* 5. Signed Proof Document (Attachment Option) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#171A1F] flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>Signed Waiver Proof / Document *</span>
              </label>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Required Proof
              </span>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
            />

            {proofFile ? (
              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200/90 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0F172A] truncate leading-tight">
                      {proofFile.name}
                    </p>
                    <p className="text-[10px] text-[#10A976] font-semibold mt-0.5 flex items-center gap-1">
                      <span>✓ Signed & Notarized Proof ({proofFile.size})</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-[#1677FF] hover:bg-[#EAF3FF] transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProofFile(null);
                      setStatus('Action Required');
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="Remove proof"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#CBD5E1] hover:border-[#1677FF] bg-[#F8FAFC] hover:bg-[#EAF3FF]/40 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-[#1677FF] flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-2xs">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors">
                  Upload Signed Proof (PDF, JPG, PNG)
                </p>
                <p className="text-[10px] text-[#64748B] mt-0.5">
                  Click to browse notarized sub release document
                </p>
              </div>
            )}
          </div>

          {/* 6. Proof & Approval Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#171A1F]">Proof & Approval Status</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Signed & Active')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  status === 'Signed & Active'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                    : 'bg-[#F7F8FA] border-[#DDE1E7] text-[#68707C]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Proof Approved</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('Action Required')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  status === 'Action Required'
                    ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs'
                    : 'bg-[#F7F8FA] border-[#DDE1E7] text-[#68707C]'
                }`}
              >
                <span>⚠ Proof Pending</span>
              </button>
            </div>
          </div>

          {/* Audited / Approved By Badge */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Audited & Approved By:</span>
            </span>
            <span className="font-bold text-[#0F172A]">Michael Chang (Finance)</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-11 rounded-2xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98] mt-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Record Waiver Proof</span>
          </button>
        </form>

      </div>
    </div>
  );
};
