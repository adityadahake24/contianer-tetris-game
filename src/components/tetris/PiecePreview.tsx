'use client';

import React, { useMemo } from 'react';
import { getBlocks } from 'react-tetris/lib/models/Piece';
import type { Piece } from 'react-tetris/lib/models/Piece';
import Block, { type BlockSize } from './Block';

interface PiecePreviewProps {
  piece: Piece | null | undefined;
  size?: BlockSize;
}

export default function PiecePreview({ piece, size = 'small' }: PiecePreviewProps) {
  const blocks = useMemo<number[][]>(() => {
    if (!piece) return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    return getBlocks(piece)[0];
  }, [piece]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto)',
        gap: 0,
        lineHeight: 0,
      }}
    >
      {blocks.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <Block
            key={`${rowIdx}-${colIdx}`}
            piece={cell && piece ? piece : null}
            size={size}
          />
        ))
      )}
    </div>
  );
}
