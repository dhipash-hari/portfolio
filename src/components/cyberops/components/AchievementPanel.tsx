import React from 'react';
import { Award, CheckCircle2, Lock, ArrowLeft, Terminal, Key, FileSearch, Code2, Cpu, ShieldAlert, Crown, Sparkles } from 'lucide-react';
import { ALL_ACHIEVEMENTS, Achievement } from '../types';

interface AchievementPanelProps {
  unlockedAchievementIds: string[];
  onBack: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Terminal: <Terminal className="w-5 h-5" />,
  Key: <Key className="w-5 h-5" />,
  FileSearch: <FileSearch className="w-5 h-5" />,
  Code2: <Code2 className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Crown: <Crown className="w-5 h-5 text-yellow-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-[#00E5FF]" />,
};

export const AchievementPanel: React.FC<AchievementPanelProps> = ({
  unlockedAchievementIds,
  onBack,
}) => {
  const unlockedCount = unlockedAchievementIds.length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col p-6 sm:p-8 font-mono select-none overflow-y-auto max-h-[580px] sm:max-h-[640px]">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#00E5FF] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO MISSION MAP</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">UNLOCKED:</span>
          <span className="text-xs font-bold text-[#00E5FF]">
            {unlockedCount} / {ALL_ACHIEVEMENTS.length}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-black text-white uppercase tracking-wide mb-1">
          OPERATOR BADGES & ACCREDITATIONS
        </h2>
        <p className="text-xs text-zinc-400">
          Special commendations awarded for speed, accuracy, zero-hint executions, and system breaches.
        </p>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {ALL_ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlockedAchievementIds.includes(ach.id);

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                isUnlocked
                  ? 'bg-zinc-900/80 border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,229,255,0.1)]'
                  : 'bg-zinc-950/40 border-white/5 opacity-40'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  isUnlocked
                    ? 'bg-cyan-950/80 text-[#00E5FF] border border-[#00E5FF]/30'
                    : 'bg-zinc-900 text-zinc-600 border border-white/5'
                }`}
              >
                {isUnlocked ? ICON_MAP[ach.icon] || <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-xs font-bold uppercase truncate ${isUnlocked ? 'text-white' : 'text-zinc-500'}`}>
                    {ach.title}
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                    {ach.category}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
