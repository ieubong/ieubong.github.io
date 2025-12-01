export interface MemoryDetail {
  date: string;
  img?: string;
  desc: string;
  video?: string;
  media?: string[];
  rating?: number; // 1-5 stars
  mood?: 'happy' | 'romantic' | 'funny' | 'chaos' | 'chill' | 'foodie';
}

export interface MemoryLocation {
  id?: number;
  lat: number;
  lng: number;
  ggmaps: string;
  name: string;
  type?: string;
  detail: MemoryDetail[];
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  bgGradient: string; // CSS class for gradients
  panelBg: string; // CSS class for glass panels
  text: string;
  subText: string;
  dockBg: string;
}

export interface ThemeVariant {
  id: string;
  label: string;
  colors: ThemeColors;
  iconOverride?: 'paw' | 'tree' | 'heart';
}

export interface ThemePack {
  id: string;
  label: string;
  // Default colors (fallback)
  colors: ThemeColors; 
  weather: 'petal' | 'snow' | 'heart' | 'none';
  icon: 'paw' | 'tree' | 'heart';
  mapUrl: string;
  variants: ThemeVariant[];
}

export interface MiniPlayerTheme {
  id: string;
  label: string;
  bgClass: string;
  textClass: string;
  subTextClass: string;
  progressGradient: string;
  progressShadow: string;
  buttonClass: string;
  iconColorClass: string; // For the play/pause icon specifically if needed, or inherited
}
