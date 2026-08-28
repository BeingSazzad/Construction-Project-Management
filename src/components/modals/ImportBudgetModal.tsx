import React, { useState, useRef } from 'react';
import { Project } from '../../types';
import { FileSpreadsheet, Upload, X, CheckCircle2, RefreshCw } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface ImportBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onImportSuccess: (projectId: string, budgetName: string, totalAmount: number) => void;
}

const PRESET_FILES = [
  { 
    id: 'p1', 
    name: 'CSI_16_Division_Master_Budget.csv', 
    shortName: 'CSI 16-Division ($14.85M)',
    size: '428 KB', 
    divisions: 16, 
    total: 14850000 
  },
  { 
    id: 'p2', 
    name: 'Subcontractor_Trade_Breakdown.xlsx', 
    shortName: 'Sub Trade Q2 ($8.42M)',
    size: '312 KB', 
    divisions: 8, 
    total: 8420000 
  },
  { 
    id: 'p3', 
    name: 'Phase_2_Materials_Import.csv', 
    shortName: 'Materials Import ($3.65M)',
    size: '195 KB', 
    divisions: 6, 
    total: 3650000 
  }
];

export const ImportBudgetModal: React.FC<ImportBudgetModalProps> = ({
  isOpen,
  onClose,
  projects,
  onImportSuccess
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'proj-1');
  const [selectedPreset, setSelectedPreset] = useState(PRESET_FILES[0]);
  const [customFile, setCustomFile] = useState<{ name: string; size: string } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeInKb = (file.size / 1024).toFixed(0);
      setCustomFile({
        name: file.name,
        size: `${sizeInKb} KB`
      });
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_FILES[0]) => {
    setCustomFile(null);
    setSelectedPreset(preset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = customFile ? customFile.name : selectedPreset.name;
    const totalVal = customFile ? 12500000 : selectedPreset.total;
    onImportSuccess(selectedProjectId, fileName, totalVal);
    onClose();
  };

  const activeFileName = customFile ? customFile.name : selectedPreset.name;
  const activeDivisions = customFile ? 12 : selectedPreset.divisions;
  const activeTotal = customFile ? 12500000 : selectedPreset.total;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="card-dark w-full max-w-[390px] bg-[#070D1A] border border-[#142036] p-5 rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100 scrollbar-none">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#142036] mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white tracking-tight leading-tight truncate">
                Import Project Budget
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                CSV / XLSX / CSI 16-Division MasterFormat
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hidden Native File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
          
          {/* Target Project Select */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-300">Target Project *</label>
            <CustomSelect
              value={selectedProjectId}
              onChange={setSelectedProjectId}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
              size="md"
            />
          </div>

          {/* Interactive File Dropzone Box */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-300">Upload Budget Document</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative h-36 rounded-2xl overflow-hidden border border-dashed border-[#1A263E] hover:border-blue-500/80 bg-[#050811] shadow-inner cursor-pointer group transition-all flex flex-col items-center justify-center"
              title="Click to select budget spreadsheet file"
            >
              {customFile ? (
                <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center w-full">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0 max-w-full px-3">
                    <span className="text-xs font-bold text-white block truncate">{customFile.name}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">{customFile.size} • Custom Upload</span>
                  </div>

                  {/* Change File Hover Overlay Pill */}
                  <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-blue-400 border border-blue-500/30 flex items-center gap-1 shadow-md group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                    <span>Change</span>
                  </div>
                </div>
              ) : (
                /* Centered Dropzone Placeholder */
                <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block group-hover:text-blue-400 transition-colors">
                      Tap or Drag CSV / Excel File
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                      Supports .csv, .xlsx up to 25MB
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Compact Preset Selection Pills */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-slate-400">Or select preset template:</span>
            <div className="flex flex-col gap-1.5">
              {PRESET_FILES.map((preset) => {
                const isSelected = !customFile && selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#0E1A33] border-blue-500 text-white shadow-sm ring-1 ring-blue-500/30'
                        : 'bg-[#050811] border-[#142036] text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileSpreadsheet className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold truncate">{preset.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${isSelected ? 'bg-blue-500/20 text-blue-300' : 'bg-[#0D1629] text-slate-400'}`}>
                      ${(preset.total / 1000000).toFixed(2)}M
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary Banner */}
          <div className="p-3 rounded-xl bg-[#050811] border border-[#142036] flex items-center justify-between text-xs">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Ready to Import</span>
              <span className="font-bold text-white truncate block">{activeFileName}</span>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs font-extrabold text-emerald-400 block">${(activeTotal / 1000000).toFixed(2)}M</span>
              <span className="text-[10px] text-slate-400 font-medium block">{activeDivisions} Cost Codes</span>
            </div>
          </div>

          {/* Equal Size Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full btn-lg bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-300 font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full btn-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold shadow-md shadow-blue-600/30 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
              <span>Import</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
