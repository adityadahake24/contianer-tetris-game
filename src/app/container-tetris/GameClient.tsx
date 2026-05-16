'use client';

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Tetris from 'react-tetris';
import { Context } from 'react-tetris/lib/context';
import { viewMatrix } from 'react-tetris/lib/models/Game';
import type { Controller } from 'react-tetris/lib/components/Tetris';
import type { State } from 'react-tetris/lib/models/Game';
import type { Piece } from 'react-tetris/lib/models/Piece';
import Link from 'next/link';

import Board from '@/components/tetris/Board';
import PiecePreview from '@/components/tetris/PiecePreview';
import HUD from '@/components/tetris/HUD';
import Leaderboard from '@/components/tetris/Leaderboard';
import GameOverModal from '@/components/tetris/GameOverModal';
import MobileControls from '@/components/tetris/MobileControls';

// ─── Panel wrapper ────────────────────────────────────────────────────────────
function Panel({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-2 ${className}`}
      style={{ width: 192 }}
    >
      <span
        className="text-[11px] font-mono tracking-widest"
        style={{ color: '#00ff41' }}
      >
        &gt;_ {title}
      </span>
      {children}
    </div>
  );
}

// ─── Inner game — rendered inside Tetris's Context.Provider ──────────────────
interface GameInnerProps {
  points: number;
  linesCleared: number;
  level: number;
  state: State;
  controller: Controller;
}

function GameInner({
  points,
  linesCleared,
  level,
  state,
  controller,
}: GameInnerProps) {
  const game = useContext(Context);
  const matrix = useMemo(() => viewMatrix(game), [game]);
  const currentPiece: Piece = game.piece.piece;
  const heldPiece: Piece | undefined = game.heldPiece?.piece;
  const nextPieces: Piece[] = game.queue.queue.slice(0, 3);

  // Line-clear flash
  const [isFlashing, setIsFlashing] = useState(false);
  const prevLinesRef = useRef(linesCleared);

  useEffect(() => {
    if (linesCleared > prevLinesRef.current) {
      setIsFlashing(true);
      const t = setTimeout(() => setIsFlashing(false), 120);
      prevLinesRef.current = linesCleared;
      return () => clearTimeout(t);
    }
    prevLinesRef.current = linesCleared;
  }, [linesCleared]);

  // Board element factory — called separately for desktop and mobile
  const renderBoard = () => (
    <div className="relative" style={{ lineHeight: 0 }}>
      <Board matrix={matrix} currentPiece={currentPiece} isFlashing={isFlashing} />

      {/* Pause overlay */}
      {state === 'PAUSED' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-10"
          style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.72)' }}
        >
          <p
            className="text-3xl font-bold font-mono tracking-widest"
            style={{ color: '#00ff41' }}
          >
            {'// PAUSED'}
          </p>
          <p className="text-zinc-400 font-mono text-sm mt-2">Press P to resume</p>
        </div>
      )}

      {state === 'LOST' && (
        <GameOverModal
          points={points}
          linesCleared={linesCleared}
          level={level}
          onRestart={controller.restart}
        />
      )}
    </div>
  );

  return (
    <>
      {/* ═══════════════════ DESKTOP (md+) ═══════════════════ */}
      <div className="hidden md:flex items-start justify-center gap-5 flex-1 p-6">
        {/* Left panel */}
        <Panel title="STATUS">
          {/* Held piece */}
          <div
            className="p-2"
            style={{ border: '1px solid rgba(0,255,65,0.35)', backgroundColor: '#0d1117' }}
          >
            <p
              className="text-[9px] font-mono tracking-widest mb-1"
              style={{ color: '#00ff41' }}
            >
              HOLD [C]
            </p>
            <div className="flex items-center justify-center" style={{ height: 80 }}>
              <PiecePreview piece={heldPiece} size="small" />
            </div>
          </div>

          {/* Stats */}
          <HUD points={points} level={level} linesCleared={linesCleared} />

          {/* Leaderboard */}
          <Leaderboard />
        </Panel>

        {/* Center — board */}
        <div className="flex flex-col items-center gap-2">
          <p
            className="text-xs font-mono tracking-[0.25em]"
            style={{ color: '#00ff41' }}
          >
            &gt;_ SERVER RACK
          </p>
          <div
            style={{
              border: '2px solid #00ff41',
              boxShadow: '0 0 12px #00ff41, 0 0 28px rgba(0,255,65,0.18)',
            }}
          >
            {renderBoard()}
          </div>
        </div>

        {/* Right panel */}
        <Panel title="QUEUE">
          {/* Next 3 pieces */}
          <div
            className="p-2 flex flex-col items-center gap-3"
            style={{ border: '1px solid rgba(0,255,65,0.35)', backgroundColor: '#0d1117' }}
          >
            {nextPieces.map((p, i) => (
              <PiecePreview key={i} piece={p} size="small" />
            ))}
          </div>

          {/* Controls legend */}
          <div
            className="p-3 text-[11px] font-mono leading-5"
            style={{ border: '1px solid rgba(0,255,65,0.35)', backgroundColor: '#0d1117', color: '#71717a' }}
          >
            <p style={{ color: '#00ff41', marginBottom: 6 }}>&gt;_ CONTROLS</p>
            <p><span style={{ color: '#a1a1aa' }}>← →</span> Move</p>
            <p><span style={{ color: '#a1a1aa' }}>↑</span>{'  '}Rotate</p>
            <p><span style={{ color: '#a1a1aa' }}>↓</span>{'  '}Soft drop</p>
            <p><span style={{ color: '#a1a1aa' }}>Space</span> Hard drop</p>
            <p><span style={{ color: '#a1a1aa' }}>P</span>{'  '}Pause</p>
            <p><span style={{ color: '#a1a1aa' }}>C</span>{'  '}Hold</p>
          </div>
        </Panel>
      </div>

      {/* ═══════════════════ MOBILE (< md) ═══════════════════ */}
      <div className="flex md:hidden flex-col items-center gap-3 pb-6 px-2 flex-1">
        {/* Score bar */}
        <div className="w-full flex justify-center pt-2">
          <HUD points={points} level={level} linesCleared={linesCleared} mobile />
        </div>

        {/* Board */}
        <div
          style={{
            border: '2px solid #00ff41',
            boxShadow: '0 0 12px #00ff41',
          }}
        >
          {renderBoard()}
        </div>

        {/* Touch controls */}
        <MobileControls controller={controller} />

        {/* Compact next-piece row */}
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-mono tracking-widest"
            style={{ color: '#00ff41' }}
          >
            NEXT
          </span>
          {nextPieces.slice(0, 2).map((p, i) => (
            <PiecePreview key={i} piece={p} size="tiny" />
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Public component ────────────────────────────────────────────────────────
export default function GameClient() {
  return (
    <div
      className="min-h-dvh flex flex-col font-mono"
      style={{ backgroundColor: '#0d1117', color: '#ffffff' }}
    >
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Link
          href="/"
          className="text-sm font-mono transition-colors hover:opacity-80"
          style={{ color: '#00ff41' }}
        >
          ← portfolio
        </Link>
        <span
          className="text-sm font-mono tracking-widest"
          style={{ color: '#00ff41' }}
        >
          container-tetris
          <span className="terminal-blink ml-0.5">_</span>
        </span>
      </header>

      {/* Game */}
      <div className="flex flex-1 flex-col">
        <Tetris>
          {(props) => <GameInner {...props} />}
        </Tetris>
      </div>
    </div>
  );
}
