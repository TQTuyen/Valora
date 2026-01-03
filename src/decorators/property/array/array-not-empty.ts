/**
 * @ArrayNotEmpty Decorator
 * @module decorators/property/array/array-not-empty
 */

// eslint-disable-next-line simple-import-sort/imports
import { array } from '@validators/array';

import { createPropertyDecorator } from '../../core/factory';
import type { ValidationOptions } from '#types/index';

/**
 * Validates that array is not empty
 *
 * @decorator
 *
 * @example
 *
 * ```typescript
 * class Example {
 *   @ArrayNotEmpty()
 *   items: any[];
 * }
 * ```
 */
export function ArrayNotEmpty(options?: ValidationOptions): PropertyDecorator {
  return createPropertyDecorator((opts?: ValidationOptions) => array().nonEmpty(opts))(options);
}
