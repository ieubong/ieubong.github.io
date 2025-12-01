
import React, { useState, useEffect } from 'react';
import { ThemePack } from '../types';
import { 
  X, Sparkles, Star, Sun, Moon, Heart, Zap, Crown, 
  Scale, Anchor, Flame, Ghost, Droplets, Globe, 
  Scroll, Shield, BookOpen, Key, 
  Recycle, Bell, Eye, Compass, RefreshCw, Feather, 
  Sword, Tent, Gift, Lock, Coins, Trophy, Home, 
  Flag, Mountain, Wind, CloudRain, Hammer, Users,
  Snowflake, Leaf, Clock, Hourglass
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyTarotProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemePack;
}

// --- FULL 78 CARD DECK ---
const CARDS = [
    // --- MAJOR ARCANA (22) ---
    { id: 'fool', name: 'The Fool', meaning: 'New adventures await. Trust the journey and take a leap of faith together!', icon: <Feather size={48} className="text-yellow-400" /> },
    { id: 'magician', name: 'The Magician', meaning: 'You have everything you need to create magic in your relationship.', icon: <Sparkles size={48} className="text-purple-400" /> },
    { id: 'priestess', name: 'High Priestess', meaning: 'Listen to your intuition. Silence speaks volumes today.', icon: <Eye size={48} className="text-blue-400" /> },
    { id: 'empress', name: 'The Empress', meaning: 'Abundance, comfort, and nurturing love surround you.', icon: <Heart size={48} className="text-pink-400" /> },
    { id: 'emperor', name: 'The Emperor', meaning: 'Stability and protection. Build a strong foundation together.', icon: <Shield size={48} className="text-red-400" /> },
    { id: 'hierophant', name: 'The Hierophant', meaning: 'Shared values and commitment. Tradition brings you closer.', icon: <BookOpen size={48} className="text-indigo-400" /> },
    { id: 'lovers', name: 'The Lovers', meaning: 'Perfect harmony and deep connection. A choice made out of love.', icon: <Heart size={48} className="text-rose-500" /> },
    { id: 'chariot', name: 'The Chariot', meaning: 'Overcoming obstacles together. Move forward with confidence.', icon: <Tent size={48} className="text-orange-400" /> },
    { id: 'strength', name: 'Strength', meaning: 'Patience and compassion. Soft power conquers all.', icon: <Lock size={48} className="text-yellow-600" /> },
    { id: 'hermit', name: 'The Hermit', meaning: 'Soul-searching. Spend some quality quiet time together.', icon: <Key size={48} className="text-slate-400" /> },
    { id: 'wheel', name: 'Wheel of Fortune', meaning: 'Good luck and destiny. A positive turning point is here.', icon: <RefreshCw size={48} className="text-green-400" /> },
    { id: 'justice', name: 'Justice', meaning: 'Balance and fairness. Truth will strengthen your bond.', icon: <Scale size={48} className="text-zinc-400" /> },
    { id: 'hanged', name: 'Hanged Man', meaning: 'See things from a new perspective. Sometimes pausing is progress.', icon: <Anchor size={48} className="text-teal-400" /> },
    { id: 'death', name: 'Death (Rebirth)', meaning: 'Transformation. Letting go of the old to welcome a new chapter.', icon: <Recycle size={48} className="text-gray-400" /> },
    { id: 'temperance', name: 'Temperance', meaning: 'Balance and patience. Blending your lives in perfect measure.', icon: <Droplets size={48} className="text-cyan-400" /> },
    { id: 'devil', name: 'The Devil', meaning: 'Passion and playful obsession. Enjoy the intensity!', icon: <Flame size={48} className="text-red-600" /> },
    { id: 'tower', name: 'The Tower', meaning: 'Sudden change. Shake things up to build something better.', icon: <Zap size={48} className="text-orange-500" /> },
    { id: 'star', name: 'The Star', meaning: 'Hope, healing, and inspiration. A bright future lies ahead.', icon: <Star size={48} className="text-yellow-300" /> },
    { id: 'moon', name: 'The Moon', meaning: 'Dreams and mysteries. Trust your instincts and explore the unknown.', icon: <Moon size={48} className="text-indigo-300" /> },
    { id: 'sun', name: 'The Sun', meaning: 'Joy, success, and positivity. Your love is shining bright!', icon: <Sun size={48} className="text-yellow-500" /> },
    { id: 'judgement', name: 'Judgement', meaning: 'Awakening and renewal. A call to rise to a higher level of love.', icon: <Bell size={48} className="text-purple-300" /> },
    { id: 'world', name: 'The World', meaning: 'Completion and fulfillment. You mean the world to each other.', icon: <Globe size={48} className="text-emerald-400" /> },

    // --- CUPS (Water/Love) ---
    { id: 'ace_cups', name: 'Ace of Cups', meaning: 'A new outpouring of love and emotional connection.', icon: <Droplets size={48} className="text-blue-400" /> },
    { id: '2_cups', name: 'Two of Cups', meaning: 'A partnership based on mutual attraction and unity.', icon: <Heart size={48} className="text-pink-400" /> },
    { id: '3_cups', name: 'Three of Cups', meaning: 'Celebration, friendship, and happy times together.', icon: <Users size={48} className="text-orange-300" /> },
    { id: '4_cups', name: 'Four of Cups', meaning: 'Contemplation. Don\'t miss the love being offered to you.', icon: <CloudRain size={48} className="text-slate-400" /> },
    { id: '5_cups', name: 'Five of Cups', meaning: 'Focusing on loss. Turn around to see what remains.', icon: <Ghost size={48} className="text-gray-400" /> },
    { id: '6_cups', name: 'Six of Cups', meaning: 'Nostalgia, childhood memories, and innocence.', icon: <Gift size={48} className="text-yellow-400" /> },
    { id: '7_cups', name: 'Seven of Cups', meaning: 'Many choices and daydreams. Focus on what matters.', icon: <Sparkles size={48} className="text-purple-300" /> },
    { id: '8_cups', name: 'Eight of Cups', meaning: 'Walking away from what no longer serves you to find deeper meaning.', icon: <Mountain size={48} className="text-indigo-800" /> },
    { id: '9_cups', name: 'Nine of Cups', meaning: 'Contentment, satisfaction, and wishes coming true.', icon: <Star size={48} className="text-yellow-500" /> },
    { id: '10_cups', name: 'Ten of Cups', meaning: 'Divine love, happy family, and emotional fulfillment.', icon: <Heart size={48} className="text-red-500" /> },
    { id: 'page_cups', name: 'Page of Cups', meaning: 'Creative opportunities and intuitive messages.', icon: <Scroll size={48} className="text-blue-200" /> },
    { id: 'knight_cups', name: 'Knight of Cups', meaning: 'Romance, charm, and following your heart.', icon: <Feather size={48} className="text-pink-300" /> },
    { id: 'queen_cups', name: 'Queen of Cups', meaning: 'Compassion, calm, and emotional stability.', icon: <Crown size={48} className="text-blue-500" /> },
    { id: 'king_cups', name: 'King of Cups', meaning: 'Emotional balance and control. A wise heart.', icon: <Crown size={48} className="text-indigo-600" /> },

    // --- WANDS (Fire/Passion) ---
    { id: 'ace_wands', name: 'Ace of Wands', meaning: 'Inspiration, new opportunities, and passion.', icon: <Flame size={48} className="text-orange-500" /> },
    { id: '2_wands', name: 'Two of Wands', meaning: 'Future planning and progress. The world is yours.', icon: <Globe size={48} className="text-orange-600" /> },
    { id: '3_wands', name: 'Three of Wands', meaning: 'Expansion and foresight. Your ships are coming in.', icon: <Compass size={48} className="text-yellow-600" /> },
    { id: '4_wands', name: 'Four of Wands', meaning: 'Celebration, joy, and returning home.', icon: <Home size={48} className="text-yellow-500" /> },
    { id: '5_wands', name: 'Five of Wands', meaning: 'Competition and conflict. Playful rivalry.', icon: <Sword size={48} className="text-red-400" /> },
    { id: '6_wands', name: 'Six of Wands', meaning: 'Public success, victory, and recognition.', icon: <Trophy size={48} className="text-yellow-400" /> },
    { id: '7_wands', name: 'Seven of Wands', meaning: 'Challenge and perseverance. Stand your ground.', icon: <Shield size={48} className="text-orange-700" /> },
    { id: '8_wands', name: 'Eight of Wands', meaning: 'Speed, action, and quick news.', icon: <Zap size={48} className="text-yellow-400" /> },
    { id: '9_wands', name: 'Nine of Wands', meaning: 'Resilience and courage. You are almost there.', icon: <Hammer size={48} className="text-slate-500" /> },
    { id: '10_wands', name: 'Ten of Wands', meaning: 'Burden and responsibility. Don\'t work too hard.', icon: <Recycle size={48} className="text-orange-800" /> },
    { id: 'page_wands', name: 'Page of Wands', meaning: 'Exploration and discovery. Be free-spirited.', icon: <Feather size={48} className="text-orange-300" /> },
    { id: 'knight_wands', name: 'Knight of Wands', meaning: 'Energy, passion, and impulsiveness. Go for it!', icon: <Flame size={48} className="text-red-500" /> },
    { id: 'queen_wands', name: 'Queen of Wands', meaning: 'Courage, confidence, and independence.', icon: <Crown size={48} className="text-orange-500" /> },
    { id: 'king_wands', name: 'King of Wands', meaning: 'Natural born leader, vision, and honor.', icon: <Crown size={48} className="text-red-700" /> },

    // --- SWORDS (Air/Intellect) ---
    { id: 'ace_swords', name: 'Ace of Swords', meaning: 'Breakthrough, clarity, and sharp mind.', icon: <Sword size={48} className="text-gray-400" /> },
    { id: '2_swords', name: 'Two of Swords', meaning: 'Difficult choices and stalemate. Trust your gut.', icon: <Scale size={48} className="text-slate-400" /> },
    { id: '3_swords', name: 'Three of Swords', meaning: 'Heartbreak or sorrow. Healing is necessary.', icon: <Heart size={48} className="text-gray-500 fill-gray-500" /> },
    { id: '4_swords', name: 'Four of Swords', meaning: 'Rest, relaxation, and contemplation.', icon: <Moon size={48} className="text-blue-200" /> },
    { id: '5_swords', name: 'Five of Swords', meaning: 'Conflict and tension. Pick your battles wisely.', icon: <Sword size={48} className="text-red-800" /> },
    { id: '6_swords', name: 'Six of Swords', meaning: 'Transition and moving to calmer waters.', icon: <Wind size={48} className="text-cyan-300" /> },
    { id: '7_swords', name: 'Seven of Swords', meaning: 'Strategy or deception. Be careful.', icon: <Key size={48} className="text-zinc-500" /> },
    { id: '8_swords', name: 'Eight of Swords', meaning: 'Feeling trapped. The restrictions are self-imposed.', icon: <Lock size={48} className="text-gray-400" /> },
    { id: '9_swords', name: 'Nine of Swords', meaning: 'Anxiety and worry. Things are better than they seem.', icon: <CloudRain size={48} className="text-indigo-400" /> },
    { id: '10_swords', name: 'Ten of Swords', meaning: 'End of a cycle. Only way is up from here.', icon: <Sword size={48} className="text-black" /> },
    { id: 'page_swords', name: 'Page of Swords', meaning: 'Curiosity and new ideas. Speak the truth.', icon: <Wind size={48} className="text-blue-300" /> },
    { id: 'knight_swords', name: 'Knight of Swords', meaning: 'Action, speed, and ambition.', icon: <Flag size={48} className="text-blue-500" /> },
    { id: 'queen_swords', name: 'Queen of Swords', meaning: 'Perceptive and independent. Clear boundaries.', icon: <Crown size={48} className="text-gray-300" /> },
    { id: 'king_swords', name: 'King of Swords', meaning: 'Mental clarity and intellectual power.', icon: <Crown size={48} className="text-slate-600" /> },

    // --- PENTACLES (Earth/Stability) ---
    { id: 'ace_pents', name: 'Ace of Pentacles', meaning: 'A new financial or career opportunity. Abundance.', icon: <Coins size={48} className="text-green-500" /> },
    { id: '2_pents', name: 'Two of Pentacles', meaning: 'Balance and adaptability. Juggling priorities.', icon: <RefreshCw size={48} className="text-green-600" /> },
    { id: '3_pents', name: 'Three of Pentacles', meaning: 'Teamwork and collaboration. Building together.', icon: <Hammer size={48} className="text-amber-700" /> },
    { id: '4_pents', name: 'Four of Pentacles', meaning: 'Security and conservation. Don\'t hold on too tight.', icon: <Lock size={48} className="text-emerald-600" /> },
    { id: '5_pents', name: 'Five of Pentacles', meaning: 'Hardship. Seek help, you are not alone.', icon: <Snowflake size={48} className="text-cyan-200" /> },
    { id: '6_pents', name: 'Six of Pentacles', meaning: 'Generosity and charity. Giving and receiving.', icon: <Scale size={48} className="text-yellow-600" /> },
    { id: '7_pents', name: 'Seven of Pentacles', meaning: 'Patience and long-term vision. Seeds are growing.', icon: <Leaf size={48} className="text-green-400" /> },
    { id: '8_pents', name: 'Eight of Pentacles', meaning: 'Apprenticeship and mastery. honing your skills.', icon: <Hammer size={48} className="text-gray-600" /> },
    { id: '9_pents', name: 'Nine of Pentacles', meaning: 'Luxury, self-sufficiency, and financial independence.', icon: <Star size={48} className="text-purple-500" /> },
    { id: '10_pents', name: 'Ten of Pentacles', meaning: 'Wealth, inheritance, and family legacy.', icon: <Home size={48} className="text-yellow-500" /> },
    { id: 'page_pents', name: 'Page of Pentacles', meaning: 'Ambition and diligence. A new study or goal.', icon: <BookOpen size={48} className="text-green-300" /> },
    { id: 'knight_pents', name: 'Knight of Pentacles', meaning: 'Efficiency, routine, and reliability.', icon: <Shield size={48} className="text-emerald-700" /> },
    { id: 'queen_pents', name: 'Queen of Pentacles', meaning: 'Practicality and creature comforts. Nurturing.', icon: <Crown size={48} className="text-green-500" /> },
    { id: 'king_pents', name: 'King of Pentacles', meaning: 'Security, control, and power. Business success.', icon: <Crown size={48} className="text-yellow-600" /> },
];

const DailyTarot: React.FC<DailyTarotProps> = ({ isOpen, onClose, theme }) => {
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [revealedCard, setRevealedCard] = useState<typeof CARDS[0] | null>(null);
    const [isFlipping, setIsFlipping] = useState(false);
    
    // Daily Limit State
    const [canDraw, setCanDraw] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<string>("");

    // Check Availability on Open
    useEffect(() => {
        if (isOpen) {
            checkAvailability();
        }
    }, [isOpen]);

    // Timer Interval
    useEffect(() => {
        let interval: any;
        if (isOpen && !canDraw) {
            interval = setInterval(() => {
                const now = new Date();
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                
                const diff = tomorrow.getTime() - now.getTime();
                
                if (diff <= 0) {
                    setCanDraw(true);
                    clearInterval(interval);
                } else {
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    
                    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, canDraw]);

    const checkAvailability = () => {
        const lastReadDate = localStorage.getItem('tarot_last_read_date');
        const todayStr = new Date().toDateString();

        if (lastReadDate === todayStr) {
            setCanDraw(false);
            
            // Try to recover the card
            const savedCardId = localStorage.getItem('tarot_card_id');
            if (savedCardId) {
                const card = CARDS.find(c => c.id === savedCardId);
                if (card) {
                    setRevealedCard(card);
                }
            }
            
            // View states
            setSelectedCardIndex(null);
            setIsFlipping(false);
        } else {
            setCanDraw(true);
            setRevealedCard(null);
            setSelectedCardIndex(null);
            setIsFlipping(false);
        }
    };

    const handleCardClick = (index: number) => {
        if (selectedCardIndex !== null) return;
        
        setSelectedCardIndex(index);
        setIsFlipping(true);
        
        // Pick random card from the full deck
        const randomCard = CARDS[Math.floor(Math.random() * CARDS.length)];
        
        setTimeout(() => {
            setRevealedCard(randomCard);
            setIsFlipping(false);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            
            // Save reading date AND card ID
            localStorage.setItem('tarot_last_read_date', new Date().toDateString());
            localStorage.setItem('tarot_card_id', randomCard.id);
        }, 800);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

             <div className={`
                relative w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden
                bg-indigo-950/90 border border-white/20 animate-pop flex flex-col items-center
                p-8 text-white min-h-[500px]
             `}>
                <div className="w-full flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full bg-purple-500 text-white shadow-lg shadow-purple-500/50`}>
                            <Sparkles size={18} />
                        </div>
                        <h2 className="font-serif italic text-2xl text-purple-200">Daily Tarot</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-300"><X size={20} /></button>
                </div>

                {/* If already read today AND no card is currently being revealed/shown (Fallback for legacy data) */}
                {!canDraw && !revealedCard && !selectedCardIndex ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in w-full">
                        <div className="w-24 h-24 rounded-full bg-indigo-900/50 flex items-center justify-center mb-6 border-2 border-indigo-400/30 animate-pulse">
                            <Moon size={40} className="text-indigo-300" />
                        </div>
                        <h3 className="text-2xl font-serif text-purple-200 mb-2">The Stars Are Realigning</h3>
                        <p className="text-indigo-200/60 text-sm mb-8 px-8">You have already drawn your card for today. Come back tomorrow for new guidance.</p>
                        
                        <div className="bg-black/30 px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
                            <Hourglass className="text-purple-400 animate-spin-slow" size={24} />
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest">Next Reading In</span>
                                <span className="text-2xl font-mono font-bold text-white tracking-widest">{timeRemaining || "..."}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {!revealedCard ? (
                            <div className="flex flex-col items-center w-full">
                                <p className="text-sm text-purple-200 mb-6 font-bold uppercase tracking-widest animate-pulse">Trust your intuition & Pick a card</p>
                                
                                <div className="flex gap-4 justify-center w-full">
                                    {[0, 1, 2].map((i) => (
                                        <div 
                                            key={i}
                                            onClick={() => handleCardClick(i)}
                                            className={`
                                                w-24 h-40 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-800 border-2 border-indigo-400
                                                cursor-pointer transform transition-all duration-300 hover:-translate-y-4 hover:shadow-xl hover:shadow-indigo-500/50
                                                flex items-center justify-center relative overflow-hidden group
                                                ${selectedCardIndex === i && isFlipping ? 'animate-[spin_0.8s_ease-in-out]' : ''}
                                                ${selectedCardIndex !== null && selectedCardIndex !== i ? 'opacity-30 scale-90 blur-sm' : ''}
                                            `}
                                        >
                                            {/* Card Back Pattern */}
                                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                                            <div className="border-2 border-white/20 rounded-lg w-[85%] h-[90%] flex items-center justify-center">
                                                <Sparkles className="text-indigo-300 opacity-50 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center animate-pop w-full">
                                
                                {/* Header text if reviewing */}
                                {!canDraw && (
                                    <div className="mb-4 flex flex-col items-center">
                                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-1">Your Daily Guidance</span>
                                        <span className="text-[10px] text-indigo-400 opacity-60">{new Date().toLocaleDateString()}</span>
                                    </div>
                                )}

                                <div className="relative w-56 h-80 rounded-2xl bg-gradient-to-br from-white to-purple-50 text-gray-800 p-6 flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(139,92,246,0.5)] mb-4 border-4 border-yellow-400">
                                     <div className="absolute inset-2 border-2 border-gray-900/5 rounded-xl pointer-events-none"></div>
                                     
                                     {/* Card Icon */}
                                     <div className="mb-6 transform scale-125 animate-[bounce_3s_infinite]">
                                         {revealedCard.icon}
                                     </div>
                                     
                                     <h3 className="font-serif text-xl font-black mb-3 text-purple-900 leading-tight">{revealedCard.name}</h3>
                                     <div className="w-12 h-1 bg-purple-200 rounded-full mb-4"></div>
                                     <p className="text-xs font-bold leading-relaxed text-gray-600">{revealedCard.meaning}</p>
                                </div>

                                {/* Timer if reviewing */}
                                {!canDraw && (
                                    <div className="mb-4 flex flex-col items-center animate-fade-in bg-black/20 p-3 rounded-xl border border-white/5 w-full max-w-[220px]">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Hourglass size={14} className="text-purple-300 animate-spin-slow" />
                                            <span className="text-[10px] font-bold uppercase text-purple-200 tracking-widest">Next Reading In</span>
                                        </div>
                                        <span className="text-lg font-mono font-bold text-white tracking-widest">{timeRemaining || "..."}</span>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={onClose}
                                    className="px-8 py-3 rounded-full bg-white text-indigo-900 font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-900/50"
                                >
                                    {!canDraw ? "Close" : "Claim This Energy ✨"}
                                </button>
                            </div>
                        )}
                    </>
                )}
             </div>
        </div>
    );
};

export default DailyTarot;
