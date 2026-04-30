// src/services/authService.js
import { supabase } from '../lib/supabase';

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
      // On enregistre TOUTES les données collectées dans le formulaire
      const { error: profileError } = await supabase.from('profiles').upsert({ 
        id: userId, 
        nom: userData.nom,
        email: email,
        date_naissance: userData.date_naissance,
        heure_naissance: userData.heure_naissance,
        lieu_naissance: userData.lieu_naissance,
        updated_at: new Date()
      });

      if (profileError) console.error("Erreur Profil:", profileError);
    }

    return { data: { ...data, userId }, error: null };
  } catch (err) {
    return { data: null, error: err.message };
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
    return { data: null, error: error.message };
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
    return { error: error.message };
  }
}

/**
 * Suppression du compte (Conformité Google Play & RGPD)
 */
export async function deleteAccount(userId) {
  try {
    // 1. Nettoyage des données métier
    // Note: Si tu as configuré des "Foreign Key" avec "ON DELETE CASCADE" dans Supabase, 
    // supprimer le profil supprimera automatiquement les amitiés et compatibilités.
    const { error: dbError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (dbError) throw dbError;

    // 2. Déconnexion immédiate
    await supabase.auth.signOut();
    
    // Note pour le futur : Pour supprimer l'entrée dans auth.users, 
    // il faudra utiliser une Supabase Edge Function car le client n'a pas les droits 'admin'.
    
    return { error: null };
  } catch (err) {
    console.error("Erreur suppression compte:", err);
    return { error: err.message };
  }
}