/**
 * Alternative S3 list implementation using fetch API
 * This is a fallback if AWS SDK has issues with XML parsing
 */

const imageExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];
const videoExt = [".mp4", ".mov", ".webm", ".avi", ".mkv"];

export type S3ObjectInfo = {
  key: string;
  size: number;
  lastModified: string;
  type: "image" | "video" | "other";
};

export const listObjectsFromS3Alternative = async (
  bucket: string,
  prefix: string = "",
  maxKeys: number = 100
): Promise<{
  objects: S3ObjectInfo[];
  isTruncated: boolean;
}> => {
  try {
    const s3Url = process.env.NEXT_PUBLIC_S3_URL;
    const accessKeyId = process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY;

    if (!s3Url || !accessKeyId || !secretAccessKey) {
      throw new Error("S3 credentials not configured");
    }

    // Build URL
    const url = new URL(`${s3Url}/${bucket}`);
    if (prefix) url.searchParams.set("prefix", prefix);
    url.searchParams.set("max-keys", maxKeys.toString());

    console.log("Fetching from URL:", url.toString());

    // Make request
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/xml",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log("XML Response:", xmlText);

    // Parse XML manually
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    // Check for parsing errors
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      throw new Error("XML parsing error");
    }

    // Extract contents
    const contents = xmlDoc.querySelectorAll("Contents");
    const objects: S3ObjectInfo[] = [];

    contents.forEach((content) => {
      const key = content.querySelector("Key")?.textContent || "";
      const sizeStr = content.querySelector("Size")?.textContent || "0";
      const lastModified = content.querySelector("LastModified")?.textContent || "";

      const ext = key.toLowerCase().split(".").pop() || "";
      let type: "image" | "video" | "other" = "other";
      if (imageExt.includes("." + ext)) type = "image";
      else if (videoExt.includes("." + ext)) type = "video";

      objects.push({
        key,
        size: parseInt(sizeStr, 10),
        lastModified,
        type,
      });
    });

    const isTruncated = xmlDoc.querySelector("IsTruncated")?.textContent === "true";

    console.log("Parsed objects:", objects);

    return {
      objects,
      isTruncated,
    };
  } catch (error) {
    console.error("List error:", error);
    throw error;
  }
};
