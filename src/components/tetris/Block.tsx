'use client';

import React from 'react';
import { PIECE_CONFIG } from '@/lib/pieceConfig';
import type { Piece } from 'react-tetris/lib/models/Piece';

export type BlockSize = 'normal' | 'small' | 'tiny';

interface BlockProps {
  piece: Piece | 'ghost' | null;
  ghostPiece?: Piece;
  size?: BlockSize;
}

const SIZE_MAP: Record<BlockSize, { px: number; iconPx: number; fontSize: string }> = {
  normal: { px: 28, iconPx: 12, fontSize: '5.5px' },
  small:  { px: 20, iconPx: 9,  fontSize: '4px'   },
  tiny:   { px: 16, iconPx: 7,  fontSize: '3.5px'  },
};

export default function Block({ piece, ghostPiece, size = 'normal' }: BlockProps) {
  const { px, iconPx, fontSize } = SIZE_MAP[size];

  const cellStyle: React.CSSProperties = {
    width:  size === 'normal' ? 'var(--block-size)' : px,
    height: size === 'normal' ? 'var(--block-size)' : px,
    flexShrink: 0,
  };

  if (!piece) {
    return (
      <div
        style={{
          ...cellStyle,
          backgroundColor: 'transparent',
          border: '1px solid rgba(255,255,255,0.04)',
        }}
      />
    );
  }

  if (piece === 'ghost') {
    const refPiece = ghostPiece;
    const glowColor = refPiece ? PIECE_CONFIG[refPiece].glowColor : '#ffffff';
    return (
      <div
        style={{
          ...cellStyle,
          backgroundColor: refPiece
            ? `${PIECE_CONFIG[refPiece].bg}33`
            : 'transparent',
          border: `1px dashed ${glowColor}55`,
        }}
      />
    );
  }

  const config = PIECE_CONFIG[piece];
  const Icon = config.icon;

  return (
    <div
      style={{
        ...cellStyle,
        backgroundColor: config.bg,
        border: `1px solid ${config.glowColor}66`,
        boxShadow: `inset 0 0 5px rgba(255,255,255,0.12)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        gap: '1px',
      }}
    >
      <Icon size={iconPx} color="white" />
      <span
        style={{
          fontSize,
          color: 'white',
          fontFamily: 'monospace',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        {config.label}
      </span>
    </div>
  );
}
