import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ÉTAPE 1 — Lire la session locale immédiatement (sans réseau)
    try {
      const localSession = localStorage.getItem('sb-nygqrchwrhvgkhjjapue-auth-token');
      if (localSession) {
        const parsed = JSON.parse(localSession);
        const sessionUser = parsed?.user || parsed?.session?.user;
        if (sessionUser) {
          setUser(sessionUser);
          setLoading(false);
          console.log('✅ Session locale trouvée:', sessionUser.id);
        }
      }
    } catch (e) {
      console.warn('Lecture session locale échouée:', e);
    }

    const safetyTimer = setTimeout(() => {
      console.warn('Auth timeout — affichage forcé');
      setLoading(false);
    }, 8000);

    // ÉTAPE 2 — Vérifier avec le serveur en arrière-plan
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Ne pas écraser avec null si hors connexion
      if (session?.user) {
        setUser(session.user);
      } else if (!navigator.onLine) {
        // Hors connexion → garder la session locale
        console.warn('Hors connexion — session locale conservée');
      } else {
        // En ligne mais pas de session → déconnecté
        setUser(null);
      }
      setLoading(false);
      clearTimeout(safetyTimer);
    }).catch(() => {
      console.warn('getSession échoué — session locale conservée');
      setLoading(false);
      clearTimeout(safetyTimer);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' && !navigator.onLine) return;
        setUser(session?.user ?? null);
        setLoading(false);
        clearTimeout(safetyTimer);
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