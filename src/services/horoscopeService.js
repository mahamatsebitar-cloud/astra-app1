import { supabase } from '../lib/supabase';
import { horoscopesMock } from '../data/astroData';

function getAujourdHui() {
  const date = new Date();
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const jour = String(date.getDate()).padStart(2, '0');
  return `${annee}-${mois}-${jour}`;
}

export async function getHoroscopeDuJour(signe) {
  try {
    const aujourdHui = getAujourdHui();
    // On s'assure que le signe commence par une majuscule pour la base de données
    const signeFormate = signe.charAt(0).toUpperCase() + signe.slice(1).toLowerCase();

    const { data, error } = await supabase
      .from('horoscopes')
      .select('*')
      .eq('signe', signeFormate)
      .eq('date', aujourdHui)
      .single();

    // PGRST116 est l'erreur "aucun résultat trouvé", on ne veut pas lever d'exception ici
    if (error && error.code !== 'PGRST116') throw error;

    if (data) {
      return { data, error: null };
    }

    // Fallback sur les données Mock si la base est vide pour aujourd'hui
    const mockData = horoscopesMock.find((h) => h.signe === signeFormate);

    if (!mockData) {
      throw new Error(`Aucun horoscope trouvé pour le signe ${signeFormate}`);
    }

    return {
      data: {
        ...mockData,
        date: aujourdHui,
      },
      error: null,
    };
  } catch (error) {
    console.error("Erreur Horoscope:", error);
    return { data: null, error };
  }
}

export async function getHoroscopeParSigne(signe, date) {
  try {
    const { data, error } = await supabase
      .from('horoscopes')
      .select('*')
      .eq('signe', signe)
      .eq('date', date)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}