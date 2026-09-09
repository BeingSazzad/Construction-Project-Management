import React, { useState } from 'react';
import { Project, DocumentItem } from '../../types';
import { 
  FileText, Search, Upload, X
} from 'lucide-react';

interface ProjectDocumentsTabProps {
  project: Project;
  documents: DocumentItem[];
  onUploadDocument?: () => void;
  onPreviewDocument: (doc: DocumentItem) => void;
}

export const ProjectDocumentsTab: React.FC<ProjectDocumentsTabProps> = ({
  project,
  documents = [],
  onUploadDocument,
  onPreviewDocument
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Plans',
    'Contracts',
    'Permits',
    'Selections',
    'Receipts & Invoices',
    'Drawings',
    'Field Reports'
  ];

  const filteredDocs = documents.filter(doc => {
    if (activeCategory !== 'All') {
      const docCat = (doc.category || '').toLowerCase();
      const activeCat = activeCategory.toLowerCase();
      if (activeCategory === 'Receipts & Invoices') {
        if (!docCat.includes('receipt') && !docCat.includes('invoice')) return false;
      } else if (docCat !== activeCat) {
        return false;
      }
    }
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="w-full flex-1 flex flex-col gap-3.5 px-5 py-3.5 pb-28 font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      
      {/* 1. Header & Upload Action */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">Project Documents</h2>
          <p className="text-xs text-[#64748B] mt-0.5 font-medium">{documents.length} Archived Files</p>
        </div>

        {onUploadDocument && (
        <button
          onClick={onUploadDocument}
          className="h-9 px-3.5 rounded-xl bg-[#1677FF] hover:bg-[#1677FF]/90 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
        )}
      </div>

      {/* 2. Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search blueprints, specs, contracts..."
          className="w-full h-11 bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-9 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#1677FF] transition-colors shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap border ${
              activeCategory === cat
                ? 'bg-[#1677FF] border-[#1677FF] text-white font-bold shadow-2xs'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] border-[#E2E8F0] font-medium'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. Document Cards List (Standard Sizing: 13px Title, 12px Subtitle, 36px Icon) */}
      {filteredDocs.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onPreviewDocument(doc)}
              className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-card hover:border-[#1677FF]/40 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group active:scale-[0.99]"
            >
              <div className="w-9 h-9 rounded-xl bg-[#1677FF]/10 border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-4.5 h-4.5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-[#0F172A] truncate group-hover:text-[#1677FF] transition-colors leading-snug">
                  {doc.title}
                </h3>
                <p className="text-xs text-[#64748B] truncate mt-0.5 font-normal">
                  {doc.category} • {doc.fileSize || '2.4 MB'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 text-center flex flex-col items-center justify-center gap-2 shadow-card my-2">
          <div className="w-11 h-11 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8]">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-[#0F172A]">No documents found</h4>
          <p className="text-xs text-[#64748B] max-w-xs">
            {searchQuery ? `No documents matching "${searchQuery}"` : 'No documents in this category yet.'}
          </p>
        </div>
      )}
    </div>
  );
};
