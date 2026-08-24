import React, { useState } from 'react';
import { Project, PunchItem, PunchStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { 
  Plus, Search, AlertCircle, CheckCircle2, 
  Camera, MapPin, ChevronRight, ShieldAlert, Check 
} from 'lucide-react';

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
    <div className="flex flex-col gap-4 pb-24">
      {/* Top Filter & Create Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-[#101726] rounded-xl border border-[#1C2A44] overflow-x-auto">
          <button
            onClick={() => setActiveFilter('All')}
            className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeFilter === 'All' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            All ({projectPunch.length})
          </button>
          <button
            onClick={() => setActiveFilter('Open')}
            className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeFilter === 'Open' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' : 'text-slate-400'
            }`}
          >
            Open
          </button>
          <button
            onClick={() => setActiveFilter('In Progress')}
            className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeFilter === 'In Progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveFilter('Resolved')}
            className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeFilter === 'Resolved' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400'
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setActiveFilter('Verified')}
            className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              activeFilter === 'Verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'
            }`}
          >
            Verified
          </button>
        </div>

        <button
          onClick={onCreatePunch}
          className="h-9 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Punch Items List */}
      <div className="flex flex-col gap-3">
        {filteredItems.length === 0 ? (
          <div className="card-dark p-8 text-center text-slate-400 text-xs">
            No punch list items found under this status.
          </div>
        ) : (
          filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className="card-dark p-3.5 hover:border-cyan-500/40 transition-all cursor-pointer"
                onClick={() => onOpenPunchDetails(item)}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white tracking-tight hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span>{item.location}</span>
                    </p>
                  </div>
                  <StatusBadge status={item.status} size="xs" />
                </div>

                <p className="text-xs text-slate-300 mb-3 bg-[#0B101D] p-2 rounded-lg border border-[#172238] line-clamp-2">
                  {item.description}
                </p>

                {/* Subcontractor & Due Date Row */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1C2A44]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300 font-medium">{item.assignedTo.trade}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-medium">Due {item.dueDate.slice(5)}</span>
                    <StatusBadge status={item.priority} size="xs" />
                  </div>
                </div>

                {/* Resolution workflow quick action */}
                <div className="mt-2 pt-2 border-t border-[#141F33] flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Created: {item.createdDate}</span>
                  {item.status === 'Open' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePunchStatus(item.id, 'In Progress');
                      }}
                      className="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold hover:bg-amber-500/30"
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
                      className="px-2 py-1 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold hover:bg-purple-500/30"
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
                      className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold hover:bg-emerald-500/30 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
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
