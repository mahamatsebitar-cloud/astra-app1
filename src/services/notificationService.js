// src/services/notificationService.js
import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ━━━ 1. SAUVEGARDER UN TOKEN ━━━
export async function saveToken(userId, token) {
  try {
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

// ━━━ 3. VÉRIFIER SI L'USER VEUT DES NOTIFICATIONS ━━━
async function isNotificationsEnabled(userId) {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('notifications_enabled')
      .eq('id', userId)
      .single();
    return data?.notifications_enabled !== false;
  } catch (err) {
    console.warn('isNotificationsEnabled error:', err);
    return true;
  }
}

// ━━━ 4. ENVOYER UNE NOTIFICATION PUSH (bas niveau) ━━━
export async function sendPushNotification(tokens, title, body, data = {}) {
  if (!tokens?.length) return { error: 'No tokens' };

  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/send-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
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

// ━━━ 5. NOTIFIER UN ÉVÉNEMENT SOCIAL (haut niveau) ━━━
export async function notifySocialEvent(targetUserId, actorNom, type) {
  try {
    const enabled = await isNotificationsEnabled(targetUserId);
    if (!enabled) {
      console.log('🔕 Notifications désactivées pour', targetUserId);
      return;
    }

    const tokens = await getUserTokens(targetUserId);
    if (!tokens.length) return;

    const messages = {
      'ami_demande': {
        title: '✦ Nouvelle alliance',
        body: `${actorNom} veut rejoindre ton cercle astral`
      },
      'ami_accepte': {
        title: '✦ Alliance acceptée',
        body: `${actorNom} a rejoint ton cercle — explorez votre affinité`
      },
      'compatibilite_vue': {
        title: '✦ Affinité explorée',
        body: `${actorNom} a exploré votre compatibilité astrale`
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

// ━━━ 6. ENVOYER L'HOROSCOPE QUOTIDIEN ━━━
export async function sendDailyHoroscope(tokens, message) {
  if (!tokens?.length) return;
  try {
    await sendPushNotification(tokens, 'Votre horoscope du jour ✦', message, { type: 'daily' });
  } catch (err) {
    console.warn('sendDailyHoroscope error:', err);
  }
}

// ━━━ 7. ENVOYER NOTIFICATION SOCIALE SIMPLE (wrapper bas niveau) ━━━
export const sendSocialNotification = async (userId, title, body) => {
  try {
    const enabled = await isNotificationsEnabled(userId);
    if (!enabled) {
      console.log('🔕 Notifications désactivées pour', userId);
      return;
    }

    const tokens = await getUserTokens(userId);
    if (!tokens.length) return;

    const res = await fetch(
      `${SUPABASE_URL}/functions/v1/send-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ user_id: userId, title, body })
      }
    );

    const result = await res.json();
    console.log('📬 Notification sociale:', result);
  } catch (err) {
    console.warn('sendSocialNotification error:', err);
  }
};