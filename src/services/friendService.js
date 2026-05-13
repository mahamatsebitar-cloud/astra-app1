// src/services/friendService.js
import { supabase } from '../lib/supabase';
import { notifySocialEvent } from './notificationService';

// ━━━ 1. RECHERCHE (par email OU username) ━━━
export const searchUser = async (query, currentUserId) => {
  try {
    const clean = query.trim().replace(/^@/, '').toLowerCase();

    const { data: byUsername, error: errUser } = await supabase
      .from('profiles')
      .select('id, nom, signe_solaire, signe_lunaire, ascendant, username, share_token, last_seen_at')
      .ilike('username', clean)
      .neq('id', currentUserId)
      .limit(5);

    const { data: byEmail, error: errEmail } = await supabase
      .from('profiles')
      .select('id, nom, signe_solaire, signe_lunaire, ascendant, username, share_token, last_seen_at')
      .ilike('email', clean)
      .neq('id', currentUserId)
      .limit(5);

    const combined = [...(byUsername || []), ...(byEmail || [])];
    const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

    return { data: unique.slice(0, 5), error: null };
  } catch (err) {
    return { data: [], error: err.message };
  }
};

// ━━━ 2. RECHERCHE PAR EMAIL ━━━
export const searchUserByEmail = async (email) => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nom, signe_solaire, email')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Erreur recherche email:", error.message);
    return { data: null, error: error.message };
  }
};

// ━━━ 3. TROUVER PAR SHARE TOKEN ━━━
export const findUserByShareToken = async (token) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nom, signe_solaire, signe_lunaire, ascendant, username, share_token')
      .eq('share_token', token)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

// ━━━ 4. ENVOYER DEMANDE ━━━
export const sendFriendRequest = async (senderId, receiverId) => {
  try {
    if (senderId === receiverId) throw new Error("Vous ne pouvez pas vous ajouter vous-même.");

    const { data: existing } = await supabase
      .from('friendships')
      .select('id, status')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .maybeSingle();

    if (existing) {
      if (existing.status === 'accepted') {
        return { data: null, error: 'Vous êtes déjà amis.' };
      }
      if (existing.status === 'pending') {
        return { data: null, error: 'Demande déjà envoyée.' };
      }
    }

    const { data, error } = await supabase
      .from('friendships')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('activity_feed').insert({
      user_id: receiverId,
      actor_id: senderId,
      type: 'ami_demande',
      metadata: {}
    });

    // ─── NOTIFICATION SOCIALE ───
    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('nom')
      .eq('id', senderId)
      .single();

    const prenomSender = senderProfile?.nom?.split(' ')[0] || 'Quelqu\'un';
    await notifySocialEvent(receiverId, prenomSender, 'ami_demande');

    return { data, error: null };
  } catch (error) {
    console.error("Erreur envoi demande:", error.message);
    return { data: null, error: error.message };
  }
};

// ━━━ 5. ACCEPTER DEMANDE ━━━
export const acceptFriendRequest = async (friendshipId, userId) => {
  try {
    const { data: friendship } = await supabase
      .from('friendships')
      .select('sender_id, receiver_id')
      .eq('id', friendshipId)
      .single();

    const { data, error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId)
      .select()
      .single();

    if (error) throw error;

    const otherId = friendship.sender_id === userId ? friendship.receiver_id : friendship.sender_id;
    await supabase.from('activity_feed').insert({
      user_id: otherId,
      actor_id: userId,
      type: 'ami_accepte',
      metadata: {}
    });

    // ─── NOTIFICATION SOCIALE ───
    const { data: acceptorProfile } = await supabase
      .from('profiles')
      .select('nom')
      .eq('id', userId)
      .single();

    const prenomAcceptor = acceptorProfile?.nom?.split(' ')[0] || 'Quelqu\'un';
    await notifySocialEvent(friendship.sender_id, prenomAcceptor, 'ami_accepte');

    return { data, error: null };
  } catch (error) {
    console.error("Erreur acceptation demande:", error.message);
    return { data: null, error: error.message };
  }
};

// ━━━ 6. RÉCUPÉRER AMIS ━━━
export const getFriends = async (userId) => {
  try {
    const { data: friendships, error } = await supabase
      .from('friendships')
      .select('id, sender_id, receiver_id')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) throw error;
    if (!friendships?.length) return { data: [], error: null };

    const friendIds = friendships.map(f =>
      f.sender_id === userId ? f.receiver_id : f.sender_id
    );

    const { data: profiles, error: pError } = await supabase
      .from('profiles')
      .select('id, nom, signe_solaire, signe_lunaire, ascendant, username, last_seen_at, share_token')
      .in('id', friendIds);

    if (pError) throw pError;

    const result = friendships.map(f => ({
      friendshipId: f.id,
      ami: profiles?.find(p =>
        p.id === (f.sender_id === userId ? f.receiver_id : f.sender_id)
      )
    })).filter(f => f.ami !== null);

    return { data: result, error: null };
  } catch (error) {
    console.error("Erreur récupération amis:", error.message);
    return { data: null, error: error.message };
  }
};

// ━━━ 7. DEMANDES EN ATTENTE ━━━
export const getPendingRequests = async (userId) => {
  try {
    const { data: friendships, error } = await supabase
      .from('friendships')
      .select('id, created_at, sender_id')
      .eq('receiver_id', userId)
      .eq('status', 'pending');

    if (error) throw error;
    if (!friendships?.length) return { data: [], error: null };

    const senderIds = friendships.map(f => f.sender_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nom, signe_solaire, username')
      .in('id', senderIds);

    const result = friendships.map(f => ({
      id: f.id,
      created_at: f.created_at,
      sender: profiles?.find(p => p.id === f.sender_id)
    }));

    return { data: result, error: null };
  } catch (error) {
    console.error("Erreur demandes en attente:", error.message);
    return { data: null, error: error.message };
  }
};

// ━━━ 8. SUPPRIMER AMI ━━━
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

// ━━━ 9. ENREGISTRER VUE COMPATIBILITÉ ━━━
export const logCompatibilityView = async (viewerId, viewedId) => {
  try {
    await supabase
      .from('compatibility_views')
      .insert({ viewer_id: viewerId, viewed_id: viewedId });

    await supabase.from('activity_feed').insert({
      user_id: viewedId,
      actor_id: viewerId,
      type: 'compatibilite_vue',
      metadata: {}
    });

    // ─── NOTIFICATION SOCIALE ───
    const { data: viewerProfile } = await supabase
      .from('profiles')
      .select('nom')
      .eq('id', viewerId)
      .single();

    const prenomViewer = viewerProfile?.nom?.split(' ')[0] || 'Quelqu\'un';
    await notifySocialEvent(viewedId, prenomViewer, 'compatibilite_vue');
  } catch (err) {
    console.warn('logCompatibilityView:', err);
  }
};

// ━━━ 10. RÉCUPÉRER FEED D'ACTIVITÉ ━━━
export const getActivityFeed = async (userId) => {
  try {
    const { data: activities, error } = await supabase
      .from('activity_feed')
      .select('id, type, metadata, created_at, actor_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    if (!activities?.length) return { data: [], error: null };

    const actorIds = [...new Set(activities.map(a => a.actor_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nom, signe_solaire, username')
      .in('id', actorIds);

    const result = activities.map(a => ({
      ...a,
      actor: profiles?.find(p => p.id === a.actor_id)
    }));

    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
};

// ━━━ 11. METTRE À JOUR LAST SEEN ━━━
export const updateLastSeen = async (userId) => {
  try {
    await supabase
      .from('profiles')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', userId);
  } catch (err) {
    console.warn('updateLastSeen:', err);
  }
};