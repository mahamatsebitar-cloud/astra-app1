// src/hooks/useFriends.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useProfile } from './useProfile';
import * as friendService from '../services/friendService';
import { calculateCompatibility, getCitationCompatibilite } from '../services/compatibilityService';

const useFriends = () => {
  const { user } = useAuthContext();
  const { profile, loading: profileLoading } = useProfile(user?.id);

  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const loadFriendsData = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const [fRes, pRes] = await Promise.all([
        friendService.getFriends(user.id),
        friendService.getPendingRequests(user.id)
      ]);

      if (fRes.error) throw new Error(fRes.error);
      if (pRes.error) throw new Error(pRes.error);

      setFriends(fRes.data || []);
      setPendingRequests(pRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadFriendsData();
  }, [loadFriendsData]);

  const searchUser = useCallback(async (email) => {
    if (!email.trim()) return setSearchResults(null);
    setLoading(true);
    setError(null);

    try {
      const { data, error: searchError } = await friendService.searchUserByEmail(email);
      
      if (searchError || !data) {
        setError("Âme introuvable dans les astres...");
        setSearchResults(null);
      } else if (data.id === user.id) {
        setError("Vous êtes déjà votre meilleur allié.");
        setSearchResults(null);
      } else {
        // Vérifier si déjà ami
        const isFriend = friends.some(f => f.ami.id === data.id);
        const isPending = pendingRequests.some(r => r.sender.id === data.id);
        setSearchResults({ ...data, isFriend, isPending });
      }
    } catch (err) {
      setError("Erreur de connexion céleste.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, friends, pendingRequests]);

  const addFriend = useCallback(async (receiverId) => {
    const res = await friendService.sendFriendRequest(user.id, receiverId);
    if (!res.error) {
      setSearchResults(null); // On ferme la recherche après envoi
      loadFriendsData();
    }
    return res;
  }, [user?.id, loadFriendsData]);

  const acceptRequest = useCallback(async (friendshipId) => {
    // Update optimiste : on retire de la liste d'attente immédiatement
    setPendingRequests(prev => prev.filter(r => r.id !== friendshipId));
    const res = await friendService.acceptFriendRequest(friendshipId);
    await loadFriendsData();
    return res;
  }, [loadFriendsData]);

  const removeFriend = useCallback(async (friendshipId) => {
    setFriends(prev => prev.filter(f => f.friendshipId !== friendshipId));
    return await friendService.removeFriend(friendshipId);
  }, []);

  const getCompatibilityWith = useCallback((amiProfil) => {
    // Si mon profil n'est pas chargé, on renvoie un état neutre
    if (profileLoading || !profile || !amiProfil) {
      return { global: 0, loading: true };
    }

    return {
      ...calculateCompatibility(profile, amiProfil),
      citation: getCitationCompatibilite(profile, amiProfil)
    };
  }, [profile, profileLoading]);

  return {
    friends,
    pendingRequests,
    loading: loading || profileLoading,
    error,
    searchUser,
    searchResults,
    setSearchResults, // Pour pouvoir annuler la recherche
    addFriend,
    acceptRequest,
    removeFriend,
    getCompatibilityWith,
    refreshFriends: loadFriendsData
  };
};

export { useFriends };
export default useFriends;