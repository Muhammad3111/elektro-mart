import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface Product {
    id: string;
    nameEn: string;
    nameRu: string;
    descriptionEn?: string;
    descriptionRu?: string;
    shortDescriptionEn?: string;
    shortDescriptionRu?: string;
    price: number;
    oldPrice?: number;
    coverImage?: string;
    galleryImages?: string[];
    sku?: string;
    productCode?: string;
    inStock: boolean;
    isNew?: boolean;
    discount?: number;
    rating?: number;
    categoryId?: string;
    brandId?: string;
    category?: {
        id: string;
        nameEn: string;
        nameRu: string;
    };
    brand?: {
        id: string;
        nameEn: string;
        nameRu: string;
    };
    specifications?: Array<{
        labelEn: string;
        labelRu: string;
        valueEn: string;
        valueRu?: string;
    }>;
}

interface ProductsResponse {
    data: Product[];
    total: number;
}

// Server-side data fetching
async function getProduct(id: string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            next: { revalidate: 60 }, // 1 daqiqa cache
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch product:", error);
        return null;
    }
}

async function getRelatedProducts(
    categoryId: string,
    productId: string,
): Promise<Product[]> {
    try {
        const res = await fetch(
            `${API_URL}/products?categoryId=${categoryId}&limit=8&isActive=true`,
            { next: { revalidate: 300 } }, // 5 daqiqa cache
        );

        if (!res.ok) return [];
        const data: ProductsResponse = await res.json();
        return data.data.filter((p) => p.id !== productId).slice(0, 4);
    } catch {
        return [];
    }
}

// Dynamic metadata for SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: "Mahsulot topilmadi",
            description: "So'ralgan mahsulot topilmadi",
        };
    }

    const title = product.nameEn;
    const description =
        product.shortDescriptionEn ||
        product.descriptionEn ||
        `${product.nameEn} - WWTS`;
    const imageUrl = product.coverImage
        ? product.coverImage.startsWith("http")
            ? product.coverImage
            : `${process.env.NEXT_PUBLIC_S3_URL_IMAGE}/${product.coverImage}`
        : "/og-image.jpg";

    return {
        title,
        description,
        keywords: `${product.nameEn}, ${
            product.category?.nameEn || ""
        }, electronics, WWTS`,
        openGraph: {
            title: `${title} | WWTS`,
            description,
            type: "website",
            url: `https://wwts.uz/products/${id}`,
            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 600,
                    alt: title,
                },
            ],
            siteName: "WWTS",
            locale: "uz_UZ",
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | WWTS`,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: `https://wwts.uz/products/${id}`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

// Generate static params for popular products (optional)
export async function generateStaticParams() {
    try {
        const res = await fetch(`${API_URL}/products?limit=50&isActive=true`);
        if (!res.ok) return [];

        const data: ProductsResponse = await res.json();
        return data.data.map((product) => ({
            id: product.id,
        }));
    } catch {
        return [];
    }
}

// Page component
export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const relatedProducts = product.categoryId
        ? await getRelatedProducts(product.categoryId, id)
        : [];

    // JSON-LD Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.nameEn,
        description: product.descriptionEn || product.shortDescriptionEn,
        image: product.coverImage,
        sku: product.sku || product.productCode,
        brand: product.brand
            ? {
                  "@type": "Brand",
                  name: product.brand.nameEn,
              }
            : undefined,
        category: product.category?.nameEn,
        offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "UZS",
            availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            seller: {
                "@type": "Organization",
                name: "WWTS",
            },
        },
        ...(product.rating && {
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                bestRating: 5,
                worstRating: 1,
                ratingCount: 100,
            },
        }),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient
                product={product}
                relatedProducts={relatedProducts}
            />
        </>
    );
}
