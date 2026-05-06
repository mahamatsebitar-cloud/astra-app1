// src/components/ui/ZodiacSymbol.jsx
import React from 'react';

const SYMBOLS_SVG = {
  Bélier: (
    <g>
      <path d="M10 16C10 16 12 8 14 4C16 8 18 16 18 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="8" cy="20" r="1.5" fill="currentColor"/>
      <circle cx="20" cy="20" r="1.5" fill="currentColor"/>
    </g>
  ),
  Taureau: (
    <g>
      <circle cx="14" cy="6" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M8 12C6 16 6 20 8 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M20 12C22 16 22 20 20 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </g>
  ),
  Gémeaux: (
    <g>
      <path d="M5 6L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 12L15 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 18L15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M13 6L23 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M13 12L23 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M13 18L23 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  Cancer: (
    <g>
      <path d="M6 12C6 6 12 4 14 6C16 4 22 6 22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="8" cy="20" r="1.5" fill="currentColor"/>
      <circle cx="20" cy="20" r="1.5" fill="currentColor"/>
    </g>
  ),
  Lion: (
    <g>
      <circle cx="14" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M8 16C6 14 6 10 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M20 16C22 14 22 10 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M14 12C14 18 12 22 10 22C8 22 8 20 10 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M14 12C14 18 16 22 18 22C20 22 20 20 18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </g>
  ),
  Vierge: (
    <g>
      <path d="M10 6L14 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 4L12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 10C6 10 6 14 8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M16 10C18 10 18 14 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M12 14L12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 22L10 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 22L14 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  Balance: (
    <g>
      <path d="M8 6L20 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 6L14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 18L22 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="22" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="20" cy="22" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    </g>
  ),
  Scorpion: (
    <g>
      <path d="M10 4L14 4M12 2L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 4L18 8C18 14 14 16 14 16C14 16 10 14 10 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M14 18L12 24M14 18L16 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  Sagittaire: (
    <g>
      <path d="M6 22L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 6L20 6L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </g>
  ),
  Capricorne: (
    <g>
      <path d="M8 8C8 6 10 4 12 8C14 4 16 6 16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M8 12L8 20C8 22 12 22 12 20L12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="22" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M14 24L18 24M16 22L16 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </g>
  ),
  Verseau: (
    <g>
      <path d="M6 8C8 6 10 8 12 6C14 4 16 8 18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M6 14C8 12 10 14 12 12C14 10 16 14 18 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </g>
  ),
  Poissons: (
    <g>
      <path d="M8 6C4 6 4 12 8 12C12 12 12 18 8 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M20 6C16 6 16 12 20 12C24 12 24 18 20 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <line x1="12" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </g>
  ),
};

export default function ZodiacSymbol({ signe, size = 24, color = '#C9A460', className = '' }) {
  const svgContent = SYMBOLS_SVG[signe];
  if (!svgContent) return null;

  return (
    <svg
      viewBox="0 0 28 28"
      width={size}
      height={size}
      className={className}
      style={{ color }}
    >
      {svgContent}
    </svg>
  );
}