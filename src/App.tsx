import React, { useState } from 'react';
import { 
  UserRole, Project, Task, GanttItem, TradeCategory, 
  PunchItem, Subcontractor, SitePhoto, DocumentItem, ReportItem, 
  NotificationItem, TaskStatus, PunchStatus, PlanGridPin, ProjectChatMessage,
  FinancingDraw, LienWaiver, ProjectStatus, ChangeOrder, CalendarEventItem
} from './types';
import { 
  CURRENT_USERS, MOCK_PROJECTS, MOCK_TASKS, MOCK_GANTT, 
  MOCK_BUDGET_CATEGORIES, MOCK_PUNCH_ITEMS, MOCK_SUBCONTRACTORS, 
  MOCK_PHOTOS, MOCK_DOCUMENTS, MOCK_REPORTS, MOCK_NOTIFICATIONS,
  MOCK_PLAN_PINS, MOCK_PROJECT_CHATS,
  MOCK_FINANCING_DRAWS, MOCK_LIEN_WAIVERS, MOCK_CHANGE_ORDERS,
  MOCK_CALENDAR_EVENTS
} from './data/mockData';

// Common Components
import { DeviceFrame } from './components/common/DeviceFrame';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { SideDrawer } from './components/common/SideDrawer';

// Auth & Onboarding
import { AuthScreens } from './components/auth/AuthScreens';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';

// Core Home Screen (Figma Screen 1)
import { HomeScreen } from './components/dashboards/HomeScreen';
import { MoreHubView } from './components/settings/MoreHubView';
import { CentralAddActionSheet } from './components/modals/CentralAddActionSheet';

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
import { TeamHubView } from './components/team/TeamHubView';
import { BuildScopeView } from './components/buildscope/BuildScopeView';
import { CalendarView } from './components/calendar/CalendarView';
import { ProjectPunchListTab } from './components/project/ProjectPunchListTab';
import { ProjectPhotosTab } from './components/project/ProjectPhotosTab';
import { ProjectDailyLogsTab } from './components/project/ProjectDailyLogsTab';
import { DailyLogsHubView } from './components/dailylogs/DailyLogsHubView';
import { DailyLogItem } from './types';

// Opportunities & Budgets Hub
import { OpportunitiesView } from './components/opportunities/OpportunitiesView';
import { CreateDealView } from './components/opportunities/CreateDealView';
import { BudgetsHubView } from './components/budgets/BudgetsHubView';
import { MessagesHubView } from './components/messages/MessagesHubView';
import { MilestonesHubView } from './components/milestones/MilestonesHubView';

// AI
import { LattiAssistant } from './components/ai/LattiAssistant';
import { AIIntelligenceCenterView } from './components/ai/AIIntelligenceCenterView';

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
import { CreateDrawModal } from './components/modals/CreateDrawModal';
import { ProcessLienWaiverModal } from './components/modals/ProcessLienWaiverModal';
import { ApprovePayAppModal } from './components/modals/ApprovePayAppModal';
import { TaskCreationTypeModal } from './components/modals/TaskCreationTypeModal';
import { ImportBudgetModal } from './components/modals/ImportBudgetModal';
import { EditProjectModal } from './components/modals/EditProjectModal';
import { CreateChangeOrderModal } from './components/modals/CreateChangeOrderModal';
import { NotificationsView } from './components/notifications/NotificationsView';
import { FolderKanban, DollarSign, Sparkles, CheckSquare, X, TrendingUp, Layers, Landmark, FileCheck, FileSpreadsheet, ChevronRight } from 'lucide-react';

export function App() {
  // Navigation & View State
  const [appView, setAppView] = useState<'auth' | 'onboarding' | 'workspace'>('workspace');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin'); // Default to Company Owner (Phase 1 Focus)
  const [activeTab, setActiveTab] = useState<string>('home');
  const [previousTab, setPreviousTab] = useState<string>('home');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projectSubTab, setProjectSubTab] = useState<string>('overview');
  const [activeBudgetName, setActiveBudgetName] = useState<string | null>(null);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [lattiInitialQuery, setLattiInitialQuery] = useState<string>('');

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
  const [planPins, setPlanPins] = useState<PlanGridPin[]>(MOCK_PLAN_PINS);
  const [chatMessages, setChatMessages] = useState<ProjectChatMessage[]>(MOCK_PROJECT_CHATS);
  const [draws, setDraws] = useState<FinancingDraw[]>(MOCK_FINANCING_DRAWS);
  const [lienWaivers, setLienWaivers] = useState<LienWaiver[]>(MOCK_LIEN_WAIVERS);
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>(MOCK_CHANGE_ORDERS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(MOCK_CALENDAR_EVENTS);
  const [dailyLogs, setDailyLogs] = useState<DailyLogItem[]>(() => 
    MOCK_PROJECTS.flatMap(p => p.dailyLogs || [])
  );

  // Modals state
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [isQuickActionSheetOpen, setIsQuickActionSheetOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);
  const [isCreateBudgetOpen, setIsCreateBudgetOpen] = useState(false);
  const [isImportBudgetOpen, setIsImportBudgetOpen] = useState(false);
  const [isDealAnalyzerOpen, setIsDealAnalyzerOpen] = useState(false);
  const [isTaskTypeSelectOpen, setIsTaskTypeSelectOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreatePunchOpen, setIsCreatePunchOpen] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [isCreateDrawOpen, setIsCreateDrawOpen] = useState(false);
  const [isRecordLienWaiverOpen, setIsRecordLienWaiverOpen] = useState(false);
  const [isApprovePayAppOpen, setIsApprovePayAppOpen] = useState(false);
  const [isCreateChangeOrderOpen, setIsCreateChangeOrderOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  const currentUser = CURRENT_USERS[currentRole] || CURRENT_USERS.admin;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const handleImportBudgetSuccess = (projectId: string, budgetName: string, totalValue: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          budget: {
            ...p.budget,
            total: totalValue,
            remaining: totalValue - p.budget.actual
          }
        };
      }
      return p;
    }));
    
    // Also update activeProject state if currently active
    if (activeProject && activeProject.id === projectId) {
      setActiveProject(prev => prev ? {
        ...prev,
        budget: {
          ...prev.budget,
          total: totalValue,
          remaining: totalValue - prev.budget.actual
        }
      } : null);
    }
    
    alert(`Successfully imported "${budgetName}" ($${(totalValue / 1000000).toFixed(2)}M) into Project Financial Ledger!`);
  };

  const handleCreateChangeOrder = (newCO: Partial<ChangeOrder>) => {
    const fullCO: ChangeOrder = {
      id: `co-${Date.now()}`,
      projectId: newCO.projectId || (activeProject ? activeProject.id : 'proj-1'),
      title: newCO.title || 'New Change Order',
      description: newCO.description || '',
      amount: newCO.amount || 0,
      timeImpact: newCO.timeImpact || 0,
      category: newCO.category || 'General',
      requestedBy: newCO.requestedBy || 'Client',
      status: 'Pending',
      createdDate: newCO.createdDate || new Date().toISOString().split('T')[0]
    };

    setChangeOrders(prev => [fullCO, ...prev]);
    setIsCreateChangeOrderOpen(false);
  };

  // Financial Handlers
  const handleCreateDraw = (newDraw: Partial<FinancingDraw>) => {
    const fullDraw: FinancingDraw = {
      id: `draw-${Date.now()}`,
      projectId: newDraw.projectId || projects[0].id,
      drawNumber: draws.length + 1,
      milestoneTitle: newDraw.milestoneTitle || 'Structural Progress Draw',
      requestedAmount: newDraw.requestedAmount || 350000,
      approvedAmount: newDraw.approvedAmount || 350000,
      fundedAmount: 0,
      status: 'In Lender Review',
      requestDate: newDraw.requestDate || new Date().toISOString().split('T')[0],
      lenderName: newDraw.lenderName || 'Texas Capital Commercial',
      inspectorName: newDraw.inspectorName,
      inspectionPassed: newDraw.inspectionPassed
    };
    setDraws(prev => [fullDraw, ...prev]);
  };

  const handleRecordLienWaiver = (newWaiver: Partial<LienWaiver>) => {
    const fullWaiver: LienWaiver = {
      id: `lw-${Date.now()}`,
      projectId: newWaiver.projectId || projects[0].id,
      subcontractorName: newWaiver.subcontractorName || 'Apex Concrete Masters',
      trade: newWaiver.trade || 'Division 03 Concrete',
      amount: newWaiver.amount || 150000,
      type: newWaiver.type || 'Progress Unconditional',
      status: newWaiver.status || 'Signed & Active',
      invoiceRef: newWaiver.invoiceRef || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      dateSubmitted: newWaiver.dateSubmitted || new Date().toISOString().split('T')[0]
    };
    setLienWaivers(prev => [fullWaiver, ...prev]);
  };

  const handleDisbursePayApp = (subName: string, netAmount: number) => {
    // Update first project paid amount
    setProjects(prev => prev.map((p, idx) => {
      if (idx === 0) {
        return {
          ...p,
          budget: {
            ...p.budget,
            paid: p.budget.paid + netAmount,
            actual: p.budget.actual + netAmount
          }
        };
      }
      return p;
    }));
    alert(`Successfully disbursed $${netAmount.toLocaleString()} to ${subName}!`);
  };

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

  const handleUpdateProjectStatus = (projectId: string, newStatus: ProjectStatus) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    if (activeProject && activeProject.id === projectId) {
      setActiveProject(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleUpdateProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (activeProject && activeProject.id === updated.id) {
      setActiveProject(updated);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setActiveProject(null);
    setActiveTab('projects');
  };

  const handleAddDailyLog = (newLog: DailyLogItem) => {
    // 1. Update central dailyLogs feed
    setDailyLogs(prev => [newLog, ...prev]);

    // 2. Also update corresponding project's dailyLogs array
    setProjects(prev => prev.map(p => {
      if (p.id === newLog.projectId) {
        return {
          ...p,
          dailyLogs: [newLog, ...(p.dailyLogs || [])]
        };
      }
      return p;
    }));

    // 3. If activeProject is currently selected, update it
    if (activeProject && activeProject.id === newLog.projectId) {
      setActiveProject(prev => prev ? ({
        ...prev,
        dailyLogs: [newLog, ...(prev.dailyLogs || [])]
      }) : null);
    }
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
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
      
      const task = prevTasks.find(t => t.id === taskId);
      if (task) {
        const projTasks = updatedTasks.filter(t => t.projectId === task.projectId);
        const completedCount = projTasks.filter(t => t.status === 'Completed').length;
        const nextProgress = projTasks.length > 0 ? Math.round((completedCount / projTasks.length) * 100) : 0;
        
        setProjects(prevProjects => prevProjects.map(p => {
          if (p.id === task.projectId) {
            const updatedProject = {
              ...p,
              progress: nextProgress,
              metrics: {
                ...p.metrics,
                completedTasks: completedCount
              }
            };
            if (activeProject && activeProject.id === p.id) {
              setActiveProject(updatedProject);
            }
            return updatedProject;
          }
          return p;
        }));
      }
      return updatedTasks;
    });
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

  const handleAddReport = (newReport: Partial<ReportItem>) => {
    const fullReport: ReportItem = {
      id: `rep-${Date.now()}`,
      title: newReport.title || 'New Report Document',
      type: newReport.type || 'Progress',
      period: newReport.period || 'Current Period',
      author: newReport.author || currentUser.name,
      date: newReport.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      summary: newReport.summary || '',
      fileSize: newReport.fileSize || '1.5 MB'
    };
    setReports(prev => [fullReport, ...prev]);
  };

  const handleSelectProject = (p: Project) => {
    setPreviousTab(activeTab);
    setActiveProject(p);
    setProjectSubTab('overview');
  };

  const handleHeaderBack = () => {
    if (isCreateProjectOpen) {
      setIsCreateProjectOpen(false);
    } else if (isCreateDealOpen) {
      setIsCreateDealOpen(false);
    } else if (isCreateTaskOpen) {
      setIsCreateTaskOpen(false);
    } else if (isCreateBudgetOpen) {
      setIsCreateBudgetOpen(false);
    } else if (isDealAnalyzerOpen) {
      setIsDealAnalyzerOpen(false);
    } else if (activeBudgetName) {
      setActiveBudgetName(null);
    } else if (activeProject) {
      if (projectSubTab !== 'overview') {
        setProjectSubTab('overview');
      } else {
        setActiveProject(null);
        setActiveTab(previousTab || 'home');
      }
    } else if (activeTab !== 'home') {
      setActiveTab('home');
    }
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
        <div className="w-full h-full flex flex-col justify-between relative bg-[#F7F9FC] text-[#0F172A] font-sans">
          {/* Top Sticky Header */}
          {activeTab !== 'notifications' && activeTab !== 'budgets' && (
            <Header
              currentUser={currentUser}
              activeProject={activeProject}
              activeTab={activeTab}
              customTitle={activeBudgetName || undefined}
              unreadNotifsCount={unreadNotifsCount}
              unreadMessagesCount={2}
              onBack={handleHeaderBack}
              onBackToHome={handleHeaderBack}
              onOpenNotifications={() => { setActiveBudgetName(null); setActiveProject(null); setActiveTab('notifications'); }}
              onOpenMessages={() => { setActiveBudgetName(null); setActiveProject(null); setActiveTab('messages'); }}
              onOpenLatti={() => {
                setActiveBudgetName(null);
                setActiveProject(null);
                setActiveTab('latti');
              }}
              onOpenSettings={() => { setActiveBudgetName(null); setActiveProject(null); setActiveTab('more'); }}
              onOpenDrawer={() => setIsSideDrawerOpen(true)}
              onNavigateTab={(tab) => {
                setActiveBudgetName(null);
                if (tab === 'home' || tab === 'projects' || tab === 'calendar' || tab === 'daily-logs' || tab === 'budgets' || tab === 'team' || tab === 'latti' || tab === 'more') {
                  setActiveProject(null);
                  setActiveTab(tab);
                } else {
                  setActiveProject(projects[0]);
                  setActiveTab(tab);
                  setProjectSubTab(tab);
                }
              }}
              onQuickAction={() => setIsQuickActionSheetOpen(true)}
              onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              onOpenEditProject={() => setIsEditProjectOpen(true)}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {/* Body Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F7F9FC]">
            {/* FULL-SCREEN DEDICATED CREATION & ANALYZER PAGES */}
            {isCreateProjectOpen ? (
              <CreateProjectView
                onBack={() => setIsCreateProjectOpen(false)}
                onCreate={handleCreateProject}
              />
            ) : isCreateDealOpen ? (
              <CreateDealView
                onBack={() => setIsCreateDealOpen(false)}
                onCreate={(dealData) => {
                  setIsCreateDealOpen(false);
                  setActiveTab('opportunities');
                }}
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
                activeSubTab={projectSubTab}
                onSubTabChange={setProjectSubTab}
                tasks={tasks}
                ganttItems={ganttItems}
                categories={categories}
                punchItems={punchItems}
                subcontractors={subcontractors}
                photos={photos}
                documents={documents}
                reports={reports}
                planPins={planPins}
                chatMessages={chatMessages}
                onOpenTask={(t) => setSelectedTask(t)}
                onCreateTask={() => setIsCreateTaskModalOpen(true)}
                onOpenPunch={(p) => setSelectedTask(null)}
                onCreatePunch={() => setIsCreatePunchOpen(true)}
                onUpdatePunchStatus={handleUpdatePunchStatus}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onUploadPhoto={() => setIsPhotoUploadOpen(true)}
                onPreviewPhoto={(p) => setSelectedPhoto(p)}
                onUploadDocument={() => alert('Upload Document...')}
                onPreviewDocument={(d) => setSelectedDocument(d)}
                onExportReport={(r) => alert(`Exporting ${r.title} to PDF...`)}
                onAddPlanPin={handleAddPin}
                onUpdatePinStatus={handleUpdatePinStatus}
                onSendMessage={handleSendMessage}
                onAddTasksFromTemplate={handleAddTasksFromTemplate}
                onUpdateProjectStatus={handleUpdateProjectStatus}
                onImportBudget={() => setIsImportBudgetOpen(true)}
                changeOrders={changeOrders}
                onCreateChangeOrder={() => setIsCreateChangeOrderOpen(true)}
                onAddReport={handleAddReport}
                onAddDailyLog={handleAddDailyLog}
              />
            ) : (
              /* Global Hub Views */
              <>
                {/* 1. CORE HOME DASHBOARD (Figma Screen 1) */}
                {activeTab === 'home' && (
                  <HomeScreen
                    projects={projects}
                    tasks={tasks}
                    onSelectProject={handleSelectProject}
                    onOpenProjects={() => setActiveTab('projects')}
                    onOpenLatti={(query) => {
                      setLattiInitialQuery(query || '');
                      setActiveTab('latti');
                    }}
                    onOpenTask={(t) => setSelectedTask(t)}
                    onOpenTasks={() => {
                      handleSelectProject(projects[0]);
                      setProjectSubTab('tasks');
                    }}
                    onOpenCalendar={() => {
                      handleSelectProject(projects[0]);
                      setProjectSubTab('schedule');
                    }}
                    onOpenBudget={(proj) => {
                      handleSelectProject(proj);
                      setProjectSubTab('budget');
                    }}
                  />
                )}

                {/* 2. PROJECTS MASTER LIST (Figma Screen 2) */}
                {activeTab === 'projects' && (
                  <ProjectsList
                    projects={projects}
                    onSelectProject={handleSelectProject}
                    onCreateProject={() => setIsCreateProjectOpen(true)}
                  />
                )}

                {/* 3. LATTI AI ASSISTANT (Figma Screen 5) */}
                {activeTab === 'latti' && (
                  <LattiAssistant
                    currentRole={currentRole}
                    activeProject={activeProject}
                    tasks={tasks}
                    punchItems={punchItems}
                    initialQuery={lattiInitialQuery}
                    onNavigate={(tab) => {
                      if (tab === 'projects' || tab === 'overview') {
                        handleSelectProject(projects[0]);
                        setProjectSubTab('overview');
                      } else if (tab === 'budget') {
                        handleSelectProject(projects[0]);
                        setProjectSubTab('budget');
                      } else if (tab === 'schedule') {
                        handleSelectProject(projects[0]);
                        setProjectSubTab('schedule');
                      } else if (tab === 'tasks') {
                        handleSelectProject(projects[0]);
                        setProjectSubTab('tasks');
                      } else {
                        setActiveTab(tab);
                      }
                    }}
                  />
                )}

                {/* 4. SETTINGS & PROFILE HUB */}
                {activeTab === 'more' && (
                  <SettingsView
                    currentUser={currentUser}
                    onSignOut={() => setAppView('auth')}
                    onNavigateTab={(t) => {
                      if (t === 'team') {
                        setActiveTab('team');
                      } else if (t === 'notifications') {
                        setActiveTab('notifications');
                      } else {
                        setActiveTab(t);
                      }
                    }}
                  />
                )}

                {/* 5. TEAM DIRECTORY FALLBACK */}
                {activeTab === 'team' && (
                  <TeamHubView />
                )}

                {/* 9. NOTIFICATIONS DRAWER */}
                {activeTab === 'notifications' && (
                  <NotificationsView
                    notifications={notifications}
                    onBack={() => setActiveTab('home')}
                    onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    onSelectNotification={(n) => {
                      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                      if (n.projectId) {
                        const proj = projects.find(p => p.id === n.projectId) || projects[0];
                        setActiveProject(proj);
                      }
                    }}
                  />
                )}

                {/* 10. GLOBAL SUBTAB HUB FALLBACKS (NEVER BLANK) */}
                {activeTab === 'tasks' && (
                  <ProjectTasksTab
                    project={projects[0]}
                    tasks={tasks}
                    onOpenTask={(t) => setSelectedTask(t)}
                    onCreateTask={() => setIsCreateTaskModalOpen(true)}
                    onUpdateStatus={handleUpdateTaskStatus}
                  />
                )}

                {(activeTab === 'calendar' || activeTab === 'schedule') && (
                  <CalendarView
                    projects={projects}
                    events={calendarEvents}
                    onSelectProject={handleSelectProject}
                    onAddEvent={(evt) => setCalendarEvents(prev => [evt, ...prev])}
                  />
                )}

                {activeTab === 'budgets' && (
                  <ProjectBudgetTab
                    project={activeProject || projects[0]}
                    categories={categories}
                    onImportBudget={() => setIsImportBudgetOpen(true)}
                    onBack={() => setActiveTab('home')}
                  />
                )}

                {activeTab === 'messages' && (
                  <MessagesHubView
                    currentUser={currentUser}
                    projects={projects}
                    chatMessages={chatMessages}
                    onSendMessage={handleSendMessage}
                    onSelectProject={handleSelectProject}
                  />
                )}

                {activeTab === 'milestones' && (
                  <MilestonesHubView
                    projects={projects}
                    tasks={tasks}
                    onSelectProject={handleSelectProject}
                    onCreateTask={() => setIsCreateTaskModalOpen(true)}
                  />
                )}

                {activeTab === 'punch' && (
                  <ProjectPunchListTab
                    project={projects[0]}
                    punchItems={punchItems}
                    onCreatePunch={() => setIsCreatePunchOpen(true)}
                    onOpenPunchDetails={(p) => setSelectedTask(null)}
                    onUpdatePunchStatus={handleUpdatePunchStatus}
                  />
                )}

                {activeTab === 'photos' && (
                  <ProjectPhotosTab
                    project={projects[0]}
                    photos={photos}
                    onUploadPhoto={() => setIsPhotoUploadOpen(true)}
                    onPreviewPhoto={(p) => setSelectedPhoto(p)}
                  />
                )}

                {activeTab === 'daily-logs' && (
                  <DailyLogsHubView
                    projects={projects}
                    dailyLogs={dailyLogs}
                    onAddDailyLog={handleAddDailyLog}
                    onNavigateToProject={(projId, subTab) => {
                      const found = projects.find(p => p.id === projId);
                      if (found) {
                        setActiveProject(found);
                        setProjectSubTab(subTab || 'overview');
                      }
                    }}
                  />
                )}
              </>
            )}
          </div>

          {/* Bottom Navigation (5 Core Launch Tabs) */}
          <BottomNav
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveProject(null);
              setActiveTab(tab);
            }}
            onQuickAction={() => setIsQuickActionSheetOpen(true)}
          />

          {/* SIDE DRAWER NAVIGATION (Triggered from Top-Left Header ☰) */}
          <SideDrawer
            isOpen={isSideDrawerOpen}
            onClose={() => setIsSideDrawerOpen(false)}
            currentUser={currentUser}
            projects={projects}
            activeProject={activeProject}
            onSelectProject={(proj) => {
              handleSelectProject(proj);
              setIsSideDrawerOpen(false);
            }}
            unreadNotifsCount={unreadNotifsCount}
            onNavigateTab={(tab) => {
              setActiveProject(null);
              setActiveTab(tab);
            }}
            onOpenCreateProject={() => {
              setIsSideDrawerOpen(false);
              setIsCreateProjectOpen(true);
            }}
            onSignOut={() => setAppView('auth')}
          />
        </div>
      )}

      {/* CENTRAL ADD (+) ACTION SHEET */}
      <CentralAddActionSheet
        isOpen={isQuickActionSheetOpen}
        onClose={() => setIsQuickActionSheetOpen(false)}
        onAddTask={() => {
          setIsCreateTaskModalOpen(true);
        }}
        onAddUpdate={() => {
          if (!activeProject) setActiveProject(projects[0]);
          setProjectSubTab('updates');
        }}
        onAddExpense={() => {
          setIsCreateChangeOrderOpen(true);
        }}
        onAddPhoto={() => {
          setIsPhotoUploadOpen(true);
        }}
        onAddDocument={() => {
          if (!activeProject) setActiveProject(projects[0]);
          setProjectSubTab('documents');
        }}
      />

      {/* DIRECT CUSTOM TASK MODAL */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        project={activeProject}
        onCreate={handleCreateTask}
      />

      {/* TASK CREATION TYPE SELECTION MODAL */}
      <TaskCreationTypeModal
        isOpen={isTaskTypeSelectOpen}
        onClose={() => setIsTaskTypeSelectOpen(false)}
        project={activeProject}
        onSelectTemplate={(tpl) => {
          handleCreateTask(tpl);
        }}
        onSelectCustom={() => {
          setIsCreateTaskModalOpen(true);
        }}
      />

      {/* IMPORT BUDGET MODAL */}
      <ImportBudgetModal
        isOpen={isImportBudgetOpen}
        onClose={() => setIsImportBudgetOpen(false)}
        projects={projects}
        onImportSuccess={handleImportBudgetSuccess}
      />

      {/* CREATE CHANGE ORDER MODAL */}
      <CreateChangeOrderModal
        isOpen={isCreateChangeOrderOpen}
        onClose={() => setIsCreateChangeOrderOpen(false)}
        projectId={activeProject ? activeProject.id : 'proj-1'}
        onCreate={handleCreateChangeOrder}
      />

      {/* FINANCIAL WORKFLOW MODALS */}
      <CreateDrawModal
        isOpen={isCreateDrawOpen}
        onClose={() => setIsCreateDrawOpen(false)}
        projects={projects}
        onCreateDraw={handleCreateDraw}
      />

      <ProcessLienWaiverModal
        isOpen={isRecordLienWaiverOpen}
        onClose={() => setIsRecordLienWaiverOpen(false)}
        subcontractors={subcontractors}
        onRecordWaiver={handleRecordLienWaiver}
      />

      <ApprovePayAppModal
        isOpen={isApprovePayAppOpen}
        onClose={() => setIsApprovePayAppOpen(false)}
        projects={projects}
        subcontractors={subcontractors}
        onDisburse={handleDisbursePayApp}
      />

      {/* CREATE PUNCH ITEM MODAL */}
      <CreatePunchModal
        isOpen={isCreatePunchOpen}
        projects={projects}
        project={activeProject}
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

      {activeProject && (
        <EditProjectModal
          project={activeProject}
          isOpen={isEditProjectOpen}
          onClose={() => setIsEditProjectOpen(false)}
          onUpdate={handleUpdateProject}
          onDelete={handleDeleteProject}
        />
      )}

    </DeviceFrame>
  );
}

export default App;
