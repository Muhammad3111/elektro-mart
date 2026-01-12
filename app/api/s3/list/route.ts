import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

// Contabo S3 uchun endpoint formati
const getEndpoint = () => {
    const url = process.env.S3_URL || "";
    const bucketName = process.env.S3_BUCKET_NAME || "wwts";
    if (url.endsWith(`/${bucketName}`)) {
        return url.replace(`/${bucketName}`, "");
    }
    return url;
};

const s3 = new S3Client({
    region: process.env.S3_REGION || "eu",
    endpoint: getEndpoint(),
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "wwts";

const imageExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];
const videoExt = [".mp4", ".mov", ".webm", ".avi", ".mkv"];

export type S3ObjectInfo = {
    key: string;
    size: number;
    lastModified: string;
    type: "image" | "video" | "other";
    url?: string;
};

export async function GET(request: NextRequest) {
    try {
        // Auth tekshiruvi
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const prefix = searchParams.get("prefix") || "";
        const maxKeys = parseInt(searchParams.get("maxKeys") || "100");
        const continuationToken =
            searchParams.get("continuationToken") || undefined;

        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: prefix,
            ContinuationToken: continuationToken,
            MaxKeys: maxKeys,
        });

        const response = await s3.send(command);

        const objects: S3ObjectInfo[] = await Promise.all(
            (response.Contents || []).map(async (item) => {
                const key = item.Key || "";
                const ext = key.toLowerCase().split(".").pop() || "";

                let type: "image" | "video" | "other" = "other";
                if (imageExt.includes("." + ext)) type = "image";
                else if (videoExt.includes("." + ext)) type = "video";

                // Generate presigned URL for images
                let url: string | undefined;
                if (type === "image") {
                    try {
                        const getCommand = new GetObjectCommand({
                            Bucket: BUCKET_NAME,
                            Key: key,
                        });
                        url = await getSignedUrl(s3, getCommand, {
                            expiresIn: 3600,
                        });
                    } catch (error) {
                        console.error(
                            "Failed to generate presigned URL for:",
                            key,
                            error
                        );
                    }
                }

                return {
                    key,
                    size: item.Size || 0,
                    lastModified: item.LastModified?.toISOString() || "",
                    type,
                    url,
                };
            })
        );

        return NextResponse.json({
            objects,
            isTruncated: response.IsTruncated || false,
            nextContinuationToken: response.NextContinuationToken,
        });
    } catch (error) {
        console.error("List error:", error);
        return NextResponse.json(
            { error: "Failed to list objects", details: String(error) },
            { status: 500 }
        );
    }
}
