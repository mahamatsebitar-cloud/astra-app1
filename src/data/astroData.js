// src/data/astroData.js

/**
 * ARCHIVE DE DONNÉES ASTRA - CONFIGURATION OPTIMISÉE 2026
 * Ce fichier centralise les données de test et les structures de secours.
 */

export const userData = {
  nom: "Léa Moreau",
  dateNaissance: "1997-01-25", // Format ISO pour la stabilité des calculs
  heureNaissance: "07:30",
  lieu: "Paris, France",
  signeSolaire: "Verseau",
  ascendant: "Poissons",
  signeLunaire: "Balance",
  emoji: "♒"
};

export const planetesDuJour = [
  {
    symbole: "☿",
    nom: "Mercure",
    signe: "Taureau",
    aspect: "Rétrograde — ta communication intérieure s'affine, prends le temps de peser tes mots.",
    couleur: "#C9A460" // Gold
  },
  {
    symbole: "♀",
    nom: "Vénus",
    signe: "Bélier",
    aspect: "Conjonction à Uranus — une étincelle inattendue peut bousculer ton cœur, reste ouverte.",
    couleur: "#E29797" // Rose
  },
  {
    symbole: "♂",
    nom: "Mars",
    signe: "Sagittaire",
    aspect: "Trigone au Soleil — ta vitalité est au zénith, canalise cette fougue avec grâce.",
    couleur: "#C15F5F" // Rouge sourd
  }
];

export const positionsPlanetaires = [
  { symbole: "☉", nom: "Soleil", position: "4° Verseau", maison: "Maison XII", couleur: "#C9A460" },
  { symbole: "☽", nom: "Lune", position: "18° Balance", maison: "Maison VIII", couleur: "#F5F5DC" },
  { symbole: "⇡", nom: "Ascendant", position: "12° Poissons", maison: "Maison I", couleur: "#9B97B0" },
  { symbole: "☿", nom: "Mercure", position: "28° Taureau", maison: "Maison III", couleur: "#C9A460" },
  { symbole: "♀", nom: "Vénus", position: "7° Bélier", maison: "Maison II", couleur: "#E29797" },
  { symbole: "♂", nom: "Mars", position: "15° Sagittaire", maison: "Maison X", couleur: "#C15F5F" },
  { symbole: "♃", nom: "Jupiter", position: "22° Verseau", maison: "Maison XII", couleur: "#F5F5DC" }
];

export const connexions = [
  {
    prenom: "Sophie",
    initiale: "S",
    signe: "Poissons",
    signeEmoji: "♓",
    score: 88,
    couleur: "rose"
  },
  {
    prenom: "Maxime",
    initiale: "M",
    signe: "Gémeaux",
    signeEmoji: "♊",
    score: 62,
    couleur: "gold"
  },
  {
    prenom: "Yasmine",
    initiale: "Y",
    signe: "Scorpion",
    signeEmoji: "♏",
    score: 79,
    couleur: "rouge"
  }
];

export const messageJour = "« Les eaux du Verseau te murmurent aujourd'hui : ce que tu libères en toi libère le monde autour de toi. Laisse couler. »";

export const horoscopeDomaines = [
  {
    label: "AMOUR",
    icone: "❤️",
    couleur: "rose",
    score: 4,
    scoreMax: 5,
    texte: "Une déclaration inattendue pourrait surgir. L'audace de Vénus en Bélier réveille tes sentiments les plus spontanés."
  },
  {
    label: "TRAVAIL",
    icone: "💼",
    couleur: "bleu",
    score: 3,
    scoreMax: 5,
    texte: "Mercure rétrograde ralentit les échanges, mais t'invite à peaufiner un projet en coulisses. Patience, Verseau."
  },
  {
    label: "BIEN-ÊTRE",
    icone: "🌿",
    couleur: "vert",
    score: 5,
    scoreMax: 5,
    texte: "Mars en harmonie avec ton Soleil décuple ton énergie vitale. Danse, marche, respire : ton corps te remerciera."
  }
];