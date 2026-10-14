import React, { useState } from 'react';
import { Project } from '../../types/portfolio';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Activity, 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  Smartphone, 
  Monitor, 
  Users, 
  Trophy, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Radio
} from 'lucide-react';

interface ProjectPreviewMockupProps {
  project: Project;
  num: string;
}

export const ProjectPreviewMockup: React.FC<ProjectPreviewMockupProps> = ({ project, num }) => {
  // If an uploaded image URL exists, render the image with depth glass layers
  if (project.image_url) {
    return (
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#070a0f] border border-white/10 group-hover:border-[#00E5FF]/40 transition-all duration-500 shadow-2xl flex items-center justify-center">
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent opacity-60" />
      </div>
    );
  }

  // 1. RED LENZ: Live Computer Vision Privacy Engine Simulator
  if (project.slug === 'red-lenz' || project.title.toLowerCase().includes('red lenz')) {
    return <RedLenzMockup num={num} />;
  }

  // 2. MARK ANALYSIS: Academic Comparative Performance Analytics Cockpit
  if (project.slug === 'mark-analysis' || project.title.toLowerCase().includes('mark analysis')) {
    return <MarkAnalysisMockup num={num} />;
  }

  // 3. SRI THIRUMALAI KALAIKOODAM: Official Cultural Web Platform
  if (project.slug === 'sri-thirumalai-kalaikoodam' || project.title.toLowerCase().includes('kalaikoodam')) {
    return <KalaikoodamMockup num={num} />;
  }

  // 4. QUIZ MASTER: Real-Time Multiplayer Quiz Engine (Flutter & Firebase)
  if (project.slug === 'quiz-master' || project.title.toLowerCase().includes('quiz master')) {
    return <QuizMasterMockup num={num} />;
  }

  // Generic fallback for any other dynamic projects
  return <GenericProjectMockup project={project} num={num} />;
};

/* -------------------------------------------------------------------------- */
/* PROJECT 1: RED LENZ SIMULATOR                                              */
/* -------------------------------------------------------------------------- */
const RedLenzMockup: React.FC<{ num: string }> = ({ num }) => {
  const [blurActive, setBlurActive] = useState(true);

  return (
    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#05070a] border border-white/10 group-hover:border-[#00E5FF]/50 transition-all duration-500 shadow-2xl flex flex-col justify-between p-4 sm:p-5 select-none bg-scanlines">
      {/* Top Telemetry Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-white/10 pb-2.5 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[#00E5FF] font-semibold tracking-wider">LIVE STREAM PIPELINE</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">1080p @ 60 FPS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">INFERENCE:</span>
          <span className="text-emerald-400 font-bold">24.2 ms</span>
        </div>
      </div>

      {/* Main Vision Viewport Area */}
      <div className="relative my-auto flex items-center justify-center py-4">
        {/* Background Grid Room Silhouette */}
        <div className="w-full h-36 sm:h-44 rounded-xl bg-gradient-to-b from-[#0c121d] to-[#06080d] border border-white/5 relative overflow-hidden flex items-center justify-center">
          {/* Depth Grid Lines */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

          {/* Simulated Detection Target Silhouette */}
          <div className="relative flex flex-col items-center">
            {/* Subject Head & Torso */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-700/60 border border-zinc-600/50 mb-1 relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-zinc-600/50" />
            </div>
            <div className="w-24 h-16 sm:w-28 sm:h-20 rounded-t-3xl bg-zinc-700/40 border border-zinc-600/40 relative">
              {/* Privacy Mask Overlay Layer */}
              {blurActive && (
                <div className="absolute inset-0 rounded-t-3xl backdrop-blur-md bg-[#00E5FF]/20 border border-[#00E5FF]/60 flex items-center justify-center text-center p-1 transition-all duration-300">
                  <div className="flex flex-col items-center">
                    <Shield className="w-4 h-4 text-[#00E5FF] mb-0.5 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase font-bold text-white tracking-widest">
                      PRIVACY MASKED
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Computer Vision Bounding Box Brackets */}
            <div className="absolute -inset-3 border border-[#00E5FF]/80 rounded-lg pointer-events-none flex flex-col justify-between p-1">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-mono bg-[#00E5FF] text-black px-1 font-bold rounded">
                  DETECTED [99.4%]
                </span>
                <span className="text-[9px] font-mono text-[#00E5FF]">BOX #01</span>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                <span>GAUSSIAN BLUR // ACTIVE</span>
                <span>YOLOv8</span>
              </div>
            </div>
          </div>

          {/* Interactive Toggle Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setBlurActive(!blurActive);
            }}
            className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-white/20 hover:border-[#00E5FF] text-[10px] font-mono text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer z-20 shadow-lg"
          >
            {blurActive ? (
              <>
                <EyeOff className="w-3 h-3 text-[#00E5FF]" />
                <span>Mask: Engaged</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 text-rose-400" />
                <span className="text-rose-400">Mask: Disabled</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Status Ticker */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1 text-zinc-400">
          <Activity className="w-3 h-3 text-[#00E5FF]" />
          REAL-TIME PRIVACY SAFEGUARD
        </span>
        <span className="text-[#00E5FF]/80">OPENCV + PYTHON INGESTION</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PROJECT 2: MARK ANALYSIS COCKPIT                                           */
/* -------------------------------------------------------------------------- */
const MarkAnalysisMockup: React.FC<{ num: string }> = ({ num }) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'matrix'>('chart');

  return (
    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#06080d] border border-white/10 group-hover:border-[#00E5FF]/50 transition-all duration-500 shadow-2xl flex flex-col justify-between p-4 sm:p-5 select-none">
      {/* Top Header & Switcher */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-mono font-bold text-white tracking-wide">
            ACADEMIC PERFORMANCE DASHBOARD
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/10 text-[10px] font-mono">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveTab('chart'); }}
            className={`px-2 py-0.5 rounded ${activeTab === 'chart' ? 'bg-[#00E5FF] text-black font-semibold' : 'text-zinc-400'}`}
          >
            YOY TREND
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveTab('matrix'); }}
            className={`px-2 py-0.5 rounded ${activeTab === 'matrix' ? 'bg-[#00E5FF] text-black font-semibold' : 'text-zinc-400'}`}
          >
            DATA MATRIX
          </button>
        </div>
      </div>

      {/* Central Interactive Content */}
      <div className="my-auto py-2">
        {activeTab === 'chart' ? (
          <div className="space-y-3">
            {/* Visual comparative bars */}
            <div className="space-y-2">
              {[
                { subject: 'Artificial Intelligence', y1: 76, y2: 91, delta: '+15%' },
                { subject: 'Data Structures & Algorithms', y1: 72, y2: 88, delta: '+16%' },
                { subject: 'Python & Scientific Computing', y1: 82, y2: 94, delta: '+12%' },
                { subject: 'Database Management (MySQL)', y1: 74, y2: 86, delta: '+12%' },
              ].map((item) => (
                <div key={item.subject} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>{item.subject}</span>
                    <span className="text-[#00E5FF] font-bold">{item.delta}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800/80 overflow-hidden flex">
                    <div
                      style={{ width: `${item.y1}%` }}
                      className="h-full bg-zinc-600 transition-all duration-700"
                      title={`Year 1: ${item.y1}%`}
                    />
                    <div
                      style={{ width: `${item.y2 - item.y1}%` }}
                      className="h-full bg-gradient-to-r from-[#00E5FF] to-blue-500 transition-all duration-700"
                      title={`Year 2 Improvement: +${item.y2 - item.y1}%`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Diagnostic Alert Tag */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Aggregated Trajectory: Positive Across 4 Subject Cohorts
              </span>
              <span className="font-bold">+14.2% OVERALL</span>
            </div>
          </div>
        ) : (
          /* Pandas Data Matrix Preview */
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 font-mono text-[10px] text-zinc-300 space-y-1.5 overflow-hidden">
            <div className="grid grid-cols-4 text-zinc-500 pb-1 border-b border-white/10 font-bold">
              <span>METRIC</span>
              <span>YEAR 1</span>
              <span>YEAR 2</span>
              <span>VARIANCE</span>
            </div>
            <div className="grid grid-cols-4 text-zinc-300">
              <span>Mean Mark</span>
              <span>76.0%</span>
              <span className="text-[#00E5FF]">89.7%</span>
              <span className="text-emerald-400">+13.7%</span>
            </div>
            <div className="grid grid-cols-4 text-zinc-300">
              <span>Standard Dev</span>
              <span>8.4</span>
              <span className="text-[#00E5FF]">4.1</span>
              <span className="text-emerald-400">-51.2% (Tighter)</span>
            </div>
            <div className="grid grid-cols-4 text-zinc-300">
              <span>Flagged Weak</span>
              <span>3 Units</span>
              <span className="text-[#00E5FF]">0 Units</span>
              <span className="text-emerald-400">Resolved</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom KPI Highlights */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1 text-zinc-400">
          <TrendingUp className="w-3 h-3 text-[#00E5FF]" />
          POWER BI & PANDAS ENGINE
        </span>
        <span className="text-zinc-400">2 ACADEMIC YEARS EVALUATED</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PROJECT 3: SRI THIRUMALAI KALAIKOODAM                                      */
/* -------------------------------------------------------------------------- */
const KalaikoodamMockup: React.FC<{ num: string }> = ({ num }) => {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#07090e] border border-white/10 group-hover:border-[#00E5FF]/50 transition-all duration-500 shadow-2xl flex flex-col justify-between p-4 sm:p-5 select-none">
      {/* Top Browser Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] font-mono text-zinc-400 ml-2">
            kalaikoodam.org/events
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/10 text-[10px] font-mono">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewport('desktop'); }}
            className={`p-1 rounded ${viewport === 'desktop' ? 'bg-[#00E5FF] text-black' : 'text-zinc-400'}`}
            title="Desktop Mode"
          >
            <Monitor className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewport('mobile'); }}
            className={`p-1 rounded ${viewport === 'mobile' ? 'bg-[#00E5FF] text-black' : 'text-zinc-400'}`}
            title="Mobile Mode"
          >
            <Smartphone className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Cultural Platform Body */}
      <div className="my-auto py-2">
        <div className={`mx-auto transition-all duration-500 ${viewport === 'mobile' ? 'max-w-[210px]' : 'w-full'}`}>
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#171c2b] to-[#0e121c] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                OFFICIAL PLATFORM
              </span>
              <span className="text-[10px] font-mono text-zinc-400">2026 SCHEDULE</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                ஸ்ரீ திருமலை கலைக்கூடம்
              </h4>
              <p className="text-[10px] text-zinc-400 font-light">
                Cultural Arts, Classical Bharatanatyam & Event Coordination
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[10px] font-mono">
              <div className="p-1.5 rounded bg-black/40 border border-white/5">
                <span className="text-zinc-500 block">NEXT EVENT</span>
                <span className="text-zinc-200 font-medium truncate block">Natyanjali Festival</span>
              </div>
              <div className="p-1.5 rounded bg-black/40 border border-white/5">
                <span className="text-zinc-500 block">ENROLLMENT</span>
                <span className="text-emerald-400 font-medium block">Open Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Features Ticker */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1.5 text-zinc-400">
          <Calendar className="w-3 h-3 text-[#00E5FF]" />
          RESPONSIVE WEB & EVENT MANAGEMENT
        </span>
        <span className="text-[#00E5FF]">PRODUCTION ARTIFACT</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PROJECT 4: QUIZ MASTER                                                     */
/* -------------------------------------------------------------------------- */
const QuizMasterMockup: React.FC<{ num: string }> = ({ num }) => {
  return (
    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#06080e] border border-white/10 group-hover:border-[#00E5FF]/50 transition-all duration-500 shadow-2xl flex flex-col justify-between p-4 sm:p-5 select-none">
      {/* Top Session Status */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-white font-semibold">ROOM #8942</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">FLUTTER + FIREBASE</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#00E5FF] font-semibold text-[10px]">
          <Users className="w-3.5 h-3.5" />
          <span>4 PLAYERS SYNCED</span>
        </div>
      </div>

      {/* Dual Perspective: Host Live Leaderboard + Smartphone Preview */}
      <div className="my-auto py-2 grid grid-cols-12 gap-3 items-center">
        {/* Left: Host Live Question & Options */}
        <div className="col-span-7 space-y-2">
          <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-white/10">
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1">
              <span>ROUND 03 // QUESTION 05</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> 08s
              </span>
            </div>
            <p className="text-xs font-semibold text-white leading-tight mb-2">
              Which tree data structure guarantees O(log n) worst-case search?
            </p>

            {/* Answer Grid */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
              <div className="p-1.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300">
                A: Binary Search Tree
              </div>
              <div className="p-1.5 rounded bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 font-bold flex items-center justify-between">
                <span>B: Red-Black Tree</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Leaderboard Pod */}
        <div className="col-span-5 space-y-1.5 p-2 rounded-xl bg-black/50 border border-white/5 text-[10px] font-mono">
          <div className="flex items-center gap-1 text-zinc-400 pb-1 border-b border-white/10 font-bold">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>LIVE PODIUM</span>
          </div>
          <div className="flex justify-between text-zinc-200">
            <span className="text-amber-400">1. Dhipash</span>
            <span className="font-bold">2,840 pts</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>2. Arjun K</span>
            <span>2,410 pts</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>3. Sneha R</span>
            <span>2,190 pts</span>
          </div>
        </div>
      </div>

      {/* Bottom Tech Ticker */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1 text-zinc-400">
          <Smartphone className="w-3 h-3 text-[#00E5FF]" />
          CROSS-PLATFORM // ANDROID • IOS • WEB
        </span>
        <span className="text-emerald-400">FIREBASE REALTIME DB</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* GENERIC ARTIFACT FALLBACK                                                   */
/* -------------------------------------------------------------------------- */
const GenericProjectMockup: React.FC<{ project: Project; num: string }> = ({ project, num }) => (
  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-[#121622] via-[#090b0e] to-[#040507] border border-white/10 group-hover:border-[#00E5FF]/50 transition-all duration-500 shadow-2xl flex flex-col justify-between p-6 select-none bg-grid-pattern">
    <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
      <span className="flex items-center gap-1.5 text-[#00E5FF]">
        <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
        {project.category.toUpperCase()}
      </span>
      <span>SYSTEM // {num}</span>
    </div>

    <div className="my-auto text-center py-4">
      <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-[#00E5FF]">
        <Cpu className="w-7 h-7" />
      </div>
      <h4 className="text-xl font-bold text-white tracking-wide mb-1">
        {project.title}
      </h4>
      <p className="text-xs font-mono text-zinc-400">
        {project.technologies.slice(0, 4).join(' • ')}
      </p>
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-500">
      <span>VERIFIED ARTIFACT</span>
      <span className="text-[#00E5FF]">Explore Architecture →</span>
    </div>
  </div>
);
