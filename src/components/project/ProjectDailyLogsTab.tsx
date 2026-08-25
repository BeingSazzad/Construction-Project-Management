import React, { useState } from 'react';
import { Project, DailyLogItem } from '../../types';
import { 
  Sun, CloudSun, CloudRain, Wind, Users, ShieldCheck, 
  Plus, Calendar, CheckCircle2, PackageCheck, AlertTriangle, 
  Camera, ChevronRight 
} from 'lucide-react';

interface ProjectDailyLogsTabProps {
  project: Project;
  dailyLogs: DailyLogItem[];
  onAddDailyLog?: (log: DailyLogItem) => void;
}

export const ProjectDailyLogsTab: React.FC<ProjectDailyLogsTabProps> = ({
  project,
  dailyLogs,
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
      id: `log-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      date: new Date().toISOString().split('T')[0],
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
    <div className="w-full flex flex-col gap-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Top Header & Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Daily Logs & Site Reports
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Field reports, crew counts & weather logs
          </p>
        </div>
        <button
          onClick={() => setIsCreatingLog(!isCreatingLog)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreatingLog ? 'Cancel' : 'New Log'}</span>
        </button>
      </div>

      {/* New Log Creator Form */}
      {isCreatingLog && (
        <form onSubmit={handleCreateSubmit} className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-lg flex flex-col gap-3.5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#162033] pb-2.5">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Log Site Progress for Today
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Weather Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl px-3 text-xs text-white outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="Sunny">☀️ Sunny (76°F)</option>
                <option value="Partly Cloudy">⛅ Partly Cloudy (68°F)</option>
                <option value="Rainy">🌧️ Rainy (62°F)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Site Headcount</label>
              <input
                type="number"
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                min="1"
                max="200"
                className="w-full h-11 bg-[#080D18] border border-[#1A263E] rounded-xl px-3 text-sm text-white outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Work Performed Today *</label>
            <textarea
              value={workSummary}
              onChange={(e) => setWorkSummary(e.target.value)}
              placeholder="Completed level 8 rough-in wiring, poured east wall..."
              rows={3}
              required
              className="w-full bg-[#080D18] border border-[#1A263E] rounded-xl p-3 text-xs text-white outline-none focus:border-[#2563EB] resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Materials Received</label>
            <textarea
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="50 bundles 3/4 conduit&#10;2 pallets cement mix"
              rows={2}
              className="w-full bg-[#080D18] border border-[#1A263E] rounded-xl p-3 text-xs text-white outline-none focus:border-[#2563EB] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-[#162033]">
            <button
              type="button"
              onClick={() => setIsCreatingLog(false)}
              className="h-11 px-4 rounded-xl border border-[#1E2C48] text-slate-300 text-xs font-semibold hover:bg-[#141F33]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md"
            >
              Publish Log
            </button>
          </div>
        </form>
      )}

      {/* Date Pill Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {dailyLogs.map((log) => {
          const isSelected = log.id === (selectedLog?.id || selectedLogId);
          return (
            <button
              key={log.id}
              onClick={() => setSelectedLogId(log.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm font-bold'
                  : 'bg-[#0D1424] border-[#1A263E] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{log.date}</span>
              <span className="text-[11px] bg-black/30 px-2 py-0.5 rounded-full text-white font-medium">
                {log.totalHeadcount} workers
              </span>
            </button>
          );
        })}
      </div>

      {selectedLog ? (
        <div className="flex flex-col gap-3.5">
          {/* Weather & Site Condition 4 Cards Grid (Fixed height & zero overlapping) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Card 1: Weather */}
            <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                {selectedLog.weather.condition === 'Sunny' ? (
                  <Sun className="w-5 h-5" />
                ) : selectedLog.weather.condition === 'Rainy' ? (
                  <CloudRain className="w-5 h-5" />
                ) : (
                  <CloudSun className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-400">Weather</div>
                <div className="text-sm font-bold text-white truncate mt-0.5">{selectedLog.weather.temperature}</div>
                <div className="text-xs text-slate-400 truncate mt-0.5">{selectedLog.weather.condition}</div>
              </div>
            </div>

            {/* Card 2: Headcount */}
            <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-400">On-Site</div>
                <div className="text-sm font-bold text-blue-400 truncate mt-0.5">{selectedLog.totalHeadcount} Workers</div>
                <div className="text-xs text-slate-400 truncate mt-0.5">{selectedLog.crews.length} Trades</div>
              </div>
            </div>

            {/* Card 3: Wind & Ground */}
            <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
                <Wind className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-400">Wind & Site</div>
                <div className="text-sm font-bold text-white truncate mt-0.5">{selectedLog.weather.windSpeed}</div>
                <div className="text-xs text-emerald-400 font-medium truncate mt-0.5">{selectedLog.weather.siteCondition} Ground</div>
              </div>
            </div>

            {/* Card 4: Safety */}
            <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-400">Safety</div>
                <div className="text-sm font-bold text-emerald-400 truncate mt-0.5">100% Passed</div>
                <div className="text-xs text-slate-400 truncate mt-0.5">0 Incidents</div>
              </div>
            </div>
          </div>

          {/* Work Summary Card */}
          <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] flex flex-col gap-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
                Work Summary
              </span>
              <span className="text-xs text-slate-400 font-medium">{selectedLog.author}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#080D18] p-3.5 rounded-2xl border border-[#162033]">
              {selectedLog.workSummary}
            </p>
          </div>

          {/* Subcontractor Crews Headcount Breakdown */}
          <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
                Crews on Site ({selectedLog.crews.length})
              </span>
              <span className="text-xs font-bold text-blue-400">
                {selectedLog.totalHeadcount} Total Workers
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {selectedLog.crews.map((crew, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-2xl bg-[#080D18] border border-[#162033] flex flex-col gap-1.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-white truncate">{crew.subcontractor}</span>
                      <span className="text-[11px] font-semibold text-slate-400 bg-[#121B2D] px-2 py-0.5 rounded-md border border-[#1C2C47]">
                        {crew.trade}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-blue-400 flex-shrink-0">
                      {crew.workersCount} workers
                    </span>
                  </div>

                  {crew.notes && (
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                      {crew.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Materials Received & Deliveries */}
          <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
                Materials & Deliveries Logged
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {selectedLog.materialsReceived.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200 bg-[#080D18] p-3 rounded-xl border border-[#162033]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Site Photos attached to log */}
          {selectedLog.photos && selectedLog.photos.length > 0 && (
            <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-300">
                  Site Photos Attached ({selectedLog.photos.length})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {selectedLog.photos.map((photoUrl, idx) => (
                  <img
                    key={idx}
                    src={photoUrl}
                    alt={`Site Log photo ${idx + 1}`}
                    className="w-full h-36 object-cover rounded-2xl border border-[#1E2C48] hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-xs font-medium">
          No daily logs recorded yet.
        </div>
      )}
    </div>
  );
};
