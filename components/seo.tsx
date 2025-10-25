"use client";

import Head from "next/head";
import { useEffect } from "react";

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    ogType?: string;
    canonical?: string;
    noindex?: boolean;
}

export function SEO({
    title,
    description,
    keywords,
    ogImage = "/og-image.jpg",
    ogType = "website",
    canonical,
    noindex = false,
}: SEOProps) {
    const fullTitle = `${title} | ElektroMart`;
    const siteUrl = "https://elektromart.uz";
    const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

    useEffect(() => {
        // Update document title
        document.title = fullTitle;

        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement("meta");
            metaDescription.setAttribute("name", "description");
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute("content", description);

        // Update meta keywords
        if (keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement("meta");
                metaKeywords.setAttribute("name", "keywords");
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.setAttribute("content", keywords);
        }

        // Update canonical link
        let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!linkCanonical) {
            linkCanonical = document.createElement("link");
            linkCanonical.setAttribute("rel", "canonical");
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.href = canonicalUrl;

        // Update robots meta
        let metaRobots = document.querySelector('meta[name="robots"]');
        if (!metaRobots) {
            metaRobots = document.createElement("meta");
            metaRobots.setAttribute("name", "robots");
            document.head.appendChild(metaRobots);
        }
        metaRobots.setAttribute("content", noindex ? "noindex,nofollow" : "index,follow");

        // Update Open Graph tags
        const ogTags = [
            { property: "og:title", content: fullTitle },
            { property: "og:description", content: description },
            { property: "og:type", content: ogType },
            { property: "og:url", content: canonicalUrl },
            { property: "og:image", content: `${siteUrl}${ogImage}` },
            { property: "og:site_name", content: "ElektroMart" },
        ];

        ogTags.forEach(({ property, content }) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement("meta");
                meta.setAttribute("property", property);
                document.head.appendChild(meta);
            }
            meta.setAttribute("content", content);
        });

        // Update Twitter Card tags
        const twitterTags = [
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:title", content: fullTitle },
            { name: "twitter:description", content: description },
            { name: "twitter:image", content: `${siteUrl}${ogImage}` },
        ];

        twitterTags.forEach(({ name, content }) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement("meta");
                meta.setAttribute("name", name);
                document.head.appendChild(meta);
            }
            meta.setAttribute("content", content);
        });
    }, [title, description, keywords, ogImage, ogType, canonicalUrl, noindex, fullTitle, siteUrl]);

    return null;
}
