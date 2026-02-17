/**
 * Alternative S3 list implementation through internal API
 * Avoids exposing any storage credentials to the client.
 */

import { getToken } from "@/lib/api/auth";

const imageExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];
const videoExt = [".mp4", ".mov", ".webm", ".avi", ".mkv"];

export type S3ObjectInfo = {
  key: string;
  size: number;
  lastModified: string;
  type: "image" | "video" | "other";
};

export const listObjectsFromS3Alternative = async (
  // Kept for backward compatibility with previous signature
  _bucket: string,
  prefix: string = "",
  maxKeys: number = 100
): Promise<{
  objects: S3ObjectInfo[];
  isTruncated: boolean;
  nextContinuationToken?: string;
}> => {
  const token = getToken();
  if (!token) {
    throw new Error("Unauthorized");
  }

  const searchParams = new URLSearchParams();
  if (prefix) searchParams.set("prefix", prefix);
  searchParams.set("maxKeys", String(Math.min(Math.max(maxKeys, 1), 200)));

  const response = await fetch(`/api/s3/list?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to list objects" }));
    throw new Error(error.error || "Failed to list objects");
  }

  const data = (await response.json()) as {
    objects: S3ObjectInfo[];
    isTruncated: boolean;
    nextContinuationToken?: string;
  };

  const sanitizedObjects = (data.objects || []).map((item) => {
    const ext = item.key.toLowerCase().split(".").pop() || "";
    let type: "image" | "video" | "other" = "other";
    if (imageExt.includes(`.${ext}`)) type = "image";
    else if (videoExt.includes(`.${ext}`)) type = "video";

    return {
      ...item,
      type,
    };
  });

  return {
    objects: sanitizedObjects,
    isTruncated: data.isTruncated,
    nextContinuationToken: data.nextContinuationToken,
  };
};
