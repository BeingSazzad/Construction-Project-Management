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

  // Selected date state for day-click agenda preview
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-08-28');

  // Helper for dot colors based on event type
  const getEventDotColor = (type: CalendarEventType) => {
    switch (type) {
      case 'Inspection': return 'bg-amber-400';
      case 'Milestone': return 'bg-emerald-400';
      case 'Start Date': return 'bg-cyan-400';
      case 'Meeting': return 'bg-purple-400';
      case 'Delivery': return 'bg-blue-400';
      default: return 'bg-slate-400';
    }
  };

  const getEventBadgeColor = (type: CalendarEventType) => {
    switch (type) {
      case 'Inspection':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:border-amber-400';
      case 'Milestone':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:border-emerald-400';
      case 'Start Date':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:border-cyan-400';
      case 'Meeting':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30 hover:border-purple-400';
      case 'Delivery':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30 hover:border-blue-400';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30 hover:border-slate-400';
    }
  };

  // Selected date events for bottom agenda preview
  const selectedDayEvents = eventsList.filter(e => e.date === selectedDateStr);

  return (
    <div className="w-full flex flex-col gap-3 px-5 pt-2 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. Ultra-Clean Single Header Control Row ─── */}
      <div className="flex items-center justify-between px-0.5 py-0.5">
        {/* Month Title, Navigation & Today */}
        <div className="flex items-center gap-1.5 min-w-0">
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
            {currentMonthName} <span className="text-slate-400 font-normal">{year}</span>
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="w-7 h-7 rounded-xl bg-[#080E1C] border border-[#14223E] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="w-7 h-7 rounded-xl bg-[#080E1C] border border-[#14223E] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="px-2 py-1 rounded-xl bg-[#080E1C] border border-[#14223E] hover:bg-[#0E1A33] text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            title="Jump back to current date"
          >
            Today
          </button>
        </div>

        {/* Right Controls: Grid/Agenda Switcher & Add Button */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Grid / Agenda View Switcher */}
          <div className="flex items-center bg-[#070D1A] border border-[#142036] rounded-xl p-0.5">
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

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Month Grid View (Clutter-Free Dot Indicators) ─── */}
      {viewMode === 'month' ? (
        <div className="flex flex-col gap-3.5">
          <div className="rounded-3xl bg-[#080E1C] border border-[#14223E] overflow-hidden shadow-lg">
            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 border-b border-[#142036] bg-[#050A14]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Day Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-[#142036]">
              {calendarCells.map((cell, idx) => {
                const dayEvents = eventsList.filter(e => e.date === cell.dateStr);
                const isToday = cell.dateStr === '2026-08-28';
                const isSelected = cell.dateStr === selectedDateStr;

                return (
                  <div
                    key={`${cell.dateStr}-${idx}`}
                    onClick={() => setSelectedDateStr(cell.dateStr)}
                    className={`min-h-[54px] p-1.5 flex flex-col justify-between transition-all ${
                      cell.isCurrentMonth ? 'bg-[#070D1A]' : 'bg-[#04070E] opacity-30'
                    } ${isSelected ? 'bg-blue-950/40 ring-2 ring-blue-500 z-10' : isToday ? 'bg-blue-950/20 ring-1 ring-blue-500/60' : ''} hover:bg-[#0C152B] cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold ${
                        isToday 
                          ? 'w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center' 
                          : isSelected ? 'text-blue-400' : cell.isCurrentMonth ? 'text-slate-200' : 'text-slate-600'
                      }`}>
                        {cell.day}
                      </span>
                    </div>

                    {/* Mobile UX Best Practice: Sleek Event Indicator Dots (No Truncated Text Clutter!) */}
                    {dayEvents.length > 0 && (
                      <div className="flex items-center justify-center gap-1 mt-1 pb-0.5">
                        {dayEvents.slice(0, 3).map(evt => (
                          <span 
                            key={evt.id}
                            className={`w-1.5 h-1.5 rounded-full ${getEventDotColor(evt.type)}`}
                            title={`${evt.title} (${evt.type})`}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[9px] font-bold text-blue-400 leading-none">
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Selected Day Events Agenda Panel (Mobile Best Practice) ─── */}
          <div className="p-3.5 rounded-3xl bg-[#080E1C] border border-[#14223E] flex flex-col gap-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>Events for {selectedDateStr}</span>
              </h3>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'Event' : 'Events'}
              </span>
            </div>

            {selectedDayEvents.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400 font-medium">
                No events scheduled on this date. Tap <strong className="text-blue-400">+ Add</strong> to create one.
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-0.5">
                {selectedDayEvents.map(evt => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="p-3 rounded-2xl bg-[#050A14] border border-[#131D31] hover:border-blue-500/40 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-sm active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getEventDotColor(evt.type)}`} />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                          {evt.title}
                        </h4>
                        {evt.time && (
                          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                            {evt.time}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${getEventBadgeColor(evt.type)}`}>
                      {evt.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ─── 3. Full Agenda / List View (Date & Time Only, No Project Name) ─── */
        <div className="flex flex-col gap-2">
          {eventsList.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-[#080E1C] border border-[#14223E] text-slate-400">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-xs font-semibold">No events found</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Add an inspection or milestone to the calendar</p>
            </div>
          ) : (
            eventsList.map(evt => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="p-3 rounded-2xl bg-[#080E1C] border border-[#14223E] hover:border-blue-500/40 transition-all cursor-pointer shadow-sm flex items-center justify-between gap-3 active:scale-[0.99] group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getEventDotColor(evt.type)}`} />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                      <span className="text-slate-300 font-semibold">{evt.date}</span>
                      {evt.time ? ` · ${evt.time}` : ''}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${getEventBadgeColor(evt.type)}`}>
                  {evt.type}
                </span>
              </div>
            ))
          )}
        </div>
      )}

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
