import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authorizeRequest } from "@/lib/server/auth";
import { isValidS3Key } from "@/lib/server/s3-validation";
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

        const { key } = await request.json();

        if (!key || typeof key !== "string" || !isValidS3Key(key)) {
            return NextResponse.json(
                { error: "Valid key is required" },
                { status: 400 }
            );
        }

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Presign error:", error);
        return NextResponse.json(
            { error: "Failed to generate presigned URL" },
            { status: 500 }
        );
    }
}
