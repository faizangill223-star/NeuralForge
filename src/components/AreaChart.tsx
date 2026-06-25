import { useState, useEffect, useRef } from 'react';

interface AreaChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  gradientId?: string;
  className?: string;
  showGrid?: boolean;
  animated?: boolean;
}

export default function AreaChart({
  data,
  labels,
  height = 240,
  color = '#4dc3ff',
  gradientId = 'areaGradient',
  className = '',
  showGrid = true,
  animated = true,
}: AreaChartProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [progress, setProgress] = useState(animated ? 0 : 1);
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 800;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  useEffect(() => {
    if (!animated) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animated]);

  const max = Math.max(...data) * 1.1;
  const min = 0;
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((val - min) / range) * chartH * progress;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return acc + ` C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = pathD + ` L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  const gridLines = 4;

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height: `${height}px` }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {showGrid &&
          Array.from({ length: gridLines + 1 }).map((_, i) => {
            const y = padding.top + (chartH / gridLines) * i;
            const val = max - (range / gridLines) * i;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.06)"
                  strokeWidth="1"
                />
                <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-neutral-600" style={{ fontSize: '10px' }}>
                  {Math.round(val)}
                </text>
              </g>
            );
          })}

        {/* Area */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover interactions */}
        {points.map((p, i) => (
          <g key={i}>
            <rect
              x={p.x - chartW / data.length / 2}
              y={padding.top}
              width={chartW / data.length}
              height={chartH}
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
            />
            {hovered === i && (
              <>
                <line
                  x1={p.x}
                  y1={padding.top}
                  x2={p.x}
                  y2={padding.top + chartH}
                  stroke={color}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                <circle cx={p.x} cy={p.y} r="5" fill={color} />
                <circle cx={p.x} cy={p.y} r="9" fill={color} opacity="0.2" />
              </>
            )}
          </g>
        ))}

        {/* X-axis labels */}
        {labels &&
          labels.map((label, i) => {
            if (i % Math.ceil(labels.length / 6) !== 0 && i !== labels.length - 1) return null;
            const x = padding.left + (i / (data.length - 1)) * chartW;
            return (
              <text key={i} x={x} y={height - 8} textAnchor="middle" className="fill-neutral-600" style={{ fontSize: '10px' }}>
                {label}
              </text>
            );
          })}
      </svg>

      {hovered !== null && (
        <div
          className="absolute glass-strong px-3 py-2 rounded-lg pointer-events-none z-10 text-xs whitespace-nowrap"
          style={{
            left: `${(points[hovered].x / width) * 100}%`,
            top: `${(points[hovered].y / height) * 100}%`,
            transform: 'translate(-50%, -130%)',
          }}
        >
          <div className="text-neutral-400">{labels ? labels[hovered] : `Point ${hovered + 1}`}</div>
          <div className="text-white font-semibold font-mono">{data[hovered].toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}
