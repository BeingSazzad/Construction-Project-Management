import React, { useState } from 'react';
import { 
  LayoutGrid, Plus, Lock, MoreVertical, ArrowRight, 
  Sparkles, CheckCircle2, FileText, Layers, MapPin, Activity, ShieldCheck
} from 'lucide-react';
import { CreateBuildScopeModal } from '../modals/CreateBuildScopeModal';

export interface BuildScopeAnalysisCard {
  id: string;
  projectName: string;
  address: string;
  planSet: string;
  uploadedDate: string;
  sheetsCount: number;
  tradesCount: number;
  materialStatus: 'Priced' | 'Pending' | '--';
  laborStatus: 'Priced' | 'Pending' | '--';
  updatedDate: string;
  confidence: number;
  takeoffApproved: number;
  status: 'Report Ready' | 'Plans Uploaded' | 'In Analysis';
}

export const BuildScopeView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [analyses, setAnalyses] = useState<BuildScopeAnalysisCard[]>([
    {
      id: 'bs-2',
      projectName: 'Sample Project',
      address: '1235 Cordova Blvd NE · New Construction',
      planSet: 'Sample Architectural Set',
      uploadedDate: '13/07/2026',
      sheetsCount: 6,
      tradesCount: 18,
      materialStatus: 'Priced',
      laborStatus: 'Priced',
      updatedDate: 'Aug 27',
      confidence: 85,
      takeoffApproved: 65,
      status: 'Report Ready'
    },
    {
      id: 'bs-4',
      projectName: 'Cordova Commercial Phase 2',
      address: '1235 Cordova Blvd NE · Commercial',
      planSet: 'Sample 2 Structural Plan',
      uploadedDate: '14/07/2026',
      sheetsCount: 8,
      tradesCount: 12,
      materialStatus: 'Priced',
      laborStatus: 'Priced',
      updatedDate: 'Aug 26',
      confidence: 78,
      takeoffApproved: 40,
      status: 'Report Ready'
    },
    {
      id: 'bs-3',
      projectName: 'Cordova Custom Home',
      address: '1235 Cordova Blvd NE · Custom Build',
      planSet: 'Cordova Master Set',
      uploadedDate: '10/07/2026',
      sheetsCount: 4,
      tradesCount: 8,
      materialStatus: 'Pending',
      laborStatus: 'Pending',
      updatedDate: 'Aug 24',
      confidence: 45,
      takeoffApproved: 10,
      status: 'Plans Uploaded'
    }
  ]);

  const handleCreateAnalysis = (data: { projectName: string; propertyAddress: string }) => {
    const newCard: BuildScopeAnalysisCard = {
      id: `bs-${Date.now()}`,
      projectName: data.projectName,
      address: `${data.propertyAddress} · New Construction`,
      planSet: `${data.projectName} Plan Set`,
      uploadedDate: new Date().toLocaleDateString('en-GB'),
      sheetsCount: 5,
      tradesCount: 14,
      materialStatus: 'Priced',
      laborStatus: 'Priced',
      updatedDate: 'Today',
      confidence: 90,
      takeoffApproved: 20,
      status: 'Report Ready'
    };

    setAnalyses(prev => [newCard, ...prev]);
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. TOP HEADER & ACTION ─── */}
      <div className="flex items-center justify-between border-b border-[#172540] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#131C2E] border border-[#1E293B] flex items-center justify-center text-[#60A5FA] flex-shrink-0 shadow-sm">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">BuildScope AI</h1>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase">
                BETA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Powered by Latti Takeoff Radar</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-md rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md shadow-blue-500/20 active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* ─── 2. TOP 3 KPI SUMMARY METRICS ─── */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-[#091122]/90 border border-[#172540] flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Takeoffs</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-black text-white">{analyses.length}</span>
            <span className="text-[10px] text-slate-500 font-medium">active</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#091122]/90 border border-[#172540] flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Priced Scopes</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-black text-emerald-400">38</span>
            <span className="text-[10px] text-slate-500 font-medium">trades</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#091122]/90 border border-[#172540] flex flex-col justify-between shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Confidence</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-lg font-black text-blue-400">82%</span>
            <span className="text-[10px] text-slate-500 font-medium">accuracy</span>
          </div>
        </div>
      </div>

      {/* ─── 3. LATTI TRADE TEAM RECOMMENDATION BANNER ─── */}
      <div className="p-4 rounded-3xl bg-[#091122]/90 border border-[#172540] shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#131C2E] border border-[#1E293B] flex items-center justify-center text-amber-400 flex-shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white truncate">Build Trade Team with Latti</h3>
              <span className="text-[9px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">
                SOON
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
              Auto-identify trade scopes and match qualified subcontractors.
            </p>
          </div>
        </div>

        <Lock className="w-4 h-4 text-slate-500 flex-shrink-0" />
      </div>

      {/* ─── 4. ANALYSIS TAKEOFF CARDS LIST ─── */}
      <div className="flex flex-col gap-3">
        {analyses.map((card) => {
          const isReady = card.status === 'Report Ready';

          return (
            <div
              key={card.id}
              className="p-4 rounded-3xl bg-[#091122]/90 border border-[#172540] hover:border-blue-500/40 transition-all shadow-md flex flex-col gap-3.5 group"
            >
              {/* Card Header: Icon + Title + Location */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#131C2E] border border-[#1E293B] flex items-center justify-center text-[#60A5FA] flex-shrink-0 mt-0.5">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white tracking-tight truncate group-hover:text-blue-400 transition-colors">
                      {card.projectName}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-blue-400 flex-shrink-0" />
                      <span className="truncate">{card.address}</span>
                    </div>
                  </div>
                </div>

                <button className="w-7 h-7 rounded-full bg-[#131C2E] border border-[#1E293B] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer flex-shrink-0">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Specs Matrix */}
              <div className="grid grid-cols-2 gap-2 bg-[#060B17] p-3 rounded-2xl border border-[#142036] text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Plan Set</span>
                  <span className="font-semibold text-slate-200 truncate block mt-0.5">{card.planSet}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Uploaded</span>
                  <span className="font-semibold text-slate-200 truncate block mt-0.5">{card.uploadedDate}</span>
                </div>

                <div className="pt-2 border-t border-[#142036]">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Sheets / Trades</span>
                  <span className="font-bold text-white block mt-0.5">{card.sheetsCount} Sheets · {card.tradesCount} Trades</span>
                </div>
                <div className="pt-2 border-t border-[#142036]">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Pricing</span>
                  <span className={`font-bold block mt-0.5 ${card.materialStatus === 'Priced' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    Material & Labor {card.materialStatus}
                  </span>
                </div>
              </div>

              {/* Takeoff Approved Progress */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-slate-400">Takeoff Approved</span>
                  <span className="text-white font-bold">{card.takeoffApproved}%</span>
                </div>
                <div className="w-full bg-[#060B17] h-2 rounded-full overflow-hidden border border-[#142036]">
                  <div 
                    className="bg-[#2563EB] h-full rounded-full transition-all" 
                    style={{ width: `${card.takeoffApproved}%` }}
                  />
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-[#142036]">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${
                  isReady ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  <span>{card.status}</span>
                </span>

                <button 
                  onClick={() => alert(`Opening BuildScope Takeoff for ${card.projectName}...`)}
                  className="px-4 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <span>Open Takeoff</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Dialog */}
      <CreateBuildScopeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateAnalysis}
      />

    </div>
  );
};
