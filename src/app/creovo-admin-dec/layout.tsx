import { Plus_Jakarta_Sans } from 'next/font/google';
import '../globals.css';

const adminFont = Plus_Jakarta_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-admin',
    weight: ['300', '400', '500', '600', '700', '800'],
    style: ['normal', 'italic'],
});

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${adminFont.variable} font-admin antialiased`}>
            {children}
        </div>
    );
}
