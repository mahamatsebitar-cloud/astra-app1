// src/screens/Home.jsx
import React, { useMemo, useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import PlanetCircle from '../components/ui/PlanetCircle';
import ZodiacSymbol from '../components/ui/ZodiacSymbol';
import AstraSymbol from '../components/ui/AstraSymbol';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { getPlanetesDuJour, getThemeNatal } from '../services/astroService';
import { generateMessageDuJour, generateMessagePersonnalise } from '../services/messageGeneratorService';
import { LECTURES_MAISONS, SIGNIFICATIONS_MAISONS, getVariationMouvement } from '../data/lecturesMaisons';
import { getSaintDuJour, getPhaseLunaire, getSaisonActuelle } from '../data/identiteFrancaise';
import { supabase } from '../lib/supabase';

// ... RESTE IDENTIQUE

const SIGNES = [
  "Bélier", "Taureau", "Gémeaux", "Cancer",
  "Lion", "Vierge", "Balance", "Scorpion",
  "Sagittaire", "Capricorne", "Verseau", "Poissons"
];

const MESSAGES_SAISONNIERS = {
  printemps: () => import('../data/messagesPrintemps'),
  ete: () => import('../data/messagesEte'),
  automne: () => import('../data/messagesAutomne'),
  hiver: () => import('../data/messagesHiver'),
};

const INFOS_MOUVEMENTS = {
  "Soleil": "Le Soleil illumine votre secteur actuel, apportant vitalité et clarté à vos projets personnels.",
  "Lune": "La Lune influence votre intuition et vos marées émotionnelles. Écoutez votre ressenti aujourd'hui.",
  "Mercure": "Mercure régit vos échanges. C'est le moment idéal pour clarifier un malentendu ou signer un contrat.",
  "Vénus": "Vénus adoucit vos relations et favorise l'harmonie esthétique autour de vous.",
  "Mars": "Mars vous donne l'énergie d'agir. Ne dispersez pas votre force, ciblez vos objectifs.",
  "Jupiter": "Jupiter apporte une touche de chance et d'expansion. Voyez grand !",
  "Saturne": "Saturne demande de la structure et de la patience. Les efforts d'aujourd'hui sont les succès de demain.",
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
  if (!maisonsNatales?.length) return null;
  const degrees = planete.degres + (SIGNES.indexOf(planete.signe) * 30);
  return getMaison(degrees, maisonsNatales);
}

let cachedMessage = "Les astres murmurent à votre âme aujourd'hui.";

const getMessageUniverselSaisonnier = () => {
  const maintenant = new Date();
  const mois = maintenant.getMonth() + 1;
  const jour = maintenant.getDate();

  let saisonKey;
  if ([3, 4, 5].includes(mois)) saisonKey = 'printemps';
  else if ([6, 7, 8].includes(mois)) saisonKey = 'ete';
  else if ([9, 10, 11].includes(mois)) saisonKey = 'automne';
  else saisonKey = 'hiver';

  if (!getMessageUniverselSaisonnier.cache) {
    getMessageUniverselSaisonnier.cache = {};
  }

  if (getMessageUniverselSaisonnier.cache[saisonKey]) {
    const messages = getMessageUniverselSaisonnier.cache[saisonKey];
    const cleJour = `${String(mois).padStart(2, '0')}-${String(jour).padStart(2, '0')}`;
    const message = messages[cleJour];
    if (typeof message === 'string') {
      cachedMessage = message;
      return message;
    }
    return cachedMessage;
  }

  MESSAGES_SAISONNIERS[saisonKey]().then(module => {
    let messages = module.default || module;
    if (messages.MESSAGES_PRINTEMPS) messages = messages.MESSAGES_PRINTEMPS;
    else if (messages.MESSAGES_ETE) messages = messages.MESSAGES_ETE;
    else if (messages.MESSAGES_AUTOMNE) messages = messages.MESSAGES_AUTOMNE;
    else if (messages.MESSAGES_HIVER) messages = messages.MESSAGES_HIVER;
    
    getMessageUniverselSaisonnier.cache[saisonKey] = messages;
    
    const cleJour = `${String(mois).padStart(2, '0')}-${String(jour).padStart(2, '0')}`;
    const message = messages[cleJour];
    if (typeof message === 'string') {
      cachedMessage = message;
    }
  }).catch(() => {});

  return cachedMessage;
};

const Home = ({ onHoroscope, onProfil }) => {
  const { user } = useAuthContext();
  const { profile, loading } = useProfile(user?.id);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const jourAnnee = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);

  const planetes = useMemo(() => getPlanetesDuJour(), [todayStr]);
  const saint = useMemo(() => getSaintDuJour(), [todayStr]);
  const phase = useMemo(() => getPhaseLunaire(), [todayStr]);
  const saison = useMemo(() => getSaisonActuelle(), [todayStr]);
  
  const penseeDuJour = useMemo(() => getMessageUniverselSaisonnier(), [todayStr]);

  const displayNom = profile?.nom || user?.user_metadata?.nom || "Voyageur";
  const signeSolaire = profile?.signe_solaire || "Bélier";
  const signeLunaire = profile?.signe_lunaire || "Lune";
  const ascendant = profile?.ascendant || "Ascendant";
  const avatarUrl = profile?.avatar_url;

  const themeNatal = useMemo(() => {
    if (!profile?.date_naissance) return null;
    return getThemeNatal(profile.date_naissance, profile.heure_naissance || '12:00', profile.latitude || 48.8566, profile.longitude || 2.3522);
  }, [profile?.date_naissance, profile?.heure_naissance, profile?.latitude, profile?.longitude]);

  const planetesPersonnalisees = useMemo(() => {
    if (!themeNatal?.maisons?.length) return planetes;
    return planetes.map(planete => {
      const maison = getMaisonTransit(planete, themeNatal.maisons);
      if (maison) {
        const nomSansAccent = planete.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cleBase = `${nomSansAccent}_maison_${maison}`;
        const variation = getVariationMouvement(cleBase, jourAnnee);
        return {
          ...planete,
          maison,
          aspectPersonnalise: variation || planete.aspect
        };
      }
      return planete;
    });
  }, [planetes, themeNatal, jourAnnee]);

  const messagePersonnalise = useMemo(() => {
    if (!profile) return null;
    return generateMessagePersonnalise(profile);
  }, [profile, todayStr]);

  const messageFinal = useMemo(() => {
    return messagePersonnalise?.message
      || generateMessageDuJour(signeSolaire);
  }, [messagePersonnalise, signeSolaire, todayStr]);

  const planeteActive = useMemo(() => {
    if (messagePersonnalise?.planete) {
      return messagePersonnalise.planete;
    }
    return null;
  }, [messagePersonnalise]);

  const dateAujourdhui = useMemo(() => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date());
  }, [todayStr]);

  // ━━━ STOCKE LES MESSAGES DU JOUR ET DU LENDEMAIN ━━━
  useEffect(() => {
    if (!user?.id || !messageFinal || !profile) return;
    
    const storeMessages = async () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      const planete = messagePersonnalise?.planete || planeteActive || null;
      
      // 1. Stocke le message d'aujourd'hui
      const { error: errToday } = await supabase
        .from('daily_messages')
        .upsert({
          user_id: user.id,
          date: todayStr,
          message: messageFinal,
          planete_nom: planete?.nom || null,
          planete_signe: planete?.signe || null,
          maison: messagePersonnalise?.maison || null,
          source: messagePersonnalise?.source || 'general'
        }, { onConflict: 'user_id,date' });
      
      if (errToday) console.error('Failed to store today message:', errToday);

      // 2. Pré-calcule et stocke le message de demain
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      
      try {
        const messageDemain = generateMessagePersonnalise(profile, tomorrow);
        
        if (messageDemain) {
          const { error: errTomorrow } = await supabase
            .from('daily_messages')
            .upsert({
              user_id: user.id,
              date: tomorrowStr,
              message: messageDemain.message,
              planete_nom: messageDemain.planete?.nom || null,
              planete_signe: messageDemain.planete?.signe || null,
              maison: messageDemain.maison || null,
              source: messageDemain.source || 'maison'
            }, { onConflict: 'user_id,date' });
            
          if (errTomorrow) console.error('Failed to store tomorrow message:', errTomorrow);
          else console.log('✓ Message demain stocké:', tomorrowStr);
        }
      } catch (e) {
        console.error('Failed to pre-calculate tomorrow message:', e);
      }
    };
    
    storeMessages();
  }, [user?.id, messageFinal, messagePersonnalise, planeteActive, profile]);

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
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gold font-serif text-sm lowercase">
              {displayNom.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Card Signe Principal */}
      <Card className="flex items-center gap-4 border-gold/20 bg-gradient-to-r from-card to-[#1A1D3D]">
        <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center bg-[#141731] shrink-0">
          <ZodiacSymbol signe={signeSolaire} size={28} color="#C9A460" />
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

      {/* Horoscope Personnalisé */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gold tracking-[2px] uppercase font-bold">Votre ciel aujourd'hui</span>
          <div className="flex-1 h-px bg-[#1C2040]" />
          {planeteActive ? (
            <Tag>
              <PlanetCircle planete={planeteActive.nom} size="sm" couleur={planeteActive.couleur} /> {planeteActive.nom} active
              {messagePersonnalise?.maison && <span className="ml-1 text-gold/50">· M{messagePersonnalise.maison}</span>}
            </Tag>
          ) : (
            <Tag><PlanetCircle planete="Saturne" size="sm" couleur="#C9A460" /> Saturne actif</Tag>
          )}
        </div>
        <Card className="relative overflow-hidden border-gold/10">
          <p className="italic font-serif text-sm text-cream leading-[1.85] relative z-10">
            {messageFinal || "Les étoiles préparent votre chemin..."}
          </p>
          {messagePersonnalise?.maison && (
            <p className="text-[9px] text-gold/40 tracking-widest uppercase mt-2 font-sans text-right">
              {messagePersonnalise.planete.nom} · maison {messagePersonnalise.maison}
            </p>
          )}
          <div className="flex gap-2 mt-4 flex-wrap relative z-10">
            {messagePersonnalise?.source === 'maison' && (
              <Tag>Maison {messagePersonnalise.maison}</Tag>
            )}
          </div>
        </Card>
      </div>

      {/* Mouvements Célestes */}
      <div className="space-y-3">
        <p className="text-[9px] text-muted tracking-[2px] uppercase ml-1 font-sans">Mouvements Célestes</p>
        <div className="space-y-2">
          {planetesPersonnalisees.map((planete, index) => (
            <Card
              key={index}
              onClick={() => setSelectedPlanet(planete)}
              className="flex items-center gap-3 py-3 hover:bg-white/5 transition-all active:scale-[0.98] group cursor-pointer border-border/20"
            >
              <PlanetCircle planete={planete.nom} size="sm" couleur={planete.couleur} symbole={planete.symbole} />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-cream text-[13px] font-serif">{planete.nom}</p>
                  {planete.maison && (
                    <span className="text-[8px] text-gold/40 tracking-wider">M{planete.maison}</span>
                  )}
                  {planete.retrograde && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 uppercase">Rétrograde</span>
                  )}
                </div>
                <p className="text-muted text-[10px] leading-snug font-sans mt-0.5">
                  {planete.aspectPersonnalise || planete.aspect}
                </p>
              </div>
              <span className="text-gold/30 text-lg group-hover:text-gold transition-colors px-2">›</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Pensée du Jour + Saison */}
      <div className="border-t border-border/20 pt-6 mt-2 space-y-6">
        <div>
          <p className="text-[9px] text-muted/40 tracking-[2px] uppercase text-center font-sans mb-3">Pensée du jour</p>
          <p className="text-xs text-muted/70 italic font-serif text-center leading-relaxed px-6">
            « {penseeDuJour} »
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
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6" onClick={() => setSelectedPlanet(null)}>
          <div className="bg-[#0E1228] border border-gold/30 rounded-2xl p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex justify-center">
               <PlanetCircle planete={selectedPlanet.nom} size="lg" couleur={selectedPlanet.couleur} symbole={selectedPlanet.symbole} />
            </div>
            <h2 className="font-serif text-xl text-gold mb-1">{selectedPlanet.nom}</h2>
            {selectedPlanet.maison && (
              <p className="text-gold/50 text-[10px] uppercase tracking-widest mb-2">Maison {selectedPlanet.maison} · {SIGNIFICATIONS_MAISONS[selectedPlanet.maison]}</p>
            )}
            <p className="text-muted text-[10px] uppercase tracking-widest mb-4">
              {selectedPlanet.position || selectedPlanet.aspect}
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-6" />
            <p className="text-cream/90 text-sm leading-relaxed italic">
              « {selectedPlanet.aspectPersonnalise || INFOS_MOUVEMENTS[selectedPlanet.nom] || "Cette configuration influence votre croissance."} »
            </p>
            <button onClick={() => setSelectedPlanet(null)} className="mt-8 text-[10px] text-gold/50 uppercase tracking-[2px] border border-gold/20 px-8 py-2 rounded-full">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;