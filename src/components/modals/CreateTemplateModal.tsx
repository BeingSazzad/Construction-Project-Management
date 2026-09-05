import React, { useState } from 'react';
import { LayoutGrid, X } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTemplate: (templateData: { name: string; projectType: string; description: string }) => void;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  onCreateTemplate
}) => {
  const [name, setName] = useState('');
  const [projectType, setProjectType] = useState('Custom Home');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateTemplate({
      name: name.trim(),
      projectType,
      description: description.trim()
    });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[390px] bg-white border border-[#DDE1E7] p-5 rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-[#171A1F] scrollbar-none">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#EAEDF1] mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#171A1F] tracking-tight leading-tight truncate">
                New Budget Template
              </h3>
              <p className="text-xs text-[#68707C] font-medium mt-0.5 truncate">
                Create reusable CSI MasterFormat template
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] border border-[#DDE1E7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          
          {/* Template Name * */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#171A1F]">Template Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Standard Custom Home"
              className="w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs font-medium focus:outline-none focus:border-[#1677FF] transition-colors placeholder:text-[#9DA5B1]"
            />
          </div>

          {/* Project Type */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#171A1F]">Project Type</label>
            <CustomSelect
              value={projectType}
              onChange={(v) => setProjectType(v)}
              options={['Custom Home', 'Commercial Highrise', 'Multi-Family', 'Remodel', 'Tenant Fit-Out']}
              size="md"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-[#171A1F]">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this template"
              className="w-full p-3 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl text-[#171A1F] text-xs font-medium focus:outline-none focus:border-[#1677FF] transition-colors resize-none placeholder:text-[#9DA5B1] leading-relaxed"
            />
          </div>

          {/* Equal Size Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full btn-lg bg-[#F2F2F7] border border-[#DDE1E7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full btn-lg bg-[#1677FF] hover:bg-[#0958D9] text-white font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Create Template</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
