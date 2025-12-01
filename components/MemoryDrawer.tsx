
import React, { useState, useEffect } from 'react';
import { MemoryLocation, ThemePack } from '../types';
import { X, Calendar, MapPin, Star, Play, Music, Camera } from 'lucide-react';

interface MemoryDrawerProps {
  location: MemoryLocation | null;
  onClose: () => void;
  theme: ThemePack;
}

const MemoryDrawer: React.FC<MemoryDrawerProps> = ({ location, onClose, theme }) => {
  const [randomVibe, setRandomVibe] = useState<string>("");

  useEffect(() => {
    const vibes = ["Chaotic Duo 🦊🐰", "100% Cuddles ☁️", "Food Coma 🍡", "Core Memory 🔓", "Pure Bliss ✨", "Adventure Time 🎒"];
    setRandomVibe(vibes[Math.floor(Math.random() * vibes.length)]);
  }, [location]);

  if (!location) return null;

  return (
    <div className="absolute inset-0 z-[500] flex justify-end pointer-events-none">
      <div 
        className="absolute inset-0 bg-transparent pointer-events-auto" 
        onClick={onClose}
      />

      {/* Main Card Container */}
      <div className={`
        relative pointer-events-auto
        w-full md:w-[500px] h-[90%] md:h-[95%] mt-auto md:my-auto md:mr-4
        rounded-t-[40px] md:rounded-[40px]
        flex flex-col
        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]
        overflow-hidden
        transition-all duration-500 ease-out
        animate-slide-in
        border-[3px] border-white/40
        backdrop-blur-3xl
        ${theme.colors.bgGradient}
      `}>
        {/* Cute decorative blobs background */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* Header Image Area */}
        <div className="relative h-56 flex-shrink-0 z-10 group">
             {/* Main Cover Image */}
             <div className="absolute inset-0 overflow-hidden">
                {location.detail[0]?.img ? (
                    <img src={location.detail[0].img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-300 to-pink-300"></div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/90"></div>
             </div>
             
             {/* Close Button */}
             <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 hover:bg-white hover:text-pink-500 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all shadow-lg z-50 active:scale-90"
             >
               <X size={20} strokeWidth={3} />
             </button>

             {/* Title & Info */}
             <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-white via-white/80 to-transparent">
                 <div className="flex items-center gap-2 mb-2">
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${theme.colors.primary} shadow-sm transform -rotate-1`}>
                         Memory Unlocked
                     </span>
                     <div className="flex text-yellow-400 drop-shadow-sm">
                         {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < (location.detail[0]?.rating || 0) ? "currentColor" : "none"} strokeWidth={3} />)}
                     </div>
                 </div>
                 <h1 className="text-3xl font-serif font-black text-gray-800 leading-tight drop-shadow-sm mb-1">{location.name}</h1>
                 <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                     <MapPin size={12} className="text-pink-500" /> {randomVibe}
                 </div>
             </div>
        </div>

        {/* Content Body - The Diary */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0 bg-white/50">
          <div className="px-6 py-8 relative min-h-full">
            
            {/* Timeline Vertical Line */}
            <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-pink-300 via-purple-300 to-transparent opacity-60 rounded-full border-l border-dashed border-pink-400"></div>

            <div className="space-y-10">
              {location.detail.map((item, index) => (
                <div key={index} className="relative pl-10 group">
                  
                  {/* Timeline Node */}
                  <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-white border-4 border-pink-400 shadow-md z-10 group-hover:scale-125 transition-transform duration-300 ring-4 ring-white/50"></div>

                  {/* Memory Card */}
                  <div className={`
                     relative bg-white rounded-[24px] p-5 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] 
                     border-2 border-white transition-all duration-300 hover:shadow-[0_8px_30px_-5px_rgba(236,72,153,0.2)]
                     hover:-translate-y-1 hover:rotate-1
                  `}>
                     
                     {/* Header: Date & Mood */}
                     <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                         <div className="flex flex-col">
                             <span className="font-serif font-bold text-gray-800 text-lg leading-none">
                                {item.date.split(' ')[1] || item.date}
                             </span>
                             <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider mt-1 flex items-center gap-1">
                                <Calendar size={10} /> {item.date.split(' ')[0] && item.date.split(' ')[1] ? item.date.split(' ')[0] : ''}
                             </span>
                         </div>
                         {item.mood && (
                             <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                #{item.mood}
                             </span>
                         )}
                     </div>

                     {/* Image Section (Always Visible now with Washi Tape style) */}
                     {item.img && (
                        <div className="relative mb-5 -mx-2 mt-2 transform rotate-1 transition-transform group-hover:rotate-0">
                            {/* Washi Tape */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 -rotate-2 backdrop-blur-md border-l-2 border-r-2 border-white/50 shadow-sm z-10"></div>
                            
                            <div className="rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-100 relative group/img">
                                <img 
                                    src={item.img} 
                                    className="w-full h-auto object-cover max-h-[300px]" 
                                    alt="Memory Moment" 
                                    loading="lazy"
                                />
                                <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold opacity-0 group-hover/img:opacity-100 transition-opacity">
                                    <Camera size={12} className="inline mr-1"/> Photo
                                </div>
                            </div>
                        </div>
                     )}

                     {/* Video Section */}
                     {item.video && (
                       <div className="relative mb-5 rounded-2xl overflow-hidden shadow-lg border-2 border-white group/vid cursor-pointer">
                           <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover/vid:bg-transparent transition-colors z-10">
                               <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/60 shadow-lg">
                                   <Play size={18} fill="white" className="text-white ml-1" />
                               </div>
                           </div>
                           <video src={item.video} className="w-full h-32 object-cover bg-black" />
                       </div>
                     )}

                     {/* Description Text */}
                     {item.desc && (
                       <div className="relative">
                           {/* Decoration Quote Mark */}
                           <span className="absolute -top-2 -left-1 text-4xl text-pink-200 font-serif leading-none opacity-50">“</span>
                           <div className="text-gray-600 text-[15px] leading-relaxed font-medium pl-2 relative z-10 font-sans">
                              <div dangerouslySetInnerHTML={{ __html: item.desc }} />
                           </div>
                       </div>
                     )}

                     {/* Additional Media Grid */}
                     {item.media && item.media.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-dashed border-gray-200">
                             <p className="text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-widest">More Snaps</p>
                             <div className="grid grid-cols-3 gap-2">
                                {item.media.map((m, i) => (
                                    <div key={i} className="rounded-xl overflow-hidden aspect-square border-2 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer">
                                        <img src={m} className="w-full h-full object-cover" alt="" />
                                    </div>
                                ))}
                             </div>
                        </div>
                     )}

                  </div>
                </div>
              ))}
            </div>

            {/* End of list decoration */}
            <div className="flex flex-col items-center justify-center mt-12 opacity-50 gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-pink-300 to-transparent"></div>
                <div className="text-xs font-bold text-pink-400 uppercase tracking-widest">End of Chapter</div>
            </div>
            
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-white/80 backdrop-blur-xl border-t border-white/50 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
            <a 
              href={location.ggmaps} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`
                flex-1 flex items-center justify-center gap-2 py-4 rounded-[24px] 
                font-black text-sm text-white shadow-lg shadow-pink-200/50 
                transform active:scale-95 transition-all hover:brightness-110
                ${theme.colors.primary}
              `}
           >
             <MapPin size={18} /> OPEN IN MAPS
           </a>
           <button className="w-14 h-14 rounded-[24px] bg-white border-2 border-pink-100 shadow-md flex items-center justify-center text-pink-400 hover:scale-110 hover:rotate-6 transition-all group">
               <Music fill="currentColor" size={24} className="group-hover:animate-bounce" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryDrawer;
