import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Education, Language, SocialLink } from '../types/portfolio';
import { initialEducation, initialLanguages, initialSocialLinks } from '../data/initialData';

const LOCAL_STORAGE_KEY_EDU = 'dhipash_portfolio_education';
const LOCAL_STORAGE_KEY_LANG = 'dhipash_portfolio_languages';
const LOCAL_STORAGE_KEY_SOCIAL = 'dhipash_portfolio_social';

export const getEducation = async (): Promise<Education[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Education[];
    } catch (err) {
      console.warn('Error fetching education from Supabase:', err);
    }
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_EDU);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }
  return initialEducation;
};

export const updateEducation = async (id: string, updates: Partial<Education>): Promise<Education> => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('education')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Education;
  }

  const current = await getEducation();
  const updated = current.map(e => (e.id === id ? { ...e, ...updates } : e));
  localStorage.setItem(LOCAL_STORAGE_KEY_EDU, JSON.stringify(updated));
  return updated.find(e => e.id === id)!;
};

export const createEducation = async (edu: Omit<Education, 'id'>): Promise<Education> => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('education')
      .insert([edu])
      .select()
      .single();
    if (error) throw error;
    return data as Education;
  }

  const newEdu: Education = { ...edu, id: `edu-${Date.now()}` };
  const current = await getEducation();
  const updated = [...current, newEdu];
  localStorage.setItem(LOCAL_STORAGE_KEY_EDU, JSON.stringify(updated));
  return newEdu;
};

export const deleteEducation = async (id: string): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  const current = await getEducation();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY_EDU, JSON.stringify(updated));
};

export const getLanguages = async (): Promise<Language[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Language[];
    } catch (err) {
      console.warn('Error fetching languages from Supabase:', err);
    }
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_LANG);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }
  return initialLanguages;
};

export const updateLanguages = async (languages: Language[]): Promise<Language[]> => {
  localStorage.setItem(LOCAL_STORAGE_KEY_LANG, JSON.stringify(languages));
  return languages;
};

export const getSocialLinks = async (): Promise<SocialLink[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as SocialLink[];
    } catch (err) {
      console.warn('Error fetching social links from Supabase:', err);
    }
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_SOCIAL);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }
  return initialSocialLinks;
};

export const updateSocialLinks = async (links: SocialLink[]): Promise<SocialLink[]> => {
  localStorage.setItem(LOCAL_STORAGE_KEY_SOCIAL, JSON.stringify(links));
  return links;
};
