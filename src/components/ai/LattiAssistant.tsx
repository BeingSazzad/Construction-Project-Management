import React, { useState, useEffect, useRef } from 'react';
import { UserRole, Task, PunchItem } from '../../types';
import { 
  Send, Calendar, CloudRain, 
  ArrowRight, Bot, RefreshCw,
  BarChart2, PieChart, Paperclip, ChevronRight
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

// ── Cute 3D Smiling Robot Avatar from Reference Mockup ──
const RobotAvatar: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`rounded-2xl bg-gradient-to-b from-[#EFF6FF] to-[#DBEAFE] p-1.5 flex items-center justify-center shadow-xs shrink-0 ${className}`}>
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
      <circle cx="32" cy="32" r="28" fill="#E0F2FE" opacity="0.6"/>
      {/* Head Body */}
      <rect x="11" y="13" width="42" height="36" rx="16" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Visor Screen */}
      <rect x="16" y="20" width="32" height="21" rx="9" fill="#0F172A" />
      {/* Cyan Smiling Curved Eyes */}
      <path d="M21 32 C22.5 28 25.5 28 27 32" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M37 32 C38.5 28 41.5 28 43 32" stroke="#38BDF8" strokeWidth="2.8" strokeLinecap="round" />
      {/* Ear Knobs */}
      <rect x="8" y="26" width="3.5" height="10" rx="1.75" fill="#94A3B8" />
      <rect x="52.5" y="26" width="3.5" height="10" rx="1.75" fill="#94A3B8" />
    </svg>
  </div>
);

export const LattiAssistant: React.FC<LattiAssistantProps> = ({
  currentRole = 'admin',
  activeProject,
  onNavigate,
  initialQuery,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isThinking]);

  const QUICK_PROMPTS = [
    { text: "Draft client project update", icon: Send },
    { text: "Summarize site activity today", icon: BarChart2 },
    { text: "Any weather risks this week?", icon: CloudRain },
    { text: "Show budget variances", icon: PieChart },
    { text: "What are upcoming inspections?", icon: Calendar }
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
      let replyText = "I've analyzed real-time project telemetry across all active projects.";
      let badge: ChatMessage['metricBadge'] | undefined = undefined;
      let actionBtn: ChatMessage['actionButton'] | undefined = undefined;

      const lower = q.toLowerCase();

      if (lower.includes('draft') || lower.includes('message') || lower.includes('client update') || lower.includes('email') || lower.includes('update draft')) {
        replyText = `Here is a drafted project update ready for the client:\n\n"Dear Arthur & Evelyn,\n\nHere is your weekly progress briefing for 1840 Brightwaters Blvd:\n• Stage 4 (Structural Framing & Slabs) is 68% complete.\n• Pre-pour framing inspection is scheduled with the City for tomorrow at 10:00 AM.\n• Weather coordination: With rain expected Thursday afternoon, our team has staged crane lifts for Friday to ensure uninterrupted progress.\n• Total budget and critical-path timeline remain fully on schedule for Aug 30, 2025 delivery.\n\nWarm regards,\nSarah Johnson, Lead PM\nLattice Construction"`;
        badge = { label: 'Draft Ready', value: 'Client Update', variant: 'success' };
        actionBtn = { label: 'Post to Daily Logs', targetTab: 'daily-logs' };
      } else if (lower.includes('budget') || lower.includes('cost') || lower.includes('variance') || lower.includes('money')) {
        replyText = "Portfolio committed spend is $16.8M against $34.85M total. Snell Isle Residence has a $14,200 cost overrun in Division 03 (Concrete) due to soil bearing amendments. All other trade divisions remain within contingency limits.";
        badge = { label: 'Variance Risk', value: '+$14.2K', variant: 'danger' };
        actionBtn = { label: 'Open Portfolio Budgets', targetTab: 'budgets' };
      } else if (lower.includes('rain') || lower.includes('weather') || lower.includes('storm') || lower.includes('forecast') || lower.includes('risk')) {
        replyText = "Weather forecast looks favorable overall, but a tropical rain band is projected for Tampa between 1:00 PM and 6:00 PM this Thursday (0.85 in/hr). Recommend scheduling exterior concrete cures for Friday morning.";
        badge = { label: 'Precipitation', value: '85% Rain', variant: 'warning' };
        actionBtn = { label: 'Adjust Milestone in Schedule', targetTab: 'schedule' };
      } else if (lower.includes('inspection') || lower.includes('permit') || lower.includes('upcoming')) {
        replyText = "Upcoming inspections scheduled:\n1) Structural Framing & MEP rough-in inspection at Snell Isle tomorrow at 10:00 AM.\n2) Plumbing underground sign-off at Bayshore Waterfront on Friday at 2:30 PM.\nChecklist verification is at 92%.";
        badge = { label: 'Inspections', value: '2 Scheduled', variant: 'info' };
        actionBtn = { label: 'Review Project Tasks', targetTab: 'tasks' };
      } else if (lower.includes('task') || lower.includes('due') || lower.includes('overdue') || lower.includes('todo')) {
        replyText = "You have 7 active tasks due this week. Priority item: 'Verify hurricane strap nailing schedule' before the City inspector arrives tomorrow at 10:00 AM.";
        badge = { label: 'Tasks Due', value: '7 Pending', variant: 'info' };
        actionBtn = { label: 'Review Project Tasks', targetTab: 'tasks' };
      } else if (lower.includes('summary') || lower.includes('today') || lower.includes('briefing') || lower.includes('activity')) {
        replyText = "Good morning! You're on track with 3 active projects. Snell Isle has municipal framing inspection tomorrow, and Downtown Tower had steel delivery #4 confirmed today. Zero safety incidents reported.";
        badge = { label: 'Site Health', value: '100% Active', variant: 'success' };
        actionBtn = { label: 'View All Projects', targetTab: 'projects' };
      } else {
        replyText = `Understood. I have logged and analyzed your query. Snell Isle Residence is currently at 62% progress and tracking on schedule for Q4 delivery. Let me know if you would like me to inspect any milestone, budget division, or subcontractor status.`;
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
    <div className="w-full flex-1 flex flex-col h-[calc(100vh-140px)] min-h-[560px] max-w-[430px] md:max-w-2xl mx-auto font-sans px-4 pt-1 pb-1 text-[#0F172A] relative">
      
      {/* ── Optional Reset Header when in Chat Mode ── */}
      {chatHistory.length > 0 && (
        <div className="flex items-center justify-between py-1.5 px-2 mb-1 bg-white/80 backdrop-blur-xs rounded-xl border border-[#E2E8F0] shrink-0 animate-fade-in">
          <span className="text-[11px] font-semibold text-[#64748B]">
            {activeProject ? activeProject.name : '3 Active Projects'}
          </span>
          <button
            onClick={() => setChatHistory([])}
            className="h-7 px-2.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1677FF] hover:text-[#0F5FD7] flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 text-[11px] font-bold"
          >
            <RefreshCw className="w-3 h-3" />
            <span>New Chat</span>
          </button>
        </div>
      )}

      {/* ── MIDDLE SECTION (Upor ta Middle a Rakha) ── */}
      {chatHistory.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center my-auto py-4 gap-3.5 animate-fade-in">
          {/* Greeting Card matching Reference Mockup */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
            <RobotAvatar className="w-13 h-13 sm:w-14 sm:h-14" />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#0F172A] tracking-tight">Good morning!</h2>
              <p className="text-[11px] sm:text-xs text-[#475569] leading-relaxed mt-0.5">
                You're on track with 3 active projects. Weather looks favorable this week. How can I assist you today?
              </p>
            </div>
          </div>

          {/* Quick Action Suggestion Prompts */}
          <div className="flex flex-col gap-2 w-full">
            {QUICK_PROMPTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(item.text)}
                  className="w-full py-2.5 px-3.5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#1677FF] hover:bg-[#F8FAFC] text-left text-xs font-semibold text-[#1E293B] flex items-center justify-between gap-3 shadow-2xs transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-xl bg-[#EAF3FF] flex items-center justify-center shrink-0 text-[#1677FF] group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="group-hover:text-[#1677FF] transition-colors leading-tight text-xs font-medium text-[#0F172A]">
                      {item.text}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#1677FF] transition-colors shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Conversation Stream */
        <div className="flex-1 overflow-y-auto my-1 pr-1 space-y-3">
          {chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[88%] text-xs leading-relaxed shadow-xs ${
                    isUser 
                      ? 'bg-[#1677FF] text-white rounded-br-xs font-medium' 
                      : 'bg-white border border-[#E2E8F0] text-[#0F172A] rounded-bl-xs'
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
                      className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-[#F8FAFC] hover:bg-[#EAF3FF] border border-[#E2E8F0] hover:border-[#1677FF]/40 text-xs font-bold text-[#1677FF] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <span>{msg.actionButton.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-[#94A3B8] font-medium px-1 mt-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 p-3 bg-white border border-[#E2E8F0] rounded-2xl w-fit shadow-xs animate-pulse">
              <Bot className="w-4 h-4 text-[#1677FF]" />
              <span className="text-xs text-[#64748B] font-semibold">Latti is analyzing project data...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* ── BOTTOM INPUT BAR (Msg Er Ta Niche) ── */}
      <div className="shrink-0 pt-2 pb-20 sm:pb-3 z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 px-3.5 bg-white border border-[#E2E8F0] focus-within:border-[#1677FF] focus-within:ring-2 focus-within:ring-[#1677FF]/15 rounded-full shadow-md transition-all h-12 min-h-[48px]"
        >
          <button
            type="button"
            onClick={() => alert("Attachment feature: Upload inspection photo, daily log report, or blueprint drawing.")}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#1677FF] hover:bg-[#F1F5F9] transition-colors cursor-pointer shrink-0"
            title="Attach photo or document"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Latti about budgets, schedules, permits..."
            className="flex-1 bg-transparent h-full text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none font-medium"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() && !isThinking}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              inputQuery.trim()
                ? 'bg-[#1677FF] hover:bg-[#005CE6] text-white shadow-sm active:scale-95'
                : 'bg-[#1677FF] hover:bg-[#005CE6] text-white shadow-sm opacity-95'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
