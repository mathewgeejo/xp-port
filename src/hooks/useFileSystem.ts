"use client";

export interface FSNode {
    type: 'file' | 'directory' | 'symlink';
    name: string;
    content?: string;
    children?: Map<string, FSNode>;
    permissions: string;
    size: number;
    created: Date;
    modified: Date;
    hidden: boolean;
    target?: string; // for symlinks
}

const FORTUNE_QUOTES = [
    "The best error message is the one that never shows up.",
    "First, solve the problem. Then, write the code. - John Johnson",
    "Code is like humor. When you have to explain it, it is bad. - Cory House",
    "Fix the cause, not the symptom. - Steve Maguire",
    "Simplicity is the soul of efficiency. - Austin Freeman",
    "Make it work, make it right, make it fast. - Kent Beck",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
    "The most damaging phrase in the language is: We have always done it this way. - Grace Hopper",
    "It works on my machine. -- Every developer, since the dawn of time.",
    "Talk is cheap. Show me the code. - Linus Torvalds",
    "Programs must be written for people to read, and only incidentally for machines to execute. - Harold Abelson",
    "The only way to learn a new programming language is by writing programs in it. - Dennis Ritchie",
    "Debugging is twice as hard as writing the code in the first place. - Brian Kernighan",
    "Perfection is achieved not when there is nothing more to add, but when there is nothing more to take away. - Antoine de Saint-Exupery",
    "In theory, there is no difference between theory and practice. In practice, there is. - Yogi Berra"
];

function mkFile(name: string, content: string, hidden = false): FSNode {
    const now = new Date();
    return {
        type: 'file', name, content, permissions: '-rw-r--r--',
        size: content.length, created: now, modified: now, hidden
    };
}

function mkDir(name: string, children: Map<string, FSNode>, hidden = false): FSNode {
    const now = new Date();
    return {
        type: 'directory', name, children, permissions: 'drwxr-xr-x',
        size: 4096, created: now, modified: now, hidden
    };
}

function mapFrom(entries: [string, FSNode][]): Map<string, FSNode> {
    return new Map(entries);
}

function buildInitialFS(): FSNode {
    const desktopFiles = mapFrom([
        ['About Me.lnk', mkFile('About Me.lnk', '[Desktop Entry]\nType=Link\nTarget=Welcome Center')],
        ['My Computer.lnk', mkFile('My Computer.lnk', '[Desktop Entry]\nType=Link\nTarget=File Manager')],
        ['Projects.lnk', mkFile('Projects.lnk', '[Desktop Entry]\nType=Link\nTarget=Projects Folder')],
        ['Experience.txt', mkFile('Experience.txt',
            `-- WORK EXPERIENCE --

Mathew Geejo
Frontend Developer & UI/UX Designer

Universal Postal Union | Senior Software Developer | Oct 2013 - Present
- Lead Architecture & Development
- Mentored agile practices
- Built enterprise-scale web applications

Previous Roles:
- Full Stack Developer at TechCorp (2010-2013)
- Junior Developer at StartupXYZ (2008-2010)

Skills: React, Next.js, TypeScript, Node.js, TailwindCSS, Python
`)],
        ['Contact Me.lnk', mkFile('Contact Me.lnk', '[Desktop Entry]\nType=Link\nTarget=Windows Mail')],
    ]);

    const documentsFiles = mapFrom([
        ['about-me.txt', mkFile('about-me.txt',
            `=== ABOUT ME ===

Hi, I'm Mathew Geejo -- a passionate software developer who loves
building beautiful, nostalgic user experiences on the web.

I specialize in modern web architecture with React, Next.js, and
TypeScript. When I'm not coding, you can find me recreating retro
operating systems in the browser (as you can see).

This entire portfolio is a love letter to the golden age of desktop
computing. Every pixel, every gradient, every window chrome detail
has been carefully crafted to transport you back in time.

Current obsessions:
- Making CSS do things it was never meant to do
- Building virtual filesystems in JavaScript
- Convincing people that web apps can be beautiful

Location: Earth (specifically the part with good internet)
Contact: mathew@domain.com
`)],
        ['resume.txt', mkFile('resume.txt',
            `================================================================
                    MATHEW GEEJO - RESUME
================================================================

CONTACT
-------
Email:    mathew@domain.com
GitHub:   github.com/mathewgeejo
LinkedIn: linkedin.com/in/mathewgeejo

SUMMARY
-------
Senior Software Developer with 10+ years of experience building
modern web applications. Passionate about UI/UX design, retro
computing aesthetics, and developer experience.

SKILLS
------
Languages:   TypeScript, JavaScript, Python, HTML, CSS
Frameworks:  React, Next.js, Node.js, Express, FastAPI
Styling:     TailwindCSS, CSS Modules, Styled Components
Tools:       Git, Docker, Webpack, Vite, Figma
Databases:   PostgreSQL, MongoDB, Redis

EXPERIENCE
----------
Senior Software Developer | Universal Postal Union
Oct 2013 - Present
  * Lead architecture and development of enterprise web apps
  * Mentored team of 8 developers in agile practices
  * Reduced build times by 60% through tooling optimization
  * Implemented CI/CD pipelines serving 50k+ daily users

Full Stack Developer | TechCorp
2010 - 2013
  * Built customer-facing dashboards with React
  * Designed RESTful APIs serving mobile and web clients
  * Introduced automated testing, achieving 90% coverage

EDUCATION
---------
B.S. Computer Science | University of Technology | 2008

================================================================
`)],
        ['cover-letter.txt', mkFile('cover-letter.txt',
            `Dear Hiring Manager,

I am writing to express my interest in the position at your
company. As you can see from my portfolio, I take user experience
VERY seriously -- seriously enough to build an entire operating
system in the browser just to show you my resume.

If that level of dedication and mild insanity appeals to you,
I think we would work great together.

I promise my production code has fewer easter eggs than this
portfolio. Probably. Maybe. No guarantees.

Looking forward to hearing from you!

Best regards,
Mathew Geejo

P.S. Try typing "sudo rm -rf /" in my terminal. I dare you.
`)]
    ]);

    const projectWebOS = mapFrom([
        ['README.md', mkFile('README.md',
            `# WebOS Portfolio

A fully interactive Windows-themed portfolio built entirely
with React, Next.js, and TailwindCSS.

## Tech Stack
- React 18 + Next.js 14
- TypeScript
- TailwindCSS
- Custom Virtual Filesystem
- Window Management System

## Features
- Draggable, resizable windows
- Functional terminal with 30+ commands
- File manager with dual views
- Easter eggs everywhere

## Links
- Live: https://mathewgeejo.dev
- GitHub: https://github.com/mathewgeejo/xp-port
`)]
    ]);

    const projectRetro = mapFrom([
        ['README.md', mkFile('README.md',
            `# Retro Theme Engine

A theming engine that recreates classic OS aesthetics in CSS.
Supports Windows XP Luna, Vista Aero, and Mac OS Classic.

## Tech Stack
- Pure CSS + CSS Custom Properties
- PostCSS for processing
- Storybook for component gallery

## Features
- Pixel-perfect window chrome
- Authentic gradients and shadows
- Animated taskbar and start menu
- System tray with working clock
`)]
    ]);

    const projectsDir = mapFrom([
        ['WebOS', mkDir('WebOS', projectWebOS)],
        ['RetroTheme', mkDir('RetroTheme', projectRetro)],
    ]);

    const secretDir = mapFrom([
        ['encrypted.dat', mkFile('encrypted.dat',
            `-----BEGIN ENCRYPTED MESSAGE-----
Vm0wd2QyUXlVWGxWV0d4V1YwZDRWMVl3WkRSV01WbDNXa1JT
VjAxV2JETlhhMUpUVmpBeFYySkVUbGhoTVVwVVZtcEJlRll5
U2tWVWJHaG9UVlZ3VlZadGNFSmxSbGw1VTJ0V1YySkhVbkJV
-----END ENCRYPTED MESSAGE-----

(This message will self-destruct in... just kidding, it won't.)
(The password is "hunter2" but you did not hear that from me.)
`, true)],
    ]);

    const deepNested = mapFrom([
        ['.love-letter.txt', mkFile('.love-letter.txt',
            `Dear Reader,

If you found this file, you are either:
a) A very thorough explorer
b) Someone who read the source code
c) Running 'find / -name "*.txt"' like a pro

Either way, you are exactly the kind of person I want to work with.

This portfolio was built with mass amounts of caffeine and "it works
on my machine" confidence. If something is broken, it is a feature.

With love and semicolons,
Mathew

P.S. The real treasure was the bugs we fixed along the way.
`, true)]
    ]);

    const deepDir = mapFrom([
        ['buried', mkDir('buried', deepNested)]
    ]);

    const userDir = mapFrom([
        ['Desktop', mkDir('Desktop', desktopFiles)],
        ['Documents', mkDir('Documents', documentsFiles)],
        ['Projects', mkDir('Projects', projectsDir)],
        ['Music', mkDir('Music', mapFrom([]))],
        ['Pictures', mkDir('Pictures', mapFrom([]))],
        ['.secret', mkDir('.secret', secretDir, true)],
        ['.deep', mkDir('.deep', deepDir, true)],
        ['.bashrc', mkFile('.bashrc', '# Mathew\'s bashrc\nexport PS1="C:\\\\Users\\\\Mathew> "\nalias ll="ls -la"\n', true)],
    ]);

    const homeDir = mapFrom([
        ['user', mkDir('user', userDir)],
    ]);

    const etcDir = mapFrom([
        ['hostname', mkFile('hostname', 'MATHEW-PC')],
        ['motd', mkFile('motd',
            `
  __  __       _   _                   _
 |  \\/  | __ _| |_| |__   _____      _( )___
 | |\\/| |/ _\` | __| '_ \\ / _ \\ \\ /\\ / /|// __|
 | |  | | (_| | |_| | | |  __/\\ V  V /  \\__ \\
 |_|  |_|\\__,_|\\__|_| |_|\\___| \\_/\\_/   |___/

      ____            _    __       _ _
     |  _ \\ ___  _ __| |_ / _| ___ | (_) ___
     | |_) / _ \\| '__| __| |_ / _ \\| | |/ _ \\
     |  __/ (_) | |  | |_|  _| (_) | | | (_) |
     |_|   \\___/|_|   \\__|_|  \\___/|_|_|\\___/

  Welcome! Type 'help' to see available commands.
  Type 'fortune' for wisdom. Type 'hack' for fun.

`)],
        ['passwd', mkFile('passwd', 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:Mathew:/home/user:/bin/bash\n')],
    ]);

    const logEntries = Array.from({ length: 20 }, (_, i) => {
        const h = String(Math.floor(Math.random() * 24)).padStart(2, '0');
        const m = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const s = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const msgs = [
            'kernel: [    0.000000] Linux version 2.6.32-xp (mathew@MATHEW-PC)',
            'systemd[1]: Started portfolio.service',
            'kernel: TCP: Hash tables configured (established 16384 bind 16384)',
            'NetworkManager: <info> (eth0): connection established',
            'kernel: USB: New device found, idVendor=cafe, idProduct=babe',
            'sshd[1234]: Accepted publickey for user from 127.0.0.1',
            'crond[567]: (user) CMD (/usr/bin/check_dreams)',
            'kernel: [drm] Initialized retro_gpu 1.0.0 for Nostalgia Engine',
            'portfolio.exe[890]: Rendering desktop at 60fps... dreams_per_second=infinite',
            'systemd[1]: Started Windows XP Compatibility Layer v42.0',
        ];
        return `2024-01-${String(i + 1).padStart(2, '0')} ${h}:${m}:${s} ${msgs[i % msgs.length]}`;
    }).join('\n');

    const varDir = mapFrom([
        ['log', mkDir('log', mapFrom([
            ['system.log', mkFile('system.log', logEntries)]
        ]))]
    ]);

    // Windows-style C: alias pointing to same Desktop content
    const cUsersDir = mapFrom([
        ['Mathew', mkDir('Mathew', mapFrom([
            ['Desktop', mkDir('Desktop', new Map(desktopFiles))],
            ['Documents', mkDir('Documents', new Map(documentsFiles))],
            ['Projects', mkDir('Projects', mapFrom([]))],
        ]))]
    ]);

    const cDir = mapFrom([
        ['Users', mkDir('Users', cUsersDir)],
        ['Windows', mkDir('Windows', mapFrom([
            ['System32', mkDir('System32', mapFrom([
                ['cmd.exe', mkFile('cmd.exe', '[Binary: Windows Command Processor]')],
                ['notepad.exe', mkFile('notepad.exe', '[Binary: Notepad Text Editor]')],
                ['explorer.exe', mkFile('explorer.exe', '[Binary: Windows Explorer]')],
            ]))]
        ]))]
    ]);

    const root = mkDir('/', mapFrom([
        ['home', mkDir('home', homeDir)],
        ['etc', mkDir('etc', etcDir)],
        ['var', mkDir('var', varDir)],
        ['tmp', mkDir('tmp', mapFrom([]))],
        ['C:', mkDir('C:', cDir)],
    ]));

    return root;
}

export function createFileSystem() {
    let root = buildInitialFS();
    let cwdPath = '/home/user';

    function getNode(path: string): FSNode | null {
        const resolved = resolvePath(path);
        if (resolved === '/') return root;
        const parts = resolved.split('/').filter(Boolean);
        let current = root;
        for (const part of parts) {
            if (current.type !== 'directory' || !current.children) return null;
            const child = current.children.get(part);
            if (!child) return null;
            current = child;
        }
        return current;
    }

    function getParentAndName(path: string): { parent: FSNode; name: string } | null {
        const resolved = resolvePath(path);
        const parts = resolved.split('/').filter(Boolean);
        if (parts.length === 0) return null;
        const name = parts.pop()!;
        const parentPath = '/' + parts.join('/');
        const parent = getNode(parentPath);
        if (!parent || parent.type !== 'directory') return null;
        return { parent, name };
    }

    function resolvePath(path: string): string {
        if (path === '~' || path === '') return '/home/user';
        if (path.startsWith('~/')) path = '/home/user/' + path.slice(2);
        if (!path.startsWith('/')) path = cwdPath + '/' + path;

        const parts = path.split('/').filter(Boolean);
        const resolved: string[] = [];
        for (const part of parts) {
            if (part === '.') continue;
            if (part === '..') { resolved.pop(); continue; }
            resolved.push(part);
        }
        return '/' + resolved.join('/');
    }

    function getCwd() { return cwdPath; }

    function getWindowsPath(unixPath: string): string {
        if (unixPath.startsWith('/C:')) {
            return unixPath.replace(/^\/C:/, 'C:').replace(/\//g, '\\');
        }
        return 'C:\\Users\\Mathew' + unixPath.replace('/home/user', '').replace(/\//g, '\\');
    }

    function cd(path: string): string | null {
        const resolved = resolvePath(path);
        const node = getNode(resolved);
        if (!node) return `The system cannot find the path specified: ${path}`;
        if (node.type !== 'directory') return `Not a directory: ${path}`;
        cwdPath = resolved;
        return null;
    }

    function ls(path: string, showAll = false, longFormat = false): string {
        const resolved = resolvePath(path || '.');
        const node = getNode(resolved);
        if (!node) return `Directory not found: ${path}`;
        if (node.type !== 'directory' || !node.children) return `Not a directory: ${path}`;

        const entries = Array.from(node.children.values())
            .filter(e => showAll || !e.hidden)
            .sort((a, b) => a.name.localeCompare(b.name));

        if (entries.length === 0) return '';

        if (longFormat) {
            return entries.map(e => {
                const d = e.modified;
                const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
                const sizeStr = String(e.size).padStart(8);
                const typeTag = e.type === 'directory' ? '[DIR]' : e.name.endsWith('.exe') ? '[EXE]' : '[FILE]';
                return `${e.permissions}  ${sizeStr}  ${dateStr}  ${typeTag} ${e.name}`;
            }).join('\n');
        }

        return entries.map(e => {
            const tag = e.type === 'directory' ? '[DIR]  ' : e.name.endsWith('.exe') ? '[EXE]  ' : '       ';
            return `${tag}${e.name}`;
        }).join('\n');
    }

    function tree(path: string, prefix = '', isLast = true): string {
        const resolved = resolvePath(path || '.');
        const node = getNode(resolved);
        if (!node || node.type !== 'directory' || !node.children) return '';

        const entries = Array.from(node.children.values())
            .filter(e => !e.hidden)
            .sort((a, b) => a.name.localeCompare(b.name));

        let result = '';
        entries.forEach((entry, idx) => {
            const last = idx === entries.length - 1;
            const connector = last ? '\\-- ' : '+-- ';
            const childPrefix = last ? '    ' : '|   ';
            result += prefix + connector + entry.name + '\n';
            if (entry.type === 'directory' && entry.children) {
                result += tree(resolvePath(path + '/' + entry.name), prefix + childPrefix, last);
            }
        });
        return result;
    }

    function readFile(path: string): string | null {
        const node = getNode(path);
        if (!node) return null;
        if (node.type === 'directory') return null;
        return node.content || '';
    }

    function writeFile(path: string, content: string): string | null {
        const existing = getNode(path);
        if (existing) {
            if (existing.type === 'directory') return 'Is a directory';
            existing.content = content;
            existing.size = content.length;
            existing.modified = new Date();
            return null;
        }
        const pn = getParentAndName(path);
        if (!pn) return 'Parent directory not found';
        const newFile = mkFile(pn.name, content);
        pn.parent.children!.set(pn.name, newFile);
        return null;
    }

    function mkdir(path: string, recursive = false): string | null {
        if (recursive) {
            const resolved = resolvePath(path);
            const parts = resolved.split('/').filter(Boolean);
            let current = root;
            for (const part of parts) {
                if (!current.children) return 'Not a directory in path';
                let child = current.children.get(part);
                if (!child) {
                    child = mkDir(part, mapFrom([]));
                    current.children.set(part, child);
                } else if (child.type !== 'directory') {
                    return `${part} exists and is not a directory`;
                }
                current = child;
            }
            return null;
        }
        const pn = getParentAndName(path);
        if (!pn) return 'Parent directory not found';
        if (pn.parent.children!.has(pn.name)) return `Directory already exists: ${pn.name}`;
        pn.parent.children!.set(pn.name, mkDir(pn.name, mapFrom([])));
        return null;
    }

    function rm(path: string, recursive = false, force = false): string | null {
        const pn = getParentAndName(path);
        if (!pn) return force ? null : `File not found: ${path}`;
        const target = pn.parent.children!.get(pn.name);
        if (!target) return force ? null : `File not found: ${path}`;
        if (target.type === 'directory' && !recursive) return `Is a directory (use -r): ${pn.name}`;
        pn.parent.children!.delete(pn.name);
        return null;
    }

    function cp(src: string, dest: string, recursive = false): string | null {
        const srcNode = getNode(src);
        if (!srcNode) return `Source not found: ${src}`;
        if (srcNode.type === 'directory' && !recursive) return 'Is a directory (use -r)';

        function deepCopy(node: FSNode): FSNode {
            const copy = { ...node, created: new Date(), modified: new Date() };
            if (node.children) {
                copy.children = new Map();
                node.children.forEach((v, k) => copy.children!.set(k, deepCopy(v)));
            }
            return copy;
        }

        const destNode = getNode(dest);
        if (destNode && destNode.type === 'directory') {
            destNode.children!.set(srcNode.name, deepCopy(srcNode));
            return null;
        }

        const pn = getParentAndName(dest);
        if (!pn) return 'Destination parent not found';
        const copy = deepCopy(srcNode);
        copy.name = pn.name;
        pn.parent.children!.set(pn.name, copy);
        return null;
    }

    function mv(src: string, dest: string): string | null {
        const srcNode = getNode(src);
        if (!srcNode) return `Source not found: ${src}`;
        const srcPn = getParentAndName(src);
        if (!srcPn) return 'Cannot move root';

        const destNode = getNode(dest);
        if (destNode && destNode.type === 'directory') {
            destNode.children!.set(srcNode.name, srcNode);
            srcPn.parent.children!.delete(srcPn.name);
            return null;
        }

        const destPn = getParentAndName(dest);
        if (!destPn) return 'Destination parent not found';
        srcNode.name = destPn.name;
        destPn.parent.children!.set(destPn.name, srcNode);
        srcPn.parent.children!.delete(srcPn.name);
        return null;
    }

    function find(startPath: string, namePattern: string): string[] {
        const results: string[] = [];
        const regex = new RegExp('^' + namePattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');

        function walk(node: FSNode, currentPath: string) {
            if (regex.test(node.name)) results.push(currentPath);
            if (node.type === 'directory' && node.children) {
                node.children.forEach((child, name) => {
                    walk(child, currentPath + '/' + name);
                });
            }
        }

        const startNode = getNode(startPath);
        if (startNode) walk(startNode, resolvePath(startPath));
        return results;
    }

    function grep(pattern: string, path: string): string[] {
        const node = getNode(path);
        if (!node || !node.content) return [];
        const regex = new RegExp(pattern, 'gi');
        return node.content.split('\n')
            .map((line, i) => ({ line, num: i + 1, match: regex.test(line) }))
            .filter(l => l.match)
            .map(l => `${l.num}: ${l.line}`);
    }

    function stat(path: string): FSNode | null {
        return getNode(path);
    }

    function chmod(path: string, mode: string): string | null {
        const node = getNode(path);
        if (!node) return `File not found: ${path}`;
        node.permissions = mode;
        return null;
    }

    function getFortune(): string {
        return FORTUNE_QUOTES[Math.floor(Math.random() * FORTUNE_QUOTES.length)];
    }

    function listDir(path: string): FSNode[] {
        const node = getNode(path);
        if (!node || node.type !== 'directory' || !node.children) return [];
        return Array.from(node.children.values());
    }

    return {
        getNode, resolvePath, getCwd, getWindowsPath,
        cd, ls, tree, readFile, writeFile, mkdir, rm, cp, mv,
        find, grep, stat, chmod, getFortune, listDir,
        get root() { return root; }
    };
}

export type FileSystemInstance = ReturnType<typeof createFileSystem>;
