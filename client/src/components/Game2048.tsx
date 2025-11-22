import { useState, useEffect, useCallback } from 'react';

interface Game2048Props {
  onExit: () => void;
}

export default function Game2048({ onExit }: Game2048Props) {
  const [board, setBoard] = useState<number[][]>(() => {
    const initial = Array(4).fill(0).map(() => Array(4).fill(0));
    initial[0][1] = 2;
    initial[0][3] = 4;
    initial[1][0] = 2;
    return initial;
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const stored = localStorage.getItem('2048-highscore');
    return stored ? parseInt(stored) : 0;
  });

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('2048-highscore', score.toString());
    }
  }, [gameOver, score, highScore]);

  const addNewTile = useCallback((currentBoard: number[][]): number[][] => {
    const empty: [number, number][] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentBoard[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }
    if (empty.length === 0) return currentBoard;
    
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    const newBoard = currentBoard.map(row => [...row]);
    newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  }, []);

  const canMove = useCallback((testBoard: number[][]): boolean => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (testBoard[r][c] === 0) return true;
        if (c < 3 && testBoard[r][c] === testBoard[r][c + 1]) return true;
        if (r < 3 && testBoard[r][c] === testBoard[r + 1][c]) return true;
      }
    }
    return false;
  }, []);

  const moveLine = (line: number[]): [number[], number] => {
    // Remove zeros
    const nonZero = line.filter(v => v !== 0);
    
    // Merge adjacent equal tiles
    const merged: number[] = [];
    let score = 0;
    let i = 0;
    
    while (i < nonZero.length) {
      if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
        const newVal = nonZero[i] * 2;
        merged.push(newVal);
        score += newVal;
        i += 2;
      } else {
        merged.push(nonZero[i]);
        i += 1;
      }
    }
    
    // Pad with zeros
    while (merged.length < 4) {
      merged.push(0);
    }
    
    return [merged, score];
  };

  const handleMove = useCallback((direction: string) => {
    setBoard(currentBoard => {
      let newBoard = currentBoard.map(row => [...row]);
      let totalScore = 0;
      let moved = false;

      if (direction === 'ArrowLeft') {
        for (let r = 0; r < 4; r++) {
          const [newLine, lineScore] = moveLine(newBoard[r]);
          newBoard[r] = newLine;
          totalScore += lineScore;
        }
      } else if (direction === 'ArrowRight') {
        for (let r = 0; r < 4; r++) {
          const reversed = newBoard[r].reverse();
          const [newLine, lineScore] = moveLine(reversed);
          newBoard[r] = newLine.reverse();
          totalScore += lineScore;
        }
      } else if (direction === 'ArrowUp') {
        for (let c = 0; c < 4; c++) {
          const column = [0, 1, 2, 3].map(r => newBoard[r][c]);
          const [newLine, lineScore] = moveLine(column);
          [0, 1, 2, 3].forEach(r => (newBoard[r][c] = newLine[r]));
          totalScore += lineScore;
        }
      } else if (direction === 'ArrowDown') {
        for (let c = 0; c < 4; c++) {
          const column = [3, 2, 1, 0].map(r => newBoard[r][c]);
          const [newLine, lineScore] = moveLine(column);
          [3, 2, 1, 0].forEach((r, i) => (newBoard[r][c] = newLine[i]));
          totalScore += lineScore;
        }
      }

      if (totalScore > 0) {
        setScore(s => s + totalScore);
      }

      // Check if board actually changed
      if (JSON.stringify(newBoard) !== JSON.stringify(currentBoard)) {
        moved = true;
        const withNewTile = addNewTile(newBoard);
        if (!canMove(withNewTile)) {
          setGameOver(true);
        }
        return withNewTile;
      }
      
      return currentBoard;
    });
  }, [addNewTile, canMove]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
        return;
      }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        handleMove(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, onExit]);

  const renderCell = (value: number) => {
    const colors: { [key: number]: string } = {
      2: 'bg-[#90ee90]',
      4: 'bg-[#87ceeb]',
      8: 'bg-[#ffd700]',
      16: 'bg-[#ff8c00]',
      32: 'bg-[#00ced1]',
      64: 'bg-[#32cd32]',
      128: 'bg-[#ff6347]',
      256: 'bg-[#9370db]',
      512: 'bg-[#20b2aa]',
      1024: 'bg-[#ff1493]',
      2048: 'bg-primary',
    };
    return (
      <div className={`${value ? colors[value as keyof typeof colors] || 'bg-primary' : 'bg-card'} w-16 h-16 flex items-center justify-center rounded text-2xl font-bold text-background`}>
        {value || ''}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-background flex flex-col items-center justify-center p-4">
      <pre className="text-primary text-sm mb-4">
{`   2048 Game
━━━━━━━━━━━━━━━`}
      </pre>
      <div className="text-foreground mb-2">Score: {score}</div>
      <div className="text-muted-foreground text-sm mb-4">High Score: {highScore}</div>
      <div className="grid grid-cols-4 gap-2 bg-card p-4 rounded mb-4">
        {board.map((row, r) => row.map((val, c) => <div key={`${r}-${c}`}>{renderCell(val)}</div>))}
      </div>
      <div className="text-foreground text-center mb-4">
        <div>Arrow Keys: Move</div>
        <div>ESC: Exit Game</div>
        {gameOver && <div className="text-destructive mt-2">Game Over!</div>}
      </div>
      <button
        onClick={onExit}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-80"
        data-testid="button-exit-game"
      >
        Exit Game
      </button>
    </div>
  );
}
