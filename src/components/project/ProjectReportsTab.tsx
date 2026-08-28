import React, { useState } from 'react';
import { Project, ReportItem } from '../../types';
import { FileText, Download, Eye, Plus, X, UploadCloud, Check } from 'lucide-react';

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
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<'Progress' | 'Daily' | 'Budget' | 'Cost Analysis' | 'Cash Flow' | 'Safety'>('Progress');

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
        fileSize: `${(1.0 + Math.random() * 4).toFixed(1)} MB`
      });
    }

    setReportTitle('');
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
          className="h-10 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload</span>
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
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold mt-1">
                  <span className="bg-[#142036] px-1.5 py-0.2 rounded text-[8px] text-blue-300 font-bold uppercase tracking-wider">{rep.type}</span>
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

      {/* ─── UPLOAD REPORT MODAL ─── */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-[#070D1A] border border-[#1E2E4A] rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div>
                <h3 className="text-xs font-bold text-white">Upload Report File</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Attach a compiled report document</p>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="w-6 h-6 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Report Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geotechnical Investigation Report"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Report Category</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Progress">Progress Report</option>
                  <option value="Daily">Daily Log Summary</option>
                  <option value="Budget">Budget variance</option>
                  <option value="Cost Analysis">Cost-to-Complete</option>
                  <option value="Cash Flow">Cash Flow Forecast</option>
                  <option value="Safety">Safety & Compliance</option>
                </select>
              </div>

              {/* Simulated upload box */}
              <div className="border border-dashed border-[#1E2D4A] rounded-xl p-4 bg-[#050811] flex flex-col items-center justify-center text-center gap-1.5">
                <UploadCloud className="w-6 h-6 text-blue-400" />
                <span className="text-[10px] text-slate-300 font-bold">Select File or Drop PDF / Excel here</span>
                <span className="text-[9px] text-slate-500">Max size 25MB</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#142036] mt-1">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#0E1A33] text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
