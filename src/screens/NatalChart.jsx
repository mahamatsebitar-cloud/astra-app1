// src/screens/NatalChart.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { positionsPlanetaires, userData } from '../data/astroData';

const INTERPRETATIONS = {
  "Soleil_Belier": "Ton Soleil en Bélier fait de toi une âme de pionnier. Tu avances sans regarder en arrière, porté par une flamme intérieure que rien ne semble pouvoir éteindre.",
  "Soleil_Taureau": "Ton Soleil en Taureau t'ancre dans le monde sensible avec une puissance rare. Tu sais que la beauté sauvera le monde et tu la cultives patiemment.",
  "Soleil_Gemeaux": "Ton Soleil en Gémeaux fait de ton esprit un papillon curieux qui butine les idées. Tu es né pour communiquer, relier et transmettre.",
  "Soleil_Cancer": "Ton Soleil en Cancer fait de toi un être lunaire, sensible aux marées invisibles de l'âme. Ta maison intérieure est un sanctuaire précieux.",
  "Soleil_Lion": "Ton Soleil en Lion brille d'un éclat solaire qui attire naturellement les regards. Tu es venu pour créer, rayonner et inspirer.",
  "Soleil_Vierge": "Ton Soleil en Vierge fait de ton regard un prisme qui décompose la perfection du monde. Ta modestie cache une intelligence analytique fine.",
  "Soleil_Balance": "Ton Soleil en Balance cherche l'équilibre comme d'autres cherchent l'or. L'équité et la beauté sont tes quêtes essentielles.",
  "Soleil_Scorpion": "Ton Soleil en Scorpion te donne le courage de plonger dans les profondeurs. Tu es un alchimiste de l'âme, transformant les épreuves en sagesse.",
  "Soleil_Sagittaire": "Ton Soleil en Sagittaire allume en toi une soif d'horizon. Tu es un explorateur de l'esprit, un philosophe en mouvement permanent.",
  "Soleil_Capricorne": "Ton Soleil en Capricorne fait de toi un bâtisseur patient. Tu sais que les grandes œuvres se construisent pierre par pierre avec discipline.",
  "Soleil_Verseau": "Ton Soleil en Verseau fait de toi un visionnaire en avance sur ton temps. Tu vois ce que le monde pourrait devenir. Ta liberté est sacrée.",
  "Soleil_Poissons": "Ton Soleil en Poissons dissout les frontières entre le rêve et le réel. Tu perçois les courants souterrains de l'âme collective.",
  
  "Lune_Belier": "Ta Lune en Bélier rend tes émotions ardentes et immédiates. Tu réagis au quart de tour, ton cœur est un brasier qui s'enflamme sans prévenir.",
  "Lune_Taureau": "Ta Lune en Taureau cherche la sécurité émotionnelle dans les plaisirs simples et durables. C'est dans le concret que ton cœur trouve la paix.",
  "Lune_Gemeaux": "Ta Lune en Gémeaux fait de tes émotions un kaléidoscope changeant. Tu analyses ce que tu ressens avec une curiosité insatiable.",
  "Lune_Cancer": "Ta Lune en Cancer te rend d'une sensibilité profonde et nourricière. Tu ressens tout intensément, comme si le monde vibrait dans ta poitrine.",
  "Lune_Lion": "Ta Lune en Lion a besoin que ses sentiments soient vus et célébrés. Ton cœur est généreux et sincère dans sa quête de chaleur.",
  "Lune_Vierge": "Ta Lune en Vierge transforme chaque émotion en un puzzle à résoudre. Tu prends soin des autres avec une minutie et une attention touchante.",
  "Lune_Balance": "Ta Lune en Balance a besoin d'harmonie émotionnelle comme on a besoin d'air. Tu fuis les conflits qui troublent ta paix intérieure.",
  "Lune_Scorpion": "Ta Lune en Scorpion vit les émotions avec une intensité souterraine. Tu aimes avec passion et ressens avec une profondeur absolue.",
  "Lune_Sagittaire": "Ta Lune en Sagittaire a besoin d'espace émotionnel pour s'épanouir. Dès qu'on cherche à t'enfermer, ton cœur galope vers l'horizon.",
  "Lune_Capricorne": "Ta Lune en Capricorne maîtrise ses émotions avec une discipline ferme. Derrière ta réserve se cache une fidélité à toute épreuve.",
  "Lune_Verseau": "Ta Lune en Verseau vit les émotions de manière décalée et originale. Ton cœur bat souvent pour des causes plus grandes que toi.",
  "Lune_Poissons": "Ta Lune en Poissons rend ton monde émotionnel vaste comme l'océan. Tu captes les sentiments des autres et les ambiances invisibles.",

  "Mercure_Belier": "Ton Mercure en Bélier rend ta pensée rapide et incisive. Tu dis ce que tu penses sans détour, avec une franchise d'éclaireur.",
  "Mercure_Verseau": "Ton Mercure en Verseau fait jaillir des éclairs de génie. Tu penses hors des cadres et inventes des concepts résolument futuristes.",
  
  "Venus_Taureau": "Ta Vénus en Taureau aime avec les sens et la peau. L'amour est pour toi une expérience charnelle, esthétique et surtout durable.",
  "Venus_Balance": "Ta Vénus en Balance cherche l'harmonie et l'élégance dans chaque rencontre. L'équité est le socle de ta façon d'aimer.",

  "Mars_Scorpion": "Ton Mars en Scorpion possède une force souterraine et magnétique. Tu agis dans l'ombre et frappes avec une précision chirurgicale.",
  "Mars_Capricorne": "Ton Mars en Capricorne est doté d'une endurance exceptionnelle. Tu gravis les montagnes du succès sans jamais faiblir."
};

/**
 * NatalChart Screen
 * @param {Function} onSeeNoeuds - Fonction de navigation vers l'écran des Nœuds Lunaires
 */
const NatalChart = ({ onSeeNoeuds }) => {
  const canvasRef = useRef(null);
  const [planeteSelectionnee, setPlaneteSelectionnee] = useState(null);
  const { user } = useAuthContext();
  const { profile, loading } = useProfile(user?.id);

  const displayData = profile?.nom ? profile : userData;

  const getInterpretation = (p) => {
    if (!p || !p.nom || !p.signe) return "Une influence mystérieuse guide ton ciel.";
    const nomClean = p.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
    const signeClean = p.signe.split(' ')[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
    const key = `${nomClean}_${signeClean}`;
    return INTERPRETATIONS[key] || `Ton ${p.nom} en ${p.signe} apporte une vibration unique et personnelle à ton thème.`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 256;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centre = size / 2;
    ctx.clearRect(0, 0, size, size);

    // Cercles de structure
    [118, 98, 58, 20].forEach((r) => {
      ctx.beginPath();
      ctx.arc(centre, centre, r, 0, Math.PI * 2);
      ctx.strokeStyle = r === 20 ? '#252848' : '#1C2040';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    const degToRad = (deg) => ((deg - 90) * Math.PI) / 180;

    // Signes du Zodiaque
    const symboles = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    symboles.forEach((s, i) => {
      const angle = degToRad(i * 30 + 15);
      ctx.fillStyle = '#5C5A7A';
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(s + '\uFE0E', centre + 108 * Math.cos(angle), centre + 108 * Math.sin(angle));
    });

    // Placement des Planètes
    const planets = (positionsPlanetaires && positionsPlanetaires.length > 0) ? positionsPlanetaires : [];
    planets.forEach((p, i) => {
      const angle = degToRad((i * (360 / planets.length)));
      const x = centre + 78 * Math.cos(angle);
      const y = centre + 78 * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201, 164, 96, 0.05)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#0E1228';
      ctx.fill();
      ctx.strokeStyle = '#C9A460';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#C9A460';
      ctx.font = '11px serif';
      ctx.fillText(p.symbole || '?', x, y);
    });

    ctx.fillStyle = '#C9A460';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('ASTRA', centre, centre);

  }, [loading, profile, positionsPlanetaires]);

  if (loading) return <div className="h-full flex items-center justify-center text-gold italic">Synchronisation...</div>;

  return (
    <div className="w-full mx-auto px-5 pb-24 h-full overflow-y-auto custom-scrollbar">
      {/* Header Info */}
      <div className="text-center mb-6 pt-6">
        <p className="text-[9px] text-muted tracking-[2px] uppercase mb-1">Thème Natal</p>
        <h3 className="font-serif text-base text-cream">{displayData.nom}</h3>
        <p className="text-[10px] text-muted mt-0.5 tracking-wider">
            {(displayData.dateNaissance || displayData.date_naissance) ? 
                new Date(displayData.dateNaissance || displayData.date_naissance).toLocaleDateString('fr-FR') : 
                "Éphémérides activées"}
        </p>
      </div>

      {/* Astro Chart Visual */}
      <div className="flex justify-center bg-card/20 rounded-full p-4 border border-gold/10 relative">
        <div className="absolute inset-0 bg-gold/5 rounded-full blur-3xl opacity-20" />
        <canvas ref={canvasRef} className="relative z-10" />
      </div>

      {/* Planet List */}
      <div className="mt-8 space-y-3">
        {positionsPlanetaires?.map((p, i) => (
          <div 
            key={i} 
            onClick={() => setPlaneteSelectionnee(p)}
            className="flex items-center gap-3 py-3 cursor-pointer hover:bg-white/5 transition-all rounded-lg px-2 border-b border-border/5"
          >
            <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-gold">
              <span style={{ fontVariantEmoji: 'text' }}>{p.symbole}</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-cream text-[13px] font-serif">{p.nom}</p>
              <p className="text-muted text-[10px]">en {p.signe}</p>
            </div>
            <p className="text-[10px] text-gold/50 font-sans">{p.position}</p>
          </div>
        ))}
      </div>

      {/* --- BOUTON NOEUDS LUNAIRES (Point d'entrée) --- */}
      <div className="mt-10 mb-10">
        <button 
          onClick={onSeeNoeuds}
          className="w-full group relative overflow-hidden bg-gradient-to-br from-[#120E22] to-[#1C2040] border border-gold/20 rounded-2xl p-6 transition-all hover:border-gold/50 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="text-left">
              <p className="text-[9px] text-gold tracking-[3px] uppercase font-bold mb-1">Héritage Karmique</p>
              <h4 className="text-cream font-serif text-base tracking-wide">Vos Nœuds Lunaires</h4>
              <p className="text-[11px] text-muted/70 italic font-serif mt-1">Le fil invisible de votre destin</p>
            </div>
            <span className="text-gold/80 text-3xl transition-transform group-hover:translate-x-2 drop-shadow-[0_0_8px_rgba(201,164,96,0.3)]">☊</span>
          </div>
          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Interpretation Modal */}
      {planeteSelectionnee && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300"
          onClick={() => setPlaneteSelectionnee(null)}
        >
          <div 
            className="bg-[#0E1228] border border-gold/30 rounded-3xl p-8 max-w-sm w-full text-center relative shadow-2xl shadow-gold/20"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-6xl text-gold mb-4" style={{ fontVariantEmoji: 'text' }}>{planeteSelectionnee.symbole}</div>
            <h2 className="font-serif text-xl text-gold mb-1">{planeteSelectionnee.nom}</h2>
            <p className="text-muted text-[10px] uppercase tracking-widest mb-4">en {planeteSelectionnee.signe}</p>
            <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-6" />
            <p className="text-cream/90 text-sm leading-relaxed italic font-serif">
              "{getInterpretation(planeteSelectionnee)}"
            </p>
            <button 
              onClick={() => setPlaneteSelectionnee(null)}
              className="mt-8 text-[10px] text-gold/70 uppercase tracking-[2px] border border-gold/20 px-8 py-2.5 rounded-full hover:bg-gold/10 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NatalChart;