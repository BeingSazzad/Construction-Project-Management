import React, { useState } from 'react';
import { Project, Task, TaskStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { 
  Plus, Search, Filter, CheckCircle2, Clock, 
  AlertCircle, Paperclip, MessageSquare, MapPin, Play, Check
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
  const [filterTab, setFilterTab] = useState<'all' | 'my' | 'overdue' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projectTasks = tasks.filter(t => t.projectId === project.id);

  const filteredTasks = projectTasks.filter(t => {
    // Search query
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filterTab === 'my') {
      return t.assignee.id === 'usr_field' || t.assignee.id === 'usr_pm';
    }
    if (filterTab === 'overdue') {
      return t.priority === 'Critical' || t.status === 'Blocked';
    }
    if (filterTab === 'completed') {
      return t.status === 'Completed';
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Search & New Task Action Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, scopes..."
            className="w-full h-10 bg-[#111827] border border-[#23334F] rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button
          onClick={onCreateTask}
          className="h-10 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#101726] rounded-xl border border-[#1C2A44] overflow-x-auto">
        <button
          onClick={() => setFilterTab('all')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'all' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({projectTasks.length})
        </button>
        <button
          onClick={() => setFilterTab('my')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'my' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          My Tasks
        </button>
        <button
          onClick={() => setFilterTab('overdue')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'overdue' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Priority
        </button>
        <button
          onClick={() => setFilterTab('completed')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterTab === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Done
        </button>
      </div>

      {/* Tasks List */}
      <div className="flex flex-col gap-3">
        {filteredTasks.length === 0 ? (
          <div className="card-dark p-8 text-center text-slate-400 text-xs">
            No tasks match the selected filter.
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isCompleted = t.status === 'Completed';
            return (
              <div
                key={t.id}
                className={`card-dark p-3.5 hover:border-cyan-500/40 transition-all border ${
                  isCompleted ? 'border-emerald-500/20 bg-[#0C1420]' : 'border-[#1F2E47] bg-[#111827]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <button
                      onClick={() => onUpdateStatus(t.id, isCompleted ? 'In Progress' : 'Completed')}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 flex-shrink-0 cursor-pointer transition-all ${
                        isCompleted 
                          ? 'bg-emerald-500 border-emerald-400 text-white' 
                          : 'border-slate-600 hover:border-cyan-400 bg-[#0B101D]'
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <h3 
                        onClick={() => onOpenTask(t)}
                        className={`text-xs font-bold tracking-tight cursor-pointer hover:text-cyan-300 transition-colors ${
                          isCompleted ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {t.title}
                      </h3>
                      
                      {t.milestone && (
                        <p className="text-[10px] text-cyan-400 font-semibold mt-0.5">
                          Milestone: {t.milestone}
                        </p>
                      )}
                    </div>
                  </div>

                  <StatusBadge status={t.status} size="xs" />
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-3 bg-[#0B101D] p-2 rounded-lg border border-[#172238]">
                  {t.description}
                </p>

                {/* Task Metadata Row */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1C2A44]">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={t.assignee.avatar}
                      alt={t.assignee.name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className="truncate max-w-[100px] text-slate-300 font-medium">{t.assignee.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 font-medium">Due {t.dueDate.slice(5)}</span>
                    
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <Paperclip className="w-3 h-3 text-slate-500" />
                        <span>{t.attachmentsCount}</span>
                      </span>
                      <span className="flex items-center gap-0.5">
                        <MessageSquare className="w-3 h-3 text-slate-500" />
                        <span>{t.notesCount}</span>
                      </span>
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
