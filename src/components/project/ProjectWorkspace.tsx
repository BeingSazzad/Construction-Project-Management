import React, { useState } from 'react';
import { 
  Project, UserRole, Task, GanttItem, TradeCategory, 
  PunchItem, Subcontractor, SitePhoto, DocumentItem, ReportItem, 
  PunchStatus, TaskStatus, PlanGridPin, ProjectChatMessage, User,
  ProjectStatus
} from '../../types';
import { ProjectOverviewTab } from './ProjectOverviewTab';
import { ProjectDailyLogsTab } from './ProjectDailyLogsTab';
import { ProjectBudgetTab } from './ProjectBudgetTab';
import { ProjectTasksTab } from './ProjectTasksTab';
import { ProjectPunchListTab } from './ProjectPunchListTab';
import { ProjectPhotosTab } from './ProjectPhotosTab';
import { ProjectDocumentsTab } from './ProjectDocumentsTab';
import { ProjectTeamTab } from './ProjectTeamTab';
import { ProjectReportsTab } from './ProjectReportsTab';
import { ProjectScheduleTab } from './ProjectScheduleTab';
import { LattiAssistant } from '../ai/LattiAssistant';
import { 
  Layers, DollarSign, CheckSquare, 
  AlertCircle, Camera, FileText, Users2, 
  BarChart3, Sparkles, MapPin, Calendar, ArrowLeft, ClipboardList 
} from 'lucide-react';

interface ProjectWorkspaceProps {
  project: Project;
  currentRole: UserRole;
  currentUser: User;
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
  tasks: Task[];
  ganttItems: GanttItem[];
  categories: TradeCategory[];
  punchItems: PunchItem[];
  subcontractors: Subcontractor[];
  photos: SitePhoto[];
  documents: DocumentItem[];
  reports: ReportItem[];
  planPins?: PlanGridPin[];
  chatMessages?: ProjectChatMessage[];
  onOpenTask: (task: Task) => void;
  onCreateTask: () => void;
  onOpenPunch: (item: PunchItem) => void;
  onCreatePunch: () => void;
  onUpdatePunchStatus: (punchId: string, status: PunchStatus) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onUploadPhoto: () => void;
  onPreviewPhoto: (photo: SitePhoto) => void;
  onUploadDocument: () => void;
  onPreviewDocument: (doc: DocumentItem) => void;
  onExportReport: (report: ReportItem) => void;
  onAddPlanPin?: (planPin: PlanGridPin) => void;
  onUpdatePinStatus?: (pinId: string, status: 'open' | 'in-progress' | 'resolved') => void;
  onSendMessage?: (msg: ProjectChatMessage) => void;
  onAddTasksFromTemplate?: (tasks: Partial<Task>[]) => void;
  onUpdateProjectStatus?: (projectId: string, newStatus: ProjectStatus) => void;
  onOpenEditProject?: () => void;
  onImportBudget?: () => void;
  changeOrders?: any[];
  onCreateChangeOrder?: () => void;
  onAddReport?: (newReport: Partial<ReportItem>) => void;
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  project,
  currentRole,
  currentUser,
  activeSubTab,
  onSubTabChange,
  tasks,
  ganttItems,
  categories,
  punchItems,
  subcontractors,
  photos,
  documents,
  reports,
  onOpenTask,
  onCreateTask,
  onOpenPunch,
  onCreatePunch,
  onUpdatePunchStatus,
  onUpdateTaskStatus,
  onUploadPhoto,
  onPreviewPhoto,
  onUploadDocument,
  onPreviewDocument,
  onExportReport,
  onUpdateProjectStatus,
  onOpenEditProject,
  onImportBudget,
  changeOrders,
  onCreateChangeOrder,
  onAddReport
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<string>('overview');
  const activeTab = activeSubTab !== undefined ? activeSubTab : internalActiveTab;
  
  const setActiveTab = (tab: string) => {
    setInternalActiveTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  // Quick Action / Navigation pages that have dedicated views and are accessed directly from Overview
  const isQuickActionPage = ['tasks', 'punch', 'photos', 'documents', 'daily-logs', 'schedule', 'milestones'].includes(activeTab);

  // Core project tabs according to Reference Web Specs (Drawings, Messages, Subcontractors belong in their respective hub/docs)
  const allTabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'daily-logs', label: 'Daily Logs', icon: ClipboardList },
    { id: 'budget', label: 'Budget', icon: DollarSign, hideFor: ['field'] },
    { id: 'team', label: 'Team', icon: Users2 },
    { id: 'reports', label: 'Reports', icon: BarChart3, hideFor: ['field'] },
  ];

  const visibleTabs = allTabs.filter(t => !t.hideFor || !t.hideFor.includes(currentRole));

  const getPageTitle = (tabId: string) => {
    switch (tabId) {
      case 'tasks': return 'Project Tasks';
      case 'punch': return 'Punch List';
      case 'photos': return 'Site Photos';
      case 'documents': return 'Project Documents';
      case 'schedule': return 'Schedule & Calendar';
      case 'milestones': return 'Milestone Tracker';
      default: return '';
    }
  };

  return (
    <div className="w-full flex flex-col flex-1">
      {/* Dynamic Header: Dedicated Back Header for Quick Action Pages vs Tab Scrollbar for Project Tabs */}
      {isQuickActionPage ? (
        <div className="w-full bg-[#060913]/95 backdrop-blur-md border-b border-[#142036] sticky top-0 z-20 px-5 py-2">
          <div className="flex items-center justify-between max-w-[430px] mx-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition-all bg-[#0D1424] hover:bg-[#142036] px-3 py-1.5 rounded-xl border border-[#1E2E4A] active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-[#060913] border-b border-[#142036] sticky top-0 z-20">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none px-5 py-2.5 max-w-[430px] mx-auto">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 active:scale-95 ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400/50'
                      : 'bg-[#0D1424] text-slate-400 hover:text-slate-200 border border-[#1A263E]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Workspace Body Content */}
      <div className="flex-1 overflow-y-auto">
        {(activeTab === 'overview' || !['daily-logs', 'budget', 'budgets', 'team', 'reports', 'tasks', 'punch', 'photos', 'documents', 'schedule', 'milestones'].includes(activeTab)) && (
          <ProjectOverviewTab
            project={project}
            tasks={tasks}
            photos={photos}
            documents={documents}
            punchItems={punchItems}
            onSelectTab={(subTab) => setActiveTab(subTab)}
            onNavigate={(subTab) => setActiveTab(subTab)}
            changeOrders={changeOrders}
            onCreateChangeOrder={onCreateChangeOrder}
            onUpdateTaskStatus={onUpdateTaskStatus}
          />
        )}

        {activeTab === 'daily-logs' && (
          <ProjectDailyLogsTab
            project={project}
            dailyLogs={project.dailyLogs || [
              {
                id: 'dl-1',
                projectId: project.id,
                projectName: project.name,
                date: 'Aug 27, 2026',
                weather: {
                  condition: 'Sunny',
                  temperature: '78°F / 25°C',
                  windSpeed: '6 mph SW',
                  precipitation: '0%',
                  siteCondition: 'Dry'
                },
                totalHeadcount: 24,
                crews: [
                  {
                    trade: 'Concrete & Steel',
                    subcontractor: 'Apex Concrete LLC',
                    workersCount: 14,
                    hoursWorked: 8,
                    notes: 'Poured foundation slab section B'
                  }
                ],
                workSummary: 'Completed level 4 slab pour and inspected rebar installation. Field Superintendent verified quality check.',
                materialsReceived: ['3 ready-mix concrete trucks (24 cu yd)', '#4 Rebar 20ft bundles (10)'],
                safetyIncidents: '0 Incidents. PPE inspection completed 100% compliant.',
                safetyPassed: true,
                author: 'Elena Rossi (PM)'
              }
            ]}
          />
        )}

        {(activeTab === 'budget' || activeTab === 'budgets') && (
          <ProjectBudgetTab
            project={project}
            categories={categories}
            onAddCostItem={() => alert("Add Cost Code Line Item")}
            onImportBudget={onImportBudget}
          />
        )}

        {activeTab === 'team' && (
          <ProjectTeamTab
            project={project}
          />
        )}

        {activeTab === 'reports' && (
          <ProjectReportsTab
            project={project}
            reports={reports}
            onExportReport={onExportReport}
            onAddReport={onAddReport}
          />
        )}

        {/* Quick Action Dedicated Full Views */}
        {activeTab === 'tasks' && (
          <ProjectTasksTab
            project={project}
            tasks={tasks}
            onOpenTask={onOpenTask}
            onCreateTask={onCreateTask}
            onUpdateStatus={onUpdateTaskStatus}
          />
        )}

        {activeTab === 'punch' && (
          <ProjectPunchListTab
            project={project}
            punchItems={punchItems}
            onCreatePunch={onCreatePunch}
            onOpenPunchDetails={onOpenPunch}
            onUpdatePunchStatus={onUpdatePunchStatus}
          />
        )}

        {activeTab === 'photos' && (
          <ProjectPhotosTab
            project={project}
            photos={photos}
            onUploadPhoto={onUploadPhoto}
            onPreviewPhoto={onPreviewPhoto}
          />
        )}

        {activeTab === 'documents' && (
          <ProjectDocumentsTab
            project={project}
            documents={documents}
            onUploadDocument={onUploadDocument}
            onPreviewDocument={onPreviewDocument}
          />
        )}

        {(activeTab === 'schedule' || activeTab === 'milestones') && (
          <ProjectScheduleTab
            project={project}
            ganttItems={ganttItems}
            onCreateTask={onCreateTask}
            isMilestoneView={activeTab === 'milestones'}
          />
        )}
      </div>
    </div>
  );
};
