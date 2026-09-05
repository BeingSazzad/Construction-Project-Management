import React from 'react';
import { Task, Project } from '../../types';
import { X, CheckSquare, Sliders, ChevronRight } from 'lucide-react';

interface TaskCreationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSelectTemplate: (template: Partial<Task>) => void;
  onSelectCustom: () => void;
}

export const TaskCreationTypeModal: React.FC<TaskCreationTypeModalProps> = ({
  isOpen,
  onClose,
  project,
  onSelectTemplate,
  onSelectCustom
}) => {
  if (!isOpen) return null;

  const TASK_PRESETS: { title: string; desc: string; milestone: string; priority: 'High' | 'Medium' | 'Critical'; costCode: string; subtasks: string[] }[] = [
    {
      title: 'Concrete Slump & Pour Quality Inspection',
      desc: 'Verify truck delivery tickets, slump test compliance, and rebar clearance before pour.',
      milestone: 'Substructure & Foundation',
      priority: 'Critical',
      costCode: '03-3000',
      subtasks: ['Check truck delivery time & slump specs', 'Verify rebar clearance & dowel positioning', 'Take 3 cylinder test samples']
    },
    {
      title: 'Structural Framing & Shear Wall Sign-off',
      desc: 'Audit post-to-beam connectors, hold-downs, and shear panel nailing schedule.',
      milestone: 'Superstructure Framing',
      priority: 'High',
      costCode: '06-1000',
      subtasks: ['Inspect Simpson tie connectors', 'Verify shear wall edge nailing (6" o.c.)', 'Structural engineer sign-off']
    },
    {
      title: 'MEP Rough-In Quality & Pressure Audit',
      desc: 'Hydrostatic pressure test on plumbing rough-in & electrical conduit clearance.',
      milestone: 'MEP Rough-In Phase',
      priority: 'High',
      costCode: '22-0000',
      subtasks: ['Hold 100 PSI pressure test for 30 mins', 'Check fire-stopping penetrations', 'Inspector sign-off']
    },
    {
      title: 'OSHA Daily Site Safety & Toolbox Talk',
      desc: 'Conduct daily morning safety alignment, PPE check, and fall protection audit.',
      milestone: 'Site Safety Operations',
      priority: 'Medium',
      costCode: '01-3100',
      subtasks: ['Conduct morning crew safety briefing', 'Inspect harness & lanyard anchor points', 'Record headcount in daily log']
    }
  ];

  const handlePresetClick = (preset: typeof TASK_PRESETS[0]) => {
    onSelectTemplate({
      title: preset.title,
      description: preset.desc,
      priority: preset.priority,
      status: 'Not Started',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      milestone: preset.milestone,
      location: 'Level 1-4 Core',
      costCode: preset.costCode,
      subtasks: preset.subtasks.map((st, idx) => ({ id: `st-preset-${Date.now()}-${idx}`, title: st, completed: false })),
      projectId: project?.id || 'proj-1',
      projectName: project?.name || 'Riverside Office Complex',
    });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-fade-in font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] bg-white border-t border-x border-[#DDE1E7] rounded-t-[28px] p-5 pb-8 shadow-2xl flex flex-col gap-3 text-[#171A1F] animate-slide-up max-h-[85vh] overflow-y-auto"
      >
        {/* Pull Bar */}
        <div className="w-10 h-1.5 rounded-full bg-[#DDE1E7] mx-auto -mt-1 mb-1" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEDF1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center">
              <CheckSquare className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171A1F] tracking-tight">Create Task Mode</h3>
              <p className="text-[11px] text-[#68707C] font-medium mt-0.5">Select a template preset or custom form</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Task Option Button */}
        <button
          onClick={() => {
            onClose();
            onSelectCustom();
          }}
          className="p-3.5 bg-[#F7F8FA] hover:bg-[#EAF3FF] border border-[#DDE1E7] hover:border-[#1677FF]/50 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer text-left active:scale-[0.99] group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sliders className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                Custom Task Form
              </h4>
              <p className="text-[11px] text-[#68707C] mt-0.5 font-medium">
                Create task from scratch with custom scope & assignees
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#68707C] group-hover:text-[#1677FF] flex-shrink-0" />
        </button>

        {/* Section Divider */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#68707C]">
            Or Pick a Pre-Con Task Template
          </span>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Instant Presets
          </span>
        </div>

        {/* Presets List */}
        <div className="flex flex-col gap-2">
          {TASK_PRESETS.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => handlePresetClick(preset)}
              className="p-3 rounded-2xl bg-[#F7F8FA] border border-[#EAEDF1] hover:border-[#1677FF]/40 cursor-pointer flex flex-col gap-1.5 transition-all group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors truncate">
                  {preset.title}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${preset.priority === 'Critical'
                    ? 'text-rose-700 bg-rose-50 border-rose-200'
                    : preset.priority === 'High'
                      ? 'text-amber-700 bg-amber-50 border-amber-200'
                      : 'text-[#1677FF] bg-[#EAF3FF] border-[#1677FF]/20'
                  }`}>
                  {preset.priority}
                </span>
              </div>
              <p className="text-[11px] text-[#68707C] line-clamp-2 leading-relaxed">
                {preset.desc}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#68707C] pt-1 border-t border-[#EAEDF1]">
                <span>Code: <strong className="text-[#171A1F]">{preset.costCode}</strong></span>
                <span>Subtasks: <strong className="text-emerald-700">{preset.subtasks.length} items</strong></span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
