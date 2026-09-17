import { Project, User, UserRole } from '../types';

/**
 * Owner (admin) = full power — every can* flag is true.
 * PM = job delivery (schedule/tasks/logs), no billing/company admin.
 * Finance = money only.
 * Field = site ops only, no money.
 */
export function getRoleAccess(role: UserRole) {
  const isOwner = role === 'admin';
  const isPM = role === 'pm';
  const isFinance = role === 'finance';
  const isField = role === 'field';

  const flags = {
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
    canCreateTask: isOwner || isPM || isField,
    canUpdateTaskStatus: isOwner || isPM || isField,
    canDeleteTask: isOwner || isPM,
    canManageTaskBoard: isOwner || isPM,
    canManageSchedule: isOwner || isPM,
    canCreateDailyLog: isOwner || isPM || isField,
    canEditDailyLog: isOwner || isPM || isField,
    canManagePunch: isOwner || isPM || isField,
    canCreatePunch: isOwner || isPM || isField,
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
    canViewProfitLoss: isOwner || isFinance,
  };

  // Hard rule: Owner never loses a permission — force every can* on.
  if (isOwner) {
    (Object.keys(flags) as (keyof typeof flags)[]).forEach((key) => {
      if (key.startsWith('can')) flags[key] = true;
    });
  }

  return {
    isOwner,
    isPM,
    isFinance,
    isField,
    ...flags,
  };
}

export function projectsForUser(projects: Project[], user: User, extraIds: string[] = []): Project[] {
  if (user.role === 'admin' || user.role === 'finance') return projects;
  const allowed = new Set([...(user.assignedProjects || []), ...extraIds]);
  return projects.filter((p) => allowed.has(p.id));
}
