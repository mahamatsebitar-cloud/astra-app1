import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext'; // Vérifie bien si c'est 'context' ou 'contexts'
import { signIn, signUp, signOut } from '../services/authService';

export function useAuth() {
  const { user, loading } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function login(email, password) {
    setError(null);
    setIsLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        // Si c'est un objet erreur de Supabase, on prend le message
        setError(signInError.message || 'Identifiants invalides');
        return false;
      }

      return true;
    } catch (err) {
      setError('Une erreur réseau est survenue');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function register(email, password, nom) {
    setError(null);
    setIsLoading(true);

    try {
      const { error: signUpError } = await signUp(email, password, nom);

      if (signUpError) {
        setError(signUpError.message || "Erreur lors de l'inscription");
        return false;
      }

      return true;
    } catch (err) {
      setError('Impossible de créer le compte');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setError(null);
    setIsLoading(true);

    try {
      const { error: signOutError } = await signOut();

      if (signOutError) {
        setError(signOutError.message || 'Erreur de déconnexion');
        return false;
      }

      return true;
    } catch (err) {
      setError('Erreur lors de la déconnexion');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    error,
    isLoading,
  };
}