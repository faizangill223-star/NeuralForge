import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  lat: number;
  lng: number;
}

interface Dot {
  lat: number;
  lng: number;
  size: number;
  color: string;
  pulse: number;
}

export default function ParticleGlobe({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext('2d');
    if (!ctxEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxEl;

    let animationId: number;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    let rotation = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const sphereRadius = 220;
    const particles: Particle[] = [];
    const dots: Dot[] = [];
    const connections: { a: number; b: number }[] = [];

    // Generate sphere of particles using fibonacci distribution
    const particleCount = 900;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const theta = goldenAngle * i;

      const lat = Math.asin(y);
      const lng = theta;

      particles.push({
        lat,
        lng,
        x: Math.cos(lat) * Math.cos(lng),
        y: y,
        z: Math.cos(lat) * Math.sin(lng),
      });
    }

    // Add highlight dots (representing data centers / activity points)
    const dotColors = ['#4dc3ff', '#00f5b8', '#ffb74d', '#4dc3ff', '#00f5b8'];
    for (let i = 0; i < 18; i++) {
      dots.push({
        lat: (Math.random() - 0.5) * Math.PI,
        lng: Math.random() * Math.PI * 2,
        size: 2 + Math.random() * 2.5,
        color: dotColors[i % dotColors.length],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Pre-compute some connection pairs
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        if (Math.random() > 0.75) {
          connections.push({ a: i, b: j });
        }
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    function project(lat: number, lng: number): { x: number; y: number; depth: number } {
      const totalLng = lng + rotation;
      const x3d = Math.cos(lat) * Math.cos(totalLng);
      const y3d = Math.sin(lat);
      const z3d = Math.cos(lat) * Math.sin(totalLng);
      // Apply tilt
      const cosT = Math.cos(currentRotX);
      const sinT = Math.sin(currentRotX);
      const yr = y3d * cosT - z3d * sinT;
      const zr = y3d * sinT + z3d * cosT;

      const scale = sphereRadius;
      return {
        x: x3d * scale,
        y: yr * scale,
        depth: zr,
      };
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      rotation += 0.0015;
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      ctx.save();
      ctx.translate(cx, cy);

      // Draw particles
      for (const p of particles) {
        const pos = project(p.lat, p.lng);
        const depth = pos.depth;
        const opacity = (depth + 1) / 2;
        const size = 0.5 + opacity * 1.2;

        if (depth < -0.3) continue;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(77, 195, 255, ${opacity * 0.35})`;
        ctx.fill();
      }

      // Draw connections (arcs between dots)
      for (const conn of connections) {
        const a = dots[conn.a];
        const b = dots[conn.b];
        const posA = project(a.lat, a.lng);
        const posB = project(b.lat, b.lng);

        if (posA.depth < -0.2 && posB.depth < -0.2) continue;

        const avgDepth = (posA.depth + posB.depth) / 2;
        const opacity = Math.max(0, (avgDepth + 1) / 2) * 0.25;

        // Draw curved arc
        const midX = (posA.x + posB.x) / 2;
        const midY = (posA.y + posB.y) / 2;
        const dist = Math.hypot(posA.x - posB.x, posA.y - posB.y);
        const curveOffset = dist * 0.2;

        ctx.beginPath();
        ctx.moveTo(posA.x, posA.y);
        ctx.quadraticCurveTo(midX, midY - curveOffset, posB.x, posB.y);
        ctx.strokeStyle = `rgba(0, 245, 184, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw highlight dots
      for (const dot of dots) {
        const pos = project(dot.lat, dot.lng);
        if (pos.depth < -0.3) continue;

        const opacity = (pos.depth + 1) / 2;
        const pulseSize = dot.size + Math.sin(dot.pulse + rotation * 10) * 1.5;

        // Glow
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, pulseSize * 4);
        gradient.addColorStop(0, dot.color);
        gradient.addColorStop(0.5, dot.color + '40');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = opacity * 0.6;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pulseSize * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Core dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.restore();
      animationId = requestAnimationFrame(draw);
    }

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - width / 2) / width;
      mouseY = (e.clientY - rect.top - height / 2) / height;
      targetRotX = -mouseY * 0.5;
      targetRotY = mouseX * 0.5;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  );
}
