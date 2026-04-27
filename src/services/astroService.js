// src/services/astroService.js

/**
 * Calcule le signe solaire en fonction de la date de naissance
 * @param {string} dateStr - Format "YYYY-MM-DD"
 */
export const getSigneSolaire = (dateStr) => {
  if (!dateStr) return "Bélier";
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Bélier";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taureau";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gémeaux";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Lion";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Vierge";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Balance";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpion";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittaire";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorne";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Verseau";
  
  return "Poissons";
};

/**
 * Calcule le signe lunaire (Version simplifiée pour le MVP)
 */
export const getSigneLunaire = (dateStr) => {
  // Le calcul lunaire réel demande une bibliothèque d'éphémérides
  // On retourne une valeur cohérente pour le test
  return "Taureau"; 
};

/**
 * Calcule l'Ascendant (Version simplifiée pour le MVP)
 */
export const getAscendant = (heure, latitude) => {
  // L'ascendant dépend de l'heure exacte et de la position géographique
  // Valeur par défaut pour éviter les crashs
  return "Scorpion";
};