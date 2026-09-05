import React from 'react';
import { DocumentItem } from '../../types';
import { X, Download, Share2, CheckCircle2 } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-[390px] bg-white border border-[#DDE1E7] p-5 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto text-[#171A1F]">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAEDF1] mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EAF3FF] text-[#1677FF] px-2.5 py-0.5 rounded-lg border border-[#1677FF]/20">
              {document.category}
            </span>
            <span className="text-[10px] font-mono bg-[#F2F2F7] text-[#171A1F] border border-[#DDE1E7] px-2 py-0.5 rounded-md font-semibold">
              {document.version}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-sm font-bold text-[#171A1F] mb-1">{document.title}</h3>
        <p className="text-xs text-[#68707C] mb-4 font-medium">{document.uploadedBy} • {document.fileSize}</p>

        {/* Construction Blueprint Schematic Simulation (Light Architectural Grid) */}
        <div className="h-56 rounded-2xl bg-[#F7F8FA] border-2 border-dashed border-[#DDE1E7] p-4 mb-4 relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start text-[10px] font-mono text-[#68707C]">
            <div>
              <span className="font-bold text-[#171A1F]">DWG-SHEET S-204</span>
              <div>SCALE: 1/4" = 1'-0"</div>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>STAMP APPROVED</span>
            </div>
          </div>

          {/* Grid lines blueprint aesthetic */}
          <div className="my-auto flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 border-2 border-[#1677FF]/40 rounded-xl relative flex items-center justify-center bg-white shadow-xs">
              <div className="absolute w-full h-[1px] bg-[#1677FF]/20"></div>
              <div className="absolute h-full w-[1px] bg-[#1677FF]/20"></div>
              <div className="w-10 h-10 border border-[#1677FF] rounded-lg"></div>
            </div>
            <span className="text-[10px] text-[#1677FF] font-mono font-bold mt-2">LEVEL 12 ELEVATED SLAB REBAR SPACING</span>
          </div>

          <div className="flex justify-between text-[10px] text-[#68707C] font-mono">
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
