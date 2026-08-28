import React, { useState } from 'react';
import { 
  Plus, Download, ChevronRight, Layers, 
  DollarSign, Check, X, FileSpreadsheet, Target, Ruler, Upload
} from 'lucide-react';
import { BudgetDetailView } from './BudgetDetailView';
import { CreateProjectBudgetModal } from '../modals/CreateProjectBudgetModal';
import { DealAnalyzerModal } from '../modals/DealAnalyzerModal';
import { ImportBudgetModal } from '../modals/ImportBudgetModal';
import { TabSelector } from '../common/TabSelector';
import { FilterPills } from '../common/FilterPills';
import { MOCK_PROJECTS } from '../../data/mockData';

export interface BudgetCardItem {
  id: string;
  name: string;
  type: 'Standalone budget' | 'Project linked';
  totalBudget: number;
  estimated: number;
  committed: number;
  actual: number;
  progress: number;
  itemsCount: number;
  status: 'DRAFT' | 'ACTIVE' | 'APPROVED';
}

const INITIAL_BUDGET_CARDS: BudgetCardItem[] = [
  {
    id: 'b-1',
    name: 'Riverside Office Complex',
    type: 'Project linked',
    totalBudget: 4650000,
    estimated: 4650000,
    committed: 3800000,
    actual: 3250000,
    progress: 70,
    itemsCount: 128,
    status: 'ACTIVE'
  },
  {
    id: 'b-2',
    name: 'Downtown Commercial Highrise',
    type: 'Project linked',
    totalBudget: 12500000,
    estimated: 12500000,
    committed: 11000000,
    actual: 9800000,
    progress: 78,
    itemsCount: 215,
    status: 'ACTIVE'
  },
  {
    id: 'b-3',
    name: 'Greenfield Technology Hub',
    type: 'Project linked',
    totalBudget: 8400000,
    estimated: 8400000,
    committed: 5200000,
    actual: 3780000,
    progress: 45,
    itemsCount: 94,
    status: 'ACTIVE'
  }
];

const CSI_DIVISIONS_DATA: Record<string, Array<{
  code: string;
  title: string;
  vendor: string;
  budget: string;
  committed: string;
  actual: string;
  pct: number;
}>> = {
  'All': [
    { code: '01-000', title: 'General Requirements & PM', vendor: 'Avery Marsh Mgmt', budget: '$1,450,000', committed: '$1,400,000', actual: '$1,280,000', pct: 88 },
    { code: '02-000', title: 'Site Construction & Grading', vendor: 'Groundworks Excavation', budget: '$1,850,000', committed: '$1,800,000', actual: '$1,750,000', pct: 94 },
    { code: '03-000', title: 'Concrete & Foundations', vendor: 'Apex Concrete LLC', budget: '$3,450,000', committed: '$3,300,000', actual: '$3,180,000', pct: 92 },
    { code: '04-000', title: 'Masonry & Brickwork', vendor: 'Stonehenge Masonry', budget: '$920,000', committed: '$880,000', actual: '$750,000', pct: 81 },
    { code: '05-000', title: 'Metals & Structural Steel', vendor: 'Titan Steel Works', budget: '$4,100,000', committed: '$3,950,000', actual: '$3,400,000', pct: 82 },
    { code: '06-000', title: 'Wood, Plastics & Carpentry', vendor: 'Lumberjack Framing', budget: '$2,200,000', committed: '$2,100,000', actual: '$1,950,000', pct: 88 },
    { code: '07-000', title: 'Thermal & Moisture Protection', vendor: 'Vertex Roofing Systems', budget: '$1,350,000', committed: '$1,200,000', actual: '$1,100,000', pct: 81 },
    { code: '08-000', title: 'Doors & Windows', vendor: 'ClearView Glazing Inc', budget: '$1,150,000', committed: '$1,100,000', actual: '$950,000', pct: 82 },
    { code: '09-000', title: 'Finishes & Drywall', vendor: 'Precision Interiors', budget: '$2,850,000', committed: '$2,820,000', actual: '$1,410,000', pct: 49 },
    { code: '10-000', title: 'Specialties', vendor: 'A1 Specialty Fittings', budget: '$420,000', committed: '$380,000', actual: '$310,000', pct: 73 },
    { code: '11-000', title: 'Equipment', vendor: 'ProKitchen Supply', budget: '$650,000', committed: '$600,000', actual: '$580,000', pct: 89 },
    { code: '12-000', title: 'Furnishings', vendor: 'OfficeScape Design', budget: '$580,000', committed: '$500,000', actual: '$450,000', pct: 77 },
    { code: '13-000', title: 'Special Construction', vendor: 'Apex Pools & Spas', budget: '$300,000', committed: '$290,000', actual: '$280,000', pct: 93 },
    { code: '14-000', title: 'Conveying Systems (Elevators)', vendor: 'Otis Lift Corp', budget: '$1,200,000', committed: '$1,150,000', actual: '$980,000', pct: 81 },
    { code: '15-000', title: 'Mechanical & HVAC', vendor: 'Cascade Climate HVAC', budget: '$1,620,000', committed: '$1,590,000', actual: '$1,310,000', pct: 80 },
    { code: '16-000', title: 'Electrical & Power Systems', vendor: 'Volt Electric Inc', budget: '$1,980,000', committed: '$1,950,000', actual: '$1,640,000', pct: 82 }
  ],
  'Riverside Office': [
    { code: '01-000', title: 'General Requirements & PM', vendor: 'Avery Marsh Mgmt', budget: '$350,000', committed: '$340,000', actual: '$310,000', pct: 88 },
    { code: '02-000', title: 'Site Construction & Grading', vendor: 'Groundworks Excavation', budget: '$450,000', committed: '$430,000', actual: '$420,000', pct: 93 },
    { code: '03-000', title: 'Concrete & Foundations', vendor: 'Apex Concrete LLC', budget: '$750,000', committed: '$720,000', actual: '$680,000', pct: 90 },
    { code: '04-000', title: 'Masonry & Brickwork', vendor: 'Stonehenge Masonry', budget: '$180,000', committed: '$170,000', actual: '$150,000', pct: 83 },
    { code: '05-000', title: 'Metals & Structural Steel', vendor: 'Titan Steel Works', budget: '$800,000', committed: '$750,000', actual: '$680,000', pct: 85 },
    { code: '06-000', title: 'Wood, Plastics & Carpentry', vendor: 'Lumberjack Framing', budget: '$420,000', committed: '$400,000', actual: '$380,000', pct: 90 },
    { code: '07-000', title: 'Thermal & Moisture Protection', vendor: 'Vertex Roofing Systems', budget: '$250,000', committed: '$220,000', actual: '$210,000', pct: 84 },
    { code: '08-000', title: 'Doors & Windows', vendor: 'ClearView Glazing Inc', budget: '$220,000', committed: '$210,000', actual: '$180,000', pct: 81 },
    { code: '09-000', title: 'Finishes & Drywall', vendor: 'Precision Interiors', budget: '$520,000', committed: '$500,000', actual: '$210,000', pct: 40 },
    { code: '10-000', title: 'Specialties', vendor: 'A1 Specialty Fittings', budget: '$80,000', committed: '$70,000', actual: '$60,000', pct: 75 },
    { code: '11-000', title: 'Equipment', vendor: 'ProKitchen Supply', budget: '$110,000', committed: '$100,000', actual: '$90,000', pct: 81 },
    { code: '12-000', title: 'Furnishings', vendor: 'OfficeScape Design', budget: '$120,000', committed: '$100,000', actual: '$90,000', pct: 75 },
    { code: '13-000', title: 'Special Construction', vendor: 'Apex Pools & Spas', budget: '$50,000', committed: '$40,000', actual: '$40,000', pct: 80 },
    { code: '14-000', title: 'Conveying Systems (Elevators)', vendor: 'Otis Lift Corp', budget: '$350,000', committed: '$320,000', actual: '$280,000', pct: 80 },
    { code: '15-000', title: 'Mechanical & HVAC', vendor: 'Cascade Climate HVAC', budget: '$420,000', committed: '$410,000', actual: '$380,000', pct: 90 },
    { code: '16-000', title: 'Electrical & Power Systems', vendor: 'Volt Electric Inc', budget: '$480,000', committed: '$460,000', actual: '$410,000', pct: 85 }
  ],
  'Downtown Highrise': [
    { code: '01-000', title: 'General Requirements & PM', vendor: 'Avery Marsh Mgmt', budget: '$650,000', committed: '$620,000', actual: '$580,000', pct: 89 },
    { code: '02-000', title: 'Site Construction & Grading', vendor: 'Groundworks Excavation', budget: '$850,000', committed: '$820,000', actual: '$800,000', pct: 94 },
    { code: '03-000', title: 'Concrete & Foundations', vendor: 'Apex Concrete LLC', budget: '$1,850,000', committed: '$1,780,000', actual: '$1,700,000', pct: 91 },
    { code: '04-000', title: 'Masonry & Brickwork', vendor: 'Stonehenge Masonry', budget: '$480,000', committed: '$460,000', actual: '$410,000', pct: 85 },
    { code: '05-000', title: 'Metals & Structural Steel', vendor: 'Titan Steel Works', budget: '$2,100,000', committed: '$2,000,000', actual: '$1,800,000', pct: 85 },
    { code: '06-000', title: 'Wood, Plastics & Carpentry', vendor: 'Lumberjack Framing', budget: '$1,100,000', committed: '$1,050,000', actual: '$980,000', pct: 89 },
    { code: '07-000', title: 'Thermal & Moisture Protection', vendor: 'Vertex Roofing Systems', budget: '$680,000', committed: '$600,000', actual: '$550,000', pct: 80 },
    { code: '08-000', title: 'Doors & Windows', vendor: 'ClearView Glazing Inc', budget: '$580,000', committed: '$560,000', actual: '$480,000', pct: 82 },
    { code: '09-000', title: 'Finishes & Drywall', vendor: 'Precision Interiors', budget: '$1,450,000', committed: '$1,420,000', actual: '$820,000', pct: 56 },
    { code: '10-000', title: 'Specialties', vendor: 'A1 Specialty Fittings', budget: '$220,000', committed: '$200,000', actual: '$180,000', pct: 81 },
    { code: '11-000', title: 'Equipment', vendor: 'ProKitchen Supply', budget: '$320,000', committed: '$300,000', actual: '$290,000', pct: 90 },
    { code: '12-000', title: 'Furnishings', vendor: 'OfficeScape Design', budget: '$280,000', committed: '$250,000', actual: '$230,000', pct: 82 },
    { code: '13-000', title: 'Special Construction', vendor: 'Apex Pools & Spas', budget: '$150,000', committed: '$140,000', actual: '$140,000', pct: 93 },
    { code: '14-000', title: 'Conveying Systems (Elevators)', vendor: 'Otis Lift Corp', budget: '$620,000', committed: '$600,000', actual: '$520,000', pct: 83 },
    { code: '15-000', title: 'Mechanical & HVAC', vendor: 'Cascade Climate HVAC', budget: '$820,000', committed: '$800,000', actual: '$680,000', pct: 82 },
    { code: '16-000', title: 'Electrical & Power Systems', vendor: 'Volt Electric Inc', budget: '$980,000', committed: '$960,000', actual: '$810,000', pct: 82 }
  ],
  'Greenfield Hub': [
    { code: '01-000', title: 'General Requirements & PM', vendor: 'Avery Marsh Mgmt', budget: '$450,000', committed: '$440,000', actual: '$390,000', pct: 86 },
    { code: '02-000', title: 'Site Construction & Grading', vendor: 'Groundworks Excavation', budget: '$550,000', committed: '$550,000', actual: '$530,000', pct: 96 },
    { code: '03-000', title: 'Concrete & Foundations', vendor: 'Apex Concrete LLC', budget: '$850,000', committed: '$800,000', actual: '$800,000', pct: 94 },
    { code: '04-000', title: 'Masonry & Brickwork', vendor: 'Stonehenge Masonry', budget: '$260,000', committed: '$250,000', actual: '$190,000', pct: 73 },
    { code: '05-000', title: 'Metals & Structural Steel', vendor: 'Titan Steel Works', budget: '$1,200,000', committed: '$1,200,000', actual: '$920,000', pct: 76 },
    { code: '06-000', title: 'Wood, Plastics & Carpentry', vendor: 'Lumberjack Framing', budget: '$680,000', committed: '$650,005', actual: '$590,000', pct: 86 },
    { code: '07-000', title: 'Thermal & Moisture Protection', vendor: 'Vertex Roofing Systems', budget: '$420,000', committed: '$380,000', actual: '$340,000', pct: 80 },
    { code: '08-000', title: 'Doors & Windows', vendor: 'ClearView Glazing Inc', budget: '$350,000', committed: '$330,000', actual: '$290,000', pct: 82 },
    { code: '09-000', title: 'Finishes & Drywall', vendor: 'Precision Interiors', budget: '$880,000', committed: '$900,000', actual: '$380,000', pct: 43 },
    { code: '10-000', title: 'Specialties', vendor: 'A1 Specialty Fittings', budget: '$120,000', committed: '$110,000', actual: '$70,000', pct: 58 },
    { code: '11-000', title: 'Equipment', vendor: 'ProKitchen Supply', budget: '$220,000', committed: '$200,000', actual: '$200,000', pct: 90 },
    { code: '12-000', title: 'Furnishings', vendor: 'OfficeScape Design', budget: '$180,000', committed: '$150,000', actual: '$130,000', pct: 72 },
    { code: '13-000', title: 'Special Construction', vendor: 'Apex Pools & Spas', budget: '$100,000', committed: '$110,000', actual: '$100,000', pct: 100 },
    { code: '14-000', title: 'Conveying Systems (Elevators)', vendor: 'Otis Lift Corp', budget: '$230,000', committed: '$230,000', actual: '$180,005', pct: 78 },
    { code: '15-000', title: 'Mechanical & HVAC', vendor: 'Cascade Climate HVAC', budget: '$380,000', committed: '$380,000', actual: '$250,000', pct: 65 },
    { code: '16-000', title: 'Electrical & Power Systems', vendor: 'Volt Electric Inc', budget: '$520,005', committed: '$530,000', actual: '$420,000', pct: 80 }
  ]
};

interface BudgetsHubViewProps {
  onOpenImportBudget?: () => void;
}

export const BudgetsHubView: React.FC<BudgetsHubViewProps> = ({ onOpenImportBudget }) => {
  const [viewMode, setViewMode] = useState<'analytics' | 'sheets'>('analytics');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('All');
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDealAnalyzerOpen, setIsDealAnalyzerOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedCostCode, setSelectedCostCode] = useState<{
    code: string;
    title: string;
    vendor: string;
    budget: string;
    committed: string;
    actual: string;
    pct: number;
  } | null>(null);
  const [budgets, setBudgets] = useState<BudgetCardItem[]>(INITIAL_BUDGET_CARDS);

  const projectsList = ['All', 'Riverside Office', 'Downtown Highrise', 'Greenfield Hub'];

  // Dynamic Portfolio numbers
  const budgetStats: Record<string, { budget: string; spent: string; committed: string; remaining: string; paidPct: number; committedPct: number; remainingPct: number; activeProjCount: number }> = {
    'All': { budget: '25.55', spent: '16.83', committed: '20.00', remaining: '5.55', paidPct: 65.8, committedPct: 22.4, remainingPct: 11.8, activeProjCount: 3 },
    'Riverside Office': { budget: '4.65', spent: '3.25', committed: '3.80', remaining: '0.85', paidPct: 69.9, committedPct: 20.2, remainingPct: 9.9, activeProjCount: 1 },
    'Downtown Highrise': { budget: '12.50', spent: '9.80', committed: '11.00', remaining: '1.50', paidPct: 78.4, committedPct: 12.0, remainingPct: 9.6, activeProjCount: 1 },
    'Greenfield Hub': { budget: '8.40', spent: '3.78', committed: '5.20', remaining: '3.20', paidPct: 45.0, committedPct: 34.0, remainingPct: 21.0, activeProjCount: 1 }
  };

  const filterKey = selectedProjectFilter === 'Greenfield Hub' ? 'Greenfield Hub' : selectedProjectFilter === 'Riverside Office' ? 'Riverside Office' : selectedProjectFilter === 'Downtown Highrise' ? 'Downtown Highrise' : 'All';
  const currentStats = budgetStats[filterKey];
  const activeDivisions = CSI_DIVISIONS_DATA[filterKey];

  // Calculate sum total of CSI divisions budgets
  const csiDivTotal = activeDivisions.reduce((sum, d) => sum + Number(d.budget.replace(/[^0-9.-]+/g,"")), 0);

  // 1. If user drilled down into a specific budget sheet details page
  if (selectedBudgetId) {
    return (
      <BudgetDetailView 
        budgetId={selectedBudgetId} 
        onBack={() => setSelectedBudgetId(null)} 
      />
    );
  }

  // 2. If user opens Create Budget as a full-screen dedicated page
  if (isCreateModalOpen) {
    return (
      <CreateProjectBudgetModal
        isFullScreenPage={true}
        onClose={() => setIsCreateModalOpen(false)}
        projects={MOCK_PROJECTS}
        onCreateBudget={(budgetData) => {
          const newBudget: BudgetCardItem = {
            id: `b-${Date.now()}`,
            name: budgetData.budgetName || 'New Commercial Budget',
            type: budgetData.attachType === 'project' ? 'Project linked' : 'Standalone budget',
            totalBudget: 5000000,
            estimated: 5000000,
            committed: 0,
            actual: 0,
            progress: 0,
            itemsCount: 71,
            status: 'DRAFT'
          };
          setBudgets(prev => [newBudget, ...prev]);
          setIsCreateModalOpen(false);
        }}
      />
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. TOP HEADER & PRIMARY ACTIONS ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Budgets & Cost Codes</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Master CSI Financial Ledger</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsDealAnalyzerOpen(true)}
            className="h-9 w-9 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-cyan-500/40 text-cyan-400 flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-sm"
            title="Latti Deal Analyzer"
          >
            <Target className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="h-9 w-9 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-teal-500/40 text-teal-400 flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-sm"
            title="Import from BuildScope AI"
          >
            <Ruler className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-9 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-md shadow-blue-600/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Budget</span>
          </button>
        </div>
      </div>

      {/* ─── 2. PORTFOLIO FINANCIAL SUMMARY CARD ─── */}
      <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Budget
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-0.5 transition-all">
              ${currentStats.budget}M
            </h2>
            <p className="text-[12px] text-slate-400 mt-0.5 font-medium">
              {currentStats.activeProjCount} Active {currentStats.activeProjCount === 1 ? 'Project' : 'Projects'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Spent to Date
            </span>
            <span className="text-lg font-bold text-blue-400 mt-0.5 block transition-all">
              ${currentStats.spent}M
            </span>
            <span className="text-[12px] text-emerald-400 font-semibold transition-all">
              ${currentStats.remaining}M remaining
            </span>
          </div>
        </div>

        {/* Cashflow Segmented Track */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-[#142036]">
          <div className="w-full h-2 bg-[#050811] rounded-full overflow-hidden flex border border-[#142036]">
            <div className="bg-[#2563EB] h-full transition-all duration-500" style={{ width: `${currentStats.paidPct}%` }} title={`Paid: $${currentStats.spent}M`} />
            <div className="bg-[#60A5FA] h-full transition-all duration-500" style={{ width: `${currentStats.committedPct}%` }} title={`Committed: $${currentStats.committed}M`} />
            <div className="bg-[#1E2E48] h-full transition-all duration-500" style={{ width: `${currentStats.remainingPct}%` }} title={`Remaining: $${currentStats.remaining}M`} />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span>Paid: <strong className="text-white">${currentStats.spent}M</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
              <span>Committed: <strong className="text-white">${currentStats.committed}M</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1E2E48]" />
              <span>Remaining: <strong className="text-white">${currentStats.remaining}M</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. SEGMENTED TABS: COST BREAKDOWN vs PROJECT SHEETS ─── */}
      <TabSelector
        activeId={viewMode}
        onChange={(id) => setViewMode(id as 'analytics' | 'sheets')}
        options={[
          { id: 'analytics', label: 'CSI Cost Breakdown' },
          { id: 'sheets', label: `Project Sheets (${budgets.length})` }
        ]}
      />

      {/* ─── 4. PROJECT FILTER PILLS ─── */}
      <FilterPills
        options={projectsList}
        selected={selectedProjectFilter}
        onSelect={setSelectedProjectFilter}
      />

      {/* ─── 5. TAB VIEW CONTENT ─── */}
      {viewMode === 'analytics' ? (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-0.5 pt-1">
            <span className="text-xs font-bold text-white uppercase tracking-wider">CSI Divisions</span>
            <span className="text-xs font-semibold text-slate-400">Total ${(csiDivTotal / 1000000).toFixed(2)}M</span>
          </div>

          <div className="flex flex-col gap-2">
            {activeDivisions.map((div) => (
              <div
                key={div.code}
                onClick={() => setSelectedCostCode(div)}
                className="p-3.5 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer flex flex-col gap-2 shadow-sm active:scale-[0.99] group animate-fade-in"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 flex-shrink-0">
                        {div.code}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                        {div.title}
                      </h4>
                    </div>
                    <p className="text-[12px] text-slate-400 font-medium mt-1">
                      {div.vendor} · <span className="text-slate-300 font-semibold">{div.actual} paid</span>
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-white block">{div.budget}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{div.pct}%</span>
                  </div>
                </div>

                <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden border border-[#142036]">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-500" style={{ width: `${div.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-0.5 pt-1">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Project Budget Sheets</span>
            <span className="text-xs font-semibold text-slate-400">{budgets.length} Projects</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {budgets.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBudgetId(b.id)}
                className="p-3.5 rounded-xl bg-[#070D1A] border border-[#142036] hover:border-blue-500/40 transition-all cursor-pointer flex flex-col gap-2.5 shadow-sm active:scale-[0.99] group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                      {b.name}
                    </h3>
                    <p className="text-[12px] text-slate-400 mt-0.5 font-medium">
                      {b.itemsCount} Cost Code Items
                    </p>
                  </div>

                  <span className="text-xs font-bold text-white flex-shrink-0">
                    ${(b.totalBudget / 1000000).toFixed(2)}M
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#142036] text-[12px]">
                  <span className="text-slate-400">
                    Spent: <strong className="text-blue-400">${(b.actual / 1000000).toFixed(2)}M</strong>
                  </span>
                  <span className="text-slate-400">
                    Remaining: <strong className="text-emerald-400">${((b.totalBudget - b.actual) / 1000000).toFixed(2)}M</strong>
                  </span>
                </div>

                <div className="w-full bg-[#050811] h-1.5 rounded-full overflow-hidden border border-[#142036]">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full" style={{ width: `${b.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 6. COST CODE ITEM DETAIL MODAL ─── */}
      {selectedCostCode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="w-full max-w-[380px] bg-[#070D1A] border border-[#1E2E4A] rounded-2xl p-5 shadow-2xl flex flex-col gap-3 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {selectedCostCode.code}
                </span>
                <h3 className="text-xs font-bold text-white truncate">{selectedCostCode.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCostCode(null)}
                className="w-6 h-6 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#050811] border border-[#142036]">
                <span className="text-[10px] text-slate-400 font-medium block">Total Budget</span>
                <span className="text-sm font-bold text-white mt-0.5 block">{selectedCostCode.budget}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050811] border border-[#142036]">
                <span className="text-[10px] text-slate-400 font-medium block">Committed Subcontracts</span>
                <span className="text-sm font-bold text-slate-200 mt-0.5 block">{selectedCostCode.committed}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050811] border border-[#142036]">
                <span className="text-[10px] text-slate-400 font-medium block">Paid to Date</span>
                <span className="text-sm font-bold text-blue-400 mt-0.5 block">{selectedCostCode.actual}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#050811] border border-[#142036]">
                <span className="text-[10px] text-slate-400 font-medium block">Subcontractor</span>
                <span className="text-xs font-bold text-white mt-0.5 block truncate">{selectedCostCode.vendor}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#142036] flex justify-end">
              <button
                onClick={() => setSelectedCostCode(null)}
                className="px-4 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 7. FULL SCREEN MODALS ─── */}
      {isDealAnalyzerOpen && (
        <DealAnalyzerModal
          isFullScreenPage={true}
          onClose={() => setIsDealAnalyzerOpen(false)}
        />
      )}

      {isImportModalOpen && (
        <ImportBudgetModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          projects={MOCK_PROJECTS}
          onImportSuccess={(projectId, budgetName, totalAmount) => {
            const newBudget: BudgetCardItem = {
              id: `b-${Date.now()}`,
              name: budgetName || 'BuildScope AI Imported Budget',
              type: 'Project linked',
              totalBudget: totalAmount || 4200000,
              estimated: totalAmount || 4200000,
              committed: 0,
              actual: 0,
              progress: 0,
              itemsCount: 71,
              status: 'DRAFT'
            };
            setBudgets(prev => [newBudget, ...prev]);
            setIsImportModalOpen(false);
          }}
        />
      )}

    </div>
  );
};
