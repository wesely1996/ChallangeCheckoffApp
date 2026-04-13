interface BowIconProps {
  size?: number;
  className?: string;
}

export function BowIcon({ size = 24, className }: BowIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left bow loop */}
      <path d="M24 22 C22 18, 14 10, 6 12 C2 13, 2 18, 6 20 C12 22, 20 20, 24 24 C20 20, 12 22, 6 20 C4 24, 6 30, 12 28 C18 26, 22 28, 24 26 Z"
        opacity="0.95" />
      {/* Right bow loop */}
      <path d="M24 22 C26 18, 34 10, 42 12 C46 13, 46 18, 42 20 C36 22, 28 20, 24 24 C28 20, 36 22, 42 20 C44 24, 42 30, 36 28 C30 26, 26 28, 24 26 Z"
        opacity="0.95" />
      {/* Left ribbon tail */}
      <path d="M22 26 C18 30, 14 36, 10 40 C12 40, 14 38, 16 36 C18 34, 21 30, 24 28 Z"
        opacity="0.8" />
      {/* Right ribbon tail */}
      <path d="M26 26 C30 30, 34 36, 38 40 C36 40, 34 38, 32 36 C30 34, 27 30, 24 28 Z"
        opacity="0.8" />
      {/* Center knot */}
      <ellipse cx="24" cy="24" rx="3.5" ry="3" />
    </svg>
  );
}
