// src/components/ui/PlanetCircle.jsx
import React from 'react';

const PLANET_SVG = {
  Soleil: (
    <g>
      <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M14 2L14 5M14 23L14 26M2 14L5 14M23 14L26 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5.5 5.5L7.6 7.6M20.4 20.4L22.5 22.5M22.5 5.5L20.4 7.6M7.6 20.4L5.5 22.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </g>
  ),
  Lune: (
    <g>
      <path d="M22 22C16 24 8 20 6 14C4 8 8 2 14 2C10 4 8 8 8 14C8 20 12 22 22 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    </g>
  ),
  Mercure: (
    <g>
      <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M8 20L20 20M14 16L14 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 24C14 24 11 26 14 26C17 26 14 24 14 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M10 16L12 20M18 16L16 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </g>
  ),
  Vénus: (
    <g>
      <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M14 16L14 24M10 20L18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  Mars: (
    <g>
      <circle cx="14" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M21 4L20 8M18 6L22 6M14 14L21 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 4L22 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </g>
  ),
  Jupiter: (
    <g>
      <path d="M8 14C8 10 11 8 14 10C17 8 20 10 20 14C20 18 17 20 14 18C11 20 8 18 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <path d="M14 18L14 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 24L18 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </g>
  ),
  Saturne: (
    <g>
      <path d="M8 8C8 6 10 4 12 8C14 4 16 6 16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M8 12L8 20C8 22 12 22 12 20L12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M6 16L18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="14" cy="24" rx="5" ry="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </g>
  ),
  Uranus: (
    <g>
      <circle cx="14" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M14 16L14 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 22L18 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M8 6L10 10M12 4L14 10M16 4L18 10M20 6L18 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </g>
  ),
  Neptune: (
    <g>
      <circle cx="14" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M14 14L14 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 22L18 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M10 8L18 14M18 8L10 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </g>
  ),
  Pluton: (
    <g>
      <circle cx="14" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M14 14L14 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 22C10 24 18 24 18 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M14 20C14 22 12 24 14 24C16 24 14 22 14 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </g>
  ),
};

const SIZES = {
  sm: { container: 'w-8 h-8', viewBox: '0 0 28 28', size: 18 },
  md: { container: 'w-10 h-10', viewBox: '0 0 28 28', size: 24 },
  lg: { container: 'w-16 h-16', viewBox: '0 0 28 28', size: 40 },
};

export default function PlanetCircle({ planete, symbole, couleur, size = 'md', active = false }) {
  const svgContent = PLANET_SVG[planete];
  const sizeConfig = SIZES[size] || SIZES.md;

  return (
    <div
      className={`rounded-full bg-[#141731] border flex items-center justify-center shrink-0 ${sizeConfig.container}`}
      style={{
        borderColor: active ? '#C9A460' : '#252848',
      }}
    >
      {svgContent ? (
        <svg
          viewBox={sizeConfig.viewBox}
          width={sizeConfig.size}
          height={sizeConfig.size}
          style={{ color: couleur || '#C9A460' }}
        >
          {svgContent}
        </svg>
      ) : (
        <span className="font-serif" style={{ color: couleur || '#C9A460', fontSize: sizeConfig.size * 0.7 }}>
          {symbole || '★'}
        </span>
      )}
    </div>
  );
}