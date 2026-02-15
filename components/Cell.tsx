import React from 'react';
import { TETROMINOS } from '../constants';
import { TetrominoType } from '../types';

interface CellProps {
  type: TetrominoType | 0;
}

const Cell: React.FC<CellProps> = ({ type }) => {
  const color = type ? TETROMINOS[type].color : '0, 0, 0';
  
  // Style for empty cell
  if (type === 0) {
    return (
      <div className="w-full h-full border border-stone-800/50 bg-stone-900/50"></div>
    );
  }

  // Style for occupied cell (Egyptian Gem look)
  return (
    <div 
      className="w-full h-full relative"
      style={{
        backgroundColor: `rgba(${color}, 0.8)`,
        boxShadow: `inset 0 0 4px rgba(0,0,0,0.5), 0 0 10px rgba(${color}, 0.4)`
      }}
    >
        {/* Inner Bevel for Stone/Gem effect */}
        <div className="absolute inset-1 border border-white/30 rounded-sm"></div>
        {/* Hieroglyph-ish decoration opacity */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 text-[8px] text-black font-serif select-none pointer-events-none">
            {type === 'I' && '𓀀'}
            {type === 'J' && '𓁹'}
            {type === 'L' && '𓃭'}
            {type === 'O' && '𓇳'}
            {type === 'S' && '𓆣'}
            {type === 'T' && '𓉐'}
            {type === 'Z' && '𓋹'}
        </div>
    </div>
  );
};

export default React.memo(Cell);