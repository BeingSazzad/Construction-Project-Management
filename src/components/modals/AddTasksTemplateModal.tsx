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
        description: 'Utility hookup for jobsite temporary meter and standpipe.',
        priority: 'High',
        milestone: 'Pre-Construction'
      },
      {
        id: 'pre-6',
        title: 'Site clearing, tree protection & silt fencing',
        description: 'Excavation perimeter protection and site boundary staking.',
        priority: 'Medium',
        milestone: 'Pre-Construction'
      }
    ]
  },
  {
    id: 'concrete',
    name: '3. Foundation & Concrete',
    tasks: [
      {
        id: 'con-1',
        title: 'Excavation & footing trenches',
        description: 'Dig continuous perimeter footings and grade beams.',
        priority: 'High',
        milestone: 'Substructure'
      },
      {
        id: 'con-2',
        title: 'Under-slab plumbing & electrical rough-ins',
        description: 'PVC sanitary sewer lines and power conduits below vapor barrier.',
        priority: 'Critical',
        milestone: 'Substructure'
      },
      {
        id: 'con-3',
        title: 'Vapor barrier & rebar grid installation',
        description: '15-mil vapor barrier and grade 60 steel rebar placement.',
        priority: 'High',
        milestone: 'Substructure'
      },
      {
        id: 'con-4',
        title: 'Pre-pour municipal foundation inspection',
        description: 'Building inspector sign-off prior to concrete truck delivery.',
        priority: 'Critical',
        milestone: 'Substructure'
      },
      {
        id: 'con-5',
        title: 'Pour slab & foundation walls (4,000 PSI ready-mix)',
        description: 'Concrete placement, vibrated and power troweled finish.',
        priority: 'Critical',
        milestone: 'Substructure'
      }
    ]
  },
  {
    id: 'framing',
    name: '4. Structural Framing',
    tasks: [
      {
        id: 'frm-1',
        title: 'Sill plate installation & hurricane anchors',
        description: 'Treated sill plates fastened with Simpson anchor bolts.',
        priority: 'Critical',
        milestone: 'Structural Framing'
      },
      {
        id: 'frm-2',
        title: 'First floor wall framing & shear panels',
        description: '2x6 exterior framing with OSB shear wall strapping.',
        priority: 'High',
        milestone: 'Structural Framing'
      },
      {
        id: 'frm-3',
        title: 'Engineered floor joists & subfloor decking',
        description: 'I-joists with glued and screwed 3/4 tongue & groove subfloor.',
        priority: 'High',
        milestone: 'Structural Framing'
      },
      {
        id: 'frm-4',
        title: 'Roof truss erection & hurricane clips',
        description: 'Crane erection of roof trusses and H2.5A hurricane ties.',
        priority: 'Critical',
        milestone: 'Structural Framing'
      },
      {
        id: 'frm-5',
        title: 'Roof sheathing & synthetic underlayment dry-in',
        description: 'Roof OSB deck with waterproof peel-and-stick underlayment.',
        priority: 'Critical',
        milestone: 'Structural Framing'
      }
    ]
  },
  {
    id: 'mep',
    name: '5. Rough-In MEP (Trades)',
    tasks: [
      {
        id: 'mep-1',
        title: 'HVAC ductwork, line sets & air handlers',
        description: 'Rigid trunk lines, flexible branch ducts and condenser lines.',
        priority: 'High',
        milestone: 'MEP Rough-In'
      },
      {
        id: 'mep-2',
        title: 'Plumbing supply (PEX) & drain-waste-vent (DWV)',
        description: 'Pressure tested water supply lines and roof stack vents.',
        priority: 'High',
        milestone: 'MEP Rough-In'
      },
      {
        id: 'mep-3',
        title: 'Electrical wiring, panel & low voltage',
        description: 'Romex branch circuits, home runs to 200A main panel and CAT6.',
        priority: 'High',
        milestone: 'MEP Rough-In'
      },
      {
        id: 'mep-4',
        title: 'Rough-in MEP municipal combination inspection',
        description: 'Full multi-trade inspection sign-off before insulation.',
        priority: 'Critical',
        milestone: 'MEP Rough-In'
      }
    ]
  }
];

export const AddTasksTemplateModal: React.FC<AddTasksTemplateModalProps> = ({
  isOpen,
  onClose,
  onAddTasks,
  projectName = 'Active Project',
  projectId = 'proj-1'
}) => {
  // Collect all task IDs by default
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[460px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-[#142036]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Add Tasks — Southeast Template
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                (Hurricane / Wind Zone) • Build Order
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls Bar: Selected Count + Select All / Deselect All */}
        <div className="flex items-center justify-between py-3 border-b border-[#142036] text-xs">
          <span className="font-bold text-blue-400">
            {selectedTaskIds.size} of {allTaskIds.length} tasks selected
          </span>

          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>{selectedTaskIds.size === allTaskIds.length ? 'Deselect all' : 'Select all'}</span>
          </button>
        </div>

        {/* Task Groups List */}
        <div className="flex flex-col gap-3 py-3 flex-1 overflow-y-auto">
          {TEMPLATE_GROUPS.map((group) => {
            const isCollapsed = collapsedGroups.has(group.id);
            const groupSelectedCount = group.tasks.filter(t => selectedTaskIds.has(t.id)).length;

            return (
              <div key={group.id} className="rounded-2xl bg-[#050811] border border-[#142036] overflow-hidden">
                {/* Group Header */}
                <div
                  onClick={() => toggleGroup(group.id)}
                  className="p-3 bg-[#080E1D] flex items-center justify-between cursor-pointer hover:bg-[#0C152B] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-xs font-bold text-white">{group.name}</span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400 bg-[#050811] px-2 py-0.5 rounded-md border border-[#142036]">
                    {groupSelectedCount}/{group.tasks.length}
                  </span>
                </div>

                {/* Group Tasks */}
                {!isCollapsed && (
                  <div className="p-2 flex flex-col gap-1.5">
                    {group.tasks.map((task) => {
                      const isSelected = selectedTaskIds.has(task.id);
                      return (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-[#0E1A33] border-[#1E325A] text-white'
                              : 'bg-[#050811] border-transparent text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected ? 'bg-[#2563EB] border-blue-400 text-white' : 'border-[#1E2C48]'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold leading-snug">{task.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
                          </div>

                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                            task.priority === 'Critical'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
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
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#142036] mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-[#1E2C48] text-slate-300 text-xs font-semibold hover:bg-[#0E1A33] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={selectedTaskIds.size === 0}
            className="h-10 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add {selectedTaskIds.size} Tasks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
