// src/services/revenuecatService.js
// Bridge RevenueCat ↔ Supabase pour les abonnements Astra

import { Purchases } from '@revenuecat/purchases-capacitor';
import { supabase } from '../lib/supabase';

const REVENUECAT_API_KEY = 'test_tPMuaHsmPjcUjteqEMNSEhienIKn';

// ━━━ 1. INITIALISATION ━━━

export async function initRevenueCat(userId) {
  try {
    await Purchases.configure({
      apiKey: REVENUECAT_API_KEY,
      appUserID: userId
    });
    console.log('[RevenueCat] ✅ Initialisé pour user:', userId);
  } catch (e) {
    console.error('[RevenueCat] ❌ Erreur init:', e);
  }
}

// ━━━ 2. RÉCUPÉRER LES OFFRES ━━━

export async function getOfferings() {
  try {
    const { offerings } = await Purchases.getOfferings();
    
    if (!offerings?.current) {
      console.warn('[RevenueCat] ⚠️ Pas d\'offering disponible');
      return null;
    }

    const current = offerings.current;
    
    return {
      monthly: current.monthly?.product,
      annual: current.annual?.product,
      availablePackages: current.availablePackages
    };
  } catch (e) {
    console.error('[RevenueCat] ❌ Erreur offerings:', e);
    return null;
  }
}

// ━━━ 3. ACHETER UN PACKAGE ━━━

export async function purchasePackage(packageToPurchase) {
  try {
    const { customerInfo, productIdentifier } = await Purchases.purchasePackage({
      aPackage: packageToPurchase
    });

    // Vérifie si l'achat a donné l'entitlement premium
    const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
    
    return {
      success: true,
      isPremium,
      customerInfo,
      productIdentifier
    };
  } catch (e) {
    // L'utilisateur a annulé — ce n'est pas une erreur
    if (e.userCancelled) {
      return { success: false, cancelled: true, error: null };
    }
    console.error('[RevenueCat] ❌ Erreur achat:', e);
    return { success: false, cancelled: false, error: e.message };
  }
}

// ━━━ 4. RESTAURER LES ACHATS ━━━

export async function restorePurchases() {
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
    
    return {
      success: true,
      isPremium,
      customerInfo
    };
  } catch (e) {
    console.error('[RevenueCat] ❌ Erreur restore:', e);
    return { success: false, error: e.message };
  }
}

// ━━━ 5. SYNCHRONISER AVEC SUPABASE ━━━

export async function syncSubscriptionToSupabase(userId, customerInfo) {
  try {
    const entitlement = customerInfo.entitlements.active['premium'];
    
    let status = 'free';
    let plan = 'free';
    let currentPeriodEnd = null;
    let trialEndsAt = null;

    if (entitlement) {
      status = entitlement.periodType === 'trial' ? 'trial' : 'active';
      plan = entitlement.productIdentifier.includes('annual') ? 'etoile_annuel' : 'etoile_mensuel';
      currentPeriodEnd = entitlement.expirationDate;
      if (status === 'trial') trialEndsAt = entitlement.expirationDate;
    }

    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    const payload = {
      user_id: userId,
      status,
      plan,
      current_period_end: currentPeriodEnd,
      trial_ends_at: trialEndsAt,
      platform: 'android',
      external_id: customerInfo.originalAppUserId,
      updated_at: new Date().toISOString()
    };

    let result;
    if (existing) {
      result = await supabase
        .from('subscriptions')
        .update(payload)
        .eq('user_id', userId)
        .select()
        .single();
    } else {
      result = await supabase
        .from('subscriptions')
        .insert(payload)
        .select()
        .single();
    }

    if (result.error) throw result.error;

    // Log la transaction
    await supabase.from('transactions').insert({
      user_id: userId,
      type: status === 'trial' ? 'trial_start' : 'purchase',
      amount_cents: 0, // RevenueCat gère les prix
      platform: 'android',
      external_id: customerInfo.originalAppUserId
    });

    return { success: true, data: result.data };
  } catch (e) {
    console.error('[RevenueCat] ❌ Erreur sync Supabase:', e);
    return { success: false, error: e.message };
  }
}

// ━━━ 6. VÉRIFIER L'ÉTAT ACTUEL ━━━

export async function checkSubscriptionStatus() {
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
    
    return {
      isPremium,
      customerInfo
    };
  } catch (e) {
    console.error('[RevenueCat] ❌ Erreur check status:', e);
    return { isPremium: false, error: e.message };
  }
}