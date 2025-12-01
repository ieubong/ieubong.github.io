
import React, { useMemo } from 'react';
import { MemoryLocation, ThemePack } from '../types';
import { MapPin, Calendar, Heart } from 'lucide-react';

interface GalleryGridProps {
  data: MemoryLocation[];
  onSelectLocation: (location: MemoryLocation) => void;
  theme: ThemePack;
}

// Date parser helper
const parseDate = (dateStr: string) => {
    try {
        // Matches "HH:mm dd/MM/yyyy" or just "dd/MM/yyyy"
        const parts = dateStr.match(/(?:(\d{1,2}):(\d{1,2})\s+)?(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (parts) {
            const h = parseInt(parts[1]) || 0;
            const m = parseInt(parts[2]) || 0;
            const day = parseInt(parts[3]);
            const month = parseInt(parts[4]) - 1; // JS months are 0-11
            const year = parseInt(parts[5]);
            return new Date(year, month, day, h, m).getTime();
        }
        return 0;
    } catch (e) {
        return 0;
    }
};

const GalleryGrid: React.FC<GalleryGridProps> = ({ data, onSelectLocation, theme }) => {
  
  // Flatten data to get individual memory instances that have images
  // AND Sort by Date Descending (Newest First)
  const sortedMemories = useMemo(() => {
    const flattened = data.flatMap(loc => 
        loc.detail
          .filter(d => d.img) // Only show items with main images
          .map(d => ({ ...d, locationName: loc.name, fullLoc: loc }))
    );

    return flattened.sort((a, b) => {
        const timeA = parseDate(a.date);
        const timeB = parseDate(b.date);
        return timeB - timeA; // Descending
    });
  }, [data]);

  if (sortedMemories.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <Calendar size={40} className={theme.colors.text} />
              </div>
              <h3 className={`text-xl font-bold ${theme.colors.text}`}>No Photos Found</h3>
              <p className={`text-sm ${theme.colors.subText}`}>Try adjusting your filters or add more memories!</p>
          </div>
      )
  }

  return (
    <div className={`
        h-full w-full overflow-y-auto custom-scrollbar p-4 pb-32
        ${theme.id === 'zootopia' ? 'bg-white/30' : 'bg-black/20'}
    `}>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {sortedMemories.map((mem, idx) => (
          <div 
            key={idx}
            onClick={() => onSelectLocation(mem.fullLoc)}
            className="break-inside-avoid cursor-pointer group perspective"
          >
            <div className={`
                relative bg-white p-3 pb-12 shadow-md rounded-sm transform transition-all duration-500 
                group-hover:scale-105 group-hover:shadow-2xl group-hover:z-10 group-hover:-rotate-1
                ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}
            `}>
                {/* Tape */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/40 backdrop-blur-sm shadow-sm rotate-2 border-l border-r border-white/50 z-10"></div>

                <div className="overflow-hidden bg-gray-100 aspect-[4/3] mb-3">
                    <img 
                        src={mem.img} 
                        alt={mem.locationName} 
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                        loading="lazy"
                    />
                </div>
                
                <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex justify-between items-baseline">
                        <h4 className="font-handwriting font-bold text-gray-800 text-lg truncate leading-none pt-2">{mem.locationName}</h4>
                        {mem.rating && mem.rating === 5 && <Heart size={12} className="text-red-400 fill-current" />}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                        <Calendar size={10} />
                        {mem.date.split(' ')[1] || mem.date}
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryGrid;
