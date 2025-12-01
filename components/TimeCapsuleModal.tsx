
import React, { useMemo, useState, useEffect } from 'react';
import { ThemePack, MemoryLocation } from '../types';
import { MEMORY_DATA } from '../constants';
import { X, Timer, Sparkles, MapPin, Trophy, Utensils, Moon, Camera, Plane, Coffee, CloudRain, Heart, Home, Sun, Snowflake, Leaf, Music, Star, Zap, Crown, Lock, Send, PenTool, Flag, Gift, Smile, Ticket, Bike, Anchor, Umbrella, Key, Rocket, Gamepad2, Beer, ShoppingBag, CalendarClock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TimeCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemePack;
  onSelectLocation: (location: MemoryLocation) => void;
  upcomingCount: number;
}

const QUOTES = [
  "Every moment with you is a memory I want to keep forever.",
  "Collecting beautiful moments, one day at a time.",
  "Happiness is planning a trip to somewhere new with you.",
  "Distance means so little when someone means so much.",
  "Let's find some beautiful place to get lost together.",
  "You are my favorite adventure.",
  "Love is the map that leads me home.",
];

interface Badge {
    id: string;
    icon: React.ReactNode;
    title: string;
    desc: string;
    isUnlocked: boolean;
    color: string;
    xp: number;
    category: string;
}

const LEVEL_TITLES = [
    { level: 1, title: "Novice Explorers", minXp: 0 },
    { level: 2, title: "Memory Collectors", minXp: 100 },
    { level: 3, title: "Adventurous Duo", minXp: 300 },
    { level: 4, title: "Soulmates", minXp: 600 },
    { level: 5, title: "Eternal Partners", minXp: 1200 },
    { level: 6, title: "Legendary Lovers", minXp: 2500 },
];

const TimeCapsuleModal: React.FC<TimeCapsuleModalProps> = ({ isOpen, onClose, theme, onSelectLocation, upcomingCount }) => {
  const [activeTab, setActiveTab] = useState<'capsule' | 'badges'>('capsule');
  const [badgeCategory, setBadgeCategory] = useState<string>('All');
  
  const [noteText, setNoteText] = useState("");
  const [isNoteSent, setIsNoteSent] = useState(false);
  
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;

  // --- Logic: On This Day ---
  const memoriesOnThisDay = useMemo(() => {
    const matches: { loc: MemoryLocation; detail: any; year: number }[] = [];
    MEMORY_DATA.forEach(loc => {
      loc.detail.forEach(d => {
        const dateMatch = d.date.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (dateMatch) {
          const day = parseInt(dateMatch[1]);
          const month = parseInt(dateMatch[2]);
          const year = parseInt(dateMatch[3]);
          if (day === currentDay && month === currentMonth) {
            matches.push({ loc, detail: d, year });
          }
        }
      });
    });
    return matches.sort((a, b) => b.year - a.year);
  }, [currentDay, currentMonth]);

  // --- Logic: Upcoming ---
  const upcomingList = useMemo(() => {
    const upcoming: { loc: MemoryLocation; detail: any; date: Date; daysLeft: number }[] = [];
    const currentYear = today.getFullYear();
    MEMORY_DATA.forEach(loc => {
      loc.detail.forEach(d => {
        const dateMatch = d.date.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (dateMatch) {
            const day = parseInt(dateMatch[1]);
            const month = parseInt(dateMatch[2]);
            let targetDate = new Date(currentYear, month - 1, day);
            // If date has passed this year, look at next year
            if (targetDate.getTime() < today.setHours(0,0,0,0)) {
                targetDate = new Date(currentYear + 1, month - 1, day);
            }
            
            const diffTime = targetDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Filter only if it's within the next 30 days or specifically upcoming
            if (diffDays >= 0 && diffDays <= 60) {
                upcoming.push({ loc, detail: d, date: targetDate, daysLeft: diffDays });
            }
        }
      });
    });
    // Sort by soonest
    return upcoming.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, upcomingCount);
  }, [upcomingCount]);

  // --- 100+ BADGES GENERATION ---
  const badges: Badge[] = useMemo(() => {
      const allDetails = MEMORY_DATA.flatMap(l => l.detail);
      const totalMemories = allDetails.length;
      const totalLocations = MEMORY_DATA.length;
      
      const countMood = (m: string) => allDetails.filter(d => d.mood === m).length;
      const hasKeyword = (words: string[]) => allDetails.some(d => words.some(w => d.desc.toLowerCase().includes(w)));
      const countKeyword = (word: string) => allDetails.filter(d => d.desc.toLowerCase().includes(word)).length;
      
      const getHour = (d: any) => parseInt(d.date.split(':')[0]) || 0;
      const getMonth = (d: any) => { const m = d.date.match(/\/(\d{1,2})\//); return m ? parseInt(m[1]) : 0; };
      const getYear = (d: any) => { const m = d.date.match(/\/(\d{4})/); return m ? parseInt(m[1]) : 0; };

      const nightCount = allDetails.filter(d => { const h = getHour(d); return h >= 22 || h <= 4; }).length;
      const earlyCount = allDetails.filter(d => { const h = getHour(d); return h >= 5 && h <= 9; }).length;
      const winterCount = allDetails.filter(d => [12, 1, 2].includes(getMonth(d))).length;
      const summerCount = allDetails.filter(d => [6, 7, 8].includes(getMonth(d))).length;
      
      const yearsActive = new Set(allDetails.map(d => getYear(d))).size;

      const list: Badge[] = [];

      // Helper
      const add = (id: string, cat: string, title: string, desc: string, icon: React.ReactNode, color: string, xp: number, condition: boolean) => {
          list.push({ id, category: cat, title, desc, icon, color, xp, isUnlocked: condition });
      };

      // 1. MILESTONE LEVELS (Procedural 1-20) - "Collection"
      [1, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach(level => {
          add(`level_${level}`, 'Milestone', `Memory Lvl ${level}`, `Saved ${level} memories.`, <Sparkles size={18} />, 'bg-yellow-400', level * 10, totalMemories >= level);
      });

      // 2. LOCATION COUNTS (Procedural) - "Explorer"
      [1, 5, 10, 20, 50].forEach(locCount => {
          add(`loc_${locCount}`, 'Explorer', `Explorer Rank ${locCount}`, `Visited ${locCount} distinct places.`, <Flag size={18} />, 'bg-green-500', locCount * 15, totalLocations >= locCount);
      });

      // 3. MOOD BADGES (Procedural)
      ['happy', 'romantic', 'funny', 'chaos', 'chill', 'foodie'].forEach(mood => {
          add(`mood_${mood}_1`, 'Vibe', `${mood.charAt(0).toUpperCase() + mood.slice(1)} Starter`, `1 ${mood} memory.`, <Smile size={18} />, 'bg-pink-400', 20, countMood(mood) >= 1);
          add(`mood_${mood}_5`, 'Vibe', `${mood.charAt(0).toUpperCase() + mood.slice(1)} Expert`, `5 ${mood} memories.`, <Heart size={18} />, 'bg-purple-500', 50, countMood(mood) >= 5);
      });

      // 4. FUN & SPECIFIC BADGES (Manual)
      add('first_date', 'Special', 'The Beginning', 'Saved your first memory.', <Key size={18} />, 'bg-amber-500', 50, totalMemories >= 1);
      add('anniversary_1', 'Special', 'One Year Strong', 'Memories spanning 2 different years.', <Crown size={18} />, 'bg-red-500', 100, yearsActive >= 2);
      
      add('night_owl', 'Lifestyle', 'Night Owls', '3+ memories after 10PM.', <Moon size={18} />, 'bg-indigo-600', 30, nightCount >= 3);
      add('early_bird', 'Lifestyle', 'Morning Glories', '3+ memories before 9AM.', <Sun size={18} />, 'bg-orange-300', 30, earlyCount >= 3);
      
      add('coffee_lover', 'Lifestyle', 'Coffee Date', 'Mentioned "cafe" or "coffee".', <Coffee size={18} />, 'bg-amber-700', 20, hasKeyword(['cafe', 'coffee', 'cà phê']));
      add('food_coma', 'Lifestyle', 'Food Coma', 'Mentioned "ngon", "bún", "phở".', <Utensils size={18} />, 'bg-red-400', 20, hasKeyword(['ngon', 'bún', 'phở', 'ăn', 'thịt']));
      add('sweet_tooth', 'Lifestyle', 'Sweet Tooth', 'Mentioned "cake", "kem", "chè".', <Star size={18} />, 'bg-pink-300', 20, hasKeyword(['cake', 'kem', 'chè', 'ngọt']));
      
      add('travel_bug', 'Explorer', 'Travel Bug', 'Mentioned "du lịch", "trip".', <Plane size={18} />, 'bg-blue-500', 40, hasKeyword(['du lịch', 'trip', 'biển', 'núi']));
      add('homebody', 'Explorer', 'Cozy Home', '3+ memories at "Home".', <Home size={18} />, 'bg-emerald-500', 30, countKeyword('home') + countKeyword('nhà') >= 3);
      
      add('winter_sonata', 'Seasonal', 'Winter Baby', 'Memories in Dec-Feb.', <Snowflake size={18} />, 'bg-cyan-200', 30, winterCount >= 1);
      add('summer_vibes', 'Seasonal', 'Summer Lovin', 'Memories in Jun-Aug.', <Sun size={18} />, 'bg-yellow-400', 30, summerCount >= 1);
      add('rainy_day', 'Seasonal', 'Rainy Days', 'Mentioned "mưa", "rain".', <Umbrella size={18} />, 'bg-blue-700', 25, hasKeyword(['mưa', 'rain', 'ướt']));
      
      add('gift_giver', 'Love', 'Surprise!', 'Mentioned "gift", "quà".', <Gift size={18} />, 'bg-rose-500', 30, hasKeyword(['gift', 'quà', 'tặng']));
      add('fight_club', 'Real', 'Forgive & Forget', 'Mentioned "dỗi", "cãi".', <Zap size={18} />, 'bg-gray-500', 50, hasKeyword(['dỗi', 'cãi', 'bực']));
      add('cinema', 'Lifestyle', 'Movie Night', 'Mentioned "phim", "cinema".', <Ticket size={18} />, 'bg-purple-700', 25, hasKeyword(['phim', 'cinema', 'rạp']));
      add('shopaholic', 'Lifestyle', 'Shopaholic', 'Mentioned "mua", "shopping".', <ShoppingBag size={18} />, 'bg-pink-600', 25, hasKeyword(['mua', 'shopping', 'sắm']));
      add('gamer', 'Lifestyle', 'Gamer Duo', 'Mentioned "game", "net".', <Gamepad2 size={18} />, 'bg-indigo-500', 25, hasKeyword(['game', 'net', 'chơi']));
      
      add('photographer', 'Art', 'Shutterbug', '10+ photos uploaded.', <Camera size={18} />, 'bg-teal-500', 40, allDetails.filter(d => d.img).length >= 10);
      add('biker', 'Explorer', 'Road Trip', 'Mentioned "xe", "lượn".', <Bike size={18} />, 'bg-orange-600', 25, hasKeyword(['xe', 'lượn', 'đèo']));
      add('alcohol', 'Lifestyle', 'Cheers!', 'Mentioned "bia", "rượu".', <Beer size={18} />, 'bg-yellow-600', 25, hasKeyword(['bia', 'rượu', 'nhậu']));
      
      return list;
  }, []);

  const currentXP = useMemo(() => badges.filter(b => b.isUnlocked).reduce((acc, b) => acc + b.xp, 0), [badges]);
  const currentLevel = useMemo(() => {
      let lvl = LEVEL_TITLES[0];
      for (const l of LEVEL_TITLES) {
          if (currentXP >= l.minXp) lvl = l;
      }
      return lvl;
  }, [currentXP]);
  
  const nextLevel = LEVEL_TITLES.find(l => l.level === currentLevel.level + 1);
  const xpProgress = nextLevel 
    ? Math.min(100, Math.max(0, Math.round(((currentXP - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100))) 
    : 100;

  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const filteredBadges = badgeCategory === 'All' ? badges : badges.filter(b => b.category === badgeCategory);
  const categories = ['All', ...Array.from(new Set(badges.map(b => b.category)))];

  const randomQuote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  const handleSendNote = () => {
      if (!noteText.trim()) return;
      setIsNoteSent(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => { setNoteText(""); }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

      <div className={`
        relative w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden
        ${theme.colors.panelBg}
        animate-pop max-h-[90vh] flex flex-col border-4 border-white/20
      `}>
         {/* Tabs */}
         <div className="p-4 flex gap-2 justify-center border-b border-white/10 flex-shrink-0 z-10">
            <button onClick={() => setActiveTab('capsule')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${activeTab === 'capsule' ? `${theme.colors.primary} text-white shadow-lg` : 'bg-white/20 hover:bg-white/40'}`}>Capsule</button>
            <button onClick={() => setActiveTab('badges')} className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${activeTab === 'badges' ? `${theme.colors.primary} text-white shadow-lg` : 'bg-white/20 hover:bg-white/40'}`}>Badges</button>
            <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 ${theme.colors.text}`}><X size={24} /></button>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            
            {activeTab === 'capsule' && (
                <>
                    {/* Quote */}
                    <div className="text-center px-4 py-2">
                        <p className={`text-lg font-serif italic leading-relaxed ${theme.colors.text} opacity-80`}>"{randomQuote}"</p>
                    </div>

                    {/* On This Day */}
                    <div className={`rounded-3xl p-5 bg-gradient-to-br from-white/40 to-white/10 border border-white/30`}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><Sparkles size={16} /></div>
                            <h3 className={`font-bold text-lg ${theme.colors.text}`}>On This Day</h3>
                        </div>
                        {memoriesOnThisDay.length > 0 ? (
                            <div className="space-y-3">
                                {memoriesOnThisDay.map((item, idx) => (
                                    <div key={idx} onClick={() => { onSelectLocation(item.loc); onClose(); }} className="group bg-white/60 hover:bg-white p-3 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-md flex gap-3">
                                        {item.detail.img && <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200"><img src={item.detail.img} className="w-full h-full object-cover" alt="" /></div>}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`font-bold text-sm truncate ${theme.colors.text}`}>{item.loc.name}</h4>
                                                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{today.getFullYear() - item.year}y ago</span>
                                            </div>
                                            <p className={`text-xs mt-1 line-clamp-2 ${theme.colors.subText} opacity-80`}>{item.detail.desc.replace(/<br>/g, ' ')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 opacity-60"><p className={`text-sm ${theme.colors.subText}`}>No memories recorded for today yet.</p></div>
                        )}
                    </div>

                    {/* Upcoming Adventures - FIXED: Now Rendering */}
                    <div className={`rounded-3xl p-5 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-indigo-100/50`}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><CalendarClock size={16} /></div>
                            <h3 className={`font-bold text-lg ${theme.colors.text}`}>Coming Soon</h3>
                        </div>
                        {upcomingList.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingList.map((item, idx) => (
                                    <div key={idx} onClick={() => { onSelectLocation(item.loc); onClose(); }} className="group bg-white/60 hover:bg-white p-3 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-md flex items-center justify-between">
                                        <div className="flex-1 min-w-0 pr-3">
                                            <div className="flex items-center gap-2">
                                                <h4 className={`font-bold text-sm truncate ${theme.colors.text}`}>{item.loc.name}</h4>
                                            </div>
                                            <p className={`text-xs mt-1 ${theme.colors.subText} opacity-80 flex items-center gap-1`}>
                                                <span className="font-bold text-indigo-500">
                                                    {item.date.getDate()}/{item.date.getMonth() + 1}
                                                </span> 
                                                • Anniversary
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center justify-center bg-indigo-50 px-3 py-1 rounded-xl">
                                            <span className="text-xs font-bold text-indigo-600">in {item.daysLeft}</span>
                                            <span className="text-[9px] uppercase font-bold text-indigo-400">days</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 opacity-60">
                                <p className={`text-sm ${theme.colors.subText}`}>No anniversaries in the next 60 days.</p>
                            </div>
                        )}
                    </div>

                    {/* Future Note */}
                    <div className={`rounded-3xl p-5 border border-white/20 bg-white/30 backdrop-blur-sm shadow-sm relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><PenTool size={80} /></div>
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500"><Send size={16} /></div>
                            <h3 className={`font-bold text-lg ${theme.colors.text}`}>Note to Future Us</h3>
                        </div>
                        {!isNoteSent ? (
                            <div className="relative z-10">
                                <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Write a message for next year..." className="w-full bg-white/50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 min-h-[80px] mb-3 placeholder-gray-400" />
                                <button onClick={handleSendNote} disabled={!noteText.trim()} className={`w-full py-2 rounded-xl font-bold text-white shadow-md transition-all active:scale-95 ${noteText.trim() ? theme.colors.primary : 'bg-gray-300 cursor-not-allowed'}`}>Seal in Time Capsule</button>
                            </div>
                        ) : (
                            <div className="py-8 text-center flex flex-col items-center animate-fade-in relative z-10">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-3 animate-bounce"><Lock size={32} /></div>
                                <h4 className="font-bold text-lg text-gray-800">Locked & Secured!</h4>
                                <p className="text-xs text-gray-500 mt-1">Opening on {today.getDate()}/{today.getMonth()+1}/{today.getFullYear() + 1}</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {activeTab === 'badges' && (
                <div className="space-y-6">
                    {/* XP Card */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <div>
                                <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest">Relationship Level</h3>
                                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">{currentLevel.title}</h2>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black">{currentLevel.level}</span>
                                <span className="text-xs text-gray-400 block uppercase">Lvl</span>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                                <span>{currentXP} XP</span>
                                <span>{nextLevel ? nextLevel.minXp : 'MAX'} XP</span>
                            </div>
                            <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden border border-white/10">
                                <div className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transition-all duration-1000 ease-out" style={{ width: `${xpProgress}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setBadgeCategory(cat)} className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap transition-colors ${badgeCategory === cat ? 'bg-black text-white' : 'bg-white/40 hover:bg-white/60'}`}>{cat}</button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 gap-3">
                        {filteredBadges.map((badge) => {
                            const handleClick = () => {
                                if (badge.isUnlocked) confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 }, colors: [badge.color.replace('bg-', '')] });
                            };
                            return (
                                <div key={badge.id} onClick={handleClick} className={`relative p-3 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${badge.isUnlocked ? `bg-white/80 border-white/60 shadow-sm cursor-pointer hover:scale-[1.02]` : `bg-gray-100/50 border-transparent opacity-80`}`}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner flex-shrink-0 transition-transform ${badge.isUnlocked ? `${badge.color} group-hover:rotate-6` : 'bg-gray-400'}`}>
                                        {badge.isUnlocked ? badge.icon : <Lock size={20} className="text-gray-100" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`font-black text-sm truncate ${badge.isUnlocked ? theme.colors.text : 'text-gray-600'}`}>{badge.title}</h4>
                                            {/* Show XP Pill even if locked, but greyed out */}
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${badge.isUnlocked ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>+{badge.xp} XP</span>
                                        </div>
                                        {/* Readable description for locked badges too, just styled differently */}
                                        <p className={`text-[11px] mt-0.5 truncate ${badge.isUnlocked ? theme.colors.subText : 'text-gray-500 italic'}`}>
                                            {badge.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default TimeCapsuleModal;
