import React, { useState } from 'react';
import { Project } from '../../types';
import { 
  FileText, Download, Eye, Layers, Plus, 
  CheckCircle2, ChevronRight, Upload, Sparkles, Filter
} from 'lucide-react';

interface ProjectPlanGridTabProps {
  project: Project;
  pins?: any;
  onAddPin?: any;
  onUpdatePinStatus?: any;
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

const MOCK_DRAWING_SETS: DrawingSheet[] = [
  {
    id: 'dwg-1',
    sheetNumber: 'A-208',
    title: 'Level 8 - Office Architecture Plan',
    discipline: 'Architectural',
    revision: 'Rev 04',
    date: 'May 14, 2025',
    fileSize: '14.2 MB',
    status: 'Approved',
  },
  {
    id: 'dwg-2',
    sheetNumber: 'A-101',
    title: 'Foundation & Ground Floor Plan',
    discipline: 'Architectural',
    revision: 'Rev 03',
    date: 'Apr 28, 2025',
    fileSize: '18.6 MB',
    status: 'Approved',
  },
  {
    id: 'dwg-3',
    sheetNumber: 'S-001',
    title: 'Structural Framing & Column Grid',
    discipline: 'Structural',
    revision: 'Rev 02',
    date: 'May 02, 2025',
    fileSize: '22.1 MB',
    status: 'Approved',
  },
  {
    id: 'dwg-4',
    sheetNumber: 'M-107',
    title: 'MEP Utility Routing & HVAC Layout',
    discipline: 'Mechanical',
    revision: 'Rev 03',
    date: 'May 10, 2025',
    fileSize: '16.8 MB',
    status: 'In Review',
  },
  {
    id: 'dwg-5',
    sheetNumber: 'E-201',
    title: 'Electrical Distribution & Single Line',
    discipline: 'Electrical',
    revision: 'Rev 01',
    date: 'Apr 15, 2025',
    fileSize: '11.4 MB',
    status: 'Approved',
  },
];

const MOCK_TAKEOFFS = [
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

  const filteredSheets = MOCK_DRAWING_SETS.filter(sheet => {
    if (disciplineFilter === 'All') return true;
    return sheet.discipline === disciplineFilter;
  });

  return (
    <div className="w-full flex flex-col gap-3.5 pt-2 pb-24 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Header & Switcher */}
      <div className="flex items-center justify-between gap-2 border-b border-[#142036] pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Drawings & Takeoffs</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">CAD plan sets and bill of quantities</p>
        </div>

        <div className="flex items-center gap-1 bg-[#070D1A] p-1 rounded-xl border border-[#142036]">
          <button
            onClick={() => setActiveTab('drawings')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'drawings'
                ? 'bg-[#2563EB] text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Drawings
          </button>
          <button
            onClick={() => setActiveTab('takeoffs')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'takeoffs'
                ? 'bg-[#2563EB] text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Takeoffs
          </button>
        </div>
      </div>

      {/* 2. DRAWINGS LIST VIEW */}
      {activeTab === 'drawings' && (
        <div className="flex flex-col gap-3">
          
          {/* Discipline Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {['All', 'Architectural', 'Structural', 'Mechanical', 'Electrical'].map(d => (
              <button
                key={d}
                onClick={() => setDisciplineFilter(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  disciplineFilter === d
                    ? 'bg-[#2563EB] border-blue-500 text-white shadow-sm'
                    : 'bg-[#0A111F] border-[#142036] text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Drawing Sheet Cards */}
          <div className="flex flex-col gap-2.5">
            {filteredSheets.map((sheet) => (
              <div
                key={sheet.id}
                className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] hover:border-[#1E325A] transition-all flex flex-col gap-2.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-blue-400">{sheet.sheetNumber}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#070D1A] border border-[#142036] text-slate-300">
                          {sheet.revision}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate mt-0.5">
                        {sheet.title}
                      </h4>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 border ${
                    sheet.status === 'Approved'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-[#141F33] text-slate-400 border-[#1E2E48]'
                  }`}>
                    {sheet.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#142036]">
                  <span>{sheet.date} • {sheet.fileSize}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewSheet(sheet)}
                      className="px-2.5 py-1 rounded-lg bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-blue-400 hover:text-white font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => alert(`Downloading ${sheet.sheetNumber} (${sheet.fileSize})...`)}
                      className="w-7 h-7 rounded-lg bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. QUANTITY TAKEOFFS VIEW */}
      {activeTab === 'takeoffs' && (
        <div className="flex flex-col gap-2.5">
          <div className="p-3 rounded-2xl bg-[#0A111F] border border-[#142036] flex items-center justify-between">
            <span className="text-xs font-bold text-white">Bill of Quantities (BOQ)</span>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              Verified Scope
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {MOCK_TAKEOFFS.map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-[#0A111F] border border-[#142036] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[70%]">{item.item}</span>
                  <span className="text-xs font-bold text-blue-400">{item.totalEst}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-[#142036]">
                  <span>{item.costCode}</span>
                  <span className="font-semibold text-slate-300">{item.quantity}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Unit Cost: {item.unitCost}</span>
                  <span>Ref: {item.sheetRef}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sheet Preview Modal */}
      {previewSheet && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[400px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div>
                <h3 className="text-sm font-bold text-white">{previewSheet.sheetNumber} - {previewSheet.title}</h3>
                <p className="text-[10px] text-slate-400">{previewSheet.revision} • {previewSheet.discipline}</p>
              </div>
              <button
                onClick={() => setPreviewSheet(null)}
                className="w-7 h-7 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="w-full h-48 bg-[#050811] rounded-2xl border border-[#142036] flex flex-col items-center justify-center gap-2 p-4 text-center">
              <FileText className="w-10 h-10 text-blue-400 opacity-60" />
              <p className="text-xs font-semibold text-slate-300">High-Resolution Vector CAD Blueprint</p>
              <p className="text-[10px] text-slate-500">{previewSheet.fileSize} PDF document ready for markup</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#142036]">
              <button
                onClick={() => setPreviewSheet(null)}
                className="px-4 py-2 rounded-xl bg-[#0E1A33] text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading ${previewSheet.sheetNumber}.pdf...`);
                  setPreviewSheet(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold cursor-pointer"
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
