// src/screens/EditProfil.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext';
import { useProfileContext } from '../context/ProfileContext';
import { getSigneSolaire, getSigneLunaire, getAscendant } from '../services/astroService';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function EditProfil({ onBack }) {
  const { user } = useAuthContext();
  const { profile, updateProfile } = useProfileContext();

  // ─── DONNÉES DU FORMULAIRE ───
  // PAS de champ nom — le prénom reste celui de l'inscription
  const [username, setUsername] = useState('');
  
  // Date (décomposée comme l'onboarding)
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  
  // Heure (décomposée comme l'onboarding)
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [heureInconnue, setHeureInconnue] = useState(false);
  
  // Ville (avec autocomplete Nominatim comme Onboarding3)
  const [villeQuery, setVilleQuery] = useState('');
  const [villeSuggestions, setVilleSuggestions] = useState([]);
  const [villeLoading, setVilleLoading] = useState(false);
  const [villeSelectionnee, setVilleSelectionnee] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // États UI
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  // ─── OPTIONS DES SELECTS ───
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const years = Array.from({ length: 80 }, (_, i) => 2026 - i);
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  // ─── PRÉ-REMPLISSAGE ───
  useEffect(() => {
    if (profile) {
      // Plus de setNom — le prénom n'est pas modifiable ici
      setUsername(profile.username || '');
      
      // Décompose la date YYYY-MM-DD
      if (profile.date_naissance) {
        const [y, m, d] = profile.date_naissance.split('-');
        setYear(y);
        setMonth(months[parseInt(m) - 1]);
        setDay(parseInt(d).toString());
      }
      
      // Décompose l'heure HH:MM
      if (profile.heure_naissance) {
        const [h, min] = profile.heure_naissance.split(':');
        setHour(h);
        setMinute(min);
      }
      
      // Ville
      if (profile.lieu_naissance) {
        setVilleQuery(profile.lieu_naissance);
        if (profile.latitude && profile.longitude) {
          setVilleSelectionnee({
            label: profile.lieu_naissance,
            lat: profile.latitude,
            lng: profile.longitude
          });
        }
      }
    }
  }, [profile]);

  // ─── RECHERCHE VILLE NOMINATIM (copié de Onboarding3) ───
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

  // ─── VÉRIFICATION USERNAME ───
  useEffect(() => {
    if (!username || username === profile?.username) {
      setUsernameStatus(null);
      return;
    }
    const timer = setTimeout(async () => {
      setUsernameStatus('checking');
      const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .ilike('username', clean)
        .neq('id', user.id)
        .maybeSingle();
      setUsernameStatus(data ? 'taken' : 'available');
    }, 500);
    return () => clearTimeout(timer);
  }, [username, profile?.username, user.id]);

  const handleUsernameChange = (e) => {
    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(clean);
  };

  // ─── SKIP HEURE ───
  const handleSkipHeure = () => {
    setHeureInconnue(true);
    setHour('12');
    setMinute('00');
  };

  // ─── CONSTRUCTION DE LA DATE ISO ───
  const dateISO = useMemo(() => {
    if (!day || !month || !year) return '';
    const monthIndex = months.indexOf(month) + 1;
    return `${year}-${String(monthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }, [day, month, year]);

  const heureStr = useMemo(() => {
    if (heureInconnue) return '12:00';
    return `${hour}:${minute}`;
  }, [hour, minute, heureInconnue]);

  // ─── PRÉVIEW ASTRAL (avec vraies coordonnées) ───
  const previewSigne = useMemo(() => {
    if (!dateISO) return null;
    return getSigneSolaire(dateISO, heureStr);
  }, [dateISO, heureStr]);

  const previewLune = useMemo(() => {
    if (!dateISO) return null;
    return getSigneLunaire(dateISO, heureStr);
  }, [dateISO, heureStr]);

  const previewAsc = useMemo(() => {
    if (!dateISO || !heureStr) return null;
    const lat = villeSelectionnee?.lat || profile?.latitude || 48.8566;
    const lng = villeSelectionnee?.lng || profile?.longitude || 2.3522;
    return getAscendant(heureStr, lat, lng, dateISO);
  }, [dateISO, heureStr, villeSelectionnee, profile]);

  // ─── SAUVEGARDE ───
  const handleSave = async () => {
    if (!user?.id) {
      setError("Session introuvable. Veuillez vous reconnecter.");
      return;
    }

    if (!dateISO) {
      setError("La date de naissance est indispensable.");
      return;
    }

    if (usernameStatus === 'taken') {
      setError("Ce nom d'utilisateur est déjà pris. Choisis-en un autre.");
      return;
    }

    // Ville fallback
    const finalVille = villeSelectionnee || {
      label: profile?.lieu_naissance || 'Paris, France',
      lat: profile?.latitude || 48.8566,
      lng: profile?.longitude || 2.3522
    };

    setIsSaving(true);
    setError(null);

    try {
      const cleanTime = heureInconnue ? '12:00' : heureStr;
      
      const signeSolaire = getSigneSolaire(dateISO, cleanTime);
      const signeLunaire = getSigneLunaire(dateISO, cleanTime);
      const ascendant = getAscendant(cleanTime, finalVille.lat, finalVille.lng, dateISO);

      // ─── PAYLOAD : PAS DE NOM ! ───
      // Le nom reste celui de l'inscription, on ne le touche pas
      const profileData = {
        // PAS de "nom" ici — on ne modifie pas le prénom
        username: username || profile?.username || '',
        date_naissance: dateISO,
        heure_naissance: cleanTime,
        lieu_naissance: finalVille.label,
        latitude: finalVille.lat,
        longitude: finalVille.lng,
        signe_solaire: signeSolaire,
        signe_lunaire: signeLunaire,
        ascendant
      };

      const { error: updateError } = await updateProfile(profileData);

      if (updateError) throw new Error(updateError);

      setSuccess(true);
      setTimeout(() => onBack(), 1500);

    } catch (err) {
      console.error('Erreur lors de la mise à jour :', err);
      setError('Erreur cosmique : ' + (err.message || 'Connexion perdue'));
    } finally {
      setIsSaving(false);
    }
  };

  // ─── RENDER ───
  return (
    <div className="w-full max-w-[400px] mx-auto px-5 py-6 space-y-6 select-none animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center px-1 mb-4">
        <button onClick={onBack} className="bg-transparent border-none text-muted/80 cursor-pointer text-sm font-serif hover:text-gold transition-all active:scale-95">
          ← Retour
        </button>
        <h1 className="text-cream font-serif text-base tracking-wide">Alchimie du Profil</h1>
        <div className="w-12" /> 
      </div>

      {/* ─── SECTION IDENTITÉ (USERNAME UNIQUEMENT) ─── */}
      <div className="space-y-3">
        <label className="text-[10px] text-muted/60 tracking-[3px] uppercase px-1 font-bold">Identité</label>
        <Card className="border-white/5 bg-white/[0.02] p-4">
          <div className="space-y-1">
            <label className="text-gold/50 text-[9px] uppercase tracking-widest ml-1">Nom d'utilisateur</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40 text-sm">@</span>
              <input
                value={username}
                onChange={handleUsernameChange}
                className={`w-full bg-[#141731]/80 border text-cream text-sm p-4 pl-8 rounded-2xl outline-none transition-all ${
                  usernameStatus === 'available' ? 'border-green-500/50 focus:border-green-400' :
                  usernameStatus === 'taken' ? 'border-red-500/50 focus:border-red-400' :
                  'border-white/5 focus:border-gold/30'
                } focus:bg-[#141731]`}
                placeholder={profile?.nom ? profile.nom.toLowerCase().replace(/[^a-z0-9]/g, '') : 'pseudonyme'}
              />
            </div>
            {usernameStatus === 'available' && (
              <p className="text-green-400/60 text-[9px] ml-1 mt-1">✓ Disponible</p>
            )}
            {usernameStatus === 'taken' && (
              <p className="text-red-400/60 text-[9px] ml-1 mt-1">✗ Déjà pris</p>
            )}
            {usernameStatus === 'checking' && (
              <p className="text-muted/40 text-[9px] ml-1 mt-1">Vérification...</p>
            )}
            <p className="text-muted/30 text-[8px] ml-1 mt-0.5">Lettres minuscules, chiffres et underscores uniquement</p>
          </div>
        </Card>
      </div>

      {/* ─── SECTION DONNÉES NATALES ─── */}
      <div className="space-y-3">
        <label className="text-[10px] text-muted/60 tracking-[3px] uppercase px-1 font-bold">Données natales</label>
        
        {/* Date de naissance (même style que Onboarding1) */}
        <Card className="border-white/5 bg-white/[0.02] p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-gold/50 text-[9px] uppercase tracking-widest ml-1">Date de naissance</label>
            <div className="flex gap-2 w-full">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="bg-[#141731]/80 border border-white/5 text-cream text-[13px] p-3 rounded-xl flex-1 outline-none focus:border-gold/30 transition-colors appearance-none text-center"
              >
                <option value="">Jour</option>
                {days.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-[#141731]/80 border border-white/5 text-cream text-[13px] p-3 rounded-xl flex-1 outline-none focus:border-gold/30 transition-colors appearance-none text-center"
              >
                <option value="">Mois</option>
                {months.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-[#141731]/80 border border-white/5 text-cream text-[13px] p-3 rounded-xl flex-1 outline-none focus:border-gold/30 transition-colors appearance-none text-center"
              >
                <option value="">Année</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Heure de naissance (même style que Onboarding2) */}
          <div className="space-y-1">
            <label className="text-gold/50 text-[9px] uppercase tracking-widest ml-1">Heure de naissance</label>
            <div className="flex items-center gap-4 justify-center py-2">
              <div className="relative">
                <select
                  value={hour}
                  onChange={(e) => {
                    setHour(e.target.value);
                    setHeureInconnue(false);
                  }}
                  disabled={heureInconnue}
                  className={`appearance-none bg-[#141731]/80 border border-white/5 rounded-2xl px-6 py-4 w-24 text-cream text-base font-serif text-center outline-none focus:border-gold/30 transition-colors ${heureInconnue ? 'opacity-30' : ''}`}
                >
                  {hours.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted uppercase tracking-widest">Heures</span>
              </div>
              <span className={`text-gold text-2xl font-serif mb-2 ${heureInconnue ? 'opacity-30' : ''}`}>:</span>
              <div className="relative">
                <select
                  value={minute}
                  onChange={(e) => {
                    setMinute(e.target.value);
                    setHeureInconnue(false);
                  }}
                  disabled={heureInconnue}
                  className={`appearance-none bg-[#141731]/80 border border-white/5 rounded-2xl px-6 py-4 w-24 text-cream text-base font-serif text-center outline-none focus:border-gold/30 transition-colors ${heureInconnue ? 'opacity-30' : ''}`}
                >
                  {minutes.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted uppercase tracking-widest">Min</span>
              </div>
            </div>
            <button 
              onClick={handleSkipHeure}
              className="mt-8 text-muted text-[10px] uppercase tracking-widest hover:text-gold transition-colors w-full text-center"
            >
              {heureInconnue ? 'Heure approximative (12h00)' : 'Je ne connais pas mon heure'}
            </button>
          </div>
        </Card>

        {/* Lieu de naissance (même style que Onboarding3) */}
        <Card className="border-white/5 bg-white/[0.02] p-4">
          <div className="space-y-1">
            <label className="text-gold/50 text-[9px] uppercase tracking-widest ml-1">Lieu de naissance</label>
            <div className="relative">
              <input
                type="text"
                value={villeQuery}
                onChange={(e) => {
                  setVilleQuery(e.target.value);
                  setVilleSelectionnee(null);
                }}
                placeholder="Ville de naissance..."
                className="bg-[#141731]/80 border border-white/5 text-cream p-4 rounded-2xl w-full text-sm outline-none focus:border-gold/30 transition-all shadow-inner pr-10"
              />
              {villeLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                </div>
              )}
            </div>

            {dropdownOpen && villeSuggestions.length > 0 && (
              <div className="mt-2 bg-[#0E1228] border border-gold/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2">
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
              <div className="mt-2 bg-[#0E1228] border border-gold/10 rounded-2xl py-3 px-4">
                <span className="text-muted text-sm">Aucune ville trouvée</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ─── WARNING ─── */}
      {showWarning && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl"
        >
          <p className="text-amber-400/80 text-[10px] text-center leading-relaxed">
            ⚠️ Modifier ces données recalculera votre thème natal, vos horoscopes personnalisés et vos affinités astrales.
          </p>
        </motion.div>
      )}

      {/* ─── APERÇU ASTRAL ─── */}
      {previewSigne && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="bg-gradient-to-b from-gold/[0.08] to-transparent border-gold/20 shadow-2xl shadow-gold/5 py-5">
            <div className="flex justify-around items-center">
              <div className="text-center group">
                <p className="text-muted/60 text-[8px] uppercase tracking-[2px] mb-1 group-hover:text-gold transition-colors">Soleil</p>
                <p className="text-cream text-sm font-serif">{previewSigne}</p>
              </div>
              <div className="h-6 w-px bg-white/5" />
              <div className="text-center group">
                <p className="text-muted/60 text-[8px] uppercase tracking-[2px] mb-1 group-hover:text-gold transition-colors">Asc</p>
                <p className="text-cream text-sm font-serif">{previewAsc || '--'}</p>
              </div>
              <div className="h-6 w-px bg-white/5" />
              <div className="text-center group">
                <p className="text-muted/60 text-[8px] uppercase tracking-[2px] mb-1 group-hover:text-gold transition-colors">Lune</p>
                <p className="text-cream text-sm font-serif">{previewLune || '--'}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* ─── MESSAGES ─── */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl text-green-400 text-[11px] text-center font-serif italic animate-pulse">
          ✓ Profil synchronisé avec les astres
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-[11px] text-center font-sans">
          {error}
        </div>
      )}

      {/* ─── BOUTON SAUVEGARDE ─── */}
      <Button 
        variant="primary" 
        onClick={() => {
          setShowWarning(true);
          setTimeout(() => handleSave(), 300);
        }} 
        disabled={isSaving || usernameStatus === 'checking' || !day || !month || !year}
        className="w-full py-5 rounded-2xl bg-gold text-night font-bold uppercase tracking-[2px] shadow-[0_10px_20px_rgba(212,175,55,0.15)] active:translate-y-0.5 transition-all disabled:opacity-30 disabled:grayscale"
      >
        {isSaving ? 'Alignement céleste...' : 'Graver les changements ✦'}
      </Button>
    </div>
  );
}