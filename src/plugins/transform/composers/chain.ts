/**
 * Transform Plugin - Chain Utility
 * @module plugins/transform/composers/chain
 */

import { pipe } from './pipe';

/**
 * Alias for pipe
 *
 * @example
 * ```typescript
 * const transform = chain(
 *   (s: string) => s.trim(),
 *   (s: string) => s.toLowerCase()
 * );
 * ```
 */
export const chain = pipe;
