import React, { useRef, useEffect } from 'react';
import { positionsPlanetaires, userData } from '../data/astroData';

const NatalChart = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centre = 128;
    
    // Nettoyage
    ctx.clearRect(0, 0, 256, 256);

    // Dessin des cercles de la roue
    const cercles = [118, 98, 58, 20];
    cercles.forEach((r) => {
      ctx.beginPath();
      ctx.arc(centre, centre, r, 0, Math.PI * 2);
      ctx.strokeStyle = r === 20 ? '#252848' : '#1C2040';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    const degToRad = (deg) => ((deg - 90) * Math.PI) / 180;

    // Signes du Zodiaque - Fix Claude : Forcer le rendu texte
    const symbolesZodiaque = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    symbolesZodiaque.forEach((symbole, i) => {
      const angleMilieu = degToRad(i * 30 + 15);
      const x = centre + 108 * Math.cos(angleMilieu);
      const y = centre + 108 * Math.sin(angleMilieu);
      
      ctx.fillStyle = '#5C5A7A'; // Gris bleuté élégant
      // On ajoute "serif" et on s'assure que le navigateur ne remplace pas par un emoji couleur
      ctx.font = '12px serif'; 
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Sous Linux/Android, l'ajout d'un caractère invisible (\uFE0E) force le mode texte
      ctx.fillText(symbole + '\uFE0E', x, y);
    });

    // Dessin des planètes - Fix Claude : Symboles en Or
    positionsPlanetaires.forEach((p, index) => {
      // Pour le prototype, on utilise des angles fixes pour éviter le chevauchement aléatoire
      const angle = degToRad((index * 36) % 360); 
      const x = centre + 78 * Math.cos(angle);
      const y = centre + 78 * Math.sin(angle);

      // Le petit cercle de la planète
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#0E1228'; // Fond sombre
      ctx.fill();
      ctx.strokeStyle = '#C9A460'; // Bordure Or
      ctx.lineWidth = 1;
      ctx.stroke();

      // Le symbole planétaire en Or
      ctx.fillStyle = '#C9A460';
      ctx.font = '11px serif';
      ctx.fillText(p.symbole + '\uFE0E', x, y);
    });

    // Logo central stylisé
    ctx.fillStyle = '#C9A460';
    ctx.font = 'bold 8px serif';
    ctx.letterSpacing = "2px";
    ctx.fillText('ASTRA', centre, centre);
  }, []);

  return (
    <div className="w-full mx-auto px-5 pb-10">
      {/* Header dynamique */}
      <div className="text-center mb-6">
        <p className="text-[9px] text-muted tracking-[2px] uppercase mb-1">Thème Natal</p>
        <h3 className="font-serif text-base text-cream">{userData.nom}</h3>
        <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wider">
          {userData.dateNaissance} — {userData.lieu}
        </p>
      </div>

      {/* Canvas container */}
      <div className="flex justify-center bg-card/30 rounded-full p-4 border border-border/20 backdrop-blur-sm relative">
        {/* Effet de halo or derrière la roue */}
        <div className="absolute inset-0 bg-gold/5 rounded-full blur-3xl" />
        <canvas
          ref={canvasRef}
          width={256}
          height={256}
          className="w-64 h-64 relative z-10"
        />
      </div>

      {/* Liste des positions détaillée */}
      <div className="mt-8">
        <p className="text-[9px] text-muted tracking-[2px] uppercase mb-3">
          Détails des positions
        </p>
        <div className="bg-card border border-border rounded-2xl p-4 space-y-1">
          {positionsPlanetaires.map((planete, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 py-3 ${
                i < positionsPlanetaires.length - 1 ? 'border-b border-border/10' : ''
              }`}
            >
              <div
                className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-sm flex-shrink-0 astro-symbol text-gold"
              >
                {planete.symbole}
              </div>
              <div className="flex-1 min-w-0 ml-1">
                <p className="text-cream text-[13px] font-serif">
                  {planete.nom} <span className="text-muted text-[10px] font-sans">dans la {planete.maison}</span>
                </p>
              </div>
              <p className="text-[11px] font-sans text-gold/80">
                {planete.position}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NatalChart;