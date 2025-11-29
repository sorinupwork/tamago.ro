'use client';

import React from 'react';

type LoadingDotsProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
};

const LoadingDots: React.FC<LoadingDotsProps> = ({ size = 'md', className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <style>{`
        @keyframes jumpDot {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
        
        .dot-1 { animation: jumpDot 1.2s ease-in-out infinite; }
        .dot-2 { animation: jumpDot 1.2s ease-in-out infinite 0.2s; }
        .dot-3 { animation: jumpDot 1.2s ease-in-out infinite 0.4s; }
      `}</style>
      
      <div className={`${sizeClasses[size]} bg-primary rounded-full dot-1`} />
      <div className={`${sizeClasses[size]} bg-primary rounded-full dot-2`} />
      <div className={`${sizeClasses[size]} bg-primary rounded-full dot-3`} />
    </div>
  );
};

export default LoadingDots;
