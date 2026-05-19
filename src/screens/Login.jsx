import React, { useState } from 'react';
import { signUp, signIn } from '../services/authService';
import { translateError } from '../lib/errorMessages';
import Button from '../components/ui/Button';
import ErrorToast from '../components/ui/ErrorToast';

// ─── ICÔNE ŒIL OUVERT ───
const EyeOpenIcon = ({ size = 20, color = "#C9A460" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ─── ICÔNE ŒIL FERMÉ ───
const EyeClosedIcon = ({ size = 20, color = "#C9A460" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Login = ({ onSuccess, mode }) => {
  const [isRegister, setIsRegister] = useState(mode === 'inscription');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nom, setNom] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isRegister) {
      const { data, error: err } = await signUp(email, password, {
        nom: nom,
        date_naissance: null,
        heure_naissance: null,
        lieu_naissance: null
      });
      if (err) {
        setError(translateError(err));
      } else {
        if (data?.userId) {
          localStorage.setItem('astra_pending_userId', data.userId);
        }
        onSuccess();
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(translateError(err));
      } else {
        onSuccess();
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col justify-center px-8 pb-12 bg-night relative">
      
      {/* Toast d'erreur */}
      <ErrorToast 
        message={error} 
        onClose={() => setError(null)} 
      />

      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl text-gold mb-2">Astra</h2>
        <p className="text-muted text-xs tracking-widest uppercase">
          {isRegister ? "Créez votre carte céleste" : "Retrouvez vos étoiles"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <input
            type="text"
            placeholder="Votre Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-cream outline-none focus:border-gold/30 transition-all"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-cream outline-none focus:border-gold/30 transition-all"
          required
        />
        
        {/* ─── CHAMP MOT DE PASSE AVEC ŒIL ─── */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 pr-14 rounded-2xl text-cream outline-none focus:border-gold/30 transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50 hover:text-gold transition-colors active:scale-90"
          >
            {showPassword ? <EyeOpenIcon size={20} /> : <EyeClosedIcon size={20} />}
          </button>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Consultation des astres..." : isRegister ? "S'inscrire" : "Se connecter"}
        </Button>
      </form>

      <button
        onClick={() => { setIsRegister(!isRegister); setError(null); }}
        className="mt-6 text-muted text-[10px] uppercase tracking-widest hover:text-gold transition-colors"
      >
        {isRegister ? "Déjà un compte ? Se connecter" : "Nouveau voyageur ? S'inscrire"}
      </button>
    </div>
  );
};

export default Login;