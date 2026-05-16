'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { submitScore, type LeaderboardEntry } from '@/app/actions';

interface GameOverModalProps {
  points: number;
  linesCleared: number;
  level: number;
  onRestart: () => void;
  onScoreSubmitted?: () => void;
}

export default function GameOverModal({
  points,
  linesCleared,
  level,
  onRestart,
  onScoreSubmitted,
}: GameOverModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!playerName.trim()) {
        setError('Please enter a name');
        return;
      }
      setLoading(true);
      setError(null);

      const result = await submitScore({
        playerName: playerName.trim(),
        score: points,
        linesCleared,
        level,
      });

      if (!result.success) {
        setError(result.error ?? 'Failed to submit score');
      } else {
        setLeaderboard(result.scores ?? []);
        setSubmitted(true);
        onScoreSubmitted?.();
      }
      setLoading(false);
    },
    [playerName, points, linesCleared, level, onScoreSubmitted]
  );

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.82)' }}
    >
      <div
        className="font-mono w-full max-w-sm mx-4"
        style={{
          backgroundColor: '#0d1117',
          border: '1px solid rgba(239,68,68,0.5)',
          boxShadow: '0 0 24px rgba(239,68,68,0.25)',
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-3 border-b"
          style={{ borderColor: 'rgba(239,68,68,0.3)' }}
        >
          <p className="text-red-400 text-xl font-bold tracking-widest text-center">
            DEPLOYMENT FAILED
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Stats */}
          <div
            className="p-3 space-y-1 text-sm"
            style={{ border: '1px solid rgba(63,63,70,0.8)', backgroundColor: '#111827' }}
          >
            <StatLine label="SCORE" value={points.toLocaleString()} accent />
            <StatLine label="LINES" value={String(linesCleared)} />
            <StatLine label="LEVEL" value={String(level)} />
          </div>

          {/* Submission form or leaderboard */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[#00ff41] text-[11px] mb-1 tracking-wider">
                  &gt;_ ENTER NAME FOR LEADERBOARD
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
                  placeholder="hacker-name"
                  maxLength={20}
                  className="w-full text-white text-sm font-mono px-3 py-2 focus:outline-none"
                  style={{
                    backgroundColor: '#111827',
                    border: '1px solid rgba(63,63,70,0.8)',
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = '#00ff41')
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = 'rgba(63,63,70,0.8)')
                  }
                />
                {error && (
                  <p className="text-red-400 text-[10px] mt-1">{error}</p>
                )}
                <p className="text-zinc-600 text-[9px] mt-1">
                  {20 - playerName.length} chars remaining
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-sm font-bold tracking-widest transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: loading ? '#374151' : '#00ff41',
                  color: loading ? '#9ca3af' : '#000000',
                }}
              >
                {loading ? 'SUBMITTING...' : 'SUBMIT SCORE'}
              </button>
            </form>
          ) : (
            <div>
              <div className="text-[#00ff41] text-[11px] mb-2 tracking-wider">
                &gt;_ TOP DEPLOYMENTS
              </div>
              <ol className="space-y-1 max-h-44 overflow-y-auto">
                {leaderboard.map((entry, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center text-[11px] font-mono py-0.5"
                    style={{ borderBottom: '1px solid rgba(63,63,70,0.4)' }}
                  >
                    <span className="text-zinc-400 truncate max-w-[10rem]">
                      <span className="text-[#00ff41] mr-1">{i + 1}.</span>
                      {entry.player_name}
                    </span>
                    <span className="text-white tabular-nums">
                      {entry.score.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onRestart}
              className="flex-1 py-2 text-sm font-mono font-bold tracking-wider transition-colors"
              style={{
                border: '1px solid #00ff41',
                color: '#00ff41',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = 'rgba(0,255,65,0.08)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = 'transparent')
              }
            >
              ↺ PLAY AGAIN
            </button>

            {!submitted && (
              <button
                onClick={onRestart}
                className="text-zinc-500 text-xs font-mono py-2 px-3 hover:text-zinc-300 transition-colors"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatLine({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#00ff41] text-[11px] tracking-widest">{label}</span>
      <span className={accent ? 'text-white font-bold text-base' : 'text-white'}>
        {value}
      </span>
    </div>
  );
}
