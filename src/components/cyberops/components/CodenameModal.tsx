import React, { useState } from 'react';
import { Shield, X, Check } from 'lucide-react';
import { cyberAudio } from '../audio/cyberAudio';

interface CodenameModalProps {
  currentCodename: string;
  onSave: (newName: string) => void;
  onClose: () => void;
}

export const CodenameModal: React.FC<CodenameModalProps> = ({
  currentCodename,
  onSave,
  onClose,
}) => {
  const [val, setVal] = useState<string>(currentCodename);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = val.trim().toUpperCase().slice(0, 14);
    if (!clean) return;
    cyberAudio.playSuccess();
    onSave(clean);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-[#0A0E18] border border-cyan-500/40 rounded-2xl p-6 font-mono text-zinc-200 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2 text-[#00E5FF] font-bold text-xs uppercase">
            <Shield className="w-4 h-4" />
            <span>OPERATOR CODENAME</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-4">
          Assign your classified security alias. Saved locally to your operator dossier.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value.toUpperCase())}
            placeholder="e.g. GHOST-7..."
            maxLength={14}
            className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/20 text-white font-mono text-center tracking-widest text-base focus:border-[#00E5FF] focus:outline-none uppercase"
            autoFocus
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!val.trim()}
              className="flex-1 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider disabled:opacity-40"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
