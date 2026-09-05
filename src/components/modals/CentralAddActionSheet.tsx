import React from 'react';
import { 
  X, CheckSquare, MessageSquarePlus, DollarSign, Camera, FileText, ChevronRight 
} from 'lucide-react';

interface CentralAddActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: () => void;
  onAddUpdate: () => void;
  onAddExpense: () => void;
  onAddPhoto: () => void;
  onAddDocument: () => void;
}

export const CentralAddActionSheet: React.FC<CentralAddActionSheetProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onAddUpdate,
  onAddExpense,
  onAddPhoto,
  onAddDocument,
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'task',
      label: 'Task',
      subtitle: 'Create a deadline, inspection, or trade assignment',
      icon: CheckSquare,
      color: 'bg-[#EAF3FF] text-[#1677FF]',
      action: onAddTask,
    },
    {
      id: 'update',
      label: 'Project Update',
      subtitle: 'Post daily field progress, changes, or needed decisions',
      icon: MessageSquarePlus,
      color: 'bg-[#EAF3FF] text-[#1677FF]',
      action: onAddUpdate,
    },
    {
      id: 'expense',
      label: 'Expense',
      subtitle: 'Record cost items, vendor receipts, or change orders',
      icon: DollarSign,
      color: 'bg-[#EAF3FF] text-[#1677FF]',
      action: onAddExpense,
    },
    {
      id: 'photo',
      label: 'Photo',
      subtitle: 'Upload progress or punch verification photos',
      icon: Camera,
      color: 'bg-[#EAF3FF] text-[#1677FF]',
      action: onAddPhoto,
    },
    {
      id: 'document',
      label: 'Document',
      subtitle: 'Attach architectural sets, permits, or contracts',
      icon: FileText,
      color: 'bg-[#EAF3FF] text-[#1677FF]',
      action: onAddDocument,
    },
  ];

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in font-sans"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] bg-white border-t border-[#DDE1E7] rounded-t-[32px] p-5 pb-9 shadow-2xl flex flex-col gap-3 text-[#171A1F] animate-slide-up"
      >
        {/* Pull Indicator Bar */}
        <div className="w-10 h-1 rounded-full bg-[#DDE1E7] mx-auto -mt-1 mb-1" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EAEDF1]">
          <div>
            <h3 className="text-base font-bold text-[#171A1F] tracking-tight">Create New</h3>
            <p className="text-xs text-[#68707C] font-medium">Select an action for your project</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer active:scale-95 transition-all text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Actions */}
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
                className="p-3.5 bg-[#F2F2F7]/70 hover:bg-[#EAF3FF]/60 border border-[#DDE1E7] hover:border-[#1677FF]/40 rounded-2xl flex items-center gap-3.5 transition-all cursor-pointer text-left active:scale-[0.99] group shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors">
                    {act.label}
                  </h4>
                  <p className="text-[11px] text-[#68707C] font-medium truncate mt-0.5">
                    {act.subtitle}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
