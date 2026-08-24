import React, { useState } from 'react';
import { Project, Task, Priority } from '../../types';
import { Button } from '../common/Button';
import { X, CheckSquare, Calendar, User as UserIcon, Tag, MapPin } from 'lucide-react';

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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [dueDate, setDueDate] = useState('2025-05-22');
  const [milestone, setMilestone] = useState('Structural Framing');
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
      projectName: project?.name || 'Riverside Office Complex',
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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-dark w-full max-w-[390px] bg-[#0E1524] border-cyan-500/40 p-5 rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2A44] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Create Task</h3>
              <p className="text-[10px] text-cyan-400 truncate">{project?.name || 'Active Project'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#162033] text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-300 mb-1 block">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Formwork Stripping Bay 4"
              className="w-full h-11 bg-[#111827] border border-[#23334F] rounded-xl px-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="font-bold text-slate-300 mb-1 block">Description & Scope</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail required procedures, specifications, and safety precautions..."
              className="w-full bg-[#111827] border border-[#23334F] rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-300 mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full h-11 bg-[#111827] border border-[#23334F] rounded-xl px-3 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-300 mb-1 block">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-11 bg-[#111827] border border-[#23334F] rounded-xl px-3 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-300 mb-1 block">Milestone</label>
              <input
                type="text"
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                className="w-full h-11 bg-[#111827] border border-[#23334F] rounded-xl px-3 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 mb-1 block">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 bg-[#111827] border border-[#23334F] rounded-xl px-3 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 mb-1 block">Assignee</label>
            <select
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
              className="w-full h-11 bg-[#111827] border border-[#23334F] rounded-xl px-3 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="John Smith">John Smith (Superintendent)</option>
              <option value="Sarah Johnson">Sarah Johnson (Project Manager)</option>
              <option value="Mike Davis">Mike Davis (Site Engineer)</option>
            </select>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary">
              Assign & Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
