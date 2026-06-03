// src/services/revenuecatService.js
// Bridge RevenueCat ↔ Supabase pour les abonnements Astra

import { Purchases } from '@revenuecat/purchases-capacitor';
import { Toast } from '@capacitor/toast';
import { supabase } from '../lib/supabase';

const REVENUECAT_API_KEY = 'test_tPMuaHsmPjcUjteqEMNSEhienIKn';

// ━━━ 1. INITIALISATION ━━━

export async function initRevenueCat(userId) {
  try {
    await Toast.show({ text: 'RC init...', duration: 'short' });
    
    await Purchases.configure({
      apiKey: REVENUECAT_API_KEY,
      appUserID: userId
    });
    
    await Toast.show({ text: 'RC init OK ✅', duration: 'short' });
    console.log('[RevenueCat] ✅ Initialisé pour user:', userId);
  } catch (e) {
    await Toast.show({ text: 'RC init ❌ ' + (e.message || e).substring(0, 60), duration: 'long' });
    console.error('[RevenueCat] ❌ Erreur init:', e);
  }
}

// ━━━ 2. RÉCUPÉRER LES OFFRES ━━━

export async function getOfferings() {
  try {
    await Toast.show({ text: 'RC offres...', duration: 'short' });
    
    const { offerings } = await Purchases.getOfferings();
    
    if (!offerings?.current) {
      await Toast.show({ text: 'RC offres vides ⚠️', duration: 'long' });
      console.warn('[RevenueCat] ⚠️ Pas d\'offering disponible');
      return null;
    }

    const current = offerings.current;
    
    await Toast.show({ text: 'RC offres OK ✅ (' + (current.availablePackages?.length || 0) + ')', duration: 'short' });
    
    return {
      monthly: current.monthly?.product,
      annual: current.annual?.product,
      availablePackages: current.availablePackages
    };
  } catch (e) {
    await Toast.show({ text: 'RC offres ❌ ' + (e.message || e).substring(0, 60), duration: 'long' });
    console.error('[RevenueCat] ❌ Erreur offerings:', e);
    return null;
  }
}

// ━━━ 3. ACHETER UN PACKAGE ━━━

export async function purchasePackage(packageToPurchase) {
  try {
    await Toast.show({ text: 'RC achat...', duration: 'short' });
    
    const { customerInfo, productIdentifier } = await Purchases.purchasePackage({
      aPackage: packageToPurchase
    });

    // Vérifie si l'achat a donné l'entitlement premium
    const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
    
    await Toast.show({ text: 'RC achat OK ✅', duration: 'short' });
    
    return {
      success: true,
      isPremium,
      customerInfo,
      productIdentifier
    };
  } catch (e) {
    // L'utilisateur a annulé — ce n'est pas une erreur
    if (e.userCancelled) {
      await Toast.show({ text: 'RC achat annulé', duration: 'short' });
      return { success: false, cancelled: true, error: null };
    }
    await Toast.show({ text: 'RC achat ❌ ' + (e.message || e).substring(0, 60), duration: 'long' });
    console.error('[RevenueCat] ❌ Erreur achat:', e);
    return { success: false, cancelled: false, error: e.message };
  }
}

// ━━━ 4. RESTAURER LES ACHATS ━━━

export async function restorePurchases() {
  try {
    await Toast.show({ text: 'RC restore...', duration: 'short' });
    
    const { customerInfo } = await Purchases.restorePurchases();
    const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
    
    await Toast.show({ text: 'RC restore OK ✅', duration: 'short' });
    
    return {
      success: true,
      isPremium,
      customerInfo
    };
  } catch (e) {
    await Toast.show({ text: 'RC restore ❌ ' + (e.message || e).substring(0, 60), duration: 'long' });
    console.error('[RevenueCat] ❌ Erreur restore:', e);
    return { success: false, error: e.message };
  }
}

// ━━━ 5. SYNCHRONISER AVEC SUPABASE ━━━

export async function syncSubscriptionToSupabase(userId, customerInfo) {
  try {
    await Toast.show({ text: 'RC sync DB...', duration: 'short' });
    
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

    await Toast.show({ text: 'RC sync DB OK ✅', duration: 'short' });
    return { success: true, data: result.data };
  } catch (e) {
    await Toast.show({ text: 'RC sync DB ❌ ' + (e.message || e).substring(0, 60), duration: 'long' });
    console.error('[RevenueCat] ❌ Erreur sync Supabase:', e);
    return { success: false, error: e.message };
  }
}

// ━━━ 6. VÉRIFIER L'ÉTAT ACTUEL ━━━

export async function checkSubscriptionStatus() {
  try {
    await Toast.show({ text: 'RC check...', duration: 'short' });
    
    const { customerInfo } = await Purchases.getCustomerInfo();
    const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
    
    await Toast.show({ text: 'RC check OK ✅', duration: 'short' });
    
    return {
      isPremium,
      customerInfo
    };
  } catch (e) {
    await Toast.show({ text: 'RC check ❌ ' + (e.message || e).substring(0, 60), duration: 'long' });
    console.error('[RevenueCat] ❌ Erreur check status:', e);
    return { isPremium: false, error: e.message };
  }
}