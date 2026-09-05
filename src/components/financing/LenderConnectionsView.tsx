import React, { useState } from 'react';
import {
  ShieldCheck, Plus, X, Send, Archive, ChevronDown,
  AlertTriangle, CheckCircle2, FileText, Building2
} from 'lucide-react';
import { Project } from '../../types';

interface LenderConnection {
  id: string;
  lenderName: string;
  lenderCompany: string;
  projectName: string;
  readiness: number;
  riskLabel: string;
  riskColor: string;
  verifiedScore: number;
  sharedDate: string;
  status: 'Shared' | 'Viewed' | 'In Review' | 'Archived';
  notes?: string;
}

const MOCK_CONNECTIONS: LenderConnection[] = [
  {
    id: 'lc1',
    lenderName: 'Jordan Smith',
    lenderCompany: 'First National Lending',
    projectName: 'Riverside Mixed-Use Development',
    readiness: 72,
    riskLabel: 'Moderate Risk',
    riskColor: 'text-amber-400',
    verifiedScore: 68,
    sharedDate: 'Aug 28, 2026',
    status: 'Viewed',
    notes: 'Construction loan, 18-month term',
  },
  {
    id: 'lc2',
    lenderName: 'Maria Delgado',
    lenderCompany: 'Apex Capital Group',
    projectName: 'Summit Office Complex',
    readiness: 89,
    riskLabel: 'Low Risk',
    riskColor: 'text-emerald-400',
    verifiedScore: 84,
    sharedDate: 'Aug 25, 2026',
    status: 'In Review',
  },
];

interface LenderConnectionsViewProps {
  projects: Project[];
  onShowToast?: (msg: string) => void;
}

export const LenderConnectionsView: React.FC<LenderConnectionsViewProps> = ({
  projects,
  onShowToast,
}) => {
  const [connections, setConnections] = useState<LenderConnection[]>(MOCK_CONNECTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form state
  const [selectedProject, setSelectedProject] = useState('');
  const [lenderName, setLenderName] = useState('');
  const [lenderCompany, setLenderCompany] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');

  const activeConnections = connections.filter(c => c.status !== 'Archived').length;
  const packetsViewed = connections.filter(c => c.status === 'Viewed' || c.status === 'In Review').length;
  const avgReadiness = connections.length
    ? Math.round(connections.reduce((a, c) => a + c.readiness, 0) / connections.length)
    : 0;

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lenderName.trim() || !selectedProject) return;
    const proj = projects.find(p => p.id === selectedProject);
    const calculatedReadiness = proj ? Math.min(Math.max(proj.progress + 30, 60), 96) : 85;
    const calculatedScore = proj ? Math.min(Math.max(proj.progress + 25, 65), 94) : 82;
    const isLowRisk = calculatedReadiness >= 80;

    const newConn: LenderConnection = {
      id: `lc${Date.now()}`,
      lenderName: lenderName.trim(),
      lenderCompany: lenderCompany.trim() || 'Commercial Lending Partners',
      projectName: proj?.name || 'Project',
      readiness: calculatedReadiness,
      riskLabel: isLowRisk ? 'Low Risk' : 'Moderate Risk',
      riskColor: isLowRisk ? 'text-emerald-400' : 'text-amber-400',
      verifiedScore: calculatedScore,
      sharedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Shared',
      notes: notes.trim() || undefined,
    };
    setConnections(prev => [newConn, ...prev]);
    onShowToast?.(`Financing packet sent to ${lenderName}.`);
    setIsModalOpen(false);
    setLenderName('');
    setLenderCompany('');
    setContactEmail('');
    setNotes('');
    setSelectedProject('');
  };

  const handleArchive = (id: string) => {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'Archived' } : c));
    onShowToast?.('Connection archived.');
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'Viewed': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'In Review': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Shared': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Archived': return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const visible = connections.filter(c => c.status !== 'Archived');

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-4 pb-28 font-sans max-w-[430px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-blue-400" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-base font-black text-white tracking-tight">Lender Connections</h1>
            <p className="text-[10px] text-slate-400 font-medium">Share Lattice Verified financing packets with lenders</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 h-8 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm shadow-blue-500/20 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Share with lender
        </button>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Active connections', value: activeConnections.toString() },
          { label: 'Packets viewed', value: packetsViewed.toString() },
          { label: 'Avg readiness', value: `${avgReadiness}%` },
        ].map((kpi, i) => (
          <div key={i} className="p-3 rounded-2xl bg-[#060B17] border border-[#142036] text-center">
            <p className="text-lg font-black text-white">{kpi.value}</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Connection List */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 p-10 rounded-2xl bg-[#060B17] border border-[#142036]">
          <div className="w-12 h-12 rounded-2xl bg-[#0A1328] border border-[#1A2744] flex items-center justify-center">
            <FileText className="w-5 h-5 text-slate-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white">No lender connections yet</p>
            <p className="text-xs text-slate-400 mt-0.5">Share a financing packet with a lender to start building your lending relationships.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map(conn => {
            const isExpanded = expandedId === conn.id;
            return (
              <div key={conn.id} className="rounded-2xl bg-[#060B17] border border-[#142036] overflow-hidden">
                {/* Main row */}
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    {/* Left */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-white leading-tight">{conn.lenderName}</p>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${statusColor(conn.status)}`}>
                          {conn.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{conn.lenderCompany}</p>
                      <p className="text-xs font-bold text-slate-300 mt-0.5">{conn.projectName}</p>
                    </div>
                    {/* Right readiness */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-[22px] font-black text-white leading-none">{conn.readiness}%</p>
                      <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Ready</p>
                    </div>
                  </div>

                  {/* Sub row */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <AlertTriangle className="w-3 h-3 text-current flex-shrink-0" />
                      <span className={`font-semibold ${conn.riskColor}`}>{conn.riskLabel}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 font-medium">Verified {conn.verifiedScore}/100</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{conn.sharedDate}</span>
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : conn.id)}
                    className="flex items-center gap-1 mt-2 text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    {isExpanded ? 'Hide' : 'View'} packet summary
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="mt-3 p-3 rounded-xl bg-[#0A1328] border border-[#1A2744] text-xs text-slate-300 space-y-1">
                      <p><span className="text-slate-500 font-medium">Project:</span> {conn.projectName}</p>
                      <p><span className="text-slate-500 font-medium">Readiness:</span> {conn.readiness}%</p>
                      <p><span className="text-slate-500 font-medium">Lattice Score:</span> {conn.verifiedScore}/100</p>
                      {conn.notes && <p><span className="text-slate-500 font-medium">Notes:</span> {conn.notes}</p>}
                    </div>
                  )}
                </div>

                {/* Archive footer */}
                <div className="border-t border-[#142036] px-3.5 py-2 flex justify-end">
                  <button
                    onClick={() => handleArchive(conn.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" /> Archive
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── SHARE MODAL ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-[390px] bg-[#070D1A] border border-[#142036] rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Share with lender</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Generate a Lattice Verified financing packet for a project and record this lender connection.</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleShare} className="flex flex-col gap-3">
              {/* Project select */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Project</label>
                <div className="relative">
                  <select
                    value={selectedProject}
                    onChange={e => setSelectedProject(e.target.value)}
                    required
                    className="w-full h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 pr-8 text-xs text-white outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select a project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Lender name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Lender name *</label>
                <input
                  type="text"
                  required
                  value={lenderName}
                  onChange={e => setLenderName(e.target.value)}
                  placeholder="Jordan Smith"
                  className="h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Lender company */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Lender company</label>
                <input
                  type="text"
                  value={lenderCompany}
                  onChange={e => setLenderCompany(e.target.value)}
                  placeholder="First National Lending"
                  className="h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Contact email */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Contact email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="jordan@bank.com"
                  className="h-10 bg-[#050811] border border-[#142036] rounded-xl px-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Loan type, terms, or context for this lender..."
                  rows={3}
                  className="bg-[#050811] border border-[#142036] rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 rounded-xl bg-[#0E1A33] border border-[#1E325A] hover:bg-[#1E325A] text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-blue-500/20"
                >
                  <Send className="w-3.5 h-3.5" /> Share packet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
