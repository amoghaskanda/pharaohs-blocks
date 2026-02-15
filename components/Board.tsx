import React from 'react';
import Cell from './Cell';
import { Grid, Player } from '../types';

interface BoardProps {
  grid: Grid;
  player: Player;
}

const Board: React.FC<BoardProps> = ({ grid, player }) => {
  // Merge player into grid for rendering only
  // We do not mutate the actual grid state here, just the visual representation
  const renderGrid = grid.map(row => row.map(cell => cell[0]));

  // Overlay active player
  player.tetromino.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const py = y + player.pos.y;
        const px = x + player.pos.x;
        if (py >= 0 && py < renderGrid.length && px >= 0 && px < renderGrid[0].length) {
            renderGrid[py][px] = player.tetromino.type;
        }
      }
    });
  });

  return (
    <div 
      className="relative w-full h-full p-1 bg-stone-800 border-4 border-yellow-700 rounded-sm shadow-2xl shadow-yellow-900/20 flex flex-col"
      data-testid="game-board"
    >
      {/* Decorative Border Inner */}
      <div className="absolute inset-0 border border-yellow-500/30 pointer-events-none z-10"></div>
      
      <div 
        className="grid grid-rows-[repeat(20,minmax(0,1fr))] grid-cols-[repeat(12,minmax(0,1fr))] gap-[1px] bg-stone-900 border border-stone-950 flex-1"
      >
        {renderGrid.map((row, y) =>
          row.map((cellType, x) => (
            <Cell key={`${y}-${x}`} type={cellType} />
          ))
        )}
      </div>
    </div>
  );
};

export default Board;