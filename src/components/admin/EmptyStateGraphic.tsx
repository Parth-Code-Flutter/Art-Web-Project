'use client';

import React from 'react';

/**
 * EmptyStateGraphic Component
 * 
 * A lightweight, animated SVG graphic for empty states.
 * Replaces heavy image files for faster loading and a cleaner modern look.
 */
export default function EmptyStateGraphic() {
    return (
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Glow */}
            <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                </radialGradient>
            </defs>
            <circle cx="150" cy="150" r="120" fill="url(#glow)">
                <animate attributeName="r" values="100;120;100" dur="4s" repeatCount="indefinite" />
            </circle>

            {/* Modern Floating Gallery Frame */}
            <rect x="80" y="80" width="140" height="140" rx="24" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1">
                <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="6s" repeatCount="indefinite" />
            </rect>

            {/* Inner Plus Icon */}
            <path
                d="M150 120V180M120 150H180"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeOpacity="0.5"
            >
                <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="6s" repeatCount="indefinite" />
            </path>

            {/* Decorative Dots */}
            <circle cx="220" cy="100" r="4" fill="#3b82f6" fillOpacity="0.6">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="200" r="3" fill="#ffffff" fillOpacity="0.3">
                <animate attributeName="opacity" values="1;0.3;1" dur="4s" repeatCount="indefinite" />
            </circle>
        </svg>
    );
}
