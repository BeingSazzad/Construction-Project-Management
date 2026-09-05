import React, { useState } from 'react';
import { Project, PunchItem, PunchStatus } from '../../types';
import { Plus, MapPin, Trash2, Folder } from 'lucide-react';
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
  onUpdatePunchStatus
}) => {
  const [activeFilter, setActiveFilter] = useState<PunchStatus | 'All'>('All');
  const [items, setItems] = useState<PunchItem[]>(() => {
    const projItems = punchItems.filter(p => p.projectId === project.id);
    return projItems.length > 0 ? projItems : punchItems;
  });

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
    'Open': 'bg-amber-500',
    'In Progress': 'bg-[#1677FF]',
    'Resolved': 'bg-emerald-500',
    'Verified': 'bg-teal-500',
    'Closed': 'bg-slate-400',
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#171A1F] bg-[#F2F2F7] animate-fade-in">
      
      {/* ── 1. Page Header & Live Open Count ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#171A1F] tracking-tight">Punch List</h2>
          <p className="text-xs text-[#68707C] mt-0.5 font-medium">
            {openCount} open {openCount === 1 ? 'item' : 'items'}
          </p>
        </div>

        <button
          onClick={onCreatePunch}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
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
              className={`px-3.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-[#1677FF] border-[#1677FF] text-white font-bold shadow-xs'
                  : 'bg-white text-[#68707C] hover:text-[#171A1F] hover:bg-[#F2F2F7] border-[#DDE1E7]'
              }`}
            >
              {st}
            </button>
          );
        })}
      </div>

      {/* ── 3. Project Group Header Divider ── */}
      <div className="flex items-center justify-between pt-1 border-b border-[#EAEDF1] pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Folder className="w-4 h-4 text-[#1677FF] flex-shrink-0" />
          <span className="text-xs font-bold text-[#171A1F] truncate">{project.name}</span>
        </div>
        <span className="text-[11px] font-bold text-[#68707C] bg-white px-2 py-0.5 rounded-md border border-[#DDE1E7] flex-shrink-0">
          {filteredItems.length} items
        </span>
      </div>

      {/* ── 4. Ultra-Clean Pro Card Feed ── */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-2xl bg-white border border-[#DDE1E7] text-center flex flex-col items-center justify-center gap-2 shadow-xs">
          <Folder className="w-8 h-8 text-[#9DA5B1]" />
          <p className="text-xs font-bold text-[#171A1F]">No punch items for this filter</p>
          <p className="text-[12px] text-[#68707C] font-medium">Tap "+ New Item" to log a field defect.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 transition-all flex flex-col gap-2.5 shadow-xs group"
              >
                {/* Line 1: Title + Status Dropdown + Delete Icon */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${STATUS_DOT[item.status] || 'bg-amber-400'}`} />
                    <h3 className="text-xs sm:text-sm font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors leading-snug tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="w-28">
                      <CustomSelect
                        value={item.status}
                        onChange={(v) => handleStatusChange(item.id, v as PunchStatus)}
                        options={['Open', 'In Progress', 'Resolved', 'Verified']}
                        size="sm"
                      />
                    </div>

                    <button
                      onClick={() => handleDeletePunch(item.id)}
                      className="w-7 h-7 rounded-xl bg-[#F2F2F7] hover:bg-rose-50 text-[#68707C] hover:text-rose-600 border border-[#DDE1E7] flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Line 2: Description Text */}
                {item.description && (
                  <p className="text-xs text-[#68707C] leading-relaxed font-normal">
                    {item.description}
                  </p>
                )}

                {/* Line 3: Clean Metadata Row */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EAEDF1]">
                  <div className="flex items-center gap-2 flex-wrap text-xs min-w-0 flex-1">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#F7F8FA] text-[#171A1F] border border-[#EAEDF1] font-semibold text-[11px] truncate">
                      {item.assignedTo?.trade || 'General Trade'}
                    </span>

                    {item.location && (
                      <span className="flex items-center gap-1 text-[#68707C] font-medium text-[11px] bg-[#F7F8FA] px-2.5 py-0.5 rounded-lg border border-[#EAEDF1] truncate">
                        <MapPin className="w-3 h-3 text-rose-500 flex-shrink-0" />
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
                        className="w-11 h-11 rounded-xl object-cover border border-[#DDE1E7] shadow-xs hover:scale-105 transition-transform"
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
