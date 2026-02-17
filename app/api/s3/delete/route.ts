import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { authorizeRequest } from "@/lib/server/auth";
import { isValidS3Key } from "@/lib/server/s3-validation";
import { getS3Config } from "@/lib/server/s3-config";

export async function DELETE(request: NextRequest) {
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

        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });

        await s3.send(command);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
