import React from 'react';
import { Project, TradeCategory } from '../../types';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { Sparkles, ChevronRight, TrendingUp, DollarSign, PieChart, BarChart2 } from 'lucide-react';

interface FinanceDashboardProps {
  projects: Project[];
  categories: TradeCategory[];
  onSelectProject: (project: Project) => void;
  onOpenBudgetDetails: () => void;
  onOpenReports: () => void;
  onOpenLatti: () => void;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  projects,
  onSelectProject,
  onOpenReports,
  onOpenLatti
}) => {
  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-24 font-sans text-slate-200">
      {/* 1. GREETING HEADER (Matching Screen 3) */}
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
          <span>Good morning, Michael!</span>
          <span className="text-xl">👋</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Financial overview.
        </p>
      </div>

      {/* 2. 2x2 FINANCIAL KPI GRID (Matching Screen 3) */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="card-dark p-3.5 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm">
          <div className="text-[11px] text-slate-400 font-medium">Budget</div>
          <div className="text-xl font-black text-white mt-1">$46.80M</div>
        </div>

        <div className="card-dark p-3.5 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm">
          <div className="text-[11px] text-slate-400 font-medium">Actual</div>
          <div className="text-xl font-black text-blue-400 mt-1">$18.69M</div>
        </div>

        <div className="card-dark p-3.5 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm">
          <div className="text-[11px] text-slate-400 font-medium">Committed</div>
          <div className="text-xl font-black text-white mt-1">$12.45M</div>
        </div>

        <div className="card-dark p-3.5 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm">
          <div className="text-[11px] text-slate-400 font-medium">Paid</div>
          <div className="text-xl font-black text-white mt-1">$8.32M</div>
        </div>
      </div>

      {/* 3. BUDGET VS ACTUAL TREND CURVES (Matching Screen 3) */}
      <div className="card-dark p-4 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white tracking-tight">
            Budget vs Actual
          </h2>
          <span className="text-[11px] text-slate-400">YTD Growth</span>
        </div>

        {/* SVG Curved Trend Chart */}
        <div className="relative h-28 w-full flex items-center justify-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
            {/* Grid lines */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="#182438" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2="300" y2="60" stroke="#182438" strokeDasharray="3 3" />
            
            {/* Budget Curve (Blue) */}
            <path
              d="M 10,80 Q 80,65 150,45 T 290,15"
              fill="none"
              stroke="#0066FF"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Actual Curve (Cyan/Green) */}
            <path
              d="M 10,90 Q 80,80 150,65 T 290,45"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* End value pills matching reference */}
          <div className="absolute top-0 right-0 bg-[#0066FF] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
            $46.80M
          </div>
          <div className="absolute top-10 right-0 bg-[#00F0FF] text-[#070A12] text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
            $18.69M
          </div>
        </div>
      </div>

      {/* 4. BUDGET HEALTH DONUT CARD (Matching Screen 4) */}
      <div className="card-dark p-4 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm flex flex-col gap-3">
        <h2 className="text-sm font-extrabold text-white tracking-tight">
          Budget Health
        </h2>

        <div className="flex items-center justify-between gap-4">
          {/* Donut with center text: 24 Projects */}
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#182438]"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Green section (On Budget - 60%) */}
              <path
                className="text-emerald-400"
                strokeDasharray="60, 100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Amber section (Needs Attention - 25%) */}
              <path
                className="text-amber-400"
                strokeDasharray="25, 100"
                strokeDashoffset="-60"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Red section (Over Budget - 15%) */}
              <path
                className="text-rose-400"
                strokeDasharray="15, 100"
                strokeDashoffset="-85"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-base font-black text-white leading-none">24</div>
              <div className="text-[8px] text-slate-400 font-medium">Projects</div>
            </div>
          </div>

          {/* Right Legend */}
          <div className="flex-1 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                On Budget
              </span>
              <span className="font-bold text-white">14</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Needs attention
              </span>
              <span className="font-bold text-white">6</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                Over Budget
              </span>
              <span className="font-bold text-white">4</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TOP PROJECTS BY COST VARIANCE (Matching Screen 4) */}
      <div>
        <h2 className="text-sm font-extrabold text-white tracking-tight mb-2">
          Top Projects by Cost Variance
        </h2>

        <div className="space-y-2">
          <div className="card-dark p-3 rounded-2xl bg-[#0C121F] border-[#182438] flex items-center justify-between text-xs">
            <span className="font-bold text-white">Downtown Tower</span>
            <span className="font-black text-rose-400">-$9.51M</span>
          </div>

          <div className="card-dark p-3 rounded-2xl bg-[#0C121F] border-[#182438] flex items-center justify-between text-xs">
            <span className="font-bold text-white">Harborview Hotel</span>
            <span className="font-black text-rose-400">-$4.20M</span>
          </div>

          <div className="card-dark p-3 rounded-2xl bg-[#0C121F] border-[#182438] flex items-center justify-between text-xs">
            <span className="font-bold text-white">Riverside Office</span>
            <span className="font-black text-emerald-400">+$210K</span>
          </div>
        </div>
      </div>

      {/* 6. COST BREAKDOWN & DONUT (Matching Screen 5) */}
      <div className="card-dark p-4 bg-[#0C121F] border-[#182438] rounded-2xl shadow-sm flex flex-col gap-3">
        <h2 className="text-sm font-extrabold text-white tracking-tight">
          Cost Breakdown
        </h2>

        <div className="flex items-center justify-between gap-4">
          {/* Donut with center text: $18.69M Actual Cost */}
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#182438]"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-500"
                strokeDasharray="40, 100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400"
                strokeDasharray="33, 100"
                strokeDashoffset="-40"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-400"
                strokeDasharray="18, 100"
                strokeDashoffset="-73"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-[11px] font-black text-white leading-tight">$18.69M</div>
              <div className="text-[8px] text-slate-400 font-medium">Actual Cost</div>
            </div>
          </div>

          {/* Breakdown percentage legend */}
          <div className="flex-1 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Labor
              </span>
              <span className="font-bold text-white">40%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Materials
              </span>
              <span className="font-bold text-white">33%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Subcontractor
              </span>
              <span className="font-bold text-white">18%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Equipment
              </span>
              <span className="font-bold text-white">8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span> Other
              </span>
              <span className="font-bold text-white">1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. LATTI AI FINANCIAL INSIGHT CARD (Matching Screen 5) */}
      <div className="card-dark p-4 bg-[#0A101D] border border-blue-500/40 rounded-2xl shadow-[0_0_20px_rgba(0,102,255,0.12)] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-extrabold text-blue-400">Latti AI Insight</span>
        </div>

        <p className="text-xs text-slate-200 font-medium">
          Harborview Hotel is over budget by <strong>5.4%</strong> due to MEP freight surcharges.
        </p>

        <button
          onClick={onOpenLatti}
          className="w-full h-9 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
        >
          Ask Latti
        </button>
      </div>
    </div>
  );
};
