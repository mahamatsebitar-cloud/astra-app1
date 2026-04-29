import React, { useState, useMemo } from 'react';

// SVG zodiac inline — 0 dépendance externe, 0 emoji coloré
const ZodiacSVG = ({ signe }) => {
  const paths = {
    "Verseau": "M6 14 Q9 9 12 14 Q15 19 18 14 Q21 9 24 14 M6 19 Q9 14 12 19 Q15 24 18 19 Q21 14 24 19",
    "Poissons": "M7 15 C9 9 13 9 15 15 C17 21 21 21 23 15 M7 15 C9 21 13 21 15 15 C17 9 21 9 23 15",
    "Bélier": "M15 7 C11 7 8 10 8 14 C8 17 10 19 12 19 M15 7 C19 7 22 10 22 14 C22 17 20 19 18 19 M12 19 L15 23 L18 19",
    "Taureau": "M9 13 C9 9 12 7 15 7 C18 7 21 9 21 13 M15 7 L15 23 M11 23 L19 23 M9 13 C7 13 6 12 6 10 M21 13 C23 13 24 12 24 10",
    "Gémeaux": "M9 6 L9 24 M21 6 L21 24 M9 12 L21 12 M9 18 L21 18",
    "Cancer": "M8 18 C8 12 12 8 16 11 C20 14 20 8 24 11 M16 16 C16 20 13 22 13 22 M16 16 C16 20 19 22 19 22",
    "Lion": "M8 18 C8 11 13 7 17 10 C21 13 19 19 15 19 C11 19 10 22 13 24",
    "Vierge": "M9 6 L9 20 C9 23 12 24 14 22 L14 14 C14 10 17 8 20 10 C23 12 23 16 20 18",
    "Balance": "M8 20 L22 20 M15 20 L15 10 C15 7 18 6 20 8 C22 10 20 13 18 13",
    "Scorpion": "M8 8 L8 18 C8 22 11 24 13 22 L20 15 L22 17 L24 15",
    "Sagittaire": "M8 22 L22 8 M16 8 L22 8 L22 14 M22 8 L14 16",
    "Capricorne": "M8 8 C8 14 11 16 14 14 C17 12 17 16 17 20 C17 23 14 24 12 22 M17 14 C19 12 22 13 22 16 L22 22",
  };

  return (
    <svg
      width="64" height="64" viewBox="0 0 30 30"
      fill="none"
      stroke="#C9A460"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="drop-shadow-[0_0_8px_rgba(201,164,96,0.4)]"
    >
      <path d={paths[signe] || "M15 4 L17 10 L23 10 L18 14 L20 20 L15 16 L10 20 L12 14 L7 10 L13 10 Z"} />
    </svg>
  );
};

const FEATURES = [
  {
    svg: <path d="M12 2 C6.5 2 2 6.5 2 12 C2 17.5 6.5 22 12 22 C17.5 22 22 17.5 22 12" stroke="#C9A460" strokeWidth="1.5" fill="none" strokeLinecap="round"/>,
    label: "Horoscope\ndu jour"
  },
  {
    svg: <>
      <circle cx="12" cy="12" r="9" stroke="#C9A460" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <circle cx="12" cy="12" r="5" stroke="#C9A460" strokeWidth="1" fill="none"/>
      <circle cx="12" cy="12" r="1.5" fill="#C9A460"/>
    </>,
    label: "Thème\nnatal"
  },
  {
    svg: <>
      <circle cx="9" cy="12" r="6" stroke="#C9A460" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <circle cx="15" cy="12" r="6" stroke="#C9A460" strokeWidth="1.5" fill="none" opacity="0.7"/>
    </>,
    label: "Affinités\nastrales"
  }
];

const OnboardingInvit = ({ onFinish, userNom = "Voyageur", signeSolaire = "Verseau" }) => {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const stars = useMemo(() => (
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: (i * 37 + 13) % 100,
      top: (i * 53 + 7) % 100,
      delay: (i * 0.3) % 3,
      size: i % 4 === 0 ? 2 : 1
    }))
  ), []);

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);

    const appUrl = window.location.origin;
    const shareText = `✦ ${userNom} t'invite sur Astra, l'appli d'astrologie française.\nDécouvrons nos affinités astrales ensemble.\n${appUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Invitation Astra', text: shareText, url: appUrl });
        onFinish();
      } catch (err) {
        if (err.name !== 'AbortError') onFinish();
        setSharing(false);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(onFinish, 1500);
      } catch {
        onFinish();
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-night overflow-hidden flex flex-col items-center justify-between py-10 px-5">

      {/* Étoiles CSS */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map(s => (
          <div
            key={s.id}
            className="absolute rounded-full bg-cream"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animation: `twinkle ${2 + s.delay}s ease-in-out ${s.delay}s infinite`
            }}
          />
        ))}
      </div>

      {/* HEADER */}
      <div
        className="relative z-10 text-center anim-fadeslide"
        style={{ animationDelay: '0.1s' }}
      >
        <div className="mb-5 flex justify-center">
          <ZodiacSVG signe={signeSolaire} />
        </div>
        <h1 className="font-serif text-cream text-2xl mb-2">
          Bienvenue, <span className="text-gold">{userNom.split(' ')[0]}</span>
        </h1>
        <p className="font-serif italic text-muted text-sm">
          Les astres ont tenu leur promesse
        </p>
      </div>

      {/* CARD INVITATION */}
      <div
        className="relative z-10 w-full anim-fadeslide"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="bg-[#120E22] border border-gold/20 rounded-3xl p-5 shadow-xl shadow-black/40">

          <p className="text-[9px] text-gold tracking-[3px] uppercase font-sans font-bold mb-3">
            Inviter vos proches
          </p>
          <p className="text-[#B0ADCA] text-xs leading-relaxed font-sans mb-5">
            Certaines affinités ne se voient qu'à travers le prisme du ciel. Partagez votre carte du ciel avec ceux qui comptent.
          </p>

          <button
            onClick={handleShare}
            disabled={sharing}
            className="w-full bg-gold text-night font-serif font-bold py-4 rounded-2xl shadow-lg shadow-gold/10 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {copied ? "✓ Lien copié !" : sharing ? "Partage en cours..." : "Partager mon invitation"}
          </button>
        </div>

        {/* 3 features SVG — zéro emoji */}
        <div className="flex gap-3 mt-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="flex-1 bg-card border border-border rounded-2xl p-3 text-center anim-fadeslide"
              style={{ animationDelay: `${0.4 + i * 0.1}s` }}
            >
              <svg
                width="22" height="22" viewBox="0 0 24 24"
                fill="none" className="mx-auto mb-2"
              >
                {f.svg}
              </svg>
              <span
                className="text-[9px] text-muted tracking-tight whitespace-pre-line leading-tight font-sans"
              >
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div
        className="relative z-10 w-full flex flex-col items-center gap-3 anim-fadeslide"
        style={{ animationDelay: '0.6s' }}
      >
        <button
          onClick={onFinish}
          className="w-full border border-gold/20 text-cream font-serif py-4 rounded-2xl hover:bg-white/5 transition-colors active:scale-[0.98]"
        >
          Explorer mon thème →
        </button>
        <button
          onClick={onFinish}
          className="text-muted/40 text-[10px] tracking-[3px] uppercase hover:text-muted transition-colors py-1"
        >
          Passer cette étape
        </button>
      </div>

    </div>
  );
};

export default OnboardingInvit;