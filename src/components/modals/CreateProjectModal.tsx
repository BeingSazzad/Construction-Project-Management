import React, { useState } from 'react';
import { Project } from '../../types';
import { X, Building2 } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newProject: Partial<Project>) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('NYC-2025-09');
  const [location, setLocation] = useState('750 Madison Ave');
  const [cityState, setCityState] = useState('New York, NY');
  const [budget, setBudget] = useState('5200000');
  const [pmName, setPmName] = useState('Sarah Johnson');
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2026-12-15');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name,
      code,
      location,
      cityState,
      status: 'Planning',
      progress: 0,
      startDate,
      targetEndDate: endDate,
      budget: {
        total: parseFloat(budget) || 5000000,
        committed: 0,
        actual: 0,
        paid: 0,
        remaining: parseFloat(budget) || 5000000,
        variance: 0,
        costToComplete: parseFloat(budget) || 5000000
      },
      projectManager: {
        id: 'usr_pm',
        name: pmName,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      },
      metrics: {
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        openPunchItems: 0,
        totalMilestones: 4,
        completedMilestones: 0
      },
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
      description: `${name} general commercial contracting project.`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] bg-[#0C121E] border border-[#1A263E] rounded-3xl p-5 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#162033] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Create New Project</h3>
              <p className="text-xs text-slate-400 font-medium">Initialize workspace & budget ledger</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#141F33] hover:bg-[#1C2C47] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-slate-100">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Project Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Midtown Medical Center"
              className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl px-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Project Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">City, State</label>
              <input
                type="text"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Approved Capital Budget ($ USD)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-[#2563EB] font-mono transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Target Completion</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Assigned Project Manager</label>
            <CustomSelect
              value={pmName}
              onChange={setPmName}
              options={[
                { value: 'Sarah Johnson', label: 'Sarah Johnson (Senior PM)' },
                { value: 'David Vance', label: 'David Vance (Commercial PM)' },
                { value: 'Elena Rossi', label: 'Elena Rossi (Infrastructure Lead)' }
              ]}
              size="md"
            />
          </div>

          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl bg-[#141F33] hover:bg-[#1A2842] text-slate-300 font-semibold text-sm cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm cursor-pointer transition-all shadow-md"
            >
              Initialize Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
