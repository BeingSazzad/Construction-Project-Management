import React, { useState } from 'react';
import { Project, ProjectUpdate, User } from '../../types';
import { 
  X, CheckCircle2, AlertCircle, Award, Camera, 
  FileText, Plus, Trash2, ShieldAlert
} from 'lucide-react';

interface CreateProjectUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  currentUser?: User;
  onSaveUpdate: (update: ProjectUpdate) => void;
}

export const CreateProjectUpdateModal: React.FC<CreateProjectUpdateModalProps> = ({
  isOpen,
  onClose,
  project,
  currentUser,
  onSaveUpdate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [updateType, setUpdateType] = useState<'progress' | 'decision_needed' | 'milestone'>('progress');
  const [decisionText, setDecisionText] = useState('');
  const [attachments, setAttachments] = useState<{ name: string; type: 'photo' | 'document' }[]>([]);

  if (!isOpen) return null;

  const handleAddSampleAttachment = (type: 'photo' | 'document') => {
    const samplePhotoNames = [
      'Site-Framing-Inspection.jpg',
      'East-Wing-Pour.jpg',
      'Electrical-RoughIn.jpg',
      'HVAC-Ductwork-Level2.jpg'
    ];
    const sampleDocNames = [
      'City-Framing-Signoff.pdf',
      'Structural-Engineers-Report.pdf',
      'Material-Submittal-Package.pdf',
      'Testing-Lab-Slump-Report.pdf'
    ];

    const randomName = type === 'photo' 
      ? samplePhotoNames[Math.floor(Math.random() * samplePhotoNames.length)]
      : sampleDocNames[Math.floor(Math.random() * sampleDocNames.length)];

    setAttachments(prev => [...prev, { name: randomName, type }]);
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newUpdate: ProjectUpdate = {
      id: `upd-${Date.now()}`,
      projectId: project.id,
      author: {
        name: currentUser?.name || 'Sarah Johnson',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        role: currentUser?.role || 'Project Manager'
      },
      title: title.trim(),
      description: description.trim(),
      timestamp: 'Just now',
      type: updateType,
      decisionNeeded: updateType === 'decision_needed',
      decisionText: updateType === 'decision_needed' ? (decisionText.trim() || 'Approval required for this field item') : undefined,
      decisionStatus: updateType === 'decision_needed' ? 'Pending' : undefined,
      attachments: attachments.length > 0 ? attachments : undefined
    };

    onSaveUpdate(newUpdate);
    // Reset state
    setTitle('');
    setDescription('');
    setUpdateType('progress');
    setDecisionText('');
    setAttachments([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#0F172A] max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">
              Post Project Update
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              {project.name} · Activity stream
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          
          {/* Update Type Selector */}
          <div>
            <label className="text-xs text-[#64748B] block mb-1.5 font-semibold">
              Update Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUpdateType('progress')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  updateType === 'progress'
                    ? 'bg-[#EAF3FF] text-[#1677FF] border border-[#1677FF]/30 shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Progress</span>
              </button>

              <button
                type="button"
                onClick={() => setUpdateType('decision_needed')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  updateType === 'decision_needed'
                    ? 'bg-[#FFFBEB] text-[#D97706] border border-[#D97706]/30 shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Decision</span>
              </button>

              <button
                type="button"
                onClick={() => setUpdateType('milestone')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  updateType === 'milestone'
                    ? 'bg-[#F5F3FF] text-[#7C3AED] border border-[#7C3AED]/30 shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Milestone</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs text-[#64748B] block mb-1 font-semibold">
              Headline / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 2nd Floor Framing Inspection Passed"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 bg-white border border-[#CBD5E1] rounded-xl px-3 text-[#0F172A] text-xs outline-none focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-[#64748B] block mb-1 font-semibold">
              Field Notes / Details *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe what was accomplished on site, contractor details, or upcoming milestones..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl p-3 text-[#0F172A] text-xs outline-none focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF] transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Conditional: Decision Needed Prompt */}
          {updateType === 'decision_needed' && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3 flex flex-col gap-1.5 animate-fade-in">
              <div className="flex items-center gap-1.5 text-[#92400E] font-semibold text-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Required Decision / Action Item</span>
              </div>
              <input
                type="text"
                placeholder="e.g. Approve final exterior stucco tint sample (SW 7008 vs SW 7005)"
                value={decisionText}
                onChange={(e) => setDecisionText(e.target.value)}
                className="w-full h-9 bg-white border border-[#FDE68A] rounded-lg px-2.5 text-[#0F172A] text-xs outline-none focus:border-[#D97706]"
              />
            </div>
          )}

          {/* Attachments Section */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-[#64748B] font-semibold">
                Attachments ({attachments.length})
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddSampleAttachment('photo')}
                  className="px-2 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Camera className="w-3 h-3 text-[#1677FF]" />
                  <span>+ Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddSampleAttachment('document')}
                  className="px-2 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <FileText className="w-3 h-3 text-[#1677FF]" />
                  <span>+ Doc</span>
                </button>
              </div>
            </div>

            {/* List of Attachments */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-medium text-[#0F172A]"
                  >
                    {att.type === 'photo' ? (
                      <Camera className="w-3 h-3 text-[#1677FF]" />
                    ) : (
                      <FileText className="w-3 h-3 text-[#1677FF]" />
                    )}
                    <span className="truncate max-w-[140px]">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="text-[#94A3B8] hover:text-[#EF4444] ml-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9] mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[#F1F5F9] text-[#0F172A] text-xs font-semibold cursor-pointer hover:bg-[#E2E8F0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Update</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
