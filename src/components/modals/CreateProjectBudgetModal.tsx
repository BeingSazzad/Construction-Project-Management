import React, { useState } from 'react';
import { X, DollarSign, Building2, ArrowLeft, Check } from 'lucide-react';
import { Project } from '../../types';
import { CustomSelect } from '../common/CustomSelect';

interface CreateProjectBudgetModalProps {
  isOpen?: boolean;
  isFullScreenPage?: boolean;
  onClose: () => void;
  projects: Project[];
  onCreateBudget: (budgetData: any) => void;
}

export const CreateProjectBudgetModal: React.FC<CreateProjectBudgetModalProps> = ({
  isOpen = true,
  isFullScreenPage = false,
  onClose,
  projects,
  onCreateBudget
}) => {
  const [budgetName, setBudgetName] = useState('');
  const [budgetNumber, setBudgetNumber] = useState(`BUD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [projectType, setProjectType] = useState('Commercial Construction');
  const [preparedBy, setPreparedBy] = useState('Alex Chen');
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'proj-1');
  const [method, setMethod] = useState<string>('template');

  if (!isOpen && !isFullScreenPage) return null;

  const isValid = budgetName.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onCreateBudget({
      budgetName: budgetName.trim(),
      budgetNumber,
      projectType,
      preparedBy,
      description,
      projectId: selectedProjectId,
      method
    });
    onClose();
  };

  const inputClass =
    'w-full h-11 bg-[#050811] border border-[#142036] rounded-xl px-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors font-medium';

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
      <div>
        <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
          Budget Name <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          required
          autoFocus
          value={budgetName}
          onChange={(e) => setBudgetName(e.target.value)}
          placeholder="e.g. Austin Commercial Center Master Budget"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
            Budget Number
          </label>
          <input
            type="text"
            value={budgetNumber}
            onChange={(e) => setBudgetNumber(e.target.value)}
            className={`${inputClass} font-mono`}
          />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
            Project Type
          </label>
          <CustomSelect
            value={projectType}
            onChange={setProjectType}
            options={['Commercial Construction', 'Custom Residential', 'Multi-Family Rehab', 'Tenant Improvement']}
            size="md"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
            Attach to Project
          </label>
          <CustomSelect
            value={selectedProjectId}
            onChange={setSelectedProjectId}
            options={projects.map(p => ({ value: p.id, label: `${p.name} (${p.cityState})` }))}
            size="md"
          />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
            Prepared By
          </label>
          <input
            type="text"
            placeholder="Alex Chen"
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
          Budget Methodology
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'template', title: 'CSI 16-Division Template', desc: 'Pre-populated division codes' },
            { id: 'ai', title: 'BuildScope AI Takeoff', desc: 'Auto-extract bill of quantities' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                method === m.id
                  ? 'bg-blue-600/10 border-blue-500 text-white font-bold'
                  : 'bg-[#050811] border-[#142036] text-slate-400 hover:border-slate-700'
              }`}
            >
              <h4 className="text-xs font-bold text-white">{m.title}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[12px] font-semibold text-slate-300 mb-1 block">
          Scope / Notes
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Initial master CSI budget ledger notes..."
          rows={2}
          className="w-full bg-[#050811] border border-[#142036] rounded-xl p-3 text-white text-xs outline-none focus:border-blue-500 resize-none font-medium"
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#142036] mt-2 gap-3">
        <button
          type="button"
          onClick={onClose}
          className="btn-md border border-[#142036] bg-[#050811] text-slate-300 hover:text-white active:scale-95"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!isValid}
          className={`btn-lg flex-1 shadow-md ${
            isValid
              ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-500/25 active:scale-95'
              : 'bg-[#0D1422] text-slate-500 border border-[#142036] cursor-not-allowed'
          }`}
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Create Master Budget</span>
        </button>
      </div>
    </form>
  );

  if (isFullScreenPage) {
    return (
      <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Budgets</span>
          </button>
          <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
            Master Ledger
          </span>
        </div>

        <div className="bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col text-slate-100">
          <div className="pb-3 border-b border-[#142036] mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Create Project Budget
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Initialize CSI MasterFormat cost ledger
              </p>
            </div>
          </div>

          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[440px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col text-slate-100">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#142036] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Create Project Budget
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Initialize CSI MasterFormat cost ledger
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {formContent}
      </div>
    </div>
  );
};
