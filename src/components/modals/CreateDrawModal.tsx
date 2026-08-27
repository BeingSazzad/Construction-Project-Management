import React, { useState } from 'react';
import { Project, FinancingDraw } from '../../types';
import { Landmark, X, DollarSign, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CreateDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onCreateDraw: (draw: Partial<FinancingDraw>) => void;
}

export const CreateDrawModal: React.FC<CreateDrawModalProps> = ({
  isOpen,
  onClose,
  projects,
  onCreateDraw
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'proj-1');
  const [milestoneTitle, setMilestoneTitle] = useState('Structural Framing Complete');
  const [requestedAmount, setRequestedAmount] = useState('450000');
  const [lenderName, setLenderName] = useState('Texas Capital Bank Commercial');
  const [inspectorName, setInspectorName] = useState('David Miller, PE (Independent Inspector)');
  const [inspectionPassed, setInspectionPassed] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(requestedAmount) || 250000;
    
    onCreateDraw({
      projectId: selectedProjectId,
      milestoneTitle,
      requestedAmount: amountNum,
      approvedAmount: amountNum,
      fundedAmount: 0,
      status: 'In Lender Review',
      requestDate: new Date().toISOString().split('T')[0],
      lenderName,
      inspectorName,
      inspectionPassed
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-[430px] bg-[#070D1A] border border-[#142036] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#142036] bg-[#0A1020]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Request Lender Draw</h3>
              <p className="text-[10px] text-slate-400">Initiate capital draw with lender</p>
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
          
          {/* 1. Target Project */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Target Project *</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (${(p.budget.total / 1000000).toFixed(2)}M)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Milestone / Draw Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Milestone Title *</label>
            <input
              type="text"
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
              placeholder="e.g. Substructure & Slab Pour"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* 3. Requested Draw Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Requested Draw Amount ($USD) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
              <input
                type="number"
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                placeholder="450000"
                required
                className="w-full h-11 pl-8 pr-3.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-bold focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Est. 10% retainage holdback calculated automatically by lender.</p>
          </div>

          {/* 4. Commercial Lender */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Commercial Lender *</label>
            <input
              type="text"
              value={lenderName}
              onChange={(e) => setLenderName(e.target.value)}
              placeholder="Texas Capital Bank"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-[#0D1424] border border-[#1A263E] text-white text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* 5. Inspection Verification */}
          <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Third-Party Field Inspection
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inspectionPassed}
                  onChange={(e) => setInspectionPassed(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-[#070D1A] border-[#1A263E]"
                />
                <span className="text-xs text-emerald-400 font-bold">Passed</span>
              </label>
            </div>

            <input
              type="text"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              placeholder="Certified Third-Party Inspector Name"
              className="w-full h-9 px-3 rounded-lg bg-[#070D1A] border border-[#141F33] text-white text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-11 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-900/40 active:scale-[0.98] mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Draw Request to Lender</span>
          </button>
        </form>

      </div>
    </div>
  );
};
