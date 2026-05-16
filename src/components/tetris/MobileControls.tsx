'use client';

import React, { useCallback } from 'react';
import type { Controller } from 'react-tetris/lib/components/Tetris';

interface MobileControlsProps {
  controller: Controller;
}

const BASE_BTN =
  'flex items-center justify-center font-mono select-none active:scale-95 transition-transform cursor-pointer';

interface CtrlBtnProps {
  onAction: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}

function CtrlBtn({ onAction, label, children, className = '' }: CtrlBtnProps) {
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onAction();
    },
    [onAction]
  );

  return (
    <button
      type="button"
      aria-label={label}
      className={`${BASE_BTN} ${className}`}
      style={{
        minHeight: 44,
        minWidth: 44,
        backgroundColor: '#0d1117',
        border: '1px solid rgba(0,255,65,0.45)',
        color: '#00ff41',
        borderRadius: 6,
        boxShadow: '0 0 6px rgba(0,255,65,0.15)',
      }}
      onPointerDown={handlePointerDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

export default function MobileControls({ controller }: MobileControlsProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full max-w-[280px] mx-auto px-2">
      {/* Row 1: Hold / Rotate / Hard Drop */}
      <div className="grid grid-cols-3 gap-1.5">
        <CtrlBtn onAction={controller.hold} label="Hold" className="text-[11px] tracking-widest">
          HOLD
        </CtrlBtn>
        <CtrlBtn onAction={controller.flipClockwise} label="Rotate">
          <span className="text-lg">↑</span>
        </CtrlBtn>
        <CtrlBtn onAction={controller.hardDrop} label="Hard Drop" className="text-[11px] tracking-widest">
          DROP
        </CtrlBtn>
      </div>

      {/* Row 2: Left / Soft Drop / Right */}
      <div className="grid grid-cols-3 gap-1.5">
        <CtrlBtn onAction={controller.moveLeft} label="Move Left">
          <span className="text-lg">←</span>
        </CtrlBtn>
        <CtrlBtn onAction={controller.moveDown} label="Soft Drop">
          <span className="text-lg">↓</span>
        </CtrlBtn>
        <CtrlBtn onAction={controller.moveRight} label="Move Right">
          <span className="text-lg">→</span>
        </CtrlBtn>
      </div>
    </div>
  );
}
