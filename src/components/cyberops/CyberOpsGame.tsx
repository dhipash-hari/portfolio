import React, { useState, useEffect } from 'react';
import { GameView, MissionMeta, MissionResultPayload, OperatorProfile, CAMPAIGN_MISSIONS } from './types';
import { loadOperator, saveOperator, awardMissionCompletion, resetOperatorProgress } from './storage/cyberStorage';
import { cyberAudio } from './audio/cyberAudio';

// Components
import { GameIntro } from './components/GameIntro';
import { OperatorHUD } from './components/OperatorHUD';
import { MissionMap } from './components/MissionMap';
import { MissionBriefing } from './components/MissionBriefing';
import { MissionResults } from './components/MissionResults';
import { AchievementPanel } from './components/AchievementPanel';
import { HowToPlayModal } from './components/HowToPlayModal';
import { CodenameModal } from './components/CodenameModal';

// Missions
import { Mission01Terminal } from './missions/Mission01Terminal';
import { Mission02Password } from './missions/Mission02Password';
import { Mission03Logs } from './missions/Mission03Logs';
import { Mission04Bugs } from './missions/Mission04Bugs';
import { Mission05Algorithms } from './missions/Mission05Algorithms';
import { Mission06Defender } from './missions/Mission06Defender';
import { Mission07Boss } from './missions/Mission07Boss';

interface CyberOpsGameProps {
  onExit?: () => void;
  defaultView?: GameView;
  initialTheaterMode?: boolean;
}

export const CyberOpsGame: React.FC<CyberOpsGameProps> = ({
  onExit,
  defaultView = 'INTRO',
  initialTheaterMode = false,
}) => {
  const [profile, setProfile] = useState<OperatorProfile>(loadOperator);
  const [view, setView] = useState<GameView>(defaultView);
  const [activeMission, setActiveMission] = useState<MissionMeta | null>(null);
  const [latestResult, setLatestResult] = useState<MissionResultPayload | null>(null);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(initialTheaterMode);

  // Modals
  const [showCodenameModal, setShowCodenameModal] = useState<boolean>(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync profile to storage whenever it updates
  useEffect(() => {
    saveOperator(profile);
  }, [profile]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleSound = () => {
    const nextState = !profile.soundEnabled;
    cyberAudio.setEnabled(nextState);
    setProfile((prev) => ({ ...prev, soundEnabled: nextState }));
  };

  const handleMissionSelect = (mission: MissionMeta) => {
    setActiveMission(mission);
    setView('BRIEFING');
  };

  const handleStartMission = () => {
    if (!activeMission) return;
    setView('MISSION');
  };

  const handleMissionComplete = (payload: MissionResultPayload) => {
    const { profile: updated, leveledUp, unlockedAchievements } = awardMissionCompletion(profile, payload);
    setProfile(updated);
    setLatestResult(payload);
    setView('RESULTS');

    if (leveledUp) {
      cyberAudio.playLevelUp();
      showToast(`⚡ PROMOTED! You reached LEVEL ${updated.level}!`);
    }

    if (unlockedAchievements.length > 0) {
      cyberAudio.playAchievement();
      showToast(`🏆 ACHIEVEMENT UNLOCKED: ${unlockedAchievements.join(', ')}`);
    }
  };

  const handleNextMission = () => {
    if (!activeMission) return;
    const nextId = activeMission.id + 1;
    const nextMission = CAMPAIGN_MISSIONS.find((m) => m.id === nextId);
    if (nextMission && profile.unlockedMissions.includes(nextId)) {
      setActiveMission(nextMission);
      setView('BRIEFING');
    } else {
      setView('MAP');
    }
  };

  const handleRetryMission = () => {
    if (!activeMission) return;
    setView('MISSION');
  };

  const handleResetProgress = () => {
    const reset = resetOperatorProgress();
    setProfile(reset);
    setActiveMission(null);
    setLatestResult(null);
    setView('MAP');
    cyberAudio.playError();
    showToast('All progress reset to Level 1.');
  };

  const handleExitGame = () => {
    if (onExit) {
      onExit();
    } else {
      setView('INTRO');
    }
  };

  return (
    <div
      className={`w-full transition-all duration-300 relative ${
        isTheaterMode
          ? 'fixed inset-0 z-50 bg-[#04060B] flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden'
          : 'w-full flex flex-col items-center'
      }`}
    >
      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#00E5FF] text-black font-mono font-bold text-xs shadow-[0_0_30px_rgba(0,229,255,0.8)] animate-bounce">
          {notification}
        </div>
      )}

      {/* Intro View */}
      {view === 'INTRO' && (
        <GameIntro
          onEnter={() => setView('MAP')}
          onHowToPlay={() => setShowHowToPlayModal(true)}
          onReturnToPortfolio={handleExitGame}
          soundEnabled={profile.soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* Main Campaign Frame */}
      {view !== 'INTRO' && (
        <div className="w-full max-w-5xl rounded-3xl bg-[#060911] border border-cyan-500/25 overflow-hidden shadow-2xl flex flex-col min-h-[580px] sm:min-h-[660px]">
          {/* Persistent Top HUD */}
          <OperatorHUD
            profile={profile}
            activeView={view}
            onNavigate={(v) => setView(v)}
            onEditCodename={() => setShowCodenameModal(true)}
            onToggleSound={handleToggleSound}
            isTheaterMode={isTheaterMode}
            onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
            onExit={handleExitGame}
          />

          {/* Main Viewport Content */}
          <div className="flex-1 flex flex-col justify-center p-3 sm:p-6 overflow-hidden relative">
            {/* View: Map */}
            {view === 'MAP' && (
              <MissionMap
                profile={profile}
                onSelectMission={handleMissionSelect}
                onResetProgress={handleResetProgress}
              />
            )}

            {/* View: Briefing */}
            {view === 'BRIEFING' && activeMission && (
              <MissionBriefing
                mission={activeMission}
                onStart={handleStartMission}
                onBack={() => setView('MAP')}
              />
            )}

            {/* View: Mission Gameplay */}
            {view === 'MISSION' && activeMission && (
              <div className="w-full h-full flex flex-col items-center">
                {activeMission.id === 1 && (
                  <Mission01Terminal
                    onComplete={handleMissionComplete}
                    onExit={() => setView('MAP')}
                  />
                )}
                {activeMission.id === 2 && (
                  <Mission02Password
                    onComplete={handleMissionComplete}
                    onExit={() => setView('MAP')}
                  />
                )}
                {activeMission.id === 3 && (
                  <Mission03Logs
                    onComplete={handleMissionComplete}
                    onExit={() => setView('MAP')}
                  />
                )}
                {activeMission.id === 4 && (
                  <Mission04Bugs
                    onComplete={handleMissionComplete}
                    onExit={() => setView('MAP')}
                  />
                )}
                {activeMission.id === 5 && (
                  <Mission05Algorithms
                    onComplete={handleMissionComplete}
                    onExit={() => setView('MAP')}
                  />
                )}
                {activeMission.id === 6 && (
                  <Mission06Defender
                    onComplete={handleMissionComplete}
                    onExit={() => setView('MAP')}
                  />
                )}
                {activeMission.id === 7 && (
                  <Mission07Boss
                    onComplete={handleMissionComplete}
                    onExit={() => setView('MAP')}
                  />
                )}
              </div>
            )}

            {/* View: Results */}
            {view === 'RESULTS' && latestResult && (
              <MissionResults
                result={latestResult}
                onNext={handleNextMission}
                onRetry={handleRetryMission}
                onReturnToMap={() => setView('MAP')}
              />
            )}

            {/* View: Achievements */}
            {view === 'ACHIEVEMENTS' && (
              <AchievementPanel
                unlockedAchievementIds={profile.achievements}
                onBack={() => setView('MAP')}
              />
            )}

            {/* View: Instructions */}
            {view === 'INSTRUCTIONS' && (
              <HowToPlayModal onClose={() => setView('MAP')} />
            )}
          </div>
        </div>
      )}

      {/* Global How to Play Modal */}
      {showHowToPlayModal && (
        <HowToPlayModal onClose={() => setShowHowToPlayModal(false)} />
      )}

      {/* Codename Edit Modal */}
      {showCodenameModal && (
        <CodenameModal
          currentCodename={profile.codename}
          onSave={(newName) => {
            setProfile((prev) => ({ ...prev, codename: newName }));
            setShowCodenameModal(false);
          }}
          onClose={() => setShowCodenameModal(false)}
        />
      )}
    </div>
  );
};
