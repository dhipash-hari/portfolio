import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types/portfolio';
import { ArrowUpRight, ExternalLink, Cpu, Database, Globe, Smartphone, Lock, Terminal } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { Link } from 'react-router-dom';
import { ProjectCard3D } from './ProjectCard3D';
import { ProjectPreviewMockup } from './ProjectPreviewMockup';

interface ProjectShowcaseProps {
  projects: Project[];
}

const projectIconMap: Record<string, React.ElementType> = {
  'AI / Machine Learning': Cpu,
  'AI / Data Analysis': Database,
  'Web Application': Globe,
  'Flutter / Firebase': Smartphone,
};

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ projects }) => {
  return (
    <section id="projects" className="py-32 relative border-t border-white/5 overflow-hidden">
      {/* Background ambient lighting accents */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Index Indicator */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono text-[#00E5FF]">03 //</span>
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
            Selected Works & Interactive Gallery
          </span>
          <div className="h-px bg-white/10 flex-1 ml-4" />
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4 uppercase">
              Featured Projects
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-light leading-relaxed">
              Factual engineering architectures spanning real-time computer vision privacy safeguards, comparative academic data analytics, responsive cultural platforms, and multiplayer systems.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="text-xs font-mono text-[#00E5FF]">
              INTERACTIVE 3D PERSPECTIVE // TILT ON HOVER
            </span>
            <span className="text-xs font-mono text-zinc-500">
              ARCHIVE // 0{projects.length} VERIFIED SYSTEMS
            </span>
          </div>
        </div>

        {/* Asymmetrical 3D Project Gallery */}
        <div className="flex flex-col gap-16 lg:gap-24">
          {projects.map((project, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            const CategoryIcon = projectIconMap[project.category] || Cpu;
            // Alternate left-right layout rhythm for rich editorial variance
            const isReversed = index % 2 === 1;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <ProjectCard3D className="w-full">
                  <div className="relative rounded-3xl p-6 sm:p-8 lg:p-10 glass-panel border border-white/10 hover:border-[#00E5FF]/40 transition-colors duration-500 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                    {/* Floating Browser Chrome Header */}
                    <div
                      style={{ transform: 'translateZ(25px)' }}
                      className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 text-xs font-mono text-zinc-400"
                    >
                      {/* Window Controls (macOS / Cyber style) */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 mr-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 group-hover:bg-rose-500 transition-colors" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 group-hover:bg-amber-500 transition-colors" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 group-hover:bg-emerald-500 transition-colors" />
                        </div>
                        {/* URL Pill with SSL Lock */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[11px] text-zinc-300">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          <span>https://dhipash.dev/projects/{project.slug}</span>
                        </div>
                      </div>

                      {/* System Telemetry Tag */}
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-[#00E5FF]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                          SYSTEM // 0{num}
                        </span>
                        <span className="text-zinc-600 hidden md:inline">|</span>
                        <span className="text-zinc-400 hidden md:inline">60 FPS REAL-TIME</span>
                      </div>
                    </div>

                    {/* Asymmetrical Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      {/* Column A: Project Context & Metadata */}
                      <div
                        style={{ transform: 'translateZ(35px)' }}
                        className={`lg:col-span-6 flex flex-col justify-between ${
                          isReversed ? 'lg:order-2' : 'lg:order-1'
                        }`}
                      >
                        <div>
                          {/* Category Badge */}
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl font-mono font-black text-[#00E5FF]/70 group-hover:text-[#00E5FF] transition-colors">
                              {num}
                            </span>
                            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-300">
                              <CategoryIcon className="w-3.5 h-3.5 text-[#00E5FF]" />
                              <span>{project.category}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight group-hover:text-[#00E5FF] transition-colors duration-300">
                            <Link to={`/projects/${project.slug}`}>
                              {project.title}
                            </Link>
                          </h3>

                          {/* Short Description */}
                          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-6">
                            {project.short_description}
                          </p>

                          {/* Key Features List */}
                          {project.features && project.features.length > 0 && (
                            <div className="mb-6 space-y-2">
                              {project.features.slice(0, 3).map((feat, i) => (
                                <div key={i} className="flex items-start gap-2.5 text-xs font-mono text-zinc-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mt-1.5 shrink-0" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Technologies Tags */}
                          <div className="flex flex-wrap gap-2 mb-8">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-3 py-1 text-xs font-mono rounded-md bg-white/[0.04] text-zinc-200 border border-white/10 hover:border-[#00E5FF]/40 transition-colors"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div
                          style={{ transform: 'translateZ(45px)' }}
                          className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/10"
                        >
                          <Link
                            to={`/projects/${project.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-wider hover:bg-[#33ebff] transition-all shadow-[0_0_25px_rgba(0,229,255,0.3)] hover:shadow-[0_0_35px_rgba(0,229,255,0.5)] cursor-pointer"
                            data-cursor="CASE STUDY"
                          >
                            <span>EXPLORE CASE STUDY</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </Link>

                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white border border-white/10 hover:border-[#00E5FF]/40 text-xs font-mono transition-all"
                              data-cursor="CODE"
                            >
                              <GithubIcon className="w-4 h-4 text-[#00E5FF]" />
                              <span>Code Repo</span>
                            </a>
                          )}

                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white border border-white/10 hover:border-[#00E5FF]/40 text-xs font-mono transition-all"
                            >
                              <ExternalLink className="w-4 h-4 text-[#00E5FF]" />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Column B: Floating Layered Mockup Visual */}
                      <div
                        style={{ transform: 'translateZ(30px)' }}
                        className={`lg:col-span-6 ${
                          isReversed ? 'lg:order-1' : 'lg:order-2'
                        }`}
                      >
                        <Link to={`/projects/${project.slug}`} className="block">
                          <ProjectPreviewMockup project={project} num={num} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </ProjectCard3D>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
