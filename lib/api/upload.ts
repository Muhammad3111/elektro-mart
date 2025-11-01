/**
 * Upload API Module
 * Fayl yuklash uchun API funksiyalari
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

/**
 * Rasm yuklash
 * @param file - Yuklanadigan fayl
 * @returns Upload natijasi (URL, filename, size)
 */
export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Upload failed" }));
    throw new Error(error.message || `Upload error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Ko'p rasmlarni yuklash
 * @param files - Yuklanadigan fayllar
 * @returns Upload natijalari
 */
export async function uploadImages(files: File[]): Promise<UploadResponse[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetch(`${API_URL}/upload/multiple`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Upload failed" }));
    throw new Error(error.message || `Upload error! status: ${response.status}`);
  }

  return response.json();
}
