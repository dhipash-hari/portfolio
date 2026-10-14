import React from 'react';

// Handcrafted, award-winning CSS/SVG holographic fallback for devices without WebGL or reduced-motion
export const CinematicHoloFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center relative select-none">
    {/* Outer cyber ring */}
    <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border border-[#00E5FF]/20 bg-gradient-to-tr from-[#00E5FF]/5 via-[#0d1017]/80 to-[#131722]/90 backdrop-blur-2xl flex items-center justify-center relative shadow-[0_0_80px_rgba(0,229,255,0.12)]">
      {/* Concentric rotating dashed rings */}
      <div
        className="w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-dashed border-[#00E5FF]/30 flex items-center justify-center animate-spin"
        style={{ animationDuration: '36s' }}
      >
        <div
          className="w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-dotted border-[#3B82F6]/40 flex items-center justify-center animate-spin"
          style={{ animationDuration: '24s', animationDirection: 'reverse' }}
        >
          {/* Central glowing chrome core */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#00E5FF]/25 via-[#070a0f] to-[#3B82F6]/30 border border-[#00E5FF]/40 flex items-center justify-center relative shadow-[0_0_40px_rgba(0,229,255,0.3)]">
            <div className="w-6 h-6 rounded-full bg-[#00E5FF] shadow-[0_0_20px_#00E5FF] animate-pulse" />
            <div
              className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-25"
              style={{ animationDuration: '4s' }}
            />
          </div>
        </div>
      </div>

      {/* Orbiting coordinate markers */}
      <div className="absolute top-4 left-6 text-[10px] font-mono text-[#00E5FF]/70 tracking-widest">
        CORE // 0x7E1A
      </div>
      <div className="absolute bottom-4 right-6 text-[10px] font-mono text-zinc-500 tracking-wider">
        STATUS // 60 FPS
      </div>
    </div>
  </div>
);
