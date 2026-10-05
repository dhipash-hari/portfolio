import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Sparkles, Move, Eye, Layers, Play, RefreshCw, Zap } from 'lucide-react';
import { MagneticButton } from '../common/MagneticButton';

export const MotionLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tilt' | 'reveal' | 'stagger' | 'magnetic'>('tilt');
  const [revealKey, setRevealKey] = useState(0);

  // 3D Card Tilt mechanics
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [18, -18]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-18, 18]), { damping: 20, stiffness: 200 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="motion-lab" className="py-28 relative border-t border-white/5 bg-[#07080A]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Index Indicator */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono text-[#00E5FF]">04 //</span>
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
            Interaction & Motion Lab
          </span>
          <div className="h-px bg-white/10 flex-1 ml-4" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
              Motion / Interaction Lab
            </h2>
            <p className="text-base text-zinc-400 max-w-xl font-light">
              Demonstrating physics-based gesture control, 3D surface tilt, kinetic text reveals, and choreographed stagger kinematics.
            </p>
          </div>

          {/* Interactive Mode Selector */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/80 border border-white/10 w-fit">
            {[
              { id: 'tilt', label: '3D Card Tilt' },
              { id: 'reveal', label: 'Kinetic Reveal' },
              { id: 'stagger', label: 'Matrix Stagger' },
              { id: 'magnetic', label: 'Magnetic Physics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#00E5FF] text-black font-semibold shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
                data-cursor="PLAY"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Experiment Canvas Stage */}
        <div className="p-8 md:p-14 rounded-3xl bg-gradient-to-b from-[#0D1017] to-[#08090B] border border-white/10 relative overflow-hidden min-h-[460px] flex items-center justify-center">
          {/* Subtle Ambient lighting */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Experiment 1: 3D Card Tilt with Specular Reflection */}
          {activeTab === 'tilt' && (
            <div className="perspective-[1000px] flex flex-col items-center">
              <motion.div
                ref={cardRef}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
                className="w-72 sm:w-88 h-96 rounded-2xl glass-panel border border-[#00E5FF]/30 p-8 flex flex-col justify-between cursor-grab shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] relative overflow-hidden group select-none"
                data-cursor="TILT"
              >
                {/* Specular glare overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="flex items-center justify-between" style={{ transform: 'translateZ(30px)' }}>
                  <span className="text-[11px] font-mono text-[#00E5FF] uppercase tracking-wider">
                    SPECULAR INERTIA
                  </span>
                  <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                </div>

                <div style={{ transform: 'translateZ(40px)' }}>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                    Kinetic Surface
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                    Quaternion-calculated pitch and yaw spring physics responding to continuous cursor coordinate vectors.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-500" style={{ transform: 'translateZ(25px)' }}>
                  <span>SPRING DAMPING // 20</span>
                  <span className="text-[#00E5FF]">60 FPS</span>
                </div>
              </motion.div>
              <p className="mt-6 text-xs font-mono text-zinc-400">
                Move pointer over the card to experience real-time 3D spring transformation.
              </p>
            </div>
          )}

          {/* Experiment 2: Kinetic Text Reveal */}
          {activeTab === 'reveal' && (
            <div className="max-w-2xl text-center flex flex-col items-center" key={revealKey}>
              <div className="overflow-hidden mb-4">
                <motion.h3
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase"
                >
                  ENGINEERED MOTION.
                </motion.h3>
              </div>

              <div className="overflow-hidden mb-6">
                <motion.p
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base sm:text-lg text-zinc-300 font-light"
                >
                  "Interaction design is not mere decoration. It is visual cognition communicating state, depth, and spatial intent."
                </motion.p>
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <button
                  onClick={() => setRevealKey(k => k + 1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-white/15 text-xs font-mono text-[#00E5FF] hover:bg-zinc-800 transition-colors"
                  data-cursor="REPLAY"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Replay Animation Sequence
                </button>
              </motion.div>
            </div>
          )}

          {/* Experiment 3: Matrix Grid Stagger */}
          {activeTab === 'stagger' && (
            <div className="flex flex-col items-center">
              <motion.div
                className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-w-lg mb-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.04,
                    },
                  },
                }}
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, scale: 0.3, y: 20 },
                      visible: { opacity: 1, scale: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.15, backgroundColor: 'rgba(0, 229, 255, 0.3)' }}
                    className="w-11 h-11 rounded-xl bg-zinc-900/90 border border-white/10 flex items-center justify-center text-[10px] font-mono text-zinc-500 hover:text-[#00E5FF] hover:border-[#00E5FF] cursor-pointer transition-colors shadow-sm"
                  >
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </motion.div>
                ))}
              </motion.div>
              <p className="text-xs font-mono text-zinc-400">
                Choreographed staggered physics entrance with interactive node hover reaction.
              </p>
            </div>
          )}

          {/* Experiment 4: Magnetic Physics Button */}
          {activeTab === 'magnetic' && (
            <div className="flex flex-col items-center text-center">
              <div className="p-12 mb-4">
                <MagneticButton
                  strength={0.5}
                  className="w-40 h-40 rounded-full bg-gradient-to-tr from-[#00E5FF] to-blue-500 text-black font-extrabold text-sm tracking-widest uppercase shadow-[0_0_50px_rgba(0,229,255,0.4)] flex flex-col items-center justify-center gap-2 select-none group"
                  data-cursor="PULL"
                >
                  <Zap className="w-6 h-6 text-black group-hover:scale-125 transition-transform" />
                  <span>MAGNETIC</span>
                  <span className="text-[9px] font-mono tracking-normal opacity-70">HOVER ME</span>
                </MagneticButton>
              </div>
              <p className="text-xs font-mono text-zinc-400 max-w-md">
                Pointer attraction field pulling button mass towards cursor vector with spring inertia damping.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
