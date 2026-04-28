// src/screens/OnboardingInvit.jsx
import React, { useEffect, useRef, useState } from 'react';
import Card from '../components/ui/Card';

const AMIS_SUGGERES = [
  { initiale: 'C', nom: 'Claire', signe: 'Poissons', affinite: 'Âmes sœurs' },
  { initiale: 'M', nom: 'Marc', signe: 'Taureau', affinite: 'Complicité rare' },
  { initiale: 'L', nom: 'Léna', signe: 'Scorpion', affinite: 'Miroir céleste' }
];

const OnboardingInvit = ({ onFinish }) => {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // Anti-double clic

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);

    let animationId;
    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.05 + 0.02,
      phase: Math.random() * Math.PI * 2
    }));

    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        const twinkle = Math.sin(timestamp * 0.001 + star.phase) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 164, 96, ${star.opacity * twinkle})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleFinish = () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    onFinish();
  };

  const handleInviteFriends = async () => {
    const shareData = {
      title: 'Rejoins-moi sur Astra',
      text: 'Découvrons nos affinités astrales ensemble ✨',
      url: 'https://astra-app.fr'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        handleFinish();
      } catch (err) {
        // On finit quand même sauf si c'est juste une annulation (AbortError)
        if (err.name !== 'AbortError') handleFinish();
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setCopied(true);
        setTimeout(() => handleFinish(), 1500);
      } catch (err) {
        handleFinish();
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-night overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Background stars */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0" 
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
        <div className="mb-6 animate-bounce duration-[3000ms]">
          <span className="text-6xl text-gold drop-shadow-[0_0_15px_rgba(201,164,96,0.5)]">✦</span>
        </div>

        <h1 className="font-serif text-cream text-2xl mb-3">Ton ciel est prêt</h1>
        <p className="text-muted text-sm font-sans mb-10 leading-relaxed">
          Les astres révèlent leur plein potentiel lorsqu'ils sont partagés. Invite tes proches pour découvrir vos liens.
        </p>

        <div className="w-full space-y-3 mb-10">
          <p className="text-[10px] text-gold/60 tracking-[0.2em] uppercase font-bold text-left pl-1">
            Connexions probables
          </p>
          
          {AMIS_SUGGERES.map((ami, i) => (
            <div 
              key={i} 
              className="animate-in fade-in slide-in-from-bottom duration-700 fill-mode-both"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <Card className="flex items-center gap-4 py-3 bg-card/40 backdrop-blur-sm border-white/5 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-night border border-gold/20 flex items-center justify-center text-gold font-serif">
                  {ami.initiale}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-cream text-sm font-sans font-medium">{ami.nom}</p>
                  <p className="text-[10px] text-muted">{ami.signe} · <span className="text-gold/80 italic">{ami.affinite}</span></p>
                </div>
                <span className="text-gold/20 mr-2 text-xs">✦</span>
              </Card>
            </div>
          ))}
        </div>

        <div className="w-full space-y-4">
          <button
            onClick={handleInviteFriends}
            disabled={isRedirecting}
            className="bg-gold text-night font-serif font-bold rounded-full py-4 w-full shadow-[0_10px_20px_rgba(201,164,96,0.2)] active:scale-95 transition-all disabled:opacity-50"
          >
            {copied ? "Lien copié !" : "Partager mon invitation"}
          </button>

          <button
            onClick={handleFinish}
            disabled={isRedirecting}
            className="text-muted text-xs font-sans uppercase tracking-widest hover:text-cream transition-colors py-2 disabled:opacity-50"
          >
            Explorer seul pour le moment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingInvit;