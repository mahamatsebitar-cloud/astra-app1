import React, { useState } from "react";
import Button from "../components/ui/Button";

const Onboarding2 = ({ onNext }) => {
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  const handleNext = () => {
    onNext(`${hour}:${minute}`);
  };

  const handleSkip = () => {
    onNext("12:00");
  };

  return (
    <div className="flex flex-col items-center">
      {/* Étapes dots */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-2 h-1 rounded bg-border/30" />
        <div className="w-8 h-1 rounded bg-gold" />
        <div className="w-2 h-1 rounded bg-border/30" />
      </div>

      {/* Titre */}
      <div className="w-full text-center mb-8">
        <h1 className="font-serif text-cream text-xl leading-snug">
          À quelle heure<br />êtes-vous né·e ?
        </h1>
      </div>

      {/* Horloge SVG Décorative */}
      <div className="mb-10 opacity-80">
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
          <circle cx="48" cy="48" r="44" stroke="var(--color-gold)" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="48" cy="48" r="38" stroke="var(--color-gold)" strokeWidth="1" />
          <line x1="48" y1="48" x2="48" y2="24" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="48" y1="48" x2="65" y2="48" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" />
          <circle cx="48" cy="48" r="3" fill="var(--color-gold)" />
        </svg>
      </div>

      {/* Sélecteurs heure et minutes */}
      <div className="flex items-center gap-4 w-full justify-center mb-10">
        <div className="relative group">
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="appearance-none bg-card border border-border rounded-2xl px-6 py-4 w-24 text-cream text-base font-serif text-center focus:border-gold outline-none transition-colors"
          >
            {hours.map((h) => <option key={h} value={h} className="bg-night">{h}</option>)}
          </select>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted uppercase tracking-widest">Heures</span>
        </div>

        <span className="text-gold text-2xl font-serif mb-2">:</span>

        <div className="relative group">
          <select
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="appearance-none bg-card border border-border rounded-2xl px-6 py-4 w-24 text-cream text-base font-serif text-center focus:border-gold outline-none transition-colors"
          >
            {minutes.map((m) => <option key={m} value={m} className="bg-night">{m}</option>)}
          </select>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted uppercase tracking-widest">Min</span>
        </div>
      </div>

      {/* Card info discrète */}
      <div className="bg-card/40 border border-border/50 rounded-2xl p-4 w-full mb-8">
        <p className="text-[#B0ADCA] text-[11px] font-sans leading-relaxed text-center italic">
          L'heure précise est la clé de votre Ascendant et de la position de vos Maisons.
        </p>
      </div>

      {/* Bouton principal */}
      <Button onClick={handleNext}>
        Valider l'instant →
      </Button>
      
      <button 
        onClick={handleSkip}
        className="mt-4 text-muted text-[10px] uppercase tracking-widest hover:text-gold transition-colors"
      >
        Je ne connais pas mon heure
      </button>
    </div>
  );
};

export default Onboarding2;