// src/hooks/useSubscription.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  syncSubscriptionToSupabase,
  checkSubscriptionStatus
} from '../services/revenuecatService';
import { getSubscription } from '../services/subscriptionService';

export function useSubscription() {
  const { user } = useAuthContext();
  const [subscription, setSubscription] = useState(null);
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSubscription = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { isPremium, customerInfo, error: rcError } = await checkSubscriptionStatus();
      
      if (!rcError && customerInfo) {
        await syncSubscriptionToSupabase(user.id, customerInfo);
        const entitlement = customerInfo.entitlements.active['premium'];
        setSubscription({
          status: isPremium ? (entitlement?.periodType === 'trial' ? 'trial' : 'active') : 'free',
          plan: entitlement?.productIdentifier?.includes('annual') || entitlement?.productIdentifier?.includes('annuel') 
            ? 'etoile_annuel' : 'etoile_mensuel',
          current_period_end: entitlement?.expirationDate,
          trial_ends_at: entitlement?.periodType === 'trial' ? entitlement?.expirationDate : null,
          platform: 'android'
        });
      } else {
        const { data, error: subError } = await getSubscription(user.id);
        if (!subError) setSubscription(data);
      }
    } catch (err) {
      console.error('[useSubscription] Erreur:', err);
      setError(err.message);
      const { data } = await getSubscription(user.id);
      setSubscription(data || { status: 'free', plan: 'free' });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadOfferings = useCallback(async () => {
    try {
      const offers = await getOfferings();
      setOfferings(offers);
    } catch (e) {
      console.warn('[useSubscription] Offres non disponibles:', e);
    }
  }, []);

  useEffect(() => {
    loadSubscription();
    loadOfferings();
  }, [loadSubscription, loadOfferings]);

  // 🆓 MODE GRATUIT TOTAL — isPremiumUser toujours true
  const isPremiumUser = useMemo(() => true, []);
  
  // 🆓 MODE GRATUIT TOTAL — isActive et isTrial forcés
  const isActive = useMemo(() => true, []);
  const isTrial = useMemo(() => false, []);
  const isFree = useMemo(() => false, []);

  const daysRemaining = useMemo(() => {
    if (!subscription?.current_period_end) return 999;
    const diff = new Date(subscription.current_period_end) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [subscription]);

  const planLabel = useMemo(() => {
    const labels = {
      'etoile_mensuel': 'Astra Étoile · Mensuel',
      'etoile_annuel': 'Astra Étoile · Annuel',
      'free': 'Gratuit'
    };
    return labels[subscription?.plan] || 'Gratuit';
  }, [subscription]);

  const purchase = useCallback(async (packageToBuy) => {
    if (!user?.id) return { success: false, error: 'Non connecté' };
    const result = await purchasePackage(packageToBuy);
    if (result.success && result.customerInfo) {
      await syncSubscriptionToSupabase(user.id, result.customerInfo);
      await loadSubscription();
    }
    return result;
  }, [user?.id, loadSubscription]);

  const restore = useCallback(async () => {
    if (!user?.id) return { success: false, error: 'Non connecté' };
    const result = await restorePurchases();
    if (result.success && result.customerInfo) {
      await syncSubscriptionToSupabase(user.id, result.customerInfo);
      await loadSubscription();
    }
    return result;
  }, [user?.id, loadSubscription]);

  const startTrial = useCallback(async () => {
    if (!offerings?.annualPackage) {
      return { success: false, error: 'Offre non disponible' };
    }
    return purchase(offerings.annualPackage);
  }, [offerings, purchase]);

  const cancelSubscription = useCallback(async () => {
    return { 
      success: false, 
      error: 'Veuillez gérer votre abonnement dans les paramètres Google Play',
      redirectToStore: true 
    };
  }, []);

  const checkFeature = useCallback(async (key) => {
    return true; // 🆓 MODE GRATUIT — toutes les features accessibles
  }, []);

  return {
    subscription,
    offerings,
    isPremiumUser,  // 🆓 Toujours true
    loading,
    error,
    isActive,       // 🆓 Toujours true
    isTrial,        // 🆓 Toujours false
    isFree,         // 🆓 Toujours false
    daysRemaining,
    planLabel,
    purchase,
    restore,
    startTrial,
    cancelSubscription,
    checkFeature,   // 🆓 Toujours true
    refreshSubscription: loadSubscription
  };
}