import { useState, useEffect, useRef } from 'react';
import Game2048 from './Game2048';
import GameSnake from './GameSnake';
import GameTetris from './GameTetris';
import CMatrix from './CMatrix';

interface OutputLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp?: Date;
}

let outputIdCounter = 0;
function generateOutputId(): string {
  return `output-${outputIdCounter++}`;
}

const WELCOME_ASCII = `
██████╗ ██╗  ██╗     ██████╗██╗     ██╗
██╔══██╗██║ ██╔╝    ██╔════╝██║     ██║
██║  ██║█████╔╝     ██║     ██║     ██║
██║  ██║██╔═██╗     ██║     ██║     ██║
██████╔╝██║  ██╗    ╚██████╗███████╗██║
╚═════╝ ╚═╝  ╚═╝     ╚═════╝╚══════╝╚═╝

Welcome to DK's Portfolio Terminal v1.0.0
Type 'help' for available commands
`;

const RESUME_CONTENT = `
Summary
IT and security professional with 7+ years of experience in hybrid infrastructure, 
cloud identity, endpoint security, networking, and penetration testing. Skilled in 
Microsoft 365, Azure AD, Intune, AD, Windows, Linux, and security assessment.

Experience

Systems and Security Engineer | July 2021 – September 2025
Supported multi-tenant environments, managed Windows 10/11 provisioning, administered 
Microsoft 365, AD, Azure AD, and Intune. Implemented EDR/DLP, handled GPOs, basic 
networking, server monitoring, patching, backups, and executive technical support.

Penetration Tester | August 2022 – September 2025
Performed web, cloud, and AD penetration tests. Delivered findings and remediation 
guidance. Reported 1 high, 7 medium, and 20+ low severity issues.

Security Consultant | Nov 2019 – Dec 2020
Implemented EDR, DLP, URL filtering, and email security. Assisted with cybersecurity 
risk assessments for SMB clients.

IT Services Technician | Apr 2019 – Oct 2019
Supported macOS systems and configured mesh Wi-Fi networks.

Jr. Network Engineer | Jun 2018 – Jan 2019
Configured Cisco networks for a multi-floor office migration and assisted with 
firewall and ACL migration.

Certifications
Security+
3CX Advanced
CCENT
`;

interface FileSystem {
  [key: string]: {
    type: 'directory' | 'file';
    content?: string;
    children?: string[];
  };
}

const fileSystem: FileSystem = {
  '/': { type: 'directory', children: ['home', '.hidden', 'resume.txt', 'README.md'] },
  '/home': { type: 'directory', children: [] },
  '/.hidden': { type: 'directory', children: ['flag.txt'] },
  '/.hidden/flag.txt': { 
    type: 'file', 
    content: 'aHh4cHMlNUIlM0ElMkYlMkYlNURkYW5rZXJtYW4lNUIlMkUlNURiYW5kY2FtcCU1QiUyRSU1RGNvbSUyRmFsYnVtJTJGY2hyb24lMkQ0' 
  },
  '/resume.txt': { type: 'file', content: RESUME_CONTENT },
  '/README.md': { 
    type: 'file', 
    content: `# Welcome!\n\nThis is an interactive terminal portfolio.\n\nNavigate using standard Linux commands:\n- ls: list files\n- cd: change directory\n- cat: view file contents\n- help: see all commands` 
  },
};

export default function Terminal() {
  const [currentPath, setCurrentPath] = useState('/');
  const [output, setOutput] = useState<OutputLine[]>([
    { id: generateOutputId(), type: 'output', content: WELCOME_ASCII }
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [showCMatrix, setShowCMatrix] = useState(false);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorBlink(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const addOutput = (content: string, type: 'output' | 'error' = 'output') => {
    setOutput(prev => [...prev, {
      id: generateOutputId(),
      type,
      content,
      timestamp: new Date()
    }]);
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setOutput(prev => [...prev, {
      id: generateOutputId(),
      type: 'command',
      content: `visitor@dkportfolio:${currentPath}$ ${trimmedCmd}`
    }]);

    const [command, ...args] = trimmedCmd.split(' ');

    switch (command.toLowerCase()) {
      case 'help':
        addOutput(`Available Commands:
  
  Navigation:
    ls [-a]         - List directory contents (-a shows hidden)
    cd <dir>        - Change directory
    pwd             - Print working directory
    cat <file>      - Display file contents
    clear           - Clear terminal screen
  
  Information:
    resume          - View resume
    about           - About me
    
  External Links:
    blog            - Visit my blog (dkrxhn.github.io)
    github          - Visit my GitHub (github.com/dkrxhn)
    dktech          - Visit DK Tech Support (dktechhelp.com)
    
  Games:
    2048            - Play 2048 puzzle game
    snake           - Play Snake game
    tetris          - Play Tetris game
    
  Fun Stuff:
    cowsay <text>   - ASCII cow says your text
    cmatrix         - Matrix-style falling characters
    
  Utilities:
    help            - Show this help message
    whoami          - Display current user
    date            - Show current date and time`);
        break;

      case 'ls':
        const showHidden = args.some(arg => arg.startsWith('-') && arg.includes('a'));
        const dirContents = fileSystem[currentPath]?.children || [];
        const filteredContents = showHidden 
          ? dirContents 
          : dirContents.filter(item => !item.startsWith('.'));
        
        if (filteredContents.length === 0) {
          addOutput('(empty directory)');
        } else {
          const formatted = filteredContents.map(item => {
            const fullPath = currentPath === '/' ? `/${item}` : `${currentPath}/${item}`;
            const isDir = fileSystem[fullPath]?.type === 'directory';
            return `${isDir ? 'drwxr-xr-x' : '-rw-r--r--'}  ${item}${isDir ? '/' : ''}`;
          }).join('\n');
          addOutput(formatted);
        }
        break;

      case 'pwd':
        addOutput(currentPath);
        break;

      case 'cd':
        if (!args[0] || args[0] === '/') {
          setCurrentPath('/');
          addOutput('');
        } else if (args[0] === '..') {
          if (currentPath !== '/') {
            const newPath = currentPath.split('/').slice(0, -1).join('/') || '/';
            setCurrentPath(newPath);
          }
          addOutput('');
        } else {
          const newPath = currentPath === '/' ? `/${args[0]}` : `${currentPath}/${args[0]}`;
          if (fileSystem[newPath]?.type === 'directory') {
            setCurrentPath(newPath);
            addOutput('');
          } else {
            addOutput(`cd: ${args[0]}: No such directory`, 'error');
          }
        }
        break;

      case 'cat':
        if (!args[0]) {
          addOutput('cat: missing file operand', 'error');
        } else {
          const filePath = currentPath === '/' ? `/${args[0]}` : `${currentPath}/${args[0]}`;
          const file = fileSystem[filePath];
          if (file?.type === 'file') {
            addOutput(file.content || '');
          } else {
            addOutput(`cat: ${args[0]}: No such file`, 'error');
          }
        }
        break;

      case 'resume':
        addOutput(RESUME_CONTENT);
        break;

      case 'about':
        addOutput(`Hi! I'm DK, a software engineer passionate about building great applications.

This portfolio is an interactive terminal experience.
Feel free to explore using Linux commands!

Check out my work:
  • Blog: dkrxhn.github.io
  • GitHub: github.com/dkrxhn  
  • Tech Support: dktechhelp.com`);
        break;

      case 'blog':
        addOutput('Opening blog in new tab...');
        setTimeout(() => window.open('https://dkrxhn.github.io/', '_blank'), 500);
        break;

      case 'github':
        addOutput('Opening GitHub in new tab...');
        setTimeout(() => window.open('https://github.com/dkrxhn', '_blank'), 500);
        break;

      case 'dktech':
        addOutput('Opening DK Tech Support in new tab...');
        setTimeout(() => window.open('https://dktechhelp.com', '_blank'), 500);
        break;

      case 'clear':
        setOutput([]);
        break;

      case 'whoami':
        addOutput('visitor');
        break;

      case 'date':
        addOutput(new Date().toString());
        break;

      case 'cowsay':
        const cowText = args.join(' ') || 'Moo!';
        const bubble = ' ' + '_'.repeat(cowText.length + 2);
        addOutput(`${bubble}
< ${cowText} >
 ${'-'.repeat(cowText.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`);
        break;

      case 'cmatrix':
        setShowCMatrix(true);
        break;

      case '2048':
      case 'snake':
      case 'tetris':
        setGameMode(command.toLowerCase());
        break;

      default:
        addOutput(`${command}: command not found. Type 'help' for available commands.`, 'error');
    }

    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setOutput([]);
    }
  };

  if (gameMode === '2048') {
    return <Game2048 onExit={() => setGameMode(null)} />;
  }
  if (gameMode === 'snake') {
    return <GameSnake onExit={() => setGameMode(null)} />;
  }
  if (gameMode === 'tetris') {
    return <GameTetris onExit={() => setGameMode(null)} />;
  }
  if (showCMatrix) {
    return <CMatrix onExit={() => setShowCMatrix(false)} />;
  }

  return (
    <div className="h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-full max-h-[90vh] flex flex-col rounded-md overflow-hidden border border-border shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-2 bg-card border-b border-border">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" data-testid="button-close" />
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" data-testid="button-minimize" />
            <div className="w-3 h-3 rounded-full bg-primary" data-testid="button-maximize" />
          </div>
          <div className="flex-1 text-center text-sm text-muted-foreground font-mono">
            visitor@dkportfolio: ~
          </div>
        </div>

        <div 
          className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm leading-relaxed"
          onClick={() => inputRef.current?.focus()}
          data-testid="terminal-output"
        >
          {output.map(line => (
            <div 
              key={line.id}
              className={
                line.type === 'command' 
                  ? 'text-foreground' 
                  : line.type === 'error'
                  ? 'text-destructive'
                  : 'text-foreground/90'
              }
            >
              <pre className="whitespace-pre-wrap break-words font-mono">{line.content}</pre>
            </div>
          ))}

          <div className="flex items-center gap-2 text-foreground">
            <span className="text-primary">visitor@dkportfolio</span>
            <span className="text-foreground/60">:</span>
            <span className="text-[#5b9bd5]">{currentPath}</span>
            <span className="text-foreground">$</span>
            <div className="flex-1 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-foreground font-mono caret-transparent"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                data-testid="input-command"
              />
              <span 
                className={`ml-0.5 w-2 h-4 bg-foreground ${cursorBlink ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                style={{ display: 'inline-block' }}
              />
            </div>
          </div>

          <div ref={outputEndRef} />
        </div>
      </div>
    </div>
  );
}
