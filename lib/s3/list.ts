import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "./s3-client";

const imageExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];
const videoExt = [".mp4", ".mov", ".webm", ".avi", ".mkv"];

export type S3ObjectInfo = {
  key: string;
  size: number;
  lastModified: string;
  type: "image" | "video" | "other";
};

export const listObjectsFromS3 = async (
  bucket: string,
  prefix: string = "",
  continuationToken?: string,
  maxKeys: number = 20
): Promise<{
  objects: S3ObjectInfo[];
  isTruncated: boolean;
  nextContinuationToken?: string;
}> => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
      MaxKeys: maxKeys,
    });

    const response = await s3.send(command);
    
    console.log("S3 Response:", response);
    console.log("Contents:", response.Contents);

    const objects =
      response.Contents?.map((item: any) => {
        const key = item.Key || "";
        const ext = key.toLowerCase().split(".").pop() || "";

        let type: "image" | "video" | "other" = "other";
        if (imageExt.includes("." + ext)) type = "image";
        else if (videoExt.includes("." + ext)) type = "video";

        return {
          key,
          size: item.Size || 0,
          lastModified: item.LastModified?.toISOString() || "",
          type,
        };
      }) || [];

    return {
      objects,
      isTruncated: response.IsTruncated || false,
      nextContinuationToken: response.NextContinuationToken,
    };
  } catch (error) {
    console.error("List error:", error);
    throw error;
  }
};
