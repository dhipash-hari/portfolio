import React from 'react';
import { ArrowUp, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 border-t border-white/5 bg-[#050608] text-zinc-400 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
            <span className="text-white font-bold tracking-widest text-sm uppercase">
              DHIPASH HARI DEV M
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-light max-w-md">
            Building intelligent digital experiences where data, technology and design meet.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono text-zinc-400">
          <Link to="/admin" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5" data-cursor="ADMIN">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Portal
          </Link>

          <span>•</span>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            data-cursor="TOP"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#00E5FF]" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-600">
        <span>© {new Date().getFullYear()} Dhipash Hari Dev M. All rights reserved.</span>
        <span>Ramco Institute of Technology • B.Tech AI & Data Science</span>
      </div>
    </footer>
  );
};
