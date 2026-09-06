import React, { useState, useEffect, useRef } from 'react';
import { Project, PunchItem, PunchStatus, Priority } from '../../types';
import { 
  Plus, MapPin, Trash2, Folder, ChevronLeft, 
  Search, SlidersHorizontal, ChevronDown, ChevronRight, 
  MoreVertical, Building2, Calendar, Eye, X, Check
} from 'lucide-react';

interface ProjectPunchListTabProps {
  project: Project;
  punchItems: PunchItem[];
  onCreatePunch: () => void;
  onOpenPunchDetails?: (item: PunchItem) => void;
  onUpdatePunchStatus?: (punchId: string, status: PunchStatus) => void;
  onDeletePunch?: (punchId: string) => void;
  onBack?: () => void;
}

export const ProjectPunchListTab: React.FC<ProjectPunchListTabProps> = ({
  project,
  punchItems,
  onCreatePunch,
  onUpdatePunchStatus,
  onDeletePunch,
  onBack
}) => {
  const [activeFilter, setActiveFilter] = useState<PunchStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProjectExpanded, setIsProjectExpanded] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeStatusDropdownId, setActiveStatusDropdownId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedTrade, setSelectedTrade] = useState<string>('All');
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string; location: string } | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<PunchItem[]>(() => {
    const projItems = punchItems.filter(p => p.projectId === project.id);
    return projItems.length > 0 ? projItems : punchItems;
  });

  // Keep items in sync with incoming punchItems prop
  useEffect(() => {
    const projItems = punchItems.filter(p => p.projectId === project.id);
    setItems(projItems.length > 0 ? projItems : punchItems);
  }, [punchItems, project.id]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) {
        setActiveStatusDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (punchId: string, newStatus: PunchStatus) => {
    setItems(prev => prev.map(p => p.id === punchId ? { ...p, status: newStatus } : p));
    if (onUpdatePunchStatus) onUpdatePunchStatus(punchId, newStatus);
    setActiveStatusDropdownId(null);
  };

  const handleDeletePunch = (punchId: string) => {
    setItems(prev => prev.filter(p => p.id !== punchId));
    if (onDeletePunch) onDeletePunch(punchId);
    setActiveMenuId(null);
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

        <button
          onClick={onCreatePunch}
          className="h-10 px-4 rounded-xl bg-[#1677FF] hover:bg-[#0F5FD7] text-white text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Item</span>
        </button>
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
              const photoUrl = item.photos && item.photos.length > 0 ? item.photos[0] : null;

              return (
                <div
                  key={item.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1677FF]/40 transition-all flex flex-col gap-3 shadow-2xs group relative"
                >
                  {/* Top Block: Photo on Left + Content on Right */}
                  <div className="flex items-start gap-3 min-w-0">
                    
                    {/* Left Evidence Photo Thumbnail */}
                    <div 
                      onClick={() => photoUrl && setPreviewPhoto({ url: photoUrl, title: item.title, location: item.location || '' })}
                      className={`relative w-[68px] h-[68px] sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0] flex-shrink-0 ${photoUrl ? 'cursor-pointer hover:opacity-95' : ''}`}
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#94A3B8] bg-slate-50 text-[11px] font-medium p-1 text-center">
                          <span>No photo</span>
                        </div>
                      )}
                    </div>

                    {/* Right Info Column */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      
                      {/* Row 1: Status Dot + Title + Status Dropdown + 3 Dots + Chevron */}
                      <div className="flex items-start justify-between gap-1.5">
                        
                        {/* Title with Status Dot */}
                        <div className="flex items-start gap-1.5 min-w-0 flex-1">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${config.dot}`} />
                          <h2 className="text-xs sm:text-[13px] font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#1677FF] transition-colors tracking-tight">
                            {item.title}
                          </h2>
                        </div>

                        {/* Action Controls */}
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                          
                          {/* Status Pill Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => {
                                setActiveStatusDropdownId(activeStatusDropdownId === item.id ? null : item.id);
                                setActiveMenuId(null);
                              }}
                              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border cursor-pointer transition-all active:scale-95 ${config.pillBg} ${config.pillText} ${config.pillBorder}`}
                            >
                              <span>{item.status}</span>
                              <ChevronDown className="w-3 h-3 stroke-[2.5]" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeStatusDropdownId === item.id && (
                              <div
                                ref={statusMenuRef}
                                className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl border border-[#E2E8F0] shadow-lg py-1 z-30 animate-fade-in"
                              >
                                {STATUS_OPTIONS.map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => handleStatusChange(item.id, st)}
                                    className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                                      item.status === st ? 'text-[#1677FF] font-bold bg-[#EAF3FF]/40' : 'text-[#0F172A]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[st].dot}`} />
                                      <span>{st}</span>
                                    </div>
                                    {item.status === st && <Check className="w-3 h-3 text-[#1677FF]" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* 3-Dots Action Menu */}
                          <div className="relative">
                            <button
                              onClick={() => {
                                setActiveMenuId(activeMenuId === item.id ? null : item.id);
                                setActiveStatusDropdownId(null);
                              }}
                              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                              title="More options"
                            >
                              <MoreVertical className="w-3 h-3 stroke-[2]" />
                            </button>

                            {activeMenuId === item.id && (
                              <div
                                ref={menuRef}
                                className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl border border-[#E2E8F0] shadow-lg py-1 z-30 animate-fade-in"
                              >
                                {photoUrl && (
                                  <button
                                    onClick={() => {
                                      setPreviewPhoto({ url: photoUrl, title: item.title, location: item.location || '' });
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-left text-xs font-medium text-[#0F172A] hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                                    <span>View Photo</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeletePunch(item.id)}
                                  className="w-full px-3 py-1.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                  <span>Delete Item</span>
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Chevron Right */}
                          <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all flex-shrink-0 cursor-pointer" />
                        </div>
                      </div>

                      {/* Row 2: Description Text */}
                      {item.description && (
                        <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 font-normal">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Footer Metadata (Trade, Location, Date) */}
                  <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#F1F5F9] text-xs text-[#64748B]">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Subcontractor Trade */}
                      <div className="flex items-center gap-1.5 min-w-0 max-w-[140px] sm:max-w-[180px]">
                        <Building2 className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs text-[#475569] font-medium truncate">
                          {item.assignedTo?.trade || 'General Contractor'}
                        </span>
                      </div>

                      {/* Location */}
                      {item.location && (
                        <div className="flex items-center gap-1.5 min-w-0 max-w-[140px] sm:max-w-[180px]">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                          <span className="text-[11px] sm:text-xs text-[#475569] font-medium truncate">
                            {item.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" />
                      <span className="text-[11px] sm:text-xs text-[#64748B] font-medium">
                        {item.createdDate || 'Apr 28, 2025'}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Evidence Photo Preview Modal ── */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
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
