"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFS } from '../contexts/FileSystemContext';
import type { FSNode } from '../hooks/useFileSystem';

const ICONS_MAP: Record<string, string> = {
    directory: '/icons/floppy.png',
    file: '/icons/floppy.png',
    exe: '/icons/gear.png',
    txt: '/icons/floppy.png',
    md: '/icons/floppy.png',
    lnk: '/icons/floppy.png',
    log: '/icons/floppy.png',
    dat: '/icons/gear.png',
    default: '/icons/floppy.png',
    computer: '/icons/monitor.png',
    desktop: '/icons/monitor.png',
};

function getIconForNode(node: FSNode): string {
    if (node.type === 'directory') return ICONS_MAP.directory;
    const ext = node.name.split('.').pop()?.toLowerCase() || '';
    if (node.name.endsWith('.exe')) return ICONS_MAP.exe;
    return ICONS_MAP[ext] || ICONS_MAP.default;
}

function getFileType(node: FSNode): string {
    if (node.type === 'directory') return 'File Folder';
    const ext = node.name.split('.').pop()?.toUpperCase() || '';
    if (node.name.endsWith('.exe')) return 'Application';
    if (node.name.endsWith('.txt')) return 'Text Document';
    if (node.name.endsWith('.md')) return 'Markdown Document';
    if (node.name.endsWith('.lnk')) return 'Shortcut';
    if (node.name.endsWith('.log')) return 'Log File';
    if (node.name.endsWith('.dat')) return 'Data File';
    return `${ext} File`;
}

function formatDate(d: Date): string {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatSize(size: number): string {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileManagerProps {
    initialPath?: string;
}

export default function FileManager({ initialPath = '/home/user' }: FileManagerProps) {
    const fs = useFS();
    const [currentPath, setCurrentPath] = useState(initialPath);
    const [historyStack, setHistoryStack] = useState<string[]>([initialPath]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [viewMode, setViewMode] = useState<'icons' | 'details'>('icons');
    const [sortBy, setSortBy] = useState<'name' | 'size' | 'type' | 'modified'>('name');
    const [sortAsc, setSortAsc] = useState(true);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item?: FSNode } | null>(null);
    const [renamingItem, setRenamingItem] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const [addressBarValue, setAddressBarValue] = useState(initialPath);
    const [addressBarEditing, setAddressBarEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [clipboard, setClipboard] = useState<{ action: 'cut' | 'copy'; path: string } | null>(null);
    const [editingFile, setEditingFile] = useState<{ path: string; content: string } | null>(null);
    const [editModified, setEditModified] = useState(false);
    const [, setTick] = useState(0); // Force re-render trigger

    const contentRef = useRef<HTMLDivElement>(null);

    const forceRefresh = () => setTick(t => t + 1);

    const navigate = useCallback((path: string) => {
        const resolved = fs.resolvePath(path);
        const node = fs.getNode(resolved);
        if (!node || node.type !== 'directory') return;
        setCurrentPath(resolved);
        setAddressBarValue(resolved);
        setSelectedItems(new Set());
        setContextMenu(null);
        setHistoryStack(prev => [...prev.slice(0, historyIndex + 1), resolved]);
        setHistoryIndex(prev => prev + 1);
    }, [fs, historyIndex]);

    const goBack = () => { if (historyIndex > 0) { setHistoryIndex(historyIndex - 1); const p = historyStack[historyIndex - 1]; setCurrentPath(p); setAddressBarValue(p); setSelectedItems(new Set()); } };
    const goForward = () => { if (historyIndex < historyStack.length - 1) { setHistoryIndex(historyIndex + 1); const p = historyStack[historyIndex + 1]; setCurrentPath(p); setAddressBarValue(p); setSelectedItems(new Set()); } };
    const goUp = () => { const parts = currentPath.split('/').filter(Boolean); parts.pop(); const parent = '/' + parts.join('/'); navigate(parent || '/'); };

    const getItems = useCallback((): FSNode[] => {
        const items = fs.listDir(currentPath).filter(i => !i.hidden);
        return items.sort((a, b) => {
            // Directories first
            if (a.type === 'directory' && b.type !== 'directory') return -1;
            if (a.type !== 'directory' && b.type === 'directory') return 1;
            let cmp = 0;
            switch (sortBy) {
                case 'name': cmp = a.name.localeCompare(b.name); break;
                case 'size': cmp = a.size - b.size; break;
                case 'type': cmp = getFileType(a).localeCompare(getFileType(b)); break;
                case 'modified': cmp = a.modified.getTime() - b.modified.getTime(); break;
            }
            return sortAsc ? cmp : -cmp;
        });
    }, [fs, currentPath, sortBy, sortAsc]);

    const handleItemClick = (name: string, e: React.MouseEvent) => {
        setContextMenu(null);
        if (e.ctrlKey) {
            setSelectedItems(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
        } else if (e.shiftKey) {
            const items = getItems();
            const names = items.map(i => i.name);
            const lastSelected = Array.from(selectedItems).pop();
            if (lastSelected) {
                const start = names.indexOf(lastSelected);
                const end = names.indexOf(name);
                const range = names.slice(Math.min(start, end), Math.max(start, end) + 1);
                setSelectedItems(new Set(range));
            }
        } else {
            setSelectedItems(new Set([name]));
        }
    };

    const handleDoubleClick = (item: FSNode) => {
        if (item.type === 'directory') {
            navigate(currentPath + '/' + item.name);
        } else {
            // Open file in editor
            const content = fs.readFile(currentPath + '/' + item.name);
            if (content !== null) {
                setEditingFile({ path: currentPath + '/' + item.name, content });
                setEditModified(false);
            }
        }
    };

    const handleContextMenu = (e: React.MouseEvent, item?: FSNode) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, item });
        if (item) setSelectedItems(new Set([item.name]));
    };

    const handleRename = (oldName: string) => {
        if (renameValue && renameValue !== oldName) {
            fs.mv(currentPath + '/' + oldName, currentPath + '/' + renameValue);
            forceRefresh();
        }
        setRenamingItem(null);
    };

    const handleDelete = (name: string) => {
        fs.rm(currentPath + '/' + name, true, true);
        setShowDeleteConfirm(null);
        setSelectedItems(new Set());
        forceRefresh();
    };

    const handlePaste = () => {
        if (!clipboard) return;
        if (clipboard.action === 'copy') {
            fs.cp(clipboard.path, currentPath, true);
        } else {
            fs.mv(clipboard.path, currentPath + '/' + clipboard.path.split('/').pop()!);
        }
        setClipboard(null);
        forceRefresh();
    };

    const handleNewFolder = () => {
        let name = 'New Folder';
        let i = 1;
        while (fs.getNode(currentPath + '/' + name)) {
            name = `New Folder (${i++})`;
        }
        fs.mkdir(currentPath + '/' + name);
        setRenamingItem(name);
        setRenameValue(name);
        forceRefresh();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'F2' && selectedItems.size === 1) {
            const name = Array.from(selectedItems)[0];
            setRenamingItem(name);
            setRenameValue(name);
        } else if (e.key === 'Delete' && selectedItems.size > 0) {
            setShowDeleteConfirm(Array.from(selectedItems)[0]);
        } else if (e.key === 'a' && e.ctrlKey) {
            e.preventDefault();
            setSelectedItems(new Set(getItems().map(i => i.name)));
        }
    };

    useEffect(() => {
        const handler = () => setContextMenu(null);
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    // File Editor Overlay
    if (editingFile) {
        return (
            <div className="w-full h-full flex flex-col bg-white text-black"
                onKeyDown={(e) => {
                    if (e.key === 's' && e.ctrlKey) {
                        e.preventDefault();
                        fs.writeFile(editingFile.path, editingFile.content);
                        setEditModified(false);
                    } else if (e.key === 'q' && e.ctrlKey) {
                        e.preventDefault();
                        setEditingFile(null);
                    }
                }}
            >
                <div className="bg-[#ece9d8] border-b border-gray-400 px-2 py-1 flex justify-between text-xs" style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }}>
                    <span>{editingFile.path.split('/').pop()}{editModified ? ' *' : ''}</span>
                    <div className="flex gap-3">
                        <button onClick={() => { fs.writeFile(editingFile.path, editingFile.content); setEditModified(false); }} className="hover:underline">Save</button>
                        <button onClick={() => setEditingFile(null)} className="hover:underline">Close</button>
                    </div>
                </div>
                <textarea
                    className="flex-1 p-2 font-mono text-sm resize-none outline-none border-none"
                    value={editingFile.content}
                    onChange={(e) => { setEditingFile({ ...editingFile, content: e.target.value }); setEditModified(true); }}
                    autoFocus
                    spellCheck={false}
                />
            </div>
        );
    }

    const items = getItems();

    return (
        <div className="w-full h-full flex flex-col bg-white text-black select-none" style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }} onKeyDown={handleKeyDown} tabIndex={0}>
            {/* Toolbar */}
            <div className="bg-[#ece9d8] border-b border-gray-400 px-1 py-1 flex items-center gap-1">
                <button onClick={goBack} disabled={historyIndex <= 0} className="px-2 py-[2px] bg-[#ece9d8] border border-gray-400 rounded-sm disabled:opacity-40 hover:bg-[#ddd] active:bg-[#ccc]" title="Back">Back</button>
                <button onClick={goForward} disabled={historyIndex >= historyStack.length - 1} className="px-2 py-[2px] bg-[#ece9d8] border border-gray-400 rounded-sm disabled:opacity-40 hover:bg-[#ddd] active:bg-[#ccc]" title="Forward">Fwd</button>
                <button onClick={goUp} className="px-2 py-[2px] bg-[#ece9d8] border border-gray-400 rounded-sm hover:bg-[#ddd] active:bg-[#ccc]" title="Up">Up</button>
                <div className="border-l border-gray-400 h-4 mx-1" />
                <button onClick={() => setViewMode(viewMode === 'icons' ? 'details' : 'icons')} className="px-2 py-[2px] bg-[#ece9d8] border border-gray-400 rounded-sm hover:bg-[#ddd]">
                    {viewMode === 'icons' ? 'Details' : 'Icons'}
                </button>
            </div>

            {/* Address Bar */}
            <div className="bg-[#ece9d8] border-b border-gray-400 px-2 py-1 flex items-center gap-2">
                <span className="text-xs text-gray-600">Address</span>
                {addressBarEditing ? (
                    <input
                        className="flex-1 px-1 py-[1px] border border-blue-500 text-xs outline-none"
                        value={addressBarValue}
                        onChange={(e) => setAddressBarValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') { navigate(addressBarValue); setAddressBarEditing(false); }
                            if (e.key === 'Escape') { setAddressBarValue(currentPath); setAddressBarEditing(false); }
                        }}
                        onBlur={() => { setAddressBarValue(currentPath); setAddressBarEditing(false); }}
                        autoFocus
                    />
                ) : (
                    <div className="flex-1 px-1 py-[1px] bg-white border border-gray-400 cursor-text shadow-inner flex items-center gap-1" onClick={() => { setAddressBarEditing(true); setAddressBarValue(currentPath); }}>
                        <img src={ICONS_MAP.directory} className="w-3 h-3" alt="" />
                        {currentPath.split('/').filter(Boolean).map((seg, i, arr) => (
                            <span key={i}>
                                <span
                                    className="hover:underline hover:text-blue-600 cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(); navigate('/' + arr.slice(0, i + 1).join('/')); }}
                                >{seg}</span>
                                {i < arr.length - 1 && <span className="mx-[2px] text-gray-400">{' > '}</span>}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-44 bg-gradient-to-b from-[#7da2ce] to-[#4e7cb5] border-r border-gray-400 p-2 overflow-y-auto text-white text-xs flex flex-col gap-3">
                    {/* File and Folder Tasks */}
                    <div>
                        <div className="font-bold mb-1 border-b border-white/30 pb-1">File and Folder Tasks</div>
                        <div className="space-y-1 pl-1">
                            <div className="cursor-pointer hover:underline" onClick={handleNewFolder}>Make a new folder</div>
                            {selectedItems.size > 0 && (
                                <>
                                    <div className="cursor-pointer hover:underline" onClick={() => {
                                        const name = Array.from(selectedItems)[0];
                                        setRenamingItem(name);
                                        setRenameValue(name);
                                    }}>Rename this item</div>
                                    <div className="cursor-pointer hover:underline" onClick={() => setShowDeleteConfirm(Array.from(selectedItems)[0])}>Delete this item</div>
                                    <div className="cursor-pointer hover:underline" onClick={() => {
                                        const name = Array.from(selectedItems)[0];
                                        setClipboard({ action: 'copy', path: currentPath + '/' + name });
                                    }}>Copy this item</div>
                                </>
                            )}
                            {clipboard && (
                                <div className="cursor-pointer hover:underline" onClick={handlePaste}>Paste</div>
                            )}
                        </div>
                    </div>
                    {/* Other Places */}
                    <div>
                        <div className="font-bold mb-1 border-b border-white/30 pb-1">Other Places</div>
                        <div className="space-y-1 pl-1">
                            <div className="cursor-pointer hover:underline" onClick={() => navigate('/home/user/Desktop')}>Desktop</div>
                            <div className="cursor-pointer hover:underline" onClick={() => navigate('/home/user/Documents')}>My Documents</div>
                            <div className="cursor-pointer hover:underline" onClick={() => navigate('/C:')}>My Computer</div>
                            <div className="cursor-pointer hover:underline" onClick={() => navigate('/home/user')}>Home</div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div
                    ref={contentRef}
                    className="flex-1 bg-white overflow-auto p-2"
                    onContextMenu={(e) => handleContextMenu(e)}
                    onClick={() => setSelectedItems(new Set())}
                >
                    {viewMode === 'icons' ? (
                        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
                            {items.map(item => (
                                <div
                                    key={item.name}
                                    className={`flex flex-col items-center p-1 rounded cursor-pointer border ${selectedItems.has(item.name) ? 'bg-[#316ac5] border-[#316ac5] text-white' : 'border-transparent hover:bg-[#e8f0fa] hover:border-[#c0d8f0]'}`}
                                    onClick={(e) => { e.stopPropagation(); handleItemClick(item.name, e); }}
                                    onDoubleClick={() => handleDoubleClick(item)}
                                    onContextMenu={(e) => { e.stopPropagation(); handleContextMenu(e, item); }}
                                >
                                    <img src={getIconForNode(item)} className="w-8 h-8 mb-1" alt="" draggable={false} />
                                    {renamingItem === item.name ? (
                                        <input
                                            className="text-center text-[10px] w-full border border-blue-500 outline-none bg-white text-black px-1"
                                            value={renameValue}
                                            onChange={(e) => setRenameValue(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleRename(item.name); if (e.key === 'Escape') setRenamingItem(null); }}
                                            onBlur={() => handleRename(item.name)}
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <span className="text-center text-[10px] truncate w-full">{item.name}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-[#ece9d8] border-b border-gray-300">
                                    {(['name', 'size', 'type', 'modified'] as const).map(col => (
                                        <th
                                            key={col}
                                            className="text-left px-2 py-1 cursor-pointer hover:bg-[#ddd] border-r border-gray-300 font-normal select-none"
                                            onClick={() => { if (sortBy === col) setSortAsc(!sortAsc); else { setSortBy(col); setSortAsc(true); } }}
                                        >
                                            {col.charAt(0).toUpperCase() + col.slice(1)} {sortBy === col ? (sortAsc ? 'v' : '^') : ''}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr
                                        key={item.name}
                                        className={`cursor-pointer border-b border-gray-100 ${selectedItems.has(item.name) ? 'bg-[#316ac5] text-white' : 'hover:bg-[#e8f0fa]'}`}
                                        onClick={(e) => handleItemClick(item.name, e)}
                                        onDoubleClick={() => handleDoubleClick(item)}
                                        onContextMenu={(e) => { e.stopPropagation(); handleContextMenu(e, item); }}
                                    >
                                        <td className="px-2 py-[2px] flex items-center gap-1">
                                            <img src={getIconForNode(item)} className="w-4 h-4 inline" alt="" />
                                            {renamingItem === item.name ? (
                                                <input className="border border-blue-500 outline-none px-1 text-black" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleRename(item.name); if (e.key === 'Escape') setRenamingItem(null); }} onBlur={() => handleRename(item.name)} autoFocus onClick={(e) => e.stopPropagation()} />
                                            ) : item.name}
                                        </td>
                                        <td className="px-2 py-[2px]">{item.type === 'directory' ? '' : formatSize(item.size)}</td>
                                        <td className="px-2 py-[2px]">{getFileType(item)}</td>
                                        <td className="px-2 py-[2px]">{formatDate(item.modified)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Status Bar */}
            <div className="bg-[#ece9d8] border-t border-gray-400 px-3 py-[2px] text-xs text-gray-600">
                {selectedItems.size > 0
                    ? `${selectedItems.size} item(s) selected`
                    : `${items.length} object(s)`
                }
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed bg-white border border-gray-400 shadow-md py-1 z-[9999]"
                    style={{ left: contextMenu.x, top: contextMenu.y, fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {contextMenu.item ? (
                        <>
                            <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { if (contextMenu.item) handleDoubleClick(contextMenu.item); setContextMenu(null); }}>Open</div>
                            <div className="border-t border-gray-200 my-[2px]" />
                            <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { setClipboard({ action: 'cut', path: currentPath + '/' + contextMenu.item!.name }); setContextMenu(null); }}>Cut</div>
                            <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { setClipboard({ action: 'copy', path: currentPath + '/' + contextMenu.item!.name }); setContextMenu(null); }}>Copy</div>
                            {clipboard && <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { handlePaste(); setContextMenu(null); }}>Paste</div>}
                            <div className="border-t border-gray-200 my-[2px]" />
                            <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { setShowDeleteConfirm(contextMenu.item!.name); setContextMenu(null); }}>Delete</div>
                            <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { setRenamingItem(contextMenu.item!.name); setRenameValue(contextMenu.item!.name); setContextMenu(null); }}>Rename</div>
                            <div className="border-t border-gray-200 my-[2px]" />
                            <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => setContextMenu(null)}>Properties</div>
                        </>
                    ) : (
                        <>
                            <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { setViewMode(viewMode === 'icons' ? 'details' : 'icons'); setContextMenu(null); }}>View: {viewMode === 'icons' ? 'Details' : 'Large Icons'}</div>
                            <div className="border-t border-gray-200 my-[2px]" />
                            {clipboard && <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { handlePaste(); setContextMenu(null); }}>Paste</div>}
                            <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { handleNewFolder(); setContextMenu(null); }}>New Folder</div>
                        </>
                    )}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center z-[9999]" onClick={() => setShowDeleteConfirm(null)}>
                    <div className="bg-[#ece9d8] border-2 border-[#0054e3] rounded shadow-lg p-4 w-80" style={{ fontFamily: 'Tahoma, sans-serif' }} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start gap-3 mb-4">
                            <div className="text-3xl text-yellow-600">?</div>
                            <div className="text-xs">Are you sure you want to send '{showDeleteConfirm}' to the Recycle Bin?</div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => handleDelete(showDeleteConfirm)}>Yes</button>
                            <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => setShowDeleteConfirm(null)}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
