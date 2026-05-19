// src/services/authService.js
import { supabase } from '../lib/supabase';
import { getSigneSolaire, getSigneLunaire, getAscendant } from './astroService';

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
 * Suppression du compte (Conformité Google Play & RGPD)
 */
export async function deleteAccount(userId) {
  try {
    const { error: dbError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (dbError) throw dbError;
    await supabase.auth.signOut();
    
    return { error: null };
  } catch (err) {
    console.error("Erreur suppression compte:", err);
    return { error: err.message || "Erreur lors de la suppression" };
  }
}