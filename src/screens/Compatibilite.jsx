import React from 'react';
import { connexions } from '../data/astroData';

const Compatibilite = () => {
  const scorePrincipal = 72;
  const rayon = 23;
  const circonference = 2 * Math.PI * rayon;
  const dashArray = (scorePrincipal / 100) * circonference;
  const dashOffset = circonference - dashArray;

  const detailsAffinites = [
    { label: 'Amour', score: 80, couleur: '#C17B8A' },
    { label: 'Communication', score: 65, couleur: '#7B9ECB' },
    { label: 'Valeurs', score: 70, couleur: '#C9A460' },
    { label: 'Complicité', score: 75, couleur: '#E05C5C' },
    { label: 'Durabilité', score: 60, couleur: '#5CAE8A' },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--color-gold)';
    if (score >= 70) return 'var(--color-cream)';
    return 'var(--color-muted)';
  };

  return (
    <div className="w-full bg-night min-h-screen space-y-8 pb-10">
      
      {/* Header */}
      <div className="space-y-1">
        <p className="text-[10px] text-gold tracking-widest uppercase font-sans">
          Affinités Astrales
        </p>
        <h3 className="text-base font-serif text-cream">
          Compatibilité
        </h3>
      </div>

      {/* Card héros compatibilité principale */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
        <div className="flex justify-around items-center py-3">
          {/* Gauche - Fix Appliqué */}
          <div className="flex flex-col items-center space-y-1">
            <span className="text-5xl astro-symbol text-gold">♒{"\uFE0E"}</span>
            <span className="text-gold text-xs font-sans">Verseau</span>
            <span className="text-muted text-[10px] font-sans">Léa</span>
          </div>

          {/* Centre - Donut */}
          <div className="relative w-[58px] h-[58px] flex items-center justify-center">
            <svg width="58" height="58" viewBox="0 0 58 58" className="transform -rotate-90">
              <circle cx="29" cy="29" r={rayon} fill="none" stroke="#1C2040" strokeWidth="4" />
              <circle
                cx="29" cy="29" r={rayon}
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circonference}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <span className="absolute font-serif text-base text-gold">
              {scorePrincipal}
            </span>
          </div>

          {/* Droite - Fix Appliqué */}
          <div className="flex flex-col items-center space-y-1">
            <span className="text-5xl astro-symbol text-gold">♌{"\uFE0E"}</span>
            <span className="text-gold text-xs font-sans">Lion</span>
            <span className="text-muted text-[10px] font-sans">Thomas</span>
          </div>
        </div>

        <div className="h-px bg-[#1C2040]" />

        <p className="italic text-[#B0ADCA] text-xs leading-relaxed font-serif text-center px-2">
          « Sous les feux du Lion, le Verseau danse, une valse céleste où vos 
          différences deviennent votre plus belle harmonie. »
        </p>
      </div>

      {/* Détail des affinités */}
      <div className="space-y-3">
        <p className="text-[10px] text-muted tracking-widest uppercase font-sans">
          Détail des affinités
        </p>
        
        <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
          {detailsAffinites.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-cream text-xs font-sans">{item.label}</span>
                <span className="text-muted text-xs font-sans">{item.score}%</span>
              </div>
              <div className="w-full h-1 bg-[#1C2040] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.score}%`,
                    backgroundColor: item.couleur,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mes connexions astrales */}
      <div className="space-y-3">
        <p className="text-[10px] text-muted tracking-widest uppercase font-sans">
          Mes connexions astrales
        </p>

        <div className="bg-card border border-border rounded-2xl p-4">
          {connexions.map((connexion, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 py-3 ${
                index < connexions.length - 1 ? 'border-b border-[#1C2040]' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#141731] border border-border flex items-center justify-center flex-shrink-0 text-gold font-serif">
                {connexion.initiale}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-cream text-sm font-sans truncate">
                  {connexion.prenom}
                </p>
                <p className="text-muted text-[10px] font-sans flex items-center gap-1">
                  {/* Fix Appliqué ici aussi */}
                  <span className="astro-symbol text-gold">{connexion.signeEmoji}{"\uFE0E"}</span> {connexion.signe}
                </p>
              </div>

              <div className="flex-shrink-0">
                <span
                  className="text-sm font-serif"
                  style={{ color: getScoreColor(connexion.score) }}
                >
                  {connexion.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ajouter une connexion */}
      <p className="text-gold text-center text-sm py-4 font-sans cursor-pointer hover:opacity-80 transition-opacity">
        + Ajouter une connexion
      </p>
    </div>
  );
};

export default Compatibilite;