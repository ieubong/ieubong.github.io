
import React, { useState, useEffect, useRef } from 'react';
import { ThemePack } from '../types';
import { MINI_PLAYER_THEMES, LYRICS_ENCHANTED } from '../constants';
import { Play, Pause, SkipForward, SkipBack, ChevronDown, Heart, Repeat, Shuffle, Mic2, GripHorizontal, Minimize2, X } from 'lucide-react';

interface MusicWidgetProps {
  theme: ThemePack;
  miniPlayerThemeId: string;
  onClose: () => void;
}

interface LyricLine {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

const parseLyrics = (lrc: string): LyricLine[] => {
  const blocks = lrc.trim().split('\n\n');
  return blocks.map(block => {
    const lines = block.split('\n');
    if (lines.length < 3) return null;
    const timeMatch = lines[1].match(/(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/);
    if (!timeMatch) return null;
    
    const parseSeconds = (h:string, m:string, s:string, ms:string) => 
      parseInt(h)*3600 + parseInt(m)*60 + parseInt(s) + parseInt(ms)/1000;
      
    return {
      id: parseInt(lines[0]),
      startTime: parseSeconds(timeMatch[1], timeMatch[2], timeMatch[3], timeMatch[4]),
      endTime: parseSeconds(timeMatch[5], timeMatch[6], timeMatch[7], timeMatch[8]),
      text: lines.slice(2).join('\n')
    };
  }).filter(Boolean) as LyricLine[];
}

const MusicWidget: React.FC<MusicWidgetProps> = ({ theme, miniPlayerThemeId, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMiniLyrics, setShowMiniLyrics] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); 
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  
  // Dragging State
  const [position, setPosition] = useState({ x: window.innerWidth - 340, y: window.innerHeight - 200 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  // Scroll State
  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<any>(null);

  const DURATION = 352; 

  const mpTheme = MINI_PLAYER_THEMES.find(t => t.id === miniPlayerThemeId) || MINI_PLAYER_THEMES[0];

  useEffect(() => {
    const parsed = parseLyrics(LYRICS_ENCHANTED);
    setLyrics(parsed);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => (prev >= DURATION ? 0 : prev + 0.1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Auto-scroll logic
  useEffect(() => {
    if (isExpanded && scrollRef.current && !isUserScrolling.current) {
        const activeIndex = lyrics.findIndex(l => currentTime >= l.startTime && currentTime <= l.endTime);
        if (activeIndex !== -1) {
            const activeEl = scrollRef.current.children[activeIndex] as HTMLElement;
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
  }, [currentTime, isExpanded, lyrics]);

  const handleScroll = () => {
    isUserScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
        isUserScrolling.current = false;
    }, 3000);
  };

  // --- IMPROVED DRAG LOGIC ---
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
      if (isExpanded) return;
      isDragging.current = true;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      dragStart.current = {
          x: clientX - position.x,
          y: clientY - position.y
      };
  };

  useEffect(() => {
      const handleDragMove = (e: MouseEvent | TouchEvent) => {
          if (!isDragging.current) return;
          e.preventDefault(); // Prevent scrolling on touch
          
          const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
          const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

          const newX = clientX - dragStart.current.x;
          const newY = clientY - dragStart.current.y;
          
          // Boundaries
          const maxX = window.innerWidth - 50;
          const maxY = window.innerHeight - 50;

          setPosition({
              x: Math.min(Math.max(-50, newX), maxX),
              y: Math.min(Math.max(-50, newY), maxY)
          });
      };

      const handleDragEnd = () => {
          isDragging.current = false;
      };

      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);

      return () => {
          window.removeEventListener('mousemove', handleDragMove);
          window.removeEventListener('mouseup', handleDragEnd);
          window.removeEventListener('touchmove', handleDragMove);
          window.removeEventListener('touchend', handleDragEnd);
      };
  }, []);

  const activeLyricIndex = lyrics.findIndex(l => currentTime >= l.startTime && currentTime < l.endTime);
  const currentLyricText = activeLyricIndex !== -1 ? lyrics[activeLyricIndex].text.replace(/\n/g, ' ') : "";
  
  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleMiniSeek = (e: React.MouseEvent) => {
      e.stopPropagation(); 
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      setCurrentTime(percent * DURATION);
  };

  const getMiniModeLyrics = () => {
    if (activeLyricIndex === -1) return { prev: "", curr: "", next: "" };
    const prev = activeLyricIndex > 0 ? lyrics[activeLyricIndex - 1].text : "";
    const curr = lyrics[activeLyricIndex].text;
    const next = activeLyricIndex < lyrics.length - 1 ? lyrics[activeLyricIndex + 1].text : "";
    return { prev, curr, next };
  };
  const miniLyrics = getMiniModeLyrics();

  // --- MINI PLAYER ---
  if (!isExpanded) {
    return (
      <div 
        ref={widgetRef}
        style={{ left: position.x, top: position.y }}
        className={`
          fixed z-[900]
          w-80 rounded-[24px] p-3 pt-5
          shadow-2xl 
          backdrop-blur-xl transition-all duration-300
          animate-pop overflow-hidden group border
          ${mpTheme.bgClass}
          ${showMiniLyrics ? 'h-auto' : 'h-[80px]'}
        `}
      >
        {/* DRAG HANDLE AREA */}
        <div 
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className={`
                absolute top-0 left-0 right-0 h-6 cursor-grab active:cursor-grabbing z-50
                flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity
            `}
        >
            <div className={`w-12 h-1 rounded-full bg-current opacity-20 ${mpTheme.textClass}`}></div>
        </div>

        {/* --- Top Row: Art, Title, Controls --- */}
        <div 
            className="flex gap-3 items-center relative z-10 mb-1 cursor-pointer"
            onClick={() => { if(!isDragging.current) setIsExpanded(true); }}
        >
           {/* Mini Art */}
           <div className={`
             w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs
             bg-gradient-to-br from-indigo-500 to-purple-800 border-2 border-zinc-800
             ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}
           `}>
             <div className="w-4 h-4 bg-black rounded-full border border-zinc-700"></div>
           </div>
           
           <div className="min-w-0 flex-1 flex flex-col justify-center">
             <div className="flex justify-between items-baseline pr-2">
                <h4 className={`font-bold truncate text-sm ${mpTheme.textClass}`}>Enchanted</h4>
                <p className={`text-[10px] truncate ${mpTheme.subTextClass}`}>Taylor Swift</p>
             </div>
             
             {!showMiniLyrics && (
                <div className="h-5 overflow-hidden relative mt-0.5">
                    <p className={`text-xs font-bold truncate ${isPlaying ? 'animate-pulse' : ''} ${mpTheme.textClass} opacity-80`}>
                        {currentLyricText || "..."}
                    </p>
                </div>
             )}
           </div>

           {/* Actions */}
           <div className="flex items-center gap-1">
             <button
                onClick={(e) => { e.stopPropagation(); setShowMiniLyrics(!showMiniLyrics); }}
                className={`p-2 rounded-full hover:bg-white/10 transition-colors ${showMiniLyrics ? 'text-green-400' : mpTheme.textClass}`}
             >
                <Mic2 size={16} />
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                className={`p-3 rounded-full transition-colors shrink-0 ${mpTheme.buttonClass}`}
             >
                {isPlaying ? <Pause size={18} className={mpTheme.iconColorClass} fill="currentColor" /> : <Play size={18} className={mpTheme.iconColorClass} fill="currentColor" />}
             </button>
           </div>
        </div>

        {/* --- Expanded Mini Lyrics --- */}
        {showMiniLyrics && (
            <div className={`mt-3 mb-4 flex flex-col items-center text-center space-y-2 pointer-events-none transition-all animate-fade-in`}>
                <p className={`text-xs ${mpTheme.subTextClass} opacity-50 line-clamp-1`}>{miniLyrics.prev}</p>
                <p className={`text-sm font-black ${mpTheme.textClass} scale-110 leading-tight transition-all duration-300`}>{miniLyrics.curr || "..."}</p>
                <p className={`text-xs ${mpTheme.subTextClass} opacity-50 line-clamp-1`}>{miniLyrics.next}</p>
            </div>
        )}
        
        {/* Progress Bar */}
        <div 
            className="absolute bottom-0 left-0 right-0 h-4 cursor-pointer z-20 group/seek"
            onClick={handleMiniSeek}
            onMouseDown={(e) => e.stopPropagation()} 
        >
             <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 group-hover/seek:h-2 transition-all">
                <div 
                    className={`h-full ${mpTheme.progressGradient} ${mpTheme.progressShadow} rounded-r-full`} 
                    style={{ width: `${(currentTime / DURATION) * 100}%` }}
                />
             </div>
        </div>
      </div>
    );
  }

  // --- FULL PLAYER (Unchanged logic, just keeping structure) ---
  return (
    <div className="fixed inset-0 z-[3000] flex flex-col items-center justify-end md:justify-center p-0 md:p-6 bg-black/80 backdrop-blur-2xl animate-fade-in">
        <div className={`absolute inset-0 opacity-40 bg-gradient-to-br from-purple-900 via-zinc-900 to-black pointer-events-none`}></div>

        <div className="w-full md:w-[400px] h-full md:h-[90vh] md:rounded-[30px] flex flex-col overflow-hidden shadow-2xl relative bg-gradient-to-b from-zinc-800/80 to-black text-white border border-white/10">
            
            {/* Header */}
            <div className="p-6 flex justify-between items-center z-10 flex-shrink-0">
                <button onClick={() => setIsExpanded(false)} className="hover:opacity-70">
                    <ChevronDown size={28} />
                </button>
                <span className="text-xs font-bold tracking-widest uppercase opacity-70">Now Playing</span>
                <button onClick={onClose} className="hover:opacity-70">
                    <X size={20} />
                </button>
            </div>

            {/* Main Content Scroll */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-8">
                {/* Vinyl Art */}
                <div className="py-6 flex justify-center items-center">
                    <div className={`
                        w-72 h-72 rounded-full shadow-2xl 
                        bg-gradient-to-br from-zinc-800 to-black border-4 border-zinc-900
                        flex items-center justify-center relative
                        ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}
                    `}>
                         <div className="absolute inset-2 rounded-full border border-zinc-700 opacity-20"></div>
                         <div className="absolute inset-8 rounded-full border border-zinc-700 opacity-20"></div>
                         <div className="absolute inset-16 rounded-full border border-zinc-700 opacity-20"></div>
                         <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                            <span className="font-black opacity-80 text-lg">TS</span>
                         </div>
                    </div>
                </div>

                {/* Track Info */}
                <div className="mt-4 mb-6 flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-bold leading-tight">Enchanted</h2>
                        <p className="text-zinc-400 font-medium">Taylor Swift</p>
                    </div>
                    <button className="text-green-500 p-2 transform active:scale-90 transition-transform"><Heart fill="currentColor" size={28} /></button>
                </div>

                {/* Progress */}
                <div className="mb-2 group cursor-pointer py-2" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    setCurrentTime(percent * DURATION);
                }}>
                    <div className="h-1 bg-zinc-600 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-white relative group-hover:bg-green-500 transition-colors" 
                            style={{ width: `${(currentTime / DURATION) * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform"></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-[11px] font-medium mt-1 opacity-60">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(DURATION)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-between items-center mb-8">
                    <button className="opacity-70 hover:opacity-100"><Shuffle size={20} /></button>
                    <button className="hover:opacity-70 transition-transform active:scale-90" onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}><SkipBack size={32} fill="currentColor" /></button>
                    
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all active:scale-95 shadow-lg shadow-white/10"
                    >
                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </button>
                    
                    <button className="hover:opacity-70 transition-transform active:scale-90" onClick={() => setCurrentTime(Math.min(DURATION, currentTime + 5))}><SkipForward size={32} fill="currentColor" /></button>
                    <button className="opacity-70 hover:opacity-100"><Repeat size={20} /></button>
                </div>

                {/* Lyrics Card */}
                <div className="bg-zinc-800/50 rounded-2xl p-6 mb-8 backdrop-blur-md min-h-[350px] relative overflow-hidden border border-white/5 shadow-inner">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-zinc-800/80 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-4 right-4 text-green-400 opacity-80 font-bold flex gap-1 items-center z-20">
                        <Mic2 size={14} /> LYRICS
                    </div>
                    
                    <div 
                        ref={scrollRef} 
                        onScroll={handleScroll}
                        className="mt-2 space-y-5 max-h-[300px] overflow-y-auto no-scrollbar py-8"
                    >
                        {lyrics.map((line, idx) => {
                            const isActive = idx === activeLyricIndex;
                            return (
                                <p 
                                    key={line.id} 
                                    onClick={() => setCurrentTime(line.startTime)}
                                    className={`
                                        text-xl md:text-2xl font-bold transition-all duration-300 cursor-pointer origin-left leading-relaxed
                                        ${isActive ? 'text-white scale-100 opacity-100' : 'text-zinc-500 scale-95 opacity-60 hover:opacity-100 hover:text-zinc-300'}
                                    `}
                                >
                                    {line.text}
                                </p>
                            )
                        })}
                        <div className="h-24"></div> 
                    </div>
                     <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-800/80 to-transparent z-10 pointer-events-none"></div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default MusicWidget;
