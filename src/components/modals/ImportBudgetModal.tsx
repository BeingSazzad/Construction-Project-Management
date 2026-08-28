import React, { useState } from 'react';
import { Project } from '../../types';
import { FileSpreadsheet, Upload, X, CheckCircle2 } from 'lucide-react';

interface ImportBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onImportSuccess: (projectId: string, budgetName: string, totalAmount: number) => void;
}

export const ImportBudgetModal: React.FC<ImportBudgetModalProps> = ({
  isOpen,
  onClose,
  projects,
  onImportSuccess
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'proj-1');
  const [selectedFile, setSelectedFile] = useState<string>('CSI_16_Division_Master_Budget_2025.csv');
  const [fileSize, setFileSize] = useState<string>('428 KB');
  const [mappedDivisionsCount, setMappedDivisionsCount] = useState(16);
  const [totalEstimatedValue, setTotalEstimatedValue] = useState(14850000);

  if (!isOpen) return null;

  const SAMPLE_BUDGET_FILES = [
    { name: 'CSI_16_Division_Master_Budget_2025.csv', size: '428 KB', divisions: 16, total: 14850000, desc: 'Complete 16-Division MasterFormat Commercial Ledger' },
    { name: 'Subcontractor_Trade_Breakdown_Q2.xlsx', size: '312 KB', divisions: 8, total: 8420000, desc: 'Subcontractor Trade Package Contracts & Allowances' },
    { name: 'Riverside_Phase_2_Materials_Import.csv', size: '195 KB', divisions: 6, total: 3650000, desc: 'Concrete, Steel, and Masonry Material Line Items' },
  ];

  const handleSelectSample = (file: typeof SAMPLE_BUDGET_FILES[0]) => {
    setSelectedFile(file.name);
    setFileSize(file.size);
    setMappedDivisionsCount(file.divisions);
    setTotalEstimatedValue(file.total);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onImportSuccess(selectedProjectId, selectedFile, totalEstimatedValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-[430px] bg-[#070D1A] border border-[#142036] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#142036] bg-[#0A111F]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Import Project Budget</h3>
              <p className="text-[10px] text-slate-400">CSV / XLSX / CSI 16-Division Import</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#0E1A33] border border-[#1E2E4A] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
          
          {/* 1. Target Project Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Target Project *</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-[#050811] border border-[#142036] text-white text-xs font-semibold focus:outline-none focus:border-blue-500 transition-colors"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Drag & Drop File Upload Area */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Upload Budget Document (CSV / Excel)</label>
            <div className="p-5 rounded-2xl bg-[#050811] border-2 border-dashed border-[#142036] hover:border-blue-500/50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer text-center group">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                  Click to Browse or Drag File Here
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Supports .csv, .xlsx, .xls up to 25MB</p>
              </div>
            </div>
          </div>

          {/* 3. Preset Sample Templates */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Or Select Budget Preset File
            </span>

            {SAMPLE_BUDGET_FILES.map((f, idx) => {
              const isSelected = selectedFile === f.name;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectSample(f)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-blue-500/10 border-blue-500/50 text-white shadow-sm'
                      : 'bg-[#050811] border-[#142036] text-slate-300 hover:border-blue-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileSpreadsheet className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-xs font-bold truncate">{f.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-[#070D1A] px-2 py-0.5 rounded border border-[#142036]">
                      {f.size}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{f.desc}</p>
                  <div className="flex items-center justify-between text-[10px] pt-1 text-slate-400 border-t border-[#142036]/60">
                    <span>Divisions Mapped: <strong className="text-blue-400 font-mono">{f.divisions} CSI Divisions</strong></span>
                    <span>Total Value: <strong className="text-emerald-400">${(f.total / 1000000).toFixed(2)}M</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. Import Summary Box */}
          <div className="p-3.5 rounded-2xl bg-[#050811] border border-[#142036] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Selected File:</span>
              <span className="font-bold text-white truncate max-w-[200px]">{selectedFile}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Mapped Divisions:</span>
              <span className="font-bold text-blue-400 font-mono">{mappedDivisionsCount} CSI Cost Codes</span>
            </div>

            <div className="h-px bg-[#142036] my-0.5" />

            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">Total Ledger Value:</span>
              <span className="text-emerald-400">${(totalEstimatedValue / 1000000).toFixed(2)}M</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-11 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-900/30 active:scale-[0.98] mt-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Import Budget into Financial Ledger</span>
          </button>
        </form>

      </div>
    </div>
  );
};
