import React, { useState } from 'react';
import { Project, PlanGridPin } from '../../types';
import { 
  MapPin, Plus, ZoomIn, ZoomOut, RotateCcw, 
  AlertCircle, CheckCircle2, Camera, ClipboardCheck, 
  Layers, X, User, ArrowUpRight, Sparkles, FileSpreadsheet, 
  Upload, FileText, Check, ShieldCheck 
} from 'lucide-react';

interface ProjectPlanGridTabProps {
  project: Project;
  pins: PlanGridPin[];
  onAddPin?: (pin: PlanGridPin) => void;
  onUpdatePinStatus?: (pinId: string, status: 'open' | 'in-progress' | 'resolved') => void;
}

export const ProjectPlanGridTab: React.FC<ProjectPlanGridTabProps> = ({
  project,
  pins,
  onAddPin,
  onUpdatePinStatus
}) => {
  const [activeSubView, setActiveSubView] = useState<'blueprint' | 'takeoff'>('blueprint');
  const [selectedFloor, setSelectedFloor] = useState<string>('Level 8 - Typical Office Plan');
  const [filterType, setFilterType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedPin, setSelectedPin] = useState<PlanGridPin | null>(pins[0] || null);
  const [isDropPinMode, setIsDropPinMode] = useState(false);

  // New pin state
  const [tempCoords, setTempCoords] = useState<{ x: number; y: number } | null>(null);
  const [newPinTitle, setNewPinTitle] = useState('');
  const [newPinType, setNewPinType] = useState<'punch' | 'task' | 'photo' | 'inspection'>('punch');
  const [newPinDesc, setNewPinDesc] = useState('');

  // AI Takeoff approval state
  const [approvedItems, setApprovedItems] = useState<Record<string, boolean>>({
    'takeoff-1': true,
    'takeoff-2': true,
  });

  const aiTakeoffs = [
    {
      id: 'takeoff-1',
      item: 'Level 8 Drywall Surface Area',
      costCode: '09-21-16 (Gypsum Board)',
      aiQuantity: '18,400 sq.ft',
      unitCost: '$3.40 / sq.ft',
      totalEst: '$62,560',
      confidence: 96,
      sheetRef: 'A-208 Rev 04'
    },
    {
      id: 'takeoff-2',
      item: 'Deck Concrete Slab Pour Volume',
      costCode: '03-30-00 (Cast-in-Place Concrete)',
      aiQuantity: '480 cu.yds',
      unitCost: '$165.00 / cu.yd',
      totalEst: '$79,200',
      confidence: 98,
      sheetRef: 'S-001 Rev 02'
    },
    {
      id: 'takeoff-3',
      item: '3/4" EMT Power & Telecom Conduit',
      costCode: '26-05-33 (Raceway & Boxes)',
      aiQuantity: '3,600 LF',
      unitCost: '$12.80 / LF',
      totalEst: '$46,080',
      confidence: 94,
      sheetRef: 'M-107 Rev 03'
    },
    {
      id: 'takeoff-4',
      item: 'Modulating VAV Terminal Air Units',
      costCode: '23-36-00 (Air Terminal Units)',
      aiQuantity: '28 Units',
      unitCost: '$1,250.00 / unit',
      totalEst: '$35,000',
      confidence: 97,
      sheetRef: 'M-107 Rev 03'
    }
  ];

  const filteredPins = pins.filter(p => {
    if (filterType === 'all') return true;
    return p.type === filterType;
  });

  const handleBlueprintClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDropPinMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setTempCoords({ x, y });
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempCoords || !newPinTitle.trim()) return;

    const newPin: PlanGridPin = {
      id: `pin-${Date.now()}`,
      projectId: project.id,
      title: newPinTitle,
      xPercent: tempCoords.x,
      yPercent: tempCoords.y,
      type: newPinType,
      status: 'open',
      roomOrArea: `${selectedFloor.split(' - ')[0]} Area`,
      description: newPinDesc || 'Issue reported on architectural plan',
      createdDate: new Date().toISOString().split('T')[0]
    };

    if (onAddPin) {
      onAddPin(newPin);
    }
    setSelectedPin(newPin);
    setTempCoords(null);
    setIsDropPinMode(false);
    setNewPinTitle('');
    setNewPinDesc('');
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-24 font-sans">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Plan Intelligence & Blueprints
            </h2>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Latti Vision AI Ready
            </span>
          </div>
          <p className="text-xs text-slate-400">
            High-res architectural sheets, geolocated pins & automated AI quantity takeoff
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-[#080D18] p-1 rounded-xl border border-[#162033]">
          <button
            onClick={() => setActiveSubView('blueprint')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'blueprint'
                ? 'bg-[#0066FF] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Floor Plan & Pins
          </button>
          <button
            onClick={() => setActiveSubView('takeoff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubView === 'takeoff'
                ? 'bg-[#0066FF] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Takeoff ({aiTakeoffs.length})</span>
          </button>
        </div>
      </div>

      {activeSubView === 'blueprint' ? (
        <>
          {/* Plan Sheet Selector & Filters Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#0D1422] p-2.5 rounded-xl border border-[#1A263B]">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="bg-[#080D18] border border-[#1E293B] rounded-lg px-2.5 py-1 text-xs text-slate-200 font-semibold outline-none focus:border-blue-500"
              >
                <option value="Level 8 - Typical Office Plan">Level 8 - Typical Office Plan (A-208 Rev 04)</option>
                <option value="Level 7 - MEP Services & Riser">Level 7 - MEP Services & Riser (M-107 Rev 03)</option>
                <option value="Ground Floor - Lobby & Core">Ground Floor - Lobby & Core (A-101 Rev 04)</option>
                <option value="Basement - Foundation & Parking">Basement - Foundation & Parking (S-001 Rev 02)</option>
              </select>
            </div>

            {/* Filter Badges & Drop Pin Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                {[
                  { id: 'all', label: `All (${pins.length})` },
                  { id: 'punch', label: 'Punch', color: 'text-red-400' },
                  { id: 'inspection', label: 'Inspections', color: 'text-blue-400' },
                  { id: 'photo', label: 'Photos', color: 'text-emerald-400' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                      filterType === f.id
                        ? 'bg-[#18263D] text-white border border-blue-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsDropPinMode(!isDropPinMode);
                  setTempCoords(null);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow cursor-pointer flex-shrink-0 ${
                  isDropPinMode 
                    ? 'bg-amber-500 text-slate-950 font-extrabold animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{isDropPinMode ? 'Click Map' : 'Drop Pin'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Blueprint Viewer Stage */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#1A263B] bg-[#070B14] shadow-2xl">
            {/* Zoom Controls Overlay */}
            <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-[#0D1422]/90 backdrop-blur border border-[#1A263B] p-1 rounded-xl shadow-lg">
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
                className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setZoomLevel(1)}
                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-[10px] font-bold"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Pin Drop Mode Banner */}
            {isDropPinMode && (
              <div className="absolute top-3 left-3 z-20 bg-amber-500/90 backdrop-blur text-slate-950 px-3 py-1.5 rounded-lg text-xs font-black shadow-lg flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 animate-bounce" />
                <span>Click any location on the blueprint to place a marker</span>
              </div>
            )}

            {/* Blueprint SVG Canvas Container */}
            <div 
              onClick={handleBlueprintClick}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
              className={`relative w-full aspect-[16/10] min-h-[320px] max-h-[460px] bg-[#0A101D] overflow-hidden ${isDropPinMode ? 'cursor-crosshair' : 'cursor-default'}`}
            >
              <svg className="w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#142138" strokeWidth="1" />
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#0E1726" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#blueprint-grid)" />

                {/* Perimeter Wall Outline */}
                <rect x="5%" y="8%" width="90%" height="84%" fill="none" stroke="#2563EB" strokeWidth="2.5" />
                <rect x="6%" y="9%" width="88%" height="82%" fill="none" stroke="#1E3A8A" strokeWidth="1" strokeDasharray="4 2" />

                {/* Central Elevator / Utility Core */}
                <rect x="42%" y="32%" width="16%" height="36%" fill="#0D1627" stroke="#3B82F6" strokeWidth="1.5" />
                <line x1="42%" y1="50%" x2="58%" y2="50%" stroke="#1D4ED8" strokeWidth="1" />
                <text x="50%" y="45%" fill="#60A5FA" fontSize="10" fontWeight="bold" textAnchor="middle">CORE ELEVATORS</text>
                <text x="50%" y="58%" fill="#60A5FA" fontSize="9" textAnchor="middle">MEP RISER</text>

                {/* Office Rooms Partitions */}
                <line x1="5%" y1="28%" x2="42%" y2="28%" stroke="#1E40AF" strokeWidth="1.5" />
                <line x1="23%" y1="8%" x2="23%" y2="28%" stroke="#1E40AF" strokeWidth="1.5" />
                <text x="14%" y="19%" fill="#93C5FD" fontSize="9" textAnchor="middle">SUITE 801 (EXEC)</text>
                <text x="32%" y="19%" fill="#93C5FD" fontSize="9" textAnchor="middle">SUITE 802 (ENTRY)</text>

                <line x1="58%" y1="28%" x2="95%" y2="28%" stroke="#1E40AF" strokeWidth="1.5" />
                <line x1="76%" y1="8%" x2="76%" y2="28%" stroke="#1E40AF" strokeWidth="1.5" />
                <text x="67%" y="19%" fill="#93C5FD" fontSize="9" textAnchor="middle">CONFERENCE A</text>
                <text x="85%" y="19%" fill="#93C5FD" fontSize="9" textAnchor="middle">SERVER / TELECOM</text>

                <line x1="5%" y1="72%" x2="95%" y2="72%" stroke="#1E40AF" strokeWidth="1.5" />
                <line x1="30%" y1="72%" x2="30%" y2="92%" stroke="#1E40AF" strokeWidth="1.5" />
                <line x1="70%" y1="72%" x2="70%" y2="92%" stroke="#1E40AF" strokeWidth="1.5" />
                <text x="17%" y="83%" fill="#93C5FD" fontSize="9" textAnchor="middle">NORTH RESTROOMS</text>
                <text x="50%" y="83%" fill="#93C5FD" fontSize="9" textAnchor="middle">OPEN WORKSPACE HUB</text>
                <text x="83%" y="83%" fill="#93C5FD" fontSize="9" textAnchor="middle">EAST MECH CHASE</text>

                <text x="50%" y="5%" fill="#475569" fontSize="8" textAnchor="middle">← 140'-0" OVERALL WIDTH →</text>
              </svg>

              {/* Render Pins */}
              {filteredPins.map((pin) => {
                const isSelected = selectedPin?.id === pin.id;
                const pinColor = 
                  pin.type === 'punch' ? 'bg-red-500 border-red-300 text-white' :
                  pin.type === 'inspection' ? 'bg-blue-500 border-blue-300 text-white' :
                  pin.type === 'photo' ? 'bg-emerald-500 border-emerald-300 text-white' :
                  'bg-amber-500 border-amber-300 text-slate-950';

                return (
                  <div
                    key={pin.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPin(pin);
                    }}
                    style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
                  >
                    <span className={`absolute -inset-1 rounded-full animate-ping opacity-60 ${
                      pin.type === 'punch' ? 'bg-red-400' : 'bg-blue-400'
                    }`} />
                    
                    <div className={`relative w-6 h-6 rounded-full border-2 shadow-lg flex items-center justify-center transition-transform ${
                      isSelected ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                    } ${pinColor}`}>
                      {pin.type === 'punch' ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                      ) : pin.type === 'inspection' ? (
                        <ClipboardCheck className="w-3.5 h-3.5" />
                      ) : (
                        <Camera className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>
                );
              })}

              {tempCoords && (
                <div 
                  style={{ left: `${tempCoords.x}%`, top: `${tempCoords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-2xl animate-bounce"
                >
                  <MapPin className="w-4 h-4 text-slate-950" />
                </div>
              )}
            </div>
          </div>

          {/* New Pin Modal */}
          {tempCoords && (
            <form onSubmit={handleSaveNewPin} className="p-4 rounded-xl bg-[#0D1422] border border-amber-500/50 shadow-xl flex flex-col gap-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#1A263B] pb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Place New Markup Pin at ({tempCoords.x}%, {tempCoords.y}%)
                </span>
                <button type="button" onClick={() => setTempCoords(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Pin Category</label>
                  <select
                    value={newPinType}
                    onChange={(e) => setNewPinType(e.target.value as any)}
                    className="w-full bg-[#080D18] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500"
                  >
                    <option value="punch">⚠️ Punch List Defect</option>
                    <option value="inspection">📋 Quality & Code Inspection</option>
                    <option value="photo">📸 Progress Photo Tag</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Pin Title *</label>
                  <input
                    type="text"
                    value={newPinTitle}
                    onChange={(e) => setNewPinTitle(e.target.value)}
                    placeholder="E.g. Incomplete HVAC flex duct"
                    required
                    className="w-full bg-[#080D18] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Issue Description</label>
                <textarea
                  value={newPinDesc}
                  onChange={(e) => setNewPinDesc(e.target.value)}
                  placeholder="Describe what needs correction or inspection at this coordinate..."
                  rows={2}
                  className="w-full bg-[#080D18] border border-[#1E293B] rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTempCoords(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow"
                >
                  Save Pin to Sheet
                </button>
              </div>
            </form>
          )}

          {/* Selected Pin Detail */}
          {selectedPin && (
            <div className="p-4 rounded-xl bg-[#0D1422] border border-[#1A263B] shadow-md flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selectedPin.type === 'punch' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                    selectedPin.type === 'inspection' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {selectedPin.type === 'punch' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <ClipboardCheck className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{selectedPin.title}</div>
                    <div className="text-[10px] text-slate-400">{selectedPin.roomOrArea} • Placed on {selectedPin.createdDate}</div>
                  </div>
                </div>

                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  selectedPin.status === 'resolved' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  selectedPin.status === 'in-progress' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {selectedPin.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-[#080D18] p-2.5 rounded-lg border border-[#151F30]">
                {selectedPin.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#182338]">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Assigned: <strong className="text-slate-200">{selectedPin.assigneeName || 'Avery & Marsh Field Team'}</strong></span>
                </div>

                {onUpdatePinStatus && selectedPin.status !== 'resolved' && (
                  <button
                    onClick={() => onUpdatePinStatus(selectedPin.id, 'resolved')}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Mark Resolved</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* AI Quantity Takeoff & Scope Analysis (RFP Section 05 & 08) */
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-[#0D1422] border border-blue-500/30 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white">Latti AI Plan-Set Takeoff Analysis</h3>
                <p className="text-[11px] text-slate-400">
                  Automated material scope & quantity extraction from 4 uploaded architectural sheets
                </p>
              </div>
            </div>

            <button 
              onClick={() => alert("Upload new PDF Plan Set to trigger AI Takeoff...")}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Plan-Set</span>
            </button>
          </div>

          {/* Extracted Takeoff Line Items */}
          <div className="flex flex-col gap-2.5">
            {aiTakeoffs.map((item) => {
              const isApproved = approvedItems[item.id];
              return (
                <div key={item.id} className="p-3.5 rounded-xl bg-[#0D1422] border border-[#1A263B] flex flex-col gap-2.5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.item}</span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          {item.confidence}% AI Confidence
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Cost Code: {item.costCode} • Sheet: {item.sheetRef}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-white">{item.totalEst}</div>
                      <div className="text-[10px] text-slate-400">{item.aiQuantity} @ {item.unitCost}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#182338]">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                      Cross-referenced against historical Avery & Marsh cost library
                    </span>

                    <button
                      onClick={() => setApprovedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        isApproved
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isApproved ? 'Approved & Synced' : 'Approve Line'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
