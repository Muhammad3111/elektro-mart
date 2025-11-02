"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { getImageUrl } from "@/lib/s3/get-image-url";

interface S3ImageProps extends Omit<ImageProps, "src"> {
    src: string | null | undefined;
    fallback?: string;
}

/**
 * Image component that automatically converts S3 keys to presigned URLs
 * If src is already a full URL, it will be used as-is
 * If src is an S3 key (e.g., "images/1234.jpg"), it will be converted to a presigned URL
 */
export function S3Image({
    src,
    fallback = "/placeholder.png",
    alt,
    ...props
}: S3ImageProps) {
    const s3PublicUrl = process.env.NEXT_PUBLIC_S3_URL_IMAGE;
    
    const [imageUrl, setImageUrl] = useState<string>(() => {
        if (!src) return fallback;
        if (src.startsWith("http://") || src.startsWith("https://")) return src;
        
        // Agar S3 public URL mavjud bo'lsa, to'g'ridan-to'g'ri qo'shish
        if (s3PublicUrl) {
            return `${s3PublicUrl}/${src}`;
        }
        
        return fallback;
    });
    
    const [loading, setLoading] = useState(() => {
        if (!src) return false;
        if (src.startsWith("http://") || src.startsWith("https://")) return false;
        // Agar S3 public URL mavjud bo'lsa, loading yo'q
        if (s3PublicUrl) return false;
        return true;
    });

    useEffect(() => {
        if (!src) return;
        if (src.startsWith("http://") || src.startsWith("https://")) return;
        if (s3PublicUrl) return; // S3 public URL mavjud bo'lsa, presigned URL kerak emas

        // Faqat S3 public URL yo'q bo'lsa presigned URL yaratish (fallback)
        let cancelled = false;

        getImageUrl(src)
            .then((url) => {
                if (!cancelled) {
                    setImageUrl(url || fallback);
                    setLoading(false);
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    console.error("Failed to load S3 image:", error);
                    setImageUrl(fallback);
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [src, fallback, s3PublicUrl]);

    return (
        <Image
            {...props}
            src={imageUrl}
            alt={alt}
            className={`${props.className || ""} ${
                loading ? "animate-pulse" : ""
            }`}
        />
    );
}
