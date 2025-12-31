/**
 * Transform Plugin - Tap Utility
 * @module plugins/transform/composers/tap
 */

import type { SameTypeTransformer } from '../types';

/**
 * Tap into the transformation pipeline without changing the value
 *
 * Useful for debugging or side effects
 *
 * @param fn - Function to call with the value
 *
 * @example
 * ```typescript
 * const transform = pipe(
 *   (s: string) => s.trim(),
 *   tap((s) => console.log('After trim:', s)),
 *   (s: string) => s.toUpperCase(),
 *   tap((s) => console.log('After uppercase:', s))
 * );
 * ```
 */
export function tap<T>(fn: (value: T) => void): SameTypeTransformer<T> {
  return (value: T) => {
    fn(value);
    return value;
  };
}
