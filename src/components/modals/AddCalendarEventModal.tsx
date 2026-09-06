import React, { useState } from 'react';
import { Project, CalendarEventType, CalendarEventPriority, CalendarEventItem } from '../../types';
import { 
  X, Calendar as CalendarIcon, Clock, Plus, Tag, 
  Building2, MapPin, FileText, CheckCircle2 
} from 'lucide-react';

interface AddCalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onAddEvent: (event: CalendarEventItem) => void;
  initialDate?: string;
  defaultProjectId?: string;
}

export const AddCalendarEventModal: React.FC<AddCalendarEventModalProps> = ({
  isOpen,
  onClose,
  projects,
  onAddEvent,
  initialDate,
  defaultProjectId
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate || '2026-09-05');
  const [type, setType] = useState<CalendarEventType>('Inspection');
  const [projectId, setProjectId] = useState<string>(defaultProjectId || (projects.length === 1 ? projects[0].id : ''));
  const [priority, setPriority] = useState<CalendarEventPriority>('Medium');
  const [time, setTime] = useState('09:00 AM');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Determine if this modal is being opened from within a specific project context
  const isProjectScoped = Boolean(defaultProjectId) || projects.length === 1;
  const currentProject = projects.find(p => p.id === (projectId || defaultProjectId)) || (projects.length === 1 ? projects[0] : null);

  React.useEffect(() => {
    if (defaultProjectId) setProjectId(defaultProjectId);
    else if (projects.length === 1) setProjectId(projects[0].id);
  }, [defaultProjectId, projects]);

  React.useEffect(() => {
    if (initialDate) setDate(initialDate);
  }, [initialDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const assignedProjId = projectId || (isProjectScoped && currentProject ? currentProject.id : undefined);
    const selectedProj = projects.find(p => p.id === assignedProjId) || currentProject;

    const newEvent: CalendarEventItem = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      date,
      type,
      projectId: assignedProjId,
      projectName: selectedProj?.name,
      priority,
      time,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined
    };

    onAddEvent(newEvent);
    // Reset fields
    setTitle('');
    setLocation('');
    setNotes('');
    onClose();
  };

  const EVENT_TYPES: CalendarEventType[] = ['Inspection', 'Milestone', 'Delivery', 'Meeting', 'Start Date', 'Other'];
  const PRIORITIES: CalendarEventPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

  // Quick suggestion chips for authentic construction scheduling
  const QUICK_TEMPLATES = [
    { label: 'Framing Inspection', type: 'Inspection' as CalendarEventType, priority: 'Urgent' as CalendarEventPriority },
    { label: 'Deck Concrete Pour', type: 'Milestone' as CalendarEventType, priority: 'Urgent' as CalendarEventPriority },
    { label: 'Steel Truss Delivery', type: 'Delivery' as CalendarEventType, priority: 'Medium' as CalendarEventPriority },
    { label: 'Architect Walkthrough', type: 'Meeting' as CalendarEventType, priority: 'High' as CalendarEventPriority },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full max-w-[400px] mx-auto bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#171A1F] animate-scale-up max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEDF1]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] border border-[#D0E2FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <CalendarIcon className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#171A1F] leading-none">Add to Schedule</h2>
              <p className="text-[11px] text-[#68707C] mt-1 font-medium">Milestone, municipal inspection, or site event</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          
          {/* Project Context: If already inside a project, show locked badge; otherwise show selector */}
          {isProjectScoped && currentProject ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F0F5FF] border border-[#D0E2FF] text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-4 h-4 text-[#1677FF] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-[#68707C] font-semibold block leading-none mb-0.5">
                    Project
                  </span>
                  <span className="font-bold text-[#1677FF] truncate block">
                    {currentProject.name}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[#1677FF] border border-[#D0E2FF] shrink-0">
                Active Project
              </span>
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-[#68707C] block mb-1">
                Project Association <span className="text-[#9DA5B1] font-normal">(Optional)</span>
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full h-11 px-3 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] cursor-pointer transition-colors"
              >
                <option value="" className="bg-white text-[#68707C]">All Projects / General Event</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id} className="bg-white text-[#171A1F]">{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Quick Preset Chips */}
          <div>
            <span className="text-[11px] font-semibold text-[#68707C] block mb-1.5">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTitle(tmpl.label);
                    setType(tmpl.type);
                    setPriority(tmpl.priority);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#F7F8FA] hover:bg-[#EAF3FF] border border-[#DDE1E7] hover:border-[#1677FF]/40 text-[#424955] hover:text-[#1677FF] transition-all cursor-pointer"
                >
                  + {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-[#171A1F] block mb-1">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rough Framing Inspection, Slab Pour..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 px-3.5 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] placeholder-[#9DA5B1] font-medium transition-colors"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-[#171A1F] block mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] font-medium transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#171A1F] block mb-1">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full h-11 px-3 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] placeholder-[#9DA5B1] font-medium transition-colors"
              />
            </div>
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-[#171A1F] block mb-1">
                Category Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CalendarEventType)}
                className="w-full h-11 px-3 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] font-medium cursor-pointer transition-colors"
              >
                {EVENT_TYPES.map(t => (
                  <option key={t} value={t} className="bg-white text-[#171A1F]">{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#171A1F] block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CalendarEventPriority)}
                className="w-full h-11 px-3 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] font-medium cursor-pointer transition-colors"
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p} className="bg-white text-[#171A1F]">{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Distinct Field 1: Site Location / Zone */}
          <div>
            <label className="text-xs font-bold text-[#171A1F] block mb-1">
              Project Location / Zone <span className="text-[#9DA5B1] font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#9DA5B1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Level 2 North Deck, Framing Grid 4-C"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 pl-10 pr-3 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] placeholder-[#9DA5B1] font-medium transition-colors"
              />
            </div>
          </div>

          {/* Distinct Field 2: Notes / Instructions */}
          <div>
            <label className="text-xs font-bold text-[#171A1F] block mb-1">
              Notes &amp; Instructions <span className="text-[#9DA5B1] font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. City building inspector arrival at 10:00 AM. Ensure structural framing cards and engineer sign-off are on site."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 text-xs rounded-xl bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white focus:outline-none text-[#171A1F] placeholder-[#9DA5B1] font-medium transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-[#EAEDF1]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-xs font-semibold text-[#68707C] hover:text-[#171A1F] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-xs font-bold text-white shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add to Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

