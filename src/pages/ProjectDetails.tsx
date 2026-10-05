import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Project } from '../types/portfolio';
import { getProjectBySlug } from '../services/projectService';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Cpu, 
  Database, 
  Globe, 
  Smartphone,
  Shield, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { GithubIcon } from '../components/common/Icons';
import { CustomCursor } from '../components/common/CustomCursor';

const categoryIcons: Record<string, React.ElementType> = {
  'AI / Machine Learning': Cpu,
  'AI / Data Analysis': Database,
  'Web Application': Globe,
  'Flutter / Firebase': Smartphone,
};

export const ProjectDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!slug) return;

    getProjectBySlug(slug)
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load project details:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090B] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#08090B] flex flex-col items-center justify-center text-white px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Project Not Found</h2>
        <p className="text-zinc-400 mb-8 max-w-md">
          The requested project artifact could not be located in the database.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-[#00E5FF] text-black font-semibold text-xs font-mono tracking-wider hover:bg-[#33ebff] transition-all"
        >
          RETURN TO PORTFOLIO
        </Link>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[project.category] || Cpu;

  return (
    <div className="min-h-screen bg-[#08090B] text-zinc-100 antialiased selection:bg-[#00E5FF]/20 selection:text-[#00E5FF] relative pb-28">
      <CustomCursor />

      {/* Top Banner Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#08090B]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-[#00E5FF] transition-colors"
            data-cursor="BACK"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO WORKS</span>
          </Link>

          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
            ARCHIVE // {project.slug}
          </span>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-32 pb-16 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 w-fit mb-6 text-xs font-mono text-[#00E5FF]">
          <CategoryIcon className="w-4 h-4" />
          <span>{project.category}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase mb-6 leading-tight">
          {project.title}
        </h1>

        <p className="text-lg sm:text-2xl text-zinc-300 font-light leading-relaxed max-w-3xl mb-10">
          {project.short_description}
        </p>

        {/* Tech Stack Pills & Action Links */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-200 hover:text-white border border-white/10 hover:border-[#00E5FF]/40 text-xs font-mono transition-all"
                data-cursor="GITHUB"
              >
                <GithubIcon className="w-4 h-4 text-[#00E5FF]" />
                <span>Source Code</span>
              </a>
            )}

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-black font-semibold text-xs font-mono tracking-wider hover:bg-[#33ebff] transition-all"
                data-cursor="LIVE"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live System</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Project Content Body */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 space-y-16">
        {/* Full Overview */}
        <section className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/10">
          <h2 className="text-xs font-mono text-[#00E5FF] uppercase tracking-widest mb-4">
            System Overview & Architecture
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
            {project.full_description}
          </p>
        </section>

        {/* Problem vs Solution Split */}
        {(project.problem || project.solution) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.problem && (
              <div className="p-8 rounded-3xl bg-zinc-900/60 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-3 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    Problem Statement
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">The Challenge</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-light">
                    {project.problem}
                  </p>
                </div>
              </div>
            )}

            {project.solution && (
              <div className="p-8 rounded-3xl bg-[#00E5FF]/5 border border-[#00E5FF]/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] mb-3 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                    Engineered Solution
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">The Implementation</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed font-light">
                    {project.solution}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Key Features Specification */}
        {project.features && project.features.length > 0 && (
          <section className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/10">
            <h2 className="text-xs font-mono text-[#00E5FF] uppercase tracking-widest mb-6">
              Core Technical Features & Capabilities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-white/5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-300 font-mono">{feature}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back Link Footer */}
        <div className="pt-12 border-t border-white/10 flex items-center justify-between">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Featured Projects</span>
          </Link>

          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 text-xs font-mono transition-all"
          >
            <span>Inquire About This Project</span>
          </Link>
        </div>
      </main>
    </div>
  );
};
