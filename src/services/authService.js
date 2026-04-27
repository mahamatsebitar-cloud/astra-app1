import { supabase } from '../lib/supabase';

export async function signUp(email, password, nom) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nom } }
    });

    if (error) return { data: null, error };

    const userId = data.user?.id;
    if (userId) {
      // Création du profil initial
      await supabase.from('profiles').upsert({ id: userId, nom: nom });
    }

    return { data: { ...data, userId }, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}