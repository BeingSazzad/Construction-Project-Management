import React, { useState } from 'react';
import { Project, PunchItem, PunchStatus } from '../../types';
import { Plus, MapPin, Trash2, Folder, CheckSquare, ChevronDown } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface ProjectPunchListTabProps {
  project: Project;
  punchItems: PunchItem[];
  onCreatePunch: () => void;
  onOpenPunchDetails?: (item: PunchItem) => void;
  onUpdatePunchStatus?: (punchId: string, status: PunchStatus) => void;
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

  const openCount = items.filter(p => p.status === 'Open' || p.status === 'In Progress').length;

  const handleStatusChange = (punchId: string, newStatus: PunchStatus) => {
    setItems(prev => prev.map(p => p.id === punchId ? { ...p, status: newStatus } : p));
    if (onUpdatePunchStatus) onUpdatePunchStatus(punchId, newStatus);
  };

  const handleDeletePunch = (punchId: string) => {
    setItems(prev => prev.filter(p => p.id !== punchId));
  };

  const STATUS_DOT: Record<PunchStatus, string> = {
    'Open': 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
    'In Progress': 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]',
    'Resolved': 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
    'Verified': 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]',
    'Closed': 'bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.6)]',
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans text-slate-100 animate-fade-in max-w-[430px] mx-auto">
      
      {/* ── 1. Page Header & Live Open Count ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-white tracking-tight">Punch List</h2>
          <p className="text-[12px] text-slate-400 mt-0.5 font-medium">
            {openCount} open {openCount === 1 ? 'item' : 'items'}
          </p>
        </div>

        <button
          onClick={onCreatePunch}
          className="px-3.5 py-2 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-900/40 active:scale-95 transition-all cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Item</span>
        </button>
      </div>

      {/* ── 2. Sleek Filter Pills Bar ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
        {(['All', 'Open', 'In Progress', 'Resolved', 'Verified'] as const).map((st) => {
          const isActive = activeFilter === st;
          return (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#2563EB] text-white font-bold shadow-sm'
                  : 'bg-[#0D1424] border border-[#1A263E] text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          );
        })}
      </div>

      {/* ── 3. Project Group Header Divider ── */}
      <div className="flex items-center justify-between pt-1 border-b border-[#142036] pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Folder className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="text-xs font-bold text-slate-200 truncate">{project.name}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-[#090E1A] px-2 py-0.5 rounded-md border border-[#141F33] flex-shrink-0">
          {filteredItems.length}
        </span>
      </div>

      {/* ── 4. Ultra-Clean Pro Card Feed ── */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#0D1424] border border-[#141F33] text-center flex flex-col items-center justify-center gap-2">
          <Folder className="w-8 h-8 text-slate-600" />
          <p className="text-xs font-bold text-slate-300">No punch items for this filter</p>
          <p className="text-[12px] text-slate-400 font-medium">Tap "+ New Item" to log a field defect.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#0D1424] border border-[#141F33] hover:border-blue-500/40 transition-all flex flex-col gap-2.5 shadow-sm group"
              >
                {/* Line 1: Title (Full Width) + Status Dropdown Selector + Trash Icon */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${STATUS_DOT[item.status] || 'bg-amber-400'}`} />
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#3875F6] transition-colors leading-snug tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Status Dropdown Selector styled as native pill */}
                    <div className="w-28">
                      <CustomSelect
                        value={item.status}
                        onChange={(v) => handleStatusChange(item.id, v as PunchStatus)}
                        options={['Open', 'In Progress', 'Resolved', 'Verified']}
                        size="sm"
                      />
                    </div>

                    {/* Trash Delete Icon */}
                    <button
                      onClick={() => handleDeletePunch(item.id)}
                      className="w-7 h-7 rounded-xl bg-[#090E1A] hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-[#141F33] flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Line 2: Description Text (Full Width Aligned) */}
                {item.description && (
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {item.description}
                  </p>
                )}

                {/* Line 3: Clean Metadata Row (Trade + Location + Evidence Photo Thumbnail) */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#141F33]/70">
                  <div className="flex items-center gap-2 flex-wrap text-xs min-w-0 flex-1">
                    <span className="px-2.5 py-1 rounded-lg bg-[#090E1A] text-slate-300 border border-[#141F33] font-semibold text-[10px] truncate">
                      {item.assignedTo?.trade || 'General Trade'}
                    </span>

                    {item.location && (
                      <span className="flex items-center gap-1 text-slate-400 font-medium text-[10px] bg-[#090E1A] px-2.5 py-1 rounded-lg border border-[#141F33] truncate">
                        <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </span>
                    )}
                  </div>

                  {/* Attached Evidence Photo Thumbnail */}
                  {item.photos && item.photos.length > 0 && (
                    <div className="flex-shrink-0">
                      <img
                        src={item.photos[0]}
                        alt="evidence thumbnail"
                        className="w-11 h-11 rounded-xl object-cover border border-[#1A263E] shadow hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
