import { useState, useEffect, useRef } from 'react';

interface CMatrixProps {
  onExit: () => void;
}

interface Character {
  id: string;
  x: number;
  y: number;
  opacity: number;
  char: string;
  speed: number;
}

export default function CMatrix({ onExit }: CMatrixProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const onExitRef = useRef(onExit);
  const charsRef = useRef('01ｦｧｨｩｪｫｬｭｮｯﾀﾁﾂﾃﾄﾅﾆﾇﾈﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾙﾚﾜﾝ');
  const streamSpeedsRef = useRef<{ [key: number]: number }>({});
  const idCounterRef = useRef(0);

  useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  useEffect(() => {
    const cellHeight = 20;
    const cols = Math.floor(window.innerWidth / cellHeight);
    const screenHeight = window.innerHeight;

    // Initialize random speeds for each stream
    for (let i = 0; i < cols; i++) {
      streamSpeedsRef.current[i] = Math.random() * 2 + 1.5;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.key === 'c' && e.ctrlKey)) {
        onExitRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const animationInterval = setInterval(() => {
      setCharacters(prev => {
        const updated = prev
          .map(char => ({
            ...char,
            y: char.y + char.speed,
            opacity: Math.max(0, char.opacity - 0.01),
          }))
          .filter(char => char.y < screenHeight + 100 && char.opacity > 0);

        // Spawn new characters
        const now = Date.now();
        for (let i = 0; i < cols; i++) {
          if (Math.random() < 0.5) {
            updated.push({
              id: `${now}-${idCounterRef.current++}`,
              x: i,
              y: -cellHeight,
              opacity: 1,
              char: charsRef.current[Math.floor(Math.random() * charsRef.current.length)],
              speed: streamSpeedsRef.current[i],
            });
          }
        }

        return updated;
      });
    }, 50);

    return () => {
      clearInterval(animationInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-background text-primary overflow-hidden relative font-mono text-lg leading-none">
      {characters.map(char => (
        <div
          key={char.id}
          style={{
            position: 'absolute',
            left: `${char.x * 20}px`,
            top: `${char.y}px`,
            opacity: char.opacity,
            textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
            whiteSpace: 'nowrap',
            color: '#00ff00',
          }}
        >
          {char.char}
        </div>
      ))}
      <div className="absolute bottom-4 left-4 text-foreground">
        <div>Matrix Digital Rain</div>
        <div className="text-muted-foreground text-xs">ESC or Ctrl+C to exit</div>
      </div>
    </div>
  );
}
