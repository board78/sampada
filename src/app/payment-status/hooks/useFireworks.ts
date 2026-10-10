import { useEffect, useRef } from "react";

export function useFireworks(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d")!;

    const COLORS = [
      "#f59e0b", "#fbbf24", "#f97316", "#ef4444",
      "#a855f7", "#8b5cf6", "#06b6d4", "#22d3ee",
      "#ec4899", "#f472b6", "#22c55e", "#4ade80",
      "#ffffff", "#fde68a",
    ];

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      alpha: number; color: string; r: number; trail: boolean;
    };
    type Rocket = {
      x: number; y: number; vy: number; targetY: number;
      color: string;
    };

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];
    let lastLaunch = 0;
    let elapsed = 0;
    let prev = 0;

    const explode = (x: number, y: number, color: string) => {
      const count = 70 + Math.floor(Math.random() * 50);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.25;
        const speed = Math.random() * 7 + 1.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          alpha: 1,
          color,
          r: Math.random() * 2.5 + 0.8,
          trail: false,
        });
      }
      for (let i = 0; i < 12; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          alpha: 1,
          color: "#ffffff",
          r: 1.5,
          trail: true,
        });
      }
    };

    const launch = () => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      rockets.push({
        x: canvas.width * (0.15 + Math.random() * 0.7),
        y: canvas.height,
        vy: -(14 + Math.random() * 8),
        targetY: canvas.height * (0.08 + Math.random() * 0.35),
        color,
      });
    };

    const draw = (ts: number) => {
      const dt = prev ? Math.min(ts - prev, 50) : 16;
      prev = ts;
      elapsed += dt;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (elapsed < 7000 && ts - lastLaunch > (elapsed < 2000 ? 350 : 600)) {
        launch();
        lastLaunch = ts;
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy *= 0.985;

        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        const trail = 6;
        for (let t = 1; t <= trail; t++) {
          ctx.globalAlpha = (1 - t / trail) * 0.5;
          ctx.beginPath();
          ctx.arc(r.x, r.y + r.vy * t * 0.6, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = r.color;
          ctx.fill();
        }

        if (r.y <= r.targetY || r.vy >= -0.5) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.vx *= 0.98;
        p.alpha -= p.trail ? 0.025 : 0.013;

        if (p.alpha <= 0) { particles.splice(i, 1); continue; }

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      if (elapsed < 9000 || rockets.length || particles.length) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return canvasRef;
}
