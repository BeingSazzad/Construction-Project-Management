import React, { useState } from 'react';
import { Project, DocumentItem } from '../../types';
import { 
  FileText, Plus, Search, Download, Eye, 
  Layers, ShieldCheck, FileCheck, ArrowUpRight 
} from 'lucide-react';

interface ProjectDocumentsTabProps {
  project: Project;
  documents: DocumentItem[];
  onUploadDocument: () => void;
  onPreviewDocument: (doc: DocumentItem) => void;
}

export const ProjectDocumentsTab: React.FC<ProjectDocumentsTabProps> = ({
  project,
  documents,
  onUploadDocument,
  onPreviewDocument
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Plans', 'Drawings', 'PDFs', 'Contracts', 'Site Logistics'];

  const filteredDocs = documents.filter(doc => {
    if (activeCategory !== 'All' && doc.category !== activeCategory) return false;
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Search & Upload Action Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blueprints, submittals..."
            className="w-full h-10 bg-[#111827] border border-[#23334F] rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button
          onClick={onUploadDocument}
          className="h-10 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-[#101726] rounded-xl border border-[#1C2A44] overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Document Items List */}
      <div className="flex flex-col gap-2.5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onPreviewDocument(doc)}
            className="card-dark p-3.5 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {doc.title}
                  </h4>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-[#1C2A44] text-cyan-300 px-1.5 py-0.5 rounded">
                    {doc.version}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{doc.fileSize}</span>
                  <span>•</span>
                  <span className="truncate">{doc.uploadedBy}</span>
                  <span>•</span>
                  <span>{doc.uploadDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewDocument(doc);
                }}
                className="p-2 rounded-lg bg-[#162238] hover:bg-[#1E2E4B] text-slate-300 hover:text-cyan-400"
                title="Preview Document"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
