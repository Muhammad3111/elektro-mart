/**
 * Get image URL from S3 key
 * If the value is already a full URL, return it as is
 * Otherwise, generate a presigned URL from the S3 key
 */

import { getPresignedUrl } from "./get-url";

const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET || "elektromart";

// Cache for presigned URLs to avoid regenerating them
const urlCache = new Map<string, { url: string; expiresAt: number }>();

export async function getImageUrl(keyOrUrl: string | undefined | null): Promise<string> {
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
    // Generate presigned URL (valid for 1 hour)
    const url = await getPresignedUrl(BUCKET_NAME, keyOrUrl, 3600);
    
    // Cache it (expires in 50 minutes to be safe)
    urlCache.set(keyOrUrl, {
      url,
      expiresAt: Date.now() + 50 * 60 * 1000,
    });
    
    return url;
  } catch (error) {
    console.error("Failed to generate presigned URL for:", keyOrUrl, error);
    return "";
  }
}

/**
 * Get multiple image URLs from S3 keys
 */
export async function getImageUrls(keysOrUrls: (string | undefined | null)[]): Promise<string[]> {
  return Promise.all(keysOrUrls.map(key => getImageUrl(key)));
}
