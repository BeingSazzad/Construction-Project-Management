import React, { useState } from 'react';
import { 
  ChevronLeft, Phone, Mail, ChevronDown,
  CheckCircle2, Send, MessageSquare, BookOpen,
  ChevronRight, ArrowUpRight
} from 'lucide-react';

interface HelpSupportProps {
  onBack: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const HelpSupport: React.FC<HelpSupportProps> = ({ onBack, onNavigateTab }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('General Inquiry');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const faqs = [
    {
      q: 'How do I add a new CSI cost code to my budget?',
      a: 'Navigate to the project Budget tab, click "+ Add Code", select the MasterFormat division (e.g. Division 03 Concrete), enter estimated cost, and save.'
    },
    {
      q: 'Can field supers log photos without cell signal?',
      a: 'Yes! The app caches site photos and punch list entries locally, syncing to the cloud automatically once network is restored.'
    },
    {
      q: 'How do I export a weekly executive report to PDF?',
      a: 'Go to the Reports tab in any project workspace, select "Project Progress Report", and tap "Export PDF" to download a formatted handoff report.'
    },
    {
      q: 'How does Latti AI detect critical path risks?',
      a: 'Latti AI analyses task dependencies, tracking crew check-ins and inspection signoffs to alert you when predecessor milestones risk slipping.'
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMsg.trim()) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketCategory('General Inquiry');
      setTicketMsg('');
      setTicketSent(false);
    }, 4000);
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaq(prev => prev === idx ? null : idx);
  };

  return (
    <div className="w-full flex flex-col gap-3.5 px-4 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">

      {/* ─── Header ─── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#171A1F] tracking-tight leading-tight">Help & Support</h1>
        </div>
      </div>

      {/* ─── Quick Contact Channels ─── */}
      <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EAEDF1]">
        <div className="px-4 pt-3 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#68707C]">Direct Contact</p>
        </div>

        <a
          href="tel:+18005558900"
          className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group active:bg-[#F2F2F7]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Phone className="w-4 h-4 text-[#1677FF]" />
            </div>
            <span className="text-xs font-semibold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">Phone Hotline</span>
          </div>
          <span className="text-xs font-semibold text-[#1677FF] flex items-center gap-1">
            <span>1-800-555-8900</span>
            <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors" />
          </span>
        </a>

        <a
          href="mailto:support@latticebuild.com"
          className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group active:bg-[#F2F2F7]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Mail className="w-4 h-4 text-[#1677FF]" />
            </div>
            <span className="text-xs font-semibold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors">Email Support</span>
          </div>
          <span className="text-xs font-medium text-[#64748B] flex items-center gap-1">
            <span>support@latticebuild.com</span>
            <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors" />
          </span>
        </a>

        <button
          type="button"
          onClick={() => onNavigateTab ? onNavigateTab('latti') : undefined}
          className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group active:bg-[#F2F2F7] text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0 shadow-xs">
              <MessageSquare className="w-4 h-4 text-[#1677FF]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors block">Live Chat</span>
              <span className="text-[10px] text-[#64748B]">Instant help with Latti AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full border border-[#1677FF]/30">Online</span>
            <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setExpandedFaq(0);
            const el = document.getElementById('faq-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group active:bg-[#F2F2F7] text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0 shadow-xs">
              <BookOpen className="w-4 h-4 text-[#1677FF]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors block">Knowledge Base</span>
              <span className="text-[10px] text-[#64748B]">Guides & FAQ answers</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
        </button>
      </div>

      {/* ─── FAQ Accordion ─── */}
      <div id="faq-section" className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EAEDF1]">
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#68707C]">Frequently Asked Questions</p>
          <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] px-2 py-0.5 rounded-full">{faqs.length}</span>
        </div>

        {faqs.map((faq, idx) => {
          const isExpanded = expandedFaq === idx;
          return (
            <div key={idx} className="transition-all">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-4 py-3 text-left flex items-start justify-between gap-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                  <span className="text-xs font-semibold text-[#171A1F] leading-snug">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 mt-0.5 ${
                  isExpanded ? 'rotate-180 text-[#1677FF]' : 'text-[#9DA5B1]'
                }`} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 animate-fade-in">
                  <div className="ml-7 p-3 bg-[#F7F8FA] rounded-xl border border-[#EAEDF1]">
                    <p className="text-xs text-[#68707C] leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Submit Support Ticket ─── */}
      <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden">
        <div className="px-4 pt-3 pb-2 border-b border-[#EAEDF1]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#68707C]">Send Inquiry</p>
        </div>

        <div className="p-4">
          {ticketSent ? (
            <div className="p-4 bg-[#EAF3FF] border border-[#1677FF]/25 rounded-2xl flex items-start gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-[#1677FF] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#171A1F]">Request Sent</p>
                <p className="text-xs text-[#1677FF] mt-0.5 font-medium">We received your inquiry and will follow up shortly.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="flex flex-col gap-3">
              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#4B5565]">Subject <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Brief summary of your request"
                  className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white rounded-xl px-3 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none transition-colors font-medium"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#4B5565]">Category</label>
                <div className="relative">
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white rounded-xl pl-3 pr-9 text-xs text-[#171A1F] outline-none appearance-none cursor-pointer transition-colors font-medium"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Budget & Cost Codes">Budget & Cost Codes</option>
                    <option value="Subcontractor & Staff">Subcontractor & Staff</option>
                    <option value="Daily Logs & Photos">Daily Logs & Photos</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9DA5B1] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#4B5565]">Message <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  rows={3}
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  placeholder="Describe your question or issue..."
                  className="w-full bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white rounded-xl p-3 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none resize-none transition-colors leading-relaxed font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#1677FF] hover:bg-[#125ecc] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};
