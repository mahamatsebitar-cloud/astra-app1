import React, { useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { getNoeudsLunaires, getThemeNatal } from '../services/astroService';
import { NOEUDS_LUNAIRES, getPhaseLunaire, getNoeudVariation } from '../data/identiteFrancaise';
import { SIGNIFICATIONS_MAISONS } from '../data/lecturesMaisons';
import PremiumGate from '../components/ui/PremiumGate';

const SYMBOLES_SIGNES = {
  Bélier: "♈", Taureau: "♉", Gémeaux: "♊", Cancer: "♋",
  Lion: "♌", Vierge: "♍", Balance: "♎", Scorpion: "♏",
  Sagittaire: "♐", Capricorne: "♑", Verseau: "♒", Poissons: "♓",
};

const NoeudLunaire = ({ onBack, onUpgrade }) => {
  const { user } = useAuthContext();
  const { profile, loading } = useProfile(user?.id);

  const dateNaissance = profile?.date_naissance || profile?.dateNaissance;

  // Thème natal pour les maisons
  const themeNatal = useMemo(() => {
    if (!dateNaissance) return null;
    return getThemeNatal(dateNaissance, profile?.heure_naissance || '12:00', profile?.latitude || 48.8566, profile?.longitude || 2.3522);
  }, [dateNaissance, profile?.heure_naissance, profile?.latitude, profile?.longitude]);

  // Nœuds lunaires réels calculés par formule ELP-2000
  const noeudsReels = useMemo(() => {
    if (!dateNaissance) return null;
    return getNoeudsLunaires(dateNaissance);
  }, [dateNaissance]);

  const noeudsData = useMemo(() => {
    if (!noeudsReels) return null;
    const cle = `${noeudsReels.nord.signe}_${noeudsReels.sud.signe}`;
    const variation = getNoeudVariation(cle);
    if (!variation) return null;
    return {
      nordSigne: noeudsReels.nord.signe,
      sudSigne: noeudsReels.sud.signe,
      chemin: variation.chemin,
      karma: variation.karma,
      nordDegres: noeudsReels.nord.degres,
      nordMinutes: noeudsReels.nord.minutes,
      sudDegres: noeudsReels.sud.degres,
      sudMinutes: noeudsReels.sud.minutes,
      nordMaison: themeNatal?.noeudNord?.maison,
      sudMaison: themeNatal?.noeudSud?.maison
    };
  }, [noeudsReels, themeNatal]);

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

  const symboleNord = SYMBOLES_SIGNES[noeudsData.nordSigne] || "✦";
  const symboleSud = SYMBOLES_SIGNES[noeudsData.sudSigne] || "✦";

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
            <h2 className="font-serif text-2xl text-cream tracking-wide">{noeudsData.nordSigne}</h2>
            <p className="font-serif text-[11px] text-gold/60 italic">
              L'appel de votre futur
            </p>
            {noeudsData.nordMaison && (
              <p className="text-[9px] text-gold/40 tracking-widest uppercase mt-1">
                Maison {noeudsData.nordMaison} · {SIGNIFICATIONS_MAISONS[noeudsData.nordMaison]}
              </p>
            )}
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-gold/30 to-transparent w-full" />
        
        <p className="font-serif text-base text-cream/90 italic leading-relaxed pt-2">
          « {noeudsData.chemin} »
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
            <h2 className="font-serif text-2xl text-muted/80 tracking-wide">{noeudsData.sudSigne}</h2>
            <p className="font-serif text-[11px] text-muted/40 italic">
              Vos acquis et mémoires
            </p>
            {noeudsData.sudMaison && (
              <p className="text-[9px] text-muted/30 tracking-widest uppercase mt-1">
                Maison {noeudsData.sudMaison} · {SIGNIFICATIONS_MAISONS[noeudsData.sudMaison]}
              </p>
            )}
          </div>
        </div>

        <div className="h-px bg-white/5 w-full" />

        <p className="font-serif text-sm text-muted/60 italic leading-relaxed pt-2">
          « {noeudsData.karma} »
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