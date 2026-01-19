/**
 * Shared Loading Component
 * Used across Customer, Seller, and Admin interfaces
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
}

export function Loading({ size = 'md', text, fullScreen = false }: LoadingProps) {
    const sizeMap = {
        sm: 24,
        md: 32,
        lg: 48,
    };

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={sizeMap[size]} />
            {text && (
                <p className="text-sm font-medium text-zinc-600 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return content;
}
