import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

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

export async function DELETE(request: NextRequest) {
    try {
        // Auth tekshiruvi
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { key } = await request.json();

        if (!key) {
            return NextResponse.json(
                { error: "Key is required" },
                { status: 400 }
            );
        }

        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME as string,
            Key: key,
        });

        await s3.send(command);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
