import React, { useState, useEffect, useRef } from 'react';
import { Project, PunchItem, PunchStatus } from '../../types';
import { 
  Plus, MapPin, Trash2, Folder, ChevronLeft, 
  Search, ChevronRight, ChevronDown, 
  X, Camera
} from 'lucide-react';

interface ProjectPunchListTabProps {
  project?: Project;
  projects?: Project[];
  punchItems: PunchItem[];
  onCreatePunch?: () => void;
  onOpenPunchDetails?: (item: PunchItem) => void;
  onUpdatePunchStatus?: (punchId: string, status: PunchStatus) => void;
  onDeletePunch?: (punchId: string) => void;
  onBack?: () => void;
}

export const ProjectPunchListTab: React.FC<ProjectPunchListTabProps> = ({
  project,
  projects,
  punchItems,
  onCreatePunch,
  onOpenPunchDetails,
  onUpdatePunchStatus,
  onDeletePunch,
  onBack
}) => {
  const [activeFilter, setActiveFilter] = useState<PunchStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPunchItem, setSelectedPunchItem] = useState<PunchItem | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string; location: string } | null>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Determine active project list
  const projectList: Project[] = (projects && projects.length > 0)
    ? projects
    : (project ? [project] : []);

  // Active selected project for drill-down view (null = All Projects directory)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => {
    // If only one project is provided, default to that project
    if (project && (!projects || projects.length <= 1)) {
      return project.id;
    }
    return null;
  });

  const [items, setItems] = useState<PunchItem[]>(() => {
    if (projects && projects.length > 0) return punchItems;
    if (project) return punchItems.filter(p => !p.projectId || p.projectId === project.id);
    return punchItems;
  });

  // Keep items in sync with incoming punchItems prop
  useEffect(() => {
    if (projects && projects.length > 0) {
      setItems(punchItems);
    } else if (project) {
      setItems(punchItems.filter(p => !p.projectId || p.projectId === project.id));
    } else {
      setItems(punchItems);
    }
  }, [punchItems, project?.id, projects]);

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

  // Multiple photos upload handler inside modal
  const handleAttachPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedPunchItem) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setSelectedPunchItem((prev) => {
            if (!prev) return null;
            const updatedPhotos = [...(prev.photos || []), dataUrl];
            const updated = { ...prev, photos: updatedPhotos };
            setItems((list) => list.map((p) => (p.id === updated.id ? updated : p)));
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    });
    if (modalFileInputRef.current) modalFileInputRef.current.value = '';
  };

  // Remove photo from punch item
  const handleRemovePhoto = (photoIdx: number) => {
    if (!selectedPunchItem) return;
    const updatedPhotos = (selectedPunchItem.photos || []).filter((_, i) => i !== photoIdx);
    const updated = { ...selectedPunchItem, photos: updatedPhotos };
    setSelectedPunchItem(updated);
    setItems((list) => list.map((p) => (p.id === updated.id ? updated : p)));
  };

  const currentProject = selectedProjectId ? projectList.find(p => p.id === selectedProjectId) : null;
  const currentProjectItems = selectedProjectId
    ? items.filter(p => (!p.projectId && selectedProjectId === 'proj-1') || p.projectId === selectedProjectId)
    : [];

  const filteredProjectItems = currentProjectItems.filter((item) => {
    // Status filter
    if (activeFilter !== 'All' && item.status !== activeFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q) || false;
      const matchLoc = item.location?.toLowerCase().includes(q) || false;
      const matchAssignee = item.assignedTo?.name?.toLowerCase().includes(q) || false;
      return matchTitle || matchDesc || matchLoc || matchAssignee;
    }

    return true;
  });

  const matchingProjects = projectList.filter((proj) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      proj.name.toLowerCase().includes(q) ||
      proj.code?.toLowerCase().includes(q) ||
      proj.location?.toLowerCase().includes(q)
    );
  });

  const openCount = items.filter(p => p.status === 'Open' || p.status === 'In Progress').length;

  // Status configuration
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

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-4 sm:px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] bg-[#F8FAFC] min-h-screen animate-fade-in">

      {!selectedProjectId ? (
        /* ── Level 1: All Projects Directory (Click project to drill down) ── */
        <>
          {/* Header */}
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
                  {openCount} open items across {projectList.length} projects · Select project
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

          {/* Search Projects */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xs focus-within:border-[#1677FF] transition-colors">
            <Search className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name, code, or location..."
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

          {/* Project List (Clicking navigates to that project's punch list details) */}
          <div className="flex flex-col gap-2.5">
            {matchingProjects.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] text-center text-xs text-[#94A3B8]">
                No projects match "{searchQuery}"
              </div>
            ) : (
              matchingProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setSearchQuery('');
                    setActiveFilter('All');
                  }}
                  className="p-3.5 sm:p-4 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#1677FF]/60 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Folder className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors truncate">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-0.5 truncate flex items-center gap-1.5">
                        {proj.code && <span className="font-semibold text-[#475569]">{proj.code}</span>}
                        {proj.code && proj.location && <span>•</span>}
                        {proj.location && <span className="truncate">{proj.location}</span>}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* ── Level 2: Project Punch List Details View ── */
        <>
          {/* Header with Back to All Projects */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => {
                  setSelectedProjectId(null);
                  setSearchQuery('');
                  setActiveFilter('All');
                }}
                className="h-9 px-3 rounded-xl bg-white border border-[#E2E8F0] text-xs font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-2xs"
                title="Back to All Projects"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
                <span>Projects</span>
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight leading-tight truncate">
                  {currentProject?.name}
                </h1>
                <p className="text-xs text-[#64748B] mt-0.5 font-medium truncate">
                  Punch List · {currentProjectItems.length} items ({currentProjectItems.filter(p => p.status === 'Open' || p.status === 'In Progress').length} open)
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

          {/* Filter Pills Bar (All, Open, In Progress, Resolved, Closed) */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
            <button
              onClick={() => setActiveFilter('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                activeFilter === 'All'
                  ? 'bg-[#1677FF] border-[#1677FF] text-white shadow-2xs'
                  : 'bg-white text-[#475569] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              All ({currentProjectItems.length})
            </button>

            {(['Open', 'In Progress', 'Resolved', 'Closed'] as const).map((st) => {
              const count = currentProjectItems.filter(p => p.status === st).length;
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
                  <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xs focus-within:border-[#1677FF] transition-colors">
            <Search className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items in this project..."
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

          {/* Project Items Container (Single clean list view with hairline dividers) */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            {filteredProjectItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#94A3B8] font-medium flex flex-col items-center justify-center gap-2">
                <Folder className="w-8 h-8 text-[#CBD5E1]" />
                <p className="text-sm font-bold text-[#0F172A]">No punch list items found</p>
                <p className="text-xs text-[#64748B]">Try changing the filter or search keyword.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F1F5F9]">
                {filteredProjectItems.map((item) => {
                  const config = STATUS_CONFIG[item.status] || STATUS_CONFIG['Open'];

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedPunchItem(item);
                        if (onOpenPunchDetails) onOpenPunchDetails(item);
                      }}
                      className="py-3 px-4 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer group active:bg-slate-50"
                    >
                      {/* Left: Dot + Title */}
                      <div className="min-w-0 flex-1 flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
                        <h2 className="text-xs sm:text-sm font-medium text-[#0F172A] truncate group-hover:text-[#1677FF] transition-colors">
                          {item.title}
                        </h2>
                      </div>

                      {/* Right: Status Pill + Chevron */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${config.pillBg} ${config.pillText} ${config.pillBorder}`}>
                          {item.status}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── 5. Punch Item Details Modal (Minimal, 390px, Exact Project & Multiple Photos) ── */}
      {selectedPunchItem && (
        <div 
          onClick={() => {
            setSelectedPunchItem(null);
            setIsConfirmingDelete(false);
          }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-[390px] max-h-[85vh] flex flex-col shadow-xl overflow-hidden animate-scale-up border border-[#E2E8F0]"
          >
            {/* Header: Status Indicator + Title + Close */}
            <div className="px-4 py-3 border-b border-[#F1F5F9] flex items-center justify-between gap-3 bg-white">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[selectedPunchItem.status]?.dot}`} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    {selectedPunchItem.status}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[#0F172A] truncate">
                  {selectedPunchItem.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedPunchItem(null);
                  setIsConfirmingDelete(false);
                }}
                className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body: Pure minimal info, only actual status */}
            <div className="px-4 py-3 overflow-y-auto flex flex-col gap-3 text-xs">

              {/* Description */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Description</span>
                <p className="text-xs text-[#334155] leading-relaxed">
                  {selectedPunchItem.description || 'No description provided.'}
                </p>
              </div>

              {/* Details List (Perfect uniform row heights and padding) */}
              <div className="py-1 border-y border-[#F1F5F9] flex flex-col divide-y divide-[#F8FAFC]">
                
                {/* 1. Project */}
                <div className="flex items-center justify-between py-1.5 text-xs min-h-[30px]">
                  <span className="text-[#64748B] font-medium">Project</span>
                  <span className="font-semibold text-[#0F172A] truncate max-w-[210px] text-right">
                    {selectedPunchItem.projectName || 
                      projectList.find(p => p.id === selectedPunchItem.projectId)?.name || 
                      project?.name || 
                      'Snell Isle Residence'}
                  </span>
                </div>

                {/* 2. Status (Sleek, compact h-6 pill aligned with text) */}
                <div className="flex items-center justify-between py-1.5 text-xs min-h-[30px]">
                  <span className="text-[#64748B] font-medium">Status</span>
                  <div className="relative inline-flex items-center">
                    <select
                      value={selectedPunchItem.status}
                      onChange={(e) => handleStatusChange(selectedPunchItem.id, e.target.value as PunchStatus)}
                      className={`h-6 text-[11px] font-semibold pl-2 pr-5 rounded-md border cursor-pointer outline-none transition-colors appearance-none ${STATUS_CONFIG[selectedPunchItem.status]?.pillBg} ${STATUS_CONFIG[selectedPunchItem.status]?.pillText} ${STATUS_CONFIG[selectedPunchItem.status]?.pillBorder}`}
                    >
                      {(['Open', 'In Progress', 'Resolved', 'Closed'] as PunchStatus[]).map((st) => (
                        <option key={st} value={st} className="text-[#0F172A] bg-white font-normal">
                          {st}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={`w-3 h-3 absolute right-1.5 pointer-events-none ${STATUS_CONFIG[selectedPunchItem.status]?.pillText}`} />
                  </div>
                </div>

                {/* 3. Assignee */}
                <div className="flex items-center justify-between py-1.5 text-xs min-h-[30px]">
                  <span className="text-[#64748B] font-medium">Assignee</span>
                  <span className="font-semibold text-[#0F172A] truncate max-w-[210px] text-right">
                    {selectedPunchItem.assignedTo?.name 
                      ? `${selectedPunchItem.assignedTo.name}${selectedPunchItem.assignedTo.role ? ` (${selectedPunchItem.assignedTo.role})` : ''}`
                      : (selectedPunchItem.assignedTo?.trade || 'John Smith (Field Superintendent)')}
                  </span>
                </div>

                {/* 4. Location */}
                <div className="flex items-center justify-between py-1.5 text-xs min-h-[30px]">
                  <span className="text-[#64748B] font-medium">Location</span>
                  <span className="font-semibold text-[#0F172A] truncate max-w-[210px] text-right">
                    {selectedPunchItem.location || 'Site'}
                  </span>
                </div>

                {/* 5. Priority */}
                <div className="flex items-center justify-between py-1.5 text-xs min-h-[30px]">
                  <span className="text-[#64748B] font-medium">Priority</span>
                  <span className="font-semibold text-[#0F172A] text-right">
                    {selectedPunchItem.priority || 'Normal'}
                  </span>
                </div>

                {/* 6. Due Date */}
                <div className="flex items-center justify-between py-1.5 text-xs min-h-[30px]">
                  <span className="text-[#64748B] font-medium">Due Date</span>
                  <span className="font-semibold text-[#0F172A] text-right">
                    {selectedPunchItem.dueDate || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Photo Evidence Section (Multiple Photos Support) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Photo Evidence {selectedPunchItem.photos && selectedPunchItem.photos.length > 0 ? `(${selectedPunchItem.photos.length})` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    className="text-[11px] font-bold text-[#1677FF] hover:text-[#0958D9] flex items-center gap-1 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>+ Add Photo</span>
                  </button>
                </div>

                {/* Hidden input for adding multiple photos */}
                <input
                  ref={modalFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleAttachPhotos}
                />

                {/* Photos Grid / Thumbnails */}
                {(!selectedPunchItem.photos || selectedPunchItem.photos.length === 0) ? (
                  <div 
                    onClick={() => modalFileInputRef.current?.click()}
                    className="py-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#1677FF] transition-colors"
                  >
                    <Camera className="w-4 h-4 text-[#94A3B8]" />
                    <span className="text-[11px] text-[#64748B] font-medium">No photos attached. Click to add.</span>
                  </div>
                ) : selectedPunchItem.photos.length === 1 ? (
                  <div className="relative group rounded-xl overflow-hidden border border-[#E2E8F0] h-36 bg-slate-900">
                    <img
                      src={selectedPunchItem.photos[0]}
                      alt="Evidence"
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setPreviewPhoto({ url: selectedPunchItem.photos[0], title: selectedPunchItem.title, location: selectedPunchItem.location || '' })}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(0)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedPunchItem.photos.map((photoUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#E2E8F0] aspect-square bg-slate-900">
                        <img
                          src={photoUrl}
                          alt={`Evidence ${idx + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setPreviewPhoto({ url: photoUrl, title: `${selectedPunchItem.title} (${idx + 1}/${selectedPunchItem.photos.length})`, location: selectedPunchItem.location || '' })}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer: Delete & Done */}
            <div className="px-4 py-3 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between gap-2">
              {isConfirmingDelete ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-rose-600 font-medium">Delete item?</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsConfirmingDelete(false)}
                      className="px-2.5 py-1 text-xs text-[#64748B] hover:bg-slate-200 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeletePunch(selectedPunchItem.id)}
                      className="px-2.5 py-1 text-xs text-white bg-rose-600 hover:bg-rose-700 rounded-md font-medium"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsConfirmingDelete(true)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPunchItem(null);
                      setIsConfirmingDelete(false);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Evidence Photo Preview Fullscreen Modal ── */}
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
