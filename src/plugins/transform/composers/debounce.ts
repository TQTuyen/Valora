/**
 * Transform Plugin - Debounce Utility
 * @module plugins/transform/composers/debounce
 */

import type { Transformer } from '../types';

/**
 * Debounce a transform (for async operations)
 *
 * Only executes after the specified delay since the last call
 *
 * @param transform - Transform to debounce
 * @param delayMs - Delay in milliseconds
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce(
 *   (query: string) => api.search(query),
 *   300
 * );
 * ```
 */
export function debounce<T, U>(
  transform: Transformer<T, U>,
  delayMs: number,
): Transformer<T, Promise<U>> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingResolves: ((value: U) => void)[] = [];

  return async (value: T) => {
    return new Promise<U>((resolve) => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      pendingResolves.push(resolve);

      timeoutId = setTimeout(() => {
        const result = transform(value);
        pendingResolves.forEach((res) => {
          res(result);
        });
        pendingResolves = [];
        timeoutId = null;
      }, delayMs);
    });
  };
}
