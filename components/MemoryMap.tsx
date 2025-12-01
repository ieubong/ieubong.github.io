
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MemoryLocation, ThemePack } from '../types';
import { MapPin } from 'lucide-react';

const ATTRIBUTION = '&copy; <a href="https://carto.com/attributions">CARTO</a>';

interface MemoryMapProps {
  data: MemoryLocation[];
  onSelectLocation: (location: MemoryLocation) => void;
  selectedLocation: MemoryLocation | null;
  theme: ThemePack;
  onVisibleCountChange?: (count: number) => void;
}

const MapController: React.FC<{ selectedLocation: MemoryLocation | null }> = ({ selectedLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 16, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [selectedLocation, map]);
  return null;
};

// Component to handle map events and count visible markers
const MapCounter: React.FC<{ data: MemoryLocation[]; onCountChange?: (count: number) => void }> = ({ data, onCountChange }) => {
    const map = useMapEvents({
        moveend: () => {
            const bounds = map.getBounds();
            const count = data.filter(d => bounds.contains([d.lat, d.lng])).length;
            onCountChange?.(count);
        },
        zoomend: () => {
             const bounds = map.getBounds();
             const count = data.filter(d => bounds.contains([d.lat, d.lng])).length;
             onCountChange?.(count);
        }
    });

    useEffect(() => {
         const bounds = map.getBounds();
         const count = data.filter(d => bounds.contains([d.lat, d.lng])).length;
         onCountChange?.(count);
    }, [data, map, onCountChange]);

    return null;
}

// --- MARKER SVGS ---

const PawIcon = (color: string) => `
  <path d="M25 48C38.8 48 50 38.3 50 26.5C50 14.6 38.8 5 25 5C11.2 5 0 14.6 0 26.5C0 38.3 11.2 48 25 48Z" fill="${color}" stroke="white" stroke-width="2"/>
  <circle cx="10" cy="18" r="4" fill="white" fill-opacity="0.8"/>
  <circle cx="25" cy="13" r="4" fill="white" fill-opacity="0.8"/>
  <circle cx="40" cy="18" r="4" fill="white" fill-opacity="0.8"/>
  <path d="M25 40C30 40 34 36 34 32C34 28 30 25 25 25C20 25 16 28 16 32C16 36 20 40 25 40Z" fill="white" fill-opacity="0.5"/>
`;

const TreeIcon = (color: string) => `
  <path d="M25 5L5 45H45L25 5Z" fill="${color}" stroke="white" stroke-width="2"/>
  <rect x="22" y="45" width="6" height="10" fill="#8B4513"/>
  <circle cx="25" cy="5" r="3" fill="#FFD700"/>
  <circle cx="18" cy="25" r="2" fill="white"/>
  <circle cx="30" cy="35" r="2" fill="white"/>
`;

const HeartIcon = (color: string) => `
  <path d="M25 48L7.5 28C2.5 22 5 12 12.5 12C17 12 21 15 25 19C29 15 33 12 37.5 12C45 12 47.5 22 42.5 28L25 48Z" fill="${color}" stroke="white" stroke-width="2"/>
  <path d="M35 18C35 18 38 15 40 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
`;

// "Smart" Icon Factory
const useCustomIcon = (theme: ThemePack, isSelected: boolean) => {
  let mainColor = '#F472B6';
  if (theme.colors.primary.includes('orange')) mainColor = '#F97316';
  if (theme.colors.primary.includes('red')) mainColor = '#DC2626';
  if (theme.colors.primary.includes('green')) mainColor = '#16A34A';
  if (theme.colors.primary.includes('rose')) mainColor = '#E11D48';
  if (theme.colors.primary.includes('pink')) mainColor = '#EC4899';
  if (theme.colors.primary.includes('purple')) mainColor = '#A855F7';
  
  const scale = isSelected ? 'scale-125' : 'scale-100 hover:scale-110';
  const zIndex = isSelected ? 'z-50' : 'z-10';
  const animation = isSelected ? 'animate-bounce' : '';

  let svgPath = PawIcon(mainColor);
  if (theme.icon === 'tree') svgPath = TreeIcon(mainColor);
  if (theme.icon === 'heart') svgPath = HeartIcon(mainColor);

  const svgString = `
    <div class="relative transition-transform duration-300 ${scale} ${zIndex} ${animation} drop-shadow-xl">
       <svg width="50" height="65" viewBox="0 0 50 65" fill="none" xmlns="http://www.w3.org/2000/svg">
         ${theme.icon === 'paw' ? '<rect x="22" y="45" width="6" height="20" rx="3" fill="#EAB308" />' : ''}
         ${svgPath}
       </svg>
    </div>
  `;

  return new L.DivIcon({
    html: svgString,
    className: 'bg-transparent border-none',
    iconSize: [50, 65],
    iconAnchor: [25, 65],
    popupAnchor: [0, -60]
  });
};

const MemoryMap: React.FC<MemoryMapProps> = ({ data, onSelectLocation, selectedLocation, theme, onVisibleCountChange }) => {
  return (
    <MapContainer 
      center={[21.0285, 105.8542]} 
      zoom={13} 
      zoomControl={false}
      style={{ height: '100%', width: '100%', background: theme.id === 'zootopia' ? '#f0f9ff' : '#0f172a' }}
    >
      <TileLayer
        attribution={ATTRIBUTION}
        url={theme.mapUrl}
        detectRetina={true}
      />
      
      <MapController selectedLocation={selectedLocation} />
      <MapCounter data={data} onCountChange={onVisibleCountChange} />
      
      {data.map((location, idx) => (
        <Marker 
          key={idx} 
          position={[location.lat, location.lng]}
          icon={useCustomIcon(theme, selectedLocation?.lat === location.lat && selectedLocation?.lng === location.lng)}
          eventHandlers={{
            click: () => onSelectLocation(location)
          }}
        >
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MemoryMap;
