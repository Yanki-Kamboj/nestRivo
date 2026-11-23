const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
const apiOrigin = /^https?:\/\//i.test(apiBaseUrl) ? new URL(apiBaseUrl).origin : '';

export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (/^(https?:|data:|blob:)/i.test(imagePath)) return imagePath;
  return `${apiOrigin}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
}
