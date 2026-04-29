import React, { useState, useEffect, useMemo } from 'react';

const ETAPES = [
  "Lecture de votre thème natal...",
  "Calcul de votre Ascendant...",
  "Position de la Lune...",
  "Alignement des transits...",
  "Votre ciel est prêt ✦"
];

const ZODIAC_SVG = {
  "Verseau": <path d="M8 16 Q12 10 16 16 Q20 22 24 16 M8 22 Q12 16 16 22 Q20 28 24 22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>,
  "Poissons": <path d="M8 16 C10 10 14 10 16 16 C18 22 22 22 24 16 M8 16 C10 22 14 22 16 16 C18 10 22 10 24 16" stroke="currentColor" strokeWidth="1.5" fill="none"/>,
  "Bélier": <path d="M16 8 C12 8 9 11 9 15 C9 18 11 20 13 20 M16 8 C20 8 23 11 23 15 C23 18 21 20 19 20 M13 20 L16 24 L19 20" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>,
  "Taureau": <path d="M10 14 C10 10 13 8 16 8 C19 8 22 10 22 14 M16 8 L16 24 M12 24 L20 24 M10 14 C8 14 7 13 7 11 M22 14 C24 14 25 13 25 11" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>,
};

const DEFAULT_SVG = <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="18" fontFamily="Georgia,serif">✦</text>;

const LoadingTheme = ({ onComplete, signeSolaire = "Verseau" }) => {
  const [etapeIndex, setEtapeIndex] = useState(0);

  const stars = useMemo(() => (
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: (i * 37 + 13) % 100,
      top: (i * 53 + 7) % 100,
      delay: (i * 0.3) % 3,
      size: i % 4 === 0 ? 2 : 1
    }))
  ), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEtapeIndex(prev => {
        if (prev >= ETAPES.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 900);
          return prev;
        }
        return prev + 1;
      });
    }, 650);
    return () => clearInterval(interval);
  }, [onComplete]);

  const progression = ((etapeIndex + 1) / ETAPES.length) * 100;

  return (
    <div className="relative w-full h-full bg-night flex flex-col items-center justify-center overflow-hidden">

      {/* Étoiles CSS */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map(s => (
          <div
            key={s.id}
            className="absolute rounded-full bg-cream"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animation: `twinkle ${2 + s.delay}s ease-in-out ${s.delay}s infinite`
            }}
          />
        ))}
      </div>

      {/* Constellation centrale SVG animée */}
      <div className="relative z-10 mb-10">
        <svg width="120" height="120" viewBox="0 0 32 32"
          className="text-gold opacity-80">
          {/* Cercle extérieur animé */}
          <circle
            cx="16" cy="16" r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            strokeOpacity="0.3"
            strokeDasharray="88"
            strokeDashoffset="88"
            style={{
              animation: 'drawLine 2s ease forwards',
              animationDelay: '0.2s'
            }}
          />
          {/* Symbole du signe */}
          {ZODIAC_SVG[signeSolaire] || DEFAULT_SVG}
          {/* Points lumineux aux coins */}
          {[[4,4],[28,4],[4,28],[28,28],[16,2]].map(([cx,cy], i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r="1.2"
              fill="currentColor"
              opacity="0.6"
              style={{
                animation: `twinkle ${1.5 + i*0.3}s ease-in-out ${i*0.2}s infinite`
              }}
            />
          ))}
        </svg>
      </div>

      {/* Texte étape courante */}
      <div className="relative z-10 text-center px-8 mb-8">
        <p
          key={etapeIndex}
          className="font-serif italic text-sm text-gold anim-fadeslide"
        >
          {ETAPES[etapeIndex]}
        </p>
      </div>

      {/* Barre de progression */}
      <div className="relative z-10 w-40 h-px bg-[#1C2040] rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progression}%` }}
        />
      </div>

      {/* Signe en filigrane */}
      <div
        className="absolute bottom-16 text-[80px] text-gold select-none pointer-events-none"
        style={{
          opacity: 0.04,
          fontFamily: 'Georgia, serif',
          fontVariantEmoji: 'text'
        }}
      >
        {signeSolaire}
      </div>

    </div>
  );
};

export default LoadingTheme;