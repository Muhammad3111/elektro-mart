import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3-client";

export const deleteFromObjectStorage = async (
  bucket: string,
  key: string
) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await s3.send(command);
    console.log("🗑️ Delete successful!");
    return true;
  } catch (error) {
    console.error("❌ Delete error:", error);
    throw error;
  }
};
