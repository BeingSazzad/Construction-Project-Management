import React, { useState } from 'react';
import { UserRole, Project, Task, PunchItem, LattiMessage } from '../../types';
import { 
  Sparkles, Send, Bot, User as UserIcon, ArrowRight, 
  CheckCircle2, AlertTriangle, ChevronRight, ShieldAlert, 
  HelpCircle, Lightbulb, Clock, Check, ArrowUpRight 
} from 'lucide-react';

interface LattiAssistantProps {
  currentRole: UserRole;
  activeProject?: Project | null;
  tasks: Task[];
  punchItems: PunchItem[];
  onNavigate?: (tabId: string) => void;
}

export const LattiAssistant: React.FC<LattiAssistantProps> = ({
  currentRole,
  activeProject,
  tasks,
  punchItems,
  onNavigate
}) => {
  const [viewMode, setViewMode] = useState<'chat' | 'insights'>('chat');
  const [messages, setMessages] = useState<LattiMessage[]>([
    {
      id: 'm-1',
      sender: 'latti',
      text: "Here's an insight for you: 2 tasks in Riverside Office Complex are at risk of missing this week's milestone.",
      timestamp: 'Just now',
      insightData: {
        type: 'risk',
        title: 'Schedule Risk Alert',
        items: [
          'Concrete Pour - L12 (Needs batching approval)',
          'Rebar Installation (Clearance inspection pending)'
        ],
        recommendations: [
          'Add 2 more workers from Concrete Solutions Inc.',
          'Extend working hours on site by 1.5 hours'
        ],
        actionLabel: 'View Project',
        targetModule: 'overview'
      }
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');

  const quickChips = [
    'Project risk summary',
    'Budget summary',
    'Upcoming milestones',
    'Task updates'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: LattiMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    setTimeout(() => {
      let botResponse: LattiMessage;

      if (query.toLowerCase().includes('risk') || query.toLowerCase().includes('summary')) {
        botResponse = {
          id: `lat-${Date.now()}`,
          sender: 'latti',
          text: `2 tasks are behind schedule and may impact the Structural Framing milestone on Jun 10, 2025.`,
          timestamp: 'Just now',
          insightData: {
            type: 'risk',
            title: 'Schedule Risk Mitigation',
            items: [
              'Concrete Pour - L12 Deck',
              'Rebar Installation Level 12'
            ],
            recommendations: [
              'Add 2 more workers from Concrete Solutions Inc.',
              'Extend working hours on site by 1.5 hours'
            ],
            actionLabel: 'Authorize Crew Overtime',
            targetModule: 'schedule'
          }
        };
      } else if (query.toLowerCase().includes('budget')) {
        botResponse = {
          id: `lat-${Date.now()}`,
          sender: 'latti',
          text: `Total project budget is tracking $230,000 under budget (favorable 4.9% variance). Division 03 generated $50K savings through bulk procurement.`,
          timestamp: 'Just now',
          insightData: {
            type: 'budget',
            title: 'Division 03 Concrete Cost Analysis',
            items: [
              'Formwork Carpentry: $15K favorable variance',
              'Ready Mix 5000 PSI: $50K under budget commitment'
            ],
            recommendations: [
              'Reallocate $20K concrete savings to offset HVAC chiller expedite fees.'
            ],
            actionLabel: 'Reallocate Contingency Budget',
            targetModule: 'budget'
          }
        };
      } else {
        botResponse = {
          id: `lat-${Date.now()}`,
          sender: 'latti',
          text: `All trade submittals, safety logs, and field checks for "${query}" are fully updated and synchronized across teams.`,
          timestamp: 'Just now',
          insightData: {
            type: 'schedule',
            title: 'Telemetry Synced',
            items: [
              '68 field crew on site',
              'Zero safety non-conformances',
              'Pre-pour inspection queued for 10:00 AM'
            ],
            actionLabel: 'Open Project Overview',
            targetModule: 'overview'
          }
        };
      }

      setMessages(prev => [...prev, botResponse]);
    }, 600);
  };

  return (
    <div className="w-full flex flex-col gap-3.5 px-5 py-3 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in relative">
      
      {/* 1. Sleek Top Header & Mode Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight">
              Latti AI Assistant
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Construction Intelligence Radar
            </p>
          </div>
        </div>

        <div className="flex items-center p-1 bg-[#070D1A] rounded-2xl border border-[#142036] flex-shrink-0">
          <button
            onClick={() => setViewMode('chat')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'chat' ? 'bg-[#2563EB] text-white shadow-sm font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setViewMode('insights')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'insights' ? 'bg-[#2563EB] text-white shadow-sm font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Card
          </button>
        </div>
      </div>

      {/* 2. Quick Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3 py-1.5 rounded-full bg-[#0D1424] hover:bg-[#141F33] border border-[#1A263E] hover:border-blue-500/40 text-xs font-medium text-slate-300 hover:text-white whitespace-nowrap transition-all shadow-sm cursor-pointer flex-shrink-0 active:scale-95"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 3. Main Conversational Body (Clutter-Free, Zero Box Inception) */}
      {viewMode === 'chat' ? (
        <div className="flex flex-col gap-3.5 flex-1 overflow-y-auto">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}
              >
                {isUser ? (
                  <div className="bg-[#2563EB] text-white p-3.5 rounded-3xl rounded-tr-sm text-xs font-medium max-w-[85%] shadow-sm leading-relaxed">
                    {m.text}
                  </div>
                ) : (
                  <div className="w-full bg-[#0D1424] border border-[#1A263E] border-l-4 border-l-[#2563EB] p-4 rounded-3xl shadow-sm flex flex-col gap-3">
                    {/* Bot Message Body */}
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                        {m.text}
                      </p>
                    </div>

                    {/* Insight Card Content (Single Seamless Card, Zero Nested Boxes) */}
                    {m.insightData && (
                      <div className="pt-3 border-t border-[#141F33] flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                            <span>{m.insightData.title}</span>
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{m.timestamp}</span>
                        </div>

                        {m.insightData.items && (
                          <div className="flex flex-col gap-1">
                            {m.insightData.items.map((item, idx) => (
                              <div key={idx} className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {m.insightData.recommendations && (
                          <div className="flex flex-col gap-1 pt-1">
                            {m.insightData.recommendations.map((rec, idx) => (
                              <div key={idx} className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                                <span>→</span>
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {m.insightData.actionLabel && (
                          <button
                            onClick={() => onNavigate && onNavigate(m.insightData?.targetModule || 'overview')}
                            className="mt-1 text-xs font-bold text-[#3875F6] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>{m.insightData.actionLabel}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Standalone Insight Card View */
        <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Latti AI Schedule Radar
            </span>
            <span className="text-xs text-slate-400 font-medium">Just now</span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-normal">
            2 tasks are behind schedule and may impact the <strong>Structural Framing</strong> milestone on <strong>Jun 10, 2025</strong>.
          </p>

          <div className="pt-2 border-t border-[#141F33] flex flex-col gap-2">
            <span className="text-xs font-bold text-white">At Risk Items:</span>
            <div className="text-xs text-slate-300">• Concrete Pour - L12 Deck (Needs approval)</div>
            <div className="text-xs text-slate-300">• Rebar Installation Level 12 (Inspection pending)</div>
          </div>

          <div className="pt-2 border-t border-[#141F33] flex flex-col gap-1 text-xs text-emerald-400 font-medium">
            <div>→ Add 2 more workers from Concrete Solutions Inc.</div>
            <div>→ Extend working hours on site by 1.5 hours</div>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('overview')}
            className="mt-2 h-11 w-full rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          >
            <span>View Project Workspace</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Fixed Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-[#162033]"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Latti anything (e.g. risks, costs, milestones)..."
          className="flex-1 h-12 bg-[#0D1424] border border-[#1A263E] rounded-2xl px-4 text-xs text-white placeholder-slate-500 outline-none focus:border-[#2563EB] transition-colors"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="w-12 h-12 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white flex items-center justify-center transition-all shadow-md flex-shrink-0 cursor-pointer active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
