import React from 'react';
import {
  X, CheckSquare, ClipboardList, DollarSign, Camera, FileText, ChevronRight, Building2
} from 'lucide-react';

interface CentralAddActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject?: () => void;
  onAddTask?: () => void;
  onAddDailyLog?: () => void;
  onAddUpdate?: () => void;
  onAddExpense?: () => void;
  onAddPhoto?: () => void;
  onAddDocument?: () => void;
}

export const CentralAddActionSheet: React.FC<CentralAddActionSheetProps> = ({
  isOpen,
  onClose,
  onAddProject,
  onAddTask,
  onAddDailyLog,
  onAddUpdate,
  onAddExpense,
  onAddPhoto,
  onAddDocument,
}) => {
  if (!isOpen) return null;

  const handleDailyLogAction = onAddDailyLog || onAddUpdate || (() => { });

  const actions = [
    ...(onAddProject ? [{
      id: 'project',
      label: 'Project',
      subtitle: 'Create a new construction build or job site',
      icon: Building2,
      color: 'bg-[#1677FF]/10 text-[#1677FF]',
      action: onAddProject,
    }] : []),
    ...(onAddTask ? [{
      id: 'task',
      label: 'Task',
      subtitle: 'Create a deadline, inspection, or trade assignment',
      icon: CheckSquare,
      color: 'bg-[#1677FF]/10 text-[#1677FF]',
      action: onAddTask,
    }] : []),
    ...(onAddDailyLog || onAddUpdate ? [{
      id: 'daily-log',
      label: 'Daily Log',
      subtitle: 'Record field progress, crew activity & site updates',
      icon: ClipboardList,
      color: 'bg-[#1677FF]/10 text-[#1677FF]',
      action: handleDailyLogAction,
    }] : []),
    ...(onAddExpense ? [{
      id: 'expense',
      label: 'Expense',
      subtitle: 'Record cost items, vendor receipts, or change orders',
      icon: DollarSign,
      color: 'bg-[#1677FF]/10 text-[#1677FF]',
      action: onAddExpense,
    }] : []),
    ...(onAddPhoto ? [{
      id: 'photo',
      label: 'Photo',
      subtitle: 'Upload site progress or verification photos',
      icon: Camera,
      color: 'bg-[#1677FF]/10 text-[#1677FF]',
      action: onAddPhoto,
    }] : []),
    ...(onAddDocument ? [{
      id: 'document',
      label: 'Document',
      subtitle: 'Attach blueprints, specs, permits, or contracts',
      icon: FileText,
      color: 'bg-[#1677FF]/10 text-[#1677FF]',
      action: onAddDocument,
    }] : []),
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs animate-fade-in font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[390px] mx-auto bg-white border-t border-[#E2E8F0] rounded-t-[32px] p-5 pb-9 shadow-2xl flex flex-col gap-3 text-[#0F172A] animate-slide-up max-h-[90vh] overflow-y-auto"
      >
        {/* Pull Indicator Bar */}
        <div className="w-10 h-1 rounded-full bg-[#E2E8F0] mx-auto -mt-1 mb-1" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A] tracking-tight">Create New</h3>
            <p className="text-xs text-[#64748B] font-medium">Select an action for your project</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer active:scale-95 transition-all text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions List */}
        <div className="flex flex-col gap-2 pt-1">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  onClose();
                  act.action();
                }}
                className="p-3 bg-[#F8FAFC] hover:bg-[#1677FF]/5 border border-[#E2E8F0] hover:border-[#1677FF]/40 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left active:scale-[0.99] group shadow-2xs"
              >
                <div className={`w-9 h-9 rounded-xl ${act.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors">
                    {act.label}
                  </h4>
                  <p className="text-[11px] text-[#64748B] font-medium truncate mt-0.5">
                    {act.subtitle}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
