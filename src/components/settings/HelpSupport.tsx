import React, { useState } from 'react';
import { 
  ChevronLeft, Phone, Mail, HelpCircle, ChevronDown,
  CheckCircle2, Send 
} from 'lucide-react';
import { Button } from '../common/Button';

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
      q: 'How do I add a new CSI cost code line item to my budget?',
      a: 'Navigate to the project Budget tab, click "+ Add Code" at the top right, select the MasterFormat division (e.g. Division 03 Concrete), enter estimated cost, and click save.'
    },
    {
      q: 'Can field superintendents log site photos without cellular signal?',
      a: 'Yes! The mobile app automatically caches uploaded site photos and punch list entries locally, syncing them to the cloud as soon as network connectivity is restored.'
    },
    {
      q: 'How do I export weekly executive project reports to PDF?',
      a: 'Go to the Reports tab in any project workspace, select "Project Progress Report", and click the "Export PDF" button to download a formatted handoff report.'
    },
    {
      q: 'How does Latti AI detect schedule critical path risks?',
      a: 'Latti AI analyzes task dependencies in your Gantt chart, tracking daily crew check-ins and inspection signoffs to alert you when predecessor milestones risk slipping.'
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
    }, 4000);
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaq(prev => prev === idx ? null : idx);
  };

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-[#162033]">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-[#0D1424] hover:bg-[#141F33] border border-[#1A263E] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Help & Support</h1>
          <p className="text-xs text-slate-400 font-medium">24/7 Enterprise Jobsite Assistance</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Contact Hotline & Support Email */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href="tel:+18005558900"
            className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] hover:border-blue-500/40 flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-1.5">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Call Hotline</span>
            <span className="text-xs text-slate-400 mt-0.5 font-medium">1-800-555-8900</span>
          </a>

          <a
            href="mailto:support@latticebuild.com"
            className="p-3.5 rounded-2xl bg-[#0D1424] border border-[#1A263E] hover:border-blue-500/40 flex flex-col items-center text-center cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-1.5">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Email Support</span>
            <span className="text-xs text-slate-400 mt-0.5 font-medium">support@latticebuild.com</span>
          </a>
        </div>

        {/* Clean Hairline Accordion FAQs (Refined typography, zero bold overload) */}
        <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-0.5">
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col border-t border-[#141F33]">
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="border-b border-[#141F33] last:border-b-0 py-2.5 transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-2 py-1.5 text-left flex items-start justify-between gap-3 hover:bg-[#090E1A] rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white leading-snug">
                        {faq.q}
                      </span>
                    </div>

                    <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 mt-0.5 ${
                      isExpanded ? 'rotate-180 text-blue-400' : ''
                    }`} />
                  </button>

                  {isExpanded && (
                    <div className="px-8 pt-1.5 pb-2 text-xs text-slate-400 leading-relaxed font-normal animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Ticket Form (Exact Matching Reference Screenshot) */}
        <div className="p-4 rounded-3xl bg-[#0D1424] border border-[#1A263E] shadow-sm flex flex-col gap-3.5">
          {ticketSent ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-bold text-white">Support Request Sent</p>
                <p className="text-[11px] text-emerald-300/80 mt-0.5">Ticket #8492 created. Our team will respond within 15 minutes.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="flex flex-col gap-3.5">
              {/* 1. Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Brief summary of your request"
                  className="w-full h-10 bg-[#080D18] border border-[#1A263E] focus:border-blue-500 rounded-xl px-3.5 text-xs text-white placeholder-slate-500 outline-none transition-colors shadow-inner"
                />
              </div>

              {/* 2. Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full h-10 bg-[#080D18] border border-[#1A263E] focus:border-blue-500 rounded-xl pl-3.5 pr-9 text-xs text-white outline-none appearance-none cursor-pointer transition-colors shadow-inner"
                  >
                    <option value="Other">Other</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Budget & Cost Codes">Budget & Cost Codes</option>
                    <option value="Subcontractor & Staff">Subcontractor & Staff</option>
                    <option value="BuildScope AI & Takeoffs">BuildScope AI & Takeoffs</option>
                    <option value="Schedule & Milestones">Schedule & Milestones</option>
                    <option value="Daily Logs & Photos">Daily Logs & Photos</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 3. Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  placeholder="Describe your issue or request in detail..."
                  className="w-full bg-[#080D18] border border-[#1A263E] focus:border-blue-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none resize-none transition-colors shadow-inner leading-relaxed"
                />
              </div>

              {/* 4. Submit Request Button */}
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#1D4ED8] to-[#0D9488] hover:from-[#2563EB] hover:to-[#14B8A6] text-white text-xs font-bold shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
