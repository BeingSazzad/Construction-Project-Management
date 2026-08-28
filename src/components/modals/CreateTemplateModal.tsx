import React, { useState } from 'react';
import { LayoutGrid, X, Plus } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="card-dark w-full max-w-[390px] bg-[#070D1A] border border-[#142036] p-5 rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100 scrollbar-none">
        
        {/* Header (Matching Screenshot 2) */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#142036] mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white tracking-tight leading-tight truncate">
                New Budget Template
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                Create reusable CSI MasterFormat template
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body (Matching Screenshot 2) */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          
          {/* Template Name * */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-300">Template Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Standard Custom Home"
              className="w-full h-11 bg-[#050811] border border-[#142036] rounded-xl px-3.5 text-white text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
            />
          </div>

          {/* Project Type */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-300">Project Type</label>
            <CustomSelect
              value={projectType}
              onChange={(v) => setProjectType(v)}
              options={['Custom Home', 'Commercial Highrise', 'Multi-Family', 'Remodel', 'Tenant Fit-Out']}
              size="md"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-300">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this template"
              className="w-full p-3 bg-[#050811] border border-[#142036] rounded-xl text-white text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder:text-slate-500"
            />
          </div>

          {/* Equal Size Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full btn-lg bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-300 font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full btn-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold shadow-md shadow-blue-600/30 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Template</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
