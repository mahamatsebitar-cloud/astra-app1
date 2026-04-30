// src/services/horoscopeService.js
import { HOROSCOPES } from '../data/horoscopesData';
import dayjs from 'dayjs';

/**
 * Normalise le nom du signe pour éviter les erreurs de casse ou d'accents.
 */
const normalizeSigne = (signe) => {
  if (!signe) return "Bélier";
  const map = {
    "belier": "Bélier",
    "taureau": "Taureau",
    "gemeaux": "Gémeaux",
    "cancer": "Cancer",
    "lion": "Lion",
    "vierge": "Vierge",
    "balance": "Balance",
    "scorpion": "Scorpion",
    "sagittaire": "Sagittaire",
    "capricorne": "Capricorne",
    "verseau": "Verseau",
    "poissons": "Poissons"
  };
  const key = signe.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return map[key] || signe;
};

/**
 * Récupère l'horoscope complet selon le signe et le jour de la semaine.
 */
const getHoroscopeAujourdhui = (signeSolaire) => {
  const signeNettoye = normalizeSigne(signeSolaire);
  
  // dayjs().day() : 0 (dimanche) à 6 (samedi)
  const jourSemaine = dayjs().day(); 
  
  // Recherche sécurisée dans la base de données
  const donneesSigne = HOROSCOPES[signeNettoye] || HOROSCOPES["Bélier"];
  
  // Fallback sur le jour 0 (dimanche) si le jour spécifique est manquant
  const horoscopeFinal = donneesSigne[jourSemaine] || donneesSigne[0];

  // Sécurité ultime : structure par défaut si l'objet est vide
  return {
    message: horoscopeFinal?.message || "Les étoiles préparent une surprise pour vous aujourd'hui.",
    amour: horoscopeFinal?.amour || { score: 75, texte: "L'harmonie règne dans votre ciel affectif." },
    travail: horoscopeFinal?.travail || { score: 70, texte: "Une opportunité se dessine à l'horizon." },
    bienEtre: horoscopeFinal?.bienEtre || { score: 80, texte: "Écoutez le rythme de votre corps." },
    tags: horoscopeFinal?.tags || ["Équilibre", "Sérénité"]
  };
};

/**
 * Extrait uniquement la citation poétique du jour.
 */
const getMessageDuJour = (signeSolaire) => {
  return getHoroscopeAujourdhui(signeSolaire).message;
};

/**
 * Alias pour obtenir l'objet complet.
 */
const getHoroscopeComplet = (signeSolaire) => {
  return getHoroscopeAujourdhui(signeSolaire);
};

export {
  getHoroscopeAujourdhui,
  getMessageDuJour,
  getHoroscopeComplet
};