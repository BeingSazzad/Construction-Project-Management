import React, { useState } from 'react';
import { Project, Task, SitePhoto, DocumentItem, PunchItem, ChangeOrder } from '../../types';
import { 
  Calendar, Check, ChevronRight, Users, FileText, CloudRain, 
  Landmark, Camera, CheckSquare, MapPin, Clock, User 
} from 'lucide-react';
import { CreateDailyLogModal } from '../modals/CreateDailyLogModal';
import { WeatherImpactModal } from '../modals/WeatherImpactModal';
import { MilestoneDetailsModal, MilestoneItem } from '../modals/MilestoneDetailsModal';
import { EmployeeProfileModal, EmployeeProfileData } from '../modals/EmployeeProfileModal';
import { ProjectStageModal } from '../modals/ProjectStageModal';

interface ProjectOverviewTabProps {
  project: Project;
  tasks?: Task[];
  photos?: SitePhoto[];
  documents?: DocumentItem[];
  punchItems?: PunchItem[];
  dailyLogs?: any[];
  onSelectTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
  changeOrders?: ChangeOrder[];
  onCreateChangeOrder?: () => void;
  onCreateTask?: () => void;
  onUploadPhoto?: () => void;
  onAddDailyLog?: (log?: any) => void;
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  tasks = [],
  documents = [],
  punchItems = [],
  onSelectTab,
  onNavigate,
  onCreateTask,
  onUploadPhoto,
  onAddDailyLog,
}) => {
  const [isCreateDailyLogOpen, setIsCreateDailyLogOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneItem | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfileData | null>(null);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [selectedStageModalId, setSelectedStageModalId] = useState('stg-4');
  const [projectStages, setProjectStages] = useState(project.stages || [
    { id: 'stg-1', name: 'Design', status: 'Complete' as const },
    { id: 'stg-2', name: 'Permits', status: 'Complete' as const },
    { id: 'stg-3', name: 'Pre-Con', status: 'Complete' as const },
    { id: 'stg-4', name: 'Construction', status: 'In Progress' as const },
    { id: 'stg-5', name: 'Closeout', status: 'Upcoming' as const }
  ]);

  const handleTabChange = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    else if (onNavigate) onNavigate(tabId);
  };

  const handleStageClick = (stageId: string) => {
    setSelectedStageModalId(stageId);
    setIsStageModalOpen(true);
  };

  const fallbackCover = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80";

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-3 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      
      {/* ── 1. Hero Cover Photo & Phase Card ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-card">
        {/* Cover Photo */}
        <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-slate-100">
          <img 
            src={project.coverImage || project.thumbnail || fallbackCover}
            alt={project.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Floating "View Photos >" Button */}
          <button
            onClick={() => handleTabChange('photos')}
            className="absolute top-3 right-3 h-7 px-3 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>View Photos</span>
            <ChevronRight className="w-3 h-3 text-white/80" />
          </button>
        </div>

        {/* Progress & Current Phase Info */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-4">
          {/* Left: Progress */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#1677FF] tracking-tight">
                {project.progress}%
              </span>
              <span className="text-xs font-semibold text-[#64748B]">
                Complete
              </span>
            </div>
            {/* Progress Track */}
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#1677FF] h-full rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Right: Construction Phase */}
          <div 
            onClick={() => handleTabChange('schedule')}
            className="flex items-center gap-1 text-right shrink-0 cursor-pointer group pl-2"
          >
            <div>
              <span className="text-xs font-bold text-[#0F172A] block group-hover:text-[#1677FF] transition-colors leading-tight">
                Construction Phase
              </span>
              <span className="text-xs text-[#64748B] block mt-0.5 font-normal leading-tight">
                Structural Framing
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1677FF] transition-colors shrink-0" />
          </div>
        </div>
      </div>

      {/* ── 2. Project Specifications (Lattice Level 3 Global Card) ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card">
        <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Project Specifications
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded-md border border-[#E2E8F0]">
            {project.code || 'PRJ-SPEC'}
          </span>
        </div>

        {/* 2-Column Grid strictly following 4px grid and Lattice tokens */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* 1. Address */}
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Address
              </span>
              <p className="text-xs font-bold text-[#0F172A] leading-snug line-clamp-2 mt-0.5">
                {project.location || '400 Lakeview Blvd'}
              </p>
              <p className="text-[11px] text-[#64748B] truncate leading-tight mt-0.5">
                {project.cityState || 'Orlando, FL'}
              </p>
            </div>
          </div>

          {/* 2. Lead PM & GC Owner */}
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
              <User className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Lead PM
              </span>
              <p className="text-xs font-bold text-[#0F172A] leading-tight truncate mt-0.5">
                {project.projectManager?.name || 'Elena Rossi'}
              </p>
              <p className="text-[11px] text-[#64748B] truncate leading-tight mt-0.5">
                Client: {project.clientName || 'Texas Commercial LLC'}
              </p>
            </div>
          </div>

          {/* 3. Start Date */}
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Start Date
              </span>
              <p className="text-xs font-bold text-[#0F172A] leading-tight font-mono mt-0.5">
                {project.startDate || '2024-11-01'}
              </p>
            </div>
          </div>

          {/* 4. Target End Date */}
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Target End
              </span>
              <p className="text-xs font-bold text-[#0F172A] leading-tight font-mono mt-0.5">
                {project.targetEndDate || '2026-05-30'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. 4-Column Metric Suite Card ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 sm:p-3.5 shadow-card">
        <div className="grid grid-cols-4 divide-x divide-[#F1F5F9]">
          {/* Metric 1: Budget */}
          <div 
            onClick={() => handleTabChange('budget')}
            className="flex flex-col items-start pr-2 sm:pr-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shrink-0">
              <Landmark className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors leading-tight truncate w-full">
              ${(project.budget?.total ? project.budget.total / 1000000 : 4.65).toFixed(2)}M
            </span>
            <span className="text-[10px] text-[#64748B] font-medium leading-tight mt-0.5 truncate w-full">
              Total Budget
            </span>
          </div>

          {/* Metric 2: Target Date */}
          <div 
            onClick={() => handleTabChange('schedule')}
            className="flex flex-col items-start px-2 sm:px-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shrink-0">
              <Calendar className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs sm:text-xs font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors leading-tight truncate w-full tracking-tight">
              {project.targetEndDate
                ? new Date(project.targetEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'TBD'}
            </span>
            <span className="text-[10px] text-[#64748B] font-medium leading-tight mt-0.5 truncate w-full">
              Target Date
            </span>
          </div>

          {/* Metric 3: Active Tasks */}
          <div 
            onClick={() => handleTabChange('tasks')}
            className="flex flex-col items-start px-2 sm:px-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shrink-0">
              <CheckSquare className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors leading-tight truncate w-full">
              {tasks.filter(t => t.projectId === project.id && t.status !== 'Completed').length || 10}
            </span>
            <span className="text-[10px] text-[#64748B] font-medium leading-tight mt-0.5 truncate w-full">
              Active Tasks
            </span>
          </div>

          {/* Metric 4: Documents */}
          <div 
            onClick={() => handleTabChange('documents')}
            className="flex flex-col items-start pl-2 sm:pl-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shrink-0">
              <FileText className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors leading-tight truncate w-full">
              {documents.length || 6}
            </span>
            <span className="text-[10px] text-[#64748B] font-medium leading-tight mt-0.5 truncate w-full">
              Documents
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Weather / Delay Warning Banner ── */}
      <div 
        onClick={() => setIsWeatherModalOpen(true)}
        className="bg-[#FFF7E6] border border-[#F59E0B]/25 rounded-2xl p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:border-[#F59E0B]/50 transition-all shadow-card group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
            <CloudRain className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[#0F172A] truncate">
              Heavy rain expected Thursday
            </h4>
            <p className="text-xs text-[#B45309] truncate mt-0.5 font-medium">
              May affect scheduled concrete pour.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 text-xs font-semibold text-[#D97706] shrink-0">
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* ── 4. Project Stages (Horizontal Stepper) ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#0F172A] tracking-tight">
            Project Stages
          </h3>
          <button 
            onClick={() => handleTabChange('schedule')}
            className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View Schedule</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Horizontal Stepper */}
        <div className="relative flex items-start justify-between pt-1">
          {/* Background Connecting Line */}
          <div className="absolute top-[15px] left-6 right-6 h-[2px] bg-[#E2E8F0] z-0" />
          
          {/* Active Fill Line - Lattice Blue up to current stage */}
          <div 
            className="absolute top-[15px] left-6 h-[2px] bg-[#1677FF] z-0 transition-all duration-500"
            style={{ 
              width: `${Math.max(12, Math.min(92, ((projectStages.findIndex(s => s.status === 'In Progress') !== -1 ? projectStages.findIndex(s => s.status === 'In Progress') : 4) / 4) * 88))}%` 
            }}
          />

          {projectStages.map((stage) => {
            const isComplete = stage.status === 'Complete';
            const isInProgress = stage.status === 'In Progress';

            return (
              <div 
                key={stage.id} 
                onClick={() => handleStageClick(stage.id)}
                className="flex flex-col items-center text-center relative z-10 flex-1 min-w-0 px-0.5 cursor-pointer group active:scale-95 transition-transform"
                title={`View ${stage.name} Phase Details`}
              >
                {/* Circle Indicator */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  isComplete
                    ? 'bg-[#1677FF] text-white shadow-xs'
                    : isInProgress
                    ? 'border-2 border-[#1677FF] bg-white text-[#1677FF] shadow-xs ring-2 ring-[#1677FF]/20'
                    : 'border-2 border-[#CBD5E1] bg-[#F8FAFC]'
                }`}>
                  {isComplete && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {isInProgress && <div className="w-2 h-2 rounded-full bg-[#1677FF] animate-pulse" />}
                </div>

                {/* Stage Name */}
                <span className="text-xs font-bold text-[#0F172A] mt-2 leading-tight tracking-tight text-center">
                  {stage.name}
                </span>

                {/* Stage Status */}
                <span className={`text-[10px] mt-0.5 leading-tight ${
                  isInProgress
                    ? 'font-bold text-[#1677FF]'
                    : isComplete
                    ? 'text-[#64748B] font-medium'
                    : 'text-[#94A3B8] font-normal'
                }`}>
                  {stage.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. Dual Milestone & Site Weather Cards (2 Columns) ── */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Upcoming Milestone */}
        <div 
          onClick={() => setSelectedMilestone({
            id: `${project.id}-ms-3`,
            code: 'MS-03',
            name: 'Framing & Structural Inspection',
            subcontractor: 'Apex Framing Specialists',
            dates: 'Sep 18, 2026 · 10:00 AM',
            duration: '1 day',
            progress: 40,
            status: 'In Progress',
            budgetAllocation: 380000,
            inspectionPassed: false,
            tasksCount: { completed: 2, total: 5 }
          })}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#1677FF]/40 transition-all cursor-pointer group min-h-[104px]"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-md bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#1677FF]" />
            </div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mt-2">
              Upcoming Milestone
            </span>
            <h4 className="text-xs font-bold text-[#0F172A] mt-0.5 truncate group-hover:text-[#1677FF] transition-colors">
              Framing & Structural Inspection
            </h4>
          </div>
          <p className="text-xs text-[#64748B] font-medium mt-1">
            Sep 18, 2026 • 10:00 AM
          </p>
        </div>

        {/* Site Weather */}
        <div 
          onClick={() => setIsWeatherModalOpen(true)}
          className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-card flex flex-col justify-between hover:border-[#F59E0B]/50 transition-all cursor-pointer group min-h-[104px]"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-md bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <CloudRain className="w-3.5 h-3.5" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#D97706]" />
            </div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block mt-2">
              Site Weather
            </span>
            <h4 className="text-xs font-bold text-[#0F172A] mt-0.5 truncate">
              {project.weather?.locationName || project.cityState || 'Tampa, FL'} • {project.weather?.temperature || '82°F'}
            </h4>
          </div>
          <p className="text-[10px] text-[#64748B] font-medium mt-1 line-clamp-2 leading-tight">
            Sunny • Rain expected Thursday may affect concrete pour.
          </p>
        </div>
      </div>

      {/* ── 6. Dedicated Assigned Team (Horizontal Headshots Only) ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 shadow-card flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center">
              <Users className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A] tracking-tight">
              Assigned Team
            </h3>
            <span className="text-[10px] font-semibold text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-full">
              4 On-Site
            </span>
          </div>

          <button 
            onClick={() => handleTabChange('team')}
            className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Horizontal Headshots Row */}
        <div className="flex items-center gap-3.5 overflow-x-auto py-1 no-scrollbar">
          {[
            {
              id: 'emp-1',
              name: project.projectManager?.name || 'Sarah Johnson',
              role: 'Lead Project Manager',
              company: 'Lattice Construction',
              phone: '+1 (555) 345-6789',
              email: 'sarah.j@averymarsh.com',
              avatar: project.projectManager?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
              isOnSite: true,
              type: 'gc' as const,
              projectName: project.name
            },
            {
              id: 'emp-2',
              name: 'John Smith',
              role: 'Lead Field Superintendent',
              company: 'Lattice Construction',
              phone: '+1 (555) 567-8901',
              email: 'john.s@averymarsh.com',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
              isOnSite: true,
              type: 'gc' as const,
              projectName: project.name
            },
            {
              id: 'emp-3',
              name: 'Emily Brown',
              role: 'Site Safety Officer',
              company: 'Lattice Construction',
              phone: '+1 (555) 789-0123',
              email: 'emily.b@averymarsh.com',
              avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
              isOnSite: false,
              type: 'gc' as const,
              projectName: project.name
            },
            {
              id: 'emp-5',
              name: 'Carlos Ortiz',
              role: 'Earthwork Site Foreman',
              company: 'Earthworks Pro LLC',
              phone: '+1 (555) 234-5678',
              email: 'carlos@earthworkspro.com',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              isOnSite: true,
              type: 'trade' as const,
              projectName: project.name
            }
          ].map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedEmployee(member)}
              className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer focus:outline-none"
              title={`${member.name} (${member.role}) - Click for profile`}
            >
              <div className="relative">
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs ring-1 ring-[#E2E8F0] group-hover:ring-2 group-hover:ring-[#1677FF] group-hover:scale-105 transition-all"
                />
                {member.isOnSite ? (
                  <span 
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white shadow-xs" 
                    title="Currently On Site" 
                  />
                ) : (
                  <span 
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#94A3B8] border-2 border-white shadow-xs" 
                    title="Off-Site" 
                  />
                )}
              </div>
              <span className="text-[11px] font-semibold text-[#0F172A] group-hover:text-[#1677FF] transition-colors truncate max-w-[66px] text-center leading-tight">
                {member.name.split(' ')[0]}
              </span>
            </button>
          ))}

          {/* "+3 More / View All" Avatar Button */}
          <button
            onClick={() => handleTabChange('team')}
            className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer focus:outline-none"
            title="View all team members and trades"
          >
            <div className="w-12 h-12 rounded-full bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] group-hover:border-[#1677FF] text-[#64748B] group-hover:text-[#1677FF] flex items-center justify-center text-xs font-bold transition-all group-hover:scale-105">
              +3
            </div>
            <span className="text-[11px] font-semibold text-[#64748B] group-hover:text-[#1677FF] transition-colors text-center leading-tight">
              View All
            </span>
          </button>
        </div>
      </div>

      {/* ── 7. Recent Activity Feed ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 shadow-card flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#0F172A] tracking-tight">
            Recent Activity
          </h3>
          <button 
            onClick={() => handleTabChange('updates')}
            className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 3 Activity Rows with subtle hairlines */}
        <div className="flex flex-col divide-y divide-[#F1F5F9]">
          {/* Row 1: Sarah Johnson photo upload */}
          <div 
            onClick={() => handleTabChange('photos')}
            className="flex items-center justify-between gap-2 py-2.5 cursor-pointer hover:bg-[#F8FAFC] -mx-1 px-1 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" 
                alt="Sarah Johnson"
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#E2E8F0]"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-snug">
                  <span className="font-semibold text-[#0F172A]">Sarah Johnson</span> <span className="text-[#64748B]">uploaded 4 site photos</span>
                </p>
                <span className="text-[10px] text-[#94A3B8]">2 hours ago</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-1">
              <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=120&auto=format&fit=crop&q=80" alt="Site 1" className="w-6 h-6 rounded-md object-cover border border-[#E2E8F0]" />
              <img src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=120&auto=format&fit=crop&q=80" alt="Site 2" className="w-6 h-6 rounded-md object-cover border border-[#E2E8F0]" />
              <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=120&auto=format&fit=crop&q=80" alt="Site 3" className="w-6 h-6 rounded-md object-cover border border-[#E2E8F0]" />
              <span className="w-6 h-6 rounded-md bg-[#F1F5F9] text-[10px] font-bold text-[#64748B] flex items-center justify-center border border-[#E2E8F0]">+1</span>
            </div>
          </div>

          {/* Row 2: Mike Chen marked task complete */}
          <div 
            onClick={() => handleTabChange('tasks')}
            className="flex items-center justify-between gap-2 py-2.5 cursor-pointer hover:bg-[#F8FAFC] -mx-1 px-1 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" 
                alt="Mike Chen"
                className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#E2E8F0]"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-snug">
                  <span className="font-semibold text-[#0F172A]">Mike Chen</span> <span className="text-[#64748B]">marked task complete</span>
                </p>
                <span className="text-[10px] text-[#94A3B8]">4 hours ago</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E9F9F3] text-[#10A976] shrink-0 flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Task Completed</span>
            </span>
          </div>

          {/* Row 3: Change order #07 approved */}
          <div 
            onClick={() => handleTabChange('budget')}
            className="flex items-center justify-between gap-2 py-2.5 cursor-pointer hover:bg-[#F8FAFC] -mx-1 px-1 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-full bg-[#E9F9F3] text-[#10A976] flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-snug">
                  <span className="font-semibold text-[#0F172A]">Change order #07</span> <span className="text-[#64748B]">approved</span>
                </p>
                <span className="text-[10px] text-[#94A3B8]">Yesterday, 3:12 PM</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#E5484D] shrink-0">
              <span>+$28,500</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 7. Bottom Quick Action Bar (3 Balanced Actions) ── */}
      <div className="grid grid-cols-3 gap-2 pt-1 pb-6">
        {/* 1. Add Task */}
        <button
          onClick={onCreateTask || (() => handleTabChange('tasks'))}
          className="h-11 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#1677FF]/40 hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-card hover:shadow-card-hover active:scale-[0.98] cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckSquare className="w-3.5 h-3.5" />
          </div>
          <span className="truncate">Add Task</span>
        </button>

        {/* 2. Add Update */}
        <button
          onClick={() => setIsCreateDailyLogOpen(true)}
          className="h-11 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#10A976]/40 hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-card hover:shadow-card-hover active:scale-[0.98] cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-lg bg-[#E9F9F3] text-[#10A976] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="truncate">Add Update</span>
        </button>

        {/* 3. Add Photo */}
        <button
          onClick={onUploadPhoto || (() => handleTabChange('photos'))}
          className="h-11 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#6366F1]/40 hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-card hover:shadow-card-hover active:scale-[0.98] cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-lg bg-[#EEF2FF] text-[#6366F1] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Camera className="w-3.5 h-3.5" />
          </div>
          <span className="truncate">Add Photo</span>
        </button>
      </div>

      {/* CREATE DAILY LOG / UPDATE MODAL */}
      <CreateDailyLogModal
        isOpen={isCreateDailyLogOpen}
        onClose={() => setIsCreateDailyLogOpen(false)}
        projects={[project]}
        preselectedProjectId={project.id}
        onSaveLog={(newLog) => {
          if (onAddDailyLog) onAddDailyLog(newLog);
          setIsCreateDailyLogOpen(false);
        }}
      />

      {/* WEATHER & DELAY IMPACT MODAL */}
      <WeatherImpactModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        project={project}
        onOpenSchedule={() => handleTabChange('schedule')}
        onOpenDailyLog={() => setIsCreateDailyLogOpen(true)}
      />

      {/* MILESTONE DETAILS MODAL */}
      {selectedMilestone && (
        <MilestoneDetailsModal
          milestone={selectedMilestone}
          projectName={project.name}
          projectTasks={tasks}
          onClose={() => setSelectedMilestone(null)}
          onUpdateStatus={(mId, status) => {
            setSelectedMilestone(prev => prev ? ({ ...prev, status }) : null);
          }}
        />
      )}

      {/* EMPLOYEE PROFILE DETAIL MODAL */}
      <EmployeeProfileModal
        member={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onNavigateToTeam={() => {
          setSelectedEmployee(null);
          handleTabChange('team');
        }}
      />

      {/* PROJECT STAGE & LIFECYCLE MODAL */}
      <ProjectStageModal
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        project={project}
        tasks={tasks}
        punchItems={punchItems}
        currentStageId={selectedStageModalId}
        onUpdateStage={(stageId, updatedStages, newProg) => {
          setProjectStages(updatedStages);
          if (newProg !== undefined) {
            project.progress = newProg;
          }
        }}
      />

    </div>
  );
};
