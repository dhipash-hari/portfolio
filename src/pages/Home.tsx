import React, { useEffect, useState } from 'react';
import { 
  Profile, 
  SiteSettings, 
  Skill, 
  Project, 
  Achievement, 
  Certification, 
  Education, 
  Language, 
  SocialLink 
} from '../types/portfolio';
import { getProfile, getSiteSettings } from '../services/profileService';
import { getProjects } from '../services/projectService';
import { getSkills } from '../services/skillService';
import { getAchievements } from '../services/achievementService';
import { getCertifications } from '../services/certificationService';
import { getEducation, getLanguages, getSocialLinks } from '../services/educationService';

import { Navbar } from '../components/navigation/Navbar';
import { Hero } from '../components/hero/Hero';
import { About } from '../components/about/About';
import { SkillUniverse } from '../components/skills/SkillUniverse';
import { ProjectShowcase } from '../components/projects/ProjectShowcase';
import { MotionLab } from '../components/motion/MotionLab';
import { Achievements } from '../components/achievements/Achievements';
import { Credentials } from '../components/credentials/Credentials';
import { Contact } from '../components/contact/Contact';
import { Footer } from '../components/layout/Footer';
import { CustomCursor } from '../components/common/CustomCursor';
import { Loader2 } from 'lucide-react';

export const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          pData,
          sData,
          projData,
          skData,
          achData,
          certData,
          eduData,
          langData,
          socData,
        ] = await Promise.all([
          getProfile(),
          getSiteSettings(),
          getProjects(false), // only published projects
          getSkills(),
          getAchievements(),
          getCertifications(),
          getEducation(),
          getLanguages(),
          getSocialLinks(),
        ]);

        setProfile(pData);
        setSettings(sData);
        setProjects(projData);
        setSkills(skData);
        setAchievements(achData);
        setCertifications(certData);
        setEducation(eduData);
        setLanguages(langData);
        setSocialLinks(socData);
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090B] flex flex-col items-center justify-center text-white px-6">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-blue-600 flex items-center justify-center font-bold text-black text-2xl tracking-wider shadow-[0_0_40px_rgba(0,229,255,0.4)] animate-pulse">
            D
          </div>
        </div>
        <h2 className="text-sm font-mono tracking-widest text-[#00E5FF] uppercase font-bold mb-2">
          DHIPASH HARI DEV M
        </h2>
        <p className="text-xs font-mono text-zinc-500">
          Initializing intelligent experience...
        </p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#08090B] text-zinc-100 antialiased selection:bg-[#00E5FF]/20 selection:text-[#00E5FF] relative overflow-x-hidden">
      {/* Desktop Custom Interactive Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navbar resumeUrl={profile.resume_url} />

      {/* Main Content Sections */}
      <main>
        <Hero settings={settings || undefined} />
        <About profile={profile} />
        <SkillUniverse skills={skills} />
        <ProjectShowcase projects={projects} />
        <MotionLab />
        <Achievements achievements={achievements} />
        <Credentials 
          certifications={certifications}
          education={education}
          languages={languages}
        />
        <Contact profile={profile} socialLinks={socialLinks} />
      </main>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
};
