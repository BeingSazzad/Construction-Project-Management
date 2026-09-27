import React, { useState, useMemo, useEffect } from 'react';
import { Project, Task, TaskStatus, Priority } from '../../types';
import {
  Plus, Download, Trash2, Check, Pencil,
  ChevronDown, Search, MoreVertical, X,
  LayoutList, Layers, MapPin, Calendar
} from 'lucide-react';
import { CreateTaskModal } from '../modals/CreateTaskModal';
import { EditTaskModal, EditableTaskData } from '../modals/EditTaskModal';
import { AddTasksTemplateModal } from '../modals/AddTasksTemplateModal';
import { AddMethodChooser } from '../common/AddMethodChooser';

interface ProjectTasksTabProps {
  project: Project;
  tasks?: Task[];
  onOpenPunchList?: () => void;
  punchCount?: number;
  onOpenTask?: (task: Task) => void;
  onCreateTask?: () => void;
  onAddTask?: (task: Partial<Task>) => void;
  onAddTasksFromTemplate?: (tasks: Partial<Task>[]) => void;
  onUpdateStatus?: (taskId: string, status: TaskStatus) => void;
  canManageBoard?: boolean;
}

// Master stage options for task creation and editing modals
const DEFAULT_STAGE_OPTIONS = [
  { id: 'grp-eng', name: 'Engineering & Approvals' },
  { id: 'grp-precon', name: 'Pre-Construction & Permits' },
  { id: 'grp-foundation', name: 'Site Work & Foundation' },
  { id: 'grp-framing', name: 'Structural Framing & Concrete Slabs' },
  { id: 'grp-mep', name: 'MEP Utility Rough-In' },
  { id: 'grp-envelope', name: 'Building Envelope & Finishes' }
];

// Status configuration for pills and dropdown selection
const STATUS_OPTIONS: {
  status: TaskStatus;
  label: string;
  pillClasses: string;
  dotColor: string;
}[] = [
  {
    status: 'Not Started',
    label: 'To Do',
    pillClasses: 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] hover:bg-[#E2E8F0]/80',
    dotColor: 'bg-[#94A3B8]',
  },
  {
    status: 'In Progress',
    label: 'In Progress',
    pillClasses: 'bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/30 hover:bg-[#D8E9FF]',
    dotColor: 'bg-[#1677FF] animate-pulse',
  },
  {
    status: 'Blocked',
    label: 'Blocked',
    pillClasses: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100',
    dotColor: 'bg-rose-500',
  },
  {
    status: 'Completed',
    label: 'Completed',
    pillClasses: 'bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/30 hover:bg-[#D8E9FF]',
    dotColor: 'bg-[#1677FF]',
  }
];

export const ProjectTasksTab: React.FC<ProjectTasksTabProps> = ({
  project,
  tasks = [],
  punchCount,
  onOpenPunchList,
  onOpenTask,
  onCreateTask: onOpenCreateTaskModal,
  onAddTask,
  onAddTasksFromTemplate,
  onUpdateStatus,
  canManageBoard = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('flat');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<EditableTaskData | null>(null);
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);
  const [openStatusDropdownTaskId, setOpenStatusDropdownTaskId] = useState<string | null>(null);
  const [showTaskChooser, setShowTaskChooser] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Close menus on global window click
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target ||
        target.tagName === 'HTML' ||
        target.closest?.('[id*="figma"], [class*="figma"], [id*="html-to-design"], [class*="html-to-design"], [id*="h2d"], [class*="h2d"], [data-figma], [data-h2d], [data-extension], [id*="extension"], [class*="extension"]')
      ) {
        return;
      }
      setOpenMenuTaskId(null);
      setOpenStatusDropdownTaskId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Filter tasks specifically belonging to this project
  const projectTasks = useMemo(() => {
    return tasks.filter(t => t.projectId === project.id);
  }, [tasks, project.id]);

  // Clean milestone label helper (strips "1. ", "MS-01 ", etc.)
  const cleanMilestoneName = (raw?: string): string => {
    if (!raw) return 'General';
    return raw.replace(/^(MS-\d+\s*|\d+\.\s*)/i, '').trim();
  };

  // Toggle single task completion (checkbox)
  const handleToggleCheckbox = (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus: TaskStatus = currentStatus === 'Completed' ? 'Not Started' : 'Completed';
    if (onUpdateStatus) {
      onUpdateStatus(taskId, nextStatus);
    }
  };

  // Create new task
  const handleCreateNewTask = (newTask: Partial<Task>) => {
    const defaultStage = DEFAULT_STAGE_OPTIONS[0];
    const taskToCreate: Partial<Task> = {
      ...newTask,
      projectId: project.id,
      projectName: project.name,
      stageId: newTask.stageId || defaultStage.id,
      milestone: newTask.milestone || defaultStage.name
    };

    if (onAddTask) {
      onAddTask(taskToCreate);
    } else if (onOpenCreateTaskModal) {
      onOpenCreateTaskModal();
    }
    setIsCreateModalOpen(false);
  };

  const handleSaveTaskEdit = (updated: {
    id: string;
    title: string;
    status: TaskStatus;
    priority?: Priority;
    costCode?: string;
    assignee?: string;
    dueDate?: string;
    targetGroupId: string;
    location?: string;
  }) => {
    if (onUpdateStatus) {
      onUpdateStatus(updated.id, updated.status);
    }
    setEditingTask(null);
  };

  // Metrics
  const totalCount = projectTasks.length;
  const doneCount = projectTasks.filter(t => t.status === 'Completed').length;
  const inProgressCount = projectTasks.filter(t => t.status === 'In Progress').length;
  const todoCount = projectTasks.filter(t => t.status === 'Not Started').length;
  const blockedCount = projectTasks.filter(t => t.status === 'Blocked').length;
  const overallPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const isEmpty = totalCount === 0;
  const canAdd = !!(onAddTask || onAddTasksFromTemplate || onOpenCreateTaskModal);

  const openCustomCreate = () => {
    setShowTaskChooser(false);
    if (onAddTask) {
      setIsCreateModalOpen(true);
    } else if (onOpenCreateTaskModal) {
      onOpenCreateTaskModal();
    }
  };

  const openImportTemplate = () => {
    setShowTaskChooser(false);
    if (onAddTasksFromTemplate) {
      setIsTemplateModalOpen(true);
    }
  };

  // Filtered task items based on status & search query
  const filteredTasks = useMemo(() => {
    return projectTasks.filter(t => {
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const assigneeName = typeof t.assignee === 'string' ? t.assignee : (t.assignee?.name || '');
      const milestoneText = t.milestone || '';
      const locationText = t.location || '';
      const matchesSearch = !searchQuery.trim() ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        locationText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assigneeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        milestoneText.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [projectTasks, statusFilter, searchQuery]);

  // Grouped tasks by milestone
  const tasksByMilestone = useMemo(() => {
    const groups: { [key: string]: Task[] } = {};
    filteredTasks.forEach(t => {
      const mName = cleanMilestoneName(t.milestone);
      if (!groups[mName]) groups[mName] = [];
      groups[mName].push(t);
    });
    return Object.entries(groups).map(([milestone, items]) => ({
      milestone,
      items,
      doneCount: items.filter(i => i.status === 'Completed').length
    }));
  }, [filteredTasks]);

  // Render a single task card that maps 1:1 with New Task input fields
  const renderTaskRow = (task: Task) => {
    const isTaskDone = task.status === 'Completed';
    const isTaskInProgress = task.status === 'In Progress';
    const isTaskBlocked = task.status === 'Blocked';
    const assigneeName = typeof task.assignee === 'string'
      ? task.assignee
      : (task.assignee?.name || '');
    const assigneeAvatar = typeof task.assignee === 'object' ? task.assignee?.avatar : undefined;
    const isDueSoon = task.dueDate && (
      task.dueDate.toLowerCase().includes('today') ||
      task.dueDate.toLowerCase().includes('thu') ||
      task.dueDate.toLowerCase().includes('wed')
    );

    // Realistic default location fallback if not explicitly stored
    const taskLocation = task.location || (
      task.milestone?.toLowerCase().includes('framing') ? 'Level 12 Deck' :
      task.milestone?.toLowerCase().includes('foundation') ? 'Grid Line B-4' :
      task.milestone?.toLowerCase().includes('mep') ? 'Utility Core Shaft' :
      task.milestone?.toLowerCase().includes('envelope') ? 'Exterior Facade' :
      'Site Office'
    );

    const currentStatusConfig = STATUS_OPTIONS.find(o => o.status === task.status) || STATUS_OPTIONS[0];
    const isStatusMenuOpen = openStatusDropdownTaskId === task.id;
    const isActionMenuOpen = openMenuTaskId === task.id;

    return (
      <div
        key={task.id}
        className={`px-3.5 py-3 hover:bg-[#F8FAFC] flex items-center justify-between gap-3 transition-colors group relative first:rounded-t-2xl last:rounded-b-2xl ${
          isTaskDone ? 'bg-[#FAFCFF]/60' : 'bg-white'
        } ${isStatusMenuOpen || isActionMenuOpen ? 'z-30' : 'z-0'}`}
      >
        {/* Left: Checkbox & Info */}
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          {/* Checkbox (20px touch target) */}
          {onUpdateStatus ? (
            <button
              type="button"
              onClick={() => handleToggleCheckbox(task.id, task.status)}
              className="w-7 h-7 -ml-1 -mt-0.5 rounded-lg flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition-transform"
              title={isTaskDone ? 'Mark as to do' : 'Mark as completed'}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                  isTaskDone
                    ? 'bg-[#1677FF] border-[#1677FF] text-white shadow-xs'
                    : isTaskInProgress
                    ? 'border-[#1677FF] bg-[#EAF3FF] text-[#1677FF]'
                    : isTaskBlocked
                    ? 'border-rose-500 bg-rose-50 text-rose-600'
                    : 'border-[#CBD5E1] bg-white group-hover:border-[#1677FF]'
                }`}
              >
                {isTaskDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isTaskInProgress ? (
                  <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-pulse" />
                ) : isTaskBlocked ? (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                ) : null}
              </div>
            </button>
          ) : (
            <div className="w-7 h-7 -ml-1 -mt-0.5 rounded-lg flex items-center justify-center shrink-0 select-none">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                  isTaskDone
                    ? 'bg-[#1677FF] border-[#1677FF] text-white shadow-xs'
                    : isTaskInProgress
                    ? 'border-[#1677FF] bg-[#EAF3FF] text-[#1677FF]'
                    : isTaskBlocked
                    ? 'border-rose-500 bg-rose-50 text-rose-600'
                    : 'border-[#CBD5E1] bg-white'
                }`}
              >
                {isTaskDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          )}

          {/* Task Details (Directly mapping New Task modal inputs) */}
          <div className="min-w-0 flex-1 pt-0.5">
            {/* 1. Task Title & Priority */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                onClick={() => {
                  if (onOpenTask) onOpenTask(task);
                  else if (onUpdateStatus) handleToggleCheckbox(task.id, task.status);
                }}
                className={`text-xs md:text-sm font-semibold leading-snug break-words transition-colors ${
                  onUpdateStatus || onOpenTask ? 'cursor-pointer' : ''
                } ${
                  isTaskDone
                    ? 'text-[#94A3B8] line-through font-normal select-none'
                    : 'text-[#0F172A] hover:text-[#1677FF]'
                }`}
              >
                {task.title}
              </span>

              {/* Priority Indicator */}
              {task.priority === 'Critical' && (
                <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[10px] bg-rose-50 border border-rose-100 px-1.5 py-0.2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                  Critical
                </span>
              )}
              {task.priority === 'High' && (
                <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[10px] bg-amber-50 border border-amber-200/60 px-1.5 py-0.2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  High
                </span>
              )}
            </div>

            {/* 2. Scope & Instructions preview */}
            {task.description && (
              <p className={`text-[11px] line-clamp-1 mt-0.5 ${isTaskDone ? 'text-[#94A3B8]/80' : 'text-[#64748B]'}`}>
                {task.description}
              </p>
            )}

            {/* 3. Milestone, Site Location, Assignee & Due Date Row */}
            <div className="flex items-center gap-2 mt-1 text-[11px] text-[#64748B] leading-none flex-wrap">
              {/* Milestone & Schedule Phase */}
              {task.milestone && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/20">
                  {cleanMilestoneName(task.milestone)}
                </span>
              )}

              {/* Site Location */}
              {taskLocation && (
                <span className="inline-flex items-center gap-1 text-[10px] text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] px-1.5 py-0.5 rounded-md font-medium">
                  <MapPin className="w-2.5 h-2.5 text-[#94A3B8]" />
                  <span>{taskLocation}</span>
                </span>
              )}

              {/* Assignee */}
              {assigneeName && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
                  {assigneeAvatar ? (
                    <img src={assigneeAvatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-[#E2E8F0] text-[#475569] text-[9px] font-bold flex items-center justify-center shrink-0">
                      {assigneeName.charAt(0)}
                    </span>
                  )}
                  <span className="truncate max-w-[120px]">{assigneeName}</span>
                </span>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <span className={`inline-flex items-center gap-1 text-[11px] ${isDueSoon ? 'text-amber-700 font-medium' : 'text-[#94A3B8]'}`}>
                  <Calendar className="w-3 h-3 opacity-70" />
                  <span>{task.dueDate}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Interactive Status Dropdown & 3-Dot Action Menu */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Status Dropdown Pill */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            {onUpdateStatus ? (
              <button
                type="button"
                onClick={() => {
                  setOpenMenuTaskId(null);
                  setOpenStatusDropdownTaskId(prev => prev === task.id ? null : task.id);
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 whitespace-nowrap select-none cursor-pointer transition-all active:scale-95 shadow-2xs ${currentStatusConfig.pillClasses}`}
                title="Change status"
              >
                {task.status === 'Completed' ? (
                  <Check className="w-3 h-3 text-[#1677FF] stroke-[2.5]" />
                ) : task.status === 'In Progress' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-pulse" />
                ) : task.status === 'Blocked' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                )}
                <span>{currentStatusConfig.label}</span>
                <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-200 ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 whitespace-nowrap ${currentStatusConfig.pillClasses}`}>
                {task.status === 'Completed' ? (
                  <Check className="w-3 h-3 text-[#1677FF] stroke-[2.5]" />
                ) : task.status === 'In Progress' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-pulse" />
                ) : task.status === 'Blocked' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                )}
                <span>{currentStatusConfig.label}</span>
              </span>
            )}

            {/* Dropdown Menu Popover */}
            {isStatusMenuOpen && onUpdateStatus && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl py-1.5 z-50 flex flex-col animate-scale-in">
                <div className="px-3 py-1 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider border-b border-[#F1F5F9] mb-1">
                  Change Status
                </div>
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = task.status === opt.status;
                  return (
                    <button
                      key={opt.status}
                      type="button"
                      onClick={() => {
                        onUpdateStatus(task.id, opt.status);
                        setOpenStatusDropdownTaskId(null);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#F8FAFC]' : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 border ${opt.pillClasses}`}>
                        {opt.status === 'Completed' ? (
                          <Check className="w-2.5 h-2.5 text-[#1677FF] stroke-[2.5]" />
                        ) : opt.status === 'In Progress' ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-pulse" />
                        ) : opt.status === 'Blocked' ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                        )}
                        <span>{opt.label}</span>
                      </span>

                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#1677FF] stroke-[2.5]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3-Dot Action Menu */}
          {canManageBoard && (
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenStatusDropdownTaskId(null);
                  setOpenMenuTaskId(prev => prev === task.id ? null : task.id);
                }}
                className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                title="Task options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {openMenuTaskId === task.id && (
                <div className="absolute right-0 top-8 w-32 bg-white rounded-xl border border-[#E2E8F0] shadow-xl py-1 z-50 flex flex-col animate-scale-in">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuTaskId(null);
                      setEditingTask({
                        id: task.id,
                        title: task.title,
                        status: task.status,
                        priority: task.priority,
                        costCode: task.costCode,
                        assignee: assigneeName,
                        dueDate: task.dueDate,
                        location: task.location || taskLocation,
                        groupId: task.stageId || DEFAULT_STAGE_OPTIONS[0].id
                      });
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#1677FF]" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenuTaskId(null);
                      if (confirm(`Remove task "${task.title}"?`)) {
                        if (onUpdateStatus) onUpdateStatus(task.id, 'Completed');
                      }
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-3 px-4 py-3 pb-28 font-sans max-w-[430px] md:max-w-3xl mx-auto text-[#0F172A] animate-fade-in">

      {/* ─── 1. Minimal Header & Pulse ─── */}
      {!isEmpty && (
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">
                  Tasks
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/20">
                  {overallPercent}% Complete
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-medium mt-0.5">
                {doneCount} of {totalCount} completed
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onAddTasksFromTemplate && (
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="h-8 px-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#1677FF]/40 hover:text-[#1677FF] flex items-center gap-1.5 transition-colors cursor-pointer select-none text-xs font-semibold"
                  title="Import tasks from template"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Import</span>
                </button>
              )}

              {canAdd && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-action btn-primary h-8 px-3 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Task</span>
                </button>
              )}
            </div>
          </div>

          {/* Sleek Minimal Progress Line */}
          <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]/80">
            <div
              className="h-full bg-[#1677FF] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Empty State: First Task Setup */}
      {isEmpty && canAdd && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-6 mt-1 shadow-card text-center">
          {!showTaskChooser ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F172A]">No tasks yet</p>
                <p className="text-xs text-[#64748B] mt-0.5">Start organizing this project with actionable to-dos.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTaskChooser(true)}
                className="w-full max-w-xs h-10 rounded-xl bg-[#1677FF] hover:bg-[#125ecc] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99] transition-all shadow-xs"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add task
              </button>
            </div>
          ) : (
            <div className="text-left">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F1F5F9]">
                <p className="text-sm font-semibold text-[#0F172A]">Choose Method</p>
                <button
                  type="button"
                  onClick={() => setShowTaskChooser(false)}
                  className="text-xs font-semibold text-[#1677FF] cursor-pointer"
                >
                  Back
                </button>
              </div>
              <AddMethodChooser
                onCustom={onAddTask || onOpenCreateTaskModal ? openCustomCreate : undefined}
                onImport={onAddTasksFromTemplate ? openImportTemplate : undefined}
                customHint="Single task"
                importHint="From template"
              />
            </div>
          )}
        </div>
      )}

      {!isEmpty && (
        <>
          {/* ─── 2. Clean Segmented Filters & Controls ─── */}
          <div className="flex items-center justify-between gap-2 flex-wrap py-0.5">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                  statusFilter === 'all'
                    ? 'bg-[#1677FF] text-white font-bold shadow-xs'
                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                All ({totalCount})
              </button>

              <button
                onClick={() => setStatusFilter('Not Started')}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                  statusFilter === 'Not Started'
                    ? 'bg-[#1677FF] text-white font-bold shadow-xs'
                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                To Do ({todoCount})
              </button>

              <button
                onClick={() => setStatusFilter('In Progress')}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                  statusFilter === 'In Progress'
                    ? 'bg-[#1677FF] text-white font-bold shadow-xs'
                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                In Progress ({inProgressCount})
              </button>

              {blockedCount > 0 && (
                <button
                  onClick={() => setStatusFilter('Blocked')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                    statusFilter === 'Blocked'
                      ? 'bg-rose-600 text-white font-bold shadow-xs'
                      : 'bg-white border border-[#E2E8F0] text-rose-600 hover:text-rose-700'
                  }`}
                >
                  Blocked ({blockedCount})
                </button>
              )}

              <button
                onClick={() => setStatusFilter('Completed')}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                  statusFilter === 'Completed'
                    ? 'bg-[#1677FF] text-white font-bold shadow-xs'
                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Done ({doneCount})
              </button>
            </div>

            {/* View Toggle (Flat List vs Grouped by Milestone) */}
            <div className="flex items-center gap-1 bg-[#F1F5F9] p-0.5 rounded-lg border border-[#E2E8F0] ml-auto shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('flat')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'flat'
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title="Flat list of all tasks"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>List</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'grouped'
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title="Grouped by milestone"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>By Milestone</span>
              </button>
            </div>
          </div>

          {/* ─── 3. Search Bar ─── */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, locations, assignees, or milestones..."
              className="w-full h-10 pl-9 pr-8 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF] transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* ─── 4. Task List Display ─── */}
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center shadow-card">
              <div className="w-10 h-10 rounded-2xl bg-[#F8FAFC] text-[#94A3B8] flex items-center justify-center mx-auto mb-2">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-[#0F172A]">No tasks match your filters</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">Try searching with a different keyword or resetting your filter.</p>
              {(searchQuery || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="mt-3 text-xs font-bold text-[#1677FF] hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : viewMode === 'flat' ? (
            /* FLAT LIST: Clean, unified single container */
            <div className="bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#F1F5F9] shadow-card">
              {filteredTasks.map(renderTaskRow)}
            </div>
          ) : (
            /* GROUPED BY MILESTONE: Lightweight section dividers without heavy accordion boxes */
            <div className="flex flex-col gap-3">
              {tasksByMilestone.map((grp) => (
                <div key={grp.milestone} className="flex flex-col gap-1.5">
                  {/* Subtle Clean Section Header */}
                  <div className="flex items-center justify-between px-1 text-xs font-bold text-[#64748B]">
                    <div className="flex items-center gap-1.5">
                      <span className="uppercase tracking-wider text-[11px] text-[#0F172A]">
                        {grp.milestone}
                      </span>
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#64748B]">
                        {grp.items.length}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#94A3B8] font-medium">
                      {grp.doneCount} of {grp.items.length} done
                    </span>
                  </div>

                  {/* Tasks in this milestone */}
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#F1F5F9] shadow-card">
                    {grp.items.map(renderTaskRow)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ─── Modals ─── */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        project={project}
        stageOptions={DEFAULT_STAGE_OPTIONS}
        onCreate={handleCreateNewTask}
      />

      <AddTasksTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        projectName={project.name}
        projectId={project.id}
        onAddTasks={(templateTasks) => {
          if (onAddTasksFromTemplate) {
            onAddTasksFromTemplate(
              templateTasks.map((t) => ({
                ...t,
                projectId: project.id,
                projectName: project.name,
              }))
            );
          }
          setIsTemplateModalOpen(false);
        }}
      />

      <EditTaskModal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        stageGroups={DEFAULT_STAGE_OPTIONS}
        onSave={handleSaveTaskEdit}
        onDelete={(_groupId, taskId) => {
          if (onUpdateStatus) onUpdateStatus(taskId, 'Completed');
          setEditingTask(null);
        }}
      />

    </div>
  );
};
