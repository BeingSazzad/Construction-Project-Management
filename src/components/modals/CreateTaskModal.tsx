import React, { useState } from 'react';
import { Project, Task, Priority } from '../../types';
import { X, CheckSquare } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';
import { DEFAULT_PROJECT_MILESTONES } from '../../data/projectMilestones';

interface CreateTaskModalProps {
  isOpen: boolean;
  project?: Project | null;
  onClose: () => void;
  onCreate: (task: Partial<Task>) => void;
}

const MILESTONE_COST_CODE_MAP: Record<string, string> = {
  'MS-01': '02-1000 Earthwork & Site Clearing',
  'MS-02': '03-3000 Cast-in-Place Concrete Foundation',
  'MS-03': '06-1000 Superstructure Framing',
  'MS-04': '22-0000 Plumbing & Mechanical',
  'MS-05': '08-4400 Glazing & Windows',
  'MS-06': '09-2200 Interior Finishes & Drywall',
  'MS-07': '01-7700 Project Closeout'
};

const getAutoCostCode = (ms: string) => {
  const codePrefix = ms.split(' ')[0];
  return MILESTONE_COST_CODE_MAP[codePrefix] || '01-3100 General Conditions';
};

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  project,
  onClose,
  onCreate
}) => {
  const milestoneOptions = DEFAULT_PROJECT_MILESTONES.map(m => `${m.code} ${m.name}`);
  const initialMilestone = milestoneOptions[2] || 'MS-03 Structural Framing & Concrete Slabs';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [milestone, setMilestone] = useState(initialMilestone);
  const [costCode, setCostCode] = useState(() => getAutoCostCode(initialMilestone));
  const [showCostCodeOverride, setShowCostCodeOverride] = useState(false);
  const [location, setLocation] = useState('Level 12 Deck');
  const [assigneeName, setAssigneeName] = useState('John Smith');

  if (!isOpen) return null;

  const handleMilestoneChange = (newMilestone: string) => {
    setMilestone(newMilestone);
    if (!showCostCodeOverride) {
      setCostCode(getAutoCostCode(newMilestone));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'Not Started',
      dueDate,
      startDate: new Date().toISOString().split('T')[0],
      milestone,
      costCode: costCode.split(' ')[0],
      location,
      projectId: project?.id || 'proj-1',
      projectName: project?.name || 'Snell Isle Residence',
      assignee: {
        id: 'usr_field',
        name: assigneeName,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        role: 'Superintendent'
      },
      subtasks: [
        { id: `st-${Date.now()}-1`, title: 'Verify site clearance & safety prep', completed: false },
        { id: `st-${Date.now()}-2`, title: 'Execute trade work & quality sign-off', completed: false }
      ],
      attachmentsCount: 0,
      notesCount: 0
    });

    // Reset & Close
    setTitle('');
    setDescription('');
    setShowCostCodeOverride(false);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] bg-white border border-[#E2E8F0] rounded-t-[28px] sm:rounded-3xl p-5 pb-7 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-3.5 text-[#0F172A] animate-slide-up"
      >
        {/* Mobile Pull Bar */}
        <div className="w-10 h-1 rounded-full bg-[#CBD5E1] mx-auto sm:hidden -mt-1" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">New Task</h3>
              <p className="text-xs text-[#64748B] mt-0.5 font-normal">
                {project?.name || 'Snell Isle Residence'} · Field Assignment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-[#475569] mb-1 block">
              Task Title <span className="text-[#E5484D]">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Concrete Slump & Pour Quality Inspection"
              className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 transition-all"
            />
          </div>

          {/* Description & Scope */}
          <div>
            <label className="text-xs font-semibold text-[#475569] mb-1 block">
              Scope & Instructions
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail required inspection procedures, ASTM standards, or trade handover..."
              className="w-full bg-white border border-[#E2E8F0] rounded-xl p-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 resize-none leading-relaxed transition-all"
            />
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-[#475569] mb-1 block">Priority</label>
              <CustomSelect
                value={priority}
                onChange={(v) => setPriority(v as Priority)}
                options={['Low', 'Medium', 'High', 'Critical']}
                size="md"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#475569] mb-1 block">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 transition-all"
              />
            </div>
          </div>

          {/* Milestone (Full-Width with Smart Auto-Mapped Cost Code) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#475569] block">
              Milestone & Schedule Phase
            </label>
            <CustomSelect
              value={milestone}
              onChange={handleMilestoneChange}
              options={milestoneOptions}
              size="md"
              fullWidth={true}
            />

            {/* Smart Linked Cost Code Badge (Finance Assurance) */}
            {!showCostCodeOverride ? (
              <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-0.5 px-0.5">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="text-[#94A3B8]">Auto-linked Cost Code:</span>
                  <span className="font-mono font-bold text-[#1677FF] bg-[#EAF3FF] px-1.5 py-0.5 rounded text-[10px]">
                    {costCode.split(' ')[0]}
                  </span>
                  <span className="text-[#475569] font-medium truncate">
                    {costCode.split(' ').slice(1).join(' ')}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowCostCodeOverride(true)}
                  className="text-[10px] font-semibold text-[#1677FF] hover:underline cursor-pointer shrink-0 ml-2"
                >
                  Change
                </button>
              </div>
            ) : (
              /* Optional Accounting Override Drawer */
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col gap-1.5 animate-fade-in mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#475569]">
                    Finance Cost Code Override
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCostCodeOverride(false);
                      setCostCode(getAutoCostCode(milestone));
                    }}
                    className="text-[10px] font-medium text-[#1677FF] hover:underline cursor-pointer"
                  >
                    Reset to Auto
                  </button>
                </div>
                <CustomSelect
                  value={costCode}
                  onChange={(val) => setCostCode(val)}
                  options={[
                    '01-3100 General Conditions',
                    '02-1000 Earthwork & Site Clearing',
                    '03-3000 Cast-in-Place Concrete',
                    '06-1000 Superstructure Framing',
                    '08-4400 Glazing & Windows',
                    '09-2200 Interior Finishes & Drywall',
                    '22-0000 Plumbing',
                    '26-0000 Electrical'
                  ]}
                  size="sm"
                  fullWidth={true}
                />
              </div>
            )}
          </div>

          {/* Location & Assignee */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-[#475569] mb-1 block">Site Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Level 12 Core"
                className="w-full h-10 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/15 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#475569] mb-1 block">Assignee</label>
              <CustomSelect
                value={assigneeName}
                onChange={setAssigneeName}
                options={[
                  { value: 'John Smith', label: 'John Smith (Superintendent)' },
                  { value: 'Sarah Johnson', label: 'Sarah Johnson (PM)' },
                  { value: 'Mike Davis', label: 'Mike Davis (Site Engineer)' }
                ]}
                size="md"
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[1.5] h-11 px-4 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white font-semibold text-xs shadow-xs active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
