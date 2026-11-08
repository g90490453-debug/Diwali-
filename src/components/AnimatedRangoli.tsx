import React from 'react';

interface AnimatedRangoliProps {
  size?: number;
  className?: string;
  isLit?: boolean;
}

export const AnimatedRangoli: React.FC<AnimatedRangoliProps> = ({
  size = 380,
  className = '',
  isLit = true,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-1000 ${
          isLit
            ? 'bg-radial from-amber-500/25 via-amber-700/10 to-transparent blur-2xl scale-125'
            : 'bg-radial from-amber-900/15 via-transparent to-transparent blur-xl scale-100'
        }`}
      />

      {/* Rotating intricate Rangoli Mandala SVG */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full animate-rangoli-spin origin-center"
        style={{
          filter: isLit
            ? 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.45))'
            : 'drop-shadow(0 0 5px rgba(217, 119, 6, 0.2))',
          transition: 'filter 1s ease',
        }}
      >
        <defs>
          <linearGradient id="goldGradientRangoli" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#fbbf24" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <linearGradient id="rubyGradientRangoli" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>

          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer concentric rings */}
        <circle cx="200" cy="200" r="190" fill="none" stroke="url(#goldGradientRangoli)" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
        <circle cx="200" cy="200" r="178" fill="none" stroke="url(#goldGradientRangoli)" strokeWidth="1.5" opacity="0.8" />
        <circle cx="200" cy="200" r="162" fill="none" stroke="url(#rubyGradientRangoli)" strokeWidth="2" opacity="0.7" />

        {/* 16 Outer Decorative Lotus Petals */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={`outer-petal-${i}`} transform={`rotate(${angle} 200 200)`}>
              <path
                d="M 200 22 C 185 60 175 105 200 135 C 225 105 215 60 200 22 Z"
                fill="url(#goldGradientRangoli)"
                fillOpacity="0.12"
                stroke="url(#goldGradientRangoli)"
                strokeWidth="1.2"
              />
              <circle cx="200" cy="24" r="3.5" fill="#fde047" />
              <path
                d="M 200 45 C 193 65 190 90 200 110 C 210 90 207 65 200 45 Z"
                fill="url(#rubyGradientRangoli)"
                fillOpacity="0.25"
                stroke="url(#rubyGradientRangoli)"
                strokeWidth="0.8"
              />
            </g>
          );
        })}

        {/* Middle circular filigree band */}
        <circle cx="200" cy="200" r="128" fill="none" stroke="url(#goldGradientRangoli)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="118" fill="none" stroke="url(#goldGradientRangoli)" strokeWidth="0.8" strokeDasharray="2 3" />

        {/* 8 Sacred Diya holder motifs in middle ring */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8 + 22.5;
          return (
            <g key={`mid-motif-${i}`} transform={`rotate(${angle} 200 200)`}>
              <path
                d="M 200 80 C 180 100 185 125 200 130 C 215 125 220 100 200 80 Z"
                fill="none"
                stroke="url(#goldGradientRangoli)"
                strokeWidth="1.5"
              />
              <circle cx="200" cy="95" r="4" fill="#fbbf24" opacity="0.9" />
              <line x1="200" y1="70" x2="200" y2="80" stroke="url(#goldGradientRangoli)" strokeWidth="1.5" />
            </g>
          );
        })}

        {/* Inner 8-point geometric star */}
        <polygon
          points="200,90 225,145 285,145 238,180 256,238 200,205 144,238 162,180 115,145 175,145"
          fill="none"
          stroke="url(#goldGradientRangoli)"
          strokeWidth="1.2"
          opacity="0.75"
        />
        <polygon
          points="200,90 225,145 285,145 238,180 256,238 200,205 144,238 162,180 115,145 175,145"
          transform="rotate(22.5 200 200)"
          fill="none"
          stroke="url(#rubyGradientRangoli)"
          strokeWidth="0.9"
          opacity="0.6"
        />

        {/* Inner lotus ring */}
        <circle cx="200" cy="200" r="55" fill="none" stroke="url(#goldGradientRangoli)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="45" fill="url(#centerGlow)" />

        {/* Sacred floral center core */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <path
              key={`inner-petal-${i}`}
              d="M 200 160 C 192 175 192 185 200 190 C 208 185 208 175 200 160 Z"
              fill="url(#goldGradientRangoli)"
              transform={`rotate(${angle} 200 200)`}
              opacity="0.85"
            />
          );
        })}
        <circle cx="200" cy="200" r="7" fill="#fef08a" />
      </svg>
    </div>
  );
};
