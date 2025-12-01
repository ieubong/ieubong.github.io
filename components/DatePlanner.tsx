
import React, { useState } from 'react';
import { ThemePack } from '../types';
import { X, Sparkles, Utensils, Film, Coffee, Tent, Gamepad2, Music, ShoppingBag, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DatePlannerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemePack;
}

// Vibrant/Cute Color Palette matching the screenshot
const ACTIVITIES = [
    { id: 'eat', label: 'Street Food', icon: <Utensils size={24} />, color: 'bg-[#FB923C]' }, // Orange
    { id: 'movie', label: 'Cinema', icon: <Film size={24} />, color: 'bg-[#EF4444]' }, // Red
    { id: 'cafe', label: 'Coffee', icon: <Coffee size={24} />, color: 'bg-[#B45309]' }, // Brown
    { id: 'picnic', label: 'Picnic', icon: <Tent size={24} />, color: 'bg-[#22C55E]' }, // Green
    { id: 'game', label: 'Games', icon: <Gamepad2 size={24} />, color: 'bg-[#6366F1]' }, // Indigo
    { id: 'karaoke', label: 'Karaoke', icon: <Music size={24} />, color: 'bg-[#EC4899]' }, // Pink
    { id: 'shop', label: 'Shopping', icon: <ShoppingBag size={24} />, color: 'bg-[#3B82F6]' }, // Blue
    { id: 'home', label: 'Home Cook', icon: <Home size={24} />, color: 'bg-[#14B8A6]' }, // Teal
];

const DatePlanner: React.FC<DatePlannerProps> = ({ isOpen, onClose, theme }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<typeof ACTIVITIES[0] | null>(null);
    const [rotation, setRotation] = useState(0);

    const spin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setResult(null);

        const degPerItem = 360 / ACTIVITIES.length;
        const randomExtraSpins = 5 + Math.floor(Math.random() * 3); 
        const randomAngle = Math.floor(Math.random() * 360);
        
        const totalRotation = rotation + (randomExtraSpins * 360) + randomAngle;
        
        setRotation(totalRotation);

        setTimeout(() => {
            setIsSpinning(false);
            
            // Calculate winner
            // The pointer is at the TOP (0 degrees visual).
            // The wheel spins clockwise, so the angle at the pointer is (360 - (Rotation % 360)).
            // Our items start at 0deg (Top Right quadrant effectively due to CSS skew).
            // Actually, with the CSS below, Item 0 starts aligned with the vertical axis going clockwise.
            
            const normalizedRot = totalRotation % 360;
            const angleAtPointer = (360 - normalizedRot) % 360;
            const winningIndex = Math.floor(angleAtPointer / degPerItem);
            const clampedIndex = Math.max(0, Math.min(winningIndex, ACTIVITIES.length - 1));
            
            setResult(ACTIVITIES[clampedIndex]);
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

             <div className={`
                relative w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden
                bg-white/95 backdrop-blur-xl border border-white/40 animate-pop flex flex-col items-center
                p-6
            `}>
                {/* Header */}
                <div className="w-full flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${theme.colors.primary} text-white shadow-lg`}>
                            <Sparkles size={18} />
                        </div>
                        <h2 className="font-black text-xl text-gray-800">Date Planner</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={20} /></button>
                </div>

                {/* Spinner Visual */}
                <div className="relative w-72 h-72 mb-6">
                    {/* Pointer Triangle */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 drop-shadow-md transform transition-transform">
                        <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-red-500"></div>
                    </div>

                    {/* Wheel Container with White Border */}
                    <div className="w-full h-full p-2 bg-white rounded-full shadow-inner">
                        <div 
                            className="w-full h-full rounded-full overflow-hidden relative transition-transform duration-[3000ms] cubic-bezier(0.15, 0, 0.10, 1)"
                            style={{ transform: `rotate(${rotation}deg)` }}
                        >
                            {ACTIVITIES.map((act, idx) => {
                                const degPerItem = 360 / ACTIVITIES.length;
                                const rotate = degPerItem * idx;
                                const skew = 90 - degPerItem; // 45deg
                                
                                return (
                                    <div 
                                        key={act.id}
                                        className={`absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left ${act.color} border-[2px] border-white`}
                                        style={{ 
                                            transform: `rotate(${rotate}deg) skewY(-${skew}deg)`,
                                        }}
                                    >
                                        <div 
                                            className="absolute flex flex-col items-center justify-center text-white" 
                                            style={{ 
                                                // Unskew and rotate to center
                                                transform: `skewY(${skew}deg) rotate(${degPerItem/2}deg)`,
                                                position: 'absolute',
                                                left: '-100%', 
                                                bottom: '-100%',
                                                width: '200%',
                                                height: '200%',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {/* Icon Position Adjustment: Push out towards rim */}
                                            <div className="transform translate-y-[-75px] rotate-0">
                                                {React.cloneElement(act.icon as React.ReactElement<any>, { size: 24, strokeWidth: 2.5 })}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    {/* Center Cap */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg z-10 flex items-center justify-center border-4 border-gray-50">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SPIN</span>
                    </div>
                </div>

                {/* Result Area */}
                <div className="w-full flex flex-col items-center justify-center mb-4 h-16 transition-all">
                    {result ? (
                        <div className="animate-pop w-full text-center">
                            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-1">Next Date Activity</p>
                            <div className={`
                                w-full py-3 rounded-xl text-white font-black text-xl shadow-md flex items-center justify-center gap-2
                                bg-gradient-to-r from-purple-400 to-pink-500
                            `}>
                                {result.icon}
                                {result.label}
                            </div>
                        </div>
                    ) : (
                         <div className="text-center opacity-40">
                             <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Ready?</p>
                             <div className="h-10 w-32 bg-gray-200 rounded-xl mx-auto"></div>
                         </div>
                    )}
                </div>

                <button 
                    onClick={spin}
                    disabled={isSpinning}
                    className={`
                        w-full py-4 rounded-2xl font-black text-white text-lg shadow-xl shadow-pink-200
                        transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                        bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-110
                    `}
                >
                    {isSpinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
                </button>
             </div>
        </div>
    );
};

export default DatePlanner;
