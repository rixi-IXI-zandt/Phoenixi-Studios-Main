import React from 'react';

interface PhoenixiLogoProps {
  className?: string;
  showWings?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const PhoenixiLogo: React.FC<PhoenixiLogoProps> = ({
  className = '',
  showWings = true,
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: { iconHeight: 28, fontSize: 'text-sm', ixiSize: 'text-[10px]' },
    md: { iconHeight: 36, fontSize: 'text-base', ixiSize: 'text-xs' },
    lg: { iconHeight: 48, fontSize: 'text-xl', ixiSize: 'text-sm' },
    xl: { iconHeight: 64, fontSize: 'text-2xl', ixiSize: 'text-base' },
  };

  const dims = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Mark SVG (Prismatic Diamond Crystal + Art Deco Wings) */}
      <div className="relative flex flex-col items-center justify-center shrink-0">
        <svg
          height={dims.iconHeight}
          viewBox="0 0 200 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_12px_rgba(226,179,255,0.3)]"
        >
          {/* Geometric Wings (Mint #B8FFD9) */}
          {showWings && (
            <g stroke="#B8FFD9" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
              {/* Left Wing Stepped Deco Lines */}
              <path d="M 90 75 L 30 75 L 20 82 L 85 82" />
              <path d="M 85 87 L 40 87 L 32 94 L 80 94" />
              <path d="M 80 99 L 52 99 L 46 105 L 75 105" />

              {/* Right Wing Stepped Deco Lines */}
              <path d="M 110 75 L 170 75 L 180 82 L 115 82" />
              <path d="M 115 87 L 160 87 L 168 94 L 120 94" />
              <path d="M 120 99 L 148 99 L 154 105 L 125 105" />
            </g>
          )}

          {/* Prismatic Diamond Crystal (Lavender #E2B3FF & Periwinkle #9B6BFF) */}
          <g stroke="#E2B3FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Outer Diamond Facets */}
            <polygon points="100,10 135,45 100,100 65,45" fill="rgba(226, 179, 255, 0.08)" />
            
            {/* Top Crown Facets */}
            <line x1="100" y1="10" x2="100" y2="100" stroke="#6EF0FF" strokeWidth="2" />
            <line x1="100" y1="10" x2="80" y2="45" stroke="#E2B3FF" />
            <line x1="100" y1="10" x2="120" y2="45" stroke="#E2B3FF" />
            
            {/* Horizontal Crown Line */}
            <line x1="65" y1="45" x2="135" y2="45" stroke="#9B6BFF" strokeWidth="2" />

            {/* Bottom Pavilion Lines */}
            <line x1="80" y1="45" x2="100" y2="100" stroke="#B8FFD9" />
            <line x1="120" y1="45" x2="100" y2="100" stroke="#B8FFD9" />
          </g>

          {/* IXI Mark Base Accent */}
          <text
            x="100"
            y="124"
            textAnchor="middle"
            fill="#E2B3FF"
            fontSize="14"
            fontWeight="900"
            letterSpacing="2"
            fontFamily="'Montserrat', 'Cinzel', sans-serif"
          >
            IXI
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-artdeco font-bold tracking-[0.2em] text-white ${dims.fontSize} drop-shadow-[0_2px_8px_rgba(110,240,255,0.2)]`}
              style={{ fontFamily: "'Cinzel', 'Montserrat', serif" }}
            >
              PHOENIXI
            </span>
            <span
              className={`font-sans font-light tracking-[0.25em] text-[#6EF0FF] ${dims.fontSize}`}
            >
              STUDIOS
            </span>
          </div>
          <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#E2B3FF]/80">
            Create • Imagine • Build
          </span>
        </div>
      )}
    </div>
  );
};

export const IXIMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`font-mono font-black tracking-widest text-[#E2B3FF] px-2 py-0.5 rounded border border-[#E2B3FF]/30 bg-[#9B6BFF]/10 text-xs ${className}`}
  >
    |X|
  </span>
);
