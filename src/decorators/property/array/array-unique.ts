/**
 * @ArrayUnique Decorator
 * @module decorators/property/array/array-unique
 */

import { array } from '@validators/array';

import { createPropertyDecorator } from '../../core/factory';

import type { ValidationOptions } from '#types/index';

/**
 * Validates that all items in array are unique
 *
 * @decorator
 *
 * @example
 *
 * ```typescript
 * class Example {
 *   @ArrayUnique()
 *   items: any[];
 * }
 * ```
 */
export function ArrayUnique(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => array().unique(opts))(options);
}
