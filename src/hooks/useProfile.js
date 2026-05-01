import { useProfileContext } from '../context/ProfileContext';

export function useProfile(userId) {
  // Ignore userId — on utilise le context global
  // qui contient déjà le profil du user connecté
  return useProfileContext();
}