import React, { useEffect, useRef } from 'react';

const ClickSparkles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const colors = ['#F472B6', '#A78BFA', '#38BDF8', '#FBBF24', '#34D399'];
      const shapes = ['★', '♥', '●', '✦'];
      
      const particleCount = 8;

      for (let i = 0; i < particleCount; i++) {
        const span = document.createElement('span');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        span.textContent = shape;
        span.style.position = 'fixed';
        span.style.left = `${e.clientX}px`;
        span.style.top = `${e.clientY}px`;
        span.style.color = color;
        span.style.fontSize = `${Math.random() * 10 + 10}px`;
        span.style.pointerEvents = 'none';
        span.style.zIndex = '9999';
        span.style.userSelect = 'none';
        
        // Random velocity
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 60 + 20; // distance
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        span.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
          duration: 600 + Math.random() * 400,
          easing: 'cubic-bezier(0, .9, .57, 1)',
        }).onfinish = () => span.remove();

        containerRef.current.appendChild(span);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
};

export default ClickSparkles;
