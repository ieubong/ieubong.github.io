
import React, { useMemo } from 'react';
import { ThemePack } from '../types';
import { THEME_PACKS, MEMORY_DATA, MINI_PLAYER_THEMES } from '../constants';
import { X, Check, CloudRain, Sparkles, Map, CalendarClock, PieChart, Pencil, Dices } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemePack;
  themePack: ThemePack; // The base pack
  currentVariantId: string;
  miniPlayerThemeId: string;
  onChangeTheme: (id: string) => void;
  onChangeVariant: (id: string) => void;
  onChangeMiniPlayerTheme: (id: string) => void;
  showWeather: boolean;
  toggleWeather: () => void;
  upcomingCount: number;
  setUpcomingCount: (count: number) => void;
  appTitle: string;
  setAppTitle: (title: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, onClose, theme, themePack, currentVariantId, miniPlayerThemeId,
    onChangeTheme, onChangeVariant, onChangeMiniPlayerTheme, showWeather, toggleWeather,
    upcomingCount, setUpcomingCount, appTitle, setAppTitle
}) => {
  if (!isOpen) return null;

  // Calculate Journey Stats
  const memoryDetails = MEMORY_DATA.flatMap(l => l.detail);
  const totalMoments = memoryDetails.length;
  
  // Fake "Days Since Start" for demo effect
  const daysSinceStart = 142; 

  const handleRandomTitle = () => {
      const RANDOM_TITLES = [
        "Our Memory World 🐰🦊", 
        "Our Little Planet 🌍", 
        "Love Journey 🚀", 
        "You & Me Forever ❤️", 
        "Our Adventures 🎒",
        "The Story of Us 📖",
        "Two Peas in a Pod 🫛"
    ];
    setAppTitle(RANDOM_TITLES[Math.floor(Math.random() * RANDOM_TITLES.length)]);
  };

  // Analytics Logic
  const topMood = useMemo(() => {
    const counts: Record<string, number> = {};
    memoryDetails.forEach(d => {
        if (d.mood) counts[d.mood] = (counts[d.mood] || 0) + 1;
    });
    return Object.entries(counts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'Unknown';
  }, [memoryDetails]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className={`
        relative w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden
        ${theme.colors.panelBg}
        animate-pop max-h-[85vh] flex flex-col
      `}>
        <div className="p-6 border-b border-gray-100/10 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-black ${theme.colors.text}`}>Z-Settings</h2>
            <button onClick={onClose} className={`p-2 rounded-full hover:bg-black/10 ${theme.colors.text}`}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content with padding for scrollbar */}
        <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar pr-2 mr-1 flex-1">
          
          {/* Journey Stats */}
          <div className="grid grid-cols-2 gap-3">
             <div className={`p-3 rounded-2xl bg-white/50 border border-white/40 flex flex-col items-center justify-center text-center`}>
                <span className={`text-3xl font-black text-gray-800`}>{totalMoments}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider opacity-60 text-gray-600`}>Moments</span>
             </div>
              <div className={`p-3 rounded-2xl bg-white/50 border border-white/40 flex flex-col items-center justify-center text-center`}>
                <span className={`text-3xl font-black text-gray-800`}>{daysSinceStart}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider opacity-60 text-gray-600`}>Days Together</span>
             </div>
          </div>

          {/* New Analytics Section */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-2xl border border-indigo-100/20">
             <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 opacity-80 flex items-center gap-2 ${theme.colors.text}`}>
                <PieChart size={12} /> Analytics
             </h3>
             <div className="flex justify-between items-center">
                <div className={`text-sm opacity-80 ${theme.colors.text}`}>Dominant Vibe</div>
                <div className="font-black text-lg capitalize px-3 py-1 bg-white/40 rounded-lg text-gray-800">{topMood}</div>
             </div>
             <div className="mt-3 h-2 w-full bg-white/30 rounded-full overflow-hidden flex">
                 {/* Simple Visual Bar */}
                 <div className="h-full bg-pink-400 w-[40%]"></div>
                 <div className="h-full bg-blue-400 w-[30%]"></div>
                 <div className="h-full bg-yellow-400 w-[20%]"></div>
                 <div className="h-full bg-green-400 w-[10%]"></div>
             </div>
             <div className={`flex justify-between text-[9px] mt-1 opacity-60 font-bold uppercase ${theme.colors.text}`}>
                <span>Happy</span>
                <span>Chill</span>
                <span>Fun</span>
                <span>Other</span>
             </div>
          </div>

          {/* Preferences & Personalization */}
           <div>
             <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 opacity-60 ${theme.colors.text}`}>Preferences</h3>
             
             <div className="space-y-4">
                {/* App Title */}
                <div>
                    <label className={`text-xs font-bold uppercase opacity-50 mb-1 block ml-1 ${theme.colors.text}`}>App Name</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={appTitle}
                            onChange={(e) => setAppTitle(e.target.value)}
                            className="flex-1 bg-white/60 border border-white/30 rounded-xl px-3 py-2 font-bold text-sm outline-none focus:ring-2 focus:ring-pink-300 text-gray-900 placeholder-gray-500"
                            placeholder="Name your app..."
                        />
                        <button onClick={handleRandomTitle} className="p-2 bg-white/60 rounded-xl hover:bg-white border border-white/30 text-gray-600">
                            <Dices size={20} />
                        </button>
                    </div>
                </div>

                {/* Weather Toggle */}
                <button 
                    onClick={toggleWeather}
                    className={`w-full flex items-center justify-between p-3 rounded-xl ${showWeather ? 'bg-green-500/10 text-green-600' : 'bg-gray-100/50 text-gray-500'}`}
                >
                    <div className="flex items-center gap-3">
                        <CloudRain size={20} />
                        <span className="font-bold text-sm">Weather Effects</span>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${showWeather ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${showWeather ? 'translate-x-4' : ''}`}></div>
                    </div>
                </button>

                {/* Upcoming Memories Slider */}
                <div className={`p-3 rounded-xl bg-gray-100/50`}>
                    <div className="flex justify-between items-center mb-2">
                         <div className="flex items-center gap-3 text-gray-600">
                             <CalendarClock size={20} />
                             <span className="font-bold text-sm">Upcoming Memories</span>
                         </div>
                         <span className="font-bold text-lg text-gray-800">{upcomingCount}</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={upcomingCount}
                        onChange={(e) => setUpcomingCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Number of upcoming events shown in Time Capsule.</p>
                </div>
             </div>
           </div>

          {/* Theme Packs */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 opacity-60 ${theme.colors.text}`}>Theme Packs</h3>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(THEME_PACKS).map((pack) => {
                const isActive = theme.id === pack.id;
                return (
                  <button
                      key={pack.id}
                      onClick={() => onChangeTheme(pack.id)}
                      className={`
                        relative p-3 rounded-2xl border-2 transition-all flex items-center gap-3 overflow-hidden
                        ${isActive ? `border-current ${theme.colors.primary} text-white` : 'border-transparent bg-gray-100/50 hover:bg-gray-200/50 text-gray-500'}
                      `}
                  >
                      <div className={`w-10 h-10 rounded-xl shadow-inner ${pack.colors.primary}`}></div>
                      <div className="flex-1 text-left">
                        <h4 className="font-bold">{pack.label}</h4>
                      </div>
                      {isActive && <Check size={20} />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sub Themes (Variants) */}
          <div>
             <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 opacity-60 ${theme.colors.text}`}>Style Variants</h3>
             <div className="grid grid-cols-2 gap-3">
                {themePack.variants.map((v) => {
                    const isActive = currentVariantId === v.id;
                    return (
                        <button 
                            key={v.id}
                            onClick={() => onChangeVariant(v.id)}
                            className={`
                                p-3 rounded-xl border-2 text-left transition-all
                                ${isActive ? `border-current ${theme.colors.secondary} text-white` : 'border-transparent bg-gray-100/50 hover:bg-gray-200/50 text-gray-500'}
                            `}
                        >
                            <div className={`w-full h-8 rounded-lg mb-2 ${v.colors.primary}`}></div>
                            <span className="text-xs font-bold block">{v.label}</span>
                        </button>
                    )
                })}
             </div>
          </div>

          {/* Mini Player Theme */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 opacity-60 ${theme.colors.text}`}>Mini Player Style</h3>
            <div className="grid grid-cols-1 gap-2">
                {MINI_PLAYER_THEMES.map((playerTheme) => {
                    const isActive = miniPlayerThemeId === playerTheme.id;
                    return (
                        <button 
                            key={playerTheme.id}
                            onClick={() => onChangeMiniPlayerTheme(playerTheme.id)}
                            className={`
                                p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between
                                ${isActive ? `border-current ${theme.colors.secondary} text-white` : 'border-transparent bg-gray-100/50 hover:bg-gray-200/50 text-gray-500'}
                            `}
                        >
                            <span className="font-bold text-sm">{playerTheme.label}</span>
                            {/* Color Swatch Preview */}
                            <div className={`w-16 h-4 rounded-full ${playerTheme.progressGradient} opacity-80`}></div>
                        </button>
                    )
                })}
            </div>
          </div>

          <div className="text-center pt-2 pb-2">
             <p className={`text-xs opacity-50 ${theme.colors.subText}`}>App Version 2.3.0 • Z-OS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
