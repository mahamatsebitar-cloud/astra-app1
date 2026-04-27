import React from 'react';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import PlanetCircle from '../components/ui/PlanetCircle';
import AstraSymbol from '../components/ui/AstraSymbol';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { planetesDuJour, messageJour } from '../data/astroData';

const ZODIAC_SYMBOLS = {
  "Bélier": "♈", "Taureau": "♉", "Gémeaux": "♊", "Cancer": "♋",
  "Lion": "♌", "Vierge": "♍", "Balance": "♎", "Scorpion": "♏",
  "Sagittaire": "♐", "Capricorne": "♑", "Verseau": "♒", "Poissons": "♓"
};

const Home = ({ onHoroscope, onProfil }) => {
  const { user } = useAuthContext();
  const { profile, loading } = useProfile(user?.id);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gold font-serif italic animate-pulse">Consultation des éphémérides...</div>
      </div>
    );
  }

  const displayNom = profile?.nom || user?.user_metadata?.nom || "Voyageur";
  const signeSolaire = profile?.signe_solaire || "Bélier";
  const signeLunaire = profile?.signe_lunaire || "Lune";
  const ascendant = profile?.ascendant || "Ascendant";
  const avatarUrl = profile?.avatar_url;

  const dateAujourdhui = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="pt-2 space-y-4 w-full pb-10">
      
      {/* Header Dynamique - BUG 1 FIX */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] text-muted tracking-widest uppercase font-sans">
            {dateAujourdhui}
          </p>
          <h3 className="text-cream text-base font-serif">
            Bonjour, <span className="text-gold">{displayNom.split(' ')[0]}</span>
          </h3>
        </div>
        
        <div
          onClick={onProfil}
          className="w-10 h-10 bg-[#141731] border-[1.5px] border-gold rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-all overflow-hidden"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profil" className="w-full h-full object-cover" />
          ) : (
            <span style={{ 
              fontFamily: 'Georgia, serif',
              fontVariantEmoji: 'text',
              WebkitFontVariantEmoji: 'text',
              fontSize: '18px',
              color: '#C9A460',
              lineHeight: 1
            }}>
              {ZODIAC_SYMBOLS[signeSolaire] || displayNom.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Card signe */}
      <Card className="flex items-center gap-4 border-gold/20 bg-gradient-to-r from-card to-[#1A1D3D]">
        <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center bg-[#141731] shrink-0">
          <span style={{ 
            fontFamily: 'Georgia, serif',
            fontVariantEmoji: 'text',
            WebkitFontVariantEmoji: 'text',
            fontSize: '24px',
            color: '#C9A460',
            lineHeight: 1
          }}>
            {ZODIAC_SYMBOLS[signeSolaire]}
          </span>
        </div>
        <div className="overflow-hidden">
          <p className="text-[11px] text-gold tracking-wide uppercase font-sans font-bold">
            Soleil en {signeSolaire}
          </p>
          <p className="text-[10px] text-[#B0ADCA] font-sans flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
            <AstraSymbol name="lune" /> {signeLunaire} 
            <span className="opacity-20">·</span> 
            <AstraSymbol name="ascendant" /> {ascendant}
          </p>
        </div>
      </Card>

      {/* Message du jour - BUG 2 FIX */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gold tracking-[2px] uppercase font-bold">Message du jour</span>
          <div className="flex-1 h-px bg-[#1C2040]" />
          <Tag><span className="astro-symbol">♄{"\uFE0E"}</span> Saturne actif</Tag>
        </div>
        
        <Card className="relative overflow-hidden">
          <p className="italic font-serif text-sm text-cream leading-[1.85] relative z-10">
            {messageJour}
          </p>
          <div className="flex gap-2 mt-4 flex-wrap relative z-10">
            <Tag>Intuition</Tag>
            <Tag>Clarté</Tag>
          </div>
        </Card>
      </div>

      {/* Planètes aujourd'hui */}
      <p className="text-[9px] text-muted tracking-[2px] uppercase ml-1 font-sans">Planètes aujourd'hui</p>
      <div className="space-y-2">
        {planetesDuJour.map((planete, index) => (
          <Card key={index} className="flex items-center gap-3 py-3 hover:bg-white/5 transition-colors group">
            <PlanetCircle size="sm" symbole={planete.symbole} couleur={planete.couleur} />
            <div className="flex-1">
              <p className="text-cream text-[13px] font-serif">{planete.nom}</p>
              <p className="text-muted text-[10px] leading-snug font-sans">{planete.aspect}</p>
            </div>
            <span className="text-muted/30 text-lg group-hover:text-gold/50 transition-colors">›</span>
          </Card>
        ))}
      </div>

      <Card
        onClick={onHoroscope}
        className="flex justify-between items-center cursor-pointer hover:border-gold/50 transition-all active:scale-[0.98] bg-gradient-to-r from-[#120E22] to-[#1C2040] shadow-lg shadow-gold/5 border-gold/30"
      >
        <div>
          <p className="text-[10px] text-gold tracking-widest uppercase font-bold">Horoscope du jour</p>
          <p className="text-muted text-[11px] mt-0.5 font-sans">Ce que les astres te réservent</p>
        </div>
        <span className="text-gold text-xl font-serif">→</span>
      </Card>
    </div>
  );
};

export default Home;