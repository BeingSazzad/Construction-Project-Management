import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  maxWidth?: string; // default 'max-w-[430px]'
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  maxWidth = 'max-w-[430px]',
  children,
  footer,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} max-h-[90vh] bg-white border border-[#DDE1E7] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Bar */}
        <div className="w-12 h-1 bg-[#DDE1E7] rounded-full mx-auto mt-2.5 mb-1" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EAEDF1]">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] border border-[#1677FF]/20 text-[#1677FF] flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h2 className="text-sm font-bold text-[#171A1F] tracking-tight">{title}</h2>
              {subtitle && <p className="text-[11px] text-[#68707C] font-medium">{subtitle}</p>}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] border border-[#DDE1E7] hover:bg-[#EAEDF1] text-[#68707C] hover:text-[#171A1F] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-130px)] scrollbar-thin">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-4 bg-[#F7F8FA] border-t border-[#EAEDF1] flex items-center gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

