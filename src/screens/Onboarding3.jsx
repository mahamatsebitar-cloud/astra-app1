// src/screens/Onboarding3.jsx
import React, { useState } from 'react';
import Button from "../components/ui/Button";
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../lib/supabase';

const Onboarding3 = ({ onFinish }) => {
  const { user } = useAuthContext();
  const { saveProfile, isLoading, mutateProfile } = useProfile(user?.id); // Ajout de mutateProfile si dispo
  
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

    const finalUserId = currentUser?.id || localStorage.getItem('astra_pending_userId');

    if (!finalUserId) {
      alert("Session introuvable. Veuillez vous reconnecter.");
      return;
    }

    if (!selectedCity) {
      alert("Veuillez sélectionner votre ville.");
      return;
    }

    const birthDate = localStorage.getItem('onboarding_date');
    const birthTime = localStorage.getItem('onboarding_time');

    const lat = parseFloat(selectedCity.coords.split(',')[0]);
    const profileData = {
      date_naissance: birthDate || '1995-05-15',
      heure_naissance: birthTime || '12:00',
      lieu_naissance: selectedCity.city,
      latitude: lat,
      signe_solaire: "Lion",
      onboarding_completed: true // On marque aussi l'étape comme finie
    };

    try {
      // 1. Sauvegarde dans Supabase
      const success = await saveProfile(profileData);
      
      if (success) {
        // 2. Nettoyage
        localStorage.removeItem('astra_pending_userId');
        localStorage.removeItem('onboarding_date');
        localStorage.removeItem('onboarding_time');

        // 3. LE FIX : On attend 500ms pour laisser le temps à Supabase et au Hook 
        // de synchroniser l'état local du profil avant de changer d'écran.
        setTimeout(() => {
          onFinish(); 
        }, 500);

      } else {
        alert("Erreur lors de la sauvegarde. Vérifiez vos politiques RLS sur Supabase.");
      }
    } catch (err) {
      alert("Erreur système : " + err.message);
    }
  };

  // ... (Reste du rendu JSX identique)
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 justify-center mb-8">
        <div className="w-2 h-1 rounded bg-white/10" />
        <div className="w-2 h-1 rounded bg-white/10" />
        <div className="w-8 h-1 rounded bg-gold" />
      </div>

      <h1 className="font-serif text-cream text-2xl leading-tight mb-2 text-center">
        Où avez-vous<br/>vu le jour ?
      </h1>
      
      <div className="w-full relative px-4">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedCity(null);
          }}
          placeholder="Ville de naissance..."
          className="bg-[#141731] border border-gold/10 text-cream p-4 rounded-2xl w-full text-sm outline-none focus:border-gold/40 transition-all"
        />

        {query.length > 0 && !selectedCity && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1228] border border-gold/10 rounded-2xl overflow-hidden z-20 shadow-2xl mx-4">
            {suggestions.map((item) => (
              <div
                key={item.city}
                onClick={() => handleSelect(item)}
                className="flex flex-col p-4 cursor-pointer hover:bg-gold/10 border-b border-white/5 last:border-0"
              >
                <span className="text-cream text-sm font-medium">{item.city}</span>
                <span className="text-muted text-[10px] uppercase">{item.region}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full mt-10 px-4">
        <Button
          onClick={handleFinalize}
          disabled={!selectedCity || isLoading}
          className={!selectedCity ? "opacity-30 grayscale" : "animate-glow"}
        >
          {isLoading ? "Lecture céleste..." : "Révéler mon thème ✦"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding3;