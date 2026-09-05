import React, { useState } from 'react';
import { Project, ProjectUpdate, User } from '../../types';
import { 
  CheckCircle2, AlertCircle, FileText, Camera, Plus, Check, Clock 
} from 'lucide-react';
import { CreateProjectUpdateModal } from '../modals/CreateProjectUpdateModal';

interface ProjectUpdatesTabProps {
  project: Project;
  updates?: ProjectUpdate[];
  currentUser?: User;
  onAddUpdate?: () => void;
}

export const ProjectUpdatesTab: React.FC<ProjectUpdatesTabProps> = ({
  project,
  updates = [],
  currentUser,
  onAddUpdate,
}) => {
  const [localUpdates, setLocalUpdates] = useState<ProjectUpdate[]>(updates);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleResolveDecision = (updateId: string) => {
    setLocalUpdates(prev => prev.map(u => {
      if (u.id === updateId) {
        return {
          ...u,
          decisionStatus: 'Approved'
        };
      }
      return u;
    }));
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
      
      {/* Header bar with Post Update button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#171A1F] tracking-tight">
            Project Activity & Updates
          </h3>
          <p className="text-xs text-[#68707C] font-medium">
            Chronological field stream
          </p>
        </div>
        <button
          onClick={() => {
            if (onAddUpdate) onAddUpdate();
            setIsCreateModalOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-3">
        {localUpdates.map((item) => {
          const isDecision = item.type === 'decision_needed' || item.decisionNeeded;
          const isApproved = item.decisionStatus === 'Approved';

          return (
            <div 
              key={item.id}
              className={`p-4 rounded-3xl bg-white border ${
                isDecision && !isApproved 
                  ? 'border-[#F59E0B]/50 shadow-sm shadow-amber-500/5' 
                  : 'border-[#DDE1E7] shadow-sm'
              } flex flex-col gap-3 transition-all`}
            >
              {/* Author & Timestamp */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.author.avatar}
                    alt={item.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#DDE1E7] flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#171A1F] truncate">
                      {item.author.name}
                    </h4>
                    <p className="text-[10px] text-[#68707C] font-medium truncate">
                      {item.author.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isDecision && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isApproved 
                        ? 'bg-[#ECFDF5] text-[#10B981]' 
                        : 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                    }`}>
                      {isApproved ? 'Decision Approved' : 'Decision Needed'}
                    </span>
                  )}
                  <span className="text-xs text-[#68707C] font-medium">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h5 className="text-xs font-bold text-[#171A1F] leading-snug">
                  {item.title}
                </h5>
                <p className="text-xs text-[#68707C] font-medium leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>

              {/* Actionable Decision Box */}
              {isDecision && !isApproved && (
                <div className="p-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex flex-col gap-2 mt-0.5">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-[#92400E]">
                      {item.decisionText || 'Decision pending on this stage'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleResolveDecision(item.id)}
                    className="w-full py-2 bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Decision</span>
                  </button>
                </div>
              )}

              {/* Attachments (Photos/Docs) */}
              {item.attachments && item.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1 border-t border-[#EAEDF1]">
                  {item.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F2F2F7] border border-[#DDE1E7] text-xs font-medium text-[#171A1F]"
                    >
                      {att.type === 'photo' ? (
                        <Camera className="w-3 h-3 text-[#1677FF]" />
                      ) : (
                        <FileText className="w-3 h-3 text-[#1677FF]" />
                      )}
                      <span className="truncate max-w-[180px]">{att.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {localUpdates.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-2 text-[#68707C] bg-white rounded-3xl border border-[#DDE1E7]">
            <Clock className="w-8 h-8 text-[#DDE1E7]" />
            <p className="text-xs font-semibold text-[#171A1F]">No updates posted yet</p>
            <p className="text-xs">Field updates and changes will appear here in chronological order.</p>
          </div>
        )}
      </div>

      {/* CREATE PROJECT UPDATE MODAL */}
      <CreateProjectUpdateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        project={project}
        currentUser={currentUser}
        onSaveUpdate={(newUpdate) => {
          setLocalUpdates(prev => [newUpdate, ...prev]);
        }}
      />

    </div>
  );
};
