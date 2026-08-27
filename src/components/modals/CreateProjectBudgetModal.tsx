import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, Building2, Users, FileSpreadsheet, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
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
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Identity
  const [budgetName, setBudgetName] = useState('Austin Commercial Center Budget');
  const [budgetNumber, setBudgetNumber] = useState('BUD-2026-009');
  const [projectType, setProjectType] = useState('Commercial Construction');
  const [budgetStatus, setBudgetStatus] = useState<'Draft' | 'Active' | 'Approved'>('Draft');
  const [preparedBy, setPreparedBy] = useState('Alex Chen (Principal)');
  const [description, setDescription] = useState('Initial master CSI budget ledger.');

  // Step 2: Attach
  const [attachType, setAttachType] = useState<'project' | 'opportunity' | 'standalone'>('project');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'proj-1');

  // Step 3: Team
  const [selectedRole, setSelectedRole] = useState('Sarah Johnson (Project Manager)');

  // Step 4: Method
  const [method, setMethod] = useState<string>('template');

  if (!isOpen && !isFullScreenPage) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as any);
    } else {
      onCreateBudget({
        budgetName,
        budgetNumber,
        projectType,
        budgetStatus,
        preparedBy,
        description,
        attachType,
        projectId: selectedProjectId,
        method
      });
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    } else {
      onClose();
    }
  };

  const content = (
    <>
      {/* 4-Step Stepper Bar */}
      <div className="flex flex-col gap-1.5 py-2 mb-2">
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { s: 1, name: 'Identity' },
            { s: 2, name: 'Attach' },
            { s: 3, name: 'Team' },
            { s: 4, name: 'Method' }
          ].map(({ s }) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-[#2563EB]' : 'bg-[#0E1A33]'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-bold px-0.5">
          <span className={step >= 1 ? 'text-blue-400' : ''}>1. Identity</span>
          <span className={step >= 2 ? 'text-blue-400' : ''}>2. Attach</span>
          <span className={step >= 3 ? 'text-blue-400' : ''}>3. Team</span>
          <span className={step >= 4 ? 'text-blue-400' : ''}>4. Method</span>
        </div>
      </div>

      {/* Step 1: Identity */}
      {step === 1 && (
        <div className="flex flex-col gap-3 animate-fade-in text-xs">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Budget Name *</label>
            <input
              type="text"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Budget Number</label>
              <input
                type="text"
                value={budgetNumber}
                onChange={(e) => setBudgetNumber(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Project Type</label>
              <CustomSelect
                value={projectType}
                onChange={setProjectType}
                options={['Commercial Construction', 'Custom Residential', 'Multi-Family Rehab']}
                size="md"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Prepared By</label>
            <input
              type="text"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Scope Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-[#050811] border border-[#142036] rounded-xl p-3 text-white text-xs outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>
      )}

      {/* Step 2: Attach */}
      {step === 2 && (
        <div className="flex flex-col gap-3 animate-fade-in text-xs">
          <label className="text-[11px] font-semibold text-slate-300">Attach Budget To:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'project', label: 'Existing Project' },
              { id: 'opportunity', label: 'Opportunity / Bid' },
              { id: 'standalone', label: 'Standalone Ledger' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAttachType(item.id as any)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  attachType === item.id
                    ? 'bg-blue-600/10 border-blue-500 text-white font-bold'
                    : 'bg-[#050811] border-[#142036] text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-[11px]">{item.label}</span>
              </button>
            ))}
          </div>

          {attachType === 'project' && (
            <div className="mt-2">
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Select Active Project</label>
              <CustomSelect
                value={selectedProjectId}
                onChange={setSelectedProjectId}
                options={projects.map(p => ({ value: p.id, label: `${p.name} (${p.cityState})` }))}
                size="md"
              />
            </div>
          )}
        </div>
      )}

      {/* Step 3: Team */}
      {step === 3 && (
        <div className="flex flex-col gap-3 animate-fade-in text-xs">
          <label className="text-[11px] font-semibold text-slate-300">Assign Project Financial Controller</label>
          {[
            { name: 'Sarah Johnson', role: 'Lead Project Manager', active: true },
            { name: 'Michael Chang', role: 'Finance Director', active: false },
            { name: 'David Miller', role: 'Senior Estimator', active: false }
          ].map((member) => (
            <div
              key={member.name}
              onClick={() => setSelectedRole(`${member.name} (${member.role})`)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                selectedRole.includes(member.name)
                  ? 'bg-blue-600/10 border-blue-500 text-white'
                  : 'bg-[#050811] border-[#142036] text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <h4 className="text-xs font-bold">{member.name}</h4>
                <p className="text-[10px] text-slate-400">{member.role}</p>
              </div>
              {selectedRole.includes(member.name) && (
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step 4: Method */}
      {step === 4 && (
        <div className="flex flex-col gap-2.5 animate-fade-in text-xs">
          <label className="text-[11px] font-semibold text-slate-300">Select Budget Creation Method</label>
          {[
            { id: 'template', title: 'CSI MasterFormat 16-Division Template', desc: 'Pre-populated commercial division codes' },
            { id: 'ai', title: 'BuildScope Blueprint Takeoff', desc: 'Auto-extract bill of quantities from architectural plans' },
            { id: 'csv', title: 'Upload Excel / CSV Worksheet', desc: 'Direct mapping from Procore/Excel export' }
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                method === m.id
                  ? 'bg-blue-600/10 border-blue-500 text-white'
                  : 'bg-[#050811] border-[#142036] text-slate-300 hover:border-slate-700'
              }`}
            >
              <h4 className="text-xs font-bold">{m.title}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Wizard Footer Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-[#142036] mt-4">
        <button
          onClick={handleBack}
          className="px-4 h-10 rounded-xl border border-[#142036] bg-[#050811] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>

        <button
          onClick={handleNext}
          className="px-5 h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95 transition-all"
        >
          <span>{step === 4 ? 'Create & Open Ledger' : 'Continue'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </>
  );

  if (isFullScreenPage) {
    return (
      <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
        {/* Top Header with Back Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Budgets</span>
          </button>
          <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
            Step {step} of 4
          </span>
        </div>

        <div className="bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col text-slate-100">
          <div className="pb-3 border-b border-[#142036] mb-3">
            <h2 className="text-base font-bold text-white tracking-tight">
              Create Project Budget
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Enterprise 4-step CSI budget wizard
            </p>
          </div>

          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[480px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        <div className="flex items-start justify-between pb-3.5 border-b border-[#142036]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Create Project Budget
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Step {step} of 4 • {step === 1 ? 'Identity' : step === 2 ? 'Attach' : step === 3 ? 'Team' : 'Method'}
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

        {content}
      </div>
    </div>
  );
};
