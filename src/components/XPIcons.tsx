import React from 'react';

export const ComputerIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="28" height="20" rx="2" fill="#d1d5db" stroke="#374151" strokeWidth="2" />
        <rect x="4" y="6" width="24" height="15" fill="#3b82f6" stroke="#1f2937" strokeWidth="1" />
        <path d="M12 24 L10 28 L22 28 L20 24" fill="#9ca3af" stroke="#374151" strokeWidth="2" />
        <rect x="8" y="28" width="16" height="2" fill="#cbd5e1" stroke="#374151" strokeWidth="1" />
    </svg>
);

export const FolderIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M2,8 L10,8 L14,12 L30,12 L30,26 L2,26 Z" fill="#fcd34d" stroke="#b45309" strokeWidth="1.5" />
        <path d="M2,12 L30,12 L28,26 L4,26 Z" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
    </svg>
);

export const TextIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="2" width="20" height="28" fill="#f8fafc" stroke="#475569" strokeWidth="1.5" />
        <path d="M6 2 L20 2 L26 8 L26 30 L6 30 Z" fill="#ffffff" />
        <path d="M20 2 L20 8 L26 8" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
        <line x1="10" y1="12" x2="22" y2="12" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="10" y1="16" x2="22" y2="16" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="10" y1="20" x2="22" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="10" y1="24" x2="18" y2="24" stroke="#94a3b8" strokeWidth="1.5" />
    </svg>
);

export const TerminalIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="28" height="24" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <rect x="2" y="4" width="28" height="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        <path d="M6 14 L12 18 L6 22" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="14" y1="22" x2="20" y2="22" stroke="#22c55e" strokeWidth="3" />
    </svg>
);

export const LogoIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg" style={{ transform: "skewY(-10deg)" }}>
        <rect x="2" y="2" width="13" height="13" fill="#ef4444" />
        <rect x="17" y="2" width="13" height="13" fill="#22c55e" />
        <rect x="2" y="17" width="13" height="13" fill="#3b82f6" />
        <rect x="17" y="17" width="13" height="13" fill="#eab308" />
    </svg>
);
