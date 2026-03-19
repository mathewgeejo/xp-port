"use client";

import React, { useState, useEffect } from 'react';
import Window from './Window';
import { ComputerIcon, FolderIcon, TextIcon, TerminalIcon, LogoIcon } from './XPIcons';

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
    icon?: React.ReactNode;
};

export default function DesktopWorkspace() {
    const [windows, setWindows] = useState<WindowData[]>([
        {
            id: 'terminal',
            title: 'me@info:~',
            icon: <TerminalIcon />,
            initialX: 380,
            initialY: 80,
            width: 450,
            height: 250,
            isOpen: false,
            component: (
                <div className="w-full h-full bg-black text-[#00ff00] p-4 font-mono text-sm overflow-auto">
                    <div>Microsoft Windows XP [Version 5.1.2600]</div>
                    <div>(C) Copyright 1985-2001 Microsoft Corp.</div>
                    <br />
                    <div>1 #</div>
                    <div>2 #</div>
                    <div>3 # <span className="text-white text-3xl font-bold tracking-widest pl-4">JUAN</span></div>
                    <div>4 #</div>
                    <div>5 # <span className="text-white text-3xl font-bold tracking-widest pl-4">HUERTA</span></div>
                    <div className="text-center text-xs mt-2 text-white">------ NET SENIOR SOFTWARE DEVELOPER ------</div>
                    <div className="mt-4 flex items-center">
                        <span>C:\Documents and Settings\Mathew&gt; </span>
                        <div className="w-2 h-4 bg-white ml-1 animate-pulse" />
                    </div>
                </div>
            )
        },
        {
            id: 'experience',
            title: '*New Text Document.txt - Notepad',
            icon: <TextIcon />,
            initialX: 150,
            initialY: 300,
            width: 600,
            height: 300,
            isOpen: true,
            component: (
                <div className="w-full h-full bg-white flex flex-col font-sans text-sm text-black border border-white border-b-gray-400">
                    <div className="flex px-2 py-1 bg-[#efebe7] border-b border-[#d4d0c8] text-xs">
                        <span className="px-2 hover:bg-blue-500 hover:text-white cursor-pointer">File</span>
                        <span className="px-2 hover:bg-blue-500 hover:text-white cursor-pointer">Edit</span>
                        <span className="px-2 hover:bg-blue-500 hover:text-white cursor-pointer">Format</span>
                        <span className="px-2 hover:bg-blue-500 hover:text-white cursor-pointer">View</span>
                        <span className="px-2 hover:bg-blue-500 hover:text-white cursor-pointer">Help</span>
                    </div>
                    <div className="flex-1 p-2 font-mono scrollbar-hide overflow-auto whitespace-pre-wrap outline-none border-t border-gray-400" contentEditable suppressContentEditableWarning>
                        {`yeah dudes promise this is windows 10\n\ncheck the fine print in winver :)\n\n-- WORK EXPERIENCE --\nUniversal Postal Union | Senior Software Developer | Oct 2013 - Present\n- Lead Architecture & Development\n- Mentored agile practices\n`}
                    </div>
                </div>
            )
        },
        {
            id: 'skills',
            title: 'C:\\',
            icon: <ComputerIcon />,
            initialX: 250,
            initialY: 150,
            width: 700,
            height: 480,
            isOpen: true,
            component: (
                <div className="w-full h-full bg-[#efebe7] flex flex-col font-sans text-sm text-black border border-white">
                    {/* Menu Bar */}
                    <div className="flex px-2 py-[2px] border-b border-[#d4d0c8]">
                        <span className="px-2 hover:bg-blue-500 hover:text-white cursor-pointer select-none">File</span>
                        <span className="px-2 hover:bg-blue-500 hover:text-white cursor-pointer select-none">Edit</span>
                        <span className="px-2 hover:bg-blue-500 hover:text-white cursor-pointer select-none">View</span>
                        <span className="px-2 hover:bg-blue-500 hover:text-white cursor-pointer select-none">Favorites</span>
                        <span className="px-2 hover:bg-blue-500 hover:text-white cursor-pointer select-none">Tools</span>
                        <span className="px-2 hover:bg-blue-500 hover:text-white cursor-pointer select-none">Help</span>
                    </div>
                    {/* Toolbar */}
                    <div className="flex items-center px-2 py-1 gap-4 border-b border-[#d4d0c8] bg-[#efebe7]">
                        <div className="flex items-center gap-1 text-gray-500 cursor-pointer hover:border-gray-400 border border-transparent px-1"><span className="text-xl grayscale opacity-60">⬅️</span> Back</div>
                        <div className="flex items-center gap-1 text-gray-500 cursor-pointer hover:border-gray-400 border border-transparent px-1"><span className="text-xl grayscale opacity-60">➡️</span></div>
                        <div className="flex items-center gap-1 text-black cursor-pointer hover:border-gray-400 border border-transparent px-1"><span className="text-xl">⬆️</span></div>
                        <div className="w-[1px] h-6 bg-gray-300"></div>
                        <div className="flex items-center gap-1 cursor-pointer hover:border-gray-400 border border-transparent px-1"><span className="text-lg">🔍</span> Search</div>
                        <div className="flex items-center gap-1 cursor-pointer bg-gray-200 border border-gray-400 px-1"><span className="text-lg">🗂️</span> Folders</div>
                    </div>
                    {/* Address bar */}
                    <div className="flex items-center px-2 py-1 bg-[#efebe7] border-b border-[#d4d0c8] gap-2">
                        <span className="text-gray-500">Address</span>
                        <div className="flex-1 bg-white border border-[#7f9db9] px-2 py-[2px] flex items-center gap-1 shadow-inner">
                            <ComputerIcon className="w-4 h-4" /> <span className="text-xs">C:\</span>
                        </div>
                    </div>
                    {/* Main Content Pane */}
                    <div className="flex flex-1 overflow-hidden border-t border-gray-400">
                        {/* Sidebar */}
                        <div className="w-56 bg-gradient-to-b from-[#7ba1e7] to-[#638ce0] border-r border-[#638ce0] p-3 overflow-y-auto">
                            <div className="bg-white rounded-t border border-[#ffffff] overflow-hidden mb-3">
                                <div className="bg-gradient-to-r from-[#f1f4fb] to-[#d3def5] px-3 py-1 font-bold text-[#0c327d] cursor-pointer hover:brightness-110">
                                    File and Folder Tasks
                                </div>
                                <div className="p-3 text-[#0c327d] space-y-2">
                                    <div className="hover:underline cursor-pointer flex items-center gap-2"><FolderIcon className="w-4 h-4" /> Rename this folder</div>
                                    <div className="hover:underline cursor-pointer flex items-center gap-2"><FolderIcon className="w-4 h-4" /> Move this folder</div>
                                    <div className="hover:underline cursor-pointer flex items-center gap-2"><FolderIcon className="w-4 h-4" /> Copy this folder</div>
                                </div>
                            </div>
                        </div>
                        {/* Right Content */}
                        <div className="flex-1 bg-white p-4 overflow-y-auto w-full shadow-inner">
                            <div className="grid grid-cols-3 gap-8">
                                <div className="flex items-center gap-2 cursor-pointer hover:bg-[#316ac5] hover:text-white p-1 rounded group">
                                    <FolderIcon className="w-8 h-8 group-hover:brightness-110" />
                                    <span className="truncate">Program Files</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer hover:bg-[#316ac5] hover:text-white p-1 rounded group">
                                    <FolderIcon className="w-8 h-8 group-hover:brightness-110" />
                                    <span className="truncate">Windows</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer hover:bg-[#316ac5] hover:text-white p-1 rounded group">
                                    <TextIcon className="w-8 h-8 group-hover:brightness-110" />
                                    <span className="truncate">autoexec.bat</span>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer hover:bg-[#316ac5] hover:text-white p-1 rounded group">
                                    <TextIcon className="w-8 h-8 group-hover:brightness-110" />
                                    <span className="truncate">Experience.txt</span>
                                </div>
                            </div>
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
        <div className="relative w-full h-screen overflow-hidden text-black font-sans bg-[#2a6db7]">
            {/* Background */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/windowsxpwallper.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />

            {/* Desktop Icons */}
            <div className="absolute top-6 left-4 flex flex-col gap-6 z-0">
                {windows.map(win => (
                    <div
                        key={`icon-${win.id}`}
                        className="flex flex-col items-center w-20 cursor-pointer group"
                        onDoubleClick={() => openFromDesktop(win.id)}
                    >
                        <div className="mb-1 drop-shadow-md group-hover:drop-shadow-lg opacity-90 group-hover:opacity-100 flex items-center justify-center">
                            {win.icon || <TextIcon className="w-10 h-10" />}
                        </div>
                        <div className="text-white text-xs text-center drop-shadow-md group-hover:bg-[#0b5be8] px-1 rounded truncate w-full" style={{ textShadow: "1px 1px 2px black" }}>
                            {win.title.replace('C:\\', 'My Computer').replace('*New Text Document.txt - Notepad', 'Experience.txt')}
                        </div>
                    </div>
                ))}

                {/* Additional Desktop Icons */}
                <div className="flex flex-col items-center w-20 cursor-pointer group">
                    <div className="mb-1 drop-shadow-md group-hover:drop-shadow-lg opacity-90 group-hover:opacity-100 flex items-center justify-center">
                        <FolderIcon className="w-10 h-10" />
                    </div>
                    <div className="text-white text-xs text-center drop-shadow-md group-hover:bg-[#0b5be8] px-1 rounded truncate w-full" style={{ textShadow: "1px 1px 2px black" }}>
                        My Documents
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

            {/* XP Taskbar */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[30px] flex items-center justify-between z-50 select-none"
                style={{
                    background: "linear-gradient(to bottom, #245edb 0%, #3f8cf3 9%, #245edb 18%, #245edb 92%, #1941a5 100%)",
                    borderTop: "1px solid #0f2c80"
                }}
            >
                <div className="flex flex-1 h-full items-center pl-[2px]">
                    {/* Start Button */}
                    <div
                        className="h-[100%] italic text-xl shadow-lg hover:brightness-110 active:brightness-90 flex items-center justify-center gap-1 cursor-pointer pr-4 pl-2"
                        style={{
                            background: "linear-gradient(to bottom, #43a444 0%, #308630 100%)",
                            boxShadow: "inset 0px 2px 2px rgba(255, 255, 255, 0.4), 2px 0px 3px rgba(0,0,0,0.5)",
                            borderRadius: "0 12px 12px 0",
                            color: "white",
                            fontWeight: "bold",
                            textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
                            borderRight: "1px solid #164627"
                        }}
                    >
                        <LogoIcon className="w-5 h-5 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]" />
                        <span className="text-[14px] leading-none mb-[2px]">start</span>
                    </div>

                    {/* Window Tabs */}
                    <div className="flex-1 flex gap-1 px-3 h-[85%] overflow-hidden items-center">
                        {windows.filter(w => w.isOpen).map(win => {
                            const isActive = activeWindowId === win.id && !win.isMinimized;
                            return (
                                <button
                                    key={`taskbar-${win.id}`}
                                    onClick={() => toggleWindow(win.id)}
                                    className={`h-full min-w-[120px] max-w-[160px] px-2 text-left text-xs truncate flex items-center gap-2 text-white overflow-hidden rounded-sm ${isActive ? 'active' : ''}`}
                                    style={{
                                        background: isActive ? "linear-gradient(to bottom, #1b4ea8 0%, #2665ce 100%)" : "linear-gradient(to bottom, #3780e5 0%, #3376d4 100%)",
                                        boxShadow: isActive ? "inset 2px 2px 4px rgba(0,0,0,0.5)" : "inset 1px 1px 1px rgba(255,255,255,0.3)",
                                        border: isActive ? "1px solid #143e8c" : "1px solid #2358b5"
                                    }}
                                >
                                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                                        {win.icon || (win.id === 'experience' ? <TextIcon className="w-4 h-4" /> :
                                            win.id === 'skills' ? <ComputerIcon className="w-4 h-4" /> :
                                                <FolderIcon className="w-4 h-4" />)}
                                    </div>
                                    <span className="truncate leading-none pt-[2px]">{win.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* System Tray */}
                <div
                    className="h-full px-4 flex items-center gap-3 text-white text-xs border-l border-[#1c52b2]"
                    style={{
                        background: "linear-gradient(to bottom, #128ce8 0%, #0d9ff4 40%, #1783cf 80%, #0c4ea4 100%)",
                        boxShadow: "inset 1px 0px 1px rgba(255,255,255,0.4)"
                    }}
                >
                    <div className="flex items-center gap-2 cursor-pointer">
                        <span title="Windows Security" className="bg-red-500 rounded-full w-3 h-3 flex items-center justify-center text-[8px] border border-white">!</span>
                        <span title="Volume">🔊</span>
                    </div>
                    <span className="font-sans ml-1 text-[11px] pt-[1px]">{time}</span>
                </div>
            </div>
        </div>
    );
}
