// src/services/authService.js
import { supabase } from '../lib/supabase';
import { getSigneSolaire, getSigneLunaire, getAscendant } from './astroService';

const SUPABASE_URL = supabase.supabaseUrl;

/**
 * Inscrit un utilisateur avec ses données natales complètes
 */
export async function signUp(email, password, userData) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { nom: userData.nom } 
      }
    });

    if (error) return { data: null, error: error.message };

    const userId = data.user?.id;
    
    if (userId) {
      const signeSolaire = userData.date_naissance 
        ? getSigneSolaire(userData.date_naissance) : null;
      const signeLunaire = userData.date_naissance 
        ? getSigneLunaire(userData.date_naissance) : null;
      const ascendant = userData.heure_naissance 
        ? getAscendant(userData.heure_naissance) : null;

      const { error: profileError } = await supabase.from('profiles').upsert({ 
        id: userId, 
        nom: userData.nom,
        email: email,
        date_naissance: userData.date_naissance,
        heure_naissance: userData.heure_naissance,
        lieu_naissance: userData.lieu_naissance,
        signe_solaire: signeSolaire,
        signe_lunaire: signeLunaire,
        ascendant: ascendant,
        updated_at: new Date()
      });

      if (profileError) console.error("Erreur Profil:", profileError);
    }

    return { data: { ...data, userId }, error: null };
  } catch (err) {
    return { data: null, error: err.message || "Erreur d'inscription" };
  }
}

/**
 * Connexion
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message || "Identifiants incorrects" };
  }
}

/**
 * Déconnexion
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message || "Erreur de déconnexion" };
  }
}

/**
 * Suppression complète du compte (RGPD) via Edge Function
 */
export async function deleteAccount(userId) {
  try {
    // 1. Récupérer le token JWT de la session active
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      throw new Error('Session invalide. Veuillez vous reconnecter.');
    }

    // 2. Appeler la Edge Function avec le JWT de l'utilisateur
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/delete-user`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // ← Token JWT de session
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      }
    );

    // 3. Gérer la réponse (même si vide ou erreur)
    const text = await response.text();
    const result = text ? JSON.parse(text) : { success: true };

    if (!response.ok) {
      throw new Error(result.message || result.error || 'Erreur lors de la suppression');
    }

    // 4. Déconnexion locale
    await supabase.auth.signOut();

    // 5. Nettoyage local
    localStorage.removeItem('astra_pending_userId');
    localStorage.removeItem('astra_invite_token');
    localStorage.removeItem('astra_onboarding_data');

    return { error: null };
  } catch (err) {
    console.error("Erreur suppression compte:", err);
    return { error: err.message || "Erreur lors de la suppression" };
  }
}