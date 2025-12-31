import '../globals.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="antialiased min-h-screen">
            {children}
        </div>
    );
}
