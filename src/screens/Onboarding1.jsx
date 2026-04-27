import React, { useState } from "react";
import Button from "../components/ui/Button";

const Onboarding1 = ({ onNext }) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const years = Array.from({ length: 80 }, (_, i) => 2026 - i);

  // Vérifie si les trois champs sont remplis
  const isValid = day !== "" && month !== "" && year !== "";

  return (
    <div className="flex flex-col items-center">
      {/* Barre de progression */}
      <div className="flex gap-2 justify-center mb-8">
        <div className="w-8 h-1 rounded bg-gold" />
        <div className="w-2 h-1 rounded bg-border/30" />
        <div className="w-2 h-1 rounded bg-border/30" />
      </div>

      {/* Label étape */}
      <p className="text-[10px] text-muted tracking-[2px] uppercase mb-1 text-center font-sans">
        Étape 1 / 3
      </p>

      {/* Titre */}
      <h1 className="font-serif text-xl text-cream leading-snug text-center mb-2">
        Quand êtes-vous<br/>né·e ?
      </h1>

      {/* Sous-titre */}
      <p className="text-muted text-[11px] leading-relaxed text-center mb-8 font-sans px-4">
        La position des astres au moment de ta naissance révèle ton thème natal unique.
      </p>

      {/* SVG décoratif (Style Astra) */}
      <div className="mb-10 opacity-80">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
          <circle cx="40" cy="30" r="22" stroke="var(--color-gold)" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="40" cy="30" r="18" stroke="var(--color-gold)" strokeWidth="1" fill="none" />
          {/* Ajout de la classe astro-symbol pour le rendu sur mobile */}
          <text x="40" y="36" textAnchor="middle" fontSize="18" fill="var(--color-gold)" className="font-serif astro-symbol">
            ♒
          </text>
        </svg>
      </div>

      {/* Sélecteurs JOUR / MOIS / ANNÉE */}
      <div className="flex gap-2 w-full mb-8">
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="bg-card border border-border text-cream text-[13px] p-3 rounded-xl flex-1 outline-none focus:border-gold transition-colors appearance-none"
        >
          <option value="">Jour</option>
          {days.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-card border border-border text-cream text-[13px] p-3 rounded-xl flex-1 outline-none focus:border-gold transition-colors appearance-none"
        >
          <option value="">Mois</option>
          {months.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-card border border-border text-cream text-[13px] p-3 rounded-xl flex-1 outline-none focus:border-gold transition-colors appearance-none"
        >
          <option value="">Année</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Bouton Suivant - Gestion de l'état activé/désactivé */}
      <Button 
        onClick={isValid ? onNext : undefined} 
        disabled={!isValid}
        className={`transition-all duration-300 ${
          !isValid 
            ? "opacity-20 grayscale cursor-not-allowed transform scale-95" 
            : "opacity-100 grayscale-0 cursor-pointer transform scale-100 shadow-lg shadow-gold/20"
        }`}
      >
        Continuer le voyage →
      </Button>
    </div>
  );
};

export default Onboarding1;