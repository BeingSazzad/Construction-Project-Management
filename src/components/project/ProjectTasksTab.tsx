import React, { useState, useMemo } from 'react';
import { Project, Task, TaskStatus } from '../../types';
import { 
  Plus, Download, Trash2, Check, Pencil,
  ChevronDown, ChevronUp, Search,
  Layers, Hammer, Boxes, Sliders, Wrench, Building2,
  MoreVertical, X
} from 'lucide-react';
import { CreateTaskModal } from '../modals/CreateTaskModal';
import { EditTaskModal, EditableTaskData } from '../modals/EditTaskModal';

interface ProjectTasksTabProps {
  project: Project;
  tasks?: Task[];
  onOpenTask?: (task: Task) => void;
  onCreateTask?: () => void;
  onUpdateStatus?: (taskId: string, status: any) => void;
}

interface TaskItem {
  id: string;
  title: string;
  status: 'done' | 'todo' | 'in-progress';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  costCode?: string;
  assignee?: string;
  dueDate?: string;
}

interface StageTaskGroup {
  id: string;
  name: string;
  iconType: 'eng' | 'precon' | 'foundation' | 'framing' | 'mep' | 'envelope';
  tasks: TaskItem[];
}

// ─── AUTHENTIC SNELL ISLE RESIDENCE TASK BREAKDOWN (68% COMPLETE) ───
const SNELL_ISLE_TASK_STAGES: StageTaskGroup[] = [
  {
    id: 'grp-eng',
    name: '1. Engineering & Approvals',
    iconType: 'eng',
    tasks: [
      { id: 't-eng-1', title: 'Geotechnical Soil Bearing Report', status: 'done', priority: 'Critical', costCode: '01-4000', assignee: 'Sarah Johnson' },
      { id: 't-eng-2', title: 'Structural Engineering & Framing Calcs', status: 'done', priority: 'High', costCode: '01-4100', assignee: 'Sarah Johnson' },
      { id: 't-eng-3', title: 'Engineered Truss Stamped Drawings', status: 'done', priority: 'High', costCode: '06-1000', assignee: 'John Smith' },
      { id: 't-eng-4', title: 'Hurricane Wind Load Compliance', status: 'done', priority: 'Critical', costCode: '01-4200', assignee: 'Sarah Johnson' },
      { id: 't-eng-5', title: 'Civil Grading & Drainage Plan', status: 'done', priority: 'Medium', costCode: '02-2000', assignee: 'John Smith' }
    ]
  },
  {
    id: 'grp-precon',
    name: '2. Pre-Construction & Permits',
    iconType: 'precon',
    tasks: [
      { id: 't-pre-1', title: 'Boundary & Topographical Land Survey', status: 'done', priority: 'High', costCode: '01-3000', assignee: 'John Smith' },
      { id: 't-pre-2', title: 'HOA Architectural Review Approval', status: 'done', priority: 'Medium', costCode: '01-3100', assignee: 'Sarah Johnson' },
      { id: 't-pre-3', title: 'City Building Department Permit', status: 'done', priority: 'Critical', costCode: '01-3200', assignee: 'Sarah Johnson' },
      { id: 't-pre-4', title: 'DEP Environmental Stormwater Permit', status: 'done', priority: 'Medium', costCode: '01-3300', assignee: 'John Smith' },
      { id: 't-pre-5', title: 'Temporary Power Pole & Water Hookup', status: 'done', priority: 'High', costCode: '01-5000', assignee: 'John Smith' }
    ]
  },
  {
    id: 'grp-foundation',
    name: '3. Site Work & Foundation',
    iconType: 'foundation',
    tasks: [
      { id: 't-fnd-1', title: 'Site Excavation & Pad Compaction', status: 'done', priority: 'High', costCode: '02-3000', assignee: 'Apex Earthworks' },
      { id: 't-fnd-2', title: 'Underground Plumbing Rough-In', status: 'done', priority: 'High', costCode: '15-1000', assignee: 'Titan MEP' },
      { id: 't-fnd-3', title: 'Stem Wall & Vapor Barrier Installation', status: 'done', priority: 'Medium', costCode: '03-1000', assignee: 'Suncoast Concrete' },
      { id: 't-fnd-4', title: 'Post-Tension Foundation Slab Pour', status: 'done', priority: 'Critical', costCode: '03-3000', assignee: 'Suncoast Concrete' }
    ]
  },
  {
    id: 'grp-framing',
    name: '4. Structural Framing & Concrete Slabs',
    iconType: 'framing',
    tasks: [
      { id: 't-frm-1', title: 'First & Second Floor Wood Framing', status: 'done', priority: 'High', costCode: '06-1100', assignee: 'Apex Framing' },
      { id: 't-frm-2', title: 'Roof Truss Erection & Shear Decking', status: 'done', priority: 'High', costCode: '06-1200', assignee: 'Apex Framing' },
      { id: 't-frm-3', title: 'City Framing & Shear Inspection', status: 'in-progress', priority: 'Critical', costCode: '06-1300', assignee: 'John Smith', dueDate: 'Today 10:00 AM' },
      { id: 't-frm-4', title: 'Level 2 Elevated Deck Concrete Pour', status: 'todo', priority: 'Critical', costCode: '03-3100', assignee: 'Suncoast Concrete', dueDate: 'Thu, Sep 10' }
    ]
  },
  {
    id: 'grp-mep',
    name: '5. MEP Utility Rough-In (Mech, Elec, Plumb)',
    iconType: 'mep',
    tasks: [
      { id: 't-mep-1', title: 'HVAC Overhead Ductwork & Line Sets', status: 'in-progress', priority: 'High', costCode: '15-4000', assignee: 'Titan MEP', dueDate: 'Today 1:30 PM' },
      { id: 't-mep-2', title: 'Primary Romex Wiring & Electrical Boxes', status: 'in-progress', priority: 'Medium', costCode: '16-1000', assignee: 'Spark Electric' },
      { id: 't-mep-3', title: 'Plumbing Drain Waste Vent Pressure Test', status: 'todo', priority: 'High', costCode: '15-2000', assignee: 'Titan MEP', dueDate: 'Fri, Sep 11' }
    ]
  },
  {
    id: 'grp-envelope',
    name: '6. Building Envelope & Exterior Glass',
    iconType: 'envelope',
    tasks: [
      { id: 't-env-1', title: 'Weather Barrier Housewrap & Flashing', status: 'todo', priority: 'High', costCode: '07-2000', assignee: 'Apex Framing' },
      { id: 't-env-2', title: 'Impact Glass Windows & Sliders', status: 'todo', priority: 'Critical', costCode: '08-5000', assignee: 'ClearView Glazing' },
      { id: 't-env-3', title: 'Exterior Stucco Scratch & Brown Coat', status: 'todo', priority: 'Medium', costCode: '09-2000', assignee: 'Stucco Masters' },
      { id: 't-env-4', title: 'Roof Underlayment & Metal Standing Seam', status: 'todo', priority: 'High', costCode: '07-6000', assignee: 'Suncoast Roofing' }
    ]
  }
];

export const ProjectTasksTab: React.FC<ProjectTasksTabProps> = ({
  project,
  onCreateTask: onOpenCreateTaskModal,
}) => {
  const [stageGroups, setStageGroups] = useState<StageTaskGroup[]>(SNELL_ISLE_TASK_STAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<EditableTaskData | null>(null);
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState<string>('');

  // Close menus on click outside
  React.useEffect(() => {
    const handleGlobalClick = () => setOpenMenuTaskId(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Icon mapping
  const getStageIcon = (iconType: string) => {
    switch (iconType) {
      case 'eng': return <Layers className="w-4 h-4 text-[#1677FF]" />;
      case 'precon': return <Sliders className="w-4 h-4 text-amber-600" />;
      case 'foundation': return <Hammer className="w-4 h-4 text-emerald-600" />;
      case 'framing': return <Boxes className="w-4 h-4 text-purple-600" />;
      case 'mep': return <Wrench className="w-4 h-4 text-sky-600" />;
      case 'envelope': return <Building2 className="w-4 h-4 text-teal-600" />;
      default: return <Layers className="w-4 h-4 text-[#1677FF]" />;
    }
  };

  const getStageIconBg = (iconType: string) => {
    switch (iconType) {
      case 'eng': return 'bg-[#EAF3FF]';
      case 'precon': return 'bg-amber-50';
      case 'foundation': return 'bg-emerald-50';
      case 'framing': return 'bg-purple-50';
      case 'mep': return 'bg-sky-50';
      case 'envelope': return 'bg-teal-50';
      default: return 'bg-slate-50';
    }
  };

  // Toggle single group accordion
  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const allCollapsed = stageGroups.length > 0 && stageGroups.every(g => !!collapsedGroups[g.id]);

  const handleToggleAll = () => {
    if (allCollapsed) {
      setCollapsedGroups({});
    } else {
      const all: Record<string, boolean> = {};
      stageGroups.forEach(g => {
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
      setStageGroups(prev => prev.map(g => g.id === groupId ? { ...g, name: editingGroupName.trim() } : g));
    }
    setEditingGroupId(null);
  };

  const handleCancelRenameGroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGroupId(null);
  };

  // Toggle task status progression: To Do -> In Progress -> Done -> To Do
  const toggleTaskStatus = (groupId: string, taskId: string) => {
    setStageGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;
      return {
        ...grp,
        tasks: grp.tasks.map(t => {
          if (t.id !== taskId) return t;
          let nextStatus: 'todo' | 'in-progress' | 'done' = 'in-progress';
          if (t.status === 'todo') nextStatus = 'in-progress';
          else if (t.status === 'in-progress') nextStatus = 'done';
          else if (t.status === 'done') nextStatus = 'todo';
          return { ...t, status: nextStatus };
        })
      };
    }));
  };

  const deleteTask = (groupId: string, taskId: string) => {
    setStageGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;
      return {
        ...grp,
        tasks: grp.tasks.filter(t => t.id !== taskId)
      };
    }));
  };

  const handleSaveTaskEdit = (updated: {
    id: string;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    priority?: 'Low' | 'Medium' | 'High' | 'Critical';
    costCode?: string;
    assignee?: string;
    dueDate?: string;
    targetGroupId: string;
  }) => {
    if (!editingTask) return;

    setStageGroups(prev => {
      if (updated.targetGroupId === editingTask.groupId) {
        return prev.map(grp => {
          if (grp.id !== editingTask.groupId) return grp;
          return {
            ...grp,
            tasks: grp.tasks.map(t => {
              if (t.id !== updated.id) return t;
              return {
                ...t,
                title: updated.title,
                status: updated.status,
                priority: updated.priority,
                costCode: updated.costCode,
                assignee: updated.assignee,
                dueDate: updated.dueDate
              };
            })
          };
        });
      }

      const updatedTaskObj: TaskItem = {
        id: updated.id,
        title: updated.title,
        status: updated.status,
        priority: updated.priority,
        costCode: updated.costCode,
        assignee: updated.assignee,
        dueDate: updated.dueDate
      };

      return prev.map(grp => {
        if (grp.id === editingTask.groupId) {
          return { ...grp, tasks: grp.tasks.filter(t => t.id !== updated.id) };
        }
        if (grp.id === updated.targetGroupId) {
          return { ...grp, tasks: [...grp.tasks, updatedTaskObj] };
        }
        return grp;
      });
    });

    setEditingTask(null);
  };

  // Total metrics
  const allTasks = useMemo(() => stageGroups.flatMap(g => g.tasks), [stageGroups]);
  const totalCount = allTasks.length;
  const doneCount = allTasks.filter(t => t.status === 'done').length;
  const inProgressCount = allTasks.filter(t => t.status === 'in-progress').length;
  const todoCount = allTasks.filter(t => t.status === 'todo').length;

  // Filtered groups based on search & status filter
  const filteredGroups = useMemo(() => {
    return stageGroups.map(grp => {
      const filteredTasks = grp.tasks.filter(t => {
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        const matchesSearch = !searchQuery.trim() || 
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grp.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      });

      return {
        ...grp,
        tasks: filteredTasks,
        originalTasks: grp.tasks
      };
    }).filter(grp => grp.tasks.length > 0 || !searchQuery.trim());
  }, [stageGroups, statusFilter, searchQuery]);

  return (
    <div className="w-full flex-1 flex flex-col gap-3.5 px-4 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      
      {/* ─── 1. Header & Primary CTA ─── */}
      <div className="flex items-center justify-between px-0.5 pt-1">
        <div>
          <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">
            Project Tasks
          </h1>
          <p className="text-xs text-[#64748B] font-medium mt-0.5">
            {doneCount} of {totalCount} tasks completed ({Math.round((doneCount / totalCount) * 100)}%)
          </p>
        </div>

        <button
          onClick={() => {
            if (onOpenCreateTaskModal) onOpenCreateTaskModal();
            else setIsCreateModalOpen(true);
          }}
          className="h-9 px-3.5 rounded-xl bg-[#1677FF] hover:bg-[#1366DB] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
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
          onClick={() => setStatusFilter('todo')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
            statusFilter === 'todo'
              ? 'bg-[#1677FF] text-white font-bold shadow-xs'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          To Do ({todoCount})
        </button>

        <button
          onClick={() => setStatusFilter('in-progress')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
            statusFilter === 'in-progress'
              ? 'bg-[#1677FF] text-white font-bold shadow-xs'
              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          In Progress ({inProgressCount})
        </button>

        <button
          onClick={() => setStatusFilter('done')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0 ${
            statusFilter === 'done'
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
          placeholder="Search tasks..."
          className="w-full h-9 pl-9 pr-8 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1677FF] transition-colors shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] hover:text-[#0F172A]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ─── 4. Secondary Action Row: Collapse / Expand ─── */}
      <div className="flex items-center justify-between px-0.5 text-xs font-medium">
        <button
          onClick={handleToggleAll}
          className="text-[#1677FF] font-semibold hover:underline cursor-pointer"
        >
          {allCollapsed ? 'Expand All' : 'Collapse All'}
        </button>

        <button
          onClick={() => alert('CSI MasterFormat construction task templates loaded into Snell Isle Residence.')}
          className="flex items-center gap-1 text-[#64748B] hover:text-[#1677FF] transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Import Tasks</span>
        </button>
      </div>

      {/* ─── 5. Stage Groups List ─── */}
      <div className="flex flex-col gap-3">
        {filteredGroups.map((group) => {
          const isCollapsed = !!collapsedGroups[group.id];
          const groupTotal = group.originalTasks.length;
          const groupDone = group.originalTasks.filter(t => t.status === 'done').length;
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
                            is100Done ? 'bg-emerald-500' : groupPercent > 0 ? 'bg-[#1677FF]' : 'bg-transparent'
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
                    is100Done ? 'text-emerald-700' : groupPercent > 0 ? 'text-[#1677FF]' : 'text-[#64748B]'
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

              {/* Task Items */}
              {!isCollapsed && (
                <div className="divide-y divide-[#F1F5F9] border-t border-[#E2E8F0]">
                  {group.tasks.length === 0 ? (
                    <p className="text-xs text-[#94A3B8] py-3 text-center">
                      No tasks matching filters.
                    </p>
                  ) : (
                    group.tasks.map((task) => {
                      const isTaskDone = task.status === 'done';
                      const isTaskInProgress = task.status === 'in-progress';

                      return (
                        <div
                          key={task.id}
                          className="px-3.5 py-3 hover:bg-[#F8FAFC] flex items-center justify-between gap-2.5 transition-colors group"
                        >
                          {/* Left: Checkmark & Task Title */}
                          <div 
                            onClick={() => toggleTaskStatus(group.id, task.id)}
                            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer select-none"
                          >
                            <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isTaskDone 
                                ? 'bg-emerald-600 text-white' 
                                : isTaskInProgress
                                ? 'border-2 border-[#1677FF] bg-[#EAF3FF]'
                                : 'border-2 border-[#CBD5E1] bg-white hover:border-[#1677FF]'
                            }`}>
                              {isTaskDone ? (
                                <Check className="w-3 h-3 stroke-[3]" />
                              ) : isTaskInProgress ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF]" />
                              ) : null}
                            </div>

                            <div className="min-w-0 flex-1">
                              <span 
                                className={`text-xs block leading-snug break-words ${
                                  isTaskDone 
                                    ? 'text-[#94A3B8] line-through' 
                                    : 'font-semibold text-[#0F172A] group-hover:text-[#1677FF]'
                                }`}
                              >
                                {task.title}
                              </span>
                              {task.dueDate && !isTaskDone && (
                                <span className="text-[10px] text-[#1677FF] font-medium block mt-0.5">
                                  Due: {task.dueDate}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right: Status Pill & 3-Dot Action Menu */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => toggleTaskStatus(group.id, task.id)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1 whitespace-nowrap ${
                                isTaskDone
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : isTaskInProgress
                                  ? 'bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/30'
                                  : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                              }`}
                            >
                              {isTaskDone ? (
                                <span>Done</span>
                              ) : isTaskInProgress ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-pulse" />
                                  <span>In Progress</span>
                                </>
                              ) : (
                                <span>To Do</span>
                              )}
                            </button>

                            {/* 3-Dot Action Menu (Edit / Delete) */}
                            <div className="relative" onClick={e => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuTaskId(prev => prev === task.id ? null : task.id);
                                }}
                                className="w-8 h-8 rounded-xl text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                                title="More options"
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
                                        assignee: task.assignee,
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
                                      deleteTask(group.id, task.id);
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
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Modal ─── */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        project={project}
        onCreate={(newTask) => {
          setStageGroups(prev => [
            ...prev,
            {
              id: `grp-${Date.now()}`,
              name: 'Custom Phase',
              iconType: 'eng',
              tasks: [{
                id: `tsk-${Date.now()}`,
                title: newTask.title || 'New Task',
                status: 'todo',
                priority: newTask.priority || 'Medium'
              }]
            }
          ]);
          setIsCreateModalOpen(false);
        }}
      />

      {/* ─── EDIT TASK MODAL ─── */}
      <EditTaskModal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        stageGroups={stageGroups.map(g => ({ id: g.id, name: g.name }))}
        onSave={handleSaveTaskEdit}
        onDelete={(groupId, taskId) => deleteTask(groupId, taskId)}
      />

    </div>
  );
};
