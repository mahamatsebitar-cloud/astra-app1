const userData = {
    nom: "Léa Moreau",
    dateNaissance: "25 janvier 1997",
    heureNaissance: "07h30",
    lieu: "Paris, France",
    signeSolaire: "Verseau",
    ascendant: "Poissons",
    signeLunaire: "Balance",
    emoji: "♒"
  };
  
  const planetesDuJour = [
    {
      symbole: "☿",
      nom: "Mercure",
      signe: "Taureau",
      aspect: "Rétrograde — ta communication intérieure s'affine, prends le temps de peser tes mots.",
      couleur: "gold"
    },
    {
      symbole: "♀",
      nom: "Vénus",
      signe: "Bélier",
      aspect: "Conjonction à Uranus — une étincelle inattendue peut bousculer ton cœur, reste ouverte.",
      couleur: "rose"
    },
    {
      symbole: "♂",
      nom: "Mars",
      signe: "Sagittaire",
      aspect: "Trigone au Soleil — ta vitalité est au zénith, canalise cette fougue avec grâce.",
      couleur: "rouge"
    }
  ];
  
  const positionsPlanetaires = [
    { symbole: "☉", nom: "Soleil", position: "4° Verseau", maison: "Maison XII", couleur: "gold" },
    { symbole: "☽", nom: "Lune", position: "18° Balance", maison: "Maison VIII", couleur: "cream" },
    { symbole: "⇡", nom: "Ascendant", position: "12° Poissons", maison: "Maison I", couleur: "muted" },
    { symbole: "☿", nom: "Mercure", position: "28° Taureau", maison: "Maison III", couleur: "gold" },
    { symbole: "♀", nom: "Vénus", position: "7° Bélier", maison: "Maison II", couleur: "rose" },
    { symbole: "♂", nom: "Mars", position: "15° Sagittaire", maison: "Maison X", couleur: "rouge" },
    { symbole: "♃", nom: "Jupiter", position: "22° Verseau", maison: "Maison XII", couleur: "cream" }
  ];
  
  const connexions = [
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
  
  const messageJour = "« Les eaux du Verseau te murmurent aujourd'hui : ce que tu libères en toi libère le monde autour de toi. Laisse couler. »";
  
  const horoscopeDomaines = [
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
  
  export { userData, planetesDuJour, positionsPlanetaires, connexions, messageJour, horoscopeDomaines };