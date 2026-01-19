/**
 * Shared Button Component
 * Used across Customer, Seller, and Admin interfaces
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    className = '',
    disabled,
    children,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-900',
        secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-500',
        outline: 'border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white focus:ring-zinc-900',
        ghost: 'text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`;

    return (
        <button
            className={combinedClassName}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {children}
        </button>
    );
}
