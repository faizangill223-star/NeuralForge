import { useState, useEffect } from 'react';

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

export default function DonutChart({
  data,
  size = 200,
  thickness = 28,
  centerLabel = '',
  centerValue = '',
  className = '',
}: DonutChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let offset = 0;
  const segments = data.map((d, i) => {
    const fraction = d.value / total;
    const length = fraction * circumference * progress;
    const dasharray = `${length} ${circumference - length}`;
    const rotation = (offset / circumference) * 360 - 90;
    offset += fraction * circumference;
    return { ...d, dasharray, rotation, fraction, index: i };
  });

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-0">
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(148, 163, 184, 0.06)"
            strokeWidth={thickness}
          />
          {/* Segments */}
          {segments.map((seg) => (
            <circle
              key={seg.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={hovered === seg.index ? thickness + 4 : thickness}
              strokeDasharray={seg.dasharray}
              strokeLinecap="round"
              transform={`rotate(${seg.rotation} ${center} ${center})`}
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHovered(seg.index)}
              onMouseLeave={() => setHovered(null)}
              style={{ filter: hovered === seg.index ? `drop-shadow(0 0 8px ${seg.color}80)` : 'none' }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hovered !== null ? (
            <>
              <div className="text-2xl font-bold text-white font-mono">
                {Math.round((data[hovered].value / total) * 100)}%
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">{data[hovered].label}</div>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-white font-mono">{centerValue}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{centerLabel}</div>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {data.map((d, i) => (
          <button
            key={d.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-neutral-800/30 transition-colors text-left"
          >
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.color }} />
            <span className="text-sm text-neutral-300 min-w-[80px]">{d.label}</span>
            <span className="text-sm font-mono text-neutral-400 ml-auto">
              {Math.round((d.value / total) * 100)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
