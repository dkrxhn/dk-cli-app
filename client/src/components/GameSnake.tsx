import { useState, useEffect } from 'react';

interface GameSnakeProps {
  onExit: () => void;
}

export default function GameSnake({ onExit }: GameSnakeProps) {
  const GRID_WIDTH = 20;
  const GRID_HEIGHT = 15;
  const CELL_SIZE = 30;

  const [snake, setSnake] = useState([[5, 5], [5, 6], [5, 7]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState<[number, number]>([-1, 0]);
  const [nextDirection, setNextDirection] = useState<[number, number]>([-1, 0]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const stored = localStorage.getItem('snake-highscore');
    return stored ? parseInt(stored) : 0;
  });

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-highscore', score.toString());
    }
  }, [gameOver, score, highScore]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (gameOver) return;

      const head = snake[0];
      const newHead: [number, number] = [
        (head[0] + nextDirection[0] + GRID_HEIGHT) % GRID_HEIGHT,
        (head[1] + nextDirection[1] + GRID_WIDTH) % GRID_WIDTH,
      ];

      if (snake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...snake];
      const foodEaten = newHead[0] === food[0] && newHead[1] === food[1];

      if (foodEaten) {
        setScore(s => s + 10);
        setFood([Math.floor(Math.random() * GRID_HEIGHT), Math.floor(Math.random() * GRID_WIDTH)]);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
      setDirection(nextDirection);
    }, 100);

    return () => clearInterval(gameLoop);
  }, [snake, direction, nextDirection, gameOver, food]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
        return;
      }
      switch (e.key) {
        case 'ArrowUp':
          if (direction[0] === 0) setNextDirection([-1, 0]);
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (direction[0] === 0) setNextDirection([1, 0]);
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (direction[1] === 0) setNextDirection([0, -1]);
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (direction[1] === 0) setNextDirection([0, 1]);
          e.preventDefault();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  return (
    <div className="w-full h-full bg-background flex flex-col items-center justify-center p-4">
      <pre className="text-primary text-sm mb-4">
{`   SNAKE
━━━━━━━━━━━━━━━`}
      </pre>
      <div className="text-foreground mb-2">Score: {score}</div>
      <div className="text-muted-foreground text-sm mb-4">High Score: {highScore}</div>
      <div
        className="relative bg-card border border-primary"
        style={{
          width: GRID_WIDTH * CELL_SIZE,
          height: GRID_HEIGHT * CELL_SIZE,
        }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className={i === 0 ? 'bg-primary' : 'bg-accent'}
            style={{
              position: 'absolute',
              left: segment[1] * CELL_SIZE,
              top: segment[0] * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              border: '1px solid rgba(0,255,0,0.3)',
            }}
          />
        ))}
        <div
          className="bg-destructive"
          style={{
            position: 'absolute',
            left: food[1] * CELL_SIZE,
            top: food[0] * CELL_SIZE,
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
          }}
        />
      </div>
      <div className="text-foreground text-center mt-4 mb-4">
        <div>Arrow Keys: Move</div>
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
