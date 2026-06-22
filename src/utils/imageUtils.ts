/**
 * imageUtils.ts
 * 
 * Utility functions for image handling in the admin panel.
 * 
 * KEY TECHNIQUE: Images are converted to Base64 strings and stored in localStorage.
 * To prevent localStorage from filling up, images are resized (max 800px wide)
 * and compressed (JPEG quality 0.7) using an HTML <canvas> element before storage.
 * 
 * Usage:
 *   const base64 = await resizeAndConvertToBase64(file);
 *   // Store base64 string in product.image or heroSlide.image
 */

/**
 * Converts a File object to a compressed Base64 string.
 * Max width: 800px, JPEG quality: 0.7
 * Returns a promise that resolves with the Base64 data URL.
 */
export function resizeAndConvertToBase64(
  file: File,
  maxWidth = 800,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Scale down if wider than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generates a unique ID for products, orders, slides, etc.
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Formats price in Moroccan Dirham.
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString('ar-MA')} د.م`;
}
