export class CalcUtil {
  /**
   * Calculate discount percentage
   */
  static discountPercentage(oldPrice: number, newPrice: number): number {
    if (oldPrice <= 0) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  }

  /**
   * Calculate savings amount
   */
  static savings(oldPrice: number, newPrice: number): number {
    return Math.max(0, oldPrice - newPrice);
  }

  /**
   * Calculate CTR (Click-through rate)
   */
  static ctr(clicks: number, impressions: number): number {
    if (impressions === 0) return 0;
    return Number(((clicks / impressions) * 100).toFixed(2));
  }

  /**
   * Clamp a value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
