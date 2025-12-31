/**
 * Transform Plugin - Memoize Utility
 * @module plugins/transform/composers/memoize
 */

import type { Transformer } from '../types';

/**
 * Memoize a transform function
 *
 * Caches results based on the input value
 *
 * @param transform - Transform to memoize
 * @param keyFn - Optional function to generate cache key (defaults to String())
 *
 * @example
 * ```typescript
 * const expensiveTransform = memoize(
 *   (s: string) => {
 *     // Expensive computation
 *     return s.split('').reverse().join('');
 *   }
 * );
 * ```
 */
export function memoize<T, U>(
  transform: Transformer<T, U>,
  keyFn: (value: T) => string = String,
): Transformer<T, U> {
  const cache = new Map<string, U>();

  return (value: T) => {
    const key = keyFn(value);

    if (cache.has(key)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return cache.get(key)!;
    }

    const result = transform(value);
    cache.set(key, result);
    return result;
  };
}
