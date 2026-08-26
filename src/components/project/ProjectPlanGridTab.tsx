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
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Top Header & Mode Toggle */}
      <div className="flex items-center justify-between gap-2 border-b border-[#162033] pb-2.5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Blueprints & Pins</span>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Ready
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Architectural CAD sheets & geolocated pins
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1 bg-[#0D1424] p-1 rounded-xl border border-[#1A263E] flex-shrink-0">
          <button
            onClick={() => setActiveSubView('blueprint')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'blueprint'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Plan
          </button>
          <button
            onClick={() => setActiveSubView('takeoff')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeSubView === 'takeoff'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Takeoff ({aiTakeoffs.length})</span>
          </button>
        </div>
      </div>

      {activeSubView === 'blueprint' ? (
        <>
          {/* Floor Sheet Selector Dropdown */}
          <div className="p-3 rounded-2xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl px-3 text-xs text-white font-semibold outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="Level 8 - Typical Office Plan">Level 8 - Office Plan (A-208 Rev 04)</option>
                <option value="Level 7 - MEP Services & Riser">Level 7 - MEP Riser (M-107 Rev 03)</option>
                <option value="Ground Floor - Lobby & Core">Ground Floor - Lobby (A-101 Rev 04)</option>
                <option value="Basement - Foundation & Parking">Basement - Foundation (S-001 Rev 02)</option>
              </select>
            </div>

            {/* Filter Pills Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                {[
                  { id: 'all', label: `All (${pins.length})` },
                  { id: 'punch', label: 'Punch' },
                  { id: 'inspection', label: 'Inspections' },
                  { id: 'photo', label: 'Photos' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      filterType === f.id
                        ? 'bg-[#2563EB] text-white font-bold shadow-sm'
                        : 'bg-[#080D18] text-slate-400 hover:text-slate-200 border border-[#141F33]'
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
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex-shrink-0 active:scale-95 ${
                  isDropPinMode 
                    ? 'bg-amber-500 text-slate-950 font-extrabold animate-pulse' 
                    : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{isDropPinMode ? 'Click Map' : 'Drop Pin'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Blueprint Viewer Canvas */}
          <div className="relative w-full rounded-3xl overflow-hidden border border-[#1A263E] bg-[#070B14] shadow-md">
            {/* Zoom Overlay */}
            <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-[#0D1424]/90 backdrop-blur border border-[#1A263E] p-1 rounded-xl shadow-md">
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#141F33] rounded-lg transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#141F33] rounded-lg transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setZoomLevel(1)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#141F33] rounded-lg transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Drop Pin Mode Active Banner */}
            {isDropPinMode && (
              <div className="absolute top-3 left-3 z-20 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 animate-bounce" />
                <span>Click location on blueprint to place pin</span>
              </div>
            )}

            {/* Clean SVG Floor Plan */}
            <div 
              onClick={handleBlueprintClick}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
              className={`relative w-full aspect-[16/10] min-h-[300px] bg-[#080D18] overflow-hidden ${isDropPinMode ? 'cursor-crosshair' : 'cursor-default'}`}
            >
              <svg className="w-full h-full text-slate-600/40" viewBox="0 0 1000 600" fill="none" stroke="currentColor">
                <defs>
                  <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10192A" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="1000" height="600" fill="url(#cadGrid)" />

                {/* Outer Wall Boundary */}
                <rect x="50" y="40" width="900" height="520" stroke="#2563EB" strokeWidth="3" fill="#0A101E" strokeDasharray="none" />

                {/* Internal Room Partition Walls */}
                <line x1="250" y1="40" x2="250" y2="220" stroke="#1E2C48" strokeWidth="2" />
                <line x1="500" y1="40" x2="500" y2="220" stroke="#1E2C48" strokeWidth="2" />
                <line x1="750" y1="40" x2="750" y2="220" stroke="#1E2C48" strokeWidth="2" />
                <line x1="50" y1="220" x2="950" y2="220" stroke="#1E2C48" strokeWidth="2" />

                {/* Central Core & Elevator Shaft */}
                <rect x="380" y="270" width="240" height="150" stroke="#3875F6" strokeWidth="2" fill="#0D1627" />
                <rect x="400" y="290" width="200" height="60" stroke="#1E2C48" strokeWidth="1.5" fill="#070B14" />

                {/* Lower Corridor Partitions */}
                <line x1="300" y1="480" x2="300" y2="560" stroke="#1E2C48" strokeWidth="2" />
                <line x1="700" y1="480" x2="700" y2="560" stroke="#1E2C48" strokeWidth="2" />
                <line x1="50" y1="480" x2="950" y2="480" stroke="#1E2C48" strokeWidth="2" />

                {/* Clean CAD Room Text Labels (Zero Overlap) */}
                <text x="150" y="110" fill="#475569" fontSize="12" fontWeight="700" textAnchor="middle">SUITE 801 (EXEC)</text>
                <text x="375" y="110" fill="#475569" fontSize="12" fontWeight="700" textAnchor="middle">SUITE 802 (ENTRY)</text>
                <text x="625" y="110" fill="#475569" fontSize="12" fontWeight="700" textAnchor="middle">CONFERENCE ROOM</text>
                <text x="850" y="110" fill="#475569" fontSize="12" fontWeight="700" textAnchor="middle">SERVER / TECH</text>

                <text x="500" y="325" fill="#3875F6" fontSize="13" fontWeight="800" textAnchor="middle">CORE ELEVATORS</text>
                <text x="500" y="395" fill="#475569" fontSize="11" fontWeight="700" textAnchor="middle">MEP RISER</text>

                <text x="175" y="525" fill="#475569" fontSize="12" fontWeight="700" textAnchor="middle">NORTH RESTROOMS</text>
                <text x="500" y="525" fill="#475569" fontSize="12" fontWeight="700" textAnchor="middle">OPEN WORKSPACE HUB</text>
                <text x="825" y="525" fill="#475569" fontSize="12" fontWeight="700" textAnchor="middle">EAST MECH CHASE</text>
              </svg>

              {/* Pin Markers Rendered on Floor Plan */}
              {filteredPins.map((pin) => {
                const isSelected = selectedPin?.id === pin.id;
                return (
                  <button
                    key={pin.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPin(pin);
                    }}
                    style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform cursor-pointer hover:scale-110 active:scale-95 z-10 ${
                      pin.type === 'punch'
                        ? 'bg-rose-500 text-white'
                        : pin.type === 'inspection'
                        ? 'bg-blue-600 text-white'
                        : pin.type === 'photo'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-slate-950'
                    } ${isSelected ? 'ring-4 ring-white scale-110 z-20' : ''}`}
                    title={pin.title}
                  >
                    {pin.type === 'punch' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : pin.type === 'inspection' ? (
                      <ClipboardCheck className="w-4 h-4" />
                    ) : pin.type === 'photo' ? (
                      <Camera className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </button>
                );
              })}

              {/* Draft Temporary Pin Indicator */}
              {tempCoords && (
                <div
                  style={{ left: `${tempCoords.x}%`, top: `${tempCoords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-xl animate-bounce z-30"
                >
                  <MapPin className="w-5 h-5 text-slate-950" />
                </div>
              )}
            </div>
          </div>

          {/* New Pin Form Modal */}
          {tempCoords && (
            <form onSubmit={handleSaveNewPin} className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-lg flex flex-col gap-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#162033] pb-2.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  New Pin at ({tempCoords.x}%, {tempCoords.y}%)
                </span>
                <button type="button" onClick={() => setTempCoords(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Title *</label>
                <input
                  type="text"
                  value={newPinTitle}
                  onChange={(e) => setNewPinTitle(e.target.value)}
                  placeholder="E.g. Rebar clearance issue or Punch #104"
                  required
                  className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl px-3 text-xs text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Pin Type</label>
                  <select
                    value={newPinType}
                    onChange={(e) => setNewPinType(e.target.value as any)}
                    className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl px-3 text-xs text-white outline-none focus:border-[#2563EB]"
                  >
                    <option value="punch">⚠ Punch List</option>
                    <option value="inspection">📋 Inspection</option>
                    <option value="photo">📷 Photo Marker</option>
                    <option value="task">☑ Task</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md active:scale-95"
                  >
                    Save Pin
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Selected Pin Details Sheet */}
          {selectedPin && !tempCoords && (
            <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    selectedPin.type === 'punch' ? 'bg-rose-500' : selectedPin.type === 'inspection' ? 'bg-blue-500' : 'bg-emerald-500'
                  }`} />
                  <h3 className="text-sm font-bold text-white">{selectedPin.title}</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">{selectedPin.roomOrArea}</span>
              </div>

              <p className="text-xs text-slate-300 bg-[#080D18] p-3 rounded-2xl border border-[#162033] leading-relaxed">
                {selectedPin.description}
              </p>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#162033]">
                <span className="text-slate-400 font-medium">Status: <strong className="text-white uppercase">{selectedPin.status}</strong></span>
                {onUpdatePinStatus && selectedPin.status !== 'resolved' && (
                  <button
                    onClick={() => onUpdatePinStatus(selectedPin.id, 'resolved')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold cursor-pointer active:scale-95"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* AI Quantity Takeoff Table Sheet */
        <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
              Latti AI Quantity Takeoffs
            </span>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Auto Extracted
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {aiTakeoffs.map((item) => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-[#090E1A] border border-[#141F33] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{item.item}</span>
                  <span className="text-xs font-bold text-blue-400">{item.totalEst}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1 border-t border-[#162033]">
                  <span>{item.costCode}</span>
                  <span>{item.aiQuantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
