import React, { useState } from 'react';
import { KeyRound, ShieldAlert, Sparkles, Lightbulb, CheckCircle2, RefreshCw, Lock } from 'lucide-react';
import { cyberAudio } from '../audio/cyberAudio';
import { MissionResultPayload } from '../types';

interface Mission02Props {
  onComplete: (payload: MissionResultPayload) => void;
  onExit: () => void;
}

interface CipherStage {
  id: number;
  type: string;
  cipherText: string;
  clue: string;
  hint: string;
  solution: string;
  explanation: string;
}

const STAGES: CipherStage[] = [
  {
    id: 1,
    type: 'CAESAR SHIFT (ROT-3)',
    cipherText: 'FRGH',
    clue: 'Each letter has been shifted forward by 3 positions in the Latin alphabet (e.g., D -> A, E -> B, F -> C). Shift backward by 3.',
    hint: 'F - 3 = C, R - 3 = O, G - 3 = D, H - 3 = E.',
    solution: 'CODE',
    explanation: 'Caesar Cipher is a monoalphabetic substitution cipher dating to ancient Rome. With key K=3, every letter P is decrypted as D(C) = (C - 3) mod 26.',
  },
  {
    id: 2,
    type: 'ASCII HEXADECIMAL DECODER',
    cipherText: '0x53  0x59  0x4E  0x43',
    clue: 'Hex byte stream: 0x53 = 83 in decimal, which maps to ASCII character "S". 0x59 = "Y", 0x4E = "N", 0x43 = "C". Decode the word.',
    hint: 'Map each hexadecimal byte to its standard ASCII character: 53=S, 59=Y, 4E=N, 43=C.',
    solution: 'SYNC',
    explanation: 'Computers represent all textual symbols as numerical byte codes. In ASCII, printable English capital letters occupy the hexadecimal range 0x41 (A) to 0x5A (Z).',
  },
  {
    id: 3,
    type: 'CRYPTOGRAPHIC ANAGRAM TRANSPOSITION',
    cipherText: 'H - P - R - E - I - C',
    clue: 'A fundamental algorithm used to encrypt and decrypt sensitive intelligence. Unscramble the 6 letters.',
    hint: 'Begins with C, ends with R. A synonym for secret code or encryption algorithm.',
    solution: 'CIPHER',
    explanation: 'Transposition ciphers preserve the identity of the characters while shuffling their positions according to a permutation matrix or key sequence.',
  },
];

export const Mission02Password: React.FC<Mission02Props> = ({ onComplete, onExit }) => {
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');
  const [attemptsLeft, setAttemptsLeft] = useState<number>(4);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [startTime] = useState<number>(Date.now());

  const currentStage = STAGES[stageIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputVal.trim().toUpperCase();
    if (!clean) return;

    if (clean === currentStage.solution) {
      cyberAudio.playSuccess();
      setIsDecrypting(true);
      setFeedback({
        text: `[✓] DECRYPTION SUCCESSFUL! ${currentStage.solution} accepted.`,
        success: true,
      });

      setTimeout(() => {
        setIsDecrypting(false);
        setInputVal('');
        setFeedback(null);
        setShowHint(false);

        if (stageIndex + 1 < STAGES.length) {
          setStageIndex((s) => s + 1);
          setAttemptsLeft(4);
        } else {
          // Completed all 3 stages!
          const timeSpent = Math.max(10, Math.round((Date.now() - startTime) / 1000));
          const score = Math.max(400, 1200 - hintsUsed * 120 - mistakes * 50 - timeSpent * 2);
          onComplete({
            missionId: 2,
            scoreEarned: score,
            xpEarned: 350,
            timeSpentSec: timeSpent,
            hintsUsed,
            mistakes,
            passed: true,
          });
        }
      }, 1500);
    } else {
      cyberAudio.playError();
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      setMistakes((m) => m + 1);

      if (newAttempts <= 0) {
        setFeedback({
          text: `[!] ATTEMPTS EXHAUSTED. Key was: "${currentStage.solution}". Auto-bypassing node with penalty.`,
          success: false,
        });
        setTimeout(() => {
          setInputVal('');
          setFeedback(null);
          setShowHint(false);
          if (stageIndex + 1 < STAGES.length) {
            setStageIndex((s) => s + 1);
            setAttemptsLeft(4);
          } else {
            const timeSpent = Math.max(15, Math.round((Date.now() - startTime) / 1000));
            onComplete({
              missionId: 2,
              scoreEarned: 450,
              xpEarned: 200,
              timeSpentSec: timeSpent,
              hintsUsed,
              mistakes: mistakes + 1,
              passed: true,
            });
          }
        }, 2200);
      } else {
        setFeedback({
          text: `[X] ACCESS DENIED: "${clean}" is incorrect. ${newAttempts} attempt(s) remaining.`,
          success: false,
        });
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col min-h-[540px] sm:min-h-[600px] bg-[#070B14] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 font-mono shadow-[0_0_50px_rgba(0,229,255,0.15)] relative">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#00E5FF] font-bold">STAGE 0{currentStage.id} // 03</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                {currentStage.type}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Vault Key Decryption
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 uppercase block">ATTEMPTS</span>
            <div className="flex items-center gap-1 justify-end">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i < attemptsLeft ? 'bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]' : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onExit}
            className="text-xs text-zinc-500 hover:text-white px-2 py-1 rounded bg-zinc-900 border border-white/10"
          >
            Abort
          </button>
        </div>
      </div>

      {/* Main Cipher Stage Card */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-2xl mx-auto w-full text-center">
        <span className="text-[11px] font-mono text-cyan-400 tracking-widest uppercase mb-2">
          INTERCEPTED CIPHERTEXT
        </span>

        {/* Encrypted payload display */}
        <div className="w-full py-6 px-8 rounded-2xl bg-zinc-900/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.1)] mb-6 relative overflow-hidden">
          {isDecrypting && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent animate-pulse pointer-events-none" />
          )}
          <span className="text-3xl sm:text-5xl font-black tracking-widest text-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,229,255,0.6)]">
            {currentStage.cipherText}
          </span>
        </div>

        {/* Clue box */}
        <p className="text-xs sm:text-sm text-zinc-300 mb-6 bg-zinc-900/60 border border-white/10 p-3.5 rounded-xl leading-relaxed text-left w-full">
          <span className="text-[#00E5FF] font-bold block mb-1">CLUE // TELEMETRY ANALYSIS:</span>
          {currentStage.clue}
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value.toUpperCase());
              cyberAudio.playKeystroke();
            }}
            placeholder="ENTER DECRYPTED PLAINTEXT..."
            maxLength={16}
            disabled={isDecrypting}
            className="flex-1 px-4 py-3.5 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-center tracking-widest text-lg focus:border-[#00E5FF] focus:outline-none uppercase placeholder:text-zinc-600 shadow-inner"
            autoFocus
          />
          <button
            type="submit"
            disabled={isDecrypting || !inputVal.trim()}
            className="px-6 py-3.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-400 text-black font-extrabold text-sm uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer"
          >
            Authenticate
          </button>
        </form>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`w-full p-3 rounded-xl border text-xs text-center font-mono mb-4 transition-all ${
              feedback.success
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/50 border-red-500/40 text-red-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Hint Trigger & Display */}
        <div className="w-full flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              if (!showHint) {
                setHintsUsed((h) => h + 1);
                cyberAudio.playAchievement();
              }
              setShowHint(!showHint);
            }}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-[#00E5FF] transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span>{showHint ? 'Hide Hint' : 'Request Decryption Hint (-50 pts)'}</span>
          </button>
          <span className="text-[11px] text-zinc-500">
            {3 - stageIndex} layer(s) remaining
          </span>
        </div>

        {showHint && (
          <div className="w-full mt-3 p-3 rounded-lg bg-yellow-950/20 border border-yellow-500/30 text-yellow-300 text-xs text-left">
            <span className="font-bold">DECRYPTION HINT: </span>
            {currentStage.hint}
          </div>
        )}
      </div>

      {/* Footer Concept Notes */}
      <div className="pt-4 border-t border-white/10 text-[11px] text-zinc-500 flex items-center justify-between">
        <span>SECURITY ENCLAVE: ACTIVE // AES-GCM HARDENED</span>
        <span>STANDALONE CRYPTOENGINE</span>
      </div>
    </div>
  );
};
