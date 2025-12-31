/**
 * Transform Plugin - Pipe Utility
 * @module plugins/transform/composers/pipe
 */

import type { SameTypeTransformer } from '../types';

/**
 * Left-to-right function pipeline
 *
 * Composes functions from left to right: pipe(f, g, h)(x) = h(g(f(x)))
 *
 * @example
 * ```typescript
 * const transform = pipe(
 *   (s: string) => s.slice(0, 10),
 *   (s: string) => s.trim(),
 *   (s: string) => s.toUpperCase()
 * );
 *
 * transform('  hello world  '); // 'HELLO WORL'
 * ```
 */
export function pipe<T>(...fns: SameTypeTransformer<T>[]): SameTypeTransformer<T> {
  if (fns.length === 0) {
    return (value: T) => value;
  }

  if (fns.length === 1) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return fns[0]!;
  }

  return (value: T) => fns.reduce((acc, fn) => fn(acc), value);
}
