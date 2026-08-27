import React, { useState } from 'react';
import { Project } from '../../types';
import { 
  FileText, Download, Eye, Layers, Plus, 
  CheckCircle2, ChevronRight, Upload, Sparkles, Filter,
  MapPin, ZoomIn, ZoomOut, Maximize2, ShieldAlert, CheckSquare,
  Compass, Ruler, AlertCircle, Check
} from 'lucide-react';

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
  disciplineCode: 'ARCH' | 'STRUCT' | 'MEP' | 'ELEC';
  revision: string;
  date: string;
  fileSize: string;
  status: 'Approved' | 'In Review';
  activePinsCount: number;
  previewUrl: string;
}

const MOCK_DRAWING_SETS: DrawingSheet[] = [
  {
    id: 'dwg-1',
    sheetNumber: 'A-208',
    title: 'Level 8 - Office Architecture Plan',
    discipline: 'Architectural',
    disciplineCode: 'ARCH',
    revision: 'Rev 04',
    date: 'May 14, 2025',
    fileSize: '14.2 MB',
    status: 'Approved',
    activePinsCount: 2,
    previewUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'dwg-2',
    sheetNumber: 'A-101',
    title: 'Foundation & Ground Floor Plan',
    discipline: 'Architectural',
    disciplineCode: 'ARCH',
    revision: 'Rev 03',
    date: 'Apr 28, 2025',
    fileSize: '18.6 MB',
    status: 'Approved',
    activePinsCount: 1,
    previewUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'dwg-3',
    sheetNumber: 'S-001',
    title: 'Structural Framing & Column Grid',
    discipline: 'Structural',
    disciplineCode: 'STRUCT',
    revision: 'Rev 02',
    date: 'May 02, 2025',
    fileSize: '22.1 MB',
    status: 'Approved',
    activePinsCount: 3,
    previewUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'dwg-4',
    sheetNumber: 'M-107',
    title: 'MEP Utility Routing & HVAC Layout',
    discipline: 'Mechanical',
    disciplineCode: 'MEP',
    revision: 'Rev 03',
    date: 'May 10, 2025',
    fileSize: '16.8 MB',
    status: 'In Review',
    activePinsCount: 2,
    previewUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'dwg-5',
    sheetNumber: 'E-201',
    title: 'Electrical Distribution & Single Line',
    discipline: 'Electrical',
    disciplineCode: 'ELEC',
    revision: 'Rev 01',
    date: 'Apr 15, 2025',
    fileSize: '11.4 MB',
    status: 'Approved',
    activePinsCount: 0,
    previewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
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
    sheetRef: 'A-208 Rev 04',
    progress: 75,
    discipline: 'Architectural'
  },
  {
    id: 'to-2',
    item: 'Deck Concrete Slab Pour Volume',
    costCode: '03-30-00 (Cast-in-Place Concrete)',
    quantity: '480 cu.yds',
    unitCost: '$165.00 / cu.yd',
    totalEst: '$79,200',
    sheetRef: 'S-001 Rev 02',
    progress: 90,
    discipline: 'Structural'
  },
  {
    id: 'to-3',
    item: '3/4" EMT Power & Telecom Conduit',
    costCode: '26-05-33 (Raceway & Boxes)',
    quantity: '3,600 LF',
    unitCost: '$12.80 / LF',
    totalEst: '$46,080',
    sheetRef: 'M-107 Rev 03',
    progress: 45,
    discipline: 'Electrical'
  },
  {
    id: 'to-4',
    item: 'Modulating VAV Terminal Air Units',
    costCode: '23-36-00 (Air Terminal Units)',
    quantity: '28 Units',
    unitCost: '$1,250.00 / unit',
    totalEst: '$35,000',
    sheetRef: 'M-107 Rev 03',
    progress: 30,
    discipline: 'Mechanical'
  }
];

export const ProjectPlanGridTab: React.FC<ProjectPlanGridTabProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'drawings' | 'takeoffs'>('drawings');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('All');
  const [previewSheet, setPreviewSheet] = useState<DrawingSheet | null>(null);
  const [selectedPin, setSelectedPin] = useState<{ id: string; title: string; type: string; x: number; y: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const filteredSheets = MOCK_DRAWING_SETS.filter(sheet => {
    if (disciplineFilter === 'All') return true;
    return sheet.discipline === disciplineFilter;
  });

  const getDisciplineTheme = (discipline: string) => {
    switch (discipline) {
      case 'Architectural':
        return {
          bg: 'bg-cyan-500/10',
          text: 'text-cyan-400',
          border: 'border-cyan-500/30',
          glow: 'shadow-cyan-950/40'
        };
      case 'Structural':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          glow: 'shadow-amber-950/40'
        };
      case 'Mechanical':
        return {
          bg: 'bg-purple-500/10',
          text: 'text-purple-400',
          border: 'border-purple-500/30',
          glow: 'shadow-purple-950/40'
        };
      case 'Electrical':
        return {
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          glow: 'shadow-emerald-950/40'
        };
      default:
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          glow: 'shadow-blue-950/40'
        };
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 pt-1 pb-24 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. HEADER & SEGMENTED CONTROLLER ─── */}
      <div className="flex items-center justify-between gap-2 border-b border-[#142036] pb-3">
        <div>
          <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-400" />
            <span>Drawings & Takeoffs</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">CAD plan sets & bill of quantities</p>
        </div>

        {/* High-Contrast Segmented Switcher */}
        <div className="flex items-center gap-1 bg-[#070D1A] p-1 rounded-2xl border border-[#142036]">
          <button
            onClick={() => setActiveTab('drawings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'drawings'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Drawings
          </button>
          <button
            onClick={() => setActiveTab('takeoffs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'takeoffs'
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Takeoffs
          </button>
        </div>
      </div>

      {/* ─── 2. DRAWINGS WORKFLOW ─── */}
      {activeTab === 'drawings' && (
        <div className="flex flex-col gap-3.5">
          
          {/* Discipline Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {['All', 'Architectural', 'Structural', 'Mechanical', 'Electrical'].map(d => {
              const isSelected = disciplineFilter === d;
              return (
                <button
                  key={d}
                  onClick={() => setDisciplineFilter(d)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB] border-blue-500 text-white font-bold shadow-md shadow-blue-600/25'
                      : 'bg-[#070D1A] border-[#142036] text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Visual Drawing Cards */}
          <div className="flex flex-col gap-3">
            {filteredSheets.map((sheet) => {
              const theme = getDisciplineTheme(sheet.discipline);

              return (
                <div
                  key={sheet.id}
                  onClick={() => setPreviewSheet(sheet)}
                  className="rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/50 transition-all cursor-pointer shadow-md group overflow-hidden active:scale-[0.99] flex flex-col"
                >
                  {/* Top Row: Thumbnail CAD Grid + Sheet Details */}
                  <div className="p-3.5 flex items-start gap-3">
                    
                    {/* CAD Blueprint Schematic Icon Box */}
                    <div className={`w-16 h-16 rounded-2xl ${theme.bg} border ${theme.border} flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      {/* Blueprint Grid Lines Pattern */}
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#3875f6_1px,transparent_1px),linear-gradient(to_bottom,#3875f6_1px,transparent_1px)] bg-[size:8px_8px]" />
                      <span className={`text-[11px] font-black ${theme.text} z-10 font-mono tracking-tight`}>
                        {sheet.sheetNumber}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300 bg-[#050811]/90 px-1.5 py-0.5 rounded-md mt-0.5 z-10">
                        {sheet.disciplineCode}
                      </span>
                    </div>

                    {/* Metadata & Title */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-black text-white font-mono">{sheet.sheetNumber}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0A1424] border border-[#1E2E4A] text-slate-300">
                            {sheet.revision}
                          </span>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 border ${
                          sheet.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}>
                          {sheet.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate mt-1">
                        {sheet.title}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
                        <span>{sheet.date} · {sheet.fileSize}</span>
                        {sheet.activePinsCount > 0 && (
                          <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            {sheet.activePinsCount} pins
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="px-3.5 py-2 bg-[#050811] border-t border-[#142036] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Discipline: <span className="text-slate-200 font-semibold">{sheet.discipline}</span>
                    </span>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setPreviewSheet(sheet)}
                        className="px-3 py-1 rounded-xl bg-[#0E1A33] hover:bg-blue-600 hover:text-white text-blue-400 text-[11px] font-bold flex items-center gap-1 border border-blue-500/30 transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Open CAD</span>
                      </button>

                      <button
                        onClick={() => alert(`Downloading high-resolution ${sheet.sheetNumber} CAD PDF (${sheet.fileSize})...`)}
                        className="w-7 h-7 rounded-xl bg-[#0E1A33] hover:bg-[#1A2E55] text-slate-300 hover:text-white flex items-center justify-center border border-[#1E2E4A] transition-all cursor-pointer"
                        title="Download Blueprint PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── 3. TAKEOFFS (BILL OF QUANTITIES) WORKFLOW ─── */}
      {activeTab === 'takeoffs' && (
        <div className="flex flex-col gap-3">
          
          {/* Summary Strip */}
          <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Verified Takeoffs</span>
              <h3 className="text-sm font-black text-white mt-0.5">$222,840 Est. Value</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" />
              4 Scopes Active
            </span>
          </div>

          {/* Takeoff Cards */}
          <div className="flex flex-col gap-2.5">
            {MOCK_TAKEOFFS.map((item) => (
              <div 
                key={item.id} 
                className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all flex flex-col gap-2.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 font-mono">{item.costCode}</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">{item.item}</h4>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 flex-shrink-0">{item.totalEst}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-[#050811] p-2 rounded-xl border border-[#142036]">
                  <div>
                    <span className="text-slate-500 block">Quantity</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{item.quantity}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Unit Cost</span>
                    <span className="font-bold text-slate-200 mt-0.5 block">{item.unitCost}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Drawing Ref</span>
                    <span className="font-bold text-blue-400 mt-0.5 block truncate">{item.sheetRef}</span>
                  </div>
                </div>

                {/* Scope Completion Bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium mb-1">
                    <span>Takeoff Execution</span>
                    <span className="text-slate-200 font-bold">{item.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#050811] rounded-full overflow-hidden border border-[#142036]">
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-400 h-full rounded-full" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 4. INTERACTIVE BLUEPRINT CAD CANVAS VIEWER (MODAL) ─── */}
      {previewSheet && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[420px] bg-[#070D1A] border border-[#1E2E4A] rounded-3xl p-5 shadow-2xl flex flex-col gap-3 text-slate-100 relative max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-blue-400 font-mono">{previewSheet.sheetNumber}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0E1A33] text-slate-300 border border-[#1E325A]">
                    {previewSheet.revision}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white truncate mt-0.5">{previewSheet.title}</h3>
              </div>

              <button
                onClick={() => {
                  setPreviewSheet(null);
                  setSelectedPin(null);
                }}
                className="w-8 h-8 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Interactive Vector CAD Canvas with Blueprint Grid & Live Pins */}
            <div className="w-full h-64 bg-[#050A14] rounded-2xl border border-[#1E325A] relative overflow-hidden flex items-center justify-center shadow-inner group">
              
              {/* CAD Vector Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#142340_1px,transparent_1px),linear-gradient(to_bottom,#142340_1px,transparent_1px)] bg-[size:16px_16px]" />
              
              {/* Blueprint Layout Schematic Render */}
              <div className="relative z-10 w-full h-full p-4 flex flex-col justify-between pointer-events-none opacity-80" style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s' }}>
                <div className="border border-blue-500/40 rounded-lg p-2 h-full flex flex-col justify-between">
                  <div className="flex justify-between text-[9px] text-blue-400 font-mono">
                    <span>GRID: A1-D8</span>
                    <span>SCALE: 1/4" = 1'-0"</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 my-auto">
                    <div className="h-12 border border-dashed border-cyan-400/50 rounded flex items-center justify-center text-[9px] text-cyan-300">
                      CORE / ELEVATORS
                    </div>
                    <div className="h-12 border border-dashed border-cyan-400/50 rounded flex items-center justify-center text-[9px] text-cyan-300">
                      OFFICE SUITES
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-400 text-center font-mono">
                    {previewSheet.title} (VECTOR CAD)
                  </div>
                </div>
              </div>

              {/* Interactive Markup Pins */}
              <button
                onClick={() => setSelectedPin({ id: 'p1', title: 'HVAC Duct Clearance Clash', type: 'High Priority Punch', x: 35, y: 40 })}
                className="absolute top-16 left-28 z-20 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-900/60 animate-bounce cursor-pointer border-2 border-white pointer-events-auto"
                title="Punch Pin #1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSelectedPin({ id: 'p2', title: 'Level 8 Rebar Spacing Verified', type: 'Inspection Passed', x: 65, y: 60 })}
                className="absolute bottom-14 right-20 z-20 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/60 cursor-pointer border-2 border-white pointer-events-auto"
                title="Inspection Pin #2"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              {/* Canvas Zoom Controls */}
              <div className="absolute bottom-2 right-2 z-30 flex items-center gap-1 bg-[#0A111F]/90 backdrop-blur-md p-1 rounded-xl border border-[#1E2E4A]">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.6))}
                  className="w-6 h-6 rounded-lg bg-[#0E1A33] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer text-xs"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
                  className="w-6 h-6 rounded-lg bg-[#0E1A33] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer text-xs"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Selected Pin Details Box */}
            {selectedPin && (
              <div className="p-3 rounded-2xl bg-[#0E1A33] border border-blue-500/40 flex items-center justify-between animate-fade-in">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{selectedPin.type}</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{selectedPin.title}</h4>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-[10px] font-bold text-slate-400 hover:text-white px-2 py-1 bg-[#070D1A] rounded-lg"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#142036] text-xs">
              <span className="text-[11px] text-slate-400 font-medium">{previewSheet.fileSize} · CAD Plan</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPreviewSheet(null);
                    setSelectedPin(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0E1A33] text-slate-300 hover:text-white font-bold cursor-pointer transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert(`Downloading ${previewSheet.sheetNumber} CAD PDF Document...`);
                    setPreviewSheet(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
