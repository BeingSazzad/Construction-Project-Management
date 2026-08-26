import React, { useState } from 'react';
import { Project, Task, TaskStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Plus, Search, Check, Paperclip, MessageSquare
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

  // Format date helper: "2025-05-20" -> "May 20"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
        return `${month} ${parseInt(parts[2], 10)}`;
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Search Bar & Add Task Action */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full h-11 bg-[#070D1A] border border-[#142036] rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <button
          onClick={onCreateTask}
          className="h-11 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* 2. Standardized Design System Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#2563EB] text-white font-bold shadow-md shadow-blue-500/20'
                  : 'bg-[#070D1A] text-slate-400 hover:text-white border border-[#142036]'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* 3. Sleek & Uncluttered Tasks List Cards */}
      <div className="flex flex-col gap-2.5">
        {filteredTasks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#070D1A] border border-[#142036] text-center text-slate-400 text-xs font-medium">
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isCompleted = t.status === 'Completed';
            const formattedDueDate = formatDate(t.dueDate);

            return (
              <div
                key={t.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 shadow-sm group ${
                  isCompleted 
                    ? 'border-[#142036] bg-[#050811] opacity-75' 
                    : 'border-[#142036] bg-[#070D1A] hover:border-blue-500/40'
                }`}
              >
                {/* Top Row: Checkbox + Title + Status Badge */}
                <div className="flex items-start justify-between gap-2.5">
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
                        className={`text-xs sm:text-sm font-bold cursor-pointer hover:text-blue-400 transition-colors leading-snug ${
                          isCompleted ? 'line-through text-slate-500' : 'text-white'
                        }`}
                      >
                        {t.title}
                      </h3>
                      
                      {t.milestone && (
                        <p className="text-[11px] text-blue-400 font-medium mt-0.5">
                          {t.milestone}
                        </p>
                      )}
                    </div>
                  </div>

                  <StatusBadge status={t.status} size="xs" />
                </div>

                {/* Footer Metadata Row */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1.5 border-t border-[#121B2D]">
                  {/* Assignee Avatar & Name */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img
                      src={t.assignee.avatar}
                      alt={t.assignee.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                      }}
                      className="w-4 h-4 rounded-full object-cover border border-[#182438] flex-shrink-0"
                    />
                    <span className="text-slate-300 font-medium truncate max-w-[120px]">{t.assignee.name}</span>
                  </div>

                  {/* Clean Due Date & Minimal Attachment / Comment Icons */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`font-semibold ${t.priority === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                      Due {formattedDueDate}
                    </span>
                    
                    <div className="flex items-center gap-2 text-slate-400">
                      {t.attachmentsCount > 0 && (
                        <span 
                          onClick={() => onOpenTask(t)}
                          className="flex items-center gap-0.5 text-xs hover:text-white cursor-pointer transition-colors"
                          title={`${t.attachmentsCount} Attached Files/Photos`}
                        >
                          <Paperclip className="w-3 h-3 text-slate-400" />
                          <span>{t.attachmentsCount}</span>
                        </span>
                      )}
                      {t.notesCount > 0 && (
                        <span 
                          onClick={() => onOpenTask(t)}
                          className="flex items-center gap-0.5 text-xs hover:text-white cursor-pointer transition-colors"
                          title={`${t.notesCount} Task Comments`}
                        >
                          <MessageSquare className="w-3 h-3 text-slate-400" />
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
