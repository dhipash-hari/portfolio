import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Certification } from '../types/portfolio';
import { initialCertifications } from '../data/initialData';

const LOCAL_STORAGE_KEY_CERTS = 'dhipash_portfolio_certifications';

const getLocalCertifications = (): Certification[] => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_CERTS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return initialCertifications;
};

const saveLocalCertifications = (items: Certification[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_CERTS, JSON.stringify(items));
};

export const getCertifications = async (): Promise<Certification[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Certification[];
    } catch (err) {
      console.warn('Error fetching certifications from Supabase, using fallback:', err);
    }
  }
  return getLocalCertifications();
};

export const createCertification = async (item: Omit<Certification, 'id'>): Promise<Certification> => {
  const newId = `c-${Date.now()}`;
  const newItem: Certification = { ...item, id: newId };

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('certifications')
      .insert([item])
      .select()
      .single();
    if (error) throw error;
    return data as Certification;
  }

  const list = getLocalCertifications();
  const updated = [...list, newItem];
  saveLocalCertifications(updated);
  return newItem;
};

export const updateCertification = async (id: string, updates: Partial<Certification>): Promise<Certification> => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('certifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Certification;
  }

  const list = getLocalCertifications();
  const updated = list.map(c => (c.id === id ? { ...c, ...updates } : c));
  saveLocalCertifications(updated);
  const found = updated.find(c => c.id === id);
  if (!found) throw new Error('Certification not found');
  return found;
};

export const deleteCertification = async (id: string): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  const list = getLocalCertifications();
  const updated = list.filter(c => c.id !== id);
  saveLocalCertifications(updated);
};
