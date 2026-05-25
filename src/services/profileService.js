import { supabase } from '../lib/supabase';

export async function saveProfile(userId, profileData) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([
        {
          id: userId,
          ...profileData,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    // Si data est null sans erreur → profil pas encore accessible
    // (timing Supabase au démarrage) → on traite comme erreur retriable
    if (!data) throw new Error('PROFILE_NOT_FOUND');

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}