import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from '../components/ui/Card';
import PremiumGate from '../components/ui/PremiumGate';
import { useFriends } from '../hooks/useFriends';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { getHoroscopeComplet } from '../services/horoscopeService';

const ZODIAC_SYMBOLS = {
  "Bélier": "♈", "Taureau": "♉", "Gémeaux": "♊", "Cancer": "♋",
  "Lion": "♌", "Vierge": "♍", "Balance": "♎", "Scorpion": "♏",
  "Sagittaire": "♐", "Capricorne": "♑", "Verseau": "♒", "Poissons": "♓"
};

const getScoreColor = (score) => {
  if (score >= 80) return '#5CAE8A';
  if (score >= 60) return '#C9A460';
  return '#C17B8A';
};

const getTempsRelatif = (dateStr) => {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const heures = Math.floor(diff / 3600000);
  const jours = Math.floor(diff / 86400000);
  if (minutes < 2) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes}min`;
  if (heures < 24) return `il y a ${heures}h`;
  if (jours < 7) return `il y a ${jours}j`;
  return null;
};

const getTexteActivite = (activity) => {
  switch (activity.type) {
    case 'ami_accepte': return `${activity.actor?.nom} a rejoint vos alliances`;
    case 'compatibilite_vue': return `${activity.actor?.nom} a consulté votre compatibilité`;
    case 'ami_demande': return `${activity.actor?.nom} souhaite vous rejoindre`;
    default: return null;
  }
};

const Compatibilite = ({ onUpgrade }) => {
  const { user } = useAuthContext();
  const { profile } = useProfile(user?.id);
  const {
    friends,
    pendingRequests,
    activityFeed,
    loading,
    searchLoading,
    searchUser,
    searchResults,
    setSearchResults,
    addFriend,
    acceptRequest,
    removeFriend,
    getCompatibilityWith,
    logView,
    getShareLink
  } = useFriends();

  const [vue, setVue] = useState('liste'); // 'liste' | 'detail' | 'profil'
  const [amiSelectionne, setAmiSelectionne] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [animBars, setAnimBars] = useState(false);
  const [invitationStatus, setInvitationStatus] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
  }, [vue, amiSelectionne]);

  useEffect(() => {
    if (amiSelectionne) {
      setAnimBars(false);
      const timer = setTimeout(() => setAnimBars(true), 100);
      return () => clearTimeout(timer);
    }
  }, [amiSelectionne]);

  // Log la vue quand on consulte la compatibilité d'un ami
  useEffect(() => {
    if (vue === 'detail' && amiSelectionne?.ami?.id) {
      logView(amiSelectionne.ami.id);
    }
  }, [vue, amiSelectionne, logView]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setInvitationStatus(null);
    await searchUser(searchQuery.trim());
  }, [searchQuery, searchUser]);

  const handleAddFriend = async (targetId) => {
    const { error } = await addFriend(targetId);
    if (error) {
      setInvitationStatus(error.includes('déjà') ? 'duplicate' : 'error');
    } else {
      setInvitationStatus('success');
      setTimeout(() => {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults(null);
      }, 1500);
    }
  };

  const handleShare = async () => {
    const link = getShareLink();
    if (!link) return;
    try {
      await navigator.share({ title: 'Mon profil Astra', url: link });
    } catch {
      await navigator.clipboard.writeText(link);
    }
  };

  // ━━━ VUE 3 — PROFIL D'UN AMI ━━━
  if (vue === 'profil' && amiSelectionne) {
    const ami = amiSelectionne.ami || amiSelectionne;
    const horoAmi = getHoroscopeComplet(ami.signe_solaire);
    const tempsRelatif = getTempsRelatif(ami.last_seen_at);

    return (
      <div ref={scrollRef} className="w-full space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
        <div className="flex justify-between items-center pt-6">
          <button onClick={() => setVue('detail')} className="text-muted text-xs uppercase tracking-widest flex items-center gap-2 active:opacity-50 font-bold">
            <span className="text-lg">←</span> Retour
          </button>
          <button onClick={() => { removeFriend(amiSelectionne.friendshipId); setVue('liste'); }} className="text-muted/30 hover:text-red-400 transition-colors text-sm">🗑</button>
        </div>

        <div className="flex flex-col items-center py-8">
          <span className="text-7xl mb-4" style={{ fontVariantEmoji: 'text' }}>{ZODIAC_SYMBOLS[ami.signe_solaire] || "✨"}</span>
          <h2 className="font-serif text-2xl text-cream">{ami.nom}</h2>
          <p className="text-muted text-xs mt-1">@{ami.username || '...'}</p>
          {tempsRelatif && <p className="text-muted/40 text-[10px] mt-1">{tempsRelatif}</p>}
        </div>

        <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-full px-6 py-2.5 text-[11px] tracking-wider flex items-center justify-center gap-4">
          <span className="text-gold font-bold">{ami.signe_solaire}</span>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-cream/80">↑ {ami.ascendant || "Asc"}</span>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-cream/80">☽ {ami.signe_lunaire || "Lune"}</span>
        </div>

        <Card className="p-5 border-white/5 bg-card/30">
          <p className="text-[10px] text-gold tracking-widest uppercase mb-3 font-bold">Son horoscope du jour</p>
          <p className="text-cream/80 italic font-serif text-sm leading-relaxed">
            {horoAmi?.message || "Les étoiles murmurent en silence."}
          </p>
          <p className="text-muted/30 text-[9px] mt-3">Basé sur son signe solaire</p>
        </Card>

        <button onClick={() => setVue('detail')} className="w-full border border-gold/30 text-gold text-sm py-3 rounded-full active:scale-95 transition-all">
          Voir notre compatibilité →
        </button>
      </div>
    );
  }

  // ━━━ VUE 2 — DÉTAIL COMPATIBILITÉ ━━━
  if (vue === 'detail' && amiSelectionne) {
    const ami = amiSelectionne.ami || amiSelectionne;
    const comp = getCompatibilityWith(ami);
    const rayon = 26;
    const circonference = 2 * Math.PI * rayon;
    const dash = (comp.global / 100) * circonference;

    return (
      <div ref={scrollRef} className="w-full space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
        <button onClick={() => setVue('liste')} className="text-muted text-xs uppercase tracking-widest flex items-center gap-2 py-6 active:opacity-50 font-bold">
          <span className="text-lg">←</span> Retour aux alliances
        </button>

        <header className="space-y-1">
          <p className="text-[10px] text-gold tracking-[0.3em] uppercase font-bold">Affinités Astrales</p>
          <h3 className="text-2xl font-serif text-cream">{ami.nom?.split(' ')[0]} & Toi</h3>
        </header>

        <div className="bg-card/80 backdrop-blur-md border border-white/5 rounded-[32px] p-8 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="flex justify-around items-center relative z-10">
            <div className="text-center group">
              <span className="text-5xl mb-2 block transition-transform group-hover:scale-110 duration-500" style={{ fontVariantEmoji: 'text' }}>{ZODIAC_SYMBOLS[profile?.signe_solaire] || "✨"}</span>
              <p className="text-gold text-[9px] uppercase tracking-[0.2em] font-black">Toi</p>
            </div>

            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 70 70">
                <circle cx="35" cy="35" r={rayon} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle cx="35" cy="35" r={rayon} fill="none" stroke={getScoreColor(comp.global)} strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={circonference}
                  strokeDashoffset={animBars ? circonference - dash : circonference}
                  className="transition-all duration-[1500ms] ease-out"
                  transform="rotate(-90 35 35)" />
              </svg>
              <div className="absolute text-center">
                <span className="font-serif text-xl text-cream leading-none">{comp.global}%</span>
              </div>
            </div>

            <div className="text-center group">
              <span className="text-5xl mb-2 block transition-transform group-hover:scale-110 duration-500" style={{ fontVariantEmoji: 'text' }}>{ZODIAC_SYMBOLS[ami.signe_solaire] || "✨"}</span>
              <p className="text-gold text-[9px] uppercase tracking-[0.2em] font-black">{ami.nom?.split(' ')[0]}</p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="space-y-3">
            <p className="italic text-cream text-base leading-relaxed font-serif text-center px-2">« {comp.citation} »</p>
            <p className="text-muted/50 text-[9px] uppercase tracking-widest text-center">Analyse basée sur vos positions planétaires</p>
          </div>
        </div>

        <button onClick={() => setVue('profil')} className="w-full border border-white/10 text-cream text-sm py-3 rounded-full active:scale-95 transition-all">
          Voir le profil de {ami.nom?.split(' ')[0]}
        </button>

        <PremiumGate featureKey="compatibilite_avancee" onUpgrade={onUpgrade} preview={true}>
          <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <p className="text-[10px] text-muted tracking-[0.3em] uppercase font-bold ml-2">Analyse des piliers</p>
            <div className="bg-card/30 border border-white/5 rounded-[32px] p-6 space-y-6">
              {[
                { label: 'Amour & Passion', score: comp.amour, color: '#C17B8A' },
                { label: 'Dialogue & Mental', score: comp.communication, color: '#7B9ECB' },
                { label: 'Valeurs & Vision', score: comp.valeurs, color: '#C9A460' },
                { label: 'Complicité', score: comp.complicite, color: '#E05C5C' },
                { label: 'Durabilité', score: comp.durabilite, color: '#5CAE8A' },
              ].map((pillier, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-cream/90 text-xs font-medium tracking-wide">{pillier.label}</span>
                    <span className="text-gold font-serif text-sm">{pillier.score}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-[1200ms] ease-out"
                      style={{ width: animBars ? `${pillier.score}%` : '0%', backgroundColor: pillier.color, boxShadow: `0 0 12px ${pillier.color}66` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PremiumGate>
      </div>
    );
  }

  // ━━━ VUE 1 — LISTE DES ALLIANCES ━━━
  return (
    <div ref={scrollRef} className="w-full space-y-8 pb-24 px-4 animate-in fade-in duration-700">
      <header className="flex justify-between items-end pt-8">
        <div className="space-y-1">
          <p className="text-[10px] text-gold tracking-[0.4em] uppercase font-black">Astra Network</p>
          <h3 className="text-3xl font-serif text-cream">Vos Alliances</h3>
          {profile?.username && (
            <p className="text-muted text-[10px] mt-1">@{profile.username}</p>
          )}
        </div>
        <button onClick={() => setShowSearch(!showSearch)}
          className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-500 shadow-lg ${showSearch ? 'bg-red-500/10 text-red-500 border border-red-500/20 rotate-90' : 'bg-gold/10 text-gold border border-gold/20'}`}>
          <span className="text-3xl font-light">{showSearch ? '×' : '+'}</span>
        </button>
      </header>

      {showSearch && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="relative group">
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par @username ou email..."
              className="w-full bg-card/50 border border-white/10 rounded-[22px] pl-6 pr-24 py-5 text-cream text-sm focus:border-gold/40 focus:bg-card outline-none transition-all" />
            <button onClick={handleSearch} disabled={searchLoading}
              className="absolute right-2 top-2 bottom-2 bg-gold hover:bg-gold/80 text-night font-serif font-bold rounded-[16px] px-5 transition-all disabled:opacity-50">
              {searchLoading ? '...' : 'Chercher'}
            </button>
          </div>

          {searchResults && searchResults.length > 0 && searchResults.map((result) => (
            <Card key={result.id} onClick={() => !result.isFriend && !result.isPending && handleAddFriend(result.id)}
              className={`p-5 flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 border-gold/20 ${invitationStatus === 'success' ? 'bg-green-500/10 border-green-500/30' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold text-xl font-serif">
                {result.nom?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-cream font-medium">{result.nom}</p>
                <p className="text-[10px] text-gold/60 uppercase tracking-widest">@{result.username} · {result.signe_solaire}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors ${result.isFriend ? 'bg-green-500/10 text-green-400 border border-green-500/20' : result.isPending ? 'bg-gold/5 text-gold/50 border border-gold/10' : invitationStatus === 'success' ? 'bg-green-500 text-white' : 'bg-gold/10 text-gold border border-gold/20'}`}>
                {result.isFriend ? 'Ami' : result.isPending ? 'En attente' : invitationStatus === 'success' ? 'Envoyé' : 'Inviter'}
              </div>
            </Card>
          ))}
          {searchResults?.length === 0 && (
            <div className="text-center py-8"><p className="text-muted/40 font-serif italic text-sm">Aucun compte trouvé</p></div>
          )}
        </div>
      )}

      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <p className="text-[10px] text-gold tracking-[0.2em] uppercase font-bold ml-1">Appels des astres</p>
          <div className="grid gap-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 p-5 rounded-[24px] flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gold/20 flex items-center justify-center text-gold font-serif border border-gold/30">
                    {req.sender?.nom?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-cream text-sm font-bold tracking-wide">{req.sender?.nom}</p>
                    <p className="text-[9px] text-gold/60 uppercase font-bold">@{req.sender?.username} · {req.sender?.signe_solaire}</p>
                  </div>
                </div>
                <button onClick={() => acceptRequest(req.id)}
                  className="bg-gold text-night text-[10px] font-black px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition-all">
                  ACCEPTER
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activityFeed.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] text-muted tracking-[0.2em] uppercase font-bold ml-1">Activité récente</p>
          <div className="bg-card/20 border border-white/5 rounded-[24px] p-4 space-y-3">
            {activityFeed.slice(0, 5).map((activity) => {
              const texte = getTexteActivite(activity);
              if (!texte) return null;
              return (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-gold text-[10px] font-serif">
                    {activity.actor?.nom?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-cream/70 text-[11px]">{texte}</p>
                    <p className="text-muted text-[9px]">{getTempsRelatif(activity.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-[10px] text-muted tracking-[0.2em] uppercase font-bold ml-1">Cercle Restreint</p>
        {friends.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
            <p className="text-muted/40 font-serif italic text-base">« Le ciel est vaste, ne voyagez pas seul. »</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {friends.map((f) => {
              const ami = f.ami;
              const comp = getCompatibilityWith(ami);
              return (
                <div key={f.friendshipId} onClick={() => { setAmiSelectionne(f); setVue('detail'); }}
                  className="bg-card/40 border border-white/5 p-5 rounded-[28px] flex items-center gap-5 active:scale-[0.98] transition-all hover:bg-card/60 hover:border-gold/20 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-night border border-white/5 flex items-center justify-center text-gold font-serif text-2xl shadow-inner">
                    {ami?.nom?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-cream font-bold tracking-wide">{ami?.nom}</p>
                    <p className="text-[9px] text-muted uppercase tracking-[0.1em]">@{ami?.username} · {ami?.signe_solaire}</p>
                    {getTempsRelatif(ami?.last_seen_at) && (
                      <p className="text-muted/40 text-[9px] mt-0.5">{getTempsRelatif(ami?.last_seen_at)}</p>
                    )}
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xl font-serif" style={{ color: getScoreColor(comp.global) }}>{comp.global}%</span>
                    <div className="w-8 h-0.5 mt-1 rounded-full opacity-30" style={{ backgroundColor: getScoreColor(comp.global) }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button onClick={handleShare} className="w-full border border-gold/20 text-gold text-sm py-3 rounded-full active:scale-95 transition-all mt-4">
        Partager mon profil astral
      </button>
    </div>
  );
};

export default Compatibilite;