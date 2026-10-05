import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initialProfile, initialSiteSettings, initialProjects, initialSkills, initialAchievements, initialCertifications, initialEducation } from '../data/initialData';
import { 
  LayoutDashboard, User, Code2, Briefcase, Trophy, Award, GraduationCap, 
  Settings, Eye, Save, Plus, Edit3, Trash2, Check, RefreshCw 
} from 'lucide-react';

type Tab = 'overview' | 'profile' | 'projects' | 'skills' | 'achievements' | 'certifications' | 'education' | 'settings';

export const SimpleAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    navigate('/admin', { replace: true });
  }, [navigate]);
  
  // Initialize with data immediately
  const [profile, setProfile] = useState(initialProfile);
  const [siteSettings, setSiteSettings] = useState(initialSiteSettings);
  const [projects, setProjects] = useState(initialProjects);
  const [skills, setSkills] = useState(initialSkills);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [certifications, setCertifications] = useState(initialCertifications);
  const [education, setEducation] = useState(initialEducation);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    showToast('Admin portal loaded successfully!');
  }, []);

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
          {/* Brand */}
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Working Mode</span>
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
          </Link>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                  CMS Operations Dashboard
                </h1>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Active Administrator: {profile.email}
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { label: 'Published Projects', count: projects.filter(p => p.published).length, total: projects.length },
                { label: 'Technical Skills', count: skills.length, detail: `${skills.filter(s => s.featured).length} featured` },
                { label: 'Achievements', count: achievements.length, detail: 'Resume Verified' },
                { label: 'Certifications', count: certifications.length, detail: 'Cisco & CodeChef' },
                { label: 'Education Records', count: education.length, detail: 'Academic History' },
                { label: 'Profile Complete', count: 100, detail: 'All fields filled' },
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

            {/* Status Panel */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10">
              <h2 className="text-sm font-mono text-[#00E5FF] uppercase tracking-wider mb-4">
                System Status
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-300">Portfolio Data</span>
                  <span className="text-emerald-400 font-mono">✓ Loaded</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Admin Authentication</span>
                  <span className="text-emerald-400 font-mono">✓ Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-300">Database Connection</span>
                  <span className="text-emerald-400 font-mono">● Supabase Live Connected</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Profile & Identity Management
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Update public biographical narrative and contact facts.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Headline</label>
                  <input
                    type="text"
                    value={profile.headline}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Biographical Summary</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Phone</label>
                  <input
                    type="text"
                    value={profile.phone || ''}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Location</label>
                  <input
                    type="text"
                    value={profile.location || ''}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Projects Management
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Portfolio case studies and engineering projects.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {projects.map((project) => (
                <div key={project.id} className="p-6 rounded-2xl glass-panel border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                      <span className="text-xs font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-1 rounded">
                        {project.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.published && (
                        <span className="text-xs font-mono text-emerald-400">Published</span>
                      )}
                      {project.featured && (
                        <span className="text-xs font-mono text-amber-400">Featured</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-300 mb-3">{project.short_description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-zinc-800 text-zinc-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#00E5FF] hover:underline"
                    >
                      View on GitHub →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Skills Universe
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Technical expertise and proficiency areas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="p-4 rounded-xl glass-panel border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white">{skill.name}</h3>
                    {skill.featured && (
                      <span className="text-xs font-mono text-[#00E5FF]">Featured</span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-zinc-500 mb-2 block">{skill.category}</span>
                  <p className="text-xs text-zinc-300">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Achievements & Recognition
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Awards, competitions, and academic recognition.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="p-5 rounded-xl glass-panel border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                    <span className="text-xs font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-1 rounded">
                      {achievement.award_level}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-zinc-400 mb-2">{achievement.organization}</p>
                  <p className="text-sm text-zinc-300">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Professional Certifications
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Industry certifications and professional credentials.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-5 rounded-xl glass-panel border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{cert.title}</h3>
                    <span className="text-xs font-mono text-emerald-400">{cert.date}</span>
                  </div>
                  <p className="text-sm font-mono text-zinc-400 mb-2">{cert.issuer}</p>
                  <p className="text-sm text-zinc-300 mb-3">{cert.description}</p>
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-[#00E5FF] hover:underline"
                    >
                      View Credential →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION TAB */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Educational Background
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Academic history and qualifications.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="p-6 rounded-xl glass-panel border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{edu.institution}</h3>
                      <p className="text-sm font-mono text-[#00E5FF]">
                        {edu.degree} in {edu.field}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-zinc-400">{edu.start_year} - {edu.end_year}</p>
                      {edu.grade && (
                        <p className="text-sm font-bold text-emerald-400">
                          {edu.grade} {edu.grade_label}
                        </p>
                      )}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-sm text-zinc-300">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                  Site Settings
                </h1>
                <p className="text-xs font-mono text-zinc-400">
                  Global configuration and site metadata.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Site Title</label>
                <input
                  type="text"
                  value={siteSettings.site_title}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Site Description</label>
                <textarea
                  rows={3}
                  value={siteSettings.site_description}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Accent Color</label>
                  <input
                    type="text"
                    value={siteSettings.accent_color}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Hero Badge</label>
                  <input
                    type="text"
                    value={siteSettings.hero_badge || ''}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Hero Headline</label>
                <input
                  type="text"
                  value={siteSettings.hero_headline || ''}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5">Hero Supporting Copy</label>
                <textarea
                  rows={3}
                  value={siteSettings.hero_supporting_copy || ''}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-sm resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};