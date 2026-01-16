import { Inter_Tight, Inter } from 'next/font/google';

/**
 * Project Font Configuration
 * -------------------------
 * This file centralizes all font definitions. To change the font across the entire app,
 * navigate here and modify the imports or the variable assignments.
 * 
 * Current Selection:
 * - Header: Inter Tight (Premium, tight spacing for impactful headings)
 * - Body: Inter (Highly readable, standard sans-serif for interface text)
 */

// Primary Display Font (Headings, Titles, Hero sections)
export const headerFont = Inter_Tight({
    subsets: ['latin'],
    variable: '--font-header',
    weight: ['400', '500', '600', '700', '800', '900'], // Comprehensive weights for flexible design
    display: 'swap',
});

// Primary Body Font (Paragraphs, UI interactions, Small text)
// Suggestion: Using 'Inter' for body provides excellent readability compared to 'Inter Tight' at small sizes.
export const bodyFont = Inter({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
});
