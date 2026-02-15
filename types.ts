export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Tetromino {
  shape: number[][];
  color: string;
  type: TetrominoType;
}

export interface Player {
  pos: { x: number; y: number };
  tetromino: Tetromino;
  collided: boolean;
}

export type GridCell = [TetrominoType | 0, string]; // [type, state ('clear' | 'merged')]
export type Grid = GridCell[][];

export enum GameStatus {
  MENU,
  PLAYING,
  PAUSED,
  GAMEOVER
}