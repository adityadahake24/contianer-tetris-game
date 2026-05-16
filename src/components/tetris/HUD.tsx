'use client';

import React from 'react';

interface HUDProps {
  points: number;
  level: number;
  linesCleared: number;
  mobile?: boolean;
}

export default function HUD({ points, level, linesCleared, mobile = false }: HUDProps) {
  if (mobile) {
    return (
      <div
        className="flex items-center justify-between w-full px-2 py-1 border border-[#00ff41]/30 bg-[#0d1117]"
        style={{ maxWidth: '320px' }}
      >
        <Stat label="SCORE" value={points.toLocaleString()} />
        <div className="w-px h-8 bg-[#00ff41]/20" />
        <Stat label="LEVEL" value={String(level)} />
        <div className="w-px h-8 bg-[#00ff41]/20" />
        <Stat label="LINES" value={String(linesCleared)} />
      </div>
    );
  }

  return (
    <div className="border border-[#00ff41]/40 bg-[#0d1117] p-3 space-y-3">
      <div className="text-[#00ff41] text-xs font-mono">&gt;_ STATS</div>
      <div className="space-y-2">
        <StatRow label="SCORE" value={points.toLocaleString()} />
        <StatRow label="LEVEL" value={String(level)} />
        <StatRow label="LINES" value={String(linesCleared)} />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[#00ff41] text-[9px] font-mono tracking-widest">{label}</span>
      <span className="text-white text-lg font-mono font-bold leading-tight">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[#00ff41] text-[8px] font-mono tracking-widest">{label}</span>
      <span className="text-white text-sm font-mono font-bold">{value}</span>
    </div>
  );
}
