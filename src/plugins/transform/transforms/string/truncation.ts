/**
 * Transform Plugin - String Truncation Transforms
 * @module plugins/transform/transforms/string/truncation
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Truncate to maximum length with optional suffix
 */
export function truncate(maxLength: number, suffix = '...'): SameTypeTransformer<string> {
  return (value: string) => {
    if (value.length <= maxLength) {
      return value;
    }
    const truncateAt = maxLength - suffix.length;
    return value.slice(0, Math.max(0, truncateAt)) + suffix;
  };
}
