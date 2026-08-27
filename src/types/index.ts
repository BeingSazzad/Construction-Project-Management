export type UserRole = 'admin' | 'pm' | 'finance' | 'field';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  company: string;
  phone?: string;
  assignedProjects: string[];
}

export type ProjectStatus = 
  | 'Planning' 
  | 'Pre-Construction' 
  | 'In Progress' 
  | 'On Hold' 
  | 'Completed' 
  | 'Warranty'
  | 'On Schedule'
  | 'At Risk'
  | 'Delayed';

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Upcoming' | 'At Risk';
  progress: number;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  cityState: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  targetEndDate: string;
  projectManager: {
    id: string;
    name: string;
    avatar: string;
  };
  budget: {
    total: number;
    committed: number;
    actual: number;
    paid: number;
    remaining: number;
    variance: number;
    costToComplete: number;
  };
  metrics: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    openPunchItems: number;
    totalMilestones: number;
    completedMilestones: number;
  };
  thumbnail: string;
  description: string;
}

export type TaskStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Completed';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  assignee: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  startDate: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  milestone?: string;
  costCode?: string;
  subtasks: { id: string; title: string; completed: boolean }[];
  attachmentsCount: number;
  notesCount: number;
  photos?: string[];
  location?: string;
}

export interface GanttItem {
  id: string;
  name: string;
  category: string;
  startDate: string; // e.g. "2025-05-18"
  endDate: string;   // e.g. "2025-05-22"
  progress: number;
  status: 'completed' | 'in-progress' | 'upcoming' | 'delayed';
  assignee: string;
  dependencies?: string[];
}

export type CostType = 'Labor' | 'Materials' | 'Equipment' | 'Subcontractor' | 'Vendor';

export interface CostItem {
  id: string;
  code: string;
  name: string;
  type: CostType;
  unit: string;
  quantity: number;
  unitPrice: number;
  estimatedCost: number;
  committedCost: number;
  actualCost: number;
  paidCost: number;
  remaining: number;
  variance: number;
}

export interface CostCodeGroup {
  code: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
  committedCost: number;
  variance: number;
  items: CostItem[];
}

export interface TradeCategory {
  id: string;
  name: string;
  icon: string;
  estimatedCost: number;
  actualCost: number;
  committedCost: number;
  costCodes: CostCodeGroup[];
}

export type PunchStatus = 'Open' | 'In Progress' | 'Resolved' | 'Verified' | 'Closed';

export interface PunchItem {
  id: string;
  projectId: string;
  title: string;
  location: string;
  description: string;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
    trade: string;
  };
  priority: Priority;
  dueDate: string;
  status: PunchStatus;
  photos: string[];
  resolutionEvidence?: string;
  resolutionNote?: string;
  createdDate: string;
}

export interface Subcontractor {
  id: string;
  companyName: string;
  trade: string;
  contactName: string;
  phone: string;
  email: string;
  status: 'Active' | 'Assigned' | 'Pending Review' | 'Completed';
  activeProjects: string[];
  workersOnSite: number;
  complianceRating: number; // 0-100%
  avatar: string;
}

export interface SitePhoto {
  id: string;
  projectId: string;
  projectName: string;
  url: string;
  caption: string;
  category: 'Site Photos' | 'Progress' | 'Inspections' | 'Safety' | 'Punch List';
  uploadedBy: string;
  timestamp: string;
  location: string;
  tags: string[];
}

export interface DocumentItem {
  id: string;
  projectId: string;
  title: string;
  category: 'Plans' | 'Drawings' | 'PDFs' | 'Contracts' | 'Reports' | 'Site Logistics';
  fileSize: string;
  fileType: 'PDF' | 'DWG' | 'DOCX' | 'XLSX';
  version: string;
  uploadedBy: string;
  uploadDate: string;
  url: string;
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'Progress' | 'Daily' | 'Budget' | 'Cost Analysis' | 'Cash Flow' | 'Safety';
  period: string;
  author: string;
  date: string;
  summary: string;
  fileSize: string;
}

export interface NotificationItem {
  id: string;
  type: 'task' | 'budget' | 'punch' | 'photo' | 'ai' | 'schedule';
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  projectId?: string;
  targetView?: string;
}

export interface LattiMessage {
  id: string;
  sender: 'user' | 'latti';
  text: string;
  timestamp: string;
  insightData?: {
    type: 'risk' | 'budget' | 'schedule' | 'task';
    title: string;
    items?: string[];
    recommendations?: string[];
    actionLabel?: string;
    actionPayload?: any;
    targetModule?: string;
  };
}

export interface DailyLogItem {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  weather: {
    condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Windy' | 'Clear';
    temperature: string;
    windSpeed: string;
    precipitation: string;
    siteCondition: 'Dry' | 'Muddy' | 'Normal';
  };
  totalHeadcount: number;
  crews: {
    trade: string;
    subcontractor: string;
    workersCount: number;
    hoursWorked: number;
    notes?: string;
  }[];
  workSummary: string;
  materialsReceived: string[];
  safetyIncidents: string;
  safetyPassed: boolean;
  author: string;
  photos?: string[];
}

export interface PlanGridPin {
  id: string;
  projectId: string;
  title: string;
  xPercent: number; // 0-100% position on blueprint
  yPercent: number; // 0-100% position on blueprint
  type: 'punch' | 'task' | 'photo' | 'inspection';
  status: 'open' | 'in-progress' | 'resolved';
  assigneeName?: string;
  roomOrArea: string;
  description: string;
  photoUrl?: string;
  createdDate: string;
}

export interface FinancingDraw {
  id: string;
  projectId: string;
  drawNumber: number;
  milestoneTitle: string;
  requestedAmount: number;
  approvedAmount: number;
  fundedAmount: number;
  status: 'Approved & Funded' | 'In Lender Review' | 'Inspection Scheduled' | 'Draft';
  requestDate: string;
  fundingDate?: string;
  lenderName: string;
  inspectorName?: string;
  inspectionPassed?: boolean;
}

export interface LienWaiver {
  id: string;
  projectId: string;
  subcontractorName: string;
  trade: string;
  amount: number;
  type: 'Progress Conditional' | 'Progress Unconditional' | 'Final Conditional' | 'Final Unconditional';
  status: 'Signed & Active' | 'Pending Signature' | 'Action Required';
  invoiceRef: string;
  dateSubmitted: string;
}

export interface OpportunityDeal {
  id: string;
  clientName: string;
  projectTitle: string;
  projectType: 'Commercial' | 'Custom Residential' | 'Multi-Family' | 'Remodel';
  estimatedValue: number;
  stage: 'Lead' | 'Estimating' | 'Bid Submitted' | 'Contract Negotiation' | 'Won';
  winProbability: number; // 0-100%
  expectedStartDate: string;
  location: string;
}

export interface ProjectChatMessage {
  id: string;
  projectId: string;
  channelId: string; // 'general' | 'framing' | 'inspections' | 'urgent'
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  attachmentUrl?: string;
}

