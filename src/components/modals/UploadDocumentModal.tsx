import React, { useState, useEffect } from 'react';
import { Project, DocumentItem } from '../../types';
import { 
  X, UploadCloud, Upload, CheckCircle2, Building2, ChevronDown
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  projects?: Project[];
  onUpload: (newDoc: DocumentItem) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  project,
  projects = [],
  onUpload
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    return project?.id || (projects.length > 0 ? projects[0].id : 'proj-1');
  });
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Plans' | 'Drawings' | 'PDFs' | 'Contracts' | 'Reports' | 'Site Logistics' | 'Permits'>('Plans');
  const [fileSize, setFileSize] = useState('4.8 MB');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (project?.id) {
      setSelectedProjectId(project.id);
    } else if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [project, projects, isOpen]);

  const currentProject = projects.find(p => p.id === selectedProjectId) || project;

  if (!isOpen) return null;

  const getFileTypeFromFileName = (name: string): string => {
    const ext = name.split('.').pop()?.toUpperCase();
    if (ext === 'DWG' || ext === 'CAD') return 'DWG';
    if (ext === 'DOCX' || ext === 'DOC') return 'DOCX';
    if (ext === 'XLSX' || ext === 'XLS' || ext === 'CSV') return 'XLSX';
    return 'PDF';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      projectId: currentProject?.id || project.id,
      title: title.trim(),
      category,
      fileType: fileName ? getFileTypeFromFileName(fileName) : 'PDF',
      fileSize: fileName ? fileSize : '4.8 MB',
      version: 'v1.0',
      uploadedBy: 'Lead Field Team',
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80'
    };

    onUpload(newDoc);
    onClose();
  };

  const handleSimulateFileSelect = () => {
    setFileName('Architectural_Floor_Plan_Rev3.pdf');
    setFileSize('5.4 MB');
    if (!title) {
      setTitle('Architectural Floor Plan & Elevations');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[380px] mx-auto bg-white border border-[#E2E8F0] p-4.5 rounded-3xl shadow-2xl flex flex-col text-[#0F172A]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#1677FF]/10 border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center shrink-0">
              <UploadCloud className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#0F172A] tracking-tight leading-tight truncate">Upload Document</h3>
              <p className="text-xs text-[#64748B] font-medium truncate">
                {currentProject?.name || 'Snell Isle Residence'} {currentProject?.code ? `• ${currentProject.code}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer active:scale-95 transition-all shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Target Project Selector (if multi-project) */}
          {projects && projects.length > 1 && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#1677FF]" />
                <span>Target Project *</span>
              </label>
              <div className="relative">
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 text-[#0F172A] text-xs font-semibold focus:outline-none focus:border-[#1677FF] transition-colors cursor-pointer appearance-none pr-8"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.code ? `• ${p.code}` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Compact File Dropzone */}
          <div 
            onClick={handleSimulateFileSelect}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
              fileName 
                ? 'border-emerald-500/50 bg-emerald-50/40' 
                : 'border-[#E2E8F0] hover:border-[#1677FF] bg-[#F8FAFC] hover:bg-[#1677FF]/5'
            }`}
          >
            {fileName ? (
              <div className="flex items-center justify-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-xs font-semibold text-[#0F172A] truncate max-w-[240px]">{fileName}</p>
                  <p className="text-xs text-[#64748B] font-medium">{fileSize} • Tap to change</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <UploadCloud className="w-5 h-5 text-[#1677FF]" />
                <p className="text-xs font-semibold text-[#0F172A]">Click or drag blueprint / document</p>
                <p className="text-xs text-[#64748B] font-medium">PDF, DWG, DOCX, XLSX (Up to 100MB)</p>
              </div>
            )}
          </div>

          {/* Document Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#0F172A]">Document Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Level 12 HVAC Mechanical Duct Layout"
              className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1677FF] transition-colors font-medium"
            />
          </div>

          {/* Category Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#0F172A]">Category</label>
            <CustomSelect
              value={category}
              onChange={(val) => setCategory(val as any)}
              options={[
                { value: 'Plans', label: 'Plans & Blueprints' },
                { value: 'Contracts', label: 'Contracts & Agreements' },
                { value: 'Permits', label: 'Permits & Approvals' },
                { value: 'Drawings', label: 'Shop Drawings' },
                { value: 'Reports', label: 'Inspection Reports' },
                { value: 'Site Logistics', label: 'Site Logistics' },
              ]}
            />
          </div>

          {/* Equal Size Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-10 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full h-10 rounded-xl bg-[#1677FF] hover:bg-[#1677FF]/90 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Upload</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
