
import React, { useState, useRef } from 'react';
import { ThemePack, MemoryLocation } from '../types';
import { MEMORY_DATA } from '../constants';
import { X, Camera, Download, RefreshCw, Sticker, Type, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PolaroidBoothProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemePack;
}

const FRAMES = [
    { id: 'classic', color: 'bg-white', label: 'Classic' },
    { id: 'pink', color: 'bg-pink-100', label: 'Love' },
    { id: 'dark', color: 'bg-zinc-800 text-white', label: 'Night' },
    { id: 'gradient', color: 'bg-gradient-to-br from-pink-200 to-purple-200', label: 'Dreamy' },
];

const STICKERS = ['❤️', '✨', '🦊', '🐰', '🥰', '🍡', '🌸', '🔥', '📸'];

const PolaroidBooth: React.FC<PolaroidBoothProps> = ({ isOpen, onClose, theme }) => {
    // Flatten photos
    const allPhotos = MEMORY_DATA.flatMap(l => l.detail.filter(d => d.img).map(d => ({ ...d, locName: l.name })));
    
    const [selectedPhoto, setSelectedPhoto] = useState(allPhotos[0] || null);
    const [currentFrame, setCurrentFrame] = useState(FRAMES[0]);
    const [caption, setCaption] = useState(selectedPhoto?.locName || "My Memory");
    const [placedStickers, setPlacedStickers] = useState<{id: number, char: string, x: number, y: number}[]>([]);
    
    const polaroidRef = useRef<HTMLDivElement>(null);

    const handlePhotoSelect = (photo: any) => {
        setSelectedPhoto(photo);
        setCaption(photo.locName);
        setPlacedStickers([]);
    };

    const addSticker = (char: string) => {
        setPlacedStickers([...placedStickers, {
            id: Date.now(),
            char,
            x: Math.random() * 60 + 20, // Random pos %
            y: Math.random() * 60 + 20
        }]);
    };

    const handleSave = () => {
        // Simulation of save
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        alert("📸 Saved to Memory Gallery! (Simulated Download)");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>

             <div className={`
                relative w-full max-w-4xl h-[80vh] rounded-[2rem] shadow-2xl overflow-hidden
                bg-white border-4 border-white/20 animate-pop flex flex-col md:flex-row
            `}>
                {/* Left: Controls & Gallery */}
                <div className="w-full md:w-1/3 bg-gray-50 flex flex-col border-r border-gray-200">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                        <h2 className="font-black text-lg flex items-center gap-2 text-gray-800"><Camera size={20} /> Photo Booth</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                         <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Select Memory</h3>
                         <div className="grid grid-cols-3 gap-2 mb-6">
                            {allPhotos.map((p, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => handlePhotoSelect(p)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedPhoto === p ? 'border-pink-500 ring-2 ring-pink-200' : 'border-transparent'}`}
                                >
                                    <img src={p.img} className="w-full h-full object-cover" alt="" />
                                </button>
                            ))}
                         </div>

                         <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Frame Style</h3>
                         <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                             {FRAMES.map(f => (
                                 <button
                                    key={f.id}
                                    onClick={() => setCurrentFrame(f)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold border ${currentFrame.id === f.id ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300'}`}
                                 >
                                     {f.label}
                                 </button>
                             ))}
                         </div>

                         <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Add Stickers</h3>
                         <div className="flex flex-wrap gap-2">
                             {STICKERS.map(s => (
                                 <button key={s} onClick={() => addSticker(s)} className="text-2xl hover:scale-125 transition-transform">{s}</button>
                             ))}
                         </div>
                    </div>
                </div>

                {/* Right: Preview Area */}
                <div className="flex-1 bg-gray-200/50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    {/* The Polaroid */}
                    <div 
                        ref={polaroidRef}
                        className={`
                            relative p-4 pb-16 shadow-2xl transform transition-all duration-500
                            w-full max-w-[320px] aspect-[3/4] flex flex-col
                            ${currentFrame.color}
                        `}
                        style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
                    >
                        {/* Tape */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/30 backdrop-blur-sm border-l border-r border-white/40 rotate-1"></div>

                        <div className="w-full aspect-square bg-gray-100 overflow-hidden mb-4 relative group">
                            <img src={selectedPhoto?.img} className="w-full h-full object-cover" alt="Memory" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center relative">
                            <input 
                                type="text" 
                                value={caption} 
                                onChange={(e) => setCaption(e.target.value)}
                                className="w-full text-center bg-transparent border-b border-transparent hover:border-black/10 focus:border-black outline-none font-handwriting text-2xl"
                                style={{ fontFamily: '"Nunito", cursive' }} // Using Nunito for now, theoretically a handwriting font
                            />
                            <p className="text-[10px] opacity-50 mt-1 uppercase tracking-widest">{selectedPhoto?.date.split(' ')[1]}</p>
                        </div>

                        {/* Stickers Overlay */}
                        {placedStickers.map((s, i) => (
                            <div 
                                key={s.id} 
                                className="absolute text-4xl cursor-move select-none hover:scale-110 transition-transform"
                                style={{ top: `${s.y}%`, left: `${s.x}%` }}
                                onClick={() => setPlacedStickers(prev => prev.filter((_, idx) => idx !== i))}
                            >
                                {s.char}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button onClick={() => setPlacedStickers([])} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-700 font-bold shadow-lg hover:bg-gray-50">
                            <RefreshCw size={18} /> Reset
                        </button>
                        <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold shadow-lg hover:scale-105 transition-transform ${theme.colors.primary}`}>
                            <Download size={18} /> Save Polaroid
                        </button>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default PolaroidBooth;
