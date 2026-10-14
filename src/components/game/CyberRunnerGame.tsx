import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Maximize2, 
  Minimize2, 
  Pause, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Trophy, 
  Zap, 
  Gauge, 
  Sparkles,
  ShieldAlert,
  X
} from 'lucide-react';
import { CyberRunnerCanvas, GameState, GameMetrics } from './three/CyberRunnerCanvas';
import { soundManager } from './audio/soundEffects';

interface CyberRunnerGameProps {
  onBackToPortfolio?: () => void;
  className?: string;
}

export const CyberRunnerGame: React.FC<CyberRunnerGameProps> = ({
  onBackToPortfolio,
  className = '',
}) => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [isExpanded, setIsExpanded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());
  const [countdown, setCountdown] = useState(3);
  const [metrics, setMetrics] = useState<GameMetrics>({
    score: 0,
    distance: 0,
    energyOrbs: 0,
    multiplier: 1,
    speed: 65,
    highScore: 0,
  });
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Keyboard and touch controls bridge
  const controlsRef = useRef<{
    moveLeft: () => void;
    moveRight: () => void;
    jump: () => void;
    slide: () => void;
  }>({
    moveLeft: () => {},
    moveRight: () => {},
    jump: () => {},
    slide: () => {},
  });

  // Load High Score on Mount
  useEffect(() => {
    const saved = localStorage.getItem('cyber_runner_high_score');
    if (saved) {
      setMetrics((m) => ({ ...m, highScore: parseInt(saved, 10) || 0 }));
    }
  }, []);

  // Keyboard Input Handler (prevents scrolling during gameplay!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'PLAYING') {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
          e.preventDefault();
        }

        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          controlsRef.current.moveLeft();
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          controlsRef.current.moveRight();
        } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
          controlsRef.current.jump();
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          controlsRef.current.slide();
        } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
          setGameState('PAUSED');
          soundManager.playClick();
        }
      } else if (gameState === 'PAUSED') {
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
          setGameState('PLAYING');
          soundManager.playClick();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Touch Swipe Gesture Support
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || gameState !== 'PLAYING') return;
    const touchEnd = e.changedTouches[0];
    const diffX = touchEnd.clientX - touchStartRef.current.x;
    const diffY = touchEnd.clientY - touchStartRef.current.y;

    // Minimum swipe threshold
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 30) {
        if (diffX > 0) {
          controlsRef.current.moveRight();
        } else {
          controlsRef.current.moveLeft();
        }
      }
    } else {
      if (Math.abs(diffY) > 30) {
        if (diffY < 0) {
          controlsRef.current.jump();
        } else {
          controlsRef.current.slide();
        }
      }
    }
    touchStartRef.current = null;
  };

  // Start Countdown Sequence
  const startCountdown = () => {
    soundManager.playClick();
    setGameState('COUNTDOWN');
    setCountdown(3);
    setIsNewHighScore(false);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        soundManager.playClick();
      } else {
        clearInterval(interval);
        setGameState('PLAYING');
      }
    }, 850);
  };

  // Handle Game Over
  const handleGameOver = (finalMetrics: GameMetrics) => {
    const isNewBest = finalMetrics.score > metrics.highScore;
    if (isNewBest) {
      localStorage.setItem('cyber_runner_high_score', String(finalMetrics.score));
      setIsNewHighScore(true);
    }

    setMetrics((prev) => ({
      ...finalMetrics,
      highScore: isNewBest ? finalMetrics.score : prev.highScore,
    }));
    setGameState('GAME_OVER');
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const next = soundManager.toggleSound();
    setSoundEnabled(next);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full rounded-3xl overflow-hidden glass-panel border border-[#00E5FF]/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] select-none transition-all duration-500 ${
        isExpanded
          ? 'fixed inset-4 sm:inset-8 z-50 bg-[#04060b]/98'
          : 'min-h-[480px] sm:min-h-[580px] h-[520px] sm:h-[620px]'
      } ${className}`}
    >
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <CyberRunnerCanvas
          gameState={gameState}
          onGameOver={handleGameOver}
          onScoreUpdate={(live) => {
            setMetrics((prev) => ({ ...prev, ...live }));
          }}
          controlsRef={controlsRef}
        />
      </div>

      {/* Top Header Controls Bar (Always Visible) */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-5 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest text-white uppercase drop-shadow-[0_0_10px_#00E5FF]">
            CYBER RUNNER
          </span>
          <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
            // DEVELOPER UNIVERSE 3D
          </span>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-[#00E5FF] transition-all cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00E5FF]" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          {/* How to Play */}
          <button
            onClick={() => {
              soundManager.playClick();
              setGameState(gameState === 'INSTRUCTIONS' ? 'MENU' : 'INSTRUCTIONS');
            }}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-[#00E5FF] transition-all cursor-pointer"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Fullscreen / Theater Mode Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-[#00E5FF] transition-all cursor-pointer"
            title={isExpanded ? 'Minimize View' : 'Expand View'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Pause Button (Visible during gameplay) */}
          {gameState === 'PLAYING' && (
            <button
              onClick={() => {
                soundManager.playClick();
                setGameState('PAUSED');
              }}
              className="p-2 rounded-xl bg-[#00E5FF] text-black font-bold hover:bg-[#38bdf8] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.4)]"
              title="Pause Game"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}

          {/* Exit / Return to Portfolio (If expanded) */}
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 transition-all cursor-pointer"
              title="Close Theater"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* HUD OVERLAY (Active Gameplay)                                      */}
      {/* ------------------------------------------------------------------ */}
      {gameState === 'PLAYING' && (
        <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between z-10">
          {/* Top Metric Telemetry */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            {/* Score & Multiplier */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 shadow-lg">
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase">SCORE</span>
                <span className="text-xl sm:text-2xl font-black text-white tracking-wider">
                  {metrics.score.toLocaleString()}
                </span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="text-right">
                <span className="text-[10px] text-[#00E5FF] block uppercase font-bold">MULTIPLIER</span>
                <span className="text-sm font-bold text-[#00E5FF]">
                  {metrics.multiplier}x
                </span>
              </div>
            </div>

            {/* Distance & Speed */}
            <div className="flex items-center gap-4 px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 shadow-lg">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Gauge className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>{metrics.speed} KM/H</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <Zap className="w-3.5 h-3.5" />
                <span>{metrics.energyOrbs} ORBS</span>
              </div>
              <div className="text-zinc-400">
                <span>{metrics.distance} M</span>
              </div>
            </div>
          </div>

          {/* Bottom On-Screen Mobile Controls (Visible on Touch / Small Screens) */}
          <div className="pointer-events-auto flex items-center justify-between gap-4 mt-auto sm:hidden pb-2">
            <div className="flex gap-2">
              <button
                onTouchStart={(e) => { e.preventDefault(); controlsRef.current.moveLeft(); }}
                onClick={() => controlsRef.current.moveLeft()}
                className="w-13 h-13 rounded-2xl bg-black/70 active:bg-[#00E5FF] border border-white/20 active:text-black flex items-center justify-center text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onTouchStart={(e) => { e.preventDefault(); controlsRef.current.moveRight(); }}
                onClick={() => controlsRef.current.moveRight()}
                className="w-13 h-13 rounded-2xl bg-black/70 active:bg-[#00E5FF] border border-white/20 active:text-black flex items-center justify-center text-white"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onTouchStart={(e) => { e.preventDefault(); controlsRef.current.slide(); }}
                onClick={() => controlsRef.current.slide()}
                className="w-13 h-13 rounded-2xl bg-black/70 active:bg-rose-500 border border-white/20 active:text-white flex items-center justify-center text-zinc-300 text-xs font-mono font-bold"
              >
                <ArrowDown className="w-6 h-6" />
              </button>
              <button
                onTouchStart={(e) => { e.preventDefault(); controlsRef.current.jump(); }}
                onClick={() => controlsRef.current.jump()}
                className="w-13 h-13 rounded-2xl bg-[#00E5FF] active:bg-[#38bdf8] text-black font-black flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.5)]"
              >
                <ArrowUp className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* COUNTDOWN OVERLAY                                                  */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {gameState === 'COUNTDOWN' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-7xl sm:text-9xl font-black text-[#00E5FF] drop-shadow-[0_0_35px_#00E5FF]"
            >
              {countdown}
            </motion.div>
            <span className="text-sm font-mono tracking-widest text-zinc-300 uppercase mt-4">
              INITIALIZING CYBER RUNWAY...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN MENU OVERLAY                                                  */}
      {/* ------------------------------------------------------------------ */}
      {gameState === 'MENU' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-[#04060b]/90 via-[#04060b]/40 to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full"
          >
            {/* Title Glow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIVE ARCADE EXPERIENCE</span>
            </div>

            <h3 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none mb-2 drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">
              CYBER RUNNER
            </h3>
            <p className="text-xs sm:text-sm font-mono text-zinc-300 tracking-wider uppercase mb-8">
              Enter the Developer Universe
            </p>

            {/* High Score Badge */}
            {metrics.highScore > 0 && (
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>PERSONAL BEST: {metrics.highScore.toLocaleString()} PTS</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={startCountdown}
                className="w-full py-4 rounded-2xl bg-[#00E5FF] hover:bg-[#38bdf8] text-black font-extrabold text-sm font-mono tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_40px_rgba(0,229,255,0.65)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>PLAY NOW</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setGameState('INSTRUCTIONS');
                  }}
                  className="py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>HOW TO PLAY</span>
                </button>

                <button
                  onClick={handleToggleSound}
                  className="py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>SOUND: ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                      <span>SOUND: OFF</span>
                    </>
                  )}
                </button>
              </div>

              {onBackToPortfolio && (
                <button
                  onClick={onBackToPortfolio}
                  className="py-2.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer mt-1"
                >
                  ← RETURN TO PORTFOLIO
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* INSTRUCTIONS MODAL                                                 */}
      {/* ------------------------------------------------------------------ */}
      {gameState === 'INSTRUCTIONS' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-white/15 shadow-2xl text-left"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h4 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#00E5FF]" />
                How to Play
              </h4>
              <button
                onClick={() => setGameState('MENU')}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono text-zinc-300">
              {/* Keyboard Controls */}
              <div>
                <span className="text-[10px] uppercase text-[#00E5FF] font-bold block mb-1.5">
                  DESKTOP CONTROLS
                </span>
                <div className="grid grid-cols-2 gap-2 text-zinc-400">
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <strong className="text-white">A / Left Arrow:</strong> Move Left
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <strong className="text-white">D / Right Arrow:</strong> Move Right
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <strong className="text-white">Space / W / Up:</strong> Jump Over
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/5">
                    <strong className="text-white">S / Down Arrow:</strong> Slide Under
                  </div>
                </div>
              </div>

              {/* Mobile Controls */}
              <div>
                <span className="text-[10px] uppercase text-[#00E5FF] font-bold block mb-1.5">
                  TOUCH & MOBILE CONTROLS
                </span>
                <p className="text-zinc-400 leading-relaxed">
                  Swipe Left/Right to change lanes, Swipe Up to jump, Swipe Down to slide. Or tap the on-screen D-pad buttons.
                </p>
              </div>

              {/* Obstacle Types */}
              <div>
                <span className="text-[10px] uppercase text-[#00E5FF] font-bold block mb-1.5">
                  OBSTACLES & SCORING
                </span>
                <ul className="space-y-1 text-zinc-400">
                  <li>• <strong className="text-cyan-400">Low Barriers:</strong> Jump over them.</li>
                  <li>• <strong className="text-rose-400">Laser Arrays:</strong> Slide beneath them.</li>
                  <li>• <strong className="text-purple-400">Cyber Monoliths:</strong> Unjumpable! Switch lanes.</li>
                  <li>• <strong className="text-amber-400">Energy Orbs:</strong> +150 pts & builds score multiplier.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={startCountdown}
              className="mt-6 w-full py-3.5 rounded-xl bg-[#00E5FF] hover:bg-[#38bdf8] text-black font-extrabold text-xs font-mono tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer"
            >
              GOT IT // READY TO RUN
            </button>
          </motion.div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* PAUSE MODAL                                                        */}
      {/* ------------------------------------------------------------------ */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-sm w-full p-8 rounded-3xl bg-zinc-900/90 border border-white/15 text-center shadow-2xl"
          >
            <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
              SIMULATION PAUSED
            </h4>
            <p className="text-xs font-mono text-zinc-400 mb-6">
              Score: {metrics.score.toLocaleString()} | {metrics.distance} Meters
            </p>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setGameState('PLAYING');
                }}
                className="w-full py-3.5 rounded-xl bg-[#00E5FF] text-black font-bold uppercase tracking-wider hover:bg-[#38bdf8] transition-all cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              >
                RESUME RUN
              </button>
              <button
                onClick={startCountdown}
                className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                RESTART
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setGameState('MENU');
                }}
                className="w-full py-3 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                MAIN MENU
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* GAME OVER MODAL                                                    */}
      {/* ------------------------------------------------------------------ */}
      {gameState === 'GAME_OVER' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-8 rounded-3xl bg-gradient-to-b from-[#181119] to-[#0d0912] border border-rose-500/40 text-center shadow-[0_0_60px_rgba(244,63,94,0.2)]"
          >
            {/* Header */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono tracking-widest uppercase mb-4">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>COLLISION DETECTED</span>
            </div>

            <h4 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none mb-2">
              SIMULATION OVER
            </h4>

            {isNewHighScore && (
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#00E5FF]/20 border border-[#00E5FF] text-xs font-mono text-[#00E5FF] animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEW HIGH SCORE RECORDED!</span>
              </div>
            )}

            {/* Scorecard Matrix */}
            <div className="grid grid-cols-2 gap-3 my-6 font-mono">
              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[10px] text-zinc-500 block uppercase">FINAL SCORE</span>
                <span className="text-2xl font-black text-[#00E5FF]">
                  {metrics.score.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[10px] text-zinc-500 block uppercase">DISTANCE</span>
                <span className="text-2xl font-black text-white">
                  {metrics.distance} m
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[10px] text-zinc-500 block uppercase">ENERGY ORBS</span>
                <span className="text-xl font-bold text-amber-400">
                  {metrics.energyOrbs}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-white/5">
                <span className="text-[10px] text-zinc-500 block uppercase">PERSONAL BEST</span>
                <span className="text-xl font-bold text-purple-400">
                  {metrics.highScore.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 font-mono text-xs">
              <button
                onClick={startCountdown}
                className="w-full py-4 rounded-xl bg-[#00E5FF] hover:bg-[#38bdf8] text-black font-extrabold uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(0,229,255,0.4)] cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>PLAY AGAIN</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setGameState('MENU');
                }}
                className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 transition-colors cursor-pointer"
              >
                RETURN TO MENU
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
