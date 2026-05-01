// src/services/horoscopeService.js
// Service hybride : générateur dynamique avec fallback statique
// Combine messageGeneratorService + horoscopesData pour robustesse maximale

import { generateMessageDuJour, generateHoroscopeComplet } from './messageGeneratorService';
import { HOROSCOPES } from '../data/horoscopesData';

export function getHoroscopeComplet(signeSolaire) {
  try {
    // Essaie d'abord le générateur dynamique
    const generated = generateHoroscopeComplet(signeSolaire);
    if (generated?.message) return generated;

    // Fallback sur les données statiques
    const jourSemaine = new Date().getDay();
    const donnees = HOROSCOPES[signeSolaire]?.[jourSemaine];
    return donnees || generateHoroscopeComplet("Bélier");

  } catch (err) {
    console.warn('Générateur horoscope fallback:', err);
    const jourSemaine = new Date().getDay();
    return HOROSCOPES[signeSolaire]?.[jourSemaine]
      || HOROSCOPES["Bélier"]?.[0];
  }
}

export function getMessageDuJour(signeSolaire) {
  return getHoroscopeComplet(signeSolaire)?.message || "";
}

export { getHoroscopeComplet as getHoroscopeAujourdhui };