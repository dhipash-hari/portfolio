import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Sparkles, Terminal } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';
import { SiteSettings } from '../../types/portfolio';

const HeroScene = lazy(() => import('../three/HeroScene').then(m => ({ default: m.HeroScene })));

interface HeroProps {
  settings?: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  const badge = settings?.hero_badge || 'AI & DATA SCIENCE / CREATIVE TECHNOLOGY';
  const supporting = settings?.hero_supporting_copy || 'I explore the intersection of artificial intelligence, data, frontend design and motion to create digital experiences that are both functional and visually memorable.';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen pt-28 pb-16 md:py-0 flex items-center justify-center overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Asymmetric Editorial Typography */}
        <div className="lg:col-span-7 flex flex-col justify-center z-10">
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-[#00E5FF]/30 w-fit mb-6 shadow-[0_0_20px_rgba(0,229,255,0.1)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#00E5FF] font-medium">
              {badge}
            </span>
          </motion.div>

          {/* Large Editorial Name */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col mb-4"
          >
            <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black tracking-tighter text-white uppercase leading-[0.92]">
              DHIPASH
            </h1>
            <span className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-zinc-400 uppercase leading-[0.96]">
              HARI DEV M
            </span>
          </motion.div>

          {/* Animated Matrix Tags */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2.5 my-5"
          >
            {['AI & Data Science', 'Frontend Design', 'Motion Design', 'Creative Technology'].map((pill, i) => (
              <span
                key={pill}
                className="px-3 py-1 text-xs font-mono rounded-md bg-white/[0.03] border border-white/10 text-zinc-300 backdrop-blur-sm"
              >
                <span className="text-[#00E5FF] mr-1.5 opacity-60">0{i + 1} //</span>
                {pill}
              </span>
            ))}
          </motion.div>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-xl mb-9"
          >
            {supporting}
          </motion.p>

          {/* Interactive CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              onClick={() => scrollToSection('projects')}
              className="px-7 py-3.5 rounded-full bg-[#00E5FF] text-black font-semibold text-sm tracking-wide shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] hover:bg-[#33ebff] transition-all group"
              data-cursor="EXPLORE"
            >
              <span className="flex items-center gap-2">
                EXPLORE WORK
                <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </span>
            </MagneticButton>

            <MagneticButton
              onClick={() => scrollToSection('contact')}
              className="px-7 py-3.5 rounded-full bg-zinc-900/90 text-zinc-200 font-medium text-sm tracking-wide border border-white/15 hover:border-[#00E5FF]/50 hover:text-white transition-all group"
              data-cursor="CONNECT"
            >
              <span className="flex items-center gap-2">
                LET'S CONNECT
                <Sparkles className="w-4 h-4 text-[#00E5FF] transition-transform group-hover:rotate-12" />
              </span>
            </MagneticButton>
          </motion.div>

          {/* Factual Sub-status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 pt-6 border-t border-white/10 flex items-center gap-4 text-xs font-mono text-zinc-500"
          >
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
              Ramco Institute of Technology
            </span>
            <span>•</span>
            <span>B.Tech AI & Data Science (2024–2028)</span>
          </motion.div>
        </div>

        {/* Right Column: 3D Interactive React Three Fiber Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative w-full h-[400px] sm:h-[480px] lg:h-[580px] flex items-center justify-center"
        >
          <Suspense fallback={
            <div className="w-64 h-64 rounded-full border border-[#00E5FF]/20 flex items-center justify-center animate-pulse">
              <div className="w-32 h-32 rounded-full border border-dashed border-[#00E5FF]/30 animate-spin" />
            </div>
          }>
            <HeroScene />
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
};
