import React, { useState, useEffect } from 'react';
import { Crown, AlertOctagon, Zap, Shield, CheckCircle2, AlertTriangle, Lightbulb, Flame, Award } from 'lucide-react';
import { cyberAudio } from '../audio/cyberAudio';
import { MissionResultPayload } from '../types';

interface Mission07Props {
  onComplete: (payload: MissionResultPayload) => void;
  onExit: () => void;
}

export const Mission07Boss: React.FC<Mission07Props> = ({ onComplete, onExit }) => {
  const [bossHealth, setBossHealth] = useState<number>(100);
  const [stage, setStage] = useState<number>(1);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [startTime] = useState<number>(Date.now());
  const [bossDefeated, setBossDefeated] = useState<boolean>(false);

  // Stage 1 Input: Key Override
  const [stage1Input, setStage1Input] = useState<string>('');

  // Stage 2: Logic gate selection
  const [gate1, setGate1] = useState<'AND' | 'OR' | 'XOR'>('AND');
  const [gate2, setGate2] = useState<'AND' | 'OR' | 'XOR'>('XOR');

  // Stage 3: Memory Kernel Anomaly
  const [selectedMemoryNode, setSelectedMemoryNode] = useState<string | null>(null);

  // Stage 4: Timed Cipher Decryption
  const [timedKey, setTimedKey] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(45);

  useEffect(() => {
    cyberAudio.playBossAlarm();
  }, []);

  // Timer countdown for Stage 4
  useEffect(() => {
    if (stage !== 4 || bossDefeated) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setMistakes((m) => m + 1);
          setFeedback({
            text: 'Timer expired! Neural buffer resetting to +15 seconds.',
            success: false,
          });
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stage, bossDefeated]);

  // Stage 1 Submit
  const handleStage1 = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = stage1Input.trim().toUpperCase();
    if (clean === 'SENTINEL-OVERRIDE' || clean === 'OVERRIDE') {
      cyberAudio.playSuccess();
      setBossHealth(80);
      setFeedback({ text: '[✓] STAGE 1 BYPASSED: Master access sequence recognized.', success: true });
      setTimeout(() => {
        setFeedback(null);
        setStage(2);
      }, 1400);
    } else {
      cyberAudio.playError();
      setMistakes((m) => m + 1);
      setFeedback({ text: '[X] Sequence mismatch. Clue: Enter "OVERRIDE" or "SENTINEL-OVERRIDE".', success: false });
    }
  };

  // Stage 2 Submit
  const handleStage2 = () => {
    // Condition: (TRUE [gate1] TRUE) [gate2] FALSE => TRUE
    // If gate1 === 'AND' (TRUE) and gate2 === 'XOR' (TRUE XOR FALSE = TRUE)
    const subVal = gate1 === 'AND' ? true : gate1 === 'OR' ? true : false;
    const finalVal = gate2 === 'XOR' ? subVal !== false : gate2 === 'OR' ? subVal || false : subVal && false;

    if (finalVal === true) {
      cyberAudio.playSuccess();
      setBossHealth(60);
      setFeedback({ text: '[✓] STAGE 2 BYPASSED: Neural logic gates aligned to high state (1).', success: true });
      setTimeout(() => {
        setFeedback(null);
        setStage(3);
      }, 1400);
    } else {
      cyberAudio.playError();
      setMistakes((m) => m + 1);
      setFeedback({ text: '[X] Gate configuration outputs LOW (0). Adjust operators.', success: false });
    }
  };

  // Stage 3 Submit
  const handleStage3 = () => {
    if (selectedMemoryNode === 'MEM-ROOTKIT') {
      cyberAudio.playSuccess();
      setBossHealth(40);
      setFeedback({ text: '[✓] STAGE 3 BYPASSED: Injected rootkit thread terminated in memory.', success: true });
      setTimeout(() => {
        setFeedback(null);
        setStage(4);
      }, 1400);
    } else {
      cyberAudio.playError();
      setMistakes((m) => m + 1);
      setFeedback({ text: '[X] Selected process is a legitimate kernel subsystem.', success: false });
    }
  };

  // Stage 4 Submit
  const handleStage4 = (e: React.FormEvent) => {
    e.preventDefault();
    if (timedKey.trim().toUpperCase() === '7F9B') {
      cyberAudio.playSuccess();
      setBossHealth(20);
      setFeedback({ text: '[✓] STAGE 4 BYPASSED: Timed cryptographic checksum verified!', success: true });
      setTimeout(() => {
        setFeedback(null);
        setStage(5);
      }, 1400);
    } else {
      cyberAudio.playError();
      setMistakes((m) => m + 1);
      setFeedback({ text: '[X] Checksum verification failed. Hex target is: 7F9B', success: false });
    }
  };

  // Stage 5 Final Victory Trigger
  const handleStage5 = () => {
    cyberAudio.playBossDefeat();
    setBossHealth(0);
    setBossDefeated(true);

    const timeSpent = Math.max(30, Math.round((Date.now() - startTime) / 1000));
    const score = Math.max(1000, 3000 - hintsUsed * 100 - mistakes * 80 - timeSpent * 2);

    setTimeout(() => {
      onComplete({
        missionId: 7,
        scoreEarned: score,
        xpEarned: 1200,
        timeSpentSec: timeSpent,
        hintsUsed,
        mistakes,
        passed: true,
      });
    }, 4000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col min-h-[580px] sm:min-h-[660px] bg-[#070B14] border border-red-500/40 rounded-2xl p-5 sm:p-8 font-mono shadow-[0_0_60px_rgba(239,68,68,0.2)] relative overflow-hidden">
      {/* Background Warning Pulses */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Boss Health Bar Deck */}
      <div className="pb-5 border-b border-red-500/20 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-400">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase block">
                AUTONOMOUS SECURITY SENTINEL // FINAL BOSS
              </span>
              <h3 className="text-xl font-black text-white tracking-wide">
                NEURAL CORE INTERFACE
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-zinc-500 uppercase block">CORE SHIELD</span>
            <span className="text-lg font-black text-red-400">{bossHealth}%</span>
          </div>
        </div>

        {/* Health Progress Line */}
        <div className="w-full h-3 rounded-full bg-black/60 border border-red-500/30 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-[#00E5FF] transition-all duration-700 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            style={{ width: `${bossHealth}%` }}
          />
        </div>
      </div>

      {/* Victory Screen */}
      {bossDefeated ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in duration-700">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black shadow-[0_0_50px_rgba(0,229,255,0.6)] mb-2">
            <Crown className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            SENTINEL STATUS: DEFEATED
          </h2>
          <div className="space-y-1 text-xs sm:text-sm text-cyan-300 font-mono">
            <p>SECURITY LAYERS BYPASSED: 100%</p>
            <p>OPERATOR STATUS: ELITE</p>
            <p>CAMPAIGN STATUS: COMPLETE</p>
          </div>
          <p className="text-sm sm:text-base font-bold text-white tracking-widest uppercase py-3 border-y border-cyan-500/40">
            YOU HAVE MASTERED THE CODEBREAKER PROTOCOL.
          </p>
          <span className="text-xs text-zinc-400">
            Generating final accreditation telemetry...
          </span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
          {/* Stage Progress Pills */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${
                  stage === s
                    ? 'bg-red-500 text-black border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    : stage > s
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                    : 'bg-zinc-900 border-white/10 text-zinc-600'
                }`}
              >
                0{s}
              </div>
            ))}
          </div>

          {/* STAGE 1: Cryptographic Sequence */}
          {stage === 1 && (
            <div className="space-y-4 text-center">
              <span className="text-xs text-red-400 font-bold uppercase tracking-wider block">
                STAGE 01 // OVERRIDE KEY
              </span>
              <p className="text-xs text-zinc-300 bg-black/40 p-4 rounded-xl border border-white/10 text-left">
                SENTINEL requires a master override command to initiate security diagnostic mode.
                Submit the protocol keyword: <strong className="text-[#00E5FF]">SENTINEL-OVERRIDE</strong>
              </p>
              <form onSubmit={handleStage1} className="flex gap-2">
                <input
                  type="text"
                  value={stage1Input}
                  onChange={(e) => setStage1Input(e.target.value)}
                  placeholder="ENTER OVERRIDE SEQUENCE..."
                  className="flex-1 px-4 py-3 rounded-xl bg-black/70 border border-red-500/40 text-white font-mono uppercase tracking-widest text-center focus:outline-none focus:border-red-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-black font-extrabold uppercase text-xs tracking-wider cursor-pointer transition-colors"
                >
                  Override
                </button>
              </form>
            </div>
          )}

          {/* STAGE 2: Neural Logic Gate Repair */}
          {stage === 2 && (
            <div className="space-y-4 text-center">
              <span className="text-xs text-red-400 font-bold uppercase tracking-wider block">
                STAGE 02 // NEURAL LOGIC GATES
              </span>
              <p className="text-xs text-zinc-300 bg-black/40 p-4 rounded-xl border border-white/10 text-left">
                Configure the logic operators below so the complete circuit evaluates to <strong className="text-emerald-400">TRUE (1)</strong>:
              </p>

              <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-mono">
                <span className="text-zinc-400">( TRUE</span>
                <select
                  value={gate1}
                  onChange={(e) => setGate1(e.target.value as 'AND' | 'OR' | 'XOR')}
                  className="px-2 py-1 rounded bg-zinc-800 border border-white/20 text-[#00E5FF] font-bold"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                  <option value="XOR">XOR</option>
                </select>
                <span className="text-zinc-400">TRUE )</span>
                <select
                  value={gate2}
                  onChange={(e) => setGate2(e.target.value as 'AND' | 'OR' | 'XOR')}
                  className="px-2 py-1 rounded bg-zinc-800 border border-white/20 text-[#00E5FF] font-bold"
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                  <option value="XOR">XOR</option>
                </select>
                <span className="text-zinc-400">FALSE</span>
              </div>

              <button
                onClick={handleStage2}
                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-400 text-black font-extrabold uppercase text-xs tracking-wider cursor-pointer transition-colors"
              >
                Pulse Neural Gates
              </button>
            </div>
          )}

          {/* STAGE 3: Memory Anomaly Isolation */}
          {stage === 3 && (
            <div className="space-y-4">
              <span className="text-xs text-red-400 font-bold uppercase tracking-wider block text-center">
                STAGE 03 // ISOLATE KERNEL ROOTKIT
              </span>
              <p className="text-xs text-zinc-300 bg-black/40 p-3.5 rounded-xl border border-white/10">
                Inspect SENTINEL's live process stack. Identify and isolate the rogue kernel rootkit:
              </p>

              <div className="space-y-2">
                {[
                  { id: 'MEM-SYS', name: 'vmlinuz-core-daemon', desc: 'Legitimate Linux ring-0 kernel task' },
                  { id: 'MEM-ROOTKIT', name: 'shadow_injected_rootkit_0x99.ko', desc: 'UNVERIFIED unsigned hook hijacking system calls' },
                  { id: 'MEM-NET', name: 'network-watchdog-worker', desc: 'Standard systemd networking interface' },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedMemoryNode(item.id);
                      cyberAudio.playKeystroke();
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedMemoryNode === item.id
                        ? 'bg-red-500/20 border-red-500 text-red-200'
                        : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{item.name}</span>
                      <span className="text-[10px] text-zinc-400">{item.desc}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-black text-zinc-500">
                      {selectedMemoryNode === item.id ? 'SELECTED' : 'INSPECT'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStage3}
                disabled={!selectedMemoryNode}
                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-400 text-black font-extrabold uppercase text-xs tracking-wider transition-colors disabled:opacity-40 cursor-pointer"
              >
                Purge Kernel Threat
              </button>
            </div>
          )}

          {/* STAGE 4: Timed Cipher Decryption */}
          {stage === 4 && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-between text-xs">
                <span className="text-red-400 font-bold uppercase">STAGE 04 // TIMED VERIFICATION</span>
                <span className="text-amber-400 font-bold font-mono">
                  LOCKOUT IN: {timerSeconds}s
                </span>
              </div>
              <p className="text-xs text-zinc-300 bg-black/40 p-4 rounded-xl border border-white/10 text-left">
                Rapid-fire protocol: Compute and enter the hex integrity checksum discovered in Mission 01 telemetry:
                <strong className="text-[#00E5FF] block mt-1">7F9B</strong>
              </p>
              <form onSubmit={handleStage4} className="flex gap-2">
                <input
                  type="text"
                  value={timedKey}
                  onChange={(e) => setTimedKey(e.target.value.toUpperCase())}
                  placeholder="ENTER HEX CHECKSUM (7F9B)..."
                  maxLength={6}
                  className="flex-1 px-4 py-3 rounded-xl bg-black/70 border border-amber-500/40 text-white font-mono uppercase tracking-widest text-center focus:outline-none focus:border-amber-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase text-xs tracking-wider cursor-pointer"
                >
                  Verify
                </button>
              </form>
            </div>
          )}

          {/* STAGE 5: Final Root Firewall Verification */}
          {stage === 5 && (
            <div className="space-y-5 text-center">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block">
                STAGE 05 // FINAL ROOT OVERRIDE
              </span>
              <p className="text-xs text-zinc-300 bg-black/40 p-4 rounded-xl border border-white/10">
                All external layers neutralized. Sentinel core defense exposed. Click below to execute root authorization payload.
              </p>
              <button
                onClick={handleStage5}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00E5FF] via-blue-500 to-purple-600 hover:brightness-110 text-black font-black uppercase text-sm tracking-widest shadow-[0_0_40px_rgba(0,229,255,0.5)] cursor-pointer transition-all animate-pulse"
              >
                EXECUTE FINAL SYSTEM BREACH
              </button>
            </div>
          )}

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`mt-4 p-2.5 rounded-lg text-xs font-mono text-center ${
                feedback.success
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/60 border border-red-500/40 text-red-300'
              }`}
            >
              {feedback.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
