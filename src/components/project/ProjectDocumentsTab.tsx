import React, { useState } from 'react';
import { Project, DocumentItem } from '../../types';
import { 
  FileText, Plus, Search, Eye, ArrowUpRight 
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

  const categories = ['All', 'Plans', 'Drawings', 'PDFs', 'Contracts', 'Logistics'];

  const filteredDocs = documents.filter(doc => {
    if (activeCategory !== 'All' && doc.category !== activeCategory) return false;
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="w-full flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] mx-auto text-slate-100 animate-fade-in">
      
      {/* 1. Header & Upload Action */}
      <div className="flex items-center justify-between border-b border-[#142036] pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Project Documents</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{documents.length} Archived Files</p>
        </div>

        <button
          onClick={onUploadDocument}
          className="h-8 px-3.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Upload</span>
        </button>
      </div>

      {/* 2. Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search blueprints, specs, contracts..."
          className="w-full h-11 bg-[#070D1A] border border-[#142036] rounded-xl pl-9 pr-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* 3. Standardized Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-[#2563EB] text-white font-bold shadow-md shadow-blue-500/20'
                : 'bg-[#070D1A] text-slate-400 hover:text-white border border-[#142036]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. Document Cards List */}
      <div className="flex flex-col gap-2.5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onPreviewDocument(doc)}
            className="p-3.5 rounded-2xl bg-[#070D1A] border border-[#142036] shadow-sm hover:border-blue-500/40 transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-[#0E1A33] border border-[#1E325A] text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors leading-tight">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                  {doc.category} • {doc.fileSize || '2.4 MB'}
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-xl bg-[#0E1A33] border border-[#1E325A] text-slate-400 group-hover:text-white flex items-center justify-center flex-shrink-0">
              <ArrowUpRight className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
