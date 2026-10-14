import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Play, HelpCircle, Volume2, VolumeX, ArrowLeft, Sparkles } from 'lucide-react';
import { cyberAudio } from '../audio/cyberAudio';

interface GameIntroProps {
  onEnter: () => void;
  onHowToPlay: () => void;
  onReturnToPortfolio: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const BOOT_LINES = [
  'CYBER OPS // SECURITY DIVISION',
  'INITIALIZING SECURE INTERFACE...',
  'ESTABLISHING ENCRYPTED CONNECTION...',
  'LOADING MISSION DATABASE...',
  'OPERATOR STATUS: READY',
  '',
  'WELCOME, OPERATOR.',
  'YOUR FIRST MISSION IS WAITING.',
];

export const GameIntro: React.FC<GameIntroProps> = ({
  onEnter,
  onHowToPlay,
  onReturnToPortfolio,
  soundEnabled,
  onToggleSound,
}) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);

  useEffect(() => {
    let currentLineIdx = 0;
    const interval = setInterval(() => {
      if (currentLineIdx < BOOT_LINES.length) {
        const nextLine = BOOT_LINES[currentLineIdx];
        setDisplayedLines((prev) => [...prev, nextLine]);
        cyberAudio.playKeystroke();
        currentLineIdx++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 240);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    setDisplayedLines(BOOT_LINES);
    setIsTypingComplete(true);
    cyberAudio.playCommandSubmit();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between min-h-[520px] sm:min-h-[600px] p-6 sm:p-10 bg-[#06080E] border border-cyan-500/30 rounded-3xl font-mono text-zinc-200 relative overflow-hidden shadow-[0_0_60px_rgba(0,229,255,0.12)]">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar with Return & Sound */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 z-10">
        <button
          onClick={onReturnToPortfolio}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#00E5FF] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO PORTFOLIO</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-500 hidden sm:inline">v2.4.0 // CLASSIFIED</span>
          <button
            onClick={onToggleSound}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>SOUND ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                <span>MUTED</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Center Boot Terminal */}
      <div className="w-full max-w-xl my-auto py-6 z-10 flex flex-col items-center text-center">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-[#00E5FF]/30 text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <Shield className="w-3.5 h-3.5" />
          <span>CYBER OPS // THE CODEBREAKER PROTOCOL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-2 drop-shadow-[0_0_25px_rgba(0,229,255,0.4)]">
          CYBER OPS
        </h1>
        <p className="text-xs sm:text-sm text-cyan-300/80 tracking-widest uppercase mb-6">
          Every system has a weakness. Can you break the code?
        </p>

        {/* Typing Box */}
        <div className="w-full bg-black/70 border border-white/10 rounded-2xl p-5 text-left mb-6 font-mono text-xs sm:text-sm min-h-[160px] flex flex-col justify-between shadow-inner">
          <div className="space-y-1.5 text-cyan-400">
            {displayedLines.map((line, i) => (
              <div key={i} className="leading-relaxed">
                {line.startsWith('CYBER') || line.startsWith('WELCOME') ? (
                  <strong className="text-white font-bold">{line}</strong>
                ) : (
                  <span>{line}</span>
                )}
              </div>
            ))}
            {!isTypingComplete && (
              <span className="inline-block w-2 h-4 bg-[#00E5FF] animate-pulse ml-1" />
            )}
          </div>

          {!isTypingComplete && (
            <div className="text-right pt-2 border-t border-white/5">
              <button
                onClick={handleSkip}
                className="text-[10px] text-zinc-500 hover:text-white uppercase transition-colors"
              >
                [ Skip Intro ]
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <button
            onClick={() => {
              cyberAudio.playCommandSubmit();
              onEnter();
            }}
            className="w-full flex-1 py-3.5 px-6 rounded-xl bg-[#00E5FF] hover:bg-cyan-400 text-black font-extrabold uppercase text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all cursor-pointer group"
          >
            <Play className="w-4 h-4 fill-black group-hover:scale-110 transition-transform" />
            <span>Enter the System</span>
          </button>

          <button
            onClick={() => {
              cyberAudio.playKeystroke();
              onHowToPlay();
            }}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            <span>How to Play</span>
          </button>
        </div>
      </div>

      {/* Footer System Specs */}
      <div className="w-full pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 z-10 gap-2">
        <span>SECURITY LEVEL: CLASSIFIED // SECTOR 7</span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
          7 Technical Campaign Missions & AI Boss
        </span>
      </div>
    </div>
  );
};
