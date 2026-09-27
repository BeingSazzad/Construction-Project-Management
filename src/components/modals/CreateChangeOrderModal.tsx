import React, { useState, useEffect } from 'react';
import { X, Check, FilePlus2, Building2 } from 'lucide-react';
import { ChangeOrder, Project } from '../../types';

interface CreateChangeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  project?: Project | null;
  projects?: Project[];
  onCreate: (newCO: Partial<ChangeOrder>) => void;
}

export const CreateChangeOrderModal: React.FC<CreateChangeOrderModalProps> = ({
  isOpen,
  onClose,
  projectId,
  project,
  projects = [],
  onCreate
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    return projectId || project?.id || (projects.length > 0 ? projects[0].id : 'proj-1');
  });

  useEffect(() => {
    if (projectId) {
      setSelectedProjectId(projectId);
    } else if (project?.id) {
      setSelectedProjectId(project.id);
    } else if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projectId, project, projects, isOpen]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0');
  const [timeImpact, setTimeImpact] = useState('0');
  const [category, setCategory] = useState('');
  const [requestedBy, setRequestedBy] = useState('');

  if (!isOpen) return null;

  const isValid = title.trim().length > 0;
  const currentProject = projects.find(p => p.id === selectedProjectId) || project;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    onCreate({
      projectId: selectedProjectId,
      title: title.trim(),
      description: description.trim(),
      amount: Number(amount) || 0,
      timeImpact: Number(timeImpact) || 0,
      category: category.trim() || 'General',
      requestedBy: requestedBy.trim() || 'Client',
      status: 'Pending',
      createdDate: new Date().toISOString().split('T')[0]
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setAmount('0');
    setTimeImpact('0');
    setCategory('');
    setRequestedBy('');
    onClose();
  };

  const inputClass =
    'w-full h-12 min-h-[48px] bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none transition-colors font-medium';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[390px] mx-auto bg-white border border-[#DDE1E7] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-[#171A1F] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#EAEDF1]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center text-[#1677FF]">
              <FilePlus2 className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171A1F] tracking-tight">New Change Order</h3>
              <p className="text-xs text-[#68707C] font-medium mt-0.5">Record client scope or site directive</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          {/* Project Selection */}
          <div>
            <label className="text-xs font-semibold text-[#171A1F] mb-1.5 block">
              Project <span className="text-red-500">*</span>
            </label>
            {project ? (
              <div className="flex items-center gap-2 p-2.5 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl text-xs font-bold text-[#171A1F]">
                <Building2 className="w-4 h-4 text-[#1677FF] shrink-0" />
                <span className="truncate">{project.name}</span>
              </div>
            ) : projects && projects.length > 0 ? (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
                className={inputClass}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-[#171A1F] mb-1.5 block">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Upgrade to hardwood floors"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-[#171A1F] mb-1.5 block">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope of change..."
              className="w-full bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl p-3 text-[#171A1F] text-xs outline-none focus:border-[#1677FF] resize-none font-medium placeholder-[#9DA5B1] leading-relaxed"
            />
          </div>

          {/* Amount & Time Impact */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1.5 block">
                Amount ($)
              </label>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1.5 block">
                Time Impact (days)
              </label>
              <input
                type="number"
                min={0}
                value={timeImpact}
                onChange={(e) => setTimeImpact(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Category & Requested By */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1.5 block">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Finishes"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#171A1F] mb-1.5 block">
                Requested By
              </label>
              <input
                type="text"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                placeholder="Name"
                className={inputClass}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 border-t border-[#EAEDF1] flex items-center justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                isValid
                  ? 'bg-[#1677FF] hover:bg-[#0958D9] text-white cursor-pointer active:scale-95'
                  : 'bg-[#F2F2F7] text-[#9DA5B1] cursor-not-allowed border border-[#DDE1E7]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Submit Change Order</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
