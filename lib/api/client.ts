/**
 * Base API Client
 * Barcha API so'rovlar uchun asosiy funksiya
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 sekund

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, unknown>;
  retries?: number;
}

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

/**
 * Delay helper
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * API request with retry logic
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { params, retries = 0, ...fetchOptions } = options;

  // Query params qo'shish
  let url = `${API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Array elementlarni categories[] formatida yuborish
        value.forEach((item) => {
          if (item !== undefined && item !== null) {
            searchParams.append(`${key}[]`, String(item));
          }
        });
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  }

  // Get auth token
  const token = getAuthToken();
  
  // Prepare headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Add Authorization header if token exists
  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Rate limiting - 429 status
    if (response.status === 429 && retries < MAX_RETRIES) {
      const retryAfter = response.headers.get('Retry-After');
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY * (retries + 1);
      await delay(waitTime);
      return apiRequest<T>(endpoint, { ...options, retries: retries + 1 });
    }

    // Server error - retry
    if (response.status >= 500 && retries < MAX_RETRIES) {
      await delay(RETRY_DELAY * (retries + 1));
      return apiRequest<T>(endpoint, { ...options, retries: retries + 1 });
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Network error - retry
    if (error instanceof TypeError && error.message === 'Failed to fetch' && retries < MAX_RETRIES) {
      await delay(RETRY_DELAY * (retries + 1));
      return apiRequest<T>(endpoint, { ...options, retries: retries + 1 });
    }
    throw error;
  }
}
