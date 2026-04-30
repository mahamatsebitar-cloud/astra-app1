import React, { useState } from 'react';
import Button from "../components/ui/Button";
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../lib/supabase';
import { getSigneSolaire, getSigneLunaire, getAscendant } from '../services/astroService';

const Onboarding3 = ({ onFinish, dateNaissance, heure }) => {
  const { user } = useAuthContext();
  const { saveProfile, isLoading } = useProfile(user?.id); 
  
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);

  const suggestions = [
    { city: 'Paris', region: 'Île-de-France, France', coords: "48.8566, 2.3522" },
    { city: 'Lyon', region: 'Auvergne-Rhône-Alpes, France', coords: "45.7640, 4.8357" },
    { city: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur, France', coords: "43.2965, 5.3698" },
  ];

  const handleSelect = (city) => {
    setSelectedCity(city);
    setQuery(city.city);
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

    if (!selectedCity) {
      alert("Veuillez sélectionner votre ville.");
      return;
    }

    const lat = parseFloat(selectedCity.coords.split(',')[0]) || 48.8566;
    const signeSolaire = getSigneSolaire(dateNaissance);
    const signeLunaire = getSigneLunaire(dateNaissance);
    const ascendant = getAscendant(heure || '12:00', lat);

    const profileData = {
      nom: user?.user_metadata?.nom || "Voyageur",
      date_naissance: dateNaissance || '1995-01-01',
      heure_naissance: heure || '12:00',
      lieu_naissance: selectedCity.city,
      latitude: lat,
      signe_solaire: signeSolaire,
      signe_lunaire: signeLunaire,
      ascendant: ascendant,
      onboarding_completed: true
    };

    try {
      const success = await saveProfile(profileData);
      
      if (success) {
        onFinish();
      } else {
        alert("Erreur lors de la sauvegarde. Vérifiez votre connexion.");
      }
    } catch (err) {
      console.error("Erreur Onboarding3:", err);
      alert("Erreur système : " + err.message);
    }
  };

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
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedCity(null);
            }}
            placeholder="Ville de naissance..."
            className="bg-[#141731] border border-gold/10 text-cream p-4 rounded-2xl w-full text-sm outline-none focus:border-gold/40 transition-all shadow-inner"
          />

          {query.length > 0 && !selectedCity && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1228] border border-gold/10 rounded-2xl overflow-hidden z-20 shadow-2xl mx-4 animate-in fade-in slide-in-from-top-2">
              {suggestions.map((item) => (
                <div
                  key={item.city}
                  onClick={() => handleSelect(item)}
                  className="flex flex-col p-4 cursor-pointer hover:bg-gold/10 border-b border-white/5 last:border-0"
                >
                  <span className="text-cream text-sm font-medium">{item.city}</span>
                  <span className="text-muted text-[10px] uppercase tracking-widest">{item.region}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full mt-10 px-4 mb-6">
        <Button
          onClick={handleFinalize}
          disabled={!selectedCity || isLoading}
          variant="primary"
          className={`w-full py-5 ${!selectedCity ? "opacity-30 grayscale" : "animate-glow shadow-[0_0_20px_rgba(212,175,55,0.2)]"}`}
        >
          {isLoading ? "Alignement des astres..." : "Révéler mon thème ✦"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding3;