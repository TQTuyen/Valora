/**
 * Transform Plugin - Attempt Utility
 * @module plugins/transform/composers/attempt
 */

import type { Transformer } from '../types';

/**
 * Try multiple transforms, return first successful
 *
 * Attempts each transform in order, returning the result of the first one that doesn't throw.
 * If all transforms fail, throws the last error.
 *
 * @param transforms - Array of transforms to attempt
 *
 * @example
 * ```typescript
 * const parseNumber = attempt(
 *   (s: string) => parseInt(s, 10),
 *   (s: string) => parseFloat(s),
 *   () => 0  // fallback
 * );
 *
 * parseNumber('42');    // 42
 * parseNumber('3.14');  // 3.14
 * parseNumber('invalid'); // 0
 * ```
 */
export function attempt<T, U>(...transforms: Transformer<T, U>[]): Transformer<T, U> {
  return (value: T) => {
    let lastError: Error | null = null;

    for (const transform of transforms) {
      try {
        return transform(value);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    // If all transforms failed, throw the last error
    if (lastError) {
      throw lastError;
    }

    // This should never happen unless transforms is empty
    throw new Error('No transforms provided to attempt()');
  };
}
