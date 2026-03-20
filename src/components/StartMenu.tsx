"use client";

import React, { useState, useRef, useEffect } from 'react';

interface StartMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenWindow: (id: string) => void;
}

const ICONS = {
    computer: "/icons/monitor.png",
    folder: "/icons/floppy.png",
    text: "/icons/floppy.png",
    terminal: "/icons/gear.png",
    mail: "/icons/mail.svg",
    info: "/icons/clock.png",
};

export default function StartMenu({ isOpen, onClose, onOpenWindow }: StartMenuProps) {
    const [showShutdown, setShowShutdown] = useState(false);
    const [showLogoff, setShowLogoff] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) { setShowShutdown(false); setShowLogoff(false); setSearchVal(''); }
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                const orb = (e.target as HTMLElement).closest('.vista-start-orb');
                if (!orb) onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const programs = [
        { id: 'filemanager', label: 'Windows Explorer', icon: ICONS.computer },
        { id: 'cmd', label: 'Command Prompt', icon: ICONS.terminal },
        { id: 'experience', label: 'Notepad', icon: ICONS.text },
        { id: 'contact', label: 'Windows Mail', icon: ICONS.mail },
        { id: 'about', label: 'Welcome Center', icon: ICONS.info },
        { id: 'skills', label: 'Documents', icon: ICONS.folder },
        { id: 'projects', label: 'Projects', icon: ICONS.folder },
    ];

    const filteredPrograms = searchVal
        ? programs.filter(p => p.label.toLowerCase().includes(searchVal.toLowerCase()))
        : programs;

    const handleOpen = (id: string) => { onOpenWindow(id); onClose(); };

    // Shutdown dialog
    if (showShutdown) {
        return (
            <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center" onClick={() => setShowShutdown(false)}>
                <div className="bg-[#ece9d8] border-2 border-[#0054e3] rounded-lg shadow-2xl w-96" onClick={(e) => e.stopPropagation()} style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }}>
                    <div className="bg-gradient-to-b from-[#0058e6] to-[#3a93ff] text-white px-4 py-2 rounded-t-lg font-bold text-sm">Shut Down Windows</div>
                    <div className="p-6 text-center">
                        <div className="mb-4 text-sm">What do you want the computer to do?</div>
                        <select className="w-full border border-gray-400 p-1 mb-4 text-xs">
                            <option>Shut down</option>
                            <option>Restart</option>
                            <option>Sleep</option>
                        </select>
                        <div className="text-xs text-gray-500 mb-4">This will end your session and turn off the computer.</div>
                    </div>
                    <div className="flex justify-end gap-2 p-3 border-t border-gray-300">
                        <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => setShowShutdown(false)}>OK</button>
                        <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => setShowShutdown(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    // Log Off dialog
    if (showLogoff) {
        return (
            <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center" onClick={() => setShowLogoff(false)}>
                <div className="bg-[#ece9d8] border-2 border-[#0054e3] rounded-lg shadow-2xl w-80" onClick={(e) => e.stopPropagation()} style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }}>
                    <div className="bg-gradient-to-b from-[#0058e6] to-[#3a93ff] text-white px-4 py-2 rounded-t-lg font-bold text-sm">Log Off Windows</div>
                    <div className="p-6 text-center text-sm">Are you sure you want to log off?</div>
                    <div className="flex justify-center gap-2 p-3 border-t border-gray-300">
                        <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => setShowLogoff(false)}>Log Off</button>
                        <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => setShowLogoff(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={menuRef}
            className="absolute bottom-[40px] left-0 z-[999] w-[400px]"
            style={{
                fontFamily: 'Tahoma, Segoe UI, sans-serif',
                animation: 'startMenuIn 150ms ease-out',
            }}
        >
            <style>{`
        @keyframes startMenuIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

            <div className="rounded-t-lg overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.6)] border border-[#3a6ea5]/60">
                {/* === User Header === */}
                <div className="flex items-center gap-3 px-4 py-3"
                    style={{ background: 'linear-gradient(180deg, #3a7bc8 0%, #1e5799 50%, #1a4d85 100%)' }}>
                    <div className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center font-bold text-xl shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #4a90d9, #2b6cb0)', color: 'white', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                        M
                    </div>
                    <span className="text-white font-bold text-sm" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>Mathew</span>
                </div>

                {/* === Two Columns === */}
                <div className="flex">
                    {/* Left Column - Programs (dark) */}
                    <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(180deg, #202020 0%, #1a1a2e 100%)' }}>
                        <div className="px-3 pt-2 pb-1 text-[10px] text-gray-500 uppercase tracking-wider font-bold border-b border-gray-700 mx-2">Programs</div>
                        <div className="flex-1 py-1 overflow-y-auto max-h-[260px]">
                            {filteredPrograms.map(item => (
                                <div key={item.id}
                                    className="flex items-center gap-3 px-3 py-[6px] mx-1 rounded cursor-pointer text-xs text-gray-200"
                                    style={{ transition: 'background 0.15s' }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(100,150,220,0.25) 100%)'; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                                    onClick={() => handleOpen(item.id)}
                                >
                                    <img src={item.icon} className="w-7 h-7 drop-shadow" alt="" />
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="px-3 py-2 border-t border-gray-700">
                            <div className="flex items-center bg-[#2a2a3a] border border-gray-600 rounded-sm overflow-hidden"
                                style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)' }}>
                                <input
                                    type="text"
                                    placeholder="Search programs and files"
                                    value={searchVal}
                                    onChange={(e) => setSearchVal(e.target.value)}
                                    className="flex-1 bg-transparent text-white text-xs px-2 py-[5px] outline-none placeholder:text-gray-500"
                                />
                                <div className="px-2 text-gray-400">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Places (light blue-white) */}
                    <div className="w-[155px] flex flex-col" style={{ background: 'linear-gradient(180deg, #dce8f7 0%, #c8d8ec 100%)', borderLeft: '1px solid #a0b8d0' }}>
                        <div className="px-3 pt-2 pb-1 text-[10px] text-[#1c3b6e] uppercase tracking-wider font-bold border-b border-[#a0b8d0] mx-2">Places</div>
                        <div className="py-1">
                            {/* Pinned bold items */}
                            {[
                                { id: 'filemanager', label: 'My Computer' },
                                { id: 'skills', label: 'Documents' },
                                { id: 'projects', label: 'Projects' },
                            ].map(item => (
                                <div key={'pin-' + item.id}
                                    className="px-3 py-[5px] text-xs text-[#1c3b6e] font-bold cursor-pointer rounded mx-1"
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(49,106,197,0.15)'; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                                    onClick={() => handleOpen(item.id)}
                                >
                                    {item.label}
                                </div>
                            ))}
                            <div className="border-t border-[#a0b8d0] mx-3 my-1" />
                            {/* Regular items */}
                            {[
                                { label: 'Control Panel' },
                                { label: 'Help and Support' },
                            ].map(item => (
                                <div key={'reg-' + item.label}
                                    className="px-3 py-[5px] text-xs text-[#1c3b6e] cursor-pointer rounded mx-1"
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(49,106,197,0.15)'; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* === Bottom Bar === */}
                <div className="flex justify-between items-center px-4 py-[6px]"
                    style={{ background: 'linear-gradient(180deg, #2a2a3a 0%, #1a1a28 100%)', borderTop: '1px solid #444' }}>
                    <div className="flex items-center gap-2 text-white/80 text-xs cursor-pointer rounded px-2 py-1"
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                        onClick={() => setShowLogoff(true)}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        <span>Log Off</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-xs cursor-pointer rounded px-2 py-1"
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                        onClick={() => setShowShutdown(true)}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>
                        <span>Shut Down</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
