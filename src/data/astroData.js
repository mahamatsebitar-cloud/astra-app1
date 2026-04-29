// src/data/astroData.js

/**
 * ARCHIVE DE DONNÉES ASTRA — CONFIGURATION 2026
 * Ce fichier centralise les données de test et les structures de secours.
 * Ton : littéraire, introspectif, jamais cosmopolite.
 */

export const userData = {
  nom: "Léa Moreau",
  dateNaissance: "1997-01-25",
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
    aspect: "En rétrogradation — les mots que tu gardes ont peut-être plus de valeur que ceux que tu prononces.",
    couleur: "#C9A460"
  },
  {
    symbole: "♀",
    nom: "Vénus",
    signe: "Bélier",
    aspect: "Proche d'Uranus — quelque chose d'imprévu traverse ta vie affective. Laisse-le passer avant de décider ce qu'il signifie.",
    couleur: "#E29797"
  },
  {
    symbole: "♂",
    nom: "Mars",
    signe: "Sagittaire",
    aspect: "En harmonie avec le Soleil — ta vitalité connaît un sommet. La fougue n'est pas un défaut, c'est une matière à sculpter.",
    couleur: "#C15F5F"
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
    texte: "Une déclaration pourrait surgir là où tu ne l'attends pas. Vénus en Bélier ne connaît pas la prudence — et c'est peut-être une chance."
  },
  {
    label: "TRAVAIL",
    icone: "💼",
    couleur: "bleu",
    score: 3,
    scoreMax: 5,
    texte: "Mercure ralentit les échanges visibles, mais affine ce qui se trame en silence. Les coulisses ont leur propre vérité."
  },
  {
    label: "BIEN-ÊTRE",
    icone: "🌿",
    couleur: "vert",
    score: 5,
    scoreMax: 5,
    texte: "Mars accordé à ton Soleil — ton corps sait des choses que ton esprit ignore encore. Danse, marche, respire : il te parlera."
  }
];