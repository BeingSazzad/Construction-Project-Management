import React, { useState } from 'react';
import { 
  ChevronLeft, Phone, Mail, HelpCircle, ChevronDown,
  CheckCircle2, Send, MessageSquare, BookOpen, Clock,
  Zap, ChevronRight, Headphones, ArrowUpRight
} from 'lucide-react';

interface HelpSupportProps {
  onBack: () => void;
}

export const HelpSupport: React.FC<HelpSupportProps> = ({ onBack }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Other');
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
      setTicketCategory('Other');
      setTicketMsg('');
      setTicketSent(false);
    }, 5000);
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaq(prev => prev === idx ? null : idx);
  };

  return (
    <div className="w-full flex flex-col gap-3 px-4 py-4 pb-28 font-sans max-w-[430px] mx-auto text-[#171A1F] animate-fade-in">

      {/* ─── Header ─── */}
      <div className="flex items-center gap-3 mb-1">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#EAEDF1] border border-[#DDE1E7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#171A1F] tracking-tight leading-tight">Help & Support</h1>
          <p className="text-xs text-[#68707C] font-medium mt-0.5">24/7 Enterprise Jobsite Assistance</p>
        </div>
      </div>

      {/* ─── Hero Support Banner ─── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1677FF] via-[#2E8BFF] to-[#60A5FA] p-5 shadow-lg">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-white/8" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm animate-pulse" />
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">Support Online</span>
            </div>
            <h2 className="text-sm font-bold text-white leading-snug mb-1">
              Need help? We're here.
            </h2>
            <p className="text-xs text-white/70 leading-relaxed">
              Average response time under 15 minutes for enterprise accounts.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
            <Headphones className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 flex items-center gap-4 mt-4 pt-3 border-t border-white/20">
          {[
            { label: 'Avg. Response', value: '<15 min' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Tickets Resolved', value: '4,821' },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="text-[10px] text-white/60 font-medium">{label}</span>
              <span className="text-xs font-bold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Contact Actions ─── */}
      <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EAEDF1]">
        <div className="px-4 pt-3 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#9DA5B1]">Contact Us</p>
        </div>

        <a
          href="tel:+18005558900"
          className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group active:bg-[#F2F2F7]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-[#1677FF]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#171A1F] block">Call Hotline</span>
              <span className="text-[10px] text-[#68707C]">1-800-555-8900 · Mon–Fri 6am–10pm</span>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#DDE1E7] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
        </a>

        <a
          href="mailto:support@latticebuild.com"
          className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group active:bg-[#F2F2F7]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-[#1677FF]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#171A1F] block">Email Support</span>
              <span className="text-[10px] text-[#68707C]">support@latticebuild.com</span>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#DDE1E7] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
        </a>

        <div className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group active:bg-[#F2F2F7]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-[#1677FF]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#171A1F] block">Live Chat</span>
              <span className="text-[10px] text-[#68707C]">Chat with an agent now</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Online</span>
            <ChevronRight className="w-4 h-4 text-[#DDE1E7] group-hover:text-[#1677FF] transition-colors" />
          </div>
        </div>

        <div className="w-full py-3 px-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group active:bg-[#F2F2F7]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-[#1677FF]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#171A1F] block">Knowledge Base</span>
              <span className="text-[10px] text-[#68707C]">Guides, tutorials & docs</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#DDE1E7] group-hover:text-[#1677FF] transition-colors flex-shrink-0" />
        </div>
      </div>

      {/* ─── FAQ Accordion ─── */}
      <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EAEDF1]">
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#9DA5B1]">Frequently Asked Questions</p>
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
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-[#1677FF] bg-[#EAF3FF] w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                  <span className="text-xs font-semibold text-[#171A1F] leading-snug">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 mt-0.5 ${
                  isExpanded ? 'rotate-180 text-[#1677FF]' : 'text-[#DDE1E7]'
                }`} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 animate-fade-in">
                  <div className="ml-8 p-3 bg-[#F7F8FA] rounded-xl border border-[#EAEDF1]">
                    <p className="text-xs text-[#68707C] leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Submit Ticket ─── */}
      <div className="bg-white border border-[#DDE1E7] rounded-2xl shadow-xs overflow-hidden">
        <div className="px-4 pt-3 pb-2 border-b border-[#EAEDF1]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#9DA5B1]">Submit a Support Ticket</p>
        </div>

        <div className="p-4">
          {ticketSent ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#171A1F]">Ticket Submitted!</p>
                <p className="text-xs text-emerald-700 mt-0.5">Ticket #8492 created. We'll respond within 15 minutes.</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span className="text-[10px] text-emerald-700 font-semibold">Avg. response: &lt;15 min</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="flex flex-col gap-3">
              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#68707C]">Subject <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Brief summary of your request"
                  className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white rounded-xl px-3 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none transition-colors"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#68707C]">Category</label>
                <div className="relative">
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full h-10 bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white rounded-xl pl-3 pr-9 text-xs text-[#171A1F] outline-none appearance-none cursor-pointer transition-colors"
                  >
                    <option value="Other">Other</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Budget & Cost Codes">Budget & Cost Codes</option>
                    <option value="Subcontractor & Staff">Subcontractor & Staff</option>
                    <option value="BuildScope AI & Takeoffs">BuildScope AI & Takeoffs</option>
                    <option value="Schedule & Milestones">Schedule & Milestones</option>
                    <option value="Daily Logs & Photos">Daily Logs & Photos</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9DA5B1] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#68707C]">Message <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  placeholder="Describe your issue or request in detail..."
                  className="w-full bg-[#F7F8FA] border border-[#DDE1E7] focus:border-[#1677FF] focus:bg-white rounded-xl p-3 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none resize-none transition-colors leading-relaxed"
                />
              </div>

              {/* Response time notice */}
              <div className="flex items-center gap-2 p-2.5 bg-[#F7F8FA] rounded-xl border border-[#EAEDF1]">
                <Zap className="w-3.5 h-3.5 text-[#1677FF] flex-shrink-0" />
                <span className="text-[10px] text-[#68707C]">Enterprise accounts typically receive responses within <strong className="text-[#171A1F]">15 minutes</strong>.</span>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Request</span>
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
};
