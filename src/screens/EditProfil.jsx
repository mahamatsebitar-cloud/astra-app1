import { useState, useEffect } from 'react';
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
  
  const [nom, setNom] = useState('');
  const [username, setUsername] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [heureNaissance, setHeureNaissance] = useState('');
  const [lieuNaissance, setLieuNaissance] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [usernameStatus, setUsernameStatus] = useState(null); // 'available' | 'taken' | 'checking'

  useEffect(() => {
    if (profile) {
      setNom(profile.nom || '');
      setUsername(profile.username || '');
      setDateNaissance(profile.date_naissance || '');
      const h = (profile.heure_naissance || '').slice(0, 5);
      setHeureNaissance(h);
      setLieuNaissance(profile.lieu_naissance || '');
    }
  }, [profile]);

  // Vérifie si le username est disponible (après 500ms d'inactivité)
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
    // Nettoie : uniquement minuscules, chiffres, underscores
    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(clean);
  };

  const handleSave = async () => {
    if (!nom || !dateNaissance) {
      setError("Le prénom et la date de naissance sont indispensables.");
      return;
    }

    if (usernameStatus === 'taken') {
      setError("Ce nom d'utilisateur est déjà pris. Choisis-en un autre.");
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      const cleanTime = (heureNaissance || '12:00').slice(0, 5);
      const signeSolaire = getSigneSolaire(dateNaissance);
      const signeLunaire = getSigneLunaire(dateNaissance);
      const ascendant = getAscendant(cleanTime, 48.8566);
      
      const profileData = {
        nom,
        username: username || nom.toLowerCase().replace(/[^a-z0-9]/g, ''),
        date_naissance: dateNaissance,
        heure_naissance: cleanTime,
        lieu_naissance: lieuNaissance,
        signe_solaire: signeSolaire,
        signe_lunaire: signeLunaire,
        ascendant
      };
      
      const { error: updateError } = await updateProfile(profileData);
      
      if (updateError) throw updateError;
      
      setSuccess(true);
      const timer = setTimeout(() => onBack(), 1500);
      return () => clearTimeout(timer);
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour :', err);
      setError('Erreur cosmique : ' + (err.message || 'Connexion perdue'));
    } finally {
      setIsSaving(false);
    }
  };

  const previewSigne = dateNaissance ? getSigneSolaire(dateNaissance) : null;
  const previewAsc = (dateNaissance && heureNaissance) ? getAscendant(heureNaissance, 48.8566) : null;
  const previewLune = dateNaissance ? getSigneLunaire(dateNaissance) : null;

  return (
    <div className="w-full max-w-[400px] mx-auto px-5 py-6 space-y-6 select-none animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-center px-1 mb-4">
        <button onClick={onBack} className="bg-transparent border-none text-muted/80 cursor-pointer text-sm font-serif hover:text-gold transition-all active:scale-95">
          ← Retour
        </button>
        <h1 className="text-cream font-serif text-base tracking-wide">Alchimie du Profil</h1>
        <div className="w-12" /> 
      </div>

      {/* SECTION IDENTITÉ */}
      <div className="space-y-3">
        <label className="text-[10px] text-muted/60 tracking-[3px] uppercase px-1 font-bold">Identité</label>
        <Card className="border-white/5 bg-white/[0.02] p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-gold/50 text-[9px] uppercase tracking-widest ml-1">Prénom</label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full bg-[#141731]/80 border border-white/5 text-cream text-sm p-4 rounded-2xl outline-none focus:border-gold/30 focus:bg-[#141731] transition-all"
              placeholder="Ex: Nouren"
            />
          </div>
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
                placeholder={nom ? nom.toLowerCase().replace(/[^a-z0-9]/g, '') : 'pseudonyme'}
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

      {/* SECTION DONNÉES NATALES */}
      <div className="space-y-3">
        <label className="text-[10px] text-muted/60 tracking-[3px] uppercase px-1 font-bold">Données natales</label>
        <Card className="space-y-5 border-white/5 bg-white/[0.02] p-4">
          <div className="space-y-1">
            <label className="text-gold/50 text-[9px] uppercase tracking-widest ml-1">Date de naissance</label>
            <input type="date" value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-[#141731]/80 border border-white/5 text-cream text-sm p-4 rounded-2xl outline-none focus:border-gold/30 appearance-none shadow-inner" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-gold/50 text-[9px] uppercase tracking-widest ml-1">Heure</label>
              <input type="time" value={heureNaissance} onChange={(e) => setHeureNaissance(e.target.value)}
                className="w-full bg-[#141731]/80 border border-white/5 text-cream text-sm p-4 rounded-2xl outline-none focus:border-gold/30 appearance-none" />
            </div>
            <div className="flex-[2] space-y-1">
              <label className="text-gold/50 text-[9px] uppercase tracking-widest ml-1">Lieu</label>
              <input type="text" value={lieuNaissance} onChange={(e) => setLieuNaissance(e.target.value)}
                placeholder="Ville, Pays"
                className="w-full bg-[#141731]/80 border border-white/5 text-cream text-sm p-4 rounded-2xl outline-none focus:border-gold/30 placeholder:text-muted/30" />
            </div>
          </div>
        </Card>
      </div>

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

      <Button variant="primary" onClick={handleSave} disabled={isSaving || usernameStatus === 'checking'}
        className="w-full py-5 rounded-2xl bg-gold text-night font-bold uppercase tracking-[2px] shadow-[0_10px_20px_rgba(212,175,55,0.15)] active:translate-y-0.5 transition-all">
        {isSaving ? 'Alignement céleste...' : 'Graver les changements ✦'}
      </Button>
    </div>
  );
}