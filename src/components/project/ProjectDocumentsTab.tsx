import React, { useState } from 'react';
import { Project, DocumentItem } from '../../types';
import { 
  FileText, Plus, Search, ArrowUpRight 
} from 'lucide-react';

interface ProjectDocumentsTabProps {
  project: Project;
  documents: DocumentItem[];
  onUploadDocument: () => void;
  onPreviewDocument: (doc: DocumentItem) => void;
}

export const ProjectDocumentsTab: React.FC<ProjectDocumentsTabProps> = ({
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
    <div className="w-full flex-1 flex flex-col gap-4 px-5 py-4 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#171A1F] bg-[#F2F2F7] animate-fade-in">
      
      {/* 1. Header & Upload Action */}
      <div className="flex items-center justify-between border-b border-[#EAEDF1] pb-3">
        <div>
          <h2 className="text-base font-bold text-[#171A1F] tracking-tight">Project Documents</h2>
          <p className="text-xs text-[#68707C] mt-0.5 font-medium">{documents.length} Archived Files</p>
        </div>

        <button
          onClick={onUploadDocument}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1677FF] hover:bg-[#0958D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {/* 2. Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#68707C] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search blueprints, specs, contracts..."
          className="w-full h-11 bg-white border border-[#DDE1E7] rounded-xl pl-9 pr-3.5 text-xs text-[#171A1F] placeholder-[#9DA5B1] outline-none focus:border-[#1677FF] transition-colors shadow-xs"
        />
      </div>

      {/* 3. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
              activeCategory === cat
                ? 'bg-[#1677FF] border-[#1677FF] text-white font-bold shadow-xs'
                : 'bg-white text-[#68707C] hover:text-[#171A1F] hover:bg-[#F2F2F7] border-[#DDE1E7]'
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
            className="p-3.5 rounded-2xl bg-white border border-[#DDE1E7] shadow-xs hover:border-[#1677FF]/40 transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-bold text-[#171A1F] truncate group-hover:text-[#1677FF] transition-colors leading-tight">
                  {doc.title}
                </h3>
                <p className="text-xs text-[#68707C] truncate mt-0.5 font-medium">
                  {doc.category} • {doc.fileSize || '2.4 MB'}
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-xl bg-[#F2F2F7] border border-[#DDE1E7] text-[#68707C] group-hover:text-[#1677FF] flex items-center justify-center flex-shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
