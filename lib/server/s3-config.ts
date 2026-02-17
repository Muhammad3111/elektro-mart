import { S3Client } from "@aws-sdk/client-s3";

const REQUIRED_S3_ENV = [
    "S3_URL",
    "S3_REGION",
    "S3_BUCKET_NAME",
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
] as const;

type S3ConfigSuccess = {
    ok: true;
    client: S3Client;
    bucketName: string;
    publicBaseUrl: string | null;
};

type S3ConfigFailure = {
    ok: false;
    error: string;
    missing: string[];
};

export type S3ConfigResult = S3ConfigSuccess | S3ConfigFailure;

function normalizeEndpoint(url: string, bucketName: string): string {
    const trimmed = url.trim().replace(/\/+$/, "");
    if (trimmed.endsWith(`/${bucketName}`)) {
        return trimmed.slice(0, -(bucketName.length + 1));
    }
    return trimmed;
}

export function getS3Config(): S3ConfigResult {
    const missing = REQUIRED_S3_ENV.filter(
        (key) => !process.env[key] || !process.env[key]?.trim()
    );

    if (missing.length > 0) {
        return {
            ok: false,
            error: "S3 is not configured. Missing required environment variables.",
            missing,
        };
    }

    const bucketName = process.env.S3_BUCKET_NAME!.trim();
    const endpoint = normalizeEndpoint(process.env.S3_URL!.trim(), bucketName);
    const region = process.env.S3_REGION!.trim();

    try {
        new URL(endpoint);
    } catch {
        return {
            ok: false,
            error: "Invalid S3_URL format. Expected a full URL.",
            missing: [],
        };
    }

    const client = new S3Client({
        region,
        endpoint,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!.trim(),
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!.trim(),
        },
        forcePathStyle: true,
    });

    const publicBaseUrl = process.env.NEXT_PUBLIC_S3_URL_IMAGE?.trim() || null;

    return {
        ok: true,
        client,
        bucketName,
        publicBaseUrl,
    };
}
