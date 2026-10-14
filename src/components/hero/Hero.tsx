import React, { Suspense, lazy, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, Sparkles, Terminal, Activity, Compass } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';
import { CinematicHoloFallback } from '../three/HoloFallback';
import { SiteSettings } from '../../types/portfolio';

const HeroScene = lazy(() => import('../three/HeroScene').then(m => ({ default: m.HeroScene })));

interface HeroProps {
  settings?: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  const containerRef = useRef<HTMLElement>(null);
  const badge = settings?.hero_badge || 'AI & DATA SCIENCE / CREATIVE TECHNOLOGY';
  const supporting = settings?.hero_supporting_copy || 'I explore the intersection of artificial intelligence, data, frontend design and motion to create digital experiences that are both functional and visually memorable.';

  // Scroll-driven natural recession
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      ref={containerRef}
      style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
      className="relative min-h-screen pt-28 pb-16 md:py-0 flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic atmospheric lighting sweeps */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#00E5FF]/8 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-[550px] h-[550px] bg-blue-600/8 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-950/20 rounded-full blur-[180px] pointer-events-none -z-10" />
      
      {/* Fine cyber grid & scanlines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />
      <div className="absolute inset-0 radial-vignette pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Asymmetrical Oversized Editorial Typography */}
        <div className="lg:col-span-7 flex flex-col justify-center z-10">
          {/* Category Badge with Live Pulse */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-[#00E5FF]/30 w-fit mb-6 shadow-[0_0_25px_rgba(0,229,255,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#00E5FF] font-semibold">
              {badge}
            </span>
            <span className="text-zinc-600 font-mono text-[10px]">|</span>
            <span className="text-zinc-400 font-mono text-[10px] tracking-wider">v2.0 CINEMATIC</span>
          </motion.div>

          {/* Large Editorial Headline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col mb-4 overflow-hidden"
          >
            <h1 className="text-6xl sm:text-8xl xl:text-9xl font-black tracking-tighter text-white uppercase leading-[0.9] select-none">
              DHIPASH
            </h1>
            <span className="text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-500 uppercase leading-[0.96]">
              HARI DEV M
            </span>
          </motion.div>

          {/* Kinetic Matrix Technical Tags */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2.5 my-5"
          >
            {[
              'AI & Data Science',
              'Frontend Design',
              'Motion Design',
              'Creative Technology',
            ].map((pill, i) => (
              <span
                key={pill}
                className="px-3 py-1.5 text-xs font-mono rounded-lg bg-white/[0.03] border border-white/10 text-zinc-300 backdrop-blur-sm hover:border-[#00E5FF]/40 transition-colors"
              >
                <span className="text-[#00E5FF] mr-1.5 opacity-80 font-bold">0{i + 1} //</span>
                {pill}
              </span>
            ))}
          </motion.div>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-xl mb-9"
          >
            {supporting}
          </motion.p>

          {/* Interactive Magnetic Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              onClick={() => scrollToSection('projects')}
              className="px-8 py-4 rounded-full bg-[#00E5FF] text-black font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(0,229,255,0.45)] hover:shadow-[0_0_45px_rgba(0,229,255,0.65)] hover:bg-[#33ebff] transition-all group cursor-pointer"
              data-cursor="EXPLORE"
            >
              <span className="flex items-center gap-2">
                EXPLORE WORK
                <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </span>
            </MagneticButton>

            <MagneticButton
              onClick={() => scrollToSection('contact')}
              className="px-8 py-4 rounded-full bg-zinc-900/90 text-zinc-200 font-medium text-xs sm:text-sm tracking-wider uppercase border border-white/15 hover:border-[#00E5FF]/50 hover:text-white transition-all group cursor-pointer"
              data-cursor="CONNECT"
            >
              <span className="flex items-center gap-2">
                LET'S CONNECT
                <Sparkles className="w-4 h-4 text-[#00E5FF] transition-transform group-hover:rotate-12" />
              </span>
            </MagneticButton>
          </motion.div>

          {/* Factual Institutional Grounding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400"
          >
            <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
              Ramco Institute of Technology
            </span>
            <span>•</span>
            <span className="text-zinc-400">B.Tech AI & Data Science (2024–2028)</span>
            <span>•</span>
            <span className="text-[#00E5FF] font-semibold">CGPA 7.24</span>
          </motion.div>
        </div>

        {/* Right Column: 3D Interactive React Three Fiber Centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative w-full h-[400px] sm:h-[480px] lg:h-[600px] flex items-center justify-center"
        >
          <Suspense fallback={<CinematicHoloFallback />}>
            <HeroScene />
          </Suspense>
        </motion.div>
      </div>
    </motion.section>
  );
};
