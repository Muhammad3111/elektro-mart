import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Contabo S3 uchun endpoint formati: https://eu2.contabostorage.com
// Bucket nomi endpointga qo'shilmaydi
const getEndpoint = () => {
    const url = process.env.S3_URL || "";
    const bucketName = process.env.S3_BUCKET_NAME || "wwts";
    if (url.endsWith(`/${bucketName}`)) {
        return url.replace(`/${bucketName}`, "");
    }
    return url;
};

// Server-side S3 client - credentials brauzerga ko'rinmaydi
const s3 = new S3Client({
    region: process.env.S3_REGION || "eu",
    endpoint: getEndpoint(),
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true,
});

export async function POST(request: NextRequest) {
    try {
        // Auth tekshiruvi
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "uploads";

        if (!file) {
            return NextResponse.json(
                { error: "File is required" },
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

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split(".").pop();
        const key = `${folder}/${timestamp}-${randomString}.${extension}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to S3
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            ACL: "public-read",
        });

        await s3.send(command);

        return NextResponse.json({
            success: true,
            key,
            url: `${process.env.NEXT_PUBLIC_S3_URL_IMAGE}/${key}`,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
