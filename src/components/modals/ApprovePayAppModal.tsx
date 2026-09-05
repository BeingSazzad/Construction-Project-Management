import React, { useState } from 'react';
import { Subcontractor, Project } from '../../types';
import { DollarSign, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ApprovePayAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  subcontractors: Subcontractor[];
  onDisburse: (subName: string, amount: number) => void;
}

export const ApprovePayAppModal: React.FC<ApprovePayAppModalProps> = ({
  isOpen,
  onClose,
  projects,
  subcontractors,
  onDisburse
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'proj-1');
  const [selectedSub, setSelectedSub] = useState(subcontractors[0]?.companyName || 'Apex Concrete Masters');
  const [trade, setTrade] = useState(subcontractors[0]?.trade || 'Division 03 Concrete');
  const [workPct, setWorkPct] = useState('65');
  const [grossAmount, setGrossAmount] = useState('240000');
  const [retainagePct, setRetainagePct] = useState('10');
  const [hasLienWaiver, setHasLienWaiver] = useState(true);

  if (!isOpen) return null;

  const grossNum = parseFloat(grossAmount) || 200000;
  const retainageNum = Math.round(grossNum * (parseFloat(retainagePct) / 100));
  const netPayable = grossNum - retainageNum;

  const handleSubChange = (companyName: string) => {
    setSelectedSub(companyName);
    const subObj = subcontractors.find(s => s.companyName === companyName);
    if (subObj) {
      setTrade(subObj.trade);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDisburse(selectedSub, netPayable);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
      <div className="relative w-full max-w-[430px] bg-white border border-[#DDE1E7] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-[#171A1F]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAEDF1] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171A1F]">Process Pay Application</h3>
              <p className="text-xs text-[#68707C]">Subcontractor billing & disbursement audit</p>
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
          
          {/* 1. Target Project */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#171A1F]">Target Project *</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] text-[#171A1F] text-xs font-semibold focus:outline-none focus:border-[#1677FF] transition-colors cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Subcontractor */}
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

          {/* 3. Work Completed % & Gross Billing */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#171A1F]">Work Completed %</label>
              <input
                type="number"
                value={workPct}
                onChange={(e) => setWorkPct(e.target.value)}
                placeholder="65"
                className="w-full h-11 px-3.5 rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] text-[#171A1F] text-xs font-bold focus:outline-none focus:border-[#1677FF] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#171A1F]">Gross Billed ($) *</label>
              <input
                type="number"
                value={grossAmount}
                onChange={(e) => setGrossAmount(e.target.value)}
                placeholder="240000"
                required
                className="w-full h-11 px-3.5 rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] text-[#171A1F] text-xs font-bold focus:outline-none focus:border-[#1677FF] transition-colors"
              />
            </div>
          </div>

          {/* 4. Retainage & Net Calculation Box */}
          <div className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#68707C]">Gross Work Completed:</span>
              <span className="font-bold text-[#171A1F]">${grossNum.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#68707C]">Retainage Holdback ({retainagePct}%):</span>
              <span className="font-bold text-amber-600">-${retainageNum.toLocaleString()}</span>
            </div>

            <div className="h-px bg-[#EAEDF1] my-0.5" />

            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-emerald-700">Net Payable Amount:</span>
              <span className="text-emerald-700">${netPayable.toLocaleString()}</span>
            </div>
          </div>

          {/* 5. Lien Waiver Checkbox */}
          <div className="p-3 rounded-2xl bg-[#F7F8FA] border border-[#DDE1E7] flex items-center justify-between">
            <span className="text-xs font-bold text-[#171A1F] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Lien Waiver Signed
            </span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasLienWaiver}
                onChange={(e) => setHasLienWaiver(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-0 bg-white border-[#DDE1E7]"
              />
              <span className={`text-xs font-bold ${hasLienWaiver ? 'text-emerald-700' : 'text-amber-700'}`}>
                {hasLienWaiver ? 'Verified' : 'Pending'}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-11 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.98] mt-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Authorize Disbursement</span>
          </button>
        </form>

      </div>
    </div>
  );
};
