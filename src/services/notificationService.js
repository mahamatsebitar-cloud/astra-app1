// src/services/notificationService.js
import { supabase } from '../lib/supabase';

// ━━━ 1. SAUVEGARDER UN TOKEN ━━━
export async function saveToken(userId, token) {
  try {
    // Vérifie si le token existe déjà (pour éviter les doublons)
    const { data } = await supabase
      .from('notification_tokens')
      .select('id')
      .eq('token', token)
      .maybeSingle();

    if (!data) {
      await supabase.from('notification_tokens').insert({
        user_id: userId,
        token,
        platform: 'web'
      });
    }
  } catch (err) {
    console.warn('saveToken error:', err);
  }
}

// ━━━ 2. RÉCUPÉRER LES TOKENS D'UN USER ━━━
export async function getUserTokens(userId) {
  try {
    const { data } = await supabase
      .from('notification_tokens')
      .select('token')
      .eq('user_id', userId);
    return data?.map(d => d.token) || [];
  } catch (err) {
    console.warn('getUserTokens error:', err);
    return [];
  }
}

// ━━━ 3. ENVOYER UNE NOTIFICATION PUSH ━━━
export async function sendPushNotification(tokens, title, body, data = {}) {
  if (!tokens?.length) return { error: 'No tokens' };

  try {
    const response = await fetch(
      `${supabase.supabaseUrl}/functions/v1/send-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({ tokens, title, body, data }),
      }
    );
    return await response.json();
  } catch (err) {
    console.warn('sendPushNotification error:', err);
    return { error: err.message };
  }
}

// ━━━ 4. NOTIFIER UN ÉVÉNEMENT SOCIAL ━━━
export async function notifySocialEvent(targetUserId, actorNom, type) {
  try {
    const tokens = await getUserTokens(targetUserId);
    if (!tokens.length) return;

    const messages = {
      'ami_demande': {
        title: 'Nouvelle connexion astrale ✦',
        body: `${actorNom} souhaite rejoindre vos alliances`
      },
      'ami_accepte': {
        title: 'Alliance confirmée ✦',
        body: `${actorNom} a accepté votre invitation`
      },
      'compatibilite_vue': {
        title: 'On consulte vos astres ✦',
        body: `${actorNom} a consulté votre compatibilité`
      }
    };

    const config = messages[type] || {
      title: 'Astra ✦',
      body: `${actorNom} interagit avec votre profil`
    };

    await sendPushNotification(tokens, config.title, config.body, { type });
  } catch (err) {
    console.warn('notifySocialEvent error:', err);
  }
}

// ━━━ 5. ENVOYER L'HOROSCOPE QUOTIDIEN ━━━
export async function sendDailyHoroscope(tokens, message) {
  if (!tokens?.length) return;
  try {
    await sendPushNotification(tokens, 'Votre horoscope du jour ✦', message, { type: 'daily' });
  } catch (err) {
    console.warn('sendDailyHoroscope error:', err);
  }
}