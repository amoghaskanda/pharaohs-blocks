import { useState, useCallback, useEffect } from 'react';
import { GRID_WIDTH, GRID_HEIGHT, RANDOM_TETROMINO, TETROMINOS } from '../constants';
import { Grid, GameStatus, Player } from '../types';
import { useInterval } from './useInterval';

const createGrid = (): Grid =>
  Array.from(Array(GRID_HEIGHT), () =>
    new Array(GRID_WIDTH).fill([0, 'clear'])
  );

export const useGameLogic = () => {
  const [grid, setGrid] = useState<Grid>(createGrid());
  const [player, setPlayer] = useState<Player>({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0],
    collided: false,
  });
  const [nextPiece, setNextPiece] = useState<Player['tetromino']>(RANDOM_TETROMINO());
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.MENU);
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);
  const [isFastDropping, setIsFastDropping] = useState(false);

  // Checks collision. Returns true if collision detected.
  // We allow Y < 0 (above board) for rotation freedom, but X must be within bounds.
  const checkCollision = (player: Player, grid: Grid, { x: moveX, y: moveY }: { x: number; y: number }) => {
    for (let y = 0; y < player.tetromino.shape.length; y += 1) {
      for (let x = 0; x < player.tetromino.shape[y].length; x += 1) {
        // 1. Check that we're on a Tetromino cell
        if (player.tetromino.shape[y][x] !== 0) {
          const targetY = player.pos.y + y + moveY;
          const targetX = player.pos.x + x + moveX;

          // 2. Check walls (X bounds)
          if (targetX < 0 || targetX >= GRID_WIDTH) {
             return true;
          }

          // 3. Check floor (Y bounds bottom)
          if (targetY >= GRID_HEIGHT) {
            return true;
          }

          // 4. Check grid cell occupancy
          // Only check if we are inside the board area (y >= 0).
          // If we are above the board (y < 0), we treat it as empty space unless standard Tetris rules imply a ceiling.
          if (targetY >= 0) {
             if (grid[targetY][targetX][1] !== 'clear') {
                return true;
             }
          }
        }
      }
    }
    return false;
  };

  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };

  const movePlayer = (dir: number) => {
    if (isFastDropping) return;
    if (!checkCollision(player, grid, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const startGame = () => {
    setGrid(createGrid());
    setGameStatus(GameStatus.PLAYING);
    setIsFastDropping(false);
    resetPlayer();
    setScore(0);
    setRows(0);
    setLevel(1);
    setNextPiece(RANDOM_TETROMINO());
  };

  const resetPlayer = useCallback(() => {
    // If nextPiece is set, use it. Otherwise random.
    const newTetromino = nextPiece ? nextPiece : RANDOM_TETROMINO();
    
    // Spawn in middle-ish
    const initialPos = { x: GRID_WIDTH / 2 - 2, y: 0 };
    
    // Check immediate collision on spawn (Game Over condition)
    const probe = {
        pos: initialPos,
        tetromino: newTetromino,
        collided: false
    };

    if (checkCollision(probe, grid, { x: 0, y: 0 })) {
        setGameStatus(GameStatus.GAMEOVER);
    }

    setPlayer({
      pos: initialPos,
      tetromino: newTetromino,
      collided: false,
    });
    
    setNextPiece(RANDOM_TETROMINO());
  }, [grid, nextPiece]);

  const drop = () => {
    // Increase level every 10 rows
    if (rows > (level + 1) * 10) {
      setLevel((prev) => prev + 1);
    }

    if (!checkCollision(player, grid, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Collision happens
      if (isFastDropping) setIsFastDropping(false);
      
      if (player.pos.y < 0) {
        setGameStatus(GameStatus.GAMEOVER);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const dropPlayer = () => {
    drop();
  };

  const hardDrop = () => {
      setIsFastDropping(true);
  }

  const stopHardDrop = () => {
      setIsFastDropping(false);
  }

  const rotate = (matrix: number[][]) => {
    // Transpose then reverse rows
    const rotated = matrix.map((_, index) =>
      matrix.map((col) => col[index])
    );
    return rotated.map((row) => row.reverse());
  };

  const playerRotate = (grid: Grid) => {
    if (isFastDropping) return;
    
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape);
    
    // Wall kick (basic)
    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, grid, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino.shape[0].length) {
        rotate(clonedPlayer.tetromino.shape); // Rotate back
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  // Game Loop
  useInterval(() => {
    drop();
  }, gameStatus === GameStatus.PLAYING ? (isFastDropping ? 15 : Math.max(100, 1000 / (level === 0 ? 1 : level * 0.8))) : null);

  // Sweep Rows
  useEffect(() => {
      let scoreMultiplier = 0;
      const sweepRows = (newGrid: Grid) => {
        return newGrid.reduce((ack: Grid, row) => {
          if (row.findIndex(cell => cell[0] === 0) === -1) {
            setRows(prev => prev + 1);
            scoreMultiplier += 1;
            ack.unshift(new Array(GRID_WIDTH).fill([0, 'clear']));
            return ack;
          }
          ack.push(row);
          return ack;
        }, []);
      };

      if (player.collided) {
          const newGrid = [...grid];
          player.tetromino.shape.forEach((row, y) => {
              row.forEach((value, x) => {
                  if (value !== 0) {
                      // Avoid out of bounds errors
                      // We only merge if it's within board bounds (y >= 0)
                      if (y + player.pos.y >= 0 && newGrid[y + player.pos.y] && newGrid[y + player.pos.y][x + player.pos.x]) {
                        newGrid[y + player.pos.y][x + player.pos.x] = [
                            player.tetromino.type,
                            'merged',
                        ];
                      }
                  }
              });
          });

          const sweptGrid = sweepRows(newGrid);
          setGrid(sweptGrid);
          
          // Score calc
          if (scoreMultiplier > 0) {
              const points = [0, 40, 100, 300, 1200];
              setScore(prev => prev + points[scoreMultiplier] * level);
          }

          resetPlayer();
      }
  }, [player.collided, player.tetromino, player.pos, grid, level, resetPlayer]);


  return {
    grid,
    player,
    score,
    rows,
    level,
    gameStatus,
    nextPiece,
    setGameStatus,
    startGame,
    movePlayer,
    dropPlayer,
    hardDrop,
    stopHardDrop,
    playerRotate,
  };
};