import React, { useState } from 'react';
import { UserRole, Task, PunchItem } from '../../types';
import { 
  Send, AlertTriangle, FileText, Calendar, CloudRain, ChevronRight, CheckSquare, Sparkles 
} from 'lucide-react';

interface LattiAssistantProps {
  currentRole?: UserRole;
  activeProject?: any;
  tasks?: Task[];
  punchItems?: PunchItem[];
  onNavigate?: (tab: string) => void;
  onClose?: () => void;
}

// Faceted Blue Diamond Latti Icon from Figma Screen 5
const LattiGeometricIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <path d="M32 4L56 20L32 60L8 20L32 4Z" stroke="#1677FF" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M8 20H56" stroke="#1677FF" strokeWidth="2.5" />
    <path d="M32 4L22 20L32 60L42 20L32 4Z" stroke="#1677FF" strokeWidth="2" strokeLinejoin="round" fill="#EAF3FF" fillOpacity="0.4" />
    <path d="M22 20L32 4L42 20" stroke="#1677FF" strokeWidth="2" />
    <line x1="32" y1="20" x2="32" y2="60" stroke="#1677FF" strokeWidth="2" />
  </svg>
);

interface ChatMessage {
  id: string;
  sender: 'user' | 'latti';
  text: string;
  timestamp: string;
  actionItem?: {
    label: string;
    action: () => void;
  };
}

export const LattiAssistant: React.FC<LattiAssistantProps> = ({
  onNavigate,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const insights = [
    {
      id: 'ins-1',
      type: 'budget',
      icon: AlertTriangle,
      iconBg: 'bg-[#FEF2F2] text-[#EF4444]',
      title: 'Budget risk',
      titleColor: 'text-[#EF4444]',
      description: 'Concrete costs on Snell Isle Residence are trending 8% over budget.',
      actionTab: 'projects',
    },
    {
      id: 'ins-2',
      type: 'permit',
      icon: FileText,
      iconBg: 'bg-[#EAF3FF] text-[#1677FF]',
      title: 'Permit update',
      titleColor: 'text-[#1677FF]',
      description: 'Building permit for Snell Isle Residence is approved and ready for pickup.',
      actionTab: 'projects',
    },
    {
      id: 'ins-3',
      type: 'schedule',
      icon: Calendar,
      iconBg: 'bg-[#EAF3FF] text-[#1677FF]',
      title: 'Schedule conflict',
      titleColor: 'text-[#1677FF]',
      description: 'MEP Rough-In conflicts with Framing Inspection on May 16.',
      actionTab: 'projects',
    },
    {
      id: 'ins-4',
      type: 'weather',
      icon: CloudRain,
      iconBg: 'bg-[#FEF3C7] text-[#D97706]',
      title: 'Weather impact alert',
      titleColor: 'text-[#D97706]',
      description: 'Heavy rain expected Thursday in Tampa may affect scheduled concrete pour. Recommendation: move pour or confirm weather protection.',
      actionTab: 'projects',
    },
  ];

  const handleSend = (userText?: string) => {
    const q = userText || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now'
    };

    setChatHistory(prev => [...prev, userMsg]);
    if (!userText) setInputQuery('');

    // Generate intelligent construction partner answer
    setTimeout(() => {
      let reply = "I've analyzed all active project data for Snell Isle Residence and current milestones.";

      if (q.toLowerCase().includes('weather') || q.toLowerCase().includes('rain') || q.toLowerCase().includes('pour')) {
        reply = "Weather radar indicates an 85% probability of heavy rain and wind gusts over 22 mph this Thursday in Tampa, FL. I recommend delaying the Level 2 concrete pour to Friday morning or verifying site tarp coverage with Apex Ready-Mix.";
      } else if (q.toLowerCase().includes('budget') || q.toLowerCase().includes('cost')) {
        reply = "Snell Isle Residence has committed $1.42M against an original $1.84M budget ($860K remaining). Concrete line item has exceeded variance by $14,200 due to revised pier depths. Framing and electrical are tracking under budget.";
      } else if (q.toLowerCase().includes('task') || q.toLowerCase().includes('note') || q.toLowerCase().includes('create')) {
        reply = "I've drafted a task: 'Verify hurricane strap nailing schedule before framing inspection' assigned to John Smith for May 16. Tap to add directly to schedule.";
      } else if (q.toLowerCase().includes('briefing') || q.toLowerCase().includes('morning') || q.toLowerCase().includes('today')) {
        reply = "Good morning, Avery. Two projects need attention today. Snell Isle has a framing inspection tomorrow at 10:00 AM, and one framing invoice exceeds its category. Thursday rain will threaten exterior concrete. All other milestones are on track.";
      } else {
        reply = `Understood. Snell Isle Residence is 62% complete and on schedule. Next upcoming milestone is the Framing Inspection on May 16 at 10:00 AM. Let me know if you would like me to adjust the schedule or alert the team.`;
      }

      setChatHistory(prev => [
        ...prev,
        {
          id: `lat-${Date.now()}`,
          sender: 'latti',
          text: reply,
          timestamp: 'Just now'
        }
      ]);
    }, 450);
  };

  return (
    <div className="w-full flex flex-col min-h-full px-5 py-5 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">
      
      {/* ── 1. Geometric Diamond Latti Crystal Header (Figma Screen 5) ── */}
      <div className="flex flex-col items-center text-center pt-2 pb-4">
        <LattiGeometricIcon />
        
        <h2 className="text-xl font-bold tracking-tight text-[#171A1F] mt-3">
          What needs my attention today?
        </h2>
        <p className="text-xs text-[#68707C] font-medium mt-1">
          Here are the top insights from your projects.
        </p>
      </div>

      {/* ── 2. Top Insights Actionable Cards Feed ── */}
      <div className="flex flex-col gap-3">
        {insights.map((ins) => {
          const Icon = ins.icon;
          return (
            <div
              key={ins.id}
              onClick={() => {
                if (onNavigate) onNavigate(ins.actionTab);
              }}
              className="p-4 rounded-3xl bg-white border border-[#DDE1E7] hover:border-[#1677FF]/40 shadow-sm transition-all cursor-pointer flex items-start gap-3.5 group active:scale-[0.99]"
            >
              <div className={`w-9 h-9 rounded-2xl ${ins.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className={`text-xs font-bold ${ins.titleColor} flex items-center justify-between`}>
                  <span>{ins.title}</span>
                  <ChevronRight className="w-4 h-4 text-[#68707C] group-hover:text-[#1677FF] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
                <p className="text-xs text-[#171A1F] font-medium leading-relaxed mt-1">
                  {ins.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 2.5 Quick Action Chips ── */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3">
        <button
          onClick={() => handleSend("Give me the daily project briefing")}
          className="px-3 py-1.5 rounded-full bg-white border border-[#DDE1E7] hover:border-[#1677FF] text-xs font-semibold text-[#171A1F] whitespace-nowrap cursor-pointer transition-all shadow-sm active:scale-95"
        >
          Daily Briefing
        </button>
        <button
          onClick={() => handleSend("What is the weather forecast for Thursday?")}
          className="px-3 py-1.5 rounded-full bg-white border border-[#DDE1E7] hover:border-[#1677FF] text-xs font-semibold text-[#171A1F] whitespace-nowrap cursor-pointer transition-all shadow-sm active:scale-95"
        >
          Weather Radar
        </button>
        <button
          onClick={() => handleSend("Turn note into task: Check hurricane straps")}
          className="px-3 py-1.5 rounded-full bg-white border border-[#DDE1E7] hover:border-[#1677FF] text-xs font-semibold text-[#171A1F] whitespace-nowrap cursor-pointer transition-all shadow-sm active:scale-95"
        >
          Note to Task
        </button>
      </div>

      {/* ── 3. Chat History Stream (if any questions asked) ── */}
      {chatHistory.length > 0 && (
        <div className="flex flex-col gap-2.5 pt-2 pb-2">
          {chatHistory.map((msg) => (
            <div 
              key={msg.id}
              className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[88%] shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-[#1677FF] text-white self-end font-semibold' 
                  : 'bg-white border border-[#DDE1E7] text-[#171A1F] self-start font-medium'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      )}

      {/* ── 4. Bottom Fixed Input Bar (Figma Screen 5) ── */}
      <div className="mt-auto pt-4 sticky bottom-16 bg-[#F2F2F7] pb-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-1.5 bg-white border border-[#DDE1E7] focus-within:border-[#1677FF] rounded-full shadow-sm transition-all"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Latti anything..."
            className="flex-1 bg-transparent px-4 text-xs text-[#171A1F] placeholder-[#68707C] outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              inputQuery.trim() 
                ? 'bg-[#1677FF] text-white shadow-sm' 
                : 'bg-[#EAEDF1] text-[#68707C]'
            }`}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
