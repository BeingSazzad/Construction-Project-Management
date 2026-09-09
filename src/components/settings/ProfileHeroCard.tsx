import React from 'react';
import { Briefcase, Building2, Check, ChevronRight, DollarSign, Edit3, HardHat } from 'lucide-react';
import { User, UserRole } from '../../types';
import { MOCK_PROJECTS } from '../../data/mockData';

interface ProfileHeroCardProps {
  user: User;
  onEdit: () => void;
  onOpenCompany?: () => void;
}

function assignedNames(user: User): string[] {
  return (user.assignedProjects || [])
    .map((id) => MOCK_PROJECTS.find((p) => p.id === id)?.name)
    .filter((name): name is string => Boolean(name));
}

function shortJob(name: string): string {
  return name.replace(' Residence', '').replace(' Commercial', '').replace(' Residential Development', '').replace(' Luxury Condos', '').replace(' Expansion', '');
}

const ROLE_ICON: Record<UserRole, React.ReactNode> = {
  admin: <Check className="w-2.5 h-2.5 text-[#0D5EF4] stroke-[3.5]" />,
  pm: <Briefcase className="w-3 h-3" />,
  finance: <DollarSign className="w-3 h-3" />,
  field: <HardHat className="w-3 h-3" />,
};

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
  user,
  onEdit,
  onOpenCompany,
}) => {
  const isOwner = user.role === 'admin';
  const jobs = assignedNames(user);
  const jobCount = jobs.length;
  const previewJobs = jobs.slice(0, 2).map(shortJob);

  if (isOwner) {
    return (
      <div
        onClick={onEdit}
        className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-[#0047C4] via-[#0D5EF4] to-[#257CFF] border border-white/20 p-4 text-white shadow-[0_4px_20px_rgba(13,94,244,0.22)] cursor-pointer group active:scale-[0.99] transition-all"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl p-0.5 bg-white/20 border border-white/30 flex items-center justify-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-[14px] object-cover bg-[#0047C4]"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10A976] border-2 border-[#0047C4]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white tracking-tight leading-tight truncate">
                  {user.name}
                </h2>
                <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0" title="Verified owner">
                  {ROLE_ICON.admin}
                </span>
              </div>
              <p className="text-xs font-normal text-white/80 truncate mt-0.5">
                {user.roleTitle}
              </p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCompany?.();
                  }}
                  className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 text-[11px] font-semibold text-white transition-all cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[140px]">{user.company}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
                <span className="inline-flex items-center h-7 px-2.5 rounded-lg bg-white/15 border border-white/25 text-[11px] font-semibold text-white">
                  Subscription owner
                </span>
              </div>
            </div>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-white/15 group-hover:bg-white/25 border border-white/25 flex items-center justify-center flex-shrink-0">
            <Edit3 className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    );
  }

  const roleCopy: Record<Exclude<UserRole, 'admin'>, { eyebrow: string; chip: string; meta: string }> = {
    pm: {
      eyebrow: 'Employee · Project Manager',
      chip: 'Project delivery',
      meta: `${jobCount} assigned jobs · Reports to Avery Scott`,
    },
    finance: {
      eyebrow: 'Employee · Finance',
      chip: 'Capital & draws',
      meta: `Portfolio finance · ${jobCount} jobs · Reports to Avery Scott`,
    },
    field: {
      eyebrow: 'Employee · Field',
      chip: 'Field operations',
      meta: `${jobCount} active sites · Daily logs & safety`,
    },
  };

  const copy = roleCopy[user.role as Exclude<UserRole, 'admin'>] || roleCopy.pm;

  return (
    <div
      onClick={onEdit}
      className="rounded-2xl bg-white border border-[#E2E8F0] p-4 shadow-card cursor-pointer group active:scale-[0.99] transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="relative flex-shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover border border-[#E2E8F0] bg-[#F1F5F9]"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10A976] border-2 border-white" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-1">
              {copy.eyebrow}
            </p>
            <h2 className="text-base font-bold text-[#0F172A] tracking-tight leading-tight truncate">
              {user.name}
            </h2>
            <p className="text-xs text-[#64748B] truncate mt-0.5">
              {user.roleTitle}
            </p>

            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="inline-flex items-center h-7 px-2.5 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-[11px] font-semibold text-[#475569]">
                Employee
              </span>
              <span className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg bg-[#EAF3FF] border border-[#1677FF]/20 text-[11px] font-semibold text-[#1677FF]">
                {ROLE_ICON[user.role]}
                {copy.chip}
              </span>
            </div>

            <p className="text-[11px] font-medium text-[#64748B] mt-2 leading-snug">
              {copy.meta}
            </p>

            {previewJobs.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {previewJobs.map((job) => (
                  <span
                    key={job}
                    className="inline-flex items-center h-6 px-2 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] font-semibold text-[#475569]"
                  >
                    {job}
                  </span>
                ))}
                {jobCount > 2 && (
                  <span className="text-[10px] font-semibold text-[#64748B]">
                    +{jobCount - 2} more
                  </span>
                )}
              </div>
            )}

            <p className="text-[11px] text-[#94A3B8] mt-2 truncate">
              Member of {user.company}
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-[#F8FAFC] group-hover:bg-[#EAF3FF] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
          <Edit3 className="w-4 h-4 text-[#64748B] group-hover:text-[#1677FF]" />
        </div>
      </div>
    </div>
  );
};
