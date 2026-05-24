// src/screens/Onboarding3.jsx
import React, { useState, useEffect } from 'react';
import Button from "../components/ui/Button";
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useProfileContext } from '../context/ProfileContext';
import { saveProfile } from '../services/profileService';
import { supabase } from '../lib/supabase';
import { getSigneSolaire, getSigneLunaire, getAscendant } from '../services/astroService';

const Onboarding3 = ({ onFinish, dateNaissance, heure }) => {
  const { user } = useAuthContext();
  const { profile } = useProfile(user?.id); 
  const { refreshProfile } = useProfileContext();
  const [isLoading, setIsLoading] = useState(false);
  
  // ─── RECHERCHE VILLE NOMINATIM ───
  const [villeQuery, setVilleQuery] = useState('');
  const [villeSuggestions, setVilleSuggestions] = useState([]);
  const [villeLoading, setVilleLoading] = useState(false);
  const [villeSelectionnee, setVilleSelectionnee] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (villeQuery.length < 2) {
      setVilleSuggestions([]);
      setDropdownOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      setVilleLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(villeQuery)}&format=json&addressdetails=1&limit=6&countrycodes=fr&accept-language=fr`,
          { headers: { 'Accept-Language': 'fr' } }
        );
        const data = await res.json();
        const villes = data
          .filter(r => r.class === 'place' || r.class === 'boundary')
          .map(r => ({
            label: r.display_name.split(',').slice(0, 2).join(',').trim(),
            lat: parseFloat(r.lat),
            lng: parseFloat(r.lon)
          }));
        setVilleSuggestions(villes);
        setDropdownOpen(villes.length > 0);
      } catch (e) {
        console.error('Nominatim error:', e);
      } finally {
        setVilleLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [villeQuery]);

  const handleSelectVille = (ville) => {
    setVilleSelectionnee(ville);
    setVilleQuery(ville.label);
    setVilleSuggestions([]);
    setDropdownOpen(false);
  };

  const handleFinalize = async () => {
    let currentUser = user;
    
    if (!currentUser) {
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      currentUser = sbUser;
    }

    const finalUserId = currentUser?.id;

    if (!finalUserId) {
      alert("Session introuvable. Veuillez vous reconnecter.");
      return;
    }

    // Fallback Paris si rien n'est sélectionné
    const finalVille = villeSelectionnee || {
      label: 'Paris, France',
      lat: 48.8566,
      lng: 2.3522
    };

    setIsLoading(true);

    const signeSolaire = getSigneSolaire(dateNaissance, heure || '12:00');
    const signeLunaire = getSigneLunaire(dateNaissance, heure || '12:00');
    const ascendant = getAscendant(heure || '12:00', finalVille.lat, finalVille.lng, dateNaissance);

    const profileData = {
      nom: user?.user_metadata?.nom || "Voyageur",
      date_naissance: dateNaissance || '1995-01-01',
      heure_naissance: heure || '12:00',
      lieu_naissance: finalVille.label,
      latitude: finalVille.lat,
      longitude: finalVille.lng,
      signe_solaire: signeSolaire,
      signe_lunaire: signeLunaire,
      ascendant: ascendant,
      onboarding_completed: true
    };

    try {
      const result = await saveProfile(finalUserId, profileData);
      console.log('saveProfile result:', result);
      
      if (result.error) {
        console.error('saveProfile error:', result.error);
        alert("Erreur lors de la sauvegarde : " + result.error.message);
      } else {
        await refreshProfile();
        
        // 🛡️ Protection contre le bug de re-login (profiles 406 Supabase)
        if (user?.id) {
          localStorage.setItem('astra_ob_done_' + user.id, '1');
        }
        
        onFinish();
      }
    } catch (err) {
      console.error("Erreur Onboarding3:", err);
      alert("Erreur système : " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = villeSelectionnee !== null || villeQuery.length > 0;

  return (
    <div className="flex flex-col items-center min-h-[400px] justify-between">
      <div className="w-full">
        <div className="flex gap-2 justify-center mb-8">
          <div className="w-2 h-1 rounded bg-white/10" />
          <div className="w-2 h-1 rounded bg-white/10" />
          <div className="w-8 h-1 rounded bg-gold" />
        </div>

        <h1 className="font-serif text-cream text-2xl leading-tight mb-2 text-center">
          Où avez-vous<br/>vu le jour ?
        </h1>
        
        <div className="w-full relative px-4 mt-6">
          <div className="relative">
            <input
              type="text"
              value={villeQuery}
              onChange={(e) => {
                setVilleQuery(e.target.value);
                setVilleSelectionnee(null);
              }}
              placeholder="Ville de naissance..."
              className="bg-[#141731] border border-gold/10 text-cream p-4 rounded-2xl w-full text-sm outline-none focus:border-gold/40 transition-all shadow-inner pr-10"
            />
            {villeLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
              </div>
            )}
          </div>

          {dropdownOpen && villeSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1228] border border-gold/10 rounded-2xl overflow-hidden z-20 shadow-2xl mx-4 animate-in fade-in slide-in-from-top-2">
              {villeSuggestions.map((ville, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectVille(ville)}
                  className="py-3 px-4 cursor-pointer hover:bg-[#1a1f3a] border-b border-white/5 last:border-0"
                >
                  <span className="text-cream text-sm font-medium">{ville.label}</span>
                </div>
              ))}
            </div>
          )}

          {villeQuery.length >= 2 && !villeLoading && villeSuggestions.length === 0 && villeSelectionnee === null && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1228] border border-gold/10 rounded-2xl py-3 px-4 mx-4">
              <span className="text-muted text-sm">Aucune ville trouvée</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full mt-10 px-4 mb-6">
        <Button
          onClick={handleFinalize}
          disabled={!canProceed || isLoading}
          variant="primary"
          className={`w-full py-5 ${!canProceed ? "opacity-30 grayscale" : "animate-glow shadow-[0_0_20px_rgba(212,175,55,0.2)]"}`}
        >
          {isLoading ? "Alignement des astres..." : "Révéler mon thème ✦"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding3;