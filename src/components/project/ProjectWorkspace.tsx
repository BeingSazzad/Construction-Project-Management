import React, { useState } from 'react';
import { 
  Project, UserRole, Task, GanttItem, TradeCategory, 
  PunchItem, Subcontractor, SitePhoto, DocumentItem, ReportItem, 
  PunchStatus, TaskStatus, DailyLogItem, PlanGridPin, ProjectChatMessage, User,
  ProjectStatus
} from '../../types';
import { ProjectOverviewTab } from './ProjectOverviewTab';
import { ProjectBudgetTab } from './ProjectBudgetTab';
import { ProjectTasksTab } from './ProjectTasksTab';
import { ProjectScheduleTab } from './ProjectScheduleTab';
import { ProjectPunchListTab } from './ProjectPunchListTab';
import { ProjectPhotosTab } from './ProjectPhotosTab';
import { ProjectDocumentsTab } from './ProjectDocumentsTab';
import { ProjectSubcontractorsTab } from './ProjectSubcontractorsTab';
import { ProjectTeamTab } from './ProjectTeamTab';
import { ProjectReportsTab } from './ProjectReportsTab';
import { ProjectDailyLogsTab } from './ProjectDailyLogsTab';
import { ProjectPlanGridTab } from './ProjectPlanGridTab';
import { ProjectMessagesTab } from './ProjectMessagesTab';
import { LattiAssistant } from '../ai/LattiAssistant';
import { 
  Layers, DollarSign, CheckSquare, CalendarDays, 
  AlertCircle, Camera, FileText, Users, Users2, 
  BarChart3, Sparkles, MapPin, Calendar, MessageSquare, ArrowLeft 
} from 'lucide-react';

interface ProjectWorkspaceProps {
  project: Project;
  currentRole: UserRole;
  currentUser: User;
  tasks: Task[];
  ganttItems: GanttItem[];
  categories: TradeCategory[];
  punchItems: PunchItem[];
  subcontractors: Subcontractor[];
  photos: SitePhoto[];
  documents: DocumentItem[];
  reports: ReportItem[];
  dailyLogs: DailyLogItem[];
  planPins: PlanGridPin[];
  chatMessages: ProjectChatMessage[];
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
  onAddDailyLog?: (log: DailyLogItem) => void;
  onAddPlanPin?: (pin: PlanGridPin) => void;
  onUpdatePinStatus?: (pinId: string, status: 'open' | 'in-progress' | 'resolved') => void;
  onSendMessage?: (msg: ProjectChatMessage) => void;
  onAddTasksFromTemplate?: (tasks: Partial<Task>[]) => void;
  onUpdateProjectStatus?: (projectId: string, newStatus: ProjectStatus) => void;
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  project,
  currentRole,
  currentUser,
  tasks,
  ganttItems,
  categories,
  punchItems,
  subcontractors,
  photos,
  documents,
  reports,
  dailyLogs,
  planPins,
  chatMessages,
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
  onAddDailyLog,
  onAddPlanPin,
  onUpdatePinStatus,
  onSendMessage,
  onAddTasksFromTemplate,
  onUpdateProjectStatus
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Quick Action / Navigation pages that have dedicated views and are accessed directly
  const isQuickActionPage = ['tasks', 'punch', 'photos', 'documents'].includes(activeTab);

  // Core project tabs (Quick Action items: Tasks, Punch, Photos, Docs are kept separate)
  const allTabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'plangrid', label: 'Drawings', icon: MapPin },
    { id: 'daily-logs', label: 'Daily Logs', icon: Calendar },
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
      default: return '';
    }
  };

  return (
    <div className="w-full flex flex-col flex-1">
      {/* Dynamic Header: Dedicated Back Header for Quick Action Pages vs Tab Scrollbar for Project Tabs */}
      {isQuickActionPage ? (
        <div className="w-full bg-[#060913]/95 backdrop-blur-md border-b border-[#142036] sticky top-0 z-20 px-5 py-2.5">
          <div className="flex items-center justify-between max-w-[430px] mx-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer transition-all bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-full border border-blue-500/20 active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Back to Overview</span>
            </button>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {getPageTitle(activeTab)}
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full bg-[#060913]/95 backdrop-blur-md border-b border-[#142036] sticky top-0 z-20 px-5 py-2">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 max-w-[430px] mx-auto">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-1.5 px-3 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#2563EB] text-white font-bold shadow-md shadow-blue-500/20'
                      : 'bg-[#0A111F] text-slate-400 hover:text-white border border-[#142036]'
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

      {/* Main Tab Content */}
      <div className="px-5 pt-2 flex-1">
        {activeTab === 'overview' && (
          <ProjectOverviewTab
            project={project}
            tasks={tasks}
            punchItems={punchItems}
            photos={photos}
            documents={documents}
            onTabChange={setActiveTab}
            onOpenTask={onOpenTask}
            onOpenPunch={onOpenPunch}
            onOpenLatti={() => setActiveTab('latti')}
            onAddTasksFromTemplate={onAddTasksFromTemplate}
            onUpdateStatus={(newStatus) => onUpdateProjectStatus?.(project.id, newStatus)}
          />
        )}

        {activeTab === 'daily-logs' && (
          <ProjectDailyLogsTab
            project={project}
            dailyLogs={dailyLogs}
            onAddDailyLog={onAddDailyLog}
          />
        )}

        {activeTab === 'plangrid' && (
          <ProjectPlanGridTab
            project={project}
            pins={planPins}
            onAddPin={onAddPlanPin}
            onUpdatePinStatus={onUpdatePinStatus}
          />
        )}

        {activeTab === 'messages' && (
          <ProjectMessagesTab
            project={project}
            messages={chatMessages}
            currentUser={currentUser}
            onSendMessage={onSendMessage}
          />
        )}

        {activeTab === 'budget' && (
          <ProjectBudgetTab
            project={project}
            categories={categories}
            onAddCostItem={() => alert("Add Cost Code Line Item")}
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

        {activeTab === 'schedule' && (
          <ProjectScheduleTab
            project={project}
            ganttItems={ganttItems}
            onCreateTask={onCreateTask}
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

        {activeTab === 'team' && (
          <ProjectTeamTab
            project={project}
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

        {activeTab === 'subcontractors' && (
          <ProjectSubcontractorsTab
            project={project}
            subcontractors={subcontractors}
          />
        )}

        {activeTab === 'reports' && (
          <ProjectReportsTab
            project={project}
            reports={reports}
            onExportReport={onExportReport}
          />
        )}

        {activeTab === 'latti' && (
          <div className="pb-24">
            <LattiAssistant
              currentRole={currentRole}
              activeProject={project}
              tasks={tasks}
              punchItems={punchItems}
              onNavigate={(tabId) => setActiveTab(tabId)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
