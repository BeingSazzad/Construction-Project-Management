import React, { useState } from 'react';
import { Project, Task } from '../../types';
import { 
  Plus, Download, Trash2, Check, 
  ChevronDown, ChevronUp, X,
  Layers, Hammer, Boxes, FileCheck2, CheckSquare, Sliders, ChevronRight
} from 'lucide-react';

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
}

interface StageTaskGroup {
  id: string;
  name: string;
  iconType: string;
  tasks: TaskItem[];
}

const INITIAL_STAGE_GROUPS: StageTaskGroup[] = [
  {
    id: 'grp-eng',
    name: 'Engineering',
    iconType: 'eng',
    tasks: [
      { id: 't-1', title: 'Geotechnical soil report & foundation design', status: 'done' },
      { id: 't-2', title: 'Structural engineering drawings & framing calculations', status: 'done' },
      { id: 't-3', title: 'Truss engineering & shop drawings', status: 'done' },
      { id: 't-4', title: 'Wind / seismic load calculations', status: 'done' },
      { id: 't-5', title: 'Civil site engineering (grading & drainage plan)', status: 'done' }
    ]
  },
  {
    id: 'grp-precon',
    name: 'Pre-Construction',
    iconType: 'precon',
    tasks: [
      { id: 't-6', title: 'Land survey & soil bearing test', status: 'todo' },
      { id: 't-7', title: 'Submit HOA / architectural review package', status: 'todo' },
      { id: 't-8', title: 'Pull building permit', status: 'todo' },
      { id: 't-9', title: 'Pull environmental permit (DEP / stormwater SWPPP)', status: 'todo' },
      { id: 't-10', title: 'Set up temporary power & water', status: 'todo' },
      { id: 't-11', title: 'Install silt fencing & erosion control', status: 'todo' }
    ]
  },
  {
    id: 'grp-foundation',
    name: 'Site Work & Foundation',
    iconType: 'foundation',
    tasks: [
      { id: 't-12', title: 'Excavation & rough grading', status: 'todo' },
      { id: 't-13', title: 'Underground plumbing rough-in inspection', status: 'todo' },
      { id: 't-14', title: 'Form & pour post-tension slab foundation', status: 'todo' }
    ]
  },
  {
    id: 'grp-framing',
    name: 'Framing & Structure',
    iconType: 'framing',
    tasks: [
      { id: 't-15', title: 'First & second floor wood framing', status: 'todo' },
      { id: 't-16', title: 'Roof truss installation & decking', status: 'todo' },
      { id: 't-17', title: 'Framing structural municipal inspection', status: 'todo' }
    ]
  }
];

// Full Template Checklist Categories (from the 71-task reference template)
const TEMPLATE_PHASES = [
  {
    id: 'tp-drywall',
    name: '8. Insulation & Drywall',
    tasks: [
      'Insulation (walls & attic to R-13 walls / R-38 attic)',
      'Hang drywall',
      'Drywall finish & texture',
      'Prime walls'
    ]
  },
  {
    id: 'tp-finishes',
    name: '9. Interior Finishes',
    tasks: [
      'Interior doors & trim',
      'Cabinetry install',
      'Countertop template & install',
      'Hardwood & tile flooring',
      'Interior paint topcoat',
      'Hardware & fixture installation'
    ]
  },
  {
    id: 'tp-mep',
    name: '10. MEP Final Trim & Inspections',
    tasks: [
      'Electrical trim & fixture install',
      'Plumbing trim & faucet testing',
      'HVAC condenser startup & air balance',
      'Final building municipal inspection'
    ]
  }
];

export const ProjectTasksTab: React.FC<ProjectTasksTabProps> = ({ project }) => {
  const [stageGroups, setStageGroups] = useState<StageTaskGroup[]>(INITIAL_STAGE_GROUPS);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [isViewAll, setIsViewAll] = useState(false);

  // Modals & Bottom Sheet States
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCustomTaskModalOpen, setIsCustomTaskModalOpen] = useState(false);

  // Template selection state
  const [selectedTemplateTasks, setSelectedTemplateTasks] = useState<Record<string, boolean>>({
    'Insulation (walls & attic to R-13 walls / R-38 attic)': true,
    'Hang drywall': true,
    'Drywall finish & texture': true,
    'Prime walls': true,
    'Interior doors & trim': true,
    'Cabinetry install': true,
    'Countertop template & install': true,
    'Hardwood & tile flooring': true,
    'Interior paint topcoat': true,
    'Hardware & fixture installation': true,
    'Electrical trim & fixture install': true,
    'Plumbing trim & faucet testing': true,
    'HVAC condenser startup & air balance': true,
    'Final building municipal inspection': true
  });

  // Custom Task Form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedGroupForNewTask, setSelectedGroupForNewTask] = useState('grp-precon');

  // Master Code verification state
  const [verifyingTask, setVerifyingTask] = useState<{ groupId: string; taskId: string } | null>(null);
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const getStageIcon = (type: string) => {
    switch (type) {
      case 'eng': return <Layers className="w-4 h-4 text-blue-400" />;
      case 'precon': return <FileCheck2 className="w-4 h-4 text-amber-400" />;
      case 'foundation': return <Hammer className="w-4 h-4 text-emerald-400" />;
      case 'framing': return <Boxes className="w-4 h-4 text-purple-400" />;
      default: return <Layers className="w-4 h-4 text-blue-400" />;
    }
  };

  // Toggle stage accordion
  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Toggle task status (Done vs To Do)
  const toggleTaskStatus = (groupId: string, taskId: string) => {
    const group = stageGroups.find(g => g.id === groupId);
    const task = group?.tasks.find(t => t.id === taskId);
    
    if (task && task.status !== 'done') {
      // Prompt for Master Code to mark as Completed
      setVerifyingTask({ groupId, taskId });
      setEnteredCode('');
      setCodeError('');
    } else {
      setStageGroups(prev => prev.map(grp => {
        if (grp.id !== groupId) return grp;
        return {
          ...grp,
          tasks: grp.tasks.map(t => {
            if (t.id !== taskId) return t;
            return { ...t, status: 'todo' };
          })
        };
      }));
    }
  };

  const handleVerifyMasterCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingTask) return;

    const correctCode = project.masterCode || '1234';
    if (enteredCode === correctCode) {
      setStageGroups(prev => prev.map(grp => {
        if (grp.id !== verifyingTask.groupId) return grp;
        return {
          ...grp,
          tasks: grp.tasks.map(t => {
            if (t.id !== verifyingTask.taskId) return t;
            return { ...t, status: 'done' };
          })
        };
      }));
      setVerifyingTask(null);
    } else {
      setCodeError('Incorrect Master Code. Unlock failed.');
    }
  };

  // Delete task
  const deleteTask = (groupId: string, taskId: string) => {
    setStageGroups(prev => prev.map(grp => {
      if (grp.id !== groupId) return grp;
      return {
        ...grp,
        tasks: grp.tasks.filter(t => t.id !== taskId)
      };
    }));
  };

  // Import from Budget action
  const handleImportBudget = () => {
    alert("Imported line items from Project Master Budget into Pre-Construction and Foundation checklists!");
  };

  // Custom single task submit
  const handleAddCustomTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setStageGroups(prev => prev.map(grp => {
      if (grp.id !== selectedGroupForNewTask) return grp;
      return {
        ...grp,
        tasks: [
          ...grp.tasks,
          { id: `t-${Date.now()}`, title: newTaskTitle.trim(), status: 'todo' }
        ]
      };
    }));

    setNewTaskTitle('');
    setIsCustomTaskModalOpen(false);
  };

  // Template select all / deselect all
  const handleSelectAllTemplates = (select: boolean) => {
    const next: Record<string, boolean> = {};
    TEMPLATE_PHASES.forEach(p => {
      p.tasks.forEach(t => {
        next[t] = select;
      });
    });
    setSelectedTemplateTasks(next);
  };

  // Add Template tasks to project
  const handleApplyTemplateTasks = () => {
    TEMPLATE_PHASES.forEach(tp => {
      const addedTasks = tp.tasks
        .filter(t => selectedTemplateTasks[t])
        .map(t => ({ id: `t-${Date.now()}-${Math.random()}`, title: t, status: 'todo' as const }));

      if (addedTasks.length > 0) {
        setStageGroups(prev => [
          ...prev,
          {
            id: `grp-${tp.id}-${Date.now()}`,
            name: tp.name,
            iconType: 'framing',
            tasks: addedTasks
          }
        ]);
      }
    });

    setIsTemplateModalOpen(false);
  };

  const totalTasksCount = stageGroups.reduce((acc, g) => acc + g.tasks.length, 0);
  const doneTasksCount = stageGroups.reduce((acc, g) => acc + g.tasks.filter(t => t.status === 'done').length, 0);
  const selectedTemplateCount = Object.values(selectedTemplateTasks).filter(Boolean).length;

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. TASKS HEADER & PRIMARY ACTION ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Project Tasks</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {doneTasksCount} of {totalTasksCount} tasks completed
          </p>
        </div>

        {/* Primary CTA: Opens Bottom Sheet */}
        <button
          onClick={() => setIsBottomSheetOpen(true)}
          className="h-9 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* ─── 2. SECONDARY TOOLBAR (Ultra Clean & Minimal) ─── */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-[#070D1A] rounded-2xl border border-[#142036] shadow-sm">
        <button
          onClick={() => setIsViewAll(!isViewAll)}
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 hover:text-white hover:bg-[#0E1A33] transition-colors cursor-pointer"
        >
          {isViewAll ? 'Collapse All' : 'Expand All'}
        </button>

        <button
          onClick={handleImportBudget}
          className="px-3 py-1.5 rounded-xl bg-[#0D1424] hover:bg-[#142036] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-[#1A263E] cursor-pointer transition-colors"
          title="Import line items from project budget"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>Import Budget</span>
        </button>
      </div>

      {/* ─── 3. STAGE/DIVISION TASK ACCORDIONS ─── */}
      <div className="flex flex-col gap-3">
        {stageGroups.map((group) => {
          const isCollapsed = !isViewAll && collapsedGroups[group.id];
          const doneCount = group.tasks.filter(t => t.status === 'done').length;
          const totalCount = group.tasks.length;
          const isAllDone = totalCount > 0 && doneCount === totalCount;

          return (
            <div
              key={group.id}
              className="rounded-2xl bg-[#070D1A] border border-[#142036] overflow-hidden shadow-sm transition-all"
            >
              {/* Accordion Group Header */}
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="w-full p-3.5 flex items-center justify-between bg-[#070D1A] hover:bg-[#0E1A33] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0D1424] border border-[#1A263E] flex items-center justify-center flex-shrink-0">
                    {getStageIcon(group.iconType)}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xs font-bold text-white tracking-tight">{group.name}</h3>
                    <p className="text-[12px] text-slate-400 mt-0.5">{totalCount} items in phase</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full border ${
                    isAllDone
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {doneCount}/{totalCount}
                  </span>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Task Items List */}
              {!isCollapsed && (
                <div className="flex flex-col gap-1.5 p-3 pt-0 border-t border-[#142036]/60">
                  {group.tasks.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 text-center">No tasks in this stage.</p>
                  ) : (
                    group.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] hover:border-blue-500/30 flex items-center justify-between gap-2.5 transition-colors group"
                      >
                        <div 
                          onClick={() => toggleTaskStatus(group.id, task.id)}
                          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer select-none"
                        >
                          <span 
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              task.status === 'done' ? 'bg-emerald-400 ring-2 ring-emerald-500/20' : 'bg-amber-400'
                            }`} 
                          />
                          <span 
                            className={`text-xs font-medium truncate ${
                              task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-200 hover:text-white'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Status Pill with proper casing */}
                          <button
                            onClick={() => toggleTaskStatus(group.id, task.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1 ${
                              task.status === 'done'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20'
                            }`}
                          >
                            {task.status === 'done' ? (
                              <>
                                <Check className="w-3 h-3 stroke-[2.5]" />
                                <span>Done</span>
                              </>
                            ) : (
                              <span>To Do</span>
                            )}
                          </button>

                          {/* Delete Task */}
                          <button
                            onClick={() => deleteTask(group.id, task.id)}
                            className="w-7 h-7 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center cursor-pointer transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── 4. BOTTOM SHEET: SELECT TASK CREATION MODE ─── */}
      {isBottomSheetOpen && (
        <div 
          onClick={() => setIsBottomSheetOpen(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in font-sans"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[430px] bg-[#070D1A] border-t border-x border-[#142036] rounded-t-[28px] p-5 pb-8 shadow-2xl flex flex-col gap-3.5 text-slate-100 animate-slide-up"
          >
            {/* Pull Indicator */}
            <div className="w-10 h-1 rounded-full bg-slate-600/60 mx-auto -mt-1 mb-1" />

            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Select Task Creation Mode</h3>
                <p className="text-[12px] text-slate-400 mt-0.5">Pick standard build phases or create a single task</p>
              </div>
              <button
                onClick={() => setIsBottomSheetOpen(false)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Option 1: Construction Phase Template */}
            <button
              onClick={() => {
                setIsBottomSheetOpen(false);
                setIsTemplateModalOpen(true);
              }}
              className="p-4 rounded-2xl bg-[#0D1424] hover:bg-[#142036] border border-blue-500/30 hover:border-blue-500/60 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    Construction Phase Template
                  </h4>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    Pre-loaded build order: Pre-Con, Drywall, Finishes & MEP (71 Tasks)
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white flex-shrink-0" />
            </button>

            {/* Option 2: Custom Single Task */}
            <button
              onClick={() => {
                setIsBottomSheetOpen(false);
                setIsCustomTaskModalOpen(true);
              }}
              className="p-4 rounded-2xl bg-[#0D1424] hover:bg-[#142036] border border-[#1E2E4A] hover:border-blue-500/40 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0E1A33] border border-[#1E325A] text-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    Custom Single Task
                  </h4>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    Create an individual task or inspection from scratch
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white flex-shrink-0" />
            </button>

          </div>
        </div>
      )}

      {/* ─── 5. FULL TEMPLATE CHECKLIST MODAL (Website Reference 71 Tasks) ─── */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[420px] bg-[#070D1A] border border-[#1E2E4A] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white tracking-tight">Add Tasks — Construction Template</h3>
                </div>
                <p className="text-[12px] text-slate-400 mt-0.5">Select tasks in sequential build order</p>
              </div>

              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Select / Deselect All Controls */}
            <div className="flex items-center justify-between px-1 py-1 text-xs">
              <span className="text-[12px] text-slate-400 font-semibold">
                {selectedTemplateCount} tasks selected
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectAllTemplates(true)}
                  className="text-[12px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Select all</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAllTemplates(false)}
                  className="text-[12px] font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Deselect all
                </button>
              </div>
            </div>

            {/* Checklist Phases */}
            <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {TEMPLATE_PHASES.map((tp) => (
                <div key={tp.id} className="p-3 rounded-2xl bg-[#050811] border border-[#142036] flex flex-col gap-2">
                  <div className="flex items-center justify-between pb-1 border-b border-[#142036]">
                    <span className="text-xs font-bold text-white">{tp.name}</span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {tp.tasks.filter(t => selectedTemplateTasks[t]).length}/{tp.tasks.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {tp.tasks.map((tName) => {
                      const isChecked = !!selectedTemplateTasks[tName];
                      return (
                        <div
                          key={tName}
                          onClick={() => setSelectedTemplateTasks(prev => ({ ...prev, [tName]: !prev[tName] }))}
                          className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#0E1A33] cursor-pointer transition-colors"
                        >
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-emerald-500 text-black' : 'border border-slate-600 bg-slate-900'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs text-slate-200">{tName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#142036] mt-1">
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-[#0E1A33] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyTemplateTasks}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md shadow-blue-600/30 cursor-pointer active:scale-95 transition-all"
              >
                Add {selectedTemplateCount} Tasks
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── 6. CUSTOM SINGLE TASK MODAL ─── */}
      {isCustomTaskModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-[#070D1A] border border-[#1E2E4A] rounded-2xl p-5 shadow-2xl flex flex-col gap-3 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <h3 className="text-xs font-bold text-white">Create Custom Task</h3>
              <button
                onClick={() => setIsCustomTaskModalOpen(false)}
                className="w-6 h-6 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomTaskSubmit} className="flex flex-col gap-2.5 text-xs">
              <div>
                <label className="text-[12px] text-slate-400 block mb-1">Target Phase / Category</label>
                <select
                  value={selectedGroupForNewTask}
                  onChange={(e) => setSelectedGroupForNewTask(e.target.value)}
                  className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500 cursor-pointer"
                >
                  {stageGroups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[12px] text-slate-400 block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hydrostatic pressure test on pipe"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full h-9 bg-[#050811] border border-[#142036] rounded-lg px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#142036] mt-1">
                <button
                  type="button"
                  onClick={() => setIsCustomTaskModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#0E1A33] text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MASTER CODE UNLOCK MODAL ─── */}
      {verifyingTask && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[340px] bg-[#070D1A] border border-[#1E2E4A] rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div className="flex items-center gap-1.5 text-blue-400">
                <Sliders className="w-4 h-4" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Security Unlock</h3>
              </div>
              <button
                onClick={() => setVerifyingTask(null)}
                className="w-6 h-6 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVerifyMasterCode} className="flex flex-col gap-3 text-xs text-center">
              <p className="text-slate-300 text-[12px] leading-relaxed">
                Please enter the 4-digit **Project Master Code** to mark this task as completed.
              </p>

              <div className="flex flex-col items-center gap-2">
                <input
                  type="password"
                  required
                  maxLength={4}
                  placeholder="• • • •"
                  value={enteredCode}
                  onChange={(e) => {
                    setEnteredCode(e.target.value.replace(/\D/g, ''));
                    setCodeError('');
                  }}
                  className="w-32 h-10 bg-[#050811] border border-[#142036] rounded-xl text-center text-white text-lg font-black tracking-widest outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 italic">Required to unlock completed tasks.</span>
              </div>

              {codeError && (
                <div className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 py-1 px-2 rounded-lg font-bold animate-pulse">
                  {codeError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#142036] mt-1">
                <button
                  type="button"
                  onClick={() => setVerifyingTask(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0E1A33] text-slate-350 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Confirm Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
