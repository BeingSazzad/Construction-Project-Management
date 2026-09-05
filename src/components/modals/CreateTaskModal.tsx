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

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  project,
  onClose,
  onCreate
}) => {
  const milestoneOptions = DEFAULT_PROJECT_MILESTONES.map(m => `${m.code} ${m.name}`);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [dueDate, setDueDate] = useState('2025-05-22');
  const [milestone, setMilestone] = useState(milestoneOptions[2] || 'MS-03 Structural Framing & Concrete Slabs');
  const [location, setLocation] = useState('Level 12 Deck');
  const [assigneeName, setAssigneeName] = useState('John Smith');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title,
      description,
      priority,
      status: 'Not Started',
      dueDate,
      startDate: '2025-05-20',
      milestone,
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
        { id: `st-${Date.now()}-1`, title: 'Safety inspection & tool box talk', completed: false },
        { id: `st-${Date.now()}-2`, title: 'Execute primary trade scope', completed: false }
      ],
      attachmentsCount: 1,
      notesCount: 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] bg-white border border-[#DDE1E7] p-5 rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-[#171A1F]">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEDF1] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/20 flex items-center justify-center">
              <CheckSquare className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171A1F]">Create Task</h3>
              <p className="text-[11px] text-[#68707C] truncate">{project?.name || 'Snell Isle Residence'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="font-bold text-[#68707C] mb-1 block">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Formwork Stripping Bay 4"
              className="w-full h-10 bg-white border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] placeholder-[#9DA5B1] focus:outline-none focus:border-[#1677FF]"
            />
          </div>

          <div>
            <label className="font-bold text-[#68707C] mb-1 block">Description & Scope</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail required procedures, specifications, and safety precautions..."
              className="w-full bg-white border border-[#DDE1E7] rounded-xl p-3 text-[#171A1F] placeholder-[#9DA5B1] focus:outline-none focus:border-[#1677FF] resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-[#68707C] mb-1 block">Priority</label>
              <CustomSelect
                value={priority}
                onChange={(v) => setPriority(v as Priority)}
                options={['Low', 'Medium', 'High', 'Critical']}
                size="md"
              />
            </div>
            <div>
              <label className="font-bold text-[#68707C] mb-1 block">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 bg-white border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-[#68707C] mb-1 block">Milestone</label>
              <CustomSelect
                value={milestone}
                onChange={setMilestone}
                options={milestoneOptions}
                size="md"
              />
            </div>
            <div>
              <label className="font-bold text-[#68707C] mb-1 block">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 bg-white border border-[#DDE1E7] rounded-xl px-3 text-[#171A1F] focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#68707C] mb-1 block">Assignee</label>
            <CustomSelect
              value={assigneeName}
              onChange={setAssigneeName}
              options={[
                { value: 'John Smith', label: 'John Smith (Superintendent)' },
                { value: 'Sarah Johnson', label: 'Sarah Johnson (Project Manager)' },
                { value: 'Mike Davis', label: 'Mike Davis (Site Engineer)' }
              ]}
              size="md"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Assign & Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
