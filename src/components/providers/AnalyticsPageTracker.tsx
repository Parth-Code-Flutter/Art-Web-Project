'use client';

import { usePageTracking } from '@/lib/analytics';

export default function AnalyticsPageTracker() {
    usePageTracking();
    return null;
}
