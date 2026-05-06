// src/components/ui/ZodiacIcon.jsx
import React from 'react';

const ZODIAC_SYMBOLS = {
  'Bélier':      '♈\uFE0E',
  'Taureau':     '♉\uFE0E',
  'Gémeaux':     '♊\uFE0E',
  'Cancer':      '♋\uFE0E',
  'Lion':        '♌\uFE0E',
  'Vierge':      '♍\uFE0E',
  'Balance':     '♎\uFE0E',
  'Scorpion':    '♏\uFE0E',
  'Sagittaire':  '♐\uFE0E',
  'Capricorne':  '♑\uFE0E',
  'Verseau':     '♒\uFE0E',
  'Poissons':    '♓\uFE0E',
};

export default function ZodiacIcon({ signe, size = 24, className = '' }) {
  const symbol = ZODIAC_SYMBOLS[signe] || '✦\uFE0E';
  return (
    <span
      className={className}
      style={{
        fontSize: size,
        color: '#C9A460',
        fontFamily: 'Georgia, serif',
        lineHeight: 1,
        display: 'inline-block',
        userSelect: 'none',
      }}
    >
      {symbol}
    </span>
  );
}