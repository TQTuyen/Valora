/**
 * @IsMultipleOf Decorator
 * @module decorators/property/number/is-multiple-of
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates that number is a multiple of the given factor
 *
 * @param factor - The number must be divisible by this factor
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Grid {
 *   @IsNumber()
 *   @IsMultipleOf(5)
 *   spacing: number; // Must be divisible by 5
 * }
 * ```
 */
export function IsMultipleOf(factor: number): PropertyDecorator {
  return createPropertyDecorator((f: number) => number().multipleOf(f))(factor);
}
