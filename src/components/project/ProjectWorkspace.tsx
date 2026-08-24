import React, { useState } from 'react';
import { 
  Project, UserRole, Task, GanttItem, TradeCategory, 
  PunchItem, Subcontractor, SitePhoto, DocumentItem, ReportItem, PunchStatus, TaskStatus 
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
import { LattiAssistant } from '../ai/LattiAssistant';
import { 
  Layers, DollarSign, CheckSquare, CalendarDays, 
  AlertCircle, Camera, FileText, Users, Users2, BarChart3, Sparkles 
} from 'lucide-react';

interface ProjectWorkspaceProps {
  project: Project;
  currentRole: UserRole;
  tasks: Task[];
  ganttItems: GanttItem[];
  categories: TradeCategory[];
  punchItems: PunchItem[];
  subcontractors: Subcontractor[];
  photos: SitePhoto[];
  documents: DocumentItem[];
  reports: ReportItem[];
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
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  project,
  currentRole,
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
  onExportReport
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Role based tabs filtering
  const allTabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'punch', label: 'Punch List', icon: AlertCircle },
    { id: 'team', label: 'Team & Notes', icon: Users2 },
    { id: 'subcontractors', label: 'Subcontractors', icon: Users, hideFor: ['field'] },
    { id: 'budget', label: 'Budget', icon: DollarSign, hideFor: ['field'] },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3, hideFor: ['field'] },
    { id: 'latti', label: 'Latti AI', icon: Sparkles },
  ];

  const visibleTabs = allTabs.filter(t => !t.hideFor || !t.hideFor.includes(currentRole));

  return (
    <div className="w-full flex flex-col flex-1">
      {/* Project Sub-navigation Scrollable Pills */}
      <div className="w-full bg-[#080C14] border-b border-[#162033] sticky top-[53px] z-30 px-5 py-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0066FF] text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111827]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content - 20px padding left/right */}
      <div className="px-5 pt-3 flex-1">
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
