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
      {/* Light Backdrop Overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal Card Box */}
      <div className="relative w-full max-w-[400px] bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl z-10 flex flex-col gap-4 text-[#171A1F]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAEDF1] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EAF3FF] border border-blue-200 flex items-center justify-center text-[#1677FF]">
              <LayoutGrid className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171A1F] tracking-tight">
                New BuildScope Takeoff
              </h3>
              <p className="text-xs text-[#68707C] font-medium">Plan takeoff & scope analysis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-1">
          <div>
            <label className="text-xs font-semibold text-[#68707C] mb-1.5 flex items-center gap-1">
              <span>Project Name</span>
              <span className="text-[#1677FF]">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Maple Ridge Residence"
              required
              autoFocus
              className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white rounded-xl px-3.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none transition-all font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#68707C] mb-1.5 block">
              Property Address
            </label>
            <input
              type="text"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              placeholder="123 Builder Way"
              className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white rounded-xl px-3.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none transition-all font-medium"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs active:scale-[0.98] mt-2 cursor-pointer transition-all"
          >
            Create Takeoff
          </button>
        </form>
      </div>
    </div>
  );
};
