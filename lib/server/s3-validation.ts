const FOLDER_PATTERN = /^[a-zA-Z0-9/_-]+$/;
const KEY_PATTERN = /^[a-zA-Z0-9/_\-.]+$/;

export const ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

export function sanitizeFolder(folder: string): string | null {
    const trimmed = folder.trim().replace(/^\/+|\/+$/g, "");
    const normalized = trimmed || "uploads";

    if (normalized.length > 120) {
        return null;
    }
    if (normalized.includes("..")) {
        return null;
    }
    if (!FOLDER_PATTERN.test(normalized)) {
        return null;
    }

    return normalized;
}

export function isValidS3Key(key: string): boolean {
    const normalized = key.trim();
    if (!normalized || normalized.length > 512) {
        return false;
    }
    if (normalized.startsWith("/")) {
        return false;
    }
    if (normalized.includes("..")) {
        return false;
    }
    if (!KEY_PATTERN.test(normalized)) {
        return false;
    }

    return true;
}

export function extensionFromMimeType(mimeType: string): string | null {
    switch (mimeType) {
        case "image/jpeg":
            return "jpg";
        case "image/png":
            return "png";
        case "image/webp":
            return "webp";
        case "image/gif":
            return "gif";
        default:
            return null;
    }
}
