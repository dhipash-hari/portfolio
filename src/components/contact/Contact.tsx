import React, { useState } from 'react';
import { Profile, SocialLink } from '../../types/portfolio';
import { Mail, Phone, MapPin, Send, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/Icons';
import { sendContactMessage } from '../../services/contactService';
import confetti from 'canvas-confetti';

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
          particleCount: 60,
          spread: 70,
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
    <section id="contact" className="py-28 relative border-t border-white/5">
      {/* Background glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Index Indicator */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono text-[#00E5FF]">07 //</span>
          <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
            Initiate Collaboration
          </span>
          <div className="h-px bg-white/10 flex-1 ml-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Inquiries & Bio */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 uppercase">
                Let's Build Something Intelligent.
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed mb-10 max-w-xl">
                Open to discussions surrounding machine learning research, computer vision projects, data analysis, and advanced frontend interaction design.
              </p>

              {/* Direct Channels */}
              <div className="space-y-4 mb-10">
                {/* Email with copy button */}
                <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[#00E5FF]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                        DIRECT EMAIL
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
                    className="p-2.5 rounded-xl bg-zinc-800/60 hover:bg-[#00E5FF]/20 text-zinc-400 hover:text-[#00E5FF] transition-colors"
                    title="Copy email to clipboard"
                    data-cursor="COPY"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone */}
                {profile.phone && (
                  <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[#00E5FF]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                        PHONE CONTACT
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
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/dhipash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-[#00E5FF]/40 text-xs font-mono text-zinc-300 hover:text-white transition-all"
                  data-cursor="GITHUB"
                >
                  <GithubIcon className="w-4 h-4 text-[#00E5FF]" />
                  github.com/dhipash
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-[#00E5FF]/40 text-xs font-mono text-zinc-300 hover:text-white transition-all"
                  data-cursor="LINKEDIN"
                >
                  <LinkedinIcon className="w-4 h-4 text-[#00E5FF]" />
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-white/10 relative overflow-hidden">
              <h3 className="text-2xl font-bold text-white mb-2">
                Send a Dispatch
              </h3>
              <p className="text-xs text-zinc-400 font-mono mb-8">
                Transmitted directly to Supabase with encrypted delivery.
              </p>

              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#00E5FF]/20 border border-[#00E5FF] flex items-center justify-center text-[#00E5FF] mb-4 animate-bounce">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Transmission Dispatched</h4>
                  <p className="text-sm text-zinc-400 max-w-sm mb-6 font-light">
                    Thank you for reaching out. Dhipash will review your inquiry shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-xl bg-zinc-800 text-xs font-mono text-[#00E5FF] hover:bg-zinc-700 transition-colors"
                  >
                    Send another message
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
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00E5FF] text-sm transition-colors"
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
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00E5FF] text-sm transition-colors"
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
                      placeholder="Discussing a research topic, machine learning collaboration, or creative web engineering..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00E5FF] text-sm transition-colors resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-widest uppercase hover:bg-[#33ebff] transition-all shadow-[0_0_25px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    data-cursor="DISPATCH"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>TRANSMITTING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>DISPATCH MESSAGE</span>
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
