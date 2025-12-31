/**
 * @Max Decorator
 * @module decorators/property/number/max
 */

import { number } from '@validators/number';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates maximum number value
 *
 * @param max - Maximum value (inclusive)
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class User {
 *   @IsNumber()
 *   @Max(150)
 *   age: number;
 * }
 * ```
 */
export function Max(max: number): PropertyDecorator {
  return createPropertyDecorator((maximum: number) => number().max(maximum))(max);
}
