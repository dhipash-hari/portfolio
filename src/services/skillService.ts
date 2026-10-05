import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Skill } from '../types/portfolio';
import { initialSkills } from '../data/initialData';

const LOCAL_STORAGE_KEY_SKILLS = 'dhipash_portfolio_skills';

const getLocalSkills = (): Skill[] => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_SKILLS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return initialSkills;
};

const saveLocalSkills = (skills: Skill[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_SKILLS, JSON.stringify(skills));
};

export const getSkills = async (): Promise<Skill[]> => {
  console.log('skillService: getSkills starting...');
  
  if (isSupabaseConfigured() && supabase) {
    console.log('skillService: Attempting Supabase fetch...');
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });
        
      if (error) {
        console.warn('skillService: Supabase query error:', error.message);
      } else if (data && data.length > 0) {
        console.log('skillService: Successfully fetched skills from Supabase, count:', data.length);
        return data as Skill[];
      } else {
        console.log('skillService: No skills data in Supabase');
      }
    } catch (err) {
      console.warn('skillService: Supabase fetch exception:', err);
    }
  } else {
    console.log('skillService: Supabase not configured, using local data');
  }

  console.log('skillService: Using local/initial skills data');
  const localSkills = getLocalSkills();
  console.log('skillService: Local skills count:', localSkills.length);
  return localSkills;
};

export const createSkill = async (skill: Omit<Skill, 'id'>): Promise<Skill> => {
  const newId = `s-${Date.now()}`;
  const newSkill: Skill = { ...skill, id: newId };

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('skills')
      .insert([skill])
      .select()
      .single();
    if (error) throw error;
    return data as Skill;
  }

  const list = getLocalSkills();
  const updated = [...list, newSkill];
  saveLocalSkills(updated);
  return newSkill;
};

export const updateSkill = async (id: string, updates: Partial<Skill>): Promise<Skill> => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Skill;
  }

  const list = getLocalSkills();
  const updated = list.map(s => (s.id === id ? { ...s, ...updates } : s));
  saveLocalSkills(updated);
  const found = updated.find(s => s.id === id);
  if (!found) throw new Error('Skill not found');
  return found;
};

export const deleteSkill = async (id: string): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  const list = getLocalSkills();
  const updated = list.filter(s => s.id !== id);
  saveLocalSkills(updated);
};
