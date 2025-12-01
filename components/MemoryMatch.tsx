
import React, { useState, useEffect } from 'react';
import { ThemePack } from '../types';
import { MEMORY_DATA } from '../constants';
import { X, RefreshCw, Trophy, Timer, MousePointer2, Brain, Image as ImageIcon, Type, Check, Ban } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemoryMatchProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemePack;
}

interface Card {
  id: number;
  content: string;
  type: 'image' | 'text';
  pairId: number; // Matches with another card of same pairId
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatch: React.FC<MemoryMatchProps> = ({ isOpen, onClose, theme }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // Array of indices
  const [mismatchedCards, setMismatchedCards] = useState<number[]>([]); // Track wrong pairs for animation
  const [isProcessing, setIsProcessing] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  // Initialize Game
  const initGame = () => {
    // 1. Filter memories that have images
    const validMemories = MEMORY_DATA.filter(l => l.detail.some(d => d.img));
    
    // 2. Select 6 random memories
    const selectedMemories = [...validMemories].sort(() => 0.5 - Math.random()).slice(0, 6);
    
    // 3. Create pairs (One Image Card, One Text Card)
    const gameCards: Card[] = [];
    selectedMemories.forEach((mem, index) => {
      const img = mem.detail.find(d => d.img)?.img || "";
      
      // Card A: Image
      gameCards.push({ 
          id: index * 2, 
          content: img, 
          type: 'image',
          pairId: index, 
          isFlipped: false, 
          isMatched: false 
      });
      
      // Card B: Text (Location Name)
      gameCards.push({ 
          id: index * 2 + 1, 
          content: mem.name, 
          type: 'text',
          pairId: index, 
          isFlipped: false, 
          isMatched: false 
      });
    });

    // 4. Shuffle
    setCards(gameCards.sort(() => 0.5 - Math.random()));
    setFlippedCards([]);
    setMismatchedCards([]);
    setMoves(0);
    setGameWon(false);
    setTimer(0);
    setGameStarted(true);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (isOpen) initGame();
  }, [isOpen]);

  const handleCardClick = (index: number) => {
    if (isProcessing || cards[index].isFlipped || cards[index].isMatched) return;

    // Flip the card
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    // If 2 cards flipped, check match
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsProcessing(true);
      
      const [firstIdx, secondIdx] = newFlipped;
      const isMatch = cards[firstIdx].pairId === cards[secondIdx].pairId;

      if (isMatch) {
        // Correct Match Effect
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setIsProcessing(false);
          
          // Confetti for pair match (small burst)
          confetti({
             particleCount: 30,
             spread: 50,
             origin: { y: 0.7, x: 0.5 },
             colors: ['#4ade80', '#22c55e'] // Green colors
          });

          // Check win condition
          if (matchedCards.every(c => c.isMatched)) {
            setGameWon(true);
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
          }
        }, 600);
      } else {
        // Wrong Match Effect
        setMismatchedCards([firstIdx, secondIdx]); // Triggers Shake/Red
        
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
          setMismatchedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

      {/* Inject custom shake animation style */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px) rotate(-2deg); }
          40% { transform: translateX(8px) rotate(2deg); }
          60% { transform: translateX(-8px) rotate(-2deg); }
          80% { transform: translateX(8px) rotate(2deg); }
        }
        .animate-shake-hard {
          animation: shake 0.5s ease-in-out;
        }
        .card-inner-shadow {
           box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
        }
      `}</style>

      <div className={`
        relative w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden
        bg-white/95 backdrop-blur-xl border border-white/40 animate-pop flex flex-col items-center
        h-[85vh] max-h-[750px]
      `}>
        {/* Header */}
        <div className="w-full p-6 pb-2 flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${theme.colors.primary} text-white shadow-lg`}>
                    <Brain size={20} />
                </div>
                <h2 className="font-black text-xl text-gray-800">Photo Match</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={24} /></button>
        </div>

        {/* Stats Bar */}
        <div className="w-full px-6 py-2 flex justify-between items-center">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 shadow-sm">
                <Timer size={14} /> {formatTime(timer)}
            </div>
            
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">MATCH PHOTO ↔ NAME</p>
            
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 shadow-sm">
                <MousePointer2 size={14} /> {moves} Moves
            </div>
        </div>

        {/* Game Board */}
        <div className="flex-1 w-full p-4 flex items-center justify-center">
            {gameWon ? (
                <div className="text-center animate-pop space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mx-4">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-white shadow-xl animate-bounce">
                        <Trophy size={48} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 mb-1">Perfect Match!</h2>
                        <p className="text-gray-500 font-bold text-sm">You completed the memory in</p>
                        <div className="flex justify-center gap-4 mt-3">
                            <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                                <span className="block text-lg font-black text-gray-800">{formatTime(timer)}</span>
                                <span className="text-[10px] uppercase font-bold text-gray-400">Time</span>
                            </div>
                            <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                                <span className="block text-lg font-black text-gray-800">{moves}</span>
                                <span className="text-[10px] uppercase font-bold text-gray-400">Moves</span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={initGame}
                        className={`w-full px-8 py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform ${theme.colors.secondary}`}
                    >
                        <RefreshCw size={20} /> Play Again
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3 w-full max-w-[340px] aspect-[3/4] auto-rows-fr">
                    {cards.map((card, idx) => {
                        const isMismatch = mismatchedCards.includes(idx);
                        const isFlipped = card.isFlipped;
                        const isMatched = card.isMatched;

                        return (
                            <div 
                                key={card.id}
                                onClick={() => handleCardClick(idx)}
                                className={`
                                    relative cursor-pointer perspective w-full h-full group
                                    ${isMismatch ? 'animate-shake-hard' : ''}
                                `}
                            >
                                <div className={`
                                    w-full h-full relative preserve-3d transition-transform duration-500 rounded-2xl shadow-sm hover:shadow-md
                                    ${isFlipped || isMatched ? 'rotate-y-180' : ''}
                                `}>
                                    {/* Front (Hidden State) */}
                                    <div className={`
                                        absolute inset-0 backface-hidden rounded-2xl flex items-center justify-center
                                        bg-gray-100 border-2 border-white
                                        group-hover:border-pink-200 transition-colors
                                        card-inner-shadow
                                    `}>
                                        <div className={`
                                            w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-50
                                            group-hover:scale-110 transition-transform duration-300
                                        `}>
                                            <span className="text-gray-400">
                                                {card.type === 'image' ? <ImageIcon size={20} /> : <Type size={20} />}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Back (Revealed Content) */}
                                    <div className={`
                                        absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden border-[3px]
                                        ${isMatched 
                                            ? 'border-green-400 ring-2 ring-green-100' 
                                            : isMismatch 
                                                ? 'border-red-400 ring-2 ring-red-100' 
                                                : isFlipped 
                                                    ? 'border-blue-400 ring-2 ring-blue-100' // Selection Glow
                                                    : 'border-white'
                                        }
                                        ${card.type === 'text' ? 'bg-white flex items-center justify-center p-2 text-center' : 'bg-gray-100'}
                                    `}>
                                        {card.type === 'image' ? (
                                            <>
                                                <img src={card.content} alt="memory" className="w-full h-full object-cover" />
                                                {/* Overlay for matched/mismatched */}
                                                {isMatched && <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center"><Check className="text-white drop-shadow-md w-8 h-8" /></div>}
                                                {isMismatch && <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center"><Ban className="text-white drop-shadow-md w-8 h-8" /></div>}
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-[10px] font-bold text-gray-800 leading-tight">{card.content}</p>
                                                {isMatched && <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5"><Check className="text-white w-3 h-3" /></div>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default MemoryMatch;
