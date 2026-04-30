import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Card from '../components/ui/Card';
import PremiumGate from '../components/ui/PremiumGate';
import { useFriends } from '../hooks/useFriends';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';

const ZODIAC_SYMBOLS = {
  "Bélier": "♈", "Taureau": "♉", "Gémeaux": "♊", "Cancer": "♋",
  "Lion": "♌", "Vierge": "♍", "Balance": "♎", "Scorpion": "♏",
  "Sagittaire": "♐", "Capricorne": "♑", "Verseau": "♒", "Poissons": "♓"
};

const getScoreColor = (score) => {
  if (score >= 80) return '#5CAE8A'; // Vert émeraude
  if (score >= 60) return '#C9A460'; // Or
  return '#C17B8A'; // Rose mystique
};

const Compatibilite = ({ onUpgrade }) => {
  const { user } = useAuthContext();
  const { profile } = useProfile(user?.id);
  const {
    friends,
    pendingRequests,
    loading,
    searchUser,
    searchResults,
    addFriend,
    acceptRequest,
    getCompatibilityWith
  } = useFriends();

  const [amiSelectionne, setAmiSelectionne] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [animBars, setAnimBars] = useState(false);
  const [invitationStatus, setInvitationStatus] = useState(null);

  // Déclenchement de l'animation à l'ouverture du détail
  useEffect(() => {
    if (amiSelectionne) {
      setAnimBars(false);
      const timer = setTimeout(() => setAnimBars(true), 100);
      return () => clearTimeout(timer);
    }
  }, [amiSelectionne]);

  const handleSearch = useCallback(async () => {
    if (!searchEmail.trim()) return;
    setInvitationStatus(null);
    try {
      await searchUser(searchEmail.toLowerCase().trim());
    } catch (err) {
      console.error("Erreur recherche :", err);
    }
  }, [searchEmail, searchUser]);

  const handleAddFriend = async (targetId) => {
    try {
      const { error } = await addFriend(targetId);
      if (error) {
        setInvitationStatus('duplicate');
      } else {
        setInvitationStatus('success');
        setTimeout(() => {
            setShowSearch(false);
            setSearchEmail('');
        }, 1500);
      }
    } catch (err) {
      setInvitationStatus('duplicate');
    }
  };

  // Vue Détail Alliance
  if (amiSelectionne) {
    const ami = amiSelectionne.ami || amiSelectionne;
    const comp = getCompatibilityWith(ami);
    const rayon = 23;
    const circonference = 2 * Math.PI * rayon;
    const dashOffset = circonference - (comp.global / 100) * circonference;

    return (
      <div className="w-full min-h-screen space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
        <button
          onClick={() => setAmiSelectionne(null)}
          className="text-muted text-xs uppercase tracking-widest flex items-center gap-2 py-6 active:opacity-50 transition-all font-bold"
        >
          <span className="text-lg">←</span> Retour aux alliances
        </button>

        <header className="space-y-1">
          <p className="text-[10px] text-gold tracking-[0.3em] uppercase font-bold">Résonances Célestes</p>
          <h3 className="text-2xl font-serif text-cream">{ami.nom?.split(' ')[0]} & Toi</h3>
        </header>

        {/* Carte Score Global */}
        <div className="bg-card/80 backdrop-blur-md border border-white/5 rounded-[32px] p-8 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="flex justify-around items-center relative z-10">
            <div className="text-center group">
              <div className="text-6xl mb-3 transition-transform group-hover:scale-110 duration-500">
                {ZODIAC_SYMBOLS[profile?.signe_solaire] || "✨"}
              </div>
              <p className="text-gold text-[9px] uppercase tracking-[0.2em] font-black">Toi</p>
            </div>

            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 58 58" className="transform -rotate-90">
                <circle cx="29" cy="29" r={rayon} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                <circle 
                    cx="29" cy="29" r={rayon} fill="none" 
                    stroke={getScoreColor(comp.global)} 
                    strokeWidth="2.5" strokeLinecap="round" 
                    strokeDasharray={circonference} 
                    strokeDashoffset={animBars ? dashOffset : circonference} 
                    className="transition-all duration-[1500ms] ease-out" 
                />
              </svg>
              <div className="absolute text-center">
                <span className="font-serif text-2xl text-cream leading-none">{comp.global}%</span>
              </div>
            </div>

            <div className="text-center group">
              <div className="text-6xl mb-3 transition-transform group-hover:scale-110 duration-500">
                {ZODIAC_SYMBOLS[ami.signe_solaire] || "✨"}
              </div>
              <p className="text-gold text-[9px] uppercase tracking-[0.2em] font-black">{ami.nom?.split(' ')[0]}</p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="space-y-3">
             <p className="italic text-cream text-base leading-relaxed font-serif text-center px-2">
                « {comp.citation} »
             </p>
             <p className="text-muted/50 text-[9px] uppercase tracking-widest text-center leading-loose">
               Analyse basée sur vos positions planétaires respectives
             </p>
          </div>
        </div>

        {/* Détails par catégorie via PremiumGate */}
        <PremiumGate featureKey="compatibilite_avancee" onUpgrade={onUpgrade} preview={true}>
          <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <p className="text-[10px] text-muted tracking-[0.3em] uppercase font-bold ml-2">Analyse des piliers</p>
            <div className="bg-card/30 border border-white/5 rounded-[32px] p-6 space-y-6">
              {[
                { label: 'Amour & Passion', score: comp.amour, color: '#C17B8A' },
                { label: 'Intellect & Dialogue', score: comp.communication, color: '#7B9ECB' },
                { label: 'Âme & Valeurs', score: comp.valeurs, color: '#C9A460' },
                { label: 'Complicité Intuitive', score: comp.complicite, color: '#E05C5C' }
              ].map((pillier, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-cream/90 text-xs font-medium tracking-wide">{pillier.label}</span>
                    <span className="text-gold font-serif text-sm">{pillier.score}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className="h-full rounded-full transition-all duration-[1500ms] ease-out" 
                        style={{ 
                            width: animBars ? `${pillier.score}%` : '0%', 
                            backgroundColor: pillier.color,
                            boxShadow: `0 0 12px ${pillier.color}66`
                        }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PremiumGate>
      </div>
    );
  }

  // Vue Liste des Alliances (Défaut)
  return (
    <div className="w-full min-h-screen space-y-8 pb-24 px-4 animate-in fade-in duration-700">
      <header className="flex justify-between items-end pt-8">
        <div className="space-y-1">
          <p className="text-[10px] text-gold tracking-[0.4em] uppercase font-black">Astra Network</p>
          <h3 className="text-3xl font-serif text-cream">Vos Alliances</h3>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-500 shadow-lg ${showSearch ? 'bg-red-500/10 text-red-500 border border-red-500/20 rotate-90' : 'bg-gold/10 text-gold border border-gold/20'}`}
        >
          <span className="text-3xl font-light">{showSearch ? '×' : '+'}</span>
        </button>
      </header>

      {/* Barre de Recherche */}
      {showSearch && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="relative group">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Email de l'astronome..."
              className="w-full bg-card/50 border border-white/10 rounded-[22px] pl-6 pr-24 py-5 text-cream text-sm focus:border-gold/40 focus:bg-card outline-none transition-all"
            />
            <button 
                onClick={handleSearch} 
                className="absolute right-2 top-2 bottom-2 bg-gold hover:bg-gold/80 text-night font-serif font-bold rounded-[16px] px-5 transition-all disabled:opacity-50" 
                disabled={loading}
            >
              {loading ? '...' : 'Chercher'}
            </button>
          </div>
          
          {searchResults && (
            <Card 
              onClick={() => handleAddFriend(searchResults.id)} 
              className={`p-5 flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 border-gold/20 ${invitationStatus === 'success' ? 'bg-green-500/10 border-green-500/30' : ''}`}
            >
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold text-xl font-serif">
                {searchResults.nom?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-cream font-medium">{searchResults.nom}</p>
                <p className="text-[10px] text-gold/60 uppercase tracking-widest">{searchResults.signe_solaire}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors ${invitationStatus === 'success' ? 'bg-green-500 text-white' : 'bg-gold/10 text-gold border border-gold/20'}`}>
                {invitationStatus === 'success' ? 'Envoyé' : invitationStatus === 'duplicate' ? 'En attente' : 'Inviter'}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Invitations reçues */}
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
                    <p className="text-[9px] text-gold/60 uppercase font-bold">{req.sender?.signe_solaire}</p>
                  </div>
                </div>
                <button 
                  onClick={() => acceptRequest(req.id)}
                  className="bg-gold text-night text-[10px] font-black px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition-all"
                >
                  ACCEPTER
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des amis connectés */}
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
                <div
                  key={f.friendshipId}
                  onClick={() => setAmiSelectionne(f)}
                  className="bg-card/40 border border-white/5 p-5 rounded-[28px] flex items-center gap-5 active:scale-[0.98] transition-all hover:bg-card/60 hover:border-gold/20 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-full bg-night border border-white/5 flex items-center justify-center text-gold font-serif text-2xl shadow-inner">
                    {ami?.nom?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-cream font-bold tracking-wide">{ami?.nom}</p>
                    <p className="text-[9px] text-muted uppercase tracking-[0.1em]">{ami?.signe_solaire}</p>
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
    </div>
  );
};

export default Compatibilite;