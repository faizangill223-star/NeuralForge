interface LogoProps {
  className?: string;
}

export default function Logo({ className = 'w-8 h-8' }: LogoProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4dc3ff" />
          <stop offset="50%" stopColor="#00f5b8" />
          <stop offset="100%" stopColor="#007acc" />
        </linearGradient>
      </defs>
      <path
        d="M20 2 L36 11 L36 29 L20 38 L4 29 L4 11 Z"
        stroke="url(#logoGrad)"
        strokeWidth="2"
        fill="rgba(0, 153, 245, 0.05)"
      />
      <path
        d="M13 26 L13 14 L20 22 L27 14 L27 26"
        stroke="url(#logoGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="20" cy="20" r="1.5" fill="url(#logoGrad)" />
    </svg>
  );
}
