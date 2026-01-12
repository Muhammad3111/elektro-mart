import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "./s3-client";

/**
 * Generate a presigned URL for accessing an S3 object
 * This URL will be valid for the specified duration
 */
export const getPresignedUrl = async (
    bucket: string,
    key: string,
    expiresIn: number = 3600 // 1 hour by default
): Promise<string> => {
    try {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const url = await getSignedUrl(s3, command, { expiresIn });
        return url;
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        throw error;
    }
};

/**
 * Get public URL for an S3 object (only works if bucket/object is public)
 */
export const getPublicUrl = (bucket: string, key: string): string => {
    const s3Url =
        process.env.NEXT_PUBLIC_S3_URL_IMAGE || process.env.S3_URL || "";
    const baseUrl = s3Url.replace(/\/$/, "");
    return `${baseUrl}/${key}`;
};
