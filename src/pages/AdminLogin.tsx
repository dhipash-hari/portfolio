import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { signIn, isLiveSupabase } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await signIn(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMsg(res.error || 'Authentication rejected. Verify credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090B] flex flex-col justify-center items-center px-6 relative overflow-hidden text-zinc-100">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00E5FF]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

      {/* Back button */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-[#00E5FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>PORTFOLIO HOME</span>
        </Link>
      </div>

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-panel border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative">
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.2)]">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-1">
          Admin Portal Authentication
        </h1>
        <p className="text-xs font-mono text-center text-zinc-400 mb-8">
          Dhipash Hari Dev M • Portfolio CMS
        </p>

        {/* Backend mode indicator */}
        <div className="mb-4 p-3 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-500">BACKEND STATE:</span>
          <span className={`flex items-center gap-1.5 ${isLiveSupabase ? 'text-emerald-400' : 'text-amber-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isLiveSupabase ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
            {isLiveSupabase ? 'Supabase PostgreSQL' : 'Local Dev Fallback'}
          </span>
        </div>

        {!isLiveSupabase && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-amber-300 font-bold text-[11px] uppercase tracking-wider">DEV FALLBACK CREDENTIALS</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@dhipash.dev');
                  setPassword('admin123');
                }}
                className="text-[11px] text-[#00E5FF] hover:underline cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Email: <span className="text-white">admin@dhipash.dev</span>
              <br />
              Password: <span className="text-white">admin123</span>
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5 tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dhipash.dev"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00E5FF] text-sm font-mono transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-zinc-400 block mb-1.5 tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00E5FF] text-sm font-mono transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 py-3.5 rounded-xl bg-[#00E5FF] text-black font-bold text-xs font-mono tracking-widest uppercase hover:bg-[#33ebff] transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <span>AUTHENTICATE & ENTER</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
