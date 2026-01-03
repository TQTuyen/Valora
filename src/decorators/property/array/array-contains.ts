/**
 * @ArrayContains Decorator
 * @module decorators/property/array/array-contains
 */

import { array } from '@validators/array';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

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
export function ArrayContains(value: unknown, options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((val: unknown, opts?: ValidationOptions) =>
    array().contains(val, opts),
  )(value, options);
}
