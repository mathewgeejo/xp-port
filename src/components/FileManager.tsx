"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useFS } from '../contexts/FileSystemContext';
import type { FSNode } from '../hooks/useFileSystem';

// Icon mapping by extension
function getIcon(node: FSNode): string {
    if (node.type === 'directory') return '/icons/floppy.png';
    const ext = node.name.split('.').pop()?.toLowerCase() || '';
    if (node.name.endsWith('.exe')) return '/icons/gear.png';
    return '/icons/floppy.png';
}

function getTypeName(node: FSNode): string {
    if (node.type === 'directory') return 'File Folder';
    const ext = node.name.split('.').pop()?.toLowerCase() || '';
    const types: Record<string, string> = {
        txt: 'Text Document', rtf: 'Rich Text Document', md: 'Markdown Document',
        py: 'Python File', js: 'JavaScript File', ts: 'TypeScript File',
        jsx: 'JSX File', tsx: 'TSX File', json: 'JSON File',
        html: 'HTML Document', css: 'CSS Stylesheet',
        bat: 'Batch File', sh: 'Shell Script',
        exe: 'Application', lnk: 'Shortcut',
        png: 'PNG Image', jpg: 'JPEG Image', gif: 'GIF Image',
        pdf: 'PDF Document', zip: 'ZIP Archive',
        log: 'Log File', dat: 'Data File',
    };
    return types[ext] || `${ext.toUpperCase()} File`;
}

function fmtDate(d: Date): string {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function fmtSize(s: number): string {
    if (s < 1024) return `${s} B`;
    if (s < 1048576) return `${(s / 1024).toFixed(1)} KB`;
    return `${(s / 1048576).toFixed(1)} MB`;
}

interface FileManagerProps { initialPath?: string; }

// Sidebar folder tree component
function FolderTree({ fs, currentPath, onNavigate, dragOverPath, onDrop }: {
    fs: ReturnType<typeof useFS>; currentPath: string;
    onNavigate: (p: string) => void;
    dragOverPath: string | null;
    onDrop: (targetPath: string) => void;
}) {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(['/', '/home', '/home/user', '/C:', '/C:/Users', '/C:/Users/Mathew']));

    const toggle = (path: string) => {
        setExpanded(prev => {
            const n = new Set(prev);
            n.has(path) ? n.delete(path) : n.add(path);
            return n;
        });
    };

    const renderNode = (node: FSNode, path: string, depth: number): React.ReactNode => {
        if (node.type !== 'directory' || node.hidden) return null;
        const isExpanded = expanded.has(path);
        const isCurrent = currentPath === path;
        const isDragOver = dragOverPath === path;
        const children = node.children ? Array.from(node.children.values()).filter(c => c.type === 'directory' && !c.hidden).sort((a, b) => a.name.localeCompare(b.name)) : [];

        return (
            <div key={path}>
                <div
                    className={`flex items-center gap-1 py-[1px] px-1 cursor-pointer text-xs ${isCurrent ? 'bg-[#316ac5] text-white' : isDragOver ? 'bg-[#c0d8f0]' : 'hover:bg-[#e8f0fa]'}`}
                    style={{ paddingLeft: `${depth * 12 + 4}px`, fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }}
                    onClick={() => onNavigate(path)}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onDrop(path); }}
                >
                    {children.length > 0 ? (
                        <span className="w-3 text-[10px] text-gray-500 select-none inline-block text-center" onClick={(e) => { e.stopPropagation(); toggle(path); }}>
                            {isExpanded ? 'v' : '>'}
                        </span>
                    ) : <span className="w-3" />}
                    <img src="/icons/floppy.png" className="w-4 h-4" alt="" />
                    <span className="truncate">{node.name === '/' ? 'Computer' : node.name}</span>
                </div>
                {isExpanded && children.map(child => renderNode(child, path === '/' ? `/${child.name}` : `${path}/${child.name}`, depth + 1))}
            </div>
        );
    };

    const rootNode = fs.getNode('/');
    if (!rootNode) return null;
    return <div className="text-xs overflow-y-auto">{renderNode(rootNode, '/', 0)}</div>;
}

export default function FileManager({ initialPath = '/home/user' }: FileManagerProps) {
    const fs = useFS();
    const [currentPath, setCurrentPath] = useState(initialPath);
    const [histStack, setHistStack] = useState<string[]>([initialPath]);
    const [histIdx, setHistIdx] = useState(0);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [viewMode, setViewMode] = useState<'icons' | 'details'>('icons');
    const [sortBy, setSortBy] = useState<'name' | 'size' | 'type' | 'modified'>('name');
    const [sortAsc, setSortAsc] = useState(true);
    const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; item?: FSNode; showNewSub?: boolean } | null>(null);
    const [renaming, setRenaming] = useState<string | null>(null);
    const [renameVal, setRenameVal] = useState('');
    const [addrEdit, setAddrEdit] = useState(false);
    const [addrVal, setAddrVal] = useState(initialPath);
    const [delConfirm, setDelConfirm] = useState<string | null>(null);
    const [clipboard, setClipboard] = useState<{ action: 'cut' | 'copy'; path: string } | null>(null);
    const [editFile, setEditFile] = useState<{ path: string; content: string } | null>(null);
    const [editMod, setEditMod] = useState(false);
    const [recents, setRecents] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [propsItem, setPropsItem] = useState<{ node: FSNode; path: string } | null>(null);
    const [dragItem, setDragItem] = useState<string | null>(null);
    const [dragOverPath, setDragOverPath] = useState<string | null>(null);
    const [tick, setTick] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    const refresh = useCallback(() => setTick(t => t + 1), []);

    useEffect(() => {
        const unsub = fs.subscribe(() => refresh());
        return unsub;
    }, [fs, refresh]);

    const addRecent = (filePath: string) => {
        setRecents(prev => {
            const filtered = prev.filter(r => r !== filePath);
            return [filePath, ...filtered].slice(0, 10);
        });
    };

    const navigate = useCallback((path: string) => {
        const resolved = fs.resolvePath(path);
        const node = fs.getNode(resolved);
        if (!node || node.type !== 'directory') return;
        setCurrentPath(resolved);
        setAddrVal(resolved);
        setSelected(new Set());
        setCtxMenu(null);
        setHistStack(prev => [...prev.slice(0, histIdx + 1), resolved]);
        setHistIdx(prev => prev + 1);
    }, [fs, histIdx]);

    const goBack = () => { if (histIdx > 0) { const i = histIdx - 1; setHistIdx(i); setCurrentPath(histStack[i]); setAddrVal(histStack[i]); setSelected(new Set()); } };
    const goFwd = () => { if (histIdx < histStack.length - 1) { const i = histIdx + 1; setHistIdx(i); setCurrentPath(histStack[i]); setAddrVal(histStack[i]); setSelected(new Set()); } };
    const goUp = () => { const parts = currentPath.split('/').filter(Boolean); parts.pop(); navigate('/' + parts.join('/') || '/'); };

    const getItems = useCallback((): FSNode[] => {
        const items = fs.listDir(currentPath).filter(i => !i.hidden);
        return items.sort((a, b) => {
            if (a.type === 'directory' && b.type !== 'directory') return -1;
            if (a.type !== 'directory' && b.type === 'directory') return 1;
            let c = 0;
            switch (sortBy) {
                case 'name': c = a.name.localeCompare(b.name); break;
                case 'size': c = a.size - b.size; break;
                case 'type': c = getTypeName(a).localeCompare(getTypeName(b)); break;
                case 'modified': c = a.modified.getTime() - b.modified.getTime(); break;
            }
            return sortAsc ? c : -c;
        });
    }, [fs, currentPath, sortBy, sortAsc, tick]);

    const handleClick = (name: string, e: React.MouseEvent) => {
        setCtxMenu(null);
        if (e.ctrlKey) { setSelected(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; }); }
        else if (e.shiftKey) {
            const items = getItems(); const names = items.map(i => i.name);
            const last = Array.from(selected).pop();
            if (last) { const s = names.indexOf(last); const end = names.indexOf(name); setSelected(new Set(names.slice(Math.min(s, end), Math.max(s, end) + 1))); }
        } else { setSelected(new Set([name])); }
    };

    const handleDblClick = (item: FSNode) => {
        if (item.type === 'directory') { navigate(currentPath + '/' + item.name); }
        else {
            const filePath = currentPath + '/' + item.name;
            if (item.readOnly) { setEditFile({ path: filePath, content: item.content || '[Binary file - cannot edit]' }); setEditMod(false); }
            else { const content = fs.readFile(filePath); if (content !== null) { setEditFile({ path: filePath, content }); setEditMod(false); addRecent(filePath); } }
        }
    };

    const handleCtxMenu = (e: React.MouseEvent, item?: FSNode) => {
        e.preventDefault(); e.stopPropagation();
        setCtxMenu({ x: e.clientX, y: e.clientY, item, showNewSub: false });
        if (item) setSelected(new Set([item.name]));
    };

    const doRename = (oldName: string) => {
        if (renameVal && renameVal !== oldName) { fs.rename(currentPath + '/' + oldName, renameVal); }
        setRenaming(null);
    };

    const doDelete = (name: string) => { fs.rm(currentPath + '/' + name, true, true); setDelConfirm(null); setSelected(new Set()); };

    const doPaste = () => {
        if (!clipboard) return;
        if (clipboard.action === 'copy') fs.cp(clipboard.path, currentPath, true);
        else { fs.mv(clipboard.path, currentPath + '/' + clipboard.path.split('/').pop()!); }
        setClipboard(null);
    };

    const createNew = (ext: string) => {
        const baseName = ext === '' ? 'New Folder' : `New File.${ext}`;
        let name = baseName; let i = 1;
        while (fs.getNode(currentPath + '/' + name)) { name = ext === '' ? `New Folder (${i++})` : `New File (${i++}).${ext}`; }
        if (ext === '') { fs.mkdir(currentPath + '/' + name); }
        else { fs.writeFile(currentPath + '/' + name, ''); }
        setRenaming(name); setRenameVal(name);
        setCtxMenu(null);
    };

    const handleDrop = (targetPath: string) => {
        if (!dragItem) return;
        const srcPath = currentPath + '/' + dragItem;
        if (srcPath !== targetPath) { fs.mv(srcPath, targetPath); addRecent(targetPath + '/' + dragItem); }
        setDragItem(null); setDragOverPath(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'F2' && selected.size === 1) { const name = Array.from(selected)[0]; setRenaming(name); setRenameVal(name); }
        else if (e.key === 'Delete' && selected.size > 0) { setDelConfirm(Array.from(selected)[0]); }
        else if (e.key === 'a' && e.ctrlKey) { e.preventDefault(); setSelected(new Set(getItems().map(i => i.name))); }
    };

    useEffect(() => { const h = (e: MouseEvent) => { const t = e.target as HTMLElement; if (!t.closest('[data-ctx-menu]')) setCtxMenu(null); }; document.addEventListener('click', h); return () => document.removeEventListener('click', h); }, []);

    // === File Editor Overlay ===
    if (editFile) {
        const isReadOnly = fs.getNode(editFile.path)?.readOnly;
        return (
            <div className="w-full h-full flex flex-col bg-white text-black" onKeyDown={(e) => {
                if (e.key === 's' && e.ctrlKey && !isReadOnly) { e.preventDefault(); fs.writeFile(editFile.path, editFile.content); setEditMod(false); }
                else if (e.key === 'q' && e.ctrlKey) { e.preventDefault(); setEditFile(null); }
            }}>
                <div className="bg-[#ece9d8] border-b border-gray-400 px-2 py-1 flex justify-between" style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }}>
                    <span>{editFile.path.split('/').pop()}{editMod ? ' *' : ''}{isReadOnly ? ' [Read-Only]' : ''}</span>
                    <div className="flex gap-3">
                        {!isReadOnly && <button onClick={() => { fs.writeFile(editFile.path, editFile.content); setEditMod(false); }} className="hover:underline">Save</button>}
                        <button onClick={() => setEditFile(null)} className="hover:underline">Close</button>
                    </div>
                </div>
                <textarea className="flex-1 p-2 font-mono text-xs resize-none outline-none border-none" value={editFile.content}
                    onChange={(e) => { if (!isReadOnly) { setEditFile({ ...editFile, content: e.target.value }); setEditMod(true); } }}
                    readOnly={isReadOnly} autoFocus spellCheck={false} />
            </div>
        );
    }

    const items = getItems();
    const selectedSize = items.filter(i => selected.has(i.name)).reduce((sum, i) => sum + i.size, 0);

    return (
        <div className="w-full h-full flex flex-col bg-white text-black select-none" style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }} onKeyDown={handleKeyDown} tabIndex={0}>
            {/* Toolbar */}
            <div className="bg-[#ece9d8] border-b border-gray-400 px-1 py-1 flex items-center gap-1">
                <button onClick={goBack} disabled={histIdx <= 0} className="px-2 py-[2px] bg-[#ece9d8] border border-gray-400 rounded-sm disabled:opacity-40 hover:bg-[#ddd] active:bg-[#ccc] text-xs">Back</button>
                <button onClick={goFwd} disabled={histIdx >= histStack.length - 1} className="px-2 py-[2px] bg-[#ece9d8] border border-gray-400 rounded-sm disabled:opacity-40 hover:bg-[#ddd] active:bg-[#ccc] text-xs">Fwd</button>
                <button onClick={goUp} className="px-2 py-[2px] bg-[#ece9d8] border border-gray-400 rounded-sm hover:bg-[#ddd] active:bg-[#ccc] text-xs">Up</button>
                <div className="border-l border-gray-400 h-4 mx-1" />
                <button onClick={() => setViewMode(viewMode === 'icons' ? 'details' : 'icons')} className="px-2 py-[2px] bg-[#ece9d8] border border-gray-400 rounded-sm hover:bg-[#ddd] text-xs">
                    {viewMode === 'icons' ? 'Details' : 'Icons'}
                </button>
            </div>

            {/* Address Bar */}
            <div className="bg-[#ece9d8] border-b border-gray-400 px-2 py-1 flex items-center gap-2">
                <span className="text-xs text-gray-600">Address</span>
                {addrEdit ? (
                    <input className="flex-1 px-1 py-[1px] border border-blue-500 text-xs outline-none" value={addrVal}
                        onChange={(e) => setAddrVal(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { navigate(addrVal); setAddrEdit(false); } if (e.key === 'Escape') { setAddrVal(currentPath); setAddrEdit(false); } }}
                        onBlur={() => { setAddrVal(currentPath); setAddrEdit(false); }} autoFocus />
                ) : (
                    <div className="flex-1 px-1 py-[1px] bg-white border border-gray-400 cursor-text shadow-inner flex items-center gap-1 overflow-hidden" onClick={() => { setAddrEdit(true); setAddrVal(currentPath); }}>
                        <img src="/icons/floppy.png" className="w-3 h-3 flex-shrink-0" alt="" />
                        {currentPath.split('/').filter(Boolean).map((seg, i, arr) => (
                            <span key={i} className="flex-shrink-0">
                                <span className="hover:underline hover:text-blue-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate('/' + arr.slice(0, i + 1).join('/')); }}>{seg}</span>
                                {i < arr.length - 1 && <span className="mx-[2px] text-gray-400">{' > '}</span>}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Main */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 bg-gradient-to-b from-[#7da2ce] to-[#4e7cb5] border-r border-gray-400 overflow-y-auto text-white flex flex-col text-xs" style={{ fontSize: '11px' }}>
                    {/* Tasks */}
                    <div className="p-2">
                        <div className="font-bold mb-1 border-b border-white/30 pb-1">File and Folder Tasks</div>
                        <div className="space-y-[2px] pl-1">
                            <div className="cursor-pointer hover:underline" onClick={() => createNew('')}>Make a new folder</div>
                            {selected.size > 0 && <>
                                <div className="cursor-pointer hover:underline" onClick={() => { const n = Array.from(selected)[0]; setRenaming(n); setRenameVal(n); }}>Rename this item</div>
                                <div className="cursor-pointer hover:underline" onClick={() => setDelConfirm(Array.from(selected)[0])}>Delete this item</div>
                                <div className="cursor-pointer hover:underline" onClick={() => { setClipboard({ action: 'copy', path: currentPath + '/' + Array.from(selected)[0] }); }}>Copy this item</div>
                            </>}
                            {clipboard && <div className="cursor-pointer hover:underline" onClick={doPaste}>Paste</div>}
                        </div>
                    </div>
                    {/* Other Places */}
                    <div className="p-2 border-t border-white/20">
                        <div className="font-bold mb-1 border-b border-white/30 pb-1">Other Places</div>
                        <div className="space-y-[2px] pl-1">
                            <div className="cursor-pointer hover:underline" onClick={() => navigate('/home/user/Desktop')}>Desktop</div>
                            <div className="cursor-pointer hover:underline" onClick={() => navigate('/home/user/Documents')}>My Documents</div>
                            <div className="cursor-pointer hover:underline" onClick={() => navigate('/C:')}>My Computer</div>
                            <div className="cursor-pointer hover:underline" onClick={() => navigate('/home/user')}>Home</div>
                        </div>
                    </div>
                    {/* Recents */}
                    {recents.length > 0 && (
                        <div className="p-2 border-t border-white/20">
                            <div className="font-bold mb-1 border-b border-white/30 pb-1">Recent</div>
                            <div className="space-y-[2px] pl-1">
                                {recents.map((r, i) => {
                                    const parts = r.split('/'); const fname = parts.pop()!; const parent = parts.join('/');
                                    return <div key={i} className="cursor-pointer hover:underline truncate" onClick={() => { navigate(parent); setSelected(new Set([fname])); }}>{fname}</div>;
                                })}
                            </div>
                        </div>
                    )}
                    {/* Favorites */}
                    {favorites.length > 0 && (
                        <div className="p-2 border-t border-white/20">
                            <div className="font-bold mb-1 border-b border-white/30 pb-1">Favorites</div>
                            <div className="space-y-[2px] pl-1">
                                {favorites.map((f, i) => {
                                    const node = fs.getNode(f);
                                    return <div key={i} className="cursor-pointer hover:underline truncate"
                                        onClick={() => { if (node?.type === 'directory') navigate(f); else { const parts = f.split('/'); const fname = parts.pop()!; navigate(parts.join('/')); setSelected(new Set([fname])); } }}
                                        onContextMenu={(e) => { e.preventDefault(); setFavorites(prev => prev.filter(x => x !== f)); }}
                                    >{f.split('/').pop()}</div>;
                                })}
                            </div>
                        </div>
                    )}
                    {/* Folder Tree */}
                    <div className="p-2 border-t border-white/20 flex-1">
                        <div className="font-bold mb-1 border-b border-white/30 pb-1">Folders</div>
                        <div className="bg-white text-black rounded overflow-y-auto max-h-[200px]">
                            <FolderTree fs={fs} currentPath={currentPath} onNavigate={navigate} dragOverPath={dragOverPath} onDrop={handleDrop} />
                        </div>
                    </div>
                </div>

                {/* Content Panel */}
                <div ref={contentRef} className="flex-1 bg-white overflow-auto p-2"
                    onContextMenu={(e) => handleCtxMenu(e)} onClick={() => setSelected(new Set())}
                    onDragOver={(e) => e.preventDefault()}
                >
                    {viewMode === 'icons' ? (
                        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
                            {items.map(item => (
                                <div key={item.name}
                                    className={`flex flex-col items-center p-1 rounded cursor-pointer border ${selected.has(item.name) ? 'bg-[#316ac5] border-[#316ac5] text-white' : 'border-transparent hover:bg-[#e8f0fa] hover:border-[#c0d8f0]'}`}
                                    onClick={(e) => { e.stopPropagation(); handleClick(item.name, e); }}
                                    onDoubleClick={() => handleDblClick(item)}
                                    onContextMenu={(e) => handleCtxMenu(e, item)}
                                    draggable onDragStart={() => setDragItem(item.name)}
                                    onDragOver={(e) => { if (item.type === 'directory') { e.preventDefault(); setDragOverPath(currentPath + '/' + item.name); } }}
                                    onDragLeave={() => setDragOverPath(null)}
                                    onDrop={(e) => { e.preventDefault(); if (item.type === 'directory') handleDrop(currentPath + '/' + item.name); }}
                                >
                                    <img src={getIcon(item)} className="w-8 h-8 mb-1" alt="" draggable={false} />
                                    {renaming === item.name ? (
                                        <input className="text-center text-[10px] w-full border border-blue-500 outline-none bg-white text-black px-1" value={renameVal}
                                            onChange={(e) => setRenameVal(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') doRename(item.name); if (e.key === 'Escape') setRenaming(null); }}
                                            onBlur={() => doRename(item.name)} autoFocus onClick={(e) => e.stopPropagation()} />
                                    ) : <span className="text-center text-[10px] truncate w-full">{item.name}</span>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-[#ece9d8] border-b border-gray-300">
                                    {(['name', 'size', 'type', 'modified'] as const).map(col => (
                                        <th key={col} className="text-left px-2 py-1 cursor-pointer hover:bg-[#ddd] border-r border-gray-300 font-normal select-none"
                                            onClick={() => { if (sortBy === col) setSortAsc(!sortAsc); else { setSortBy(col); setSortAsc(true); } }}>
                                            {col.charAt(0).toUpperCase() + col.slice(1)} {sortBy === col ? (sortAsc ? 'v' : '^') : ''}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.name}
                                        className={`cursor-pointer border-b border-gray-100 ${selected.has(item.name) ? 'bg-[#316ac5] text-white' : 'hover:bg-[#e8f0fa]'}`}
                                        onClick={(e) => handleClick(item.name, e)} onDoubleClick={() => handleDblClick(item)}
                                        onContextMenu={(e) => handleCtxMenu(e, item)}
                                        draggable onDragStart={() => setDragItem(item.name)}
                                    >
                                        <td className="px-2 py-[2px] flex items-center gap-1">
                                            <img src={getIcon(item)} className="w-4 h-4 inline" alt="" />
                                            {renaming === item.name ? (
                                                <input className="border border-blue-500 outline-none px-1 text-black" value={renameVal} onChange={(e) => setRenameVal(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') doRename(item.name); if (e.key === 'Escape') setRenaming(null); }}
                                                    onBlur={() => doRename(item.name)} autoFocus onClick={(e) => e.stopPropagation()} />
                                            ) : item.name}
                                        </td>
                                        <td className="px-2 py-[2px]">{item.type === 'directory' ? '' : fmtSize(item.size)}</td>
                                        <td className="px-2 py-[2px]">{getTypeName(item)}</td>
                                        <td className="px-2 py-[2px]">{fmtDate(item.modified)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Status Bar */}
            <div className="bg-[#ece9d8] border-t border-gray-400 px-3 py-[2px] text-xs text-gray-600">
                {selected.size > 0 ? `${selected.size} object(s) selected, ${fmtSize(selectedSize)}` : `${items.length} object(s)`}
            </div>

            {/* Context Menu */}
            {ctxMenu && (
                <div data-ctx-menu className="fixed bg-white border border-gray-400 shadow-md py-1 z-[9999]" style={{ left: ctxMenu.x, top: ctxMenu.y, fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }} onClick={(e) => e.stopPropagation()}>
                    {ctxMenu.item ? (<>
                        <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer font-bold" onClick={() => { if (ctxMenu.item) handleDblClick(ctxMenu.item); setCtxMenu(null); }}>Open</div>
                        <div className="border-t border-gray-200 my-[2px]" />
                        <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { setClipboard({ action: 'cut', path: currentPath + '/' + ctxMenu.item!.name }); setCtxMenu(null); }}>Cut</div>
                        <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { setClipboard({ action: 'copy', path: currentPath + '/' + ctxMenu.item!.name }); setCtxMenu(null); }}>Copy</div>
                        {clipboard && <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { doPaste(); setCtxMenu(null); }}>Paste</div>}
                        <div className="border-t border-gray-200 my-[2px]" />
                        <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { setDelConfirm(ctxMenu.item!.name); setCtxMenu(null); }}>Delete</div>
                        <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { setRenaming(ctxMenu.item!.name); setRenameVal(ctxMenu.item!.name); setCtxMenu(null); }}>Rename</div>
                        <div className="border-t border-gray-200 my-[2px]" />
                        <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { setFavorites(prev => [...prev.filter(f => f !== currentPath + '/' + ctxMenu.item!.name), currentPath + '/' + ctxMenu.item!.name]); setCtxMenu(null); }}>Add to Favorites</div>
                        <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { setPropsItem({ node: ctxMenu.item!, path: currentPath + '/' + ctxMenu.item!.name }); setCtxMenu(null); }}>Properties</div>
                    </>) : (<>
                        <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { setViewMode(viewMode === 'icons' ? 'details' : 'icons'); setCtxMenu(null); }}>View: {viewMode === 'icons' ? 'Details' : 'Large Icons'}</div>
                        <div className="border-t border-gray-200 my-[2px]" />
                        {clipboard && <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={() => { doPaste(); setCtxMenu(null); }}>Paste</div>}
                        <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer relative" onClick={() => setCtxMenu(prev => prev ? { ...prev, showNewSub: !prev.showNewSub } : null)}>
                            New &gt;
                            {ctxMenu.showNewSub && (
                                <div className="absolute left-full top-0 bg-white border border-gray-400 shadow-md py-1 z-[10000] w-44">
                                    <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={(e) => { e.stopPropagation(); createNew(''); }}>Folder</div>
                                    <div className="border-t border-gray-200 my-[2px]" />
                                    <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={(e) => { e.stopPropagation(); createNew('txt'); }}>Text Document (.txt)</div>
                                    <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={(e) => { e.stopPropagation(); createNew('md'); }}>Markdown File (.md)</div>
                                    <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={(e) => { e.stopPropagation(); createNew('py'); }}>Python File (.py)</div>
                                    <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={(e) => { e.stopPropagation(); createNew('js'); }}>JavaScript File (.js)</div>
                                    <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={(e) => { e.stopPropagation(); createNew('bat'); }}>Batch File (.bat)</div>
                                    <div className="px-4 py-[2px] hover:bg-[#316ac5] hover:text-white cursor-pointer" onClick={(e) => { e.stopPropagation(); createNew('rtf'); }}>Rich Text (.rtf)</div>
                                </div>
                            )}
                        </div>
                    </>)}
                </div>
            )}

            {/* Delete Confirm */}
            {delConfirm && (
                <div className="fixed inset-0 flex items-center justify-center z-[9999]" onClick={() => setDelConfirm(null)}>
                    <div className="bg-[#ece9d8] border-2 border-[#0054e3] rounded shadow-lg p-4 w-80" style={{ fontFamily: 'Tahoma, sans-serif' }} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start gap-3 mb-4">
                            <div className="text-3xl text-yellow-600 leading-none">?</div>
                            <div className="text-xs">Are you sure you want to send '{delConfirm}' to the Recycle Bin?</div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => doDelete(delConfirm)}>Yes</button>
                            <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => setDelConfirm(null)}>No</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Properties Dialog */}
            {propsItem && (
                <div className="fixed inset-0 flex items-center justify-center z-[9999]" onClick={() => setPropsItem(null)}>
                    <div className="bg-[#ece9d8] border-2 border-[#0054e3] rounded shadow-lg w-72" style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="bg-gradient-to-b from-[#0058e6] to-[#3a93ff] text-white px-3 py-1 rounded-t font-bold text-xs">{propsItem.node.name} Properties</div>
                        <div className="p-4 space-y-2 text-xs">
                            <div className="flex items-center gap-3 border-b border-gray-300 pb-2 mb-2">
                                <img src={getIcon(propsItem.node)} className="w-8 h-8" alt="" />
                                <span className="font-bold">{propsItem.node.name}</span>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-1">
                                <span className="text-gray-600">Type:</span><span>{getTypeName(propsItem.node)}</span>
                                <span className="text-gray-600">Location:</span><span className="truncate">{propsItem.path.split('/').slice(0, -1).join('/')}</span>
                                <span className="text-gray-600">Size:</span><span>{fmtSize(propsItem.node.size)}</span>
                                <span className="text-gray-600">Created:</span><span>{fmtDate(propsItem.node.created)}</span>
                                <span className="text-gray-600">Modified:</span><span>{fmtDate(propsItem.node.modified)}</span>
                            </div>
                            <div className="border-t border-gray-300 pt-2 mt-2 space-y-1">
                                <div className="text-gray-600">Attributes:</div>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={propsItem.node.readOnly || false} readOnly className="accent-blue-600" /> Read-only</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={propsItem.node.hidden} readOnly className="accent-blue-600" /> Hidden</label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 p-3 border-t border-gray-300">
                            <button className="px-4 py-1 bg-[#ece9d8] border border-gray-500 rounded-sm hover:bg-[#ddd] text-xs" onClick={() => setPropsItem(null)}>OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
