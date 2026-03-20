"use client";

import React, { useState, useEffect, useRef } from 'react';
import Window from './Window';
import StartMenu from './StartMenu';
import dynamic from 'next/dynamic';

const Terminal = dynamic(() => import('./Terminal'), { ssr: false });
const FileManager = dynamic(() => import('./FileManager'), { ssr: false });

type WindowData = {
    id: string;
    title: string;
    component: React.ReactNode;
    initialX: number;
    initialY: number;
    width?: number | string;
    height?: number | string;
    isOpen: boolean;
    isMinimized?: boolean;
    iconUrl?: string;
};

// SVG Icons to Replace Emojis
const Svgs = {
    Back: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m14 16-4-4 4-4" /></svg>),
    Forward: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m10 8 4 4-4 4" /></svg>),
    Up: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 12-4-4-4 4" /><path d="M12 16V8" /><circle cx="12" cy="12" r="10" /></svg>),
    Search: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>),
    Network: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="14" width="8" height="8" rx="2" ry="2" /><rect x="14" y="14" width="8" height="8" rx="2" ry="2" /><path d="M6 14V10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" /><path d="M12 8V4" /></svg>),
    Volume: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07 M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>),
    Drive: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 2 12 2 20 22 20 22 12" /><path d="M5.45 5.11 2 12v8h20v-8l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /><line x1="6" x2="6.01" y1="16" y2="16" /><line x1="10" x2="10.01" y1="16" y2="16" /></svg>)
};

const ICONS = {
    computer: "/icons/monitor.png",
    folder: "/icons/floppy.png",
    text: "/icons/floppy.png",
    terminal: "/icons/gear.png",
    windowsLogo: "/icons/windows-logo.svg",
    mail: "/icons/mail.svg",
    info: "/icons/clock.png",
};

// Draggable Desktop Icon component
function DesktopIcon({ icon, label, onDoubleClick, initialPos }: {
    icon: string; label: string; onDoubleClick: () => void;
    initialPos: { x: number; y: number };
}) {
    const [pos, setPos] = useState(initialPos);
    const [dragging, setDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const moved = useRef(false);

    const handlePointerDown = (e: React.PointerEvent) => {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setDragging(true);
        moved.current = false;
        offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragging) return;
        moved.current = true;
        setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setDragging(false);
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    };

    return (
        <div
            className="absolute flex flex-col items-center w-[76px] cursor-pointer group select-none"
            style={{ left: pos.x, top: pos.y, zIndex: dragging ? 100 : 0 }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDoubleClick={(e) => { if (!moved.current) onDoubleClick(); }}
        >
            <img src={icon} className="w-12 h-12 mb-1 drop-shadow-md group-hover:brightness-110 opacity-90 group-hover:opacity-100" alt={label} draggable={false} />
            <div className="text-white text-xs text-center drop-shadow-md group-hover:bg-[#2080d0] px-1 rounded border border-transparent group-hover:border-[#a0cbf1] max-w-full font-[segoe_ui] leading-tight" style={{ textShadow: "1px 1px 2px black" }}>
                {label}
            </div>
        </div>
    );
}

export default function DesktopWorkspace() {
    const [windows, setWindows] = useState<WindowData[]>([
        {
            id: 'terminal',
            title: 'Administrator: me@info:~',
            iconUrl: ICONS.terminal,
            initialX: 380,
            initialY: 80,
            width: 480,
            height: 280,
            isOpen: false,
            component: (
                <div className="w-full h-full bg-black text-[#00ff00] p-4 font-mono text-sm overflow-auto">
                    <div>Microsoft Windows [Version 6.0.6002]</div>
                    <div>Copyright (c) 2006 Microsoft Corporation.  All rights reserved.</div>
                    <br />
                    <div className="mt-4 flex items-center">
                        <span>C:\Users\Mathew&gt; </span>
                        <div className="w-2 h-4 bg-white ml-1 animate-pulse" />
                    </div>
                </div>
            )
        },
        {
            id: 'experience',
            title: 'Experience.txt - Notepad',
            iconUrl: ICONS.text,
            initialX: 100,
            initialY: 100,
            width: 600,
            height: 350,
            isOpen: false,
            component: (
                <div className="w-full h-full bg-white flex flex-col font-sans text-sm text-black">
                    <div className="flex px-2 py-1 bg-[#f0f4f9] border-b border-[#e1eaf5] text-xs">
                        <span className="px-2 hover:bg-[#c2d7f1] cursor-pointer rounded">File</span>
                        <span className="px-2 hover:bg-[#c2d7f1] cursor-pointer rounded">Edit</span>
                        <span className="px-2 hover:bg-[#c2d7f1] cursor-pointer rounded">Format</span>
                        <span className="px-2 hover:bg-[#c2d7f1] cursor-pointer rounded">View</span>
                        <span className="px-2 hover:bg-[#c2d7f1] cursor-pointer rounded">Help</span>
                    </div>
                    <div className="flex-1 p-2 font-mono scrollbar-hide overflow-auto whitespace-pre-wrap outline-none" contentEditable suppressContentEditableWarning>
                        {`-- WORK EXPERIENCE --\n\nMathew Geejo\nFrontend Developer & UI/UX Designer\n\nUniversal Postal Union | Senior Software Developer | Oct 2013 - Present\n- Lead Architecture & Development\n- Mentored agile practices\n- Built enterprise-scale web applications\n\nPrevious Roles:\n- Full Stack Developer at TechCorp (2010-2013)\n- Junior Developer at StartupXYZ (2008-2010)\n`}
                    </div>
                </div>
            )
        },
        {
            id: 'skills',
            title: 'Skills',
            iconUrl: ICONS.folder,
            initialX: 160,
            initialY: 160,
            width: 750,
            height: 500,
            isOpen: false,
            component: <FileManager initialPath="/home/user" />
        },
        {
            id: 'projects',
            title: 'Projects',
            iconUrl: ICONS.folder,
            initialX: 300,
            initialY: 200,
            width: 750,
            height: 500,
            isOpen: false,
            component: <FileManager initialPath="/home/user/Projects" />
        },
        {
            id: 'about',
            title: 'Welcome Center',
            iconUrl: ICONS.info,
            initialX: 200,
            initialY: 100,
            width: 500,
            height: 380,
            isOpen: false,
            component: (
                <div className="w-full h-full bg-[#f9fbfd] flex flex-col font-sans text-sm text-black">
                    <div className="bg-gradient-to-b from-[#2a6db7] to-[#1e528b] p-4 text-white shadow-md border-b-2 border-orange-500">
                        <h1 className="text-2xl font-bold font-[segoe ui] tracking-wide mb-1 shadow-black">Welcome to Mathew's Portfolio</h1>
                        <p className="text-sm opacity-90">View computer details and learn more about Mathew.</p>
                    </div>
                    <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
                        <div className="flex bg-white border border-[#d8e2f1] shadow-sm rounded-md p-4 items-center gap-6">
                            <img src={ICONS.info} className="w-16 h-16 drop-shadow-md" alt="info" />
                            <div>
                                <h2 className="font-bold text-lg text-[#1e395b] mb-1">About Me</h2>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    I am a passionate software developer specializing in modern web architecture, frontend styling, and creating nostalgic UX experiences. Welcome to my Windows Vista recreation!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'contact',
            title: 'Windows Mail - Contact',
            iconUrl: ICONS.mail,
            initialX: 400,
            initialY: 250,
            width: 550,
            height: 300,
            isOpen: false,
            component: (
                <div className="w-full h-full bg-[#f0f4f9] flex flex-col font-sans text-sm text-black">
                    <div className="flex items-center px-4 py-2 gap-4 bg-[#d7e4f5] border-b border-white text-xs text-[#1c4b8b]">
                        <div className="flex flex-col items-center cursor-pointer hover:brightness-110">
                            <img src={ICONS.mail} className="w-6 h-6 mb-1 drop-shadow" alt="mail" />
                            <span>Create Mail</span>
                        </div>
                        <div className="flex flex-col items-center cursor-pointer hover:brightness-110">
                            <img src={ICONS.folder} className="w-6 h-6 mb-1 drop-shadow" alt="reply" />
                            <span>Reply</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-white border-t border-[#d8e2f1] p-4 shadow-inner">
                        <div className="border-b border-[#eee] pb-2 mb-2">
                            <div className="text-gray-500 mb-1"><span className="w-16 inline-block">To:</span> <span className="text-black bg-[#edf3fb] px-2 rounded-full border border-[#d8e2f1]">mathew@domain.com</span></div>
                            <div className="text-gray-500 mb-1"><span className="w-16 inline-block">Subject:</span> <span className="text-black font-semibold">Hello! Let's connect!</span></div>
                        </div>
                        <div className="p-2 text-gray-700 font-sans outline-none" contentEditable suppressContentEditableWarning>
                            Hi Mathew,
                            <br /><br />
                            I saw your Windows Vista portfolio and would love to get in touch.
                            <br />
                            You can reach me at my email or LinkedIn.
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'cmd',
            title: 'Command Prompt',
            iconUrl: ICONS.terminal,
            initialX: 120,
            initialY: 80,
            width: 680,
            height: 420,
            isOpen: false,
            component: <Terminal />
        },
        {
            id: 'filemanager',
            title: 'Windows Explorer',
            iconUrl: ICONS.computer,
            initialX: 200,
            initialY: 60,
            width: 750,
            height: 500,
            isOpen: false,
            component: <FileManager initialPath="/C:" />
        }
    ]);

    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [zIndexes, setZIndexes] = useState<{ [key: string]: number }>({});
    const [nextZIndex, setNextZIndex] = useState(10);
    const [time, setTime] = useState<string>('');
    const [showStartMenu, setShowStartMenu] = useState(false);

    useEffect(() => {
        openFromDesktop('about');

        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            setTime(`${hours}:${minutes} ${ampm}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Start menu close listener now handled inside StartMenu component

    const bringToFront = (id: string) => {
        setActiveWindowId(id);
        setZIndexes(prev => ({ ...prev, [id]: nextZIndex }));
        setNextZIndex(prev => prev + 1);
    };

    const closeWindow = (id: string) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false, isMinimized: false } : w));
    };

    const minimizeWindow = (id: string) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
        if (activeWindowId === id) setActiveWindowId(null);
    };

    const toggleWindow = (id: string) => {
        setWindows(prev => prev.map(w => {
            if (w.id === id) {
                if (!w.isOpen) return { ...w, isOpen: true, isMinimized: false };
                if (w.isMinimized) return { ...w, isMinimized: false };
                if (activeWindowId === id) return { ...w, isMinimized: true };
                return w;
            }
            return w;
        }));
        if (activeWindowId !== id) {
            bringToFront(id);
        } else {
            setActiveWindowId(null);
        }
    };

    const openFromDesktop = (id: string) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false } : w));
        bringToFront(id);
        setShowStartMenu(false);
    };

    // Desktop icon definitions with positions
    const desktopIcons = [
        { icon: ICONS.info, label: 'About Me', windowId: 'about', pos: { x: 20, y: 20 } },
        { icon: ICONS.computer, label: 'My Computer', windowId: 'filemanager', pos: { x: 20, y: 110 } },
        { icon: ICONS.folder, label: 'Projects', windowId: 'projects', pos: { x: 20, y: 200 } },
        { icon: ICONS.text, label: 'Experience.txt', windowId: 'experience', pos: { x: 20, y: 290 } },
        { icon: ICONS.mail, label: 'Contact Me', windowId: 'contact', pos: { x: 20, y: 380 } },
        { icon: ICONS.terminal, label: 'Command Prompt', windowId: 'cmd', pos: { x: 20, y: 470 } },
    ];

    return (
        <div className="relative w-full h-screen overflow-hidden text-black font-sans bg-[#0c1f38]">
            {/* Background */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/windowsxpwallper.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />

            {/* Draggable Desktop Icons */}
            {desktopIcons.map(di => (
                <DesktopIcon
                    key={di.windowId}
                    icon={di.icon}
                    label={di.label}
                    initialPos={di.pos}
                    onDoubleClick={() => openFromDesktop(di.windowId)}
                />
            ))}

            {/* Windows */}
            {windows.map(win => win.isOpen && !win.isMinimized && (
                <Window
                    key={win.id}
                    id={win.id}
                    title={win.title}
                    initialX={win.initialX}
                    initialY={win.initialY}
                    width={win.width}
                    height={win.height}
                    zIndex={zIndexes[win.id] || 1}
                    onFocus={bringToFront}
                    onClose={closeWindow}
                    onMinimize={minimizeWindow}
                >
                    {win.component}
                </Window>
            ))}

            {/* Vista Start Menu */}
            <StartMenu
                isOpen={showStartMenu}
                onClose={() => setShowStartMenu(false)}
                onOpenWindow={openFromDesktop}
            />

            {/* Vista Taskbar */}
            <div className="absolute bottom-0 left-0 right-0 h-[40px] vista-taskbar flex items-center justify-between z-50 select-none px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.5)]">

                <div className="flex h-full items-center gap-2 flex-1">
                    {/* Start Orb */}
                    <div
                        className="vista-start-orb shadow-[1px_1px_5px_rgba(0,0,0,0.8)]"
                        onClick={() => setShowStartMenu(prev => !prev)}
                    >
                        <img src={ICONS.windowsLogo} className="w-6 h-6 object-contain" alt="Start" />
                    </div>

                    {/* Window Tabs */}
                    <div className="flex gap-1 h-[75%] items-center ml-2 border-l border-white/20 pl-2">
                        {windows.filter(w => w.isOpen).map(win => {
                            const isActive = activeWindowId === win.id && !win.isMinimized;
                            return (
                                <button
                                    key={`taskbar-${win.id}`}
                                    onClick={() => toggleWindow(win.id)}
                                    className={`vista-taskbar-item h-full min-w-[140px] max-w-[160px] px-2 flex items-center gap-2 ${isActive ? 'active' : ''}`}
                                >
                                    <img src={win.iconUrl || ICONS.folder} className="w-5 h-5 drop-shadow" alt="icon" />
                                    <span className="truncate text-xs text-white" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>{win.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* System Tray */}
                <div className="flex items-center gap-3 text-white text-[13px] h-full px-4 border-l border-white/20 hover:bg-white/10 cursor-pointer transition-colors" title="Network, Volume, Time">
                    <div className="flex items-center gap-2 opacity-90 drop-shadow-md">
                        <Svgs.Network />
                        <Svgs.Volume />
                    </div>
                    <span className="font-sans font-medium drop-shadow-md" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>{time}</span>
                </div>
            </div>
        </div>
    );
}
