import React, { useState } from 'react';
import { signUp, signIn } from '../services/authService';
import { translateError } from '../lib/errorMessages';
import Button from '../components/ui/Button';
import ErrorToast from '../components/ui/ErrorToast';

const Login = ({ onSuccess, mode }) => {
  const [isRegister, setIsRegister] = useState(mode === 'inscription');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      
      {/* Toast d'erreur animé */}
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
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-cream outline-none focus:border-gold/30 transition-all"
          required
        />

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