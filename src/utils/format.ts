/**
 * Utility functions for formatting data
 */

/**
 * Format a number as currency (Indian Rupees)
 * @param amount - The amount to format
 * @param locale - The locale to use (default: 'en-IN')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, locale: string = 'en-IN'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format a number with thousand separators
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('en-IN');
}

/**
 * Format a date to a readable string
 * @param date - The date to format (Date object or ISO string)
 * @param format - The format type ('short', 'long', 'relative')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (format === 'relative') {
        return getRelativeTime(dateObj);
    }

    const options: Intl.DateTimeFormatOptions = format === 'long'
        ? { year: 'numeric', month: 'long', day: 'numeric' }
        : { year: 'numeric', month: 'short', day: 'numeric' };

    return new Intl.DateTimeFormat('en-IN', options).format(dateObj);
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param date - The date to compare
 * @returns Relative time string
 */
function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDate(date, 'short');
}

/**
 * Truncate text to a specified length
 * @param text - The text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Format file size in bytes to human-readable format
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format phone number to Indian format
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }

    return phone;
}
