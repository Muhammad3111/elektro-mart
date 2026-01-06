import { S3Client } from "@aws-sdk/client-s3";

/**
 * S3 Client - Server-side only!
 * Bu client faqat server tomonida ishlatilishi kerak.
 * Client-side uchun /api/s3/* endpointlaridan foydalaning.
 * 
 * @deprecated Client-side'da ishlatmang! API routes orqali foydalaning.
 */
export const s3 = new S3Client({
  region: process.env.S3_REGION || process.env.NEXT_PUBLIC_S3_REGION as string,
  endpoint: process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL as string,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY as string,
  },
  forcePathStyle: true,
  tls: true,
});

/**
 * S3 Public URL - rasmlarni ko'rsatish uchun
 */
export const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL || process.env.NEXT_PUBLIC_S3_URL_IMAGE;
