/**
 * Error handling utilities for the Art Gallery application
 */

export class AppError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class NetworkError extends AppError {
    constructor(message: string = 'Network request failed') {
        super(message, 'NETWORK_ERROR', 503);
        this.name = 'NetworkError';
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 'AUTH_ERROR', 401);
        this.name = 'AuthenticationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed') {
        super(message, 'VALIDATION_ERROR', 400);
        this.name = 'ValidationError';
    }
}

/**
 * Handle Supabase errors and convert to user-friendly messages
 */
export function handleSupabaseError(error: any): string {
    if (!error) return 'An unexpected error occurred';

    // Network errors
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        return 'Network connection failed. Please check your internet connection.';
    }

    // Auth errors
    if (error.message?.includes('Invalid login credentials')) {
        return 'Invalid email or password. Please try again.';
    }
    if (error.message?.includes('Email not confirmed')) {
        return 'Please verify your email address before logging in.';
    }
    if (error.message?.includes('User already registered')) {
        return 'An account with this email already exists.';
    }

    // Database errors
    if (error.code === 'PGRST116') {
        return 'No data found. The requested resource may not exist.';
    }
    if (error.code === '23505') {
        return 'This item already exists.';
    }
    if (error.code === '23503') {
        return 'Cannot delete this item as it is referenced by other data.';
    }

    // Permission errors
    if (error.message?.includes('permission denied') || error.code === '42501') {
        return 'You do not have permission to perform this action.';
    }

    // Default message
    return error.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Log errors to console in development, and to error tracking service in production
 */
export function logError(error: Error, context?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', error);
        if (context) {
            console.error('Context:', context);
        }
    } else {
        // In production, send to error tracking service (e.g., Sentry)
        // Example: Sentry.captureException(error, { extra: context });
        console.error('Production Error:', error.message);
    }
}

/**
 * Safe async wrapper that catches errors
 */
export async function safeAsync<T>(
    promise: Promise<T>,
    errorMessage?: string
): Promise<[T | null, Error | null]> {
    try {
        const data = await promise;
        return [data, null];
    } catch (error) {
        const err = error instanceof Error ? error : new Error(errorMessage || 'Unknown error');
        logError(err);
        return [null, err];
    }
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');

            if (i < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, i);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError!;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
    return (
        error instanceof NetworkError ||
        error?.message?.includes('Failed to fetch') ||
        error?.message?.includes('NetworkError') ||
        error?.message?.includes('Network request failed')
    );
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof AppError) {
        return error.message;
    }
    if (error instanceof Error) {
        return handleSupabaseError(error);
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unexpected error occurred. Please try again.';
}
