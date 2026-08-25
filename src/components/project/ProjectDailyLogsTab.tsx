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
    <div className="w-full flex flex-col gap-4 pb-24 font-sans">
      {/* Top Header & Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
            Daily Site Logs & Headcount
          </h2>
          <p className="text-xs text-slate-400">
            Field reports, crew counts, weather conditions & material deliveries
          </p>
        </div>
        <button
          onClick={() => setIsCreatingLog(!isCreatingLog)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isCreatingLog ? 'Cancel' : 'New Daily Log'}</span>
        </button>
      </div>

      {/* New Log Creator Box */}
      {isCreatingLog && (
        <form onSubmit={handleCreateSubmit} className="p-4 rounded-xl bg-[#0D1422] border border-blue-500/40 shadow-lg flex flex-col gap-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[#1A263B] pb-2">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Log Site Progress for Today ({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
            </span>
            <span className="text-[10px] text-slate-400">Author: Field Superintendent</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Weather Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full bg-[#080D18] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500"
              >
                <option value="Sunny">☀️ Sunny (76°F / Dry)</option>
                <option value="Partly Cloudy">⛅ Partly Cloudy (68°F / Normal)</option>
                <option value="Rainy">🌧️ Rainy (62°F / Wet)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Total Site Headcount</label>
              <input
                type="number"
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                min="1"
                max="200"
                className="w-full bg-[#080D18] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Work Performed Today *</label>
            <textarea
              value={workSummary}
              onChange={(e) => setWorkSummary(e.target.value)}
              placeholder="E.g. Completed level 8 rough-in wiring, poured east foundation wall..."
              rows={2}
              required
              className="w-full bg-[#080D18] border border-[#1E293B] rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Materials Received (1 per line)</label>
            <textarea
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="E.g. 50 bundles 3/4 conduit&#10;2 pallets cement mix"
              rows={2}
              className="w-full bg-[#080D18] border border-[#1E293B] rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreatingLog(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow"
            >
              Publish Daily Log
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
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                  : 'bg-[#0D1422] border-[#1A263B] text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{log.date}</span>
              <span className="text-[10px] bg-[#141E33] px-1.5 py-0.5 rounded text-slate-300">
                {log.totalHeadcount} workers
              </span>
            </button>
          );
        })}
      </div>

      {selectedLog ? (
        <div className="flex flex-col gap-4">
          {/* Weather & Site Condition KPI */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-[#0D1422] border border-[#1A263B] flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                {selectedLog.weather.condition === 'Sunny' ? (
                  <Sun className="w-5 h-5" />
                ) : selectedLog.weather.condition === 'Rainy' ? (
                  <CloudRain className="w-5 h-5" />
                ) : (
                  <CloudSun className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Weather & Temp</div>
                <div className="text-xs font-bold text-white">{selectedLog.weather.temperature}</div>
                <div className="text-[10px] text-slate-400">{selectedLog.weather.condition}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0D1422] border border-[#1A263B] flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Total On-Site</div>
                <div className="text-xs font-bold text-blue-400">{selectedLog.totalHeadcount} Workers</div>
                <div className="text-[10px] text-slate-400">{selectedLog.crews.length} Active Trades</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0D1422] border border-[#1A263B] flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Wind & Site</div>
                <div className="text-xs font-bold text-slate-200">{selectedLog.weather.windSpeed}</div>
                <div className="text-[10px] text-emerald-400 font-medium">{selectedLog.weather.siteCondition} Ground</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0D1422] border border-[#1A263B] flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Safety Status</div>
                <div className="text-xs font-bold text-emerald-400">100% Passed</div>
                <div className="text-[10px] text-slate-400">0 Incidents</div>
              </div>
            </div>
          </div>

          {/* Work Summary Card */}
          <div className="p-4 rounded-xl bg-[#0D1422] border border-[#1A263B] flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Work Summary
              </span>
              <span className="text-[10px] text-slate-400">{selectedLog.author}</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-[#080D18] p-3 rounded-lg border border-[#151F30]">
              {selectedLog.workSummary}
            </p>
          </div>

          {/* Subcontractor Crews Headcount Breakdown */}
          <div className="p-4 rounded-xl bg-[#0D1422] border border-[#1A263B] flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Subcontractor Crews on Site ({selectedLog.crews.length})
              </span>
              <span className="text-[11px] font-bold text-blue-400">
                {selectedLog.totalHeadcount} Total Men on Deck
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {selectedLog.crews.map((crew, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#080D18] border border-[#151F30] flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{crew.subcontractor}</span>
                      <span className="text-[10px] font-medium text-slate-400 bg-[#121B2B] px-1.5 py-0.5 rounded border border-[#1D2A3D]">
                        {crew.trade}
                      </span>
                    </div>
                    {crew.notes && (
                      <p className="text-[11px] text-slate-400 mt-1 truncate">
                        {crew.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 text-right">
                    <div>
                      <div className="text-xs font-black text-blue-400">{crew.workersCount} workers</div>
                      <div className="text-[10px] text-slate-500">{crew.hoursWorked} hrs shift</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Materials Received & Deliveries */}
          <div className="p-4 rounded-xl bg-[#0D1422] border border-[#1A263B] flex flex-col gap-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Materials & Deliveries Logged
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {selectedLog.materialsReceived.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-[#080D18] p-2 rounded-lg border border-[#151F30]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Site Photos attached to log */}
          {selectedLog.photos && selectedLog.photos.length > 0 && (
            <div className="p-4 rounded-xl bg-[#0D1422] border border-[#1A263B] flex flex-col gap-2.5 shadow-sm">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Site Photos Attached ({selectedLog.photos.length})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {selectedLog.photos.map((photoUrl, idx) => (
                  <img
                    key={idx}
                    src={photoUrl}
                    alt={`Site Log photo ${idx + 1}`}
                    className="w-full h-36 object-cover rounded-lg border border-[#1F2E45] hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-xs">
          No daily logs recorded yet. Click "New Daily Log" above to record site progress.
        </div>
      )}
    </div>
  );
};
