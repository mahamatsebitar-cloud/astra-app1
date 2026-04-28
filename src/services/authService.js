// src/services/authService.js
import { supabase } from '../lib/supabase';

/**
 * Inscrit un nouvel utilisateur et crée son profil public associé.
 * L'email est désormais stocké dans la table 'profiles' pour permettre la recherche d'amis.
 */
export async function signUp(email, password, nom) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { nom } 
      }
    });

    if (error) return { data: null, error: error.message };

    const userId = data.user?.id;
    
    if (userId) {
      // Création du profil initial avec l'email pour la recherche sociale
      const { error: profileError } = await supabase.from('profiles').upsert({ 
        id: userId, 
        nom: nom,
        email: email // Ajout de l'email pour le service de compatibilité/amis
      });

      if (profileError) {
        console.error("Erreur lors de la création du profil:", profileError);
        // On ne bloque pas forcément l'auth si le profil échoue, 
        // mais il est bon de le logger pour le debug.
      }
    }

    return { data: { ...data, userId }, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

/**
 * Connecte un utilisateur existant
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
 * Déconnexion de la session actuelle
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