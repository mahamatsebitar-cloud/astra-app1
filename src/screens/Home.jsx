// src/screens/Home.jsx
import React, { useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import PlanetCircle from '../components/ui/PlanetCircle';
import AstraSymbol from '../components/ui/AstraSymbol';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { getHoroscopeComplet } from '../services/horoscopeService';
import { getPlanetesDuJour } from '../services/astroService';
import { getSaintDuJour, getPhaseLunaire, getSaisonActuelle } from '../data/identiteFrancaise';

// Banques de messages universels (Saisons)
import { MESSAGES_PRINTEMPS } from '../data/messagesPrintemps';
import { MESSAGES_ETE } from '../data/messagesEte';
import { MESSAGES_AUTOMNE } from '../data/messagesAutomne';
import { MESSAGES_HIVER } from '../data/messagesHiver';

const ZODIAC_SYMBOLS = {
  "Bélier": "♈", "Taureau": "♉", "Gémeaux": "♊", "Cancer": "♋",
  "Lion": "♌", "Vierge": "♍", "Balance": "♎", "Scorpion": "♏",
  "Sagittaire": "♐", "Capricorne": "♑", "Verseau": "♒", "Poissons": "♓"
};

const INFOS_MOUVEMENTS = {
  "Soleil": "Le Soleil illumine votre secteur actuel, apportant vitalité et clarté à vos projets personnels.",
  "Lune": "La Lune influence votre intuition et vos marées émotionnelles. Écoutez votre ressenti aujourd'hui.",
  "Mercure": "Mercure régit vos échanges. C'est le moment idéal pour clarifier un malentendu ou signer un contrat.",
  "Venus": "Vénus adoucit vos relations et favorise l'harmonie esthétique autour de vous.",
  "Mars": "Mars vous donne l'énergie d'agir. Ne dispersez pas votre force, ciblez vos objectifs.",
  "Jupiter": "Jupiter apporte une touche de chance et d'expansion. Voyez grand !",
  "Saturne": "Saturne demande de la structure et de la patience. Les efforts d'aujourd'hui sont les succès de demain.",
};

/**
 * MESSAGE UNIVERSEL (Pensée du jour) - Identique pour tous
 */
const getMessageUniverselSaisonnier = () => {
  const now = new Date();
  const mois = now.getMonth() + 1; 
  const jourCle = `${String(mois).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  let dictionnaire;
  if ([3, 4, 5].includes(mois)) dictionnaire = MESSAGES_PRINTEMPS;
  else if ([6, 7, 8].includes(mois)) dictionnaire = MESSAGES_ETE;
  else if ([9, 10, 11].includes(mois)) dictionnaire = MESSAGES_AUTOMNE;
  else dictionnaire = MESSAGES_HIVER;

  return dictionnaire[jourCle] || Object.values(dictionnaire)[0] || "Suivez votre étoile.";
};

const Home = ({ onHoroscope, onProfil }) => {
  const { user } = useAuthContext();
  const { profile, loading } = useProfile(user?.id);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  // Données communes
  const planetes = useMemo(() => getPlanetesDuJour(), []);
  const saint = useMemo(() => getSaintDuJour(), []);
  const phase = useMemo(() => getPhaseLunaire(), []);
  const saison = useMemo(() => getSaisonActuelle(), []);
  
  // 1. La pensée universelle (Même pour tous)
  const penseeDuJour = useMemo(() => getMessageUniverselSaisonnier(), []);

  // 2. Les données personnalisées (Uniquement si le profil est chargé)
  const displayNom = profile?.nom || user?.user_metadata?.nom || "Voyageur";
  const signeSolaire = profile?.signe_solaire || "Bélier";
  const signeLunaire = profile?.signe_lunaire || "Lune";
  const ascendant = profile?.ascendant || "Ascendant";
  const avatarUrl = profile?.avatar_url;

  // 3. L'horoscope personnalisé (Différent par signe)
  const horoscope = useMemo(() => getHoroscopeComplet(signeSolaire), [signeSolaire]);

  const dateAujourdhui = useMemo(() => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date());
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gold font-serif italic animate-pulse text-sm">Consultation des éphémérides...</div>
      </div>
    );
  }

  return (
    <div className="pt-2 space-y-4 w-full pb-10">

      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <div>
          <p className="text-[10px] text-muted tracking-widest uppercase font-sans">{dateAujourdhui}</p>
          <h3 className="text-cream text-base font-serif">
            Bonjour, <span className="text-gold">{displayNom.split(' ')[0]}</span>
          </h3>
          {saint && <p className="text-[9px] text-muted/50 font-sans mt-0.5">Fête : {saint}</p>}
        </div>
        <div onClick={onProfil} className="w-10 h-10 bg-[#141731] border-[1.5px] border-gold rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-all overflow-hidden">
          {avatarUrl ? <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" /> :
          <span className="text-gold font-serif text-lg">{ZODIAC_SYMBOLS[signeSolaire]}</span>}
        </div>
      </div>

      {/* Card Signe Principal (Personnalisé) */}
      <Card className="flex items-center gap-4 border-gold/20 bg-gradient-to-r from-card to-[#1A1D3D]">
        <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center bg-[#141731] shrink-0">
          <span className="text-gold text-2xl" style={{ fontVariantEmoji: 'text' }}>{ZODIAC_SYMBOLS[signeSolaire]}</span>
        </div>
        <div className="overflow-hidden text-left flex-1">
          <p className="text-[11px] text-gold tracking-wide uppercase font-sans font-bold">Soleil en {signeSolaire}</p>
          <p className="text-[10px] text-[#B0ADCA] font-sans flex items-center gap-1.5">
            <AstraSymbol name="lune" /> {signeLunaire}
            <span className="opacity-20">·</span>
            <AstraSymbol name="ascendant" /> {ascendant}
          </p>
        </div>
        {phase && (
          <div className="ml-auto text-right shrink-0">
            <p className="text-[10px] text-gold/60 font-sans">{phase.symbole} {phase.nom}</p>
            <p className="text-[9px] text-muted font-sans mt-0.5">Énergie {phase.energie}</p>
          </div>
        )}
      </Card>

      {/* Horoscope Personnalisé (Différent pour chaque utilisateur) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gold tracking-[2px] uppercase font-bold">Votre ciel aujourd'hui</span>
          <div className="flex-1 h-px bg-[#1C2040]" />
          <Tag><span className="astro-symbol">♄{"\uFE0E"}</span> Saturne actif</Tag>
        </div>
        <Card className="relative overflow-hidden border-gold/10">
          <p className="italic font-serif text-sm text-cream leading-[1.85] relative z-10">
            {horoscope?.message || "Les étoiles préparent votre chemin..."}
          </p>
          <div className="flex gap-2 mt-4 flex-wrap relative z-10">
            {horoscope?.tags?.map((tag) => (<Tag key={tag}>{tag}</Tag>))}
          </div>
        </Card>
      </div>

      {/* Mouvements Célestes */}
      <div className="space-y-3">
        <p className="text-[9px] text-muted tracking-[2px] uppercase ml-1 font-sans">Mouvements Célestes</p>
        <div className="space-y-2">
          {planetes.map((planete, index) => (
            <Card
              key={index}
              onClick={() => setSelectedPlanet(planete)}
              className="flex items-center gap-3 py-3 hover:bg-white/5 transition-all active:scale-[0.98] group cursor-pointer border-border/20"
            >
              <PlanetCircle size="sm" symbole={planete.symbole} couleur={planete.couleur} />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-cream text-[13px] font-serif">{planete.nom}</p>
                  {planete.retrograde && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase">Rétrograde</span>
                  )}
                </div>
                <p className="text-muted text-[10px] leading-snug font-sans mt-0.5">{planete.aspect}</p>
              </div>
              <span className="text-gold/30 text-lg group-hover:text-gold transition-colors px-2">›</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Pensée du Jour (Universelle) + Saison */}
      <div className="border-t border-border/20 pt-6 mt-2 space-y-6">
        <div>
          <p className="text-[9px] text-muted/40 tracking-[2px] uppercase text-center font-sans mb-3">Pensée du jour</p>
          <p className="text-xs text-muted/70 italic font-serif text-center leading-relaxed px-6">
            "{penseeDuJour}"
          </p>
        </div>

        {saison && (
          <div className="space-y-2">
            <p className="text-[9px] text-muted/40 tracking-[2px] uppercase text-center font-sans">Saison en cours</p>
            <p className="text-[11px] text-muted/50 italic font-serif text-center px-8">{saison.citation}</p>
            <p className="text-[9px] text-gold/40 text-center font-sans uppercase tracking-widest">{saison.rituel}</p>
          </div>
        )}
      </div>

      {/* Bouton Horoscope */}
      <Card onClick={onHoroscope} className="flex justify-between items-center cursor-pointer hover:border-gold/50 transition-all bg-gradient-to-r from-[#120E22] to-[#1C2040] border-gold/30">
        <div className="text-left">
          <p className="text-[10px] text-gold tracking-widest uppercase font-bold">Détails de l'Horoscope</p>
          <p className="text-muted text-[11px] mt-0.5 font-sans">Amour, Travail & Bien-être</p>
        </div>
        <span className="text-gold text-xl">→</span>
      </Card>

      {/* Modal Planète */}
      {selectedPlanet && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6" onClick={() => setSelectedPlanet(null)}>
          <div className="bg-[#0E1228] border border-gold/30 rounded-2xl p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex justify-center">
               <PlanetCircle size="lg" symbole={selectedPlanet.symbole} couleur={selectedPlanet.couleur} />
            </div>
            <h2 className="font-serif text-xl text-gold mb-1">{selectedPlanet.nom}</h2>
            <p className="text-muted text-[10px] uppercase tracking-widest mb-4">{selectedPlanet.aspect}</p>
            <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-6" />
            <p className="text-cream/90 text-sm leading-relaxed italic">
              "{INFOS_MOUVEMENTS[selectedPlanet.nom] || "Cette configuration influence votre croissance."}"
            </p>
            <button onClick={() => setSelectedPlanet(null)} className="mt-8 text-[10px] text-gold/50 uppercase tracking-[2px] border border-gold/20 px-8 py-2 rounded-full">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;