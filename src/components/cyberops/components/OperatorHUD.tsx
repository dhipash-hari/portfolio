import React from 'react';
import { Shield, Trophy, Map, HelpCircle, Volume2, VolumeX, Maximize2, Minimize2, Edit3, Award } from 'lucide-react';
import { OperatorProfile } from '../types';
import { getXPForNextLevel } from '../storage/cyberStorage';
import { cyberAudio } from '../audio/cyberAudio';

interface OperatorHUDProps {
  profile: OperatorProfile;
  activeView: string;
  onNavigate: (view: 'MAP' | 'ACHIEVEMENTS' | 'INSTRUCTIONS') => void;
  onEditCodename: () => void;
  onToggleSound: () => void;
  isTheaterMode: boolean;
  onToggleTheater: () => void;
  onExit: () => void;
}

export const OperatorHUD: React.FC<OperatorHUDProps> = ({
  profile,
  activeView,
  onNavigate,
  onEditCodename,
  onToggleSound,
  isTheaterMode,
  onToggleTheater,
  onExit,
}) => {
  const { currentMinXP, nextLevelXP } = getXPForNextLevel(profile.level);
  const xpInCurrentLevel = Math.max(0, profile.xp - currentMinXP);
  const xpNeededForLevel = nextLevelXP - currentMinXP;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100));

  return (
    <div className="w-full bg-[#080C16] border-b border-cyan-500/20 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-zinc-300 select-none z-20">
      {/* Left: Operator Codename & Level */}
      <div className="flex items-center gap-3">
        {/* Codename Badge */}
        <button
          onClick={onEditCodename}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 hover:border-[#00E5FF]/40 text-[#00E5FF] transition-colors cursor-pointer group"
          title="Click to change Operator Codename"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="font-bold tracking-wider">{profile.codename}</span>
          <Edit3 className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
        </button>

        {/* Level & XP Gauge */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-[#00E5FF]/40 text-[#00E5FF] font-black text-[11px]">
            LVL {profile.level}
          </span>
          <div className="w-20 sm:w-28 h-2 rounded-full bg-zinc-800 overflow-hidden" title={`${profile.xp} XP total`}>
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-500 hidden sm:inline">
            {profile.xp} XP
          </span>
        </div>
      </div>

      {/* Middle: Mission Progress & Score */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-zinc-500 uppercase">CLEARED:</span>
          <span className="text-emerald-400 font-bold">
            {profile.completedMissions.length} / 7
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-zinc-500 uppercase">SCORE:</span>
          <span className="text-white font-bold">{profile.score.toLocaleString()}</span>
        </div>
      </div>

      {/* Right: Navigation & Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            cyberAudio.playKeystroke();
            onNavigate('MAP');
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
            activeView === 'MAP'
              ? 'bg-[#00E5FF] text-black font-bold border-[#00E5FF]'
              : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
          }`}
          title="Mission Map"
        >
          <Map className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Map</span>
        </button>

        <button
          onClick={() => {
            cyberAudio.playKeystroke();
            onNavigate('ACHIEVEMENTS');
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
            activeView === 'ACHIEVEMENTS'
              ? 'bg-[#00E5FF] text-black font-bold border-[#00E5FF]'
              : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
          }`}
          title="Achievements"
        >
          <Award className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Badges ({profile.achievements.length})</span>
        </button>

        <button
          onClick={() => {
            cyberAudio.playKeystroke();
            onNavigate('INSTRUCTIONS');
          }}
          className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Instructions & Rules"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onToggleSound}
          className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title={profile.soundEnabled ? 'Mute Audio' : 'Enable Audio'}
        >
          {profile.soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>

        <button
          onClick={onToggleTheater}
          className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer hidden md:flex"
          title={isTheaterMode ? 'Exit Theater' : 'Expand Theater Mode'}
        >
          {isTheaterMode ? (
            <Minimize2 className="w-3.5 h-3.5 text-[#00E5FF]" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={onExit}
          className="ml-2 text-[11px] text-zinc-500 hover:text-red-400 transition-colors"
          title="Return to Portfolio"
        >
          Exit
        </button>
      </div>
    </div>
  );
};
