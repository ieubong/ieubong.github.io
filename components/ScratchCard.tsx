
import React, { useRef, useEffect, useState } from 'react';
import { ThemePack } from '../types';
import { X, Trophy, Eraser, Gift, RefreshCw, Heart, Sparkles, MessageCircle, Zap, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScratchCardProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemePack;
}

interface CardCategory {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    prizes: string[];
}

const CATEGORIES: CardCategory[] = [
    {
        id: 'coupon',
        label: 'Love Coupons',
        icon: <Gift size={24} />,
        color: 'bg-gradient-to-br from-pink-400 to-rose-500',
        description: 'Redeem for special treats!',
        prizes: [
            "Free Hug Coupon 🤗", "Massage (15 mins) 💆‍♀️", "You Pick The Movie 🎬",
            "Dish Washing Pass 🍽️", "Breakfast in Bed 🥞", "One Small Wish ✨",
            "Get out of Jail Free (Argument) 🏳️", "A 10 Minute Cuddle Session ☁️"
        ]
    },
    {
        id: 'date',
        label: 'Date Ideas',
        icon: <Sparkles size={24} />,
        color: 'bg-gradient-to-br from-purple-400 to-indigo-500',
        description: 'What are we doing next?',
        prizes: [
            "Late Night Ice Cream Run 🍦", "Build a Blanket Fort ⛺", "Visit a New Coffee Shop ☕",
            "Cook a New Recipe Together 🍳", "Stargazing (or Cloud Watching) 🌌", "Arcade Battle 👾",
            "Go for a long walk w/o phones 🚶‍♂️", "DIY Pizza Night 🍕"
        ]
    },
    {
        id: 'truth',
        label: 'Deep Questions',
        icon: <MessageCircle size={24} />,
        color: 'bg-gradient-to-br from-blue-400 to-cyan-500',
        description: 'Get to know me better.',
        prizes: [
            "What's your favorite memory of us? 💭", "What is one thing you admire about me? ❤️",
            "If we could travel anywhere, where? ✈️", "What was your first impression of me? 👀",
            "What's a song that reminds you of me? 🎵", "When did you know you liked me? 💡"
        ]
    },
    {
        id: 'challenge',
        label: 'Fun Challenge',
        icon: <Zap size={24} />,
        color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        description: 'I dare you to...',
        prizes: [
            "Staring Contest (1 min) 👀", "Let me style your hair 💇‍♂️", "Give me a piggyback ride 🐖",
            "Send a cute selfie right now 📸", "Whisper something sweet 👂", "Do 10 jumping jacks together 🏃‍♂️"
        ]
    }
];

const ScratchCard: React.FC<ScratchCardProps> = ({ isOpen, onClose, theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const [selectedCategory, setSelectedCategory] = useState<CardCategory | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [prize, setPrize] = useState("");
    const [scratchedPercent, setScratchedPercent] = useState(0);

    // Reset when closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setSelectedCategory(null);
                setIsRevealed(false);
                setScratchedPercent(0);
            }, 300);
        }
    }, [isOpen]);

    // Initialize Canvas when category changes
    useEffect(() => {
        if (selectedCategory && isOpen) {
            // Pick prize
            const randomPrize = selectedCategory.prizes[Math.floor(Math.random() * selectedCategory.prizes.length)];
            setPrize(randomPrize);
            setIsRevealed(false);
            setScratchedPercent(0);
            
            // Wait for DOM to render canvas, then draw
            setTimeout(initCanvas, 50);
        }
    }, [selectedCategory, isOpen]);

    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set Size
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }

        // Fill with overlay color (Silver/Grey)
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#E5E7EB');
        gradient.addColorStop(0.5, '#9CA3AF');
        gradient.addColorStop(1, '#E5E7EB');
        
        ctx.globalCompositeOperation = 'source-over'; // Ensure we are drawing over
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add Texture/Text
        ctx.fillStyle = '#6B7280';
        ctx.font = 'bold 24px "Nunito", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("SCRATCH HERE!", canvas.width/2, canvas.height/2);
        
        // Sparkles
        ctx.fillStyle = '#FFF';
        for(let i=0; i<30; i++) {
            ctx.beginPath();
            ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, Math.random()*2, 0, Math.PI*2);
            ctx.fill();
        }
    };

    const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
        if (isRevealed || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const rect = canvas.getBoundingClientRect();
        let x, y;
        
        if ('touches' in e) {
             x = e.touches[0].clientX - rect.left;
             y = e.touches[0].clientY - rect.top;
        } else {
             x = (e as React.MouseEvent).clientX - rect.left;
             y = (e as React.MouseEvent).clientY - rect.top;
        }

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();

        // Check progress less frequently for performance
        if (Math.random() > 0.7) checkProgress();
    };

    const checkProgress = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Sample pixels (only a subset to be fast)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparent = 0;
        const sampleRate = 50; 
        
        for (let i = 3; i < pixels.length; i += 4 * sampleRate) { 
             if (pixels[i] === 0) transparent++;
        }
        
        const totalSampled = pixels.length / (4 * sampleRate);
        const percent = (transparent / totalSampled) * 100;
        setScratchedPercent(percent);

        if (percent > 45 && !isRevealed) {
            setIsRevealed(true);
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
            // Reveal full
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleReset = () => {
        if (!selectedCategory) return;
        
        // 1. Immediately hide the revealed state so the canvas is visible again (no animation yet)
        setIsRevealed(false);
        setScratchedPercent(0);

        // 2. Re-draw the cover immediately
        initCanvas();

        // 3. Swap the prize BEHIND the cover
        let newPrize = prize;
        while (newPrize === prize) {
            newPrize = selectedCategory.prizes[Math.floor(Math.random() * selectedCategory.prizes.length)];
        }
        setPrize(newPrize);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

            <div className={`
                relative w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden
                bg-white border-4 border-white/20 animate-pop flex flex-col h-[600px]
            `}>
                {/* Header */}
                <div className="w-full flex justify-between items-center p-6 pb-2">
                    <div className="flex items-center gap-2">
                        {selectedCategory && (
                            <button onClick={() => setSelectedCategory(null)} className="mr-1 p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-gray-500" />
                            </button>
                        )}
                        <h2 className="font-black text-xl text-gray-800">
                            {selectedCategory ? selectedCategory.label : 'Pick a Card'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                    
                    {!selectedCategory ? (
                        /* Selection Grid */
                        <div className="grid grid-cols-1 gap-4 animate-fade-in">
                            <p className="text-gray-500 text-sm mb-2 text-center">What kind of surprise do you want?</p>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`
                                        w-full p-4 rounded-2xl flex items-center gap-4 text-left shadow-md transform transition-all hover:scale-[1.02] active:scale-95 text-white
                                        ${cat.color}
                                    `}
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg">{cat.label}</h3>
                                        <p className="text-xs opacity-90 font-medium">{cat.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* Scratch Game */
                        <div className="flex flex-col items-center h-full animate-fade-in">
                            
                            {/* Card Container */}
                            <div className={`
                                relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white
                                ${selectedCategory.color}
                                flex items-center justify-center
                            `}>
                                {/* Prize Text (Hidden Layer) */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-pop">
                                    <div className="mb-4 text-white drop-shadow-md">
                                        {selectedCategory.icon}
                                    </div>
                                    <p className="text-xs font-bold uppercase text-white/70 mb-2">You Received:</p>
                                    <h3 className="text-2xl font-black text-white leading-snug drop-shadow-md">
                                        {prize}
                                    </h3>
                                </div>

                                {/* Scratch Canvas (Top Layer) */}
                                {/* Critical Fix: applied transition-opacity ONLY when revealed. 
                                    When resetting (isRevealed=false), the class is removed, causing instant opacity snap-back. */}
                                <canvas 
                                    ref={canvasRef}
                                    onMouseMove={(e) => { if(e.buttons === 1) handleScratch(e); }}
                                    onTouchMove={handleScratch}
                                    className={`
                                        absolute inset-0 z-10 touch-none cursor-crosshair 
                                        ${isRevealed ? 'opacity-0 pointer-events-none transition-opacity duration-1000' : 'opacity-100'}
                                    `}
                                />
                            </div>

                            {/* Controls */}
                            <div className="mt-8 w-full text-center">
                                {isRevealed ? (
                                    <div className="animate-fade-in space-y-3">
                                        <p className="text-sm font-bold text-gray-500">✨ Yay! Hope you like it! ✨</p>
                                        <button onClick={handleReset} className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity ${theme.colors.secondary}`}>
                                            <RefreshCw size={18} /> Try Another
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 font-bold flex items-center justify-center gap-2 animate-pulse">
                                        <Eraser size={16} /> Rub screen to reveal...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScratchCard;
