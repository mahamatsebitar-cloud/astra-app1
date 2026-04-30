import React, { useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { NOEUDS_LUNAIRES, getPhaseLunaire } from '../data/identiteFrancaise';
import PremiumGate from '../components/ui/PremiumGate';

// Dictionnaire de correspondance Année -> Axe (Approximation standard)
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

const NoeudLunaire = ({ onBack, onUpgrade }) => {
  const { user } = useAuthContext();
  const { profile, loading } = useProfile(user?.id);

  // Support des deux formats de nom de clé
  const dateNaissance = profile?.date_naissance || profile?.dateNaissance;

  const noeudsData = useMemo(() => {
    if (!dateNaissance) return null;
    const cle = getNoeudNord(dateNaissance);
    return cle ? NOEUDS_LUNAIRES.noeuds[cle] : null;
  }, [dateNaissance]);

  const phaseLunaire = useMemo(() => getPhaseLunaire(), []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-night gap-4">
        <div className="w-8 h-8 border-t-2 border-gold rounded-full animate-spin" />
        <div className="text-gold font-serif italic animate-pulse tracking-widest">Lecture du fil karmique...</div>
      </div>
    );
  }

  if (!noeudsData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-night px-10 text-center space-y-6">
        <p className="text-muted font-serif italic leading-relaxed">
          Le fil de votre destinée n'est pas encore tracé. Renseignez votre date de naissance pour révéler vos Nœuds Lunaires.
        </p>
        <button 
            onClick={onBack} 
            className="text-gold text-[10px] uppercase tracking-[3px] border border-gold/20 px-8 py-3 rounded-full active:scale-95 transition-all"
        >
          Retourner au profil
        </button>
      </div>
    );
  }

  const { nord: signeNord, sud: signeSud, chemin, karma } = noeudsData;
  const symboleNord = SYMBOLES_SIGNES[signeNord] || "✦";
  const symboleSud = SYMBOLES_SIGNES[signeSud] || "✦";

  const contenuPremium = (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Nœud Nord - La Mission */}
      <div className="bg-card/60 backdrop-blur-sm border border-gold/20 rounded-[32px] p-6 space-y-4 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-4 -right-4 p-2 opacity-[0.03] select-none">
           <span className="text-9xl">{symboleNord}</span>
        </div>
        
        <header className="flex justify-between items-start">
            <span className="text-[10px] tracking-[3px] text-gold font-sans uppercase font-black">
                Destination ↗
            </span>
            <span className="text-2xl text-gold/40">☊</span>
        </header>

        <div className="flex items-center gap-5 relative z-10">
          <span className="text-6xl text-gold drop-shadow-[0_0_15px_rgba(201,164,96,0.3)]" style={{ fontVariantEmoji: 'text' }}>
            {symboleNord}
          </span>
          <div>
            <h2 className="font-serif text-2xl text-cream tracking-wide">{signeNord}</h2>
            <p className="font-serif text-[11px] text-gold/60 italic">
              L'appel de votre futur
            </p>
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-gold/30 to-transparent w-full" />
        
        <p className="font-serif text-base text-cream/90 italic leading-relaxed pt-2">
          « {chemin} »
        </p>
      </div>

      {/* Nœud Sud - Le Passé */}
      <div className="bg-[#070B18] border border-white/5 rounded-[32px] p-6 space-y-4 shadow-inner opacity-80">
        <header className="flex justify-between items-start">
            <span className="text-[10px] tracking-[3px] text-muted font-sans uppercase font-bold">
                Origines ↙
            </span>
            <span className="text-2xl text-white/10">☋</span>
        </header>

        <div className="flex items-center gap-5">
          <span className="text-6xl text-white/10" style={{ fontVariantEmoji: 'text' }}>
            {symboleSud}
          </span>
          <div>
            <h2 className="font-serif text-2xl text-muted/80 tracking-wide">{signeSud}</h2>
            <p className="font-serif text-[11px] text-muted/40 italic">
              Vos acquis et mémoires
            </p>
          </div>
        </div>

        <div className="h-px bg-white/5 w-full" />

        <p className="font-serif text-sm text-muted/60 italic leading-relaxed pt-2">
          « {karma} »
        </p>
      </div>

      {/* Influence Lunaire Actuelle */}
      {phaseLunaire && (
        <div className="bg-white/[0.02] border border-white/5 rounded-[24px] p-5">
          <div className="flex items-center gap-5">
            <div className="text-4xl filter drop-shadow-md">{phaseLunaire.symbole}</div>
            <div className="space-y-1">
              <span className="text-[9px] tracking-[2px] text-gold/40 font-sans uppercase font-bold">
                Météo Lunaire
              </span>
              <h4 className="font-serif text-sm text-cream uppercase tracking-wider">
                {phaseLunaire.nom}
              </h4>
              <p className="font-serif text-[11px] text-muted/80 italic leading-snug">
                {phaseLunaire.conseil}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-night px-5 py-4 space-y-6 overflow-y-auto pb-20">
      {/* Header avec bouton retour stylisé */}
      <header className="flex items-center pt-2">
        <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-cream active:scale-90 transition-all border border-white/10"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </header>

      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl text-cream tracking-tight">Nœuds Lunaires</h1>
        <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-gold/20" />
            <p className="font-serif text-[9px] text-gold tracking-[4px] uppercase font-bold">
              Le Fil d'Ariane
            </p>
            <div className="h-px w-8 bg-gold/20" />
        </div>
      </div>

      <div className="bg-[#120E22]/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl">
        <p className="font-serif text-[13px] text-[#B0ADCA] italic leading-relaxed text-center">
          {NOEUDS_LUNAIRES.description_generale}
        </p>
      </div>

      <PremiumGate 
        featureKey="noeuds_lunaires"
        onUpgrade={onUpgrade}
        preview={true}
      >
        {contenuPremium}
      </PremiumGate>
    </div>
  );
};

export default NoeudLunaire;