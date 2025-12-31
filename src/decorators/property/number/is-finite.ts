/**
 * @IsFinite Decorator
 * @module decorators/property/number/is-finite
 */

import { number } from '@validators/number';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that number is finite (not Infinity or -Infinity)
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Calculation {
 *   @IsNumber()
 *   @IsFinite()
 *   result: number;
 * }
 * ```
 */
export function IsFinite(): PropertyDecorator {
  return createTypeDecorator(() => number().finite())();
}
