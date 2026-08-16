export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role="img" aria-label="CoolBG logo">
      <defs>
        <linearGradient id="logo-grad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C5CFC" />
          <stop offset="55%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#12151C" stroke="url(#logo-grad)" strokeWidth="1.5" />
      <path d="M27.5 14.2A9 9 0 1 0 27.5 25.8" fill="none" stroke="url(#logo-grad)" strokeWidth="4.2" strokeLinecap="round" />
      <circle cx="13.5" cy="20" r="2.6" fill="url(#logo-grad)" />
    </svg>
  );
}

export function Wordmark({ className = "" }) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>
      Cool<span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-pink-400 bg-clip-text text-transparent">BG</span>
    </span>
  );
}
