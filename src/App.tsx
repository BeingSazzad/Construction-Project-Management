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
import { generateUniqueId } from './utils/id';

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
import { TeamHubView } from './components/team/TeamHubView';
import { CalendarView } from './components/calendar/CalendarView';
import { ProjectPunchListTab } from './components/project/ProjectPunchListTab';
import { ProjectPhotosTab } from './components/project/ProjectPhotosTab';
import { ProjectDailyLogsTab } from './components/project/ProjectDailyLogsTab';
import { DailyLogsHubView } from './components/dailylogs/DailyLogsHubView';
import { DailyLogItem } from './types';

// Budgets Hub
import { BudgetsHubView } from './components/budgets/BudgetsHubView';
import { MessagesHubView } from './components/messages/MessagesHubView';
import { MilestonesHubView } from './components/milestones/MilestonesHubView';

// AI
import { LattiAssistant } from './components/ai/LattiAssistant';

// Settings & Legal
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { CreateProjectBudgetModal } from './components/modals/CreateProjectBudgetModal';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { CreatePunchModal } from './components/modals/CreatePunchModal';
import { CreateDailyLogModal } from './components/modals/CreateDailyLogModal';
import { PhotoUploadModal } from './components/modals/PhotoUploadModal';
import { TaskDetailsModal } from './components/modals/TaskDetailsModal';
import { PhotoPreviewModal } from './components/modals/PhotoPreviewModal';
import { DocumentPreviewModal } from './components/modals/DocumentPreviewModal';
import { UploadDocumentModal } from './components/modals/UploadDocumentModal';
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
  const [appView, setAppView] = useState<'auth' | 'onboarding' | 'workspace'>(() => {
    // Show onboarding once — persisted via localStorage
    return localStorage.getItem('lattice_onboarded') ? 'workspace' : 'onboarding';
  });
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
  const [initialCalendarDate, setInitialCalendarDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Modals state
  const [settingsSubView, setSettingsSubView] = useState<string>('main');
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [isQuickActionSheetOpen, setIsQuickActionSheetOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateBudgetOpen, setIsCreateBudgetOpen] = useState(false);
  const [isImportBudgetOpen, setIsImportBudgetOpen] = useState(false);
  const [isTaskTypeSelectOpen, setIsTaskTypeSelectOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreatePunchOpen, setIsCreatePunchOpen] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [isUploadDocumentOpen, setIsUploadDocumentOpen] = useState(false);
  const [isCreateDailyLogOpen, setIsCreateDailyLogOpen] = useState(false);
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
    const targetProjectId = newCO.projectId || (activeProject ? activeProject.id : projects[0].id);
    const fullCO: ChangeOrder = {
      id: generateUniqueId('co'),
      projectId: targetProjectId,
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

    // Relational sync: Increment pendingCOs metric on target project
    setProjects(prevProjects => prevProjects.map(p => {
      if (p.id === targetProjectId) {
        const updatedProj = {
          ...p,
          metrics: {
            ...p.metrics,
            pendingCOs: (p.metrics.pendingCOs || 0) + 1
          }
        };
        if (activeProject && activeProject.id === p.id) {
          setActiveProject(updatedProj);
        }
        return updatedProj;
      }
      return p;
    }));

    setNotifications(prev => [
      {
        id: generateUniqueId('notif'),
        title: 'Change Order Drafted',
        message: `Change Order "${fullCO.title}" ($${fullCO.amount.toLocaleString()}) created.`,
        timeAgo: 'Just now',
        read: false,
        type: 'budget'
      },
      ...prev
    ]);

    setIsCreateChangeOrderOpen(false);
  };

  const handleApproveChangeOrder = (coId: string) => {
    const targetCO = changeOrders.find(co => co.id === coId);
    if (!targetCO) return;

    // 1. Mark CO as Approved in global state
    setChangeOrders(prev => prev.map(co => co.id === coId ? { ...co, status: 'Approved' } : co));

    // 2. Adjust project budget and metrics (AIA standard: ACO increases contract total & committed)
    setProjects(prevProjects => prevProjects.map(p => {
      if (p.id === targetCO.projectId) {
        const newTotal = p.budget.total + targetCO.amount;
        const newCommitted = p.budget.committed + targetCO.amount;
        const updatedProj = {
          ...p,
          budget: {
            ...p.budget,
            total: newTotal,
            committed: newCommitted,
            remaining: Math.max(0, newTotal - p.budget.actual)
          },
          metrics: {
            ...p.metrics,
            pendingCOs: Math.max(0, (p.metrics.pendingCOs || 1) - 1)
          }
        };
        if (activeProject && activeProject.id === p.id) {
          setActiveProject(updatedProj);
        }
        return updatedProj;
      }
      return p;
    }));

    setNotifications(prev => [
      {
        id: generateUniqueId('notif'),
        title: 'Change Order Approved',
        message: `ACO "${targetCO.title}" ($${targetCO.amount.toLocaleString()}) approved. Contract sum adjusted.`,
        timeAgo: 'Just now',
        read: false,
        type: 'budget'
      },
      ...prev
    ]);
  };

  // Financial Handlers
  const handleCreateDraw = (newDraw: Partial<FinancingDraw>) => {
    const targetProjectId = newDraw.projectId || (activeProject ? activeProject.id : projects[0].id);
    const projDraws = draws.filter(d => d.projectId === targetProjectId);
    const fullDraw: FinancingDraw = {
      id: generateUniqueId('draw'),
      projectId: targetProjectId,
      drawNumber: projDraws.length + 1,
      milestoneTitle: newDraw.milestoneTitle || 'Structural Progress Draw',
      requestedAmount: newDraw.requestedAmount || 350000,
      approvedAmount: newDraw.approvedAmount || 350000,
      fundedAmount: 0,
      status: 'In Lender Review',
      requestDate: newDraw.requestDate || new Date().toISOString().split('T')[0],
      lenderName: newDraw.lenderName || 'Texas Capital Commercial',
      inspectorName: newDraw.inspectorName || 'David Miller, PE',
      inspectionPassed: newDraw.inspectionPassed ?? true
    };
    setDraws(prev => [fullDraw, ...prev]);

    setNotifications(prev => [
      {
        id: generateUniqueId('notif'),
        title: 'Bank Draw Submitted',
        message: `Draw #${fullDraw.drawNumber} ($${fullDraw.requestedAmount.toLocaleString()}) submitted to ${fullDraw.lenderName}.`,
        timeAgo: 'Just now',
        read: false,
        type: 'budget'
      },
      ...prev
    ]);

    setIsCreateDrawOpen(false);
  };

  const handleRecordLienWaiver = (newWaiver: Partial<LienWaiver>) => {
    const targetProjectId = newWaiver.projectId || (activeProject ? activeProject.id : projects[0].id);
    const fullWaiver: LienWaiver = {
      id: generateUniqueId('lw'),
      projectId: targetProjectId,
      subcontractorName: newWaiver.subcontractorName || 'Apex Concrete Masters',
      trade: newWaiver.trade || 'Division 03 Concrete',
      amount: newWaiver.amount || 150000,
      type: newWaiver.type || 'Progress Unconditional',
      status: newWaiver.status || 'Signed & Active',
      invoiceRef: newWaiver.invoiceRef || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      dateSubmitted: newWaiver.dateSubmitted || new Date().toISOString().split('T')[0]
    };
    setLienWaivers(prev => [fullWaiver, ...prev]);

    setNotifications(prev => [
      {
        id: generateUniqueId('notif'),
        title: 'Lien Waiver Recorded',
        message: `${fullWaiver.type} recorded for ${fullWaiver.subcontractorName} ($${fullWaiver.amount.toLocaleString()}).`,
        timeAgo: 'Just now',
        read: false,
        type: 'budget'
      },
      ...prev
    ]);

    setIsRecordLienWaiverOpen(false);
  };

  const handleDisbursePayApp = (
    projectId: string,
    subName: string,
    netAmount: number,
    _grossAmount?: number,
    retainage?: number,
    trade?: string
  ) => {
    // 1. Correctly update target project's budget by projectId (no hardcoded idx === 0)
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const newPaid = p.budget.paid + netAmount;
        const newActual = p.budget.actual + netAmount;
        const updatedProj = {
          ...p,
          budget: {
            ...p.budget,
            paid: newPaid,
            actual: newActual,
            remaining: Math.max(0, p.budget.total - newActual)
          }
        };
        if (activeProject && activeProject.id === p.id) {
          setActiveProject(updatedProj);
        }
        return updatedProj;
      }
      return p;
    }));

    // 2. Regulatory Compliance: Convert conditional waiver to Unconditional or stamp active waiver
    setLienWaivers(prev => {
      const existingIdx = prev.findIndex(
        lw => lw.projectId === projectId && lw.subcontractorName.toLowerCase() === subName.toLowerCase()
      );
      if (existingIdx !== -1) {
        return prev.map((lw, idx) => idx === existingIdx ? {
          ...lw,
          type: 'Progress Unconditional' as const,
          status: 'Signed & Active' as const,
          amount: lw.amount || netAmount
        } : lw);
      } else {
        const newWaiver: LienWaiver = {
          id: generateUniqueId('lw'),
          projectId,
          subcontractorName: subName,
          trade: trade || 'General Trade',
          amount: netAmount,
          type: 'Progress Unconditional',
          status: 'Signed & Active',
          invoiceRef: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          dateSubmitted: new Date().toISOString().split('T')[0]
        };
        return [newWaiver, ...prev];
      }
    });

    // 3. Notification
    const retainageText = retainage ? ` (Retainage Held: $${retainage.toLocaleString()})` : '';
    setNotifications(prev => [
      {
        id: generateUniqueId('notif'),
        title: 'Pay Application Disbursed',
        message: `$${netAmount.toLocaleString()} ACH disbursed to ${subName}${retainageText}. Unconditional Lien Waiver confirmed.`,
        timeAgo: 'Just now',
        read: false,
        type: 'budget'
      },
      ...prev
    ]);
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
    localStorage.setItem('lattice_onboarded', 'true');
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
    // Optionally clear onboarding flag to re-show onboarding
    // localStorage.removeItem('lattice_onboarded');
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
    // Prevent denormalization data drift: keep child collections' projectName in sync
    if (updated.name) {
      setTasks(prev => prev.map(t => t.projectId === updated.id ? { ...t, projectName: updated.name } : t));
      setPunchItems(prev => prev.map(pi => pi.projectId === updated.id ? { ...pi, projectName: updated.name } : pi));
      setPhotos(prev => prev.map(ph => ph.projectId === updated.id ? { ...ph, projectName: updated.name } : ph));
      setDailyLogs(prev => prev.map(dl => dl.projectId === updated.id ? { ...dl, projectName: updated.name } : dl));
    }
  };

  const handleDeleteProject = (projectId: string) => {
    // Relational cascading delete: prevent orphaned child entities
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    setPunchItems(prev => prev.filter(pi => pi.projectId !== projectId));
    setPhotos(prev => prev.filter(ph => ph.projectId !== projectId));
    setDailyLogs(prev => prev.filter(dl => dl.projectId !== projectId));
    setChangeOrders(prev => prev.filter(co => co.projectId !== projectId));
    setDraws(prev => prev.filter(d => d.projectId !== projectId));
    setLienWaivers(prev => prev.filter(lw => lw.projectId !== projectId));
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
      id: generateUniqueId('proj'),
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
        completedMilestones: 0,
        pendingCOs: 0
      },
      thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      description: newProj.description || 'New commercial build'
    };

    setProjects(prev => [fullProj, ...prev]);
    setIsCreateProjectOpen(false);
    setActiveProject(fullProj); // Auto-navigate into project workspace
  };

  const handleCreateTask = (newTask: Partial<Task>) => {
    const targetProjectId = newTask.projectId || (activeProject ? activeProject.id : projects[0].id);
    const targetProject = projects.find(p => p.id === targetProjectId) || activeProject || projects[0];

    const fullTask: Task = {
      id: newTask.id || generateUniqueId('tsk'),
      projectId: targetProjectId,
      projectName: newTask.projectName || targetProject.name,
      title: newTask.title || 'New Construction Task',
      description: newTask.description || '',
      assignee: newTask.assignee || {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.roleTitle
      },
      startDate: newTask.startDate || new Date().toISOString().split('T')[0],
      dueDate: newTask.dueDate || '2025-05-25',
      priority: newTask.priority || 'Medium',
      status: newTask.status || 'Not Started',
      milestone: newTask.milestone || 'General Construction',
      stageId: newTask.stageId,
      costCode: newTask.costCode || '03-3000',
      subtasks: newTask.subtasks || [
        { id: generateUniqueId('st'), title: 'Verify site clearance', completed: false },
        { id: generateUniqueId('st'), title: 'Quality signoff', completed: false }
      ],
      attachmentsCount: newTask.attachmentsCount || 0,
      notesCount: newTask.notesCount || 0,
      photos: newTask.photos || []
    };

    setTasks(prev => {
      const updated = [fullTask, ...prev];
      const projTasks = updated.filter(t => t.projectId === targetProjectId);
      const completedCount = projTasks.filter(t => t.status === 'Completed').length;
      const nextProgress = projTasks.length > 0 ? Math.round((completedCount / projTasks.length) * 100) : 0;

      setProjects(prevProjects => prevProjects.map(p => {
        if (p.id === targetProjectId) {
          const updatedProj = {
            ...p,
            progress: nextProgress,
            metrics: {
              ...p.metrics,
              totalTasks: projTasks.length,
              completedTasks: completedCount
            }
          };
          if (activeProject && activeProject.id === p.id) {
            setActiveProject(updatedProj);
          }
          return updatedProj;
        }
        return p;
      }));

      return updated;
    });

    setIsCreateTaskOpen(false);
    setIsCreateTaskModalOpen(false);
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
    const targetProjectId = newPunch.projectId || (activeProject ? activeProject.id : projects[0].id);
    const targetProject = projects.find(p => p.id === targetProjectId) || activeProject || projects[0];
    const fullPunch: PunchItem = {
      id: newPunch.id || generateUniqueId('pch'),
      projectId: targetProjectId,
      projectName: newPunch.projectName || targetProject.name,
      title: newPunch.title || 'Defect Notice',
      description: newPunch.description || 'Quality non-conformance item',
      location: newPunch.location || 'Level 3 - Zone B',
      status: 'Open',
      priority: newPunch.priority || 'Medium',
      assignedTo: newPunch.assignedTo || {
        id: 'sub-1',
        name: 'Marco Rossi',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        trade: 'Concrete Works'
      },
      dueDate: newPunch.dueDate || '2025-05-30',
      createdDate: new Date().toISOString().split('T')[0],
      photos: []
    };

    setPunchItems(prev => {
      const updated = [fullPunch, ...prev];
      const openCount = updated.filter(pi => pi.projectId === targetProjectId && pi.status === 'Open').length;
      setProjects(prevProjects => prevProjects.map(p => {
        if (p.id === targetProjectId) {
          const updatedProj = {
            ...p,
            metrics: {
              ...p.metrics,
              openPunchItems: openCount
            }
          };
          if (activeProject && activeProject.id === p.id) {
            setActiveProject(updatedProj);
          }
          return updatedProj;
        }
        return p;
      }));
      return updated;
    });

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
    setPunchItems(prev => {
      const updated = prev.map(p => p.id === punchId ? { ...p, status: newStatus } : p);
      const targetItem = prev.find(p => p.id === punchId);
      if (targetItem) {
        const targetProjectId = targetItem.projectId;
        const openCount = updated.filter(pi => pi.projectId === targetProjectId && pi.status === 'Open').length;
        setProjects(prevProjects => prevProjects.map(p => {
          if (p.id === targetProjectId) {
            const updatedProj = {
              ...p,
              metrics: {
                ...p.metrics,
                openPunchItems: openCount
              }
            };
            if (activeProject && activeProject.id === p.id) {
              setActiveProject(updatedProj);
            }
            return updatedProj;
          }
          return p;
        }));
      }
      return updated;
    });
  };

  const handleDeletePunch = (punchId: string) => {
    setPunchItems(prev => {
      const targetItem = prev.find(p => p.id === punchId);
      const updated = prev.filter(p => p.id !== punchId);
      if (targetItem) {
        const targetProjectId = targetItem.projectId;
        const openCount = updated.filter(pi => pi.projectId === targetProjectId && pi.status === 'Open').length;
        setProjects(prevProjects => prevProjects.map(p => {
          if (p.id === targetProjectId) {
            const updatedProj = {
              ...p,
              metrics: {
                ...p.metrics,
                openPunchItems: openCount
              }
            };
            if (activeProject && activeProject.id === p.id) {
              setActiveProject(updatedProj);
            }
            return updatedProj;
          }
          return p;
        }));
      }
      return updated;
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => {
      const taskToDelete = prevTasks.find(t => t.id === taskId);
      const updatedTasks = prevTasks.filter(t => t.id !== taskId);

      if (taskToDelete) {
        const projTasks = updatedTasks.filter(t => t.projectId === taskToDelete.projectId);
        const completedCount = projTasks.filter(t => t.status === 'Completed').length;
        const nextProgress = projTasks.length > 0 ? Math.round((completedCount / projTasks.length) * 100) : 0;

        setProjects(prevProjects => prevProjects.map(p => {
          if (p.id === taskToDelete.projectId) {
            const updatedProj = {
              ...p,
              progress: nextProgress,
              metrics: {
                ...p.metrics,
                totalTasks: projTasks.length,
                completedTasks: completedCount
              }
            };
            if (activeProject && activeProject.id === p.id) {
              setActiveProject(updatedProj);
            }
            return updatedProj;
          }
          return p;
        }));
      }
      return updatedTasks;
    });
    setSelectedTask(null);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    setSelectedPhoto(null);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    setSelectedDocument(null);
  };

  const handleDeleteDailyLog = (logId: string) => {
    setDailyLogs(prev => prev.filter(l => l.id !== logId));
    setProjects(prev => prev.map(p => ({
      ...p,
      dailyLogs: (p.dailyLogs || []).filter(l => l.id !== logId)
    })));
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
    let targetSubTab = 'overview';
    if (currentRole === 'finance') targetSubTab = 'budget';
    else if (currentRole === 'pm') targetSubTab = 'tasks';
    else if (currentRole === 'field') targetSubTab = 'daily-logs';
    setProjectSubTab(targetSubTab);
  };

  const handleHeaderBack = () => {
    if (isCreateProjectOpen) {
      setIsCreateProjectOpen(false);
    } else if (isCreateTaskOpen) {
      setIsCreateTaskOpen(false);
    } else if (isCreateBudgetOpen) {
      setIsCreateBudgetOpen(false);
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
          {activeTab !== 'notifications' && activeTab !== 'budgets' && activeTab !== 'more' && activeTab !== 'account' && activeTab !== 'team' && activeTab !== 'milestones' && activeTab !== 'punch' && activeTab !== 'messages' && (
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
              onOpenSettings={() => { setActiveBudgetName(null); setActiveProject(null); setActiveTab('account'); }}
              onOpenDrawer={() => setIsSideDrawerOpen(true)}
              onNavigateTab={(tab) => {
                setActiveBudgetName(null);
                if (tab === 'home' || tab === 'projects' || tab === 'calendar' || tab === 'daily-logs' || tab === 'budgets' || tab === 'team' || tab === 'latti' || tab === 'more' || tab === 'account') {
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
                onAddTask={handleCreateTask}
                onOpenPunch={(p) => setSelectedTask(null)}
                onCreatePunch={() => setIsCreatePunchOpen(true)}
                onUpdatePunchStatus={handleUpdatePunchStatus}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onUploadPhoto={() => setIsPhotoUploadOpen(true)}
                onPreviewPhoto={(p) => setSelectedPhoto(p)}
                onUploadDocument={() => setIsUploadDocumentOpen(true)}
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
                onApproveChangeOrder={handleApproveChangeOrder}
                onAddReport={handleAddReport}
                onAddDailyLog={handleAddDailyLog}
                onOpenEditProject={() => setIsEditProjectOpen(true)}
                initialCalendarDate={initialCalendarDate}
              />
            ) : (
              /* Global Hub Views */
              <>
                {/* 1. CORE HOME DASHBOARD (Figma Screen 1) */}
                {activeTab === 'home' && (
                  <HomeScreen
                    projects={projects}
                    tasks={tasks}
                    dailyLogs={dailyLogs}
                    punchItems={punchItems}
                    changeOrders={changeOrders}
                    subcontractors={subcontractors}
                    currentRole={currentRole}
                    onSelectProject={handleSelectProject}
                    onOpenProjects={() => setActiveTab('projects')}
                    onOpenLatti={(query) => {
                      setLattiInitialQuery(query || '');
                      setActiveTab('latti');
                    }}
                    onOpenTask={(t) => setSelectedTask(t)}
                    onOpenTasks={(projectId) => {
                      const targetProj = projectId ? projects.find(p => p.id === projectId) || projects[0] : projects[0];
                      handleSelectProject(targetProj);
                      setProjectSubTab('tasks');
                    }}
                    onOpenCalendar={(targetDate) => {
                      if (targetDate) setInitialCalendarDate(targetDate);
                      handleSelectProject(projects[0]);
                      setProjectSubTab('schedule');
                    }}
                    onOpenBudget={(proj) => {
                      handleSelectProject(proj);
                      setProjectSubTab('budget');
                    }}
                    onOpenBudgetsHub={() => {
                      handleSelectProject(projects[0]);
                      setProjectSubTab('budget');
                    }}
                    onOpenDailyLogs={() => setActiveTab('daily-logs')}
                    onOpenPunchList={() => {
                      handleSelectProject(projects[0]);
                      setProjectSubTab('punch');
                    }}
                    onOpenApprovePayApp={() => setIsApprovePayAppOpen(true)}
                    onOpenLienWaiver={() => setIsRecordLienWaiverOpen(true)}
                    onOpenCreateDraw={() => setIsCreateDrawOpen(true)}
                    onCreateTask={() => setIsCreateTaskModalOpen(true)}
                    onCreatePunch={() => setIsCreatePunchOpen(true)}
                    onCreateChangeOrder={() => setIsCreateChangeOrderOpen(true)}
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

                {/* 4. ACCOUNT & PROFILE HUB */}
                {(activeTab === 'account' || activeTab === 'more') && (
                  <SettingsView
                    currentUser={currentUser}
                    onSignOut={() => setAppView('auth')}
                    initialSubView={settingsSubView}
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
                  <TeamHubView currentRole={currentRole} onBack={() => setActiveTab('home')} />
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
                    onDeleteEvent={(id) => setCalendarEvents(prev => prev.filter(e => e.id !== id))}
                    initialDate={initialCalendarDate}
                  />
                )}

                {activeTab === 'budgets' && (
                  ['admin', 'finance', 'pm'].includes(currentRole) ? (
                    <BudgetsHubView
                      projects={projects}
                      onOpenImportBudget={() => setIsImportBudgetOpen(true)}
                      onBack={() => setActiveTab('home')}
                    />
                  ) : (
                    <div className="p-8 text-center text-slate-500 max-w-[430px] mx-auto">
                      <p className="text-sm font-bold text-slate-800">Access Restricted</p>
                      <p className="text-xs text-slate-500 mt-1">Financial Ledgers and Budgets are accessible to Administrators, Finance Officers, and Project Managers.</p>
                      <button onClick={() => setActiveTab('home')} className="mt-4 px-4 py-2 bg-[#1677FF] text-white text-xs font-bold rounded-xl cursor-pointer">
                        Return Home
                      </button>
                    </div>
                  )
                )}


                {activeTab === 'messages' && (
                  <MessagesHubView
                    currentUser={currentUser}
                    projects={projects}
                    chatMessages={chatMessages}
                    onSendMessage={handleSendMessage}
                    onSelectProject={handleSelectProject}
                    onBack={() => setActiveTab('home')}
                  />
                )}

                {activeTab === 'milestones' && (
                  <MilestonesHubView
                    projects={projects}
                    tasks={tasks}
                    onSelectProject={handleSelectProject}
                    onCreateTask={() => setIsCreateTaskModalOpen(true)}
                    onBack={() => setActiveTab('home')}
                  />
                )}

                {activeTab === 'punch' && (
                  <ProjectPunchListTab
                    project={activeProject || projects[0]}
                    punchItems={punchItems}
                    onCreatePunch={() => setIsCreatePunchOpen(true)}
                    onUpdatePunchStatus={handleUpdatePunchStatus}
                    onDeletePunch={handleDeletePunch}
                    onBack={() => setActiveTab('home')}
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
                    onDeleteLog={handleDeleteDailyLog}
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
            unreadNotifsCount={unreadNotifsCount}
            onNavigateTab={(tab) => {
              setActiveProject(null);
              if (tab === 'company' || tab === 'support' || tab === 'security') {
                setSettingsSubView(tab);
                setActiveTab('account');
              } else if (tab === 'settings' || tab === 'account') {
                setSettingsSubView('main');
                setActiveTab('account');
              } else {
                setActiveTab(tab);
              }
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
        onAddProject={(['admin', 'pm'].includes(currentRole)) ? () => {
          setIsCreateProjectOpen(true);
        } : undefined}
        onAddTask={() => {
          const target = activeProject || projects[0];
          setActiveProject(target);
          setActiveTab('projects');
          setProjectSubTab('tasks');
          setIsCreateTaskModalOpen(true);
        }}
        onAddDailyLog={() => {
          const target = activeProject || projects[0];
          setActiveProject(target);
          setActiveTab('projects');
          setProjectSubTab('daily-logs');
          setIsCreateDailyLogOpen(true);
        }}
        onAddExpense={(['admin', 'finance', 'pm'].includes(currentRole)) ? () => {
          const target = activeProject || projects[0];
          setActiveProject(target);
          setActiveTab('projects');
          setProjectSubTab('budget');
          setIsCreateChangeOrderOpen(true);
        } : undefined}
        onAddPhoto={() => {
          const target = activeProject || projects[0];
          setActiveProject(target);
          setActiveTab('projects');
          setProjectSubTab('photos');
          setIsPhotoUploadOpen(true);
        }}
        onAddDocument={() => {
          const target = activeProject || projects[0];
          setActiveProject(target);
          setActiveTab('projects');
          setProjectSubTab('documents');
          setIsUploadDocumentOpen(true);
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

      {/* CREATE DAILY LOG MODAL */}
      <CreateDailyLogModal
        isOpen={isCreateDailyLogOpen}
        onClose={() => setIsCreateDailyLogOpen(false)}
        projects={projects}
        preselectedProjectId={activeProject ? activeProject.id : projects[0]?.id}
        currentUser={currentUser}
        onSaveLog={(newLog) => {
          handleAddDailyLog(newLog);
          setIsCreateDailyLogOpen(false);
        }}
      />

      {/* PHOTO UPLOAD MODAL */}
      <PhotoUploadModal
        isOpen={isPhotoUploadOpen}
        onClose={() => setIsPhotoUploadOpen(false)}
        project={activeProject || projects[0]}
        projects={projects}
        onUpload={(p) => {
          const targetProj = projects.find(proj => proj.id === p.projectId) || activeProject || projects[0];
          setPhotos(prev => [
            {
              id: `ph-${Date.now()}`,
              projectId: targetProj.id,
              projectName: targetProj.name,
              url: p.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
              caption: p.caption || 'Site progress photo',
              category: p.category || 'Progress',
              location: p.location || targetProj.location || 'Site Area',
              timestamp: 'Just now',
              uploadedBy: currentUser.name,
              tags: ['Structural', p.category || 'Progress']
            },
            ...prev
          ]);
          setIsPhotoUploadOpen(false);
        }}
      />

      {/* DOCUMENT UPLOAD MODAL */}
      <UploadDocumentModal
        isOpen={isUploadDocumentOpen}
        onClose={() => setIsUploadDocumentOpen(false)}
        project={activeProject || projects[0]}
        projects={projects}
        onUpload={(newDoc) => {
          setDocuments(prev => [newDoc, ...prev]);
          setIsUploadDocumentOpen(false);
        }}
      />

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateStatus={handleUpdateTaskStatus}
          onToggleSubtask={handleToggleSubtask}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
        />
      )}

      {selectedPhoto && (
        <PhotoPreviewModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onDelete={handleDeletePhoto}
        />
      )}

      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDelete={handleDeleteDocument}
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

      {/* APPROVE PAY APPLICATION MODAL */}
      <ApprovePayAppModal
        isOpen={isApprovePayAppOpen}
        onClose={() => setIsApprovePayAppOpen(false)}
        projects={projects}
        subcontractors={subcontractors}
        onDisburse={(projectId, subName, netAmount, grossAmount, retainage, trade) => {
          handleDisbursePayApp(projectId, subName, netAmount, grossAmount, retainage, trade);
          setIsApprovePayAppOpen(false);
        }}
      />

      {/* PROCESS LIEN WAIVER MODAL */}
      <ProcessLienWaiverModal
        isOpen={isRecordLienWaiverOpen}
        onClose={() => setIsRecordLienWaiverOpen(false)}
        subcontractors={subcontractors}
        onRecordWaiver={(waiver) => {
          handleRecordLienWaiver(waiver);
          setIsRecordLienWaiverOpen(false);
        }}
      />

      {/* REQUEST LENDER DRAW MODAL */}
      <CreateDrawModal
        isOpen={isCreateDrawOpen}
        onClose={() => setIsCreateDrawOpen(false)}
        projects={projects}
        onCreateDraw={handleCreateDraw}
      />

      {/* CREATE CHANGE ORDER MODAL */}
      <CreateChangeOrderModal
        isOpen={isCreateChangeOrderOpen}
        onClose={() => setIsCreateChangeOrderOpen(false)}
        projectId={activeProject ? activeProject.id : (projects[0]?.id || 'proj-1')}
        onCreate={handleCreateChangeOrder}
      />

    </DeviceFrame>
  );
}

export default App;
