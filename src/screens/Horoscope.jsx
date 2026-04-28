// src/screens/Horoscope.jsx
import React, { useMemo } from 'react';
import ScoreBar from '../components/ui/ScoreBar';
import Card from '../components/ui/Card';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { getHoroscopeComplet } from '../services/horoscopeService';

const ZODIAC_SYMBOLS = {
  "Bélier": "♈", "Taureau": "♉", "Gémeaux": "♊", "Cancer": "♋",
  "Lion": "♌", "Vierge": "♍", "Balance": "♎", "Scorpion": "♏",
  "Sagittaire": "♐", "Capricorne": "♑", "Verseau": "♒", "Poissons": "♓"
};

const ZODIAC_DATES = {
  "Bélier": "21 mars — 19 avril",
  "Taureau": "20 avril — 20 mai",
  "Gémeaux": "21 mai — 20 juin",
  "Cancer": "21 juin — 22 juillet",
  "Lion": "23 juillet — 22 août",
  "Vierge": "23 août — 22 septembre",
  "Balance": "23 septembre — 22 octobre",
  "Scorpion": "23 octobre — 21 novembre",
  "Sagittaire": "22 novembre — 21 décembre",
  "Capricorne": "22 décembre — 19 janvier",
  "Verseau": "20 janvier — 18 février",
  "Poissons": "19 février — 19 mars"
};

const Horoscope = ({ onBack }) => {
  const { user } = useAuthContext();
  const { profile, loading } = useProfile(user?.id);
  
  const signeSolaire = profile?.signe_solaire || "Bélier";
  
  // Optimisation : Calcul de l'horoscope
  const horoscope = useMemo(() => getHoroscopeComplet(signeSolaire), [signeSolaire]);

  const dateAujourdhui = useMemo(() => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  }, []);

  const domaines = [
    {
      label: "Amour",
      texte: horoscope.amour.texte,
      score: horoscope.amour.score,
      couleur: "#C17B8A", // Rose poudré
      icone: "♥"
    },
    {
      label: "Travail",
      texte: horoscope.travail.texte,
      score: horoscope.travail.score,
      couleur: "#7B9ECB", // Bleu serein
      icone: "◆"
    },
    {
      label: "Bien-être",
      texte: horoscope.bienEtre.texte,
      score: horoscope.bienEtre.score,
      couleur: "#7BB8A0", // Vert sauge
      icone: "●"
    }
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-night">
        <div className="text-gold font-serif italic animate-pulse">Lecture des astres...</div>
      </div>
    );
  }

  return (
    <div className="w-full px-5 py-2 bg-night min-h-screen pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack} 
          className="text-2xl text-muted bg-none border-none cursor-pointer p-2 -ml-2 active:scale-90 transition-transform"
        >
          ←
        </button>
        <div>
          <p className="text-[10px] text-muted tracking-widest uppercase font-sans">{dateAujourdhui}</p>
          <h3 className="text-cream font-serif text-base">Horoscope du Jour</h3>
        </div>
      </div>

      {/* Section signe */}
      <div className="flex flex-col items-center py-6 border-y border-[#1C2040] my-4 relative overflow-hidden">
        {/* Glow discret en fond */}
        <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full" />
        
        <span 
          className="text-5xl mb-2 text-gold relative z-10"
          style={{ fontVariantEmoji: 'text', WebkitFontVariantEmoji: 'text' }}
        >
          {ZODIAC_SYMBOLS[signeSolaire]}
        </span>
        <h1 className="text-gold font-serif tracking-[2.5px] text-base uppercase relative z-10">{signeSolaire}</h1>
        <p className="text-[11px] text-muted mt-1 uppercase font-sans relative z-10 opacity-70">{ZODIAC_DATES[signeSolaire]}</p>
      </div>

      {/* Citation / Message principal */}
      <div className="py-4">
        <p className="italic font-serif text-sm text-cream leading-[1.9] mb-4 text-center px-2">
          "{horoscope.message}"
        </p>
      </div>

      {/* Tags dynamiques */}
      {horoscope.tags && horoscope.tags.length > 0 && (
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {horoscope.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-[#141731] text-gold border border-gold/20 rounded-full px-3 py-1 text-[9px] tracking-widest uppercase font-bold"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Label section */}
      <div className="flex items-center gap-2 mb-4">
        <p className="text-[9px] text-muted tracking-[2px] uppercase font-sans whitespace-nowrap">Analyse par domaine</p>
        <div className="h-px bg-[#1C2040] w-full" />
      </div>

      {/* Cartes de domaines */}
      <div className="space-y-4">
        {domaines.map((domaine, index) => (
          <Card key={index} className="border-gold/10 hover:border-gold/30 transition-colors">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: domaine.couleur }}>{domaine.icone}</span>
                  <p 
                    className="text-[10px] tracking-[1.5px] uppercase font-sans font-bold"
                    style={{ color: domaine.couleur }}
                  >
                    {domaine.label}
                  </p>
                </div>
                <span className="text-[10px] text-muted font-sans font-bold">{domaine.score}/100</span>
              </div>
              
              <p className="text-[12px] text-[#B0ADCA] leading-relaxed font-sans">
                {domaine.texte}
              </p>
              
              <div className="pt-2">
                <ScoreBar score={domaine.score} couleur={domaine.couleur} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Horoscope;