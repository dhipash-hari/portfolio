import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Activity, CheckCircle2, AlertTriangle, Lightbulb, Lock, Server } from 'lucide-react';
import { cyberAudio } from '../audio/cyberAudio';
import { MissionResultPayload } from '../types';

interface Mission06Props {
  onComplete: (payload: MissionResultPayload) => void;
  onExit: () => void;
}

interface ThreatIncident {
  id: string;
  name: string;
  targetNode: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  mitigationOptions: { label: string; isCorrect: boolean; explanation: string }[];
}

const THREATS: ThreatIncident[] = [
  {
    id: 'THREAT-1',
    name: 'Distributed Ingress Flood',
    targetNode: 'WAF & Reverse Proxy',
    severity: 'HIGH',
    description: 'Adversary botnet is sending 50,000 req/sec to saturate edge connections.',
    mitigationOptions: [
      {
        label: 'Activate Token-Bucket Rate Limiter & Geo-Challenge',
        isCorrect: true,
        explanation: 'Throttles burst volumes and forces headless botnets to fail cryptographic challenges.',
      },
      {
        label: 'Reboot Reverse Proxy Server',
        isCorrect: false,
        explanation: 'Rebooting causes total service downtime without stopping incoming flood traffic.',
      },
      {
        label: 'Disable TLS Encryption',
        isCorrect: false,
        explanation: 'Disabling TLS exposes plaintext credentials to eavesdroppers.',
      },
    ],
  },
  {
    id: 'THREAT-2',
    name: 'SQL Injection Payload Attack',
    targetNode: 'API Gateway',
    severity: 'CRITICAL',
    description: 'Malicious inputs containing UNION SELECT strings detected targeting customer record tables.',
    mitigationOptions: [
      {
        label: 'Deploy WAF Parametric Query Inspection & Prepared Statements',
        isCorrect: true,
        explanation: 'Enforces strict parameter sanitization and blocks SQL syntax injection at the edge.',
      },
      {
        label: 'Increase Database Memory by 4GB',
        isCorrect: false,
        explanation: 'Adding RAM does not prevent arbitrary SQL syntax execution.',
      },
      {
        label: 'Grant Read-Only Permissions to Public',
        isCorrect: false,
        explanation: 'Violates confidentiality and exposes sensitive table data.',
      },
    ],
  },
  {
    id: 'THREAT-3',
    name: 'Lateral Subnet Infiltration',
    targetNode: 'Database Cluster',
    severity: 'CRITICAL',
    description: 'Compromised web container is attempting direct SSH connection to backend database port 5432.',
    mitigationOptions: [
      {
        label: 'Enforce Zero-Trust VPC Microsegmentation & Mutual TLS',
        isCorrect: true,
        explanation: 'Restricts ingress traffic exclusively to verified mTLS API pods on private subnet.',
      },
      {
        label: 'Change Database Root Password',
        isCorrect: false,
        explanation: 'A password change alone does not isolate network access routes.',
      },
      {
        label: 'Enable Public Internet Access on Database Port',
        isCorrect: false,
        explanation: 'Exposes the database cluster to global malicious port scans.',
      },
    ],
  },
];

export const Mission06Defender: React.FC<Mission06Props> = ({ onComplete, onExit }) => {
  const [activeThreatIdx, setActiveThreatIdx] = useState<number>(0);
  const [mitigatedThreats, setMitigatedThreats] = useState<Set<string>>(new Set());
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [startTime] = useState<number>(Date.now());

  const currentThreat = THREATS[activeThreatIdx];
  const networkHealth = Math.round(40 + (mitigatedThreats.size / THREATS.length) * 60);

  const handleMitigate = (option: { label: string; isCorrect: boolean; explanation: string }) => {
    if (option.isCorrect) {
      cyberAudio.playSuccess();
      const updated = new Set(mitigatedThreats);
      updated.add(currentThreat.id);
      setMitigatedThreats(updated);

      setFeedback({
        text: `[✓] MITIGATION ACTIVE: ${option.explanation}`,
        success: true,
      });

      setTimeout(() => {
        setFeedback(null);
        setShowHint(false);

        if (updated.size === THREATS.length) {
          // All threats mitigated!
          const timeSpent = Math.max(15, Math.round((Date.now() - startTime) / 1000));
          const score = Math.max(600, 2000 - hintsUsed * 100 - mistakes * 80 - timeSpent * 2);
          onComplete({
            missionId: 6,
            scoreEarned: score,
            xpEarned: 800,
            timeSpentSec: timeSpent,
            hintsUsed,
            mistakes,
            passed: true,
          });
        } else {
          setActiveThreatIdx((idx) => Math.min(THREATS.length - 1, idx + 1));
        }
      }, 1600);
    } else {
      cyberAudio.playError();
      setMistakes((m) => m + 1);
      setFeedback({
        text: `[X] COUNTERMEASURE FAILED: ${option.explanation}`,
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
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#00E5FF] font-bold">MISSION 06</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                NETWORK DEFENSE PROTOCOL
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Zero-Trust Topology Defense
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 uppercase block">GRID INTEGRITY</span>
            <span className={`text-sm font-black ${networkHealth === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {networkHealth}% NOMINAL
            </span>
          </div>
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

      {/* Interactive Topology Graph Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 mb-4">
        {/* Left: Topology Canvas / Diagram */}
        <div className="md:col-span-6 bg-black/60 rounded-xl border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="text-[10px] uppercase font-bold text-cyan-400">NETWORK NODE TOPOLOGY</span>
            <span className="text-[10px] text-zinc-500">
              Mitigated: {mitigatedThreats.size} / {THREATS.length}
            </span>
          </div>

          {/* SVG Topology Nodes */}
          <div className="flex-1 flex items-center justify-center py-4">
            <div className="grid grid-cols-3 gap-3 w-full max-w-sm text-center">
              {[
                { name: 'Firewall', status: 'SAFE', color: 'emerald' },
                {
                  name: 'WAF Proxy',
                  status: mitigatedThreats.has('THREAT-1') ? 'SAFE' : 'ATTACK',
                  color: mitigatedThreats.has('THREAT-1') ? 'emerald' : 'amber',
                },
                {
                  name: 'API Gateway',
                  status: mitigatedThreats.has('THREAT-2') ? 'SAFE' : 'BREACH',
                  color: mitigatedThreats.has('THREAT-2') ? 'emerald' : 'red',
                },
                { name: 'Auth Pod', status: 'SAFE', color: 'emerald' },
                {
                  name: 'Database',
                  status: mitigatedThreats.has('THREAT-3') ? 'SAFE' : 'THREAT',
                  color: mitigatedThreats.has('THREAT-3') ? 'emerald' : 'red',
                },
                { name: 'Cold Vault', status: 'SAFE', color: 'emerald' },
              ].map((node, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border transition-all ${
                    node.color === 'emerald'
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : node.color === 'amber'
                      ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 animate-pulse'
                      : 'bg-red-950/50 border-red-500/80 text-red-300 animate-pulse'
                  }`}
                >
                  <Server className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] font-bold block">{node.name}</span>
                  <span className="text-[9px] font-mono opacity-80">{node.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-zinc-500 flex items-center justify-between border-t border-white/5 pt-2">
            <span>PACKET INSPECTION: DEEP DPI</span>
            <span>VPC SUBNET: 10.88.0.0/16</span>
          </div>
        </div>

        {/* Right: Active Threat & Mitigation Controls */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Threat Tabs */}
            <div className="flex gap-2">
              {THREATS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveThreatIdx(idx);
                    cyberAudio.playKeystroke();
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono transition-all ${
                    activeThreatIdx === idx
                      ? 'bg-[#00E5FF] text-black font-bold'
                      : mitigatedThreats.has(t.id)
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-900 text-zinc-400 border border-white/10'
                  }`}
                >
                  Vector 0{idx + 1}
                </button>
              ))}
            </div>

            {/* Active Threat Card */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/15">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  {currentThreat.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/30">
                  {currentThreat.severity}
                </span>
              </div>
              <p className="text-xs text-zinc-300 mb-2 leading-relaxed">
                {currentThreat.description}
              </p>
              <span className="text-[10px] text-[#00E5FF]">
                TARGET NODE: {currentThreat.targetNode}
              </span>
            </div>

            {/* Mitigation Selection Options */}
            <div className="space-y-2">
              <span className="text-xs text-zinc-400 uppercase tracking-wider block font-bold">
                SELECT DEFENSIVE MITIGATION:
              </span>
              {currentThreat.mitigationOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleMitigate(opt)}
                  className="w-full text-left p-3 rounded-xl bg-black/60 hover:bg-[#00E5FF]/10 border border-white/10 hover:border-[#00E5FF]/40 text-xs text-zinc-300 transition-all cursor-pointer"
                >
                  <span className="text-[#00E5FF] font-bold block mb-0.5">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
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

      {/* Hint */}
      {showHint && (
        <div className="mt-2 p-3 bg-yellow-950/30 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs">
          <span className="font-bold">DEFENSE HINT: </span>
          Choose architectural mitigations that address the root vulnerability:
          Rate limit volume floods, parameterize inputs against SQL injection, and enforce VPC microsegmentation against lateral movement.
        </div>
      )}
    </div>
  );
};
