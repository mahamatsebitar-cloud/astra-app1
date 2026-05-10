// src/screens/Profil.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import AstraSymbol from '../components/ui/AstraSymbol';
import ZodiacSymbol from '../components/ui/ZodiacSymbol';
import EditProfil from './EditProfil';
import CGU from './legal/CGU';
import PolitiqueConfidentialite from './legal/PolitiqueConfidentialite';
import MentionsLegales from './legal/MentionsLegales';
import { deleteAccount } from '../services/authService';
import { supabase } from '../lib/supabase';
import { requestNotificationPermission, setUserTags } from '../lib/notifications';

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

const getTitreProfil = (signe, nom) => {
  if (!nom) return TITRES_PROFIL[signe]?.fem || "Voyageur de l'Infini";
  const prenom = nom.split(' ')[0].toLowerCase();
  const voyellesFinales = ['a', 'e', 'i', 'é', 'ée', 'ie', 'ne', 'le', 'ce', 'se', 'de', 'te'];
  const genre = voyellesFinales.some(fin => prenom.endsWith(fin)) ? 'fem' : 'masc';
  return TITRES_PROFIL[signe]?.[genre] || TITRES_PROFIL["Verseau"][genre];
};

const Profil = ({ onLogout, onNavigate }) => {
  const { user } = useAuthContext();
  const { profile, loading, refreshProfile } = useProfile(user?.id);
  const { logout, isLoading: isLoggingOut } = useAuth();
  const { isFree, isTrial, isActive, daysRemaining, planLabel } = useSubscription();
  
  const [isEditing, setIsEditing] = useState(false);
  const [legalScreen, setLegalScreen] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notifStatus, setNotifStatus] = useState(null);

  const displayNom = useMemo(() => profile?.nom || user?.user_metadata?.nom || "Voyageur", [profile, user]);
  const signeSolaire = useMemo(() => profile?.signe_solaire || "Bélier", [profile]);
  const titreProfil = useMemo(() => getTitreProfil(signeSolaire, displayNom), [signeSolaire, displayNom]);

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "Non renseignée";
    try {
      const [year, month, day] = dateStr.split('-');
      return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        .format(new Date(year, month - 1, day));
    } catch { return dateStr; }
  }, []);

  const formatHeure = useCallback((heureStr) => {
    if (!heureStr) return "Non renseignée";
    return heureStr.substring(0, 5).replace(':', 'h');
  }, []);

  const subscriptionInfo = useMemo(() => ({
    label: isActive ? planLabel : isTrial ? `Essai · ${daysRemaining}j restants` : 'Découvrir Astra Étoile',
    badge: isActive ? 'Actif' : isTrial ? 'Essai' : 'Premium',
    footer: isActive ? 'Renouvellement automatique' : isTrial ? "Profitez de l'accès complet" : 'Accédez à toutes les fonctionnalités'
  }), [isActive, isTrial, planLabel, daysRemaining]);

  const handleEnableNotifications = async () => {
    console.log('🔔 CLICKED NOTIFICATIONS');
    setNotifStatus('loading');
    try {
      // Demande permission ET récupère l'ID en une seule étape
      const osId = await requestNotificationPermission();
      console.log('🔔 OneSignal ID received:', osId);
      
      if (!osId) {
        setNotifStatus('denied');
        return;
      }

      const { error } = await supabase
        .from('notification_tokens')
        .upsert({
          user_id: user.id,
          token: osId,
          platform: 'android_onesignal'
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('❌ Supabase error:', error);
        setNotifStatus('error');
        return;
      }

      await setUserTags(profile.signe_solaire, profile.nom);
      console.log('✅ Token saved + tags set');
      setNotifStatus('granted');
    } catch (err) {
      console.error('❌ Error:', err);
      setNotifStatus('error');
    }
  };

  const handleLogout = async () => {
    if (await logout() && onLogout) onLogout();
  };

  const handleEditBack = () => {
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await deleteAccount(user.id);
      if (!error) {
        onLogout();
      } else {
        alert('Erreur lors de la suppression : ' + error);
      }
    } catch (err) {
      alert('Erreur lors de la suppression : ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (legalScreen === 'cgu') return <CGU onBack={() => setLegalScreen(null)} />;
  if (legalScreen === 'confidentialite') return <PolitiqueConfidentialite onBack={() => setLegalScreen(null)} />;
  if (legalScreen === 'mentions') return <MentionsLegales onBack={() => setLegalScreen(null)} />;
  if (isEditing) return <EditProfil onBack={handleEditBack} />;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-night">
        <div className="text-gold font-serif italic animate-pulse text-sm tracking-widest">
          Lecture des astres...
        </div>
      </div>
    );
  }

  const notifDesc = notifStatus === 'granted' ? 'Notifications activées' 
    : notifStatus === 'denied' ? 'Notifications refusées'
    : notifStatus === 'loading' ? 'Activation...'
    : 'Horoscope & alertes';

  return (
    <div className="w-full space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      <div className="flex justify-between items-end px-1 pt-2">
        <div>
          <h3 className="font-serif text-xl text-cream">Sanctuaire</h3>
          <p className="text-[9px] text-muted tracking-widest uppercase opacity-50">Paramètres du profil</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-gold text-[10px] uppercase tracking-widest font-sans bg-gold/5 px-4 py-1.5 rounded-full border border-gold/20 hover:bg-gold/10 active:scale-95 transition-all"
        >
          Modifier
        </button>
      </div>

      <section className="flex flex-col items-center py-4">
        <div className="relative group">
          <div className="w-32 h-32 bg-[#141731] border-2 border-gold/20 rounded-full flex items-center justify-center shadow-2xl overflow-hidden transition-transform duration-500 group-hover:scale-105">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={displayNom} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center">
                <ZodiacSymbol signe={signeSolaire} size={48} color="#C9A460" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-night border border-gold/40 w-9 h-9 rounded-full flex items-center justify-center text-xs text-gold shadow-lg">
            ✦
          </div>
        </div>

        <div className="text-center mt-5">
          <h2 className="font-serif text-2xl text-cream tracking-wide">{displayNom}</h2>
          <p className="text-gold/60 text-[10px] tracking-[4px] uppercase mt-1.5 font-bold italic">{titreProfil}</p>
        </div>

        <div className="mt-6 bg-card/40 backdrop-blur-xl border border-white/5 rounded-full px-6 py-2.5 text-[11px] tracking-wider flex items-center gap-4 shadow-2xl">
          <span className="text-gold font-bold">{signeSolaire}</span>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5 text-cream/80">
            <AstraSymbol name="ascendant" size={12} />
            <span>{profile?.ascendant || "Asc"}</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5 text-cream/80">
            <AstraSymbol name="lune" size={12} />
            <span>{profile?.signe_lunaire || "Lune"}</span>
          </div>
        </div>
      </section>

      <section className="bg-card/40 backdrop-blur-md border border-white/5 rounded-[24px] p-6 mx-1">
        <div className="flex items-center gap-4 mb-6 opacity-40">
          <div className="h-px bg-gold/50 flex-1" />
          <h4 className="text-[9px] tracking-[4px] uppercase font-black text-gold">Origines</h4>
          <div className="h-px bg-gold/50 flex-1" />
        </div>

        <div className="grid gap-1">
          {[
            { label: 'Naissance', value: formatDate(profile?.date_naissance) },
            { label: 'Heure', value: formatHeure(profile?.heure_naissance) },
            { label: 'Lieu', value: profile?.lieu_naissance || "Non renseigné" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-white/[0.03] last:border-0">
              <span className="text-muted text-[10px] uppercase tracking-widest font-medium">{item.label}</span>
              <span className="text-cream text-[13px]">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <div 
        onClick={() => onNavigate?.('abonnement')}
        className="relative overflow-hidden bg-gradient-to-br from-[#120E22] to-[#1C2040] border border-gold/30 rounded-[24px] p-6 mx-1 cursor-pointer active:scale-[0.98] transition-all group shadow-xl shadow-gold/5"
      >
        <div className="absolute -top-4 -right-4 text-8xl text-gold/5 font-serif group-hover:rotate-12 transition-transform duration-1000">✦</div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] text-gold tracking-[4px] uppercase font-black">Astra Étoile</span>
          <span className="bg-gold text-night px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter">
            {subscriptionInfo.badge}
          </span>
        </div>
        <p className="text-cream/90 text-[13px] font-serif italic mb-1">{subscriptionInfo.label}</p>
        <p className="text-muted/60 text-[10px]">{subscriptionInfo.footer}</p>
      </div>

      <div className="space-y-6 mx-1">
        <div className="space-y-2">
          <h4 className="text-muted text-[9px] tracking-[4px] uppercase ml-1 opacity-40 font-bold">Configuration</h4>
          <div className="bg-card/40 border border-white/5 rounded-2xl overflow-hidden shadow-lg">
            <button 
              onClick={() => { console.log('🔔 CLICKED NOTIFICATIONS'); handleEnableNotifications(); }}
              className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors cursor-pointer border-b border-white/[0.03] w-full text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-sm shadow-inner">🔔</div>
              <div className="flex-1">
                <p className="text-cream text-sm font-medium">Notifications</p>
                <p className="text-muted text-[10px]">{notifDesc}</p>
              </div>
              <span className="text-muted/20 text-xl font-light">›</span>
            </button>
            <div className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-sm shadow-inner">🌙</div>
              <div className="flex-1">
                <p className="text-cream text-sm font-medium">Interface</p>
                <p className="text-muted text-[10px]">Thème Sombre · Minuit</p>
              </div>
              <span className="text-muted/20 text-xl font-light">›</span>
            </div>
            <div 
              onClick={() => setLegalScreen('confidentialite')}
              className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-sm shadow-inner">🔒</div>
              <div className="flex-1">
                <p className="text-cream text-sm font-medium">Confidentialité</p>
                <p className="text-muted text-[10px]">Gérer mes données</p>
              </div>
              <span className="text-muted/20 text-xl font-light">›</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-muted text-[9px] tracking-[4px] uppercase ml-1 opacity-40 font-bold">Légal</h4>
          <div className="bg-card/20 border border-white/5 rounded-2xl overflow-hidden font-sans">
            {[
              { label: "Conditions d'utilisation", action: () => setLegalScreen('cgu') },
              { label: "Mentions légales", action: () => setLegalScreen('mentions') }
            ].map((item, i, arr) => (
              <div 
                key={i} 
                onClick={item.action}
                className={`flex justify-between items-center p-4 cursor-pointer hover:bg-white/5 transition-colors ${i !== arr.length - 1 ? 'border-b border-white/[0.03]' : ''}`}
              >
                <span className="text-cream/70 text-xs">{item.label}</span>
                <span className="text-muted/20 text-lg">›</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 pb-4 space-y-6">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full text-muted hover:text-red-400 transition-colors text-[10px] uppercase tracking-[5px] py-5 border border-white/5 rounded-2xl bg-white/[0.02] active:scale-[0.99]"
        >
          {isLoggingOut ? 'Fermeture du temple...' : 'Clore la session'}
        </button>

        <div className="flex flex-col items-center">
          {showDeleteConfirm ? (
            <div className="w-full bg-red-950/20 border border-red-900/30 rounded-3xl p-6 text-center animate-in zoom-in-95 duration-300">
              <p className="text-cream text-sm font-serif mb-2">Effacer votre trace ?</p>
              <p className="text-muted text-[10px] leading-relaxed mb-6 px-4">Cette action est irréversible et supprimera toutes vos données conformément au RGPD.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(false)} 
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-full border border-white/10 text-cream text-[11px]"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-full bg-red-900/40 text-red-200 text-[11px] font-bold disabled:opacity-50"
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-900/40 text-[9px] uppercase tracking-[3px] py-2 hover:text-red-800 transition-colors font-bold"
            >
              Supprimer mon compte
            </button>
          )}
          <p className="text-muted/20 text-[8px] tracking-[4px] uppercase mt-8">Astra v1.0.0 · Made in France 🇫🇷</p>
        </div>
      </div>
    </div>
  );
};

export default Profil;