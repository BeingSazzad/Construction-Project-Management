import React from 'react';
import { DocumentItem } from '../../types';
import { X, FileText, Download, Share2, Layers, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="card-dark w-full max-w-[390px] bg-[#0E1524] border-cyan-500/40 p-5 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2A44] mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600/20 text-cyan-400 px-2 py-0.5 rounded">
              {document.category}
            </span>
            <span className="text-[10px] font-mono bg-[#162033] text-slate-300 px-1.5 py-0.5 rounded">
              {document.version}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#162033] text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-sm font-black text-white mb-1">{document.title}</h3>
        <p className="text-xs text-slate-400 mb-4">{document.uploadedBy} • {document.fileSize}</p>

        {/* Construction Blueprint Schematic Simulation */}
        <div className="h-56 rounded-2xl bg-[#08152B] border-2 border-dashed border-cyan-500/40 p-4 mb-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start text-[10px] font-mono text-cyan-400/80">
            <div>
              <span>DWG-SHEET S-204</span>
              <div className="text-slate-400">SCALE: 1/4" = 1'-0"</div>
            </div>
            <div className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>STAMP APPROVED</span>
            </div>
          </div>

          {/* Grid lines blueprint aesthetic */}
          <div className="my-auto flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 border-2 border-cyan-400/40 rounded-xl relative flex items-center justify-center">
              <div className="absolute w-full h-[1px] bg-cyan-400/30"></div>
              <div className="absolute h-full w-[1px] bg-cyan-400/30"></div>
              <div className="w-10 h-10 border border-cyan-300 rounded-lg"></div>
            </div>
            <span className="text-[10px] text-cyan-300 font-mono mt-2">LEVEL 12 ELEVATED SLAB REBAR SPACING</span>
          </div>

          <div className="flex justify-between text-[9px] text-slate-400 font-mono">
            <span>ISSUED FOR CONSTRUCTION</span>
            <span>REV DATE: MAY 17, 2025</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="primary"
            onClick={() => alert(`Downloading ${document.title}...`)}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download High-Res PDF ({document.fileSize})
          </Button>

          <Button
            variant="secondary"
            onClick={() => alert("Shareable link generated for field trades.")}
            leftIcon={<Share2 className="w-4 h-4" />}
          >
            Share with Subcontractor
          </Button>
        </div>
      </div>
    </div>
  );
};
