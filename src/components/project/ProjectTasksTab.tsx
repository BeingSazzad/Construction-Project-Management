import React, { useState } from 'react';
import { Project, Task, TaskStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Plus, Search, Check, Clock, 
  Paperclip, MessageSquare, MapPin, CheckSquare, Calendar, ChevronRight
} from 'lucide-react';

interface ProjectTasksTabProps {
  project: Project;
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onCreateTask: () => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

export const ProjectTasksTab: React.FC<ProjectTasksTabProps> = ({
  project,
  tasks,
  onOpenTask,
  onCreateTask,
  onUpdateStatus
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'my' | 'priority' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projectTasks = tasks.filter(t => t.projectId === project.id);

  const filteredTasks = projectTasks.filter(t => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filterTab === 'my') {
      return t.assignee.id === 'usr_field' || t.assignee.id === 'usr_pm';
    }
    if (filterTab === 'priority') {
      return t.priority === 'Critical' || t.priority === 'High';
    }
    if (filterTab === 'completed') {
      return t.status === 'Completed';
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-3 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Top Search & Create Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full h-9 bg-[#0B1120] border border-[#162238] rounded-xl pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0066FF] transition-colors"
          />
        </div>

        <button
          onClick={onCreateTask}
          className="h-9 px-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-transform hover:scale-105 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex items-center gap-1 p-1 bg-[#0B1120] rounded-xl border border-[#162238]">
        {[
          { id: 'all', label: `All (${projectTasks.length})` },
          { id: 'my', label: 'My Tasks' },
          { id: 'priority', label: 'Priority' },
          { id: 'completed', label: 'Done' }
        ].map((f) => {
          const isActive = filterTab === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilterTab(f.id as any)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                isActive
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      <div className="flex flex-col gap-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0B1120] border border-[#162238] text-center text-slate-500 text-xs">
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isCompleted = t.status === 'Completed';
            return (
              <div
                key={t.id}
                className={`p-3 rounded-2xl border transition-all flex flex-col gap-2 shadow-sm ${
                  isCompleted 
                    ? 'border-[#141E30] bg-[#080D18] opacity-75' 
                    : 'border-[#162238] bg-[#0B1120] hover:border-blue-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  {/* Checkbox and Task title */}
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <button
                      onClick={() => onUpdateStatus(t.id, isCompleted ? 'In Progress' : 'Completed')}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 flex-shrink-0 cursor-pointer transition-all ${
                        isCompleted 
                          ? 'bg-emerald-500 border-emerald-400 text-white' 
                          : 'border-slate-600 hover:border-blue-400 bg-[#070A12]'
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <h3 
                        onClick={() => onOpenTask(t)}
                        className={`text-xs font-bold cursor-pointer hover:text-blue-400 transition-colors leading-snug ${
                          isCompleted ? 'line-through text-slate-500' : 'text-white'
                        }`}
                      >
                        {t.title}
                      </h3>
                      
                      {t.milestone && (
                        <span className="text-xs text-blue-400 font-semibold block mt-0.5">
                          {t.milestone}
                        </span>
                      )}
                    </div>
                  </div>

                  <StatusBadge status={t.status} size="xs" />
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1.5 border-t border-[#121B2D]">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={t.assignee.avatar}
                      alt={t.assignee.name}
                      className="w-4 h-4 rounded-full object-cover border border-[#182438]"
                    />
                    <span className="text-slate-300 font-medium truncate max-w-[120px]">{t.assignee.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${t.priority === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                      Due {t.dueDate.slice(5)}
                    </span>
                    
                    <div className="flex items-center gap-2 text-slate-500">
                      {t.attachmentsCount > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Paperclip className="w-3 h-3" />
                          <span>{t.attachmentsCount}</span>
                        </span>
                      )}
                      {t.notesCount > 0 && (
                        <span className="flex items-center gap-0.5">
                          <MessageSquare className="w-3 h-3" />
                          <span>{t.notesCount}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
