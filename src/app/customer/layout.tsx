'use client';

import DashboardHeader from '@/components/customer/DashboardHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import AnalyticsPageTracker from '@/components/providers/AnalyticsPageTracker';
import { WishlistProvider } from '@/contexts/WishlistContext';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WishlistProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AnalyticsPageTracker />
                <DashboardHeader />
                <main style={{ flex: 1, paddingTop: '85px' }}>
                    {children}
                </main>
                <CustomerFooter />
            </div>
        </WishlistProvider>
    );
}
