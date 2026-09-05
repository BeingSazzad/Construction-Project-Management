import React, { useState, useEffect } from 'react';
import { Project, DocumentItem, SitePhoto } from '../../types';
import { FileText, Camera, Upload, Plus } from 'lucide-react';
import { ProjectDocumentsTab } from './ProjectDocumentsTab';
import { ProjectPhotosTab } from './ProjectPhotosTab';

interface ProjectFilesTabProps {
  project: Project;
  documents?: DocumentItem[];
  photos?: SitePhoto[];
  initialSubTab?: 'documents' | 'photos';
  onUploadDocument?: (doc?: any) => void;
  onPreviewDocument?: (doc: any) => void;
  onUploadPhoto?: () => void;
  onPreviewPhoto?: (photo: any) => void;
}

export const ProjectFilesTab: React.FC<ProjectFilesTabProps> = ({
  project,
  documents = [],
  photos = [],
  initialSubTab = 'documents',
  onUploadDocument,
  onPreviewDocument,
  onUploadPhoto,
  onPreviewPhoto
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'documents' | 'photos'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  return (
    <div className="w-full flex-1 flex flex-col font-sans max-w-[430px] md:max-w-2xl mx-auto text-[#0F172A] animate-fade-in">
      {/* Top Segmented Sub-View Switcher */}
      <div className="px-5 pt-3 pb-1 bg-[#F8FAFC]">
        <div className="flex items-center p-1 rounded-2xl bg-[#E2E8F0]/70 border border-[#E2E8F0]">
          <button
            onClick={() => setActiveSubTab('documents')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'documents'
                ? 'bg-white text-[#1677FF] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documents ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('photos')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'photos'
                ? 'bg-white text-[#1677FF] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photos ({photos.length})</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Content Rendering */}
      <div className="flex-1">
        {activeSubTab === 'documents' ? (
          <ProjectDocumentsTab
            project={project}
            documents={documents}
            onUploadDocument={onUploadDocument}
            onPreviewDocument={onPreviewDocument}
          />
        ) : (
          <ProjectPhotosTab
            project={project}
            photos={photos}
            onUploadPhoto={onUploadPhoto}
            onPreviewPhoto={onPreviewPhoto}
          />
        )}
      </div>
    </div>
  );
};
