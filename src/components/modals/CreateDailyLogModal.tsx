import React, { useState } from 'react';
import { Project, DailyLogItem } from '../../types';
import { X, Camera, Trash2 } from 'lucide-react';

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

    const newDailyLog: DailyLogItem = {
      id: `log-${Date.now()}`,
      projectId: selectedProjectId,
      projectName: currentProject?.name || 'Snell Isle Residence',
      date: new Date(logDate + 'T12:00:00').toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      weather: {
        condition: weather || 'Sunny',
        temperature: temperature || '78°F'
      },
      totalHeadcount: Number(crewCount) || 0,
      workSummary: notes || 'General on-site progress, material handling, trade contractor inspections completed.',
      safetyIncidents: 'Zero accidents recorded',
      author: 'Avery Scott (Owner)',
      crews: [],
      safetyPassed: true,
      deliveries: deliveries ? deliveries.split(',').map(s => s.trim()).filter(Boolean) : [],
      equipment: equipment || undefined,
      visitors: visitors || undefined,
      materialsReceived: [],
      photos: photos
    };

    setTimeout(() => {
      onSaveLog(newDailyLog);
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in font-sans">
      <div 
        className="w-full max-w-[460px] max-h-[92vh] overflow-y-auto bg-white border border-[#DDE1E7] rounded-3xl shadow-2xl flex flex-col scrollbar-none text-[#171A1F]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAEDF1] sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <h2 className="text-base font-bold text-[#171A1F] tracking-tight">New Daily Log</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          
          {/* Row 1: Date & Project */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#68707C] flex items-center gap-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={logDate}
                onChange={e => setLogDate(e.target.value)}
                className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3 text-xs text-[#171A1F] outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#68707C] flex items-center gap-1">
                Project <span className="text-red-500">*</span>
              </label>
              {preselectedProjectId ? (
                <div className="h-10 px-3 bg-[#F7F8FA] border border-[#DDE1E7] rounded-xl flex items-center justify-between text-xs font-bold text-[#171A1F]">
                  <span className="truncate">{currentProject?.name || 'Active Project'}</span>
                  <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-1.5 py-0.5 rounded">Active</span>
                </div>
              ) : (
                <select
                  value={selectedProjectId}
                  onChange={e => setSelectedProjectId(e.target.value)}
                  required
                  className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3 text-xs font-semibold text-[#171A1F] outline-none cursor-pointer"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id} className="text-[#171A1F]">
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Row 2: Weather & Temperature */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#68707C]">Weather</label>
              <input
                type="text"
                value={weather}
                onChange={e => setWeather(e.target.value)}
                placeholder="Sunny / Rain"
                className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#68707C]">Temperature</label>
              <input
                type="text"
                value={temperature}
                onChange={e => setTemperature(e.target.value)}
                placeholder="78°F"
                className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Crew Count & Visitors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#68707C]">Crew Count</label>
              <input
                type="number"
                min={0}
                value={crewCount}
                onChange={e => setCrewCount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3 text-xs text-[#171A1F] outline-none transition-colors tabular-nums"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#68707C]">Visitors</label>
              <input
                type="text"
                value={visitors}
                onChange={e => setVisitors(e.target.value)}
                placeholder="Inspector, client..."
                className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 4: Deliveries & Equipment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#68707C]">Deliveries</label>
              <input
                type="text"
                value={deliveries}
                onChange={e => setDeliveries(e.target.value)}
                placeholder="Lumber, trusses..."
                className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#68707C]">Equipment</label>
              <input
                type="text"
                value={equipment}
                onChange={e => setEquipment(e.target.value)}
                placeholder="Crane, forklift..."
                className="w-full h-10 bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl px-3 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Row 5: Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#68707C]">Work Notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Work performed, site progress, safety checks..."
              className="w-full bg-white border border-[#DDE1E7] focus:border-[#1677FF] rounded-xl p-3 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none resize-none transition-colors leading-relaxed"
            />
          </div>

          {/* Row 6: Photos */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#68707C]">Photos</label>
            
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-1.5">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-[#DDE1E7] group">
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
              className="w-full h-16 rounded-xl border border-dashed border-[#DDE1E7] hover:border-[#1677FF] bg-[#F7F8FA] hover:bg-[#EAF3FF] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all group"
            >
              <Camera className="w-5 h-5 text-[#68707C] group-hover:text-[#1677FF] transition-colors" />
              <span className="text-xs font-medium text-[#68707C] group-hover:text-[#1677FF] transition-colors">
                {photos.length > 0 ? '+ Add more photos' : 'Attach site photos'}
              </span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 mt-1 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all disabled:opacity-50"
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
