import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project } from '../types/portfolio';
import { initialProjects } from '../data/initialData';

const LOCAL_STORAGE_KEY_PROJECTS = 'dhipash_portfolio_projects';

const getLocalProjects = (): Project[] => {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_PROJECTS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  return initialProjects;
};

const saveLocalProjects = (projects: Project[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_PROJECTS, JSON.stringify(projects));
};

export const getProjects = async (includeDrafts = false): Promise<Project[]> => {
  console.log('projectService: getProjects starting, includeDrafts:', includeDrafts);
  
  if (isSupabaseConfigured() && supabase) {
    console.log('projectService: Attempting Supabase fetch...');
    try {
      let query = supabase.from('projects').select('*').order('display_order', { ascending: true });
      if (!includeDrafts) {
        query = query.eq('published', true);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.warn('projectService: Supabase query error:', error.message);
      } else if (data && data.length > 0) {
        console.log('projectService: Successfully fetched projects from Supabase, count:', data.length);
        return data as Project[];
      } else {
        console.log('projectService: No project data in Supabase');
      }
    } catch (err) {
      console.warn('projectService: Supabase fetch exception:', err);
    }
  } else {
    console.log('projectService: Supabase not configured, using local data');
  }

  // Try localStorage
  console.log('projectService: Trying localStorage...');
  const list = getLocalProjects();
  const filteredList = includeDrafts ? list : list.filter(p => p.published);
  console.log('projectService: Using local/initial data, count:', filteredList.length);
  return filteredList;
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) return data as Project;
    } catch (err) {
      console.warn('Error fetching project slug from Supabase:', err);
    }
  }

  const list = getLocalProjects();
  return list.find(p => p.slug === slug) || null;
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const newId = `p-${Date.now()}`;
  const newProject: Project = {
    ...project,
    id: newId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    if (error) throw error;
    return data as Project;
  }

  const list = getLocalProjects();
  const updated = [newProject, ...list];
  saveLocalProjects(updated);
  return newProject;
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Project;
  }

  const list = getLocalProjects();
  const updated = list.map(p => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
  saveLocalProjects(updated);
  const found = updated.find(p => p.id === id);
  if (!found) throw new Error('Project not found');
  return found;
};

export const deleteProject = async (id: string): Promise<void> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return;
  }

  const list = getLocalProjects();
  const updated = list.filter(p => p.id !== id);
  saveLocalProjects(updated);
};
