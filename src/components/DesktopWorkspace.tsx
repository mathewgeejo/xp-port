"use client";

import React, { useState, useEffect } from 'react';
import Window from './Window';

type WindowData = {
    id: string;
    title: string;
    component: React.ReactNode;
    initialX: number;
    initialY: number;
    width?: number | string;
    height?: number | string;
    isMacStyle?: boolean;
    isOpen: boolean;
    isMinimized?: boolean;
    iconUrl?: string;
};

// Static Icon URLs from IconArchive for Vista Look
const ICONS = {
    computer: "https://icons.iconarchive.com/icons/icons-land/vista-hardware-devices/128/Computer-icon.png",
    folder: "https://icons.iconarchive.com/icons/yellowicon/vista-themes/128/Folder-icon.png",
    text: "https://icons.iconarchive.com/icons/gakuseisean/ivista-2/128/Files-Text-icon.png",
    terminal: "https://icons.iconarchive.com/icons/icons8/windows-8/128/Programming-Console-icon.png",
    windowsLogo: "https://icons.iconarchive.com/icons/nuno-pinheiro/linspire/48/windows-logo-icon.png"
};

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
                    <div>1 #</div>
                    <div>2 #</div>
                    <div>3 # <span className="text-white text-3xl font-bold tracking-widest pl-4">JUAN</span></div>
                    <div>4 #</div>
                    <div>5 # <span className="text-white text-3xl font-bold tracking-widest pl-4">HUERTA</span></div>
                    <div className="text-center text-xs mt-2 text-white">------ NET SENIOR SOFTWARE DEVELOPER ------</div>
                    <div className="mt-4 flex items-center">
                        <span>C:\\Users\\Mathew&gt; </span>
                        <div className="w-2 h-4 bg-white ml-1 animate-pulse" />
                    </div>
                </div>
            )
        },
        {
            id: 'experience',
            title: 'Experience.txt - Notepad',
            iconUrl: ICONS.text,
            initialX: 150,
            initialY: 300,
            width: 600,
            height: 350,
            isOpen: true,
            component: (
                <div className="w-full h-full bg-white flex flex-col font-sans text-sm text-black">
                    <div className="flex px-2 py-1 bg-[#f0f4f9] border-b border-[#e1eaf5] text-xs">
                        <span className="px-2 hover:bg-[#c2d7f1] cursor-pointer">File</span>
                        <span className="px-2 hover:bg-[#c2d7f1] cursor-pointer">Edit</span>
                        <span className="px-2 hover:bg-[#c2d7f1] cursor-pointer">Format</span>
                        <span className="px-2 hover:bg-[#c2d7f1] cursor-pointer">View</span>
                        <span className="px-2 hover:bg-[#c2d7f1] cursor-pointer">Help</span>
                    </div>
                    <div className="flex-1 p-2 font-mono scrollbar-hide overflow-auto whitespace-pre-wrap outline-none" contentEditable suppressContentEditableWarning>
                        {`yeah dudes promise this is windows vista\n\ncheck the fine print in winver :)\n\n-- WORK EXPERIENCE --\nUniversal Postal Union | Senior Software Developer | Oct 2013 - Present\n- Lead Architecture & Development\n- Mentored agile practices\n`}
                    </div>
                </div>
            )
        },
        {
            id: 'skills',
            title: 'Skills',
            iconUrl: ICONS.folder,
            initialX: 250,
            initialY: 150,
            width: 700,
            height: 480,
            isOpen: true,
            component: (
                <div className="w-full h-full bg-[#f0f4f9] flex flex-col font-sans text-sm text-black">
                    {/* Vista Explorer Header */}
                    <div className="flex items-center px-2 py-2 gap-2 bg-[#d7e4f5] border-b border-white">
                        <div className="flex gap-1">
                            <div className="w-8 h-8 rounded-full bg-[#c9daf1] flex items-center justify-center border border-[#abbbe0] cursor-pointer"><span className="opacity-50">⬅</span></div>
                            <div className="w-8 h-8 rounded-full bg-[#c9daf1] flex items-center justify-center border border-[#abbbe0] cursor-pointer"><span className="opacity-50">➡</span></div>
                        </div>
                        <div className="flex-1 flex px-2 py-1 bg-white border border-[#abbbe0] rounded items-center gap-2 shadow-inner">
                            <img src={ICONS.folder} className="w-4 h-4" /> <span>Computer ▸ C: ▸ Users ▸ Mathew ▸ Skills</span>
                        </div>
                        <div className="flex px-2 py-1 bg-white border border-[#abbbe0] rounded items-center gap-2 w-48 shadow-inner">
                            <span className="opacity-50">Search Skills</span>
                        </div>
                    </div>
                    {/* Command bar */}
                    <div className="flex px-3 py-2 bg-[#f0f4f9] border-b border-[#d8e2f1] text-[#1c4b8b] text-xs gap-4">
                        <span className="cursor-pointer hover:underline flex items-center gap-1">Organize ▾</span>
                        <span className="cursor-pointer hover:underline flex items-center gap-1">Views ▾</span>
                        <span className="cursor-pointer hover:underline flex items-center gap-1">Burn</span>
                    </div>

                    {/* Main Content Pane */}
                    <div className="flex flex-1 overflow-hidden bg-white shadow-inner">
                        {/* Sidebar */}
                        <div className="w-48 bg-[#f5f8fc] border-r border-[#d8e2f1] p-3 overflow-y-auto text-sm text-[#1e395b]">
                            <div className="mb-4">
                                <div className="font-semibold mb-1">Favorite Links</div>
                                <div className="pl-4 space-y-1">
                                    <div className="cursor-pointer hover:underline">Documents</div>
                                    <div className="cursor-pointer hover:underline">Pictures</div>
                                    <div className="cursor-pointer hover:underline">Music</div>
                                    <div className="cursor-pointer hover:underline">Recently Changed</div>
                                    <div className="cursor-pointer hover:underline">Searches</div>
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold mb-1">Folders</div>
                                <div className="pl-4">
                                    <div className="cursor-pointer hover:underline font-semibold">Desktop</div>
                                    <div className="pl-4 text-[#333]">Mathew</div>
                                </div>
                            </div>
                        </div>
                        {/* Right Content */}
                        <div className="flex-1 bg-white p-6 overflow-y-auto w-full">
                            <div className="grid grid-cols-4 gap-6">
                                <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-[#d8eaf9] border border-transparent hover:border-[#a0cbf1] p-2 rounded">
                                    <img src={ICONS.folder} className="w-12 h-12 drop-shadow" />
                                    <span className="text-center text-xs truncate w-full">Program Files</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-[#d8eaf9] border border-transparent hover:border-[#a0cbf1] p-2 rounded">
                                    <img src={ICONS.folder} className="w-12 h-12 drop-shadow" />
                                    <span className="text-center text-xs truncate w-full">Windows</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-[#d8eaf9] border border-transparent hover:border-[#a0cbf1] p-2 rounded">
                                    <img src={ICONS.text} className="w-12 h-12 drop-shadow" />
                                    <span className="text-center text-xs truncate w-full">autoexec.bat</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 cursor-pointer hover:bg-[#d8eaf9] border border-transparent hover:border-[#a0cbf1] p-2 rounded">
                                    <img src={ICONS.text} className="w-12 h-12 drop-shadow" />
                                    <span className="text-center text-xs truncate w-full">Experience.txt</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Details Pane */}
                    <div className="h-12 bg-[#accbee] border-t border-white shadow-inner flex items-center px-4 text-[#1c4b8b] text-xs">
                        <img src={ICONS.folder} className="w-8 h-8 mr-4 opacity-80" />
                        <div>
                            <div className="font-bold text-[14px]">Skills</div>
                            <div>File Folder</div>
                        </div>
                    </div>
                </div>
            )
        }
    ]);

    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [zIndexes, setZIndexes] = useState<{ [key: string]: number }>({});
    const [nextZIndex, setNextZIndex] = useState(10);
    const [time, setTime] = useState<string>('');

    useEffect(() => {
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

    const bringToFront = (id: string) => {
        setActiveWindowId(id);
        setZIndexes(prev => ({
            ...prev,
            [id]: nextZIndex
        }));
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
    };

    return (
        <div className="relative w-full h-screen overflow-hidden text-black font-sans bg-[#0c1f38]">
            {/* Background */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/windowsxpwallper.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />

            {/* Desktop Icons */}
            <div className="absolute top-6 left-4 flex flex-col gap-6 z-0">
                <div
                    className="flex flex-col items-center w-24 cursor-pointer group"
                    onDoubleClick={() => openFromDesktop('skills')}
                >
                    <img src={ICONS.computer} className="w-12 h-12 mb-1 drop-shadow-md group-hover:brightness-110 opacity-90 group-hover:opacity-100" />
                    <div className="text-white text-xs text-center drop-shadow-md group-hover:bg-[#2080d0] px-1 rounded border border-transparent group-hover:border-[#a0cbf1] max-w-full" style={{ textShadow: "1px 1px 2px black" }}>
                        Computer
                    </div>
                </div>

                <div
                    className="flex flex-col items-center w-24 cursor-pointer group"
                >
                    <img src={ICONS.folder} className="w-12 h-12 mb-1 drop-shadow-md group-hover:brightness-110 opacity-90 group-hover:opacity-100" />
                    <div className="text-white text-xs text-center drop-shadow-md group-hover:bg-[#2080d0] px-1 rounded border border-transparent group-hover:border-[#a0cbf1] max-w-full" style={{ textShadow: "1px 1px 2px black" }}>
                        User's Files
                    </div>
                </div>

                <div
                    className="flex flex-col items-center w-24 cursor-pointer group"
                    onDoubleClick={() => openFromDesktop('experience')}
                >
                    <img src={ICONS.text} className="w-12 h-12 mb-1 drop-shadow-md group-hover:brightness-110 opacity-90 group-hover:opacity-100" />
                    <div className="text-white text-xs text-center drop-shadow-md group-hover:bg-[#2080d0] px-1 rounded border border-transparent group-hover:border-[#a0cbf1] max-w-full" style={{ textShadow: "1px 1px 2px black" }}>
                        Experience.txt
                    </div>
                </div>
            </div>

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

            {/* Vista Taskbar */}
            <div className="absolute bottom-0 left-0 right-0 h-[40px] vista-taskbar flex items-center justify-between z-50 select-none px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.5)]">

                <div className="flex h-full items-center gap-2 flex-1">
                    {/* Start Orb */}
                    <div className="vista-start-orb shadow-[1px_1px_5px_rgba(0,0,0,0.8)]">
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
                                    <img src={win.iconUrl || ICONS.folder} className="w-5 h-5 drop-shadow" />
                                    <span className="truncate text-xs text-white">{win.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* System Tray */}
                <div className="flex items-center gap-3 text-white text-xs h-[75%] px-3 border-l border-white/20">
                    <div className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100">
                        <span title="Network">💻</span>
                        <span title="Volume">🔊</span>
                    </div>
                    <span className="font-sans ml-1 text-xs">{time}</span>
                </div>
            </div>
        </div>
    );
}
