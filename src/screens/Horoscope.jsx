// src/screens/Horoscope.jsx
import React, { useMemo } from 'react';
import ScoreBar from '../components/ui/ScoreBar';
import Card from '../components/ui/Card';
import ZodiacSymbol from '../components/ui/ZodiacSymbol';
import PlanetCircle from '../components/ui/PlanetCircle';
import PremiumGate from '../components/ui/PremiumGate';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { getHoroscopeComplet } from '../services/horoscopeService';
import { generateMessagePersonnalise } from '../services/messageGeneratorService';
import { getPlanetesDuJour, getThemeNatal } from '../services/astroService';
import { LECTURES_MAISONS, SIGNIFICATIONS_MAISONS, getVariationHoroscope, getVariationMouvement } from '../data/lecturesMaisons';

const SIGNES = [
  "Bélier", "Taureau", "Gémeaux", "Cancer",
  "Lion", "Vierge", "Balance", "Scorpion",
  "Sagittaire", "Capricorne", "Verseau", "Poissons"
];

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

function getMaison(degrees, maisons) {
  if (!maisons?.length) return null;
  for (let i = 0; i < 12; i++) {
    const debut = maisons[i];
    const fin = maisons[(i + 1) % 12];
    const d = ((degrees % 360) + 360) % 360;
    if (debut <= fin) {
      if (d >= debut && d < fin) return i + 1;
    } else {
      if (d >= debut || d < fin) return i + 1;
    }
  }
  return 1;
}

function getMaisonTransit(planete, maisonsNatales) {
  if (!maisonsNatales?.length || !planete) return null;
  const degrees = planete.degres + (SIGNES.indexOf(planete.signe) * 30);
  return getMaison(degrees, maisonsNatales);
}

const Horoscope = ({ onBack, onUpgrade }) => {
  const { user } = useAuthContext();
  const { profile, loading } = useProfile(user?.id);
  
  const signeSolaire = profile?.signe_solaire;
  const todayStr = new Date().toISOString().split('T')[0];
  const jourAnnee = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const semaine = Math.floor(jourAnnee / 7);
  const mois = new Date().getMonth();
  
  const horoscope = useMemo(() => {
    if (!signeSolaire) return null;
    return getHoroscopeComplet(signeSolaire);
  }, [signeSolaire]);

  const lectureComplete = useMemo(() => {
    if (!profile) return null;
    return generateMessagePersonnalise(profile);
  }, [profile]);

  const themeNatal = useMemo(() => {
    if (!profile?.date_naissance) return null;
    return getThemeNatal(profile.date_naissance, profile.heure_naissance || '12:00', profile.latitude || 48.8566, profile.longitude || 2.3522);
  }, [profile?.date_naissance, profile?.heure_naissance, profile?.latitude, profile?.longitude]);

  const planetesDuJour = useMemo(() => getPlanetesDuJour(), [todayStr]);

  const transitDominant = useMemo(() => {
    if (!themeNatal?.maisons?.length || !planetesDuJour?.length) return null;
    
    const priorites = ["Lune", "Mars", "Vénus", "Jupiter", "Saturne", "Mercure"];
    
    for (const nom of priorites) {
      const planete = planetesDuJour.find(p => p.nom === nom);
      if (!planete) continue;
      const maison = getMaisonTransit(planete, themeNatal.maisons);
      if (maison) {
        const nomSansAccent = planete.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cleBase = `${nomSansAccent}_maison_${maison}`;
        const variation = getVariationMouvement(cleBase, jourAnnee);
        
        return {
          planete: planete.nom,
          signe: planete.signe,
          maison,
          texte: variation || LECTURES_MAISONS[cleBase] || `${planete.nom} en ${planete.signe} influence ta journée.`
        };
      }
    }
    return null;
  }, [planetesDuJour, themeNatal, jourAnnee]);

  const perspectiveHebdo = useMemo(() => {
    if (!themeNatal?.maisons?.length || !planetesDuJour?.length) return null;
    
    const planetesLentes = planetesDuJour.filter(p => 
      ["Mars", "Jupiter", "Saturne"].includes(p.nom)
    );
    const planete = planetesLentes[0] || planetesDuJour[0];
    const maison = getMaisonTransit(planete, themeNatal.maisons);
    
    if (!maison) return null;
    
    const nomSansAccent = planete.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleBase = `${nomSansAccent}_maison_${maison}`;
    const variation = getVariationMouvement(cleBase, semaine);
    
    return {
      planete: planete.nom,
      signe: planete.signe,
      maison,
      texte: variation || LECTURES_MAISONS[cleBase] || `${planete.nom} en ${planete.signe} influence ta semaine.`
    };
  }, [planetesDuJour, themeNatal, semaine]);

  const perspectiveMensuelle = useMemo(() => {
    if (!themeNatal?.maisons?.length || !planetesDuJour?.length) return null;
    
    const planete = planetesDuJour.find(p => p.nom === "Jupiter") || 
                    planetesDuJour.find(p => p.nom === "Saturne") ||
                    planetesDuJour[0];
    const maison = getMaisonTransit(planete, themeNatal.maisons);
    
    if (!maison) return null;
    
    const nomSansAccent = planete.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleBase = `${nomSansAccent}_maison_${maison}`;
    const variation = getVariationMouvement(cleBase, mois);
    
    return {
      planete: planete.nom,
      signe: planete.signe,
      maison,
      texte: variation || LECTURES_MAISONS[cleBase] || `${planete.nom} en ${planete.signe} colore ton mois.`
    };
  }, [planetesDuJour, themeNatal, mois]);

  const dateAujourdhui = useMemo(() => {
    const date = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(new Date());
    return date.charAt(0).toUpperCase() + date.slice(1);
  }, [todayStr]);

  const domaines = useMemo(() => {
    if (!horoscope) return [];
    
    const maisons = themeNatal?.maisons;
    const venus = planetesDuJour.find(p => p.nom === "Vénus");
    const mars = planetesDuJour.find(p => p.nom === "Mars");
    const lune = planetesDuJour.find(p => p.nom === "Lune");
    
    const maisonVenus = getMaisonTransit(venus, maisons);
    const maisonMars = getMaisonTransit(mars, maisons);
    const maisonLune = getMaisonTransit(lune, maisons);

    const generateUniqueScore = (baseScore, seedOffset) => {
      const seed = jourAnnee + seedOffset + (signeSolaire?.length || 0);
      const variation = Math.floor(Math.sin(seed) * 15);
      const finalScore = Math.max(25, Math.min(95, (baseScore || 60) + variation));
      return Math.round(finalScore / 20);
    };
    
    const getTexteDomaine = (planete, maison, fallbackTexte) => {
      if (planete && maison) {
        const nomSansAccent = planete.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cleBase = `${nomSansAccent}_maison_${maison}`;
        const variation = getVariationHoroscope(cleBase, jourAnnee);
        if (variation) return { texte: variation, maison, planete: planete.nom };
      }
      return { texte: fallbackTexte, maison: null, planete: null };
    };
    
    const amour = getTexteDomaine(venus, maisonVenus, "Vénus reste discrète aujourd'hui.");
    const travail = getTexteDomaine(mars, maisonMars, "Persévérez dans vos efforts actuels.");
    const bienEtre = getTexteDomaine(lune, maisonLune, "Prenez un moment pour respirer.");
    
    return [
      {
        label: "Amour",
        texte: amour.texte,
        score: generateUniqueScore(horoscope.amour?.score, 10),
        couleur: "#C17B8A",
        icone: "♥",
        planete: amour.planete || "Vénus",
        maison: amour.maison,
        maisonTexte: amour.maison ? SIGNIFICATIONS_MAISONS[amour.maison] : null
      },
      {
        label: "Travail",
        texte: travail.texte,
        score: generateUniqueScore(horoscope.travail?.score, 42),
        couleur: "#7B9ECB",
        icone: "◆",
        planete: travail.planete || "Mars",
        maison: travail.maison,
        maisonTexte: travail.maison ? SIGNIFICATIONS_MAISONS[travail.maison] : null
      },
      {
        label: "Bien-être",
        texte: bienEtre.texte,
        score: generateUniqueScore(horoscope.bienEtre?.score, 77),
        couleur: "#7BB8A0",
        icone: "●",
        planete: bienEtre.planete || "Lune",
        maison: bienEtre.maison,
        maisonTexte: bienEtre.maison ? SIGNIFICATIONS_MAISONS[bienEtre.maison] : null
      }
    ];
  }, [horoscope, planetesDuJour, themeNatal, jourAnnee, signeSolaire]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-night gap-4">
        <div className="w-8 h-8 border-t-2 border-gold rounded-full animate-spin" />
        <div className="text-gold font-serif italic text-sm tracking-widest animate-pulse">
          Consultation des éphémérides...
        </div>
      </div>
    );
  }

  if (!signeSolaire || !horoscope) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-night px-8 text-center">
        <p className="text-gold font-serif italic mb-6">Votre thème natal n'est pas encore défini dans les astres.</p>
        <button 
          onClick={onBack} 
          className="text-muted text-[10px] uppercase tracking-[3px] border border-white/10 px-6 py-3 rounded-full hover:bg-white/5 transition-colors"
        >
          Retour au sanctuaire
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-5 py-2 bg-night min-h-screen pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button 
          onClick={onBack} 
          className="text-2xl text-muted hover:text-gold transition-colors p-2 -ml-2"
        >
          ←
        </button>
        <div>
          <p className="text-[9px] text-gold tracking-[3px] uppercase font-bold opacity-60">{dateAujourdhui}</p>
          <h3 className="text-cream font-serif text-lg tracking-wide">Horoscope du Jour</h3>
        </div>
      </header>

      <section className="flex flex-col items-center py-8 border-y border-white/5 my-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 blur-[80px] rounded-full" />
        <div className="mb-3 relative z-10">
          <ZodiacSymbol signe={signeSolaire} size={60} color="#C9A460" />
        </div>
        <h1 className="text-gold font-serif tracking-[4px] text-xl uppercase relative z-10">
          {signeSolaire}
        </h1>
        <p className="text-[10px] text-muted mt-2 uppercase tracking-widest relative z-10 opacity-50">
          {ZODIAC_DATES[signeSolaire]}
        </p>
      </section>

      <div className="py-8 px-6 mb-8 bg-white/[0.02] rounded-[32px] border border-white/5 relative">
        <span className="absolute top-4 left-6 text-4xl text-gold/20 font-serif">«</span>
        <p className="italic font-serif text-base text-cream/90 leading-[1.8] text-center relative z-10 px-2">
          {lectureComplete?.message || horoscope.message}
        </p>
        {lectureComplete?.maison && (
          <p className="text-[9px] text-gold/30 tracking-widest uppercase mt-3 text-center relative z-10">
            {lectureComplete.planete.nom} · maison {lectureComplete.maison} · {lectureComplete.significationMaison}
          </p>
        )}
        <span className="absolute bottom-0 right-6 text-4xl text-gold/20 font-serif">»</span>
      </div>

      {horoscope.tags && (
        <div className="flex gap-2 mb-10 justify-center flex-wrap">
          {horoscope.tags.map((tag, index) => (
            <span 
              key={index}
              className="bg-gold/5 text-gold border border-gold/10 rounded-full px-4 py-1.5 text-[9px] tracking-widest uppercase font-black"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Transit dominant du jour (Premium) */}
      <PremiumGate 
        featureKey="transits_personnels" 
        onUpgrade={onUpgrade} 
        preview={true}
      >
        {transitDominant && (
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex items-center gap-3 opacity-30 mb-4">
              <p className="text-[9px] text-muted tracking-[3px] uppercase font-bold whitespace-nowrap">Votre transit dominant</p>
              <div className="h-px bg-white/10 w-full" />
            </div>
            <Card className="bg-gradient-to-br from-[#120E22] to-[#1C2040] border-gold/20 p-5">
              <div className="flex items-start gap-4 mb-3">
                <div className="mt-1">
                  <PlanetCircle planete={transitDominant.planete} size="sm" couleur="#C9A460" />
                </div>
                <div>
                  <p className="font-serif text-base text-cream">
                    {transitDominant.planete} en {transitDominant.signe}
                  </p>
                  <p className="text-[9px] text-gold/40 tracking-widest uppercase mt-0.5">
                    Maison {transitDominant.maison}
                  </p>
                </div>
              </div>
              <p className="text-[13px] text-cream/80 leading-relaxed font-sans">
                {transitDominant.texte}
              </p>
            </Card>
          </div>
        )}
      </PremiumGate>

      <div className="space-y-6">
        <div className="flex items-center gap-3 opacity-30">
          <p className="text-[9px] text-muted tracking-[3px] uppercase font-bold whitespace-nowrap">Murmures des astres</p>
          <div className="h-px bg-white/10 w-full" />
        </div>

        <div className="space-y-4">
          {domaines.map((domaine, index) => (
            <Card key={index} className="bg-card/40 border-white/5 hover:border-gold/20 transition-all duration-500 group">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm opacity-80" style={{ color: domaine.couleur }}>{domaine.icone}</span>
                    <p className="text-[10px] tracking-[2px] uppercase font-black" style={{ color: domaine.couleur }}>
                      {domaine.label}
                    </p>
                    {domaine.maison && (
                      <span className="text-[8px] text-gold/40 tracking-wider ml-1">
                        {domaine.planete} · M{domaine.maison}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted/50 font-serif italic">{domaine.score * 20}%</span>
                </div>
                
                <p className="text-[13px] text-cream/70 leading-relaxed font-sans group-hover:text-cream transition-colors">
                  {domaine.texte}
                </p>
                
                {domaine.maisonTexte && (
                  <p className="text-[9px] text-gold/30 tracking-widest uppercase font-sans">
                    {domaine.maisonTexte}
                  </p>
                )}
                
                <div className="pt-2">
                  <ScoreBar score={domaine.score} couleur={domaine.couleur} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cycles Longs personnalisés (Premium) */}
      <PremiumGate 
        featureKey="horoscope_semaine" 
        onUpgrade={onUpgrade} 
        preview={true}
      >
        <div className="space-y-4 mt-10 animate-in fade-in slide-in-from-bottom-2 duration-1000">
          <div className="flex items-center gap-3 opacity-30">
            <p className="text-[9px] text-muted tracking-[3px] uppercase font-bold whitespace-nowrap">Cycles Longs</p>
            <div className="h-px bg-white/10 w-full" />
          </div>

          <div className="bg-gradient-to-br from-card to-night border border-white/5 rounded-[28px] p-6 space-y-6">
            {perspectiveHebdo && (
              <div>
                <h4 className="text-[10px] text-gold tracking-[3px] uppercase mb-3 font-black">Perspective Hebdomadaire</h4>
                <div className="flex items-start gap-3 mb-2">
                  <PlanetCircle planete={perspectiveHebdo.planete} size="sm" couleur="#C9A460" />
                  <div>
                    <p className="text-gold/50 text-[10px] tracking-widest uppercase">
                      {perspectiveHebdo.planete} en {perspectiveHebdo.signe} · M{perspectiveHebdo.maison}
                    </p>
                  </div>
                </div>
                <p className="text-muted text-xs leading-relaxed opacity-80">
                  {perspectiveHebdo.texte}
                </p>
              </div>
            )}
            
            {perspectiveHebdo && perspectiveMensuelle && (
              <div className="h-px bg-white/5 w-1/2 mx-auto" />
            )}

            {perspectiveMensuelle && (
              <div>
                <h4 className="text-[10px] text-gold tracking-[3px] uppercase mb-3 font-black">Climat Mensuel</h4>
                <div className="flex items-start gap-3 mb-2">
                  <PlanetCircle planete={perspectiveMensuelle.planete} size="sm" couleur="#C9A460" />
                  <div>
                    <p className="text-gold/50 text-[10px] tracking-widest uppercase">
                      {perspectiveMensuelle.planete} en {perspectiveMensuelle.signe} · M{perspectiveMensuelle.maison}
                    </p>
                  </div>
                </div>
                <p className="text-muted text-xs leading-relaxed opacity-80">
                  {perspectiveMensuelle.texte}
                </p>
              </div>
            )}

            {!perspectiveHebdo && !perspectiveMensuelle && (
              <>
                <div>
                  <h4 className="text-[10px] text-gold tracking-[3px] uppercase mb-3 font-black">Perspective Hebdomadaire</h4>
                  <p className="text-muted text-xs leading-relaxed opacity-80">
                    Complétez votre thème natal pour débloquer vos perspectives personnalisées.
                  </p>
                </div>
                <div className="h-px bg-white/5 w-1/2 mx-auto" />
                <div>
                  <h4 className="text-[10px] text-gold tracking-[3px] uppercase mb-3 font-black">Climat Mensuel</h4>
                  <p className="text-muted text-xs leading-relaxed opacity-80">
                    Votre date de naissance est nécessaire pour calculer vos transits à long terme.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </PremiumGate>
    </div>
  );
};

export default Horoscope;