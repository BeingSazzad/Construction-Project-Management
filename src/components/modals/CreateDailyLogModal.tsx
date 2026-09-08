import React, { useState, useRef, useEffect } from 'react';
import { Project, DailyLogItem, User } from '../../types';
import {
  ArrowLeft, Sun, Cloud, CloudRain, Wind, Flame, Snowflake, Calendar, Plus, Minus, X, ChevronDown,
  Truck, Users, ChevronRight, Wrench, Check, AlertTriangle
} from 'lucide-react';

interface CreateDailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  preselectedProjectId?: string;
  currentUser?: User;
  onSaveLog: (newLog: DailyLogItem) => void;
}

export const CreateDailyLogModal: React.FC<CreateDailyLogModalProps> = ({
  isOpen,
  onClose,
  projects,
  preselectedProjectId,
  currentUser,
  onSaveLog
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    preselectedProjectId || projects[0]?.id || 'proj-1'
  );

  useEffect(() => {
    if (preselectedProjectId) {
      setSelectedProjectId(preselectedProjectId);
    }
  }, [preselectedProjectId]);

  const [logDateInput, setLogDateInput] = useState<string>('2026-09-05');
  const [weatherTemp, setWeatherTemp] = useState<string>('82°F');
  const [weatherCond, setWeatherCond] = useState<string>('Sunny');
  const [isWeatherDropdownOpen, setIsWeatherDropdownOpen] = useState<boolean>(false);
  const weatherDropdownRef = useRef<HTMLDivElement>(null);
  const [crewCount, setCrewCount] = useState<number>(19);
  const [notes, setNotes] = useState<string>('');

  // Expandable details state
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);
  const [deliveryNote, setDeliveryNote] = useState<string>('3 deliveries received (Lumber framing package, EMT conduit)');
  const [visitorNote, setVisitorNote] = useState<string>('City of Tampa Building Inspector (Structural framing walkthrough · 9:00 AM)');
  const [equipmentNote, setEquipmentNote] = useState<string>('50-ton Mobile Crane, Genie GTH-844 Telehandler');
  const [issueNote, setIssueNote] = useState<string>('');

  // Photos state
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

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

  const handleAddSamplePhoto = () => {
    if (photos.length >= 10) return;
    const samplePhotos = [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'
    ];
    setPhotos([...photos, samplePhotos[photos.length % samplePhotos.length]]);
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    setIsSubmitting(true);

    const authorName = currentUser?.name || 'John Smith';
    const rawDeliveries = deliveryNote ? [deliveryNote] : [];
    const statusValue = issueNote ? (issueNote.includes('Issue') || issueNote.includes('Delay') ? issueNote : `1 Issue: ${issueNote}`) : undefined;
    const readableDate = formatDateDisplay(logDateInput);
    const shortDateMatch = readableDate.match(/([a-zA-Z]+)\s*(\d+)/);
    const shortDate = shortDateMatch ? `${shortDateMatch[1]} ${shortDateMatch[2]}` : 'Sep 5';

    const newDailyLog: DailyLogItem = {
      id: `log-${Date.now()}`,
      projectId: selectedProjectId,
      projectName: currentProject?.name || 'Snell Isle Residence',
      address: currentProject?.location ? `${currentProject.location} · ${currentProject.cityState || ''}` : '1840 Brightwaters Blvd NE · St. Petersburg, FL',
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

    setTimeout(() => {
      onSaveLog(newDailyLog);
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans animate-fade-in overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] mx-auto min-h-screen sm:min-h-0 sm:max-h-[92vh] bg-white sm:border sm:border-[#E2E8F0] rounded-t-[28px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#0F172A] relative animate-slide-up"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F1F5F9] bg-white sticky top-0 z-20">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
            New Daily Log
          </h2>

          <div className="w-8" />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 pb-12 scrollbar-none">

          {/* Unified Top Header Card with Interactive Date & Weather Chips */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={currentProject?.thumbnail || currentProject?.coverImage || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&auto=format&fit=crop&q=80"}
                alt={currentProject?.name}
                className="w-11 h-11 rounded-xl object-cover border border-[#E2E8F0] shadow-2xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                {projects && projects.length > 1 ? (
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full text-sm font-bold text-[#0F172A] bg-transparent border-b border-dashed border-[#CBD5E1] focus:border-[#1677FF] outline-none py-0.5 cursor-pointer"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <h3 className="text-sm font-bold text-[#0F172A] truncate leading-tight">
                    {currentProject?.name || 'Snell Isle Residence'}
                  </h3>
                )}
                <p className="text-xs text-[#64748B] font-normal truncate mt-0.5">
                  {currentProject?.location ? `${currentProject.location} · ${currentProject.cityState || ''}` : '1840 Brightwaters Blvd NE · St. Petersburg, FL'}
                </p>
              </div>
            </div>

            {/* Clean Inline Date & Weather Action Row (Seamless, No inner boxes) */}
            <div className="flex items-center justify-between pt-2.5 border-t border-[#F1F5F9] text-xs">
              {/* 1. Date Picker */}
              <div className="relative flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
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

              {/* 2. Seamless Inline Weather: Clean Clickable Temp & Condition without box borders */}
              <div className="flex items-center gap-1.5 py-1 px-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors">
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
                              className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${isSelected ? 'bg-[#EAF3FF] text-[#1677FF] font-bold' : 'text-[#0F172A] hover:bg-[#F8FAFC]'
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

          {/* Add more details (optional) */}
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
              disabled={isSubmitting}
              className="w-full h-12 rounded-2xl bg-[#1677FF] hover:bg-[#1677FF]/90 text-white text-sm font-bold transition-all shadow-md flex items-center justify-center cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isSubmitting ? 'Saving...' : 'Save Daily Log'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
