// src/components/ui/PlanetCircle.jsx

const PLANET_SYMBOLS = {
  'Soleil':    '☉\uFE0E',
  'Lune':      '☽\uFE0E',
  'Mercure':   '☿\uFE0E',
  'Vénus':     '♀\uFE0E',
  'Mars':      '♂\uFE0E',
  'Jupiter':   '♃\uFE0E',
  'Saturne':   '♄\uFE0E',
  'Uranus':    '♅\uFE0E',
  'Neptune':   '♆\uFE0E',
  'Pluton':    '♇\uFE0E',
};

const PlanetCircle = ({ planete, symbole, couleur, size = 'md', active = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[13px]',
    md: 'w-10 h-10 text-base',
  };

  const symbol = PLANET_SYMBOLS[planete] || symbole || '★\uFE0E';

  return (
    <div
      className={`rounded-full bg-[#141731] border flex items-center justify-center font-serif ${sizeClasses[size]}`}
      style={{ 
        color: couleur || '#C9A460',
        borderColor: active ? '#C9A460' : '#252848'
      }}
    >
      {symbol}
    </div>
  );
};

export default PlanetCircle;