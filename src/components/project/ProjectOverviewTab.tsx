import React, { useState, useEffect } from 'react';
import { Project, Task, SitePhoto, DocumentItem, PunchItem, ChangeOrder } from '../../types';
import {
  Calendar, Check, ChevronRight, Users, FileText, CloudRain,
  Landmark, Camera, CheckSquare, MapPin, User, Building2
} from 'lucide-react';
import { CreateDailyLogModal } from '../modals/CreateDailyLogModal';
import { WeatherImpactModal } from '../modals/WeatherImpactModal';
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
  onOpenEditProject?: () => void;
  canViewBudget?: boolean;
  canManageSchedule?: boolean;
  canManageStages?: boolean;
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  tasks = [],
  photos = [],
  documents = [],
  punchItems = [],
  changeOrders = [],
  onSelectTab,
  onNavigate,
  onCreateTask,
  onUploadPhoto,
  onAddDailyLog,
  onOpenEditProject,
  canViewBudget = true,
  canManageSchedule = false,
  canManageStages = false,
}) => {
  const [isCreateDailyLogOpen, setIsCreateDailyLogOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
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

  useEffect(() => {
    if (project.stages && project.stages.length > 0) {
      setProjectStages(project.stages);
    }
  }, [project.stages]);

  const handleTabChange = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    else if (onNavigate) onNavigate(tabId);
  };

  const handleStageClick = (stageId: string) => {
    setSelectedStageModalId(stageId);
    setIsStageModalOpen(true);
  };

  const currentStageIndex = projectStages.findIndex(s => s.status === 'In Progress');
  const activeStage = currentStageIndex !== -1 ? projectStages[currentStageIndex] : projectStages[3];
  const stageNumber = currentStageIndex !== -1 ? currentStageIndex + 1 : 4;

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

        {/* Progress & Current Stage Info */}
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

          {/* Right: Current Stage */}
          <div
            onClick={() => handleStageClick(activeStage?.id || 'stg-4')}
            className="flex items-center gap-1 text-right shrink-0 cursor-pointer group pl-2 py-1 px-2 rounded-xl hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-[#E2E8F0]"
            title="Click to view stage details"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Stage {stageNumber} of {projectStages.length}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#0F172A] block group-hover:text-[#1677FF] transition-colors leading-tight mt-0.5">
                {activeStage?.name || 'Construction'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1677FF] transition-colors shrink-0" />
          </div>
        </div>
      </div>

      {/* ── 2. Project Details (Vertical Stacked Card strictly following Lattice System) ── */}
      <div
        onClick={onOpenEditProject}
        className={`bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex flex-col gap-3.5 transition-all group ${
          onOpenEditProject ? 'cursor-pointer hover:border-[#1677FF]/40' : ''
        }`}
      >
        {/* Header with Title and Chevron */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1677FF]" />
            <h3 className={`text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight ${onOpenEditProject ? 'group-hover:text-[#1677FF] transition-colors' : ''}`}>
              Project Details
            </h3>
          </div>
          {onOpenEditProject && (
            <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1677FF] transition-colors" />
          )}
        </div>

        {/* Vertical Stacked Rows ("lamba kore") */}
        <div className="flex flex-col gap-3.5 pt-1">
          {/* 1. Address */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#64748B] font-medium block leading-none">
                  Address
                </span>
                {project.masterCode && (
                  <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-full font-mono">
                    Master #{project.masterCode}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#0F172A] leading-snug">
                {project.location || '1840 Brightwaters Blvd NE'}{project.cityState ? `, ${project.cityState}` : ''}
              </p>
            </div>
          </div>

          {/* 2. Client / Owner */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
              <User className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs text-[#64748B] font-medium block leading-none mb-1">
                Client / Owner
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0F172A] leading-tight">
                {project.clientName || 'Arthur & Evelyn Vance'}
              </p>
            </div>
          </div>

          {/* 3. Lead PM */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
              <Users className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs text-[#64748B] font-medium block leading-none mb-1">
                Lead PM
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0F172A] leading-tight">
                {project.projectManager?.name || 'Sarah Johnson'}
              </p>
            </div>
          </div>

          {/* 4. Important Project Timeline: Start Date & Target Completion Date */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1 grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-[#64748B] font-medium block leading-none mb-1">
                  Start Date
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#0F172A] leading-tight">
                  {project.startDate
                    ? new Date(project.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Mar 01, 2024'}
                </p>
              </div>

              <div>
                <span className="text-xs text-[#64748B] font-medium block leading-none mb-1">
                  Target Completion
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#0F172A] leading-tight">
                  {project.targetEndDate
                    ? new Date(project.targetEndDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Aug 30, 2025'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Project Scope & Notes Card ── */}
      <div
        onClick={onOpenEditProject}
        className={`bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex flex-col gap-2 transition-all group ${
          onOpenEditProject ? 'cursor-pointer hover:border-[#1677FF]/40' : ''
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 stroke-[2]" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight group-hover:text-[#1677FF] transition-colors">
            Project Scope & Notes
          </h3>
        </div>
        <p className="text-xs text-[#475569] leading-relaxed font-normal mt-0.5">
          {project.description || 'Luxury coastal modern waterfront residence featuring post-tension concrete foundation, impact glass curtain walls, and high-performance building envelope.'}
        </p>
      </div>

      {/* ── 4. 3-Column Metric Suite Card (Clean, Spacious, Non-redundant) ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 shadow-card">
        <div className="grid grid-cols-3 divide-x divide-[#F1F5F9]">
          {/* Metric 1: Budget (hidden for Field) or Photos */}
          {canViewBudget ? (
          <div
            onClick={() => handleTabChange('budget')}
            className="flex flex-col items-start pr-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shrink-0">
              <Landmark className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors leading-tight truncate w-full">
              ${(project.budget?.total ? project.budget.total / 1000000 : 4.65).toFixed(2)}M
            </span>
            <span className="text-[11px] text-[#64748B] font-medium leading-tight mt-0.5 truncate w-full">
              Total Budget
            </span>
          </div>
          ) : (
          <div
            onClick={() => handleTabChange('photos')}
            className="flex flex-col items-start pr-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shrink-0">
              <Camera className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors leading-tight truncate w-full">
              {photos.filter(p => !p.projectId || p.projectId === project.id).length}
            </span>
            <span className="text-[11px] text-[#64748B] font-medium leading-tight mt-0.5 truncate w-full">
              Site Photos
            </span>
          </div>
          )}

          {/* Metric 2: Active Tasks */}
          <div
            onClick={() => handleTabChange('tasks')}
            className="flex flex-col items-start px-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shrink-0">
              <CheckSquare className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors leading-tight truncate w-full">
              {tasks.filter(t => t.projectId === project.id && t.status !== 'Completed').length}
            </span>
            <span className="text-[11px] text-[#64748B] font-medium leading-tight mt-0.5 truncate w-full">
              Active Tasks
            </span>
          </div>

          {/* Metric 3: Documents */}
          <div
            onClick={() => handleTabChange('documents')}
            className="flex flex-col items-start pl-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shrink-0">
              <FileText className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-sm font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors leading-tight truncate w-full">
              {documents.filter(d => !d.projectId || d.projectId === project.id).length}
            </span>
            <span className="text-[11px] text-[#64748B] font-medium leading-tight mt-0.5 truncate w-full">
              Documents
            </span>
          </div>
        </div>
      </div>

      {/* ── 5. Weather Warning (Clean Neutral Lattice Strip - Zero Yellow Bloat) ── */}
      <div
        onClick={() => setIsWeatherModalOpen(true)}
        className="bg-white border border-[#E2E8F0] hover:border-[#1677FF]/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2.5 cursor-pointer transition-all group shadow-card"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse shrink-0" />
          <p className="text-xs text-[#0F172A] truncate">
            <span className="font-bold">Weather Risk:</span>{' '}
            <span className="text-[#64748B]">Rain expected Thursday (concrete pour)</span>
          </p>
        </div>
        <div className="flex items-center gap-0.5 text-xs font-semibold text-[#1677FF] shrink-0 group-hover:translate-x-0.5 transition-transform">
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
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
            <span className="text-[10px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
              4 Members
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
              designation: 'Lead Project Manager',
              company: 'Lattice Construction',
              phone: '+1 (555) 345-6789',
              email: 'sarah.j@averymarsh.com',
              avatar: project.projectManager?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
              type: 'gc' as const,
              projectName: project.name,
              address: '1840 Brightwaters Blvd NE, Tampa, FL 33704'
            },
            {
              id: 'emp-2',
              name: 'John Smith',
              role: 'Lead Field Superintendent',
              designation: 'Lead Field Superintendent',
              company: 'Lattice Construction',
              phone: '+1 (555) 567-8901',
              email: 'john.s@averymarsh.com',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
              type: 'gc' as const,
              projectName: project.name,
              address: '1840 Brightwaters Blvd NE, Tampa, FL 33704'
            },
            {
              id: 'emp-3',
              name: 'Emily Brown',
              role: 'Site Safety Officer',
              designation: 'Site Safety Officer',
              company: 'Lattice Construction',
              phone: '+1 (555) 789-0123',
              email: 'emily.b@averymarsh.com',
              avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
              type: 'gc' as const,
              projectName: project.name,
              address: '401 E Jackson St, Tampa, FL 33602'
            },
            {
              id: 'emp-5',
              name: 'Carlos Ortiz',
              role: 'Earthwork Site Foreman',
              designation: 'Earthwork Site Foreman',
              company: 'Earthworks Pro LLC',
              phone: '+1 (555) 234-5678',
              email: 'carlos@earthworkspro.com',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
              type: 'trade' as const,
              projectName: project.name,
              address: '4102 W Hillsborough Ave, Tampa, FL 33614'
            }
          ].map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedEmployee(member)}
              className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer focus:outline-none"
              title={`${member.name} (${member.role}) - Click for profile`}
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs ring-1 ring-[#E2E8F0] group-hover:ring-2 group-hover:ring-[#1677FF] group-hover:scale-105 transition-all"
              />
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

      {/* ── 7. Recent Activity Feed (Dynamic) ── */}
      {(() => {
        const recentCompletedTask = tasks.filter(t => t.projectId === project.id && t.status === 'Completed').slice(-1)[0];
        const recentPhotos = (photos || []).filter(p => p.projectId === project.id).slice(0, 4);
        const recentApprovedCO = canViewBudget
          ? (changeOrders || []).filter(co => co.projectId === project.id && co.status === 'Approved').slice(-1)[0]
          : undefined;

        const hasAnyActivity = recentCompletedTask || recentPhotos.length > 0 || recentApprovedCO;

        return (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 shadow-card flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#0F172A] tracking-tight">
                Recent Activity
              </h3>
              <button
                onClick={() => handleTabChange('daily-logs')}
                className="text-xs font-semibold text-[#1677FF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex flex-col divide-y divide-[#F1F5F9]">
              {/* Row 1: Latest photos */}
              {recentPhotos.length > 0 && (
                <div
                  onClick={() => handleTabChange('photos')}
                  className="flex items-center justify-between gap-2 py-2.5 cursor-pointer hover:bg-[#F8FAFC] -mx-1 px-1 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img
                      src={project.projectManager?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                      alt={project.projectManager?.name || 'PM'}
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#E2E8F0]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-snug">
                        <span className="font-semibold text-[#0F172A]">{project.projectManager?.name || 'Team'}</span>{' '}
                        <span className="text-[#64748B]">uploaded {recentPhotos.length} site photo{recentPhotos.length > 1 ? 's' : ''}</span>
                      </p>
                      <span className="text-[10px] text-[#94A3B8]">Recent</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    {recentPhotos.slice(0, 3).map((ph, i) => (
                      <img key={i} src={ph.url} alt={`Site ${i + 1}`} className="w-6 h-6 rounded-md object-cover border border-[#E2E8F0]" />
                    ))}
                    {recentPhotos.length > 3 && (
                      <span className="w-6 h-6 rounded-md bg-[#F1F5F9] text-[10px] font-bold text-[#64748B] flex items-center justify-center border border-[#E2E8F0]">
                        +{recentPhotos.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Row 2: Most recently completed task */}
              {recentCompletedTask && (
                <div
                  onClick={() => handleTabChange('tasks')}
                  className="flex items-center justify-between gap-2 py-2.5 cursor-pointer hover:bg-[#F8FAFC] -mx-1 px-1 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img
                      src={typeof recentCompletedTask.assignee === 'object' ? recentCompletedTask.assignee.avatar : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                      alt="Assignee"
                      className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#E2E8F0]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-snug">
                        <span className="font-semibold text-[#0F172A]">
                          {typeof recentCompletedTask.assignee === 'object' ? recentCompletedTask.assignee.name : 'Team'}
                        </span>{' '}
                        <span className="text-[#64748B]">marked task complete</span>
                      </p>
                      <span className="text-[10px] text-[#94A3B8] truncate block max-w-[160px]">{recentCompletedTask.title}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E9F9F3] text-[#10A976] shrink-0 flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    <span>Completed</span>
                  </span>
                </div>
              )}

              {/* Row 3: Most recently approved Change Order */}
              {recentApprovedCO && (
                <div
                  onClick={() => handleTabChange('budget')}
                  className="flex items-center justify-between gap-2 py-2.5 cursor-pointer hover:bg-[#F8FAFC] -mx-1 px-1 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-full bg-[#E9F9F3] text-[#10A976] flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-snug truncate">
                        <span className="font-semibold text-[#0F172A]">{recentApprovedCO.title}</span>{' '}
                        <span className="text-[#64748B]">approved</span>
                      </p>
                      <span className="text-[10px] text-[#94A3B8]">{recentApprovedCO.createdDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#10A976] shrink-0">
                    <span>+${recentApprovedCO.amount.toLocaleString()}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!hasAnyActivity && (
                <div className="py-4 text-center">
                  <p className="text-xs text-[#94A3B8]">No recent activity yet</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

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
        onOpenSchedule={canManageSchedule ? () => handleTabChange('schedule') : undefined}
        onOpenDailyLog={onAddDailyLog ? () => setIsCreateDailyLogOpen(true) : undefined}
      />



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
        onUpdateStage={canManageStages ? (stageId, updatedStages, newProg) => {
          setProjectStages(updatedStages);
          if (newProg !== undefined) {
            project.progress = newProg;
          }
        } : undefined}
      />

    </div>
  );
};
