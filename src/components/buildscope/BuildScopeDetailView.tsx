import React, { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Save, Upload, FileText, CheckCircle2, AlertTriangle,
  Search, Plus, Trash2, ChevronDown, ToggleLeft, ToggleRight,
  Download, Send, Info, Building2, Layers, ShieldCheck, Sparkles
} from 'lucide-react';
import { BuildScopeAnalysisCard } from './BuildScopeView';

// ─── TYPES ───
interface ProjectDetails {
  projectName: string;
  clientCompany: string;
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  projectType: string;
  numStories: string;
  qualityLevel: string;
  conditionedSF: string;
  totalUnderRoofSF: string;
  targetStart: string;
  targetCompletion: string;
  constructionMethods: string;
  preferredBrands: string;
  preferredSuppliers: string;
  specialConditions: string;
  generalNotes: string;
  exteriorWalls: string;
  exteriorTrim: string;
  roofing: string;
  windows: string;
  exteriorDoors: string;
  interiorWalls: string;
  ceilings: string;
  paintScope: string;
  insulation: string;
  flooring: string;
  cabinets: string;
  countertops: string;
  plumbingFixtures: string;
  lighting: string;
  appliances: string;
  additionalFinishNotes: string;
  occupiedProject: boolean;
  unionLabor: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  classification: string;
}

interface QuantityItem {
  id: string;
  name: string;
  trade: string;
  scope: string;
  info: string;
  qty: number;
  unit: string;
  waste: number;
  refLoc: string;
  confidence: 'Low' | 'Moderate' | 'Allowance' | 'High' | 'Missing';
  approved: boolean;
  notes?: string;
}

interface LaborItem {
  id: string;
  name: string;
  trade: string;
  confidence: string;
  qty: string;
  lowUnit: string;
  expUnit: number;
  highUnit: string;
  expTotal: string;
  includes: string[];
  excludes: string[];
  approved: boolean;
}

interface MaterialItem {
  id: string;
  name: string;
  scope: string;
  confidence: string;
  qty: string;
  lowUnit: number;
  expUnit: number;
  highUnit: number;
  source: string;
  approved: boolean;
}

// ─── STEP NAMES ───
const STEPS = ['Details', 'Specs', 'Upload', 'Review', 'Quantities', 'Materials', 'Labor', 'Report'] as const;

// ─── PROPS ───
interface BuildScopeDetailViewProps {
  analysis: BuildScopeAnalysisCard;
  onBack: () => void;
}

export const BuildScopeDetailView: React.FC<BuildScopeDetailViewProps> = ({ analysis, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [qtySearch, setQtySearch] = useState('');
  const [qtyTradeFilter, setQtyTradeFilter] = useState('All trades');
  const [qtyConfFilter, setQtyConfFilter] = useState('All conf.');
  const [laborSearch, setLaborSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // ─── STEP 1: Details State ───
  const isSample = analysis.projectName.toLowerCase().includes('sample');
  const [details, setDetails] = useState<ProjectDetails>({
    projectName: analysis.projectName,
    clientCompany: '',
    propertyAddress: analysis.address ? analysis.address.split(' · ')[0] : '',
    city: isSample ? 'St Petersburg' : '',
    state: isSample ? 'FL' : '',
    zip: isSample ? '33704' : '',
    county: '',
    projectType: 'New Construction',
    numStories: isSample ? '2' : '1',
    qualityLevel: isSample ? 'High-End' : 'Standard',
    conditionedSF: isSample ? '4100' : '0',
    totalUnderRoofSF: isSample ? '5220' : '0',
    targetStart: '',
    targetCompletion: '',
    constructionMethods: isSample ? 'Stem Wall Slab 48" Tall' : '',
    preferredBrands: '',
    preferredSuppliers: '',
    specialConditions: '',
    generalNotes: '',
    exteriorWalls: isSample ? '3-coat stucco' : '',
    exteriorTrim: isSample ? 'painted wood' : '',
    roofing: isSample ? 'standing seam metal' : '',
    windows: isSample ? 'Milgard fiberglass, dual-pane' : '',
    exteriorDoors: isSample ? 'fiberglass entry' : '',
    interiorWalls: isSample ? 'smooth drywall Level 5' : '',
    ceilings: isSample ? 'smooth drywall, 9ft' : '',
    paintScope: isSample ? 'int walls+ceilings+trim; ext stucco+trim' : '',
    insulation: isSample ? 'spray foam' : '',
    flooring: isSample ? 'LVP main, tile baths, carpet bedrooms' : '',
    cabinets: isSample ? 'custom maple, soft-close' : '',
    countertops: isSample ? 'quartz kitchen, granite baths' : '',
    plumbingFixtures: isSample ? 'Kohler' : '',
    lighting: isSample ? 'recessed LED' : '',
    appliances: isSample ? 'Sub-Zero/Wolf package' : '',
    additionalFinishNotes: '',
    occupiedProject: false,
    unionLabor: false
  });

  // ─── STEP 2: Upload State ───
  const [uploadedFiles] = useState<UploadedFile[]>([
    { id: 'f1', name: 'Ceiling Detail.pdf', type: 'PDF', size: '3404 KB', classification: 'Construction Detail' },
    { id: 'f2', name: 'Electrical.pdf', type: 'PDF', size: '2599 KB', classification: 'Electrical' },
    { id: 'f3', name: 'Floorplans with elevations.pdf', type: 'PDF', size: '16479 KB', classification: 'Floor Plan' },
    { id: 'f4', name: 'Foundation and Framing.pdf', type: 'PDF', size: '9994 KB', classification: 'Foundation' },
    { id: 'f5', name: 'HVAC.pdf', type: 'PDF', size: '2112 KB', classification: 'Mechanical' },
    { id: 'f6', name: 'Plumbing.pdf', type: 'PDF', size: '7069 KB', classification: 'Plumbing' },
  ]);

  // ─── STEP 4: Quantities State ───
  const [quantities, setQuantities] = useState<QuantityItem[]>([
    { id: 'q1', name: 'Continuous Wall Footings', trade: 'Concrete', scope: 'Foundations', info: 'Architectural plans missing; perimeter estimated from foundation layout.', qty: 600, unit: 'CF', waste: 5, refLoc: 'S1 · Main House & ADU Perimeter', confidence: 'Low', approved: false },
    { id: 'q2', name: 'Column Footings', trade: 'Concrete', scope: 'Foundations', info: 'Counted bearing footings shown on foundation plan.', qty: 45, unit: 'CF', waste: 5, refLoc: 'S1 · Main House interior and porches', confidence: 'Moderate', approved: false },
    { id: 'q3', name: '4" Concrete Slab', trade: 'Concrete', scope: 'Slab on Grade', info: 'Ground floor footprint estimated at 2500 SF derived from total 5220 SF under roof over 2 stories.', qty: 833, unit: 'CF', waste: 5, refLoc: 'S1 · Main House & ADU Level 1', confidence: 'Moderate', approved: false },
    { id: 'q4', name: '8" CMU Exterior Walls', trade: 'Masonry', scope: 'Block', info: 'Assumes first floor is full CMU construction per typical Florida details and S3 wall section.', qty: 3000, unit: 'SF', waste: 10, refLoc: 'S1, S3 · Exterior Walls Level 1', confidence: 'Low', approved: false },
    { id: 'q5', name: 'Interior Wood Framing', trade: 'Framing', scope: 'Walls', info: 'Used residential allowance heuristic: Interior wall LF = 0.30 LF per SF of conditioned floor area.', qty: 1230, unit: 'LF', waste: 10, refLoc: 'n/a · Whole House Interior', confidence: 'Allowance', approved: false },
    { id: 'q6', name: 'Standing Seam Metal Roof', trade: 'Roofing', scope: 'Metal Roofing', info: 'Applied a 1.15 slope/overhang factor to the provided 5220 SF total under-roof area.', qty: 6003, unit: 'SF', waste: 10, refLoc: 'S4 · Main House and ADU Roof', confidence: 'Moderate', approved: false },
    { id: 'q7', name: '3 Coat Stucco', trade: 'Stucco', scope: 'Cladding', info: 'Elevations missing. Assumed 20ft average wall height across 2 stories.', qty: 7990, unit: 'SF', waste: 5, refLoc: 'n/a · Main House & ADU Exterior', confidence: 'Allowance', approved: false },
    { id: 'q8', name: 'Spray Foam Insulation', trade: 'Insulation', scope: 'Thermal', info: 'Foam covers all exterior walls and roof underside.', qty: 13900, unit: 'SF', waste: 5, refLoc: 'n/a · Exterior Envelope (Walls & Roof)', confidence: 'Low', approved: false },
  ]);

  // ─── STEP 5: Materials State ───
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialQuality, setMaterialQuality] = useState('Standard');
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([
    { id: 'm1', name: 'Dumpster Rental (10-day)', scope: 'General Conditions · Moderate', confidence: 'Moderate', qty: '1 ea', lowUnit: 450, expUnit: 600, highUnit: 850, source: 'Metro market\nSite waste services', approved: false },
    { id: 'm2', name: '2×6 Studs (8ft)', scope: 'Framing · High', confidence: 'High', qty: '200 ea', lowUnit: 6, expUnit: 6.75, highUnit: 8, source: 'Metro market\nBuilders FirstSource', approved: false },
    { id: 'm3', name: 'Composite Trim Boards (1×6×16)', scope: 'Exterior Finishes · Moderate', confidence: 'Moderate', qty: '40 ea', lowUnit: 35, expUnit: 48, highUnit: 65, source: 'Metro market\nUniversal Forest', approved: false },
    { id: 'm4', name: 'Architectural Shingles (Bundle)', scope: 'Roofing · High', confidence: 'High', qty: '60 bundle', lowUnit: 38, expUnit: 45, highUnit: 55, source: 'Metro market\nABC Supply Co.', approved: false },
    { id: 'm5', name: '1/2 inch Drywall Sheet (4×8)', scope: 'Drywall · High', confidence: 'High', qty: '120 sheet', lowUnit: 14, expUnit: 18, highUnit: 24, source: 'Metro market\nUSG Distribution', approved: false },
    { id: 'm6', name: 'Premium Interior Paint (Gallon)', scope: 'Paint · Moderate', confidence: 'Moderate', qty: '25 gal', lowUnit: 35, expUnit: 50, highUnit: 75, source: 'Metro market\nSherwin-Williams', approved: false },
    { id: 'm7', name: 'LVP Flooring (sq ft)', scope: 'Flooring · Moderate', confidence: 'Moderate', qty: '1000 sq ft', lowUnit: 3, expUnit: 4, highUnit: 7, source: 'Metro market\nShaw Contract', approved: false },
  ]);

  // ─── STEP 6: Labor State ───
  const [laborItems, setLaborItems] = useState<LaborItem[]>([
    { id: 'l1', name: 'Site Clearing and Existing Structure Removal', trade: 'Demolition', confidence: 'Moderate', qty: '1 LS', lowUnit: '$6,500', expUnit: 8500, highUnit: '$12,000', expTotal: '$8,500', includes: ['Labor to clear vegetation, remove existing debris'], excludes: ['Disposal fees, equipment rentals'], approved: false },
    { id: 'l2', name: 'Mass Grading and Compaction', trade: 'Sitework', confidence: 'High', qty: '2500 SF', lowUnit: '$2', expUnit: 2.25, highUnit: '$4', expTotal: '$5,625', includes: ['Labor for fine grading, soil compaction'], excludes: ['Fill dirt materials, compaction testing fees'], approved: false },
    { id: 'l3', name: 'Continuous Wall Footings', trade: 'Concrete', confidence: 'High', qty: '600 CF', lowUnit: '$5', expUnit: 6, highUnit: '$8', expTotal: '$3,600', includes: ['Labor to form, place rebar, and pour concrete'], excludes: ['Concrete material, rebar material'], approved: false },
    { id: 'l4', name: 'Column Footings', trade: 'Concrete', confidence: 'Moderate', qty: '45 CF', lowUnit: '$8', expUnit: 10, highUnit: '$14', expTotal: '$450', includes: ['Form, set rebar cage, pour concrete'], excludes: ['Concrete and rebar material'], approved: false },
    { id: 'l5', name: '4" Concrete Slab on Grade', trade: 'Concrete', confidence: 'Moderate', qty: '833 CF', lowUnit: '$4', expUnit: 5, highUnit: '$7', expTotal: '$4,165', includes: ['Form, pour, finish, and cure concrete slab'], excludes: ['Vapor barrier, rebar/mesh, concrete material'], approved: false },
  ]);

  // ─── ACTION HANDLERS ───
  const handleToggleQuantity = (id: string) => {
    setQuantities(prev => prev.map(item => item.id === id ? { ...item, approved: !item.approved } : item));
  };

  const handleDeleteQuantity = (id: string) => {
    setQuantities(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantityField = (id: string, field: keyof QuantityItem, value: any) => {
    setQuantities(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleToggleLabor = (id: string) => {
    setLaborItems(prev => prev.map(item => item.id === id ? { ...item, approved: !item.approved } : item));
  };

  const handleDeleteLabor = (id: string) => {
    setLaborItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddMockQuantity = () => {
    const names = [
      { name: 'Wood Floor Joists 2x10', trade: 'Framing', scope: 'Flooring', qty: 1500, unit: 'LF', confidence: 'Moderate' as const },
      { name: 'Double Top Plates', trade: 'Framing', scope: 'Walls', qty: 450, unit: 'LF', confidence: 'High' as const },
      { name: 'Subfloor Sheathing 3/4"', trade: 'Framing', scope: 'Flooring', qty: 2500, unit: 'SF', confidence: 'Moderate' as const },
    ];
    const picked = names[Math.floor(Math.random() * names.length)];
    const newItem: QuantityItem = {
      id: `q-${Date.now()}`,
      name: picked.name,
      trade: picked.trade,
      scope: picked.scope,
      info: 'AI-generated takeoff scope item added manually.',
      qty: picked.qty,
      unit: picked.unit,
      waste: 10,
      refLoc: 'S2 · Floor layout detail',
      confidence: picked.confidence,
      approved: false
    };
    setQuantities(prev => [...prev, newItem]);
  };

  const handleAddMockLabor = () => {
    const names = [
      { name: 'Drywall Hanging & Taping', trade: 'Drywall', qty: '8500 SF', expUnit: 1.5, expTotal: '$12,750' },
      { name: 'Exterior Wall Stucco Application', trade: 'Stucco', qty: '7990 SF', expUnit: 4.5, expTotal: '$35,955' },
      { name: 'Roofing Metal Panel Install', trade: 'Roofing', qty: '6003 SF', expUnit: 3.5, expTotal: '$21,010' },
    ];
    const picked = names[Math.floor(Math.random() * names.length)];
    const newItem: LaborItem = {
      id: `l-${Date.now()}`,
      name: picked.name,
      trade: picked.trade,
      confidence: 'Moderate',
      qty: picked.qty,
      lowUnit: `$${(picked.expUnit * 0.8).toFixed(2)}`,
      expUnit: picked.expUnit,
      highUnit: `$${(picked.expUnit * 1.3).toFixed(2)}`,
      expTotal: picked.expTotal,
      includes: ['Standard installer labor, scaffolding setup'],
      excludes: ['Material supplies, clean up fees'],
      approved: false
    };
    setLaborItems(prev => [...prev, newItem]);
  };

  // ─── COMPLEXITY FACTORS ───
  const complexityFactors = [
    'Difficult site access', 'Coastal construction', 'High ceilings',
    'Complex roof', 'Premium finishes', 'Custom detailing',
    'Flood-zone construction', 'Accelerated schedule'
  ];

  // ─── PLAN COMPLETENESS ───
  const planCompleteness = [
    { name: 'Architectural', status: 'Missing' },
    { name: 'Structural', status: 'Complete' },
    { name: 'Civil', status: 'Not Applicable' },
    { name: 'Plumbing', status: 'Complete' },
    { name: 'Electrical', status: 'Complete' },
    { name: 'Mechanical', status: 'Complete' },
    { name: 'Finish schedules', status: 'Missing' },
    { name: 'Door schedule', status: 'Missing' },
    { name: 'Window schedule', status: 'Missing' },
    { name: 'Specifications', status: 'Partially Complete' },
    { name: 'Landscape', status: 'Not Applicable' },
  ];

  // ─── HELPERS ───
  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case 'Low': return 'text-red-400';
      case 'Moderate': return 'text-blue-400';
      case 'High': return 'text-emerald-400';
      case 'Allowance': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'text-emerald-400';
      case 'Missing': return 'text-red-400';
      case 'Partially Complete': return 'text-amber-400';
      default: return 'text-slate-500';
    }
  };

  const inputClass = "w-full h-10 bg-[#060B17] border border-[#172540] focus:border-[#2563EB] rounded-xl px-3 text-xs text-white placeholder-slate-500 outline-none transition-all font-medium";
  const selectClass = "w-full h-10 bg-[#060B17] border border-[#172540] focus:border-[#2563EB] rounded-xl px-3 text-xs text-white outline-none transition-all font-medium appearance-none cursor-pointer";
  const labelClass = "text-[11px] font-semibold text-slate-400 mb-1.5 block";

  // ═══════════════════════════════════════════
  // STEP RENDERERS
  // ═══════════════════════════════════════════

  // ─── STEP 1: DETAILS ───
  // ─── STEP 1: DETAILS ───
  const renderDetails = () => (
    <div className="flex flex-col gap-4 animate-fade-in">
      <p className="text-[10px] text-slate-500 font-medium -mt-1">
        Enter project details. Skip any unknown fields.
      </p>

      {/* Basic details */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Project Name *</label>
          <input className={inputClass} value={details.projectName} onChange={e => setDetails({...details, projectName: e.target.value})} />
        </div>
        <div>
          <label className={labelClass}>Client / Company</label>
          <input className={inputClass} value={details.clientCompany} onChange={e => setDetails({...details, clientCompany: e.target.value})} placeholder="Optional" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Property Address</label>
          <input className={inputClass} value={details.propertyAddress} onChange={e => setDetails({...details, propertyAddress: e.target.value})} placeholder="Street address" />
        </div>
        <div>
          <label className={labelClass}>City</label>
          <input className={inputClass} value={details.city} onChange={e => setDetails({...details, city: e.target.value})} placeholder="City" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>State</label>
          <input className={inputClass} value={details.state} onChange={e => setDetails({...details, state: e.target.value})} placeholder="FL" />
        </div>
        <div>
          <label className={labelClass}>ZIP</label>
          <input className={inputClass} value={details.zip} onChange={e => setDetails({...details, zip: e.target.value})} placeholder="33704" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>County</label>
          <input className={inputClass} value={details.county} onChange={e => setDetails({...details, county: e.target.value})} placeholder="Optional" />
        </div>
        <div>
          <label className={labelClass}>Project Type</label>
          <div className="relative">
            <select className={selectClass} value={details.projectType} onChange={e => setDetails({...details, projectType: e.target.value})}>
              <option>New Construction</option>
              <option>Renovation</option>
              <option>Addition</option>
              <option>Commercial</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Stories</label>
          <input className={inputClass} value={details.numStories} onChange={e => setDetails({...details, numStories: e.target.value})} placeholder="2" />
        </div>
        <div>
          <label className={labelClass}>Quality Level</label>
          <div className="relative">
            <select className={selectClass} value={details.qualityLevel} onChange={e => setDetails({...details, qualityLevel: e.target.value})}>
              <option>Standard</option>
              <option>Mid-Range</option>
              <option>High-End</option>
              <option>Ultra-Luxury</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Conditioned SF</label>
          <input className={inputClass} value={details.conditionedSF} onChange={e => setDetails({...details, conditionedSF: e.target.value})} placeholder="4100" />
        </div>
        <div>
          <label className={labelClass}>Under-Roof SF</label>
          <input className={inputClass} value={details.totalUnderRoofSF} onChange={e => setDetails({...details, totalUnderRoofSF: e.target.value})} placeholder="5220" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Start Date</label>
          <div className="relative">
            <input type="date" className={`${inputClass} [color-scheme:dark] pr-10`} value={details.targetStart} onChange={e => setDetails({...details, targetStart: e.target.value})} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Completion Date</label>
          <div className="relative">
            <input type="date" className={`${inputClass} [color-scheme:dark] pr-10`} value={details.targetCompletion} onChange={e => setDetails({...details, targetCompletion: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Construction Method</label>
          <input className={inputClass} value={details.constructionMethods} onChange={e => setDetails({...details, constructionMethods: e.target.value})} placeholder="Wood frame, slab on grade" />
        </div>
        <div>
          <label className={labelClass}>Material Brands</label>
          <input className={inputClass} value={details.preferredBrands} onChange={e => setDetails({...details, preferredBrands: e.target.value})} placeholder="Optional" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Preferred Suppliers</label>
          <input className={inputClass} value={details.preferredSuppliers} onChange={e => setDetails({...details, preferredSuppliers: e.target.value})} placeholder="Optional" />
        </div>
        <div>
          <label className={labelClass}>Special Conditions</label>
          <input className={inputClass} value={details.specialConditions} onChange={e => setDetails({...details, specialConditions: e.target.value})} placeholder="Optional" />
        </div>
      </div>

      <div>
        <label className={labelClass}>General Project Notes</label>
        <textarea 
          className="w-full h-20 bg-[#060B17] border border-[#172540] focus:border-[#2563EB] rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none transition-all font-medium resize-none"
          value={details.generalNotes}
          onChange={e => setDetails({...details, generalNotes: e.target.value})}
          placeholder="Enter notes..."
        />
      </div>

      {/* Footer Switch Toggles (iOS-style switch) */}
      <div className="flex items-center gap-6 mt-3 pt-3 border-t border-[#142036]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDetails({...details, occupiedProject: !details.occupiedProject})}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${details.occupiedProject ? 'bg-[#2563EB]' : 'bg-[#172540]'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow ${details.occupiedProject ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
          <span className="text-[11px] font-bold text-slate-300">Occupied project</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDetails({...details, unionLabor: !details.unionLabor})}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${details.unionLabor ? 'bg-[#2563EB]' : 'bg-[#172540]'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow ${details.unionLabor ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
          <span className="text-[11px] font-bold text-slate-300">Union labor</span>
        </div>
      </div>
    </div>
  );

  // ─── STEP 2: SPECS ───
  const renderSpecs = () => (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h3 className="text-sm font-bold text-white mb-0.5">Finish & Material Specifications</h3>
        <p className="text-[10px] text-slate-500 font-medium">
          Define surface materials to calculate accurate quantities and pricing.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Exterior Walls</label>
          <input className={inputClass} value={details.exteriorWalls} onChange={e => setDetails({...details, exteriorWalls: e.target.value})} placeholder="Stucco, Hardie, brick" />
        </div>
        <div>
          <label className={labelClass}>Exterior Trim</label>
          <input className={inputClass} value={details.exteriorTrim} onChange={e => setDetails({...details, exteriorTrim: e.target.value})} placeholder="PVC trim, painted wood" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Roofing</label>
          <input className={inputClass} value={details.roofing} onChange={e => setDetails({...details, roofing: e.target.value})} placeholder="Arch shingles, standing seam" />
        </div>
        <div>
          <label className={labelClass}>Windows</label>
          <input className={inputClass} value={details.windows} onChange={e => setDetails({...details, windows: e.target.value})} placeholder="Fiberglass, dual-pane" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Exterior Doors</label>
          <input className={inputClass} value={details.exteriorDoors} onChange={e => setDetails({...details, exteriorDoors: e.target.value})} placeholder="Fiberglass entry, French" />
        </div>
        <div>
          <label className={labelClass}>Interior Walls</label>
          <input className={inputClass} value={details.interiorWalls} onChange={e => setDetails({...details, interiorWalls: e.target.value})} placeholder="Smooth drywall Level 5" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Ceilings</label>
          <input className={inputClass} value={details.ceilings} onChange={e => setDetails({...details, ceilings: e.target.value})} placeholder="Smooth drywall, 9ft" />
        </div>
        <div>
          <label className={labelClass}>Paint Scope</label>
          <input className={inputClass} value={details.paintScope} onChange={e => setDetails({...details, paintScope: e.target.value})} placeholder="Int walls + trim; ext stucco" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Insulation</label>
          <input className={inputClass} value={details.insulation} onChange={e => setDetails({...details, insulation: e.target.value})} placeholder="R-21 batt, R-38 attic" />
        </div>
        <div>
          <label className={labelClass}>Flooring</label>
          <input className={inputClass} value={details.flooring} onChange={e => setDetails({...details, flooring: e.target.value})} placeholder="LVP main, tile baths" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Cabinets</label>
          <input className={inputClass} value={details.cabinets} onChange={e => setDetails({...details, cabinets: e.target.value})} placeholder="Custom maple, soft-close" />
        </div>
        <div>
          <label className={labelClass}>Countertops</label>
          <input className={inputClass} value={details.countertops} onChange={e => setDetails({...details, countertops: e.target.value})} placeholder="Quartz kitchen, granite baths" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Plumbing</label>
          <input className={inputClass} value={details.plumbingFixtures} onChange={e => setDetails({...details, plumbingFixtures: e.target.value})} placeholder="Kohler, Moen, designer" />
        </div>
        <div>
          <label className={labelClass}>Lighting</label>
          <input className={inputClass} value={details.lighting} onChange={e => setDetails({...details, lighting: e.target.value})} placeholder="Recessed LED, pendants" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Appliances</label>
          <input className={inputClass} value={details.appliances} onChange={e => setDetails({...details, appliances: e.target.value})} placeholder="Sub-Zero/Wolf, owner-supplied" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Additional Finish Notes</label>
        <textarea 
          className="w-full h-20 bg-[#060B17] border border-[#172540] focus:border-[#2563EB] rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none transition-all font-medium resize-none"
          value={details.additionalFinishNotes}
          onChange={e => setDetails({...details, additionalFinishNotes: e.target.value})}
          placeholder="Notes..."
        />
      </div>
    </div>
  );

  // ─── STEP 2: UPLOAD ───
  const renderUpload = () => (
    <div className="flex flex-col gap-4">
      {/* Drop Zone */}
      <div className="border-2 border-dashed border-[#1A2744] hover:border-blue-500/40 rounded-2xl p-6 text-center cursor-pointer transition-colors group">
        <Upload className="w-7 h-7 text-slate-500 group-hover:text-blue-400 mx-auto mb-2 transition-colors" />
        <p className="text-xs font-bold text-white">Upload plans & documents</p>
        <p className="text-[10px] text-slate-500 mt-1">PDF, JPG, PNG, DOCX, XLSX, CSV · ZIP auto-extracted · 50 MB per file</p>
      </div>

      {/* File List */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[11px] text-slate-400 font-medium mb-1">{uploadedFiles.length} file(s) · label any Latti can't identify</p>
        {uploadedFiles.map(file => (
          <div key={file.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#060B17] border border-[#142036]">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{file.name}</p>
                <p className="text-[10px] text-slate-500">{file.type} · {file.size} · Uploaded</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <select className="h-7 bg-[#0E1B30] border border-[#1A2744] rounded-lg px-2 pr-6 text-[10px] text-blue-400 font-bold outline-none appearance-none cursor-pointer">
                  <option>{file.classification}</option>
                  <option>Floor Plan</option>
                  <option>Electrical</option>
                  <option>Foundation</option>
                  <option>Mechanical</option>
                  <option>Plumbing</option>
                  <option>Structural</option>
                  <option>Site Plan</option>
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>
              <button className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Re-review banner */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#060B17] border border-[#142036]">
        <p className="text-[11px] text-slate-400">Want Latti to re-analyze after adding or removing sheets?</p>
        <button className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer whitespace-nowrap">
          Re-review Plans
        </button>
      </div>
    </div>
  );

  // ─── STEP 3: REVIEW ───
  const renderReview = () => (
    <div className="flex flex-col gap-4">
      {/* Scope Summary — High-End Executive Card */}
      <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036] flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-white">Scope Summary</h3>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
            AI Takeoff Verified
          </span>
        </div>

        {/* Lead Project Title & Meta */}
        <div className="pb-2 border-b border-[#142036]">
          <p className="text-xs font-bold text-white">2-Story High-End Residence & Detached ADU</p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            Comprehensive residential takeoff generated from uploaded architectural, structural, and MEP plan set.
          </p>
        </div>

        {/* Clean 4-Item Feature Grid (Lucide Icons, High-End Visuals) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-start gap-2 p-2 rounded-xl bg-[#0A1328]/70 border border-[#142036]">
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Structure</p>
              <p className="text-[11px] font-bold text-white leading-tight mt-0.5">5,220 Under Roof</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded-xl bg-[#0A1328]/70 border border-[#142036]">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Framing & Shell</p>
              <p className="text-[11px] font-bold text-white leading-tight mt-0.5">8" CMU & Wood</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded-xl bg-[#0A1328]/70 border border-[#142036]">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Roof & Insulation</p>
              <p className="text-[11px] font-bold text-white leading-tight mt-0.5">Metal & Spray Foam</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded-xl bg-[#0A1328]/70 border border-[#142036]">
            <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Finishes</p>
              <p className="text-[11px] font-bold text-white leading-tight mt-0.5">Level 5 Drywall</p>
            </div>
          </div>
        </div>

        {/* Clean Unified Scope Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {['2 Stories', 'Main House + ADU', 'Stem Wall Slab', 'High-End Finish'].map((tag, i) => (
            <span key={i} className="text-[10px] font-medium text-slate-300 bg-[#0A1328] border border-[#142036] px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Project Specs — Compact Unified Card */}
      <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {[
            { label: 'Project Type', value: 'New Construction' },
            { label: 'Stories', value: '2' },
            { label: 'Conditioned SF', value: '4,100 SF' },
            { label: 'Total SF', value: '5,220 SF' },
            { label: 'Roof Area', value: '6,003 SF' },
            { label: 'Garage SF', value: '0 SF' },
            { label: 'Patio/Porch SF', value: '0 SF' },
            { label: 'Ceiling Heights', value: "9'-0\", 9'-6\", 10'-0\"" },
          ].map((spec, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-[#142036]/60 text-[11px]">
              <span className="text-slate-400 font-medium text-[10px]">{spec.label}</span>
              <span className="text-white font-bold text-[11px] text-right truncate max-w-[110px]" title={spec.value}>
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Completeness — Smooth Modern UI */}
      <div className="p-4 rounded-2xl bg-[#060B17] border border-[#142036] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white">Plan Completeness</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Audit of sheet disciplines & schedules</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold">
            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              4 / 11 Complete
            </span>
          </div>
        </div>

        {/* Mini Status Breakdown Bar */}
        <div className="flex w-full h-1.5 rounded-full overflow-hidden bg-[#142036] gap-0.5">
          <div className="bg-emerald-400 transition-all duration-300" style={{ width: '36%' }} title="Complete (4)" />
          <div className="bg-amber-400 transition-all duration-300" style={{ width: '9%' }} title="Partially Complete (1)" />
          <div className="bg-rose-500 transition-all duration-300" style={{ width: '36%' }} title="Missing (4)" />
          <div className="bg-slate-700 transition-all duration-300" style={{ width: '19%' }} title="Not Applicable (2)" />
        </div>

        {/* List of Disciplines */}
        <div className="flex flex-col gap-1.5 pt-1">
          {planCompleteness.map((item, i) => {
            const isComplete = item.status === 'Complete';
            const isMissing = item.status === 'Missing';
            const isPartial = item.status === 'Partially Complete';

            return (
              <div 
                key={i} 
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0A1328]/70 border border-[#142036] hover:border-[#1E3050] transition-all"
              >
                <span className="text-[11px] text-slate-300 font-semibold">{item.name}</span>
                
                {isComplete && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Complete
                  </span>
                )}

                {isMissing && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" /> Missing
                  </span>
                )}

                {isPartial && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Partial
                  </span>
                )}

                {!isComplete && !isMissing && !isPartial && (
                  <span className="inline-flex items-center text-[10px] font-medium text-slate-500 bg-[#060B17] border border-[#142036] px-2.5 py-0.5 rounded-full">
                    Not Applicable
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Missing Information */}
      <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xs font-bold text-white">Missing Information</h3>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <ul className="flex flex-col gap-1 ml-3">
          {['Architectural Floor Plans', 'Exterior Elevations', 'Door and Window Schedules', 'Finish Schedule'].map((item, i) => (
            <li key={i} className="text-[11px] text-slate-400 list-disc">{item}</li>
          ))}
        </ul>
      </div>

      {/* Clarification Questions */}
      <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036]">
        <h3 className="text-xs font-bold text-white mb-3">Clarification Questions</h3>
        <div className="flex flex-col gap-3">
          {[
            { q: 'Architectural floor plans failed to load due to size limits (>10MB). Can a compressed version be provided?', assumption: 'Used the mandated residential allowance heuristic (0.30 LF of interior wall per SF of conditioned area) to estimate drywall and framing quantities.' },
            { q: 'Exterior elevations are missing. What are the exact building heights and cladding boundaries?', assumption: 'Assumed an average wall height of 20 feet for the 2-story structure.' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#0A1328] border border-[#1A2744]">
              <p className="text-[11px] font-bold text-white leading-relaxed">{i + 1}. {item.q}</p>
              <p className="text-[10px] text-slate-500 mt-1">Latti assumption: {item.assumption}</p>
              <div className="flex items-center gap-2 mt-2">
                <input className="flex-1 h-7 bg-[#060B17] border border-[#142036] rounded-lg px-2.5 text-[10px] text-white placeholder-slate-500 outline-none" placeholder="Your answer..." />
                <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 px-2 cursor-pointer whitespace-nowrap">Accept</button>
                <button className="text-[10px] font-bold text-slate-500 hover:text-slate-300 px-2 cursor-pointer">Skip</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── STEP 4: QUANTITIES ───
  const renderQuantities = () => {
    const trades = ['All trades', ...Array.from(new Set(quantities.map(q => q.trade)))];
    const confs = ['All conf.', 'High', 'Moderate', 'Low', 'Allowance'];

    const filteredQuantities = quantities.filter(q => {
      const matchSearch = q.name.toLowerCase().includes(qtySearch.toLowerCase()) ||
        q.trade.toLowerCase().includes(qtySearch.toLowerCase()) ||
        q.scope.toLowerCase().includes(qtySearch.toLowerCase());
      const matchTrade = qtyTradeFilter === 'All trades' || q.trade === qtyTradeFilter;
      const matchConf = qtyConfFilter === 'All conf.' || q.confidence === qtyConfFilter;
      return matchSearch && matchTrade && matchConf;
    });

    const kpis = [
      { label: 'Line Items', value: quantities.length.toString() },
      { label: 'Approved', value: quantities.filter(q => q.approved).length.toString() },
      { label: 'Trades', value: new Set(quantities.map(q => q.trade)).size.toString() },
      { label: 'Low/Allow.', value: quantities.filter(q => q.confidence === 'Low' || q.confidence === 'Allowance').length.toString() },
    ];

    return (
      <div className="flex flex-col gap-3">
        {/* KPI Bar */}
        <div className="grid grid-cols-4 gap-2">
          {kpis.map((kpi, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-[#060B17] border border-[#142036]">
              <p className="text-[10px] text-slate-500 font-medium">{kpi.label}</p>
              <p className="text-sm font-black text-white mt-0.5">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input 
              value={qtySearch}
              onChange={e => setQtySearch(e.target.value)}
              className="w-full h-8 bg-[#060B17] border border-[#142036] rounded-xl pl-8 pr-3 text-[11px] text-white placeholder-slate-500 outline-none" 
              placeholder="Search items..." 
            />
          </div>
          <div className="relative flex-shrink-0">
            <select
              value={qtyTradeFilter}
              onChange={e => setQtyTradeFilter(e.target.value)}
              className="h-8 pl-2.5 pr-6 bg-[#060B17] border border-[#142036] rounded-xl text-[10px] font-bold text-slate-300 outline-none appearance-none cursor-pointer"
            >
              {trades.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
          </div>
          <div className="relative flex-shrink-0">
            <select
              value={qtyConfFilter}
              onChange={e => setQtyConfFilter(e.target.value)}
              className="h-8 pl-2.5 pr-6 bg-[#060B17] border border-[#142036] rounded-xl text-[10px] font-bold text-slate-300 outline-none appearance-none cursor-pointer"
            >
              {confs.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
          </div>
          <button 
            onClick={handleAddMockQuantity}
            className="h-8 px-3 bg-[#060B17] border border-[#142036] rounded-xl text-[10px] font-bold text-slate-400 flex items-center gap-1.5 cursor-pointer hover:border-blue-500/30 transition-colors flex-shrink-0"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>

        {/* Quantities Table in horizontal scrollable wrapper */}
        <div className="w-full overflow-x-auto rounded-2xl border border-[#142036] bg-[#060B17]/60">
          <div className="min-w-[690px]">
            {/* Table Header matching web screenshot (Compact) */}
            <div className="grid grid-cols-[190px_52px_48px_52px_95px_65px_110px_78px] items-center px-3.5 py-2.5 border-b border-[#142036] text-[10px] font-semibold text-slate-500">
              <div>Trade / Scope</div>
              <div className="text-center">Qty</div>
              <div className="text-center">Unit</div>
              <div className="text-center">Waste%</div>
              <div className="text-left pl-1.5">Ref / Loc</div>
              <div className="text-center">Conf.</div>
              <div className="text-left pl-1.5">Notes</div>
              <div className="text-center">Approve</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#142036]/60">
              {filteredQuantities.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-semibold">No items match your search.</div>
              ) : (
                filteredQuantities.map(item => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[190px_52px_48px_52px_95px_65px_110px_78px] items-center px-3.5 py-2.5 hover:bg-[#0A1328]/40 transition-colors"
                  >
                    {/* Trade / Scope (1-line title, max 2-line description) */}
                    <div className="pr-2 min-w-0">
                      <p className="text-xs font-bold text-white truncate" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                        <span className="text-slate-300 font-medium">{item.trade} · {item.scope}</span>
                        {item.info ? ` — ${item.info}` : ''}
                      </p>
                    </div>

                    {/* Qty Input */}
                    <div className="flex justify-center">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={e => handleUpdateQuantityField(item.id, 'qty', parseFloat(e.target.value) || 0)}
                        className="w-12 h-7 bg-[#0E1B30] border border-[#1A2744] focus:border-blue-500 rounded-lg px-1 text-xs font-bold text-white text-center outline-none tabular-nums"
                      />
                    </div>

                    {/* Unit Input */}
                    <div className="flex justify-center">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={e => handleUpdateQuantityField(item.id, 'unit', e.target.value)}
                        className="w-11 h-7 bg-[#0E1B30] border border-[#1A2744] focus:border-blue-500 rounded-lg px-1 text-[11px] font-bold text-slate-200 text-center outline-none"
                      />
                    </div>

                    {/* Waste% Input */}
                    <div className="flex justify-center">
                      <input
                        type="number"
                        value={item.waste}
                        onChange={e => handleUpdateQuantityField(item.id, 'waste', parseFloat(e.target.value) || 0)}
                        className="w-12 h-7 bg-[#0E1B30] border border-[#1A2744] focus:border-blue-500 rounded-lg px-1 text-xs font-bold text-white text-center outline-none tabular-nums"
                      />
                    </div>

                    {/* Ref / Loc */}
                    <div className="pl-1.5 pr-1.5 min-w-0">
                      <p className="text-[10px] text-slate-300 font-medium truncate leading-tight">{item.refLoc.split('·')[0] || item.refLoc}</p>
                      <p className="text-[9px] text-slate-500 truncate">{item.refLoc.split('·')[1] || ''}</p>
                    </div>

                    {/* Confidence */}
                    <div className="flex justify-center">
                      <span className={`text-[10px] font-bold ${
                        item.confidence === 'High' ? 'text-emerald-400' :
                        item.confidence === 'Moderate' ? 'text-blue-400' :
                        item.confidence === 'Allowance' ? 'text-purple-400' :
                        'text-rose-400'
                      }`}>
                        {item.confidence}
                      </span>
                    </div>

                    {/* Notes Input */}
                    <div className="pl-1.5 pr-1.5">
                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={e => handleUpdateQuantityField(item.id, 'notes', e.target.value)}
                        placeholder="note"
                        className="w-full h-7 bg-[#0E1B30] border border-[#1A2744] focus:border-blue-500/50 rounded-lg px-2 text-[10px] text-slate-200 placeholder-slate-600 outline-none"
                      />
                    </div>

                    {/* Approve Toggle & Delete */}
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => handleToggleQuantity(item.id)} 
                        className="cursor-pointer"
                        title={item.approved ? 'Approved' : 'Click to approve'}
                      >
                        {item.approved
                          ? <ToggleRight className="w-5 h-5 text-emerald-400" />
                          : <ToggleLeft className="w-5 h-5 text-slate-600 hover:text-slate-500" />
                        }
                      </button>
                      <button 
                        onClick={() => handleDeleteQuantity(item.id)} 
                        className="text-slate-600 hover:text-rose-400 p-0.5 cursor-pointer transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── STEP 5: MATERIALS ───
  const renderMaterials = () => {
    const filtered = materialItems.filter(m =>
      m.name.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.scope.toLowerCase().includes(materialSearch.toLowerCase())
    );
    const calcTotal = (key: 'expUnit' | 'lowUnit' | 'highUnit') =>
      materialItems.reduce((acc, m) => acc + (m[key] * (parseFloat(m.qty) || 1)), 0);
    const fmt = (n: number) => `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    const approvedCount = materialItems.filter(m => m.approved).length;

    return (
      <div className="flex flex-col gap-4">
        {/* KPI Row (4 top cards from screenshot) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036]">
            <p className="text-[11px] text-slate-500 font-medium">Line items</p>
            <p className="text-xl font-black text-white mt-1">{materialItems.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036]">
            <p className="text-[11px] text-slate-500 font-medium">Approved</p>
            <p className="text-xl font-black text-white mt-1">{approvedCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036]">
            <p className="text-[11px] text-slate-500 font-medium">Expected total</p>
            <p className="text-xl font-black text-emerald-400 mt-1">{fmt(calcTotal('expUnit'))}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036]">
            <p className="text-[11px] text-slate-500 font-medium">Range</p>
            <p className="text-base font-black text-emerald-400 mt-1">
              {fmt(calcTotal('lowUnit'))} – {fmt(calcTotal('highUnit'))}
            </p>
          </div>
        </div>

        {/* Search Bar & Re-price Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={materialSearch}
              onChange={e => setMaterialSearch(e.target.value)}
              className="w-full h-10 bg-[#060B17] border border-[#142036] rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Search materials..."
            />
          </div>
          <button className="h-10 px-4 bg-[#060B17] border border-[#142036] hover:border-blue-500/30 rounded-xl text-xs font-semibold text-slate-300 transition-colors cursor-pointer flex-shrink-0">
            Re-price
          </button>
        </div>

        {/* Table in horizontal scrollable wrapper */}
        <div className="w-full overflow-x-auto rounded-2xl border border-[#142036] bg-[#060B17]/60">
          <div className="min-w-[820px]">
            {/* Table Header */}
            <div className="grid grid-cols-[240px_80px_80px_90px_80px_95px_1fr_65px] items-center px-4 py-3 border-b border-[#142036] text-[11px] font-semibold text-slate-500">
              <div>Material / Scope</div>
              <div className="text-right">Qty</div>
              <div className="text-right">Low unit</div>
              <div className="text-center">Exp unit</div>
              <div className="text-right">High unit</div>
              <div className="text-right">Exp total</div>
              <div className="pl-4">Source</div>
              <div className="text-center">Approve</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#142036]/60">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-medium">No materials match your search.</div>
              ) : (
                filtered.map(item => {
                  const qtyNum = parseFloat(item.qty) || 1;
                  const rowTotal = item.expUnit * qtyNum;
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[240px_80px_80px_90px_80px_95px_1fr_65px] items-center px-4 py-3.5 hover:bg-[#0A1328]/40 transition-colors"
                    >
                      {/* Name & Scope */}
                      <div className="pr-3">
                        <p className="text-xs font-bold text-white leading-tight">{item.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.scope}</p>
                      </div>

                      {/* Qty */}
                      <div className="text-right text-xs text-slate-400 tabular-nums">
                        {item.qty}
                      </div>

                      {/* Low Unit */}
                      <div className="text-right text-xs text-slate-400 tabular-nums">
                        ${item.lowUnit.toLocaleString()}
                      </div>

                      {/* Exp Unit Input */}
                      <div className="flex justify-center">
                        <input
                          type="number"
                          value={item.expUnit}
                          onChange={e =>
                            setMaterialItems(prev =>
                              prev.map(m =>
                                m.id === item.id ? { ...m, expUnit: parseFloat(e.target.value) || 0 } : m
                              )
                            )
                          }
                          className="w-18 h-8 bg-[#060B17] border border-[#1A2E50] focus:border-blue-500 rounded-lg px-2 text-xs font-semibold text-white text-center outline-none tabular-nums"
                        />
                      </div>

                      {/* High Unit */}
                      <div className="text-right text-xs text-slate-400 tabular-nums">
                        ${item.highUnit.toLocaleString()}
                      </div>

                      {/* Exp Total */}
                      <div className="text-right text-xs font-bold text-emerald-400 tabular-nums">
                        {fmt(rowTotal)}
                      </div>

                      {/* Source */}
                      <div className="pl-4 pr-2">
                        {item.source.split('\n').map((line, idx) => (
                          <p key={idx} className={`text-[10px] truncate ${idx === 0 ? 'text-slate-400 font-medium' : 'text-slate-500'}`}>
                            {line}
                          </p>
                        ))}
                      </div>

                      {/* Approve Toggle */}
                      <div className="flex justify-center">
                        <button
                          onClick={() =>
                            setMaterialItems(prev =>
                              prev.map(m => (m.id === item.id ? { ...m, approved: !m.approved } : m))
                            )
                          }
                          className="cursor-pointer"
                        >
                          {item.approved ? (
                            <ToggleRight className="w-5 h-5 text-blue-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-600 hover:text-slate-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Quality Level Selector at Bottom */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#060B17] border border-[#142036]">
          <div>
            <p className="text-xs font-bold text-white">Quality level</p>
            <p className="text-[10px] text-slate-500">Benchmark unit rates according to finish standard</p>
          </div>
          <div className="relative">
            <select
              value={materialQuality}
              onChange={e => setMaterialQuality(e.target.value)}
              className="h-8.5 pl-3 pr-8 bg-[#0A1328] border border-[#1A2E50] rounded-xl text-xs font-medium text-white outline-none appearance-none cursor-pointer"
            >
              <option>standard</option>
              <option>mid-range</option>
              <option>high-end</option>
              <option>ultra-luxury</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    );
  };

  // ─── STEP 6: LABOR ───
  const renderLabor = () => {
    const filteredLabor = laborItems.filter(l =>
      l.name.toLowerCase().includes(laborSearch.toLowerCase()) ||
      l.trade.toLowerCase().includes(laborSearch.toLowerCase())
    );

    const totalLaborVal = laborItems.reduce((acc, curr) => {
      // expTotal is e.g. "$8,500"
      const val = parseFloat(curr.expTotal.replace(/[^0-9.-]+/g, '')) || 0;
      return acc + val;
    }, 0);

    const lowRange = Math.round(totalLaborVal * 0.75);
    const highRange = Math.round(totalLaborVal * 1.35);

    const formatKVal = (num: number) => {
      return `$${Math.round(num / 1000)}k`;
    };

    const kpis = [
      { label: 'Line Items', value: laborItems.length.toString() },
      { label: 'Approved', value: laborItems.filter(l => l.approved).length.toString() },
      { label: 'Expected total', value: `$${totalLaborVal.toLocaleString()}`, highlight: true },
      { label: 'Range', value: `${formatKVal(lowRange)}-${formatKVal(highRange)}`, highlight: true },
    ];

    return (
      <div className="flex flex-col gap-3">
        {/* Info Banner */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Labor pricing represents estimated <span className="font-bold text-white">direct subcontractor labor only</span>. General contractor overhead, profit, materials, permits, insurance, professional fees, and financing are not included.
          </p>
        </div>

        {/* Complexity Factors */}
        <div className="p-3 rounded-xl bg-[#060B17] border border-[#142036]">
          <h4 className="text-[11px] font-bold text-white mb-2">Project complexity factors</h4>
          <div className="flex flex-wrap gap-1.5">
            {complexityFactors.map((factor, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-[#0A1328] border border-[#1A2744] text-[10px] text-slate-300 font-medium">
                {factor}
              </span>
            ))}
          </div>
        </div>

        {/* KPI Bar */}
        <div className="grid grid-cols-4 gap-2">
          {kpis.map((kpi, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-[#060B17] border border-[#142036]">
              <p className="text-[10px] text-slate-500 font-medium">{kpi.label}</p>
              <p className={`text-sm font-black mt-0.5 ${kpi.highlight ? 'text-emerald-400' : 'text-white'}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input 
              value={laborSearch}
              onChange={e => setLaborSearch(e.target.value)}
              className="w-full h-8 bg-[#060B17] border border-[#142036] rounded-xl pl-8 pr-3 text-[11px] text-white placeholder-slate-500 outline-none" 
              placeholder="Search labor scope..." 
            />
          </div>
          <button 
            onClick={handleAddMockLabor}
            className="h-8 px-3 bg-[#060B17] border border-[#142036] rounded-xl text-[10px] font-bold text-slate-400 flex items-center gap-1.5 cursor-pointer hover:border-blue-500/30 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>

        {/* Labor Items */}
        <div className="flex flex-col gap-1.5">
          {filteredLabor.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-semibold">No items match your search.</div>
          ) : (
            filteredLabor.map(item => (
              <div key={item.id} className="p-3 rounded-xl bg-[#060B17] border border-[#142036]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-white">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{item.trade} · {item.confidence}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] font-bold text-emerald-400 mr-1">{item.expTotal}</span>
                    <button onClick={() => handleToggleLabor(item.id)} className="cursor-pointer">
                      {item.approved
                        ? <ToggleRight className="w-5 h-5 text-blue-400" />
                        : <ToggleLeft className="w-5 h-5 text-slate-500" />
                      }
                    </button>
                    <button onClick={() => handleDeleteLabor(item.id)} className="text-slate-500 hover:text-red-400 p-1 cursor-pointer transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-[#142036] text-[10px]">
                  <span className="text-slate-400 font-medium">Qty: {item.qty}</span>
                  <span className="text-slate-500">Low {item.lowUnit}</span>
                  <span className="text-white font-bold">Exp ${item.expUnit}/unit</span>
                  <span className="text-slate-500">High {item.highUnit}</span>
                </div>
                <div className="mt-1.5 text-[10px] text-slate-500 leading-relaxed flex flex-wrap gap-x-2 gap-y-0.5">
                  {item.includes.map((inc, i) => <span key={i} className="text-emerald-500">&#10003; {inc}</span>)}
                  {item.excludes.map((exc, i) => <span key={i} className="text-rose-500">&#10007; {exc}</span>)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // ─── STEP 7: REPORT ───
  const renderReport = () => (
    <div className="flex flex-col gap-4">
      {/* Big Pricing Tiles */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-[#060B17] border border-[#142036]">
          <p className="text-[10px] text-slate-500 font-medium">Material Pricing</p>
          <p className="text-base font-black text-emerald-400 mt-1">$418,261</p>
          <p className="text-[10px] text-slate-500 mt-0.5">$313,656 - $585,164</p>
          <p className="text-[10px] text-slate-400 font-bold">$102 / SF</p>
        </div>
        <div className="p-3 rounded-xl bg-[#060B17] border border-[#142036]">
          <p className="text-[10px] text-slate-500 font-medium">Labor Pricing</p>
          <p className="text-base font-black text-emerald-400 mt-1">$486,103</p>
          <p className="text-[10px] text-slate-500 mt-0.5">$351,706 - $664,219</p>
          <p className="text-[10px] text-slate-400 font-bold">$119 / SF</p>
        </div>
        <div className="p-3 rounded-xl bg-[#060B17] border border-[#142036]">
          <p className="text-[10px] text-slate-500 font-medium">Combined Direct</p>
          <p className="text-base font-black text-emerald-400 mt-1">$904,364</p>
          <p className="text-[10px] text-slate-500 mt-0.5">$665K - $1.25M</p>
          <p className="text-[10px] text-slate-400 font-bold">Materials + labor</p>
        </div>
      </div>

      {/* Accuracy Standard Badge */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#060B17] border border-[#142036]">
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-[10px] font-bold text-emerald-400 whitespace-nowrap">Accuracy-First Standard</span>
        <p className="text-[10px] text-slate-400">Accuracy, transparency & traceability take priority over speed.</p>
      </div>

      {/* Accuracy Scorecard */}
      <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036]">
        <h3 className="text-xs font-bold text-white mb-3">Accuracy Scorecard</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Plan quality score', value: '40/100' },
            { label: 'Scale-verified sheets', value: '0 / 6' },
            { label: 'Directly measured', value: '26%' },
            { label: 'Schedule-derived', value: '0%' },
            { label: 'Assumption-based', value: '100%' },
            { label: 'Allowance-based', value: '33%' },
            { label: 'Unresolved conflicts', value: '0' },
            { label: 'Low-confidence qty', value: '14' },
            { label: 'Independently audited', value: 'Pending' },
            { label: 'Human review', value: '0%' },
          ].map((item, i) => (
            <div key={i} className="p-2 rounded-lg bg-[#0A1328] border border-[#1A2744]">
              <p className="text-[9px] text-slate-500 font-medium">{item.label}</p>
              <p className="text-[11px] font-bold text-white mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Estimate Release Warning */}
      <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <h3 className="text-xs font-bold text-white">Estimate Release Warning</h3>
        </div>
        <ul className="flex flex-col gap-1 ml-4">
          {[
            'Unreviewed / unapproved quantities',
            '14 low-confidence or allowance quantities',
            '9 factor-based allowance quantities',
            'Scale not verified'
          ].map((w, i) => (
            <li key={i} className="text-[11px] text-slate-400 list-disc">{w}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => alert('Generating BuildScope AI Report (PDF)...')}
          className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
        >
          <Download className="w-4 h-4" /> Generate PDF
        </button>
        <button
          onClick={() => alert('Sending to Lattice Budget...')}
          className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
        >
          <Send className="w-4 h-4" /> Send to Budget
        </button>
      </div>
    </div>
  );

  // ─── STEP CONTENT MAP ───
  const stepRenderers = [renderDetails, renderSpecs, renderUpload, renderReview, renderQuantities, renderMaterials, renderLabor, renderReport];

  // ═══════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════
  return (
    <div className="w-full flex flex-col gap-3 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">

      {/* ─── TOP HEADER ─── */}
      <div className="flex items-center justify-between -mx-1">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="text-center min-w-0 flex-1 mx-3">
          <h1 className="text-sm font-extrabold text-white truncate">{analysis.projectName}</h1>
          <p className="text-[10px] text-slate-500 truncate">{analysis.address}</p>
        </div>
        <button 
          onClick={() => showToast("Takeoff details saved successfully!")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#060B17] border border-[#142036] text-[11px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" /> Save
        </button>
      </div>

      {/* ─── MODERN CLUTTER-FREE STEPPER (SEAMLESS) ─── */}
      <div className="flex flex-col gap-2 pt-1 pb-1">
        {/* 8-Segment Minimalist Progress Track */}
        <div className="grid grid-cols-8 gap-1.5 w-full">
          {STEPS.map((step, i) => {
            const isCompleted = i < currentStep;
            const isActive = i === currentStep;
            return (
              <button
                key={step}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-blue-500 shadow-sm shadow-blue-500/50'
                    : isCompleted
                      ? 'bg-emerald-400'
                      : 'bg-[#142036] hover:bg-slate-700'
                }`}
                title={`Step ${i + 1}: ${step}`}
              />
            );
          })}
        </div>

        {/* Minimalist Step Title & Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <h2 className="text-xs font-bold text-white tracking-tight">
              {STEPS[currentStep]}
            </h2>
          </div>

          {/* Quick Step Navigation Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
              disabled={currentStep === 0}
              className={`p-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                currentStep === 0
                  ? 'border-transparent text-slate-700 cursor-not-allowed'
                  : 'border-[#142036] text-slate-400 hover:text-white hover:border-slate-600 bg-[#060B17]'
              }`}
              title="Previous Step"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentStep(s => Math.min(STEPS.length - 1, s + 1))}
              disabled={currentStep === STEPS.length - 1}
              className={`p-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                currentStep === STEPS.length - 1
                  ? 'border-transparent text-slate-700 cursor-not-allowed'
                  : 'border-[#142036] text-slate-400 hover:text-white hover:border-slate-600 bg-[#060B17]'
              }`}
              title="Next Step"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── STEP CONTENT ─── */}
      <div className="min-h-[300px]">
        {stepRenderers[currentStep]()}
      </div>

      {/* ─── BOTTOM NAV ─── */}
      <div className="flex items-center justify-between pt-2">
        {currentStep > 0 ? (
          <button
            onClick={() => setCurrentStep(s => s - 1)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        ) : <div />}

        {currentStep < STEPS.length - 1 ? (
          <button
            onClick={() => setCurrentStep(s => s + 1)}
            className="px-5 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
          >
            <span>
              {currentStep === 0 ? 'Continue to Specs' :
               currentStep === 1 ? 'Save & Upload Plans' :
               currentStep === 2 ? 'Continue to Review' :
               currentStep === 3 ? 'Continue to Quantities' :
               currentStep === 4 ? 'Continue to Materials' :
               currentStep === 5 ? 'Continue to Labor' :
               currentStep === 6 ? 'Continue to Report' :
               `Continue to ${STEPS[currentStep + 1]}`}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#091122]/95 border border-[#2563EB]/40 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold text-white animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
