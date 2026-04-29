import React, { useEffect, useState } from 'react';
import Button from '../components/ui/Button';

const Splash = ({ onStart, onLogin }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.1,
      delay: Math.random() * 5,
    }));
    setStars(generatedStars);
  }, []);

  const nodes = [
    { cx: 170, cy: 60 }, { cx: 110, cy: 110 }, { cx: 230, cy: 110 },
    { cx: 140, cy: 170 }, { cx: 200, cy: 170 }, { cx: 170, cy: 140 },
    { cx: 100, cy: 220 }, { cx: 240, cy: 220 }, { cx: 170, cy: 250 },
  ];

  const lines = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5],
    [5, 8], [3, 6], [4, 7], [6, 8], [7, 8],
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-night">
      
      {/* Ciel étoilé scintillant */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-cream animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Logo Constellation */}
      <div className="relative animate-in fade-in zoom-in duration-1000">
        <svg viewBox="0 0 340 310" className="w-64 h-64 drop-shadow-[0_0_15px_rgba(201,164,96,0.2)]">
          {lines.map(([from, to], i) => (
            <line
              key={i}
              x1={nodes[from].cx} y1={nodes[from].cy}
              x2={nodes[to].cx} y2={nodes[to].cy}
              stroke="#C9A460" strokeWidth="0.5" opacity="0.3"
            />
          ))}
          {nodes.map((node, i) => (
            <circle
              key={i}
              cx={node.cx} cy={node.cy}
              r={i === 8 ? 3 : 1.5}
              fill="#C9A460"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Identité visuelle */}
      <div className="text-center z-10 -mt-5">
        <h1 className="font-serif text-4xl tracking-[8px] text-cream drop-shadow-sm">
          ASTRA
        </h1>
        <p className="text-[10px] text-gold tracking-[5px] uppercase mt-3 mb-16 opacity-80">
          Votre ciel, votre langue
        </p>
      </div>

      {/* Actions */}
      <div className="w-full space-y-4 px-8">
        <Button onClick={onLogin} variant="primary">
          Révéler mon thème
        </Button>
        <Button onClick={onLogin} variant="outline">
          Retrouver mon ciel
        </Button>
      </div>

    </div>
  );
};

export default Splash;