
import React, { useState, useEffect, useRef } from 'react';
import { ThemePack } from '../types';

interface FloatingHeartProps {
  onSendLove: (message: string, emoji: string) => void;
  theme: ThemePack;
}

const AMMO_TYPES = [
    { id: 'heart', icon: '❤️', label: 'Love' },
    { id: 'sparkle', icon: '✨', label: 'Magic' },
    { id: 'judy', icon: '🐰', label: 'Judy' },
    { id: 'nick', icon: '🦊', label: 'Nick' },
    { id: 'carrot', icon: '🥕', label: 'Snack' },
    { id: 'kiss', icon: '💋', label: 'Kisses' },
];

const FloatingHeart: React.FC<FloatingHeartProps> = ({ onSendLove, theme }) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 90, y: window.innerHeight - 220 }); // Moved up slightly
  const [isDragging, setIsDragging] = useState(false);
  const [ammoIndex, setAmmoIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);

  const dragStart = useRef({ x: 0, y: 0 });
  const btnRef = useRef<HTMLDivElement>(null);
  const comboTimeout = useRef<any>(null);

  useEffect(() => {
      const timer = setTimeout(() => setShowTooltip(false), 5000);
      return () => clearTimeout(timer);
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStart.current = {
        x: clientX - position.x,
        y: clientY - position.y
    };

    if ('touches' in e) {
        window.addEventListener('touchmove', handleDragMove, { passive: false });
        window.addEventListener('touchend', handleDragEnd);
    } else {
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('mouseup', handleDragEnd);
    }
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
      setIsDragging(true);
      setShowTooltip(false);
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const newX = clientX - dragStart.current.x;
      const newY = clientY - dragStart.current.y;
      
      const maxX = window.innerWidth - 80;
      const maxY = window.innerHeight - 80;

      setPosition({
          x: Math.min(Math.max(20, newX), maxX),
          y: Math.min(Math.max(20, newY), maxY)
      });
      
      e.preventDefault();
  };

  const handleDragEnd = () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
      setTimeout(() => setIsDragging(false), 100);
  };

  const handleClick = () => {
      if (isDragging) return;
      const currentAmmo = AMMO_TYPES[ammoIndex];
      onSendLove(`${currentAmmo.label} Sent!`, currentAmmo.icon);
      setCombo(prev => prev + 1);
      if (comboTimeout.current) clearTimeout(comboTimeout.current);
      comboTimeout.current = setTimeout(() => setCombo(0), 2000);
  };

  const handleDoubleClick = () => {
      setAmmoIndex(prev => (prev + 1) % AMMO_TYPES.length);
      setCombo(0);
  };

  const currentAmmo = AMMO_TYPES[ammoIndex];

  return (
    <div 
        ref={btnRef}
        className="fixed z-[3000] cursor-grab active:cursor-grabbing touch-none select-none"
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
    >
        {/* Combo Bubble */}
        {combo > 1 && (
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full font-black text-sm animate-pop whitespace-nowrap shadow-[0_4px_15px_rgba(251,191,36,0.5)] border-2 border-white pointer-events-none z-20">
                {combo}x MAGIC! ✨
            </div>
        )}

        {/* Tooltip */}
        {showTooltip && (
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md text-gray-800 px-4 py-2 rounded-2xl text-xs font-bold w-44 text-center shadow-lg animate-fade-in pointer-events-none border border-white">
                Drag me around! <br/> Double-tap to swap magic!
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/80 rotate-45"></div>
            </div>
        )}

        {/* Main Floating Orb - Disney Style */}
        <div className={`
            w-16 h-16 rounded-full 
            bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600
            shadow-[0_10px_30px_rgba(236,72,153,0.5),0_0_20px_rgba(255,255,255,0.4)_inset] 
            border-[3px] border-white/60
            flex items-center justify-center
            transform transition-all active:scale-90 hover:scale-110 hover:-translate-y-2
            relative overflow-hidden group
        `}>
             {/* Glossy Highlights */}
             <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-gradient-to-b from-white/40 to-transparent rounded-full pointer-events-none blur-[1px]"></div>
             <div className="absolute bottom-2 right-3 w-2 h-2 bg-white/60 rounded-full blur-[2px]"></div>
             
             {/* Ripple Animation Ring */}
             <div className="absolute inset-0 border-2 border-white rounded-full opacity-0 group-hover:animate-ping"></div>

             {/* Icon */}
             <span className="text-3xl filter drop-shadow-md select-none animate-float relative z-10">
                 {currentAmmo.icon}
             </span>

             {/* Ammo Dots */}
             <div className="absolute bottom-3 flex gap-0.5 z-10">
                 {AMMO_TYPES.map((_, i) => (
                     <div key={i} className={`w-1 h-1 rounded-full transition-all duration-300 ${i === ammoIndex ? 'bg-white w-2 shadow-[0_0_5px_white]' : 'bg-black/20'}`}></div>
                 ))}
             </div>
        </div>
    </div>
  );
};

export default FloatingHeart;
