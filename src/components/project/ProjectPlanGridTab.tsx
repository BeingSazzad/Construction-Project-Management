import React, { useState } from 'react';
import { Project } from '../../types';
import { Download, Eye, FileText, Check } from 'lucide-react';

interface ProjectPlanGridTabProps {
  project: Project;
  pins?: any[];
  onAddPin?: (pin: any) => void;
  onUpdatePinStatus?: (pinId: string, status: 'open' | 'in-progress' | 'resolved') => void;
}

interface DrawingSheet {
  id: string;
  sheetNumber: string;
  title: string;
  discipline: 'Architectural' | 'Structural' | 'Mechanical' | 'Electrical';
  revision: string;
  date: string;
  fileSize: string;
  status: 'Approved' | 'In Review';
}

const DRAWING_SETS: DrawingSheet[] = [
  {
    id: 'dwg-1',
    sheetNumber: 'A-208',
    title: 'Level 8 - Office Architecture Plan',
    discipline: 'Architectural',
    revision: 'Rev 04',
    date: 'May 14, 2025',
    fileSize: '14.2 MB',
    status: 'Approved'
  },
  {
    id: 'dwg-2',
    sheetNumber: 'A-101',
    title: 'Foundation & Ground Floor Plan',
    discipline: 'Architectural',
    revision: 'Rev 03',
    date: 'Apr 28, 2025',
    fileSize: '18.6 MB',
    status: 'Approved'
  },
  {
    id: 'dwg-3',
    sheetNumber: 'S-001',
    title: 'Structural Framing & Column Grid',
    discipline: 'Structural',
    revision: 'Rev 02',
    date: 'May 02, 2025',
    fileSize: '22.1 MB',
    status: 'Approved'
  },
  {
    id: 'dwg-4',
    sheetNumber: 'M-107',
    title: 'MEP Utility Routing & HVAC Layout',
    discipline: 'Mechanical',
    revision: 'Rev 03',
    date: 'May 10, 2025',
    fileSize: '16.8 MB',
    status: 'In Review'
  },
  {
    id: 'dwg-5',
    sheetNumber: 'E-201',
    title: 'Electrical Distribution & Single Line',
    discipline: 'Electrical',
    revision: 'Rev 01',
    date: 'Apr 15, 2025',
    fileSize: '11.4 MB',
    status: 'Approved'
  }
];

const TAKEOFFS_DATA = [
  {
    id: 'to-1',
    item: 'Level 8 Drywall Surface Area',
    costCode: '09-21-16 (Gypsum Board)',
    quantity: '18,400 sq.ft',
    unitCost: '$3.40 / sq.ft',
    totalEst: '$62,560',
    sheetRef: 'A-208 Rev 04'
  },
  {
    id: 'to-2',
    item: 'Deck Concrete Slab Pour Volume',
    costCode: '03-30-00 (Cast-in-Place Concrete)',
    quantity: '480 cu.yds',
    unitCost: '$165.00 / cu.yd',
    totalEst: '$79,200',
    sheetRef: 'S-001 Rev 02'
  },
  {
    id: 'to-3',
    item: '3/4" EMT Power & Telecom Conduit',
    costCode: '26-05-33 (Raceway & Boxes)',
    quantity: '3,600 LF',
    unitCost: '$12.80 / LF',
    totalEst: '$46,080',
    sheetRef: 'M-107 Rev 03'
  },
  {
    id: 'to-4',
    item: 'Modulating VAV Terminal Air Units',
    costCode: '23-36-00 (Air Terminal Units)',
    quantity: '28 Units',
    unitCost: '$1,250.00 / unit',
    totalEst: '$35,000',
    sheetRef: 'M-107 Rev 03'
  }
];

export const ProjectPlanGridTab: React.FC<ProjectPlanGridTabProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'drawings' | 'takeoffs'>('drawings');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('All');
  const [previewSheet, setPreviewSheet] = useState<DrawingSheet | null>(null);

  const filteredSheets = DRAWING_SETS.filter(sheet => {
    if (disciplineFilter === 'All') return true;
    return sheet.discipline === disciplineFilter;
  });

  return (
    <div className="w-full flex flex-col gap-3.5 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in pb-24">
      
      {/* ─── 1. CLEAN HEADER & SWITCHER ─── */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-sm font-bold text-white tracking-tight">Drawings & Takeoffs</h2>

        <div className="flex items-center gap-1 bg-[#070D1A] p-1 rounded-xl border border-[#142036]">
          <button
            onClick={() => setActiveTab('drawings')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'drawings'
                ? 'bg-[#2563EB] text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Drawings
          </button>
          <button
            onClick={() => setActiveTab('takeoffs')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'takeoffs'
                ? 'bg-[#2563EB] text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Takeoffs
          </button>
        </div>
      </div>

      {/* ─── 2. DRAWINGS VIEW ─── */}
      {activeTab === 'drawings' && (
        <div className="flex flex-col gap-3">
          
          {/* Discipline Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {['All', 'Architectural', 'Structural', 'Mechanical', 'Electrical'].map(d => (
              <button
                key={d}
                onClick={() => setDisciplineFilter(d)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  disciplineFilter === d
                    ? 'bg-[#2563EB] border-blue-500 text-white font-bold'
                    : 'bg-[#070D1A] border-[#142036] text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Clean Real Drawing Cards */}
          <div className="flex flex-col gap-2">
            {filteredSheets.map((sheet) => (
              <div
                key={sheet.id}
                className="p-3 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-[#1E325A] transition-colors flex flex-col gap-2 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-black text-blue-400 font-mono">{sheet.sheetNumber}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0A1424] border border-[#142036] text-slate-300">
                      {sheet.revision}
                    </span>
                    <h3 className="text-xs font-bold text-white truncate">{sheet.title}</h3>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 border ${
                    sheet.status === 'Approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}>
                    {sheet.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#142036]">
                  <span>{sheet.date} · {sheet.fileSize}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewSheet(sheet)}
                      className="px-2.5 py-1 rounded-lg bg-[#0E1A33] hover:bg-[#1A2E55] text-blue-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-[#1E2E4A]"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => alert(`Downloading ${sheet.sheetNumber} (${sheet.fileSize})...`)}
                      className="w-6 h-6 rounded-lg bg-[#0E1A33] hover:bg-[#1A2E55] text-slate-300 flex items-center justify-center transition-colors cursor-pointer border border-[#1E2E4A]"
                      title="Download PDF"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 3. TAKEOFFS VIEW ─── */}
      {activeTab === 'takeoffs' && (
        <div className="flex flex-col gap-2">
          {TAKEOFFS_DATA.map((item) => (
            <div 
              key={item.id} 
              className="p-3 rounded-xl bg-[#070D1A] border border-[#142036] flex flex-col gap-1.5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white truncate">{item.item}</span>
                <span className="text-xs font-bold text-emerald-400 flex-shrink-0">{item.totalEst}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{item.costCode}</span>
                <span className="text-slate-300 font-semibold">{item.quantity}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-[#142036]">
                <span>Rate: {item.unitCost}</span>
                <span>Ref: {item.sheetRef}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── 4. BLUEPRINT PDF PREVIEW MODAL ─── */}
      {previewSheet && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-[#070D1A] border border-[#1E2E4A] rounded-2xl p-5 shadow-2xl flex flex-col gap-3 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div>
                <h3 className="text-xs font-bold text-white">{previewSheet.sheetNumber} - {previewSheet.title}</h3>
                <p className="text-[10px] text-slate-400">{previewSheet.revision} · {previewSheet.discipline}</p>
              </div>
              <button
                onClick={() => setPreviewSheet(null)}
                className="w-6 h-6 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="w-full h-44 bg-[#050811] rounded-xl border border-[#142036] flex flex-col items-center justify-center gap-2 p-4 text-center">
              <FileText className="w-8 h-8 text-blue-400 opacity-60" />
              <p className="text-xs font-semibold text-slate-300">Vector Blueprint PDF</p>
              <p className="text-[10px] text-slate-500">{previewSheet.fileSize} Document</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#142036]">
              <button
                onClick={() => setPreviewSheet(null)}
                className="px-3 py-1.5 rounded-lg bg-[#0E1A33] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading ${previewSheet.sheetNumber}.pdf...`);
                  setPreviewSheet(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
