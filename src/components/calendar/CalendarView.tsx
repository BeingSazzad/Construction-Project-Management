import React, { useState } from 'react';
import { Project, CalendarEventItem, CalendarEventType } from '../../types';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, 
  Clock, MapPin, Tag, List, Grid3X3, Filter, CheckCircle2,
  AlertTriangle, ArrowUpRight, Sparkles, Building2
} from 'lucide-react';
import { AddCalendarEventModal } from '../modals/AddCalendarEventModal';

interface CalendarViewProps {
  projects: Project[];
  events?: CalendarEventItem[];
  onSelectProject?: (project: Project) => void;
  onAddEvent?: (event: CalendarEventItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  projects,
  events: initialEvents,
  onSelectProject,
  onAddEvent
}) => {
  // Calendar Navigation State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026 (matching Base44 data)
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);

  // Local state for events
  const [eventsList, setEventsList] = useState<CalendarEventItem[]>(initialEvents || []);

  const handleAddNewEvent = (newEvent: CalendarEventItem) => {
    setEventsList(prev => [newEvent, ...prev]);
    if (onAddEvent) onAddEvent(newEvent);
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date(2026, 7, 1)); // Default to project active month
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const currentMonthName = monthNames[month];

  // Calculate calendar grid days
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarCells = [];

  // Previous month padding days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({ day, isCurrentMonth: false, dateStr });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({ day, isCurrentMonth: true, dateStr });
  }

  // Next month padding days to complete grid (multiples of 7)
  const remainingCells = 35 - calendarCells.length;
  const paddingNext = remainingCells > 0 ? remainingCells : (42 - calendarCells.length);
  for (let day = 1; day <= paddingNext; day++) {
    const dateStr = `${year}-${String(month + 2).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({ day, isCurrentMonth: false, dateStr });
  }

  // Filter events
  const filteredEvents = eventsList.filter(e => {
    if (selectedTypeFilter === 'all') return true;
    return e.type.toLowerCase() === selectedTypeFilter.toLowerCase();
  });

  const getEventBadgeColor = (type: CalendarEventType) => {
    switch (type) {
      case 'Inspection':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:border-amber-400';
      case 'Milestone':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:border-emerald-400';
      case 'Start Date':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:border-cyan-400';
      case 'Meeting':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30 hover:border-purple-400';
      case 'Delivery':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:border-blue-400';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30 hover:border-slate-400';
    }
  };

  const EVENT_FILTER_TABS = [
    { id: 'all', label: 'All Events' },
    { id: 'Inspection', label: 'Inspections' },
    { id: 'Milestone', label: 'Milestones' },
    { id: 'Start Date', label: 'Start Dates' },
    { id: 'Delivery', label: 'Deliveries' },
    { id: 'Meeting', label: 'Meetings' },
  ];

  return (
    <div className="w-full flex flex-col gap-3 px-4 py-3 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. Top Calendar Control Bar ─── */}
      <div className="p-3.5 rounded-2xl bg-[#080E1C] border border-[#14223E] flex flex-col gap-3 shadow-lg">
        {/* Month, Nav & Add Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              {currentMonthName} <span className="text-slate-400 font-normal">{year}</span>
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="w-7 h-7 rounded-xl bg-[#0E1A33] border border-[#1E325A] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="w-7 h-7 rounded-xl bg-[#0E1A33] border border-[#1E325A] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={goToToday}
              className="px-2.5 py-1 rounded-xl bg-[#0E1A33] border border-[#1E325A] hover:bg-[#15274D] text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* View Mode & Filter Row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#142036]">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {EVENT_FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeFilter(tab.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedTypeFilter === tab.id
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-[#050A14] text-slate-400 hover:text-slate-200 border border-[#131D31]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid / Agenda Switcher */}
          <div className="flex items-center bg-[#050A14] border border-[#131D31] rounded-xl p-0.5 flex-shrink-0">
            <button
              onClick={() => setViewMode('month')}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'month' ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Month Grid View"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'agenda' ? 'bg-[#2563EB] text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Agenda List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. Month Grid View ─── */}
      {viewMode === 'month' ? (
        <div className="rounded-2xl bg-[#080E1C] border border-[#14223E] overflow-hidden shadow-lg">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-[#142036] bg-[#050A14]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={d} className="py-2 text-center text-[10px] font-bold text-slate-400">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#142036]">
            {calendarCells.map((cell, idx) => {
              const dayEvents = filteredEvents.filter(e => e.date === cell.dateStr);
              const isToday = cell.dateStr === '2026-08-28'; // Today highlight

              return (
                <div
                  key={`${cell.dateStr}-${idx}`}
                  onClick={() => {
                    if (dayEvents.length > 0) {
                      setSelectedEvent(dayEvents[0]);
                    }
                  }}
                  className={`min-h-[64px] p-1 flex flex-col justify-between transition-colors ${
                    cell.isCurrentMonth ? 'bg-[#070D1A]' : 'bg-[#04070E] opacity-40'
                  } ${isToday ? 'ring-1 ring-blue-500 bg-blue-950/20' : ''} hover:bg-[#0C152B] cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold ${
                      isToday 
                        ? 'w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center' 
                        : cell.isCurrentMonth ? 'text-slate-200' : 'text-slate-600'
                    }`}>
                      {cell.day}
                    </span>
                    {dayEvents.length > 1 && (
                      <span className="text-[9px] font-bold text-blue-400">+{dayEvents.length}</span>
                    )}
                  </div>

                  {/* Day Events Pills */}
                  <div className="flex flex-col gap-0.5 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map(evt => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(evt);
                        }}
                        className={`px-1 py-0.5 rounded text-[9px] font-medium truncate border ${getEventBadgeColor(evt.type)}`}
                        title={`${evt.title} (${evt.type})`}
                      >
                        {evt.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ─── 3. Agenda / List View ─── */
        <div className="flex flex-col gap-2">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#080E1C] border border-[#14223E] text-slate-400">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-xs font-semibold">No events found</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Add an inspection or milestone to the calendar</p>
            </div>
          ) : (
            filteredEvents.map(evt => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="p-3.5 rounded-2xl bg-[#080E1C] border border-[#14223E] hover:border-blue-500/40 transition-all cursor-pointer shadow-sm flex items-center justify-between gap-3 active:scale-[0.99] group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${getEventBadgeColor(evt.type)}`}>
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">{evt.title}</h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${getEventBadgeColor(evt.type)}`}>
                        {evt.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-1">
                      <span>{evt.date}</span>
                      {evt.time && <span>· {evt.time}</span>}
                      {evt.projectName && <span className="text-slate-500 truncate">· {evt.projectName}</span>}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── 4. Quick Summary Metrics ─── */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 rounded-xl bg-[#080E1C] border border-[#14223E] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-medium text-slate-400">Total Events</span>
          <span className="text-sm font-bold text-white mt-0.5">{eventsList.length}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#080E1C] border border-[#14223E] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-medium text-slate-400">Inspections</span>
          <span className="text-sm font-bold text-amber-400 mt-0.5">
            {eventsList.filter(e => e.type === 'Inspection').length}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#080E1C] border border-[#14223E] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-medium text-slate-400">Milestones</span>
          <span className="text-sm font-bold text-emerald-400 mt-0.5">
            {eventsList.filter(e => e.type === 'Milestone').length}
          </span>
        </div>
      </div>

      {/* ─── 5. Add Calendar Event Modal ─── */}
      <AddCalendarEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        projects={projects}
        onAddEvent={handleAddNewEvent}
      />

      {/* ─── 6. Event Detail Preview Modal ─── */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-[380px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getEventBadgeColor(selectedEvent.type)}`}>
                {selectedEvent.type}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-xs text-slate-400 hover:text-white font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{selectedEvent.title}</h3>
              {selectedEvent.projectName && (
                <p className="text-xs text-blue-400 font-medium mt-0.5">{selectedEvent.projectName}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#091122] border border-[#172540] text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500">Date:</span>
                <span className="font-semibold text-white">{selectedEvent.date}</span>
              </div>
              {selectedEvent.time && (
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Time:</span>
                  <span className="font-semibold text-white">{selectedEvent.time}</span>
                </div>
              )}
              {selectedEvent.priority && (
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Priority:</span>
                  <span className="font-semibold text-amber-400">{selectedEvent.priority}</span>
                </div>
              )}
              {selectedEvent.notes && (
                <div className="pt-2 border-t border-[#142036] text-[11px] text-slate-400">
                  {selectedEvent.notes}
                </div>
              )}
            </div>

            {selectedEvent.projectId && onSelectProject && (
              <button
                onClick={() => {
                  const p = projects.find(proj => proj.id === selectedEvent.projectId);
                  if (p) {
                    setSelectedEvent(null);
                    onSelectProject(p);
                  }
                }}
                className="w-full py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold text-white transition-colors cursor-pointer text-center"
              >
                View Project Workspace
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
