/**
 * Transform Plugin - Sequence Utility
 * @module plugins/transform/composers/sequence
 */

import type { SameTypeTransformer } from '../types';

/**
 * Execute transforms in sequence, but allow some to fail
 *
 * Unlike pipe(), this doesn't stop on errors. It continues with the original value
 * if a transform fails.
 *
 * @param transforms - Array of transforms to apply
 *
 * @example
 * ```typescript
 * const sanitize = sequence(
 *   (s: string) => s.trim(),
 *   (s: string) => s.toLowerCase(),
 *   (s: string) => s.replace(/[^a-z0-9]/g, '')  // might fail
 * );
 * ```
 */
export function sequence<T>(
  ...transforms: SameTypeTransformer<T>[]
): SameTypeTransformer<T> {
  return (value: T) => {
    let result = value;

    for (const transform of transforms) {
      try {
        result = transform(result);
      } catch {
        // Continue with current value on error
        continue;
      }
    }

    return result;
  };
}
