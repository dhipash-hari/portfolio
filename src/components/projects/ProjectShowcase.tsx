import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../../types/portfolio';
import { ArrowUpRight, ExternalLink, ShieldCheck, Eye, Cpu, Database, Globe, Smartphone } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { Link } from 'react-router-dom';

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
    <section id="projects" className="py-28 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Index Indicator */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono text-[#00E5FF]">03 //</span>
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
            Selected Works & Engineering
          </span>
          <div className="h-px bg-white/10 flex-1 ml-4" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
              Featured Projects
            </h2>
            <p className="text-base text-zinc-400 max-w-xl font-light">
              Factual engineering projects spanning real-time computer vision privacy, comparative academic data analytics, responsive cultural platforms, and multiplayer systems.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            ARCHIVE // 0{projects.length} PROJECTS RECORDED
          </span>
        </div>

        {/* Editorial Project Panels */}
        <div className="flex flex-col gap-12">
          {projects.map((project, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            const CategoryIcon = projectIconMap[project.category] || Cpu;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#00E5FF]/40 transition-all duration-500 p-6 sm:p-8 lg:p-10"
                data-cursor="VIEW"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left Column: Project Details & Context */}
                  <div className="lg:col-span-6 flex flex-col justify-between order-2 lg:order-1">
                    <div>
                      {/* Top Header metadata */}
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-2xl font-mono font-bold text-[#00E5FF]/60 group-hover:text-[#00E5FF] transition-colors">
                          {num}
                        </span>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-300">
                          <CategoryIcon className="w-3.5 h-3.5 text-[#00E5FF]" />
                          {project.category}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                        <Link to={`/projects/${project.slug}`} className="hover:text-[#00E5FF] transition-colors">
                          {project.title}
                        </Link>
                      </h3>

                      {/* Short Description */}
                      <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed mb-6">
                        {project.short_description}
                      </p>

                      {/* Key Features Bullet points */}
                      {project.features && project.features.length > 0 && (
                        <div className="mb-6 space-y-1.5">
                          {project.features.slice(0, 3).map((feat, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 text-xs font-mono rounded bg-white/[0.04] text-zinc-300 border border-white/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-black font-semibold text-xs font-mono tracking-wider hover:bg-[#33ebff] transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)]"
                        data-cursor="CASE STUDY"
                      >
                        <span>VIEW CASE STUDY</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>

                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-white/10 hover:border-[#00E5FF]/40 text-xs font-mono transition-all"
                          data-cursor="CODE"
                        >
                          <GithubIcon className="w-4 h-4" />
                          <span>Code Repository</span>
                        </a>
                      )}

                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-white/10 hover:border-[#00E5FF]/40 text-xs font-mono transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Preview</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Visual Preview Panel */}
                  <div className="lg:col-span-6 order-1 lg:order-2">
                    <Link to={`/projects/${project.slug}`}>
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-[#121622] via-[#090b0e] to-[#040507] border border-white/10 group-hover:border-[#00E5FF]/50 transition-all duration-500 shadow-2xl flex items-center justify-center">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          /* Procedural Technical Canvas Preview */
                          <div className="w-full h-full p-8 flex flex-col justify-between relative overflow-hidden bg-grid-pattern">
                            <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                              <span className="flex items-center gap-1.5 text-[#00E5FF]">
                                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                                {project.category.toUpperCase()}
                              </span>
                              <span>SYSTEM // {num}</span>
                            </div>

                            <div className="my-auto text-center py-6">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 group-hover:border-[#00E5FF]/40 transition-all">
                                <CategoryIcon className="w-8 h-8" />
                              </div>
                              <h4 className="text-xl font-bold text-white tracking-wide mb-1">
                                {project.title}
                              </h4>
                              <p className="text-xs font-mono text-zinc-400">
                                {project.technologies.slice(0, 3).join(' • ')}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-500">
                              <span>VERIFIED ARTIFACT</span>
                              <span className="text-[#00E5FF] group-hover:translate-x-1 transition-transform">
                                Explore Architecture →
                              </span>
                            </div>

                            {/* Background ambient lighting */}
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-2xl pointer-events-none" />
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
