import React, { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Save, Upload, FileText, CheckCircle2, AlertTriangle,
  Search, Plus, Trash2, ChevronDown, ToggleLeft, ToggleRight,
  Download, Send, Info, Building2, Layers, ShieldCheck, Sparkles, X, ChevronRight, Check,
  DollarSign, TrendingUp
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
  const [qtyTradeFilter, setQtyTradeFilter] = useState('All Trades');
  const [qtyConfFilter, setQtyConfFilter] = useState('All Conf.');
  const [laborSearch, setLaborSearch] = useState('');
  const [selectedQtyItem, setSelectedQtyItem] = useState<QuantityItem | null>(null);
  const [selectedMaterialItem, setSelectedMaterialItem] = useState<MaterialItem | null>(null);
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

  // ─── STEP 4: Quantities State (Rich Realistic Takeoff) ───
  const [quantities, setQuantities] = useState<QuantityItem[]>([
    { id: 'q1', name: 'Continuous Wall Footings 24"x12"', trade: 'Concrete', scope: 'Foundations', info: 'Architectural plans missing; perimeter estimated from foundation layout.', qty: 600, unit: 'CF', waste: 5, refLoc: 'S1 · Main House & ADU Perimeter', confidence: 'Moderate', approved: true },
    { id: 'q2', name: 'Column Footings 36"x36"', trade: 'Concrete', scope: 'Foundations', info: 'Counted 12 interior point bearing footings shown on foundation plan.', qty: 45, unit: 'CF', waste: 5, refLoc: 'S1 · Main House interior and porches', confidence: 'High', approved: true },
    { id: 'q3', name: '4" Concrete Slab on Grade 3500 PSI', trade: 'Concrete', scope: 'Slab on Grade', info: 'Ground floor footprint estimated at 2500 SF derived from total 5220 SF under roof over 2 stories.', qty: 833, unit: 'CF', waste: 5, refLoc: 'S1 · Main House & ADU Level 1', confidence: 'High', approved: true },
    { id: 'q4', name: 'Post-Tension Slab Cable Tendons', trade: 'Concrete', scope: 'Reinforcement', info: 'Engineered post-tension unbonded tendon layout with live-end anchorages.', qty: 1450, unit: 'LF', waste: 5, refLoc: 'S2 · Structural Foundation Details', confidence: 'Moderate', approved: false },
    { id: 'q5', name: '8" CMU Exterior Masonry Walls', trade: 'Masonry', scope: 'Block', info: 'Assumes first floor is full CMU construction per typical Florida details and S3 wall section.', qty: 3000, unit: 'SF', waste: 10, refLoc: 'S1, S3 · Exterior Walls Level 1', confidence: 'Moderate', approved: true },
    { id: 'q6', name: 'Exterior 2x6 Wood Stud Framing', trade: 'Framing', scope: 'Exterior Walls', info: '2x6 exterior wood framing spaced 16" O.C. with double top plates and continuous tie-downs.', qty: 4200, unit: 'SF', waste: 10, refLoc: 'S3 · Upper Level Exterior Framing', confidence: 'High', approved: false },
    { id: 'q7', name: 'Interior 2x4 Wood Wall Framing', trade: 'Framing', scope: 'Interior Partitions', info: 'Interior partition framing based on 0.30 LF per SF conditioned area with acoustic blocking.', qty: 1230, unit: 'LF', waste: 10, refLoc: 'A2 · Whole House Partition Plan', confidence: 'Allowance', approved: false },
    { id: 'q8', name: 'Prefab Engineered Roof Trusses', trade: 'Framing', scope: 'Roof Structure', info: 'Engineered scissor & common attic trusses engineered for 150 mph hurricane wind rating.', qty: 5800, unit: 'SF', waste: 8, refLoc: 'S4 · Roof Framing Plan', confidence: 'High', approved: true },
    { id: 'q9', name: 'Standing Seam Metal Roofing (24ga)', trade: 'Roofing', scope: 'Metal Roofing', info: 'Applied a 1.15 slope/overhang factor to the provided 5220 SF total under-roof area.', qty: 6003, unit: 'SF', waste: 10, refLoc: 'S4 · Main House and ADU Roof', confidence: 'High', approved: true },
    { id: 'q10', name: '3-Coat Stucco System (Synthetic Finish)', trade: 'Stucco', scope: 'Cladding', info: 'Elevations missing. Assumed 20ft average wall height across 2 stories.', qty: 7990, unit: 'SF', waste: 5, refLoc: 'A3 · Exterior Building Elevation', confidence: 'Allowance', approved: false },
    { id: 'q11', name: 'Closed-Cell Spray Foam Insulation (R-38)', trade: 'Insulation', scope: 'Thermal Envelope', info: 'Foam covers all exterior envelope walls and conditioned roof deck underside.', qty: 13900, unit: 'SF', waste: 5, refLoc: 'M1 · Building Envelope Thermal Specs', confidence: 'Moderate', approved: true },
    { id: 'q12', name: '5/8" Type-X Firecode Drywall (Level 5)', trade: 'Drywall', scope: 'Interior Surfaces', info: 'Smooth Level 5 finish across all ceilings and living areas with sound-dampening resilient channel.', qty: 18500, unit: 'SF', waste: 8, refLoc: 'A4 · Interior Finish Schedule', confidence: 'Moderate', approved: false },
    { id: 'q13', name: 'Luxury Vinyl Plank (LVP) Flooring', trade: 'Finishes', scope: 'Flooring', info: 'Waterproof rigid-core LVP for main living, kitchen, hallway and bedrooms.', qty: 3200, unit: 'SF', waste: 10, refLoc: 'A4 · Floor Finish Legend', confidence: 'High', approved: true },
    { id: 'q14', name: 'Porcelain Bathroom Floor & Wall Tile', trade: 'Finishes', scope: 'Tile', info: 'Large format 24x48 rectified porcelain tile for master suite and guest baths.', qty: 900, unit: 'SF', waste: 12, refLoc: 'A5 · Wet Area Interior Elevations', confidence: 'Moderate', approved: false },
    { id: 'q15', name: 'Milgard Dual-Pane Low-E Windows', trade: 'Openings', scope: 'Windows', info: 'Impact-rated aluminum-clad wood windows with solar-control argon fill.', qty: 28, unit: 'EA', waste: 0, refLoc: 'A6 · Window Schedule', confidence: 'High', approved: true },
    { id: 'q16', name: '200A Electrical Service & Rough-In', trade: 'Electrical', scope: 'Power & Lighting', info: '200A dual breaker distribution panels, EV charger prep, and 120 recessed LED pots.', qty: 1, unit: 'LS', waste: 0, refLoc: 'E1 · Electrical One-Line & Lighting', confidence: 'High', approved: true },
    { id: 'q17', name: 'PEX-A Plumbing Rough-In & Fixtures', trade: 'Plumbing', scope: 'Supply & Waste', info: 'Uponor PEX-A potable manifold, tankless gas water heater, and 4 full bath groups.', qty: 1, unit: 'LS', waste: 0, refLoc: 'P1 · Plumbing Sanitary & Supply', confidence: 'High', approved: true },
    { id: 'q18', name: '4-Ton High-Efficiency Heat Pump HVAC', trade: 'Mechanical', scope: 'HVAC', info: 'Variable-capacity multi-zone heat pump system with smart communicating thermostats.', qty: 2, unit: 'EA', waste: 0, refLoc: 'M1 · Mechanical Equipment Schedule', confidence: 'Moderate', approved: true },
  ]);

  // ─── STEP 5: Materials State ───
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialQuality, setMaterialQuality] = useState('Standard');
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([
    { id: 'm1', name: 'Dumpster Rental (30-Yard, 10-day)', scope: 'General Conditions', confidence: 'High', qty: '2 ea', lowUnit: 450, expUnit: 600, highUnit: 850, source: 'Metro Market · Site Waste Services', approved: true },
    { id: 'm2', name: '2×6 SPF Premium Studs (8ft & 10ft)', scope: 'Framing & Lumber', confidence: 'High', qty: '450 ea', lowUnit: 6, expUnit: 7.25, highUnit: 9.5, source: 'Builders FirstSource · Regional Stock', approved: true },
    { id: 'm3', name: '2×4 KD Framing Lumber (16ft)', scope: 'Framing & Lumber', confidence: 'High', qty: '280 ea', lowUnit: 7, expUnit: 8.5, highUnit: 11, source: '84 Lumber · Local Yard', approved: false },
    { id: 'm4', name: '3/4" CDX Plywood Subfloor Tongue & Groove', scope: 'Framing & Sheathing', confidence: 'High', qty: '95 sheet', lowUnit: 32, expUnit: 39.5, highUnit: 52, source: 'Builders FirstSource · Direct Mill', approved: true },
    { id: 'm5', name: 'Standing Seam Metal Roof Panels (24ga Kynar)', scope: 'Roofing Materials', confidence: 'High', qty: '6000 sq ft', lowUnit: 4.2, expUnit: 5.85, highUnit: 8.5, source: 'ABC Supply Co. · Architectural Metals', approved: true },
    { id: 'm6', name: 'High-Temp Ice & Water Underlayment', scope: 'Roofing Materials', confidence: 'High', qty: '32 roll', lowUnit: 85, expUnit: 110, highUnit: 145, source: 'Beacon Roofing Supply', approved: true },
    { id: 'm7', name: '5/8" Type-X Firecode Gypsum Board (4×12)', scope: 'Drywall & Wallboard', confidence: 'High', qty: '380 sheet', lowUnit: 16, expUnit: 21.5, highUnit: 28, source: 'USG Distribution · Building Supply', approved: false },
    { id: 'm8', name: 'Sherwin-Williams SuperPaint Interior (5-Gal)', scope: 'Paint & Finishes', confidence: 'Moderate', qty: '18 pails', lowUnit: 160, expUnit: 210, highUnit: 275, source: 'Sherwin-Williams Commercial Store #4102', approved: true },
    { id: 'm9', name: 'Waterproof Rigid-Core LVP Flooring (20mil)', scope: 'Flooring Finishes', confidence: 'High', qty: '3200 sq ft', lowUnit: 3.25, expUnit: 4.65, highUnit: 6.8, source: 'Shaw Contract · Commercial Flooring', approved: true },
    { id: 'm10', name: '24×48 Rectified Porcelain Tile', scope: 'Tile & Wet Areas', confidence: 'Moderate', qty: '900 sq ft', lowUnit: 4.5, expUnit: 6.75, highUnit: 11.5, source: 'Daltile Ceramic Wholesale Center', approved: false },
    { id: 'm11', name: 'Closed-Cell Spray Foam Kit (600 BF)', scope: 'Insulation', confidence: 'Moderate', qty: '24 kit', lowUnit: 750, expUnit: 890, highUnit: 1150, source: 'IDP Insulation Supply', approved: true },
    { id: 'm12', name: '200A Main Service Panel & AFCI Breakers', scope: 'Electrical Materials', confidence: 'High', qty: '2 pkg', lowUnit: 1200, expUnit: 1650, highUnit: 2200, source: 'City Electric Supply Co.', approved: true },
    { id: 'm13', name: 'Uponor PEX-A Potable Pipe & Brass Manifold', scope: 'Plumbing Materials', confidence: 'High', qty: '1 lot', lowUnit: 2800, expUnit: 3450, highUnit: 4600, source: 'Ferguson Enterprises Plumbing Hub', approved: true },
  ]);

  // ─── STEP 6: Labor State ───
  const [laborItems, setLaborItems] = useState<LaborItem[]>([
    {
      id: 'l1',
      name: 'Concrete Slab and Footings',
      trade: 'Concrete',
      confidence: 'High',
      qty: '66 CY',
      lowUnit: '$115',
      expUnit: 145,
      highUnit: '$185',
      expTotal: '$9,570',
      includes: ['Labor for digging footings, setting forms, rebar placement, vapor barrier, pouring, and hand-trowel finish.'],
      excludes: ['Concrete material, pump rental, rebar material, mesh, termite treatment.'],
      approved: false
    },
    {
      id: 'l2',
      name: 'Standing Seam Roofing',
      trade: 'Roofing',
      confidence: 'High',
      qty: '4500 SF',
      lowUnit: '$4',
      expUnit: 4.5,
      highUnit: '$6',
      expTotal: '$20,250',
      includes: ['Labor for underlayment install, metal panel clipping, seaming, flashing, and ridge vent labor.'],
      excludes: ['Metal panels, clips, underlayment, fasteners, scaffolding, tear-off of existing roof.'],
      approved: false
    },
    {
      id: 'l3',
      name: 'Level 5 Drywall and Tray Ceilings',
      trade: 'Drywall',
      confidence: 'High',
      qty: '27200 SF',
      lowUnit: '$2',
      expUnit: 2.45,
      highUnit: '$3',
      expTotal: '$66,640',
      includes: ['Labor for hanging 5/8 inch boards, taping, sanding, and full-surface skim coat for Level 5 finish; tray ceiling framing labor.'],
      excludes: ['Drywall boards, joint compound, tape, corner beads, LED lighting hardware.'],
      approved: false
    },
    {
      id: 'l4',
      name: '3-Coat Stucco System & Sand Float Finish',
      trade: 'Stucco',
      confidence: 'High',
      qty: '7990 SF',
      lowUnit: '$4',
      expUnit: 5.25,
      highUnit: '$7.50',
      expTotal: '$41,948',
      includes: ['Labor for lath attachment, scratch coat, brown coat, and decorative sand float finish texture.'],
      excludes: ['Stucco mix, metal lath, scaffolding rental, waterproof barrier.'],
      approved: true
    },
    {
      id: 'l5',
      name: 'Rough Carpentry Framing (Walls, Floors & Trusses)',
      trade: 'Framing',
      confidence: 'High',
      qty: '5220 SF',
      lowUnit: '$8',
      expUnit: 10.50,
      highUnit: '$14.50',
      expTotal: '$54,810',
      includes: ['Wall layout, stud assembly, structural header install, crane truss erection, roof sheathing.'],
      excludes: ['Framing hardware, fasteners, crane rental fees.'],
      approved: true
    },
    {
      id: 'l6',
      name: 'Electrical Rough-in & Distribution Wiring',
      trade: 'Electrical',
      confidence: 'High',
      qty: '1 LS',
      lowUnit: '$14,000',
      expUnit: 18500,
      highUnit: '$24,000',
      expTotal: '$18,500',
      includes: ['Labor for conduit rough-in, Romex wiring pull, main distribution panel hookup, and switch box rough-ins.'],
      excludes: ['Lighting fixtures, switchgear, Romex wire materials, electrical permit fees.'],
      approved: true
    },
    {
      id: 'l7',
      name: 'Plumbing DWV & Potable Water Rough-in',
      trade: 'Plumbing',
      confidence: 'High',
      qty: '1 LS',
      lowUnit: '$12,500',
      expUnit: 16200,
      highUnit: '$21,000',
      expTotal: '$16,200',
      includes: ['Drain-waste-vent piping, PEX manifold install, test air pressure.'],
      excludes: ['Plumbing fixtures, water heater unit, municipal tap fees.'],
      approved: true
    }
  ]);

  // ─── ACTION HANDLERS ───
  const handleToggleQuantity = (id: string) => {
    setQuantities(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, approved: !item.approved };
        setSelectedQtyItem(curr => (curr && curr.id === id ? updated : curr));
        return updated;
      }
      return item;
    }));
  };

  const handleDeleteQuantity = (id: string) => {
    setQuantities(prev => prev.filter(item => item.id !== id));
    setSelectedQtyItem(curr => (curr && curr.id === id ? null : curr));
  };

  const handleUpdateQuantityField = (id: string, field: keyof QuantityItem, value: any) => {
    setQuantities(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        setSelectedQtyItem(curr => (curr && curr.id === id ? updated : curr));
        return updated;
      }
      return item;
    }));
  };

  const handleToggleLabor = (id: string) => {
    setLaborItems(prev => prev.map(item => item.id === id ? { ...item, approved: !item.approved } : item));
  };

  const handleDeleteLabor = (id: string) => {
    setLaborItems(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleMaterial = (id: string) => {
    setMaterialItems(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, approved: !m.approved };
        setSelectedMaterialItem(curr => (curr && curr.id === id ? updated : curr));
        return updated;
      }
      return m;
    }));
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterialItems(prev => prev.filter(m => m.id !== id));
    setSelectedMaterialItem(curr => (curr && curr.id === id ? null : curr));
  };

  const handleUpdateMaterialField = (id: string, field: keyof MaterialItem, value: any) => {
    setMaterialItems(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: value };
        setSelectedMaterialItem(curr => (curr && curr.id === id ? updated : curr));
        return updated;
      }
      return m;
    }));
  };

  const handleOpenAddMaterial = () => {
    const newItem: MaterialItem = {
      id: `m-${Date.now()}`,
      name: '',
      scope: 'General Materials',
      confidence: 'High',
      qty: '100 ea',
      lowUnit: 10,
      expUnit: 15,
      highUnit: 25,
      source: 'Builders FirstSource · Regional Supplier Catalog',
      approved: false
    };
    setMaterialItems(prev => [newItem, ...prev]);
    setSelectedMaterialItem(newItem);
  };

  const handleOpenAddQuantity = () => {
    const newItem: QuantityItem = {
      id: `q-${Date.now()}`,
      name: '',
      trade: 'Framing',
      scope: 'General',
      info: 'Manually added estimator takeoff item.',
      qty: 100,
      unit: 'LF',
      waste: 10,
      refLoc: 'A1 · Architectural Detail',
      confidence: 'Moderate',
      approved: false,
      notes: ''
    };
    setQuantities(prev => [newItem, ...prev]);
    setSelectedQtyItem(newItem);
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
    const trades = ['All Trades', ...Array.from(new Set(quantities.map(q => q.trade)))];
    const confs = ['All Conf.', 'High', 'Moderate', 'Low', 'Allowance'];

    const filteredQuantities = quantities.filter(q => {
      const qSearch = qtySearch.trim().toLowerCase();
      const matchSearch = !qSearch ||
        q.name.toLowerCase().includes(qSearch) ||
        q.trade.toLowerCase().includes(qSearch) ||
        q.scope.toLowerCase().includes(qSearch) ||
        q.refLoc.toLowerCase().includes(qSearch);
      const matchTrade = qtyTradeFilter.toLowerCase() === 'all trades' || q.trade.toLowerCase() === qtyTradeFilter.toLowerCase();
      const matchConf = qtyConfFilter.toLowerCase() === 'all conf.' || q.confidence.toLowerCase() === qtyConfFilter.toLowerCase();
      return matchSearch && matchTrade && matchConf;
    });

    const kpis = [
      { label: 'Line Items', value: quantities.length.toString() },
      { label: 'Approved', value: `${quantities.filter(q => q.approved).length} / ${quantities.length}` },
      { label: 'Trades', value: new Set(quantities.map(q => q.trade)).size.toString() },
      { label: 'Low / Allow.', value: quantities.filter(q => q.confidence === 'Low' || q.confidence === 'Allowance').length.toString() },
    ];

    return (
      <div className="flex flex-col gap-3 animate-fade-in">
        {/* KPI Bar (Consistent Height & Clean Typography) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {kpis.map((kpi, i) => (
            <div key={i} className="p-3 rounded-2xl bg-[#060B17] border border-[#142036] flex flex-col justify-between h-[72px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">{kpi.label}</p>
              <p className="text-sm sm:text-base font-black text-white mt-1 tabular-nums truncate">{kpi.value}</p>
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
            onClick={handleOpenAddQuantity}
            className="h-8 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20 transition-all flex-shrink-0"
          >
            <Plus className="w-3 h-3" /> Add Scope
          </button>
        </div>

        {/* Quantities Table in sleek compact wrapper */}
        <div className="w-full overflow-x-auto rounded-2xl border border-[#142036] bg-[#060B17]/60">
          <div className="min-w-[535px]">
            {/* Table Header */}
            <div className="grid grid-cols-[175px_52px_44px_48px_85px_62px_45px_24px] items-center px-3.5 py-2 border-b border-[#142036] text-[10px] font-semibold text-slate-500">
              <div>Trade / Scope</div>
              <div className="text-center">Qty</div>
              <div className="text-center">Unit</div>
              <div className="text-center">Waste</div>
              <div className="text-left pl-1">Ref / Loc</div>
              <div className="text-center">Conf.</div>
              <div className="text-center">Approve</div>
              <div></div>
            </div>

            {/* Table Rows (High-Density & Clean) */}
            <div className="divide-y divide-[#142036]/60">
              {filteredQuantities.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-semibold">No items match your search.</div>
              ) : (
                filteredQuantities.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedQtyItem(item)}
                    className="grid grid-cols-[175px_52px_44px_48px_85px_62px_45px_24px] items-center px-3.5 py-1.5 hover:bg-[#0A1328] active:bg-[#0E1A36] transition-colors cursor-pointer group"
                  >
                    {/* Trade / Scope (1-line title, clean subline with tight spacing) */}
                    <div className="pr-2 min-w-0">
                      <p className="text-xs font-bold text-white truncate leading-none group-hover:text-blue-400 transition-colors" title={item.name || 'Untitled Scope Item'}>
                        {item.name || <span className="text-slate-500 italic">Untitled Scope Item</span>}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium truncate leading-none mt-1">
                        {item.trade} · {item.scope}
                      </p>
                    </div>

                    {/* Qty Input */}
                    <div className="flex justify-center" onClick={e => e.stopPropagation()}>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={e => handleUpdateQuantityField(item.id, 'qty', parseFloat(e.target.value) || 0)}
                        className="w-11 h-6 bg-[#0E1B30] border border-[#1A2744] focus:border-blue-500 rounded-lg px-1 text-xs font-bold text-white text-center outline-none tabular-nums"
                      />
                    </div>

                    {/* Unit Input */}
                    <div className="flex justify-center" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={e => handleUpdateQuantityField(item.id, 'unit', e.target.value)}
                        className="w-9 h-6 bg-[#0E1B30] border border-[#1A2744] focus:border-blue-500 rounded-lg px-0.5 text-[10px] font-bold text-slate-200 text-center outline-none"
                      />
                    </div>

                    {/* Waste% Input */}
                    <div className="flex justify-center" onClick={e => e.stopPropagation()}>
                      <input
                        type="number"
                        value={item.waste}
                        onChange={e => handleUpdateQuantityField(item.id, 'waste', parseFloat(e.target.value) || 0)}
                        className="w-10 h-6 bg-[#0E1B30] border border-[#1A2744] focus:border-blue-500 rounded-lg px-0.5 text-xs font-bold text-white text-center outline-none tabular-nums"
                      />
                    </div>

                    {/* Ref / Loc */}
                    <div className="pl-1 pr-1 min-w-0">
                      <p className="text-[10px] text-slate-300 font-medium truncate">{item.refLoc.split('·')[0] || item.refLoc}</p>
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

                    {/* Approve Status */}
                    <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
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
                    </div>

                    {/* Open Details Chevron */}
                    <div className="flex items-center justify-center">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ─── TAKEOFF ITEM DETAIL & ACTION DRAWER (MODAL) ─── */}
        {selectedQtyItem && (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
            onClick={() => setSelectedQtyItem(null)}
          >
            <div 
              className="w-full max-w-[440px] bg-[#070C18] border border-[#142036] rounded-t-3xl sm:rounded-3xl p-5 flex flex-col gap-4 max-h-[88vh] overflow-y-auto shadow-2xl shadow-blue-950/40 text-slate-100 animate-in slide-in-from-bottom duration-200"
              onClick={e => e.stopPropagation()}
            >
              {/* Mobile Grab Handle */}
              <div className="w-10 h-1 rounded-full bg-slate-700 mx-auto -mt-1 sm:hidden" />

              {/* Modal Header with Editable Name & Badges */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      selectedQtyItem.confidence === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      selectedQtyItem.confidence === 'Moderate' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      selectedQtyItem.confidence === 'Allowance' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {selectedQtyItem.confidence} Confidence
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-[#0A1328] border border-[#1A2744] px-2 py-0.5 rounded-md">
                      Ref: {selectedQtyItem.refLoc.split('·')[0] || 'Takeoff'}
                    </span>
                  </div>

                  {/* Editable Name Field */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Scope Item Title</label>
                    <input
                      type="text"
                      value={selectedQtyItem.name}
                      onChange={e => handleUpdateQuantityField(selectedQtyItem.id, 'name', e.target.value)}
                      placeholder="e.g. Continuous Wall Footings 24x12"
                      className="w-full text-sm font-bold text-white bg-[#0A1328] border border-[#1A2744] focus:border-blue-500 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  {/* Editable Trade & Scope */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-semibold text-slate-500 uppercase">Trade</label>
                      <input
                        type="text"
                        value={selectedQtyItem.trade}
                        onChange={e => handleUpdateQuantityField(selectedQtyItem.id, 'trade', e.target.value)}
                        placeholder="Trade (e.g. Concrete)"
                        className="w-full text-xs font-semibold text-slate-200 bg-[#0A1328] border border-[#1A2744] focus:border-blue-500 rounded-lg px-2.5 py-1.5 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-semibold text-slate-500 uppercase">Scope Category</label>
                      <input
                        type="text"
                        value={selectedQtyItem.scope}
                        onChange={e => handleUpdateQuantityField(selectedQtyItem.id, 'scope', e.target.value)}
                        placeholder="Scope (e.g. Foundations)"
                        className="w-full text-xs font-semibold text-slate-200 bg-[#0A1328] border border-[#1A2744] focus:border-blue-500 rounded-lg px-2.5 py-1.5 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedQtyItem(null)}
                  className="w-8 h-8 rounded-full bg-[#0A1328] border border-[#1A2744] flex items-center justify-center text-slate-400 hover:text-white cursor-pointer flex-shrink-0 transition-colors mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* AI Reasoning & Heuristics Box */}
              <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/25 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <h4 className="text-[11px] font-bold text-blue-300">AI Takeoff Insight & Heuristics</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedQtyItem.info || "Derived directly from structural and foundation plan schedules with standard building code tolerances."}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-500">Plan Reference:</span>
                  <span className="text-slate-300 font-medium">{selectedQtyItem.refLoc}</span>
                </div>
              </div>

              {/* Editable Specs Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#0A1328] border border-[#1A2744] flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-400">Base Qty</label>
                  <input
                    type="number"
                    value={selectedQtyItem.qty}
                    onChange={e => handleUpdateQuantityField(selectedQtyItem.id, 'qty', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0E1B30] border border-[#1A2744] focus:border-blue-500 rounded-lg px-2 py-1 text-sm font-black text-white outline-none tabular-nums"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-[#0A1328] border border-[#1A2744] flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-400">Unit</label>
                  <input
                    type="text"
                    value={selectedQtyItem.unit}
                    onChange={e => handleUpdateQuantityField(selectedQtyItem.id, 'unit', e.target.value)}
                    className="w-full bg-[#0E1B30] border border-[#1A2744] focus:border-blue-500 rounded-lg px-2 py-1 text-sm font-black text-white outline-none"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-[#0A1328] border border-[#1A2744] flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-400">Waste %</label>
                  <input
                    type="number"
                    value={selectedQtyItem.waste}
                    onChange={e => handleUpdateQuantityField(selectedQtyItem.id, 'waste', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0E1B30] border border-[#1A2744] focus:border-blue-500 rounded-lg px-2 py-1 text-sm font-black text-white outline-none tabular-nums"
                  />
                </div>
              </div>

              {/* Net Required Calculation KPI */}
              <div className="p-2.5 rounded-xl bg-[#0A1328] border border-[#1A2744] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Total Order Qty (incl. {selectedQtyItem.waste}% waste):</span>
                <span className="font-extrabold text-emerald-400 tabular-nums">
                  {Math.round(selectedQtyItem.qty * (1 + (selectedQtyItem.waste || 0) / 100)).toLocaleString()} {selectedQtyItem.unit}
                </span>
              </div>

              {/* Reference & Location Field */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400">Plan Ref / Sheet Location</label>
                <input
                  type="text"
                  value={selectedQtyItem.refLoc}
                  onChange={e => handleUpdateQuantityField(selectedQtyItem.id, 'refLoc', e.target.value)}
                  className="w-full h-9 bg-[#0A1328] border border-[#1A2744] focus:border-blue-500 rounded-xl px-3 text-xs text-white outline-none font-medium"
                  placeholder="e.g. S1 · Main House Foundation"
                />
              </div>

              {/* Estimator Notes Section */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400">Estimator Notes & Comments</label>
                <textarea
                  value={selectedQtyItem.notes || ''}
                  onChange={e => handleUpdateQuantityField(selectedQtyItem.id, 'notes', e.target.value)}
                  rows={3}
                  placeholder="Add sub-trade requirements, field conditions, or audit remarks..."
                  className="w-full bg-[#0A1328] border border-[#1A2744] focus:border-blue-500 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Action Footer */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#142036]">
                {/* Delete Button */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this scope item?')) {
                      handleDeleteQuantity(selectedQtyItem.id);
                    }
                  }}
                  className="h-10 px-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  title="Delete scope item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Approve / Reject Toggle Button */}
                <button
                  onClick={() => {
                    handleToggleQuantity(selectedQtyItem.id);
                  }}
                  className={`flex-1 h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg ${
                    selectedQtyItem.approved
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-[#0E1B30] hover:bg-[#152744] border border-[#1A2744] text-slate-200'
                  }`}
                >
                  {selectedQtyItem.approved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Approved (Click to Unapprove)</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Approve Scope & Quantity</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── STEP 5: MATERIALS ───
  const renderMaterials = () => {
    const mSearch = materialSearch.trim().toLowerCase();
    const filtered = materialItems.filter(m =>
      !mSearch ||
      m.name.toLowerCase().includes(mSearch) ||
      m.scope.toLowerCase().includes(mSearch) ||
      m.source.toLowerCase().includes(mSearch)
    );
    const calcTotal = (key: 'expUnit' | 'lowUnit' | 'highUnit') =>
      materialItems.reduce((acc, m) => acc + (m[key] * (parseFloat(m.qty) || 1)), 0);
    const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;
    const approvedCount = materialItems.filter(m => m.approved).length;

    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        {/* KPI Row (2x2 Grid - Guaranteed 180px+ per card, zero overflow, clean visual hierarchy) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. Line Items */}
          <div className="p-3 rounded-2xl bg-[#060B17] border border-[#142036] flex items-center justify-between shadow-sm min-h-[62px]">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Line Items</p>
              <p className="text-lg font-black text-white tabular-nums mt-0.5">{materialItems.length} <span className="text-xs font-normal text-slate-400">items</span></p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          {/* 2. Approved */}
          <div className="p-3 rounded-2xl bg-[#060B17] border border-[#142036] flex items-center justify-between shadow-sm min-h-[62px]">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved</p>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              </div>
              <p className="text-lg font-black text-white tabular-nums mt-0.5">
                {approvedCount} <span className="text-xs font-semibold text-slate-500">/ {materialItems.length}</span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* 3. Expected Total */}
          <div className="p-3 rounded-2xl bg-[#060B17] border border-[#142036] flex items-center justify-between shadow-sm min-h-[62px]">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expected Total</p>
              <p className="text-lg font-black text-emerald-400 tabular-nums mt-0.5 truncate">
                {fmt(calcTotal('expUnit'))}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          {/* 4. Price Range */}
          <div className="p-3 rounded-2xl bg-[#060B17] border border-[#142036] flex items-center justify-between shadow-sm min-h-[62px]">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price Range</p>
              <p className="text-sm sm:text-base font-black text-emerald-400 tabular-nums mt-0.5 truncate">
                ${Math.round(calcTotal('lowUnit') / 1000)}k – ${Math.round(calcTotal('highUnit') / 1000)}k
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Search Bar, Re-price, and Add Material */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={materialSearch}
              onChange={e => setMaterialSearch(e.target.value)}
              className="w-full h-8 bg-[#060B17] border border-[#142036] rounded-xl pl-8 pr-3 text-[11px] text-white placeholder-slate-500 outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Search materials..."
            />
          </div>
          <button 
            onClick={() => showToast("Market prices refreshed from local supplier indexes!")}
            className="h-8 px-2.5 bg-[#060B17] border border-[#142036] hover:border-blue-500/30 rounded-xl text-[10px] font-bold text-slate-400 transition-colors cursor-pointer flex-shrink-0"
          >
            Re-price
          </button>
          <button 
            onClick={handleOpenAddMaterial}
            className="h-8 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20 transition-all flex-shrink-0"
          >
            <Plus className="w-3 h-3" /> Add Material
          </button>
        </div>

        {/* Materials Table in sleek spacious wrapper (Generous row spacing, zero truncation, clean inputs) */}
        <div className="w-full overflow-x-auto rounded-2xl border border-[#142036] bg-[#060B17] shadow-sm">
          <div className="min-w-[560px]">
            {/* Table Header */}
            <div className="grid grid-cols-[200px_60px_84px_80px_50px_30px] items-center px-4 py-3 border-b border-[#142036] text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-[#070D1A]">
              <div>Material / Scope</div>
              <div className="text-center">Qty</div>
              <div className="text-center">Exp Unit</div>
              <div className="text-right pr-2">Total</div>
              <div className="text-center">Approve</div>
              <div></div>
            </div>

            {/* Table Rows (Spacious, Clean Spacing, Zero Clipping) */}
            <div className="divide-y divide-[#142036]/60">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-semibold">No materials match your search.</div>
              ) : (
                filtered.map(item => {
                  const qtyNum = parseFloat(item.qty) || 1;
                  const rowTotal = item.expUnit * qtyNum;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMaterialItem(item)}
                      className="grid grid-cols-[200px_60px_84px_80px_50px_30px] items-center px-4 py-3.5 hover:bg-white/[0.02] active:bg-[#0E1A36] transition-colors cursor-pointer group"
                    >
                      {/* Name & Scope (Clean line-clamp-2, generous width) */}
                      <div className="pr-3 min-w-0">
                        <p className="text-xs font-bold text-white leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors" title={item.name || 'Untitled Material'}>
                          {item.name || <span className="text-slate-500 italic">Untitled Material</span>}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium truncate mt-1">
                          {item.scope}
                        </p>
                      </div>

                      {/* Qty */}
                      <div className="text-center text-xs text-slate-300 font-semibold tabular-nums">
                        {item.qty}
                      </div>

                      {/* Exp Unit Input (Spacious fitting input with full decimal visibility) */}
                      <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center bg-[#0A1328] border border-[#1A2E50] focus-within:border-blue-500 rounded-xl px-2 py-1 w-[68px] shadow-inner transition-colors">
                          <span className="text-[10px] font-bold text-slate-400 mr-0.5">$</span>
                          <input
                            type="number"
                            step="any"
                            value={item.expUnit}
                            onChange={e => handleUpdateMaterialField(item.id, 'expUnit', parseFloat(e.target.value) || 0)}
                            className="w-full text-xs font-bold text-white text-right bg-transparent outline-none tabular-nums"
                          />
                        </div>
                      </div>

                      {/* Exp Total */}
                      <div className="text-right pr-2 text-xs font-black text-emerald-400 tabular-nums whitespace-nowrap">
                        {fmt(rowTotal)}
                      </div>

                      {/* Approve Toggle */}
                      <div className="flex justify-center" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleMaterial(item.id)}
                          className="cursor-pointer transition-all active:scale-90"
                          title={item.approved ? 'Approved' : 'Click to approve'}
                        >
                          {item.approved ? (
                            <ToggleRight className="w-6 h-6 text-blue-500 hover:text-blue-400" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-slate-600 hover:text-slate-500" />
                          )}
                        </button>
                      </div>

                      {/* Details Chevron */}
                      <div className="flex justify-center">
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Quality Level Selector at Bottom */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#060B17] border border-[#142036]">
          <div>
            <p className="text-xs font-bold text-white">Quality Level</p>
            <p className="text-[10px] text-slate-400 font-medium">Benchmark unit rates according to finish standard</p>
          </div>
          <div className="relative">
            <select
              value={materialQuality}
              onChange={e => setMaterialQuality(e.target.value)}
              className="h-8 pl-3 pr-7 bg-[#0A1328] border border-[#1A2E50] rounded-xl text-xs font-medium text-white outline-none appearance-none cursor-pointer"
            >
              <option value="Standard">Standard</option>
              <option value="Mid-Range">Mid-Range</option>
              <option value="High-End">High-End</option>
              <option value="Ultra-Luxury">Ultra-Luxury</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* ─── MATERIAL ITEM DETAIL & ACTION DRAWER (MODAL) ─── */}
        {selectedMaterialItem && (
          <div 
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
            onClick={() => setSelectedMaterialItem(null)}
          >
            <div 
              className="w-full max-w-[440px] bg-[#070C18] border border-[#142036] rounded-t-3xl sm:rounded-3xl p-5 flex flex-col gap-4 max-h-[88vh] overflow-y-auto shadow-2xl shadow-blue-950/40 text-slate-100 animate-in slide-in-from-bottom duration-200"
              onClick={e => e.stopPropagation()}
            >
              {/* Mobile Grab Handle */}
              <div className="w-10 h-1 rounded-full bg-slate-700 mx-auto -mt-1 sm:hidden" />

              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {selectedMaterialItem.scope}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      {selectedMaterialItem.confidence} Confidence
                    </span>
                  </div>

                  {/* Editable Material Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400">Material Title</label>
                    <input
                      type="text"
                      value={selectedMaterialItem.name}
                      onChange={e => handleUpdateMaterialField(selectedMaterialItem.id, 'name', e.target.value)}
                      placeholder="e.g. Ready-Mix Concrete 3000 PSI"
                      className="w-full text-sm font-bold text-white bg-[#0A1328] border border-[#1A2744] focus:border-blue-500 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>

                  {/* Editable Scope & Qty */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-semibold text-slate-500 uppercase">Scope Category</label>
                      <input
                        type="text"
                        value={selectedMaterialItem.scope}
                        onChange={e => handleUpdateMaterialField(selectedMaterialItem.id, 'scope', e.target.value)}
                        placeholder="Scope (e.g. Foundations)"
                        className="w-full text-xs font-semibold text-slate-200 bg-[#0A1328] border border-[#1A2744] focus:border-blue-500 rounded-lg px-2.5 py-1.5 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-semibold text-slate-500 uppercase">Quantity (with Unit)</label>
                      <input
                        type="text"
                        value={selectedMaterialItem.qty}
                        onChange={e => handleUpdateMaterialField(selectedMaterialItem.id, 'qty', e.target.value)}
                        className="w-full text-xs font-semibold text-slate-200 bg-[#0A1328] border border-[#1A2744] focus:border-blue-500 rounded-lg px-2.5 py-1.5 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMaterialItem(null)}
                  className="w-8 h-8 rounded-full bg-[#0A1328] border border-[#1A2744] flex items-center justify-center text-slate-400 hover:text-white cursor-pointer flex-shrink-0 transition-colors mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price Benchmarks Grid */}
              <div className="p-3.5 rounded-2xl bg-[#0A1328] border border-[#1A2744] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-white">Unit Price Benchmarks</h4>
                  <span className="text-[10px] text-slate-400">Current Market Index</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-[#060B17] border border-[#142036]">
                    <p className="text-[9px] text-slate-500 font-medium">Low Unit</p>
                    <p className="text-xs font-bold text-slate-300 mt-0.5">${selectedMaterialItem.lowUnit}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0E1B30] border border-blue-500/30">
                    <p className="text-[9px] text-blue-400 font-medium">Expected Unit</p>
                    <input
                      type="number"
                      value={selectedMaterialItem.expUnit}
                      onChange={e => handleUpdateMaterialField(selectedMaterialItem.id, 'expUnit', parseFloat(e.target.value) || 0)}
                      className="w-full text-xs font-black text-white text-center bg-transparent outline-none mt-0.5 tabular-nums"
                    />
                  </div>
                  <div className="p-2 rounded-xl bg-[#060B17] border border-[#142036]">
                    <p className="text-[9px] text-slate-500 font-medium">High Unit</p>
                    <p className="text-xs font-bold text-slate-300 mt-0.5">${selectedMaterialItem.highUnit}</p>
                  </div>
                </div>

                {/* Computed Total */}
                <div className="flex items-center justify-between pt-1 border-t border-[#142036]/80 text-xs">
                  <span className="text-slate-400 font-medium">Expected Extended Total:</span>
                  <span className="text-sm font-black text-emerald-400 tabular-nums">
                    {fmt(selectedMaterialItem.expUnit * (parseFloat(selectedMaterialItem.qty) || 1))}
                  </span>
                </div>
              </div>

              {/* Sourcing & Supplier Card */}
              <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/25 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <h4 className="text-[11px] font-bold text-blue-300">Supplier Sourcing Index</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {selectedMaterialItem.source}
                </p>
              </div>

              {/* Action Footer */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#142036]">
                {/* Delete Button */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this material item?')) {
                      handleDeleteMaterial(selectedMaterialItem.id);
                    }
                  }}
                  className="h-10 px-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  title="Delete material"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Approve / Unapprove Button */}
                <button
                  onClick={() => handleToggleMaterial(selectedMaterialItem.id)}
                  className={`flex-1 h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg ${
                    selectedMaterialItem.approved
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-[#0E1B30] hover:bg-[#152744] border border-[#1A2744] text-slate-200'
                  }`}
                >
                  {selectedMaterialItem.approved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Approved (Click to Unapprove)</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Approve Material Price</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── STEP 6: LABOR ───
  const renderLabor = () => {
    const lSearch = laborSearch.trim().toLowerCase();
    const filteredLabor = laborItems.filter(l =>
      !lSearch ||
      l.name.toLowerCase().includes(lSearch) ||
      l.trade.toLowerCase().includes(lSearch) ||
      l.includes.some(inc => inc.toLowerCase().includes(lSearch)) ||
      l.excludes.some(exc => exc.toLowerCase().includes(lSearch))
    );

    const totalLaborVal = laborItems.reduce((acc, curr) => {
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
      { label: 'Approved', value: `${laborItems.filter(l => l.approved).length} / ${laborItems.length}` },
      { label: 'Expected Total', value: `$${totalLaborVal.toLocaleString()}`, highlight: true },
      { label: 'Price Range', value: `${formatKVal(lowRange)} – ${formatKVal(highRange)}`, highlight: true, fullRange: `$${lowRange.toLocaleString()} – $${highRange.toLocaleString()}` },
    ];

    const handleUpdateLaborExpUnit = (id: string, val: number) => {
      setLaborItems(prev => prev.map(item => {
        if (item.id === id) {
          const qtyNum = parseFloat(item.qty.replace(/[^0-9.-]+/g, '')) || 1;
          const totalNum = Math.round(val * qtyNum);
          return {
            ...item,
            expUnit: val,
            expTotal: `$${totalNum.toLocaleString()}`
          };
        }
        return item;
      }));
    };

    return (
      <div className="flex flex-col gap-3 animate-fade-in font-sans">
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              value={laborSearch}
              onChange={e => setLaborSearch(e.target.value)}
              className="w-full h-10 bg-[#060B17] border border-[#142036] focus:border-blue-500 rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none transition-colors" 
              placeholder="Search labor items..." 
            />
          </div>
          <button 
            onClick={handleAddMockLabor}
            className="h-10 px-4 bg-[#060B17] border border-[#142036] hover:border-blue-500/40 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        {/* Top 4 KPI Metrics (2x2 Grid - Guaranteed 180px+ per card, zero overflow, clean hierarchy) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. Line Items */}
          <div className="p-3 rounded-2xl bg-[#060B17] border border-[#142036] flex items-center justify-between shadow-sm min-h-[62px]">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Line Items</p>
              <p className="text-lg font-black text-white tabular-nums mt-0.5">{laborItems.length} <span className="text-xs font-normal text-slate-400">trades</span></p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          {/* 2. Approved */}
          <div className="p-3 rounded-2xl bg-[#060B17] border border-[#142036] flex items-center justify-between shadow-sm min-h-[62px]">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved</p>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              </div>
              <p className="text-lg font-black text-white tabular-nums mt-0.5">
                {laborItems.filter(l => l.approved).length} <span className="text-xs font-semibold text-slate-500">/ {laborItems.length}</span>
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* 3. Expected Total */}
          <div className="p-3 rounded-2xl bg-[#060B17] border border-[#142036] flex items-center justify-between shadow-sm min-h-[62px]">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expected Total</p>
              <p className="text-lg font-black text-emerald-400 tabular-nums mt-0.5 truncate">
                ${totalLaborVal.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          {/* 4. Price Range */}
          <div className="p-3 rounded-2xl bg-[#060B17] border border-[#142036] flex items-center justify-between shadow-sm min-h-[62px]">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price Range</p>
              <p className="text-sm sm:text-base font-black text-emerald-400 tabular-nums mt-0.5 truncate">
                {formatKVal(lowRange)} – {formatKVal(highRange)}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* ─── SPREADSHEET TABLE (Exact Reference Screenshot Layout) ─── */}
        <div className="w-full overflow-x-auto scrollbar-none rounded-2xl bg-[#060B17] border border-[#142036] shadow-sm">
          <div className="min-w-[850px]">
            {/* Table Header */}
            <div className="grid grid-cols-[135px_60px_60px_74px_75px_75px_minmax(280px,1fr)_60px] items-center px-4 py-3 border-b border-[#142036] text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-[#070D1A]">
              <div>Trade / Scope</div>
              <div>Qty</div>
              <div>Low unit</div>
              <div className="text-center pr-1">Exp unit</div>
              <div className="pl-3.5">High unit</div>
              <div className="text-right pr-2">Exp total</div>
              <div className="pl-3">Includes / Excludes</div>
              <div className="text-center">Approve</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#142036]/60">
              {filteredLabor.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                  No labor items match your search.
                </div>
              ) : (
                filteredLabor.map((item) => (
                  <div 
                    key={item.id} 
                    className="grid grid-cols-[135px_60px_60px_74px_75px_75px_minmax(280px,1fr)_60px] items-start px-4 py-3.5 hover:bg-white/[0.02] transition-colors text-xs"
                  >
                    {/* 1. Trade / Scope */}
                    <div className="pr-2 min-w-0">
                      <h4 className="font-bold text-white leading-tight line-clamp-2">{item.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5 truncate">
                        {item.trade} · {item.confidence}
                      </span>
                    </div>

                    {/* 2. Qty */}
                    <div className="text-xs text-slate-300 font-medium whitespace-nowrap pt-1">
                      {item.qty}
                    </div>

                    {/* 3. Low unit */}
                    <div className="text-xs text-slate-400 font-medium whitespace-nowrap pt-1">
                      {item.lowUnit}
                    </div>

                    {/* 4. Exp unit Input Box */}
                    <div className="flex justify-center pr-1 pt-0.5">
                      <input
                        type="number"
                        step="any"
                        value={item.expUnit}
                        onChange={e => handleUpdateLaborExpUnit(item.id, parseFloat(e.target.value) || 0)}
                        className="w-[56px] h-8 bg-[#0A1328] border border-[#1A2E50] focus:border-blue-500 rounded-xl text-xs font-bold text-white text-center outline-none tabular-nums transition-colors shadow-inner"
                      />
                    </div>

                    {/* 5. High unit */}
                    <div className="text-xs text-slate-400 font-medium whitespace-nowrap pl-3.5 pt-1">
                      {item.highUnit}
                    </div>

                    {/* 6. Exp total */}
                    <div className="text-right pr-2 text-xs font-black text-white tabular-nums whitespace-nowrap pt-1">
                      {item.expTotal}
                    </div>

                    {/* 7. Includes / Excludes */}
                    <div className="pl-3 pr-2 text-[10px] leading-relaxed flex flex-col gap-1 text-slate-400">
                      {item.includes.length > 0 && (
                        <div className="flex items-start gap-1 text-slate-300">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{item.includes.join(', ')}</span>
                        </div>
                      )}
                      {item.excludes.length > 0 && (
                        <div className="flex items-start gap-1 text-slate-500">
                          <span className="text-slate-500 font-bold">✗</span>
                          <span>{item.excludes.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* 8. Approve Switch */}
                    <div className="flex justify-center pt-0.5">
                      <button
                        onClick={() => handleToggleLabor(item.id)}
                        className="cursor-pointer transition-all active:scale-90"
                        title={item.approved ? 'Approved' : 'Unapproved'}
                      >
                        {item.approved ? (
                          <ToggleRight className="w-6 h-6 text-blue-500 hover:text-blue-400" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-slate-600 hover:text-slate-500" />
                        )}
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
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#060B17] border border-[#142036] text-[11px]">
        <span className="font-semibold text-white flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Accuracy-First Standard
        </span>
        <span className="text-[10px] text-slate-400">Audited &amp; Traceable Takeoff</span>
      </div>

      {/* Accuracy Scorecard */}
      <div className="p-3.5 rounded-2xl bg-[#060B17] border border-[#142036]">
        <h3 className="text-xs font-bold text-white mb-2.5">Accuracy Scorecard</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Plan Quality Score', value: '40/100' },
            { label: 'Scale-Verified Sheets', value: '0 / 6' },
            { label: 'Directly Measured', value: '26%' },
            { label: 'Schedule-Derived', value: '0%' },
            { label: 'Assumption-Based', value: '100%' },
            { label: 'Allowance-Based', value: '33%' },
            { label: 'Unresolved Conflicts', value: '0' },
            { label: 'Low-Confidence Qty', value: '14' },
            { label: 'Independently Audited', value: 'Pending' },
            { label: 'Human Review', value: '0%' },
          ].map((item, i) => (
            <div key={i} className="p-2 rounded-xl bg-[#0A1328] border border-[#1A2744]">
              <p className="text-[9px] text-slate-400 font-semibold">{item.label}</p>
              <p className="text-xs font-black text-white mt-0.5">{item.value}</p>
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
