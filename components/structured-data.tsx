"use client";

import Script from "next/script";

interface Product {
    name: string;
    description: string;
    image: string;
    price: string;
    brand?: string;
    category?: string;
    rating?: number;
}

interface StructuredDataProps {
    type: "WebSite" | "Product" | "Organization" | "BreadcrumbList";
    data?: any;
    product?: Product;
}

export function StructuredData({ type, data, product }: StructuredDataProps) {
    let structuredData: any = {};

    switch (type) {
        case "WebSite":
            structuredData = {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Sobirov Market",
                "url": "https://elektromart.uz",
                "description": "O'zbekistonda eng yaxshi elektr kabel va aksessuarlar",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://elektromart.uz/catalog?search={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            };
            break;

        case "Organization":
            structuredData = {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Sobirov Market",
                "url": "https://elektromart.uz",
                "logo": "https://elektromart.uz/logo.png",
                "description": "Professional elektr kabel va aksessuarlar do'koni",
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "UZ",
                    "addressLocality": "Toshkent"
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+998-90-123-45-67",
                    "contactType": "customer service"
                },
                "sameAs": [
                    "https://t.me/sobirovmarket",
                    "https://instagram.com/sobirovmarket"
                ]
            };
            break;

        case "Product":
            if (product) {
                structuredData = {
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": product.name,
                    "description": product.description,
                    "image": product.image,
                    "brand": {
                        "@type": "Brand",
                        "name": product.brand || "Sobirov Market"
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": product.price.replace(/,/g, ""),
                        "priceCurrency": "UZS",
                        "availability": "https://schema.org/InStock",
                        "seller": {
                            "@type": "Organization",
                            "name": "Sobirov Market"
                        }
                    },
                    ...(product.rating && {
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": product.rating,
                            "bestRating": "5",
                            "worstRating": "1",
                            "ratingCount": "100"
                        }
                    }),
                    "category": product.category
                };
            }
            break;

        case "BreadcrumbList":
            structuredData = data;
            break;
    }

    return (
        <Script
            id={`structured-data-${type}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
