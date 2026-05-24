import ephemeris from 'ephemeris';

const SIGNES = [
  "Bélier", "Taureau", "Gémeaux", "Cancer",
  "Lion", "Vierge", "Balance", "Scorpion",
  "Sagittaire", "Capricorne", "Verseau", "Poissons"
];

const degreesToSigne = (degrees) => {
  const d = ((degrees % 360) + 360) % 360;
  return {
    signe: SIGNES[Math.floor(d / 30)],
    degres: Math.floor(d % 30)
  };
};

const tester = (dateStr, heureStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, min] = heureStr.split(':').map(Number);
  // Paris été = UTC+2
  const date = new Date(Date.UTC(y, m-1, d, h, min, 0) - 120 * 60000);
  console.log(`\n--- ${dateStr} à ${heureStr} Paris → UTC: ${date.toISOString()} ---`);
  const result = ephemeris.getAllPlanets(date, 2.3522, 48.8566, 0);
  const lune = degreesToSigne(result.observed.moon.apparentLongitudeDd);
  console.log('Lune:', lune.signe, lune.degres + '°',
    '| raw:', result.observed.moon.apparentLongitudeDd.toFixed(4) + '°');
};

console.log('=== TEST EPHEMERIS ISOLÉ — 22 juin 1990 ===');
tester('1990-06-22', '08:00');
tester('1990-06-22', '14:00');
tester('1990-06-22', '20:00');
tester('1990-06-22', '23:00');
