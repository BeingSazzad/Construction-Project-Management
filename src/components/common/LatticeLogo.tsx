import React from 'react';

interface LatticeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  layout?: 'stacked' | 'horizontal' | 'icon-only';
  showTagline?: boolean;
  className?: string;
}

export const LatticeLogo: React.FC<LatticeLogoProps> = ({
  size = 'md',
  layout = 'horizontal',
  showTagline = false,
  className = ''
}) => {
  // SVG Icon sizes
  const iconSizeMap = {
    sm: { w: 26, h: 26 },
    md: { w: 34, h: 34 },
    lg: { w: 48, h: 48 },
    xl: { w: 68, h: 68 },
    hero: { w: 90, h: 90 }
  };

  const textClassMap = {
    sm: 'text-lg tracking-wider font-extrabold',
    md: 'text-xl tracking-wider font-extrabold',
    lg: 'text-2xl tracking-widest font-extrabold',
    xl: 'text-3xl tracking-widest font-extrabold',
    hero: 'text-4xl tracking-widest font-black'
  };

  const taglineClassMap = {
    sm: 'text-[9px] tracking-widest font-semibold',
    md: 'text-[11px] tracking-widest font-semibold',
    lg: 'text-xs tracking-widest font-bold',
    xl: 'text-sm tracking-widest font-bold',
    hero: 'text-sm tracking-[0.25em] font-extrabold'
  };

  const { w, h } = iconSizeMap[size];

  const IconSvg = (
    <svg 
      width={w} 
      height={h} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_12px_rgba(0,210,255,0.4)] flex-shrink-0"
    >
      <defs>
        <linearGradient id="latticeGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#00F0FF" />
        </linearGradient>
        <linearGradient id="latticeGradBottom" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0055EE" />
          <stop offset="100%" stopColor="#00D2FF" />
        </linearGradient>
      </defs>

      {/* Top diagonal pill bar */}
      <rect 
        x="32" 
        y="18" 
        width="54" 
        height="18" 
        rx="9" 
        transform="rotate(-26 32 18)" 
        fill="url(#latticeGradTop)" 
      />

      {/* Bottom diagonal pill bar */}
      <rect 
        x="44" 
        y="48" 
        width="54" 
        height="18" 
        rx="9" 
        transform="rotate(-26 44 48)" 
        fill="url(#latticeGradBottom)" 
      />
    </svg>
  );

  if (layout === 'icon-only') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{IconSvg}</div>;
  }

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <div className="mb-3">{IconSvg}</div>
        <div className={`text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#00D2FF] to-[#00F0FF] ${textClassMap[size]}`}>
          LATTICE
        </div>
        {showTagline && (
          <div className={`mt-1.5 text-cyan-400/90 uppercase ${taglineClassMap[size]}`}>
            BUILD BETTER. TOGETHER.
          </div>
        )}
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {IconSvg}
      <div className="flex flex-col">
        <span className={`text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 leading-none ${textClassMap[size]}`}>
          LATTICE
        </span>
        {showTagline && (
          <span className={`mt-1 text-cyan-400/80 uppercase ${taglineClassMap[size]}`}>
            BUILD BETTER. TOGETHER.
          </span>
        )}
      </div>
    </div>
  );
};
