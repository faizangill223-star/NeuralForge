import { useState, useEffect } from 'react';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  className?: string;
}

export default function BarChart({ data, height = 240, className = '' }: BarChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1000, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const max = Math.max(...data.map((d) => d.value)) * 1.15;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
        {data.map((d, i) => {
          const barHeight = (d.value / max) * height * progress;
          const isHovered = hovered === i;
          return (
            <div
              key={d.label}
              className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative flex-1 w-full flex items-end justify-center">
                {isHovered && (
                  <div className="absolute -top-10 glass-strong px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap z-10">
                    <div className="text-white font-semibold font-mono">{d.value.toLocaleString()}</div>
                  </div>
                )}
                <div
                  className="w-full max-w-[48px] rounded-t-md transition-all duration-300 relative overflow-hidden"
                  style={{
                    height: `${barHeight}px`,
                    background: `linear-gradient(180deg, ${d.color || '#4dc3ff'}, ${d.color || '#4dc3ff'}80)`,
                    opacity: isHovered ? 1 : 0.85,
                    transform: isHovered ? 'scaleY(1.02)' : 'scaleY(1)',
                    transformOrigin: 'bottom',
                    boxShadow: isHovered ? `0 0 20px ${d.color || '#4dc3ff'}40` : 'none',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                </div>
              </div>
              <span className="text-[10px] text-neutral-500 font-medium">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
