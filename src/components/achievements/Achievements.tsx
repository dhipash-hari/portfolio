import React from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '../../types/portfolio';
import { Trophy, Award, Medal, Sparkles, Building2 } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
}

const awardIcons: Record<string, React.ElementType> = {
  'First Prize': Trophy,
  'Second Prize': Award,
  'Third Prize': Medal,
  'Merit Certificates': Sparkles,
};

export const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  return (
    <section id="achievements" className="py-28 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Index Indicator */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono text-[#00E5FF]">05 //</span>
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
            Honors & Accolades
          </span>
          <div className="h-px bg-white/10 flex-1 ml-4" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
              Competitive Honors
            </h2>
            <p className="text-base text-zinc-400 max-w-xl font-light">
              Factual academic accolades, paper presentation awards, project expo distinctions, and hackathon accomplishments.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            TOTAL RECOGNITIONS // 0{achievements.length}
          </span>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((item, index) => {
            const Icon = (item.award_level && awardIcons[item.award_level]) || Trophy;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 rounded-3xl glass-panel border border-white/10 hover:border-[#00E5FF]/40 transition-all duration-300 flex flex-col justify-between"
                data-cursor="HONOR"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 group-hover:bg-[#00E5FF]/10 transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
                      <Icon className="w-6 h-6" />
                    </div>

                    {item.award_level && (
                      <span className="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                        {item.award_level}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#00E5FF] transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-4">
                    <Building2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>{item.organization}</span>
                  </div>

                  <p className="text-sm text-zinc-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span>RESUME VERIFIED</span>
                  <span className="text-emerald-400">Awarded</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
