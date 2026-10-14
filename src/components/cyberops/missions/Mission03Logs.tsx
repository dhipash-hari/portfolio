import React, { useState, useMemo } from 'react';
import { FileSearch, Search, Filter, AlertCircle, CheckCircle2, Lightbulb, ShieldAlert, ArrowUpDown } from 'lucide-react';
import { cyberAudio } from '../audio/cyberAudio';
import { MissionResultPayload } from '../types';

interface Mission03Props {
  onComplete: (payload: MissionResultPayload) => void;
  onExit: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  sourceIp: string;
  eventType: 'AUTH' | 'NETWORK' | 'FILE_ACCESS' | 'SYSTEM';
  status: '200 OK' | '401 DENIED' | '403 FORBIDDEN' | '500 ERROR';
  description: string;
  isAnomalous: boolean;
}

const LOG_DATABASE: LogEntry[] = [
  {
    id: 'LOG-101',
    timestamp: '03:10:02',
    sourceIp: '10.0.0.5',
    eventType: 'SYSTEM',
    status: '200 OK',
    description: 'Automated database health snapshot executed successfully.',
    isAnomalous: false,
  },
  {
    id: 'LOG-102',
    timestamp: '03:11:15',
    sourceIp: '10.0.0.12',
    eventType: 'AUTH',
    status: '200 OK',
    description: 'DevOps engineer (admin_sam) SSO session renewed via Okta.',
    isAnomalous: false,
  },
  {
    id: 'LOG-103',
    timestamp: '03:12:40',
    sourceIp: '172.16.4.8',
    eventType: 'NETWORK',
    status: '200 OK',
    description: 'Ingress CDN cache purge requested for /static/assets.',
    isAnomalous: false,
  },
  {
    id: 'LOG-104',
    timestamp: '03:14:12',
    sourceIp: '198.51.100.77',
    eventType: 'AUTH',
    status: '401 DENIED',
    description: 'RAPID BURST: 84 consecutive failed SSH root login attempts within 4.2 seconds.',
    isAnomalous: true, // ANOMALY 1: Brute Force
  },
  {
    id: 'LOG-105',
    timestamp: '03:14:20',
    sourceIp: '10.0.0.2',
    eventType: 'SYSTEM',
    status: '200 OK',
    description: 'NTP synchronization drift check within nominal bounds (0.4ms).',
    isAnomalous: false,
  },
  {
    id: 'LOG-106',
    timestamp: '03:14:38',
    sourceIp: '198.51.100.77',
    eventType: 'SYSTEM',
    status: '200 OK',
    description: 'CRITICAL ALERT: Privilege escalation exploit detected via CVE-2024 buffer overflow; root bash spawned.',
    isAnomalous: true, // ANOMALY 2: Privilege Escalation
  },
  {
    id: 'LOG-107',
    timestamp: '03:14:45',
    sourceIp: '172.16.4.15',
    eventType: 'NETWORK',
    status: '403 FORBIDDEN',
    description: 'Routine web crawler blocked by robots.txt policy.',
    isAnomalous: false,
  },
  {
    id: 'LOG-108',
    timestamp: '03:15:02',
    sourceIp: '198.51.100.77',
    eventType: 'FILE_ACCESS',
    status: '200 OK',
    description: 'UNAUTHORIZED EGRESS: Bulk exfiltration of /var/db/master_keys.pem (4.2 GB transferred over port 4444).',
    isAnomalous: true, // ANOMALY 3: Data Exfiltration
  },
  {
    id: 'LOG-109',
    timestamp: '03:15:22',
    sourceIp: '10.0.0.99',
    eventType: 'AUTH',
    status: '401 DENIED',
    description: 'Single typo on admin portal login from employee workstation.',
    isAnomalous: false,
  },
  {
    id: 'LOG-110',
    timestamp: '03:16:00',
    sourceIp: '10.0.0.1',
    eventType: 'NETWORK',
    status: '200 OK',
    description: 'Internal DNS resolution query for api.internal.cluster.',
    isAnomalous: false,
  },
  {
    id: 'LOG-111',
    timestamp: '03:16:30',
    sourceIp: '10.0.0.14',
    eventType: 'SYSTEM',
    status: '500 ERROR',
    description: 'Transient memory warning on elasticsearch pod; auto-healed.',
    isAnomalous: false,
  },
  {
    id: 'LOG-112',
    timestamp: '03:17:10',
    sourceIp: '10.0.0.5',
    eventType: 'FILE_ACCESS',
    status: '200 OK',
    description: 'Daily rotating audit log compression archive generated.',
    isAnomalous: false,
  },
];

const ROGUE_IP = '198.51.100.77';

export const Mission03Logs: React.FC<Mission03Props> = ({ onComplete, onExit }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const [selectedIp, setSelectedIp] = useState<string>('');
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; success: boolean } | null>(null);
  const [startTime] = useState<number>(Date.now());

  const filteredLogs = useMemo(() => {
    return LOG_DATABASE.filter((log) => {
      const matchesSearch =
        searchQuery === '' ||
        log.sourceIp.includes(searchQuery) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'ALL' || log.eventType === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || log.status.startsWith(statusFilter);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, typeFilter, statusFilter]);

  const toggleSelectLog = (id: string) => {
    cyberAudio.playKeystroke();
    setSelectedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 3) {
          // Keep max 3 selections
          return next;
        }
        next.add(id);
      }
      return next;
    });
  };

  const handleReportSubmit = () => {
    if (selectedLogs.size !== 3) {
      cyberAudio.playError();
      setFeedback({
        message: 'You must select exactly 3 anomalous evidence entries matching the attack chain.',
        success: false,
      });
      return;
    }

    if (!selectedIp) {
      cyberAudio.playError();
      setFeedback({
        message: 'Please identify the rogue adversary IP in the dropdown.',
        success: false,
      });
      return;
    }

    const correctIds = ['LOG-104', 'LOG-106', 'LOG-108'];
    const hasAllThree = correctIds.every((id) => selectedLogs.has(id));
    const isIpCorrect = selectedIp === ROGUE_IP;

    if (hasAllThree && isIpCorrect) {
      cyberAudio.playSuccess();
      setFeedback({
        message: 'FORENSIC AUDIT CONFIRMED! Threat chain isolated: Brute Force -> Privilege Escalation -> Bulk Exfiltration originating from 198.51.100.77.',
        success: true,
      });

      const timeSpent = Math.max(15, Math.round((Date.now() - startTime) / 1000));
      const score = Math.max(500, 1400 - hintsUsed * 100 - mistakes * 80 - timeSpent * 2);

      setTimeout(() => {
        onComplete({
          missionId: 3,
          scoreEarned: score,
          xpEarned: 450,
          timeSpentSec: timeSpent,
          hintsUsed,
          mistakes,
          passed: true,
        });
      }, 2000);
    } else {
      cyberAudio.playError();
      setMistakes((m) => m + 1);

      let hintMsg = 'Evidence rejection: ';
      if (!isIpCorrect) {
        hintMsg += 'Incorrect adversary IP. ';
      }
      if (!hasAllThree) {
        hintMsg += 'Your selected events do not capture the complete intrusion progression.';
      }

      setFeedback({
        message: hintMsg,
        success: false,
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-[560px] sm:h-[640px] bg-[#070B14] border border-cyan-500/30 rounded-2xl p-5 sm:p-7 font-mono shadow-[0_0_50px_rgba(0,229,255,0.15)] relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF]">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#00E5FF] font-bold">MISSION 03</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                SIEM LOG FORENSICS
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Anomalous Intrusion Analysis
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

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search IP, ID, or description..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/60 border border-white/15 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-[10px] uppercase">EVENT:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 py-2 px-2.5 rounded-lg bg-black/60 border border-white/15 text-zinc-300 focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="ALL">All Event Types</option>
            <option value="AUTH">Authentication</option>
            <option value="NETWORK">Network</option>
            <option value="FILE_ACCESS">File Access</option>
            <option value="SYSTEM">System</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-[10px] uppercase">STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 py-2 px-2.5 rounded-lg bg-black/60 border border-white/15 text-zinc-300 focus:outline-none focus:border-[#00E5FF]"
          >
            <option value="ALL">All Statuses</option>
            <option value="200">200 OK</option>
            <option value="401">401 DENIED</option>
            <option value="403">403 FORBIDDEN</option>
            <option value="500">500 ERROR</option>
          </select>
        </div>
      </div>

      {/* Log Table Container */}
      <div className="flex-1 border border-white/10 rounded-xl overflow-hidden bg-black/40 flex flex-col mb-3">
        {/* Table Head */}
        <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-zinc-900/80 border-b border-white/10 text-[11px] text-zinc-400 font-bold uppercase">
          <div className="col-span-1 text-center">TAG</div>
          <div className="col-span-1">TIME</div>
          <div className="col-span-2">SOURCE IP</div>
          <div className="col-span-2">EVENT TYPE</div>
          <div className="col-span-2">STATUS</div>
          <div className="col-span-4">DESCRIPTION</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5 text-xs">
          {filteredLogs.map((log) => {
            const isSelected = selectedLogs.has(log.id);
            return (
              <div
                key={log.id}
                onClick={() => toggleSelectLog(log.id)}
                className={`grid grid-cols-12 gap-2 px-3 py-2 items-center cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#00E5FF]/15 border-l-2 border-[#00E5FF]'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="col-span-1 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // handled by row click
                    className="cursor-pointer accent-[#00E5FF]"
                  />
                </div>
                <div className="col-span-1 text-zinc-400 font-mono text-[11px]">
                  {log.timestamp}
                </div>
                <div className="col-span-2 text-cyan-300 font-mono text-[11px] truncate">
                  {log.sourceIp}
                </div>
                <div className="col-span-2 text-zinc-400 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/5">
                    {log.eventType}
                  </span>
                </div>
                <div className="col-span-2">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      log.status.startsWith('200')
                        ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                        : log.status.startsWith('401')
                        ? 'text-amber-400 bg-amber-950/40 border border-amber-500/30'
                        : 'text-red-400 bg-red-950/40 border border-red-500/30'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
                <div className="col-span-4 text-zinc-300 truncate text-[11px]">
                  {log.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Forensic Attribution Deck */}
      <div className="p-3 bg-zinc-950/90 border border-white/10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-zinc-400 text-[11px] uppercase">
            EVIDENCE TAGGED: <span className="text-[#00E5FF] font-bold">{selectedLogs.size} / 3</span>
          </span>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-[11px] uppercase">ROGUE IP:</span>
            <select
              value={selectedIp}
              onChange={(e) => setSelectedIp(e.target.value)}
              className="py-1 px-2 rounded bg-black border border-white/20 text-[#00E5FF] font-mono text-xs focus:outline-none"
            >
              <option value="">Select Adversary IP...</option>
              <option value="10.0.0.5">10.0.0.5 (Internal)</option>
              <option value="10.0.0.12">10.0.0.12 (Internal)</option>
              <option value="172.16.4.8">172.16.4.8 (CDN)</option>
              <option value="198.51.100.77">198.51.100.77 (External)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleReportSubmit}
          className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#00E5FF] hover:bg-cyan-400 text-black font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Submit Forensic Audit
        </button>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`mt-2 p-2.5 rounded-lg text-xs font-mono text-center ${
            feedback.success
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/60 border border-red-500/40 text-red-300'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Hint Modal */}
      {showHint && (
        <div className="mt-2 p-3 bg-yellow-950/30 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs">
          <span className="font-bold">SIEM FORENSIC HINT: </span>
          Look for a 3-step attack lifecycle originating from the external IP:
          1. Rapid brute force failure (401)
          2. Successful privilege escalation exploit (200)
          3. Mass file transfer / exfiltration (200)
        </div>
      )}
    </div>
  );
};
