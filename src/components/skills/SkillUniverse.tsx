import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skill, SkillCategory } from '../../types/portfolio';
import { 
  Code2, 
  Cpu, 
  Table, 
  Binary, 
  BarChart3, 
  Database, 
  FileCode, 
  Palette, 
  Layout, 
  Sparkles, 
  Film, 
  Terminal, 
  Boxes,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';

interface SkillUniverseProps {
  skills: Skill[];
}

const categoryIcons: Record<SkillCategory, React.ElementType> = {
  'Programming': Code2,
  'AI / ML': Cpu,
  'Data': Table,
  'Frontend': Layout,
  'Design': Palette,
  'Motion': Sparkles,
  'Tools': Terminal,
};

const skillIconMap: Record<string, React.ElementType> = {
  Code2,
  Cpu,
  Table,
  Binary,
  BarChart3,
  Database,
  FileCode,
  Palette,
  Layout,
  Sparkles,
  Film,
  Terminal,
  Boxes,
};

const categories: SkillCategory[] = [
  'Programming',
  'AI / ML',
  'Data',
  'Frontend',
  'Design',
  'Motion',
  'Tools',
];

export const SkillUniverse: React.FC<SkillUniverseProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(s => s.category === selectedCategory);

  const toolsSkills = skills.filter(s => s.category === 'Tools');

  return (
    <section id="skills" className="py-28 relative border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00E5FF]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono text-[#00E5FF]">02 //</span>
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
            Skill Universe & Capabilities
          </span>
          <div className="h-px bg-white/10 flex-1 ml-4" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
              Technical Matrix & Toolchain
            </h2>
            <p className="text-base text-zinc-400 max-w-xl font-light">
              Interactive universe of data science modeling, programming algorithms, and motion-engineered frontend technologies.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 bg-zinc-900/60 px-3.5 py-2 rounded-xl border border-white/5">
            <Info className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Select a node to inspect technical applications</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#00E5FF] text-black font-semibold shadow-[0_0_20px_rgba(0,229,255,0.3)]'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20'
            }`}
            data-cursor="ALL"
          >
            All Disciplines ({skills.length})
          </button>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            const count = skills.filter(s => s.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#00E5FF] text-black font-semibold shadow-[0_0_20px_rgba(0,229,255,0.3)]'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
                data-cursor={cat.toUpperCase()}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Skills Interactive Grid / Universe */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-20"
        >
          <AnimatePresence>
            {filteredSkills.map((skill) => {
              const IconComponent = (skill.icon && skillIconMap[skill.icon]) || Code2;
              const isSelected = activeSkill?.id === skill.id;

              return (
                <motion.div
                  layout
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setActiveSkill(isSelected ? null : skill)}
                  className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? 'bg-[#131722] border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.2)]'
                      : 'glass-panel hover:border-[#00E5FF]/40 hover:bg-zinc-900/90'
                  }`}
                  data-cursor="INSPECT"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 group-hover:bg-[#00E5FF]/10 transition-all duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-white/[0.04] text-zinc-400 border border-white/5">
                      {skill.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00E5FF] transition-colors">
                    {skill.name}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                    {skill.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1 text-[#00E5FF]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                      Verified
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform text-zinc-400">
                      View details →
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Skill Details Modal / Drawer */}
        <AnimatePresence>
          {activeSkill && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-6 md:p-8 rounded-2xl bg-[#0D1017] border border-[#00E5FF]/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] mb-20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                    {React.createElement((activeSkill.icon && skillIconMap[activeSkill.icon]) || Code2, { className: 'w-6 h-6' })}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">{activeSkill.name}</h4>
                    <span className="text-xs font-mono text-[#00E5FF]">{activeSkill.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSkill(null)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Close ✕
                </button>
              </div>

              <p className="text-base text-zinc-300 max-w-3xl leading-relaxed mb-6">
                {activeSkill.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                  Factual Resume Skill
                </span>
                <span>Category: <strong className="text-white">{activeSkill.category}</strong></span>
                {activeSkill.featured && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
                    Featured
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dedicated Tools & Automation Showcase (Playwright CLI / Microsoft) */}
        <div className="rounded-3xl p-8 md:p-10 bg-gradient-to-b from-[#0D1017] to-[#08090B] border border-white/10 relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-xs font-mono text-[#00E5FF] mb-3">
            <Terminal className="w-4 h-4" />
            <span>SPECIALIZED TOOLCHAIN SHOWCASE</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Tools & Automation Architecture
          </h3>
          <p className="text-sm text-zinc-400 max-w-2xl mb-8">
            Leveraging headless browser automation and enterprise analytics toolchains for reliable testing, data ingestion, and workflow orchestration.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-[#00E5FF]/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-[#00E5FF] group-hover:scale-105 transition-transform">
                  <Terminal className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/5 text-zinc-400">
                  AUTOMATION
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Playwright CLI</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                End-to-end headless browser automation, UI test runs, screenshot verification, and automated browser workflow validation.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#00E5FF]">
                <span>Automated UI Verification</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/5 hover:border-[#00E5FF]/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-[#00E5FF] group-hover:scale-105 transition-transform">
                  <Boxes className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/5 text-zinc-400">
                  DATA & PRODUCTIVITY
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Microsoft Ecosystem & Tools</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Structured business intelligence in Power BI, data modeling, reporting synthesis, and collaborative technical workflow tools.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#00E5FF]">
                <span>Analytics & Reporting</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
