import React, { useState } from 'react';
import { 
  Project, UserRole, Task, GanttItem, TradeCategory, 
  PunchItem, Subcontractor, SitePhoto, DocumentItem, ReportItem, 
  PunchStatus, TaskStatus, PlanGridPin, ProjectChatMessage, User,
  ProjectStatus, DailyLogItem, ProjectUpdate
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
import { ProjectUpdatesTab } from './ProjectUpdatesTab';
import { MOCK_PROJECT_UPDATES } from '../../data/mockData';
import { 
  Layers, DollarSign, CheckSquare, 
  Camera, FileText, Users2, 
  Calendar, ArrowLeft, Activity 
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
  onAddDailyLog?: (newLog: DailyLogItem) => void;
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  project,
  currentRole,
  activeSubTab,
  onSubTabChange,
  tasks,
  ganttItems,
  categories,
  punchItems,
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
  onImportBudget,
  changeOrders,
  onCreateChangeOrder,
  onAddReport,
  onAddDailyLog
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<string>('overview');
  const activeTab = activeSubTab !== undefined ? activeSubTab : internalActiveTab;
  
  const setActiveTab = (tab: string) => {
    setInternalActiveTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const isQuickActionPage = ['tasks', 'punch', 'photos', 'documents'].includes(activeTab);

  const allTabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'updates', label: 'Updates', icon: Activity },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'team', label: 'Team', icon: Users2 },
  ];

  return (
    <div className="w-full flex flex-col flex-1 bg-[#F2F2F7]">
      {/* Sub-navigation bar with light theme pills */}
      {isQuickActionPage ? (
        <div className="w-full bg-white border-b border-[#DDE1E7] sticky top-0 z-20 px-5 py-2">
          <div className="flex items-center justify-between max-w-[430px] mx-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-1.5 text-xs font-bold text-[#171A1F] hover:text-[#1677FF] cursor-pointer transition-all bg-[#F2F2F7] hover:bg-[#EAEDF1] px-3 py-1.5 rounded-xl border border-[#DDE1E7] active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-white border-b border-[#DDE1E7] sticky top-0 z-20">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-5 py-2.5 max-w-[430px] mx-auto">
            {allTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 active:scale-95 ${
                    isActive
                      ? 'bg-[#1677FF] text-white shadow-sm'
                      : 'bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] border border-[#DDE1E7]'
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
        {(activeTab === 'overview' || !['updates', 'daily-logs', 'budget', 'budgets', 'team', 'reports', 'tasks', 'punch', 'photos', 'documents', 'schedule'].includes(activeTab)) && (
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
          />
        )}

        {activeTab === 'updates' && (
          <ProjectUpdatesTab
            project={project}
            updates={MOCK_PROJECT_UPDATES.filter(u => u.projectId === project.id)}
            onAddUpdate={() => alert("Post update to feed")}
          />
        )}

        {activeTab === 'daily-logs' && (
          <ProjectDailyLogsTab
            project={project}
            dailyLogs={project.dailyLogs || []}
            onAddDailyLog={onAddDailyLog}
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

        {activeTab === 'schedule' && (
          <ProjectScheduleTab
            project={project}
            tasks={tasks}
            ganttItems={ganttItems}
            onCreateTask={onCreateTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
          />
        )}
      </div>
    </div>
  );
};
