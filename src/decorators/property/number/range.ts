/**
 * @Range Decorator
 * @module decorators/property/number/range
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates number is within range (inclusive)
 *
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Product {
 *   @IsNumber()
 *   @Range(0, 100)
 *   discountPercent: number;
 * }
 * ```
 */
export function Range(min: number, max: number): PropertyDecorator {
  return createPropertyDecorator((minimum: number, maximum: number) =>
    number().range(minimum, maximum),
  )(min, max);
}
