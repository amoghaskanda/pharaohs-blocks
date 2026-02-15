import React from 'react';
import { Tetromino } from '../types';
import Cell from './Cell';

interface NextPieceProps {
  tetromino: Tetromino | null;
}

const NextPiece: React.FC<NextPieceProps> = ({ tetromino }) => {
  if (!tetromino) return <div className="h-24 bg-stone-900 border-2 border-yellow-600/30 rounded-lg"></div>;

  return (
    <div className="bg-stone-900 border-2 border-yellow-600/50 rounded-lg p-4 mb-4 flex flex-col items-center">
      <h3 className="text-yellow-600 font-bold font-egyptian text-lg uppercase tracking-wider mb-4">Prophecy</h3>
      <div 
        className="grid gap-[1px] bg-stone-800 p-1 border border-stone-700"
        style={{
            gridTemplateRows: `repeat(${tetromino.shape.length}, 1fr)`,
            gridTemplateColumns: `repeat(${tetromino.shape[0].length}, 1fr)`,
            width: `${tetromino.shape[0].length * 20}px` 
        }}
      >
        {tetromino.shape.map((row, y) =>
          row.map((cell, x) => (
            <div key={`${y}-${x}`} className="w-5 h-5">
               {cell !== 0 ? <Cell type={tetromino.type} /> : <div className="w-full h-full"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NextPiece;