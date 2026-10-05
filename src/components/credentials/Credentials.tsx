import React from 'react';
import { motion } from 'framer-motion';
import { Certification, Education, Language } from '../../types/portfolio';
import { Award, GraduationCap, Languages, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

interface CredentialsProps {
  certifications: Certification[];
  education: Education[];
  languages: Language[];
}

export const Credentials: React.FC<CredentialsProps> = ({
  certifications,
  education,
  languages,
}) => {
  return (
    <section id="education" className="py-28 relative border-t border-white/5 bg-[#08090B] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Index Indicator */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono text-[#00E5FF]">06 //</span>
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
            Education, Certifications & Languages
          </span>
          <div className="h-px bg-white/10 flex-1 ml-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Education & Languages */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[#00E5FF]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Academic Education
                </h3>
              </div>

              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-8 rounded-3xl glass-panel border border-white/10 hover:border-[#00E5FF]/40 transition-all mb-8 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#00E5FF] px-2.5 py-1 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                      {edu.degree}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {edu.start_year} — {edu.end_year}
                    </span>
                  </div>

                  <h4 className="text-2xl font-black text-white mb-1">
                    {edu.institution}
                  </h4>
                  <p className="text-sm font-mono text-zinc-300 mb-6">
                    {edu.field}
                  </p>

                  {/* CGPA Display */}
                  <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/5 flex items-center justify-between mb-6">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                        CUMULATIVE PERFORMANCE
                      </span>
                      <p className="text-sm font-mono text-zinc-300">
                        {edu.grade_label || 'CGPA (Up to Fourth Semester)'}
                      </p>
                    </div>
                    <span className="text-3xl font-extrabold text-[#00E5FF]">
                      {edu.grade}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    {edu.description}
                  </p>
                </div>
              ))}

              {/* Languages Section */}
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[#00E5FF]">
                    <Languages className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Languages
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col justify-between"
                    >
                      <span className="text-lg font-bold text-white">{lang.name}</span>
                      <span className="text-xs font-mono text-zinc-400 mt-1">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Certifications */}
          <div id="certifications" className="lg:col-span-6 scroll-mt-24">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[#00E5FF]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Verified Certifications
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-[#00E5FF]/40 transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded bg-white/5 text-[#00E5FF] border border-white/10">
                          {cert.issuer}
                        </span>
                        {cert.credential_id && (
                          <span className="text-[11px] font-mono text-zinc-500">
                            ID: {cert.credential_id}
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                        {cert.title}
                      </h4>
                    </div>

                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        title="View Credential"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {cert.description && (
                    <p className="text-xs text-zinc-400 leading-relaxed font-light mb-4">
                      {cert.description}
                    </p>
                  )}

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                    <span>Curriculum Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
