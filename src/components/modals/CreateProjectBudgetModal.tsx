import React, { useState } from 'react';
import { X, DollarSign, ArrowLeft, Check } from 'lucide-react';
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
  const [preparedBy, setPreparedBy] = useState('Avery Scott');
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
    'w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] transition-colors font-medium';

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
      <div>
        <label className="text-xs font-semibold text-[#171A1F] mb-1 block">
          Budget Name <span className="text-rose-500">*</span>
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
          <label className="text-xs font-semibold text-[#171A1F] mb-1 block">
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
          <label className="text-xs font-semibold text-[#171A1F] mb-1 block">
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
          <label className="text-xs font-semibold text-[#171A1F] mb-1 block">
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
          <label className="text-xs font-semibold text-[#171A1F] mb-1 block">
            Prepared By
          </label>
          <input
            type="text"
            placeholder="Avery Scott"
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#171A1F] mb-1 block">
          Budget Methodology
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'template', title: 'CSI 16-Division Template', desc: 'Pre-populated division codes' },
            { id: 'blank', title: 'Blank Ledger', desc: 'Start with clean line items' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                method === m.id
                  ? 'bg-[#EAF3FF] border-[#1677FF] text-[#1677FF]'
                  : 'bg-[#F7F8FA] border-[#DDE1E7] text-[#68707C] hover:bg-white'
              }`}
            >
              <h4 className="text-xs font-bold text-[#171A1F]">{m.title}</h4>
              <p className="text-[11px] text-[#68707C] mt-0.5">{m.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#171A1F] mb-1 block">
          Scope / Notes
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Initial master CSI budget ledger notes..."
          rows={2}
          className="w-full bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl p-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] resize-none font-medium leading-relaxed"
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#EAEDF1] mt-2 gap-3">
        <button
          type="button"
          onClick={onClose}
          className="btn-md border border-[#DDE1E7] bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] active:scale-95"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!isValid}
          className={`btn-lg flex-1 shadow-xs ${
            isValid
              ? 'bg-[#1677FF] hover:bg-[#0958D9] text-white active:scale-95'
              : 'bg-[#F2F2F7] text-[#9DA5B1] border border-[#DDE1E7] cursor-not-allowed'
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
      <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in bg-[#F2F2F7]">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEDF1]">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-bold text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Budgets</span>
          </button>
          <span className="text-xs font-bold text-[#1677FF] bg-[#EAF3FF] px-2.5 py-1 rounded-full border border-[#1677FF]/20">
            Master Ledger
          </span>
        </div>

        <div className="bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col text-[#171A1F]">
          <div className="pb-3 border-b border-[#EAEDF1] mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#171A1F] tracking-tight">
                Create Project Budget
              </h2>
              <p className="text-xs text-[#68707C] font-medium mt-0.5">
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[440px] bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col text-[#171A1F]">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#EAEDF1] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#171A1F] tracking-tight">
                Create Project Budget
              </h3>
              <p className="text-xs text-[#68707C] font-medium mt-0.5">
                Initialize CSI MasterFormat cost ledger
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] border border-[#DDE1E7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {formContent}
      </div>
    </div>
  );
};
