import React, { useState } from 'react';
import { Project, ProjectStage, Task, PunchItem } from '../../types';
import { 
  X, Check, ChevronRight, CheckCircle2, Clock, AlertTriangle, 
  FileText, ShieldCheck, Award, ArrowRight, Layers, Sparkles, Building2
} from 'lucide-react';

interface ProjectStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  tasks?: Task[];
  punchItems?: PunchItem[];
  currentStageId?: string;
  onUpdateStage?: (stageId: string, updatedStages: ProjectStage[], newProgress?: number) => void;
  onCloseoutProject?: () => void;
}

export const ProjectStageModal: React.FC<ProjectStageModalProps> = ({
  isOpen,
  onClose,
  project,
  tasks = [],
  punchItems = [],
  currentStageId = 'stg-4',
  onUpdateStage,
  onCloseoutProject
}) => {
  const defaultStages: ProjectStage[] = [
    { id: 'stg-1', name: 'Design', status: 'Complete' },
    { id: 'stg-2', name: 'Permits', status: 'Complete' },
    { id: 'stg-3', name: 'Pre-Con', status: 'Complete' },
    { id: 'stg-4', name: 'Construction', status: 'In Progress' },
    { id: 'stg-5', name: 'Closeout', status: 'Upcoming' },
  ];

  const [stages, setStages] = useState<ProjectStage[]>(project.stages || defaultStages);
  const [selectedStageId, setSelectedStageId] = useState<string>(currentStageId);
  const [liveProgress, setLiveProgress] = useState<number>(project.progress || 68);

  if (!isOpen) return null;

  const activeStageIndex = stages.findIndex(s => s.status === 'In Progress');
  const currentActiveStage = stages[activeStageIndex !== -1 ? activeStageIndex : 3];
  const selectedStage = stages.find(s => s.id === selectedStageId) || currentActiveStage;

  const completedTasksCount = tasks.filter(t => t.projectId === project.id && t.status === 'Completed').length;
  const totalTasksCount = tasks.filter(t => t.projectId === project.id).length || 15;
  const openPunchCount = punchItems.filter(p => p.projectId === project.id && p.status !== 'Resolved' && p.status !== 'Closed').length;

  // Handle Advancing to Next Stage
  const handleAdvanceStage = () => {
    const currentIndex = stages.findIndex(s => s.id === currentActiveStage.id);
    if (currentIndex < stages.length - 1) {
      const nextStages = stages.map((s, idx) => {
        if (idx <= currentIndex) return { ...s, status: 'Complete' as const };
        if (idx === currentIndex + 1) return { ...s, status: 'In Progress' as const };
        return { ...s, status: 'Upcoming' as const };
      });
      setStages(nextStages);
      const nextProgress = Math.min(100, Math.round(((currentIndex + 2) / stages.length) * 100));
      setLiveProgress(nextProgress);
      setSelectedStageId(stages[currentIndex + 1].id);
      if (onUpdateStage) {
        onUpdateStage(stages[currentIndex + 1].id, nextStages, nextProgress);
      }
    }
  };

  // Closeout Finalization
  const handleFinalizeCloseout = () => {
    const finalStages = stages.map(s => ({ ...s, status: 'Complete' as const }));
    setStages(finalStages);
    setLiveProgress(100);
    if (onUpdateStage) {
      onUpdateStage('stg-5', finalStages, 100);
    }
    if (onCloseoutProject) {
      onCloseoutProject();
    }
    alert(`🎉 Project "${project.name}" has officially completed Stage 5 (Closeout) and is now marked as Completed!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[420px] mx-auto bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-[#0F172A] max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F9]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-full">
              Project Lifecycle
            </span>
            <h3 className="text-base font-bold text-[#0F172A] tracking-tight mt-1">
              Project Stage Progression
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Stepper Timeline */}
        <div className="bg-[#F8FAFC] rounded-2xl p-3 border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#0F172A]">
              Active: {currentActiveStage.name} Phase
            </span>
            <span className="text-xs font-bold text-[#1677FF] font-mono">
              {liveProgress}% Overall
            </span>
          </div>

          <div className="relative flex items-center justify-between px-2">
            <div className="absolute top-[13px] left-6 right-6 h-[2px] bg-[#E2E8F0] z-0" />
            <div 
              className="absolute top-[13px] left-6 h-[2px] bg-[#1677FF] z-0 transition-all duration-300"
              style={{ width: `${Math.max(10, Math.min(90, (activeStageIndex / (stages.length - 1)) * 100))}%` }}
            />

            {stages.map((stage) => {
              const isComp = stage.status === 'Complete';
              const isInProg = stage.status === 'In Progress';
              const isSelected = stage.id === selectedStageId;

              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStageId(stage.id)}
                  className="flex flex-col items-center z-10 cursor-pointer group focus:outline-none"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? 'ring-2 ring-[#1677FF] ring-offset-2' : ''
                  } ${
                    isComp 
                      ? 'bg-[#1677FF] text-white shadow-xs' 
                      : isInProg 
                      ? 'bg-white border-2 border-[#1677FF] text-[#1677FF]' 
                      : 'bg-[#F8FAFC] border-2 border-[#CBD5E1] text-[#94A3B8]'
                  }`}>
                    {isComp && <Check className="w-4 h-4 stroke-[2.5]" />}
                    {isInProg && <div className="w-2.5 h-2.5 rounded-full bg-[#1677FF] animate-pulse" />}
                  </div>
                  <span className={`text-[10px] mt-1.5 font-bold ${
                    isSelected ? 'text-[#1677FF]' : isComp ? 'text-[#0F172A]' : 'text-[#64748B]'
                  }`}>
                    {stage.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Card for Selected Stage */}
        <div className="border border-[#E2E8F0] rounded-2xl p-4 bg-white shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Phase Details
              </span>
              <h4 className="text-sm font-bold text-[#0F172A] mt-0.5">
                Stage {stages.findIndex(s => s.id === selectedStage.id) + 1}: {selectedStage.name}
              </h4>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              selectedStage.status === 'Complete'
                ? 'bg-[#E9F9F3] text-[#10A976]'
                : selectedStage.status === 'In Progress'
                ? 'bg-[#EAF3FF] text-[#1677FF]'
                : 'bg-[#F1F5F9] text-[#64748B]'
            }`}>
              {selectedStage.status}
            </span>
          </div>

          {/* Stage Deliverables & Gate Checkpoints */}
          <div className="flex flex-col gap-2 pt-1 text-xs">
            <span className="font-bold text-[#0F172A]">Phase Deliverables & Criteria:</span>
            
            {selectedStage.id === 'stg-1' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#10A976]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium text-[#0F172A]">Architectural Concept & Floor Plans Approved</span>
                </div>
                <div className="flex items-center gap-2 text-[#10A976]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium text-[#0F172A]">Structural & MEP Engineering Calculations Stamped</span>
                </div>
              </div>
            )}

            {selectedStage.id === 'stg-2' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#10A976]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium text-[#0F172A]">City Building Permit #BP-2024-88 Issued</span>
                </div>
                <div className="flex items-center gap-2 text-[#10A976]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium text-[#0F172A]">Environmental & Geotechnical Soil Clearances Passed</span>
                </div>
              </div>
            )}

            {selectedStage.id === 'stg-3' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#10A976]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium text-[#0F172A]">CSI MasterFormat Budget Baseline Locked (${(project.budget.total / 1000000).toFixed(2)}M)</span>
                </div>
                <div className="flex items-center gap-2 text-[#10A976]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium text-[#0F172A]">Primary Subcontractor Master Agreements Signed</span>
                </div>
              </div>
            )}

            {selectedStage.id === 'stg-4' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="font-medium text-[#64748B]">Physical Tasks Completed</span>
                  <span className="font-bold text-[#0F172A] font-mono">{completedTasksCount} / {totalTasksCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="font-medium text-[#64748B]">Milestones Inspected</span>
                  <span className="font-bold text-[#10A976] font-mono">3 / 4 Passed</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="font-medium text-[#64748B]">Active Field Trades</span>
                  <span className="font-bold text-[#1677FF]">Framing, Concrete, MEP</span>
                </div>
              </div>
            )}

            {selectedStage.id === 'stg-5' && (
              <div className="flex flex-col gap-2">
                <div className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#92400E] block text-[11px]">Final Closeout Gate Requirements:</span>
                    <p className="text-[10px] text-[#B45309] mt-0.5">
                      All 4 gates must be cleared to certify project completion & handover to owner.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="font-medium text-[#64748B]">1. Zero Open Punch Items</span>
                  <span className={`font-bold font-mono ${openPunchCount === 0 ? 'text-[#10A976]' : 'text-[#E5484D]'}`}>
                    {openPunchCount === 0 ? '✓ 0 Open' : `${openPunchCount} Remaining`}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="font-medium text-[#64748B]">2. Final Lien Waivers</span>
                  <span className="font-bold text-[#10A976]">✓ 100% Collected</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="font-medium text-[#64748B]">3. Certificate of Occupancy (CO)</span>
                  <span className="font-bold text-[#1677FF]">Pending Final Sign-off</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="font-medium text-[#64748B]">4. As-Built Plans & O&M Handover</span>
                  <span className="font-bold text-[#10A976]">✓ Ready in Documents</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-1">
          {currentActiveStage.id === 'stg-4' && (
            <button
              onClick={handleAdvanceStage}
              className="w-full h-11 rounded-2xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Advance to Stage 5 (Closeout)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentActiveStage.id === 'stg-5' && (
            <button
              onClick={handleFinalizeCloseout}
              className="w-full h-11 rounded-2xl bg-[#10A976] hover:bg-[#059669] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Finalize Closeout & Hand Over to Owner</span>
            </button>
          )}

          {currentActiveStage.id !== 'stg-4' && currentActiveStage.id !== 'stg-5' && (
            <button
              onClick={handleAdvanceStage}
              className="w-full h-11 rounded-2xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Advance to Next Stage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
