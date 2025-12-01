
import React from 'react';
import { ThemePack } from '../types';
import { Star, Calendar, Smile, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  theme: ThemePack;
  filterYear: string;
  setFilterYear: (year: string) => void;
  filterRating: number;
  setFilterRating: (rating: number) => void;
  filterMood: string;
  setFilterMood: (mood: string) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  theme,
  filterYear, setFilterYear,
  filterRating, setFilterRating,
  filterMood, setFilterMood,
  onReset
}) => {
  const years = ['2024', '2025'];
  const moods = ['happy', 'romantic', 'funny', 'chaos', 'chill', 'foodie'];

  return (
    <div className={`
      mt-4 p-4 rounded-3xl backdrop-blur-md shadow-xl border border-white/20
      ${theme.colors.panelBg}
      animate-pop
    `}>
        
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xs font-bold uppercase tracking-widest ${theme.colors.subText}`}>Smart Filters</h3>
            <button 
                onClick={onReset}
                className="text-xs font-bold flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
            >
                <RotateCcw size={12} /> Reset
            </button>
        </div>

        {/* Date Filter */}
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 text-sm font-bold opacity-80">
                <Calendar size={14} /> Time Machine
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setFilterYear('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filterYear === 'all' ? theme.colors.primary + ' text-white' : 'bg-white/40 hover:bg-white/60'}`}
                >
                    All Time
                </button>
                {years.map(year => (
                    <button
                        key={year}
                        onClick={() => setFilterYear(year)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${filterYear === year ? theme.colors.primary + ' text-white' : 'bg-white/40 hover:bg-white/60'}`}
                    >
                        {year}
                    </button>
                ))}
            </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-4">
             <div className="flex items-center gap-2 mb-2 text-sm font-bold opacity-80">
                <Star size={14} /> Min. Rating
            </div>
            <div className="flex gap-2">
                 {[5, 4, 3].map(rating => (
                     <button
                        key={rating}
                        onClick={() => setFilterRating(filterRating === rating ? 0 : rating)} // Toggle
                        className={`
                            px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all
                            ${filterRating === rating ? 'bg-yellow-400 text-white shadow-lg' : 'bg-white/40 hover:bg-white/60 text-gray-600'}
                        `}
                     >
                        {rating} <Star size={10} fill="currentColor" />
                     </button>
                 ))}
            </div>
        </div>

        {/* Mood Filter */}
        <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-bold opacity-80">
                <Smile size={14} /> Vibe Check
            </div>
            <div className="flex flex-wrap gap-2">
                {moods.map(mood => (
                     <button
                        key={mood}
                        onClick={() => setFilterMood(filterMood === mood ? 'all' : mood)}
                        className={`
                            px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all border border-transparent
                            ${filterMood === mood ? theme.colors.secondary + ' text-white shadow-md' : 'bg-white/40 hover:bg-white/60 text-gray-600'}
                        `}
                     >
                        {mood}
                     </button>
                ))}
            </div>
        </div>

    </div>
  );
};

export default FilterPanel;
