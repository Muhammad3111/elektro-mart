"use client";

import Script from "next/script";
import { siteConfig } from "@/lib/config/site";

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
    data?: Record<string, unknown>;
    product?: Product;
}

export function StructuredData({ type, data, product }: StructuredDataProps) {
    let structuredData: Record<string, unknown> = {};

    switch (type) {
        case "WebSite":
            structuredData = {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": siteConfig.name,
                "url": siteConfig.url,
                "description": siteConfig.description.en,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${siteConfig.url}/catalog?search={search_term_string}`,
                    "query-input": "required name=search_term_string"
                }
            };
            break;

        case "Organization":
            structuredData = {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": siteConfig.name,
                "url": siteConfig.url,
                "logo": `${siteConfig.url}/logo.png`,
                "description": siteConfig.description.en,
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "UZ",
                    "addressLocality": "Tashkent"
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": siteConfig.contact.phone,
                    "contactType": "customer service"
                },
                "sameAs": [
                    siteConfig.social.telegram,
                    siteConfig.social.instagram
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
                        "name": product.brand || siteConfig.name
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": product.price.replace(/,/g, ""),
                        "priceCurrency": siteConfig.currency,
                        "availability": "https://schema.org/InStock",
                        "seller": {
                            "@type": "Organization",
                            "name": siteConfig.name
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
            structuredData = data || {};
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
