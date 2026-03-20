"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFS } from '../contexts/FileSystemContext';

interface TerminalLine {
    text: string;
    color?: string;
}

interface TerminalProps {
    onRequestClose?: () => void;
}

export default function Terminal({ onRequestClose }: TerminalProps) {
    const fs = useFS();
    const [lines, setLines] = useState<TerminalLine[]>([]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [variables, setVariables] = useState<Record<string, string>>({ USER: 'Mathew', HOME: '/home/user', SHELL: '/bin/bash', PATH: '/usr/bin:/bin', TERM: 'xterm-256color' });
    const [aliases, setAliases] = useState<Record<string, string>>({ ll: 'ls -la', la: 'ls -a' });
    const [showNano, setShowNano] = useState(false);
    const [nanoFile, setNanoFile] = useState('');
    const [nanoContent, setNanoContent] = useState('');
    const [nanoModified, setNanoModified] = useState(false);
    const [showMatrix, setShowMatrix] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const [tabCompletionCandidates, setTabCompletionCandidates] = useState<string[]>([]);
    const [tabIndex, setTabIndex] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const bootDone = useRef(false);
    const startTime = useRef(Date.now());

    const MAX_SCROLLBACK = 1000;

    const addLines = useCallback((newLines: TerminalLine[]) => {
        setLines(prev => {
            const combined = [...prev, ...newLines];
            return combined.slice(-MAX_SCROLLBACK);
        });
    }, []);

    const addText = useCallback((text: string, color?: string) => {
        const textLines = text.split('\n').map(t => ({ text: t, color }));
        addLines(textLines);
    }, [addLines]);

    const getPrompt = useCallback(() => {
        return fs.getWindowsPath(fs.getCwd()) + '> ';
    }, [fs]);

    useEffect(() => {
        if (bootDone.current) return;
        bootDone.current = true;
        const bootLines: TerminalLine[] = [
            { text: 'Microsoft Windows [Version 6.0.6002]' },
            { text: 'Copyright (c) 2006 Microsoft Corporation. All rights reserved.' },
            { text: '' },
        ];
        // Show MOTD
        const motd = fs.readFile('/etc/motd');
        if (motd) {
            motd.split('\n').forEach(line => bootLines.push({ text: line, color: '#4EC94E' }));
        }
        bootLines.push({ text: '' });
        setLines(bootLines);
    }, [fs]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    const focusInput = () => inputRef.current?.focus();

    const expandVariables = (text: string): string => {
        return text.replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, name) => variables[name] || '');
    };

    const processCommand = useCallback((rawCmd: string) => {
        const prompt = getPrompt();
        addLines([{ text: prompt + rawCmd }]);

        if (!rawCmd.trim()) return;

        setHistory(prev => [...prev, rawCmd]);
        setHistoryIndex(-1);

        // Handle && operator
        if (rawCmd.includes(' && ')) {
            const cmds = rawCmd.split(' && ');
            cmds.forEach(c => executeCommand(c.trim()));
            return;
        }

        // Handle ; separator
        if (rawCmd.includes(';')) {
            const cmds = rawCmd.split(';');
            cmds.forEach(c => executeCommand(c.trim()));
            return;
        }

        executeCommand(rawCmd);
    }, []);

    const executeCommand = (rawCmd: string) => {
        if (!rawCmd.trim()) return;

        // Variable assignment
        const assignMatch = rawCmd.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
        if (assignMatch) {
            setVariables(prev => ({ ...prev, [assignMatch[1]]: assignMatch[2] }));
            return;
        }

        // Expand variables and aliases
        let cmd = expandVariables(rawCmd);
        const firstWord = cmd.split(' ')[0];
        if (aliases[firstWord]) {
            cmd = aliases[firstWord] + cmd.slice(firstWord.length);
        }

        // Handle pipe
        if (cmd.includes(' | ')) {
            const parts = cmd.split(' | ');
            let lastOutput = '';
            for (const part of parts) {
                lastOutput = executeAndCapture(part.trim(), lastOutput);
            }
            if (lastOutput) addText(lastOutput);
            return;
        }

        // Handle redirect
        const appendMatch = cmd.match(/^(.+?)\s*>>\s*(.+)$/);
        const writeMatch = cmd.match(/^(.+?)\s*>\s*(.+)$/);

        if (appendMatch) {
            const output = executeAndCapture(appendMatch[1].trim());
            const existing = fs.readFile(appendMatch[2].trim()) || '';
            fs.writeFile(appendMatch[2].trim(), existing + output);
            return;
        }
        if (writeMatch) {
            const output = executeAndCapture(writeMatch[1].trim());
            fs.writeFile(writeMatch[2].trim(), output);
            return;
        }

        const output = executeAndCapture(cmd);
        if (output) addText(output);
    };

    const executeAndCapture = (cmd: string, pipeInput?: string): string => {
        const parts = cmd.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
        if (parts.length === 0) return '';
        const command = parts[0];
        const args = parts.slice(1).map(a => a.replace(/^["']|["']$/g, ''));

        switch (command) {
            case 'ls': case 'dir': {
                const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
                const longFmt = args.includes('-l') || args.includes('-la') || args.includes('-al');
                const path = args.filter(a => !a.startsWith('-'))[0] || '.';
                return fs.ls(path, showAll, longFmt);
            }

            case 'cd': {
                const target = args[0] || '~';
                const err = fs.cd(target);
                if (err) return `ERROR: ${err}`;
                return '';
            }

            case 'pwd': return fs.getCwd();

            case 'tree': {
                const path = args[0] || '.';
                const resolved = fs.resolvePath(path);
                const node = fs.getNode(resolved);
                return (node ? node.name : path) + '\n' + fs.tree(path);
            }

            case 'cat': case 'type': {
                if (pipeInput) return pipeInput;
                if (args.length === 0) return 'Usage: cat <file>';
                const content = fs.readFile(args[0]);
                if (content === null) return `File not found: ${args[0]}`;
                return content;
            }

            case 'touch': {
                if (args.length === 0) return 'Usage: touch <file>';
                const err = fs.writeFile(args[0], '');
                return err || '';
            }

            case 'mkdir': {
                const recursive = args.includes('-p');
                const path = args.filter(a => !a.startsWith('-'))[0];
                if (!path) return 'Usage: mkdir [-p] <directory>';
                const err = fs.mkdir(path, recursive);
                return err || '';
            }

            case 'rm': case 'del': {
                const recursive = args.includes('-r') || args.includes('-rf') || args.includes('-fr');
                const force = args.includes('-f') || args.includes('-rf') || args.includes('-fr');
                const path = args.filter(a => !a.startsWith('-'))[0];
                if (!path) return 'Usage: rm [-rf] <file>';
                const err = fs.rm(path, recursive, force);
                return err || '';
            }

            case 'cp': case 'copy': {
                const recursive = args.includes('-r');
                const paths = args.filter(a => !a.startsWith('-'));
                if (paths.length < 2) return 'Usage: cp [-r] <source> <dest>';
                const err = fs.cp(paths[0], paths[1], recursive);
                return err || '';
            }

            case 'mv': case 'move': {
                if (args.length < 2) return 'Usage: mv <source> <dest>';
                const err = fs.mv(args[0], args[1]);
                return err || '';
            }

            case 'find': {
                const nameIdx = args.indexOf('-name');
                const startPath = args[0] && !args[0].startsWith('-') ? args[0] : '.';
                const pattern = nameIdx !== -1 && args[nameIdx + 1] ? args[nameIdx + 1] : '*';
                const results = fs.find(startPath, pattern);
                return results.join('\n');
            }

            case 'grep': {
                if (args.length < 2) return 'Usage: grep <pattern> <file>';
                const results = fs.grep(args[0], args[1]);
                if (results.length === 0) return '(no matches)';
                return results.join('\n');
            }

            case 'head': {
                const nIdx = args.indexOf('-n');
                const n = nIdx !== -1 ? parseInt(args[nIdx + 1]) || 10 : 10;
                const file = args.filter(a => !a.startsWith('-') && isNaN(Number(a)))[0] || args[args.length - 1];
                const content = pipeInput || fs.readFile(file);
                if (content === null) return `File not found: ${file}`;
                return content.split('\n').slice(0, n).join('\n');
            }

            case 'tail': {
                const nIdx = args.indexOf('-n');
                const n = nIdx !== -1 ? parseInt(args[nIdx + 1]) || 10 : 10;
                const file = args.filter(a => !a.startsWith('-') && isNaN(Number(a)))[0] || args[args.length - 1];
                const content = pipeInput || fs.readFile(file);
                if (content === null) return `File not found: ${file}`;
                return content.split('\n').slice(-n).join('\n');
            }

            case 'wc': {
                const content = pipeInput || (args.length > 0 ? fs.readFile(args.filter(a => !a.startsWith('-'))[0] || '') : null);
                if (content === null) return 'Usage: wc <file>';
                const lineCount = content.split('\n').length;
                const wordCount = content.split(/\s+/).filter(Boolean).length;
                const charCount = content.length;
                const flags = args.filter(a => a.startsWith('-')).join('');
                if (flags.includes('l')) return String(lineCount);
                if (flags.includes('w')) return String(wordCount);
                if (flags.includes('c')) return String(charCount);
                return `  ${lineCount}  ${wordCount}  ${charCount}`;
            }

            case 'sort': {
                const content = pipeInput || (args.length > 0 ? fs.readFile(args[0]) : null);
                if (content === null) return 'Usage: sort <file>';
                return content.split('\n').sort().join('\n');
            }

            case 'uniq': {
                const content = pipeInput || (args.length > 0 ? fs.readFile(args[0]) : null);
                if (content === null) return 'Usage: uniq <file>';
                const lines = content.split('\n');
                return lines.filter((line, i) => i === 0 || line !== lines[i - 1]).join('\n');
            }

            case 'chmod': {
                if (args.length < 2) return 'Usage: chmod <mode> <file>';
                const err = fs.chmod(args[1], args[0]);
                return err || '';
            }

            case 'echo': {
                return args.join(' ');
            }

            case 'whoami': return 'Mathew';
            case 'hostname': return fs.readFile('/etc/hostname') || 'MATHEW-PC';
            case 'uname': {
                if (args.includes('-a')) return 'WindowsXP 6.0.6002 MATHEW-PC x86_64 RetroKernel/2.6.32';
                return 'WindowsXP';
            }

            case 'date': return new Date().toString();

            case 'uptime': {
                const uptimeMs = Date.now() - startTime.current;
                const hours = Math.floor(uptimeMs / 3600000);
                const minutes = Math.floor((uptimeMs % 3600000) / 60000);
                return `up ${hours} hours, ${minutes} minutes`;
            }

            case 'env': return Object.entries(variables).map(([k, v]) => `${k}=${v}`).join('\n');

            case 'export': {
                const match = args[0]?.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
                if (match) {
                    setVariables(prev => ({ ...prev, [match[1]]: match[2] }));
                    return '';
                }
                return 'Usage: export VAR=value';
            }

            case 'alias': {
                if (args.length === 0) return Object.entries(aliases).map(([k, v]) => `alias ${k}='${v}'`).join('\n');
                const match = args[0]?.match(/^([A-Za-z_]+)=(.+)$/);
                if (match) {
                    setAliases(prev => ({ ...prev, [match[1]]: match[2].replace(/^['"]|['"]$/g, '') }));
                    return '';
                }
                return 'Usage: alias name=\'command\'';
            }

            case 'history': return history.map((h, i) => ` ${i + 1}  ${h}`).join('\n');

            case 'clear': case 'cls': {
                setLines([]);
                return '';
            }

            case 'which': {
                if (args.length === 0) return 'Usage: which <command>';
                const builtins = ['ls', 'cd', 'pwd', 'tree', 'cat', 'touch', 'mkdir', 'rm', 'cp', 'mv', 'find', 'grep', 'head', 'tail', 'wc', 'sort', 'uniq', 'chmod', 'echo', 'whoami', 'hostname', 'uname', 'date', 'uptime', 'env', 'export', 'alias', 'history', 'clear', 'help', 'man', 'which', 'ps', 'top', 'nano', 'fortune', 'matrix', 'hack', 'sudo'];
                return builtins.includes(args[0]) ? `/usr/bin/${args[0]}` : `${args[0]} not found`;
            }

            case 'ps': {
                return [
                    '  PID TTY          TIME CMD',
                    '    1 ?        00:00:05 systemd',
                    '   42 ?        00:00:02 portfolio.exe',
                    '  101 ?        00:00:01 dreams.exe',
                    '  202 ?        00:00:00 aesthetic_engine',
                    '  303 pts/0    00:00:00 cmd.exe',
                    '  404 ?        00:00:03 nostalgia.dll',
                    '  500 ?        00:00:01 vibe_check.service',
                    ` ${Math.floor(Math.random() * 9000) + 1000} pts/0    00:00:00 ps`,
                ].join('\n');
            }

            case 'top': {
                setShowTop(true);
                return '';
            }

            case 'nano': case 'vi': case 'vim': case 'edit': {
                if (args.length === 0) return 'Usage: nano <file>';
                const filePath = args[0];
                const content = fs.readFile(filePath) || '';
                setNanoFile(filePath);
                setNanoContent(content);
                setNanoModified(false);
                setShowNano(true);
                return '';
            }

            case 'help': {
                return [
                    'Available commands:',
                    '',
                    'FILE SYSTEM        SHELL             SYSTEM',
                    '  ls, dir            echo              whoami',
                    '  cd                 |  (pipe)         hostname',
                    '  pwd                ;  (chain)        uname',
                    '  tree               && (and)          date',
                    '  cat, type          > >> (redirect)   uptime',
                    '  touch              export            env',
                    '  mkdir              alias             history',
                    '  rm, del            clear, cls        ps',
                    '  cp, copy           help              top',
                    '  mv, move           man               which',
                    '  find               nano, vi',
                    '  grep             EASTER EGGS',
                    '  head, tail         fortune',
                    '  wc                 matrix',
                    '  sort               hack',
                    '  uniq               sudo',
                    '  chmod',
                ].join('\n');
            }

            case 'man': {
                const manPages: Record<string, string> = {
                    ls: 'ls [-la] [path] - List directory contents. -l for long format, -a to show hidden files.',
                    cd: 'cd [path] - Change the current directory. Supports ~, .., absolute and relative paths.',
                    pwd: 'pwd - Print the current working directory.',
                    tree: 'tree [path] - Display directory structure as an ASCII tree.',
                    cat: 'cat <file> - Display file contents.',
                    touch: 'touch <file> - Create an empty file or update modification time.',
                    mkdir: 'mkdir [-p] <dir> - Create a directory. -p creates parent dirs.',
                    rm: 'rm [-rf] <path> - Remove files or directories. -r recursive, -f force.',
                    cp: 'cp [-r] <src> <dest> - Copy files or directories.',
                    mv: 'mv <src> <dest> - Move or rename files and directories.',
                    find: 'find [path] -name <pattern> - Search for files matching a glob pattern.',
                    grep: 'grep <pattern> <file> - Search file contents for a regex pattern.',
                    head: 'head [-n N] <file> - Show first N lines of a file (default 10).',
                    tail: 'tail [-n N] <file> - Show last N lines of a file (default 10).',
                    wc: 'wc [-lwc] <file> - Count lines, words, or characters.',
                    sort: 'sort <file> - Sort lines alphabetically.',
                    uniq: 'uniq <file> - Remove adjacent duplicate lines.',
                    chmod: 'chmod <mode> <file> - Change file permissions string.',
                    echo: 'echo <text> - Print text to output. Supports > and >> redirect.',
                    nano: 'nano <file> - Open file in the nano text editor overlay.',
                    fortune: 'fortune - Print a random developer quote.',
                    matrix: 'matrix - Enter the Matrix. Press any key to escape.',
                    hack: 'hack - Run a totally legit hacking sequence.',
                    sudo: 'sudo <command> - Execute command with superuser privileges.',
                };
                if (!args[0]) return 'Usage: man <command>';
                return manPages[args[0]] || `No manual entry for '${args[0]}'`;
            }

            case 'fortune': return fs.getFortune();

            case 'matrix': {
                setShowMatrix(true);
                return '';
            }

            case 'hack': {
                const hackLines: string[] = [];
                hackLines.push('[*] Initializing hack sequence...');
                hackLines.push('[*] Scanning target network...');
                for (let i = 0; i < 8; i++) {
                    hackLines.push(`[+] Found host: ${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)} -- Port ${[22, 80, 443, 8080, 3306, 5432, 27017, 6379][i]} OPEN`);
                }
                hackLines.push('[*] Exploiting vulnerability CVE-2024-FAKE...');
                hackLines.push('[*] Injecting payload...');
                hackLines.push('[*] Bypassing firewall...');
                hackLines.push('[*] Decrypting credentials...');
                hackLines.push('');
                hackLines.push('================================');
                hackLines.push('     ACCESS GRANTED');
                hackLines.push('================================');
                hackLines.push('');
                hackLines.push('Just kidding. This is a portfolio, not a cybercrime tool :)');
                return hackLines.join('\n');
            }

            case 'sudo': {
                const subCmd = args.join(' ');
                if (subCmd.startsWith('rm -rf /') || subCmd.startsWith('rm -fr /') || subCmd === 'rm -rf' || subCmd === 'rm -rf /' || subCmd.startsWith('rm -rf')) {
                    setTimeout(() => {
                        try { window.close(); } catch { window.location.href = 'about:blank'; }
                    }, 3000);
                    return [
                        '',
                        '  *** SYSTEM MELTDOWN INITIATED ***',
                        '',
                        '  [####                    ] 15%  Deleting System32...',
                        '  [########                ] 35%  Removing all memes...',
                        '  [############            ] 55%  Erasing browsing history...',
                        '  [################        ] 75%  Uninstalling Internet Explorer...',
                        '  [####################    ] 90%  Destroying dreams...',
                        '  [########################] 100% COMPLETE',
                        '',
                        '  FATAL ERROR: Kernel panic - not syncing',
                        '  Your computer will self-destruct in 3... 2... 1...',
                        '',
                    ].join('\n');
                }
                if (subCmd === 'make me a sandwich') return 'Okay.';
                return `[sudo] password for Mathew: Access denied. Just kidding -- you do not have sudo privileges in a portfolio.`;
            }

            case 'exit': case 'quit': {
                if (onRequestClose) onRequestClose();
                return '';
            }

            default: {
                return `'${command}' is not recognized as an internal or external command, operable program or batch file.\nType 'help' for a list of available commands.`;
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showNano || showMatrix || showTop) return;

        if (e.key === 'Tab') {
            e.preventDefault();
            handleTabCompletion();
            return;
        }

        setTabCompletionCandidates([]);
        setTabIndex(0);

        if (e.key === 'Enter') {
            e.preventDefault();
            processCommand(input);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0) {
                const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                const newIndex = historyIndex + 1;
                if (newIndex >= history.length) {
                    setHistoryIndex(-1);
                    setInput('');
                } else {
                    setHistoryIndex(newIndex);
                    setInput(history[newIndex]);
                }
            }
        } else if (e.key === 'c' && e.ctrlKey) {
            e.preventDefault();
            addLines([{ text: getPrompt() + input + '^C' }]);
            setInput('');
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setLines([]);
        } else if (e.key === 'a' && e.ctrlKey) {
            e.preventDefault();
            if (inputRef.current) inputRef.current.setSelectionRange(0, 0);
        } else if (e.key === 'e' && e.ctrlKey) {
            e.preventDefault();
            if (inputRef.current) inputRef.current.setSelectionRange(input.length, input.length);
        }
    };

    const handleTabCompletion = () => {
        const parts = input.split(' ');
        const lastPart = parts[parts.length - 1] || '';

        if (parts.length === 1) {
            // Command completion
            const commands = ['ls', 'cd', 'pwd', 'tree', 'cat', 'touch', 'mkdir', 'rm', 'cp', 'mv', 'find', 'grep', 'head', 'tail', 'wc', 'sort', 'uniq', 'chmod', 'echo', 'whoami', 'hostname', 'uname', 'date', 'uptime', 'env', 'export', 'alias', 'history', 'clear', 'cls', 'help', 'man', 'which', 'ps', 'top', 'nano', 'fortune', 'matrix', 'hack', 'sudo', 'exit'];
            const matches = commands.filter(c => c.startsWith(lastPart));
            if (matches.length === 1) {
                setInput(matches[0] + ' ');
            } else if (matches.length > 1) {
                if (tabCompletionCandidates.length > 0) {
                    const nextIdx = (tabIndex + 1) % matches.length;
                    setTabIndex(nextIdx);
                    setInput(matches[nextIdx] + ' ');
                } else {
                    setTabCompletionCandidates(matches);
                    setTabIndex(0);
                    setInput(matches[0] + ' ');
                }
            }
            return;
        }

        // Path completion
        const dir = lastPart.includes('/') ? lastPart.substring(0, lastPart.lastIndexOf('/') + 1) : '.';
        const partial = lastPart.includes('/') ? lastPart.substring(lastPart.lastIndexOf('/') + 1) : lastPart;
        const items = fs.listDir(dir === '.' ? fs.getCwd() : dir);
        const matches = items.filter(item => item.name.startsWith(partial)).map(item => item.name + (item.type === 'directory' ? '/' : ''));

        if (matches.length === 1) {
            const prefix = lastPart.includes('/') ? lastPart.substring(0, lastPart.lastIndexOf('/') + 1) : '';
            parts[parts.length - 1] = prefix + matches[0];
            setInput(parts.join(' '));
        } else if (matches.length > 1) {
            const nextIdx = (tabIndex + 1) % matches.length;
            setTabIndex(nextIdx);
            const prefix = lastPart.includes('/') ? lastPart.substring(0, lastPart.lastIndexOf('/') + 1) : '';
            parts[parts.length - 1] = prefix + matches[nextIdx];
            setInput(parts.join(' '));
            setTabCompletionCandidates(matches);
        }
    };

    // Nano Editor Overlay
    if (showNano) {
        return (
            <div className="w-full h-full flex flex-col bg-[#000080] text-white font-mono text-xs"
                onKeyDown={(e) => {
                    if (e.key === 's' && e.ctrlKey) {
                        e.preventDefault();
                        fs.writeFile(nanoFile, nanoContent);
                        setNanoModified(false);
                    } else if (e.key === 'q' && e.ctrlKey) {
                        e.preventDefault();
                        if (nanoModified) {
                            if (confirm('Save changes before closing?')) {
                                fs.writeFile(nanoFile, nanoContent);
                            }
                        }
                        setShowNano(false);
                    }
                }}
                tabIndex={0}
                autoFocus
            >
                <div className="bg-white text-black px-2 py-1 flex justify-between">
                    <span>GNU nano - {nanoFile}{nanoModified ? ' [Modified]' : ''}</span>
                    <span>Ctrl+S: Save | Ctrl+Q: Quit</span>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <div className="bg-[#1a1a3a] text-gray-500 px-1 text-right select-none pt-1 w-10 overflow-hidden">
                        {nanoContent.split('\n').map((_, i) => (
                            <div key={i}>{i + 1}</div>
                        ))}
                    </div>
                    <textarea
                        className="flex-1 bg-[#000080] text-white p-1 font-mono text-xs resize-none outline-none border-none"
                        value={nanoContent}
                        onChange={(e) => { setNanoContent(e.target.value); setNanoModified(true); }}
                        autoFocus
                        spellCheck={false}
                    />
                </div>
                <div className="bg-white text-black px-2 py-[2px] text-[10px] flex gap-6">
                    <span>^S Save</span><span>^Q Exit</span>
                </div>
            </div>
        );
    }

    // Matrix Rain Overlay
    if (showMatrix) {
        return (
            <div
                className="w-full h-full bg-black flex items-center justify-center cursor-pointer relative overflow-hidden"
                onClick={() => setShowMatrix(false)}
                onKeyDown={() => setShowMatrix(false)}
                tabIndex={0}
                autoFocus
            >
                <MatrixRain />
                <div className="absolute bottom-4 text-green-500 text-xs opacity-60">Press any key or click to exit</div>
            </div>
        );
    }

    // Top Process Monitor Overlay
    if (showTop) {
        return (
            <div
                className="w-full h-full bg-black text-[#C0C0C0] font-mono text-xs p-2 overflow-auto"
                onKeyDown={(e) => { if (e.key === 'q') setShowTop(false); }}
                tabIndex={0}
                autoFocus
            >
                <TopDisplay />
                <div className="mt-2 text-gray-600">Press 'q' to quit</div>
            </div>
        );
    }

    return (
        <div
            className="w-full h-full bg-[#0C0C0C] text-[#C0C0C0] overflow-hidden flex flex-col cursor-text"
            style={{ fontFamily: "'Lucida Console', 'Courier New', monospace", fontSize: '13px' }}
            onClick={focusInput}
        >
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 whitespace-pre-wrap break-words">
                {lines.map((line, i) => (
                    <div key={i} style={{ color: line.color || '#C0C0C0' }}>{line.text || '\u00A0'}</div>
                ))}
                <div className="flex items-center">
                    <span className="text-white whitespace-pre">{getPrompt()}</span>
                    <span>{input}</span>
                    <span className="inline-block w-2 h-4 bg-[#C0C0C0] ml-[1px]" style={{ animation: 'blink 1s step-end infinite' }} />
                </div>
            </div>
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="absolute opacity-0 w-0 h-0"
                autoFocus
                autoComplete="off"
                spellCheck={false}
            />
            <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
        </div>
    );
}

// Matrix Rain sub-component
function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops: number[] = Array(columns).fill(1);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);
        return () => clearInterval(interval);
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" />;
}

// Top process monitor sub-component
function TopDisplay() {
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 2000);
        return () => clearInterval(interval);
    }, []);

    const processes = [
        { pid: 1, name: 'systemd', cpu: (0.1 + Math.random() * 0.3).toFixed(1), mem: '0.5' },
        { pid: 42, name: 'portfolio.exe', cpu: (15 + Math.random() * 10).toFixed(1), mem: '4.2' },
        { pid: 101, name: 'dreams.exe', cpu: (2 + Math.random() * 3).toFixed(1), mem: '1.8' },
        { pid: 202, name: 'aesthetic_engine', cpu: (5 + Math.random() * 5).toFixed(1), mem: '3.1' },
        { pid: 303, name: 'cmd.exe', cpu: (0.5 + Math.random() * 1).toFixed(1), mem: '0.8' },
        { pid: 404, name: 'nostalgia.dll', cpu: (1 + Math.random() * 2).toFixed(1), mem: '2.0' },
        { pid: 500, name: 'vibe_check', cpu: (0.2 + Math.random() * 0.5).toFixed(1), mem: '0.3' },
        { pid: 777, name: 'caffeine.drv', cpu: (99.9).toFixed(1), mem: '99.9' },
    ];

    const uptimeMs = Date.now() % 86400000;
    const h = Math.floor(uptimeMs / 3600000);
    const m = Math.floor((uptimeMs % 3600000) / 60000);

    return (
        <div>
            <div>top - {new Date().toLocaleTimeString()} up {h}:{String(m).padStart(2, '0')}, 1 user, load average: 0.{42 + tick % 10}, 0.{31 + tick % 5}, 0.{28 + tick % 3}</div>
            <div>Tasks: {processes.length} total, 1 running, {processes.length - 1} sleeping</div>
            <div>%Cpu(s): {(25 + Math.random() * 10).toFixed(1)} us, {(3 + Math.random() * 2).toFixed(1)} sy, 0.0 ni</div>
            <div>MiB Mem: 16384.0 total, {(8192 + Math.random() * 2000).toFixed(0)} free, {(6000 + Math.random() * 1000).toFixed(0)} used</div>
            <div></div>
            <div>{'  PID'.padEnd(8)}{'USER'.padEnd(10)}{'%CPU'.padEnd(8)}{'%MEM'.padEnd(8)}{'COMMAND'}</div>
            {processes.map(p => (
                <div key={p.pid}>{String(p.pid).padEnd(8)}{'Mathew'.padEnd(10)}{p.cpu.padStart(5).padEnd(8)}{p.mem.padStart(5).padEnd(8)}{p.name}</div>
            ))}
        </div>
    );
}
