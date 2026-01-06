/**
 * Format price with proper locale formatting
 * @param price - Price as number or string
 * @returns Formatted price string
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toLocaleString('en-US', { 
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
}
