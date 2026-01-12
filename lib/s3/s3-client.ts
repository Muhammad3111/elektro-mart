import { S3Client } from "@aws-sdk/client-s3";

/**
 * S3 Client - Server-side only!
 * Bu client faqat server tomonida ishlatilishi kerak.
 * Client-side uchun /api/s3/* endpointlaridan foydalaning.
 *
 * @deprecated Client-side'da ishlatmang! API routes orqali foydalaning.
 */

// Contabo S3 uchun endpoint formati: https://eu2.contabostorage.com
// Bucket nomi endpointga qo'shilmaydi, alohida Bucket parametrida beriladi
const getEndpoint = () => {
    const url = process.env.S3_URL || "";
    // Agar URL bucket nomini o'z ichiga olsa, uni olib tashlaymiz
    // https://eu2.contabostorage.com/wwts -> https://eu2.contabostorage.com
    const bucketName = process.env.S3_BUCKET_NAME || "wwts";
    if (url.endsWith(`/${bucketName}`)) {
        return url.replace(`/${bucketName}`, "");
    }
    return url;
};

export const s3 = new S3Client({
    region: process.env.S3_REGION || "eu",
    endpoint: getEndpoint(),
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true,
    tls: true,
});

/**
 * S3 Bucket nomi
 */
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "wwts";

/**
 * S3 Public URL - rasmlarni ko'rsatish uchun
 */
export const S3_PUBLIC_URL =
    process.env.NEXT_PUBLIC_S3_URL_IMAGE || process.env.S3_URL;
