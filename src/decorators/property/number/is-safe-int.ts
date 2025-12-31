/**
 * @IsSafeInt Decorator
 * @module decorators/property/number/is-safe-int
 */

import { number } from '@validators/number';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that number is a safe integer
 * (between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER)
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Counter {
 *   @IsNumber()
 *   @IsSafeInt()
 *   count: number;
 * }
 * ```
 */
export function IsSafeInt(): PropertyDecorator {
  return createTypeDecorator(() => number().safeInteger())();
}
