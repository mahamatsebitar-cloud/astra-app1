// src/screens/NoeudLunaire.jsx
import React, { useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { NOEUDS_LUNAIRES, getPhaseLunaire } from '../data/identiteFrancaise';

const NOEUDS_PAR_ANNEE = {
  1985: "Taureau_Scorpion", 1986: "Taureau_Scorpion", 1987: "Bélier_Balance",
  1988: "Poissons_Vierge", 1989: "Verseau_Lion", 1990: "Capricorne_Cancer",
  1991: "Capricorne_Cancer", 1992: "Sagittaire_Gémeaux", 1993: "Sagittaire_Gémeaux",
  1994: "Scorpion_Taureau", 1995: "Balance_Bélier", 1996: "Balance_Bélier",
  1997: "Vierge_Poissons", 1998: "Lion_Verseau", 1999: "Lion_Verseau",
  2000: "Cancer_Capricorne", 2001: "Cancer_Capricorne", 2002: "Gémeaux_Sagittaire",
  2003: "Taureau_Scorpion", 2004: "Taureau_Scorpion", 2005: "Bélier_Balance",
  2006: "Bélier_Balance", 2007: "Poissons_Vierge", 2008: "Verseau_Lion",
  2009: "Capricorne_Cancer", 2010: "Capricorne_Cancer", 2011: "Sagittaire_Gémeaux",
  2012: "Scorpion_Taureau", 2013: "Scorpion_Taureau", 2014: "Balance_Bélier",
  2015: "Balance_Bélier", 2016: "Vierge_Poissons", 2017: "Lion_Verseau",
  2018: "Cancer_Capricorne", 2019: "Cancer_Capricorne", 2020: "Gémeaux_Sagittaire",
  2021: "Gémeaux_Sagittaire", 2022: "Taureau_Scorpion", 2023: "Taureau_Scorpion",
  2024: "Bélier_Balance", 2025: "Poissons_Vierge",
};

const SYMBOLES_SIGNES = {
  Bélier: "♈", Taureau: "♉", Gémeaux: "♊", Cancer: "♋",
  Lion: "♌", Vierge: "♍", Balance: "♎", Scorpion: "♏",
  Sagittaire: "♐", Capricorne: "♑", Verseau: "♒", Poissons: "♓",
};

const getNoeudNord = (dateNaissance) => {
  if (!dateNaissance) return null;
  try {
    const dateObj = new Date(dateNaissance);
    if (isNaN(dateObj.getTime())) return null;
    const annee = dateObj.getFullYear();
    return NOEUDS_PAR_ANNEE[annee] || null;
  } catch (error) {
    console.error("Erreur calcul Noeud Lunaire:", error);
    return null;
  }
};

const NoeudLunaire = ({ onBack }) => {
  const { user } = useAuthContext();
  // Correction : utilisation de user.id (cohérent avec Horoscope.jsx)
  const { profile, loading } = useProfile(user?.id);

  // Correction : On utilise la clé exacte 'date_naissance' telle qu'elle est en base
  const dateNaissance = profile?.date_naissance || profile?.dateNaissance;

  const noeudsData = useMemo(() => {
    if (!dateNaissance) return null;
    const cle = getNoeudNord(dateNaissance);
    return cle ? NOEUDS_LUNAIRES.noeuds[cle] : null;
  }, [dateNaissance]);

  const phaseLunaire = useMemo(() => getPhaseLunaire(), []);

  // ÉCRAN DE CHARGEMENT
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-night">
        <div className="text-gold font-serif italic animate-pulse">Lecture du fil karmique...</div>
      </div>
    );
  }

  // ÉCRAN SI DATE DE NAISSANCE MANQUANTE
  if (!noeudsData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-night px-8 text-center">
        <p className="text-muted font-serif italic mb-4">Renseignez votre date de naissance dans votre profil pour découvrir vos nœuds lunaires.</p>
        <button onClick={onBack} className="text-gold text-xs uppercase tracking-widest border border-gold/20 px-4 py-2 rounded-full">
          Retour
        </button>
      </div>
    );
  }

  const signeNord = noeudsData.nord;
  const signeSud = noeudsData.sud;
  const symboleNord = SYMBOLES_SIGNES[signeNord] || "✦";
  const symboleSud = SYMBOLES_SIGNES[signeSud] || "✦";

  return (
    <div className="w-full min-h-screen bg-night px-5 py-6 space-y-5 overflow-y-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-cream hover:text-gold transition-colors p-1 active:scale-90">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="text-center space-y-1">
        <h1 className="font-serif text-xl text-cream">Vos Nœuds Lunaires</h1>
        <p className="font-serif text-[10px] text-muted uppercase tracking-[2px]">
          Le fil karmique de votre existence
        </p>
      </div>

      <div className="bg-[#120E22] border border-gold/10 rounded-2xl p-4">
        <p className="font-serif text-sm text-[#B0ADCA] italic leading-relaxed text-center">
          {NOEUDS_LUNAIRES.description_generale}
        </p>
      </div>

      {/* Nœud Nord */}
      <div className="bg-card border border-gold/20 rounded-2xl p-5 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
           <span className="text-6xl">{symboleNord}</span>
        </div>
        <span className="text-[9px] tracking-widest text-gold font-sans uppercase font-bold">
          Nœud Nord ↗
        </span>
        <div className="flex items-center gap-4 relative z-10">
          <span className="text-5xl text-gold" style={{ fontVariantEmoji: 'text' }}>{symboleNord}</span>
          <div>
            <h2 className="font-serif text-xl text-cream">{signeNord}</h2>
            <p className="font-serif text-[10px] text-muted italic mt-0.5">
              Destination de votre âme
            </p>
          </div>
        </div>
        <p className="font-serif text-sm text-cream/90 italic leading-relaxed border-t border-white/5 pt-3">
          « {noeudsData.chemin} »
        </p>
      </div>

      {/* Nœud Sud */}
      <div className="bg-[#0A0F20] border border-border/40 rounded-2xl p-5 space-y-3">
        <span className="text-[9px] tracking-widest text-muted font-sans uppercase">
          Nœud Sud ↙
        </span>
        <div className="flex items-center gap-4">
          <span className="text-5xl text-muted/30" style={{ fontVariantEmoji: 'text' }}>{symboleSud}</span>
          <div>
            <h2 className="font-serif text-xl text-muted/80">{signeSud}</h2>
            <p className="font-serif text-[10px] text-muted/50 italic mt-0.5">
              Héritage et zone de confort
            </p>
          </div>
        </div>
        <p className="font-serif text-sm text-muted/60 italic leading-relaxed border-t border-white/5 pt-3">
          « {noeudsData.karma} »
        </p>
      </div>

      {/* Phase lunaire actuelle */}
      {phaseLunaire && (
        <div className="bg-card border border-gold/5 rounded-2xl p-4 space-y-3">
          <span className="text-[9px] tracking-widest text-gold/60 font-sans uppercase">
            Influence Lunaire Actuelle
          </span>
          <div className="flex items-center gap-4">
            <span className="text-3xl">{phaseLunaire.symbole}</span>
            <div className="space-y-0.5">
              <h4 className="font-serif text-sm text-cream">
                {phaseLunaire.nom}
              </h4>
              <p className="font-serif text-[11px] text-muted italic leading-snug">
                {phaseLunaire.conseil}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoeudLunaire;