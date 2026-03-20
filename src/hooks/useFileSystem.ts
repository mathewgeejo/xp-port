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
    target?: string;
    readOnly?: boolean;
}

const FORTUNE_QUOTES = [
    "The best error message is the one that never shows up.",
    "First, solve the problem. Then, write the code. - John Johnson",
    "Code is like humor. When you have to explain it, it is bad. - Cory House",
    "Fix the cause, not the symptom. - Steve Maguire",
    "Simplicity is the soul of efficiency. - Austin Freeman",
    "Make it work, make it right, make it fast. - Kent Beck",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
    "It works on my machine. -- Every developer, since the dawn of time.",
    "Talk is cheap. Show me the code. - Linus Torvalds",
    "Programs must be written for people to read, and only incidentally for machines to execute. - Harold Abelson",
    "Debugging is twice as hard as writing the code in the first place. - Brian Kernighan",
    "Perfection is achieved not when there is nothing more to add, but when there is nothing more to take away. - Antoine de Saint-Exupery",
];

function mkFile(name: string, content: string, hidden = false, readOnly = false): FSNode {
    const now = new Date();
    return { type: 'file', name, content, permissions: readOnly ? '-r--r--r--' : '-rw-r--r--', size: content.length, created: now, modified: now, hidden, readOnly };
}

function mkDir(name: string, children: Map<string, FSNode>, hidden = false): FSNode {
    const now = new Date();
    return { type: 'directory', name, children, permissions: 'drwxr-xr-x', size: 4096, created: now, modified: now, hidden };
}

function m(entries: [string, FSNode][]): Map<string, FSNode> {
    return new Map(entries);
}

function buildInitialFS(): FSNode {
    // === PROJECTS ===
    const krishh = m([
        ['README.md', mkFile('README.md',
            `# krishh-ai-companion
AI-powered educational voice assistant for students.

## Overview
Krishh is an AI companion that runs on Raspberry Pi and can be
deployed on a humanoid robot. It listens for the wake words
"Hey Krishna" or "Hello Krishna" and responds with intelligent,
educational answers.

## Tech Stack
- Python (core language)
- Google Gemini AI (intelligence engine)
- Porcupine Wake Word Detection
- gTTS (Google Text-to-Speech)
- Google Speech Recognition
- Raspberry Pi (deployment target)

## Features
- Wake word activation ("Hey Krishna" / "Hello Krishna")
- Bilingual support: English and Malayalam
- Educational Q&A for students
- Voice-first interaction model
- Deployable on humanoid robot hardware

## Links
- GitHub: https://github.com/mathewgeejo/krishh-ai-companion
- Author: Mathew Geejo
`)],
        ['tech-stack.txt', mkFile('tech-stack.txt',
            `krishh-ai-companion Tech Stack
================================
Language:       Python
AI Engine:      Google Gemini AI
Wake Word:      Porcupine
TTS:            gTTS (Google Text-to-Speech)
STT:            Google Speech Recognition
Hardware:       Raspberry Pi
Languages:      English, Malayalam
`)]
    ]);

    const nimbusX = m([
        ['README.md', mkFile('README.md',
            `# NimbusX
"Will It Rain On My Parade?"
NASA Space Apps Challenge 2024 Hackathon Project

## Overview
NimbusX predicts extreme weather probabilities using NASA POWER
API climate data. It provides AI-powered summaries via Google
Gemini API to help users understand weather patterns.

## Tech Stack
### Backend
- Flask (Python)
- NumPy / Pandas (data processing)
- NASA POWER API (climate data source)
- Google Gemini API (AI summaries)

### Frontend
- React.js
- TailwindCSS
- Chart.js (data visualization)
- Leaflet.js (interactive maps)

## Features
- Extreme weather probability prediction
- Interactive maps with Leaflet.js
- Climate data visualization with Chart.js
- AI-powered weather summaries
- Full-stack architecture

## Links
- GitHub: https://github.com/mathewgeejo/NimbusX
- Author: Mathew Geejo
`)],
        ['tech-stack.txt', mkFile('tech-stack.txt',
            `NimbusX Tech Stack
================================
Backend:        Flask (Python)
Data:           NumPy, Pandas
API:            NASA POWER API, Google Gemini API
Frontend:       React.js, TailwindCSS
Charts:         Chart.js
Maps:           Leaflet.js
Challenge:      NASA Space Apps 2024
`)]
    ]);

    const deepfake = m([
        ['README.md', mkFile('README.md',
            `# MultiModal-Deepfake-and-Gen-AI-Detector
Multimodal deepfake and AI-generated content detector.

## Overview
A research project focused on detecting deepfake media and
AI-generated content across multiple modalities (text, image,
video) using machine learning techniques.

## Tech Stack
- Jupyter Notebook (research & experiments)
- Python (core language)
- Machine Learning / Deep Learning frameworks

## Links
- GitHub: https://github.com/mathewgeejo/MultiModal-Deepfake-and-Gen-AI-detector
- Author: Mathew Geejo
`)]
    ]);

    const rcIp = m([
        ['README.md', mkFile('README.md',
            `# rc-ip-interface
RC (Remote Control) IP Network Interface

## Overview
A mobile application built with Kivy/Python for controlling
remote devices over IP networks. Includes a network monitoring
module for real-time connection status.

## Tech Stack
- Python (core language)
- Kivy (cross-platform UI framework)
- Buildozer (Android build tool)
- Network monitoring module

## Features
- Remote control over IP network
- Android deployment via Buildozer
- Real-time network monitoring
- Cross-platform mobile interface

## Links
- GitHub: https://github.com/mathewgeejo/rc-ip-interface
- Author: Mathew Geejo
`)]
    ]);

    const skillSync = m([
        ['README.md', mkFile('README.md',
            `# SkillSync
Skill synchronization and matching platform.

## Overview
SkillSync is a platform for matching skills between
individuals, teams, and projects. It helps connect
people with complementary skill sets.

## Links
- GitHub: https://github.com/mathewgeejo/SkillSync
- Author: Mathew Geejo
`)]
    ]);

    const projectsDir = m([
        ['krishh-ai-companion', mkDir('krishh-ai-companion', krishh)],
        ['NimbusX', mkDir('NimbusX', nimbusX)],
        ['MultiModal-Deepfake-Detector', mkDir('MultiModal-Deepfake-Detector', deepfake)],
        ['rc-ip-interface', mkDir('rc-ip-interface', rcIp)],
        ['SkillSync', mkDir('SkillSync', skillSync)],
    ]);

    // === DOCUMENTS ===
    const documentsDir = m([
        ['about-me.txt', mkFile('about-me.txt',
            `=== ABOUT MATHEW GEEJO ===

Hi, I'm Mathew Geejo -- a developer from Kerala, India with a
deep passion for AI, IoT, robotics, and full-stack web development.

I love building things that blend hardware and software -- from
AI voice assistants running on Raspberry Pi to full-stack weather
prediction platforms built for NASA hackathons.

My work spans across:
  - AI/ML: Building intelligent systems with Google Gemini AI,
    deepfake detection, and educational AI companions
  - IoT & Robotics: Raspberry Pi projects, remote control
    interfaces, and humanoid robot deployments
  - Full-Stack Web: React.js, Flask, TailwindCSS, data
    visualization with Chart.js and Leaflet.js
  - Mobile: Cross-platform apps with Kivy/Python

When I'm not coding, you can find me exploring new tech,
contributing to open source, or building the next prototype.

This entire portfolio is a love letter to the golden age of
desktop computing. Every pixel has been carefully crafted.

Location: Kerala, India
GitHub: https://github.com/mathewgeejo (51 followers, 30 repos)
LinkedIn: www.linkedin.com/in/mathewgeejo
`)],
        ['resume.txt', mkFile('resume.txt',
            `================================================================
           MATHEW GEEJO | Developer | Kerala, India
================================================================

CONTACT
-------
GitHub:   https://github.com/mathewgeejo (51 followers, 30 repos)
LinkedIn: www.linkedin.com/in/mathewgeejo
Location: Kerala, India

SUMMARY
-------
Developer from Kerala, India with expertise in AI, IoT, robotics,
and full-stack web development. Builder of AI voice assistants,
NASA hackathon weather platforms, and deepfake detectors.

SKILLS
------
Languages:   Python, JavaScript, TypeScript, HTML, CSS
Frameworks:  React.js, Flask, TailwindCSS, Kivy, Next.js
AI/ML:       Google Gemini AI, Jupyter Notebook, NumPy, Pandas
IoT:         Raspberry Pi, Porcupine Wake Word, gTTS
Data Viz:    Chart.js, Leaflet.js
Tools:       Git, Buildozer, Speech Recognition

PROJECTS
--------
1. krishh-ai-companion
   AI-powered educational voice assistant for students
   Runs on Raspberry Pi, deployable on humanoid robot
   Wake word: "Hey Krishna" / "Hello Krishna"
   Tech: Python, Google Gemini AI, Porcupine, gTTS
   Supports English and Malayalam

2. NimbusX
   "Will It Rain On My Parade?"
   NASA Space Apps Challenge 2024 Hackathon Project
   Predicts extreme weather using NASA POWER API
   Tech: Flask, React.js, TailwindCSS, Chart.js, Leaflet.js

3. MultiModal-Deepfake-and-Gen-AI-Detector
   Multimodal deepfake and AI-generated content detector
   Tech: Jupyter Notebook, Python

4. rc-ip-interface
   RC IP network interface with mobile app
   Tech: Python, Kivy, Buildozer (Android)

5. SkillSync
   Skill synchronization/matching platform

EDUCATION
---------
[University Name] | [Degree] | [Year]

================================================================
`)],
        ['cover-letter.txt', mkFile('cover-letter.txt',
            `Dear Hiring Manager,

I am Mathew Geejo, a developer from Kerala, India. I build
things at the intersection of AI, IoT, and web development.

My portfolio speaks for itself -- I built an entire Windows
Vista operating system in the browser just to show you my work.
If that level of dedication appeals to you, we should talk.

I have built AI voice assistants that run on Raspberry Pi and
respond to wake words in multiple languages. I have predicted
extreme weather for a NASA hackathon. I have detected deepfakes
with machine learning. And yes, I have made RC cars controllable
over IP networks from a mobile app.

The common thread: I love taking complex problems and turning
them into working software that people can actually use.

Looking forward to building something amazing together.

Best regards,
Mathew Geejo
Kerala, India

GitHub: https://github.com/mathewgeejo
LinkedIn: www.linkedin.com/in/mathewgeejo

P.S. Try typing "sudo rm -rf /" in my terminal. I dare you.
`)]
    ]);

    // === DESKTOP ===
    const desktopDir = m([
        ['About Me.lnk', mkFile('About Me.lnk', '[Desktop Entry]\nType=Link\nTarget=Welcome Center')],
        ['My Computer.lnk', mkFile('My Computer.lnk', '[Desktop Entry]\nType=Link\nTarget=File Manager')],
        ['Projects.lnk', mkFile('Projects.lnk', '[Desktop Entry]\nType=Link\nTarget=Projects Folder')],
        ['Experience.txt', mkFile('Experience.txt',
            `=== MATHEW GEEJO - DEVELOPER ===
Location: Kerala, India
GitHub: https://github.com/mathewgeejo (51 followers, 30 repos)
LinkedIn: www.linkedin.com/in/mathewgeejo

--- BACKGROUND ---
Developer from Kerala, India passionate about AI, IoT, robotics,
and full-stack web development.

--- KEY PROJECTS ---
* krishh-ai-companion: AI voice assistant on Raspberry Pi
  with Google Gemini AI, wake word detection, bilingual support

* NimbusX: NASA Space Apps 2024 hackathon weather predictor
  using NASA POWER API, React.js, Flask, Chart.js, Leaflet.js

* MultiModal-Deepfake-Detector: ML-based deepfake detection

* rc-ip-interface: Remote control over IP with Kivy mobile app

* SkillSync: Skill matching platform

--- SKILLS ---
Python, React.js, Flask, TailwindCSS, Google Gemini AI,
Raspberry Pi, Kivy, NumPy, Pandas, Chart.js, Leaflet.js,
Jupyter Notebook, Git, Next.js, TypeScript
`)],
        ['Contact Me.lnk', mkFile('Contact Me.lnk', '[Desktop Entry]\nType=Link\nTarget=Windows Mail')],
    ]);

    // === MUSIC / PICTURES ===
    const musicDir = m([
        ['playlist.txt', mkFile('playlist.txt',
            `=== MATHEW'S CODING PLAYLIST ===

1. Interstellar Main Theme - Hans Zimmer
2. Time - Hans Zimmer
3. Strobe - Deadmau5
4. Intro - The xx
5. Midnight City - M83
6. Clair de Lune - Debussy
7. Comptine d'un autre ete - Yann Tiersen
8. Nightcall - Kavinsky
9. Digital Love - Daft Punk
10. Around the World - Daft Punk

Best played at 2 AM with a cup of coffee and a tricky bug.
`)]
    ]);

    const picturesDir = m([
        ['readme.txt', mkFile('readme.txt', 'No pictures yet. Check back soon.\n')]
    ]);

    // === HIDDEN / EASTER EGGS ===
    const secretDir = m([
        ['encrypted.dat', mkFile('encrypted.dat',
            `-----BEGIN ENCRYPTED MESSAGE-----
Vm0wd2QyUXlVWGxWV0d4V1YwZDRWMVl3WkRSV01WbDNXa1JT
VjAxV2JETlhhMUpUVmpBeFYySkVUbGhoTVVwVVZtcEJlRll5
-----END ENCRYPTED MESSAGE-----

(The password is "hunter2" but you did not hear that from me.)
`, true)]
    ]);

    const deepBuried = m([
        ['.love-letter.txt', mkFile('.love-letter.txt',
            `Dear Reader,

If you found this file, you are either:
a) A very thorough explorer
b) Someone who read the source code
c) Running 'find / -name "*.txt"' like a pro

This portfolio was built with mass amounts of caffeine and
"it works on my machine" confidence.

With love and semicolons,
Mathew Geejo

P.S. The real treasure was the bugs we fixed along the way.
`, true)]
    ]);

    // === USER DIR ===
    const userDir = m([
        ['Desktop', mkDir('Desktop', desktopDir)],
        ['Documents', mkDir('Documents', documentsDir)],
        ['Projects', mkDir('Projects', projectsDir)],
        ['Music', mkDir('Music', musicDir)],
        ['Pictures', mkDir('Pictures', picturesDir)],
        ['.secret', mkDir('.secret', secretDir, true)],
        ['.deep', mkDir('.deep', m([['buried', mkDir('buried', deepBuried)]]), true)],
        ['.bashrc', mkFile('.bashrc', '# Mathew\'s bashrc\nexport PS1="C:\\\\Users\\\\Mathew> "\nalias ll="ls -la"\n', true)],
    ]);

    // === ETC ===
    const etcDir = m([
        ['hostname', mkFile('hostname', 'MATHEW-PC')],
        ['motd', mkFile('motd',
            `
  __  __       _   _
 |  \\/  | __ _| |_| |__   _____      __
 | |\\/| |/ _\` | __| '_ \\ / _ \\ \\ /\\ / /
 | |  | | (_| | |_| | | |  __/\\ V  V /
 |_|  |_|\\__,_|\\__|_| |_|\\___| \\_/\\_/

   ____                _
  / ___| ___  ___     (_) ___
 | |  _ / _ \\/ _ \\    | |/ _ \\
 | |_| |  __/  __/    | | (_) |
  \\____|\\___|\\___| _/ |_|\\___/
                  |__/

  Welcome! Type 'help' for commands.
  Type 'fortune' for wisdom. Type 'hack' for fun.

`)],
        ['passwd', mkFile('passwd', 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:Mathew:/home/user:/bin/bash\n')],
    ]);

    // === VAR/LOG ===
    const logEntries = Array.from({ length: 20 }, (_, i) => {
        const h = String(Math.floor(Math.random() * 24)).padStart(2, '0');
        const mm = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const s = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const msgs = [
            'kernel: [    0.000000] Linux version 2.6.32-xp (mathew@MATHEW-PC)',
            'systemd[1]: Started portfolio.service',
            'kernel: TCP: Hash tables configured (16384 bind 16384)',
            'NetworkManager: <info> (eth0): connection established',
            'sshd[1234]: Accepted publickey for mathew from 127.0.0.1',
            'crond[567]: (mathew) CMD (/usr/bin/check_dreams)',
            'kernel: [drm] Initialized retro_gpu 1.0.0 for Nostalgia Engine',
            'portfolio.exe[890]: Rendering desktop at 60fps',
            'systemd[1]: Started Windows XP Compatibility Layer v42.0',
            'kernel: USB: New device found, idVendor=cafe, idProduct=babe',
        ];
        return `2024-01-${String(i + 1).padStart(2, '0')} ${h}:${mm}:${s} ${msgs[i % msgs.length]}`;
    }).join('\n');

    const varDir = m([
        ['log', mkDir('log', m([['system.log', mkFile('system.log', logEntries)]]))]
    ]);

    // === C: DRIVE (Windows alias) ===
    const cUsersDir = m([
        ['Mathew', mkDir('Mathew', m([
            ['Desktop', mkDir('Desktop', new Map(desktopDir))],
            ['Documents', mkDir('Documents', new Map(documentsDir))],
            ['Projects', mkDir('Projects', m([]))],
        ]))]
    ]);

    const cDir = m([
        ['Users', mkDir('Users', cUsersDir)],
        ['Windows', mkDir('Windows', m([
            ['System32', mkDir('System32', m([
                ['cmd.exe', mkFile('cmd.exe', '[Binary: Windows Command Processor]', false, true)],
                ['notepad.exe', mkFile('notepad.exe', '[Binary: Notepad Text Editor]', false, true)],
                ['explorer.exe', mkFile('explorer.exe', '[Binary: Windows Explorer]', false, true)],
            ]))]
        ]))]
    ]);

    return mkDir('/', m([
        ['home', mkDir('home', m([['user', mkDir('user', userDir)]]))],
        ['etc', mkDir('etc', etcDir)],
        ['var', mkDir('var', varDir)],
        ['tmp', mkDir('tmp', m([]))],
        ['C:', mkDir('C:', cDir)],
    ]));
}

export function createFileSystem() {
    const root = buildInitialFS();
    let cwdPath = '/home/user';
    let changeListeners: (() => void)[] = [];

    function onChange() { changeListeners.forEach(fn => fn()); }
    function subscribe(fn: () => void) { changeListeners.push(fn); return () => { changeListeners = changeListeners.filter(f => f !== fn); }; }

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
        if (unixPath.startsWith('/C:')) return unixPath.replace(/^\/C:/, 'C:').replace(/\//g, '\\');
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
        const entries = Array.from(node.children.values()).filter(e => showAll || !e.hidden).sort((a, b) => a.name.localeCompare(b.name));
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

    function tree(path: string, prefix = ''): string {
        const resolved = resolvePath(path || '.');
        const node = getNode(resolved);
        if (!node || node.type !== 'directory' || !node.children) return '';
        const entries = Array.from(node.children.values()).filter(e => !e.hidden).sort((a, b) => a.name.localeCompare(b.name));
        let result = '';
        entries.forEach((entry, idx) => {
            const last = idx === entries.length - 1;
            const connector = last ? '\\-- ' : '+-- ';
            const childPrefix = last ? '    ' : '|   ';
            result += prefix + connector + entry.name + '\n';
            if (entry.type === 'directory' && entry.children) {
                result += tree(resolvePath(path + '/' + entry.name), prefix + childPrefix);
            }
        });
        return result;
    }

    function readFile(path: string): string | null {
        const node = getNode(path);
        if (!node || node.type === 'directory') return null;
        return node.content || '';
    }

    function writeFile(path: string, content: string): string | null {
        const existing = getNode(path);
        if (existing) {
            if (existing.type === 'directory') return 'Is a directory';
            if (existing.readOnly) return 'Permission denied: file is read-only';
            existing.content = content;
            existing.size = content.length;
            existing.modified = new Date();
            onChange();
            return null;
        }
        const pn = getParentAndName(path);
        if (!pn) return 'Parent directory not found';
        const newFile = mkFile(pn.name, content);
        pn.parent.children!.set(pn.name, newFile);
        onChange();
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
                    child = mkDir(part, m([]));
                    current.children.set(part, child);
                } else if (child.type !== 'directory') return `${part} exists and is not a directory`;
                current = child;
            }
            onChange();
            return null;
        }
        const pn = getParentAndName(path);
        if (!pn) return 'Parent directory not found';
        if (pn.parent.children!.has(pn.name)) return `Already exists: ${pn.name}`;
        pn.parent.children!.set(pn.name, mkDir(pn.name, m([])));
        onChange();
        return null;
    }

    function rm(path: string, recursive = false, force = false): string | null {
        const pn = getParentAndName(path);
        if (!pn) return force ? null : `File not found: ${path}`;
        const target = pn.parent.children!.get(pn.name);
        if (!target) return force ? null : `File not found: ${path}`;
        if (target.type === 'directory' && !recursive) return `Is a directory (use -r): ${pn.name}`;
        pn.parent.children!.delete(pn.name);
        onChange();
        return null;
    }

    function cp(src: string, dest: string, recursive = false): string | null {
        const srcNode = getNode(src);
        if (!srcNode) return `Source not found: ${src}`;
        if (srcNode.type === 'directory' && !recursive) return 'Is a directory (use -r)';
        function deepCopy(node: FSNode): FSNode {
            const copy = { ...node, created: new Date(), modified: new Date() };
            if (node.children) { copy.children = new Map(); node.children.forEach((v, k) => copy.children!.set(k, deepCopy(v))); }
            return copy;
        }
        const destNode = getNode(dest);
        if (destNode && destNode.type === 'directory') { destNode.children!.set(srcNode.name, deepCopy(srcNode)); onChange(); return null; }
        const pn = getParentAndName(dest);
        if (!pn) return 'Destination parent not found';
        const copy = deepCopy(srcNode); copy.name = pn.name;
        pn.parent.children!.set(pn.name, copy);
        onChange();
        return null;
    }

    function mv(src: string, dest: string): string | null {
        const srcNode = getNode(src);
        if (!srcNode) return `Source not found: ${src}`;
        const srcPn = getParentAndName(src);
        if (!srcPn) return 'Cannot move root';
        const destNode = getNode(dest);
        if (destNode && destNode.type === 'directory') { destNode.children!.set(srcNode.name, srcNode); srcPn.parent.children!.delete(srcPn.name); onChange(); return null; }
        const destPn = getParentAndName(dest);
        if (!destPn) return 'Destination parent not found';
        srcNode.name = destPn.name;
        destPn.parent.children!.set(destPn.name, srcNode);
        srcPn.parent.children!.delete(srcPn.name);
        onChange();
        return null;
    }

    function rename(path: string, newName: string): string | null {
        const pn = getParentAndName(path);
        if (!pn) return 'Not found';
        const node = pn.parent.children!.get(pn.name);
        if (!node) return 'Not found';
        if (pn.parent.children!.has(newName)) return `Already exists: ${newName}`;
        pn.parent.children!.delete(pn.name);
        node.name = newName;
        pn.parent.children!.set(newName, node);
        onChange();
        return null;
    }

    function find(startPath: string, namePattern: string): string[] {
        const results: string[] = [];
        const regex = new RegExp('^' + namePattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
        function walk(node: FSNode, currentPath: string) {
            if (regex.test(node.name)) results.push(currentPath);
            if (node.type === 'directory' && node.children) node.children.forEach((child, name) => walk(child, currentPath + '/' + name));
        }
        const startNode = getNode(startPath);
        if (startNode) walk(startNode, resolvePath(startPath));
        return results;
    }

    function grep(pattern: string, path: string): string[] {
        const node = getNode(path);
        if (!node || !node.content) return [];
        const regex = new RegExp(pattern, 'gi');
        return node.content.split('\n').map((line, i) => ({ line, num: i + 1, match: regex.test(line) })).filter(l => l.match).map(l => `${l.num}: ${l.line}`);
    }

    function stat(path: string): FSNode | null { return getNode(path); }
    function chmod(path: string, mode: string): string | null { const node = getNode(path); if (!node) return `Not found: ${path}`; node.permissions = mode; onChange(); return null; }
    function getFortune(): string { return FORTUNE_QUOTES[Math.floor(Math.random() * FORTUNE_QUOTES.length)]; }
    function listDir(path: string): FSNode[] { const node = getNode(path); if (!node || node.type !== 'directory' || !node.children) return []; return Array.from(node.children.values()); }

    return {
        getNode, resolvePath, getCwd, getWindowsPath,
        cd, ls, tree, readFile, writeFile, mkdir, rm, cp, mv, rename,
        find, grep, stat, chmod, getFortune, listDir, subscribe, onChange,
        get root() { return root; }
    };
}

export type FileSystemInstance = ReturnType<typeof createFileSystem>;
