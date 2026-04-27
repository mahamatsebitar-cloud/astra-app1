import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import AstraSymbol from '../components/ui/AstraSymbol';

const ZODIAC_SYMBOLS = {
  "Bélier": "♈", "Taureau": "♉", "Gémeaux": "♊", "Cancer": "♋",
  "Lion": "♌", "Vierge": "♍", "Balance": "♎", "Scorpion": "♏",
  "Sagittaire": "♐", "Capricorne": "♑", "Verseau": "♒", "Poissons": "♓"
};

const Profil = ({ onLogout }) => {
  const { user } = useAuthContext();
  const { profile, loading } = useProfile(user?.id);
  const { logout, isLoading: isLoggingOut } = useAuth();

  // BUG 3 FIX : Formatage de la date
  const formatDate = (dateStr) => {
    if (!dateStr) return "Non renseignée"
    try {
      const date = new Date(dateStr + 'T12:00:00')
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long', 
        year: 'numeric'
      }).format(date)
    } catch {
      return dateStr
    }
  }

  // BUG 4 FIX : Formatage de l'heure
  const formatHeure = (heureStr) => {
    if (!heureStr) return "Non renseignée"
    return heureStr.substring(0, 5).replace(':', 'h')
  }

  const handleLogout = async () => {
    const success = await logout();
    if (success && onLogout) {
      onLogout();
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gold font-serif italic animate-pulse text-sm">Chargement du profil...</div>
      </div>
    );
  }

  const displayNom = profile?.nom || user?.user_metadata?.nom || "Voyageur";
  const signeSolaire = profile?.signe_solaire || "Bélier";
  const signeLunaire = profile?.signe_lunaire || "Lune";
  const ascendant = profile?.ascendant || "Ascendant";
  const avatarUrl = profile?.avatar_url;

  return (
    <div className="w-full space-y-6 pb-12">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-serif text-base text-cream">Mon Profil</h3>
        <span className="text-gold text-[10px] uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity font-sans">Modifier</span>
      </div>

      {/* BUG 1 FIX : Avatar avec symbole Unicode et suppression du badge */}
      <div className="flex flex-col items-center space-y-3 py-4">
        <div className="w-28 h-28 bg-[#141731] border border-gold/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.1)] overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayNom} className="w-full h-full object-cover" />
          ) : (
            <span style={{
              fontFamily: 'Georgia, serif',
              fontVariantEmoji: 'text',
              WebkitFontVariantEmoji: 'text',
              fontSize: '42px',
              color: '#C9A460',
              lineHeight: 1,
              userSelect: 'none'
            }}>
              {ZODIAC_SYMBOLS[signeSolaire] || '✦'}
            </span>
          )}
        </div>
        
        <div className="text-center pt-2">
          <h2 className="font-serif text-xl text-cream">{displayNom}</h2>
          <p className="text-muted text-[10px] tracking-[2px] uppercase mt-1 font-sans">Élève de l'Univers</p>
        </div>

        <div className="bg-[#141731] text-gold border border-border/50 rounded-full px-4 py-1.5 text-[10px] tracking-wider font-serif shadow-inner shadow-black/20 flex items-center gap-2">
          <span>{signeSolaire}</span>
          <span className="text-muted/30">·</span>
          <div className="flex items-center gap-1">
            <AstraSymbol name="ascendant" />
            <span>{ascendant}</span>
          </div>
          <span className="text-muted/30">·</span>
          <div className="flex items-center gap-1">
            <AstraSymbol name="lune" />
            <span>{signeLunaire}</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 mx-1">
        <h4 className="text-muted text-[9px] tracking-[2px] uppercase mb-4 font-sans font-bold">Données Natales</h4>
        <div className="space-y-0 font-sans">
          {[
            { label: 'Date de naissance', value: formatDate(profile?.date_naissance) },
            { label: 'Heure', value: formatHeure(profile?.heure_naissance) },
            { label: 'Lieu', value: profile?.lieu_naissance || "Non renseigné" },
            { label: 'Soleil', value: signeSolaire },
            { label: 'Lune', value: signeLunaire },
          ].map((item, index, arr) => (
            <div key={index} className={`flex justify-between py-3 ${index !== arr.length - 1 ? 'border-b border-border/10' : ''}`}>
              <span className="text-muted text-xs">{item.label}</span>
              <span className="text-cream text-xs font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reste du composant identique (Abonnement, Paramètres, Déconnexion) */}
      <div className="bg-gradient-to-br from-[#120E22] to-[#1C2040] border border-gold/30 rounded-2xl p-5 mx-1 space-y-3 relative overflow-hidden shadow-lg shadow-gold/5">
        <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl text-gold font-serif select-none">✦</div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gold tracking-[2px] uppercase font-bold">Astra Étoile</span>
          <span className="bg-gold/10 text-gold border border-gold/20 rounded-full px-2 py-0.5 text-[9px] tracking-wider uppercase font-sans">Actif</span>
        </div>
        <p className="text-[#B0ADCA] text-[11px] leading-relaxed font-sans">Accès illimité aux transits planétaires et compatibilités avancées.</p>
        <p className="text-muted text-[10px] italic font-sans">Prochain renouvellement : Mai 2026</p>
      </div>

      <div className="space-y-1 mx-1">
        <h4 className="text-muted text-[9px] tracking-[2px] uppercase mb-3 ml-1 font-sans">Paramètres</h4>
        <div className="bg-card border border-border rounded-2xl overflow-hidden font-sans">
          {[
            { icon: '🔔', title: 'Notifications', desc: 'Horoscope, transits' },
            { icon: '🌙', title: 'Thème', desc: 'Sombre · Minuit Parisien' },
            { icon: '🔒', title: 'Confidentialité', desc: 'Gérer mes données' }
          ].map((param, i, arr) => (
            <div key={i} className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-colors ${i !== arr.length - 1 ? 'border-b border-border/10' : ''}`}>
              <span className="text-lg">{param.icon}</span>
              <div className="flex-1">
                <p className="text-cream text-[13px]">{param.title}</p>
                <p className="text-muted text-[10px]">{param.desc}</p>
              </div>
              <span className="text-muted/30 text-lg">›</span>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`w-full text-muted text-[10px] uppercase tracking-[3px] text-center py-6 hover:text-red-400 transition-colors font-sans disabled:opacity-30`}
      >
        {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
      </button>
    </div>
  );
};

export default Profil;