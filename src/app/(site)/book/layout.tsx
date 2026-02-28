import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Book a Table | La Creola",
    description: "Reserve your evening at La Creola.",
};

export default function BookLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
