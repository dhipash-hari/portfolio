import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Achievement } from '../types/portfolio';
import { initialAchievements } from '../data/initialData';

const LOCAL_STORAGE_KEY_ACHIEVEMENTS = 'dhipash_portfolio_achievements';

const getLocalAchievements = (): Achievement[] => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_ACHIEVEMENTS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return initialAchievements;
};

const saveLocalAchievements = (items: Achievement[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(items));
};

export const getAchievements = async (): Promise<Achievement[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data as Achievement[];
    } catch (err) {
      console.warn('Error fetching achievements from Supabase, using fallback:', err);
    }
  }
  return getLocalAchievements();
};

export const createAchievement = async (item: Omit<Achievement, 'id'>): Promise<Achievement> => {
  const newId = `a-${Date.now()}`;
  const newItem: Achievement = { ...item, id: newId };

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('achievements')
      .insert([item])
      .select()
      .single();
    if (error) throw error;
    return data as Achievement;
  }

  const list = getLocalAchievements();
  const updated = [...list, newItem];
  saveLocalAchievements(updated);
  return newItem;
};

export const updateAchievement = async (id: string, updates: Partial<Achievement>): Promise<Achievement> => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('achievements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Achievement;
  }

  const list = getLocalAchievements();
  const updated = list.map(a => (a.id === id ? { ...a, ...updates } : a));
  saveLocalAchievements(updated);
  const found = updated.find(a => a.id === id);
  if (!found) throw new Error('Achievement not found');
  return found;
};

export const deleteAchievement = async (id: string): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  const list = getLocalAchievements();
  const updated = list.filter(a => a.id !== id);
  saveLocalAchievements(updated);
};
