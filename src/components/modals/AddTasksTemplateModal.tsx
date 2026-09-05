import React, { useState } from 'react';
import { X, CheckSquare, CheckCircle2, ChevronDown, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { Task, Priority } from '../../types';

interface AddTasksTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (tasks: Partial<Task>[]) => void;
  projectName?: string;
  projectId?: string;
}

interface TemplateTaskGroup {
  id: string;
  name: string;
  tasks: {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    milestone: string;
  }[];
}

const TEMPLATE_GROUPS: TemplateTaskGroup[] = [
  {
    id: 'eng',
    name: '1. Engineering',
    tasks: [
      {
        id: 'eng-1',
        title: 'Geotechnical soil report & foundation design',
        description: 'Verify soil bearing capacity and engineer foundation specs.',
        priority: 'Critical',
        milestone: 'Pre-Construction'
      },
      {
        id: 'eng-2',
        title: 'Structural engineering drawings & framing calculations',
        description: 'Load calculations for lateral wind/seismic and structural framing.',
        priority: 'High',
        milestone: 'Pre-Construction'
      },
      {
        id: 'eng-3',
        title: 'Truss engineering & shop drawings',
        description: 'Manufacturer engineered truss stamped packages and layout.',
        priority: 'High',
        milestone: 'Pre-Construction'
      },
      {
        id: 'eng-4',
        title: 'Wind / seismic load calculations',
        description: 'Hurricane zone wind speed compliance certification.',
        priority: 'Critical',
        milestone: 'Pre-Construction'
      },
      {
        id: 'eng-5',
        title: 'Civil site engineering (grading & drainage plan)',
        description: 'Stormwater runoff retention and civil grading plan review.',
        priority: 'Medium',
        milestone: 'Pre-Construction'
      }
    ]
  },
  {
    id: 'precon',
    name: '2. Pre-Construction & Permits',
    tasks: [
      {
        id: 'pre-1',
        title: 'Land survey & soil bearing test',
        description: 'Boundary and topographical survey verification.',
        priority: 'High',
        milestone: 'Pre-Construction'
      },
      {
        id: 'pre-2',
        title: 'Submit HOA / architectural review package',
        description: 'Formal architectural elevation package submission for approval.',
        priority: 'Medium',
        milestone: 'Pre-Construction'
      },
      {
        id: 'pre-3',
        title: 'Pull building permit',
        description: 'Municipal building department permit issuance.',
        priority: 'Critical',
        milestone: 'Pre-Construction'
      },
      {
        id: 'pre-4',
        title: 'Pull environmental permit (DEP / stormwater SWPPP)',
        description: 'Silt fence and environmental sediment protection sign-off.',
        priority: 'Medium',
        milestone: 'Pre-Construction'
      },
      {
        id: 'pre-5',
        title: 'Set up temporary power & water',
        description: 'Temporary power pole install and municipal water hookup.',
        priority: 'High',
        milestone: 'Pre-Construction'
      },
      {
        id: 'pre-6',
        title: 'Install silt fencing & erosion control',
        description: 'Perimeter erosion barriers per environmental specs.',
        priority: 'Medium',
        milestone: 'Pre-Construction'
      }
    ]
  },
  {
    id: 'foundation',
    name: '3. Site Work & Foundation',
    tasks: [
      {
        id: 'fnd-1',
        title: 'Excavation & rough grading',
        description: 'Mass excavation and site clearing to engineered pad elevation.',
        priority: 'High',
        milestone: 'Substructure & Foundation'
      },
      {
        id: 'fnd-2',
        title: 'Underground plumbing rough-in inspection',
        description: 'Sewer and under-slab plumbing piping pressure test and sign-off.',
        priority: 'Critical',
        milestone: 'Substructure & Foundation'
      },
      {
        id: 'fnd-3',
        title: 'Form & pour post-tension slab foundation',
        description: 'Rebar placement, vapor barrier, and monolithic concrete pour.',
        priority: 'Critical',
        milestone: 'Substructure & Foundation'
      }
    ]
  },
  {
    id: 'framing',
    name: '4. Framing & Structure',
    tasks: [
      {
        id: 'frm-1',
        title: 'First & second floor wood framing',
        description: 'Wall plates, exterior shear walls, floor joists, and interior partitions.',
        priority: 'High',
        milestone: 'Superstructure Framing'
      },
      {
        id: 'frm-2',
        title: 'Roof truss installation & decking',
        description: 'Crane truss setting, bracing, and roof sheathing.',
        priority: 'High',
        milestone: 'Superstructure Framing'
      },
      {
        id: 'frm-3',
        title: 'Framing structural municipal inspection',
        description: 'City building official structural framing inspection approval.',
        priority: 'Critical',
        milestone: 'Superstructure Framing'
      }
    ]
  }
];

export const AddTasksTemplateModal: React.FC<AddTasksTemplateModalProps> = ({
  isOpen,
  onClose,
  onAddTasks,
  projectName = 'Snell Isle Residence',
  projectId = 'proj-1'
}) => {
  const allTaskIds = TEMPLATE_GROUPS.flatMap(g => g.tasks.map(t => t.id));
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set(allTaskIds));
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const toggleSelectAll = () => {
    if (selectedTaskIds.size === allTaskIds.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(allTaskIds));
    }
  };

  const toggleTask = (taskId: string) => {
    const next = new Set(selectedTaskIds);
    if (next.has(taskId)) {
      next.delete(taskId);
    } else {
      next.add(taskId);
    }
    setSelectedTaskIds(next);
  };

  const toggleGroup = (groupId: string) => {
    const next = new Set(collapsedGroups);
    if (next.has(groupId)) {
      next.delete(groupId);
    } else {
      next.add(groupId);
    }
    setCollapsedGroups(next);
  };

  const handleApply = () => {
    const tasksToAdd: Partial<Task>[] = [];
    TEMPLATE_GROUPS.forEach(g => {
      g.tasks.forEach(t => {
        if (selectedTaskIds.has(t.id)) {
          tasksToAdd.push({
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            title: t.title,
            description: t.description,
            priority: t.priority,
            status: 'Not Started',
            dueDate: '2025-06-15',
            startDate: '2025-05-20',
            milestone: t.milestone,
            projectId: projectId,
            projectName: projectName,
            location: 'Jobsite Ground Level',
            assignee: {
              id: 'usr_pm',
              name: 'Sarah Johnson',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
              role: 'Project Manager'
            },
            subtasks: [
              { id: `st-${Date.now()}-1`, title: 'Execute trade scope per code', completed: false }
            ],
            attachmentsCount: 1,
            notesCount: 0
          });
        }
      });
    });

    onAddTasks(tasksToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[460px] bg-white border border-[#DDE1E7] rounded-3xl p-5 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-[#171A1F]">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-[#EAEDF1]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#171A1F] tracking-tight">
                Add Tasks — Standard Build Template
              </h3>
              <p className="text-xs text-[#68707C] font-medium mt-0.5">
                Standard Phase Construction Checklist
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] border border-[#DDE1E7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls Bar: Selected Count + Select All / Deselect All */}
        <div className="flex items-center justify-between py-3 border-b border-[#EAEDF1] text-xs">
          <span className="font-bold text-[#1677FF]">
            {selectedTaskIds.size} of {allTaskIds.length} tasks selected
          </span>

          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-xs text-[#68707C] hover:text-[#171A1F] font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#1677FF]" />
            <span>{selectedTaskIds.size === allTaskIds.length ? 'Deselect all' : 'Select all'}</span>
          </button>
        </div>

        {/* Task Groups List */}
        <div className="flex flex-col gap-3 py-3 flex-1 overflow-y-auto">
          {TEMPLATE_GROUPS.map((group) => {
            const isCollapsed = collapsedGroups.has(group.id);
            const groupSelectedCount = group.tasks.filter(t => selectedTaskIds.has(t.id)).length;

            return (
              <div key={group.id} className="rounded-2xl bg-white border border-[#DDE1E7] overflow-hidden shadow-xs">
                {/* Group Header */}
                <div
                  onClick={() => toggleGroup(group.id)}
                  className="p-3 bg-[#F7F8FA] flex items-center justify-between cursor-pointer hover:bg-[#EAF3FF]/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-[#68707C]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#1677FF]" />
                    )}
                    <span className="text-xs font-bold text-[#171A1F]">{group.name}</span>
                  </div>

                  <span className="text-[12px] font-bold text-[#68707C] bg-white px-2 py-0.5 rounded-md border border-[#DDE1E7]">
                    {groupSelectedCount}/{group.tasks.length}
                  </span>
                </div>

                {/* Group Tasks */}
                {!isCollapsed && (
                  <div className="p-2 flex flex-col gap-1.5 border-t border-[#EAEDF1]">
                    {group.tasks.map((task) => {
                      const isSelected = selectedTaskIds.has(task.id);
                      return (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-[#EAF3FF]/40 border-[#1677FF]/40 text-[#171A1F]'
                              : 'bg-white border-[#EAEDF1] text-[#68707C] hover:bg-[#F7F8FA]'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected ? 'bg-[#1677FF] border-[#1677FF] text-white' : 'border-[#DDE1E7] bg-white'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold leading-snug text-[#171A1F]">{task.title}</h4>
                            <p className="text-xs text-[#68707C] mt-0.5 line-clamp-1">{task.description}</p>
                          </div>

                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                            task.priority === 'Critical'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/20'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAEDF1] mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-[#DDE1E7] bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={selectedTaskIds.size === 0}
            className="h-10 px-5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] disabled:opacity-50 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add {selectedTaskIds.size} Tasks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
