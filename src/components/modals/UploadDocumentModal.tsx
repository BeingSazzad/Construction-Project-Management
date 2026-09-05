import React, { useState } from 'react';
import { Project, DocumentItem } from '../../types';
import { 
  X, UploadCloud, CheckCircle2 
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpload: (newDoc: DocumentItem) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpload
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Plans' | 'Drawings' | 'PDFs' | 'Contracts' | 'Reports' | 'Site Logistics'>('Plans');
  const [fileType, setFileType] = useState<'PDF' | 'DWG' | 'DOCX' | 'XLSX'>('PDF');
  const [version, setVersion] = useState('v1.0');
  const [fileSize] = useState('8.4 MB');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      projectId: project.id,
      title: title.trim(),
      category,
      fileType,
      fileSize: fileName ? fileSize : '6.2 MB',
      version: version || 'v1.0',
      uploadedBy: 'Current User',
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80'
    };

    onUpload(newDoc);
    onClose();
  };

  const handleSimulateFileSelect = () => {
    setFileName('Site_Plan_Architectural_Rev3.pdf');
    if (!title) {
      setTitle('Site Plan & Structural Revision');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] bg-white border border-[#DDE1E7] p-5 rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-[#171A1F] scrollbar-none">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#EAEDF1] mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#171A1F] tracking-tight leading-snug truncate">Upload Document</h3>
              <p className="text-xs text-[#68707C] font-medium truncate">{project.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* File Dropzone */}
          <div 
            onClick={handleSimulateFileSelect}
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
              fileName 
                ? 'border-emerald-500/50 bg-emerald-50/50' 
                : 'border-[#DDE1E7] hover:border-[#1677FF] bg-[#F7F8FA] hover:bg-[#EAF3FF]/40'
            }`}
          >
            {fileName ? (
              <div className="flex items-center justify-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-xs font-bold text-[#171A1F] truncate max-w-[240px]">{fileName}</p>
                  <p className="text-[10px] text-[#68707C] font-medium">{fileSize} • Click to change file</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <UploadCloud className="w-6 h-6 text-[#1677FF]" />
                <p className="text-xs font-bold text-[#171A1F]">Click or drag blueprint / spec sheet</p>
                <p className="text-[10px] text-[#68707C] font-medium">Supports PDF, DWG, DOCX, XLSX (Up to 100MB)</p>
              </div>
            )}
          </div>

          {/* Document Title */}
          <div>
            <label className="text-xs font-bold text-[#171A1F] mb-1.5 block">Document Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Level 12 HVAC Mechanical Duct Layout"
              className="w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] transition-colors font-medium"
            />
          </div>

          {/* Category & File Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#171A1F] mb-1.5 block">Category</label>
              <CustomSelect
                value={category}
                onChange={(val) => setCategory(val as any)}
                options={[
                  { value: 'Plans', label: 'Plans' },
                  { value: 'Drawings', label: 'Drawings' },
                  { value: 'PDFs', label: 'PDFs' },
                  { value: 'Contracts', label: 'Contracts' },
                  { value: 'Reports', label: 'Reports' },
                  { value: 'Site Logistics', label: 'Site Logistics' },
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#171A1F] mb-1.5 block">File Format</label>
              <CustomSelect
                value={fileType}
                onChange={(val) => setFileType(val as any)}
                options={[
                  { value: 'PDF', label: 'PDF Document' },
                  { value: 'DWG', label: 'AutoCAD DWG' },
                  { value: 'DOCX', label: 'Word Document' },
                  { value: 'XLSX', label: 'Excel Sheet' },
                ]}
              />
            </div>
          </div>

          {/* Version */}
          <div>
            <label className="text-xs font-bold text-[#171A1F] mb-1.5 block">Revision / Version Tag</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. v2.1 or Rev-B"
              className="w-full h-11 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl px-3.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] transition-colors font-medium"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAEDF1]">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-xl border border-[#DDE1E7] bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="h-11 px-5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Archive Document</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
