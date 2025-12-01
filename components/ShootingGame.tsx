
import React, { useState, useRef, useEffect } from 'react';
import { ThemePack } from '../types';
import { X, Upload, Heart, Crosshair, Trophy, RefreshCw, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShootingGameProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemePack;
}

const DEFAULT_P1 = "https://cdn-icons-png.flaticon.com/512/616/616408.png"; // Cat
const DEFAULT_P2 = "https://cdn-icons-png.flaticon.com/512/616/616430.png"; // Dog

const ShootingGame: React.FC<ShootingGameProps> = ({ isOpen, onClose, theme }) => {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'won' | 'lost'>('setup');
  const [playerImg, setPlayerImg] = useState<string>(DEFAULT_P1);
  const [targetImg, setTargetImg] = useState<string>(DEFAULT_P2);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const scoreRef = useRef(0);
  
  // Game Entities Refs (to avoid re-renders loop)
  const playerPos = useRef({ x: 50 }); // Percent 0-100
  const targetPos = useRef({ x: 50, dir: 1 });
  const bullets = useRef<{x: number, y: number, active: boolean}[]>([]);
  const obstacles = useRef<{x: number, y: number, speed: number, type: string, active: boolean}[]>([]);
  const lastShotTime = useRef(0);
  const particles = useRef<{x: number, y: number, vx: number, vy: number, life: number, color: string}[]>([]);

  // Image Elements for Canvas
  const p1ImgRef = useRef<HTMLImageElement>(new Image());
  const p2ImgRef = useRef<HTMLImageElement>(new Image());

  useEffect(() => {
    p1ImgRef.current.src = playerImg;
    p2ImgRef.current.src = targetImg;
  }, [playerImg, targetImg]);

  // Handle File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isPlayer: boolean) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          if (isPlayer) setPlayerImg(ev.target.result as string);
          else setTargetImg(ev.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Game Loop
  const update = () => {
    if (gameState !== 'playing' || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- LOGIC ---
    
    // Move Target (Sine wave-ish)
    targetPos.current.x += 1 * targetPos.current.dir;
    if (targetPos.current.x > 90 || targetPos.current.x < 10) targetPos.current.dir *= -1;

    // Spawn Obstacles (Bad Vibes) randomly
    if (Math.random() < 0.03) {
        obstacles.current.push({
            x: Math.random() * 100,
            y: -10,
            speed: Math.random() * 0.5 + 0.5,
            type: Math.random() > 0.5 ? '☁️' : '⚡',
            active: true
        });
    }

    // Move Obstacles
    obstacles.current.forEach(obs => {
        obs.y += obs.speed;
        if (obs.y > 110) obs.active = false;
    });

    // Move Bullets
    bullets.current.forEach(b => {
        b.y -= 2; // Speed up
        if (b.y < -10) b.active = false;
    });

    // Collision Detection
    // Bullet radius approx 2% width, Target radius approx 8% width
    bullets.current.forEach(b => {
        if (!b.active) return;

        // Hit Target?
        const dx = b.x - targetPos.current.x;
        const dy = b.y - 10; // Target is at y=10 roughly
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 8) { // Hit!
            b.active = false;
            scoreRef.current += 10;
            setScore(scoreRef.current);
            // Spawn particles
            for(let i=0; i<5; i++) {
                particles.current.push({
                    x: b.x, y: b.y,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: 1.0,
                    color: '#ec4899'
                });
            }
            if (scoreRef.current >= 100) {
                setGameState('won');
                confetti({ particleCount: 200, spread: 100 });
            }
        }

        // Hit Obstacle?
        obstacles.current.forEach(obs => {
            if (!obs.active) return;
            const odx = b.x - obs.x;
            const ody = b.y - obs.y;
            if (Math.sqrt(odx*odx + ody*ody) < 5) {
                b.active = false;
                obs.active = false;
                // Puff effect
                for(let i=0; i<3; i++) {
                    particles.current.push({
                        x: obs.x, y: obs.y,
                        vx: (Math.random() - 0.5),
                        vy: (Math.random() - 0.5),
                        life: 0.5,
                        color: '#9ca3af'
                    });
                }
            }
        });
    });

    // --- DRAWING ---
    const w = canvas.width;
    const h = canvas.height;

    // Draw Target
    const tx = (targetPos.current.x / 100) * w;
    const ty = (10 / 100) * h;
    const tSize = w * 0.15;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(tx, ty, tSize/2, 0, Math.PI*2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(p2ImgRef.current, tx - tSize/2, ty - tSize/2, tSize, tSize);
    ctx.restore();
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(tx, ty, tSize/2, 0, Math.PI*2);
    ctx.stroke();

    // Draw Player
    const px = (playerPos.current.x / 100) * w;
    const py = (90 / 100) * h;
    const pSize = w * 0.15;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, pSize/2, 0, Math.PI*2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(p1ImgRef.current, px - pSize/2, py - pSize/2, pSize, pSize);
    ctx.restore();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(px, py, pSize/2, 0, Math.PI*2);
    ctx.stroke();

    // Draw Bullets
    ctx.fillStyle = '#ef4444';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    bullets.current.forEach(b => {
        if (b.active) {
            const bx = (b.x / 100) * w;
            const by = (b.y / 100) * h;
            ctx.fillText('❤️', bx, by);
        }
    });

    // Draw Obstacles
    ctx.font = '28px sans-serif';
    obstacles.current.forEach(obs => {
        if (obs.active) {
            const ox = (obs.x / 100) * w;
            const oy = (obs.y / 100) * h;
            ctx.fillText(obs.type, ox, oy);
        }
    });

    // Draw Particles
    particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if (p.life > 0) {
            const pix = (p.x / 100) * w; // Keep consistent coord system logic if possible, but here x/y are %... 
            // Actually particles were spawned with % coords.
            // Let's adjust drawing
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc((p.x/100)*w, (p.y/100)*h, 3, 0, Math.PI*2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    });
    // Cleanup particles
    particles.current = particles.current.filter(p => p.life > 0);

    // Cleanup arrays
    bullets.current = bullets.current.filter(b => b.active);
    obstacles.current = obstacles.current.filter(obs => obs.active);

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (gameState === 'playing') {
        scoreRef.current = 0;
        setScore(0);
        bullets.current = [];
        obstacles.current = [];
        setTimeLeft(60);
        
        // Timer
        const timerInterval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerInterval);
                    setGameState('lost');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        requestRef.current = requestAnimationFrame(update);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            clearInterval(timerInterval);
        };
    }
  }, [gameState]);

  // Input Handlers
  const handleTouchMove = (e: React.TouchEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      const percent = (touchX / rect.width) * 100;
      playerPos.current.x = Math.max(5, Math.min(95, percent));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const percent = (mouseX / rect.width) * 100;
      playerPos.current.x = Math.max(5, Math.min(95, percent));
  };

  const handleShoot = () => {
      const now = Date.now();
      if (now - lastShotTime.current > 300) { // Fire rate
          bullets.current.push({
              x: playerPos.current.x,
              y: 85,
              active: true
          });
          lastShotTime.current = now;
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

       <div className={`
         relative w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden
         bg-white border-4 border-white/20 animate-pop flex flex-col h-[80vh]
       `}>
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl bg-pink-500 text-white shadow-lg`}>
                      <Crosshair size={20} />
                  </div>
                  <h2 className="font-black text-xl text-gray-800">Love Shooter</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
          </div>

          <div className="flex-1 relative bg-gray-50 flex flex-col">
              
              {gameState === 'setup' && (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 animate-fade-in">
                      <div className="text-center">
                          <h3 className="text-xl font-black text-gray-800 mb-2">Customize Characters</h3>
                          <p className="text-sm text-gray-500">Tap images to upload faces!</p>
                      </div>

                      <div className="flex justify-center gap-8 items-end">
                          <div className="flex flex-col items-center gap-2">
                              <label className="relative cursor-pointer group">
                                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg group-hover:scale-105 transition-transform bg-white">
                                      <img src={playerImg} className="w-full h-full object-cover" alt="Player" />
                                  </div>
                                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Upload className="text-white" size={24} />
                                  </div>
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, true)} />
                              </label>
                              <span className="font-bold text-sm text-blue-500 uppercase">You (Player)</span>
                          </div>

                          <div className="pb-8"><Heart className="text-pink-400 animate-bounce" fill="currentColor" /></div>

                          <div className="flex flex-col items-center gap-2">
                               <label className="relative cursor-pointer group">
                                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-400 shadow-lg group-hover:scale-105 transition-transform bg-white">
                                      <img src={targetImg} className="w-full h-full object-cover" alt="Target" />
                                  </div>
                                  <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Upload className="text-white" size={24} />
                                  </div>
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, false)} />
                              </label>
                              <span className="font-bold text-sm text-pink-500 uppercase">Partner (Goal)</span>
                          </div>
                      </div>

                      <button 
                        onClick={() => setGameState('playing')}
                        className={`w-full py-4 rounded-xl font-black text-white text-lg shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform ${theme.colors.primary}`}
                      >
                          <Play fill="currentColor" /> START GAME
                      </button>
                  </div>
              )}

              {gameState === 'playing' && (
                  <div className="relative w-full h-full bg-slate-900 overflow-hidden cursor-crosshair">
                       {/* Canvas Layer */}
                       <canvas 
                          ref={canvasRef} 
                          width={400} 
                          height={600} 
                          className="w-full h-full object-cover"
                          onTouchMove={handleTouchMove}
                          onMouseMove={handleMouseMove}
                          onClick={handleShoot}
                       />

                       {/* UI Overlay */}
                       <div className="absolute top-4 left-4 right-4 flex justify-between text-white font-black drop-shadow-md pointer-events-none">
                           <div className="flex flex-col">
                               <span className="text-[10px] uppercase opacity-70">Love Score</span>
                               <span className="text-2xl">{score} / 100</span>
                           </div>
                           <div className={`flex flex-col items-end ${timeLeft < 10 ? 'text-red-400 animate-pulse' : ''}`}>
                               <span className="text-[10px] uppercase opacity-70">Time</span>
                               <span className="text-2xl">{timeLeft}s</span>
                           </div>
                       </div>

                       <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none opacity-50 text-white text-xs font-bold">
                           TAP TO SHOOT ❤️ • SLIDE TO MOVE
                       </div>
                  </div>
              )}

              {(gameState === 'won' || gameState === 'lost') && (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-pop">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white mb-4 shadow-xl ${gameState === 'won' ? 'bg-yellow-400 animate-bounce' : 'bg-gray-400'}`}>
                          {gameState === 'won' ? <Trophy size={48} fill="currentColor" /> : <RefreshCw size={48} />}
                      </div>
                      
                      <h2 className="text-3xl font-black text-gray-800 mb-2">
                          {gameState === 'won' ? 'Love Conquered!' : 'Time Up!'}
                      </h2>
                      
                      <p className="text-gray-500 font-bold mb-8">
                          {gameState === 'won' 
                            ? "You sent enough love to win the heart! ❤️" 
                            : `You scored ${score} points. Try again?`
                          }
                      </p>

                      <button 
                        onClick={() => setGameState('setup')}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 hover:scale-105 transition-transform ${theme.colors.secondary}`}
                      >
                          <RefreshCw size={20} /> Play Again
                      </button>
                  </div>
              )}

          </div>
       </div>
    </div>
  );
};

export default ShootingGame;
