import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import { getProfile, updateProfile } from '../services/profileService';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (tentative = 1) => {
    if (!user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await getProfile(user.id);
      if (err) throw err;
      setProfile(data);
      // NOUVEAU — cache local pour mode hors connexion
      if (data) {
        localStorage.setItem(
          'astra_profile_cache_' + user.id,
          JSON.stringify(data)
        );
      }
      setLoading(false);
    } catch (e) {
      if (tentative < 3) {
        const delai = tentative * 800;
        console.log(`Profile retry ${tentative}/3 dans ${delai}ms`);
        setTimeout(() => fetchProfile(tentative + 1), delai);
        // loading reste true pendant le retry
      } else {
        // Après 3 échecs → essayer le cache local
        try {
          const cached = localStorage.getItem('astra_profile_cache_' + user.id);
          if (cached) {
            console.log('📦 Profil chargé depuis le cache local');
            setProfile(JSON.parse(cached));
          } else {
            setError(e.message);
          }
        } catch {
          setError(e.message);
        }
        setLoading(false);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]); // Écouter user?.id directement, pas fetchProfile

  const updateProfileGlobal = useCallback(async (updates) => {
    if (!user?.id) return { error: 'No user' };
    try {
      const { data, error: err } = await updateProfile(user.id, updates);
      if (err) throw err;
      setProfile(prev => ({ ...prev, ...updates }));
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e.message };
    }
  }, [user?.id]);

  return (
    <ProfileContext.Provider value={{
      profile,
      loading,
      error,
      refreshProfile: fetchProfile,
      updateProfile: updateProfileGlobal
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within ProfileProvider');
  }
  return context;
}