import React, { useState } from 'react';
import { Project, GanttItem, Task, TaskStatus, CalendarEventItem } from '../../types';
import { CalendarView } from '../calendar/CalendarView';
import { MOCK_CALENDAR_EVENTS } from '../../data/mockData';

interface ProjectScheduleTabProps {
  project: Project;
  tasks?: Task[];
  ganttItems?: GanttItem[];
  onCreateTask?: () => void;
  onUpdateTaskStatus?: (taskId: string, status: TaskStatus) => void;
  onAddTask?: (task: Partial<Task>) => void;
  canManageSchedule?: boolean;
  isMilestoneView?: boolean;
  initialDate?: string;
}

export const ProjectScheduleTab: React.FC<ProjectScheduleTabProps> = ({
  project,
  canManageSchedule = false,
  initialDate
}) => {
  // Scoped project schedule events (Milestones, inspections, deliveries, meetings)
  const [projectEvents, setProjectEvents] = useState<CalendarEventItem[]>(() => {
    return MOCK_CALENDAR_EVENTS.map(evt => ({
      ...evt,
      projectId: project.id,
      projectName: project.name
    }));
  });

  const handleAddEvent = (newEvent: CalendarEventItem) => {
    setProjectEvents(prev => [{ ...newEvent, projectId: project.id, projectName: project.name }, ...prev]);
  };

  const handleUpdateEvent = (updatedEvent: CalendarEventItem) => {
    setProjectEvents(prev => prev.map(e => e.id === updatedEvent.id ? { ...updatedEvent, projectId: project.id, projectName: project.name } : e));
  };

  const handleDeleteEvent = (eventId: string) => {
    setProjectEvents(prev => prev.filter(e => e.id !== eventId));
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-3 px-4 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
            Project Schedule
          </h2>
          <p className="text-xs text-[#64748B] font-medium">
            Milestones, inspections &amp; key site dates
          </p>
        </div>
      </div>

      {/* ─── Unified Schedule Calendar (Single cohesive feature) ─── */}
      <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card">
        <CalendarView
          projects={[project]}
          events={projectEvents}
          onAddEvent={canManageSchedule ? handleAddEvent : undefined}
          onUpdateEvent={canManageSchedule ? handleUpdateEvent : undefined}
          onDeleteEvent={canManageSchedule ? handleDeleteEvent : undefined}
          isInline={true}
          initialDate={initialDate}
        />
      </div>
    </div>
  );
};
