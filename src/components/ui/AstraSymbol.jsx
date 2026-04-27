import React from 'react';

// Composant pour forcer le rendu doré des symboles astrologiques
const AstraSymbol = ({ name, className = "" }) => {
  // Tracés SVG précis pour les symboles qui posent problème
  const symbols = {
    // Tracé de l'Ascendant (une flèche fine vers le haut)
    ascendant: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="inline-block translate-y-[-1px]">
        <path d="M6 10V2M6 2L3 5M6 2L9 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    // Tracé de la Lune (un croissant fin)
    lune: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="inline-block translate-y-[-1px]">
        <path d="M9.5 8.5C7.5 9.5 5 9 3.5 7.5C2 6 1.5 3.5 2.5 1.5C1.5 3 1.5 5.5 2.5 7C3.5 8.5 6 9.5 9.5 8.5Z" fill="currentColor"/>
      </svg>
    )
  };

  if (!symbols[name]) return null;

  // On applique astro-symbol pour la couleur de base, et les styles personnalisés
  return (
    <span className={`astro-symbol text-gold ${className}`}>
      {symbols[name]}
    </span>
  );
};

export default AstraSymbol;