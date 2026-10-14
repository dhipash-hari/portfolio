import React, { useState } from 'react';
import { Lock, Play, CheckCircle2, AlertOctagon, RotateCcw, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { CAMPAIGN_MISSIONS, OperatorProfile, MissionMeta } from '../types';
import { cyberAudio } from '../audio/cyberAudio';

interface MissionMapProps {
  profile: OperatorProfile;
  onSelectMission: (mission: MissionMeta) => void;
  onResetProgress: () => void;
}

export const MissionMap: React.FC<MissionMapProps> = ({
  profile,
  onSelectMission,
  onResetProgress,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30';
      case 'INTERMEDIATE':
        return 'bg-blue-950/60 text-cyan-400 border-cyan-500/30';
      case 'ADVANCED':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/30';
      case 'EXPERT':
        return 'bg-red-950/60 text-red-400 border-red-500/40';
      default:
        return 'bg-zinc-800 text-zinc-400';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col p-4 sm:p-8 font-mono select-none overflow-y-auto max-h-[580px] sm:max-h-[640px]">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-[#00E5FF] border border-[#00E5FF]/30 font-bold uppercase">
              TACTICAL CAMPAIGN
            </span>
            <span className="text-xs text-zinc-400">7 Interconnected Security Protocols</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase">
            Mission Operations Grid
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* Grid of 7 Missions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {CAMPAIGN_MISSIONS.map((mission) => {
          const isCompleted = profile.completedMissions.includes(mission.id);
          const isUnlocked = profile.unlockedMissions.includes(mission.id);
          const bestScore = profile.missionScores[mission.id] || 0;
          const isBoss = mission.id === 7;

          return (
            <div
              key={mission.id}
              onClick={() => {
                if (isUnlocked) {
                  cyberAudio.playCommandSubmit();
                  onSelectMission(mission);
                } else {
                  cyberAudio.playError();
                }
              }}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                isBoss
                  ? isUnlocked
                    ? 'bg-gradient-to-br from-[#12070D] to-[#0A0710] border-red-500/50 hover:border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)] cursor-pointer'
                    : 'bg-zinc-950/80 border-white/5 opacity-60 cursor-not-allowed'
                  : isUnlocked
                  ? 'bg-zinc-900/60 border-cyan-500/30 hover:border-[#00E5FF] hover:bg-zinc-900/90 shadow-lg cursor-pointer group'
                  : 'bg-zinc-950/60 border-white/5 opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Mission Top Metadata */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                  <span className={isBoss ? 'text-red-400' : 'text-[#00E5FF]'}>{mission.code}</span>
                  {isBoss && <AlertOctagon className="w-3.5 h-3.5 text-red-500 animate-pulse" />}
                </span>

                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getDifficultyBadge(mission.difficulty)}`}>
                  {mission.difficulty}
                </span>
              </div>

              {/* Title & Concept */}
              <div className="mb-4">
                <h4 className="text-base font-bold text-white mb-1 group-hover:text-[#00E5FF] transition-colors">
                  {mission.title}
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {mission.subtitle}
                </p>
              </div>

              {/* Bottom State / Action */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                {isCompleted ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>BEST: {bestScore} PTS</span>
                  </div>
                ) : isUnlocked ? (
                  <div className="flex items-center gap-1 text-[#00E5FF] text-[11px] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{mission.xpReward} XP</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-zinc-500 text-[11px]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>LOCKED</span>
                  </div>
                )}

                {isUnlocked && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white group-hover:translate-x-0.5 transition-transform">
                    {isCompleted ? 'Replay' : 'Launch'}
                    <ChevronRight className="w-3.5 h-3.5 text-[#00E5FF]" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0D121F] border border-red-500/40 rounded-2xl p-6 text-zinc-200 shadow-2xl">
            <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              CONFIRM PROTOCOL RESET
            </h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              This action will reset your Operator level, XP, score, unlocked missions, and achievements.
              This cannot be undone. Are you sure you want to start a fresh run?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetProgress();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Reset All Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
