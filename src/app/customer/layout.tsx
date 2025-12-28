import DashboardHeader from '@/components/customer/DashboardHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <DashboardHeader />
            <main style={{ flex: 1, paddingTop: '85px' }}>
                {children}
            </main>
            <CustomerFooter />
        </div>
    );
}
