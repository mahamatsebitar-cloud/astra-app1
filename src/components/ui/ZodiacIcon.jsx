import React from 'react';

const ZodiacIcon = ({ signe, className = "" }) => {
  const paths = {
    verseau: (
      <path d="M2.5 7.5C4.16667 5.83333 5.83333 5.83333 7.5 7.5C9.16667 9.16667 10.8333 9.16667 12.5 7.5C14.1667 5.83333 15.8333 5.83333 17.5 7.5C19.1667 9.16667 20.8333 9.16667 22.5 7.5M2.5 14.5C4.16667 12.8333 5.83333 12.8333 7.5 14.5C9.16667 16.1667 10.8333 16.1667 12.5 14.5C14.1667 12.8333 15.8333 12.8333 17.5 14.5C19.1667 16.1667 20.8333 16.1667 22.5 14.5" 
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    ),
    // Ajoute les autres ici plus tard...
  };

  const signeKey = signe ? signe.toLowerCase() : '';
  if (!paths[signeKey]) return null;

  return (
    <svg viewBox="0 0 25 25" fill="none" className={`inline-block ${className}`} style={{ color: 'var(--color-gold)' }}>
      {paths[signeKey]}
    </svg>
  );
};

export default ZodiacIcon;