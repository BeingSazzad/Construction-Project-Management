import React, { useState } from 'react';
import { Project, DailyLogItem } from '../../types';
import { X, Calendar, Camera, Sun, CloudRain, Users, Truck, Wrench, ShieldCheck, Check, Trash2, Building2 } from 'lucide-react';

interface CreateDailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  preselectedProjectId?: string;
  onSaveLog: (newLog: DailyLogItem) => void;
}

export const CreateDailyLogModal: React.FC<CreateDailyLogModalProps> = ({
  isOpen,
  onClose,
  projects,
  preselectedProjectId,
  onSaveLog
}) => {
  // Format today's date as YYYY-MM-DD for input and MM/DD/YYYY for display
  const todayIso = new Date().toISOString().split('T')[0];
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    preselectedProjectId || projects[0]?.id || ''
  );
  const [logDate, setLogDate] = useState<string>(todayIso);
  const [weather, setWeather] = useState<string>('Sunny');
  const [temperature, setTemperature] = useState<string>('78°F');
  const [crewCount, setCrewCount] = useState<number | string>(24);
  const [visitors, setVisitors] = useState<string>('');
  const [deliveries, setDeliveries] = useState<string>('');
  const [equipment, setEquipment] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const handleAddSamplePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80'
    ];
    const nextPhoto = samplePhotos[photos.length % samplePhotos.length];
    setPhotos([...photos, nextPhoto]);
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    setIsSubmitting(true);

    const formattedDate = new Date(logDate + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newDailyLog: DailyLogItem = {
      id: `dl-${Date.now()}`,
      projectId: selectedProjectId,
      projectName: currentProject?.name || 'Commercial Project',
      date: formattedDate,
      weather: {
        condition: (weather as any) || 'Sunny',
        temperature: temperature || '78°F',
        windSpeed: '8 mph SW',
        precipitation: weather.toLowerCase().includes('rain') ? '60%' : '0%',
        siteCondition: weather.toLowerCase().includes('rain') ? 'Muddy' : 'Dry'
      },
      totalHeadcount: Number(crewCount) || 1,
      visitors: visitors.trim() || undefined,
      deliveries: deliveries ? deliveries.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      equipment: equipment.trim() || undefined,
      crews: [
        {
          trade: 'General Trades & Subcontractors',
          subcontractor: 'On-site Workforce',
          workersCount: Number(crewCount) || 1,
          hoursWorked: 8,
          notes: notes
        }
      ],
      workSummary: notes.trim() || 'Daily site progress logged according to schedule.',
      materialsReceived: deliveries ? deliveries.split(',').map(s => s.trim()).filter(Boolean) : ['Standard site consumables'],
      safetyIncidents: '0 Incidents. 100% OSHA & Site Safety Compliant.',
      safetyPassed: true,
      author: 'Current User (Field Superintendent)',
      photos: photos.length > 0 ? photos : undefined
    };

    setTimeout(() => {
      onSaveLog(newDailyLog);
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-[440px] max-h-[92vh] overflow-y-auto bg-[#070D1A] border border-[#142036] rounded-3xl shadow-2xl flex flex-col scrollbar-none"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#142036] sticky top-0 bg-[#070D1A]/95 backdrop-blur-md z-10">
          <h2 className="text-base font-bold text-white tracking-tight">New Daily Log</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0E172A] hover:bg-[#1A263E] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          
          {/* Row 1: Date * & Project * */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date * */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={logDate}
                  onChange={e => setLogDate(e.target.value)}
                  className="w-full h-10 bg-[#040813] border border-[#142036] focus:border-blue-500 rounded-xl px-3 text-xs text-white outline-none transition-colors shadow-inner"
                />
              </div>
            </div>

            {/* Project * */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                Project <span className="text-red-400">*</span>
              </label>
              {preselectedProjectId ? (
                // Inside project: Locked/preselected badge
                <div className="h-10 px-3 bg-[#040813] border border-blue-500/40 rounded-xl flex items-center justify-between text-xs font-bold text-white shadow-inner">
                  <span className="truncate">{currentProject?.name || 'Active Project'}</span>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">Active</span>
                </div>
              ) : (
                // From global hub: Project dropdown selector
                <div className="relative">
                  <select
                    value={selectedProjectId}
                    onChange={e => setSelectedProjectId(e.target.value)}
                    required
                    className="w-full h-10 bg-[#040813] border border-[#142036] focus:border-blue-500 rounded-xl pl-3 pr-8 text-xs font-semibold text-white outline-none appearance-none cursor-pointer shadow-inner transition-colors"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#070D1A] text-white">
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ⌄
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Weather & Temperature */}
          <div className="grid grid-cols-2 gap-3">
            {/* Weather */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Weather</label>
              <input
                type="text"
                value={weather}
                onChange={e => setWeather(e.target.value)}
                placeholder="Sunny / Rain"
                className="w-full h-10 bg-[#040813] border border-[#142036] focus:border-blue-500 rounded-xl px-3 text-xs text-white placeholder-slate-500 outline-none transition-colors shadow-inner"
              />
            </div>

            {/* Temperature */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Temperature</label>
              <input
                type="text"
                value={temperature}
                onChange={e => setTemperature(e.target.value)}
                placeholder="78°F"
                className="w-full h-10 bg-[#040813] border border-[#142036] focus:border-blue-500 rounded-xl px-3 text-xs text-white placeholder-slate-500 outline-none transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Row 3: Crew Count & Visitors */}
          <div className="grid grid-cols-2 gap-3">
            {/* Crew Count */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Crew Count</label>
              <input
                type="number"
                min={0}
                value={crewCount}
                onChange={e => setCrewCount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full h-10 bg-[#040813] border border-[#142036] focus:border-blue-500 rounded-xl px-3 text-xs text-white outline-none transition-colors shadow-inner tabular-nums"
              />
            </div>

            {/* Visitors */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Visitors</label>
              <input
                type="text"
                value={visitors}
                onChange={e => setVisitors(e.target.value)}
                placeholder="Inspector, client..."
                className="w-full h-10 bg-[#040813] border border-[#142036] focus:border-blue-500 rounded-xl px-3 text-xs text-white placeholder-slate-500 outline-none transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Row 4: Deliveries & Equipment */}
          <div className="grid grid-cols-2 gap-3">
            {/* Deliveries */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Deliveries</label>
              <input
                type="text"
                value={deliveries}
                onChange={e => setDeliveries(e.target.value)}
                placeholder="Lumber, trusses..."
                className="w-full h-10 bg-[#040813] border border-[#142036] focus:border-blue-500 rounded-xl px-3 text-xs text-white placeholder-slate-500 outline-none transition-colors shadow-inner"
              />
            </div>

            {/* Equipment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Equipment</label>
              <input
                type="text"
                value={equipment}
                onChange={e => setEquipment(e.target.value)}
                placeholder="Crane, forklift..."
                className="w-full h-10 bg-[#040813] border border-[#142036] focus:border-blue-500 rounded-xl px-3 text-xs text-white placeholder-slate-500 outline-none transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Row 5: Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Work performed, progress, issues..."
              className="w-full bg-[#040813] border border-[#142036] focus:border-blue-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none resize-none transition-colors shadow-inner leading-relaxed"
            />
          </div>

          {/* Row 6: Photos */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Photos</label>
            
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-1.5">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-[#142036] group">
                    <img src={url} alt="Site" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer shadow opacity-90 hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddSamplePhoto}
              className="w-full h-16 rounded-xl border border-[#142036] hover:border-blue-500/40 bg-[#040813] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:bg-[#070E1E] group"
            >
              <Camera className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                {photos.length > 0 ? '+ Add more photos' : 'Add site photos'}
              </span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 mt-1 rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#0D9488] hover:from-[#2563EB] hover:to-[#14B8A6] text-white text-xs font-bold shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving Daily Log...</span>
            ) : (
              <span>Save Daily Log</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
