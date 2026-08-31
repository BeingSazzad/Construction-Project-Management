import React, { useState } from 'react';
import { Project, Task, Priority } from '../../types';
import { ArrowLeft, CheckSquare, Calendar, User as UserIcon, Tag, MapPin, Check } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';
import { DEFAULT_PROJECT_MILESTONES } from '../../data/projectMilestones';

interface CreateTaskViewProps {
  project?: Project | null;
  onBack: () => void;
  onCreate: (task: Partial<Task>) => void;
}

export const CreateTaskView: React.FC<CreateTaskViewProps> = ({
  project,
  onBack,
  onCreate
}) => {
  const milestoneOptions = DEFAULT_PROJECT_MILESTONES.map(m => `${m.code} ${m.name}`);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [dueDate, setDueDate] = useState('2026-06-15');
  const [milestone, setMilestone] = useState(milestoneOptions[2] || 'MS-03 Structural Framing & Concrete Slabs');
  const [location, setLocation] = useState('Level 12 Deck');
  const [assigneeName, setAssigneeName] = useState('John Smith (Superintendent)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title,
      description,
      priority,
      status: 'Not Started',
      dueDate,
      startDate: '2026-06-01',
      milestone,
      location,
      projectId: project?.id || 'proj-1',
      projectName: project?.name || 'Riverside Office Complex',
      assignee: {
        id: 'usr_field',
        name: assigneeName.split(' (')[0],
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        role: 'Superintendent'
      },
      subtasks: [
        { id: `st-${Date.now()}-1`, title: 'Safety inspection & tool box talk', completed: false },
        { id: `st-${Date.now()}-2`, title: 'Execute primary trade scope', completed: false }
      ],
      attachmentsCount: 1,
      notesCount: 0
    });
    onBack();
  };

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Top Header with Back Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          New Task
        </span>
      </div>

      <div className="bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col text-slate-100">
        <div className="pb-3 border-b border-[#142036] mb-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight leading-tight">
              Create Construction Task
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Assign trade scope, location & milestone
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Inspect Rebar Placement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500 placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Priority Level</label>
              <CustomSelect
                value={priority}
                onChange={(v) => setPriority(v as Priority)}
                options={['Low', 'Medium', 'High', 'Critical']}
                size="md"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Trade Milestone</label>
              <CustomSelect
                value={milestone}
                onChange={setMilestone}
                options={milestoneOptions}
                size="md"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Location / Zone</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Assigned Superintendent / Lead</label>
            <CustomSelect
              value={assigneeName}
              onChange={setAssigneeName}
              options={['John Smith (Superintendent)', 'Sarah Johnson (Lead PM)', 'Dave Miller (Field Engineer)']}
              size="md"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-slate-300 mb-1 block">Scope Notes & Description</label>
            <textarea
              rows={3}
              placeholder="Provide specific trade instructions, inspection requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#050811] border border-[#142036] rounded-xl p-3 text-white text-xs outline-none focus:border-blue-500 resize-none placeholder-slate-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#142036] mt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 h-10 rounded-xl border border-[#142036] bg-[#050811] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
