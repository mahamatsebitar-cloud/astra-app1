// src/services/revenuecatService.js
// Bridge RevenueCat ↔ Supabase — MODE DEV avec mock
// 🆓 Toutes les fonctionnalités gratuites pendant le dev

import { Purchases } from '@revenuecat/purchases-capacitor';
import { Toast } from '@capacitor/toast';
import { supabase } from '../lib/supabase';

const REVENUECAT_API_KEY = 'goog_CePyjXRDK1cbPXxbJNeDfjMMN';
const IS_DEV = true; // ← Mettre false quand Google Play Billing est configuré

// ━━━ MOCK OFFRES ━━━
const MOCK_OFFERINGS = {
  monthly: {
    identifier: 'mensuels',
    priceString: '9,99 €',
    price: 9.99,
    currencyCode: 'EUR',
    description: 'Abonnement mensuel Astra Étoile'
  },
  annual: {
    identifier: 'annuelles',
    priceString: '79,99 €',
    price: 79.99,
    currencyCode: 'EUR',
    description: 'Abonnement annuel Astra Étoile'
  },
  monthlyPackage: {
    identifier: '$rc_monthly',
    product: {
      identifier: 'mensuels',
      priceString: '9,99 €',
      price: 9.99,
      currencyCode: 'EUR'
    }
  },
  annualPackage: {
    identifier: '$rc_annual',
    product: {
      identifier: 'annuelles',
      priceString: '79,99 €',
      price: 79.99,
      currencyCode: 'EUR'
    }
  }
};

export async function initRevenueCat(userId) {
  if (IS_DEV) {
    console.log('[RevenueCat] 🧪 Mode DEV — skip init');
    return;
  }
  try {
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY, appUserID: userId });
  } catch (e) {
    console.error('[RevenueCat] ❌ Erreur init:', e);
  }
}

export async function getOfferings() {
  if (IS_DEV) {
    console.log('[RevenueCat] 🧪 Offres mock retournées');
    return MOCK_OFFERINGS;
  }
  try {
    const { offerings } = await Purchases.getOfferings();
    if (!offerings?.current) return null;
    const current = offerings.current;
    return {
      monthly: current.monthly?.product,
      annual: current.annual?.product,
      availablePackages: current.availablePackages,
      monthlyPackage: current.monthly,
      annualPackage: current.annual
    };
  } catch (e) {
    console.error('[RevenueCat] ❌ Erreur offerings:', e);
    return null;
  }
}

export async function purchasePackage(packageToPurchase) {
  if (IS_DEV) {
    console.log('[RevenueCat] 🧪 Achat simulé');
    return {
      success: true,
      isPremium: true,
      customerInfo: {
        entitlements: {
          active: {
            premium: {
              periodType: 'trial',
              expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              productIdentifier: packageToPurchase?.product?.identifier || 'annuelles'
            }
          }
        },
        originalAppUserId: 'dev-user'
      },
      productIdentifier: packageToPurchase?.product?.identifier || 'annuelles'
    };
  }
  try {
    const { customerInfo, productIdentifier } = await Purchases.purchasePackage({ aPackage: packageToPurchase });
    const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
    return { success: true, isPremium, customerInfo, productIdentifier };
  } catch (e) {
    if (e.userCancelled) return { success: false, cancelled: true, error: null };
    return { success: false, cancelled: false, error: e.message };
  }
}

export async function restorePurchases() {
  if (IS_DEV) {
    return { success: true, isPremium: false, customerInfo: { entitlements: { active: {} } } };
  }
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
    return { success: true, isPremium, customerInfo };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export async function syncSubscriptionToSupabase(userId, customerInfo) {
  try {
    const entitlement = customerInfo.entitlements?.active?.['premium'];
    let status = 'free';
    let plan = 'free';
    let currentPeriodEnd = null;
    let trialEndsAt = null;

    if (entitlement) {
      status = entitlement.periodType === 'trial' ? 'trial' : 'active';
      plan = entitlement.productIdentifier?.includes('annual') || entitlement.productIdentifier?.includes('annuel') 
        ? 'etoile_annuel' : 'etoile_mensuel';
      currentPeriodEnd = entitlement.expirationDate;
      if (status === 'trial') trialEndsAt = entitlement.expirationDate;
    }

    const { data: existing } = await supabase.from('subscriptions').select('id').eq('user_id', userId).maybeSingle();
    const payload = {
      user_id: userId,
      status,
      plan,
      current_period_end: currentPeriodEnd,
      trial_ends_at: trialEndsAt,
      platform: 'android',
      external_id: customerInfo.originalAppUserId || userId,
      updated_at: new Date().toISOString()
    };

    let result;
    if (existing) {
      result = await supabase.from('subscriptions').update(payload).eq('user_id', userId).select().single();
    } else {
      result = await supabase.from('subscriptions').insert(payload).select().single();
    }

    if (result.error) throw result.error;

    await supabase.from('transactions').insert({
      user_id: userId,
      type: status === 'trial' ? 'trial_start' : 'purchase',
      amount_cents: 0,
      platform: 'android',
      external_id: customerInfo.originalAppUserId || userId
    });

    return { success: true, data: result.data };
  } catch (e) {
    console.error('[RevenueCat] ❌ Erreur sync Supabase:', e);
    return { success: false, error: e.message };
  }
}

export async function checkSubscriptionStatus() {
  if (IS_DEV) {
    return { isPremium: false, customerInfo: null };
  }
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
    return { isPremium, customerInfo };
  } catch (e) {
    return { isPremium: false, error: e.message };
  }
}