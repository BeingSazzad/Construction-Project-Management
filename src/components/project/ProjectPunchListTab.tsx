import React, { useState, useEffect, useRef } from 'react';
import { Project, PunchItem, PunchStatus } from '../../types';
import { 
  Plus, MapPin, Trash2, Folder, ChevronLeft, 
  Search, SlidersHorizontal, ChevronDown, ChevronRight, 
  Building2, Calendar, Eye, X, Check, AlertCircle, Clock, Camera
} from 'lucide-react';

interface ProjectPunchListTabProps {
  project: Project;
  punchItems: PunchItem[];
  onCreatePunch?: () => void;
  onOpenPunchDetails?: (item: PunchItem) => void;
  onUpdatePunchStatus?: (punchId: string, status: PunchStatus) => void;
  onDeletePunch?: (punchId: string) => void;
  onBack?: () => void;
}

export const ProjectPunchListTab: React.FC<ProjectPunchListTabProps> = ({
  project,
  punchItems,
  onCreatePunch,
  onOpenPunchDetails,
  onUpdatePunchStatus,
  onDeletePunch,
  onBack
}) => {
  const [activeFilter, setActiveFilter] = useState<PunchStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProjectExpanded, setIsProjectExpanded] = useState(true);
  const [selectedPunchItem, setSelectedPunchItem] = useState<PunchItem | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedTrade, setSelectedTrade] = useState<string>('All');
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string; location: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<PunchItem[]>(() => {
    return punchItems.filter(p => !p.projectId || p.projectId === project.id);
  });

  // Keep items in sync with incoming punchItems prop
  useEffect(() => {
    setItems(punchItems.filter(p => !p.projectId || p.projectId === project.id));
  }, [punchItems, project.id]);

  const handleAttachPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPunchItem) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updatedPhotos = [...(selectedPunchItem.photos || []), dataUrl];
      const updated = { ...selectedPunchItem, photos: updatedPhotos };
      setSelectedPunchItem(updated);
      setItems(prev => prev.map(p => p.id === updated.id ? updated : p));
    };
    reader.readAsDataURL(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = (photoIdx: number) => {
    if (!selectedPunchItem) return;
    const updatedPhotos = (selectedPunchItem.photos || []).filter((_, i) => i !== photoIdx);
    const updated = { ...selectedPunchItem, photos: updatedPhotos };
    setSelectedPunchItem(updated);
    setItems(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleStatusChange = (punchId: string, newStatus: PunchStatus) => {
    setItems(prev => prev.map(p => p.id === punchId ? { ...p, status: newStatus } : p));
    if (selectedPunchItem && selectedPunchItem.id === punchId) {
      setSelectedPunchItem(prev => prev ? { ...prev, status: newStatus } : null);
    }
    if (onUpdatePunchStatus) {
      onUpdatePunchStatus(punchId, newStatus);
    }
  };

  const handleDeletePunch = (punchId: string) => {
    setItems(prev => prev.filter(p => p.id !== punchId));
    if (selectedPunchItem && selectedPunchItem.id === punchId) {
      setSelectedPunchItem(null);
    }
    setIsConfirmingDelete(false);
    if (onDeletePunch) {
      onDeletePunch(punchId);
    }
  };

  // Distinct trade list for filter
  const uniqueTrades = Array.from(new Set(items.map(i => i.assignedTo?.trade).filter(Boolean))) as string[];

  // Filter logic
  const filteredItems = items.filter(item => {
    // Status filter
    if (activeFilter !== 'All' && item.status !== activeFilter) return false;
    
    // Priority filter
    if (selectedPriority !== 'All' && item.priority !== selectedPriority) return false;

    // Trade filter
    if (selectedTrade !== 'All' && item.assignedTo?.trade !== selectedTrade) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q) || false;
      const matchLoc = item.location?.toLowerCase().includes(q) || false;
      const matchTrade = item.assignedTo?.trade?.toLowerCase().includes(q) || false;
      return matchTitle || matchDesc || matchLoc || matchTrade;
    }

    return true;
  });

  const openCount = items.filter(p => p.status === 'Open' || p.status === 'In Progress').length;

  // Status configuration matching mockup exactly
  const STATUS_CONFIG: Record<PunchStatus, { dot: string; pillBg: string; pillText: string; pillBorder: string }> = {
    'Open': {
      dot: 'bg-[#F59E0B]',
      pillBg: 'bg-[#EAF3FF]',
      pillText: 'text-[#1677FF]',
      pillBorder: 'border-[#1677FF]/20'
    },
    'In Progress': {
      dot: 'bg-[#1677FF]',
      pillBg: 'bg-[#EAF3FF]',
      pillText: 'text-[#1677FF]',
      pillBorder: 'border-[#1677FF]/20'
    },
    'Resolved': {
      dot: 'bg-[#10A976]',
      pillBg: 'bg-[#E9F9F3]',
      pillText: 'text-[#10A976]',
      pillBorder: 'border-[#10A976]/25'
    },
    'Verified': {
      dot: 'bg-[#8B5CF6]',
      pillBg: 'bg-[#F4F1FD]',
      pillText: 'text-[#8B5CF6]',
      pillBorder: 'border-[#8B5CF6]/25'
    },
    'Closed': {
      dot: 'bg-[#94A3B8]',
      pillBg: 'bg-slate-100',
      pillText: 'text-slate-600',
      pillBorder: 'border-slate-200'
    }
  };

  const STATUS_OPTIONS: PunchStatus[] = ['Open', 'In Progress', 'Resolved', 'Verified'];

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-4 sm:px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] bg-[#F8FAFC] min-h-screen animate-fade-in">
      
      {/* Sub-nav switcher: Tasks | Punch List */}
      {onBack && (
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-xl w-fit border border-[#E2E8F0]">
          <button
            onClick={onBack}
            className="px-3 py-1 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            Tasks
          </button>
          <button className="px-3 py-1 rounded-lg text-xs font-bold bg-white text-[#1677FF] shadow-2xs">
            Punch List ({items.length})
          </button>
        </div>
      )}

      {/* ── 1. Top Header: Back, Title, Open Count & New Item CTA ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] text-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs active:scale-95 flex-shrink-0"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight leading-tight">Punch List</h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-medium">
              {openCount} open items
            </p>
          </div>
        </div>

        {onCreatePunch && (
        <button
          onClick={onCreatePunch}
          className="h-10 px-4 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Item</span>
        </button>
        )}
      </div>

      {/* ── 2. Filter Pills Bar (All, Open, In Progress, Resolved, Verified) ── */}
      <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
        {/* 'All' pill */}
        <button
          onClick={() => setActiveFilter('All')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
            activeFilter === 'All'
              ? 'bg-[#1677FF] border-[#1677FF] text-white shadow-2xs'
              : 'bg-white text-[#475569] border-[#E2E8F0] hover:bg-slate-50'
          }`}
        >
          All
        </button>

        {/* Status Pills with back-lit colored indicator dots */}
        {(['Open', 'In Progress', 'Resolved', 'Verified'] as const).map((st) => {
          const isActive = activeFilter === st;
          const config = STATUS_CONFIG[st];
          return (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-[#1677FF] border-[#1677FF] text-white font-semibold shadow-2xs'
                  : 'bg-white text-[#475569] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-white' : config.dot}`} />
              <span>{st}</span>
            </button>
          );
        })}
      </div>

      {/* ── 3. Search & Filter Bar ── */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xs focus-within:border-[#1677FF] transition-colors">
          <Search className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search punch list items..."
            className="w-full bg-transparent border-none text-xs sm:text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#94A3B8] hover:text-[#0F172A] p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`px-3.5 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all shadow-2xs flex-shrink-0 ${
            isFilterOpen || selectedPriority !== 'All' || selectedTrade !== 'All'
              ? 'bg-[#EAF3FF] border-[#1677FF] text-[#1677FF]'
              : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-current" />
          <span>Filter</span>
        </button>
      </div>

      {/* Filter Expansion Tray */}
      {isFilterOpen && (
        <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col gap-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#0F172A]">Refine Filters</span>
            <button
              onClick={() => {
                setSelectedPriority('All');
                setSelectedTrade('All');
                setActiveFilter('All');
              }}
              className="text-xs text-[#1677FF] hover:underline font-semibold cursor-pointer"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#64748B] block mb-1">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-medium focus:outline-hidden"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#64748B] block mb-1">Subcontractor</label>
              <select
                value={selectedTrade}
                onChange={(e) => setSelectedTrade(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-medium focus:outline-hidden"
              >
                <option value="All">All Subcontractors</option>
                {uniqueTrades.map(trade => (
                  <option key={trade} value={trade}>{trade}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Project Group Header Accordion ── */}
      <div 
        onClick={() => setIsProjectExpanded(!isProjectExpanded)}
        className="flex items-center justify-between py-1 cursor-pointer select-none group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Folder className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
          <span className="text-sm sm:text-base font-bold text-[#0F172A] truncate">
            {project.name || 'Snell Isle Residence'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#64748B] group-hover:text-[#0F172A] font-medium flex-shrink-0 transition-colors">
          <span>{filteredItems.length} items</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProjectExpanded ? '' : '-rotate-90'}`} />
        </div>
      </div>

      {/* ── 5. Punch Cards Feed ── */}
      {isProjectExpanded && (
        <div className="flex flex-col gap-3">
          {filteredItems.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] text-center flex flex-col items-center justify-center gap-2 shadow-2xs">
              <Folder className="w-8 h-8 text-[#94A3B8]" />
              <p className="text-sm font-bold text-[#0F172A]">No punch list items found</p>
              <p className="text-xs text-[#64748B] font-medium">Try clearing your filters or tap "+ New Item" to create one.</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const config = STATUS_CONFIG[item.status] || STATUS_CONFIG['Open'];
              const photoCount = item.photos ? item.photos.length : 0;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedPunchItem(item);
                    if (onOpenPunchDetails) onOpenPunchDetails(item);
                  }}
                  className="py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-xl sm:rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1677FF]/50 hover:shadow-xs transition-all flex items-center justify-between gap-3 group cursor-pointer active:scale-[0.99]"
                >
                  {/* Left: Status Icon Dot + Content */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Status Indicator Icon Badge */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${config.pillBg} ${config.pillBorder}`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                    </div>

                    {/* Title & Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h2 className="text-xs sm:text-sm font-bold text-[#0F172A] leading-snug truncate group-hover:text-[#1677FF] transition-colors">
                          {item.title}
                        </h2>
                        {(item.priority === 'High' || item.priority === 'Critical') && (
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[9px] font-bold border border-rose-200 uppercase shrink-0">
                            High
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] truncate">
                        {item.assignedTo?.trade && (
                          <span className="truncate font-medium text-[#475569]">
                            {item.assignedTo.trade}
                          </span>
                        )}
                        {item.assignedTo?.trade && item.location && (
                          <span className="text-slate-300">•</span>
                        )}
                        {item.location && (
                          <span className="truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0 inline" />
                            {item.location}
                          </span>
                        )}
                        {photoCount > 0 && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1677FF] bg-[#EAF3FF] px-1.5 py-0.2 rounded-md shrink-0">
                              <Camera className="w-2.5 h-2.5" />
                              <span>{photoCount}</span>
                            </span>
                          </>
                        )}
                        {item.createdDate && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="shrink-0">{item.createdDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Clean Status Pill + Chevron Arrow */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${config.pillBg} ${config.pillText} ${config.pillBorder}`}>
                      {item.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── 6. Punch Item Details Modal (Clean 390px width, uncluttered, normal info) ── */}
      {selectedPunchItem && (
        <div 
          onClick={() => {
            setSelectedPunchItem(null);
            setIsConfirmingDelete(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-[390px] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up border border-[#E2E8F0]"
          >
            {/* Modal Header */}
            <div className="px-4 py-3.5 border-b border-[#F1F5F9] flex items-start justify-between gap-2.5 bg-white sticky top-0 z-10">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_CONFIG[selectedPunchItem.status]?.pillBg} ${STATUS_CONFIG[selectedPunchItem.status]?.pillText} ${STATUS_CONFIG[selectedPunchItem.status]?.pillBorder}`}>
                    {selectedPunchItem.status}
                  </span>
                  {selectedPunchItem.priority && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      selectedPunchItem.priority === 'High' || selectedPunchItem.priority === 'Critical'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : selectedPunchItem.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {selectedPunchItem.priority}
                    </span>
                  )}
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[#0F172A] leading-snug">
                  {selectedPunchItem.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedPunchItem(null);
                  setIsConfirmingDelete(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors shrink-0 mt-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="px-4 py-3.5 overflow-y-auto flex flex-col gap-3.5 text-xs">
              
              {/* Photo Evidence (if any, clean and compact) */}
              {selectedPunchItem.photos && selectedPunchItem.photos.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B] font-semibold flex items-center gap-1">
                      <Camera className="w-3 h-3 text-[#1677FF]" />
                      Evidence ({selectedPunchItem.photos.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[#1677FF] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Add Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {selectedPunchItem.photos.map((url, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-[#E2E8F0] group h-28 bg-slate-900 shadow-2xs">
                        <img
                          src={url}
                          alt={`Evidence ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          onClick={() => setPreviewPhoto({ url, title: selectedPunchItem.title, location: selectedPunchItem.location || '' })}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(idx);
                          }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#CBD5E1] bg-slate-50/70 hover:bg-blue-50/50 hover:border-[#1677FF]/40 transition-colors flex items-center justify-center gap-2 cursor-pointer text-[#64748B]"
                >
                  <Camera className="w-4 h-4 text-[#1677FF]" />
                  <span className="text-xs font-semibold text-[#0F172A]">Attach Photo Evidence</span>
                </button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAttachPhoto}
                accept="image/*"
                className="hidden"
              />

              {/* Progress / Status Switcher (Minimal clean horizontal pill selector, no huge outer box!) */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Workflow Progress
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['Open', 'In Progress', 'Resolved', 'Verified', 'Closed'] as PunchStatus[]).map((st) => {
                    const isSelected = selectedPunchItem.status === st;
                    const stConfig = STATUS_CONFIG[st];

                    return (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedPunchItem.id, st)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? `${stConfig.pillBg} ${stConfig.pillText} ${stConfig.pillBorder} font-bold shadow-2xs ring-1 ring-[#1677FF]/30`
                            : 'bg-white border-[#E2E8F0] text-[#64748B] hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${stConfig.dot}`} />
                        <span>{st}</span>
                        {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description & Notes (Clean typography, no bulky box!) */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Description & Notes
                </span>
                <p className="text-xs text-[#334155] leading-relaxed">
                  {selectedPunchItem.description || 'No detailed description provided.'}
                </p>
                {selectedPunchItem.resolutionNote && (
                  <p className="text-xs text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200 mt-1">
                    <span className="font-bold">Resolution: </span>{selectedPunchItem.resolutionNote}
                  </p>
                )}
              </div>

              {/* Item Information: Clean Key-Value List with Subtle Dividers (NO CLUNKY BOXES!) */}
              <div className="pt-2 border-t border-[#F1F5F9] flex flex-col gap-2 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Details
                </span>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#64748B] flex items-center gap-1.5 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Location</span>
                  </span>
                  <span className="font-semibold text-[#0F172A] truncate text-right">
                    {selectedPunchItem.location || 'Site Wide'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#64748B] flex items-center gap-1.5 shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-[#1677FF]" />
                    <span>Subcontractor</span>
                  </span>
                  <span className="font-semibold text-[#0F172A] truncate text-right">
                    {selectedPunchItem.assignedTo?.trade || 'General Contractor'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#64748B] flex items-center gap-1.5 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reported Date</span>
                  </span>
                  <span className="font-semibold text-[#0F172A] text-right">
                    {selectedPunchItem.createdDate || 'Apr 28, 2025'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#64748B] flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Due Date</span>
                  </span>
                  <span className="font-semibold text-[#0F172A] text-right">
                    {selectedPunchItem.dueDate || 'Prior to Inspection'}
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions: Delete & Done */}
            <div className="p-3.5 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between gap-2.5">
              {isConfirmingDelete ? (
                <div className="flex items-center gap-2 w-full justify-between animate-fade-in">
                  <span className="text-xs font-semibold text-rose-600">Delete this item?</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsConfirmingDelete(false)}
                      className="px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium text-[#475569] hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeletePunch(selectedPunchItem.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsConfirmingDelete(true)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPunchItem(null);
                      setIsConfirmingDelete(false);
                    }}
                    className="px-5 py-1.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                  >
                    Done
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── 7. Evidence Photo Preview Fullscreen Modal ── */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col animate-scale-up"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">{previewPhoto.title}</h3>
                {previewPhoto.location && (
                  <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{previewPhoto.location}</span>
                  </p>
                )}
              </div>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-black flex items-center justify-center max-h-[70vh]">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.title}
                className="max-h-[65vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
