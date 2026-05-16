'use client';

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Tetris from 'react-tetris';
import { Context } from 'react-tetris/lib/context';
import { viewMatrix } from 'react-tetris/lib/models/Game';
import type { Controller } from 'react-tetris/lib/components/Tetris';
import type { State } from 'react-tetris/lib/models/Game';
import type { Piece } from 'react-tetris/lib/models/Piece';

import Board from '@/components/tetris/Board';
import PiecePreview from '@/components/tetris/PiecePreview';
import { type BlockSize } from '@/components/tetris/Block';
import HUD from '@/components/tetris/HUD';
import Leaderboard from '@/components/tetris/Leaderboard';
import GameOverModal from '@/components/tetris/GameOverModal';
import MobileControls from '@/components/tetris/MobileControls';

// ─── Desktop sidebar panel ────────────────────────────────────────────────────
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2" style={{ width: 192 }}>
      <span className="text-[11px] font-mono tracking-widest" style={{ color: '#00ff41' }}>
        &gt;_ {title}
      </span>
      {children}
    </div>
  );
}

// ─── Compact mobile score stat ────────────────────────────────────────────────
function MStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 52 }}>
      <span style={{ color: '#4b5563', fontSize: '8px', letterSpacing: '0.12em', fontFamily: 'monospace', lineHeight: 1 }}>
        {label}
      </span>
      <span style={{ color: '#00ff41', fontSize: '14px', fontFamily: 'monospace', fontWeight: 700, lineHeight: 1.3 }}>
        {value}
      </span>
    </div>
  );
}

// ─── Mobile side panel (Hold / Next) ─────────────────────────────────────────
function SideBox({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 2 }}>
      <span style={{ color: '#00ff41', fontSize: '8px', letterSpacing: '0.18em', fontFamily: 'monospace' }}>
        {label}
      </span>
      {children}
      {hint && (
        <span style={{ color: '#374151', fontSize: '7px', fontFamily: 'monospace' }}>{hint}</span>
      )}
    </div>
  );
}

// ─── Piece box: correctly sized container for hold / next previews ───────────
// SIZE_DIM must match Block.tsx SIZE_MAP: tiny=16, small=20. Grid is 4×4 cells.
const PIECE_BOX_DIM: Record<BlockSize, number> = { tiny: 64, small: 80, normal: 112 };

function PieceBox({ piece, size = 'tiny' }: { piece: Piece | undefined; size?: BlockSize }) {
  const dim = PIECE_BOX_DIM[size];
  return (
    <div
      style={{
        width: dim,
        height: dim,
        border: '1px solid rgba(0,255,65,0.3)',
        backgroundColor: '#080c10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: piece ? '0 0 5px rgba(0,255,65,0.1) inset' : 'none',
        flexShrink: 0,
      }}
    >
      <PiecePreview piece={piece} size={size} />
    </div>
  );
}

// ─── Inner game (inside react-tetris Context.Provider) ───────────────────────
interface GameInnerProps {
  points: number;
  linesCleared: number;
  level: number;
  state: State;
  controller: Controller;
}

function GameInner({ points, linesCleared, level, state, controller }: GameInnerProps) {
  const game = useContext(Context);
  const matrix = useMemo(() => viewMatrix(game), [game]);
  const currentPiece: Piece = game.piece.piece;
  const heldPiece: Piece | undefined = game.heldPiece?.piece;
  const nextPieces: Piece[] = game.queue.queue.slice(0, 3);

  const [isFlashing, setIsFlashing] = useState(false);
  const prevLinesRef = useRef(linesCleared);
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const onScoreSubmitted = useCallback(() => setLeaderboardRefreshKey((k) => k + 1), []);

  // True once the user has clicked the START button at least once.
  // Distinguishes the pre-game PAUSED state from a mid-game pause.
  const [hasGameStarted, setHasGameStarted] = useState(false);

  useEffect(() => {
    if (linesCleared > prevLinesRef.current) {
      setIsFlashing(true);
      const t = setTimeout(() => setIsFlashing(false), 120);
      prevLinesRef.current = linesCleared;
      return () => clearTimeout(t);
    }
    prevLinesRef.current = linesCleared;
  }, [linesCleared]);

  // Board + overlays — called as a function so each layout gets its own instance
  const renderBoard = () => (
    <div style={{ position: 'relative', lineHeight: 0, overflow: 'hidden' }}>
      <Board matrix={matrix} currentPiece={currentPiece} isFlashing={isFlashing} />

      {/* START screen: pieces fall as decoration behind the button */}
      {!hasGameStarted && (
        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16, zIndex: 10,
            backgroundColor: 'rgba(8,12,16,0.82)',
          }}
        >
          {/* Animated falling colour blocks */}
          {([
            { left: '9%',  color: '#1a4fd4', size: 14, delay: 0,   dur: 2.8 },
            { left: '22%', color: '#00bfff', size: 12, delay: 1.2, dur: 3.4 },
            { left: '35%', color: '#cc2233', size: 16, delay: 0.4, dur: 2.6 },
            { left: '50%', color: '#0db7ed', size: 12, delay: 1.8, dur: 3.0 },
            { left: '63%', color: '#ff7700', size: 14, delay: 0.7, dur: 2.4 },
            { left: '76%', color: '#9b59b6', size: 12, delay: 2.1, dur: 3.6 },
            { left: '88%', color: '#e6522c', size: 16, delay: 0.2, dur: 2.9 },
            { left: '15%', color: '#00ff41', size: 10, delay: 1.5, dur: 3.2 },
            { left: '43%', color: '#1a4fd4', size: 12, delay: 2.3, dur: 2.7 },
            { left: '70%', color: '#00bfff', size: 14, delay: 0.9, dur: 3.5 },
          ] as const).map((b, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                left: b.left,
                width: b.size,
                height: b.size,
                backgroundColor: b.color,
                animation: `fallBlock ${b.dur}s ${b.delay}s infinite linear`,
                borderRadius: 2,
                opacity: 0,
              }}
            />
          ))}
          {/* START content */}
          <p style={{ color: '#00ff41', fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.3em', opacity: 0.55, position: 'relative' }}>
            container‑tetris
          </p>
          <button
            onClick={() => { controller.restart(); setHasGameStarted(true); }}
            style={{
              fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem',
              letterSpacing: '0.2em', padding: '10px 28px', cursor: 'pointer',
              backgroundColor: 'transparent',
              border: '2px solid #00ff41',
              color: '#00ff41',
              borderRadius: 4,
              boxShadow: '0 0 16px rgba(0,255,65,0.4)',
              position: 'relative',
            }}
          >
            ▶ START
          </button>
          <p style={{ color: '#374151', fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.12em', position: 'relative' }}>
            stack the rack
          </p>
        </div>
      )}

      {/* PAUSED overlay — only during an active game */}
      {state === 'PAUSED' && hasGameStarted && (
        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', zIndex: 10,
            backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.72)',
          }}
        >
          <p style={{ color: '#00ff41', fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.15em' }}>
            {'// PAUSED'}
          </p>
          <p style={{ color: '#71717a', fontFamily: 'monospace', fontSize: '0.75rem', marginTop: 6 }}>
            Press P or tap ⏯ to resume
          </p>
        </div>
      )}

      {state === 'LOST' && hasGameStarted && (
        <GameOverModal
          points={points}
          linesCleared={linesCleared}
          level={level}
          onRestart={controller.restart}
          onScoreSubmitted={onScoreSubmitted}
        />
      )}
    </div>
  );

  return (
    <>
      {/* ════════════════════════ DESKTOP (md+) ════════════════════════ */}
      <div className="hidden md:flex items-start justify-center gap-5 flex-1 p-6">
        <Panel title="STATUS">
          <div className="p-2" style={{ border: '1px solid rgba(0,255,65,0.35)', backgroundColor: '#0d1117' }}>
            <p className="text-[9px] font-mono tracking-widest mb-1" style={{ color: '#00ff41' }}>HOLD [C]</p>
            <div className="flex items-center justify-center py-1">
              <PieceBox piece={heldPiece} size="small" />
            </div>
          </div>
          <HUD points={points} level={level} linesCleared={linesCleared} />
          <Leaderboard refreshKey={leaderboardRefreshKey} />
        </Panel>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <p className="text-xs font-mono tracking-[0.25em]" style={{ color: '#00ff41' }}>&gt;_ SERVER RACK</p>
            {hasGameStarted && (state === 'PLAYING' || state === 'PAUSED') && (
              <button
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => state === 'PLAYING' ? controller.pause() : controller.resume()}
                style={{
                  fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.1em',
                  padding: '2px 8px', cursor: 'pointer',
                  backgroundColor: 'transparent',
                  border: `1px solid ${state === 'PAUSED' ? 'rgba(251,191,36,0.6)' : 'rgba(0,255,65,0.4)'}`,
                  color: state === 'PAUSED' ? '#fbbf24' : '#00ff41',
                  borderRadius: 4,
                }}
              >
                {state === 'PAUSED' ? '▶ RESUME' : '⏸ PAUSE'}
              </button>
            )}
          </div>
          <div style={{ border: '2px solid #00ff41', boxShadow: '0 0 12px #00ff41, 0 0 28px rgba(0,255,65,0.18)' }}>
            {renderBoard()}
          </div>
        </div>

        <Panel title="QUEUE">
          <div className="p-2 flex flex-col items-center gap-3" style={{ border: '1px solid rgba(0,255,65,0.35)', backgroundColor: '#0d1117' }}>
            {nextPieces.map((p, i) => <PieceBox key={i} piece={p} size="small" />)}
          </div>
          <div className="p-3 text-[11px] font-mono leading-5" style={{ border: '1px solid rgba(0,255,65,0.35)', backgroundColor: '#0d1117', color: '#71717a' }}>
            <p style={{ color: '#00ff41', marginBottom: 6 }}>&gt;_ CONTROLS</p>
            <p><span style={{ color: '#a1a1aa' }}>← →</span>{'  '}Move</p>
            <p><span style={{ color: '#a1a1aa' }}>↑</span>{'    '}Rotate</p>
            <p><span style={{ color: '#a1a1aa' }}>↓</span>{'    '}Soft drop</p>
            <p><span style={{ color: '#a1a1aa' }}>Space</span> Hard drop</p>
            <p><span style={{ color: '#a1a1aa' }}>P</span>{'    '}Pause</p>
            <p><span style={{ color: '#a1a1aa' }}>C</span>{'    '}Hold</p>
          </div>
        </Panel>
      </div>

      {/* ════════════════════════ MOBILE (< md) ════════════════════════
          One Tetris instance — both layouts share the same game state.
          Mobile layout locked to 100dvh, zero scroll.                  */}
      <div
        className="flex md:hidden flex-col"
        style={{ height: '100dvh', overflow: 'hidden', backgroundColor: '#0d1117' }}
      >
        {/* ── Version title bar ── */}
        <div
          style={{
            height: 18,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 10px',
            backgroundColor: '#080c10',
            borderBottom: '1px solid rgba(0,255,65,0.1)',
          }}
        >
          <span style={{ color: '#1f2937', fontSize: '7px', fontFamily: 'monospace', letterSpacing: '0.12em' }}>
            container-tetris v1.0
          </span>
          <span style={{ color: '#1f2937', fontSize: '7px', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
            stack the rack
          </span>
        </div>

        {/* ── Score bar ── */}
        <div
          style={{
            height: 40,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 12px',
            borderBottom: '1px solid rgba(0,255,65,0.15)',
          }}
        >
          <MStat label="SCORE" value={points.toLocaleString()} />
          <span style={{ color: 'rgba(0,255,65,0.2)', fontSize: 18, lineHeight: 1 }}>│</span>
          <MStat label="LEVEL" value={String(level)} />
          <span style={{ color: 'rgba(0,255,65,0.2)', fontSize: 18, lineHeight: 1 }}>│</span>
          <MStat label="LINES" value={String(linesCleared)} />
          <span style={{ color: 'rgba(0,255,65,0.2)', fontSize: 18, lineHeight: 1 }}>│</span>
          {/* Pause / Resume button — doubles as live status indicator */}
          <button
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            aria-label={state === 'PAUSED' && hasGameStarted ? 'Resume' : 'Pause'}
            onClick={() => {
              if (state === 'PLAYING') controller.pause();
              else if (state === 'PAUSED' && hasGameStarted) controller.resume();
            }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'none', border: 'none', padding: 0, minWidth: 36,
              cursor: hasGameStarted && state !== 'LOST' ? 'pointer' : 'default',
            }}
          >
            <span style={{ color: '#4b5563', fontSize: '8px', letterSpacing: '0.12em', fontFamily: 'monospace', lineHeight: 1 }}>
              {state === 'PAUSED' && hasGameStarted ? 'PAUSED' : state === 'LOST' ? 'OVER' : 'PAUSE'}
            </span>
            <span style={{
              fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, lineHeight: 1.3,
              color: state === 'PAUSED' && hasGameStarted ? '#f59e0b' : state === 'LOST' ? '#ef4444' : state === 'PLAYING' ? '#00ff41' : '#374151',
            }}>
              {state === 'PAUSED' && hasGameStarted ? '▶' : state === 'LOST' ? '✕' : state === 'PLAYING' ? '⏸' : '○'}
            </span>
          </button>
          <span style={{ color: 'rgba(0,255,65,0.2)', fontSize: 18, lineHeight: 1 }}>│</span>
          {/* Leaderboard toggle button */}
          <button
            onClick={() => setShowLeaderboard(true)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0, minWidth: 32,
            }}
            aria-label="Open leaderboard"
          >
            <span style={{ color: '#4b5563', fontSize: '8px', letterSpacing: '0.12em', fontFamily: 'monospace', lineHeight: 1 }}>
              BOARD
            </span>
            <span style={{ color: '#00ff41', fontSize: '11px', lineHeight: 1.3 }}>🏆</span>
          </button>
        </div>

        {/* ── Board row: [HOLD] | BOARD | [NEXT] ── */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: 4,
            padding: '6px 6px 0',
          }}
        >
          {/* Hold side panel */}
          <SideBox label="HOLD" hint="[C]">
            <PieceBox piece={heldPiece} />
          </SideBox>

          {/* The board itself */}
          <div style={{ border: '2px solid #00ff41', boxShadow: '0 0 10px #00ff41, 0 0 22px rgba(0,255,65,0.14)' }}>
            {renderBoard()}
          </div>

          {/* Next side panel */}
          <SideBox label="NEXT">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {nextPieces.slice(0, 3).map((p, i) => (
                <PieceBox key={i} piece={p} />
              ))}
            </div>
          </SideBox>
        </div>

        {/* ── Touch controls (flex-1 fills remaining height) ── */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 0 8px',
          }}
        >
          {hasGameStarted
            ? <MobileControls controller={controller} />
            : (
              <p style={{ color: '#374151', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.15em', textAlign: 'center' }}>
                tap ▶ START to play
              </p>
            )
          }
        </div>
      </div>

      {/* ── Mobile leaderboard overlay (fixed, full screen) ── */}
      {showLeaderboard && (
        <div
          className="flex md:hidden"
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            backgroundColor: '#080c10',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              height: 48, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 16px',
              borderBottom: '1px solid rgba(0,255,65,0.2)',
            }}
          >
            <span style={{ color: '#00ff41', fontFamily: 'monospace', fontSize: 13, letterSpacing: '0.18em' }}>
              &gt;_ LEADERBOARD
            </span>
            <button
              onClick={() => setShowLeaderboard(false)}
              style={{
                background: 'none', border: '1px solid rgba(0,255,65,0.3)',
                color: '#71717a', cursor: 'pointer',
                fontFamily: 'monospace', fontSize: 13,
                padding: '2px 10px', borderRadius: 3,
              }}
              aria-label="Close leaderboard"
            >
              ✕ CLOSE
            </button>
          </div>
          {/* Leaderboard content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px 16px 32px' }}>
            <Leaderboard refreshKey={leaderboardRefreshKey} />
          </div>
        </div>
      )}
    </>
  );
}

// ─── Root export — single Tetris instance, single GameInner ──────────────────
export default function GameClient() {
  return (
    <div className="font-mono" style={{ backgroundColor: '#0d1117', color: '#ffffff' }}>

      {/* Desktop-only header */}
      <header
        className="hidden md:flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <span className="text-xs font-mono tracking-widest" style={{ color: '#71717a' }}>
          container-tetris v1.0
        </span>
        <span className="text-sm font-mono tracking-widest" style={{ color: '#00ff41' }}>
          container-tetris<span className="terminal-blink ml-0.5">_</span>
        </span>
        <span className="text-xs font-mono" style={{ color: '#71717a' }}>
          stack the rack
        </span>
      </header>

      {/* Single game instance — GameInner renders both layouts from one Tetris state */}
      <div className="md:min-h-[calc(100dvh-41px)] md:flex md:flex-col">
        <Tetris>
          {(props) => <GameInner {...props} />}
        </Tetris>
      </div>
    </div>
  );
}
