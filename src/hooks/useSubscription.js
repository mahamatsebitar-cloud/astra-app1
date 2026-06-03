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

  // 1. Charger l'état d'abonnement (RevenueCat + fallback Supabase)
  const loadSubscription = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Essayer RevenueCat d'abord
      const { isPremium, customerInfo, error: rcError } = await checkSubscriptionStatus();
      
      if (!rcError && customerInfo) {
        // RevenueCat répond → sync avec Supabase
        await syncSubscriptionToSupabase(user.id, customerInfo);
        
        // Construire l'objet subscription compatible
        const entitlement = customerInfo.entitlements.active['premium'];
        setSubscription({
          status: isPremium ? (entitlement?.periodType === 'trial' ? 'trial' : 'active') : 'free',
          plan: entitlement?.productIdentifier?.includes('annual') || entitlement?.productIdentifier?.includes('annuel') 
            ? 'etoile_annuel' 
            : 'etoile_mensuel',
          current_period_end: entitlement?.expirationDate,
          trial_ends_at: entitlement?.periodType === 'trial' ? entitlement?.expirationDate : null,
          platform: 'android'
        });
      } else {
        // Fallback Supabase si RevenueCat échoue (hors connexion, etc.)
        const { data, error: subError } = await getSubscription(user.id);
        if (!subError) setSubscription(data);
      }
    } catch (err) {
      console.error('[useSubscription] Erreur:', err);
      setError(err.message);
      // Fallback offline
      const { data } = await getSubscription(user.id);
      setSubscription(data || { status: 'free', plan: 'free' });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // 2. Charger les offres RevenueCat
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

  // 3. Déductions locales
  const isPremiumUser = useMemo(() => {
    if (!subscription) return false;
    const isValidStatus = ['active', 'trial'].includes(subscription.status);
    const isNotExpired = subscription.current_period_end 
      ? new Date(subscription.current_period_end) > new Date() 
      : true;
    return isValidStatus && isNotExpired;
  }, [subscription]);

  const daysRemaining = useMemo(() => {
    if (!subscription?.current_period_end) return 0;
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

  // 4. Actions RevenueCat
  // 🔥 MODIFIÉ : utilise le package entier, pas juste le produit
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

  // 5. Compatibilité ancienne API
  // 🔥 MODIFIÉ : utilise le package entier pour l'achat
  const startTrial = useCallback(async () => {
    // RevenueCat gère le trial automatiquement si configuré dans le dashboard
    // On achète le package annual (qui a le trial configuré)
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
    return isPremiumUser;
  }, [isPremiumUser]);

  return {
    subscription,
    offerings,           // Contient monthly, annual (produits) + monthlyPackage, annualPackage (packages)
    isPremiumUser,
    loading,
    error,
    isActive: subscription?.status === 'active',
    isTrial: subscription?.status === 'trial',
    isFree: !subscription || subscription?.status === 'free',
    daysRemaining,
    planLabel,
    purchase,            // Accepte un package entier (pas juste un produit)
    restore,
    startTrial,          // Achète le package annual avec trial
    cancelSubscription,
    checkFeature,
    refreshSubscription: loadSubscription
  };
}