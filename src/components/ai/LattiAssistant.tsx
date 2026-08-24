import React, { useState } from 'react';
import { UserRole, Project, Task, PunchItem, LattiMessage } from '../../types';
import { 
  Sparkles, Send, Bot, User as UserIcon, ArrowRight, 
  CheckCircle2, AlertTriangle, ChevronRight, ShieldAlert, 
  HelpCircle, Lightbulb, Clock, Check 
} from 'lucide-react';
import { Button } from '../common/Button';

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
  const [stagedAction, setStagedAction] = useState<any | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Quick Chips (matching design board)
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

    // Generate response
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
    <div className="flex flex-col gap-4">
      {/* Top Header & View Toggle (Chat vs Project Insights) */}
      <div className="card-dark p-3 bg-[#0D131F] border-[#1A2436] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">Latti AI Assistant</h3>
            <p className="text-[10px] text-slate-400">Construction Intelligence & Risk Radar</p>
          </div>
        </div>

        <div className="flex items-center bg-[#080D17] p-1 rounded-lg border border-[#162033] gap-1">
          <button
            onClick={() => setViewMode('chat')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              viewMode === 'chat' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setViewMode('insights')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              viewMode === 'insights' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Insight Card
          </button>
        </div>
      </div>

      {/* View Mode 1: Project Insight Card (Matching exact rightmost screen on board) */}
      {viewMode === 'insights' ? (
        <div className="flex flex-col gap-3">
          {/* User Query Banner */}
          <div className="p-3 rounded-xl bg-[#111827] border border-[#1E293B] text-xs text-slate-200">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">PM Prompt</span>
            <p className="font-semibold text-white">"What is the current risk in Riverside Office Complex?"</p>
          </div>

          {/* Latti Insight Card */}
          <div className="card-dark p-4 bg-[#0D131F] border-blue-500/40 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Schedule Risk</span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              2 tasks are behind schedule and may impact the <strong>Structural Framing</strong> milestone on <strong>Jun 10, 2025</strong>.
            </p>

            {/* At Risk Tasks */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                At Risk Tasks
              </span>
              <div className="space-y-1.5">
                <div className="p-2 bg-[#080D17] rounded-lg border border-[#151E2E] flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">• Concrete Pour - L12</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    Due Today
                  </span>
                </div>
                <div className="p-2 bg-[#080D17] rounded-lg border border-[#151E2E] flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">• Rebar Installation</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    Inspection Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Recommendations
              </span>
              <div className="space-y-1 text-xs">
                <p className="text-emerald-400 font-medium">• Add 2 more workers from Concrete Solutions Inc.</p>
                <p className="text-emerald-400 font-medium">• Extend working hours on site by 1.5 hours</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2 border-t border-[#182338]">
              <button
                onClick={() => onNavigate && onNavigate('overview')}
                className="w-full h-10 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>View Project</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* View Mode 2: Chat Mode */
        <div className="flex flex-col gap-3">
          {/* Quick Suggested Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-lg bg-[#0D131F] border border-[#1A2436] hover:border-slate-500 text-slate-300 text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Conversation Stream */}
          <div className="flex flex-col gap-3">
            {messages.map((m) => {
              const isLatti = m.sender === 'latti';

              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isLatti ? 'items-start' : 'items-end flex-row-reverse'}`}
                >
                  {isLatti ? (
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-[#172238] flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] flex flex-col gap-2 ${isLatti ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        isLatti 
                          ? 'bg-[#0D131F] border border-[#1A2436] text-slate-200' 
                          : 'bg-[#0066FF] text-white font-medium'
                      }`}
                    >
                      {m.text}
                    </div>

                    {/* Actionable structured data if available */}
                    {isLatti && m.insightData && (
                      <div className="w-full card-dark p-3 bg-[#080D17] border-[#151E2E] text-xs flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{m.insightData.title}</span>
                        </div>

                        {m.insightData.items && (
                          <div className="space-y-1">
                            {m.insightData.items.map((it, idx) => (
                              <div key={idx} className="text-[11px] text-slate-300">
                                • {it}
                              </div>
                            ))}
                          </div>
                        )}

                        {m.insightData.recommendations && (
                          <div className="space-y-0.5 pt-1 border-t border-[#141E2F]">
                            {m.insightData.recommendations.map((rec, idx) => (
                              <p key={idx} className="text-[11px] text-emerald-400 font-medium">
                                → {rec}
                              </p>
                            ))}
                          </div>
                        )}

                        {m.insightData.targetModule && onNavigate && (
                          <button
                            onClick={() => onNavigate(m.insightData!.targetModule!)}
                            className="mt-1 text-[11px] font-bold text-blue-400 hover:underline flex items-center gap-0.5"
                          >
                            <span>{m.insightData.actionLabel || 'View in Project'}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Box */}
          <div className="sticky bottom-0 bg-[#080C14] pt-2 pb-1">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Latti anything (e.g. risks, costs, milestones)..."
                className="w-full h-11 bg-[#0D131F] border border-[#1A2436] rounded-xl pl-3 pr-11 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputQuery.trim()}
                className="absolute right-1.5 w-8 h-8 rounded-lg bg-[#0066FF] text-white flex items-center justify-center cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
