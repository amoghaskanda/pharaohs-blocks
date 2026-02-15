import React, { useEffect, useRef } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import Board from './components/Board';
import Display from './components/Display';
import NextPiece from './components/NextPiece';
import { GameStatus } from './types';
import { Pyramid, ScrollText, Trophy, RefreshCcw, Play, Pause } from 'lucide-react';

const App: React.FC = () => {
  const {
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
  } = useGameLogic();

  const boardRef = useRef<HTMLDivElement>(null);

  // We use a ref to store the latest game logic functions.
  // This allows our event listener to remain stable (registered once)
  // while always accessing the most recent state closures from useGameLogic.
  const gameHandlersRef = useRef({
    movePlayer,
    dropPlayer,
    playerRotate,
    hardDrop,
    stopHardDrop,
    gameStatus,
    grid // Needed for rotation
  });

  // Update ref on every render
  useEffect(() => {
    gameHandlersRef.current = {
      movePlayer,
      dropPlayer,
      playerRotate,
      hardDrop,
      stopHardDrop,
      gameStatus,
      grid
    };
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { 
        gameStatus, 
        movePlayer, 
        dropPlayer, 
        playerRotate, 
        hardDrop,
        grid 
      } = gameHandlersRef.current;

      if (gameStatus !== GameStatus.PLAYING) return;

      // Prevent default scrolling for arrow keys and space
      if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight", "Space"].indexOf(e.code) > -1) {
          e.preventDefault();
      }

      if (e.code === 'ArrowLeft') {
        movePlayer(-1);
      } else if (e.code === 'ArrowRight') {
        movePlayer(1);
      } else if (e.code === 'ArrowDown') {
        dropPlayer();
      } else if (e.code === 'ArrowUp') {
        playerRotate(grid, 1);
      } else if (e.code === 'Space') {
        hardDrop();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const { gameStatus, stopHardDrop } = gameHandlersRef.current;
      if (gameStatus !== GameStatus.PLAYING) return;
      
      if (e.code === 'Space') {
        stopHardDrop();
      }
    };

    // Attach to window so we don't need specific focus on the div
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Empty dependency array = listeners attached once!

  return (
    <div 
      className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"
      ref={boardRef}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-black/80 via-transparent to-black/80"></div>
      
      <div className="max-w-[1600px] w-full grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-12 relative z-10 px-6">
        
        {/* Left Column: Stats */}
        <div className="hidden lg:flex flex-col gap-6 justify-center">
            <div className="text-center mb-4">
                <h1 className="text-6xl font-egyptian text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-700 drop-shadow-sm mb-2 leading-tight">Pharaoh's<br/>Blocks</h1>
                <div className="h-1.5 w-32 bg-yellow-600 mx-auto rounded-full"></div>
            </div>
            
            <Display label="Offerings" text={score} icon={<Trophy size={20} />} testId="score-display" />
            <Display label="Rows Built" text={rows} icon={<Pyramid size={20} />} testId="rows-display" />
            <Display label="Dynasty" text={level} icon={<ScrollText size={20} />} testId="level-display" />
        </div>

        {/* Center: Game Board */}
        <div className="flex flex-col items-center justify-center h-full min-h-[85vh]">
          {/* 
              Constrain board to viewport height while maintaining aspect ratio (12 cols / 20 rows = 0.6).
              Using h-[85vh] ensures it dominates the screen without scrolling on most desktops.
          */}
          <div className="relative h-[85vh] w-auto aspect-[12/20] shadow-2xl">
              <Board grid={grid} player={player} />

              {/* Game Over / Menu Overlay - Inside the board wrapper to match dimensions perfectly */}
              {gameStatus !== GameStatus.PLAYING && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-sm border-4 border-yellow-900/50 p-6 text-center">
                  <h2 className="text-5xl font-egyptian text-yellow-500 mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {gameStatus === GameStatus.GAMEOVER ? 'Tomb Sealed' : 'Pharaoh\'s Challenge'}
                  </h2>
                  {gameStatus === GameStatus.GAMEOVER && (
                     <div className="text-2xl mb-8 text-stone-400 font-serif">Final Offerings: <span className="text-white block text-4xl mt-2 font-decorative">{score}</span></div>
                  )}
                  <button 
                    onClick={startGame}
                    data-testid="start-button"
                    className="px-10 py-4 bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-black font-bold font-egyptian uppercase tracking-widest text-xl rounded-sm border border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
                  >
                    {gameStatus === GameStatus.GAMEOVER ? <RefreshCcw size={24}/> : <Play size={24}/>}
                    {gameStatus === GameStatus.GAMEOVER ? 'Reincarnate' : 'Enter Temple'}
                  </button>
                </div>
              )}
          </div>
          
          {/* Mobile Controls (Visible only on small screens) */}
          <div className="lg:hidden mt-6 grid grid-cols-3 gap-4 w-full max-w-xs">
             <button className="h-14 bg-stone-800 rounded border border-stone-600 active:bg-stone-700 flex items-center justify-center text-2xl" onClick={() => movePlayer(-1)}>←</button>
             <button className="h-14 bg-stone-800 rounded border border-stone-600 active:bg-stone-700 flex items-center justify-center text-2xl" onClick={() => playerRotate(grid, 1)}>↻</button>
             <button className="h-14 bg-stone-800 rounded border border-stone-600 active:bg-stone-700 flex items-center justify-center text-2xl" onClick={() => movePlayer(1)}>→</button>
             <button className="h-14 bg-stone-800 rounded border border-stone-600 active:bg-stone-700 flex items-center justify-center text-2xl col-span-3" onMouseDown={hardDrop} onMouseUp={stopHardDrop} onTouchStart={hardDrop} onTouchEnd={stopHardDrop}>↓</button>
          </div>
        </div>

        {/* Right Column: Next Piece & Help */}
        <div className="hidden lg:flex flex-col gap-6 justify-center">
            <NextPiece tetromino={nextPiece} />
            
            <div className="bg-stone-900/50 p-8 rounded-lg border border-stone-800 text-stone-400 text-base font-serif">
                <h3 className="text-yellow-600 font-bold font-egyptian mb-4 uppercase tracking-wider text-xl">Controls</h3>
                <ul className="space-y-3">
                    <li className="flex justify-between items-center"><span>Rotate</span> <span className="text-stone-200 bg-stone-800 px-3 py-1 rounded text-sm border border-stone-700 shadow-sm">↑</span></li>
                    <li className="flex justify-between items-center"><span>Move</span> <span className="text-stone-200 bg-stone-800 px-3 py-1 rounded text-sm border border-stone-700 shadow-sm">← / →</span></li>
                    <li className="flex justify-between items-center"><span>Soft Drop</span> <span className="text-stone-200 bg-stone-800 px-3 py-1 rounded text-sm border border-stone-700 shadow-sm">↓</span></li>
                    <li className="flex justify-between items-center"><span>Fast Drop</span> <span className="text-stone-200 bg-stone-800 px-3 py-1 rounded text-sm border border-stone-700 shadow-sm">Space</span></li>
                </ul>
            </div>

             {/* Pause Button */}
             <button 
                onClick={() => setGameStatus(prev => prev === GameStatus.PLAYING ? GameStatus.PAUSED : GameStatus.PLAYING)}
                data-testid="pause-button"
                className="mt-4 w-full py-4 border border-stone-700 text-stone-500 hover:text-yellow-500 hover:border-yellow-600 transition-colors flex items-center justify-center gap-2 uppercase font-bold text-sm tracking-widest bg-stone-900/30 rounded font-egyptian"
                disabled={gameStatus === GameStatus.MENU || gameStatus === GameStatus.GAMEOVER}
             >
                {gameStatus === GameStatus.PAUSED ? <Play size={18}/> : <Pause size={18}/>}
                {gameStatus === GameStatus.PAUSED ? 'Resume' : 'Pause'}
             </button>
        </div>

        {/* Mobile Stats (Visible only on small screens) */}
        <div className="lg:hidden col-span-1 flex justify-between text-xs font-serif text-stone-400 px-4">
             <div>Score: <span className="text-yellow-500">{score}</span></div>
             <div>Level: <span className="text-yellow-500">{level}</span></div>
        </div>

      </div>
    </div>
  );
};

export default App;