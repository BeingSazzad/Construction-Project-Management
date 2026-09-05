import React, { useState } from 'react';
import { Project, CalendarEventItem, CalendarEventType } from '../../types';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, 
  List, Grid3X3
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
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
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
    setCurrentDate(new Date(2026, 7, 1));
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
      case 'Inspection': return 'bg-amber-500';
      case 'Milestone': return 'bg-emerald-500';
      case 'Start Date': return 'bg-cyan-500';
      case 'Meeting': return 'bg-purple-500';
      case 'Delivery': return 'bg-[#1677FF]';
      default: return 'bg-slate-400';
    }
  };

  const getEventBadgeColor = (type: CalendarEventType) => {
    switch (type) {
      case 'Inspection': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Milestone': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Start Date': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Meeting': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Delivery': return 'bg-[#EAF3FF] text-[#1677FF] border-[#1677FF]/20';
      default: return 'bg-[#F2F2F7] text-[#68707C] border-[#DDE1E7]';
    }
  };

  // Selected date events for bottom agenda preview
  const selectedDayEvents = eventsList.filter(e => e.date === selectedDateStr);

  return (
    <div className="w-full flex-1 flex flex-col gap-3.5 px-5 pt-2 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#171A1F] bg-[#F2F2F7] animate-fade-in">
      
      {/* ─── 1. Single Header Control Row ─── */}
      <div className="flex items-center justify-between px-0.5 py-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <h2 className="text-base sm:text-lg font-black text-[#171A1F] tracking-tight truncate">
            {currentMonthName} <span className="text-[#68707C] font-normal">{year}</span>
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="w-7 h-7 rounded-xl bg-white border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-xs"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="w-7 h-7 rounded-xl bg-white border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer active:scale-95 shadow-xs"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="px-2.5 py-1 rounded-xl bg-white border border-[#DDE1E7] hover:bg-[#F2F2F7] text-[#171A1F] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            title="Jump to current date"
          >
            Today
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="flex items-center bg-white border border-[#DDE1E7] rounded-xl p-0.5 shadow-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'month' ? 'bg-[#1677FF] text-white' : 'text-[#68707C] hover:text-[#171A1F]'
              }`}
              title="Month Grid View"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'agenda' ? 'bg-[#1677FF] text-white' : 'text-[#68707C] hover:text-[#171A1F]'
              }`}
              title="Agenda List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Month Grid View ─── */}
      {viewMode === 'month' ? (
        <div className="flex flex-col gap-3.5">
          <div className="rounded-3xl bg-white border border-[#DDE1E7] overflow-hidden shadow-xs">
            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 border-b border-[#EAEDF1] bg-[#F7F8FA]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="py-2 text-center text-[10px] font-bold text-[#68707C] uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Day Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-[#EAEDF1]">
              {calendarCells.map((cell, idx) => {
                const dayEvents = eventsList.filter(e => e.date === cell.dateStr);
                const isToday = cell.dateStr === '2026-08-28';
                const isSelected = cell.dateStr === selectedDateStr;

                return (
                  <div
                    key={`${cell.dateStr}-${idx}`}
                    onClick={() => setSelectedDateStr(cell.dateStr)}
                    className={`min-h-[54px] p-1.5 flex flex-col justify-between transition-all ${
                      cell.isCurrentMonth ? 'bg-white' : 'bg-[#FAFAFB] opacity-40'
                    } ${isSelected ? 'bg-[#EAF3FF] ring-2 ring-[#1677FF] z-10' : isToday ? 'bg-[#F0F7FF]' : ''} hover:bg-[#F2F2F7] cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold ${
                        isToday 
                          ? 'w-5 h-5 rounded-full bg-[#1677FF] text-white flex items-center justify-center text-[10px]' 
                          : isSelected ? 'text-[#1677FF]' : cell.isCurrentMonth ? 'text-[#171A1F]' : 'text-[#9DA5B1]'
                      }`}>
                        {cell.day}
                      </span>
                    </div>

                    {/* Dot Indicators */}
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
                          <span className="text-[9px] font-bold text-[#1677FF] leading-none">
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

          {/* ─── Selected Day Events Agenda Panel ─── */}
          <div className="p-4 rounded-3xl bg-white border border-[#DDE1E7] flex flex-col gap-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#171A1F] uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>Events for {selectedDateStr}</span>
              </h3>
              <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] border border-[#1677FF]/20 px-2 py-0.5 rounded-full">
                {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'Event' : 'Events'}
              </span>
            </div>

            {selectedDayEvents.length === 0 ? (
              <div className="p-3 text-center text-xs text-[#68707C] font-medium">
                No events scheduled on this date. Tap <strong className="text-[#1677FF]">+ Add</strong> to create one.
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-0.5">
                {selectedDayEvents.map(evt => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="p-3 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] hover:border-[#1677FF]/40 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-xs active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getEventDotColor(evt.type)}`} />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">
                          {evt.title}
                        </h4>
                        {evt.time && (
                          <p className="text-[11px] text-[#68707C] font-medium truncate mt-0.5">
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
        /* ─── 3. Full Agenda / List View ─── */
        <div className="flex flex-col gap-2">
          {eventsList.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white border border-[#DDE1E7] text-[#68707C] shadow-xs">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-[#9DA5B1]" />
              <p className="text-xs font-semibold text-[#171A1F]">No events found</p>
              <p className="text-[11px] text-[#68707C] mt-0.5">Add an inspection or milestone to the calendar</p>
            </div>
          ) : (
            eventsList.map(evt => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 transition-all cursor-pointer shadow-xs flex items-center justify-between gap-3 active:scale-[0.99] group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getEventDotColor(evt.type)}`} />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-[#68707C] font-medium truncate mt-0.5">
                      <span className="text-[#171A1F] font-semibold">{evt.date}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in font-sans">
          <div className="w-full max-w-[380px] bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-[#171A1F] animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getEventBadgeColor(selectedEvent.type)}`}>
                {selectedEvent.type}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-xs text-[#68707C] hover:text-[#171A1F] font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#171A1F]">{selectedEvent.title}</h3>
              {selectedEvent.projectName && (
                <p className="text-xs text-[#1677FF] font-medium mt-0.5">{selectedEvent.projectName}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#F7F8FA] border border-[#EAEDF1] text-xs">
              <div className="flex items-center justify-between text-[#68707C]">
                <span>Date:</span>
                <span className="font-semibold text-[#171A1F]">{selectedEvent.date}</span>
              </div>
              {selectedEvent.time && (
                <div className="flex items-center justify-between text-[#68707C]">
                  <span>Time:</span>
                  <span className="font-semibold text-[#171A1F]">{selectedEvent.time}</span>
                </div>
              )}
              {selectedEvent.priority && (
                <div className="flex items-center justify-between text-[#68707C]">
                  <span>Priority:</span>
                  <span className="font-semibold text-amber-700">{selectedEvent.priority}</span>
                </div>
              )}
              {selectedEvent.notes && (
                <div className="pt-2 border-t border-[#EAEDF1] text-[11px] text-[#68707C]">
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
                className="w-full py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-xs font-bold text-white transition-colors cursor-pointer text-center shadow-xs"
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
