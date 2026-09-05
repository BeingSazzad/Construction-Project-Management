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
        author: 'Avery Scott (Owner)',
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
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Safety':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-[#1677FF] bg-[#EAF3FF] border-[#1677FF]/20';
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#171A1F] bg-[#F2F2F7] animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EAEDF1] pb-3">
        <div>
          <h2 className="text-base font-bold text-[#171A1F] tracking-tight">Executive & Field Reports</h2>
          <p className="text-xs text-[#68707C] mt-0.5 font-medium">{reports.length} Uploaded Files</p>
        </div>

        <button 
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
        >
          <UploadCloud className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Upload</span>
        </button>
      </div>

      {/* Reports List */}
      <div className="flex flex-col gap-2">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 transition-all flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${getFileIconColor(rep.type)}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-[#171A1F] leading-tight truncate max-w-[200px]">{rep.title}</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-[#68707C] font-medium mt-1">
                  <span className="bg-[#F2F2F7] px-1.5 py-0.2 rounded text-[10px] text-[#1677FF] font-bold uppercase tracking-wider">{rep.type}</span>
                  <span>•</span>
                  <span>By: {rep.author}</span>
                  <span>•</span>
                  <span className="truncate">{rep.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] text-[#68707C] font-semibold">{rep.fileSize}</span>
              <button
                onClick={() => {
                  if (onExportReport) onExportReport(rep);
                  else alert(`Downloading file: ${rep.title}...`);
                }}
                className="w-8 h-8 rounded-lg bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#1677FF] border border-[#DDE1E7] flex items-center justify-center cursor-pointer transition-colors"
                title="Download Report File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── UPLOAD REPORT MODAL ─── */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[420px] bg-white border border-[#DDE1E7] p-5 rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-[#171A1F] scrollbar-none">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#EAEDF1] mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#171A1F] tracking-tight leading-tight truncate">
                    Upload Report File
                  </h3>
                  <p className="text-xs text-[#68707C] font-medium mt-0.5 truncate">
                    {project?.name || 'Executive & Field Reports'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsUploadOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
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
              className="relative h-40 rounded-2xl overflow-hidden mb-4 border border-dashed border-[#DDE1E7] hover:border-[#1677FF] bg-[#F7F8FA] hover:bg-[#EAF3FF]/40 cursor-pointer group transition-all flex flex-col items-center justify-center"
              title="Click to select report file from your device"
            >
              {selectedFile ? (
                <div className="flex flex-col items-center justify-center gap-2 p-5 text-center w-full">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0 max-w-full px-4">
                    <span className="text-xs font-bold text-[#171A1F] block truncate">{selectedFile.name}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">{selectedFile.size} • Ready to Upload</span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-[#1677FF] border border-[#DDE1E7] flex items-center gap-1.5 shadow-xs group-hover:bg-[#1677FF] group-hover:text-white transition-all">
                    <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                    <span>Change</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-5 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#171A1F] block group-hover:text-[#1677FF] transition-colors">
                      Tap or Drag to Upload Report File
                    </span>
                    <span className="text-[10px] text-[#68707C] font-medium block mt-0.5">
                      Supports PDF, DOCX, XLSX up to 25MB
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Clean Upload Form Inputs */}
            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-3.5 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#68707C]">Report Title *</label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title (e.g. Geotechnical Soil Report)"
                  className="w-full h-10 bg-white border border-[#DDE1E7] rounded-xl px-3.5 text-[#171A1F] text-xs font-medium focus:outline-none focus:border-[#1677FF] transition-colors placeholder:text-[#9DA5B1]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#68707C]">Report Category</label>
                <CustomSelect
                  value={reportType}
                  onChange={(v) => setReportType(v as any)}
                  options={['Progress', 'Daily', 'Budget', 'Cost Analysis', 'Cash Flow', 'Safety']}
                  size="md"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="w-full py-2.5 bg-[#F2F2F7] border border-[#DDE1E7] hover:bg-[#EAEDF1] text-[#171A1F] rounded-xl font-bold transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1677FF] hover:bg-[#0958D9] text-white rounded-xl font-bold shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs"
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
