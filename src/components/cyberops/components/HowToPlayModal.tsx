import React from 'react';
import { HelpCircle, X, Terminal, Key, Shield, Zap, BookOpen } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full max-h-[85vh] bg-[#0A0E18] border border-cyan-500/40 rounded-2xl p-6 sm:p-8 font-mono text-zinc-200 overflow-y-auto shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2 text-[#00E5FF] font-bold">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">OPERATOR FIELD MANUAL</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs leading-relaxed">
          <div>
            <h4 className="text-white font-bold text-sm mb-1 uppercase text-[#00E5FF]">
              1. CAMPAIGN STRUCTURE
            </h4>
            <p className="text-zinc-300">
              Cyber Ops features 7 interconnected cybersecurity simulations ranging from beginner CLI navigation to an expert multi-stage AI boss encounter. Each mission teaches real software engineering and security principles.
            </p>
          </div>

          <div className="p-3 bg-black/50 rounded-xl border border-white/10 space-y-2">
            <span className="text-[#00E5FF] font-bold block">SUPPORTED TERMINAL COMMANDS (Mission 01):</span>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li><code className="text-cyan-300">ls</code>: Lists current directory files & subdirectories.</li>
              <li><code className="text-cyan-300">cd &lt;path&gt;</code>: Navigates directories (e.g. <code>cd archives</code>, <code>cd ..</code>).</li>
              <li><code className="text-cyan-300">cat &lt;file&gt;</code>: Prints contents of a target file.</li>
              <li><code className="text-cyan-300">scan</code>: Runs simulated radio-frequency / anomaly detector.</li>
              <li><code className="text-cyan-300">decrypt &lt;token&gt;</code>: Authenticates with the extracted authorization key.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-1 uppercase text-[#00E5FF]">
              2. SCORING & XP PROGRESSION
            </h4>
            <p className="text-zinc-300 mb-2">
              - <strong>Base Score</strong>: Earn up to 1,000–3,000 points per mission.
              <br />
              - <strong>Speed Bonus</strong>: Faster completion preserves more bonus points.
              <br />
              - <strong>Hint Penalty</strong>: Using tactical hints incurs a -50 to -100 point deduction.
              <br />
              - <strong>Level Formula</strong>: Your Operator Level is calculated dynamically from your total XP via <code className="text-purple-300">Level = floor(sqrt(XP / 100)) + 1</code>.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-1 uppercase text-[#00E5FF]">
              3. NO LOGIN REQUIRED & LOCAL PERSISTENCE
            </h4>
            <p className="text-zinc-300">
              All progress, high scores, codenames, and achievement badges are stored locally in your browser's <code className="text-cyan-300">localStorage</code>. You can refresh or return anytime without losing your campaign state.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-[#00E5FF] hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
        >
          Return to Operations
        </button>
      </div>
    </div>
  );
};
