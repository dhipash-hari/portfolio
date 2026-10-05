export type SkillCategory = 
  | 'Programming' 
  | 'AI / ML' 
  | 'Data' 
  | 'Frontend' 
  | 'Design' 
  | 'Motion' 
  | 'Tools';

export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  profile_image_url?: string | null;
  resume_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  site_description: string;
  accent_color: string;
  hero_badge: string;
  hero_headline: string;
  hero_supporting_copy: string;
  resume_url?: string | null;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  icon?: string;
  url?: string;
  proficiency_label?: string;
  featured: boolean;
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string;
  problem?: string;
  solution?: string;
  features?: string[];
  technologies: string[];
  image_url?: string | null;
  gallery?: string[];
  video_url?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  description: string;
  year?: string;
  award_level?: string;
  display_order: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  credential_id?: string;
  credential_url?: string;
  certificate_url?: string;
  description?: string;
  display_order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_year: string;
  end_year: string;
  grade?: string;
  grade_label?: string;
  description?: string;
  display_order: number;
}

export interface Language {
  id: string;
  name: string;
  proficiency?: string;
  display_order: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  display_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  name: string;
  file_path: string;
  public_url: string;
  mime_type?: string;
  size_bytes?: number;
  folder: 'profile' | 'projects' | 'certifications' | 'resume' | 'general';
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  role: 'admin' | 'editor';
  is_active: boolean;
}
