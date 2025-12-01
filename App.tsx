
import React, { useState, useEffect, useRef } from 'react';
import MemoryMap from './components/MemoryMap';
import MemoryDrawer from './components/MemoryDrawer';
import SettingsModal from './components/SettingsModal';
import MusicWidget from './components/MusicWidget';
import WeatherOverlay from './components/WeatherOverlay';
import TimeCapsuleModal from './components/TimeCapsuleModal';
import ClickSparkles from './components/ClickSparkles';
import FilterPanel from './components/FilterPanel';
import GalleryGrid from './components/GalleryGrid';
import MemoryQuiz from './components/MemoryQuiz';
import MemoryMatch from './components/MemoryMatch'; 
import SlidingPuzzle from './components/SlidingPuzzle'; 
import ShootingGame from './components/ShootingGame'; 
import DatePlanner from './components/DatePlanner';
import ScratchCard from './components/ScratchCard';
import LoveLetterGenerator from './components/LoveLetterGenerator'; 
import DailyTarot from './components/DailyTarot'; 
import IntroAnimation from './components/IntroAnimation';
import FloatingHeart from './components/FloatingHeart';
import { MEMORY_DATA, THEME_PACKS } from './constants';
import { MemoryLocation, ThemePack } from './types';
import { Search, Settings, Map as MapIcon, Music, Dices, CalendarHeart, SlidersHorizontal, X, Grid2X2, Map as MapIcon2, Gamepad2, Sparkles, LayoutGrid, Gift, PenTool, MapPin, Grid3x3, Puzzle, Crosshair, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';

const RANDOM_TITLES = [
    "Our Memory World 🐰🦊", 
    "Our Little Planet 🌍", 
    "Love Journey 🚀", 
    "You & Me Forever ❤️", 
    "Our Adventures 🎒"
];

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<MemoryLocation | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState<string>('zootopia');
  const [currentVariantId, setCurrentVariantId] = useState<string>('judy'); 
  const [miniPlayerThemeId, setMiniPlayerThemeId] = useState<string>('midnight'); 
  const [appTitle, setAppTitle] = useState(() => RANDOM_TITLES[Math.floor(Math.random() * RANDOM_TITLES.length)]);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTimeCapsuleOpen, setIsTimeCapsuleOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMatchOpen, setIsMatchOpen] = useState(false); 
  const [isPuzzleOpen, setIsPuzzleOpen] = useState(false); 
  const [isShootingOpen, setIsShootingOpen] = useState(false); 
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isScratchOpen, setIsScratchOpen] = useState(false); 
  const [isLetterOpen, setIsLetterOpen] = useState(false); 
  const [isTarotOpen, setIsTarotOpen] = useState(false); 
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const [showMusic, setShowMusic] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(MEMORY_DATA);
  const [showWeather, setShowWeather] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'gallery'>('map'); 
  const [visibleCount, setVisibleCount] = useState(MEMORY_DATA.length);
  
  const [upcomingCount, setUpcomingCount] = useState<number>(3);
  const [showFilters, setShowFilters] = useState(false);
  const [filterYear, setFilterYear] = useState('all');
  const [filterRating, setFilterRating] = useState(0);
  const [filterMood, setFilterMood] = useState('all');
  const [loveToast, setLoveToast] = useState<{msg: string, icon?: string} | null>(null);

  const themePack = THEME_PACKS[currentThemeId];
  const variant = themePack.variants.find(v => v.id === currentVariantId) || themePack.variants[0];
  
  const activeTheme: ThemePack = {
    ...themePack,
    colors: variant.colors,
    icon: variant.iconOverride || themePack.icon
  };

  useEffect(() => {
    const pack = THEME_PACKS[currentThemeId];
    if (!pack.variants.find(v => v.id === currentVariantId)) {
        setCurrentVariantId(pack.variants[0].id);
    }
  }, [currentThemeId]);

  useEffect(() => {
      let data = MEMORY_DATA;
      if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        data = data.filter(loc => 
            loc.name.toLowerCase().includes(lowerQ) || 
            loc.detail.some(d => d.desc.toLowerCase().includes(lowerQ) || d.date.includes(lowerQ))
        );
      }
      if (filterYear !== 'all') {
          data = data.filter(loc => loc.detail.some(d => d.date.includes(filterYear)));
      }
      if (filterRating > 0) {
          data = data.filter(loc => loc.detail.some(d => (d.rating || 0) >= filterRating));
      }
      if (filterMood !== 'all') {
          data = data.filter(loc => loc.detail.some(d => d.mood === filterMood));
      }
      setFilteredData(data);
  }, [searchQuery, filterYear, filterRating, filterMood]);

  const handleShuffle = () => {
    const randomIdx = Math.floor(Math.random() * filteredData.length);
    setSelectedLocation(filteredData[randomIdx]);
  };

  const resetFilters = () => {
      setFilterYear('all');
      setFilterRating(0);
      setFilterMood('all');
      setSearchQuery("");
  };

  const handleSendLove = (msg: string, emoji: string) => {
      setLoveToast({ msg, icon: emoji });
      for(let i=0; i<15; i++) {
          const el = document.createElement('div');
          el.innerHTML = emoji;
          el.style.position = 'fixed';
          el.style.left = Math.random() * window.innerWidth + 'px';
          el.style.bottom = '-50px';
          el.style.fontSize = Math.random() * 20 + 20 + 'px';
          el.style.transition = `transform ${Math.random()*2 + 3}s ease-out, opacity 3s`;
          el.style.zIndex = '9999';
          document.body.appendChild(el);
          
          setTimeout(() => {
              el.style.transform = `translateY(-${window.innerHeight + 100}px) rotate(${Math.random()*360}deg)`;
              el.style.opacity = '0';
          }, 100);
          setTimeout(() => el.remove(), 5000);
      }
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#F472B6', '#EC4899'] });
      setTimeout(() => setLoveToast(null), 3000);
  };

  return (
    <div className={`relative h-screen w-full overflow-hidden flex flex-col font-sans transition-colors duration-500 ${activeTheme.colors.bgGradient}`}>
      
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      <ClickSparkles />
      {showWeather && <WeatherOverlay theme={activeTheme} />}

      {/* Love Toast (Magical Notification) */}
      {loveToast && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5000] animate-pop">
              <div className="bg-white/80 backdrop-blur-xl px-8 py-5 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/60 flex flex-col items-center">
                  <div className="text-5xl animate-bounce mb-2 filter drop-shadow-md">{loveToast.icon}</div>
                  <span className="font-serif font-bold text-xl text-gray-800 tracking-wide text-center whitespace-nowrap">{loveToast.msg}</span>
              </div>
          </div>
      )}

      {/* Top Floating Island (Search) */}
      <div className="absolute top-6 left-0 right-0 z-[400] flex justify-center pointer-events-none px-4">
        <div className="w-full max-w-lg flex flex-col items-center gap-3 pointer-events-auto transition-all duration-300">
            
            {/* Main Pill */}
            <div className={`
                w-full flex items-center p-2 pr-2 pl-5 rounded-full 
                shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] 
                backdrop-blur-2xl border border-white/40
                ${activeTheme.colors.dockBg} 
                group hover:shadow-magical transition-all
            `}>
                  <Search size={22} className={`${activeTheme.colors.subText} opacity-70`} />
                  <input 
                    type="text" 
                    placeholder="Search our memories..." 
                    className={`bg-transparent border-none outline-none ml-3 w-full placeholder:text-gray-400 font-bold text-lg ${activeTheme.colors.text}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  {/* View Toggles inside the pill */}
                  <div className="flex gap-1 ml-2 bg-gray-100/50 p-1 rounded-full">
                    <button onClick={() => setViewMode('map')} className={`p-2 rounded-full transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}>
                        <MapIcon2 size={18} />
                    </button>
                    <button onClick={() => setViewMode('gallery')} className={`p-2 rounded-full transition-all ${viewMode === 'gallery' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}>
                        <Grid2X2 size={18} />
                    </button>
                  </div>
            </div>

            {/* Sub-Pills Row (Filters & Stats) */}
            <div className="flex gap-3 w-full justify-center">
                <button 
                    onClick={() => setShowFilters(!showFilters)} 
                    className={`
                        px-4 py-2 rounded-full flex items-center gap-2 text-xs font-black uppercase tracking-wider
                        backdrop-blur-xl border border-white/30 shadow-sm hover:scale-105 transition-transform
                        ${showFilters ? `${activeTheme.colors.primary} text-white` : 'bg-white/60 text-gray-600'}
                    `}
                >
                    <SlidersHorizontal size={14} /> Filters
                </button>

                {viewMode === 'map' && (
                    <div className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-xs font-black text-white uppercase tracking-wider">
                            Visible: {visibleCount}
                        </span>
                    </div>
                )}
            </div>
            
            {showFilters && (
                <div className="w-full">
                    <FilterPanel theme={activeTheme} filterYear={filterYear} setFilterYear={setFilterYear} filterRating={filterRating} setFilterRating={setFilterRating} filterMood={filterMood} setFilterMood={setFilterMood} onReset={resetFilters} />
                </div>
            )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-0 overflow-hidden">
        {viewMode === 'map' ? (
            <MemoryMap 
                data={filteredData} 
                onSelectLocation={setSelectedLocation} 
                selectedLocation={selectedLocation} 
                theme={activeTheme} 
                onVisibleCountChange={setVisibleCount}
            />
        ) : (
            <GalleryGrid data={filteredData} onSelectLocation={setSelectedLocation} theme={activeTheme} />
        )}
      </div>

      <FloatingHeart onSendLove={handleSendLove} theme={activeTheme} />

      {/* --- MODERN FLOATING DOCK --- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-4">
        
        {/* Pop-up Menu */}
        {isMoreMenuOpen && (
            <div className={`
                p-4 rounded-[32px] shadow-2xl border border-white/30 backdrop-blur-2xl animate-pop
                grid grid-cols-3 gap-4 w-[280px] mb-2
                ${activeTheme.colors.panelBg}
            `}>
                <MenuButton label="Music" icon={<Music size={24} />} onClick={() => { setShowMusic(!showMusic); setIsMoreMenuOpen(false); }} theme={activeTheme} color={showMusic ? "bg-green-100 text-green-700" : "bg-pink-100 text-pink-600"} />
                <MenuButton label="Quiz" icon={<Gamepad2 size={24} />} onClick={() => { setIsQuizOpen(true); setIsMoreMenuOpen(false); }} theme={activeTheme} color="bg-purple-100 text-purple-600" />
                <MenuButton label="Match" icon={<Grid3x3 size={24} />} onClick={() => { setIsMatchOpen(true); setIsMoreMenuOpen(false); }} theme={activeTheme} color="bg-blue-100 text-blue-600" />
                <MenuButton label="Puzzle" icon={<Puzzle size={24} />} onClick={() => { setIsPuzzleOpen(true); setIsMoreMenuOpen(false); }} theme={activeTheme} color="bg-yellow-100 text-yellow-600" />
                <MenuButton label="Shooter" icon={<Crosshair size={24} />} onClick={() => { setIsShootingOpen(true); setIsMoreMenuOpen(false); }} theme={activeTheme} color="bg-red-100 text-red-600" />
                <MenuButton label="Tarot" icon={<Moon size={24} />} onClick={() => { setIsTarotOpen(true); setIsMoreMenuOpen(false); }} theme={activeTheme} color="bg-indigo-100 text-indigo-600" />
                <MenuButton label="Planner" icon={<Sparkles size={24} />} onClick={() => { setIsPlannerOpen(true); setIsMoreMenuOpen(false); }} theme={activeTheme} color="bg-pink-100 text-pink-600" />
                <MenuButton label="Scratch" icon={<Gift size={24} />} onClick={() => { setIsScratchOpen(true); setIsMoreMenuOpen(false); }} theme={activeTheme} color="bg-orange-100 text-orange-600" />
                <MenuButton label="Letter" icon={<PenTool size={24} />} onClick={() => { setIsLetterOpen(true); setIsMoreMenuOpen(false); }} theme={activeTheme} color="bg-teal-100 text-teal-600" />
            </div>
        )}

        {/* The Capsule Dock */}
        <div className={`
          flex items-center p-2 rounded-full shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)] 
          backdrop-blur-3xl border border-white/30
          bg-white/70 scale-95 md:scale-100 gap-1
        `}>
          <DockItem icon={<MapIcon size={24} />} label="Map" active={!selectedLocation && viewMode === 'map'} onClick={() => { setViewMode('map'); setSelectedLocation(null); }} theme={activeTheme} />
          <DockItem icon={<Dices size={24} />} label="Shuffle" active={false} onClick={handleShuffle} theme={activeTheme} />
          
          {/* Main Action Button (Center) */}
          <div className="mx-2">
             <button 
                onClick={() => setIsTimeCapsuleOpen(true)}
                className={`
                    w-16 h-16 rounded-full flex items-center justify-center 
                    bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-300/50
                    transform hover:-translate-y-2 hover:scale-110 transition-all duration-300 border-4 border-white/50
                `}
             >
                 <CalendarHeart size={28} />
             </button>
          </div>

          <DockItem icon={<Settings size={24} />} label="Settings" active={isSettingsOpen} onClick={() => setIsSettingsOpen(true)} theme={activeTheme} />
          
          <button 
             onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
             className={`p-4 rounded-full hover:bg-black/5 transition-colors text-gray-500 ${isMoreMenuOpen ? 'bg-black/10 text-black' : ''}`}
          >
             <LayoutGrid size={24} />
          </button>
        </div>
      </div>

      {/* --- WIDGETS --- */}
      <MemoryDrawer location={selectedLocation} onClose={() => setSelectedLocation(null)} theme={activeTheme} />
      {isTimeCapsuleOpen && <TimeCapsuleModal isOpen={isTimeCapsuleOpen} onClose={() => setIsTimeCapsuleOpen(false)} theme={activeTheme} onSelectLocation={setSelectedLocation} upcomingCount={upcomingCount} />}
      {isQuizOpen && <MemoryQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} theme={activeTheme} />}
      {isMatchOpen && <MemoryMatch isOpen={isMatchOpen} onClose={() => setIsMatchOpen(false)} theme={activeTheme} />}
      {isPuzzleOpen && <SlidingPuzzle isOpen={isPuzzleOpen} onClose={() => setIsPuzzleOpen(false)} theme={activeTheme} />}
      {isShootingOpen && <ShootingGame isOpen={isShootingOpen} onClose={() => setIsShootingOpen(false)} theme={activeTheme} />}
      {isPlannerOpen && <DatePlanner isOpen={isPlannerOpen} onClose={() => setIsPlannerOpen(false)} theme={activeTheme} />}
      {isScratchOpen && <ScratchCard isOpen={isScratchOpen} onClose={() => setIsScratchOpen(false)} theme={activeTheme} />}
      {isLetterOpen && <LoveLetterGenerator isOpen={isLetterOpen} onClose={() => setIsLetterOpen(false)} theme={activeTheme} />}
      {isTarotOpen && <DailyTarot isOpen={isTarotOpen} onClose={() => setIsTarotOpen(false)} theme={activeTheme} />}

      {isSettingsOpen && (
        <SettingsModal 
          isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} theme={activeTheme} themePack={themePack}
          currentVariantId={currentVariantId} miniPlayerThemeId={miniPlayerThemeId} onChangeTheme={setCurrentThemeId}
          onChangeVariant={setCurrentVariantId} onChangeMiniPlayerTheme={setMiniPlayerThemeId} showWeather={showWeather}
          toggleWeather={() => setShowWeather(!showWeather)} upcomingCount={upcomingCount} setUpcomingCount={setUpcomingCount}
          appTitle={appTitle} setAppTitle={setAppTitle}
        />
      )}

      {showMusic && <MusicWidget theme={activeTheme} miniPlayerThemeId={miniPlayerThemeId} onClose={() => setShowMusic(false)} />}
    </div>
  );
};

const DockItem = ({ icon, label, active, onClick, theme }: any) => {
  return (
    <button 
      onClick={onClick}
      className={`
        relative group p-4 rounded-full transition-all duration-300 ease-out flex-shrink-0
        ${active ? 'bg-black/5 text-pink-600' : 'text-gray-500 hover:bg-black/5 hover:text-gray-700'}
      `}
    >
      {icon}
      <span className={`
        absolute -top-12 left-1/2 -translate-x-1/2 
        px-3 py-1.5 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-all
        bg-black/80 backdrop-blur-md text-white shadow-lg pointer-events-none whitespace-nowrap
        transform translate-y-2 group-hover:translate-y-0
      `}>
        {label}
      </span>
      {active && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pink-500" />}
    </button>
  )
}

const MenuButton = ({ label, icon, onClick, theme, color }: any) => (
    <button 
        onClick={onClick}
        className={`
            flex flex-col items-center justify-center p-3 rounded-2xl transition-all hover:scale-105 active:scale-95
            ${color ? color : 'bg-gray-100 text-gray-600'}
        `}
    >
        <div className="mb-2">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-wide">{label}</span>
    </button>
)

export default App;
