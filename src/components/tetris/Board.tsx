'use client';

import React from 'react';
import type { Matrix } from 'react-tetris/lib/models/Matrix';
import type { Piece } from 'react-tetris/lib/models/Piece';
import Block from './Block';

interface BoardProps {
  matrix: Matrix;
  currentPiece: Piece;
  isFlashing?: boolean;
}

export default function Board({ matrix, currentPiece, isFlashing = false }: BoardProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, var(--block-size))',
          gridTemplateRows: 'repeat(20, var(--block-size))',
          gap: 0,
          backgroundColor: '#0d1117',
        }}
      >
        {matrix.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <Block
              key={`${rowIdx}-${colIdx}`}
              piece={cell}
              ghostPiece={cell === 'ghost' ? currentPiece : undefined}
              size="normal"
            />
          ))
        )}
      </div>

      {/* Line-clear flash overlay */}
      {isFlashing && (
        <div
          className="animate-board-flash"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.45)',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}
    </div>
  );
}
