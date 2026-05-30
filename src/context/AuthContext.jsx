import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let localUserLoaded = false;

    // ÉTAPE 1 — Session locale immédiate
    try {
      const keys = Object.keys(localStorage).filter(k => 
        k.startsWith('sb-') && k.endsWith('-auth-token')
      );
      if (keys.length > 0) {
        const parsed = JSON.parse(localStorage.getItem(keys[0]));
        const sessionUser = parsed?.user || parsed?.session?.user;
        if (sessionUser?.id) {
          setUser(sessionUser);
          setLoading(false);
          localUserLoaded = true;
          console.log('✅ Session locale:', sessionUser.id);
        }
      }
    } catch (e) {
      console.warn('Session locale échouée:', e);
    }

    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // ÉTAPE 2 — Vérification réseau
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, 'online:', navigator.onLine);
        
        clearTimeout(safetyTimer);

        if (session?.user) {
          // Session valide → toujours mettre à jour
          setUser(session.user);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          // Déconnexion explicite → effacer
          setUser(null);
          setLoading(false);
        } else if (!navigator.onLine && localUserLoaded) {
          // Hors connexion + session locale existante → ne rien changer
          console.warn('Hors connexion — session locale conservée');
          setLoading(false);
        } else if (event === 'INITIAL_SESSION' && !session) {
          // Première session nulle EN LIGNE → pas connecté
          if (navigator.onLine) {
            setUser(null);
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, []);

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };