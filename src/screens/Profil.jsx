// src/screens/Profil.jsx
import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import AstraSymbol from '../components/ui/AstraSymbol';
import EditProfil from './EditProfil';

const ZODIAC_SYMBOLS = {
  "Bélier": "♈", "Taureau": "♉", "Gémeaux": "♊", "Cancer": "♋",
  "Lion": "♌", "Vierge": "♍", "Balance": "♎", "Scorpion": "♏",
  "Sagittaire": "♐", "Capricorne": "♑", "Verseau": "♒", "Poissons": "♓"
};

const TITRES_PROFIL = {
  "Bélier": { masc: "Pionnier de l'aube", fem: "Pionnière de l'aube" },
  "Taureau": { masc: "Gardien du vivant", fem: "Gardienne du vivant" },
  "Gémeaux": { masc: "Tisseur de liens", fem: "Tisseuse de liens" },
  "Cancer": { masc: "Mémoire du monde", fem: "Mémoire du monde" },
  "Lion": { masc: "Flamme qui s'assume", fem: "Flamme qui s'assume" },
  "Vierge": { masc: "Architecte du réel", fem: "Architecte du réel" },
  "Balance": { masc: "Chercheur d'équilibre", fem: "Chercheure d'équilibre" },
  "Scorpion": { masc: "Plongeur dans l'ombre", fem: "Plongeuse dans l'ombre" },
  "Sagittaire": { masc: "Marcheur vers l'horizon", fem: "Marcheuse vers l'horizon" },
  "Capricorne": { masc: "Bâtisseur patient", fem: "Bâtisseuse patiente" },
  "Verseau": { masc: "Visionnaire solitaire", fem: "Visionnaire solitaire" },
  "Poissons": { masc: "Nageur entre les mondes", fem: "Nageuse entre les mondes" }
};

const getGenreFromNom = (nom) => {
  if (!nom) return 'fem';
  const prenom = nom.split(' ')[0].toLowerCase();
  const voyellesFinales = ['a', 'e', 'i', 'é', 'ée', 'ie', 'ne', 'le', 'ce', 'se', 'de', 'te'];
  if (voyellesFinales.some(fin => prenom.endsWith(fin))) return 'fem';
  return 'masc';
};

const getTitreProfil = (signe, nom) => {
  const genre = getGenreFromNom(nom);
  const titres = TITRES_PROFIL[signe] || TITRES_PROFIL["Verseau"];
  return titres[genre] || titres.fem;
};

const Profil = ({ onLogout }) => {
  const { user } = useAuthContext();
  const { profile, loading, refreshProfile } = useProfile(user?.id);
  const { logout, isLoading: isLoggingOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Non renseignée";
    try {
      const [year, month, day] = dateStr.split('-');
      const date = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const formatHeure = (heureStr) => {
    if (!heureStr) return "Non renseignée";
    return heureStr.substring(0, 5).replace(':', 'h');
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success && onLogout) {
      onLogout();
    }
  };

  const handleEditBack = () => {
    setIsEditing(false);
    if (refreshProfile) {
      refreshProfile();
    }
  };

  if (isEditing) {
    return (
      <EditProfil onBack={handleEditBack} />
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-night">
        <div className="text-gold font-serif italic animate-pulse text-sm">Synchronisation des données...</div>
      </div>
    );
  }

  const displayNom = profile?.nom || user?.user_metadata?.nom || "Voyageur";
  const signeSolaire = profile?.signe_solaire || "Bélier";
  const signeLunaire = profile?.signe_lunaire || "Lune";
  const ascendant = profile?.ascendant || "Ascendant";
  const avatarUrl = profile?.avatar_url;
  const titreProfil = getTitreProfil(signeSolaire, displayNom);

  return (
    <div className="w-full space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header avec bouton Modifier discret */}
      <div className="flex justify-between items-center px-1">
        <h3 className="font-serif text-base text-cream">Mon Profil</h3>
        <span
          onClick={() => setIsEditing(true)}
          className="text-gold text-[10px] uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity font-sans bg-gold/5 px-3 py-1 rounded-full border border-gold/10"
        >
          Modifier
        </span>
      </div>

      {/* Section Avatar & Identité */}
      <div className="flex flex-col items-center space-y-4 py-2">
        <div className="relative">
          <div className="w-28 h-28 bg-[#141731] border border-gold/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.05)] overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayNom} className="w-full h-full object-cover" />
            ) : (
              <span
                className="text-gold"
                style={{
                  fontFamily: 'serif',
                  fontVariantEmoji: 'text',
                  WebkitFontVariantEmoji: 'text',
                  fontSize: '48px',
                  lineHeight: 1
                }}>
                {ZODIAC_SYMBOLS[signeSolaire] || '✦'}
              </span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-night border border-gold/30 w-8 h-8 rounded-full flex items-center justify-center text-[10px] text-gold">
            ✦
          </div>
        </div>

        <div className="text-center">
          <h2 className="font-serif text-xl text-cream tracking-wide">{displayNom}</h2>
          <p className="text-muted text-[10px] tracking-[3px] uppercase mt-1 font-medium opacity-60">{titreProfil}</p>
        </div>

        {/* Badge "Big Three" Astro */}
        <div className="bg-card/40 backdrop-blur-md text-gold border border-border/50 rounded-full px-5 py-2 text-[10px] tracking-wider font-medium shadow-xl flex items-center gap-3">
          <span className="hover:text-cream transition-colors">{signeSolaire}</span>
          <span className="text-white/10 text-lg">|</span>
          <div className="flex items-center gap-1.5 hover:text-cream transition-colors">
            <AstraSymbol name="ascendant" size={12} />
            <span>{ascendant}</span>
          </div>
          <span className="text-white/10 text-lg">|</span>
          <div className="flex items-center gap-1.5 hover:text-cream transition-colors">
            <AstraSymbol name="lune" size={12} />
            <span>{signeLunaire}</span>
          </div>
        </div>
      </div>

      {/* Carte des données natales */}
      <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-5 mx-1 shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px bg-gold/20 flex-1"></div>
          <h4 className="text-muted text-[9px] tracking-[3px] uppercase font-bold">Données Natales</h4>
          <div className="h-px bg-gold/20 flex-1"></div>
        </div>

        <div className="space-y-1">
          {[
            { label: 'Naissance', value: formatDate(profile?.date_naissance) },
            { label: 'Heure exacte', value: formatHeure(profile?.heure_naissance) },
            { label: 'Cité d\'origine', value: profile?.lieu_naissance || "Non renseigné" },
            { label: 'Dominante Solaire', value: signeSolaire },
            { label: 'Dominante Lunaire', value: signeLunaire },
          ].map((item, index, arr) => (
            <div key={index} className={`flex justify-between py-3.5 ${index !== arr.length - 1 ? 'border-b border-white/[0.03]' : ''}`}>
              <span className="text-muted/80 text-[11px] uppercase tracking-wider">{item.label}</span>
              <span className="text-cream text-[12px] font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Abonnement Astra Étoile */}
      <div className="bg-gradient-to-br from-[#120E22] to-[#1C2040] border border-gold/30 rounded-2xl p-5 mx-1 space-y-3 relative overflow-hidden shadow-lg shadow-gold/5 group">
        <div className="absolute top-0 right-0 p-2 opacity-5 text-6xl text-gold font-serif select-none group-hover:scale-110 transition-transform duration-700">✦</div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gold tracking-[3px] uppercase font-black">Astra Étoile</span>
          <span className="bg-gold/10 text-gold border border-gold/20 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase">Membre</span>
        </div>
        <p className="text-[#B0ADCA] text-[11px] leading-relaxed">Accès illimité aux transits planétaires et à la cartographie céleste avancée.</p>
        <p className="text-muted/60 text-[9px] italic">Renouvellement : Mai 2026</p>
      </div>

      {/* Liste des paramètres */}
      <div className="space-y-2 mx-1">
        <h4 className="text-muted text-[9px] tracking-[3px] uppercase mb-4 ml-1 opacity-50">Configuration</h4>
        <div className="bg-card/40 border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          {[
            { icon: '🔔', title: 'Notifications', desc: 'Horoscope, alertes transits' },
            { icon: '🌙', title: 'Interface', desc: 'Thème Sombre · Minuit' },
            { icon: '🔒', title: 'Confidentialité', desc: 'Gérer mes données éphémères' }
          ].map((param, i, arr) => (
            <div key={i} className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.03] transition-colors ${i !== arr.length - 1 ? 'border-b border-white/[0.03]' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm">{param.icon}</div>
              <div className="flex-1">
                <p className="text-cream text-[13px] font-medium">{param.title}</p>
                <p className="text-muted text-[10px] opacity-60">{param.desc}</p>
              </div>
              <span className="text-muted/30 text-lg">›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton déconnexion épuré */}
      <div className="pt-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full text-muted hover:text-red-400/80 transition-all text-[10px] uppercase tracking-[4px] py-4 border border-white/5 rounded-xl bg-white/[0.01] disabled:opacity-30"
        >
          {isLoggingOut ? 'Fermeture de la session...' : 'Clore la session'}
        </button>
        <p className="text-center text-[8px] text-muted/30 mt-4 tracking-[2px] uppercase">Astra v1.0.4 — 2026</p>
      </div>
    </div>
  );
};

export default Profil;