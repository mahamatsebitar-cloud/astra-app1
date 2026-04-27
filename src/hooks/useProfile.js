import { useState, useEffect, useCallback } from 'react';
import { getProfile, saveProfile, updateProfile } from '../services/profileService';
import { getSigneSolaire, getSigneLunaire, getAscendant } from '../services/astroService';

export function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: profileError } = await getProfile(userId);

    if (profileError) {
      setError(profileError.message || 'Erreur lors du chargement du profil');
      setProfile(null);
    } else {
      setProfile(data);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function handleSaveProfile(profileData) {
    setError(null);

    try {
      // Calcul automatique des données astro
      const signeSolaire = getSigneSolaire(profileData.date_naissance);
      const signeLunaire = getSigneLunaire(profileData.date_naissance);
      // Sécurité : latitude par défaut à 45 si non fournie
      const lat = profileData.latitude || 45;
      const ascendant = getAscendant(profileData.heure_naissance, lat);

      const completeData = {
        ...profileData,
        signe_solaire: signeSolaire,
        signe_lunaire: signeLunaire,
        ascendant: ascendant,
      };

      const { data, error: saveError } = await saveProfile(userId, completeData);

      if (saveError) {
        setError(saveError.message || 'Erreur lors de la sauvegarde du profil');
        return false;
      }

      setProfile(data);
      return true;
    } catch (err) {
      console.error("Erreur saveProfile:", err);
      setError(err.message || 'Erreur lors de la sauvegarde du profil');
      return false;
    }
  }

  async function handleUpdateProfile(updates) {
    setError(null);

    try {
      const { data, error: updateError } = await updateProfile(userId, updates);

      if (updateError) {
        setError(updateError.message || 'Erreur lors de la mise à jour du profil');
        return false;
      }

      setProfile(data);
      return true;
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du profil');
      return false;
    }
  }

  return {
    profile,
    loading,
    error,
    saveProfile: handleSaveProfile,
    updateProfile: handleUpdateProfile,
    refreshProfile: fetchProfile,
  };
}