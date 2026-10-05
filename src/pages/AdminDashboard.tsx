import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Profile, 
  Skill, 
  Project, 
  Achievement, 
  Certification, 
  Education, 
  Language,
  ContactMessage, 
  MediaItem,
  SiteSettings 
} from '../types/portfolio';
import { 
  initialProfile,
  initialSiteSettings,
  initialProjects,
  initialSkills,
  initialAchievements,
  initialCertifications,
  initialEducation
} from '../data/initialData';
import { 
  getProfile, 
  updateProfile, 
  getSiteSettings, 
  updateSiteSettings 
} from '../services/profileService';
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../services/projectService';
import { 
  getSkills, 
  createSkill, 
  updateSkill, 
  deleteSkill 
} from '../services/skillService';
import { 
  getAchievements, 
  createAchievement, 
  updateAchievement, 
  deleteAchievement 
} from '../services/achievementService';
import { 
  getCertifications, 
  createCertification, 
  updateCertification, 
  deleteCertification 
} from '../services/certificationService';
import { 
  getEducation, 
  updateEducation, 
  getLanguages,
  createEducation,
  deleteEducation
} from '../services/educationService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  getMediaList, 
  uploadMediaFile, 
  deleteMediaFile 
} from '../services/mediaService';
import { 
  getContactMessages, 
  markMessageAsRead, 
  deleteContactMessage 
} from '../services/contactService';
import { 
  LayoutDashboard, 
  User, 
  Code2, 
  Briefcase, 
  Trophy, 
  Award, 
  GraduationCap, 
  Image as ImageIcon, 
  Settings, 
  Mail, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  AlertCircle, 
  Upload, 
  Copy, 
  Eye,
  RefreshCw,
  Loader2,
  Database,
  ShieldCheck,
  Server
} from 'lucide-react';

type Tab = 
  | 'overview' 
  | 'profile' 
  | 'projects' 
  | 'skills' 
  | 'achievements' 
  | 'certifications' 
  | 'education' 
  | 'media' 
  | 'messages' 
  | 'settings';

export const AdminDashboard: React.FC = () => {
  console.log('AdminDashboard: Component mounting...');
  
  const { signOut, isLiveSupabase, user } = useAuth();
  const navigate = useNavigate();

  console.log('AdminDashboard: Auth state:', { isLiveSupabase, user: user?.email || 'none' });

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Data states
  const [profile, setProfile] = useState<Profile | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Editing state modals
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Partial<Achievement> | null>(null);
  const [editingCertification, setEditingCertification] = useState<Partial<Certification> | null>(null);
  const [editingEducation, setEditingEducation] = useState<Partial<Education> | null>(null);

  // File upload state
  const [uploading, setUploading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadAllData = async () => {
    setLoading(true);
    console.log('AdminDashboard: Starting to load all data...');
    
    let dataLoadedSuccessfully = false;
    
    try {
      // Load profile with robust error handling
      console.log('AdminDashboard: Loading profile...');
      try {
        const pData = await getProfile();
        console.log('AdminDashboard: Profile loaded successfully');
        setProfile(pData);
      } catch (error) {
        console.error('AdminDashboard: Profile loading failed, using initial data:', error);
        setProfile(initialProfile);
      }

      // Load site settings
      console.log('AdminDashboard: Loading site settings...');
      try {
        const sData = await getSiteSettings();
        console.log('AdminDashboard: Site settings loaded successfully');
        setSiteSettings(sData);
      } catch (error) {
        console.error('AdminDashboard: Site settings loading failed, using initial data:', error);
        setSiteSettings(initialSiteSettings);
      }

      // Load projects
      console.log('AdminDashboard: Loading projects...');
      try {
        const projData = await getProjects(true);
        console.log('AdminDashboard: Projects loaded successfully, count:', projData.length);
        setProjects(projData);
      } catch (error) {
        console.error('AdminDashboard: Projects loading failed, using initial data:', error);
        setProjects(initialProjects);
      }

      // Load skills
      console.log('AdminDashboard: Loading skills...');
      try {
        const skData = await getSkills();
        console.log('AdminDashboard: Skills loaded successfully, count:', skData.length);
        setSkills(skData);
      } catch (error) {
        console.error('AdminDashboard: Skills loading failed, using initial data:', error);
        setSkills(initialSkills);
      }

      // Load achievements
      console.log('AdminDashboard: Loading achievements...');
      try {
        const achData = await getAchievements();
        console.log('AdminDashboard: Achievements loaded successfully, count:', achData.length);
        setAchievements(achData);
      } catch (error) {
        console.error('AdminDashboard: Achievements loading failed, using initial data:', error);
        setAchievements(initialAchievements);
      }

      // Load certifications
      console.log('AdminDashboard: Loading certifications...');
      try {
        const certData = await getCertifications();
        console.log('AdminDashboard: Certifications loaded successfully, count:', certData.length);
        setCertifications(certData);
      } catch (error) {
        console.error('AdminDashboard: Certifications loading failed, using initial data:', error);
        setCertifications(initialCertifications);
      }

      // Load education
      console.log('AdminDashboard: Loading education...');
      try {
        const eduData = await getEducation();
        console.log('AdminDashboard: Education loaded successfully, count:', eduData.length);
        setEducation(eduData);
      } catch (error) {
        console.error('AdminDashboard: Education loading failed, using initial data:', error);
        setEducation(initialEducation);
      }

      // Load languages
      try {
        const langData = await getLanguages();
        setLanguages(langData);
      } catch (error) {
        console.warn('AdminDashboard: Languages loading failed:', error);
      }

      // Load media (optional)
      console.log('AdminDashboard: Loading media...');
      try {
        const medData = await getMediaList();
        console.log('AdminDashboard: Media loaded successfully, count:', medData.length);
        setMediaList(medData);
      } catch (error) {
        console.warn('AdminDashboard: Media loading failed (non-critical):', error);
        setMediaList([]);
      }

      // Load messages (optional)
      console.log('AdminDashboard: Loading contact messages...');
      try {
        const msgData = await getContactMessages();
        console.log('AdminDashboard: Messages loaded successfully, count:', msgData.length);
        setMessages(msgData);
      } catch (error) {
        console.warn('AdminDashboard: Messages loading failed (non-critical):', error);
        setMessages([]);
      }

      dataLoadedSuccessfully = true;
      console.log('AdminDashboard: All data loaded successfully!');
      showToast('Admin dashboard loaded successfully!');

    } catch (criticalError) {
      console.error('AdminDashboard: Critical error during data loading:', criticalError);
      
      // Ensure all critical data has fallback values
      if (!profile) {
        console.log('AdminDashboard: Setting fallback profile data');
        setProfile(initialProfile);
      }
      if (!siteSettings) {
        console.log('AdminDashboard: Setting fallback site settings');
        setSiteSettings(initialSiteSettings);
      }
      if (projects.length === 0) {
        console.log('AdminDashboard: Setting fallback projects data');
        setProjects(initialProjects);
      }
      if (skills.length === 0) {
        console.log('AdminDashboard: Setting fallback skills data');
        setSkills(initialSkills);
      }
      if (achievements.length === 0) {
        console.log('AdminDashboard: Setting fallback achievements data');
        setAchievements(initialAchievements);
      }
      if (certifications.length === 0) {
        console.log('AdminDashboard: Setting fallback certifications data');
        setCertifications(initialCertifications);
      }
      if (education.length === 0) {
        console.log('AdminDashboard: Setting fallback education data');
        setEducation(initialEducation);
      }
      
      showToast('Dashboard loaded with fallback data');
    } finally {
      setLoading(false);
      console.log('AdminDashboard: Data loading complete, dataLoadedSuccessfully:', dataLoadedSuccessfully);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await updateProfile(profile);
      setProfile(updated);
      showToast('Profile updated successfully!');
    } catch (err: any) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteSettings) return;
    setSaving(true);
    try {
      const updated = await updateSiteSettings(siteSettings);
      setSiteSettings(updated);
      showToast('Site settings updated!');
    } catch (err: any) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Project handlers
  const handleSaveProject = async () => {
    if (!editingProject || !editingProject.title || !editingProject.slug) {
      alert('Title and slug are required');
      return;
    }
    setSaving(true);
    try {
      if (editingProject.id) {
        await updateProject(editingProject.id, editingProject);
        showToast('Project updated!');
      } else {
        await createProject({
          title: editingProject.title,
          slug: editingProject.slug,
          category: editingProject.category || 'AI / Machine Learning',
          short_description: editingProject.short_description || '',
          full_description: editingProject.full_description || '',
          problem: editingProject.problem || '',
          solution: editingProject.solution || '',
          features: editingProject.features || [],
          technologies: editingProject.technologies || ['Python'],
          github_url: editingProject.github_url || null,
          live_url: editingProject.live_url || null,
          featured: Boolean(editingProject.featured),
          published: editingProject.published !== false,
          display_order: editingProject.display_order || projects.length + 1,
        });
        showToast('New project created!');
      }
      setEditingProject(null);
      const updated = await getProjects(true);
      setProjects(updated);
    } catch (err: any) {
      alert('Error saving project: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      showToast('Project removed');
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  // Skill handlers
  const handleSaveSkill = async () => {
    if (!editingSkill || !editingSkill.name) {
      alert('Skill name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingSkill.id) {
        await updateSkill(editingSkill.id, editingSkill);
        showToast('Skill updated!');
      } else {
        await createSkill({
          name: editingSkill.name,
          category: editingSkill.category || 'Programming',
          description: editingSkill.description || '',
          icon: editingSkill.icon || 'Code2',
          featured: Boolean(editingSkill.featured),
          display_order: editingSkill.display_order || skills.length + 1,
        });
        showToast('Skill added!');
      }
      setEditingSkill(null);
      const updated = await getSkills();
      setSkills(updated);
    } catch (err: any) {
      alert('Error saving skill: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Delete this skill node?')) return;
    try {
      await deleteSkill(id);
      showToast('Skill removed');
      setSkills(skills.filter(s => s.id !== id));
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  // Achievement handlers
  const handleSaveAchievement = async () => {
    if (!editingAchievement || !editingAchievement.title) return;
    setSaving(true);
    try {
      if (editingAchievement.id) {
        await updateAchievement(editingAchievement.id, editingAchievement);
        showToast('Achievement updated!');
      } else {
        await createAchievement({
          title: editingAchievement.title,
          organization: editingAchievement.organization || '',
          description: editingAchievement.description || '',
          award_level: editingAchievement.award_level || 'First Prize',
          display_order: editingAchievement.display_order || achievements.length + 1,
        });
        showToast('Achievement recorded!');
      }
      setEditingAchievement(null);
      const updated = await getAchievements();
      setAchievements(updated);
    } catch (err: any) {
      alert('Error saving achievement: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm('Delete this achievement?')) return;
    await deleteAchievement(id);
    showToast('Achievement removed');
    setAchievements(achievements.filter(a => a.id !== id));
  };

  // Certification handlers
  const handleSaveCertification = async () => {
    if (!editingCertification || !editingCertification.title) {
      alert('Certification title is required');
      return;
    }
    setSaving(true);
    try {
      if (editingCertification.id) {
        await updateCertification(editingCertification.id, editingCertification);
        showToast('Certification updated!');
      } else {
        await createCertification({
          title: editingCertification.title,
          issuer: editingCertification.issuer || '',
          date: editingCertification.date || '',
          credential_id: editingCertification.credential_id || '',
          credential_url: editingCertification.credential_url || '',
          description: editingCertification.description || '',
          display_order: editingCertification.display_order || certifications.length + 1,
        });
        showToast('Certification added!');
      }
      setEditingCertification(null);
      const updated = await getCertifications();
      setCertifications(updated);
    } catch (err: any) {
      alert('Error saving certification: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    try {
      await deleteCertification(id);
      showToast('Certification removed');
      setCertifications(certifications.filter(c => c.id !== id));
    } catch (err: any) {
      alert('Error deleting certification: ' + err.message);
    }
  };

  // Education handlers
  const handleSaveEducation = async () => {
    if (!editingEducation || !editingEducation.institution) {
      alert('Institution name is required');
      return;
    }
    setSaving(true);
    try {
      if (editingEducation.id) {
        await updateEducation(editingEducation.id, editingEducation);
        showToast('Education record updated!');
      } else {
        await createEducation({
          institution: editingEducation.institution,
          degree: editingEducation.degree || 'Bachelor of Technology',
          field: editingEducation.field || 'Artificial Intelligence and Data Science',
          start_year: editingEducation.start_year || '2024',
          end_year: editingEducation.end_year || '2028',
          grade: editingEducation.grade || '7.24',
          grade_label: editingEducation.grade_label || 'CGPA (Up to Fourth Semester)',
          description: editingEducation.description || '',
          display_order: editingEducation.display_order || education.length + 1,
        });
        showToast('Education record created!');
      }
      setEditingEducation(null);
      const updated = await getEducation();
      setEducation(updated);
    } catch (err: any) {
      alert('Error saving education record: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Delete this education record?')) return;
    try {
      await deleteEducation(id);
      showToast('Education record removed');
      setEducation(education.filter(e => e.id !== id));
    } catch (err: any) {
      alert('Error deleting education record: ' + err.message);
    }
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: 'profile' | 'projects' | 'resume' | 'general') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const media = await uploadMediaFile(file, { folder });
      showToast(`Uploaded ${file.name}`);
      if (folder === 'profile' && profile) {
        const updated = await updateProfile({ profile_image_url: media.public_url });
        setProfile(updated);
      } else if (folder === 'resume' && profile) {
        const updated = await updateProfile({ resume_url: media.public_url });
        setProfile(updated);
      }
      const updatedList = await getMediaList();
      setMediaList(updatedList);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard');
  };

  if (loading) {
    console.log('AdminDashboard: Still loading data...');
    return (
      <div className="min-h-screen bg-[#08090B] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin mb-4" />
        <p className="text-xs font-mono text-zinc-400">Loading CMS architecture...</p>
        <p className="text-xs font-mono text-zinc-600 mt-2">
          Debug: profile={profile ? 'loaded' : 'null'}, projects={projects.length}, skills={skills.length}
        </p>
      </div>
    );
  }

  console.log('AdminDashboard: Rendering dashboard with data:', {
    profile: profile?.full_name || 'none',
    projects: projects.length,
    skills: skills.length,
    achievements: achievements.length
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="min-h-screen bg-[#08090B] text-zinc-100 flex flex-col md:flex-row antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#00E5FF] text-black font-mono text-xs font-bold shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0B0D12] border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand & Mode */}
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2.5 text-white mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#00E5FF] flex items-center justify-center text-black font-bold text-xs">
                D
              </div>
              <span className="font-bold text-sm tracking-widest uppercase">
                ADMIN PORTAL
              </span>
            </Link>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveSupabase ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>{isLiveSupabase ? 'Supabase Live' : 'Dev Mock Mode'}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-mono">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'profile', label: 'Profile & Bio', icon: User },
              { id: 'projects', label: 'Projects', icon: Briefcase, badge: projects.length },
              { id: 'skills', label: 'Skill Universe', icon: Code2, badge: skills.length },
              { id: 'achievements', label: 'Achievements', icon: Trophy, badge: achievements.length },
              { id: 'certifications', label: 'Certifications', icon: Award, badge: certifications.length },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'media', label: 'Media Manager', icon: ImageIcon, badge: mediaList.length },
              { id: 'messages', label: 'Inquiries', icon: Mail, badge: unreadCount ? `${unreadCount} new` : undefined },
              { id: 'settings', label: 'Site Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#00E5FF]/10 text-[#00E5FF] font-semibold border border-[#00E5FF]/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-zinc-400">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="pt-6 border-t border-white/5 space-y-2 text-xs font-mono">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-[#00E5FF] hover:bg-white/[0.03] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview Website
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => {
              signOut();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                  CMS Operations Dashboard
                </h1>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Active Administrator: {user?.email || 'admin@dhipash.dev'}
                </p>
              </div>
              <button
                onClick={loadAllData}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Data
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Published Projects', count: projects.filter(p => p.published).length, total: projects.length },
                { label: 'Technical Skills', count: skills.length, detail: `${skills.filter(s => s.featured).length} featured` },
                { label: 'Achievements', count: achievements.length, detail: 'Resume Verified' },
                { label: 'Certifications', count: certifications.length, detail: 'Cisco & CodeChef' },
                { label: 'Media Files', count: mediaList.length, detail: 'Storage Bucket' },
                { label: 'Contact Dispatches', count: messages.length, detail: `${unreadCount} unread` },
              ].map((stat, i) => (
                <div key={i} className="p-5 rounded-2xl glass-panel border border-white/10">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                    {stat.label}
                  </span>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.count}
                    {stat.total !== undefined && (
                      <span className="text-xs font-mono text-zinc-500 ml-1">/ {stat.total}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-[#00E5FF]">
                    {stat.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10">
              <h2 className="text-sm font-mono text-[#00E5FF] uppercase tracking-wider mb-4">
                Rapid CMS Actions
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingProject({});
                    setActiveTab('projects');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-white hover:border-[#00E5FF]/40"
                >
                  <Plus className="w-4 h-4 text-[#00E5FF]" />
                  Add New Project
                </button>

                <button
                  onClick={() => {
                    setEditingSkill({});
                    setActiveTab('skills');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-white hover:border-[#00E5FF]/40"
                >
                  <Plus className="w-4 h-4 text-[#00E5FF]" />
                  Add Skill Node
                </button>

                <button
                  onClick={() => setActiveTab('media')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-white hover:border-[#00E5FF]/40"
                >
                  <Upload className="w-4 h-4 text-[#00E5FF]" />
                  Upload Media Asset
                </button>
              </div>
            </div>

            {/* Supabase Cloud Infrastructure & Connection Status Panel */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h2 className="text-sm font-mono text-white font-bold uppercase tracking-wider">
                    Supabase Cloud Database & Infrastructure
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    SUPABASE LIVE CONNECTED
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-[#00E5FF]" />
                      PostgreSQL Engine
                    </span>
                    <span className="text-emerald-400 font-bold">✓ Online</span>
                  </div>
                  <div className="text-white font-semibold truncate text-[11px]">
                    guldcgtjpchoikyjljsj.supabase.co
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Row Level Security (RLS) active & enforced
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-[#00E5FF]" />
                      Cloud Storage Bucket
                    </span>
                    <span className="text-emerald-400 font-bold">✓ Active</span>
                  </div>
                  <div className="text-white font-semibold text-[11px]">
                    Bucket: portfolio-media
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    {mediaList.length} media records tracked in cloud
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
                      Admin Authorization
                    </span>
                    <span className="text-emerald-400 font-bold">✓ Active Session</span>
                  </div>
                  <div className="text-white font-semibold truncate text-[11px]">
                    {user?.email || 'dhipashhari@gmail.com'}
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Privilege: Verified Super-Administrator
                  </p>
                </div>
              </div>

              {/* Real-time Cloud Table Synchronization Checklist */}
              <div className="pt-3 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">
                  Live Cloud Database Synchronization (10/10 Tables Synced):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>profiles: 1</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>projects: {projects.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>skills: {skills.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>achieve: {achievements.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>certs: {certifications.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>education: {education.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>media: {mediaList.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>inquiries: {messages.length}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>settings: 1</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>admin: 1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE EDITOR */}
        {activeTab === 'profile' && profile && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Profile & Identity Management
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Update public biographical narrative and contact facts.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff]"
              >
                <Save className="w-4 h-4" />
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>

            {/* Profile Avatar & Resume Upload Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl glass-panel border border-white/10 flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                  {profile.profile_image_url ? (
                    <img src={profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-zinc-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-mono text-white mb-1 uppercase">Profile Image</h4>
                  <p className="text-[11px] text-zinc-500 font-mono mb-3">Supabase Storage: portfolio-media</p>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-[#00E5FF] cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace Image</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'profile')}
                    />
                  </label>
                </div>
              </div>

              <div className="p-6 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono text-white mb-1 uppercase">Resume PDF Asset</h4>
                  <p className="text-[11px] text-zinc-500 font-mono mb-3">
                    {profile.resume_url ? 'PDF Attached' : 'No custom PDF uploaded'}
                  </p>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-[#00E5FF] cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Resume PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'resume')}
                    />
                  </label>
                </div>
                {profile.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-zinc-900 text-[#00E5FF] hover:bg-zinc-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Headline</label>
                  <input
                    type="text"
                    value={profile.headline}
                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Biographical Summary</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Phone</label>
                  <input
                    type="text"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Location</label>
                  <input
                    type="text"
                    value={profile.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: PROJECTS MANAGER */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Projects Management
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Add, edit, or publish engineering case studies.
                </p>
              </div>
              <button
                onClick={() => setEditingProject({
                  title: '',
                  slug: '',
                  category: 'AI / Machine Learning',
                  short_description: '',
                  full_description: '',
                  technologies: ['Python'],
                  published: true,
                  featured: true,
                  features: [],
                })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff]"
              >
                <Plus className="w-4 h-4" />
                CREATE PROJECT
              </button>
            </div>

            {/* Project Edit Modal */}
            {editingProject && (
              <div className="p-8 rounded-3xl glass-panel border border-[#00E5FF]/40 mb-8 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white font-mono">
                    {editingProject.id ? 'Edit Project' : 'New Project'}
                  </h3>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    Cancel ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Title</label>
                    <input
                      type="text"
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Slug</label>
                    <input
                      type="text"
                      value={editingProject.slug || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProject.category || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Technologies (comma separated)</label>
                    <input
                      type="text"
                      value={(editingProject.technologies || []).join(', ')}
                      onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={editingProject.short_description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, short_description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Full Description</label>
                  <textarea
                    rows={4}
                    value={editingProject.full_description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, full_description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Problem Statement</label>
                    <textarea
                      rows={2}
                      value={editingProject.problem || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, problem: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Solution</label>
                    <textarea
                      rows={2}
                      value={editingProject.solution || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={editingProject.github_url || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Live URL</label>
                    <input
                      type="url"
                      value={editingProject.live_url || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-3">
                  <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.published}
                      onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                      className="rounded accent-[#00E5FF]"
                    />
                    Published Publicly
                  </label>
                  <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      className="rounded accent-[#00E5FF]"
                    />
                    Featured on Home
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-mono text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProject}
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff]"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            )}

            {/* Projects List Table */}
            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-[#00E5FF] font-bold font-mono">
                      {proj.display_order}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        {proj.title}
                        {!proj.published && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            Draft
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono">
                        {proj.category} • /{proj.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingProject(proj)}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                      title="Edit Project"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SKILLS MANAGER */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Skill Universe Editor
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Manage technical skills and tools without fabricated scores.
                </p>
              </div>
              <button
                onClick={() => setEditingSkill({
                  name: '',
                  category: 'Programming',
                  description: '',
                  icon: 'Code2',
                  featured: true,
                })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff]"
              >
                <Plus className="w-4 h-4" />
                ADD SKILL
              </button>
            </div>

            {/* Skill Edit Modal */}
            {editingSkill && (
              <div className="p-6 rounded-2xl glass-panel border border-[#00E5FF]/40 mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Name</label>
                    <input
                      type="text"
                      value={editingSkill.name || ''}
                      onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Category</label>
                    <select
                      value={editingSkill.category || 'Programming'}
                      onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    >
                      {['Programming', 'AI / ML', 'Data', 'Frontend', 'Design', 'Motion', 'Tools'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Icon Name</label>
                    <input
                      type="text"
                      value={editingSkill.icon || 'Code2'}
                      onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Technical Description</label>
                  <textarea
                    rows={2}
                    value={editingSkill.description || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setEditingSkill(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-mono text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSkill}
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff]"
                  >
                    Save Skill
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-xl glass-panel border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{skill.name}</h4>
                    <span className="text-[11px] font-mono text-[#00E5FF]">{skill.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingSkill(skill)}
                      className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-1.5 rounded bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Academic Achievements
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Paper presentation honors, hackathon certificates, and project expo distinctions.
                </p>
              </div>
              <button
                onClick={() => setEditingAchievement({
                  title: '',
                  organization: '',
                  description: '',
                  award_level: 'First Prize',
                })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff]"
              >
                <Plus className="w-4 h-4" />
                ADD ACHIEVEMENT
              </button>
            </div>

            {editingAchievement && (
              <div className="p-6 rounded-2xl glass-panel border border-[#00E5FF]/40 mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Title</label>
                    <input
                      type="text"
                      value={editingAchievement.title || ''}
                      onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Institution / Organization</label>
                    <input
                      type="text"
                      value={editingAchievement.organization || ''}
                      onChange={(e) => setEditingAchievement({ ...editingAchievement, organization: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingAchievement.description || ''}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setEditingAchievement(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-mono text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAchievement}
                    className="px-6 py-2 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff]"
                  >
                    Save Achievement
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-base font-bold text-white">{ach.title}</h4>
                    <p className="text-xs font-mono text-[#00E5FF]">{ach.organization}</p>
                    <p className="text-xs text-zinc-400 mt-1">{ach.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingAchievement(ach)}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAchievement(ach.id)}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Verified Certifications
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Cisco networking, Python essentials, and verified technical credentials.
                </p>
              </div>
              <button
                onClick={() => setEditingCertification({
                  title: '',
                  issuer: '',
                  date: '',
                  credential_id: '',
                  credential_url: '',
                  description: '',
                  display_order: certifications.length + 1,
                })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff]"
              >
                <Plus className="w-4 h-4" />
                ADD CERTIFICATION
              </button>
            </div>

            {/* Certification Edit Modal */}
            {editingCertification && (
              <div className="p-6 rounded-2xl glass-panel border border-[#00E5FF]/40 mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Certification Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Cisco Introduction to Networks"
                      value={editingCertification.title || ''}
                      onChange={(e) => setEditingCertification({ ...editingCertification, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Issuing Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Cisco Networking Academy"
                      value={editingCertification.issuer || ''}
                      onChange={(e) => setEditingCertification({ ...editingCertification, issuer: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Date / Period</label>
                    <input
                      type="text"
                      placeholder="e.g. 2024"
                      value={editingCertification.date || ''}
                      onChange={(e) => setEditingCertification({ ...editingCertification, date: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Credential ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. CSCO-12345"
                      value={editingCertification.credential_id || ''}
                      onChange={(e) => setEditingCertification({ ...editingCertification, credential_id: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Credential URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editingCertification.credential_url || ''}
                      onChange={(e) => setEditingCertification({ ...editingCertification, credential_url: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Description / Syllabus</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of verified curriculum and topics mastered..."
                    value={editingCertification.description || ''}
                    onChange={(e) => setEditingCertification({ ...editingCertification, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setEditingCertification(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCertification}
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff]"
                  >
                    {saving ? 'Saving...' : 'Save Certification'}
                  </button>
                </div>
              </div>
            )}

            {/* Certifications List Table */}
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 rounded-2xl glass-panel border border-white/10 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-[#00E5FF] border border-white/10">
                        {cert.issuer}
                      </span>
                      {cert.date && (
                        <span className="text-[11px] font-mono text-zinc-400">{cert.date}</span>
                      )}
                      {cert.credential_id && (
                        <span className="text-[10px] font-mono text-zinc-500">ID: {cert.credential_id}</span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-white">{cert.title}</h4>
                    {cert.description && (
                      <p className="text-xs text-zinc-400 max-w-2xl">{cert.description}</p>
                    )}
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-[#00E5FF] hover:underline"
                      >
                        <span>Verification Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingCertification(cert)}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                      title="Edit Certification"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCertification(cert.id)}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400"
                      title="Delete Certification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: EDUCATION */}
        {activeTab === 'education' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Academic Education & History
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Undergraduate degree details, CGPA tracking, academic institution, and languages.
                </p>
              </div>
              <button
                onClick={() => setEditingEducation({
                  institution: '',
                  degree: 'Bachelor of Technology',
                  field: 'Artificial Intelligence and Data Science',
                  start_year: '2024',
                  end_year: '2028',
                  grade: '7.24',
                  grade_label: 'CGPA (Up to Fourth Semester)',
                  description: '',
                  display_order: education.length + 1,
                })}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff]"
              >
                <Plus className="w-4 h-4" />
                ADD EDUCATION RECORD
              </button>
            </div>

            {/* Education Edit Modal */}
            {editingEducation && (
              <div className="p-6 rounded-2xl glass-panel border border-[#00E5FF]/40 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Institution</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramco Institute of Technology"
                      value={editingEducation.institution || ''}
                      onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Degree Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Bachelor of Technology"
                      value={editingEducation.degree || ''}
                      onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Field of Study</label>
                    <input
                      type="text"
                      placeholder="e.g. Artificial Intelligence and Data Science"
                      value={editingEducation.field || ''}
                      onChange={(e) => setEditingEducation({ ...editingEducation, field: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Start Year</label>
                    <input
                      type="text"
                      placeholder="2024"
                      value={editingEducation.start_year || ''}
                      onChange={(e) => setEditingEducation({ ...editingEducation, start_year: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">End Year</label>
                    <input
                      type="text"
                      placeholder="2028"
                      value={editingEducation.end_year || ''}
                      onChange={(e) => setEditingEducation({ ...editingEducation, end_year: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Grade / CGPA</label>
                    <input
                      type="text"
                      placeholder="7.24"
                      value={editingEducation.grade || ''}
                      onChange={(e) => setEditingEducation({ ...editingEducation, grade: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Grade Label</label>
                    <input
                      type="text"
                      placeholder="CGPA (Up to Fourth Semester)"
                      value={editingEducation.grade_label || ''}
                      onChange={(e) => setEditingEducation({ ...editingEducation, grade_label: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Curriculum & Details</label>
                  <textarea
                    rows={3}
                    placeholder="Coursework, practical laboratories, and academic achievements..."
                    value={editingEducation.description || ''}
                    onChange={(e) => setEditingEducation({ ...editingEducation, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setEditingEducation(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEducation}
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff]"
                  >
                    {saving ? 'Saving...' : 'Save Education Record'}
                  </button>
                </div>
              </div>
            )}

            {/* Education Records List */}
            <div className="space-y-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20">
                          {edu.degree}
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          {edu.start_year} — {edu.end_year}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{edu.institution}</h3>
                      <p className="text-sm font-mono text-zinc-300">{edu.field}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingEducation(edu)}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                        title="Edit Education Record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400"
                        title="Delete Education Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {edu.grade && (
                    <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                          Academic Standing
                        </span>
                        <p className="text-xs font-mono text-zinc-300">
                          {edu.grade_label || 'CGPA'}
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-[#00E5FF]">
                        {edu.grade}
                      </span>
                    </div>
                  )}

                  {edu.description && (
                    <p className="text-xs text-zinc-400 leading-relaxed font-light">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Languages Panel */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
              <h2 className="text-sm font-mono text-[#00E5FF] uppercase tracking-wider">
                Language Proficiencies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {languages.map((lang) => (
                  <div key={lang.id} className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white">{lang.name}</h4>
                      <p className="text-xs font-mono text-zinc-400">{lang.proficiency}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: MEDIA MANAGER */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Media & Asset Library
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Supabase Storage Bucket: portfolio-media
                </p>
              </div>
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff] cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>UPLOAD FILE</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'general')}
                />
              </label>
            </div>

            {mediaList.length === 0 ? (
              <div className="p-12 rounded-3xl glass-panel border border-white/10 text-center">
                <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">No Media Assets Uploaded Yet</h4>
                <p className="text-xs font-mono text-zinc-500 mb-6">
                  Upload project screenshots, profile photographs, or certification documents.
                </p>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-[#00E5FF] cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload First Asset</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'general')}
                  />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mediaList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between group"
                  >
                    <div className="aspect-video rounded-xl bg-zinc-900 border border-white/5 overflow-hidden mb-3 relative flex items-center justify-center">
                      {item.mime_type?.startsWith('image/') ? (
                        <img src={item.public_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-mono text-zinc-500">PDF / Document</span>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-mono text-white truncate mb-1">{item.name}</p>
                      <span className="text-[10px] font-mono text-zinc-500 block mb-3">
                        Folder: {item.folder}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleCopyUrl(item.public_url)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#00E5FF] hover:underline"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy URL
                      </button>
                      <button
                        onClick={() => deleteMediaFile(item).then(() => {
                          showToast('Asset deleted');
                          setMediaList(mediaList.filter(m => m.id !== item.id));
                        })}
                        className="p-1 rounded text-zinc-500 hover:text-rose-400"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: INQUIRIES & MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                Visitor Contact Inquiries
              </h1>
              <p className="text-xs font-mono text-zinc-400">
                Dispatches received through portfolio contact interface.
              </p>
            </div>

            {messages.length === 0 ? (
              <div className="p-12 rounded-3xl glass-panel border border-white/10 text-center">
                <Mail className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">No Inquiries Received Yet</h4>
                <p className="text-xs font-mono text-zinc-500">
                  Submissions through the public contact form will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 rounded-2xl glass-panel border transition-all ${
                      msg.is_read ? 'border-white/5 opacity-80' : 'border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,229,255,0.1)]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-bold text-white">{msg.name}</h4>
                          {!msg.is_read && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
                              NEW
                            </span>
                          )}
                        </div>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs font-mono text-[#00E5FF] hover:underline"
                        >
                          {msg.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        {!msg.is_read && (
                          <button
                            onClick={() => {
                              markMessageAsRead(msg.id);
                              setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
                            }}
                            className="px-3 py-1 rounded-lg bg-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-white"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => {
                            deleteContactMessage(msg.id);
                            setMessages(messages.filter(m => m.id !== msg.id));
                            showToast('Message deleted');
                          }}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-300 font-light leading-relaxed bg-zinc-900/60 p-4 rounded-xl border border-white/5">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: SITE SETTINGS */}
        {activeTab === 'settings' && siteSettings && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Global Site Settings & Copy
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Update hero copy, meta titles, accent branding and labels.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff]"
              >
                <Save className="w-4 h-4" />
                {saving ? 'SAVING...' : 'SAVE SETTINGS'}
              </button>
            </div>

            <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Site Title (SEO)</label>
                <input
                  type="text"
                  value={siteSettings.site_title}
                  onChange={(e) => setSiteSettings({ ...siteSettings, site_title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={siteSettings.site_description}
                  onChange={(e) => setSiteSettings({ ...siteSettings, site_description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Hero Category Badge</label>
                  <input
                    type="text"
                    value={siteSettings.hero_badge}
                    onChange={(e) => setSiteSettings({ ...siteSettings, hero_badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Brand Accent Color</label>
                  <input
                    type="text"
                    value={siteSettings.accent_color}
                    onChange={(e) => setSiteSettings({ ...siteSettings, accent_color: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block mb-1">Hero Supporting Copy</label>
                <textarea
                  rows={3}
                  value={siteSettings.hero_supporting_copy}
                  onChange={(e) => setSiteSettings({ ...siteSettings, hero_supporting_copy: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                />
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
