import React from 'react';
import { Shield, Play, ArrowLeft, Target, BookOpen, Sparkles, Award } from 'lucide-react';
import { MissionMeta } from '../types';
import { cyberAudio } from '../audio/cyberAudio';

interface MissionBriefingProps {
  mission: MissionMeta;
  onStart: () => void;
  onBack: () => void;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({
  mission,
  onStart,
  onBack,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col p-6 sm:p-8 bg-[#070B14] border border-cyan-500/30 rounded-2xl font-mono shadow-[0_0_50px_rgba(0,229,255,0.15)] relative">
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
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
            {mission.difficulty}
          </span>
          <span className="text-xs text-[#00E5FF] font-bold">{mission.code}</span>
        </div>
      </div>

      {/* Dossier Header */}
      <div className="mb-6">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
          CLASSIFIED OPERATION DOSSIER
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
          {mission.title}
        </h2>
        <p className="text-xs sm:text-sm text-cyan-300 font-mono">
          {mission.subtitle}
        </p>
      </div>

      {/* Narrative & Tactical Sections */}
      <div className="space-y-4 mb-6 text-xs leading-relaxed">
        {/* Story Brief */}
        <div className="p-4 rounded-xl bg-black/50 border border-white/10">
          <div className="flex items-center gap-2 text-[#00E5FF] font-bold mb-1.5">
            <Shield className="w-4 h-4" />
            <span>SITUATION BRIEFING:</span>
          </div>
          <p className="text-zinc-300">{mission.story}</p>
        </div>

        {/* Tactical Objective */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
          <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1.5">
            <Target className="w-4 h-4" />
            <span>PRIMARY OBJECTIVE:</span>
          </div>
          <p className="text-zinc-200">{mission.objective}</p>
        </div>

        {/* Technical Concept */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10">
          <div className="flex items-center gap-2 text-purple-400 font-bold mb-1.5">
            <BookOpen className="w-4 h-4" />
            <span>EDUCATIONAL CONCEPT // {mission.concept}:</span>
          </div>
          <p className="text-zinc-400">{mission.conceptExplanation}</p>
        </div>
      </div>

      {/* Rewards & Launch Button */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#00E5FF]">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold">+{mission.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Award className="w-4 h-4 text-yellow-400" />
            <span>MAX {mission.maxScore} PTS</span>
          </div>
        </div>

        <button
          onClick={() => {
            cyberAudio.playCommandSubmit();
            onStart();
          }}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#00E5FF] hover:bg-cyan-400 text-black font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>INITIALIZE MISSION</span>
        </button>
      </div>
    </div>
  );
};
