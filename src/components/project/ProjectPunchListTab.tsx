import React, { useState } from 'react';
import { Project, PunchItem, PunchStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Plus, MapPin, Check } from 'lucide-react';

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

  const projectPunch = punchItems.filter(p => p.projectId === project.id);

  const filteredItems = projectPunch.filter(p => {
    if (activeFilter === 'All') return true;
    return p.status === activeFilter;
  });

  return (
    <div className="flex flex-col gap-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Top Filter & Create Action */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 bg-[#0D1424] rounded-xl border border-[#1A263E] overflow-x-auto flex-1">
          {(['All', 'Open', 'In Progress', 'Resolved', 'Verified'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#2563EB] text-white shadow-sm font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter} {filter === 'All' ? `(${projectPunch.length})` : ''}
              </button>
            );
          })}
        </div>

        <button
          onClick={onCreatePunch}
          className="h-9 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center gap-1 cursor-pointer flex-shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Punch Items List */}
      <div className="flex flex-col gap-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0D1424] border border-[#1A263E] text-center text-slate-400 text-xs">
            No punch list items found under this status.
          </div>
        ) : (
          filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#0D1424] border border-[#1A263E] hover:border-blue-500/40 transition-all cursor-pointer shadow-sm flex flex-col gap-2.5"
                onClick={() => onOpenPunchDetails(item)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white tracking-tight hover:text-[#3875F6] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{item.location}</span>
                    </p>
                  </div>
                  <StatusBadge status={item.status} size="xs" />
                </div>

                <p className="text-xs text-slate-300 bg-[#090E1A] p-2.5 rounded-xl border border-[#141F33] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Subcontractor & Due Date Row */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#162238]">
                  <span className="text-slate-300 font-medium">{item.assignedTo.trade}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-medium">Due {item.dueDate.slice(5)}</span>
                    <StatusBadge status={item.priority} size="xs" />
                  </div>
                </div>

                {/* Resolution workflow quick action */}
                <div className="pt-2 border-t border-[#162238] flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Created {item.createdDate}</span>
                  {item.status === 'Open' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePunchStatus(item.id, 'In Progress');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/25"
                    >
                      Assign to Fix
                    </button>
                  )}
                  {item.status === 'In Progress' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePunchStatus(item.id, 'Resolved');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold hover:bg-purple-500/25"
                    >
                      Mark Resolved
                    </button>
                  )}
                  {item.status === 'Resolved' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePunchStatus(item.id, 'Verified');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>PM Verify & Close</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
