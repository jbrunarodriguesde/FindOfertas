import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2 font-black tracking-tight select-none cursor-pointer ${className}`}>
      <div className={`${iconSizes[size]} relative flex items-center justify-center text-blue-600 flex-shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Professional Chart Bars */}
          <rect x="22" y="44" width="12" height="28" rx="3" fill="#2563eb" />
          <rect x="40" y="24" width="12" height="48" rx="3" fill="#2563eb" />
          <rect x="58" y="34" width="12" height="38" rx="3" fill="#10b981" />
          {/* Glass frame stroke */}
          <circle cx="48" cy="48" r="38" stroke="#2563eb" strokeWidth="8" />
          <path d="M74 74L90 90" stroke="#2563eb" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-black text-blue-600 tracking-tight`}>
          Compara<span className="text-emerald-500">+</span>
        </span>
      )}
    </div>
  );
};

