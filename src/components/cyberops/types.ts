export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type GameView = 
  | 'INTRO' 
  | 'MAP' 
  | 'BRIEFING' 
  | 'MISSION' 
  | 'RESULTS' 
  | 'ACHIEVEMENTS' 
  | 'INSTRUCTIONS';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'RECON' | 'CRYPTO' | 'CODE' | 'DEFENSE' | 'MASTERY';
}

export interface MissionMeta {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  story: string;
  objective: string;
  concept: string;
  conceptExplanation: string;
  xpReward: number;
  maxScore: number;
  timeLimitSec?: number;
}

export interface OperatorProfile {
  codename: string;
  xp: number;
  level: number;
  score: number;
  unlockedMissions: number[];
  completedMissions: number[];
  missionScores: Record<number, number>;
  missionAttempts: Record<number, number>;
  achievements: string[];
  soundEnabled: boolean;
  reducedMotion: boolean;
  hintsUsedTotal: number;
  mistakesTotal: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface MissionResultPayload {
  missionId: number;
  scoreEarned: number;
  xpEarned: number;
  timeSpentSec: number;
  hintsUsed: number;
  mistakes: number;
  passed: boolean;
}

export const CAMPAIGN_MISSIONS: MissionMeta[] = [
  {
    id: 1,
    code: 'M-01',
    title: 'Terminal Breach',
    subtitle: 'Simulated Outpost Recon & File Exfiltration',
    difficulty: 'BEGINNER',
    story: 'A covert research relay in Sector 7 detected an anomalous outbound signal. Infiltrate the simulated host terminal, survey directory structures, and extract the encrypted authorization token.',
    objective: 'Explore the virtual filesystem using standard commands (ls, cd, cat, scan, grep), locate the classified credential file, and decrypt the token.',
    concept: 'Command Line Interfaces & Filesystem Hierarchies',
    conceptExplanation: 'CLI terminals represent the fundamental control plane of networked systems. Operators navigate relative and absolute paths, inspect permissions, and filter file descriptors using standard stream utilities.',
    xpReward: 250,
    maxScore: 1000,
  },
  {
    id: 2,
    code: 'M-02',
    title: 'Password Breaker',
    subtitle: 'Cryptographic Vault Decryption',
    difficulty: 'BEGINNER',
    story: 'An encrypted data vault is intercepting tactical network packets. The security enclave is guarded by classical and modern cryptographic ciphers. Decrypt the layered passwords before lockout.',
    objective: 'Solve 3 cryptographic challenges: a Caesar shift cipher, an ASCII hexadecimal byte stream, and an anagram keyword transposition.',
    concept: 'Classical & Symmetric Cryptography',
    conceptExplanation: 'Ciphers transform plaintext into ciphertext through substitution and transposition algorithms. Understanding byte representations (ASCII/Hex) and shift permutations forms the basis of cryptoanalysis.',
    xpReward: 350,
    maxScore: 1200,
  },
  {
    id: 3,
    code: 'M-03',
    title: 'Log Analyst',
    subtitle: 'SIEM Intrusion Telemetry Forensics',
    difficulty: 'INTERMEDIATE',
    story: 'A simulated corporate gateway suffered an unauthorized breach during off-peak hours. Filter through 18 real-time security log entries, separate decoys from anomalous traces, and identify the rogue origin.',
    objective: 'Filter log telemetry by severity and event type, isolate the 3 linked attack records (Port Sweep -> Privilege Escalation -> Exfiltration), and identify the adversary IP.',
    concept: 'Incident Detection & Audit Log Analysis',
    conceptExplanation: 'Security Information and Event Management (SIEM) aggregates multi-system event streams. Analysts construct attack timelines by correlating timestamps, IP addresses, HTTP status codes, and user privileges.',
    xpReward: 450,
    maxScore: 1400,
  },
  {
    id: 4,
    code: 'M-04',
    title: 'Bug Hunter',
    subtitle: 'Software Security Logic Debugging',
    difficulty: 'INTERMEDIATE',
    story: 'The primary firewall authorization daemon has failed to initialize due to software regressions. Inspect broken code snippets, spot the vulnerabilities, and apply the correct patch.',
    objective: 'Debug 3 critical flaws: an off-by-one array boundary error, an authentication assignment vs comparison bug, and an unhandled asynchronous race condition.',
    concept: 'Defensive Programming & Boundary Condition Testing',
    conceptExplanation: 'Software bugs such as off-by-one errors and loose type coercion can create exploitable vulnerabilities. Rigorous unit testing and static code analysis prevent logic exploits before deployment.',
    xpReward: 550,
    maxScore: 1600,
  },
  {
    id: 5,
    code: 'M-05',
    title: 'Algorithm Arena',
    subtitle: 'Computational Complexity & Routing Optimization',
    difficulty: 'INTERMEDIATE',
    story: 'The core mainframe requires optimal algorithmic configurations to bypass heavy throttling filters. Solve high-efficiency computer science challenges to maintain maximum throughput.',
    objective: 'Calculate binary search probes, sort priority network packets, match Big-O time complexity classes, and determine the shortest network traversal path.',
    concept: 'Algorithms, Data Structures & Asymptotic Complexity',
    conceptExplanation: 'Efficient systems minimize CPU cycles and memory. Binary search scales at O(log N) compared to O(N) linear scans, while shortest-path algorithms ensure low-latency packet delivery.',
    xpReward: 650,
    maxScore: 1800,
  },
  {
    id: 6,
    code: 'M-06',
    title: 'Network Defender',
    subtitle: 'Zero-Trust Network Triage & Mitigation',
    difficulty: 'ADVANCED',
    story: 'A distributed cyber offensive is striking the digital infrastructure topology. Monitor real-time node health, identify compromised services, and deploy defensive countermeasures.',
    objective: 'Inspect the live SVG topology map, analyze alerts on API and Database nodes, and deploy WAF filters, rate limiters, and VPC isolation rules before systems overload.',
    concept: 'Defense-in-Depth & Zero-Trust Architecture',
    conceptExplanation: 'Modern cybersecurity relies on segmented defense: Web Application Firewalls (WAF) inspect payload data, token buckets restrict flood volumes, and network segmentation limits lateral movement.',
    xpReward: 800,
    maxScore: 2000,
  },
  {
    id: 7,
    code: 'M-07',
    title: 'SENTINEL AI Boss',
    subtitle: 'The Final Neural Security System',
    difficulty: 'EXPERT',
    story: 'All rogue telemetry leads to SENTINEL, a rogue autonomous defense AI operating in lockdown. Combine your mastery across terminals, ciphers, logs, logic, and network defense to defeat it.',
    objective: 'Breach all 5 security stages: Master Cryptographic Override, Logic Matrix Core Repair, Incident Telemetry Synthesis, Timed Cipher Decryption, and Root Firewall Override.',
    concept: 'Holistic Cybersecurity & Adaptive Threat Mitigation',
    conceptExplanation: 'Advanced operators synthesize multiple disciplines under pressure. Defeating complex autonomous threats requires holistic correlation across software, hardware, networks, and cryptography.',
    xpReward: 1200,
    maxScore: 3000,
  },
];

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_contact',
    title: 'First Contact',
    description: 'Complete Mission 01: Terminal Breach and infiltrate the research network.',
    icon: 'Terminal',
    category: 'RECON',
  },
  {
    id: 'cipher_specialist',
    title: 'Cipher Specialist',
    description: 'Solve the Password Breaker ciphers without using any hints.',
    icon: 'Key',
    category: 'CRYPTO',
  },
  {
    id: 'silent_analyst',
    title: 'Silent Analyst',
    description: 'Isolate all anomalous log events in Mission 03 with zero false selections.',
    icon: 'FileSearch',
    category: 'RECON',
  },
  {
    id: 'bug_hunter',
    title: 'Bug Hunter',
    description: 'Debug and patch all code flaws in Mission 04 with 100% accuracy.',
    icon: 'Code2',
    category: 'CODE',
  },
  {
    id: 'logic_architect',
    title: 'Logic Architect',
    description: 'Complete the Algorithm Arena with optimal complexity reasoning.',
    icon: 'Cpu',
    category: 'CODE',
  },
  {
    id: 'network_sentinel',
    title: 'Network Sentinel',
    description: 'Successfully defend the network against all intrusion vectors in Mission 06.',
    icon: 'ShieldAlert',
    category: 'DEFENSE',
  },
  {
    id: 'elite_operator',
    title: 'Elite Operator',
    description: 'Defeat the SENTINEL AI and master the complete Codebreaker Protocol.',
    icon: 'Crown',
    category: 'MASTERY',
  },
  {
    id: 'perfect_run',
    title: 'Flawless Execution',
    description: 'Achieve a 100% score on any mission with zero mistakes and zero hints.',
    icon: 'Sparkles',
    category: 'MASTERY',
  },
];
