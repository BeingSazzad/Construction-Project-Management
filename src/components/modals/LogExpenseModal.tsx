import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { X, DollarSign, Building2, Check } from 'lucide-react';

interface LogExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  projects?: Project[];
  onSaveExpense: (projectId: string, category: string, amount: number, vendor: string) => void;
}

const DEFAULT_CATEGORIES = [
  'General Conditions',
  'Earthwork & Utilities',
  'Cast-in-Place Concrete',
  'Masonry & Structural Steel',
  'Rough Carpentry & Framing',
  'Exterior Enclosure & Glazing',
  'Roofing & Waterproofing',
  'Interior Finishes & Drywall',
  'Plumbing Systems',
  'HVAC & Mechanical',
  'Electrical & Low Voltage',
  'Equipment Rental'
];

export const LogExpenseModal: React.FC<LogExpenseModalProps> = ({
  isOpen,
  onClose,
  project,
  projects = [],
  onSaveExpense,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    return project?.id || (projects.length > 0 ? projects[0].id : 'proj-1');
  });

  const [category, setCategory] = useState<string>(DEFAULT_CATEGORIES[0]);
  const [amount, setAmount] = useState<string>('');
  const [vendor, setVendor] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (project?.id) {
      setSelectedProjectId(project.id);
    } else if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [project, projects, isOpen]);

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.id === selectedProjectId) || project || projects[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onSaveExpense(
      selectedProjectId,
      category,
      numAmount,
      vendor.trim() || 'Trade Contractor'
    );

    // Reset & close
    setAmount('');
    setVendor('');
    setNotes('');
    onClose();
  };

  const isPreScoped = Boolean(project?.id);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#0F172A] animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Log Job Expense</h3>
              <p className="text-xs text-[#64748B]">Record receipt or cost item</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          {/* Project Picker (If not already in a specific project) */}
          <div>
            <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
              Project <span className="text-red-500">*</span>
            </label>
            {isPreScoped ? (
              <div className="flex items-center gap-2 p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0F172A]">
                <Building2 className="w-4 h-4 text-[#1677FF] shrink-0" />
                <span className="truncate">{currentProject?.name || 'Selected Project'}</span>
              </div>
            ) : (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
                className="w-full h-11 bg-white border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl px-3 text-xs font-semibold text-[#0F172A] outline-none transition-colors cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Trade Category */}
          <div>
            <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
              Cost Code / Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full h-11 bg-white border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl px-3 text-xs font-medium text-[#0F172A] outline-none transition-colors cursor-pointer"
            >
              {DEFAULT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Amount & Vendor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                Amount ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="e.g. 4500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 bg-white border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl px-3 text-xs font-bold text-[#0F172A] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
                Vendor / Payee
              </label>
              <input
                type="text"
                placeholder="e.g. Vulcan Materials"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full h-11 bg-white border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl px-3 text-xs font-medium text-[#0F172A] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-semibold text-[#64748B] block mb-1">
              Invoice Ref / Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Delivery ticket #8841 · Quick pour"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-11 bg-white border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl px-3 text-xs font-medium text-[#0F172A] outline-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] font-semibold text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#1677FF] hover:bg-[#125ec7] text-white font-bold text-xs cursor-pointer shadow-xs transition-all active:scale-98 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
