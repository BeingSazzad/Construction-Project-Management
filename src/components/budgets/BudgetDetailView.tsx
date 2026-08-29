import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronDown, Download, Save, 
  DollarSign, Wallet, FileSpreadsheet, Layers, TrendingUp, Sparkles, Users, Clock, FileText, ChevronUp, PieChart, UserPlus, X, Edit3, Check, Phone, Mail, Send, MessageSquare
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface BudgetDetailViewProps {
  budgetId?: string;
  onBack: () => void;
}

export const BudgetDetailView: React.FC<BudgetDetailViewProps> = ({
  budgetId = 'b-1',
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'forecast' | 'learning' | 'team' | 'activity' | 'reports'>('breakdown');
  const [status, setStatus] = useState<'in review' | 'draft' | 'approved'>('in review');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Overview Tab Interactive States
  const [lotPrice, setLotPrice] = useState<number>(150000);
  const [buildingSF, setBuildingSF] = useState<number>(3500);
  const [contingencyPct, setContingencyPct] = useState<number>(10);
  const [builderFeePct, setBuilderFeePct] = useState<number>(8);

  // Financial Forecast Tab Interactive States
  const [salePrice, setSalePrice] = useState<number>(850000);
  const [closingCostsPct, setClosingCostsPct] = useState<number>(2);
  const [agentCommissionPct, setAgentCommissionPct] = useState<number>(6);
  const [otherSellingCosts, setOtherSellingCosts] = useState<number>(3000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [carryingMonths, setCarryingMonths] = useState<number>(12);

  // Team Assignments State
  const [teamMembers, setTeamMembers] = useState([
    { id: 'tm-1', name: 'John Smith', email: 'john@company.com', role: 'Estimator', access: 'View Only' },
    { id: 'tm-2', name: 'Alex Chen', email: 'alex@averymarsh.com', role: 'Project Manager', access: 'Full Access' },
    { id: 'tm-3', name: 'Sarah Miller', email: 'sarah@archstudio.com', role: 'Architect', access: 'Can Edit' },
  ]);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const handleAddMember = () => {
    const newId = `tm-${Date.now()}`;
    setTeamMembers(prev => [
      ...prev,
      { id: newId, name: '', email: '', role: 'Estimator', access: 'View Only' }
    ]);
    setEditingMemberId(newId);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleMemberChange = (id: string, field: string, value: string) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  // Real Team Chat & Activity Messages State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      sender: 'Sarah Johnson',
      initials: 'SJ',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      role: 'Lead Project Manager',
      time: '5m ago',
      text: 'Foundation pour scheduled for Thursday 8:00 AM. Please confirm concrete pump truck access with site security.'
    },
    {
      id: 'msg-2',
      sender: 'Alex Chen',
      initials: 'AC',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      role: 'Project Estimator',
      time: '15m ago',
      text: 'Updated Soil Test & Engineering line item quantity from 1 to 2 based on revised site engineer report.'
    },
    {
      id: 'msg-3',
      sender: 'Carlos Ortiz',
      initials: 'CO',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      role: 'Earthwork Sub Lead',
      time: '1h ago',
      text: 'Grading and excavation on Lot #4 complete. Silt fencing inspection passed by city officer.'
    },
    {
      id: 'msg-4',
      sender: 'Sarah Miller',
      initials: 'SM',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      role: 'Lead Architect',
      time: '2h ago',
      text: 'Uploaded architectural document dallas_custom_v3.pdf with revised structural column specs.'
    },
    {
      id: 'msg-5',
      sender: 'John Smith',
      initials: 'JS',
      color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      role: 'Superintendent',
      time: '3h ago',
      text: 'Adjusted Contingency reserve buffer to 10% to cover unexpected utility relocation fees.'
    },
    {
      id: 'msg-6',
      sender: 'Dave Miller',
      initials: 'DM',
      color: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      role: 'Concrete Trade Lead',
      time: 'Yesterday',
      text: 'Rebar steel delivery confirmed for Wednesday afternoon. Rigging crew prepped.'
    }
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    setChatMessages(prev => [
      {
        id: `msg-${Date.now()}`,
        sender: 'Alex Chen',
        initials: 'AC',
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        role: 'Project Manager',
        time: 'Just now',
        text: newChatMessage.trim()
      },
      ...prev
    ]);
    setNewChatMessage('');
  };

  // Card Min / Max (Expand / Collapse) States
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});

  const toggleCardCollapse = (cardKey: string) => {
    setCollapsedCards(prev => ({
      ...prev,
      [cardKey]: !prev[cardKey]
    }));
  };

  // Accordion state for Cost Breakdown
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'engineering': true,
    'precon': true,
    'foundation': true,
    'framing': false,
  });

  // Line items state for interactive edits
  const [sections, setSections] = useState([
    {
      id: 'engineering',
      name: '1. Engineering',
      category: 'Engineering',
      items: [
        { id: 'eng-1', name: 'Geotechnical soil report & foundation design', qty: 1, unit: 'EA', unitCost: 3500, total: 3500 },
        { id: 'eng-2', name: 'Structural engineering drawings & framing calculations', qty: 1, unit: 'EA', unitCost: 4800, total: 4800 },
        { id: 'eng-3', name: 'Truss engineering & shop drawings', qty: 1, unit: 'EA', unitCost: 1800, total: 1800 },
        { id: 'eng-4', name: 'Wind / seismic load calculations', qty: 1, unit: 'EA', unitCost: 1200, total: 1200 },
        { id: 'eng-5', name: 'Civil site engineering (grading & drainage plan)', qty: 1, unit: 'EA', unitCost: 2600, total: 2600 }
      ]
    },
    {
      id: 'precon',
      name: '2. Pre-Construction & Permits',
      category: 'Pre-Construction',
      items: [
        { id: 'pre-1', name: 'Land survey & soil bearing test', qty: 1, unit: 'EA', unitCost: 1850, total: 1850 },
        { id: 'pre-2', name: 'Submit HOA / architectural review package', qty: 1, unit: 'EA', unitCost: 650, total: 650 },
        { id: 'pre-3', name: 'Pull building permit', qty: 1, unit: 'EA', unitCost: 4200, total: 4200 },
        { id: 'pre-4', name: 'Pull environmental permit (DEP / stormwater SWPPP)', qty: 1, unit: 'EA', unitCost: 1100, total: 1100 },
        { id: 'pre-5', name: 'Set up temporary power & water', qty: 1, unit: 'EA', unitCost: 2400, total: 2400 },
        { id: 'pre-6', name: 'Install silt fencing & erosion control', qty: 1, unit: 'EA', unitCost: 1650, total: 1650 }
      ]
    },
    {
      id: 'foundation',
      name: '3. Site Work & Foundation',
      category: 'Foundation',
      items: [
        { id: 'fdn-1', name: 'Clear & grade lot', qty: 1, unit: 'EA', unitCost: 6500, total: 6500 },
        { id: 'fdn-2', name: 'Excavation & trenching for footings', qty: 1, unit: 'EA', unitCost: 4800, total: 4800 },
        { id: 'fdn-3', name: 'Formwork & rebar reinforcement placement', qty: 1, unit: 'EA', unitCost: 9200, total: 9200 },
        { id: 'fdn-4', name: 'Pour 3500 PSI structural concrete slab', qty: 1, unit: 'EA', unitCost: 28400, total: 28400 },
        { id: 'fdn-5', name: 'Foundation waterproofing & French drain', qty: 1, unit: 'EA', unitCost: 3800, total: 3800 }
      ]
    }
  ]);

  const toggleSection = (secId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  const handleItemFieldChange = (
    sectionId: string,
    itemId: string,
    field: 'name' | 'qty' | 'unit' | 'unitCost',
    val: string | number
  ) => {
    setSections(prev => prev.map(sec => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.map(it => {
          if (it.id !== itemId) return it;
          const updated = { ...it, [field]: val };
          if (field === 'qty' || field === 'unitCost') {
            const qty = field === 'qty' ? Math.max(0, Number(val)) : it.qty;
            const unitCost = field === 'unitCost' ? Math.max(0, Number(val)) : it.unitCost;
            updated.total = qty * unitCost;
          }
          return updated;
        })
      };
    }));
  };

  // Calculate totals
  const totalCost = sections.reduce((secSum, sec) => {
    return secSum + sec.items.reduce((itemSum, item) => itemSum + item.total, 0);
  }, 0);

  const totalItemsCount = sections.reduce((sum, sec) => sum + sec.items.length, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full flex flex-col gap-3 px-4 py-4 pb-32 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. SINGLE UNIFIED EXECUTIVE TOP TOOLBAR ─── */}
      <div className="flex items-center justify-between gap-2 bg-[#070D1A] p-2 px-3 rounded-2xl border border-[#142036] shadow-sm">
        {/* Left: Back Arrow + BDG-3200 Badge + Line Items Count */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-[#091122] hover:bg-[#0E1A33] border border-[#172540] flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-sm"
            title="Back to Budgets"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[10px] font-extrabold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20 flex-shrink-0">
            BDG-3200
          </span>

          <span className="text-[11px] font-bold text-slate-400 truncate">
            {totalItemsCount} items
          </span>
        </div>

        {/* Right: Status Dropdown + Export Icon + Save Button */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-24">
            <CustomSelect
              value={status}
              onChange={(v) => setStatus(v as any)}
              options={[
                { value: 'in review', label: 'In Review' },
                { value: 'draft', label: 'Draft' },
                { value: 'approved', label: 'Approved' }
              ]}
              size="sm"
            />
          </div>

          <button
            onClick={() => alert("Exporting Budget to PDF/CSV...")}
            className="w-8 h-8 rounded-xl bg-[#091122] hover:bg-[#0E1A33] border border-[#172540] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            title="Export"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => showToast("Budget saved successfully!")}
            className="h-8 px-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md shadow-blue-600/30 transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* ─── 2. FINANCIAL SUMMARY HEADER WITH LATTICE DEAL SCORE & MARGIN BADGES ─── */}
      <div className="flex items-center justify-between pb-0.5 pt-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Financial Summary
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            88/100 Score
          </span>
          <span className="text-[10px] font-extrabold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            28.0% Margin
          </span>
        </div>
      </div>

      {/* UNIFIED NON-DUPLICATE FINANCIAL PIE & KPI MASTER CARD */}
      <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3.5 animate-fade-in">
        
        {/* Top: SVG Solid Pie Chart (Left) + 4 Non-Duplicate Financial Cards (Right) */}
        <div className="flex items-center gap-3.5">
          
          {/* SVG Pie Chart Graphic (Spacious 110px Diameter) */}
          <div className="relative flex flex-col items-center justify-center flex-shrink-0">
            <svg width={110} height={110} viewBox="0 0 110 110" className="overflow-visible filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {/* Outer Subtle Glow Ring */}
              <circle cx={55} cy={55} r={52} fill="none" stroke="#1E325A" strokeWidth={1} opacity="0.6" />

              {/* Spent Pie Slice (23.5% = 84.6 deg angle) */}
              <path
                d="M 55 55 L 55 5 A 50 50 0 0 1 104.8 62.6 Z"
                fill="#2563EB"
                stroke="#070D1A"
                strokeWidth={2}
                className="hover:opacity-90 transition-opacity cursor-pointer filter drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]"
              />

              {/* Remaining Pie Slice (76.5% = 275.4 deg angle) */}
              <path
                d="M 55 55 L 104.8 62.6 A 50 50 0 1 1 55 5 Z"
                fill="#10B981"
                stroke="#070D1A"
                strokeWidth={2}
                className="hover:opacity-90 transition-opacity cursor-pointer filter drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              />

              {/* Center Divider Dot */}
              <circle cx={55} cy={55} r={3} fill="#FFFFFF" />
            </svg>

            {/* Total Est Label below Pie Chart */}
            <div className="flex flex-col items-center justify-center mt-1 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Est.</span>
              <span className="text-xs font-black text-white">$78.5k</span>
            </div>
          </div>

          {/* Right Side: 4 Core Non-Duplicate Executive Financial Cards */}
          <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex flex-col justify-between shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Spent
              </span>
              <span className="text-xs font-black text-blue-400 mt-1 block">$18.4k <span className="text-[9px] text-slate-400 font-normal">(23.5%)</span></span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex flex-col justify-between shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Remaining
              </span>
              <span className="text-xs font-black text-emerald-400 mt-1 block">$60.1k <span className="text-[9px] text-slate-400 font-normal">(76.5%)</span></span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex flex-col justify-between shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase block truncate">Net Profit</span>
              <span className="text-xs font-black text-emerald-400 mt-1 block">+$22.0k <span className="text-[9px] text-slate-400 font-normal">(28.0%)</span></span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex flex-col justify-between shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase block truncate">Revenue / ARV</span>
              <span className="text-xs font-black text-white mt-1 block">$100.4k</span>
            </div>
          </div>
        </div>

        {/* Bottom Executive Secondary Strip (4 Essential Metrics) */}
        <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-[#142036] text-center text-xs">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase block truncate">Cost / SF</span>
            <span className="text-xs font-bold text-blue-400 block mt-0.5">$185.40</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase block truncate">Sale / SF</span>
            <span className="text-xs font-bold text-blue-400 block mt-0.5">$245.00</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase block truncate">Revised</span>
            <span className="text-xs font-bold text-white block mt-0.5">$82.4k</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase block truncate">Contingency</span>
            <span className="text-xs font-bold text-white block mt-0.5">$12.5k</span>
          </div>
        </div>
      </div>

      {/* ─── 5. SUB-NAVIGATION TABS (Sleek Compact Pill Bar) ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 text-xs">
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'breakdown', label: 'Breakdown', icon: DollarSign },
          { id: 'forecast', label: 'Forecast', icon: TrendingUp },
          { id: 'learning', label: 'Learning', icon: Sparkles },
          { id: 'team', label: 'Team', icon: Users },
          { id: 'activity', label: 'Activity', icon: Clock },
          { id: 'reports', label: 'Reports', icon: FileText },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer flex-shrink-0 flex items-center gap-1.5 font-bold ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500'
                  : 'bg-[#091122]/90 text-slate-300 hover:text-white border border-[#172540] hover:border-slate-600'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── 6. COST BREAKDOWN TAB (Ergonomic High-Density Line Items) ─── */}
      {activeTab === 'breakdown' && (
        <div className="flex flex-col gap-2.5">
          {sections.map((sec) => {
            const isExpanded = expandedSections[sec.id];
            const sectionTotal = sec.items.reduce((sum, it) => sum + it.total, 0);

            return (
              <div 
                key={sec.id}
                className="bg-[#070D1A] border border-[#142036] rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Section Accordion Header */}
                <button
                  onClick={() => toggleSection(sec.id)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-[#0E1A33] transition-colors cursor-pointer text-left border-l-4 border-l-blue-500"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ChevronDown className={`w-4 h-4 text-blue-400 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                    <span className="text-xs font-bold text-white truncate">{sec.name}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {sec.items.length} items
                    </span>
                    <span className="text-xs font-bold text-blue-400">
                      ${sectionTotal.toLocaleString()}
                    </span>
                  </div>
                </button>

                {/* Line Items List */}
                {isExpanded && (
                  <div className="p-2.5 border-t border-[#142036] flex flex-col gap-2 bg-[#050811]">
                    {sec.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-[#070D1A] border border-[#142036] flex flex-col gap-2 shadow-sm hover:border-[#1F335C] transition-colors"
                      >
                        {/* Title & Category */}
                        <div className="flex items-start justify-between gap-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemFieldChange(sec.id, item.id, 'name', e.target.value)}
                            className="bg-transparent border-b border-transparent hover:border-[#142036] focus:border-blue-500 text-xs font-bold text-white leading-snug outline-none w-full transition-colors"
                          />
                          <span className="text-[10px] font-bold text-slate-400 bg-[#0E1A33] px-2 py-0.5 rounded border border-[#182846] uppercase flex-shrink-0">
                            {sec.category}
                          </span>
                        </div>

                        {/* Interactive Metrics Row: Qty, Unit, Rate, Total */}
                        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#142036]/60 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">Qty</span>
                            <input
                              type="number"
                              min="0"
                              value={item.qty}
                              onChange={(e) => handleItemFieldChange(sec.id, item.id, 'qty', Number(e.target.value))}
                              className="w-full bg-[#050811] border border-[#142036] rounded-lg px-2 py-0.5 text-xs text-white font-bold outline-none focus:border-blue-500 mt-0.5"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">Unit</span>
                            <select
                              value={item.unit}
                              onChange={(e) => handleItemFieldChange(sec.id, item.id, 'unit', e.target.value)}
                              className="w-full bg-[#050811] border border-[#142036] rounded-lg px-1.5 py-0.5 text-xs text-slate-300 font-bold outline-none focus:border-blue-500 mt-0.5 cursor-pointer"
                            >
                              <option value="EA">EA</option>
                              <option value="LS">LS</option>
                              <option value="SF">SF</option>
                              <option value="LF">LF</option>
                              <option value="HRS">HRS</option>
                              <option value="MO">MO</option>
                              <option value="CY">CY</option>
                              <option value="SQ">SQ</option>
                            </select>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">Rate ($)</span>
                            <input
                              type="number"
                              min="0"
                              value={item.unitCost}
                              onChange={(e) => handleItemFieldChange(sec.id, item.id, 'unitCost', Number(e.target.value))}
                              className="w-full bg-[#050811] border border-[#142036] rounded-lg px-2 py-0.5 text-xs text-blue-400 font-bold outline-none focus:border-blue-500 mt-0.5"
                            />
                          </div>

                          <div className="text-right flex flex-col justify-between">
                            <span className="text-[10px] text-slate-400 font-bold block">Total ($)</span>
                            <span className="font-extrabold text-emerald-400 text-xs mt-0.5 block truncate">
                              ${item.total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── 7. OVERVIEW TAB (Clean Commercial Project Parameters) ─── */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          {/* Section 1: Budget & Commercial Overview */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Budget & Project Overview</span>
              </h3>
              <button
                onClick={() => toggleCardCollapse('budgetOverview')}
                className="p-1 rounded-lg bg-[#050811] hover:bg-[#0E1A33] border border-[#142036] text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={collapsedCards['budgetOverview'] ? 'Maximize Card' : 'Minimize Card'}
              >
                {collapsedCards['budgetOverview'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!collapsedCards['budgetOverview'] && (
              <div className="grid grid-cols-2 gap-2 text-xs animate-fade-in">
                <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Budget Name</span>
                  <span className="font-extrabold text-white mt-1 block truncate">
                    {budgetId === 'b-1' ? 'Riverside Office Complex' : budgetId === 'b-2' ? 'Downtown Commercial Highrise' : 'Riverside Office Complex'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Budget Code</span>
                  <span className="font-extrabold text-blue-400 mt-1 block">BDG-3200</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Project Type</span>
                  <span className="font-extrabold text-cyan-400 mt-1 block">Commercial Office</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Site Location</span>
                  <span className="font-extrabold text-white mt-1 block truncate">Austin, TX</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Prepared By</span>
                  <span className="font-extrabold text-slate-300 mt-1 block">Alex Chen (PM)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Created Date</span>
                  <span className="font-extrabold text-slate-300 mt-1 block">28/08/2026</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Lot Purchase & Financing */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Lot Purchase & Financing</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Financed: ${(lotPrice * 0.8).toLocaleString()}
                </span>
                <button
                  onClick={() => toggleCardCollapse('lotPurchase')}
                  className="p-1 rounded-lg bg-[#050811] hover:bg-[#0E1A33] border border-[#142036] text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={collapsedCards['lotPurchase'] ? 'Maximize Card' : 'Minimize Card'}
                >
                  {collapsedCards['lotPurchase'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {!collapsedCards['lotPurchase'] && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Lot / Land Price ($)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        value={lotPrice}
                        onChange={(e) => setLotPrice(Math.max(0, Number(e.target.value)))}
                        className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl pl-7 pr-3 text-white text-xs font-extrabold focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Building SF (total)</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        value={buildingSF}
                        onChange={(e) => setBuildingSF(Math.max(1, Number(e.target.value)))}
                        className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl pl-3 pr-8 text-white text-xs font-extrabold focus:outline-none focus:border-blue-500 transition-colors"
                      />
                      <span className="absolute right-3 text-[10px] font-bold text-slate-400">SF</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#050811] border border-[#142036] flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-400 font-medium">80% LTV Loan Amount:</span>
                  <span className="font-black text-emerald-400 text-sm">${(lotPrice * 0.8).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Financial Parameters */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Contingencies & Fees</span>
              </h3>
              <button
                onClick={() => toggleCardCollapse('contingencies')}
                className="p-1 rounded-lg bg-[#050811] hover:bg-[#0E1A33] border border-[#142036] text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={collapsedCards['contingencies'] ? 'Maximize Card' : 'Minimize Card'}
              >
                {collapsedCards['contingencies'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!collapsedCards['contingencies'] && (
              <div className="grid grid-cols-2 gap-2 text-xs animate-fade-in">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Contingency (%)</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={contingencyPct}
                      onChange={(e) => setContingencyPct(Math.max(0, Number(e.target.value)))}
                      className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl pl-3 pr-7 text-amber-400 text-xs font-extrabold focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    <span className="absolute right-3 text-xs font-bold text-amber-400">%</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Builder Fee (%)</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={builderFeePct}
                      onChange={(e) => setBuilderFeePct(Math.max(0, Number(e.target.value)))}
                      className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl pl-3 pr-7 text-blue-400 text-xs font-extrabold focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <span className="absolute right-3 text-xs font-bold text-blue-400">%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── 8. TEAM TAB (Rich Global Team Directory Roster) ─── */}
      {activeTab === 'team' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          
          {/* Section Header with Add Member Button */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Users className="w-3.5 h-3.5" />
                  </span>
                  <span>Budget Team Roster ({teamMembers.length})</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Assigned Project Leadership & Subcontractor Leads</p>
              </div>

              <button
                onClick={handleAddMember}
                className="h-8 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md shadow-blue-600/30 flex-shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5 text-white" />
                <span>+ Add Member</span>
              </button>
            </div>

            {/* Global Team Roster Cards */}
            <div className="flex flex-col gap-2.5">
              {[
                {
                  id: 'emp-1',
                  name: 'Sarah Johnson',
                  role: 'Lead Project Manager',
                  company: 'Lattice Construction',
                  phone: '+1 (555) 345-6789',
                  email: 'sarah.j@averymarsh.com',
                  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                  type: 'gc',
                  access: 'Full Access',
                  isOnSite: true
                },
                {
                  id: 'emp-2',
                  name: 'John Smith',
                  role: 'Lead Field Superintendent',
                  company: 'Lattice Construction',
                  phone: '+1 (555) 567-8901',
                  email: 'john.s@averymarsh.com',
                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                  type: 'gc',
                  access: 'Full Access',
                  isOnSite: true
                },
                {
                  id: 'emp-3',
                  name: 'Alex Chen',
                  role: 'Project Estimator',
                  company: 'Lattice Construction',
                  phone: '+1 (555) 456-7890',
                  email: 'alex.c@averymarsh.com',
                  avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
                  type: 'gc',
                  access: 'Can Edit',
                  isOnSite: false
                },
                {
                  id: 'emp-4',
                  name: 'Sarah Miller',
                  role: 'Lead Architect',
                  company: 'ArchStudio Design LLC',
                  phone: '+1 (555) 789-0123',
                  email: 'sarah.m@archstudio.com',
                  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
                  type: 'trade',
                  access: 'View Only',
                  isOnSite: false
                },
                {
                  id: 'emp-5',
                  name: 'Carlos Ortiz',
                  role: 'Earthwork Site Foreman',
                  company: 'Earthworks Pro LLC',
                  phone: '+1 (555) 234-5678',
                  email: 'carlos@earthworkspro.com',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                  type: 'trade',
                  access: 'View Only',
                  isOnSite: true
                }
              ].map((member) => (
                <div 
                  key={member.id}
                  className="p-3 rounded-2xl bg-[#050811] border border-[#142036] hover:border-blue-500/40 shadow-sm flex items-center justify-between gap-3 transition-all"
                >
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative flex-shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#1A263E] shadow-sm"
                      />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#050811] ${
                        member.isOnSite ? 'bg-emerald-500' : 'bg-slate-500'
                      }`} title={member.isOnSite ? 'On Site Today' : 'Off Site'} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{member.name}</h4>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          member.type === 'gc'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {member.type === 'gc' ? 'GC' : 'Sub'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                        {member.role} • <span className="text-slate-500">{member.company}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add Member Action Trigger */}
            <button
              onClick={handleAddMember}
              className="w-full p-3 rounded-2xl bg-[#050811] hover:bg-[#0E1A33] border border-dashed border-[#1E325A] hover:border-blue-500/80 transition-all cursor-pointer text-xs font-bold text-blue-400 hover:text-white flex items-center justify-center gap-2 group active:scale-[0.99] mt-1"
            >
              <UserPlus className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>+ Add Another Team Member</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── 8. FINANCIAL FORECAST TAB (Professional Concise Copy) ─── */}
      {activeTab === 'forecast' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          
          {/* 1. Contingencies Section */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Contingencies</span>
              </h3>
              <button
                onClick={() => toggleCardCollapse('forecastContingencies')}
                className="p-1 rounded-lg bg-[#050811] hover:bg-[#0E1A33] border border-[#142036] text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={collapsedCards['forecastContingencies'] ? 'Maximize Card' : 'Minimize Card'}
              >
                {collapsedCards['forecastContingencies'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!collapsedCards['forecastContingencies'] && (
              <div className="grid grid-cols-2 gap-3 text-xs animate-fade-in">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Contingency Rate</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      value={contingencyPct}
                      onChange={(e) => setContingencyPct(Math.max(0, Number(e.target.value)))}
                      className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl pl-3 pr-7 text-amber-400 text-xs font-extrabold focus:outline-none focus:border-amber-500"
                    />
                    <span className="absolute right-3 text-xs font-bold text-amber-400">%</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Contingency Reserve</span>
                  <span className="text-xs font-black text-amber-400 mt-0.5">${(totalCost * contingencyPct / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Builder Fee Section */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Builder Fee</span>
              </h3>
              <button
                onClick={() => toggleCardCollapse('forecastBuilderFee')}
                className="p-1 rounded-lg bg-[#050811] hover:bg-[#0E1A33] border border-[#142036] text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={collapsedCards['forecastBuilderFee'] ? 'Maximize Card' : 'Minimize Card'}
              >
                {collapsedCards['forecastBuilderFee'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!collapsedCards['forecastBuilderFee'] && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Builder Fee Rate</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        value={builderFeePct}
                        onChange={(e) => setBuilderFeePct(Math.max(0, Number(e.target.value)))}
                        className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl pl-3 pr-7 text-blue-400 text-xs font-extrabold focus:outline-none focus:border-blue-500"
                      />
                      <span className="absolute right-3 text-xs font-bold text-blue-400">%</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036] flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Fee Amount</span>
                    <span className="text-xs font-black text-blue-400 mt-0.5">${(totalCost * builderFeePct / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#050811] border border-[#142036] flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-400 font-bold">Total Estimated Budget:</span>
                  <span className="font-black text-white text-sm">
                    ${(totalCost + (totalCost * contingencyPct / 100) + (totalCost * builderFeePct / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. ARV & Sale Section */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target ARV & Exit</span>
              </h3>
              <button
                onClick={() => toggleCardCollapse('forecastArv')}
                className="p-1 rounded-lg bg-[#050811] hover:bg-[#0E1A33] border border-[#142036] text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={collapsedCards['forecastArv'] ? 'Maximize Card' : 'Minimize Card'}
              >
                {collapsedCards['forecastArv'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!collapsedCards['forecastArv'] && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Target ARV ($)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        value={salePrice}
                        onChange={(e) => setSalePrice(Math.max(0, Number(e.target.value)))}
                        className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl pl-7 pr-3 text-white text-xs font-extrabold focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Closing Costs (%)</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        value={closingCostsPct}
                        onChange={(e) => setClosingCostsPct(Math.max(0, Number(e.target.value)))}
                        className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl pl-3 pr-7 text-white text-xs font-extrabold focus:outline-none focus:border-blue-500"
                      />
                      <span className="absolute right-3 text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Agent Commission (%)</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        value={agentCommissionPct}
                        onChange={(e) => setAgentCommissionPct(Math.max(0, Number(e.target.value)))}
                        className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl pl-3 pr-7 text-white text-xs font-extrabold focus:outline-none focus:border-blue-500"
                      />
                      <span className="absolute right-3 text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Other Costs ($)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        value={otherSellingCosts}
                        onChange={(e) => setOtherSellingCosts(Math.max(0, Number(e.target.value)))}
                        className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl pl-7 pr-3 text-white text-xs font-extrabold focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Selling Calculation Strip */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#142036] text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#050811] border border-[#142036]">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Closing Costs</span>
                    <span className="text-xs font-bold text-slate-300 block mt-0.5">${(salePrice * closingCostsPct / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#050811] border border-[#142036]">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Commission</span>
                    <span className="text-xs font-bold text-slate-300 block mt-0.5">${(salePrice * agentCommissionPct / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#050811] border border-[#142036]">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Net Proceeds</span>
                    <span className="text-xs font-black text-emerald-400 block mt-0.5">${(salePrice - (salePrice * (closingCostsPct + agentCommissionPct) / 100) - otherSellingCosts).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Loan Financing Section */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                <span>Loan Financing</span>
              </h3>
              <button
                onClick={() => toggleCardCollapse('forecastLoan')}
                className="p-1 rounded-lg bg-[#050811] hover:bg-[#0E1A33] border border-[#142036] text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={collapsedCards['forecastLoan'] ? 'Maximize Card' : 'Minimize Card'}
              >
                {collapsedCards['forecastLoan'] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!collapsedCards['forecastLoan'] && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Interest Rate (%)</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
                        className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl pl-3 pr-7 text-white text-xs font-extrabold focus:outline-none focus:border-blue-500"
                      />
                      <span className="absolute right-3 text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Loan Term (Months)</label>
                    <input
                      type="number"
                      value={carryingMonths}
                      onChange={(e) => setCarryingMonths(Math.max(1, Number(e.target.value)))}
                      className="w-full h-9 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs font-extrabold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Loan Options Comparison */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  {/* LTV Option (65% of ARV) */}
                  <div className="p-3 rounded-2xl bg-[#050811] border border-[#142036] flex flex-col gap-2">
                    <div className="flex items-center justify-between border-b border-[#142036] pb-2">
                      <span className="text-xs font-extrabold text-blue-400">LTV Option</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">65% ARV</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Max Loan:</span>
                      <span className="font-bold text-white">${(salePrice * 0.65).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Avg Monthly:</span>
                      <span className="font-bold text-blue-400">${((salePrice * 0.65 * (interestRate / 100)) / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Total Interest:</span>
                      <span className="font-extrabold text-white">${((salePrice * 0.65 * (interestRate / 100)) / 12 * carryingMonths).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>

                  {/* LTC Option (80% of Total Cost) */}
                  <div className="p-3 rounded-2xl bg-[#050811] border border-[#142036] flex flex-col gap-2">
                    <div className="flex items-center justify-between border-b border-[#142036] pb-2">
                      <span className="text-xs font-extrabold text-emerald-400">LTC Option</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">80% Cost</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Max Loan:</span>
                      <span className="font-bold text-white">${((lotPrice + totalCost) * 0.80).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Avg Monthly:</span>
                      <span className="font-bold text-emerald-400">${(((lotPrice + totalCost) * 0.80 * (interestRate / 100)) / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Total Interest:</span>
                      <span className="font-extrabold text-white">${(((lotPrice + totalCost) * 0.80 * (interestRate / 100)) / 12 * carryingMonths).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Deal Score Summary Card */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm">
                88
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Deal Score Analysis</h4>
                <p className="text-[11px] text-emerald-400 font-bold mt-0.5">88/100 · High Profit Potential</p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Approved
            </span>
          </div>

        </div>
      )}

      {/* ─── 9. LEARNING TAB (BuildScope AI Historical Intelligence & Benchmarks) ─── */}
      {activeTab === 'learning' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          
          {/* Section 1: AI Model Summary Card */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
                <span className="p-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <span>BuildScope AI Learning Engine</span>
              </h3>
              <span className="text-[10px] font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                v4.2 Trained
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036]">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Accuracy</span>
                <span className="text-xs font-black text-emerald-400 block mt-0.5">96.4%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036]">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Benchmark Projects</span>
                <span className="text-xs font-black text-white block mt-0.5">14 Homes</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#050811] border border-[#142036]">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Confidence</span>
                <span className="text-xs font-black text-blue-400 block mt-0.5">94 / 100</span>
              </div>
            </div>
          </div>

          {/* Section 2: AI Cost Optimization Insights */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Optimization Insights</span>
            </h3>

            <div className="flex flex-col gap-2 text-xs">
              <div className="p-3 rounded-xl bg-[#050811] border border-[#142036] flex flex-col gap-1">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>Foundation & Concrete Savings</span>
                  <span className="text-emerald-400 font-extrabold">-$600 Opportunity</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Historical average for 3,500 SF slab in Dallas County is $27,800. Current budget item #fdn-4 is $28,400. Re-negotiating pour rate can save ~$600.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#050811] border border-[#142036] flex flex-col gap-1">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>Engineering & Plans Alignment</span>
                  <span className="text-blue-400 font-extrabold">±1.8% Standard</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Truss engineering ($1,800) and soil report ($3,500) match historical averages from 14 similar custom home projects.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: CSI Division Benchmark Table */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
              <span>CSI Regional Cost Benchmarks</span>
            </h3>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#050811] border border-[#142036]">
                <div>
                  <span className="font-bold text-white block">Foundation & Site Work</span>
                  <span className="text-[10px] text-slate-400">Regional Avg: $27.8k</span>
                </div>
                <span className="font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  $28.4k (+2.1%)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#050811] border border-[#142036]">
                <div>
                  <span className="font-bold text-white block">Engineering & Design</span>
                  <span className="text-[10px] text-slate-400">Regional Avg: $14.2k</span>
                </div>
                <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  $13.9k (-2.1%)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#050811] border border-[#142036]">
                <div>
                  <span className="font-bold text-white block">Framing & Structure</span>
                  <span className="text-[10px] text-slate-400">Regional Avg: $13.1k</span>
                </div>
                <span className="font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  $11.6k (-11.4%)
                </span>
              </div>
            </div>

            <button
              onClick={() => alert("Project data submitted to BuildScope AI Learning Loop successfully!")}
              className="mt-1 w-full h-9 rounded-xl bg-[#050811] hover:bg-[#091122] border border-[#142036] text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Submit Project Data to AI Model Loop</span>
            </button>
          </div>

        </div>
      )}

      {/* ─── 10. ACTIVITY & TEAM CHAT TAB ─── */}
      {activeTab === 'activity' && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          
          {/* Main Card */}
          <div className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-md flex flex-col gap-3.5">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </span>
                  <span>Team Chat & Activity Log ({chatMessages.length})</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Real-time project discussions and team updates</p>
              </div>

              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                🟢 Live Team Feed
              </span>
            </div>

            {/* Interactive Send Message Bar */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Post a message or project update to team chat..."
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                className="flex-1 h-9 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="h-9 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md shadow-blue-600/30 flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>Send</span>
              </button>
            </form>

            {/* Real Team Messages List (Human discussions first, NO top AI clutter) */}
            <div className="flex flex-col gap-2.5 pt-1">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className="p-3 rounded-2xl bg-[#050811] border border-[#142036] hover:border-blue-500/30 flex items-start gap-3 text-xs transition-all shadow-sm"
                >
                  <div className={`w-8 h-8 rounded-xl ${msg.color} flex items-center justify-center font-extrabold flex-shrink-0 shadow-sm text-xs`}>
                    {msg.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-extrabold text-white">{msg.sender}</span>
                        <span className="text-[10px] text-slate-400 font-semibold truncate">
                          • {msg.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold flex-shrink-0">{msg.time}</span>
                    </div>
                    <p className="text-[12px] text-slate-300 font-medium leading-relaxed mt-1">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ─── 11. REPORTS & EXPORTS TAB (Global Design System Styled) ─── */}
      {activeTab === 'reports' && (
        <div className="flex flex-col gap-5 animate-fade-in">
          <div className="p-5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Reports & Exports</span>
            </h3>

            <div className="flex flex-col gap-2.5 text-xs">
              {/* 1. Detailed Budget PDF */}
              <button
                onClick={() => alert("Downloading Detailed Budget PDF...")}
                className="w-full h-12 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold flex items-center justify-between transition-all shadow-md shadow-blue-600/20 cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-white" />
                  <span>Detailed Budget PDF</span>
                </div>
                <span className="text-[9px] bg-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">PDF</span>
              </button>

              {/* 2. Budget Summary CSV */}
              <button
                onClick={() => alert("Exporting Budget Summary CSV...")}
                className="w-full h-12 px-4 rounded-2xl bg-[#091122] hover:bg-[#0E1A33] border border-[#172540] hover:border-slate-500 text-slate-200 font-extrabold flex items-center justify-between transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Budget Summary CSV</span>
                </div>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase">CSV</span>
              </button>

              {/* 3. Deal Analysis Report */}
              <button
                onClick={() => alert("Generating Deal Analysis Report...")}
                className="w-full h-12 px-4 rounded-2xl bg-[#091122] hover:bg-[#0E1A33] border border-[#172540] hover:border-slate-500 text-slate-200 font-extrabold flex items-center justify-between transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Deal Analysis Report</span>
                </div>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase">Report</span>
              </button>

              {/* 4. Cash-Flow Forecast */}
              <button
                onClick={() => alert("Exporting Cash-Flow Forecast...")}
                className="w-full h-12 px-4 rounded-2xl bg-[#091122] hover:bg-[#0E1A33] border border-[#172540] hover:border-slate-500 text-slate-200 font-extrabold flex items-center justify-between transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span>Cash-Flow Forecast</span>
                </div>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase">Forecast</span>
              </button>
            </div>
          </div>

          {/* Bottom Save Budget Action Button (Global Design System Primary) */}
          <div className="flex justify-center pt-1">
            <button
              onClick={() => showToast("Budget saved successfully!")}
              className="h-11 px-8 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 border border-blue-500/30 transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4 text-white" />
              <span>Save Budget</span>
            </button>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#091122]/95 border border-[#2563EB]/40 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold text-white animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
