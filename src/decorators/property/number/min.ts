/**
 * @Min Decorator
 * @module decorators/property/number/min
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates minimum number value
 *
 * @param min - Minimum value (inclusive)
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Product {
 *   @IsNumber()
 *   @Min(0)
 *   price: number;
 * }
 * ```
 */
export function Min(min: number): PropertyDecorator {
  return createPropertyDecorator((minimum: number) => number().min(minimum))(min);
}
