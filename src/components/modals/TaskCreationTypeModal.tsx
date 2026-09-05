import React from 'react';
import { Task, Project } from '../../types';
import { X, CheckSquare, ChevronRight, Plus } from 'lucide-react';

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

  const TASK_PRESETS = [
    {
      title: 'Concrete Slump & Pour Inspection',
      desc: 'Verify truck delivery tickets, slump test compliance, and rebar clearance before pour.',
      milestone: 'Substructure & Foundation',
      priority: 'Critical' as const,
      costCode: '03-3000',
      trade: 'Concrete',
      subtasks: ['Check truck delivery time & slump specs', 'Verify rebar clearance & dowel positioning', 'Take 3 cylinder test samples']
    },
    {
      title: 'Structural Framing Sign-off',
      desc: 'Audit post-to-beam connectors, hold-downs, and shear panel nailing schedule.',
      milestone: 'Superstructure Framing',
      priority: 'High' as const,
      costCode: '06-1000',
      trade: 'Framing',
      subtasks: ['Inspect Simpson tie connectors', 'Verify shear wall edge nailing (6" o.c.)', 'Structural engineer sign-off']
    },
    {
      title: 'MEP Rough-In Pressure Audit',
      desc: 'Hydrostatic pressure test on plumbing rough-in & electrical conduit clearance.',
      milestone: 'MEP Rough-In Phase',
      priority: 'High' as const,
      costCode: '22-0000',
      trade: 'MEP',
      subtasks: ['Hold 100 PSI pressure test for 30 mins', 'Check fire-stopping penetrations', 'Inspector sign-off']
    },
    {
      title: 'OSHA Daily Site Safety Briefing',
      desc: 'Conduct daily morning safety alignment, PPE check, and fall protection audit.',
      milestone: 'Site Safety Operations',
      priority: 'Medium' as const,
      costCode: '01-3100',
      trade: 'Safety',
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
      projectName: project?.name || 'Snell Isle Residence',
    });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-xs animate-fade-in font-sans p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] bg-white border border-[#E2E8F0] rounded-t-[28px] sm:rounded-3xl p-5 pb-7 shadow-2xl flex flex-col gap-4 text-[#0F172A] animate-slide-up max-h-[85vh] overflow-y-auto"
      >
        {/* Pull Bar for mobile */}
        <div className="w-10 h-1 rounded-full bg-[#CBD5E1] mx-auto sm:hidden -mt-1" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">New Task</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                {project?.name || 'Snell Isle Residence'} · Choose method
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Primary Action: Custom / Blank Task Form */}
        <button
          onClick={() => {
            onClose();
            onSelectCustom();
          }}
          className="p-3.5 bg-[#F8FAFC] hover:bg-[#EAF3FF]/60 border border-[#E2E8F0] hover:border-[#1677FF]/40 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer text-left active:scale-[0.99] group shadow-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#1677FF] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors">
                Blank Task (Custom Form)
              </h4>
              <p className="text-xs text-[#64748B] mt-0.5 font-medium truncate">
                Set title, due date, trade assignment & scope
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1677FF] shrink-0" />
        </button>

        {/* 2. Presets Section Header (Clean & Uncluttered) */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-[#64748B] tracking-tight">
            Standard Field Checklists
          </span>
          <span className="text-[10px] text-[#64748B] font-medium">
            1-Tap Preset
          </span>
        </div>

        {/* 3. Compact Single-Layer Presets List (No Card Bloat) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#F1F5F9] overflow-hidden shadow-xs">
          {TASK_PRESETS.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => handlePresetClick(preset)}
              className="p-3 hover:bg-[#F8FAFC] cursor-pointer flex items-center justify-between gap-2.5 transition-colors group active:bg-[#F1F5F9]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* CSI Code Badge */}
                <span className="font-mono text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2 py-1 rounded-md shrink-0">
                  {preset.costCode}
                </span>
                <div className="min-w-0">
                  <h5 className="text-xs font-semibold text-[#0F172A] group-hover:text-[#1677FF] transition-colors truncate">
                    {preset.title}
                  </h5>
                  <span className="text-[10px] text-[#64748B] block mt-0.5 truncate">
                    {preset.milestone}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
                  {preset.subtasks.length} checks
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
