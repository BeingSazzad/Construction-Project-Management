import React, { useState, useEffect, useRef } from 'react';
import { UserRole, Task, PunchItem } from '../../types';
import { 
  Send, AlertTriangle, FileText, Calendar, CloudRain, ChevronRight, 
  Sparkles, ArrowRight, Mic, CheckCircle2, DollarSign, Bot, RefreshCw
} from 'lucide-react';

interface LattiAssistantProps {
  currentRole?: UserRole;
  activeProject?: any;
  tasks?: Task[];
  punchItems?: PunchItem[];
  onNavigate?: (tab: string) => void;
  onClose?: () => void;
  initialQuery?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'latti';
  text: string;
  timestamp: string;
  metricBadge?: {
    label: string;
    value: string;
    variant: 'danger' | 'warning' | 'info' | 'success';
  };
  actionButton?: {
    label: string;
    targetTab: string;
  };
}

export const LattiAssistant: React.FC<LattiAssistantProps> = ({
  currentRole = 'admin',
  activeProject,
  onNavigate,
  initialQuery,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'latti',
      text: "Good morning! I'm monitoring active sites, weather forecasts, and CSI budget variances. How can I assist your team today?",
      timestamp: 'Just now'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isThinking]);

  const INSIGHTS = [
    {
      id: 'ins-1',
      type: 'budget',
      icon: AlertTriangle,
      iconBg: 'bg-[#FEF2F2] text-[#EF4444]',
      badge: 'High Priority',
      badgeBg: 'bg-[#FEF2F2] text-[#EF4444]',
      title: 'Snell Isle Concrete Variance',
      description: 'Concrete line item is trending 8% ($14,200) over budget due to revised pier depths.',
      actionTab: 'budgets',
      actionLabel: 'Inspect Budget'
    },
    {
      id: 'ins-2',
      type: 'weather',
      icon: CloudRain,
      iconBg: 'bg-[#FEF3C7] text-[#D97706]',
      badge: 'Weather Risk',
      badgeBg: 'bg-[#FEF3C7] text-[#D97706]',
      title: 'Thursday Pour Threat',
      description: '85% chance of heavy rain and gusts >22mph in Tampa. Recommend moving concrete pour to Friday.',
      actionTab: 'schedule',
      actionLabel: 'View Schedule'
    },
    {
      id: 'ins-3',
      type: 'permit',
      icon: CheckCircle2,
      iconBg: 'bg-[#EAF3FF] text-[#1677FF]',
      badge: 'Milestone Ready',
      badgeBg: 'bg-[#EAF3FF] text-[#1677FF]',
      title: 'Structural Framing Inspection',
      description: 'City inspector scheduled for tomorrow 10:00 AM. Checklist is 92% verified.',
      actionTab: 'tasks',
      actionLabel: 'Check Checklist'
    }
  ];

  const QUICK_PROMPTS = [
    "Summarize site activity today",
    "Show budget variances & risk",
    "Inspect Thursday rain impact",
    "What tasks are due this week?"
  ];

  const handleSend = (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now'
    };

    setChatHistory(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let replyText = "I've analyzed real-time project telemetry across all active sites.";
      let badge: ChatMessage['metricBadge'] | undefined = undefined;
      let actionBtn: ChatMessage['actionButton'] | undefined = undefined;

      const lower = q.toLowerCase();

      if (lower.includes('budget') || lower.includes('cost') || lower.includes('variance') || lower.includes('money')) {
        replyText = "Portfolio committed spend is $16.8M against $34.85M total. Snell Isle Residence has a $14,200 cost overrun in Division 03 (Concrete) due to soil bearing amendments. All other trade divisions remain within contingency limits.";
        badge = { label: 'Variance Risk', value: '+$14.2K', variant: 'danger' };
        actionBtn = { label: 'Open Portfolio Budgets', targetTab: 'budgets' };
      } else if (lower.includes('rain') || lower.includes('weather') || lower.includes('storm') || lower.includes('forecast')) {
        replyText = "Heavy tropical rain band is projected for Tampa between 1:00 PM and 6:00 PM this Thursday (0.85 in/hr). Concrete cure will be compromised if poured without heavy tarp protection. Recommend rescheduling to Friday morning.";
        badge = { label: 'Precipitation', value: '85% Rain', variant: 'warning' };
        actionBtn = { label: 'Adjust Milestone in Schedule', targetTab: 'schedule' };
      } else if (lower.includes('task') || lower.includes('due') || lower.includes('overdue') || lower.includes('todo')) {
        replyText = "You have 7 active tasks due this week. Priority item: 'Verify hurricane strap nailing schedule' before the City inspector arrives tomorrow at 10:00 AM.";
        badge = { label: 'Tasks Due', value: '7 Pending', variant: 'info' };
        actionBtn = { label: 'Review Project Tasks', targetTab: 'tasks' };
      } else if (lower.includes('summary') || lower.includes('today') || lower.includes('briefing') || lower.includes('activity')) {
        replyText = "Good morning! 2 sites require executive focus: Snell Isle has a municipal framing inspection tomorrow morning, and Downtown Tower had steel delivery #4 confirmed today. Zero safety incidents reported.";
        badge = { label: 'Site Health', value: '100% Active', variant: 'success' };
        actionBtn = { label: 'View All Projects', targetTab: 'projects' };
      } else {
        replyText = `Understood. I have logged and analyzed your query. Snell Isle Residence is currently at 62% progress and tracking on schedule for Q4 delivery. Let me know if you would like me to adjust any milestone or create a sub-tier task.`;
        actionBtn = { label: 'Open Project Overview', targetTab: 'projects' };
      }

      setChatHistory(prev => [
        ...prev,
        {
          id: `lat-${Date.now()}`,
          sender: 'latti',
          text: replyText,
          timestamp: 'Just now',
          metricBadge: badge,
          actionButton: actionBtn
        }
      ]);
      setIsThinking(false);
    }, 400);
  };

  return (
    <div className="w-full flex flex-col min-h-full px-4 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#171A1F] animate-fade-in">
      
      {/* ── 1. SLEEK 10-YR PRODUCT DESIGNER HEADER ── */}
      <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-[#EAEDF1]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1677FF] to-[#0958D9] text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-[#171A1F] tracking-tight">Latti Intelligence</h1>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#EAF3FF] text-[#1677FF] tracking-wider uppercase">
                Copilot
              </span>
            </div>
            <p className="text-[11px] text-[#68707C] font-medium truncate">
              {activeProject ? activeProject.name : '4 Active Job Sites Monitored'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setChatHistory([
            {
              id: 'welcome-reset',
              sender: 'latti',
              text: "Chat refreshed. How can I assist your construction workflows?",
              timestamp: 'Just now'
            }
          ])}
          className="w-8 h-8 rounded-lg bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 text-[#68707C] hover:text-[#1677FF] flex items-center justify-center cursor-pointer transition-all active:scale-95"
          title="Reset Conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── 2. EXECUTIVE BRIEFING / RADAR INSIGHTS ── */}
      {chatHistory.length <= 1 && (
        <div className="flex flex-col gap-2.5 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#68707C] uppercase tracking-wider">
              Priority Insights
            </span>
            <span className="text-[10px] text-[#1677FF] font-semibold">
              Live updates
            </span>
          </div>

          {INSIGHTS.map((ins) => {
            const Icon = ins.icon;
            return (
              <div
                key={ins.id}
                onClick={() => {
                  if (onNavigate) onNavigate(ins.actionTab);
                }}
                className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/50 transition-all cursor-pointer shadow-card group active:scale-[0.99] flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-xl ${ins.iconBg} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-bold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">
                      {ins.title}
                    </h3>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${ins.badgeBg}`}>
                      {ins.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4B5563] leading-relaxed mt-0.5">
                    {ins.description}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#1677FF] mt-2 group-hover:underline">
                    <span>{ins.actionLabel}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 3. CHAT CONVERSATION STREAM ── */}
      <div className="flex flex-col gap-3 my-3">
        {chatHistory.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3.5 rounded-2xl max-w-[88%] text-xs leading-relaxed shadow-xs ${
                  isUser 
                    ? 'bg-[#1677FF] text-white rounded-br-xs font-medium' 
                    : 'bg-white border border-[#DDE1E7] text-[#171A1F] rounded-bl-xs'
                }`}
              >
                {!isUser && msg.metricBadge && (
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      msg.metricBadge.variant === 'danger' ? 'bg-[#FEF2F2] text-[#EF4444] border border-[#FCA5A5]' :
                      msg.metricBadge.variant === 'warning' ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]' :
                      msg.metricBadge.variant === 'success' ? 'bg-[#E9F9F3] text-[#10A976] border border-[#A7F3D0]' :
                      'bg-[#EAF3FF] text-[#1677FF] border border-[#BFDBFE]'
                    }`}>
                      {msg.metricBadge.label}: {msg.metricBadge.value}
                    </span>
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {!isUser && msg.actionButton && (
                  <button
                    onClick={() => {
                      if (onNavigate && msg.actionButton) onNavigate(msg.actionButton.targetTab);
                    }}
                    className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-[#F2F4F7] hover:bg-[#EAF3FF] border border-[#DDE1E7] hover:border-[#1677FF]/40 text-xs font-bold text-[#1677FF] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <span>{msg.actionButton.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-[9px] text-[#9DA5B1] font-medium px-1 mt-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 p-3 bg-white border border-[#DDE1E7] rounded-2xl w-fit shadow-xs animate-pulse">
            <Bot className="w-4 h-4 text-[#1677FF]" />
            <span className="text-xs text-[#68707C] font-semibold">Latti is analyzing project data...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ── 4. QUICK SUGGESTION PILLS ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 shrink-0">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1.5 rounded-full bg-white border border-[#DDE1E7] hover:border-[#1677FF] text-[11px] font-semibold text-[#4B5563] hover:text-[#1677FF] whitespace-nowrap cursor-pointer transition-all shadow-xs shrink-0 active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* ── 5. FIXED ELEVATED INPUT BAR ── */}
      <div className="mt-auto pt-2 sticky bottom-16 bg-[#F2F2F7] pb-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-1.5 bg-white border border-[#DDE1E7] focus-within:border-[#1677FF] rounded-2xl shadow-card transition-all"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Latti about budgets, schedules, permits..."
            className="flex-1 bg-transparent px-3 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              inputQuery.trim() 
                ? 'bg-[#1677FF] text-white shadow-sm active:scale-95' 
                : 'bg-[#EAEDF1] text-[#9DA5B1]'
            }`}
          >
            <Send className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
