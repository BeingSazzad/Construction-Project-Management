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
import { SideDrawer } from './components/common/SideDrawer';

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
import { CreateProjectView } from './components/project/CreateProjectView';
import { CreateTaskView } from './components/project/CreateTaskView';
import { ProjectTasksTab } from './components/project/ProjectTasksTab';
import { ProjectScheduleTab } from './components/project/ProjectScheduleTab';
import { ProjectBudgetTab } from './components/project/ProjectBudgetTab';
import { ProjectReportsTab } from './components/project/ProjectReportsTab';
import { ProjectTeamTab } from './components/project/ProjectTeamTab';

// Opportunities & Budgets Hub
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { BudgetsHubView } from './components/budgets/BudgetsHubView';
import { MessagesHubView } from './components/messages/MessagesHubView';

// AI
import { LattiAssistant } from './components/ai/LattiAssistant';

// Settings & Legal
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { CreateProjectBudgetModal } from './components/modals/CreateProjectBudgetModal';
import { DealAnalyzerModal } from './components/modals/DealAnalyzerModal';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { CreatePunchModal } from './components/modals/CreatePunchModal';
import { PhotoUploadModal } from './components/modals/PhotoUploadModal';
import { TaskDetailsModal } from './components/modals/TaskDetailsModal';
import { PhotoPreviewModal } from './components/modals/PhotoPreviewModal';
import { DocumentPreviewModal } from './components/modals/DocumentPreviewModal';
import { NotificationsView } from './components/notifications/NotificationsView';
import { FolderKanban, DollarSign, Sparkles, CheckSquare, X } from 'lucide-react';

export function App() {
  // Navigation & View State
  const [appView, setAppView] = useState<'auth' | 'onboarding' | 'workspace'>('workspace');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin'); // Default to Company Owner (Phase 1 Focus)
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
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [isQuickActionSheetOpen, setIsQuickActionSheetOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateBudgetOpen, setIsCreateBudgetOpen] = useState(false);
  const [isDealAnalyzerOpen, setIsDealAnalyzerOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreatePunchOpen, setIsCreatePunchOpen] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  const currentUser = CURRENT_USERS[currentRole] || CURRENT_USERS.admin;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Handlers
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setActiveTab('home');
    setActiveProject(null);
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
    setActiveProject(null);
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
      name: newProj.name || 'New Commercial Build',
      code: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      location: newProj.location || 'Site Location',
      cityState: newProj.cityState || 'Austin, TX',
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
    setActiveProject(fullProj); // Auto-navigate into project workspace
  };

  const handleCreateTask = (newTask: Partial<Task>) => {
    const fullTask: Task = {
      id: `tsk-${Date.now()}`,
      projectId: activeProject ? activeProject.id : projects[0].id,
      projectName: activeProject ? activeProject.name : projects[0].name,
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

  const handleAddTasksFromTemplate = (templateTasks: Partial<Task>[]) => {
    const newTasksList = templateTasks.map((t, idx) => ({
      id: t.id || `tsk-tpl-${Date.now()}-${idx}`,
      projectId: activeProject ? activeProject.id : projects[0].id,
      projectName: activeProject ? activeProject.name : projects[0].name,
      title: t.title || 'Template Task',
      description: t.description || '',
      assignee: t.assignee || {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.roleTitle
      },
      startDate: t.startDate || '2025-05-20',
      dueDate: t.dueDate || '2025-06-15',
      priority: t.priority || 'Medium',
      status: t.status || 'Not Started',
      milestone: t.milestone || 'Pre-Construction',
      costCode: '01-1000',
      subtasks: t.subtasks || [],
      attachmentsCount: 1,
      notesCount: 0,
      photos: []
    }));

    setTasks(prev => [...newTasksList, ...prev]);
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
        trade: 'Concrete Works'
      },
      dueDate: '2025-05-30',
      createdDate: '2025-05-20',
      photos: []
    };

    setPunchItems(prev => [fullPunch, ...prev]);
    setIsCreatePunchOpen(false);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = (t.subtasks || []).map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    }));
  };

  const handleUpdatePunchStatus = (punchId: string, newStatus: PunchStatus) => {
    setPunchItems(prev => prev.map(p => p.id === punchId ? { ...p, status: newStatus } : p));
  };

  const handleAddDailyLog = (newLog: Partial<DailyLogItem>) => {
    const fullLog: DailyLogItem = {
      id: `log-${Date.now()}`,
      projectId: activeProject ? activeProject.id : 'proj-1',
      projectName: activeProject ? activeProject.name : 'Riverside Office Complex',
      date: newLog.date || '2025-05-20',
      weather: {
        condition: 'Sunny',
        temperature: '76°F',
        windSpeed: '8 mph',
        precipitation: '0%',
        siteCondition: 'Dry'
      },
      totalHeadcount: 18,
      crews: [
        { trade: 'Concrete', subcontractor: 'Apex Concrete', workersCount: 12, hoursWorked: 8 },
        { trade: 'MEP', subcontractor: 'Vanguard MEP', workersCount: 6, hoursWorked: 8 }
      ],
      workSummary: newLog.workSummary || 'Daily site progress log',
      materialsReceived: ['Ready-mix concrete trucks'],
      safetyIncidents: 'None reported',
      safetyPassed: true,
      author: currentUser.name
    };
    setDailyLogs(prev => [fullLog, ...prev]);
  };

  const handleAddPin = (pin: Partial<PlanGridPin>) => {
    const fullPin: PlanGridPin = {
      id: `pin-${Date.now()}`,
      projectId: activeProject ? activeProject.id : 'proj-1',
      title: pin.title || 'Inspection Note',
      xPercent: pin.xPercent || 50,
      yPercent: pin.yPercent || 50,
      type: pin.type || 'task',
      status: pin.status || 'open',
      roomOrArea: pin.roomOrArea || 'Level 12 Deck',
      description: pin.description || '',
      createdDate: '2025-05-20'
    };
    setPlanPins(prev => [...prev, fullPin]);
  };

  const handleUpdatePinStatus = (pinId: string, status: 'open' | 'in-progress' | 'resolved') => {
    setPlanPins(prev => prev.map(p => p.id === pinId ? { ...p, status } : p));
  };

  const handleSendMessage = (newMsg: ProjectChatMessage) => {
    setChatMessages(prev => [...prev, newMsg]);
  };

  const handleOpenQuickAction = () => {
    setIsQuickActionSheetOpen(true);
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
      {/* 1. AUTHENTICATION VIEW */}
      {appView === 'auth' ? (
        <AuthScreens
          initialMode={authMode}
          onLoginSuccess={handleLoginSuccess}
          onStartOnboarding={handleStartOnboarding}
        />
      ) : appView === 'onboarding' ? (
        /* 2. ONBOARDING FLOW */
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
            activeTab={activeTab}
            unreadNotifsCount={unreadNotifsCount}
            onBackToHome={() => { setActiveProject(null); setActiveTab('home'); }}
            onOpenNotifications={() => { setActiveProject(null); setActiveTab('notifications'); }}
            onOpenLatti={() => {
              if (!activeProject) {
                setActiveTab('latti');
              }
            }}
            onOpenSettings={() => { setActiveProject(null); setActiveTab('more'); }}
            onOpenDrawer={() => setIsSideDrawerOpen(true)}
            onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          />

          {/* Body Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {/* FULL-SCREEN DEDICATED CREATION & ANALYZER PAGES */}
            {isCreateProjectOpen ? (
              <CreateProjectView
                onBack={() => setIsCreateProjectOpen(false)}
                onCreate={handleCreateProject}
              />
            ) : isCreateTaskOpen ? (
              <CreateTaskView
                project={activeProject || projects[0]}
                onBack={() => setIsCreateTaskOpen(false)}
                onCreate={handleCreateTask}
              />
            ) : isCreateBudgetOpen ? (
              <CreateProjectBudgetModal
                isFullScreenPage={true}
                onClose={() => setIsCreateBudgetOpen(false)}
                projects={projects}
                onCreateBudget={(budgetData) => {
                  alert(`Master budget "${budgetData.budgetName}" created successfully!`);
                  setIsCreateBudgetOpen(false);
                  setActiveTab('budgets');
                }}
              />
            ) : isDealAnalyzerOpen ? (
              <DealAnalyzerModal
                isFullScreenPage={true}
                onClose={() => setIsDealAnalyzerOpen(false)}
              />
            ) : activeProject ? (
              /* If a project is currently open in depth */
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
                onUploadDocument={() => alert('Upload Document...')}
                onPreviewDocument={(d) => setSelectedDocument(d)}
                onExportReport={(r) => alert(`Exporting ${r.title} to PDF...`)}
                onAddDailyLog={handleAddDailyLog}
                onAddPlanPin={handleAddPin}
                onUpdatePinStatus={handleUpdatePinStatus}
                onSendMessage={handleSendMessage}
                onAddTasksFromTemplate={handleAddTasksFromTemplate}
              />
            ) : (
              /* Global Hub Views */
              <>
                {/* 1. EXECUTIVE HOME DASHBOARD */}
                {activeTab === 'home' && (
                  <SimpleHomeView
                    currentUser={currentUser}
                    projects={projects}
                    onSelectProject={(p) => setActiveProject(p)}
                    onOpenLatti={() => setActiveTab('latti')}
                    onOpenTasks={() => {
                      setActiveProject(projects[0]);
                    }}
                    onOpenProjects={() => setActiveTab('projects')}
                    onOpenBudgets={() => setActiveTab('budgets')}
                    onOpenNewProject={() => setIsCreateProjectOpen(true)}
                    onOpenTeam={() => setActiveTab('team')}
                    onOpenReports={() => setActiveTab('reports')}
                  />
                )}

                {/* 2. OPPORTUNITIES / DEALS TAB */}
                {activeTab === 'opportunities' && (
                  <OpportunitiesView />
                )}

                {/* 3. PROJECTS MASTER LIST */}
                {activeTab === 'projects' && (
                  <ProjectsList
                    projects={projects}
                    onSelectProject={(p) => setActiveProject(p)}
                    onCreateProject={() => setIsCreateProjectOpen(true)}
                  />
                )}

                {/* 4. BUDGETS HUB TAB */}
                {activeTab === 'budgets' && (
                  <BudgetsHubView />
                )}

                {/* 5. MESSAGES & DISCUSSIONS HUB */}
                {activeTab === 'messages' && (
                  <MessagesHubView
                    currentUser={currentUser}
                    projects={projects}
                    chatMessages={chatMessages}
                    onSendMessage={handleSendMessage}
                    onSelectProject={(p) => setActiveProject(p)}
                  />
                )}

                {/* 6. TEAM DIRECTORY TAB */}
                {activeTab === 'team' && (
                  <div className="px-5 pt-3 pb-24">
                    <ProjectTeamTab
                      project={projects[0]}
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

                {/* 7. LATTI AI ASSISTANT */}
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

                {/* 8. MORE / SETTINGS VIEW */}
                {activeTab === 'more' && (
                  <SettingsView
                    currentUser={currentUser}
                    onSignOut={() => setAppView('auth')}
                    onNavigateTab={(t) => setActiveTab(t)}
                  />
                )}

                {/* 9. NOTIFICATIONS DRAWER */}
                {activeTab === 'notifications' && (
                  <NotificationsView
                    notifications={notifications}
                    onBack={() => setActiveTab('home')}
                    onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    onSelectNotification={(n) => {
                      if (n.projectId) {
                        const proj = projects.find(p => p.id === n.projectId) || projects[0];
                        setActiveProject(proj);
                      }
                    }}
                  />
                )}
              </>
            )}
          </div>

          {/* Bottom Navigation */}
          <BottomNav
            currentRole={currentRole}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveProject(null);
              setActiveTab(tab);
            }}
            onQuickAction={handleOpenQuickAction}
          />

          {/* SIDE DRAWER NAVIGATION */}
          <SideDrawer
            isOpen={isSideDrawerOpen}
            onClose={() => setIsSideDrawerOpen(false)}
            currentUser={currentUser}
            onNavigateTab={(tab) => {
              setActiveProject(null);
              setActiveTab(tab);
            }}
            onOpenCreateProject={() => setIsCreateProjectOpen(true)}
            onOpenCreateBudget={() => setIsCreateBudgetOpen(true)}
            onOpenDealAnalyzer={() => setIsDealAnalyzerOpen(true)}
            onSignOut={() => setAppView('auth')}
          />
        </div>
      )}

      {/* FLOATING QUICK ACTION BOTTOM SHEET (+) */}
      {isQuickActionSheetOpen && (
        <div 
          onClick={() => setIsQuickActionSheetOpen(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm animate-fade-in font-sans"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[430px] bg-[#070D1A] border-t border-x border-[#142036] rounded-t-[28px] rounded-b-none p-5 pb-9 shadow-2xl flex flex-col gap-3 text-slate-100 animate-slide-up"
          >
            {/* Top Pull Indicator Bar */}
            <div className="w-10 h-1.5 rounded-full bg-slate-600/60 mx-auto -mt-1 mb-1" />

            <div className="flex items-center justify-between pb-2 border-b border-[#142036]">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">Create New Action</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Select an enterprise construction action</p>
              </div>
              <button
                onClick={() => setIsQuickActionSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-[#0E1A33] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => {
                  setIsQuickActionSheetOpen(false);
                  setIsCreateProjectOpen(true);
                }}
                className="p-3.5 bg-[#050811] hover:bg-[#0E1A33] border border-[#142036] hover:border-blue-500/40 rounded-2xl flex items-center gap-3.5 transition-all cursor-pointer text-left active:scale-[0.99]"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">New Construction Project</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Initialize commercial or custom home site</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickActionSheetOpen(false);
                  setIsCreateBudgetOpen(true);
                }}
                className="p-3.5 bg-[#050811] hover:bg-[#0E1A33] border border-[#142036] hover:border-blue-500/40 rounded-2xl flex items-center gap-3.5 transition-all cursor-pointer text-left active:scale-[0.99]"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">4-Step Project Budget</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Master CSI ledger with vendor cost allocations</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickActionSheetOpen(false);
                  setIsDealAnalyzerOpen(true);
                }}
                className="p-3.5 bg-[#050811] hover:bg-[#0E1A33] border border-[#142036] hover:border-blue-500/40 rounded-2xl flex items-center gap-3.5 transition-all cursor-pointer text-left active:scale-[0.99]"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">Latti Deal Analyzer™</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Evaluate acquisition ARV, debt & Deal Score</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickActionSheetOpen(false);
                  setIsCreateTaskOpen(true);
                }}
                className="p-3.5 bg-[#050811] hover:bg-[#0E1A33] border border-[#142036] hover:border-blue-500/40 rounded-2xl flex items-center gap-3.5 transition-all cursor-pointer text-left active:scale-[0.99]"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">New Construction Task</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Assign milestones, due dates and subtasks</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}



      {/* CREATE PUNCH ITEM MODAL */}
      <CreatePunchModal
        isOpen={isCreatePunchOpen}
        onClose={() => setIsCreatePunchOpen(false)}
        onCreate={handleCreatePunch}
      />

      {/* PHOTO UPLOAD MODAL */}
      <PhotoUploadModal
        isOpen={isPhotoUploadOpen}
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

    </DeviceFrame>
  );
}

export default App;
