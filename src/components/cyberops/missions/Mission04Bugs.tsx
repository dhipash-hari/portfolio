import React, { useState } from 'react';
import { Code2, Bug, CheckCircle2, AlertTriangle, Lightbulb, Play } from 'lucide-react';
import { cyberAudio } from '../audio/cyberAudio';
import { MissionResultPayload } from '../types';

interface Mission04Props {
  onComplete: (payload: MissionResultPayload) => void;
  onExit: () => void;
}

interface BugChallenge {
  id: number;
  title: string;
  language: 'python' | 'javascript';
  codeSnippet: string;
  bugLineNumber: number;
  vulnerabilityDescription: string;
  testCases: { input: string; expected: string; buggyActual: string }[];
  options: { label: string; code: string; isCorrect: boolean; explanation: string }[];
}

const CHALLENGES: BugChallenge[] = [
  {
    id: 1,
    title: 'Off-by-One Buffer Overflow',
    language: 'python',
    codeSnippet: `def validate_packet_buffer(buffer):
    # Iterate over packet byte buffer
    for i in range(len(buffer) + 1):
        if buffer[i] == 0xFF:
            return True
    return False`,
    bugLineNumber: 3,
    vulnerabilityDescription: 'IndexError: range(len(buffer) + 1) attempts to read an index equal to buffer length, exceeding array bounds and triggering denial of service.',
    testCases: [
      { input: '[0x01, 0x02, 0xFF]', expected: 'True', buggyActual: 'IndexError: list index out of range' },
      { input: '[0x00, 0x10]', expected: 'False', buggyActual: 'IndexError: list index out of range' },
    ],
    options: [
      {
        label: 'A',
        code: 'for i in range(len(buffer)):',
        isCorrect: true,
        explanation: 'Correct! Python range(n) iterates from 0 to n-1, exactly matching zero-indexed array boundaries.',
      },
      {
        label: 'B',
        code: 'for i in range(1, len(buffer) + 1):',
        isCorrect: false,
        explanation: 'Incorrect: This skips index 0 and still exceeds the upper boundary on the last iteration.',
      },
      {
        label: 'C',
        code: 'while len(buffer) > 0:',
        isCorrect: false,
        explanation: 'Incorrect: This creates an infinite loop because buffer length never changes.',
      },
      {
        label: 'D',
        code: 'for i in range(len(buffer) - 1):',
        isCorrect: false,
        explanation: 'Incorrect: This fails to check the final byte of the buffer.',
      },
    ],
  },
  {
    id: 2,
    title: 'Assignment Operator & Auth Bypass',
    language: 'javascript',
    codeSnippet: `function authenticateSession(user, token) {
    // Check administrative privilege & cryptographic token
    if (user.role = 'ADMIN' || isValid(token)) {
        return grantFullAccess(user);
    }
    return denyAccess();
}`,
    bugLineNumber: 3,
    vulnerabilityDescription: 'Logic Flaw: Single equals (=) assigns "ADMIN" to user.role and returns truthy, permanently granting full root access to ANY unauthenticated user.',
    testCases: [
      { input: 'user.role = "GUEST", token = invalid', expected: 'denyAccess()', buggyActual: 'grantFullAccess() [SECURITY BREACH]' },
      { input: 'user.role = "ADMIN", token = valid', expected: 'grantFullAccess()', buggyActual: 'grantFullAccess()' },
    ],
    options: [
      {
        label: 'A',
        code: "if (user.role === 'ADMIN' && isValid(token)) {",
        isCorrect: true,
        explanation: 'Correct! Triple equals (===) performs strict equality checking without assignment, and logical AND (&&) requires both valid role and valid token.',
      },
      {
        label: 'B',
        code: "if (user.role == 'ADMIN' || !isValid(token)) {",
        isCorrect: false,
        explanation: 'Incorrect: Logical OR (||) with negated token would still grant unauthorized access.',
      },
      {
        label: 'C',
        code: "if (user.role != 'ADMIN') {",
        isCorrect: false,
        explanation: 'Incorrect: This inverts the authorization logic completely.',
      },
      {
        label: 'D',
        code: "if (user.role = 'USER') {",
        isCorrect: false,
        explanation: 'Incorrect: This still commits an illegal assignment inside the conditional statement.',
      },
    ],
  },
  {
    id: 3,
    title: 'Unhandled Async Promise Race Condition',
    language: 'javascript',
    codeSnippet: `async function decryptKeyVault(vaultId) {
    // Retrieve cryptographic key from remote HSM enclave
    const sessionKey = fetchRemoteKey(vaultId);
    return cryptoEngine.decrypt(sessionKey);
}`,
    bugLineNumber: 3,
    vulnerabilityDescription: 'Type Error: fetchRemoteKey is asynchronous and returns a Promise, not a byte buffer. Passing a Pending Promise into cryptoEngine crashes the daemon.',
    testCases: [
      { input: 'vaultId = "VAULT-09"', expected: 'Plaintext Buffer (0x4E... )', buggyActual: 'TypeError: Unsupported key format [object Promise]' },
    ],
    options: [
      {
        label: 'A',
        code: 'const sessionKey = await fetchRemoteKey(vaultId);',
        isCorrect: true,
        explanation: 'Correct! The "await" operator pauses execution until the remote Promise resolves with the actual raw cryptographic key buffer.',
      },
      {
        label: 'B',
        code: 'const sessionKey = new fetchRemoteKey(vaultId);',
        isCorrect: false,
        explanation: 'Incorrect: fetchRemoteKey is an async function, not a constructor class.',
      },
      {
        label: 'C',
        code: 'return cryptoEngine.decrypt(vaultId);',
        isCorrect: false,
        explanation: 'Incorrect: decrypt expects an encryption key, not an identifier string.',
      },
      {
        label: 'D',
        code: 'const sessionKey = fetchRemoteKey(vaultId).then();',
        isCorrect: false,
        explanation: 'Incorrect: .then() without a handler still evaluates synchronously to a pending Promise.',
      },
    ],
  },
];

export const Mission04Bugs: React.FC<Mission04Props> = ({ onComplete, onExit }) => {
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [startTime] = useState<number>(Date.now());

  const current = CHALLENGES[challengeIdx];

  const handleApplyPatch = () => {
    if (selectedOption === null) return;
    const choice = current.options[selectedOption];

    if (choice.isCorrect) {
      cyberAudio.playSuccess();
      setFeedback({
        text: `[✓] PATCH APPLIED: ${choice.explanation}`,
        success: true,
      });

      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
        setShowHint(false);

        if (challengeIdx + 1 < CHALLENGES.length) {
          setChallengeIdx((idx) => idx + 1);
        } else {
          const timeSpent = Math.max(15, Math.round((Date.now() - startTime) / 1000));
          const score = Math.max(500, 1600 - hintsUsed * 100 - mistakes * 80 - timeSpent * 2);
          onComplete({
            missionId: 4,
            scoreEarned: score,
            xpEarned: 550,
            timeSpentSec: timeSpent,
            hintsUsed,
            mistakes,
            passed: true,
          });
        }
      }, 1600);
    } else {
      cyberAudio.playError();
      setMistakes((m) => m + 1);
      setFeedback({
        text: `[X] REGRESSION DETECTED: ${choice.explanation}`,
        success: false,
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col min-h-[560px] sm:min-h-[640px] bg-[#070B14] border border-cyan-500/30 rounded-2xl p-5 sm:p-7 font-mono shadow-[0_0_50px_rgba(0,229,255,0.15)] relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF]">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#00E5FF] font-bold">
                MODULE 0{current.id} // 03
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                {current.language}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              {current.title}
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

      {/* Code Viewer Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 mb-4">
        {/* Left: Code Snippet & Vulnerability */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="rounded-xl border border-white/15 bg-black/60 overflow-hidden flex flex-col flex-1">
            <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#00E5FF]" />
                <span>daemon_security_guard.{current.language === 'python' ? 'py' : 'js'}</span>
              </div>
              <span className="text-[10px] text-red-400 font-bold uppercase">BUG AT LINE {current.bugLineNumber}</span>
            </div>

            {/* Syntax lines */}
            <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed space-y-1">
              {current.codeSnippet.split('\n').map((line, idx) => {
                const lineNum = idx + 1;
                const isBugLine = lineNum === current.bugLineNumber;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 px-2 py-0.5 rounded ${
                      isBugLine ? 'bg-red-950/40 border border-red-500/40 text-red-200' : 'text-zinc-300'
                    }`}
                  >
                    <span className="text-zinc-600 select-none w-5 text-right">{lineNum}</span>
                    <pre className="font-mono whitespace-pre">{line}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test cases execution status */}
          <div className="mt-3 p-3 rounded-xl bg-zinc-900/70 border border-white/10 text-xs">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">
              TEST SUITE REGRESSION RESULTS:
            </span>
            <div className="space-y-1.5 text-[11px]">
              {current.testCases.map((tc, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between text-zinc-400 border-b border-white/5 pb-1">
                  <span>Input: <code className="text-cyan-300">{tc.input}</code></span>
                  <span className="text-red-400 font-bold">{tc.buggyActual}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Patch Selection */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-xs text-cyan-400 uppercase tracking-wider block mb-2 font-bold">
              SELECT SECURE PATCH FIX:
            </span>

            <div className="space-y-2.5">
              {current.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedOption(i);
                      cyberAudio.playKeystroke();
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#00E5FF]/15 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                        : 'bg-zinc-900/60 border-white/10 hover:border-white/30 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center text-[10px] font-bold text-[#00E5FF]">
                        {opt.label}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">Patch Option</span>
                    </div>
                    <code className="text-xs text-[#00E5FF] block bg-black/50 p-1.5 rounded overflow-x-auto">
                      {opt.code}
                    </code>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleApplyPatch}
            disabled={selectedOption === null}
            className="w-full mt-4 py-3 rounded-xl bg-[#00E5FF] hover:bg-cyan-400 text-black font-extrabold uppercase text-xs tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.3)]"
          >
            Deploy Security Patch
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-2.5 rounded-lg text-xs font-mono text-center ${
            feedback.success
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/60 border border-red-500/40 text-red-300'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Hint Banner */}
      {showHint && (
        <div className="mt-2 p-3 bg-yellow-950/30 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs">
          <span className="font-bold">DEBUGGING HINT: </span>
          {current.vulnerabilityDescription}
        </div>
      )}
    </div>
  );
};
