'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rSpeed: number;
  alpha: number;
  settled: boolean;
  shape: 'circle' | 'square' | 'triangle';
}

interface FireworkLaunch {
  x: number;
  y: number;
  delay: number;
}

const Fireworks: React.FC<{ active: boolean; onComplete?: () => void }> = ({ active, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const settledParticlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const colors = [
    '#f43f5e',
    '#ec4899',
    '#fbbf24',
    '#fb923c',
    '#d946ef',
    '#a855f7',
    '#f87171',
    '#f472b6',
  ];

  const createFirework = useCallback((x: number, y: number): Particle[] => {
    const newParticles: Particle[] = [];
    const particleCount = 30 + Math.floor(Math.random() * 20);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3;
      const speed = 3 + Math.random() * 6;
      
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: Math.random() * 8 - 4,
        alpha: 1,
        settled: false,
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as Particle['shape'],
      });
    }
    
    return newParticles;
  }, []);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    
    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'square') {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -p.size / 2);
      ctx.lineTo(p.size / 2, p.size / 2);
      ctx.lineTo(-p.size / 2, p.size / 2);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
  }, []);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = [];
    settledParticlesRef.current = [];

    const launches: FireworkLaunch[] = [];
    const fireworkCount = 8;
    
    for (let i = 0; i < fireworkCount; i++) {
      launches.push({
        x: Math.random() * canvas.width,
        y: canvas.height * 0.3 + Math.random() * canvas.height * 0.2,
        delay: i * 400 + Math.random() * 300,
      });
    }

    launches.forEach((launch) => {
      setTimeout(() => {
        const newParticles = createFirework(launch.x, launch.y);
        particlesRef.current.push(...newParticles);
      }, launch.delay);
    });

    let frameCount = 0;
    const gravity = 0.15;
    const bounce = 0.3;
    const friction = 0.98;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      settledParticlesRef.current.forEach((p) => {
        drawParticle(ctx, p);
      });

      particlesRef.current.forEach((p) => {
        p.vy += gravity;
        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rSpeed;

        if (p.y >= canvas.height - p.size) {
          p.y = canvas.height - p.size;
          p.vy *= -bounce;
          p.vx *= 0.9;

          if (Math.abs(p.vy) < 1 && Math.abs(p.vx) < 0.5) {
            p.settled = true;
            p.vx = 0;
            p.vy = 0;
            p.alpha = 0.9;
            settledParticlesRef.current.push(p);
          }
        }

        if (p.y > canvas.height + 50) {
          p.alpha = 0;
        }

        drawParticle(ctx, p);
      });

      particlesRef.current = particlesRef.current.filter((p) => !p.settled && p.alpha > 0);

      frameCount++;

      if (particlesRef.current.length > 0 || frameCount < 600) {
        animationIdRef.current = requestAnimationFrame(render);
      } else {
        onComplete?.();
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [active, createFirework, drawParticle, onComplete]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = [];
    settledParticlesRef.current = [];
    
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!active) {
      clearCanvas();
    }
  }, [active, clearCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
};

export default Fireworks;
