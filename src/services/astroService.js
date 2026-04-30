// src/services/astroService.js
import dayjs from 'dayjs';

const SIGNES = [
  "Bélier", "Taureau", "Gémeaux", "Cancer",
  "Lion", "Vierge", "Balance", "Scorpion",
  "Sagittaire", "Capricorne", "Verseau", "Poissons"
];

const ASPECTS_TEXTE = {
  "Soleil_Bélier": "Le Soleil en Bélier embrase ton énergie vitale. C'est le moment d'oser et d'initier.",
  "Soleil_Taureau": "Le Soleil en Taureau t'ancre dans une stabilité rayonnante. Cultive la patience féconde.",
  "Soleil_Gémeaux": "Le Soleil en Gémeaux illumine ta curiosité. Les connexions et les idées abondent.",
  "Soleil_Cancer": "Le Soleil en Cancer éclaire ton foyer intérieur. L'intuition guide tes pas aujourd'hui.",
  "Soleil_Lion": "Le Soleil est chez lui en Lion. Ta créativité et ton charisme sont décuplés.",
  "Soleil_Vierge": "Le Soleil en Vierge affine ton discernement. L'ordre et le soin magnifient ta journée.",
  "Soleil_Balance": "Le Soleil en Balance harmonise tes relations. La beauté et l'équité t'inspirent.",
  "Soleil_Scorpion": "Le Soleil en Scorpion révèle les vérités cachées. Ta puissance intérieure se déploie.",
  "Soleil_Sagittaire": "Le Soleil en Sagittaire élargit tes horizons. L'aventure et la sagesse t'appellent.",
  "Soleil_Capricorne": "Le Soleil en Capricorne éclaire tes ambitions. La discipline construit ton succès.",
  "Soleil_Verseau": "Le Soleil en Verseau libère ton originalité. L'innovation guide tes actions.",
  "Soleil_Poissons": "Le Soleil en Poissons ouvre ton imaginaire. La compassion t'enveloppe aujourd'hui.",
  "Mercure_Bélier": "Ton esprit s'enflamme, les idées fusent sans filtre.",
  "Mercure_Taureau": "Ta pensée s'ancre dans le concret, chaque mot a du poids.",
  "Mercure_Gémeaux": "Ta communication intérieure s'affine, prends le temps de peser tes mots.",
  "Mercure_Cancer": "Les souvenirs colorent tes paroles d'une douceur mélancolique.",
  "Mercure_Lion": "Ta voix rayonne, le monde écoute ce que tu as à dire.",
  "Mercure_Vierge": "Ton analyse est chirurgicale, rien n'échappe à ton œil.",
  "Mercure_Balance": "Chaque échange cherche l'harmonie, tu pèses chaque nuance.",
  "Mercure_Scorpion": "Tu sondes les mystères, la vérité se cache entre les lignes.",
  "Mercure_Sagittaire": "Ton esprit galope vers l'horizon, les grandes idées t'appellent.",
  "Mercure_Capricorne": "Tes mots bâtissent des ponts solides, la prudence te guide.",
  "Mercure_Verseau": "L'éclair de génie te traverse, pense l'impossible.",
  "Mercure_Poissons": "Les murmures de l'âme traversent tes paroles flottantes.",
  "Vénus_Bélier": "Ton cœur s'embrase d'un désir soudain, ose le premier pas.",
  "Vénus_Taureau": "Une sensualité profonde t'enlace, savoure chaque caresse du moment.",
  "Vénus_Gémeaux": "Les mots d'amour dansent sur tes lèvres, la légèreté t'inspire.",
  "Vénus_Cancer": "La tendresse te submerge, ton foyer intérieur rayonne.",
  "Vénus_Lion": "Conjonction à Uranus — une étincelle inattendue peut bousculer ton cœur.",
  "Vénus_Vierge": "L'amour se niche dans les gestes simples et purs.",
  "Vénus_Balance": "L'harmonie amoureuse t'enveloppe, la beauté guide tes pas.",
  "Vénus_Scorpion": "La passion te consume, l'intensité est ton seul langage.",
  "Vénus_Sagittaire": "Ton cœur nomade cherche l'aventure au-delà des frontières.",
  "Vénus_Capricorne": "L'engagement se construit pierre par pierre, patiemment.",
  "Vénus_Verseau": "L'amour libre t'appelle, brise les chaînes du convenu.",
  "Vénus_Poissons": "L'extase mystique te traverse, aime sans limites.",
  "Mars_Bélier": "Ton énergie est un feu primal, agis sans hésiter.",
  "Mars_Taureau": "La force tranquille t'habite, avance avec détermination.",
  "Mars_Gémeaux": "Ton action se disperse, mille projets t'animent.",
  "Mars_Cancer": "Trigone au Soleil natal — ton énergie créatrice est à son apogée.",
  "Mars_Lion": "Le guerrier solaire se lève, conquiers ta scène.",
  "Mars_Vierge": "Ton action est méthodique, chaque geste compte.",
  "Mars_Balance": "La diplomatie est ton bouclier, agis avec élégance.",
  "Mars_Scorpion": "La puissance souterraine gronde, canalise cette force.",
  "Mars_Sagittaire": "L'aventure te porte, fonce vers l'inconnu.",
  "Mars_Capricorne": "L'ambition te sculpte, gravis les sommets.",
  "Mars_Verseau": "La rébellion créatrice t'anime, brise les codes.",
  "Mars_Poissons": "L'action se dissout dans le rêve, suis ton intuition.",
  "Jupiter_Bélier": "L'expansion est explosive, saisis chaque opportunité.",
  "Jupiter_Taureau": "L'abondance s'enracine, cultive ta prospérité.",
  "Jupiter_Gémeaux": "Expansion de ta pensée — les opportunités arrivent par la communication.",
  "Jupiter_Cancer": "La sagesse du cœur t'ouvre des portes insoupçonnées.",
  "Jupiter_Lion": "Ta lumière intérieure attire les bénédictions.",
  "Jupiter_Vierge": "Les détails cachent des trésors, affine ton regard.",
  "Jupiter_Balance": "La justice cosmique penche en ta faveur.",
  "Jupiter_Scorpion": "L'initiation te transforme, renais de tes cendres.",
  "Jupiter_Sagittaire": "Le grand voyage commence, ton âme s'élargit.",
  "Jupiter_Capricorne": "La patience récompense, bâtis ton empire.",
  "Jupiter_Verseau": "L'innovation te propulse, rêve l'avenir.",
  "Jupiter_Poissons": "La grâce divine t'enveloppe, lâche prise.",
  "Saturne_Bélier": "La discipline forge ton courage, maîtrise ton feu.",
  "Saturne_Taureau": "Les fondations se consolident, la sécurité grandit.",
  "Saturne_Gémeaux": "Structure tes pensées, le silence est fertile.",
  "Saturne_Cancer": "Les racines s'approfondissent, honore ton passé.",
  "Saturne_Lion": "L'humilité couronne ta créativité d'une sagesse nouvelle.",
  "Saturne_Vierge": "L'ordre intérieur s'installe, chaque chose à sa place.",
  "Saturne_Balance": "Les engagements se clarifient, l'équilibre se gagne.",
  "Saturne_Scorpion": "La transformation est profonde, accepte la métamorphose.",
  "Saturne_Sagittaire": "Les grandes leçons de vie façonnent ta philosophie.",
  "Saturne_Capricorne": "Le maître du temps t'enseigne la patience sacrée.",
  "Saturne_Verseau": "La responsabilité collective t'appelle, sers l'humanité.",
  "Saturne_Poissons": "Discipline émotionnelle — structure ce que tu ressens profondément.",
  "Lune_Bélier": "Tes émotions sont une tempête de feu, accueille cette intensité.",
  "Lune_Taureau": "La douceur lunaire apaise ton âme dans un écrin de soie.",
  "Lune_Gémeaux": "Les émotions papillonnent, curieuses et changeantes.",
  "Lune_Cancer": "La marée émotionnelle est haute, retourne à ta coquille sacrée.",
  "Lune_Lion": "Ton cœur rayonne, les sentiments s'expriment avec éclat.",
  "Lune_Vierge": "L'émotion s'ordonne, trouve le calme dans les rituels.",
  "Lune_Balance": "La paix intérieure se négocie, cherche l'harmonie des cœurs.",
  "Lune_Scorpion": "Les profondeurs s'agitent, l'intimité te transforme.",
  "Lune_Sagittaire": "L'âme vagabonde cherche l'horizon émotionnel.",
  "Lune_Capricorne": "Les sentiments se maîtrisent, la réserve est ta force.",
  "Lune_Verseau": "L'émotion devient collective, vibre avec l'univers.",
  "Lune_Poissons": "Le rêve éveillé t'emporte, nage dans l'océan des âmes."
};

// --- LOGIQUE DE CALCUL ---

export const getSigneSolaire = (dateStr) => {
  if (!dateStr) return "Bélier";
  const d = dayjs(dateStr);
  const month = d.month() + 1;
  const day = d.date();

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

export const getSigneLunaire = (dateStr) => {
  if (!dateStr) return "Taureau";
  try {
    const date = new Date(dateStr + 'T12:00:00');
    const ref = new Date('2000-01-06T12:00:00');
    const diff = (date - ref) / (1000 * 60 * 60 * 24);
    const cycle = 27.321582;
    const position = ((diff % cycle) + cycle) % cycle;
    const index = Math.floor(position / (cycle / 12));
    return SIGNES[index] || "Taureau";
  } catch (e) {
    return "Taureau";
  }
};

export const getAscendant = (heureStr) => {
  if (!heureStr) return "Lion";
  try {
    const [h, m] = heureStr.split(':').map(Number);
    const heureDecimale = h + m / 60;
    const index = Math.floor(heureDecimale / 2) % 12;
    const signesAscendant = [
      "Balance", "Scorpion", "Sagittaire", "Capricorne",
      "Verseau", "Poissons", "Bélier", "Taureau",
      "Gémeaux", "Cancer", "Lion", "Vierge"
    ];
    return signesAscendant[index] || "Lion";
  } catch (e) {
    return "Lion";
  }
};

export const getPlanetesDuJour = () => {
  const aujourd_hui = new Date();
  const refDate = new Date('2024-01-01');
  const joursEcoules = Math.floor((aujourd_hui - refDate) / 86400000);

  const planetesConfig = [
    { symbole: "☉", nom: "Soleil", posRefIndex: 0, joursParSigne: 30, couleur: "#C9A460" },
    { symbole: "☿", nom: "Mercure", posRefIndex: 8, joursParSigne: 7.3, couleur: "#9B97B0" },
    { symbole: "♀", nom: "Vénus", posRefIndex: 10, joursParSigne: 18.7, couleur: "#C17B8A" },
    { symbole: "♂", nom: "Mars", posRefIndex: 8, joursParSigne: 57.2, couleur: "#E05C5C" },
    { symbole: "♃", nom: "Jupiter", posRefIndex: 0, joursParSigne: 361, couleur: "#7B9ECB" },
    { symbole: "♄", nom: "Saturne", posRefIndex: 10, joursParSigne: 896, couleur: "#C9A460" },
    { symbole: "☽", nom: "Lune", nomCalcul: "Lune", couleur: "#C8C4D8" }
  ];

  return planetesConfig.map(p => {
    let index;
    if (p.nom === "Lune") {
      const ref = new Date('2000-01-06T12:00:00');
      const diff = (aujourd_hui - ref) / (1000 * 60 * 60 * 24);
      const cycle = 27.321582;
      index = Math.floor((((diff % cycle) + cycle) % cycle) / (cycle / 12));
    } else {
      index = (p.posRefIndex + Math.floor(joursEcoules / p.joursParSigne)) % 12;
    }

    const signe = SIGNES[index] || "Bélier";
    const key = `${p.nom}_${signe}`;
    const aspect = ASPECTS_TEXTE[key] || `${p.nom} en ${signe} influence ta journée avec subtilité.`;

    return {
      symbole: p.symbole,
      nom: p.nom,
      signe: signe,
      aspect: aspect,
      couleur: p.couleur,
      retrograde: p.nom === "Mercure" && (index === 8 || index === 0)
    };
  });
};

export const getAspectTexte = (planete, signe) => {
  const key = `${planete}_${signe}`;
  return ASPECTS_TEXTE[key] || `${planete} en ${signe} — une influence à explorer.`;
};