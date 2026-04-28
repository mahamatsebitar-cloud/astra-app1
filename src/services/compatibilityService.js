// src/services/compatibilityService.js
import { supabase } from '../lib/supabase';

export const ELEMENTS = {
  Feu: ["Bélier", "Lion", "Sagittaire"],
  Terre: ["Taureau", "Vierge", "Capricorne"],
  Air: ["Gémeaux", "Balance", "Verseau"],
  Eau: ["Cancer", "Scorpion", "Poissons"]
};

export const MODALITES = {
  Cardinal: ["Bélier", "Cancer", "Balance", "Capricorne"],
  Fixe: ["Taureau", "Lion", "Scorpion", "Verseau"],
  Mutable: ["Gémeaux", "Vierge", "Sagittaire", "Poissons"]
};

const CITATIONS = {
  "Feu_Feu": "« Deux flammes qui se rencontrent ne s'éteignent jamais — elles inventent un incendie qui éclaire le monde. Votre passion mutuelle est un brasier sacré. »",
  "Feu_Air": "« Le souffle attise la braise, la flamme réchauffe le vent — votre union est une danse où chacun révèle la grandeur de l'autre. »",
  "Feu_Terre": "« Le volcan rencontre la montagne, et dans ce choc naît un paysage que nul n'avait imaginé. Vos différences sont vos fondations. »",
  "Feu_Eau": "« La vapeur qui s'élève quand le feu touche l'eau est le symbole de votre alchimie — mystérieuse et transformatrice. »",
  "Terre_Terre": "« Deux pierres qui s'assemblent bâtissent des cathédrales. Votre amour a la patience des racines et la force des fondations anciennes. »",
  "Terre_Air": "« La pierre donne forme au vent, le vent polit la pierre. Votre duo est une œuvre lente où chaque différence devient un chef-d'œuvre. »",
  "Terre_Eau": "« La terre assoiffe l'eau qui la rend fertile — ainsi vont vos cœurs, se nourrissant l'un l'autre dans un jardin secret. »",
  "Air_Air": "« Deux brises qui se croisent forment un vent capable de traverser les océans. Votre liberté partagée est la plus belle des fidélités. »",
  "Air_Eau": "« La brume naît de la rencontre de l'air et de l'eau — votre amour a cette texture de rêve qui invite au mystère. »",
  "Eau_Eau": "« Deux rivières qui confluent deviennent un fleuve impossible à remonter. Vos âmes se reconnaissent dans une intimité océanique. »"
};

export const getElement = (signe) => {
  if (!signe) return null;
  for (const [element, signes] of Object.entries(ELEMENTS)) {
    if (signes.includes(signe)) return element;
  }
  return null;
};

const calculateElementScore = (signe1, signe2) => {
  const el1 = getElement(signe1);
  const el2 = getElement(signe2);
  if (!el1 || !el2) return 25;
  if (el1 === el2) return 40;

  const compatibles = { "Feu": "Air", "Air": "Feu", "Terre": "Eau", "Eau": "Terre" };
  return (compatibles[el1] === el2) ? 35 : 20;
};

// Seed déterministe plus précis pour Astra
const getStableSeed = (p1, p2) => {
  const str = (p1.nom || "") + (p2.nom || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
  return hash;
};

export const calculateCompatibility = (profil1, profil2) => {
  if (!profil1 || !profil2) return { global: 0, amour: 0, communication: 0, valeurs: 0, complicite: 0, durabilite: 0 };

  const s1 = profil1.signe_solaire;
  const s2 = profil2.signe_solaire;
  const l1 = profil1.signe_lunaire;
  const l2 = profil2.signe_lunaire;
  const a1 = profil1.ascendant;
  const a2 = profil2.ascendant;

  const scoreSol = calculateElementScore(s1, s2);
  const scoreLun = calculateElementScore(l1, l2);
  const scoreAsc = calculateElementScore(a1, a2);
  const base = scoreSol + scoreLun + scoreAsc;

  const seed = getStableSeed(profil1, profil2);
  const varGen = (s, min, max) => min + (Math.abs(Math.sin(s)) * (max - min));

  return {
    global: Math.round(Math.min(Math.max(base, 30), 96)),
    amour: Math.round(varGen(seed, base - 5, base + 8)),
    communication: Math.round(varGen(seed + 1, base - 10, base + 5)),
    valeurs: Math.round(varGen(seed + 2, base - 3, base + 7)),
    complicite: Math.round(varGen(seed + 3, base - 6, base + 6)),
    durabilite: Math.round(varGen(seed + 4, base - 12, base + 4))
  };
};

export const getCitationCompatibilite = (profil1, profil2) => {
  const el1 = getElement(profil1?.signe_solaire);
  const el2 = getElement(profil2?.signe_solaire);
  if (!el1 || !el2) return "« Les astres tissent entre vous un fil invisible que seuls les cœurs attentifs peuvent percevoir. »";

  const combo = CITATIONS[`${el1}_${el2}`] || CITATIONS[`${el2}_${el1}`];
  return combo || "« Votre alliance est une promesse écrite dans le silence des étoiles. »";
};

export const saveCompatibility = async (userId, friendId, score) => {
  try {
    const { data, error } = await supabase
      .from('compatibility_shares')
      .upsert({
        user_id: userId,
        friend_id: friendId,
        score: score,
        created_at: new Date().toISOString()
      });
    return { data, error };
  } catch (error) {
    return { data: null, error: error.message };
  }
};