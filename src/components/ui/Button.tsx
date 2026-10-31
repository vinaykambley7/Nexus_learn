import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'orange' | 'purple' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const variants = {
      primary:
        'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] border border-sky-400/30',
      secondary:
        'bg-dark-surface hover:bg-dark-hover text-white border border-white/10 hover:border-white/20 shadow-sm',
      outline:
        'bg-transparent hover:bg-white/5 text-text-primary border border-white/20 hover:border-white/40',
      ghost:
        'bg-transparent hover:bg-white/5 text-text-secondary hover:text-white border-transparent',
      orange:
        'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.35)] border border-orange-400/30',
      purple:
        'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] border border-purple-400/30',
      danger:
        'bg-rose-600/80 hover:bg-rose-600 text-white border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 rounded-lg font-medium',
      md: 'text-sm px-4 py-2 rounded-xl font-medium',
      lg: 'text-base px-6 py-3 rounded-xl font-semibold',
      icon: 'p-2 rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none font-sans',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
