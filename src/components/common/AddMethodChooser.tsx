import React from 'react';
import { ChevronRight, LayoutGrid, Download, LucideIcon } from 'lucide-react';

export type AddMethodChoice = 'custom' | 'import';

interface AddMethodChooserProps {
  onCustom?: () => void;
  onImport?: () => void;
  customLabel?: string;
  customHint?: string;
  importLabel?: string;
  importHint?: string;
  CustomIcon?: LucideIcon;
  ImportIcon?: LucideIcon;
}

/** Flat Custom | Import rows — no nested cards. */
export const AddMethodChooser: React.FC<AddMethodChooserProps> = ({
  onCustom,
  onImport,
  customLabel = 'Custom',
  customHint = 'Your line items',
  importLabel = 'Import',
  importHint = 'Preset pack',
  CustomIcon = LayoutGrid,
  ImportIcon = Download,
}) => {
  const rows: {
    id: AddMethodChoice;
    label: string;
    hint: string;
    Icon: LucideIcon;
    onClick: () => void;
  }[] = [];

  if (onCustom) {
    rows.push({ id: 'custom', label: customLabel, hint: customHint, Icon: CustomIcon, onClick: onCustom });
  }
  if (onImport) {
    rows.push({ id: 'import', label: importLabel, hint: importHint, Icon: ImportIcon, onClick: onImport });
  }

  if (rows.length === 0) return null;

  return (
    <div className="flex flex-col divide-y divide-[#F1F5F9]">
      {rows.map(({ id, label, hint, Icon, onClick }) => (
        <button
          key={id}
          type="button"
          onClick={onClick}
          className="w-full py-3.5 flex items-center gap-3 text-left cursor-pointer active:bg-[#F8FAFC] group transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <Icon className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#1677FF] transition-colors">
              {label}
            </p>
            <p className="text-xs text-[#64748B] mt-0.5">{hint}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1677FF] shrink-0 transition-colors" />
        </button>
      ))}
    </div>
  );
};
