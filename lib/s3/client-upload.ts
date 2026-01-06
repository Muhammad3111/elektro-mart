/**
 * Client-side S3 upload helper
 * Bu funksiya server-side API route orqali xavfsiz upload qiladi
 */

import { getToken } from "@/lib/api/auth";

interface UploadResult {
  success: boolean;
  key?: string;
  url?: string;
  error?: string;
}

/**
 * Xavfsiz fayl yuklash - server API orqali
 */
export async function uploadFile(
  file: File,
  folder: string = "uploads"
): Promise<UploadResult> {
  try {
    const token = getToken();
    if (!token) {
      return { success: false, error: "Unauthorized" };
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/s3/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Upload failed" };
    }

    return {
      success: true,
      key: data.key,
      url: data.url,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Upload failed" };
  }
}

/**
 * Xavfsiz fayl o'chirish - server API orqali
 */
export async function deleteFile(key: string): Promise<boolean> {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await fetch("/api/s3/delete", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    });

    return response.ok;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}
