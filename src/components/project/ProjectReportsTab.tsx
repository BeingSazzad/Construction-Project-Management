import React, { useState, useRef } from 'react';
import { Project, ReportItem } from '../../types';
import { FileText, Download, X, UploadCloud, RefreshCw, CheckCircle2 } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface ProjectReportsTabProps {
  project: Project;
  reports: ReportItem[];
  onExportReport?: (report: ReportItem) => void;
  onAddReport?: (newReport: Partial<ReportItem>) => void;
}

export const ProjectReportsTab: React.FC<ProjectReportsTabProps> = ({
  project,
  reports,
  onExportReport,
  onAddReport
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<'Progress' | 'Daily' | 'Budget' | 'Cost Analysis' | 'Cash Flow' | 'Safety'>('Progress');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
      setSelectedFile({
        name: file.name,
        size: `${sizeInMb} MB`
      });
      if (!reportTitle) {
        // Auto fill title from filename without extension
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setReportTitle(cleanName);
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    if (onAddReport) {
      onAddReport({
        title: reportTitle.trim(),
        type: reportType,
        period: 'Current Period',
        author: 'Alex Chen',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        summary: 'Uploaded report file document.',
        fileSize: selectedFile?.size || `${(1.0 + Math.random() * 4).toFixed(1)} MB`
      });
    }

    setReportTitle('');
    setSelectedFile(null);
    setIsUploadOpen(false);
  };

  const getFileIconColor = (type: string) => {
    switch (type) {
      case 'Budget':
      case 'Cost Analysis':
      case 'Cash Flow':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      case 'Safety':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/25';
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#142036] pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Executive & Field Reports</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{reports.length} Uploaded Files</p>
        </div>

        <button 
          onClick={() => setIsUploadOpen(true)}
          className="btn-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
        >
          <UploadCloud className="w-4 h-4 stroke-[2.5]" />
          <span>Upload Report</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="flex flex-col gap-2">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-[#1E2D4A] transition-all flex items-center justify-between gap-3 shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Report File Icon */}
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${getFileIconColor(rep.type)}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white leading-tight truncate max-w-[200px]">{rep.title}</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mt-1">
                  <span className="bg-[#142036] px-1.5 py-0.2 rounded text-[10px] text-blue-300 font-bold uppercase tracking-wider">{rep.type}</span>
                  <span>•</span>
                  <span>By: {rep.author}</span>
                  <span>•</span>
                  <span className="truncate">{rep.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-slate-500 font-bold">{rep.fileSize}</span>
              <button
                onClick={() => {
                  if (onExportReport) onExportReport(rep);
                  else alert(`Downloading file: ${rep.title}...`);
                }}
                className="w-8 h-8 rounded-lg bg-[#070D1A] hover:bg-[#142036] text-blue-400 border border-[#142036] flex items-center justify-center cursor-pointer transition-colors"
                title="Download Report File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── UPLOAD REPORT MODAL (Matching PhotoUploadModal Aesthetics) ─── */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="card-dark w-full max-w-[390px] bg-[#070D1A] border border-[#142036] p-5 rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100 scrollbar-none">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#142036] mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white tracking-tight leading-tight truncate">
                    Upload Report File
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                    {project?.name || 'Executive & Field Reports'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsUploadOpen(false)}
                className="w-8 h-8 rounded-full bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden Native File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Interactive File Dropzone Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative h-44 rounded-2xl overflow-hidden mb-4 border border-dashed border-[#1A263E] hover:border-blue-500/80 bg-[#050811] shadow-inner cursor-pointer group transition-all flex flex-col items-center justify-center"
              title="Click to select report file from your device"
            >
              {selectedFile ? (
                <div className="flex flex-col items-center justify-center gap-2 p-5 text-center w-full">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0 max-w-full px-4">
                    <span className="text-xs font-bold text-white block truncate">{selectedFile.name}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">{selectedFile.size} • Ready to Upload</span>
                  </div>

                  {/* Change File Hover Overlay Pill */}
                  <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-400 border border-blue-500/30 flex items-center gap-1.5 shadow-md group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                    <span>Change File</span>
                  </div>
                </div>
              ) : (
                /* Centered Clean Dropzone Placeholder */
                <div className="flex flex-col items-center justify-center gap-2.5 p-5 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-blue-400 transition-colors">
                      Tap or Drag to Upload Report File
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                      Supports PDF, DOCX, XLSX up to 25MB
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Clean Upload Form Inputs */}
            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-3.5 text-xs">
              
              {/* Report Title Input */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-300">Report Title *</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title (e.g. Geotechnical Soil Report)"
                  className="w-full h-11 bg-[#050811] border border-[#142036] rounded-xl px-3.5 text-white text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
                />
              </div>

              {/* Report Category Input */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-300">Report Category</label>
                <CustomSelect
                  value={reportType}
                  onChange={(v) => setReportType(v as any)}
                  options={['Progress', 'Daily', 'Budget', 'Cost Analysis', 'Cash Flow', 'Safety']}
                  size="md"
                />
              </div>

              {/* Equal Size Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="w-full btn-lg bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-300 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full btn-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold shadow-md shadow-blue-600/30 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                  <span>Upload</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
