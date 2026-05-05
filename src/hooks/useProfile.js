import { useProfileContext } from '../context/ProfileContext';
import { useState, useEffect } from 'react';

export function useProfile(userId) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.warn('Profile fetch timeout — forçage');
      setLoading(false);
    }, 6000);

    return () => clearTimeout(timeoutId);
  }, []);

  const { profile, loading: ctxLoading } = useProfileContext();
  
  useEffect(() => {
    if (!ctxLoading) {
      setLoading(false);
    }
  }, [ctxLoading]);

  return { profile, loading, refetch: () => {} };
}