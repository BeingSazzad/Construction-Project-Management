import React from 'react';
import { Project, ReportItem } from '../../types';
import { FileSpreadsheet, Download, Eye, Calendar, Sparkles, Plus } from 'lucide-react';

interface ProjectReportsTabProps {
  project: Project;
  reports: ReportItem[];
  onExportReport: (report: ReportItem) => void;
}

export const ProjectReportsTab: React.FC<ProjectReportsTabProps> = ({
  project,
  reports,
  onExportReport
}) => {
  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      <div className="flex items-center justify-between border-b border-[#162033] pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Executive & Field Reports</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{reports.length} Generated Documents</p>
        </div>

        <button 
          onClick={() => alert("Report generation engine initialized.")}
          className="h-10 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Report</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm hover:border-blue-500/40 transition-all flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">{rep.title}</h3>
                  <p className="text-xs text-blue-400 font-semibold mt-0.5">{rep.period} • {rep.author}</p>
                </div>
              </div>

              <span className="text-xs font-semibold bg-[#141F33] text-slate-300 px-2.5 py-0.5 rounded-full border border-[#1E2C48] flex-shrink-0">
                {rep.type}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-[#080D18] p-3 rounded-2xl border border-[#141F33] leading-relaxed font-medium">
              {rep.summary}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#141F33] text-xs">
              <span className="text-slate-400 font-medium">{rep.date} • {rep.fileSize}</span>

              <button
                onClick={() => onExportReport(rep)}
                className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
