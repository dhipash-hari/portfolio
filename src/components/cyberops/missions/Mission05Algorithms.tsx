import React, { useState } from 'react';
import { Cpu, GitBranch, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, Zap } from 'lucide-react';
import { cyberAudio } from '../audio/cyberAudio';
import { MissionResultPayload } from '../types';

interface Mission05Props {
  onComplete: (payload: MissionResultPayload) => void;
  onExit: () => void;
}

export const Mission05Algorithms: React.FC<Mission05Props> = ({ onComplete, onExit }) => {
  const [subStage, setSubStage] = useState<number>(1);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [startTime] = useState<number>(Date.now());

  // Challenge 1 state: Binary Search
  const [q1Choice, setQ1Choice] = useState<number | null>(null);

  // Challenge 2 state: Packet Sorting
  const [packetOrder, setPacketOrder] = useState<number[]>([40, 10, 30, 20]);

  // Challenge 3 state: Shortest Path
  const [routeChoice, setRouteChoice] = useState<string | null>(null);

  const handleStage1Submit = () => {
    if (q1Choice === null) return;
    if (q1Choice === 10) {
      cyberAudio.playSuccess();
      setFeedback({
        text: 'CORRECT! log2(1024) = 10. Binary search divides search space by half at each step.',
        success: true,
      });
      setTimeout(() => {
        setFeedback(null);
        setShowHint(false);
        setSubStage(2);
      }, 1500);
    } else {
      cyberAudio.playError();
      setMistakes((m) => m + 1);
      setFeedback({
        text: 'INCORRECT: In a balanced binary search, worst-case probes equal ceil(log2(N)).',
        success: false,
      });
    }
  };

  const handleSwapPackets = (idx1: number, idx2: number) => {
    cyberAudio.playKeystroke();
    const copy = [...packetOrder];
    const temp = copy[idx1];
    copy[idx1] = copy[idx2];
    copy[idx2] = temp;
    setPacketOrder(copy);
  };

  const handleStage2Submit = () => {
    const isSorted = packetOrder.every((val, idx) => idx === 0 || val >= packetOrder[idx - 1]);
    if (isSorted) {
      cyberAudio.playSuccess();
      setFeedback({
        text: 'CORRECT! Packets sorted in ascending priority order [10 -> 20 -> 30 -> 40].',
        success: true,
      });
      setTimeout(() => {
        setFeedback(null);
        setShowHint(false);
        setSubStage(3);
      }, 1500);
    } else {
      cyberAudio.playError();
      setMistakes((m) => m + 1);
      setFeedback({
        text: 'Packets are still misordered. Arrange in strictly ascending priority.',
        success: false,
      });
    }
  };

  const handleStage3Submit = () => {
    if (!routeChoice) return;
    if (routeChoice === 'ACD') {
      cyberAudio.playSuccess();
      setFeedback({
        text: 'OPTIMAL ROUTE CONFIRMED! Path A -> C -> D achieves lowest total latency (8ms + 9ms = 17ms).',
        success: true,
      });

      const timeSpent = Math.max(15, Math.round((Date.now() - startTime) / 1000));
      const score = Math.max(500, 1800 - hintsUsed * 100 - mistakes * 80 - timeSpent * 2);

      setTimeout(() => {
        onComplete({
          missionId: 5,
          scoreEarned: score,
          xpEarned: 650,
          timeSpentSec: timeSpent,
          hintsUsed,
          mistakes,
          passed: true,
        });
      }, 1800);
    } else {
      cyberAudio.playError();
      setMistakes((m) => m + 1);
      setFeedback({
        text: 'Sub-optimal path chosen. Calculate total edge weights across all routes.',
        success: false,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col min-h-[540px] sm:min-h-[620px] bg-[#070B14] border border-cyan-500/30 rounded-2xl p-5 sm:p-7 font-mono shadow-[0_0_50px_rgba(0,229,255,0.15)] relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#00E5FF] font-bold">ALGORITHM ARENA</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                CHALLENGE 0{subStage} // 03
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              {subStage === 1 && 'Binary Search Asymptotic Probes'}
              {subStage === 2 && 'Priority Queue Packet Ordering'}
              {subStage === 3 && 'Shortest Path Graph Traversal'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!showHint) {
                setHintsUsed((h) => h + 1);
                cyberAudio.playAchievement();
              }
              setShowHint(!showHint);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-950/60 border border-[#00E5FF]/30 text-xs text-[#00E5FF] hover:bg-cyan-900/40"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Hint (-50 pts)
          </button>
          <button
            onClick={onExit}
            className="text-xs text-zinc-500 hover:text-white px-2.5 py-1 rounded bg-zinc-900 border border-white/10"
          >
            Abort
          </button>
        </div>
      </div>

      {/* Main Challenge Content */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
        {/* SubStage 1: Binary Search */}
        {subStage === 1 && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/10">
              <span className="text-[#00E5FF] font-bold block mb-1">SCENARIO:</span>
              A sorted cryptographic telemetry index contains exactly <strong className="text-white">1,024</strong> entries.
              In the absolute worst case, what is the maximum number of comparisons required by a standard <strong className="text-cyan-400">Binary Search</strong> to determine whether an encryption key is present?
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[10, 32, 512, 1024].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setQ1Choice(num);
                    cyberAudio.playKeystroke();
                  }}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    q1Choice === num
                      ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF] font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                      : 'bg-zinc-900/70 border-white/10 hover:border-white/30 text-zinc-300'
                  }`}
                >
                  <span className="text-2xl font-black block mb-1">{num}</span>
                  <span className="text-[10px] text-zinc-400">comparisons</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleStage1Submit}
              disabled={q1Choice === null}
              className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-cyan-400 text-black font-extrabold uppercase text-xs tracking-wider transition-colors disabled:opacity-40"
            >
              Verify Asymptotic Complexity
            </button>
          </div>
        )}

        {/* SubStage 2: Packet Sorting */}
        {subStage === 2 && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/10">
              <span className="text-[#00E5FF] font-bold block mb-1">SCENARIO:</span>
              Four out-of-order network frames have arrived in the ingress buffer. Click any two adjacent packets to swap them until they are sorted in strictly ascending priority order (Lowest priority first: 10 &rarr; 20 &rarr; 30 &rarr; 40).
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 py-4">
              {packetOrder.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-20 h-24 rounded-xl bg-zinc-900 border border-cyan-500/40 flex flex-col items-center justify-between p-2 shadow-lg">
                    <span className="text-[9px] text-zinc-500">PKG #{idx + 1}</span>
                    <span className="text-2xl font-black text-[#00E5FF]">{val}</span>
                    <span className="text-[9px] text-zinc-400">PRIORITY</span>
                  </div>
                  {idx < packetOrder.length - 1 && (
                    <button
                      onClick={() => handleSwapPackets(idx, idx + 1)}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs border border-white/10"
                      title="Swap with adjacent packet"
                    >
                      &harr;
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleStage2Submit}
              className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-cyan-400 text-black font-extrabold uppercase text-xs tracking-wider transition-colors"
            >
              Confirm Packet Sequence
            </button>
          </div>
        )}

        {/* SubStage 3: Shortest Path */}
        {subStage === 3 && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/10">
              <span className="text-[#00E5FF] font-bold block mb-1">SCENARIO:</span>
              Route network traffic from Gateway Node A to Mainframe D with minimal latency:
            </p>

            <div className="space-y-2.5">
              {[
                { id: 'ABD', label: 'Route 1: Node A -> Node B (5ms) -> Node D (15ms)', total: '20ms total' },
                { id: 'ACD', label: 'Route 2: Node A -> Node C (8ms) -> Node D (9ms)', total: '17ms total' },
                { id: 'AED', label: 'Route 3: Node A -> Node E (12ms) -> Node D (10ms)', total: '22ms total' },
              ].map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    setRouteChoice(r.id);
                    cyberAudio.playKeystroke();
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    routeChoice === r.id
                      ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                      : 'bg-zinc-900/60 border-white/10 text-zinc-300 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-mono">{r.label}</span>
                  <span className="text-xs font-bold text-cyan-400">{r.total}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleStage3Submit}
              disabled={!routeChoice}
              className="w-full py-3 rounded-xl bg-[#00E5FF] hover:bg-cyan-400 text-black font-extrabold uppercase text-xs tracking-wider transition-colors disabled:opacity-40"
            >
              Execute Routing Table Update
            </button>
          </div>
        )}

        {/* Feedback message */}
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

        {/* Hint message */}
        {showHint && (
          <div className="mt-3 p-3 bg-yellow-950/30 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs">
            <span className="font-bold">HINT: </span>
            {subStage === 1 && 'Binary search halves the search space each step: 1024 -> 512 -> 256 -> 128 -> 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1. That is 10 steps.'}
            {subStage === 2 && 'Sort the priorities from lowest number (10) to highest number (40).'}
            {subStage === 3 && 'Sum the two hops: 5+15=20ms, 8+9=17ms, 12+10=22ms. 17ms is the lowest.'}
          </div>
        )}
      </div>
    </div>
  );
};
