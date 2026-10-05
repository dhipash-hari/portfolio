import React from 'react';
import { motion } from 'framer-motion';
import { Profile } from '../../types/portfolio';
import { GraduationCap, MapPin, Award, Languages, Sparkles, Terminal } from 'lucide-react';

interface AboutProps {
  profile: Profile;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  return (
    <section id="about" className="py-28 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Index Indicator */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-xs font-mono text-[#00E5FF]">01 //</span>
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
            About & Identity
          </span>
          <div className="h-px bg-white/10 flex-1 ml-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Profile Media / Visual Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden glass-panel border border-white/10 p-2 group">
              <div className="aspect-[4/5] rounded-xl overflow-hidden relative bg-gradient-to-b from-[#131722] to-[#08090b] flex items-center justify-center">
                {profile.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  /* Elegant futuristic monogram / avatar placeholder */
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-grid-pattern">
                    <div className="w-36 h-36 rounded-full border border-[#00E5FF]/30 bg-gradient-to-tr from-[#00E5FF]/15 via-transparent to-transparent flex items-center justify-center mb-6 relative">
                      <span className="text-5xl font-black text-white tracking-widest">
                        DH
                      </span>
                      <div className="absolute inset-0 rounded-full border border-dashed border-[#00E5FF]/40 animate-spin" style={{ animationDuration: '25s' }} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-[#00E5FF] tracking-widest uppercase">
                        DHIPASH HARI DEV M
                      </p>
                      <p className="text-xs text-zinc-400">
                        AI & Data Science Student
                      </p>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 py-2 px-3 rounded-lg bg-black/60 border border-white/5 backdrop-blur-md flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>STATUS</span>
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ACTIVE
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Factual Academic Snapshot */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                  CURRENT DEGREE
                </span>
                <p className="text-xs font-semibold text-zinc-200">
                  B.Tech AI & Data Science
                </p>
                <p className="text-[11px] text-zinc-400">
                  2024–2028
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                  ACADEMIC CGPA
                </span>
                <p className="text-xl font-bold text-[#00E5FF] leading-tight">
                  7.24
                </p>
                <p className="text-[10px] font-mono text-zinc-400">
                  Up to 4th Semester
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-8 leading-[1.15]">
              I build at the intersection of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-blue-400">
                intelligence
              </span>{' '}
              and{' '}
              <span className="italic font-serif font-normal text-zinc-300">
                interaction
              </span>
              .
            </h2>

            <div className="space-y-5 text-base sm:text-lg text-zinc-300 leading-relaxed font-light mb-10">
              <p>
                I am an Artificial Intelligence and Data Science undergraduate at <strong className="font-medium text-white">Ramco Institute of Technology</strong> (2024–2028). My work bridges analytical data models with responsive, motion-forward user interfaces.
              </p>
              <p>
                Rather than treating data science and frontend engineering as isolated disciplines, I explore how predictive models, real-time computer vision (such as privacy blur systems), and data visualizations can be elevated through fluid interaction design, modern typography, and orchestrated animations.
              </p>
              <p className="text-sm font-mono text-zinc-400 bg-zinc-900/60 p-4 rounded-xl border border-white/5">
                <span className="text-[#00E5FF] font-bold mr-2">// Core Focus:</span>
                Machine Learning • Computer Vision • Tabular Analytics • Modern React & Three.js • Interaction Systems
              </p>
            </div>

            {/* Quick Fact Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <GraduationCap className="w-5 h-5 text-[#00E5FF] shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white">Ramco Institute of Technology</p>
                  <p className="text-[11px] text-zinc-400 font-mono">Rajapalayam, Tamil Nadu</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <Languages className="w-5 h-5 text-[#00E5FF] shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white">Languages</p>
                  <p className="text-[11px] text-zinc-400 font-mono">English (Professional) • Tamil (Native)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <Award className="w-5 h-5 text-[#00E5FF] shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white">Academic Competitions</p>
                  <p className="text-[11px] text-zinc-400 font-mono">1st & 2nd Paper Presentation Prizes</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                <Terminal className="w-5 h-5 text-[#00E5FF] shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white">Verified Certifications</p>
                  <p className="text-[11px] text-zinc-400 font-mono">CodeChef Python & Cisco Certified</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
