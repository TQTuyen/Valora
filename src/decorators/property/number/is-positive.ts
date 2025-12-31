/**
 * @IsPositive Decorator
 * @module decorators/property/number/is-positive
 */

import { number } from '@validators/number';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that number is positive (> 0)
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Product {
 *   @IsNumber()
 *   @IsPositive()
 *   price: number;
 * }
 * ```
 */
export function IsPositive(): PropertyDecorator {
  return createTypeDecorator(() => number().positive())();
}
