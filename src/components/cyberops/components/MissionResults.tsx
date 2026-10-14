import React from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, Trophy, Sparkles, Clock, AlertTriangle, BookOpen } from 'lucide-react';
import { MissionResultPayload, CAMPAIGN_MISSIONS } from '../types';
import { cyberAudio } from '../audio/cyberAudio';

interface MissionResultsProps {
  result: MissionResultPayload;
  onNext: () => void;
  onRetry: () => void;
  onReturnToMap: () => void;
}

export const MissionResults: React.FC<MissionResultsProps> = ({
  result,
  onNext,
  onRetry,
  onReturnToMap,
}) => {
  const mission = CAMPAIGN_MISSIONS.find((m) => m.id === result.missionId);
  const isFinalMission = result.missionId === 7;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col p-6 sm:p-8 bg-[#070B14] border border-cyan-500/30 rounded-2xl font-mono text-zinc-200 shadow-[0_0_50px_rgba(0,229,255,0.15)] relative">
      {/* Result Status Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-[10px] text-emerald-400 tracking-widest font-bold uppercase block">
          MISSION DEBRIEFING // 100% OPERATIONAL
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
          {mission?.title || `Mission 0${result.missionId}`} Cleared
        </h2>
      </div>

      {/* Score and Stats Breakdown Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center">
          <span className="text-[10px] text-zinc-500 uppercase block mb-1">SCORE</span>
          <span className="text-lg font-black text-[#00E5FF]">
            {result.scoreEarned.toLocaleString()}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center">
          <span className="text-[10px] text-zinc-500 uppercase block mb-1">XP EARNED</span>
          <span className="text-lg font-black text-purple-400">
            +{result.xpEarned}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center">
          <span className="text-[10px] text-zinc-500 uppercase block mb-1">TIME</span>
          <span className="text-lg font-black text-white">
            {result.timeSpentSec}s
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-center">
          <span className="text-[10px] text-zinc-500 uppercase block mb-1">ACCURACY</span>
          <span className={`text-lg font-black ${result.mistakes === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {result.mistakes === 0 ? 'FLAWLESS' : `${result.mistakes} errors`}
          </span>
        </div>
      </div>

      {/* Educational Concept Debrief */}
      {mission && (
        <div className="p-4 rounded-xl bg-zinc-900/70 border border-white/10 mb-6 text-xs leading-relaxed">
          <div className="flex items-center gap-2 text-[#00E5FF] font-bold mb-1.5">
            <BookOpen className="w-4 h-4" />
            <span>CYBERSECURITY PRINCIPLE LEARNED:</span>
          </div>
          <p className="text-zinc-300">
            {mission.conceptExplanation}
          </p>
        </div>
      )}

      {/* Bottom Action Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
        <button
          onClick={() => {
            cyberAudio.playKeystroke();
            onRetry();
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Mission</span>
        </button>

        <div className="flex-1 flex gap-2 w-full">
          <button
            onClick={() => {
              cyberAudio.playKeystroke();
              onReturnToMap();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer text-center"
          >
            Mission Map
          </button>

          {!isFinalMission && (
            <button
              onClick={() => {
                cyberAudio.playCommandSubmit();
                onNext();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#00E5FF] hover:bg-cyan-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer"
            >
              <span>Next Mission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
