// src/screens/Compatibilite.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import { useFriends } from '../hooks/useFriends';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';

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

const Compatibilite = () => {
  const { user } = useAuthContext();
  const { profile } = useProfile(user?.id);
  const {
    friends,
    pendingRequests,
    loading,
    error: friendsError,
    searchUser,
    searchResults,
    addFriend,
    acceptRequest,
    getCompatibilityWith
  } = useFriends();

  const [amiSelectionne, setAmiSelectionne] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [compatibilite, setCompatibilite] = useState(null);
  const [animBars, setAnimBars] = useState(false);
  const [invitationStatus, setInvitationStatus] = useState(null);

  useEffect(() => {
    if (amiSelectionne && profile) {
      const target = amiSelectionne.ami || amiSelectionne;
      const compat = getCompatibilityWith(target);
      setCompatibilite(compat);
      setAnimBars(false);
      const timer = setTimeout(() => setAnimBars(true), 150);
      return () => clearTimeout(timer);
    }
  }, [amiSelectionne, profile, getCompatibilityWith]);

  const handleSearch = useCallback(async () => {
    setInvitationStatus(null);
    if (searchEmail.trim()) {
      try {
        await searchUser(searchEmail.trim());
      } catch (err) {
        console.error("❌ Erreur recherche :", err);
      }
    }
  }, [searchEmail, searchUser]);

  const handleAddFriend = async (targetId) => {
    try {
      const { error } = await addFriend(targetId);
      if (error) {
        if (error.includes('unique constraint') || error.includes('409')) {
          setInvitationStatus('duplicate');
        } else {
          alert("Erreur lors de l'envoi.");
        }
      } else {
        setInvitationStatus('success');
        setTimeout(() => setShowSearch(false), 2000);
      }
    } catch (err) {
      setInvitationStatus('duplicate');
    }
  };

  const handleSelectAmi = useCallback((amiData) => {
    setAmiSelectionne(amiData);
  }, []);

  // --- VUE DÉTAILLÉE ---
  if (amiSelectionne && compatibilite) {
    const ami = amiSelectionne.ami || amiSelectionne;
    const scorePrincipal = compatibilite.global;
    const rayon = 23;
    const circonference = 2 * Math.PI * rayon;
    const dashOffset = circonference - (scorePrincipal / 100) * circonference;

    const detailsAffinites = [
      { label: 'Amour', score: compatibilite.amour, couleur: '#C17B8A' },
      { label: 'Communication', score: compatibilite.communication, couleur: '#7B9ECB' },
      { label: 'Valeurs', score: compatibilite.valeurs, couleur: '#C9A460' },
      { label: 'Complicité', score: compatibilite.complicite, couleur: '#E05C5C' },
      { label: 'Durabilité', score: compatibilite.durabilite, couleur: '#5CAE8A' }
    ];

    return (
      <div className="w-full bg-night min-h-screen space-y-6 pb-10 animate-in fade-in duration-500 px-4">
        <button
          onClick={() => setAmiSelectionne(null)}
          className="text-muted text-sm font-sans flex items-center gap-2 py-4 active:opacity-50 transition-opacity"
        >
          <span className="text-lg">←</span> Retour
        </button>

        <div className="space-y-1">
          <p className="text-[10px] text-gold tracking-[0.2em] uppercase font-sans font-bold">Résonances Célestes</p>
          <h3 className="text-xl font-serif text-cream">{ami.nom?.split(' ')[0]} & Toi</h3>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="text-5xl mb-2">{ZODIAC_SYMBOLS[profile?.signe_solaire] || "✨"}</div>
              <p className="text-gold text-[10px] uppercase tracking-widest font-bold">Toi</p>
            </div>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 58 58" className="transform -rotate-90 w-full h-full">
                <circle cx="29" cy="29" r={rayon} fill="none" stroke="#1C2040" strokeWidth="3" />
                <circle cx="29" cy="29" r={rayon} fill="none" stroke="#C9A460" strokeWidth="3" strokeLinecap="round" strokeDasharray={circonference} strokeDashoffset={animBars ? dashOffset : circonference} className="transition-all duration-[1500ms] ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-serif text-xl text-gold leading-none">{scorePrincipal}%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">{ZODIAC_SYMBOLS[ami.signe_solaire] || "✨"}</div>
              <p className="text-gold text-[10px] uppercase tracking-widest font-bold">{ami.nom?.split(' ')[0]}</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#1C2040] to-transparent" />
          <p className="italic text-cream/80 text-sm leading-relaxed font-serif text-center px-4">« {compatibilite.citation} »</p>
          <p className="text-muted text-[10px] italic text-center mt-2">
            Un score n'est jamais une sentence. C'est une invitation à regarder où vous vous rencontrez vraiment.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] text-muted tracking-widest uppercase font-bold">Détails de l'alliance</p>
          <div className="bg-card/50 border border-border/50 rounded-3xl p-6 space-y-5">
            {detailsAffinites.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-cream text-xs font-medium">{item.label}</span>
                  <span className="text-gold text-xs font-serif">{item.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-night rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-[1200ms] ease-out" style={{ width: animBars ? `${item.score}%` : '0%', backgroundColor: item.couleur, boxShadow: `0 0 10px ${item.couleur}44` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-night min-h-screen space-y-8 pb-10 px-4">
      <div className="flex justify-between items-end pt-6">
        <div className="space-y-1">
          <p className="text-[10px] text-gold tracking-[0.3em] uppercase font-bold">Astra Connect</p>
          <h3 className="text-2xl font-serif text-cream">Vos Alliances</h3>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${showSearch ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-gold/10 text-gold border border-gold/20'}`}
        >
          <span className="text-2xl">{showSearch ? '×' : '+'}</span>
        </button>
      </div>

      {/* RECHERCHE D'AMIS */}
      {showSearch && (
        <div className="space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex gap-2">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Email de votre ami..."
              className="flex-1 bg-card border border-border rounded-2xl px-5 py-4 text-cream text-sm focus:border-gold/50 outline-none transition-all"
            />
            <button onClick={handleSearch} className="bg-gold text-night font-serif font-bold rounded-2xl px-6 active:scale-95 transition-transform" disabled={loading}>
              {loading ? '...' : 'Explorer'}
            </button>
          </div>
          
          {searchResults && searchResults.id && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <Card 
                onClick={() => handleAddFriend(searchResults.id)} 
                className={`flex items-center gap-4 p-4 border-gold/30 cursor-pointer transition-all ${invitationStatus === 'success' ? 'bg-green-500/10 border-green-500/50' : 'hover:bg-gold/5'}`}
              >
                 <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xl font-serif">
                  {searchResults.nom?.charAt(0) || "?"}
                </div>
                <div className="flex-1">
                  <p className="text-cream font-medium">{searchResults.nom}</p>
                  <p className="text-muted text-[10px] uppercase">{searchResults.signe_solaire}</p>
                  {invitationStatus === 'duplicate' && <p className="text-red-400 text-[10px] mt-1 font-bold">Déjà invité ! ✨</p>}
                  {invitationStatus === 'success' && <p className="text-green-400 text-[10px] mt-1 font-bold">Demande envoyée !</p>}
                </div>
                <div className={`px-3 py-1 rounded-full border ${invitationStatus === 'success' ? 'bg-green-500 text-white border-green-500' : 'bg-gold/10 text-gold border-gold/20'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {invitationStatus === 'success' ? 'Prêt' : invitationStatus === 'duplicate' ? 'Attente' : '+ Inviter'}
                  </span>
                </div>
              </Card>
            </div>
          )}
          {!loading && searchEmail && searchResults === null && (
            <p className="text-center text-xs text-muted italic">Aucun profil trouvé.</p>
          )}
        </div>
      )}

      {/* DEMANDES EN ATTENTE */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-700">
          <p className="text-[10px] text-gold tracking-widest uppercase font-bold">Invitations reçues</p>
          <div className="grid gap-3">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-card/40 border border-gold/20 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/5 flex items-center justify-center text-gold font-serif border border-gold/10">
                    {req.sender?.nom?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-cream text-sm font-medium">{req.sender?.nom}</p>
                    <p className="text-[9px] text-muted uppercase">{req.sender?.signe_solaire}</p>
                  </div>
                </div>
                <button 
                  onClick={() => acceptRequest(req.id)}
                  className="bg-gold text-night text-[10px] font-bold px-4 py-2 rounded-xl active:scale-90 transition-transform"
                >
                  ACCEPTER
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LISTE D'AMIS */}
      <div className="space-y-4">
        <p className="text-[10px] text-muted tracking-widest uppercase font-bold">Tes connexions</p>
        {friends.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-3xl opacity-50">
            <p className="text-muted font-serif italic text-sm">« Le ciel est vaste, ne le traversez pas seul. »</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {friends.map((friendship) => {
              const ami = friendship.ami;
              if (!ami) return null;
              const comp = getCompatibilityWith(ami);
              return (
                <div
                  key={friendship.friendshipId}
                  onClick={() => handleSelectAmi(friendship)}
                  className="bg-card border border-border p-4 rounded-2xl flex items-center gap-4 active:scale-95 transition-all cursor-pointer hover:border-gold/30"
                >
                  <div className="w-12 h-12 rounded-full bg-[#141731] border border-border flex items-center justify-center text-gold font-serif text-xl">
                    {ami.nom?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-cream font-medium">{ami.nom}</p>
                    <p className="text-muted text-[10px] uppercase tracking-tighter">{ami.signe_solaire}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-serif" style={{ color: getScoreColor(comp.global) }}>{comp.global}%</p>
                    <p className="text-[8px] text-muted uppercase tracking-widest">Affinité</p>
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