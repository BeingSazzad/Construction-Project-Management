import React, { useState } from 'react';
import { Project, DailyLogItem } from '../../types';
import { 
  Sun, CloudSun, CloudRain, Users, ShieldCheck, 
  Plus, Calendar, CheckCircle2, PackageCheck, AlertTriangle, 
  HardHat, FileText 
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface ProjectDailyLogsTabProps {
  project: Project;
  dailyLogs?: DailyLogItem[];
  onAddDailyLog?: (log: DailyLogItem) => void;
}

export const ProjectDailyLogsTab: React.FC<ProjectDailyLogsTabProps> = ({
  project,
  dailyLogs = project.dailyLogs || [],
  onAddDailyLog
}) => {
  const [selectedLogId, setSelectedLogId] = useState<string>(dailyLogs[0]?.id || '');
  const [isCreatingLog, setIsCreatingLog] = useState(false);

  // New log form state
  const [workSummary, setWorkSummary] = useState('');
  const [headcount, setHeadcount] = useState(18);
  const [materials, setMaterials] = useState('');
  const [condition, setCondition] = useState<'Sunny' | 'Partly Cloudy' | 'Rainy'>('Sunny');

  const selectedLog = dailyLogs.find(l => l.id === selectedLogId) || dailyLogs[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workSummary.trim()) return;

    const newLog: DailyLogItem = {
      id: `dl-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      weather: {
        condition: condition,
        temperature: '76°F / 24°C',
        windSpeed: '8 mph W',
        precipitation: condition === 'Rainy' ? '60%' : '0%',
        siteCondition: condition === 'Rainy' ? 'Muddy' : 'Dry'
      },
      totalHeadcount: Number(headcount),
      crews: [
        {
          trade: 'General Construction & Trades',
          subcontractor: 'On-site Field Subcontractors',
          workersCount: Number(headcount),
          hoursWorked: 8,
          notes: workSummary
        }
      ],
      workSummary: workSummary,
      materialsReceived: materials ? materials.split('\n').filter(Boolean) : ['General site supplies logged'],
      safetyIncidents: 'No safety incidents recorded. 100% compliant.',
      safetyPassed: true,
      author: 'Current User (Field Superintendent)'
    };

    if (onAddDailyLog) {
      onAddDailyLog(newLog);
    }
    setSelectedLogId(newLog.id);
    setIsCreatingLog(false);
    setWorkSummary('');
    setMaterials('');
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Top Header & Action */}
      <div className="flex items-center justify-between border-b border-[#142036] pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Daily Logs & Site Reports</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Field progress & crew headcounts</p>
        </div>

        <button
          onClick={() => setIsCreatingLog(!isCreatingLog)}
          className="h-8 px-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex-shrink-0 active:scale-95 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isCreatingLog ? 'Cancel' : '+ New Log'}</span>
        </button>
      </div>

      {/* 2. New Log Creator Form */}
      {isCreatingLog && (
        <form onSubmit={handleCreateSubmit} className="p-4 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-lg flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#142036] pb-2">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Log Site Progress for Today
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Weather</label>
              <CustomSelect
                value={condition}
                onChange={(v) => setCondition(v as any)}
                options={[
                  { value: 'Sunny', label: '☀️ Sunny' },
                  { value: 'Partly Cloudy', label: '⛅ Partly Cloudy' },
                  { value: 'Rainy', label: '🌧️ Rainy' }
                ]}
                size="md"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Total Headcount</label>
              <input
                type="number"
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                min={1}
                className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-xs text-white outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Work Summary</label>
            <textarea
              value={workSummary}
              onChange={(e) => setWorkSummary(e.target.value)}
              placeholder="Completed level 8 rough-in wiring, poured east wall..."
              rows={3}
              required
              className="w-full bg-[#050811] border border-[#142036] rounded-xl p-3 text-xs text-white outline-none focus:border-[#2563EB] resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Materials Received</label>
            <textarea
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="50 bundles conduit, 2 pallets cement mix..."
              rows={2}
              className="w-full bg-[#050811] border border-[#142036] rounded-xl p-3 text-xs text-white outline-none focus:border-[#2563EB] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-[#142036]">
            <button
              type="button"
              onClick={() => setIsCreatingLog(false)}
              className="h-9 px-4 rounded-xl border border-[#1E2C48] text-slate-300 text-xs font-semibold hover:bg-[#141F33] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Publish Log
            </button>
          </div>
        </form>
      )}

      {/* 3. Standardized Date Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none py-0.5">
        {dailyLogs.map((log) => {
          const isSelected = log.id === (selectedLog?.id || selectedLogId);
          return (
            <button
              key={log.id}
              onClick={() => setSelectedLogId(log.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#2563EB] text-white font-bold shadow-md shadow-blue-500/20'
                  : 'bg-[#070D1A] text-slate-400 hover:text-white border border-[#142036]'
              }`}
            >
              <span>{log.date}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} />
            </button>
          );
        })}
      </div>

      {/* 4. Selected Log Display */}
      {selectedLog && (
        <div className="flex flex-col gap-3">
          {/* Weather & Site Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0E1A33] border border-[#1E325A] flex items-center justify-center text-amber-400 flex-shrink-0">
                {selectedLog.weather.condition === 'Sunny' ? (
                  <Sun className="w-5 h-5" />
                ) : selectedLog.weather.condition === 'Rainy' ? (
                  <CloudRain className="w-5 h-5 text-blue-400" />
                ) : (
                  <CloudSun className="w-5 h-5 text-amber-300" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Weather</span>
                <h4 className="text-xs font-bold text-white truncate mt-0.5">{selectedLog.weather.temperature}</h4>
                <p className="text-[11px] text-slate-400 truncate">{selectedLog.weather.condition}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0E1A33] border border-[#1E325A] flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Labor</span>
                <h4 className="text-xs font-bold text-white truncate mt-0.5">{selectedLog.totalHeadcount} Workers</h4>
                <p className="text-[11px] text-emerald-400 font-semibold truncate">100% Attended</p>
              </div>
            </div>
          </div>

          {/* Work Completed Summary */}
          <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Work Progress Summary</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-[#050811] p-3 rounded-xl border border-[#142036] font-medium">
              {selectedLog.workSummary}
            </p>
          </div>

          {/* Safety Compliance & Materials */}
          <div className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Safety Compliance</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                0 Incidents
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 bg-[#050811] p-2.5 rounded-xl border border-[#142036]">
              <PackageCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="truncate font-medium">{selectedLog.materialsReceived.join(', ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
