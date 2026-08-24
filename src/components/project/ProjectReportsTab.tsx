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
    <div className="flex flex-col gap-4 pb-24">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
          Executive & Field Reports ({reports.length})
        </h3>
        <button 
          onClick={() => alert("Report generation engine initialized.")}
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Report</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="card-dark p-4 border-[#1F2E47] bg-[#111827] hover:border-cyan-500/40 transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/20 text-cyan-400 border border-cyan-500/30">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{rep.title}</h4>
                  <p className="text-[11px] text-cyan-400 font-semibold">{rep.period} • {rep.author}</p>
                </div>
              </div>

              <span className="text-[10px] font-bold bg-[#1C2A44] text-slate-300 px-2 py-0.5 rounded-full">
                {rep.type}
              </span>
            </div>

            <p className="text-xs text-slate-300 my-2 bg-[#0B101D] p-2.5 rounded-xl border border-[#172238] leading-relaxed">
              {rep.summary}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#1C2A44] text-[11px]">
              <span className="text-slate-500">{rep.date} • {rep.fileSize}</span>

              <button
                onClick={() => onExportReport(rep)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold hover:bg-cyan-500/25 flex items-center gap-1 cursor-pointer transition-colors"
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
