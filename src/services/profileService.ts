import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile, SiteSettings } from '../types/portfolio';
import { initialProfile, initialSiteSettings } from '../data/initialData';

const LOCAL_STORAGE_KEY_PROFILE = 'dhipash_portfolio_profile';
const LOCAL_STORAGE_KEY_SETTINGS = 'dhipash_portfolio_settings';

export const getProfile = async (): Promise<Profile> => {
  console.log('profileService: getProfile starting...');
  
  if (isSupabaseConfigured() && supabase) {
    console.log('profileService: Attempting Supabase fetch...');
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      if (error) {
        console.warn('profileService: Supabase query error:', error.message);
      } else if (data && data.length > 0) {
        console.log('profileService: Successfully fetched profile from Supabase');
        return data[0] as Profile;
      } else {
        console.log('profileService: No profile data in Supabase');
      }
    } catch (err) {
      console.warn('profileService: Supabase fetch exception:', err);
    }
  } else {
    console.log('profileService: Supabase not configured, skipping...');
  }

  // Try localStorage
  console.log('profileService: Trying localStorage...');
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    if (cached) {
      const parsed = JSON.parse(cached);
      console.log('profileService: Found cached profile data');
      return parsed;
    }
  } catch (err) {
    console.warn('profileService: LocalStorage parse error:', err);
  }
  
  console.log('profileService: Using initial profile data as fallback');
  return initialProfile;
};

export const updateProfile = async (profileUpdates: Partial<Profile>): Promise<Profile> => {
  if (isSupabaseConfigured() && supabase) {
    // 1. Get existing profile row from Supabase
    const { data: existingRows } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    const existingProfile = existingRows && existingRows.length > 0 ? existingRows[0] : null;
    const targetId = existingProfile?.id || profileUpdates.id || initialProfile.id;

    if (existingProfile) {
      // Update existing record
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId)
        .select();

      if (error) throw error;
      if (data && data.length > 0) return data[0] as Profile;
    } else {
      // Insert if no profile row existed yet
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          ...initialProfile,
          ...profileUpdates,
          id: targetId,
          updated_at: new Date().toISOString(),
        }])
        .select();

      if (error) throw error;
      if (data && data.length > 0) return data[0] as Profile;
    }
  }

  // Fallback to local storage update
  const current = await getProfile();
  const updated = { ...current, ...profileUpdates, updated_at: new Date().toISOString() };
  localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(updated));
  return updated;
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  console.log('profileService: getSiteSettings starting...');
  
  if (isSupabaseConfigured() && supabase) {
    console.log('profileService: Attempting Supabase settings fetch...');
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1);

      if (error) {
        console.warn('profileService: Supabase settings query error:', error.message);
      } else if (data && data.length > 0) {
        console.log('profileService: Successfully fetched settings from Supabase');
        return data[0] as SiteSettings;
      } else {
        console.log('profileService: No settings data in Supabase');
      }
    } catch (err) {
      console.warn('profileService: Supabase settings fetch exception:', err);
    }
  } else {
    console.log('profileService: Supabase not configured for settings');
  }

  // Try localStorage
  console.log('profileService: Trying localStorage for settings...');
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
    if (cached) {
      const parsed = JSON.parse(cached);
      console.log('profileService: Found cached settings data');
      return parsed;
    }
  } catch (err) {
    console.warn('profileService: Settings localStorage parse error:', err);
  }
  
  console.log('profileService: Using initial settings data as fallback');
  return initialSiteSettings;
};

export const updateSiteSettings = async (settingsUpdates: Partial<SiteSettings>): Promise<SiteSettings> => {
  if (isSupabaseConfigured() && supabase) {
    const { data: existingRows } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1);

    const existingSettings = existingRows && existingRows.length > 0 ? existingRows[0] : null;
    const targetId = existingSettings?.id || settingsUpdates.id || initialSiteSettings.id;

    if (existingSettings) {
      const { data, error } = await supabase
        .from('site_settings')
        .update({
          ...settingsUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetId)
        .select();

      if (error) throw error;
      if (data && data.length > 0) return data[0] as SiteSettings;
    } else {
      const { data, error } = await supabase
        .from('site_settings')
        .insert([{
          ...initialSiteSettings,
          ...settingsUpdates,
          id: targetId,
          updated_at: new Date().toISOString(),
        }])
        .select();

      if (error) throw error;
      if (data && data.length > 0) return data[0] as SiteSettings;
    }
  }

  const current = await getSiteSettings();
  const updated = { ...current, ...settingsUpdates, updated_at: new Date().toISOString() };
  localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updated));
  return updated;
};
