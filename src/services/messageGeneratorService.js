// src/services/messageGeneratorService.js
// Génère un message horoscope unique chaque jour par signe sans API
// Combine des fragments de texte de manière déterministe
// Même date + même signe = même message. Toujours.
// Supporte la génération personnalisée par thème natal
// Mémoire des 3 derniers messages pour éviter les répétitions

import { OUVERTURES, CLOTURES } from '../data/horoscopeFragments';
import { ASPECTS_TEXTE, getPlanetesDuJour, getThemeNatal } from './astroService';
import { LECTURES_MAISONS, SIGNIFICATIONS_MAISONS } from '../data/lecturesMaisons';

const SIGNES = [
  "Bélier", "Taureau", "Gémeaux", "Cancer",
  "Lion", "Vierge", "Balance", "Scorpion",
  "Sagittaire", "Capricorne", "Verseau", "Poissons"
];

// ━━━ MÉMOIRE DES DERNIERS MESSAGES ━━━
// Stocke les 3 dernières clés utilisées par utilisateur (identifié par date_naissance)
const memoiresUtilisateurs = {};

function getMemoireUtilisateur(profileId) {
  if (!memoiresUtilisateurs[profileId]) {
    memoiresUtilisateurs[profileId] = [];
  }
  return memoiresUtilisateurs[profileId];
}

function ajouterAMemoire(profileId, cle) {
  const memoire = getMemoireUtilisateur(profileId);
  memoire.push(cle);
  if (memoire.length > 3) {
    memoire.shift();
  }
}

function estDejaUtilisee(profileId, cle) {
  return getMemoireUtilisateur(profileId).includes(cle);
}

// ━━━ 1. SEED DÉTERMINISTE ━━━
// Date + signe → nombre unique reproductible

function getSeed(dateStr, signe) {
  const str = dateStr + signe;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// ━━━ 2. SÉLECTEUR PSEUDO-ALÉATOIRE ━━━
// Choisit un index dans un tableau de façon déterministe

function pick(array, seed, offset = 0) {
  return array[(seed + offset) % array.length];
}

// ━━━ 3. GÉNÉRATEUR PRINCIPAL ━━━

export function generateMessageDuJour(signeSolaire) {
  if (!signeSolaire) return null;

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const seed = getSeed(dateStr, signeSolaire);

  const ouverturesSigne = OUVERTURES[signeSolaire] || OUVERTURES["Bélier"];
  const ouverture = pick(ouverturesSigne, seed, 0);

  const planetes = getPlanetesDuJour();
  const planete = pick(planetes, seed, 1);
  const cleAspect = `${planete.nom}_${planete.signe}`;
  const influencePlanete = ASPECTS_TEXTE[cleAspect]
    || planete.aspect
    || `${planete.nom} en ${planete.signe} colore discrètement ta journée.`;

  const cloture = pick(CLOTURES, seed, 2);

  const liens = [
    " ", " Aujourd'hui, ", " Ce jour-ci, ", " En ce moment, "
  ];
  const lien = pick(liens, seed, 3);

  return `${ouverture}${lien}${influencePlanete.toLowerCase()} ${cloture}`;
}

// ━━━ 4. GÉNÉRATEUR D'HOROSCOPE COMPLET ━━━

const DOMAINES_TEXTES = {
  amour: [
    "Une conversation honnête vaut mieux qu'un silence confortable.",
    "Ce que tu tais pèse parfois plus lourd que ce que tu exprimes.",
    "L'attention que tu portes aux autres aujourd'hui reviendra vers toi.",
    "Une connexion inattendue est possible — reste ouvert·e.",
    "Ce que tu ressens pour l'autre mérite d'être dit, même imparfaitement.",
    "L'amour ne se prouve pas par les grands gestes mais par les petits.",
    "Quelque chose dans tes liens actuels cherche à s'approfondir.",
    "La vulnérabilité que tu redoutes est souvent ce qui crée la vraie intimité.",
    "Ce que tu donnes sans attendre de retour est ce qui revient le plus."
  ],
  travail: [
    "Un effort discret aujourd'hui aura un écho que tu n'entends pas encore.",
    "La clarté que tu cherches viendra quand tu cesseras de la forcer.",
    "Ce projet que tu reportes mérite d'être commencé, même imparfaitement.",
    "Une conversation professionnelle peut changer quelque chose aujourd'hui.",
    "La patience que tu montres dans ce processus est une compétence rare.",
    "Ce que tu accomplis sans aide vaut d'être reconnu — commence par toi.",
    "Une idée que tu juges trop simple est peut-être la meilleure.",
    "Ce n'est pas le moment de tout décider — c'est le moment d'avancer.",
    "Ton intuition professionnelle est souvent en avance sur tes données."
  ],
  bienEtre: [
    "Ton corps te demande quelque chose de simple — du calme, du mouvement, du silence.",
    "Une pause courte vaut mieux qu'une longue fatigue.",
    "Ce que tu manges et comment tu respires sont des actes politiques envers toi-même.",
    "Le sommeil de cette nuit est plus important que tu ne le penses.",
    "Quelque chose dans ton environnement immédiat mérite d'être changé.",
    "Tu as besoin de moins de stimulation et de plus de présence aujourd'hui.",
    "Prendre soin de toi n'est pas de l'égoïsme — c'est de la durabilité.",
    "Ce que tu ressens dans ton corps est une information, pas un obstacle.",
    "Un moment seul avec toi-même aujourd'hui vaut tous les conseils du monde."
  ]
};

const TOUS_LES_TAGS = [
  "Introspection", "Clarté", "Mouvement", "Silence",
  "Courage", "Douceur", "Patience", "Élan",
  "Lâcher prise", "Ancrage", "Connexion", "Solitude",
  "Création", "Vérité", "Présence", "Transition"
];

function generateDomaine(signe, domaine, seed) {
  const offset = domaine === 'amour' ? 10
               : domaine === 'travail' ? 20 : 30;
  const textes = DOMAINES_TEXTES[domaine];
  return textes[(seed + offset) % textes.length];
}

function generateTags(seed) {
  const tag1 = TOUS_LES_TAGS[seed % TOUS_LES_TAGS.length];
  const tag2 = TOUS_LES_TAGS[(seed + 7) % TOUS_LES_TAGS.length];
  return tag1 === tag2 ? [tag1] : [tag1, tag2];
}

export function generateHoroscopeComplet(signeSolaire) {
  const message = generateMessageDuJour(signeSolaire);

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const seed = getSeed(dateStr, signeSolaire);

  const score = (base, offset) => 55 + ((seed + offset) % 40);

  return {
    message,
    amour: {
      score: score(0, 1),
      texte: generateDomaine(signeSolaire, 'amour', seed)
    },
    travail: {
      score: score(0, 2),
      texte: generateDomaine(signeSolaire, 'travail', seed)
    },
    bienEtre: {
      score: score(0, 3),
      texte: generateDomaine(signeSolaire, 'bienEtre', seed)
    },
    tags: generateTags(seed)
  };
}

// ━━━ 5. GÉNÉRATEUR PERSONNALISÉ PAR MAISON ━━━

function getMaison(degrees, maisons) {
  if (!maisons?.length) return 1;
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
  if (!maisonsNatales?.length) return 1;
  const degrees = planete.degres + (SIGNES.indexOf(planete.signe) * 30);
  return getMaison(degrees, maisonsNatales);
}

export function generateMessagePersonnalise(profile) {
  if (!profile?.date_naissance) return null;

  try {
    const lat = profile.latitude || 48.8566;
    const lng = profile.longitude || 2.3522;

    // 1. Calcule le thème natal réel
    const theme = getThemeNatal(
      profile.date_naissance,
      profile.heure_naissance || '12:00',
      lat,
      lng
    );

    if (!theme) return null;

    // 2. Récupère les planètes du jour
    const planetesDuJour = getPlanetesDuJour();

    // 3. Planète prioritaire tournante selon la date du jour
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const seed = getSeed(dateStr, profile.date_naissance);

    const planetesDisponibles = ["Lune", "Vénus", "Mars", "Mercure", "Jupiter", "Saturne"];
    
    // Essaie chaque planète dans l'ordre du seed jusqu'à en trouver une non utilisée récemment
    let planeteSignificative = null;
    let maisonTransit = null;
    let clePersonnalisee = null;
    let lecturePersonnalisee = null;
    
    const profileId = profile.date_naissance + (profile.heure_naissance || '12:00');
    
    for (let offset = 0; offset < planetesDisponibles.length; offset++) {
      const indexPlanete = (seed + offset) % planetesDisponibles.length;
      const nomPlaneteChoisie = planetesDisponibles[indexPlanete];
      
      const candidate = planetesDuJour.find(p => p.nom === nomPlaneteChoisie) || planetesDuJour[0];
      const candidateMaison = getMaisonTransit(candidate, theme.maisons);
      const candidateCle = `${candidate.nom}_maison_${candidateMaison}`;
      
      if (!estDejaUtilisee(profileId, candidateCle)) {
        planeteSignificative = candidate;
        maisonTransit = candidateMaison;
        clePersonnalisee = candidateCle;
        lecturePersonnalisee = LECTURES_MAISONS[candidateCle];
        break;
      }
    }
    
    // Si toutes les planètes sont déjà utilisées, prendre la première (la plus ancienne mémoire sera supprimée)
    if (!planeteSignificative) {
      const nomPlaneteChoisie = planetesDisponibles[seed % planetesDisponibles.length];
      planeteSignificative = planetesDuJour.find(p => p.nom === nomPlaneteChoisie) || planetesDuJour[0];
      maisonTransit = getMaisonTransit(planeteSignificative, theme.maisons);
      clePersonnalisee = `${planeteSignificative.nom}_maison_${maisonTransit}`;
      lecturePersonnalisee = LECTURES_MAISONS[clePersonnalisee];
    }

    // 6. Assemble le message final
    if (lecturePersonnalisee) {
      ajouterAMemoire(profileId, clePersonnalisee);
      return {
        message: lecturePersonnalisee,
        planete: planeteSignificative,
        maison: maisonTransit,
        significationMaison: SIGNIFICATIONS_MAISONS[maisonTransit],
        source: 'maison'
      };
    }

    return null;

  } catch (e) {
    console.warn('generateMessagePersonnalise error:', e);
    return null;
  }
}