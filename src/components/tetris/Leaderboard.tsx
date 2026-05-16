'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getLeaderboard, type LeaderboardEntry } from '@/app/actions';

interface LeaderboardProps {
  initialScores?: LeaderboardEntry[];
  compact?: boolean;
  refreshKey?: number;
}

export default function Leaderboard({ initialScores, compact = false, refreshKey = 0 }: LeaderboardProps) {
  const [scores, setScores] = useState<LeaderboardEntry[]>(initialScores ?? []);
  const [loading, setLoading] = useState(!initialScores);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard();
      setScores(data);
    } catch {
      setError('Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (refreshKey > 0 || !initialScores) {
      fetchScores();
    }
  }, [fetchScores, initialScores, refreshKey]);

  return (
    <div className="border border-[#00ff41]/40 bg-[#0d1117] p-2 flex-1 min-h-0 flex flex-col">
      <div className="text-[#00ff41] text-xs font-mono mb-2 flex items-center justify-between">
        <span>&gt;_ LEADERBOARD</span>
        <button
          onClick={fetchScores}
          className="text-zinc-500 hover:text-[#00ff41] text-[9px] transition-colors"
          aria-label="Refresh leaderboard"
        >
          ↻
        </button>
      </div>

      {loading && (
        <p className="text-zinc-500 text-[10px] font-mono">loading...</p>
      )}

      {error && (
        <p className="text-red-400 text-[10px] font-mono">{error}</p>
      )}

      {!loading && !error && scores.length === 0 && (
        <p className="text-zinc-600 text-[10px] font-mono">no scores yet</p>
      )}

      {!loading && scores.length > 0 && (
        <ol className={`space-y-1 overflow-y-auto ${compact ? 'max-h-32' : 'max-h-56'}`}>
          {scores.map((entry, i) => (
            <li key={i} className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-zinc-400 truncate max-w-[5rem]">
                <span className="text-[#00ff41] mr-1">{i + 1}.</span>
                {entry.player_name}
              </span>
              <span className="text-white tabular-nums">
                {entry.score.toLocaleString()}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
