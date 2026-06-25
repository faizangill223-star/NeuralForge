import { useState, useEffect, useRef } from 'react';

interface LiveChartProps {
  height?: number;
  color?: string;
  maxPoints?: number;
  className?: string;
}

export default function LiveChart({
  height = 80,
  color = '#00f5b8',
  maxPoints = 40,
  className = '',
}: LiveChartProps) {
  const [data, setData] = useState<number[]>(() =>
    Array.from({ length: maxPoints }, (_, i) => 50 + Math.sin(i / 3) * 15 + Math.random() * 10)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(10, Math.min(95, last + (Math.random() - 0.5) * 25));
        return [...prev.slice(1), next];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [maxPoints]);

  const width = 400;
  const padding = 4;
  const chartW = width;
  const chartH = height;
  const max = 100;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * chartW;
    const y = padding + chartH - (val / max) * (chartH - padding * 2);
    return { x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return acc + ` C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = pathD + ` L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: `${height}px` }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="liveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#liveGradient)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.length > 0 && (
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill={color}>
            <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </div>
  );
}
