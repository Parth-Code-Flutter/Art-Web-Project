'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export function usePageTracking() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!GA_MEASUREMENT_ID) return;

        const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

        // Send pageview with custom dimension
        window.gtag?.('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }, [pathname, searchParams]);
}

// Track custom events
export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    if (!GA_MEASUREMENT_ID) return;

    window.gtag?.('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};

// E-commerce tracking
export const trackProductView = (product: {
    id: string;
    name: string;
    category: string;
    price: number;
}) => {
    if (!GA_MEASUREMENT_ID) return;

    window.gtag?.('event', 'view_item', {
        currency: 'INR',
        value: product.price,
        items: [
            {
                item_id: product.id,
                item_name: product.name,
                item_category: product.category,
                price: product.price,
            },
        ],
    });
};

export const trackAddToCart = (product: {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity?: number;
}) => {
    if (!GA_MEASUREMENT_ID) return;

    window.gtag?.('event', 'add_to_cart', {
        currency: 'INR',
        value: product.price * (product.quantity || 1),
        items: [
            {
                item_id: product.id,
                item_name: product.name,
                item_category: product.category,
                price: product.price,
                quantity: product.quantity || 1,
            },
        ],
    });
};

export const trackRemoveFromCart = (product: {
    id: string;
    name: string;
    category: string;
    price: number;
}) => {
    if (!GA_MEASUREMENT_ID) return;

    window.gtag?.('event', 'remove_from_cart', {
        currency: 'INR',
        value: product.price,
        items: [
            {
                item_id: product.id,
                item_name: product.name,
                item_category: product.category,
                price: product.price,
            },
        ],
    });
};

export const trackPurchase = (
    transactionId: string,
    value: number,
    items: Array<{
        id: string;
        name: string;
        category: string;
        price: number;
        quantity: number;
    }>
) => {
    if (!GA_MEASUREMENT_ID) return;

    window.gtag?.('event', 'purchase', {
        transaction_id: transactionId,
        currency: 'INR',
        value: value,
        items: items.map(item => ({
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity,
        })),
    });
};

export const trackSearch = (searchTerm: string, resultsCount: number) => {
    if (!GA_MEASUREMENT_ID) return;

    window.gtag?.('event', 'search', {
        search_term: searchTerm,
        results_count: resultsCount,
    });
};

export const trackShare = (method: string, contentType: string, itemId: string) => {
    if (!GA_MEASUREMENT_ID) return;

    window.gtag?.('event', 'share', {
        method: method,
        content_type: contentType,
        item_id: itemId,
    });
};

// Google Analytics Script Component
export default function GoogleAnalytics() {
    if (!GA_MEASUREMENT_ID) {
        return null;
    }

    return (
        <>
            <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
                id="google-analytics"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}', {
                            page_path: window.location.pathname,
                            send_page_view: false
                        });
                    `,
                }}
            />
        </>
    );
}
