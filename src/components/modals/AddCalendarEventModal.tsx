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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in font-sans">
      <div className="w-full max-w-[420px] bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#171A1F] animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEDF1]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-blue-200 text-[#1677FF] flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#171A1F] leading-none">Add to Calendar</h2>
              <p className="text-[10px] text-[#68707C] mt-1">Schedule milestone, inspection, or task</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-[#68707C] block mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rough Inspection, Foundation Pour..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] placeholder-[#9DA5B1] transition-colors"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-[#68707C] block mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#68707C] block mb-1">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] placeholder-[#9DA5B1] transition-colors"
              />
            </div>
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-[#68707C] block mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CalendarEventType)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] cursor-pointer transition-colors"
              >
                {EVENT_TYPES.map(t => (
                  <option key={t} value={t} className="bg-white text-[#171A1F]">{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#68707C] block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CalendarEventPriority)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] cursor-pointer transition-colors"
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p} className="bg-white text-[#171A1F]">{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Association */}
          <div>
            <label className="text-xs font-bold text-[#68707C] block mb-1">
              Project <span className="text-[#9DA5B1] font-normal">(Optional)</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] cursor-pointer transition-colors"
            >
              <option value="" className="bg-white text-[#68707C]">All / Unassigned</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-white text-[#171A1F]">{p.name}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-[#68707C] block mb-1">
              Notes / Location
            </label>
            <input
              type="text"
              placeholder="e.g. Inspector Dave on-site, Level 4 north zone"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] placeholder-[#9DA5B1] transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-[#EAEDF1]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-xs font-semibold text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-xs font-bold text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
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
