import React, { useState } from 'react';
import { 
  Plus, Sparkles, FileText, MapPin, DollarSign, TrendingUp, ChevronRight
} from 'lucide-react';
import { CreateBuildScopeModal } from '../modals/CreateBuildScopeModal';
import { BuildScopeDetailView } from './BuildScopeDetailView';

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
  const [selectedAnalysis, setSelectedAnalysis] = useState<BuildScopeAnalysisCard | null>(null);

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
    setSelectedAnalysis(newCard);
  };

  // ─── DETAIL VIEW ───
  if (selectedAnalysis) {
    return (
      <BuildScopeDetailView
        analysis={selectedAnalysis}
        onBack={() => setSelectedAnalysis(null)}
      />
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* ─── 1. TOP HEADER BANNER (Matching Reference Screenshot) ─── */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#0B1736] via-[#091126] to-[#070D1C] border border-[#172540] shadow-xl relative overflow-hidden flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 z-10">
          <h1 className="text-base font-extrabold text-white tracking-tight leading-tight">
            AI-Powered Takeoff &<br />Scope Intelligence
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Smarter analysis. Better estimates.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-1.5 flex-shrink-0 cursor-pointer active:scale-95 z-10"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* ─── 2. TOP 3 KPI SUMMARY METRICS (Exact Screenshot Alignment) ─── */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-[#091122]/90 border border-[#172540] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">TAKEOFFS</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-black text-white">{analyses.length}</span>
              <span className="text-[10px] text-slate-500 font-medium">active</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#091122]/90 border border-[#172540] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">SCOPES</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-black text-emerald-400">38</span>
              <span className="text-[10px] text-slate-500 font-medium">trades</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#091122]/90 border border-[#172540] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">ACCURACY</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-black text-purple-400">82%</span>
              <span className="text-[10px] text-slate-500 font-medium">conf</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ─── 3. LATTI TRADE TEAM RECOMMENDATION BANNER ─── */}
      <div className="p-3.5 rounded-2xl bg-[#091122]/90 border border-[#172540] hover:border-amber-500/40 shadow-sm flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white truncate">Build Trade Team with Latti</h3>
              <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">
                SOON
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
              Auto-identify trade scopes and match qualified subs.
            </p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
      </div>

      {/* ─── 4. RECENT PROJECTS SECTION HEADER ─── */}
      <div className="flex items-center justify-between px-0.5 pt-1">
        <h2 className="text-sm font-bold text-white tracking-tight">Recent Projects</h2>
        <button className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer">
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ─── 5. ANALYSIS TAKEOFF CARDS LIST ─── */}
      <div className="flex flex-col gap-3">
        {analyses.map((card) => {
          const isReady = card.status === 'Report Ready';

          return (
            <div
              key={card.id}
              onClick={() => setSelectedAnalysis(card)}
              className="p-3 rounded-2xl bg-[#0A1328] border border-[#1A2744] hover:border-blue-500/40 cursor-pointer transition-all duration-200 active:scale-[0.99] shadow-md hover:shadow-lg hover:shadow-blue-900/15 group"
            >
              {/* Card Content Area */}
              <div className="flex flex-col gap-1.5">
                {/* Row 1: Title + Status Pill */}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs font-bold text-white tracking-tight truncate group-hover:text-blue-400 transition-colors leading-tight">
                    {card.projectName}
                  </h3>

                  <span className={`text-[10px] font-bold px-2 py-[2px] rounded-full flex-shrink-0 flex items-center gap-1 ${
                    isReady
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span>{card.status}</span>
                  </span>
                </div>

                {/* Row 2: Address Subtext */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{card.address}</span>
                </div>

                {/* Row 3: Plan Set & Sheets inner box */}
                <div className="flex items-center justify-between text-[10px] text-slate-300 bg-[#070E1F] px-2.5 py-[5px] rounded-lg border border-[#162035]">
                  <span className="truncate font-medium">{card.planSet}</span>
                  <span className="text-slate-500 font-semibold flex-shrink-0 ml-2">
                    {card.sheetsCount} Sheets · {card.tradesCount} Trades
                  </span>
                </div>

                {/* Row 4: Progress Bar with Label */}
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-slate-500 font-medium flex-shrink-0">Takeoff</span>
                  <div className="flex-1 bg-[#070E1F] h-[5px] rounded-full overflow-hidden border border-[#162035]">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${card.takeoffApproved}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 flex-shrink-0 tabular-nums">{card.takeoffApproved}%</span>
                </div>
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
