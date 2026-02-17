import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { authorizeRequest } from "@/lib/server/auth";
import {
    ALLOWED_IMAGE_TYPES,
    extensionFromMimeType,
    sanitizeFolder,
} from "@/lib/server/s3-validation";
import { getS3Config } from "@/lib/server/s3-config";

export async function POST(request: NextRequest) {
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

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folderInput = (formData.get("folder") as string) || "uploads";
        const folder = sanitizeFolder(folderInput);

        if (!file) {
            return NextResponse.json(
                { error: "File is required" },
                { status: 400 }
            );
        }
        if (!folder) {
            return NextResponse.json(
                { error: "Invalid folder value" },
                { status: 400 }
            );
        }

        // File validation
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size exceeds 10MB limit" },
                { status: 400 }
            );
        }

        if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
                { status: 400 }
            );
        }

        const extension = extensionFromMimeType(file.type);
        if (!extension) {
            return NextResponse.json(
                { error: "Unsupported image type" },
                { status: 400 }
            );
        }

        // Generate unique filename without trusting user-provided file names
        const key = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to S3
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            ACL: "public-read",
        });

        await s3.send(command);

        return NextResponse.json({
            success: true,
            key,
            url: s3Config.publicBaseUrl
                ? `${s3Config.publicBaseUrl}/${key}`
                : null,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
