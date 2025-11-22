import { useState, useEffect } from 'react';

interface GameTetrisProps {
  onExit: () => void;
}

type Tetromino = number[][];

const TETROMINOS: Tetromino[] = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
];

export default function GameTetris({ onExit }: GameTetrisProps) {
  const COLS = 10;
  const ROWS = 20;
  const [board, setBoard] = useState<number[][]>(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
  const [piece, setPiece] = useState<{ shape: Tetromino; x: number; y: number }>({
    shape: TETROMINOS[0],
    x: 3,
    y: 0,
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const stored = localStorage.getItem('tetris-highscore');
    return stored ? parseInt(stored) : 0;
  });

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('tetris-highscore', score.toString());
    }
  }, [gameOver, score, highScore]);

  const canPlace = (shape: Tetromino, x: number, y: number, testBoard: number[][]): boolean => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newY = y + row;
          const newX = x + col;
          if (newY >= ROWS || newX < 0 || newX >= COLS || (newY >= 0 && testBoard[newY]?.[newX])) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placePiece = () => {
    const newBoard = board.map(row => [...row]);
    const { shape, x, y } = piece;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] && y + row >= 0) {
          newBoard[y + row][x + col] = 1;
        }
      }
    }

    let rowsCleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row].every(cell => cell === 1)) {
        newBoard.splice(row, 1);
        newBoard.unshift(Array(COLS).fill(0));
        rowsCleared++;
      }
    }

    if (rowsCleared > 0) {
      setScore(s => s + rowsCleared * 100);
    }

    setBoard(newBoard);
    const nextPiece = { shape: TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)], x: 3, y: 0 };

    if (!canPlace(nextPiece.shape, nextPiece.x, nextPiece.y, newBoard)) {
      setGameOver(true);
    } else {
      setPiece(nextPiece);
    }
  };

  useEffect(() => {
    if (gameOver) return;
    const gameLoop = setInterval(() => {
      if (canPlace(piece.shape, piece.x, piece.y + 1, board)) {
        setPiece(p => ({ ...p, y: p.y + 1 }));
      } else {
        placePiece();
      }
    }, 500);
    return () => clearInterval(gameLoop);
  }, [piece, board, gameOver]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onExit();
      return;
    }
    if (e.key === 'ArrowLeft' && canPlace(piece.shape, piece.x - 1, piece.y, board)) {
      setPiece(p => ({ ...p, x: p.x - 1 }));
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && canPlace(piece.shape, piece.x + 1, piece.y, board)) {
      setPiece(p => ({ ...p, x: p.x + 1 }));
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (canPlace(piece.shape, piece.x, piece.y + 1, board)) {
        setPiece(p => ({ ...p, y: p.y + 1 }));
      }
      e.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [piece, board]);

  return (
    <div className="w-full h-full bg-background flex flex-col items-center justify-center p-4">
      <pre className="text-primary text-sm mb-4">
{`   TETRIS
━━━━━━━━━━━━━━━`}
      </pre>
      <div className="text-foreground mb-2">Score: {score}</div>
      <div className="text-muted-foreground text-sm mb-4">High Score: {highScore}</div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isPiece = piece.shape.some((prow, pr) =>
              prow.some((pcol, pc) => pcol && r === piece.y + pr && c === piece.x + pc)
            );
            return (
              <div
                key={`${r}-${c}`}
                className={`w-6 h-6 border border-border ${
                  cell ? 'bg-destructive' : isPiece ? 'bg-primary' : 'bg-card'
                }`}
              />
            );
          })
        )}
      </div>
      <div className="text-foreground text-center mt-4 mb-4">
        <div>Arrow Keys: Move & Drop</div>
        <div>ESC: Exit Game</div>
        {gameOver && <div className="text-destructive mt-2">Game Over! Final Score: {score}</div>}
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
