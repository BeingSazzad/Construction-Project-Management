import React, { useState } from 'react';
import { 
  ChevronLeft, Phone, Mail, HelpCircle, FileText, 
  MessageSquare, ExternalLink, CheckCircle2, Search, Send 
} from 'lucide-react';
import { Button } from '../common/Button';

interface HelpSupportProps {
  onBack: () => void;
}

export const HelpSupport: React.FC<HelpSupportProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const faqs = [
    {
      q: 'How do I add a new CSI cost code line item to my budget?',
      a: 'Navigate to the project Budget tab, click "+ Add Code" at the top right, select the MasterFormat division (e.g. Division 03 Concrete), enter estimated cost, and click save.'
    },
    {
      q: 'Can field superintendents log site photos without cellular signal?',
      a: 'Yes! The Lattice mobile web app automatically caches uploaded site photos and punch list entries locally, syncing them to the cloud as soon as network connectivity is restored.'
    },
    {
      q: 'How do I export weekly executive project reports to PDF?',
      a: 'Go to the Reports tab in any project workspace, select "Project Progress Report (May 2025)", and click the "Export PDF" button to download a formatted handoff report.'
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
      setTicketMsg('');
      setTicketSent(false);
    }, 4000);
  };

  return (
    <div className="w-full min-h-screen bg-[#070A12] text-slate-200 p-5 font-sans pb-24">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#162033]">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-[#0D1422] border border-[#1A263B] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-extrabold text-white">Help & Support</h1>
          <p className="text-[11px] text-slate-400">24/7 Enterprise Jobsite Assistance</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Contact Hotline & Support Email */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href="tel:+18005558900"
            className="card-dark p-3 bg-[#0D1422] border-[#1A263B] hover:border-blue-500 flex flex-col items-center text-center cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-1.5">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Call Hotline</span>
            <span className="text-[10px] text-slate-400">1-800-555-8900</span>
          </a>

          <a
            href="mailto:support@latticebuild.com"
            className="card-dark p-3 bg-[#0D1422] border-[#1A263B] hover:border-blue-500 flex flex-col items-center text-center cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-1.5">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white">Email Support</span>
            <span className="text-[10px] text-slate-400">support@latticebuild.com</span>
          </a>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
            Frequently Asked Questions
          </h2>

          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card-dark p-3 bg-[#0D1422] border-[#1A263B] text-xs">
                <h3 className="font-bold text-white mb-1 flex items-start gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-slate-300 pl-5 leading-relaxed text-[11px]">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Ticket Form */}
        <div className="card-dark p-4 bg-[#0D1422] border-[#1A263B]">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2">
            Submit Support Ticket
          </h2>

          {ticketSent ? (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Ticket #8492 received. An engineer will respond within 15 minutes.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-2.5">
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Issue Subject (e.g. Gantt timeline export issue)"
                className="w-full h-10 bg-[#080D18] border border-[#182438] rounded-xl px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <textarea
                required
                rows={3}
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                placeholder="Describe your question or technical issue..."
                className="w-full bg-[#080D18] border border-[#182438] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
              <Button variant="primary" type="submit" leftIcon={<Send className="w-3.5 h-3.5" />}>
                Submit Priority Ticket
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
