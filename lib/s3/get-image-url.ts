/**
 * Get image URL from S3 key
 * If the value is already a full URL, return it as is
 * Otherwise, generate a presigned URL from the S3 key via API route
 */

// Cache for presigned URLs to avoid regenerating them
const urlCache = new Map<string, { url: string; expiresAt: number }>();

// Use public S3 URL for direct access (Contabo public bucket)
const S3_PUBLIC_URL =
    process.env.NEXT_PUBLIC_S3_URL_IMAGE ||
    "https://eu2.contabostorage.com/wwts";

export async function getImageUrl(
    keyOrUrl: string | undefined | null
): Promise<string> {
    if (!keyOrUrl) return "";

    // If it's already a full URL (starts with http:// or https://), return it
    if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) {
        return keyOrUrl;
    }

    // Check cache first
    const cached = urlCache.get(keyOrUrl);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.url;
    }

    try {
        // Use API route to generate presigned URL
        const response = await fetch("/api/s3/presign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ key: keyOrUrl }),
        });

        if (!response.ok) {
            // Fallback to public URL if presign fails
            return `${S3_PUBLIC_URL}/${keyOrUrl}`;
        }

        const { url } = await response.json();

        // Cache it (expires in 50 minutes to be safe)
        urlCache.set(keyOrUrl, {
            url,
            expiresAt: Date.now() + 50 * 60 * 1000,
        });

        return url;
    } catch (error) {
        console.error("Failed to generate presigned URL for:", keyOrUrl, error);
        // Fallback to public URL
        return `${S3_PUBLIC_URL}/${keyOrUrl}`;
    }
}

/**
 * Get multiple image URLs from S3 keys
 */
export async function getImageUrls(
    keysOrUrls: (string | undefined | null)[]
): Promise<string[]> {
    return Promise.all(keysOrUrls.map((key) => getImageUrl(key)));
}
