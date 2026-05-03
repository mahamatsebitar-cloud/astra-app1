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
  const [activityFeed, setActivityFeed] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  // ━━━ CHARGEMENT INITIAL ━━━
  const loadAll = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [friendsRes, pendingRes, feedRes] = await Promise.all([
        friendService.getFriends(user.id),
        friendService.getPendingRequests(user.id),
        friendService.getActivityFeed(user.id)
      ]);
      setFriends(friendsRes.data || []);
      setPendingRequests(pendingRes.data || []);
      setActivityFeed(feedRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Met à jour last_seen à chaque montage
  useEffect(() => {
    if (user?.id) friendService.updateLastSeen(user.id);
  }, [user?.id]);

  // ━━━ COMPATIBILITÉ (avec citation) ━━━
  const getCompatibilityWith = useCallback((amiProfil) => {
    if (!profile || !amiProfil) {
      return {
        global: 0, amour: 0, communication: 0,
        valeurs: 0, complicite: 0, durabilite: 0,
        citation: "Les astres vous unissent en silence."
      };
    }
    const scores = calculateCompatibility(profile, amiProfil);
    const citation = getCitationCompatibilite(profile, amiProfil);
    return { ...scores, citation };
  }, [profile]);

  // ━━━ RECHERCHE (par email ou username) ━━━
  const searchUser = useCallback(async (query) => {
    if (!query?.trim() || !user?.id) return;
    setSearchLoading(true);
    setSearchResults(null);
    const { data } = await friendService.searchUser(query, user.id);
    if (data?.length > 0) {
      // Vérifie si déjà ami ou en attente
      const enriched = data.map(u => ({
        ...u,
        isFriend: friends.some(f => f.ami?.id === u.id),
        isPending: pendingRequests.some(r => r.sender?.id === u.id)
      }));
      setSearchResults(enriched);
    } else {
      setSearchResults([]);
    }
    setSearchLoading(false);
  }, [user?.id, friends, pendingRequests]);

  // ━━━ AJOUTER AMI ━━━
  const addFriend = useCallback(async (targetId) => {
    if (!user?.id) return { error: 'Non connecté' };
    const result = await friendService.sendFriendRequest(user.id, targetId);
    if (!result.error) {
      setSearchResults(null);
      await loadAll();
    }
    return result;
  }, [user?.id, loadAll]);

  // ━━━ ACCEPTER DEMANDE ━━━
  const acceptRequest = useCallback(async (friendshipId) => {
    if (!user?.id) return;
    setPendingRequests(prev => prev.filter(r => r.id !== friendshipId));
    await friendService.acceptFriendRequest(friendshipId, user.id);
    await loadAll();
  }, [user?.id, loadAll]);

  // ━━━ SUPPRIMER AMI ━━━
  const removeFriendById = useCallback(async (friendshipId) => {
    setFriends(prev => prev.filter(f => f.friendshipId !== friendshipId));
    await friendService.removeFriend(friendshipId);
    await loadAll();
  }, [loadAll]);

  // ━━━ LOG VUE COMPATIBILITÉ ━━━
  const logView = useCallback(async (viewedUserId) => {
    if (!user?.id || user.id === viewedUserId) return;
    await friendService.logCompatibilityView(user.id, viewedUserId);
  }, [user?.id]);

  // ━━━ GÉNÉRER LIEN DE PARTAGE ━━━
  const getShareLink = useCallback(() => {
    if (!profile?.share_token) return null;
    return `${window.location.origin}/invite/${profile.share_token}`;
  }, [profile]);

  // ━━━ EXPOSER ━━━
  return {
    friends,
    pendingRequests,
    activityFeed,
    searchResults,
    searchLoading,
    loading: loading || profileLoading,
    error,
    setSearchResults,
    searchUser,
    addFriend,
    acceptRequest,
    removeFriend: removeFriendById,
    getCompatibilityWith,
    logView,
    getShareLink,
    refreshFriends: loadAll
  };
};

export { useFriends };
export default useFriends;