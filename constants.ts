import { Tetromino } from './types';

export const GRID_WIDTH = 12;
export const GRID_HEIGHT = 20;

export const TETROMINOS: Record<string, Tetromino> = {
  0: { shape: [[0]], color: '0, 0, 0', type: 'I' }, // Empty placeholder logic if needed
  I: {
    shape: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: '6, 182, 212', // Cyan-500 (Turquoise)
    type: 'I'
  },
  J: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: '59, 130, 246', // Blue-500 (Lapis Lazuli)
    type: 'J'
  },
  L: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: '245, 158, 11', // Amber-500 (Gold)
    type: 'L'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '234, 179, 8', // Yellow-500 (Sun)
    type: 'O'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '16, 185, 129', // Emerald-500 (Scarab)
    type: 'S'
  },
  T: {
    shape: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: '168, 85, 247', // Purple-500 (Amethyst)
    type: 'T'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '239, 68, 68', // Red-500 (Carnelian)
    type: 'Z'
  },
};

export const RANDOM_TETROMINO = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino =
    tetrominos[Math.floor(Math.random() * tetrominos.length)] as keyof typeof TETROMINOS;
  return TETROMINOS[randTetromino];
};