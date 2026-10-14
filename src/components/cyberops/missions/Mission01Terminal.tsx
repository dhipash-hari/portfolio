import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, HelpCircle, CheckCircle2, AlertTriangle, Lightbulb, CornerDownLeft } from 'lucide-react';
import { cyberAudio } from '../audio/cyberAudio';
import { MissionResultPayload } from '../types';

interface Mission01Props {
  onComplete: (payload: MissionResultPayload) => void;
  onExit: () => void;
}

interface CommandHistoryItem {
  id: string;
  command?: string;
  output: string | React.ReactNode;
  type: 'cmd' | 'output' | 'error' | 'success' | 'system';
}

const VIRTUAL_FS: Record<string, { type: 'dir' | 'file'; content?: string; children?: string[] }> = {
  '/': {
    type: 'dir',
    children: ['archives', 'logs', 'security', 'mission.txt', 'README.md'],
  },
  '/mission.txt': {
    type: 'file',
    content: `==========================================================
OPERATION CODEBREAKER // MISSION 01
OBJECTIVE: Locate the classified authorization token hidden
inside the relay filesystem and submit it via 'decrypt <TOKEN>'.
WARNING: Sector 7 relay is unstable. Proceed with stealth.
==========================================================`,
  },
  '/README.md': {
    type: 'file',
    content: `# SECTOR 7 RELAY TERMINAL
Use standard commands to survey directory structures:
- ls: List directory contents
- cd <dir>: Change directory
- cat <file>: Display file content
- scan: Perform active frequency sweep
- decrypt <TOKEN>: Authenticate with authorization token`,
  },
  '/archives': {
    type: 'dir',
    children: ['signal_spec.dat', 'classified_token.dat', 'telemetry_dump.log'],
  },
  '/archives/signal_spec.dat': {
    type: 'file',
    content: `SIGNAL FREQ: 14.882 GHz // POLARIZATION: ELLIPTICAL
CARRIER ENCODING: QAM-256
ROUTING NODE: RELAY-7.SUBNET-4
STATUS: UNENCRYPTED TELEMETRY STREAM`,
  },
  '/archives/classified_token.dat': {
    type: 'file',
    content: `[CLASSIFIED ACCESS KEY]
AUTH_TOKEN: CYBER-OPS-9941
EXPIRATION: PERPETUAL
ENCRYPTION: SHADOW-GRID LEVEL 4
Execute 'decrypt CYBER-OPS-9941' to bypass Sector 7 perimeter lock.`,
  },
  '/archives/telemetry_dump.log': {
    type: 'file',
    content: `[03:12:01] INCOMING PACKET STREAM OK
[03:12:44] HANDSHAKE VERIFIED // LATENCY: 12ms
[03:13:20] INTEGRITY CHECKSUM: MATCHED (0x7F9B2)`,
  },
  '/logs': {
    type: 'dir',
    children: ['system.log', 'audit.log'],
  },
  '/logs/system.log': {
    type: 'file',
    content: `[00:01:00] KERNEL INITIALIZATION: COMPLETE
[00:01:02] NETWORK INTERFACE eth0: PROMISCUOUS MODE
[00:01:05] DAEMON WATCHDOG: ACTIVE`,
  },
  '/logs/audit.log': {
    type: 'file',
    content: `[01:14:22] ADMIN LOGIN FROM 10.0.0.1 - SUCCESS
[02:45:10] CRON JOB TRIGGERED: BACKUP RUN COMPLETED`,
  },
  '/security': {
    type: 'dir',
    children: ['auth.conf', 'firewall_rules.json'],
  },
  '/security/auth.conf': {
    type: 'file',
    content: `AUTH_MODE=TOKEN_ONLY
ENCRYPTION_LAYER=ENABLED
DEFAULT_CHALLENGE=CYBER-OPS-XXXX
HINT: Inspect archives for the full token code.`,
  },
  '/security/firewall_rules.json': {
    type: 'file',
    content: `{
  "policy": "STRICT",
  "inbound": ["ALLOW 443/TCP", "ALLOW 22/TCP"],
  "outbound": ["ALLOW ALL"]
}`,
  },
};

const SECRET_TOKEN = 'CYBER-OPS-9941';

export const Mission01Terminal: React.FC<Mission01Props> = ({ onComplete, onExit }) => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      id: 'init-1',
      output: 'CYBER OPS // SECURE VIRTUAL TERMINAL v4.19',
      type: 'system',
    },
    {
      id: 'init-2',
      output: 'Type "help" for a list of available commands or "scan" to detect signal anomalies.',
      type: 'system',
    },
  ]);
  const [commandList, setCommandList] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [startTime] = useState<number>(Date.now());
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resolvePath = (target: string): string => {
    if (target === '/') return '/';
    if (target.startsWith('/')) return target;
    if (target === '..') {
      if (currentPath === '/') return '/';
      const parts = currentPath.split('/').filter(Boolean);
      parts.pop();
      return parts.length === 0 ? '/' : '/' + parts.join('/');
    }
    return currentPath === '/' ? `/${target}` : `${currentPath}/${target}`;
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    cyberAudio.playCommandSubmit();
    setCommandList((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newItems: CommandHistoryItem[] = [
      {
        id: `cmd-${Date.now()}`,
        command: trimmed,
        output: '',
        type: 'cmd',
      },
    ];

    switch (cmd) {
      case 'help': {
        newItems.push({
          id: `out-${Date.now()}`,
          output: `AVAILABLE COMMANDS:
  ls [path]       - List directory contents
  cd <path>       - Change directory
  cat <file>      - Display file contents
  pwd             - Print working directory
  scan            - Run RF / signal anomaly detector
  decrypt <token> - Submit classified authorization key
  clear           - Clear terminal screen
  status          - View mission objectives
  help            - Display this manual`,
          type: 'output',
        });
        break;
      }

      case 'pwd': {
        newItems.push({
          id: `out-${Date.now()}`,
          output: currentPath,
          type: 'output',
        });
        break;
      }

      case 'clear': {
        setHistory([]);
        setInputVal('');
        return;
      }

      case 'status': {
        newItems.push({
          id: `out-${Date.now()}`,
          output: `MISSION OBJECTIVE STATUS:
[1] Infiltrate Sector 7 directory structure: COMPLETED
[2] Locate classified token file in /archives: ${currentPath.includes('archives') ? 'IN PROGRESS' : 'PENDING'}
[3] Authenticate via 'decrypt <TOKEN>': PENDING`,
          type: 'output',
        });
        break;
      }

      case 'scan': {
        cyberAudio.playDecryption();
        newItems.push({
          id: `out-${Date.now()}`,
          output: `[+] RUNNING PASSIVE SPECTRUM SCAN...
[!] RF Anomalies detected in /archives directory!
[!] File identified: classified_token.dat (Size: 184 bytes)
[+] Recommended action: cd /archives && cat classified_token.dat`,
          type: 'success',
        });
        break;
      }

      case 'ls': {
        const targetPath = args[0] ? resolvePath(args[0]) : currentPath;
        const node = VIRTUAL_FS[targetPath];
        if (!node) {
          newItems.push({
            id: `err-${Date.now()}`,
            output: `ls: cannot access '${args[0]}': No such file or directory`,
            type: 'error',
          });
          setMistakes((m) => m + 1);
        } else if (node.type !== 'dir') {
          newItems.push({
            id: `out-${Date.now()}`,
            output: args[0],
            type: 'output',
          });
        } else {
          const list = (node.children || []).map((name) => {
            const childPath = targetPath === '/' ? `/${name}` : `${targetPath}/${name}`;
            const isDir = VIRTUAL_FS[childPath]?.type === 'dir';
            return isDir ? `${name}/` : name;
          });
          newItems.push({
            id: `out-${Date.now()}`,
            output: list.join('   '),
            type: 'output',
          });
        }
        break;
      }

      case 'cd': {
        if (!args[0] || args[0] === '~') {
          setCurrentPath('/');
          break;
        }
        const targetPath = resolvePath(args[0]);
        const node = VIRTUAL_FS[targetPath];
        if (!node) {
          newItems.push({
            id: `err-${Date.now()}`,
            output: `cd: no such file or directory: ${args[0]}`,
            type: 'error',
          });
          setMistakes((m) => m + 1);
        } else if (node.type !== 'dir') {
          newItems.push({
            id: `err-${Date.now()}`,
            output: `cd: not a directory: ${args[0]}`,
            type: 'error',
          });
          setMistakes((m) => m + 1);
        } else {
          setCurrentPath(targetPath);
        }
        break;
      }

      case 'cat': {
        if (!args[0]) {
          newItems.push({
            id: `err-${Date.now()}`,
            output: 'cat: missing file operand',
            type: 'error',
          });
          setMistakes((m) => m + 1);
          break;
        }
        const targetPath = resolvePath(args[0]);
        const node = VIRTUAL_FS[targetPath];
        if (!node) {
          newItems.push({
            id: `err-${Date.now()}`,
            output: `cat: ${args[0]}: No such file or directory`,
            type: 'error',
          });
          setMistakes((m) => m + 1);
        } else if (node.type === 'dir') {
          newItems.push({
            id: `err-${Date.now()}`,
            output: `cat: ${args[0]}: Is a directory`,
            type: 'error',
          });
          setMistakes((m) => m + 1);
        } else {
          newItems.push({
            id: `out-${Date.now()}`,
            output: node.content || '',
            type: 'output',
          });
        }
        break;
      }

      case 'decrypt': {
        const submittedToken = (args[0] || '').trim().toUpperCase();
        if (submittedToken === SECRET_TOKEN) {
          cyberAudio.playSuccess();
          newItems.push({
            id: `win-${Date.now()}`,
            output: `[✓] AUTHENTICATION VERIFIED: ${SECRET_TOKEN}
[✓] ENCRYPTED TUNNEL ESTABLISHED!
[✓] SECTOR 7 PERIMETER BYPASSED 100%!
ACCESS GRANTED: Mission 01 Complete. Transmitting credentials...`,
            type: 'success',
          });
          setCompleted(true);
          const timeSpent = Math.max(5, Math.round((Date.now() - startTime) / 1000));
          const score = Math.max(300, 1000 - hintsUsed * 100 - mistakes * 40 - timeSpent * 2);

          setTimeout(() => {
            onComplete({
              missionId: 1,
              scoreEarned: score,
              xpEarned: 250,
              timeSpentSec: timeSpent,
              hintsUsed,
              mistakes,
              passed: true,
            });
          }, 1800);
        } else {
          cyberAudio.playError();
          newItems.push({
            id: `err-${Date.now()}`,
            output: `[X] ACCESS DENIED: Invalid token "${args[0] || ''}". Inspect /archives/classified_token.dat.`,
            type: 'error',
          });
          setMistakes((m) => m + 1);
        }
        break;
      }

      default: {
        cyberAudio.playError();
        newItems.push({
          id: `err-${Date.now()}`,
          output: `cyberops: command not found: ${cmd}. Type "help" for a list of valid commands.`,
          type: 'error',
        });
        setMistakes((m) => m + 1);
      }
    }

    setHistory((prev) => [...prev, ...newItems]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandList.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandList.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandList[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandList.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandList.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(commandList[nextIdx]);
      }
    } else {
      cyberAudio.playKeystroke();
    }
  };

  const requestHint = () => {
    setHintsUsed((h) => h + 1);
    setShowHintModal(true);
    cyberAudio.playAchievement();
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-[540px] sm:h-[620px] bg-[#05080E] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.15)] font-mono">
      {/* Terminal Titlebar */}
      <div className="px-4 py-2.5 bg-[#090E17] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs text-zinc-400 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-[#00E5FF]" />
            operator@cyberops-relay7:{currentPath}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={requestHint}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/60 border border-[#00E5FF]/30 text-[11px] text-[#00E5FF] hover:bg-cyan-900/40 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Hint (-50 pts)
          </button>
          <button
            onClick={onExit}
            className="text-xs text-zinc-500 hover:text-white transition-colors"
          >
            Abort
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-2 text-xs md:text-sm text-zinc-300 selection:bg-[#00E5FF]/30 selection:text-white"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item) => (
          <div key={item.id} className="leading-relaxed whitespace-pre-wrap">
            {item.type === 'cmd' ? (
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <span className="text-zinc-500">operator@cyberops:{currentPath}$</span>
                <span>{item.command}</span>
              </div>
            ) : item.type === 'error' ? (
              <div className="text-red-400 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{item.output}</span>
              </div>
            ) : item.type === 'success' ? (
              <div className="text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded">
                {item.output}
              </div>
            ) : item.type === 'system' ? (
              <div className="text-zinc-500 italic border-l-2 border-[#00E5FF]/40 pl-2">
                {item.output}
              </div>
            ) : (
              <div className="text-zinc-300">{item.output}</div>
            )}
          </div>
        ))}

        {/* Input prompt line */}
        {!completed && (
          <div className="flex items-center gap-2 text-cyan-400 pt-1">
            <span className="text-zinc-500 shrink-0">operator@cyberops:{currentPath}$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-[#00E5FF] focus:outline-none caret-[#00E5FF]"
              placeholder="type a command (e.g. ls, scan, help)..."
              autoFocus
              spellCheck={false}
            />
            <CornerDownLeft className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Quick Command Toolbar for Mobile/Accessibility */}
      <div className="p-2 bg-[#090E17]/80 border-t border-white/10 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest mr-1">Quick Cmds:</span>
        {['ls', 'scan', 'cd archives', 'cat classified_token.dat', 'status', 'help'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-[#00E5FF] border border-white/5 transition-colors text-[11px]"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Hint Dialog Modal */}
      {showHintModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-[#0D121F] border border-cyan-500/40 rounded-xl p-5 shadow-2xl text-zinc-200">
            <div className="flex items-center gap-2 text-[#00E5FF] font-bold mb-3">
              <Lightbulb className="w-5 h-5" />
              <span>TACTICAL HINT // MISSION 01</span>
            </div>
            <p className="text-xs text-zinc-300 mb-3 leading-relaxed">
              1. Type <code className="bg-zinc-800 px-1 py-0.5 rounded text-[#00E5FF]">scan</code> to locate signal anomalies.
              <br />
              2. Navigate to the archives directory: <code className="bg-zinc-800 px-1 py-0.5 rounded text-[#00E5FF]">cd archives</code>.
              <br />
              3. View the classified key: <code className="bg-zinc-800 px-1 py-0.5 rounded text-[#00E5FF]">cat classified_token.dat</code>.
              <br />
              4. Authenticate by typing: <code className="bg-zinc-800 px-1 py-0.5 rounded text-emerald-400">decrypt CYBER-OPS-9941</code>.
            </p>
            <button
              onClick={() => setShowHintModal(false)}
              className="w-full py-2 bg-[#00E5FF] text-black font-bold text-xs uppercase rounded hover:bg-cyan-400 transition-colors"
            >
              Resume Terminal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
