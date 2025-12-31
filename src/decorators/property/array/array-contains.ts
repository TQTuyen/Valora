/**
 * @ArrayContains Decorator
 * @module decorators/property/array/array-contains
 */

import { array } from '@validators/array';

import { createPropertyDecorator } from '../../core/factory';

/**
 * Validates that array contains a specific value
 *
 * @param value - Value that must be in the array
 * @decorator
 *
 * @example
 * ```typescript
 * @Validate()
 * class Config {
 *   @IsArray()
 *   @ArrayContains('production')
 *   environments: string[];
 * }
 * ```
 */
export function ArrayContains(value: unknown): PropertyDecorator {
  return createPropertyDecorator((val: unknown) => array().contains(val))(value);
}
