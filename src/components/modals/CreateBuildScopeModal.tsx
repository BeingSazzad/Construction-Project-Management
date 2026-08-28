import React, { useState } from 'react';
import { X, LayoutGrid } from 'lucide-react';

interface CreateBuildScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (analysisData: { projectName: string; propertyAddress: string }) => void;
}

export const CreateBuildScopeModal: React.FC<CreateBuildScopeModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [projectName, setProjectName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    onCreate({
      projectName: projectName.trim(),
      propertyAddress: propertyAddress.trim() || '123 Builder Way'
    });
    setProjectName('');
    setPropertyAddress('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      {/* Dark Overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Card Box */}
      <div className="relative w-full max-w-[400px] bg-[#091122] border border-[#172540] rounded-3xl p-5 shadow-2xl z-10 flex flex-col gap-4 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#172540] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#131C2E] border border-[#1E293B] flex items-center justify-center text-[#60A5FA]">
              <LayoutGrid className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                New BuildScope Takeoff
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">Plan takeoff & scope analysis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#131C2E] border border-[#1E293B] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-1">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <span>Project Name</span>
              <span className="text-blue-400">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Maple Ridge Residence"
              required
              autoFocus
              className="w-full h-10 bg-[#060B17] border border-[#172540] focus:border-[#2563EB] rounded-xl px-3.5 text-xs text-white placeholder-slate-500 outline-none transition-all font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Property Address
            </label>
            <input
              type="text"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              placeholder="123 Builder Way"
              className="w-full h-10 bg-[#060B17] border border-[#172540] focus:border-[#2563EB] rounded-xl px-3.5 text-xs text-white placeholder-slate-500 outline-none transition-all font-medium"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-500/20 active:scale-[0.98] mt-2"
          >
            <span>Create & Open Takeoff</span>
          </button>
        </form>

      </div>
    </div>
  );
};
