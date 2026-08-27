import React, { useState } from 'react';
import { Project } from '../../types';
import { ArrowLeft, Building2, Calendar, DollarSign, UserCheck, MapPin, Check, Key } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface CreateProjectViewProps {
  onBack: () => void;
  onCreate: (newProject: Partial<Project>) => void;
}

export const CreateProjectView: React.FC<CreateProjectViewProps> = ({
  onBack,
  onCreate
}) => {
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('Apex Capital Holdings LLC');
  const [code, setCode] = useState('ATX-2026-10');
  const [masterCode, setMasterCode] = useState('1234');
  const [location, setLocation] = useState('1100 Congress Ave');
  const [cityState, setCityState] = useState('Austin, TX');
  const [budget, setBudget] = useState('4800000');
  const [pmName, setPmName] = useState('Sarah Johnson');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2027-10-15');
  const [type, setType] = useState('Commercial Highrise');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name,
      code,
      location,
      cityState,
      status: 'Planning',
      progress: 0,
      startDate,
      targetEndDate: endDate,
      budget: {
        total: parseFloat(budget) || 4800000,
        committed: 0,
        actual: 0,
        paid: 0,
        remaining: parseFloat(budget) || 4800000,
        variance: 0,
        costToComplete: parseFloat(budget) || 4800000
      },
      projectManager: {
        id: 'usr_pm',
        name: pmName,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
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
      description: `Client: ${clientName} • Master Code: ${masterCode}`
    });
  };

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>
        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
          New Construction
        </span>
      </div>

      <div className="bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col text-slate-100">
        <div className="pb-3 border-b border-[#142036] mb-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight leading-tight">
              Create New Project
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Initialize commercial or residential jobsite
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Project Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Austin Innovation Center"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Client Name / Owner Entity</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Project Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Master Access Code</label>
              <input
                type="text"
                value={masterCode}
                onChange={(e) => setMasterCode(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Jobsite Address</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">City, State</label>
              <input
                type="text"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Total Budget ($)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Project Type</label>
              <CustomSelect
                value={type}
                onChange={setType}
                options={['Commercial Highrise', 'Multi-Family Residential', 'Medical Office Facility', 'Industrial Warehouse']}
                size="md"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Assigned Project Manager</label>
            <CustomSelect
              value={pmName}
              onChange={setPmName}
              options={['Sarah Johnson (Lead PM)', 'Michael Chang (Finance & PM)', 'David Miller (Senior PM)']}
              size="md"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Target Completion</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-white text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#142036] mt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 h-10 rounded-xl border border-[#142036] bg-[#050811] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Initialize Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
