// src/services/subscriptionService.js
import { supabase } from '../lib/supabase';

/**
 * Helper privé pour vérifier si un objet subscription est valide
 */
const isSubscriptionValid = (sub) => {
  if (!sub || !['active', 'trial'].includes(sub.status)) return false;
  
  if (sub.current_period_end) {
    return new Date(sub.current_period_end) > new Date();
  }
  return true;
};

export async function getSubscription(userId) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    return { 
      data: data || { status: 'free', plan: 'free' }, 
      error: null 
    };
  } catch (err) {
    console.error("Erreur d'abonnement:", err.message);
    return { data: { status: 'free', plan: 'free' }, error: err.message };
  }
}

export async function isPremium(userId) {
  const { data } = await getSubscription(userId);
  return isSubscriptionValid(data);
}

export async function hasFeatureAccess(userId, featureKey) {
  const [featureRes, subRes] = await Promise.all([
    supabase.from('premium_features').select('is_premium').eq('feature_key', featureKey).maybeSingle(),
    getSubscription(userId)
  ]);

  const feature = featureRes.data;
  const subscription = subRes.data;

  if (!feature || !feature.is_premium) return true;
  return isSubscriptionValid(subscription);
}

export async function startTrial(userId) {
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 7);

  const { data, error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      status: 'trial',
      plan: 'etoile_mensuel',
      trial_ends_at: trialEnd.toISOString(),
      current_period_end: trialEnd.toISOString(),
      platform: 'android'
    })
    .select()
    .single();

  if (!error) {
    await supabase.from('transactions').insert({
      user_id: userId,
      type: 'trial_start',
      amount_cents: 0,
      platform: 'android'
    });
  }

  return { data, error };
}

// FIX : Ajout de la fonction manquante
export async function cancelSubscription(userId) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    if (!error) {
      await supabase.from('transactions').insert({
        user_id: userId,
        type: 'cancellation',
        amount_cents: 0,
        platform: 'web'
      });
    }

    return { data, isValid: isSubscriptionValid(data), error };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// FIX : Ajout de la fonction manquante
export async function activateGooglePlaySubscription(userId, purchaseToken) {
  try {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // Simulation 1 mois

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        status: 'active',
        plan: 'etoile_mensuel',
        current_period_end: expiryDate.toISOString(),
        platform: 'android',
        external_id: purchaseToken
      })
      .select()
      .single();

    return { data, isValid: isSubscriptionValid(data), error };
  } catch (err) {
    return { data: null, error: err.message };
  }
}