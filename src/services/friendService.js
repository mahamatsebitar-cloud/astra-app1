// src/services/friendService.js
import { supabase } from '../lib/supabase';

/**
 * Cherche un utilisateur par email (insensible à la casse)
 * Retourne le profil si trouvé, sinon null.
 */
export const searchUserByEmail = async (email) => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nom, signe_solaire, email')
      .ilike('email', cleanEmail)
      .maybeSingle(); // Retourne null proprement si aucun utilisateur n'est trouvé

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur recherche email:", error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Envoie une demande d'amitié
 */
export const sendFriendRequest = async (senderId, receiverId) => {
  try {
    if (senderId === receiverId) {
      throw new Error("Vous ne pouvez pas vous ajouter vous-même.");
    }

    const { data, error } = await supabase
      .from('friendships')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'pending'
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur envoi demande:", error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Accepte une demande d'amitié (Seul le destinataire peut le faire)
 */
export const acceptFriendRequest = async (friendshipId) => {
  try {
    const { data, error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur acceptation demande:", error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Récupère la liste des amis acceptés avec leurs infos de profil
 */
export const getFriends = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id, status, sender_id, receiver_id,
        sender:profiles!sender_id(id, nom, signe_solaire),
        receiver:profiles!receiver_id(id, nom, signe_solaire)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) throw error;

    // On transforme les données pour n'extraire que le profil de l'ami (pas le nôtre)
    const friends = data?.map(f => ({
      friendshipId: f.id,
      ami: f.sender_id === userId ? f.receiver : f.sender
    })).filter(f => f.ami !== null); // Sécurité au cas où un profil serait supprimé

    return { data: friends, error: null };
  } catch (error) {
    console.error("Erreur récupération amis:", error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Récupère les demandes d'amitié reçues et en attente
 */
export const getPendingRequests = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id, created_at,
        sender:profiles!sender_id(id, nom, signe_solaire, email)
      `)
      .eq('receiver_id', userId)
      .eq('status', 'pending');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur demandes en attente:", error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Supprime une amitié ou refuse une demande
 */
export const removeFriend = async (friendshipId) => {
  try {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Erreur suppression amitié:", error.message);
    return { error: error.message };
  }
};