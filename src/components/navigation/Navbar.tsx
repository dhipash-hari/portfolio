import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  resumeUrl?: string | null;
}

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Motion Lab', href: '#motion-lab' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ resumeUrl }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Section detection
      const sections = ['about', 'skills', 'projects', 'motion-lab', 'achievements', 'education', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + href);
      return;
    }
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-[#08090B]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 text-offwhite focus:outline-none"
            data-cursor="HOME"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#3B82F6] flex items-center justify-center font-bold text-black text-sm tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-transform duration-200">
              D
            </div>
            <span className="font-semibold text-base tracking-widest uppercase text-zinc-100 group-hover:text-[#00E5FF] transition-colors">
              DHIPASH
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full px-4 py-1.5 bg-zinc-900/60 border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative px-4 py-1.5 text-xs font-mono tracking-wider transition-colors duration-200 ${
                    isActive ? 'text-[#00E5FF]' : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                  data-cursor="NAV"
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 -z-10"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono tracking-wider text-zinc-200 bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 transition-all hover:border-[#00E5FF]/40"
                data-cursor="RESUME"
              >
                <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
                Resume
              </a>
            ) : (
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#contact');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono tracking-wider text-zinc-200 bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 transition-all hover:border-[#00E5FF]/40"
                data-cursor="CONNECT"
              >
                Connect
              </a>
            )}

            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono tracking-wider text-zinc-400 hover:text-[#00E5FF] hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
              title="Admin Portal"
              data-cursor="ADMIN"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-white bg-zinc-900/60 border border-white/10 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-[#08090B]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-8 flex flex-col gap-4 lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-lg font-medium text-zinc-300 hover:text-[#00E5FF] py-2 border-b border-white/5 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500" />
                </button>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-3">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-800 text-sm font-mono text-zinc-200 border border-white/10"
                >
                  <Download className="w-4 h-4 text-[#00E5FF]" />
                  Download Resume
                </a>
              )}
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 text-sm font-mono text-zinc-400 border border-white/10"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
