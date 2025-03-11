import { useAuth } from "../../context/AuthContext"; // Adjust the import path as needed

const API_BASE_URL = "http://localhost:3000";

// Default request options
const defaultOptions: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper to add auth token to requests
const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Base fetch function with error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Merge default headers with custom headers
  const headers = {
    ...defaultOptions.headers,
    ...options.headers,
    ...getAuthHeader(),
  };

  const config: RequestInit = {
    ...defaultOptions,
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // Handle API error responses
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Token is invalid or expired
        throw new Error(
          "Unauthorized: Token is invalid or expired. Try logging in again."
        );
      }
      throw new Error(data.message || `API error: ${response.status}`);
    }

    return data as T;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

/**
 * Convenience methods for different HTTP methods
 */
export const api = {
  get: <T>(endpoint: string, options: RequestInit = {}) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: any, options: RequestInit = {}) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: any, options: RequestInit = {}) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options: RequestInit = {}) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
