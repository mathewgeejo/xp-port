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
    windowsLogo: "/icons/windows-logo.svg",
    media_player: "/icons/media-player.png", // placeholders for visual fidelity
    media_center: "/icons/media-center.png",
    gallery: "/icons/photo-gallery.png",
    messenger: "/icons/messenger.png",
    dvd: "/icons/dvd-maker.png",
    meeting: "/icons/meeting-space.png",
    update: "/icons/update.png",
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

    const topPrograms = [
        { id: 'cmd', label: 'Internet', sub: 'Internet Explorer', icon: ICONS.terminal, isLarge: true },
        { id: 'contact', label: 'E-mail', sub: 'Windows Mail', icon: ICONS.mail, isLarge: true },
    ];

    const mainPrograms = [
        { id: 'about', label: 'Welcome Center', icon: ICONS.info },
        { id: 'filemanager', label: 'Windows Media Player', icon: ICONS.media_player || ICONS.computer },
        { id: 'filemanager', label: 'Windows Media Center', icon: ICONS.media_center || ICONS.computer },
        { id: 'filemanager', label: 'Windows Ultimate Extras', icon: ICONS.computer },
        { id: 'filemanager', label: 'Windows Photo Gallery', icon: ICONS.gallery || ICONS.folder },
        { id: 'filemanager', label: 'Windows Live Messenger Download', icon: ICONS.messenger || ICONS.info },
        { id: 'filemanager', label: 'Windows DVD Maker', icon: ICONS.dvd || ICONS.folder },
        { id: 'filemanager', label: 'Windows Meeting Space', icon: ICONS.meeting || ICONS.info },
        { id: 'filemanager', label: 'Windows Update', icon: ICONS.update || ICONS.terminal },
    ];

    const handleOpen = (id: string) => { onOpenWindow(id); onClose(); };

    // Dialogs
    if (showShutdown) {
        return (
            <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center" onClick={() => setShowShutdown(false)}>
                <div className="bg-[#ece9d8] border-2 border-[#0054e3] rounded-lg shadow-2xl w-96" onClick={(e) => e.stopPropagation()} style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }}>
                    <div className="bg-gradient-to-b from-[#0058e6] to-[#3a93ff] text-white px-4 py-2 rounded-t-lg font-bold text-sm">Shut Down Windows</div>
                    <div className="p-6 text-center">
                        <div className="mb-4 text-sm">What do you want the computer to do?</div>
                        <select className="w-full border border-gray-400 p-1 mb-4 text-xs">
                            <option>Shut down</option><option>Restart</option><option>Sleep</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 p-3 border-t border-gray-300">
                        <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => { try { window.close(); } catch { window.location.href = 'about:blank'; } }}>OK</button>
                        <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => setShowShutdown(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    if (showLogoff) {
        return (
            <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center" onClick={() => setShowLogoff(false)}>
                <div className="bg-[#ece9d8] border-2 border-[#0054e3] rounded-lg shadow-2xl w-80" onClick={(e) => e.stopPropagation()} style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }}>
                    <div className="bg-gradient-to-b from-[#0058e6] to-[#3a93ff] text-white px-4 py-2 rounded-t-lg font-bold text-sm">Log Off Windows</div>
                    <div className="p-6 text-center text-sm">Are you sure you want to log off?</div>
                    <div className="flex justify-center gap-2 p-3 border-t border-gray-300">
                        <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => { try { window.close(); } catch { window.location.href = 'about:blank'; } }}>Log Off</button>
                        <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => setShowLogoff(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={menuRef}
            className="absolute bottom-[40px] left-0 z-[999] w-[420px]"
            style={{
                fontFamily: '"Segoe UI", Tahoma, sans-serif',
                animation: 'startMenuIn 150ms ease-out',
            }}
        >
            <style>{`
        @keyframes startMenuIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .vista-glass {
          background: rgba(40, 45, 50, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: inset 0 0 15px rgba(255,255,255,0.1), 0 4px 15px rgba(0,0,0,0.5);
        }
        .vista-hover:hover {
          background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(180,210,250,0.3) 100%);
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.5);
        }
        .vista-btn {
          background: linear-gradient(180deg, #444 0%, #222 50%, #111 51%, #000 100%);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);
          border-radius: 3px;
        }
        .vista-btn:hover {
          background: linear-gradient(180deg, #666 0%, #444 50%, #333 51%, #222 100%);
        }
      `}</style>

            {/* Main Container - Dark Glass */}
            <div className="vista-glass rounded-md flex relative pt-2 pb-2 px-2 gap-1 items-stretch min-h-[480px]">

                {/* User Avatar - positioned absolutely so it bursts out the top right */}
                <div className="absolute -top-5 right-6 w-[56px] h-[56px] rounded-sm p-[2px] z-10"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(200,200,200,0.2))', boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
                    <div className="w-full h-full border border-gray-400 overflow-hidden bg-white flex items-center justify-center">
                        {/* The flower avatar from screenshot */}
                        <div className="w-full h-full" style={{ background: 'radial-gradient(circle, #fdbb2d 0%, #22c1c3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>M</div>
                    </div>
                </div>

                {/* Left Column (White Programs Area) */}
                <div className="flex-1 flex flex-col bg-white border border-gray-400 rounded-sm relative z-0 h-full overflow-hidden">
                    <div className="flex-1 py-2 px-1 overflow-y-auto">
                        {topPrograms.map(item => (
                            <div key={item.id} className="flex items-center gap-3 px-2 py-1 mx-1 vista-hover cursor-pointer" onClick={() => handleOpen(item.id)}>
                                <img src={item.icon || ICONS.computer} className="w-8 h-8 drop-shadow-sm" alt="" />
                                <div className="flex flex-col">
                                    <span className="text-[#1e3b6e] font-bold text-[11px] leading-tight">{item.label}</span>
                                    <span className="text-gray-500 text-[10px] leading-tight">{item.sub}</span>
                                </div>
                            </div>
                        ))}
                        <div className="border-t border-gray-300 mx-2 my-2" />
                        {mainPrograms.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-2 py-1 mx-1 vista-hover cursor-pointer" onClick={() => handleOpen(item.id)}>
                                <img src={item.icon || ICONS.computer} className="w-6 h-6 drop-shadow-sm" alt="" />
                                <span className="text-[#333] text-[11px] whitespace-nowrap">{item.label}</span>
                            </div>
                        ))}
                        <div className="border-t border-gray-300 mx-2 my-2" />
                        <div className="flex items-center gap-2 px-3 py-1 mx-1 vista-hover cursor-pointer group" onClick={() => handleOpen('filemanager')}>
                            <span className="font-bold text-[#1e3b6e] text-[11px] group-hover:underline">All Programs</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-black"><polyline points="9 18 15 12 9 6" /></svg>
                        </div>
                    </div>

                    {/* Search Box integrated into bottom of white area */}
                    <div className="bg-[#eef2f8] px-2 py-[6px] border-t border-[#ccd8e8]">
                        <div className="flex items-center bg-white border border-gray-400 shadow-inner rounded-sm px-2 py-[2px]">
                            <input type="text" placeholder="Start Search" value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
                                className="flex-1 text-[11px] outline-none bg-transparent italic text-gray-500" />
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2b5ba3" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                    </div>
                </div>

                {/* Right Column (Dark Glassy Places Area) */}
                <div className="w-[140px] flex flex-col justify-between pt-10 pb-2 px-0">
                    <div className="flex flex-col gap-0 text-white shadow-sm space-y-1">
                        <div className="font-bold text-[12px] px-3 py-[4px] hover:bg-white/20 cursor-pointer" onClick={() => handleOpen('about')}>MathewGeejo</div>
                        <div className="text-[11px] px-3 py-[4px] hover:bg-white/20 cursor-pointer" onClick={() => handleOpen('skills')}>Documents</div>
                        <div className="text-[11px] px-3 py-[4px] hover:bg-white/20 cursor-pointer" onClick={() => handleOpen('projects')}>Pictures</div>
                        <div className="text-[11px] px-3 py-[4px] hover:bg-white/20 cursor-pointer" onClick={() => handleOpen('projects')}>Music</div>
                        <div className="text-[11px] px-3 py-[4px] hover:bg-white/20 cursor-pointer">Games</div>
                        <div className="border-t border-white/20 my-1 mx-3" />
                        <div className="text-[11px] px-3 py-[4px] hover:bg-white/20 cursor-pointer flex justify-between items-center group">
                            <span>Recent Items</span>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-0 group-hover:opacity-100"><polyline points="9 18 15 12 9 6" /></svg>
                        </div>
                        <div className="border-t border-white/20 my-1 mx-3" />
                        <div className="font-bold text-[11px] px-3 py-[4px] hover:bg-white/20 cursor-pointer" onClick={() => handleOpen('filemanager')}>Computer</div>
                        <div className="text-[11px] px-3 py-[4px] hover:bg-white/20 cursor-pointer">Network</div>
                        <div className="text-[11px] px-3 py-[4px] hover:bg-white/20 cursor-pointer">Connect To</div>
                        <div className="border-t border-white/20 my-1 mx-3" />
                        <div className="text-[11px] px-3 py-[4px] hover:bg-white/20 cursor-pointer">Control Panel</div>
                        <div className="text-[11px] px-3 py-[4px] hover:bg-white/20 cursor-pointer">Default Programs</div>
                        <div className="text-[11px] px-3 py-[4px] hover:bg-white/20 cursor-pointer" onClick={() => handleOpen('cmd')}>Help and Support</div>
                    </div>

                    {/* Power Buttons aligned to bottom right */}
                    <div className="flex justify-end gap-1 px-3 mt-auto mb-[2px]">
                        <button className="vista-btn w-8 h-6 flex items-center justify-center cursor-pointer" onClick={() => setShowShutdown(true)} title="Shut Down">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M18.36 6.64A9 9 0 0 1 6.1 18.36M5.64 5.64A9 9 0 0 0 17.9 18.36" /><line x1="12" y1="2" x2="12" y2="6" /></svg>
                        </button>
                        <button className="vista-btn w-8 h-6 flex items-center justify-center cursor-pointer" onClick={() => setShowLogoff(true)} title="Lock">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </button>
                        <button className="vista-btn w-5 h-6 flex items-center justify-center cursor-pointer">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
