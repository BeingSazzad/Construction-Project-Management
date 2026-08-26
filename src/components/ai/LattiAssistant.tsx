import React, { useState } from 'react';
import { UserRole, Task, PunchItem } from '../../types';
import { 
  Sparkles, Send, ArrowUpRight, ShieldAlert, 
  ChevronRight, ArrowLeft, Bot, MessageSquare, CheckCircle2, Clock
} from 'lucide-react';

interface LattiAssistantProps {
  currentRole: UserRole;
  activeProject?: any;
  tasks: Task[];
  punchItems: PunchItem[];
  onNavigate?: (tab: string) => void;
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'latti';
  text: string;
  timestamp: string;
  insightData?: {
    type: 'risk' | 'schedule' | 'budget';
    title: string;
    items?: string[];
    recommendations?: string[];
    actionLabel?: string;
    targetModule?: string;
  };
}

export const LattiAssistant: React.FC<LattiAssistantProps> = ({
  currentRole,
  activeProject,
  tasks,
  punchItems,
  onNavigate,
  onClose
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'lat-init',
      sender: 'latti',
      text: "Hello Alex! I'm Latti, your construction copilot. I'm actively analyzing all 4 project job sites, trade contracts, and schedule critical paths.",
      timestamp: 'Just now',
      insightData: {
        type: 'risk',
        title: '2 Schedule Delays Detected',
        items: [
          'Downtown Highrise: L12 Concrete pour delayed (Inspector signoff pending)',
          'Riverside Complex: MEP framing dependency slipping by 3 days'
        ],
        recommendations: [
          'Add 2 additional carpenters to Level 12 framing',
          'Fast-track plumbing submittal with City Bureau'
        ],
        actionLabel: 'View Critical Schedule',
        targetModule: 'schedule'
      }
    }
  ]);

  const quickChips = [
    'Check Schedule Risks',
    'Budget Variance Summary',
    'Open Punch Items',
    'Subcontractor Status'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Dynamic response generator
    setTimeout(() => {
      let botResponse: ChatMessage;

      if (query.toLowerCase().includes('schedule') || query.toLowerCase().includes('risk')) {
        botResponse = {
          id: `lat-${Date.now()}`,
          sender: 'latti',
          text: 'Analyzing critical path schedule. The Level 12 deck pour on Downtown Highrise is on the critical path. Slippage here will delay dry-in milestones by 6 working days.',
          timestamp: 'Just now',
          insightData: {
            type: 'schedule',
            title: 'Critical Path Radar',
            items: [
              'Pre-pour inspection scheduled: 10:00 AM Today',
              'Concrete pump truck confirmed for Thursday 6:00 AM'
            ],
            recommendations: [
              'Confirm trade partner crew size of 8 finishers',
              'Verify weather window for Thursday morning'
            ],
            actionLabel: 'Open Project Gantt Schedule',
            targetModule: 'schedule'
          }
        };
      } else if (query.toLowerCase().includes('budget') || query.toLowerCase().includes('cost')) {
        botResponse = {
          id: `lat-${Date.now()}`,
          sender: 'latti',
          text: 'Riverside Office Complex is currently $230K under budget. However, Division 03 (Concrete) is experiencing a 4.2% unit price variance due to ready-mix fuel surcharges.',
          timestamp: 'Just now',
          insightData: {
            type: 'budget',
            title: 'Financial Variance Report',
            items: [
              'Committed Cost: $3.85M of $4.65M Total Budget',
              'Cost to Complete: $1.15M projected'
            ],
            recommendations: [
              'Review Draw #4 packet with Lender',
              'Lock subcontractor steel pricing'
            ],
            actionLabel: 'Open Budget Hub',
            targetModule: 'budget'
          }
        };
      } else {
        botResponse = {
          id: `lat-${Date.now()}`,
          sender: 'latti',
          text: `All trade submittals, safety logs, and field checks for "${query}" are fully updated and synchronized across all job sites.`,
          timestamp: 'Just now',
          insightData: {
            type: 'schedule',
            title: 'Job Site Status Synced',
            items: [
              '68 field crew members active on site today',
              'Zero OSHA safety violations',
              'Inspection signoffs queued for today'
            ],
            actionLabel: 'Open Project Overview',
            targetModule: 'overview'
          }
        };
      }

      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  return (
    <div className="w-full flex flex-col gap-3 px-5 py-3 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in relative">
      
      {/* 1. Sleek Top Header (Clean Single Mode, No Confusing Chat/Card Switcher) */}
      <div className="flex items-center justify-between pb-3 border-b border-[#142036]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-900/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight">
              Latti Assistant
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Construction Intelligence Radar
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Radar
        </span>
      </div>

      {/* 2. Quick Suggested Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3 py-1.5 rounded-full bg-[#0D1424] hover:bg-[#141F33] border border-[#1A263E] hover:border-blue-500/40 text-xs font-semibold text-slate-300 hover:text-white whitespace-nowrap transition-all shadow-sm cursor-pointer flex-shrink-0 active:scale-95"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 3. Main Unified Conversational Stream */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-[360px]">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}
            >
              {isUser ? (
                <div className="bg-[#2563EB] text-white p-3 rounded-2xl rounded-tr-sm text-xs font-medium max-w-[85%] shadow-md leading-relaxed">
                  {m.text}
                </div>
              ) : (
                <div className="w-full bg-[#0A111F] border border-[#1E2E4A] p-4 rounded-2xl shadow-sm flex flex-col gap-3">
                  {/* Bot Message Header & Body */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal flex-1">
                      {m.text}
                    </p>
                  </div>

                  {/* Contextual Smart Insight Widget Card inside chat */}
                  {m.insightData && (
                    <div className="p-3.5 rounded-xl bg-[#070D1A] border border-[#142036] flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                          <span>{m.insightData.title}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">{m.timestamp}</span>
                      </div>

                      {m.insightData.items && (
                        <div className="flex flex-col gap-1">
                          {m.insightData.items.map((item, idx) => (
                            <div key={idx} className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {m.insightData.recommendations && (
                        <div className="flex flex-col gap-1 pt-1 border-t border-[#142036]">
                          {m.insightData.recommendations.map((rec, idx) => (
                            <div key={idx} className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                              <span>✓</span>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {m.insightData.actionLabel && (
                        <button
                          onClick={() => onNavigate && onNavigate(m.insightData?.targetModule || 'overview')}
                          className="mt-1 text-xs font-bold text-[#3875F6] hover:underline flex items-center gap-1 cursor-pointer self-start"
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

      {/* 4. Fixed Chat Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-[#142036]"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Latti anything (e.g. risks, costs, milestones)..."
          className="flex-1 h-11 bg-[#0A111F] border border-[#142036] focus:border-blue-500/70 rounded-2xl px-4 text-xs text-white placeholder-slate-500 outline-none transition-colors"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="w-11 h-11 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md flex-shrink-0 cursor-pointer active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
