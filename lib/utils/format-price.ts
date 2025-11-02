/**
 * Format price without decimal places
 * @param price - Price as number or string
 * @returns Formatted price string without .00
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toLocaleString('uz-UZ', { 
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });
}
