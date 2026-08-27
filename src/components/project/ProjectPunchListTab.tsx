import React, { useState } from 'react';
import { Project, PunchItem, PunchStatus } from '../../types';
import { Plus, MapPin, Trash2, ChevronDown, Folder, CheckCircle2 } from 'lucide-react';

interface ProjectPunchListTabProps {
  project: Project;
  punchItems: PunchItem[];
  onCreatePunch: () => void;
  onOpenPunchDetails: (item: PunchItem) => void;
  onUpdatePunchStatus: (punchId: string, status: PunchStatus) => void;
}

export const ProjectPunchListTab: React.FC<ProjectPunchListTabProps> = ({
  project,
  punchItems,
  onCreatePunch,
  onOpenPunchDetails,
  onUpdatePunchStatus
}) => {
  const [activeFilter, setActiveFilter] = useState<PunchStatus | 'All'>('All');
  const [items, setItems] = useState<PunchItem[]>(
    punchItems.filter(p => p.projectId === project.id)
  );

  const filteredItems = items.filter(p => {
    if (activeFilter === 'All') return true;
    return p.status === activeFilter;
  });

  const handleStatusChange = (punchId: string, newStatus: PunchStatus) => {
    setItems(prev => prev.map(p => p.id === punchId ? { ...p, status: newStatus } : p));
    if (onUpdatePunchStatus) onUpdatePunchStatus(punchId, newStatus);
  };

  const handleDeletePunch = (punchId: string) => {
    setItems(prev => prev.filter(p => p.id !== punchId));
  };

  const STATUS_DOT: Record<PunchStatus, string> = {
    'Open': 'bg-amber-400',
    'In Progress': 'bg-blue-400',
    'Resolved': 'bg-emerald-400',
    'Verified': 'bg-teal-400',
    'Closed': 'bg-slate-500',
  };

  return (
    <div className="w-full flex flex-col gap-3.5 pt-2 pb-24 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Filter Pills & Add Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 flex-1">
          {(['All', 'Open', 'In Progress', 'Resolved', 'Verified'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#2563EB] text-white font-bold shadow-md shadow-blue-500/20' 
                    : 'bg-[#070D1A] text-slate-400 hover:text-white border border-[#142036]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <button
          onClick={onCreatePunch}
          className="h-8 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1 cursor-pointer flex-shrink-0 shadow-sm active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* 2. Group Header */}
      <div className="flex items-center gap-2 px-1 pt-1">
        <Folder className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-bold text-white tracking-tight">{project.name}</span>
        <span className="text-xs text-slate-500 font-semibold">{filteredItems.length}</span>
      </div>

      {/* 3. Punch Items List */}
      <div className="flex flex-col gap-2.5">
        {filteredItems.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#070D1A] border border-[#142036] text-center text-slate-400 text-xs">
            No punch list items found under this status.
          </div>
        ) : (
          filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] hover:border-[#1E325A] transition-all flex flex-col gap-2.5 shadow-sm"
              >
                {/* Header Row: Dot + Title + Status Dropdown + Delete */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[item.status] || 'bg-amber-400'}`} />
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Status Dropdown Selector */}
                    <div className="relative">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as PunchStatus)}
                        className="h-7 px-2.5 pr-6 bg-[#0E1726] border border-[#1E2E48] rounded-xl text-[11px] font-bold text-slate-300 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Verified">Verified</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Trash Delete Button */}
                    <button
                      onClick={() => handleDeletePunch(item.id)}
                      className="w-7 h-7 rounded-xl bg-[#140D12] border border-[#2E161C] hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Tags: Trade + Location */}
                <div className="flex items-center gap-2 flex-wrap text-[10px]">
                  <span className="px-2 py-0.5 rounded-lg bg-[#0E1726] text-slate-300 border border-[#1A2840] font-semibold">
                    {item.assignedTo?.trade || 'General Trade'}
                  </span>

                  {item.location && (
                    <span className="flex items-center gap-1 text-slate-400 font-medium">
                      <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                      <span>{item.location}</span>
                    </span>
                  )}
                </div>

                {/* Attached Photo Thumbnail */}
                {item.photos && item.photos.length > 0 && (
                  <div className="pt-1 flex items-center gap-2">
                    <img
                      src={item.photos[0]}
                      alt="defect"
                      className="w-12 h-12 rounded-xl object-cover border border-[#1E2E48]"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
