/**
 * Environment configuration for API URLs.
 */

/**
 * Gets the API base URL based on environment.
 * In development, uses Vite proxy (relative URLs).
 * In production, uses the production backend URL.
 */
export function getApiBaseUrl(): string {
  // In development, use relative URLs (Vite proxy handles it)
  if (import.meta.env.DEV) {
    return '';
  }

  // In production, use the production backend URL
  const prodUrl = import.meta.env.VITE_API_URL || 'https://be-agency-order-courage.williamjonescodes.workers.dev';
  return prodUrl;
}
