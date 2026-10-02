import React from 'react';

interface HolographicVinylProps {
  isSpinning?: boolean;
  size?: number; // size in px
  albumTitle?: string;
  artist?: string;
  speed?: '33' | '45' | '78';
  className?: string;
}

export const HolographicVinyl: React.FC<HolographicVinylProps> = ({
  isSpinning = false,
  size = 480,
  albumTitle = 'SYNTHETICA MASTER',
  artist = 'ACERVO CULTURAL',
  speed = '33',
  className = '',
}) => {
  const shouldSpin = isSpinning;
  const duration = speed === '78' ? '1.2s' : speed === '45' ? '1.8s' : '2.5s';

  return (
    <div
      className={`relative select-none pointer-events-none aspect-square ${className}`}
      style={{
        width: className.includes('w-') ? undefined : size,
        height: className.includes('h-') ? undefined : size,
      }}
    >
      <style>{`
        @keyframes spinVinylRecord {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Outer subtle glow/shadow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(94,234,212,0.3) 0%, rgba(192,132,252,0.25) 50%, rgba(244,114,182,0.2) 100%)',
          opacity: isSpinning ? 0.7 : 0.35,
        }}
      />

      {/* Main Spinning Vinyl Disc */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden shadow-2xl player-motion"
        style={{
          animation: `spinVinylRecord ${duration} linear infinite`,
          animationPlayState: shouldSpin ? 'running' : 'paused',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(94, 234, 212, 0.25)',
        }}
      >
        {/* Holographic Iridescent Base Layer with Conic Gradient */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              conic-gradient(
                from 0deg,
                #2dd4bf 0deg,
                #818cf8 45deg,
                #c084fc 90deg,
                #f472b6 135deg,
                #2dd4bf 180deg,
                #818cf8 225deg,
                #c084fc 270deg,
                #f472b6 315deg,
                #2dd4bf 360deg
              )
            `,
            opacity: 0.85,
          }}
        />

        {/* Micro-Grooves Overlay with concentric transparent rings */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="grooveShine" cx="50%" cy="50%" r="50%">
              <stop offset="25%" stopColor="#000" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#fff" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#000" stopOpacity="0.75" />
              <stop offset="65%" stopColor="#fff" stopOpacity="0.1" />
              <stop offset="80%" stopColor="#000" stopOpacity="0.8" />
              <stop offset="95%" stopColor="#000" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.95" />
            </radialGradient>
            <filter id="holographicNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="noise" />
              <feColorMatrix type="saturate" values="0.2" />
              <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
            </filter>
          </defs>

          {/* Dark Vinyl Grooves Masking */}
          <circle cx="50" cy="50" r="49" fill="url(#grooveShine)" />

          {/* Multiple Fine Micro-Groove Circles */}
          {[22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48].map((radius, i) => (
            <circle
              key={radius}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={i % 3 === 0 ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.45)'}
              strokeWidth={i % 4 === 0 ? '0.25' : '0.15'}
            />
          ))}

          {/* Light Beams (Anamorphic reflection lines typical of shiny vinyl) */}
          <path
            d="M 50 50 L 15 5 A 49 49 0 0 1 85 5 Z"
            fill="rgba(255,255,255,0.22)"
            style={{ mixBlendMode: 'overlay' }}
          />
          <path
            d="M 50 50 L 85 95 A 49 49 0 0 1 15 95 Z"
            fill="rgba(255,255,255,0.22)"
            style={{ mixBlendMode: 'overlay' }}
          />
        </svg>

        {/* Outer Rim Lip */}
        <div className="absolute inset-0 rounded-full border-4 border-white/20" />

        {/* Center Pastel Pink Label (Matching wireframe pink: #EFAEC4) */}
        <div
          className="absolute inset-[33%] rounded-full flex flex-col items-center justify-center text-center p-3 shadow-inner"
          style={{
            backgroundColor: '#EFAEC4',
            border: '2px solid rgba(255, 255, 255, 0.6)',
          }}
        >
          {/* Label concentric ring */}
          <div className="absolute inset-2 rounded-full border border-[#d685a1]/40 pointer-events-none" />

          <span
            className="text-[9px] font-black tracking-widest text-[#153833] uppercase line-clamp-1 max-w-[80%]"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            {albumTitle}
          </span>
          <span className="text-[7.5px] font-semibold text-[#153833]/80 tracking-wider mt-0.5 line-clamp-1 max-w-[85%]">
            {artist}
          </span>
          <span className="text-[6.5px] font-mono font-bold text-[#153833]/60 mt-1 uppercase">
            {speed} ⅓ RPM • STEREO
          </span>

          {/* Center Spindle Hole */}
          <div className="w-4 h-4 rounded-full bg-[#153833] border-2 border-white/80 shadow-md mt-1" />
        </div>
      </div>

      {/* Static Glass Specular Highlight Overlay (does not spin with vinyl) */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.3) 100%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};
