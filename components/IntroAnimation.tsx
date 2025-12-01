
import React, { useEffect, useState } from 'react';
import { SkipForward, Sparkles } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [stage, setStage] = useState(0); // 0: Logo, 1: Characters, 2: Out

  useEffect(() => {
    // Stage 1: Logo Pulse
    setTimeout(() => setStage(1), 3000);
    // Stage 2: Walk (7s)
    setTimeout(() => handleFinish(), 10000);
  }, []);

  const handleFinish = () => {
      setStage(2);
      setTimeout(() => {
          setIsVisible(false);
          onComplete();
      }, 800);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-all duration-800 ${stage === 2 ? 'opacity-0 scale-105' : 'opacity-100'}`}>
      
      {/* Background with Magical Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700"></div>
      
      {/* Stars Overlay */}
      <div className="absolute inset-0 opacity-40 animate-pulse" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]"></div>

      {/* STAGE 0: CINEMATIC LOGO */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${stage === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-150 pointer-events-none'}`}>
          <div className="relative">
              <Sparkles className="absolute -top-8 -right-8 text-yellow-300 w-12 h-12 animate-spin-slow" />
              <h1 className="text-6xl md:text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-pink-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-tighter">
                  Our<br/>Story
              </h1>
          </div>
          <p className="text-white/70 font-bold tracking-[0.3em] uppercase mt-4 text-sm animate-pulse">Loading Magic...</p>
      </div>

      {/* STAGE 1: WALKING CHARACTERS */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${stage === 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2">
            <div className="relative w-full h-64">
                <div className="absolute top-0 left-[-20%] animate-[walkAcross_8s_linear_forwards] flex items-end gap-6">
                    {/* Judy */}
                    <div className="w-40 h-40 relative animate-bounce-walk">
                         <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="Judy" className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                         <div className="absolute -top-12 left-0 right-0 text-center">
                             <span className="bg-white text-pink-600 px-3 py-1 rounded-full font-black text-xs shadow-lg animate-pop">Let's Go!</span>
                         </div>
                    </div>
                    {/* Nick */}
                    <div className="w-44 h-44 relative animate-bounce-walk" style={{ animationDelay: '0.2s' }}>
                         <img src="https://cdn-icons-png.flaticon.com/512/616/616430.png" alt="Nick" className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                    </div>
                </div>
            </div>
          </div>
          
          <div className="absolute bottom-16 w-full text-center">
             <p className="text-white/90 font-serif italic text-2xl drop-shadow-md animate-fade-in">"It's called a hustle, sweetheart."</p>
          </div>
      </div>

      {/* Skip */}
      <button 
        onClick={handleFinish}
        className="absolute top-8 right-8 flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white font-bold transition-all border border-white/10 z-50"
      >
        Skip Intro <SkipForward size={16} />
      </button>

      <style>{`
        @keyframes walkAcross {
            0% { transform: translateX(0); }
            100% { transform: translateX(120vw); }
        }
        @keyframes bounceWalk {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(3deg); }
        }
        .animate-bounce-walk {
            animation: bounceWalk 0.5s infinite ease-in-out;
        }
        .animate-spin-slow {
            animation: spin 3s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
