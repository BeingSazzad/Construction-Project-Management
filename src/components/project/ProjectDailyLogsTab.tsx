import React, { useState, useRef, useEffect } from 'react';
import { Project, DailyLogItem, User, ProjectUpdate } from '../../types';
import { 
  Search, Plus, ChevronRight, ChevronDown, FileText, ArrowLeft,
  Calendar, Sun, Cloud, CloudRain, Wind, Flame, Snowflake, Users, Truck, Wrench,
  Camera, X, AlertTriangle, Minus, ShieldCheck, Check
} from 'lucide-react';

interface ProjectDailyLogsTabProps {
  project: Project;
  dailyLogs?: DailyLogItem[];
  updates?: ProjectUpdate[];
  currentUser?: User;
  onAddDailyLog?: (log: DailyLogItem) => void;
}

export const ProjectDailyLogsTab: React.FC<ProjectDailyLogsTabProps> = ({
  project,
  dailyLogs = project.dailyLogs || [],
  currentUser,
  onAddDailyLog
}) => {
  const [localLogs, setLocalLogs] = useState<DailyLogItem[]>(dailyLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'feed' | 'details' | 'create'>('feed');
  const [selectedLog, setSelectedLog] = useState<DailyLogItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Form State for Create/Edit View
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [logDateInput, setLogDateInput] = useState<string>('2026-09-05'); // YYYY-MM-DD
  const [weatherTemp, setWeatherTemp] = useState<string>('82°F');
  const [weatherCond, setWeatherCond] = useState<string>('Sunny');
  const [isWeatherDropdownOpen, setIsWeatherDropdownOpen] = useState<boolean>(false);
  const weatherDropdownRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState<string>('');
  const [crewCount, setCrewCount] = useState<number>(19);

  // Additional Details State (Expandable Card)
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);
  const [deliveryNote, setDeliveryNote] = useState<string>('3 deliveries received (Lumber framing package, EMT conduit)');
  const [visitorNote, setVisitorNote] = useState<string>('City of Tampa Building Inspector (Structural framing walkthrough · 9:00 AM)');
  const [equipmentNote, setEquipmentNote] = useState<string>('50-ton Mobile Crane, Genie GTH-844 Telehandler');
  const [issueNote, setIssueNote] = useState<string>('');

  // Photos State - Valid high-availability Unsplash images
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80'
  ]);

  const renderWeatherIcon = (condition: string) => {
    const c = (condition || '').toLowerCase();
    if (c.includes('rain')) return <CloudRain className="w-4 h-4 text-blue-500 shrink-0" />;
    if (c.includes('wind')) return <Wind className="w-4 h-4 text-teal-500 shrink-0" />;
    if (c.includes('cloud') || c.includes('overcast')) return <Cloud className="w-4 h-4 text-slate-500 shrink-0" />;
    if (c.includes('heat') || c.includes('hot')) return <Flame className="w-4 h-4 text-red-500 shrink-0" />;
    if (c.includes('snow') || c.includes('ice') || c.includes('freez')) return <Snowflake className="w-4 h-4 text-sky-400 shrink-0" />;
    return <Sun className="w-4 h-4 text-amber-500 shrink-0" />;
  };

  // Figma Extension-Safe Click Outside Listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target ||
        target.tagName === 'HTML' ||
        target.closest?.('[id*="figma"], [class*="figma"], [id*="html-to-design"], [class*="html-to-design"], [id*="h2d"], [class*="h2d"], [data-figma], [data-h2d], [data-extension], [id*="extension"], [class*="extension"]')
      ) {
        return;
      }
      if (weatherDropdownRef.current && !weatherDropdownRef.current.contains(target)) {
        setIsWeatherDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync state if props change
  useEffect(() => {
    if (dailyLogs && dailyLogs.length > 0) {
      setLocalLogs(dailyLogs);
    }
  }, [dailyLogs]);

  const cleanAuthor = (authorName?: string) => {
    if (!authorName) return 'Superintendent';
    return authorName.replace(/\s*\(.*?\)/g, '').trim();
  };

  const formatChipDate = (isoDateStr: string) => {
    try {
      const parts = isoDateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[month]} ${day}, ${year}`;
      }
    } catch {
      // fallback
    }
    return isoDateStr;
  };

  const formatDateDisplay = (isoDateStr: string) => {
    try {
      const parts = isoDateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${weekdays[d.getDay()]}, ${months[month]} ${day}, ${year}`;
      }
    } catch {
      // fallback
    }
    return isoDateStr;
  };

  const handleStartCreate = () => {
    setEditingLogId(null);
    setLogDateInput('2026-09-05');
    setWeatherTemp('82°F');
    setWeatherCond('Sunny');
    setNotes('');
    setCrewCount(19);
    setDeliveryNote('');
    setVisitorNote('');
    setEquipmentNote('');
    setIssueNote('');
    setIsDetailsExpanded(false);
    setPhotos([
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ]);
    setViewMode('create');
  };

  const handleStartEdit = (log: DailyLogItem) => {
    setEditingLogId(log.id);
    setLogDateInput(log.date.includes('2026-') ? log.date : '2026-09-05');
    setWeatherTemp(log.weather.temperature || '82°F');
    setWeatherCond(log.weather.condition || 'Sunny');
    setNotes(log.workSummary || '');
    setCrewCount(log.totalHeadcount || 19);
    setDeliveryNote(log.deliveries ? log.deliveries.join(', ') : '');
    setVisitorNote(log.visitors || '');
    setEquipmentNote(log.equipment || '');
    setIssueNote(log.status || '');
    setIsDetailsExpanded(Boolean(log.deliveries?.length || log.visitors || log.equipment || log.status));
    setPhotos(log.photos || []);
    setViewMode('create');
  };

  const handleAddSamplePhoto = () => {
    if (photos.length >= 10) return;
    const samplePhotos = [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ];
    setPhotos(prev => [...prev, samplePhotos[prev.length % samplePhotos.length]]);
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveNewLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    const authorName = currentUser?.name || 'John Smith';
    const rawDeliveries = deliveryNote ? [deliveryNote] : [];
    const statusValue = issueNote ? (issueNote.includes('Issue') || issueNote.includes('Delay') ? issueNote : `1 Issue: ${issueNote}`) : undefined;
    const readableDate = formatDateDisplay(logDateInput);
    const shortDateMatch = readableDate.match(/([a-zA-Z]+)\s*(\d+)/);
    const shortDate = shortDateMatch ? `${shortDateMatch[1]} ${shortDateMatch[2]}` : 'Sep 5';

    const logToSave: DailyLogItem = {
      id: editingLogId || `log-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      address: project.location ? `${project.location} · ${project.cityState || ''}` : '1840 Brightwaters Blvd NE · St. Petersburg, FL',
      date: shortDate,
      time: '5:42 PM',
      status: statusValue,
      authorRole: 'Superintendent',
      lastEdited: 'Just now',
      weather: {
        condition: weatherCond || 'Sunny',
        temperature: weatherTemp || '82°F',
        siteCondition: 'Dry'
      },
      totalHeadcount: crewCount,
      crews: [],
      workSummary: notes || 'Completed Level 2 structural floor framing, including hurricane clips and west shear-wall tie-downs. Electrical rough-in continued to the main distribution panel.',
      safetyIncidents: issueNote ? `Reported: ${issueNote}` : undefined,
      safetyPassed: !issueNote,
      author: authorName,
      deliveries: rawDeliveries,
      equipment: equipmentNote || undefined,
      visitors: visitorNote || undefined,
      materialsReceived: rawDeliveries,
      photos: photos
    };

    if (editingLogId) {
      setLocalLogs(prev => prev.map(l => l.id === editingLogId ? logToSave : l));
    } else {
      setLocalLogs(prev => [logToSave, ...prev]);
      if (onAddDailyLog) onAddDailyLog(logToSave);
    }

    setSelectedLog(logToSave);
    setViewMode('details');
  };

  const filteredLogs = localLogs.filter(log => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      log.workSummary.toLowerCase().includes(q) ||
      log.author.toLowerCase().includes(q) ||
      (log.status && log.status.toLowerCase().includes(q)) ||
      log.date.toLowerCase().includes(q)
    );
  });

  // ─────────────────────────────────────────────────────────────
  // 1. CREATE / EDIT DAILY LOG VIEW (Screen 1)
  // ─────────────────────────────────────────────────────────────
  if (viewMode === 'create') {
    return (
      <form onSubmit={handleSaveNewLog} className="w-full flex-1 flex flex-col gap-3 px-3.5 sm:px-4 py-2 pb-24 font-sans max-w-[440px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">

        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between py-1">
          <button
            type="button"
            onClick={() => setViewMode(selectedLog ? 'details' : 'feed')}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] transition-colors cursor-pointer active:scale-95 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
            {editingLogId ? 'Edit Daily Log' : 'New Daily Log'}
          </h2>

          <div className="w-9" />
        </div>

        {/* Unified Top Header Card with Sleek Interactive Date & Weather */}
        <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col gap-2.5">
          {/* Project Row */}
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&auto=format&fit=crop&q=80"
              alt={project.name}
              className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0] shadow-2xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[#0F172A] truncate leading-tight">
                {project.name}
              </h3>
              <p className="text-xs text-[#64748B] font-normal truncate mt-0.5">
                {project.location ? `${project.location} · ${project.cityState || ''}` : '1840 Brightwaters Blvd NE · St. Petersburg, FL'}
              </p>
            </div>
          </div>

          {/* Clean Inline Date & Weather Action Row (Seamless, No inner boxes) */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
            {/* 1. Date Picker */}
            <div className="relative flex items-center gap-2 py-0.5 px-1 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
              <Calendar className="w-4 h-4 text-[#1677FF] shrink-0" />
              <span className="font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors truncate">
                {formatChipDate(logDateInput)}
              </span>
              <input
                type="date"
                value={logDateInput}
                onChange={e => setLogDateInput(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                title="Click to choose log date"
              />
            </div>

            {/* 2. Seamless Inline Weather: Clean Clickable Temp & Custom Dropdown */}
            <div className="flex items-center gap-1.5 py-0.5 px-1 rounded-lg hover:bg-[#F8FAFC] transition-colors">
              {renderWeatherIcon(weatherCond)}
              
              {/* Temperature Numeric Input */}
              <div className="flex items-center group/temp">
                <input
                  type="text"
                  inputMode="numeric"
                  value={weatherTemp.replace(/[^0-9-]/g, '')}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9-]/g, '').slice(0, 3);
                    setWeatherTemp(val ? `${val}°F` : '');
                  }}
                  placeholder="82"
                  className="w-7 text-xs font-bold text-[#0F172A] text-right bg-transparent outline-none hover:bg-slate-200/60 focus:bg-white focus:ring-1 focus:ring-[#1677FF] rounded px-0.5 transition-colors cursor-text"
                  title="Click to edit temperature"
                />
                <span className="text-xs font-bold text-[#0F172A] ml-0.5 select-none">°F</span>
              </div>

              <span className="text-[#CBD5E1] font-bold select-none">·</span>

              {/* Custom HTML Condition Dropdown (Figma Capturable) */}
              <div className="relative flex items-center" ref={weatherDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsWeatherDropdownOpen(!isWeatherDropdownOpen)}
                  className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1 cursor-pointer py-0.5 px-1 rounded-md hover:bg-slate-200/50"
                  title="Click to select Weather Condition"
                >
                  <span>{weatherCond}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-150 ${isWeatherDropdownOpen ? 'rotate-180 text-[#1677FF]' : ''}`} />
                </button>

                {isWeatherDropdownOpen && (
                  <div className="absolute right-0 top-7 w-48 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl z-50 py-1.5 overflow-hidden animate-fade-in divide-y divide-[#F1F5F9]">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Site Condition
                    </div>
                    <div className="py-1">
                      {[
                        { label: 'Sunny', icon: Sun, color: 'text-amber-500' },
                        { label: 'Partly Cloudy', icon: Cloud, color: 'text-sky-500' },
                        { label: 'Overcast', icon: Cloud, color: 'text-slate-500' },
                        { label: 'Rain Delay', icon: CloudRain, color: 'text-blue-500' },
                        { label: 'High Winds', icon: Wind, color: 'text-teal-500' },
                        { label: 'High Heat', icon: Flame, color: 'text-rose-500' },
                        { label: 'Snow / Ice', icon: Snowflake, color: 'text-sky-400' }
                      ].map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = weatherCond === opt.label;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => {
                              setWeatherCond(opt.label);
                              setIsWeatherDropdownOpen(false);
                            }}
                            className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected ? 'bg-[#EAF3FF] text-[#1677FF] font-bold' : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* What happened today? */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#0F172A] block">
            What happened today? <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              required
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value.slice(0, 500))}
              placeholder="Briefly describe today's progress..."
              className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-3 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1677FF] transition-colors resize-none leading-relaxed font-normal shadow-2xs"
            />
            <span className="absolute right-3 bottom-2.5 text-[10px] text-[#94A3B8] font-medium pointer-events-none">
              {notes.length}/500
            </span>
          </div>
        </div>

        {/* Crew on Site (Compact Single-Row Stepper Card) */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl px-3.5 py-2.5 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <label className="text-xs font-bold text-[#0F172A] block leading-tight">
                Crew on Site <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-[#64748B] font-normal block leading-tight mt-0.5">
                Active workforce headcount
              </span>
            </div>
          </div>

          {/* Compact Inline Stepper */}
          <div className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1 gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setCrewCount(Math.max(1, crewCount - 1))}
              className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] hover:bg-slate-50 flex items-center justify-center text-[#0F172A] hover:text-[#1677FF] transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="Decrease crew count"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <div className="px-2 text-center min-w-[54px]">
              <span className="text-sm font-extrabold text-[#0F172A] tabular-nums block leading-tight">
                {crewCount}
              </span>
              <span className="text-[10px] text-[#64748B] font-semibold block leading-none">
                workers
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCrewCount(crewCount + 1)}
              className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] hover:bg-slate-50 flex items-center justify-center text-[#0F172A] hover:text-[#1677FF] transition-all cursor-pointer active:scale-95 shadow-2xs"
              title="Increase crew count"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0F172A]">Photos</label>
            <span className="text-[10px] font-semibold text-[#94A3B8]">{photos.length}/10</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={handleAddSamplePhoto}
              disabled={photos.length >= 10}
              className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#1677FF]/40 hover:border-[#1677FF] bg-[#EAF3FF]/30 hover:bg-[#EAF3FF]/60 flex flex-col items-center justify-center gap-1 text-[#1677FF] cursor-pointer transition-all shrink-0 active:scale-95"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span className="text-[10px] font-bold">Add Photos</span>
            </button>

            {photos.map((url, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#E2E8F0] shrink-0 group shadow-2xs">
                <img src={url} alt={`Site ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/65 text-white flex items-center justify-center cursor-pointer hover:bg-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add more details (optional) - Expandable Card with Unified Icon Styling */}
        <div className="space-y-2 pt-0.5">
          <div
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="p-3 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-between gap-3 cursor-pointer hover:border-[#1677FF]/40 transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0F172A] group-hover:text-[#1677FF] transition-colors">
                  Add more details <span className="text-[#94A3B8] font-normal">(optional)</span>
                </p>
                <p className="text-[10px] text-[#64748B] font-normal truncate mt-0.5">
                  Delivery, visitor, equipment, issue or delay
                </p>
              </div>
            </div>

            <ChevronRight className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 shrink-0 ${isDetailsExpanded ? 'rotate-90 text-[#1677FF]' : ''}`} />
          </div>

          {isDetailsExpanded && (
            <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl space-y-3 animate-fade-in">
              {/* Deliveries */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <Truck className="w-3.5 h-3.5 text-[#1677FF]" />
                  <span>Deliveries & Materials</span>
                </div>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={e => setDeliveryNote(e.target.value)}
                  placeholder="e.g. 3 deliveries received (Lumber framing package, EMT conduit)"
                  className="w-full h-9 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs text-[#0F172A] outline-none focus:border-[#1677FF]"
                />
              </div>

              {/* Visitor */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <Users className="w-3.5 h-3.5 text-[#1677FF]" />
                  <span>Visitors & Inspectors</span>
                </div>
                <input
                  type="text"
                  value={visitorNote}
                  onChange={e => setVisitorNote(e.target.value)}
                  placeholder="e.g. City Building Inspector (Structural walkthrough at 9:00 AM)"
                  className="w-full h-9 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs text-[#0F172A] outline-none focus:border-[#1677FF]"
                />
              </div>

              {/* Equipment */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <Wrench className="w-3.5 h-3.5 text-[#1677FF]" />
                  <span>Equipment on Site</span>
                </div>
                <input
                  type="text"
                  value={equipmentNote}
                  onChange={e => setEquipmentNote(e.target.value)}
                  placeholder="e.g. 50-ton Mobile Crane, Genie GTH-844 Telehandler"
                  className="w-full h-9 bg-white border border-[#E2E8F0] rounded-xl px-3 text-xs text-[#0F172A] outline-none focus:border-[#1677FF]"
                />
              </div>

              {/* Issue / Delay */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Issue or Delay</span>
                </div>
                <input
                  type="text"
                  value={issueNote}
                  onChange={e => setIssueNote(e.target.value)}
                  placeholder="e.g. Concrete pour delayed due to heavy rain"
                  className="w-full h-9 bg-white border border-amber-200 rounded-xl px-3 text-xs text-[#0F172A] outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Daily Log Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-[#1677FF] hover:bg-[#1677FF]/90 text-white text-sm font-bold transition-all shadow-md flex items-center justify-center cursor-pointer active:scale-98"
          >
            {editingLogId ? 'Update Daily Log' : 'Save Daily Log'}
          </button>
        </div>

      </form>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. DAILY LOG DETAILS VIEW (Screen 3 - Complete & Rich)
  // ─────────────────────────────────────────────────────────────
  if (viewMode === 'details' && selectedLog) {
    const cleanAuthorName = cleanAuthor(selectedLog.author);
    const authorInitials = cleanAuthorName.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'JS';
    const role = selectedLog.authorRole || 'Superintendent';
    const dateFormatted = selectedLog.date.includes('Sep') ? `Tue, ${selectedLog.date}, 2026` : selectedLog.date;

    const deliveriesList = [
      ...(selectedLog.deliveries || []),
      ...(selectedLog.materialsReceived || [])
    ];
    const uniqueDeliveries = Array.from(new Set(deliveriesList)).filter(Boolean);

    return (
      <div className="w-full flex-1 flex flex-col gap-3.5 px-4 py-3 pb-28 font-sans max-w-[440px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">

        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
          <button
            onClick={() => setViewMode('feed')}
            className="h-8 px-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Daily Logs</span>
          </button>

          <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Daily Log Details
          </h2>

          <button
            onClick={() => handleStartEdit(selectedLog)}
            className="text-xs font-bold text-[#1677FF] hover:underline cursor-pointer px-1 py-1"
          >
            Edit
          </button>
        </div>

        {/* Unified Top Header Card */}
        <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col gap-2.5">
          {/* Project Row */}
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&auto=format&fit=crop&q=80"
              alt={selectedLog.projectName}
              className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0] shadow-2xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[#0F172A] truncate leading-tight">
                {selectedLog.projectName}
              </h3>
              <p className="text-xs text-[#64748B] font-normal truncate mt-0.5">
                {selectedLog.address || '1840 Brightwaters Blvd NE · St. Petersburg, FL'}
              </p>
            </div>
          </div>

          {/* Clean Inline Date & Weather Row (No inner box borders) */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Calendar className="w-4 h-4 text-[#1677FF] shrink-0" />
              <span className="font-bold text-[#0F172A] truncate">
                {dateFormatted}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {renderWeatherIcon(selectedLog.weather.condition)}
              <span className="font-bold text-[#64748B]">
                {selectedLog.weather.temperature} · {selectedLog.weather.condition}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Work Completed */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
            <FileText className="w-4 h-4 text-[#1677FF]" />
            <span>Work Completed</span>
          </div>
          <p className="text-xs text-[#334155] leading-relaxed font-normal">
            {selectedLog.workSummary}
          </p>
        </div>

        {/* 2. Crew on Site (Clean Honest Direct Count) */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#0F172A] block leading-tight">Crew on Site</span>
              <p className="text-[10px] text-[#64748B] font-medium mt-0.5">Active workforce on project site</p>
            </div>
          </div>

          <span className="text-xs font-bold text-[#1677FF] bg-[#EAF3FF] border border-[#1677FF]/20 px-3 py-1 rounded-full shadow-2xs">
            {selectedLog.totalHeadcount} workers on site
          </span>
        </div>

        {/* 3. Photos (3) */}
        {selectedLog.photos && selectedLog.photos.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                <Camera className="w-4 h-4 text-[#1677FF]" />
                <span>Photos ({selectedLog.photos.length})</span>
              </div>
              <button
                onClick={() => setSelectedImage(selectedLog.photos![0])}
                className="text-xs font-bold text-[#1677FF] hover:underline cursor-pointer"
              >
                View Full
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {selectedLog.photos.slice(0, 3).map((photoUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(photoUrl)}
                  className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#E2E8F0] bg-slate-100 group cursor-pointer shadow-2xs hover:border-[#1677FF]/40 transition-all"
                >
                  <img
                    src={photoUrl}
                    alt={`Site Progress ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incident Alert - ONLY shown when an incident actually occurred */}
        {Boolean(
          selectedLog.safetyPassed === false ||
          (selectedLog.safetyIncidents &&
            !selectedLog.safetyIncidents.toLowerCase().includes('0 incident') &&
            !selectedLog.safetyIncidents.toLowerCase().includes('zero incident') &&
            !selectedLog.safetyIncidents.toLowerCase().includes('no incident') &&
            !selectedLog.safetyIncidents.toLowerCase().includes('daily morning safety briefing'))
        ) && (
            <div className="bg-rose-50/70 rounded-2xl border border-rose-200 p-4 shadow-card space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Safety Incident Reported</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300">
                  Incident
                </span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed font-normal bg-white/80 border border-rose-200 rounded-xl p-2.5">
                {selectedLog.safetyIncidents}
              </p>
            </div>
          )}

        {/* 5. Additional Details (Complete & Well-structured) */}
        {(selectedLog.visitors || uniqueDeliveries.length > 0 || selectedLog.equipment || selectedLog.status) && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-card space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
              <FileText className="w-4 h-4 text-[#1677FF]" />
              <span>Site Activity & Details</span>
            </div>

            <div className="divide-y divide-[#F1F5F9] text-xs">
              {/* Deliveries */}
              {uniqueDeliveries.length > 0 && (
                <div className="flex items-start gap-2.5 py-2.5 first:pt-0">
                  <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-[#0F172A] block leading-tight">Deliveries Received</span>
                    <p className="text-xs text-[#334155] font-normal leading-relaxed mt-0.5">
                      {uniqueDeliveries.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Visitor */}
              {selectedLog.visitors && (
                <div className="flex items-start gap-2.5 py-2.5 first:pt-0">
                  <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-[#0F172A] block leading-tight">Visitors & Inspectors</span>
                    <p className="text-xs text-[#334155] font-normal leading-relaxed mt-0.5">
                      {selectedLog.visitors}
                    </p>
                  </div>
                </div>
              )}

              {/* Equipment */}
              {selectedLog.equipment && (
                <div className="flex items-start gap-2.5 py-2.5 first:pt-0">
                  <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-[#0F172A] block leading-tight">Equipment on Site</span>
                    <p className="text-xs text-[#334155] font-normal leading-relaxed mt-0.5">
                      {selectedLog.equipment}
                    </p>
                  </div>
                </div>
              )}

              {/* Issue / Delay */}
              {selectedLog.status && (
                <div className="flex items-start gap-2.5 py-2.5 first:pt-0">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-amber-800 block leading-tight">Issue / Delay Recorded</span>
                    <p className="text-xs text-amber-900 font-normal leading-relaxed mt-0.5">
                      {selectedLog.status}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. Reported By Footer */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-card">
          <div className="w-9 h-9 rounded-full bg-[#1677FF] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            {authorInitials}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] block leading-none">
              Reported by
            </span>
            <p className="text-xs font-bold text-[#0F172A] leading-tight mt-0.5">
              {cleanAuthorName} <span className="text-[#64748B] font-normal">• {role}</span>
            </p>
          </div>
        </div>

        {/* Image Zoom Lightbox */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in cursor-pointer"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImage}
              alt="Site Preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
          </div>
        )}

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 3. PROJECT FEED VIEW (Screen 2 - Default)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex-1 flex flex-col gap-3 px-4 py-3 pb-28 font-sans max-w-[440px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">

      {/* 1. Search Bar & New Log Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search daily logs..."
            className="w-full h-10 bg-white border border-[#E2E8F0] focus:border-[#1677FF] rounded-xl pl-9 pr-3 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none transition-colors shadow-2xs font-medium"
          />
        </div>
        <button
          onClick={handleStartCreate}
          className="h-10 px-3.5 rounded-xl bg-[#1677FF] hover:bg-[#1677FF]/90 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Log</span>
        </button>
      </div>

      {/* 2. Month Section Header */}
      <div className="flex items-center justify-between pt-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          September 2026
        </h3>
        <span className="text-xs font-semibold text-[#94A3B8]">
          {filteredLogs.length} {filteredLogs.length === 1 ? 'Report' : 'Reports'}
        </span>
      </div>

      {/* 3. Daily Logs Feed List */}
      <div className="flex flex-col gap-2.5">
        {filteredLogs.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2 text-center bg-white border border-[#E2E8F0] rounded-3xl p-8 shadow-card">
            <FileText className="w-8 h-8 text-[#94A3B8]" />
            <p className="text-xs font-semibold text-[#0F172A]">No daily logs found</p>
            <p className="text-xs text-[#64748B] max-w-[220px]">
              Tap "New Log" to record today's site activity, crew headcount, and progress photos.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const author = cleanAuthor(log.author);
            const initials = author.split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase() || 'JS';
            const isIssue = Boolean(
              log.status?.toLowerCase().includes('issue') ||
              log.status?.toLowerCase().includes('delay') ||
              log.safetyPassed === false
            );
            const issueLabel = log.status || (log.safetyPassed === false ? '1 issue' : undefined);
            const hasPhotos = log.photos && log.photos.length > 0;
            const dateStr = log.date.includes('Sep') ? `Tue, ${log.date}` : log.date;

            return (
              <div
                key={log.id}
                onClick={() => {
                  setSelectedLog(log);
                  setViewMode('details');
                }}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 shadow-card hover:border-[#1677FF]/40 hover:shadow-md transition-all cursor-pointer group flex flex-col gap-2.5"
              >
                {/* Header Row: Author Avatar + Name & Normal Date/Time + Optional Issue Tag + Chevron */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#EAF3FF] text-[#1677FF] font-bold text-xs flex items-center justify-center shrink-0 border border-[#1677FF]/20 shadow-2xs">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#0F172A] truncate group-hover:text-[#1677FF] transition-colors leading-tight">
                        {author}
                      </h4>
                      <p className="text-xs text-[#64748B] font-normal leading-tight mt-0.5 truncate">
                        {dateStr} · {log.time || '5:42 PM'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* ONLY show if there is an actual issue */}
                    {isIssue && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{issueLabel}</span>
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1677FF] transition-colors" />
                  </div>
                </div>

                {/* Row 2: Work Summary Narrative */}
                <p className="text-xs text-[#334155] leading-relaxed line-clamp-2 font-normal">
                  {log.workSummary}
                </p>

                {/* Row 3: Compact 3-Photo Thumbnails (No '3 photos' text pill) */}
                {hasPhotos && (
                  <div className="grid grid-cols-3 gap-2 pt-0.5">
                    {log.photos!.slice(0, 3).map((photoUrl, pIdx) => (
                      <div
                        key={pIdx}
                        className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-[#E2E8F0] shadow-2xs group-hover:border-[#1677FF]/30 transition-all"
                      >
                        <img
                          src={photoUrl}
                          alt={`Site Preview ${pIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                        {pIdx === 2 && log.photos!.length > 3 && (
                          <div className="absolute inset-0 bg-black/45 backdrop-blur-2xs flex items-center justify-center text-white text-xs font-bold">
                            +{log.photos!.length - 3}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button for New Log */}
      <button
        onClick={handleStartCreate}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#1677FF] hover:bg-[#1677FF]/90 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all cursor-pointer active:scale-95"
        title="New Daily Log"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

    </div>
  );
};
