"use client";

import React, { useState, useRef } from 'react';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  initialX: number;
  initialY: number;
  width?: number | string;
  height?: number | string;
  zIndex: number;
  onFocus: (id: string) => void;
  onClose?: (id: string) => void;
  onMinimize?: (id: string) => void;
  isMacStyle?: boolean;
}

export default function Window({
  id, title, children, initialX, initialY, width, height,
  zIndex, onFocus, onClose, onMinimize, isMacStyle = false
}: WindowProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaxState, setPreMaxState] = useState({ x: initialX, y: initialY, w: width, h: height });
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isMaximized) return; // Don't drag when maximized
    onFocus(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      setPosition({ x: preMaxState.x, y: preMaxState.y });
      setIsMaximized(false);
    } else {
      setPreMaxState({ x: position.x, y: position.y, w: width, h: height });
      setPosition({ x: 0, y: 0 });
      setIsMaximized(true);
    }
  };

  const handleTitleDoubleClick = () => {
    toggleMaximize();
  };

  // Mac OS Style
  if (isMacStyle) {
    return (
      <div
        ref={windowRef}
        className="absolute mac-window flex flex-col pointer-events-auto"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: width || 'auto',
          height: height || 'auto',
          zIndex,
        }}
        onPointerDown={() => onFocus(id)}
      >
        <div
          className="mac-titlebar h-6 flex items-center px-2 cursor-grab select-none relative"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {onClose && (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(id); }}
              className="absolute left-2 w-3 h-3 border border-black bg-white hover:bg-black"
              aria-label="Close"
            />
          )}
          <div className="mx-auto bg-white px-2 text-xs font-bold font-[sans-serif] border border-black">
            {title}
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-white">
          {children}
        </div>
      </div>
    );
  }

  // Vista Style - with maximize support
  const windowStyle: React.CSSProperties = isMaximized
    ? {
      left: 0,
      top: 0,
      width: '100vw',
      height: 'calc(100vh - 40px)', // Leave room for taskbar
      zIndex,
      borderRadius: 0,
    }
    : {
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: width || 'auto',
      height: height || 'auto',
      zIndex,
    };

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col pointer-events-auto vista-window`}
      style={windowStyle}
      onPointerDown={() => onFocus(id)}
    >
      {/* Title Bar */}
      <div
        className="vista-titlebar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleTitleDoubleClick}
      >
        <div className="flex-1 flex items-center pl-2">
          <span className="vista-title-text truncate">{title}</span>
        </div>
        <div className="flex gap-[2px] pr-1">
          {onMinimize && (
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
              className="vista-btn pb-2"
              aria-label="Minimize"
            >
              _
            </button>
          )}
          <button
            className="vista-btn"
            aria-label="Maximize"
            onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
          >
            {isMaximized ? '\u29C9' : '\u25A1'}
          </button>
          {onClose && (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(id); }}
              className="vista-btn vista-btn-close"
              aria-label="Close"
            >
              X
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-white text-black m-1 mb-2 rounded-sm border border-gray-400 shadow-inner">
        {children}
      </div>
    </div>
  );
}
