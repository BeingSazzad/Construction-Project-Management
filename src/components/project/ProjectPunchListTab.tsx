import React, { useState } from 'react';
import { Project, PunchItem, PunchStatus } from '../../types';
import { Plus, MapPin, Trash2, Folder } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

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
    'Open': 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]',
    'In Progress': 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]',
    'Resolved': 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]',
    'Verified': 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]',
    'Closed': 'bg-slate-500 shadow-[0_0_8px_rgba(100,116,139,0.5)]',
  };

  return (
    <div className="flex flex-col gap-4 font-sans text-slate-100">
      
      {/* Top Controls: Filter Pills + Add Punch */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {(['All', 'Open', 'In Progress', 'Resolved', 'Verified'] as const).map((st) => {
            const isActive = activeFilter === st;
            return (
              <button
                key={st}
                onClick={() => setActiveFilter(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-[#070D1A] border border-[#142036] text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>

        <button
          onClick={onCreatePunch}
          className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Punch</span>
        </button>
      </div>

      {/* Punch Items List */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#070D1A] border border-[#142036] text-center flex flex-col items-center justify-center gap-2">
          <Folder className="w-8 h-8 text-slate-600" />
          <p className="text-xs font-bold text-slate-400">No punch list items for this filter</p>
          <p className="text-[11px] text-slate-500">Tap "New Punch" to record field defects & trade tasks.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredItems.map((item) => {
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
                    <div className="w-28">
                      <CustomSelect
                        value={item.status}
                        onChange={(v) => handleStatusChange(item.id, v as PunchStatus)}
                        options={['Open', 'In Progress', 'Resolved', 'Verified']}
                        size="sm"
                      />
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
          })}
        </div>
      )}
    </div>
  );
};
