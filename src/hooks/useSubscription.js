// src/hooks/useSubscription.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';
import {
  getSubscription,
  startTrial as startTrialService,
  cancelSubscription as cancelSubscriptionService,
  hasFeatureAccess
} from '../services/subscriptionService';

export function useSubscription() {
  const { user } = useAuthContext();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Logique de chargement optimisée (1 seul appel SQL)
  const loadSubscription = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: subError } = await getSubscription(user.id);
      if (subError) throw new Error(subError);
      
      setSubscription(data);
    } catch (err) {
      setError(err.message);
      setSubscription({ status: 'free', plan: 'free' });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  // 2. Déductions locales (Évite les appels réseau inutiles)
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

  // 3. Actions
  const startTrial = useCallback(async () => {
    if (!user?.id) return;
    const res = await startTrialService(user.id);
    if (!res.error) await loadSubscription();
    return res;
  }, [user?.id, loadSubscription]);

  const cancelSubscription = useCallback(async () => {
    if (!user?.id) return;
    const res = await cancelSubscriptionService(user.id);
    if (!res.error) await loadSubscription();
    return res;
  }, [user?.id, loadSubscription]);

  const checkFeature = useCallback(async (key) => {
    if (!user?.id) return false;
    return await hasFeatureAccess(user.id, key);
  }, [user?.id]);

  return {
    subscription,
    isPremiumUser,
    loading,
    error,
    isActive: subscription?.status === 'active',
    isTrial: subscription?.status === 'trial',
    isFree: !subscription || subscription?.status === 'free',
    daysRemaining,
    planLabel,
    startTrial,
    cancelSubscription,
    checkFeature,
    refreshSubscription: loadSubscription
  };
}