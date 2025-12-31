/**
 * @IsNumber Decorator
 * @module decorators/property/number/is-number
 */

import { number } from '@validators/number';

import { createTypeDecorator } from '../../core/factory';

/**
 * Validates that the value is a number
 *
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Product {
 *   @IsNumber()
 *   price: number;
 * }
 * ```
 */
export function IsNumber(): PropertyDecorator {
  return createTypeDecorator(() => number())();
}
