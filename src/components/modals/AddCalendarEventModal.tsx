import React, { useState } from 'react';
import { Project, CalendarEventType, CalendarEventPriority, CalendarEventItem } from '../../types';
import { X, Calendar as CalendarIcon, Clock, Plus, Tag, FolderKanban, AlertCircle } from 'lucide-react';

interface AddCalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onAddEvent: (event: CalendarEventItem) => void;
  initialDate?: string;
}

export const AddCalendarEventModal: React.FC<AddCalendarEventModalProps> = ({
  isOpen,
  onClose,
  projects,
  onAddEvent,
  initialDate
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<CalendarEventType>('Inspection');
  const [projectId, setProjectId] = useState<string>('');
  const [priority, setPriority] = useState<CalendarEventPriority>('Medium');
  const [time, setTime] = useState('09:00 AM');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedProj = projects.find(p => p.id === projectId);

    const newEvent: CalendarEventItem = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      date,
      type,
      projectId: projectId || undefined,
      projectName: selectedProj?.name,
      priority,
      time,
      notes: notes.trim() || undefined
    };

    onAddEvent(newEvent);
    onClose();
  };

  const EVENT_TYPES: CalendarEventType[] = ['Inspection', 'Start Date', 'Milestone', 'Meeting', 'Delivery', 'Other'];
  const PRIORITIES: CalendarEventPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="w-full max-w-[420px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-slate-100 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#3875F6] flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-none">Add to Calendar</h2>
              <p className="text-[10px] text-slate-400 mt-1">Schedule milestone, inspection, or task</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#0E1A33] border border-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Title */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rough Inspection, Foundation Pour..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#091122] border border-[#172540] focus:border-blue-500 focus:outline-none text-white placeholder-slate-500"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#091122] border border-[#172540] focus:border-blue-500 focus:outline-none text-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#091122] border border-[#172540] focus:border-blue-500 focus:outline-none text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CalendarEventType)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#091122] border border-[#172540] focus:border-blue-500 focus:outline-none text-white cursor-pointer"
              >
                {EVENT_TYPES.map(t => (
                  <option key={t} value={t} className="bg-[#091122] text-white">{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CalendarEventPriority)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#091122] border border-[#172540] focus:border-blue-500 focus:outline-none text-white cursor-pointer"
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p} className="bg-[#091122] text-white">{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Association */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Project <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#091122] border border-[#172540] focus:border-blue-500 focus:outline-none text-white cursor-pointer"
            >
              <option value="" className="bg-[#091122] text-slate-400">All / Unassigned</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-[#091122] text-white">{p.name}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Notes / Location
            </label>
            <input
              type="text"
              placeholder="e.g. Inspector Dave on-site, Level 4 north zone"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#091122] border border-[#172540] focus:border-blue-500 focus:outline-none text-white placeholder-slate-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-[#142036]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#091122] border border-[#172540] hover:bg-[#0E1A33] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Calendar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
