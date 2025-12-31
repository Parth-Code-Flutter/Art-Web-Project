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

    // Get the base URL - use environment variable or construct from headers
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://art-web-project.vercel.app';

    // Ensure image URL is absolute
    const imageUrl = product.images?.[0] || '/placeholder-art.jpg';
    const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `${product.name} | Art Gallery`,
        description: product.description || `Check out this masterpiece: ${product.name}`,
        metadataBase: new URL(baseUrl),
        openGraph: {
            title: product.name,
            description: product.description || `Check out this masterpiece: ${product.name}`,
            url: `${baseUrl}/customer/products/${id}`,
            siteName: 'Art Gallery',
            images: [
                {
                    url: absoluteImageUrl,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
                ...previousImages,
            ],
            type: 'website',
            locale: 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description || `Check out this masterpiece: ${product.name}`,
            images: [absoluteImageUrl],
            creator: '@artgallery',
        },
    };
}

export default function Page({ params }: Props) {
    return <ProductDetailClient params={params} />;
}
