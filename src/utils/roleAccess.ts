import { Project, User, UserRole } from '../types';

export function getRoleAccess(role: UserRole) {
  const isOwner = role === 'admin';
  const isPM = role === 'pm';
  const isFinance = role === 'finance';
  const isField = role === 'field';

  return {
    isOwner,
    isPM,
    isFinance,
    isField,
    canSeeAllProjects: isOwner || isFinance,
    canManageBilling: isOwner,
    canViewCompany: isOwner || isPM || isFinance,
    canEditCompany: isOwner,
    canInviteCompanyUsers: isOwner,
    canAddProjectMember: isOwner || isPM,
    canAssignLeadPm: isOwner,
    canPromoteAdmin: isOwner,
    canRemoveCompanyMember: isOwner,
    canCreateProject: isOwner,
    canEditProject: isOwner || isPM,
    canDeleteProject: isOwner,
    canCreateTask: isPM || isField,
    canUpdateTaskStatus: isPM || isField,
    canDeleteTask: isPM,
    canManageTaskBoard: isPM,
    canManageSchedule: isPM,
    canCreateDailyLog: isPM || isField,
    canEditDailyLog: isPM || isField,
    canManagePunch: isPM || isField,
    canUploadMedia: isOwner || isPM || isField,
    canDeleteMedia: isOwner || isPM,
    canAddReport: isOwner || isFinance,
    canEditBudget: isOwner || isFinance,
    canCreateChangeOrder: isOwner || isPM || isFinance,
    canApproveChangeOrder: isOwner,
    canLogExpense: isOwner || isPM || isFinance,
    canApprovePayApp: isOwner || isFinance,
    canCreateDraw: isOwner || isFinance,
    canRecordLienWaiver: isOwner || isFinance,
    canImportBudget: isOwner || isFinance,
    canCreateBudget: isOwner || isFinance,
    canViewBudget: !isField,
  };
}

export function projectsForUser(projects: Project[], user: User, extraIds: string[] = []): Project[] {
  if (user.role === 'admin' || user.role === 'finance') return projects;
  const allowed = new Set([...(user.assignedProjects || []), ...extraIds]);
  return projects.filter((p) => allowed.has(p.id));
}
