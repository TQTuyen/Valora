/**
 * Transform Plugin - Conditional Transform Utility
 * @module plugins/transform/composers/when
 */

import type { SameTypeTransformer } from '../types';

/**
 * Conditional transformation
 *
 * Applies the transform only when the condition is met
 *
 * @param condition - Predicate function that determines if transform should be applied
 * @param transform - Transform function to apply when condition is true
 *
 * @example
 * ```typescript
 * const smartTruncate = when(
 *   (s: string) => s.length > 100,
 *   (s: string) => s.slice(0, 100) + '...'
 * );
 *
 * smartTruncate('short');           // 'short' (unchanged)
 * smartTruncate('a'.repeat(150));   // 'aaa...aaa...' (truncated)
 * ```
 */
export function when<T>(
  condition: (value: T) => boolean,
  transform: SameTypeTransformer<T>,
): SameTypeTransformer<T> {
  return (value: T) => {
    if (condition(value)) {
      return transform(value);
    }
    return value;
  };
}
