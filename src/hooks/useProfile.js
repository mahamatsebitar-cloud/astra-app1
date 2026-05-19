// src/hooks/useProfile.js
import { useProfileContext } from '../context/ProfileContext';
import { useState, useEffect } from 'react';

export function useProfile(userId) {
  const [loading, setLoading] = useState(true);
  const { profile, loading: ctxLoading, refreshProfile } = useProfileContext();

  // Reset loading quand le contexte a fini de charger
  useEffect(() => {
    if (!ctxLoading) {
      setLoading(false);
    }
  }, [ctxLoading]);

  // Timeout de sécurité — CORRIGÉ pour ne pas s'exécuter sans userId
  useEffect(() => {
    // Si pas d'userId, on force loading à false immédiatement (pas de timeout)
    if (!userId) {
      setLoading(false);
      return;
    }

    // Si le contexte a déjà fini de charger, pas besoin de timeout
    if (!ctxLoading) return;

    const timeoutId = setTimeout(() => {
      console.warn('Profile fetch timeout — forçage');
      setLoading(false);
    }, 8000);

    return () => clearTimeout(timeoutId);
  }, [userId, ctxLoading]);

  // Si pas de userId, retourne immédiatement sans loading
  if (!userId) {
    return { profile: null, loading: false, refreshProfile };
  }

  return { profile, loading: loading || ctxLoading, refreshProfile };
}