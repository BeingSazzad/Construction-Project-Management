import React, { useState } from 'react';
import { 
  X, Check, ChevronRight, 
  FileText, LayoutGrid, Copy, FileSpreadsheet, 
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

  // Step 3 Team State
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string; role: string }[]>([]);

  // Step 4 Method State
  const [selectedMethod, setSelectedMethod] = useState<string>('blank');

  if (!isOpen) return null;

  const METHOD_OPTIONS = [
    {
      id: 'blank',
      title: 'Start from blank',
      desc: 'Empty budget with default categories',
      icon: LayoutGrid,
      iconColor: 'text-[#1677FF]'
    },
    {
      id: 'template',
      title: 'Use a company template',
      desc: 'Pre-filled from saved template',
      icon: FileText,
      iconColor: 'text-[#68707C]'
    },
    {
      id: 'duplicate',
      title: 'Duplicate an existing budget',
      desc: 'Copy from a prior budget',
      icon: Copy,
      iconColor: 'text-[#68707C]'
    },
    {
      id: 'estimate',
      title: 'Import an estimate',
      desc: 'Bring in estimate line items',
      icon: FileSpreadsheet,
      iconColor: 'text-[#68707C]'
    },
    {
      id: 'csv',
      title: 'Import CSV',
      desc: 'Upload a CSV file',
      icon: Upload,
      iconColor: 'text-[#68707C]'
    },
    {
      id: 'latti',
      title: 'Latti-assisted setup',
      desc: 'Let Latti guide the process',
      icon: Sparkle,
      iconColor: 'text-[#1677FF]'
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
          preparedBy,
          description,
          method: selectedMethod
        });
      }
      onClose();
    }
  };

  const handleAddMember = () => {
    setTeamMembers(prev => [
      ...prev,
      { id: `tm-${Date.now()}`, name: 'Sarah Johnson', role: 'Project Manager' }
    ]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[480px] bg-white border border-[#DDE1E7] rounded-3xl p-5 max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-[#171A1F] scrollbar-none gap-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEDF1]">
          <div>
            <h3 className="text-base font-bold text-[#171A1F] tracking-tight">Create Budget</h3>
            <p className="text-xs text-[#68707C] font-medium mt-0.5">
              Set up a master construction budget ledger
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Step Progress Indicators */}
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
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-[#1677FF] text-white ring-4 ring-[#1677FF]/20'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#F2F2F7] text-[#68707C] border border-[#DDE1E7]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.step}
                </div>
                <span className={`text-xs font-bold ${isActive || isCompleted ? 'text-[#171A1F]' : 'text-[#9DA5B1]'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Identity Form Fields */}
        {currentStep === 1 && (
          <form onSubmit={handleNext} className="flex flex-col gap-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#171A1F] font-semibold mb-1">Budget Name *</label>
                <input
                  type="text"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  placeholder="e.g. Maple Ridge Residence Budget"
                  required
                  className="w-full bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 py-2 text-[#171A1F] outline-none focus:border-[#1677FF] font-medium"
                />
              </div>

              <div>
                <label className="block text-[#171A1F] font-semibold mb-1">Internal Budget #</label>
                <input
                  type="text"
                  value={internalBudgetNum}
                  onChange={(e) => setInternalBudgetNum(e.target.value)}
                  className="w-full bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 py-2 text-[#171A1F] outline-none focus:border-[#1677FF] font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#171A1F] font-semibold mb-1">Project Type</label>
                <CustomSelect
                  value={projectType}
                  onChange={setProjectType}
                  options={['Custom Home', 'Remodel', 'Commercial Fitout', 'Multi-Family']}
                  size="md"
                />
              </div>

              <div>
                <label className="block text-[#171A1F] font-semibold mb-1">Budget Status</label>
                <CustomSelect
                  value={budgetStatus}
                  onChange={setBudgetStatus}
                  options={['Draft', 'In Review', 'Approved']}
                  size="md"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#171A1F] font-semibold mb-1">Prepared By</label>
              <input
                type="text"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3 py-2 text-[#171A1F] outline-none focus:border-[#1677FF] font-medium"
              />
            </div>

            <div>
              <label className="block text-[#171A1F] font-semibold mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the budget scope"
                rows={2}
                className="w-full bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl p-3 text-[#171A1F] outline-none focus:border-[#1677FF] resize-none font-medium"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#EAEDF1]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#68707C] hover:text-[#171A1F] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
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
            <p className="text-[#68707C] font-medium">Choose how this budget should connect to existing company entities:</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#1677FF]/40 cursor-pointer">
                <input type="radio" name="attachType" defaultChecked className="accent-[#1677FF]" />
                <div>
                  <div className="font-bold text-[#171A1F]">Standalone Budget</div>
                  <div className="text-[12px] text-[#68707C]">Independent cost model for initial client bidding & opportunity</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#DDE1E7] hover:bg-[#F7F8FA] cursor-pointer">
                <input type="radio" name="attachType" className="accent-[#1677FF]" />
                <div>
                  <div className="font-bold text-[#171A1F]">Link to Active Project</div>
                  <div className="text-[12px] text-[#68707C]">Attach directly to Snell Isle Residence</div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#EAEDF1]">
              <button onClick={() => setCurrentStep(1)} className="px-4 py-2 text-xs font-semibold text-[#68707C] hover:text-[#171A1F] cursor-pointer">
                &lt; Back
              </button>
              <button onClick={() => setCurrentStep(3)} className="px-6 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs">
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Team */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4 text-xs py-3">
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 flex flex-col items-center gap-4">
                <p className="text-[#68707C] text-xs font-medium">
                  No team members yet. Add people to assign roles and permissions.
                </p>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-4 py-2 rounded-xl bg-[#EAF3FF] hover:bg-[#D4E8FF] text-[#1677FF] text-xs font-bold border border-[#1677FF]/20 transition-colors cursor-pointer"
                >
                  + Add Team Member
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {teamMembers.map(m => (
                  <div key={m.id} className="p-3 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#171A1F]">{m.name}</div>
                      <div className="text-[10px] text-[#68707C]">{m.role}</div>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">Assigned</span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="py-1.5 text-xs text-[#1677FF] hover:underline font-bold"
                >
                  + Add Another Member
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#EAEDF1]">
              <button onClick={() => setCurrentStep(2)} className="px-4 py-2 text-xs font-semibold text-[#68707C] hover:text-[#171A1F] cursor-pointer">
                &lt; Back
              </button>
              <button onClick={() => setCurrentStep(4)} className="px-6 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs">
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Method */}
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
                        ? 'bg-[#EAF3FF] border-[#1677FF] shadow-xs'
                        : 'bg-white border-[#DDE1E7] hover:bg-[#F7F8FA]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-[#F2F2F7] flex items-center justify-center flex-shrink-0 ${opt.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-[#171A1F] text-xs">{opt.title}</div>
                      <div className="text-[12px] text-[#68707C] mt-0.5">{opt.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#EAEDF1] sticky bottom-0 bg-white">
              <button onClick={() => setCurrentStep(3)} className="px-4 py-2 text-xs font-semibold text-[#68707C] hover:text-[#171A1F] cursor-pointer">
                &lt; Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95"
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
