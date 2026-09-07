import React, { useState, useMemo, useEffect } from 'react';
import { Project, Task, TaskStatus, Priority } from '../../types';
import { 
  Plus, Download, Trash2, Check, Pencil,
  ChevronDown, ChevronUp, Search,
  Layers, Hammer, Boxes, Sliders, Wrench, Building2,
  MoreVertical, X, Clock, User as UserIcon, Sparkles, CheckCircle2
} from 'lucide-react';
import { CreateTaskModal } from '../modals/CreateTaskModal';
import { EditTaskModal, EditableTaskData } from '../modals/EditTaskModal';

interface ProjectTasksTabProps {
  project: Project;
  tasks?: Task[];
  onOpenTask?: (task: Task) => void;
  onCreateTask?: () => void;
  onAddTask?: (task: Partial<Task>) => void;
  onUpdateStatus?: (taskId: string, status: TaskStatus) => void;
}

interface StageTaskGroup {
  id: string;
  name: string;
  iconType: 'eng' | 'precon' | 'foundation' | 'framing' | 'mep' | 'envelope';
}

// ─── MASTER STAGES PER PROJECT SPEC ───
const SNELL_ISLE_STAGES: StageTaskGroup[] = [
  { id: 'grp-eng', name: '1. Engineering & Approvals', iconType: 'eng' },
  { id: 'grp-precon', name: '2. Pre-Construction & Permits', iconType: 'precon' },
  { id: 'grp-foundation', name: '3. Site Work & Foundation', iconType: 'foundation' },
  { id: 'grp-framing', name: '4. Structural Framing & Concrete Slabs', iconType: 'framing' },
  { id: 'grp-mep', name: '5. MEP Utility Rough-In (Mech, Elec, Plumb)', iconType: 'mep' },
  { id: 'grp-envelope', name: '6. Building Envelope & Exterior Glass', iconType: 'envelope' }
];

const COMMERCIAL_TOWER_STAGES: StageTaskGroup[] = [
  { id: 'grp-p2-sub', name: '1. Substructure & Deep Foundation', iconType: 'foundation' },
  { id: 'grp-p2-steel', name: '2. Core Structural Steel & Decks', iconType: 'framing' },
  { id: 'grp-p2-facade', name: '3. Curtain Wall & Building Envelope', iconType: 'envelope' },
  { id: 'grp-p2-mep', name: '4. MEP Heavy Systems Distribution', iconType: 'mep' },
  { id: 'grp-p2-finish', name: '5. Interior Fit-Out & Finishes', iconType: 'precon' }
];

export const ProjectTasksTab: React.FC<ProjectTasksTabProps> = ({
  project,
  tasks = [],
  onCreateTask: onOpenCreateTaskModal,
  onAddTask,
  onUpdateStatus,
}) => {
  // Determine base stages for current project
  const initialStages = useMemo(() => {
    if (project.id === 'proj-1') return SNELL_ISLE_STAGES;
    if (project.id === 'proj-2') return COMMERCIAL_TOWER_STAGES;
    if (project.stages && project.stages.length > 0) {
      return project.stages.map((stg, i) => ({
        id: stg.id,
        name: `${i + 1}. ${stg.name}`,
        iconType: (i % 2 === 0 ? 'framing' : 'mep') as any
      }));
    }
    return SNELL_ISLE_STAGES;
  }, [project.id, project.stages]);

  const [stageDefs, setStageDefs] = useState<StageTaskGroup[]>(initialStages);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [targetStageIdForCreate, setTargetStageIdForCreate] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<EditableTaskData | null>(null);
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string>('');

  // Synchronize stages if project changes
  useEffect(() => {
    setStageDefs(initialStages);
    setCollapsedGroups({});
  }, [initialStages]);

  // Close 3-dot menus on window click
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
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Icon mapping
  const getStageIcon = (iconType: string) => {
    switch (iconType) {
      case 'eng': return <Layers className="w-4 h-4 text-[#1677FF]" />;
      case 'precon': return <Sliders className="w-4 h-4 text-[#1677FF]" />;
      case 'foundation': return <Hammer className="w-4 h-4 text-[#1677FF]" />;
      case 'framing': return <Boxes className="w-4 h-4 text-[#1677FF]" />;
      case 'mep': return <Wrench className="w-4 h-4 text-[#1677FF]" />;
      case 'envelope': return <Building2 className="w-4 h-4 text-[#1677FF]" />;
      default: return <Layers className="w-4 h-4 text-[#1677FF]" />;
    }
  };

  const getStageIconBg = (_iconType: string) => {
    return 'bg-[#EAF3FF]';
  };

  // Filter tasks specifically belonging to this project
  const projectTasks = useMemo(() => {
    return tasks.filter(t => t.projectId === project.id);
  }, [tasks, project.id]);

  // Map tasks to stages
  const stageGroupsWithTasks = useMemo(() => {
    // Keep track of assigned task IDs
    const assignedIds = new Set<string>();

    const grouped = stageDefs.map((stage, index) => {
      const stageTasks = projectTasks.filter(t => {
        // Direct stageId match
        if (t.stageId && t.stageId === stage.id) {
          assignedIds.add(t.id);
          return true;
        }
        // Milestone string contains stage name keyword or prefix
        if (t.milestone) {
          const cleanMilestone = t.milestone.toLowerCase();
          const cleanStage = stage.name.toLowerCase();
          // e.g. "framing" in "4. Structural Framing"
          const keywords = cleanStage.split(' ').slice(1);
          const matches = keywords.some(kw => kw.length > 3 && cleanMilestone.includes(kw));
          if (matches) {
            assignedIds.add(t.id);
            return true;
          }
        }
        return false;
      });

      return {
        ...stage,
        tasks: stageTasks
      };
    });

    // Catch any tasks for this project that didn't match a stage keyword
    const unassignedTasks = projectTasks.filter(t => !assignedIds.has(t.id));
    if (unassignedTasks.length > 0 && grouped.length > 0) {
      // Put unassigned tasks into the most active or first stage
      grouped[Math.min(3, grouped.length - 1)].tasks.push(...unassignedTasks);
    }

    return grouped;
  }, [stageDefs, projectTasks]);

  // Accordion toggle
  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const allCollapsed = stageDefs.length > 0 && stageDefs.every(g => !!collapsedGroups[g.id]);

  const handleToggleAll = () => {
    if (allCollapsed) {
      setCollapsedGroups({});
    } else {
      const all: Record<string, boolean> = {};
      stageDefs.forEach(g => {
        all[g.id] = true;
      });
      setCollapsedGroups(all);
    }
  };

  const handleStartRenameGroup = (e: React.MouseEvent, grp: StageTaskGroup) => {
    e.stopPropagation();
    setEditingGroupId(grp.id);
    setEditingGroupName(grp.name);
  };

  const handleSaveRenameGroup = (groupId: string) => {
    if (editingGroupName.trim()) {
      setStageDefs(prev => prev.map(g => g.id === groupId ? { ...g, name: editingGroupName.trim() } : g));
    }
    setEditingGroupId(null);
  };

  const handleCancelRenameGroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGroupId(null);
  };

  // Toggle single task completion (20px checkbox)
  const handleToggleCheckbox = (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus: TaskStatus = currentStatus === 'Completed' ? 'Not Started' : 'Completed';
    if (onUpdateStatus) {
      onUpdateStatus(taskId, nextStatus);
    }
  };

  // Cycle status pill (Right-hand badge)
  const handleCycleStatus = (taskId: string, currentStatus: TaskStatus) => {
    let nextStatus: TaskStatus = 'In Progress';
    if (currentStatus === 'Not Started') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Completed';
    else if (currentStatus === 'Completed') nextStatus = 'Blocked';
    else if (currentStatus === 'Blocked') nextStatus = 'Not Started';

    if (onUpdateStatus) {
      onUpdateStatus(taskId, nextStatus);
    }
  };

  // Open task creation inside a designated stage
  const handleOpenCreateInStage = (stageId: string) => {
    setTargetStageIdForCreate(stageId);
    setIsCreateModalOpen(true);
  };

  // Add task handler
  const handleCreateNewTask = (newTask: Partial<Task>) => {
    const chosenStageId = targetStageIdForCreate || newTask.stageId || stageDefs[0]?.id;
    const stageObj = stageDefs.find(s => s.id === chosenStageId);

    const taskToCreate: Partial<Task> = {
      ...newTask,
      projectId: project.id,
      projectName: project.name,
      stageId: chosenStageId,
      milestone: stageObj ? stageObj.name : (newTask.milestone || 'General Construction')
    };

    if (onAddTask) {
      onAddTask(taskToCreate);
    } else if (onOpenCreateTaskModal) {
      onOpenCreateTaskModal();
    }
    setIsCreateModalOpen(false);
    setTargetStageIdForCreate(null);
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
  }) => {
    if (onUpdateStatus) {
      onUpdateStatus(updated.id, updated.status);
    }
    setEditingTask(null);
  };

  // Metrics across the project
  const totalCount = projectTasks.length;
  const doneCount = projectTasks.filter(t => t.status === 'Completed').length;
  const inProgressCount = projectTasks.filter(t => t.status === 'In Progress').length;
  const todoCount = projectTasks.filter(t => t.status === 'Not Started').length;
  const blockedCount = projectTasks.filter(t => t.status === 'Blocked').length;
  const overallPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Filtered stage groups based on search & status filter
  const filteredGroups = useMemo(() => {
    return stageGroupsWithTasks.map(grp => {
      const filteredTasks = grp.tasks.filter(t => {
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        const assigneeName = typeof t.assignee === 'string' ? t.assignee : (t.assignee?.name || '');
        const matchesSearch = !searchQuery.trim() || 
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.costCode && t.costCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
          assigneeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grp.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      });

      return {
        ...grp,
        tasks: filteredTasks,
        originalTasks: grp.tasks
      };
    }).filter(grp => grp.tasks.length > 0 || !searchQuery.trim());
  }, [stageGroupsWithTasks, statusFilter, searchQuery]);

  return (
    <div className="w-full flex-1 flex flex-col gap-3.5 px-4 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      
      {/* ─── 1. Header & Primary CTA ─── */}
      <div className="flex items-center justify-between px-0.5 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">
              Project Tasks
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/20">
              {overallPercent}% Complete
            </span>
          </div>
          <p className="text-xs text-[#64748B] font-medium mt-0.5">
            {doneCount} of {totalCount} tasks completed across {stageDefs.length} stages
          </p>
        </div>

        <button
          onClick={() => {
            setTargetStageIdForCreate(null);
            setIsCreateModalOpen(true);
          }}
          className="btn-action btn-primary"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* ─── Overall Progress Bar ─── */}
      <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
        <div 
          className="h-full bg-[#1677FF] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${overallPercent}%` }}
        />
      </div>

      {/* ─── 2. Status Filter Pills ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
            statusFilter === 'all'
              ? 'bg-[#1677FF] text-white font-bold shadow-xs'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          All ({totalCount})
        </button>

        <button
          onClick={() => setStatusFilter('Not Started')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
            statusFilter === 'Not Started'
              ? 'bg-[#1677FF] text-white font-bold shadow-xs'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          To Do ({todoCount})
        </button>

        <button
          onClick={() => setStatusFilter('In Progress')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
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
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
              statusFilter === 'Blocked'
                ? 'bg-[#1677FF] text-white font-bold shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Blocked ({blockedCount})
          </button>
        )}

        <button
          onClick={() => setStatusFilter('Completed')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
            statusFilter === 'Completed'
              ? 'bg-[#1677FF] text-white font-bold shadow-xs'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Done ({doneCount})
        </button>
      </div>

      {/* ─── 3. Search Bar ─── */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by task, trade, code, or stage..."
          className="w-full h-12 min-h-[48px] pl-9 pr-8 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF] transition-colors shadow-2xs"
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

      {/* ─── 4. Secondary Action Row: Collapse / Expand ─── */}
      <div className="flex items-center justify-between px-0.5 text-xs font-medium">
        <button
          onClick={handleToggleAll}
          className="text-[#1677FF] font-semibold hover:underline cursor-pointer select-none"
        >
          {allCollapsed ? 'Expand All Stages' : 'Collapse All Stages'}
        </button>

        <button
          onClick={() => alert(`CSI MasterFormat task schedule is synchronized for ${project.name}.`)}
          className="flex items-center gap-1 text-[#64748B] hover:text-[#1677FF] transition-colors cursor-pointer select-none"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Sync Standards</span>
        </button>
      </div>

      {/* ─── 5. Stage Groups List ─── */}
      <div className="flex flex-col gap-3">
        {filteredGroups.map((group) => {
          const isCollapsed = !!collapsedGroups[group.id];
          const groupTotal = group.originalTasks.length;
          const groupDone = group.originalTasks.filter(t => t.status === 'Completed').length;
          const groupPercent = groupTotal > 0 ? Math.round((groupDone / groupTotal) * 100) : 0;
          const is100Done = groupPercent === 100;

          return (
            <div
              key={group.id}
              className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden shadow-card transition-all"
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleGroup(group.id)}
                className="w-full p-3.5 flex items-center justify-between gap-2.5 bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer text-left select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className={`w-8 h-8 rounded-xl ${getStageIconBg(group.iconType)} flex items-center justify-center shrink-0`}>
                    {getStageIcon(group.iconType)}
                  </div>
                  <div className="min-w-0 flex-1">
                    {editingGroupId === group.id ? (
                      <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingGroupName}
                          onChange={e => setEditingGroupName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveRenameGroup(group.id);
                            if (e.key === 'Escape') setEditingGroupId(null);
                          }}
                          className="text-xs font-bold text-[#0F172A] bg-white border border-[#1677FF] rounded-xl px-2.5 py-1 outline-none w-full"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRenameGroup(group.id)}
                          className="px-2.5 py-1 rounded-xl bg-[#1677FF] hover:bg-[#125ecc] text-white text-[11px] font-bold cursor-pointer shrink-0 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelRenameGroup}
                          className="p-1.5 rounded-xl text-[#64748B] hover:bg-[#E2E8F0] text-[10px] cursor-pointer shrink-0 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group/header">
                        <h3 className="text-xs font-bold text-[#0F172A] truncate">
                          {group.name}
                        </h3>
                        <button
                          type="button"
                          onClick={(e) => handleStartRenameGroup(e, group)}
                          className="w-5 h-5 rounded text-[#94A3B8] hover:text-[#1677FF] hover:bg-[#EAF3FF] flex items-center justify-center transition-colors cursor-pointer shrink-0 opacity-0 group-hover/header:opacity-100"
                          title="Rename stage"
                        >
                          <Pencil className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 max-w-[140px] h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            groupPercent > 0 ? 'bg-[#1677FF]' : 'bg-transparent'
                          }`}
                          style={{ width: `${groupPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#64748B] font-medium shrink-0">
                        {groupDone} of {groupTotal} completed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[11px] font-bold ${
                    groupPercent > 0 ? 'text-[#1677FF]' : 'text-[#64748B]'
                  }`}>
                    {groupPercent}%
                  </span>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                  )}
                </div>
              </div>

              {/* Task Items List */}
              {!isCollapsed && (
                <div className="border-t border-[#E2E8F0]">
                  {group.tasks.length === 0 ? (
                    <div className="py-4 text-center">
                      <p className="text-xs text-[#94A3B8] mb-2">No tasks in this stage matching current filter.</p>
                      <button
                        type="button"
                        onClick={() => handleOpenCreateInStage(group.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1677FF] bg-[#EAF3FF] hover:bg-[#D8E9FF] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add First Task</span>
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#F1F5F9]">
                      {group.tasks.map((task) => {
                        const isTaskDone = task.status === 'Completed';
                        const isTaskInProgress = task.status === 'In Progress';
                        const isTaskBlocked = task.status === 'Blocked';
                        const assigneeName = typeof task.assignee === 'string' 
                            ? task.assignee 
                            : (task.assignee?.name || '');
                        const isDueSoon = task.dueDate && (task.dueDate.toLowerCase().includes('today') || task.dueDate.toLowerCase().includes('thu') || task.dueDate.toLowerCase().includes('wed'));

                        return (
                          <div
                            key={task.id}
                            className="px-3.5 py-3 hover:bg-[#F8FAFC] flex items-center justify-between gap-2.5 transition-colors group"
                          >
                            {/* Left: 20px Touch Target Checkbox & Content */}
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                              {/* 20px Checkbox with 36px Hit Box */}
                              <button
                                type="button"
                                onClick={() => handleToggleCheckbox(task.id, task.status)}
                                className="w-8 h-8 -ml-1.5 -mt-1 rounded-xl flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition-transform select-none"
                                title={isTaskDone ? 'Mark uncompleted' : 'Mark completed'}
                              >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isTaskDone 
                                    ? 'bg-[#1677FF] border-[#1677FF] text-white shadow-xs' 
                                    : isTaskInProgress
                                    ? 'border-[#1677FF] bg-[#EAF3FF] text-[#1677FF]'
                                    : isTaskBlocked
                                    ? 'border-rose-500 bg-rose-50 text-rose-600'
                                    : 'border-[#CBD5E1] bg-white group-hover:border-[#1677FF]'
                                }`}>
                                  {isTaskDone ? (
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  ) : isTaskInProgress ? (
                                    <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-pulse" />
                                  ) : isTaskBlocked ? (
                                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                                  ) : null}
                                </div>
                              </button>

                              {/* Title & Metadata Line */}
                              <div className="min-w-0 flex-1 pt-0.5">
                                <span 
                                  onClick={() => handleToggleCheckbox(task.id, task.status)}
                                  className={`text-xs block leading-snug break-words cursor-pointer transition-colors ${
                                    isTaskDone 
                                      ? 'text-[#94A3B8] line-through font-medium select-none' 
                                      : 'font-semibold text-[#0F172A] hover:text-[#1677FF]'
                                  }`}
                                >
                                  {task.title}
                                </span>

                                {/* Clean, De-cluttered Single-line Metadata */}
                                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#64748B] leading-none flex-wrap">
                                  {task.priority === 'Critical' && (
                                    <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[10px]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                                      Critical
                                    </span>
                                  )}
                                  {task.priority === 'Critical' && (task.costCode || assigneeName || task.dueDate) && (
                                    <span className="text-[#CBD5E1]">·</span>
                                  )}
                                  {task.costCode && (
                                    <span className="font-mono text-[10px] text-[#64748B]">
                                      {task.costCode.split(' ')[0]}
                                    </span>
                                  )}
                                  {task.costCode && (assigneeName || task.dueDate) && (
                                    <span className="text-[#CBD5E1]">·</span>
                                  )}
                                  {assigneeName && (
                                    <span className="truncate max-w-[120px]">
                                      {assigneeName}
                                    </span>
                                  )}
                                  {assigneeName && task.dueDate && (
                                    <span className="text-[#CBD5E1]">·</span>
                                  )}
                                  {task.dueDate && (
                                    <span className={isDueSoon ? 'text-amber-700 font-medium' : 'text-[#94A3B8]'}>
                                      {task.dueDate}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right: Status Pill & 3-Dot Action Menu */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleCycleStatus(task.id, task.status)}
                                className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1 whitespace-nowrap select-none ${
                                  isTaskDone
                                    ? 'bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/30 hover:bg-[#D8E9FF]'
                                    : isTaskInProgress
                                    ? 'bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/30 hover:bg-[#D8E9FF]'
                                    : isTaskBlocked
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                                    : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] hover:bg-[#E2E8F0]'
                                }`}
                                title="Click to cycle status"
                              >
                                {isTaskDone ? (
                                  <>
                                    <Check className="w-3 h-3 text-[#1677FF] stroke-[2.5]" />
                                    <span>Completed</span>
                                  </>
                                ) : isTaskInProgress ? (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-pulse" />
                                    <span>In Progress</span>
                                  </>
                                ) : isTaskBlocked ? (
                                  <span>Blocked</span>
                                ) : (
                                  <span>To Do</span>
                                )}
                              </button>

                              {/* 3-Dot Action Menu */}
                              <div className="relative" onClick={e => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuTaskId(prev => prev === task.id ? null : task.id);
                                  }}
                                  className="w-8 h-8 rounded-xl text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                                  title="Task options"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {openMenuTaskId === task.id && (
                                  <div className="absolute right-0 top-8 w-32 bg-white rounded-xl border border-[#E2E8F0] shadow-xl py-1 z-30 flex flex-col animate-scale-in">
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
                                          groupId: group.id
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
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ── Inline "+ Add Task" Button ── */}
                  <button
                    type="button"
                    onClick={() => handleOpenCreateInStage(group.id)}
                    className="w-full py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1677FF] hover:bg-[#EAF3FF]/40 border-t border-[#F1F5F9] transition-colors cursor-pointer select-none"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Add Task</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Create Task Modal ─── */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setTargetStageIdForCreate(null);
        }}
        project={project}
        initialStageId={targetStageIdForCreate || undefined}
        stageOptions={stageDefs.map(s => ({ id: s.id, name: s.name }))}
        onCreate={handleCreateNewTask}
      />

      {/* ─── Edit Task Modal ─── */}
      <EditTaskModal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        stageGroups={stageDefs.map(g => ({ id: g.id, name: g.name }))}
        onSave={handleSaveTaskEdit}
        onDelete={(_groupId, taskId) => {
          if (onUpdateStatus) onUpdateStatus(taskId, 'Completed');
          setEditingTask(null);
        }}
      />

    </div>
  );
};
