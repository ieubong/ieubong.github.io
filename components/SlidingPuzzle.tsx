
import React, { useState, useEffect } from 'react';
import { ThemePack } from '../types';
import { MEMORY_DATA } from '../constants';
import { X, RefreshCw, Trophy, Grid3x3, MousePointer2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SlidingPuzzleProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemePack;
}

const SlidingPuzzle: React.FC<SlidingPuzzleProps> = ({ isOpen, onClose, theme }) => {
  const [gridSize, setGridSize] = useState(3); // 3x3
  const [tiles, setTiles] = useState<number[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [emptyIndex, setEmptyIndex] = useState(8); // Last index for 3x3
  const [moves, setMoves] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  // Initialize
  const initGame = () => {
    // Pick random image
    const validMemories = MEMORY_DATA.flatMap(l => l.detail.filter(d => d.img)).map(d => d.img);
    const randomImg = validMemories[Math.floor(Math.random() * validMemories.length)] || "https://picsum.photos/400/400";
    setImageUrl(randomImg);

    // Create sorted array [0, 1, ... 8]
    const arr = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    
    // Shuffle solvable
    let shuffled = shuffle(arr);
    while (!isSolvable(shuffled)) {
        shuffled = shuffle(arr);
    }
    
    setTiles(shuffled);
    setEmptyIndex(shuffled.indexOf(gridSize * gridSize - 1));
    setMoves(0);
    setIsSolved(false);
  };

  useEffect(() => {
    if (isOpen) initGame();
  }, [isOpen]);

  const shuffle = (array: number[]) => {
      const newArr = [...array];
      // Fisher-Yates
      for (let i = newArr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
  };

  // Check solvability for N*N grid (N is odd, here 3)
  const isSolvable = (arr: number[]) => {
      let invCount = 0;
      for (let i = 0; i < arr.length - 1; i++) {
          for (let j = i + 1; j < arr.length; j++) {
               if (arr[i] !== (gridSize * gridSize - 1) && arr[j] !== (gridSize * gridSize - 1) && arr[i] > arr[j]) {
                   invCount++;
               }
          }
      }
      return invCount % 2 === 0;
  };

  const handleTileClick = (index: number) => {
      if (isSolved) return;
      
      // Check adjacency
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      const emptyRow = Math.floor(emptyIndex / gridSize);
      const emptyCol = emptyIndex % gridSize;

      const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

      if (isAdjacent) {
          const newTiles = [...tiles];
          [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
          setTiles(newTiles);
          setEmptyIndex(index);
          setMoves(prev => prev + 1);
          checkWin(newTiles);
      }
  };

  const checkWin = (currentTiles: number[]) => {
      const won = currentTiles.every((val, idx) => val === idx);
      if (won) {
          setIsSolved(true);
          confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

      <div className={`
        relative w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden
        bg-white border-4 border-white/20 animate-pop flex flex-col items-center
        p-6
      `}>
         <div className="w-full flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${theme.colors.primary} text-white shadow-lg`}>
                    <Grid3x3 size={20} />
                </div>
                <h2 className="font-black text-xl text-gray-800">Sliding Puzzle</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
         </div>

         <div className="mb-4 flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
             <span className="flex items-center gap-1"><MousePointer2 size={14} /> {moves} Moves</span>
             <span>•</span>
             <span>3x3 Grid</span>
         </div>

         {/* Game Area */}
         <div className="w-full aspect-square bg-gray-200 rounded-xl overflow-hidden relative border-4 border-gray-100 shadow-inner">
             {isSolved && (
                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in text-white">
                     <Trophy size={48} className="text-yellow-400 mb-2 animate-bounce" />
                     <h2 className="text-3xl font-black">Solved!</h2>
                     <p className="font-bold opacity-80 mt-1">{moves} moves</p>
                 </div>
             )}
             
             {tiles.map((tileNum, index) => {
                 // Calculate position of this slot
                 const x = (index % gridSize) * 100;
                 const y = Math.floor(index / gridSize) * 100;
                 
                 // If it's the empty tile (highest number)
                 if (tileNum === gridSize * gridSize - 1) return null;

                 // Calculate background position based on the original tile number
                 const bgX = (tileNum % gridSize) * (100 / (gridSize - 1));
                 const bgY = Math.floor(tileNum / gridSize) * (100 / (gridSize - 1));

                 return (
                     <div
                        key={tileNum}
                        onClick={() => handleTileClick(index)}
                        className={`absolute w-1/3 h-1/3 border border-white/50 cursor-pointer transition-all duration-200 ease-out active:scale-95 hover:brightness-110`}
                        style={{
                            top: `${y / gridSize}%`,
                            left: `${x / gridSize}%`,
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: `${gridSize * 100}%`,
                            backgroundPosition: `${bgX}% ${bgY}%`
                        }}
                     >
                        {/* Optional number hint */}
                        {/* <span className="absolute top-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded">{tileNum + 1}</span> */}
                     </div>
                 )
             })}
         </div>

         <div className="mt-6 flex justify-center w-full">
            <button 
                onClick={initGame}
                className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 hover:scale-105 transition-transform ${theme.colors.secondary}`}
            >
                <RefreshCw size={20} /> {isSolved ? 'Play Another' : 'Shuffle'}
            </button>
         </div>

         {/* Target Preview */}
         <div className="mt-4 flex flex-col items-center">
             <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Target Image</p>
             <img src={imageUrl} className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-md opacity-70 hover:opacity-100 transition-opacity" alt="Target" />
         </div>
      </div>
    </div>
  );
};

export default SlidingPuzzle;
