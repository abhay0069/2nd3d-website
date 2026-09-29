import { useMemo, useRef } from 'react';
import { useCanvas2D } from '../../hooks/useCanvas2D';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  accent: boolean;
}

/**
 * EXPERIMENT 01 — FIELD
 * A dust field that avoids the cursor. Presence as a force.
 */
export function FieldExperiment() {
  const particlesRef = useRef<Particle[] | null>(null);

  const canvasRef = useCanvas2D(({ ctx, width, height }, pointer, time) => {
    if (!ctx) return;

    if (!particlesRef.current) {
      particlesRef.current = Array.from({ length: 130 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        r: 0.6 + Math.random() * 1.7,
        accent: Math.random() < 0.07,
      }));
    }
    const particles = particlesRef.current;

    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      // ambient drift
      p.vx += Math.sin(time * 0.5 + p.y * 0.012) * 0.012;
      p.vy += Math.cos(time * 0.42 + p.x * 0.01) * 0.012;

      // cursor repulsion
      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130 && dist > 0.001) {
          const force = (1 - dist / 130) ** 2 * 1.35;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      p.vx *= 0.92;
      p.vy *= 0.92;
      p.x += p.vx;
      p.y += p.vy;

      // wrap
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.accent ? 'rgba(255, 74, 31, 0.85)' : 'rgba(242, 239, 233, 0.55)';
      ctx.fill();
    }

    // connection threads near the cursor
    if (pointer.active) {
      ctx.lineWidth = 0.5;
      for (const p of particles) {
        const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (dist < 92) {
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(242, 239, 233, ${0.22 * (1 - dist / 92)})`;
          ctx.stroke();
        }
      }
    }
  }, []);

  return <canvas ref={canvasRef} className="experiment__canvas" aria-hidden="true" />;
}

/**
 * EXPERIMENT 02 — TENSION
 * Typography as matter: letters lean away from the cursor.
 */
export function TypeExperiment() {
  const rootRef = useRef<HTMLDivElement>(null);
  const letters = useMemo(() => 'TENSION'.split(''), []);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();

    letterRefs.current.forEach((el) => {
      if (!el) return;
      const lr = el.getBoundingClientRect();
      const cx = lr.left + lr.width / 2 - rect.left;
      const cy = lr.top + lr.height / 2 - rect.top;
      const dx = e.clientX - rect.left - cx;
      const dy = e.clientY - rect.top - cy;
      const dist = Math.hypot(dx, dy);
      const pull = Math.max(0, 1 - dist / 190);
      const tx = -dx * pull * 0.22;
      const ty = -dy * pull * 0.22;
      const rot = -dx * pull * 0.08;
      const scale = 1 + pull * 0.22;

      el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`;
    });
  };

  const onLeave = () => {
    letterRefs.current.forEach((el) => {
      if (el) el.style.transform = 'translate(0, 0) rotate(0) scale(1)';
    });
  };

  return (
    <div ref={rootRef} className="type-experiment" onPointerMove={onMove} onPointerLeave={onLeave}>
      {letters.map((letter, i) => (
        <span
          key={i}
          ref={(el) => {
            letterRefs.current[i] = el;
          }}
          className="type-experiment__letter"
        >
          {letter}
        </span>
      ))}
    </div>
  );
}

/**
 * EXPERIMENT 04 — TRACE
 * The cursor leaves a fading gesture. Memory of presence.
 */
export function TraceExperiment() {
  const trailRef = useRef<Array<{ x: number; y: number; age: number }>>([]);

  const canvasRef = useCanvas2D(({ ctx, width, height }, pointer) => {
    if (!ctx) return;

    // translucent wash — old strokes fade to nothing
    ctx.fillStyle = 'rgba(18, 18, 20, 0.12)';
    ctx.fillRect(0, 0, width, height);

    const trail = trailRef.current;
    if (pointer.active) {
      trail.push({ x: pointer.x, y: pointer.y, age: 0 });
      if (trail.length > 90) trail.shift();
    }

    for (let i = 1; i < trail.length; i++) {
      const prev = trail[i - 1];
      const curr = trail[i];
      curr.age += 0.012;

      const t = 1 - i / trail.length;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.lineWidth = t * 5.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = i % 9 === 0 ? `rgba(255, 74, 31, ${0.5 * t})` : `rgba(242, 239, 233, ${0.55 * t})`;
      ctx.stroke();
    }

    while (trail.length && trail[0].age > 1.4) trail.shift();
  }, []);

  return <canvas ref={canvasRef} className="experiment__canvas" aria-hidden="true" />;
}
