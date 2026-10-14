import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Profile, SocialLink } from '../../types/portfolio';
import { Mail, Phone, MapPin, Send, Copy, Check, Sparkles, Loader2, Radio } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/Icons';
import { sendContactMessage } from '../../services/contactService';
import confetti from 'canvas-confetti';

const ContactScene = lazy(() => import('../three/ContactScene').then(m => ({ default: m.ContactScene })));

interface ContactProps {
  profile: Profile;
  socialLinks?: SocialLink[];
}

export const Contact: React.FC<ContactProps> = ({ profile, socialLinks = [] }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please complete all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await sendContactMessage(formData.name, formData.email, formData.message);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      try {
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.7 },
          colors: ['#00E5FF', '#3B82F6', '#FFFFFF'],
        });
      } catch {}
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch message. Please email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative border-t border-white/5 overflow-hidden">
      {/* Background cinematic glows */}
      <div className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-[#00E5FF]/6 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-blue-600/6 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Index Indicator */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xs font-mono text-[#00E5FF]">07 //</span>
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
            Closing Frame & Collaborative Transmission
          </span>
          <div className="h-px bg-white/10 flex-1 ml-4" />
        </div>

        {/* 3D Ambient Installation Header Bar */}
        <div className="mb-12 relative rounded-3xl glass-panel border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider mb-3">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>3D QUANTUM TRANSMISSION BEACON // ACTIVE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none mb-3">
              Let's Build Something Extraordinary.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-light">
              Open to conversations surrounding machine learning research, computer vision privacy architectures, tabular data analytics, and high-end frontend interaction design.
            </p>
          </div>

          {/* 3D Beacon Canvas */}
          <div className="w-full md:w-64 h-48 sm:h-56 shrink-0 relative flex items-center justify-center">
            <Suspense fallback={
              <div className="w-28 h-28 rounded-full border border-[#00E5FF]/20 flex items-center justify-center animate-pulse">
                <div className="w-14 h-14 rounded-full border border-dashed border-[#00E5FF]/40" />
              </div>
            }>
              <ContactScene />
            </Suspense>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Inquiries & Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Email with copy button */}
              <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between group hover:border-[#00E5FF]/40 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[#00E5FF] group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                      DIRECT TRANSMISSION // EMAIL
                    </span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-sm sm:text-base font-mono text-zinc-200 hover:text-[#00E5FF] transition-colors"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2.5 rounded-xl bg-zinc-800/60 hover:bg-[#00E5FF]/20 text-zinc-400 hover:text-[#00E5FF] transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                  data-cursor="COPY"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone */}
              {profile.phone && (
                <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center gap-3.5 hover:border-[#00E5FF]/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[#00E5FF]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                      VOICE & WHATSAPP
                    </span>
                    <a
                      href={`tel:${profile.phone}`}
                      className="text-sm sm:text-base font-mono text-zinc-200 hover:text-[#00E5FF] transition-colors"
                    >
                      +91 {profile.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[#00E5FF]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    LOCATION & TIMEZONE
                  </span>
                  <p className="text-sm font-mono text-zinc-200">
                    {profile.location || 'Tamil Nadu, India'} (IST / UTC+5:30)
                  </p>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://github.com/dhipash"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-[#00E5FF]/50 text-xs font-mono text-zinc-300 hover:text-white transition-all shadow-lg"
                data-cursor="GITHUB"
              >
                <GithubIcon className="w-4 h-4 text-[#00E5FF]" />
                github.com/dhipash
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 hover:border-[#00E5FF]/50 text-xs font-mono text-zinc-300 hover:text-white transition-all shadow-lg"
                data-cursor="LINKEDIN"
              >
                <LinkedinIcon className="w-4 h-4 text-[#00E5FF]" />
                LinkedIn Profile
              </a>
            </div>
          </div>

          {/* Right Column: Encrypted Dispatch Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-white/10 hover:border-[#00E5FF]/30 transition-all duration-300 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-white">
                  Send an Encrypted Dispatch
                </h3>
                <span className="text-[10px] font-mono text-[#00E5FF] uppercase">
                  SUPABASE DIRECT
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mb-8">
                Messages route securely into the PostgreSQL portfolio database.
              </p>

              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#00E5FF]/20 border border-[#00E5FF] flex items-center justify-center text-[#00E5FF] mb-4 shadow-[0_0_30px_rgba(0,229,255,0.4)] animate-bounce">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Transmission Dispatched</h4>
                  <p className="text-sm text-zinc-300 max-w-sm mb-6 font-light">
                    Thank you for reaching out. Dhipash will review your inquiry shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-zinc-800 text-xs font-mono text-[#00E5FF] hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    Send another dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-2 tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00E5FF] text-sm transition-colors shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-2 tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00E5FF] text-sm transition-colors shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-zinc-400 block mb-2 tracking-wider">
                      Message / Project Details
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Discussing machine learning pipelines, computer vision research, data analysis, or creative web engineering..."
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00E5FF] text-sm transition-colors resize-none shadow-inner"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-widest uppercase hover:bg-[#33ebff] transition-all shadow-[0_0_30px_rgba(0,229,255,0.35)] hover:shadow-[0_0_45px_rgba(0,229,255,0.55)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    data-cursor="DISPATCH"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>TRANSMITTING MESSAGE...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>DISPATCH TRANSMISSION</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
