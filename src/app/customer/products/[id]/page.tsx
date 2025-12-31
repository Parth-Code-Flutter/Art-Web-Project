import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductDetailClient from './ProductDetailClient';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;

    // Fetch product data for metadata
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${product.name} | Art Gallery`,
        description: product.description || `Check out this masterpiece: ${product.name}`,
        openGraph: {
            title: product.name,
            description: product.description || `Check out this masterpiece: ${product.name}`,
            images: [
                {
                    url: product.images?.[0] || '/placeholder-art.jpg',
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
                ...previousImages,
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description || `Check out this masterpiece: ${product.name}`,
            images: [product.images?.[0] || '/placeholder-art.jpg'],
        },
    };
}

export default function Page({ params }: Props) {
    return <ProductDetailClient params={params} />;
}
