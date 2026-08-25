import React, { useState } from 'react';
import { 
  UserRole, Project, Task, GanttItem, TradeCategory, 
  PunchItem, Subcontractor, SitePhoto, DocumentItem, ReportItem, 
  NotificationItem, TaskStatus, PunchStatus, DailyLogItem, PlanGridPin, ProjectChatMessage 
} from './types';
import { 
  CURRENT_USERS, MOCK_PROJECTS, MOCK_TASKS, MOCK_GANTT, 
  MOCK_BUDGET_CATEGORIES, MOCK_PUNCH_ITEMS, MOCK_SUBCONTRACTORS, 
  MOCK_PHOTOS, MOCK_DOCUMENTS, MOCK_REPORTS, MOCK_NOTIFICATIONS,
  MOCK_DAILY_LOGS, MOCK_PLAN_PINS, MOCK_PROJECT_CHATS 
} from './data/mockData';

// Common Components
import { DeviceFrame } from './components/common/DeviceFrame';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';

// Auth & Onboarding
import { AuthScreens } from './components/auth/AuthScreens';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';

// Dashboards
import { SimpleHomeView } from './components/dashboards/SimpleHomeView';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { PMDashboard } from './components/dashboards/PMDashboard';
import { FinanceDashboard } from './components/dashboards/FinanceDashboard';
import { FieldDashboard } from './components/dashboards/FieldDashboard';

// Projects & Workspace
import { ProjectsList } from './components/project/ProjectsList';
import { ProjectWorkspace } from './components/project/ProjectWorkspace';
import { ProjectTasksTab } from './components/project/ProjectTasksTab';
import { ProjectScheduleTab } from './components/project/ProjectScheduleTab';
import { ProjectBudgetTab } from './components/project/ProjectBudgetTab';
import { ProjectReportsTab } from './components/project/ProjectReportsTab';

// Opportunities & Budgets Hub (Matching User Screenshots)
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { BudgetsHubView } from './components/budgets/BudgetsHubView';

// AI
import { LattiAssistant } from './components/ai/LattiAssistant';

// Settings & Legal
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { CreatePunchModal } from './components/modals/CreatePunchModal';
import { PhotoUploadModal } from './components/modals/PhotoUploadModal';
import { TaskDetailsModal } from './components/modals/TaskDetailsModal';
import { PhotoPreviewModal } from './components/modals/PhotoPreviewModal';
import { DocumentPreviewModal } from './components/modals/DocumentPreviewModal';
import { NotificationDrawer } from './components/modals/NotificationDrawer';

export function App() {
  // Navigation & View State
  const [appView, setAppView] = useState<'auth' | 'onboarding' | 'workspace'>('workspace');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [currentRole, setCurrentRole] = useState<UserRole>('pm'); // Default to Project Manager
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Entities state
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [ganttItems, setGanttItems] = useState<GanttItem[]>(MOCK_GANTT);
  const [categories, setCategories] = useState<TradeCategory[]>(MOCK_BUDGET_CATEGORIES);
  const [punchItems, setPunchItems] = useState<PunchItem[]>(MOCK_PUNCH_ITEMS);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>(MOCK_SUBCONTRACTORS);
  const [photos, setPhotos] = useState<SitePhoto[]>(MOCK_PHOTOS);
  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCUMENTS);
  const [reports, setReports] = useState<ReportItem[]>(MOCK_REPORTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [dailyLogs, setDailyLogs] = useState<DailyLogItem[]>(MOCK_DAILY_LOGS);
  const [planPins, setPlanPins] = useState<PlanGridPin[]>(MOCK_PLAN_PINS);
  const [chatMessages, setChatMessages] = useState<ProjectChatMessage[]>(MOCK_PROJECT_CHATS);

  // Modals state
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreatePunchOpen, setIsCreatePunchOpen] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const currentUser = CURRENT_USERS[currentRole] || CURRENT_USERS.pm;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Handlers
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setActiveTab('home');
    setAppView('workspace');
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' | 'forgot' = 'signin') => {
    setAuthMode(mode);
    setAppView('auth');
  };

  const handleStartOnboarding = () => {
    setAppView('onboarding');
  };

  const handleLoginSuccess = (role: UserRole) => {
    setCurrentRole(role);
    setAppView('workspace');
    setActiveTab('home');
  };

  const handleCompleteOnboarding = (role: UserRole) => {
    setCurrentRole(role);
    setAppView('workspace');
    setActiveTab('home');
  };

  const handleResetData = () => {
    setProjects(MOCK_PROJECTS);
    setTasks(MOCK_TASKS);
    setPunchItems(MOCK_PUNCH_ITEMS);
    setPhotos(MOCK_PHOTOS);
    setNotifications(MOCK_NOTIFICATIONS);
    setActiveProject(null);
    setActiveTab('home');
  };

  const handleCreateProject = (newProj: Partial<Project>) => {
    const fullProj: Project = {
      id: `proj-${Date.now()}`,
      name: newProj.name || 'New Construction Project',
      code: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      location: newProj.location || 'Site Location',
      cityState: newProj.cityState || 'New York, NY',
      status: newProj.status || 'Planning',
      progress: newProj.progress || 0,
      startDate: newProj.startDate || '2025-06-01',
      targetEndDate: newProj.targetEndDate || '2026-06-01',
      projectManager: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      budget: {
        total: newProj.budget?.total || 5000000,
        committed: 0,
        actual: 0,
        paid: 0,
        remaining: newProj.budget?.total || 5000000,
        variance: 0,
        costToComplete: newProj.budget?.total || 5000000
      },
      metrics: {
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        openPunchItems: 0,
        totalMilestones: 4,
        completedMilestones: 0
      },
      thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      description: newProj.description || 'New commercial build'
    };

    setProjects(prev => [fullProj, ...prev]);
    setIsCreateProjectOpen(false);
  };

  const handleCreateTask = (newTask: Partial<Task>) => {
    const fullTask: Task = {
      id: `tsk-${Date.now()}`,
      projectId: activeProject ? activeProject.id : 'proj-1',
      projectName: activeProject ? activeProject.name : 'Riverside Office Complex',
      title: newTask.title || 'New Construction Task',
      description: newTask.description || '',
      assignee: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.roleTitle
      },
      startDate: newTask.startDate || '2025-05-20',
      dueDate: newTask.dueDate || '2025-05-25',
      priority: newTask.priority || 'Medium',
      status: newTask.status || 'Not Started',
      milestone: newTask.milestone || 'Structural Phase',
      costCode: newTask.costCode || '03-3000',
      subtasks: newTask.subtasks || [
        { id: 'st-1', title: 'Verify site clearance', completed: false },
        { id: 'st-2', title: 'Quality signoff', completed: false }
      ],
      attachmentsCount: 1,
      notesCount: 0,
      photos: []
    };

    setTasks(prev => [fullTask, ...prev]);
    setIsCreateTaskOpen(false);
  };

  const handleCreatePunch = (newPunch: Partial<PunchItem>) => {
    const fullPunch: PunchItem = {
      id: `pch-${Date.now()}`,
      projectId: activeProject ? activeProject.id : 'proj-1',
      title: newPunch.title || 'Defect Notice',
      description: newPunch.description || 'Quality non-conformance item',
      location: newPunch.location || 'Level 3 - Zone B',
      status: 'Open',
      priority: newPunch.priority || 'Medium',
      assignedTo: {
        id: 'sub-1',
        name: 'Marco Rossi',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        trade: 'Concrete Solutions Inc.'
      },
      dueDate: newPunch.dueDate || '2025-05-25',
      createdDate: '2025-05-20',
      photos: newPunch.photos || ['https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80']
    };

    setPunchItems(prev => [fullPunch, ...prev]);
    setIsCreatePunchOpen(false);
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubs = t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st);
        return { ...t, subtasks: updatedSubs };
      }
      return t;
    }));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => {
        if (!prev) return null;
        return {
          ...prev,
          subtasks: prev.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
        };
      });
    }
  };

  const handleUpdatePunchStatus = (punchId: string, status: PunchStatus) => {
    setPunchItems(prev => prev.map(p => p.id === punchId ? { ...p, status } : p));
  };

  const handleAddDailyLog = (newLog: DailyLogItem) => {
    setDailyLogs(prev => [newLog, ...prev]);
  };

  const handleAddPlanPin = (newPin: PlanGridPin) => {
    setPlanPins(prev => [newPin, ...prev]);
  };

  const handleUpdatePinStatus = (pinId: string, status: 'open' | 'in-progress' | 'resolved') => {
    setPlanPins(prev => prev.map(p => p.id === pinId ? { ...p, status } : p));
  };

  const handleSendMessage = (newMsg: ProjectChatMessage) => {
    setChatMessages(prev => [...prev, newMsg]);
  };

  const handleOpenQuickAction = () => {
    if (currentRole === 'admin') {
      setIsCreateProjectOpen(true);
    } else if (currentRole === 'pm') {
      setIsCreateTaskOpen(true);
    } else if (currentRole === 'finance') {
      setActiveTab('latti');
    } else if (currentRole === 'field') {
      setIsPhotoUploadOpen(true);
    }
  };

  return (
    <DeviceFrame
      currentRole={currentRole}
      currentView={appView}
      onRoleChange={handleRoleChange}
      onOpenAuth={handleOpenAuth}
      onRestartOnboarding={handleStartOnboarding}
      onResetData={handleResetData}
    >
      {/* 1. AUTHENTICATION VIEW (Sign In / Sign Up / Forgot Password) */}
      {appView === 'auth' ? (
        <AuthScreens
          initialMode={authMode}
          onLoginSuccess={handleLoginSuccess}
          onStartOnboarding={handleStartOnboarding}
        />
      ) : appView === 'onboarding' ? (
        /* 2. 5-STEP GUIDED ONBOARDING FLOW */
        <OnboardingFlow
          onComplete={handleCompleteOnboarding}
          onBackToAuth={() => setAppView('auth')}
        />
      ) : (
        /* 3. MAIN WORKSPACE APP */
        <div className="w-full h-full flex flex-col justify-between relative bg-[#070A12] text-slate-100 font-sans">
          {/* Top Sticky Header */}
          <Header
            currentUser={currentUser}
            activeProject={activeProject}
            unreadNotifsCount={unreadNotifsCount}
            onBackToHome={() => { setActiveProject(null); setActiveTab('home'); }}
            onOpenNotifications={() => setIsNotificationOpen(true)}
            onOpenLatti={() => {
              if (activeProject) {
                // Keep inside project
              } else {
                setActiveTab('latti');
              }
            }}
            onOpenSettings={() => setActiveTab('more')}
          />

          {/* Body Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {/* If a project is currently open in depth */}
            {activeProject ? (
              <ProjectWorkspace
                project={activeProject}
                currentRole={currentRole}
                currentUser={currentUser}
                tasks={tasks}
                ganttItems={ganttItems}
                categories={categories}
                punchItems={punchItems}
                subcontractors={subcontractors}
                photos={photos}
                documents={documents}
                reports={reports}
                dailyLogs={dailyLogs}
                planPins={planPins}
                chatMessages={chatMessages}
                onOpenTask={(t) => setSelectedTask(t)}
                onCreateTask={() => setIsCreateTaskOpen(true)}
                onOpenPunch={(p) => setSelectedTask(null)}
                onCreatePunch={() => setIsCreatePunchOpen(true)}
                onUpdatePunchStatus={handleUpdatePunchStatus}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onUploadPhoto={() => setIsPhotoUploadOpen(true)}
                onPreviewPhoto={(p) => setSelectedPhoto(p)}
                onUploadDocument={() => alert("Document upload modal")}
                onPreviewDocument={(d) => setSelectedDocument(d)}
                onExportReport={(r) => alert(`Exporting ${r.title} to PDF...`)}
                onAddDailyLog={handleAddDailyLog}
                onAddPlanPin={handleAddPlanPin}
                onUpdatePinStatus={handleUpdatePinStatus}
                onSendMessage={handleSendMessage}
              />
            ) : (
              /* Top Level Dashboard Tabs */
              <>
                {/* 1. HOME DASHBOARD TAB (Matching Exact User Screenshot) */}
                {activeTab === 'home' && (
                  <SimpleHomeView
                    projects={projects}
                    onSelectProject={(p) => setActiveProject(p)}
                    onOpenLatti={() => setActiveTab('latti')}
                    onOpenTasks={() => setActiveTab('tasks')}
                    onOpenProjects={() => setActiveTab('projects')}
                    onOpenBudgets={() => setActiveTab('budgets')}
                  />
                )}

                {/* 2. OPPORTUNITIES / DEALS TAB (Matching Screenshot 3) */}
                {activeTab === 'opportunities' && (
                  <OpportunitiesView />
                )}

                {/* 3. PROJECTS LIST TAB */}
                {activeTab === 'projects' && (
                  <ProjectsList
                    projects={projects}
                    onSelectProject={(p) => setActiveProject(p)}
                    onCreateProject={() => setIsCreateProjectOpen(true)}
                  />
                )}

                {/* 4. BUDGETS HUB TAB (Matching Screenshot 5, 4, 1, 2, 3) */}
                {activeTab === 'budgets' && (
                  <BudgetsHubView />
                )}

                {/* 5. TASKS TAB */}
                {activeTab === 'tasks' && (
                  <div className="px-5 pt-3 pb-24">
                    <ProjectTasksTab
                      project={projects[0]}
                      tasks={tasks}
                      onOpenTask={(t) => setSelectedTask(t)}
                      onCreateTask={() => setIsCreateTaskOpen(true)}
                      onUpdateStatus={handleUpdateTaskStatus}
                    />
                  </div>
                )}

                {/* 4. SCHEDULE TAB */}
                {activeTab === 'schedule' && (
                  <div className="px-5 pt-3 pb-24">
                    <ProjectScheduleTab
                      project={projects[0]}
                      ganttItems={ganttItems}
                      onCreateTask={() => setIsCreateTaskOpen(true)}
                    />
                  </div>
                )}

                {/* 5. BUDGET TAB */}
                {activeTab === 'budget' && (
                  <div className="px-5 pt-3 pb-24">
                    <ProjectBudgetTab
                      project={projects[0]}
                      categories={categories}
                      onAddCostItem={() => alert("Add Cost Code Item")}
                    />
                  </div>
                )}

                {/* 6. REPORTS TAB */}
                {activeTab === 'reports' && (
                  <div className="px-5 pt-3 pb-24">
                    <ProjectReportsTab
                      project={projects[0]}
                      reports={reports}
                      onExportReport={(r) => alert(`Exporting ${r.title} to PDF...`)}
                    />
                  </div>
                )}

                {/* 7. LATTI AI ASSISTANT TAB */}
                {activeTab === 'latti' && (
                  <div className="px-5 pt-3 pb-24">
                    <LattiAssistant
                      currentRole={currentRole}
                      activeProject={null}
                      tasks={tasks}
                      punchItems={punchItems}
                      onNavigate={(tab) => {
                        if (tab === 'overview' || tab === 'tasks') {
                          setActiveProject(projects[0]);
                        } else {
                          setActiveTab(tab);
                        }
                      }}
                    />
                  </div>
                )}

                {/* 8. SETTINGS & PROFILE TAB */}
                {activeTab === 'more' && (
                  <SettingsView
                    currentUser={currentUser}
                    onSignOut={() => handleOpenAuth('signin')}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                  />
                )}
              </>
            )}
          </div>

          {/* Bottom Navigation Bar */}
          {!activeProject && (
            <BottomNav
              currentRole={currentRole}
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
              onQuickAction={handleOpenQuickAction}
            />
          )}
        </div>
      )}

      {/* Global Modals */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreate={handleCreateProject}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        project={activeProject || projects[0]}
        onClose={() => setIsCreateTaskOpen(false)}
        onCreate={handleCreateTask}
      />

      <CreatePunchModal
        isOpen={isCreatePunchOpen}
        project={activeProject || projects[0]}
        onClose={() => setIsCreatePunchOpen(false)}
        onCreate={handleCreatePunch}
      />

      <PhotoUploadModal
        isOpen={isPhotoUploadOpen}
        project={activeProject || projects[0]}
        onClose={() => setIsPhotoUploadOpen(false)}
        onUpload={(p) => {
          setPhotos(prev => [
            {
              id: `ph-${Date.now()}`,
              projectId: activeProject ? activeProject.id : 'proj-1',
              projectName: activeProject ? activeProject.name : 'Riverside Office Complex',
              url: p.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
              caption: p.caption || 'Site progress photo',
              category: p.category || 'Progress',
              location: p.location || 'Level 12 Deck',
              timestamp: '2025-05-20 09:30 AM',
              uploadedBy: currentUser.name,
              tags: ['Structural', 'Concrete']
            },
            ...prev
          ]);
          setIsPhotoUploadOpen(false);
        }}
      />

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateStatus={handleUpdateTaskStatus}
          onToggleSubtask={handleToggleSubtask}
        />
      )}

      {selectedPhoto && (
        <PhotoPreviewModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      <NotificationDrawer
        isOpen={isNotificationOpen}
        notifications={notifications}
        onClose={() => setIsNotificationOpen(false)}
        onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onSelectNotification={(n) => {
          setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
          setIsNotificationOpen(false);
          if (n.projectId) {
            const p = projects.find(item => item.id === n.projectId);
            if (p) setActiveProject(p);
          }
        }}
      />
    </DeviceFrame>
  );
}

export default App;
