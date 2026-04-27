import React from 'react';
import { horoscopeDomaines } from '../data/astroData';
import ScoreBar from '../components/ui/ScoreBar'; // Chemin corrigé
import Card from '../components/ui/Card';         // Chemin corrigé

const Horoscope = ({ onBack }) => {
  return (
    <div className="w-full px-5 py-2 bg-night min-h-screen pb-12">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack} 
          className="text-2xl text-muted bg-none border-none cursor-pointer p-2 -ml-2 active:scale-90 transition-transform"
        >
          ←
        </button>
        <div>
          <p className="text-[10px] text-muted tracking-widest uppercase font-sans">DIMANCHE 26 AVRIL 2026</p>
          <h3 className="text-cream font-serif text-base">Horoscope du Jour</h3>
        </div>
      </div>

      {/* Section signe */}
      <div className="flex flex-col items-center py-6 border-y border-[#1C2040] my-4">
        <span className="text-5xl mb-2">♒</span>
        <h1 className="text-gold font-serif tracking-[2.5px] text-base">VERSEAU</h1>
        <p className="text-[11px] text-muted mt-1 uppercase font-sans">20 jan. — 18 fév.</p>
      </div>

      {/* Citation */}
      <p className="italic font-serif text-sm text-cream leading-[1.9] mb-4 text-center px-2">
        « Les étoiles murmurent à ton âme ce que ton cœur sait déjà. Écoute sans crainte la sagesse de l'univers. »
      </p>

      {/* Paragraphe explicatif */}
      <p className="text-[#B0ADCA] text-xs leading-relaxed mb-6 font-sans">
        Sous l'influence de Jupiter en harmonie avec ton signe, cette journée t'invite à accueillir les synchronicités. Les énergies planétaires te poussent vers une introspection lumineuse.
      </p>

      {/* Label par domaine */}
      <p className="text-[9px] text-muted tracking-[2px] uppercase mb-3 font-sans">PAR DOMAINE</p>

      {/* Domaines */}
      <div className="space-y-3">
        {horoscopeDomaines.map((domaine, index) => (
          <Card key={index}>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p 
                  className="text-[10px] tracking-[1.5px] uppercase font-sans font-bold"
                  style={{ color: domaine.couleur }}
                >
                  {domaine.label}
                </p>
                <span className="text-sm">{domaine.icone}</span>
              </div>
              <p className="text-[11px] text-[#B0ADCA] leading-relaxed font-sans">
                {domaine.texte}
              </p>
              <div className="pt-1">
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