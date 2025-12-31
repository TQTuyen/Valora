/**
 * Transform Plugin - Compose Utility
 * @module plugins/transform/composers/compose
 */

import type { SameTypeTransformer } from '../types';

/**
 * Right-to-left function composition
 *
 * Composes functions from right to left: compose(f, g, h)(x) = f(g(h(x)))
 *
 * @example
 * ```typescript
 * const transform = compose(
 *   (s: string) => s.toUpperCase(),
 *   (s: string) => s.trim(),
 *   (s: string) => s.slice(0, 10)
 * );
 *
 * transform('  hello world  '); // 'HELLO WORL'
 * ```
 */
export function compose<T>(...fns: SameTypeTransformer<T>[]): SameTypeTransformer<T> {
  if (fns.length === 0) {
    return (value: T) => value;
  }

  if (fns.length === 1) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return fns[0]!;
  }

  return (value: T) => fns.reduceRight((acc, fn) => fn(acc), value);
}
