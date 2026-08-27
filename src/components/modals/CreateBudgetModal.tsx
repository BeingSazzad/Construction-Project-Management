import React, { useState } from 'react';
import { 
  X, Check, ChevronRight, ChevronLeft, Sparkles, Building2, 
  User, FileText, Plus, LayoutGrid, Copy, FileSpreadsheet, 
  Upload, Sparkle 
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (budgetData: any) => void;
}

export const CreateBudgetModal: React.FC<CreateBudgetModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [budgetName, setBudgetName] = useState('');
  const [internalBudgetNum, setInternalBudgetNum] = useState('BUD-2026-001');
  const [projectType, setProjectType] = useState('Custom Home');
  const [budgetStatus, setBudgetStatus] = useState('Draft');
  const [preparedBy, setPreparedBy] = useState('');
  const [description, setDescription] = useState('');

  // Step 3 Team State (Matching Screenshot 1)
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string; role: string }[]>([]);

  // Step 4 Method State (Matching Screenshot 2 & 3)
  const [selectedMethod, setSelectedMethod] = useState<string>('blank');

  if (!isOpen) return null;

  const METHOD_OPTIONS = [
    {
      id: 'blank',
      title: 'Start from blank',
      desc: 'Empty budget with default categories',
      icon: LayoutGrid,
      iconColor: 'text-teal-400'
    },
    {
      id: 'template',
      title: 'Use a company template',
      desc: 'Pre-filled from saved template',
      icon: FileText,
      iconColor: 'text-slate-400'
    },
    {
      id: 'duplicate',
      title: 'Duplicate an existing budget',
      desc: 'Copy from a prior budget',
      icon: Copy,
      iconColor: 'text-slate-400'
    },
    {
      id: 'estimate',
      title: 'Import an estimate',
      desc: 'Bring in estimate line items',
      icon: FileSpreadsheet,
      iconColor: 'text-slate-400'
    },
    {
      id: 'buildscope',
      title: 'Import from BuildScope AI',
      desc: 'Use approved quantities & scopes',
      icon: Sparkles,
      iconColor: 'text-slate-400'
    },
    {
      id: 'csv',
      title: 'Import CSV',
      desc: 'Upload a CSV file',
      icon: Upload,
      iconColor: 'text-slate-400'
    },
    {
      id: 'latti',
      title: 'Latti-assisted setup',
      desc: 'Let Latti guide the process',
      icon: Sparkle,
      iconColor: 'text-teal-400'
    },
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as any);
    } else {
      if (onSave) {
        onSave({
          budgetName: budgetName || 'New Project Budget',
          internalBudgetNum,
          projectType,
          budgetStatus,
          preparedBy: preparedBy || 'Admin',
          description,
          method: selectedMethod,
          teamMembers
        });
      }
      onClose();
    }
  };

  const handleAddMember = () => {
    const newM = {
      id: `tm-${Date.now()}`,
      name: 'Michael Chang',
      role: 'Finance Approver'
    };
    setTeamMembers(prev => [...prev, newM]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-sans">
      <div className="card-dark w-full max-w-lg bg-[#0C121E] border border-[#1C2C45] rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#182438] pb-3">
          <h2 className="text-base font-extrabold text-white">Create Project Budget</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Step Progress Indicators (Matching Screenshots 1, 2, 3) */}
        <div className="flex items-center justify-between px-2 py-1">
          {[
            { step: 1, label: 'Identity' },
            { step: 2, label: 'Attach' },
            { step: 3, label: 'Team' },
            { step: 4, label: 'Method' },
          ].map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;

            return (
              <div key={s.step} className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    isActive
                      ? 'bg-[#00D2B4] text-slate-950 ring-4 ring-[#00D2B4]/20'
                      : isCompleted
                      ? 'bg-[#00D2B4] text-slate-950'
                      : 'bg-[#151F33] text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.step}
                </div>
                <span className={`text-xs font-bold ${isActive || isCompleted ? 'text-white' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Identity Form Fields (Matching Previous Screenshot 4) */}
        {currentStep === 1 && (
          <form onSubmit={handleNext} className="flex flex-col gap-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Budget Name *</label>
                <input
                  type="text"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  placeholder="e.g. Maple Ridge Residence Budget"
                  required
                  className="w-full bg-[#080D17] border border-[#00D2B4] rounded-xl px-3 py-2 text-white outline-none ring-1 ring-[#00D2B4]/40"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Internal Budget #</label>
                <input
                  type="text"
                  value={internalBudgetNum}
                  onChange={(e) => setInternalBudgetNum(e.target.value)}
                  className="w-full bg-[#080D17] border border-[#182438] rounded-xl px-3 py-2 text-white outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Type</label>
                <CustomSelect
                  value={projectType}
                  onChange={setProjectType}
                  options={['Custom Home', 'Remodel', 'Commercial Fitout', 'Multi-Family']}
                  size="md"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Budget Status</label>
                <CustomSelect
                  value={budgetStatus}
                  onChange={setBudgetStatus}
                  options={['Draft', 'In Review', 'Approved']}
                  size="md"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Prepared By</label>
              <input
                type="text"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#080D17] border border-[#182438] rounded-xl px-3 py-2 text-white outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the budget scope"
                rows={2}
                className="w-full bg-[#080D17] border border-[#182438] rounded-xl p-3 text-white outline-none focus:border-teal-400 resize-none"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#182438]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                &lt; Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#00D2B4] hover:bg-[#00baa0] text-slate-950 text-xs font-black transition-all flex items-center gap-1 shadow cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Attach to Project / Standalone */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-3 text-xs">
            <p className="text-slate-300">Choose how this budget should connect to existing company entities:</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#080D18] border border-teal-500/40 cursor-pointer">
                <input type="radio" name="attachType" defaultChecked className="accent-teal-400" />
                <div>
                  <div className="font-bold text-white">Standalone Budget</div>
                  <div className="text-[11px] text-slate-400">Independent cost model for initial client bidding & opportunity</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#080D18] border border-[#182438] cursor-pointer">
                <input type="radio" name="attachType" className="accent-teal-400" />
                <div>
                  <div className="font-bold text-white">Link to Active Project</div>
                  <div className="text-[11px] text-slate-400">Attach directly to Riverside Complex or Downtown Tower</div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#182438]">
              <button onClick={() => setCurrentStep(1)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer">
                &lt; Back
              </button>
              <button onClick={() => setCurrentStep(3)} className="px-6 py-2.5 rounded-xl bg-[#00D2B4] hover:bg-[#00baa0] text-slate-950 text-xs font-black flex items-center gap-1 cursor-pointer">
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Team (Matching Screenshot 1) */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4 text-xs py-3">
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 flex flex-col items-center gap-4">
                <p className="text-slate-400 text-xs font-medium">
                  No team members yet. Add people to assign roles and permissions.
                </p>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-4 py-2 rounded-xl bg-[#141F33] hover:bg-[#1C2C47] text-slate-200 text-xs font-bold border border-[#223352] transition-colors cursor-pointer"
                >
                  + Add Team Member
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {teamMembers.map(m => (
                  <div key={m.id} className="p-3 rounded-xl bg-[#080D18] border border-[#182438] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-400">{m.role}</div>
                    </div>
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">Assigned</span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="py-1.5 text-xs text-teal-400 hover:underline font-bold"
                >
                  + Add Another Member
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#182438]">
              <button onClick={() => setCurrentStep(2)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer">
                &lt; Back
              </button>
              <button onClick={() => setCurrentStep(4)} className="px-6 py-2.5 rounded-xl bg-[#00D2B4] hover:bg-[#00baa0] text-slate-950 text-xs font-black flex items-center gap-1 cursor-pointer">
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Method (Matching Screenshots 2 & 3 with 7 Options) */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-2.5 text-xs max-h-[420px] overflow-y-auto pr-1">
            <div className="flex flex-col gap-2">
              {METHOD_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedMethod === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedMethod(opt.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-[#0E1726] border-teal-400 shadow-md'
                        : 'bg-[#080D18] border-[#182438] hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-[#111A2E] flex items-center justify-center flex-shrink-0 ${opt.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-xs">{opt.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#182438] sticky bottom-0 bg-[#0C121E]">
              <button onClick={() => setCurrentStep(3)} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer">
                &lt; Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#00D2B4] hover:bg-[#00baa0] text-slate-950 text-xs font-black shadow cursor-pointer"
              >
                Create Budget
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
