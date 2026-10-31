import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: 'none' | 'blue' | 'orange' | 'purple';
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverEffect = false,
  glow = 'none',
  children,
  ...props
}) => {
  const glows = {
    none: '',
    blue: 'hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] hover:border-sky-500/40',
    orange: 'hover:shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:border-orange-500/40',
    purple: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] hover:border-purple-500/40',
  };

  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6 transition-all duration-300 relative overflow-hidden',
        hoverEffect && 'glass-card-hover cursor-pointer',
        glows[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
