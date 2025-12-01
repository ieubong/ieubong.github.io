import React, { useEffect, useRef } from 'react';
import { ThemePack } from '../types';

interface WeatherOverlayProps {
  theme: ThemePack;
}

const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Resize handling
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      angle: number;
      spin: number;
      type: 'snow' | 'petal' | 'heart' | 'none';

      constructor(type: 'snow' | 'petal' | 'heart' | 'none') {
        this.type = type;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height; // Start above
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.02;

        if (type === 'petal') {
            this.size = Math.random() * 8 + 5;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.3;
        } else if (type === 'heart') {
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 1.0 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        } else {
            // Snow
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.6 + 0.2;
        }
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.angle) * 0.5;
        this.angle += this.spin;

        if (this.y > canvas.height) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        
        if (this.type === 'petal') {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(this.size/2, -this.size/2, this.size, 0, 0, this.size);
            ctx.bezierCurveTo(-this.size, 0, -this.size/2, -this.size/2, 0, 0);
            ctx.fillStyle = '#fbcfe8'; // Pink-200
            ctx.fill();
        } else if (this.type === 'heart') {
            const s = this.size;
            ctx.beginPath();
            ctx.moveTo(0, s/4);
            ctx.bezierCurveTo(0, 0, -s/2, 0, -s/2, s/4);
            ctx.bezierCurveTo(-s/2, s/2, 0, s, 0, s);
            ctx.bezierCurveTo(0, s, s/2, s/2, s/2, s/4);
            ctx.bezierCurveTo(s/2, 0, 0, 0, 0, s/4);
            ctx.fillStyle = '#fda4af'; // Rose-300
            ctx.fill();
        } else {
            // Draw Snow circle
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        }
        ctx.restore();
      }
    }

    // Initialize Particles
    const initParticles = () => {
        particles = [];
        if (theme.weather === 'none') return;

        const count = theme.weather === 'snow' ? 100 : 40;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(theme.weather));
        }
    };
    initParticles();

    // Animation Loop
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none absolute inset-0 z-10"
    />
  );
};

export default WeatherOverlay;
