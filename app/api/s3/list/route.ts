import { NextRequest, NextResponse } from "next/server";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authorizeRequest } from "@/lib/server/auth";
import { isValidS3Key, sanitizeFolder } from "@/lib/server/s3-validation";
import { getS3Config } from "@/lib/server/s3-config";

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
        const s3Config = getS3Config();
        if (!s3Config.ok) {
            return NextResponse.json(
                { error: s3Config.error, missing: s3Config.missing },
                { status: 503 }
            );
        }
        const s3 = s3Config.client;
        const bucketName = s3Config.bucketName;

        const auth = await authorizeRequest(request, { requireAdmin: true });
        if (!auth.ok) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const { searchParams } = new URL(request.url);
        const prefixRaw = searchParams.get("prefix") || "";
        let prefix: string | undefined;
        if (prefixRaw) {
            const sanitizedPrefix = sanitizeFolder(prefixRaw);
            if (!sanitizedPrefix) {
                return NextResponse.json(
                    { error: "Invalid prefix value" },
                    { status: 400 }
                );
            }
            prefix = sanitizedPrefix;
        }

        const maxKeysParam = parseInt(searchParams.get("maxKeys") || "100", 10);
        const maxKeys = Number.isNaN(maxKeysParam)
            ? 100
            : Math.min(Math.max(maxKeysParam, 1), 200);
        const continuationToken =
            searchParams.get("continuationToken") || undefined;

        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: prefix,
            ContinuationToken: continuationToken,
            MaxKeys: maxKeys,
        });

        const response = await s3.send(command);

        const objects: S3ObjectInfo[] = await Promise.all(
            (response.Contents || []).map(async (item) => {
                const key = item.Key || "";
                if (!isValidS3Key(key)) {
                    return {
                        key: "",
                        size: 0,
                        lastModified: "",
                        type: "other" as const,
                    };
                }
                const ext = key.toLowerCase().split(".").pop() || "";

                let type: "image" | "video" | "other" = "other";
                if (imageExt.includes("." + ext)) type = "image";
                else if (videoExt.includes("." + ext)) type = "video";

                // Generate presigned URL for images
                let url: string | undefined;
                if (type === "image") {
                    try {
                        const getCommand = new GetObjectCommand({
                            Bucket: bucketName,
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

        const sanitizedObjects = objects.filter((item) => item.key);

        return NextResponse.json({
            objects: sanitizedObjects,
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
