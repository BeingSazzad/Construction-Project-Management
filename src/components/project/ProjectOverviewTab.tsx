import React from 'react';
import { Project, Task, SitePhoto, DocumentItem, PunchItem, ChangeOrder } from '../../types';
import { 
  Calendar, Check, ChevronRight, Users, FileText, CloudRain, Clock
} from 'lucide-react';

interface ProjectOverviewTabProps {
  project: Project;
  tasks?: Task[];
  photos?: SitePhoto[];
  documents?: DocumentItem[];
  punchItems: PunchItem[];
  dailyLogs?: any[];
  onSelectTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  changeOrders?: ChangeOrder[];
  onCreateChangeOrder?: () => void;
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  tasks = [],
  documents = [],
  onSelectTab,
  onNavigate,
}) => {
  const handleTabChange = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    else if (onNavigate) onNavigate(tabId);
  };

  const stages = project.stages || [
    { id: 'stg-1', name: 'Design', status: 'Complete' },
    { id: 'stg-2', name: 'Permitting', status: 'Complete' },
    { id: 'stg-3', name: 'Preconstruction', status: 'Complete' },
    { id: 'stg-4', name: 'Construction', status: 'In Progress' },
    { id: 'stg-5', name: 'Closeout', status: 'Upcoming' }
  ];

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
      
      {/* ── 1. Project Progress Section (Figma Screen 2) ── */}
      <div className="p-5 rounded-3xl bg-white border border-[#DDE1E7] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#68707C]">Project Progress</span>
            <div className="text-3xl font-black text-[#1677FF] tracking-tight mt-0.5">
              {project.progress}%
            </div>
          </div>
          <span className="text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-full">
            On Schedule
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#EAEDF1] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#1677FF] rounded-full transition-all duration-700"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* ── 2. Stages Pipeline (Figma Screen 2) ── */}
      <div className="p-5 rounded-3xl bg-white border border-[#DDE1E7] shadow-sm flex flex-col gap-3">
        <h3 className="text-sm font-bold text-[#171A1F] tracking-tight">
          Stages
        </h3>

        <div className="flex flex-col gap-3.5 relative pt-1">
          {stages.map((stage, idx) => {
            const isComplete = stage.status === 'Complete';
            const isInProgress = stage.status === 'In Progress';
            const isLast = idx === stages.length - 1;

            return (
              <div key={stage.id} className="flex items-center justify-between relative group">
                {/* Connecting vertical timeline line */}
                {!isLast && (
                  <div 
                    className={`absolute left-2.5 top-6 bottom-0 w-0.5 ${
                      isComplete ? 'bg-[#10B981]' : 'bg-[#EAEDF1]'
                    } -translate-x-1/2 h-5`} 
                  />
                )}

                {/* Left: Indicator + Stage Name */}
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isComplete 
                      ? 'bg-[#10B981] text-white' 
                      : isInProgress 
                        ? 'border-2 border-[#1677FF] bg-white' 
                        : 'border border-[#DDE1E7] bg-white'
                  }`}>
                    {isComplete && <Check className="w-3 h-3 stroke-[3]" />}
                    {isInProgress && <div className="w-2 h-2 rounded-full bg-[#1677FF]" />}
                  </div>

                  <span className={`text-xs ${
                    isInProgress ? 'font-bold text-[#171A1F]' : 'font-medium text-[#68707C]'
                  }`}>
                    {stage.name}
                  </span>
                </div>

                {/* Right: Status Label */}
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-semibold ${
                    isComplete ? 'text-[#10B981]' : isInProgress ? 'text-[#1677FF]' : 'text-[#68707C]'
                  }`}>
                    {stage.status}
                  </span>
                  {isComplete && (
                    <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                  {isInProgress && (
                    <div className="w-2 h-2 rounded-full bg-[#1677FF]" />
                  )}
                  {!isComplete && !isInProgress && (
                    <div className="w-3 h-3 rounded-full border border-[#DDE1E7]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Upcoming Milestone Card (Figma Screen 2) ── */}
      <div 
        onClick={() => handleTabChange('schedule')}
        className="p-4 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5 text-[#1677FF]" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#68707C] uppercase tracking-wider">
              Upcoming Milestone
            </span>
            <h4 className="text-xs font-bold text-[#171A1F] group-hover:text-[#1677FF] transition-colors truncate mt-0.5">
              Framing Inspection
            </h4>
            <p className="text-[11px] text-[#68707C] font-medium mt-0.5">
              May 16, 2025 · 10:00 AM
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </div>

      {/* ── 4. Weather Intelligence Card ── */}
      {project.weather && (
        <div className="p-4 rounded-2xl bg-white border border-[#DDE1E7] shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center flex-shrink-0">
            <CloudRain className="w-5 h-5 text-[#1677FF]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#171A1F]">
                {project.weather.locationName || project.cityState} Weather
              </span>
              <span className="text-xs font-black text-[#1677FF]">
                {project.weather.temperature}
              </span>
            </div>
            <p className="text-[11px] text-[#68707C] font-medium mt-0.5">
              {project.weather.condition}
            </p>
            {project.weather.forecastRisk && (
              <p className="text-[11px] text-[#D97706] font-semibold mt-1 bg-[#FEF3C7]/60 px-2 py-0.5 rounded-md inline-block">
                ⚠️ {project.weather.forecastRisk}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── 5. Twin Metrics: Team & Documents (Figma Screen 2) ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Team Card */}
        <div 
          onClick={() => handleTabChange('team')}
          className="p-4 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 shadow-sm transition-all cursor-pointer flex flex-col gap-2 group active:scale-[0.99]"
        >
          <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4 text-[#1677FF]" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#171A1F]">
              12
            </div>
            <div className="text-xs font-medium text-[#68707C] mt-0.5">
              Members
            </div>
          </div>
        </div>

        {/* Documents Card */}
        <div 
          onClick={() => handleTabChange('documents')}
          className="p-4 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 shadow-sm transition-all cursor-pointer flex flex-col gap-2 group active:scale-[0.99]"
        >
          <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4 text-[#1677FF]" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#171A1F]">
              {documents.length > 0 ? documents.length : 28}
            </div>
            <div className="text-xs font-medium text-[#68707C] mt-0.5">
              Files
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
